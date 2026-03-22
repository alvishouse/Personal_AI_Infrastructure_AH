#!/usr/bin/env bun

/**
 * Push LinkedIn Posts to Notion Content Database
 *
 * Creates entries in the Content DB for all LinkedIn posts in a workflow,
 * syncs post body content, and sets Campaign column on posts + existing images.
 *
 * Usage:
 *   bun run push-linkedin-posts-to-notion.ts --workflow-dir /path/to/workflow
 *   bun run push-linkedin-posts-to-notion.ts --workflow-dir /path/to/workflow --dry-run
 *
 * Databases:
 *   Content:        3030760eb0cd81c5874be6f7e9637807
 *   Content Images: 2733021756a1447d84a7143e2e9e97dd
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";

const NOTION_API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const CONTENT_DB = "3030760eb0cd81c5874be6f7e9637807";
const IMAGES_DB = "2733021756a1447d84a7143e2e9e97dd";

// --- CLI Args ---
const args = process.argv.slice(2);
const wdIdx = args.indexOf("--workflow-dir");
const workflowDir = wdIdx >= 0 ? args[wdIdx + 1] : null;
const dryRun = args.includes("--dry-run");

if (!workflowDir) {
  console.error("❌ Missing --workflow-dir argument");
  console.error("   Usage: bun run push-linkedin-posts-to-notion.ts --workflow-dir /path/to/workflow");
  process.exit(1);
}

if (!existsSync(workflowDir)) {
  console.error(`❌ Workflow directory not found: ${workflowDir}`);
  process.exit(1);
}

// --- Load API key ---
function loadNotionApiKey(): string {
  if (process.env.NOTION_API_KEY) return process.env.NOTION_API_KEY;

  const mcpPath = join(process.env.HOME!, ".claude", "mcpServers.json");
  if (existsSync(mcpPath)) {
    try {
      const cfg = JSON.parse(readFileSync(mcpPath, "utf-8"));
      if (cfg.mcpServers?.notion?.env?.NOTION_API_KEY) return cfg.mcpServers.notion.env.NOTION_API_KEY;
    } catch { /* fall through */ }
  }

  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  if (existsSync(credPath)) {
    try {
      const creds = JSON.parse(readFileSync(credPath, "utf-8"));
      if (creds.notion?.api_key) return creds.notion.api_key;
    } catch { /* fall through */ }
  }

  throw new Error("Notion API key not found.");
}

// --- Notion API helper ---
async function notionRequest(apiKey: string, endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = endpoint.startsWith("http") ? endpoint : `${NOTION_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Notion API ${response.status}: ${err.message || JSON.stringify(err)}`);
  }

  return response.json();
}

// --- Extract hook text (first content line after frontmatter) ---
function extractHook(content: string): string {
  const match = content.match(/^---\n[\s\S]*?\n---\n([\s\S]*)$/);
  if (!match) return "";
  const body = match[1];
  const firstLine = body.split("\n").find(l => l.trim() !== "");
  return firstLine?.trim() ?? "";
}

// --- Parse markdown frontmatter ---
function parseFrontmatter(content: string): { frontmatter: Record<string, string>; body: string; strategicNotes: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const frontmatter: Record<string, string> = {};

  if (match) {
    match[1].split("\n").forEach(line => {
      const kv = line.match(/^(\w+):\s*"?(.+?)"?$/);
      if (kv) frontmatter[kv[1]] = kv[2].replace(/^["']|["']$/g, "");
    });
    const fullBody = match[2].trim();

    // Split strategic notes from body
    const snMatch = fullBody.match(/^([\s\S]+?)---\nSTRATEGIC NOTES:\n([\s\S]+)$/);
    if (snMatch) {
      return { frontmatter, body: snMatch[1].trim(), strategicNotes: snMatch[2].trim() };
    }
    // Also handle SANDERS CHECK sections (strip from body)
    const sandersIdx = fullBody.indexOf("---\nSANDERS CHECK:");
    const strategicIdx = fullBody.indexOf("---\nSTRATEGIC NOTES:");
    const cutIdx = sandersIdx >= 0 ? sandersIdx : (strategicIdx >= 0 ? strategicIdx : -1);
    if (cutIdx >= 0) {
      return { frontmatter, body: fullBody.slice(0, cutIdx).trim(), strategicNotes: fullBody.slice(cutIdx).trim() };
    }
    return { frontmatter, body: fullBody, strategicNotes: "" };
  }

  return { frontmatter, body: content, strategicNotes: "" };
}

// --- Map format_type to LinkedIn Format enum ---
function mapLinkedInFormat(formatType?: string): string | undefined {
  if (!formatType) return undefined;
  const mapping: Record<string, string> = {
    "Authority Post": "Authority Post",
    "Authority Post (Credibility + Framework)": "Authority Post",
    "Authority Post (Stats)": "Authority Post",
    "Framework Post": "Framework Article",
    "Framework Article": "Framework Article",
    "Story Post": "Story",
    "Myth-Busting Post": "Mythbuster",
    "Myth Buster Post": "Mythbuster",
    "Case Study Post": "Proof",
    "Quick Win Post": "Proof",
    "Contrarian Take": "Credibility",
    "Contrarian Post": "Credibility",
  };
  return mapping[formatType] || "Authority Post";
}

// --- Map hook_type to Hook Type enum ---
function mapHookType(hookType?: string): string | undefined {
  if (!hookType) return undefined;
  if (hookType.includes("Contrarian")) return "Contrarian";
  if (hookType.includes("Statistic") || hookType.includes("Stats")) return "Statistic";
  if (hookType.includes("Story")) return "Story";
  if (hookType.includes("Bold") || hookType.includes("Claim")) return "Bold Statement";
  return "Bold Statement";
}

// --- Map funnel_position ---
function mapFunnelPosition(pos?: string): string | undefined {
  if (!pos) return undefined;
  const mapping: Record<string, string> = {
    "Top": "Awareness",
    "Middle": "Consideration",
    "Bottom": "Decision",
  };
  return mapping[pos] || "Awareness";
}

const LINKEDIN_ICON = "https://cdn-icons-png.flaticon.com/512/174/174857.png";

// --- Convert Linux path to Windows WSL ---
function linuxToWslUrl(p: string): string {
  return `file://wsl.localhost/Ubuntu/${p.replace(/^\//, "")}`;
}

// --- Markdown to Notion blocks (simplified) ---
function markdownToBlocks(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("# ")) {
      blocks.push({ object: "block", type: "heading_1", heading_1: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      i++; continue;
    }
    if (line.startsWith("## ")) {
      blocks.push({ object: "block", type: "heading_2", heading_2: { rich_text: [{ type: "text", text: { content: line.slice(3) } }] } });
      i++; continue;
    }
    if (line.startsWith("### ")) {
      blocks.push({ object: "block", type: "heading_3", heading_3: { rich_text: [{ type: "text", text: { content: line.slice(4) } }] } });
      i++; continue;
    }
    if (line === "---") {
      blocks.push({ object: "block", type: "divider", divider: {} });
      i++; continue;
    }
    if (line.startsWith("- ") || line.startsWith("→ ")) {
      blocks.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: [{ type: "text", text: { content: line.slice(2) } }] } });
      i++; continue;
    }
    if (line.match(/^\d+\/ /)) {
      blocks.push({ object: "block", type: "numbered_list_item", numbered_list_item: { rich_text: [{ type: "text", text: { content: line.replace(/^\d+\/ /, "") } }] } });
      i++; continue;
    }
    if (line.trim() !== "") {
      let para = line;
      while (i + 1 < lines.length && lines[i + 1].trim() !== "" && !lines[i + 1].match(/^(#|##|###|---|→|-|\d+\/)/)) {
        i++;
        para += "\n" + lines[i];
      }
      // Parse bold
      const richText = parseBold(para);
      blocks.push({ object: "block", type: "paragraph", paragraph: { rich_text: richText } });
    }
    i++;
  }

  return blocks;
}

function parseBold(text: string): any[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  return parts.filter(p => p.length > 0).map(p => {
    if (p.startsWith("**") && p.endsWith("**")) {
      return { type: "text", text: { content: p.slice(2, -2) }, annotations: { bold: true } };
    }
    return { type: "text", text: { content: p } };
  });
}

// --- Create Content DB entry ---
async function createContentEntry(
  apiKey: string,
  postName: string,
  frontmatter: Record<string, string>,
  filePath: string,
  workflowNotionId: string,
  campaign: string,
  strategicNotes: string,
): Promise<string> {
  const properties: Record<string, any> = {
    "Content Name": { title: [{ text: { content: postName } }] },
    "Content Type": { select: { name: "LinkedIn Post" } },
    "Platform": { select: { name: "LinkedIn" } },
    "Status": { status: { name: "In Progress" } },
    "Local File Path": { url: linuxToWslUrl(filePath) },
    "Workflow": { relation: [{ id: workflowNotionId }] },
    // Campaign column — if it doesn't exist in DB, this will be silently ignored
    "Campaign": { select: { name: campaign } },
  };

  const linkedInFormat = mapLinkedInFormat(frontmatter.format_type);
  if (linkedInFormat) properties["LinkedIn Format"] = { select: { name: linkedInFormat } };

  if (frontmatter.word_count) properties["Word Count"] = { number: parseInt(frontmatter.word_count) };
  if (frontmatter.posting_order) properties["Posting Priority"] = { number: parseInt(frontmatter.posting_order) };

  const hookType = mapHookType(frontmatter.hook_type);
  if (hookType) properties["Hook Type"] = { select: { name: hookType } };

  const funnelPos = mapFunnelPosition(frontmatter.funnel_position);
  if (funnelPos) properties["Funnel Position"] = { select: { name: funnelPos } };

  if (frontmatter.estimated_read_time) {
    const mins = parseInt(frontmatter.estimated_read_time);
    if (!isNaN(mins)) properties["Estimated Read Time"] = { number: mins };
  }

  if (strategicNotes) {
    properties["Strategic Notes"] = { rich_text: [{ text: { content: strategicNotes.substring(0, 2000) } }] };
  }

  const page = await notionRequest(apiKey, "/pages", {
    method: "POST",
    body: JSON.stringify({ parent: { type: "database_id", database_id: CONTENT_DB }, icon: { type: "external", external: { url: LINKEDIN_ICON } }, properties }),
  });

  return page.id;
}

// --- Sync body content to existing Notion page ---
async function syncBody(apiKey: string, pageId: string, body: string, strategicNotes: string, filePath: string): Promise<void> {
  // Clear existing blocks
  const blocksRes = await notionRequest(apiKey, `/blocks/${pageId}/children`);
  for (const block of (blocksRes.results || [])) {
    try {
      await notionRequest(apiKey, `/blocks/${block.id}`, { method: "DELETE" });
    } catch { /* ignore delete failures */ }
  }

  // Build body content
  const fullContent = [
    "# Post Content",
    "",
    body,
    "",
    "---",
    "",
    "## Strategic Notes",
    "",
    strategicNotes || "No strategic notes.",
    "",
    "---",
    "",
    "## Source",
    "",
    `**PAI File:** \`${filePath}\``,
    `**Last Synced:** ${new Date().toISOString().split("T")[0]}`,
  ].join("\n");

  const blocks = markdownToBlocks(fullContent);
  const BATCH = 100;
  for (let i = 0; i < blocks.length; i += BATCH) {
    await notionRequest(apiKey, `/blocks/${pageId}/children`, {
      method: "PATCH",
      body: JSON.stringify({ children: blocks.slice(i, i + BATCH) }),
    });
    if (i + BATCH < blocks.length) await new Promise(r => setTimeout(r, 300));
  }
}

// --- Update existing image entries with Campaign column ---
async function updateImageCampaign(apiKey: string, notionId: string, campaign: string, postName: string): Promise<void> {
  await notionRequest(apiKey, `/pages/${notionId}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        "Campaign": { select: { name: campaign } },
      },
    }),
  });
}

// --- Update post markdown file frontmatter with notion_id ---
function updateFileFrontmatter(filePath: string, notionId: string, notionUrl: string): void {
  const content = readFileSync(filePath, "utf-8");
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) return;

  const existingYaml = match[1];
  const body = match[2];

  // Remove old notion fields if present
  const cleanedYaml = existingYaml
    .split("\n")
    .filter(l => !l.startsWith("notion_id:") && !l.startsWith("notion_url:") && !l.startsWith("last_synced:"))
    .join("\n");

  const newYaml = `${cleanedYaml}\nnotion_id: "${notionId}"\nnotion_url: "${notionUrl}"\nlast_synced: "${new Date().toISOString().split("T")[0]}"`;
  writeFileSync(filePath, `---\n${newYaml}\n---\n${body}`);
}

// --- Main ---
async function main() {
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║  LinkedIn Posts → Notion Content DB                          ║");
  console.log("╚══════════════════════════════════════════════════════════════╝\n");
  if (dryRun) console.log("🔍 DRY RUN — no changes will be made\n");

  // Load metadata
  const metadataPath = join(workflowDir, "metadata.json");
  if (!existsSync(metadataPath)) { console.error(`❌ metadata.json not found: ${metadataPath}`); process.exit(1); }

  const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
  const workflowId: string = metadata.workflow_id;
  const workflowNotionId: string = metadata.notion?.workflow_id;
  const campaign = workflowId; // Use workflow ID as campaign tag

  console.log(`📋 Workflow:  ${workflowId}`);
  console.log(`📝 Topic:     ${metadata.topic}`);
  console.log(`🔗 Notion WF: ${workflowNotionId ?? "⚠️  MISSING — check metadata.json"}`);
  console.log(`🏷️  Campaign:  ${campaign}\n`);

  if (!workflowNotionId) { console.error("❌ No notion.workflow_id in metadata.json. Run Notion sync first."); process.exit(1); }

  // Load API key
  let apiKey: string;
  try { apiKey = loadNotionApiKey(); }
  catch (err) { console.error(`❌ ${err}`); process.exit(1); }

  // Find posts
  const postsDir = join(workflowDir, "13-extracted-content", "linkedin", "posts");
  if (!existsSync(postsDir)) { console.error(`❌ Posts directory not found: ${postsDir}`); process.exit(1); }

  const fsAsync = await import("fs/promises");
  const postFiles = (await fsAsync.readdir(postsDir)).filter(f => f.endsWith(".md")).sort();

  console.log(`📁 Found ${postFiles.length} LinkedIn posts\n`);

  // Load image Notion IDs from metadata (needed for linking in Phase 1)
  const imageEntries: Array<{ file: string; notion_id: string }> = metadata.checkpoints?.["step-13b"]?.notion_image_ids ?? [];

  // ── Phase 1: Create / sync Content DB entries ──
  console.log("── Phase 1: Push post text to Notion Content DB ──\n");

  const postResults: { file: string; notionId: string | null; error?: string }[] = [];

  for (const filename of postFiles) {
    const filePath = join(postsDir, filename);
    const content = readFileSync(filePath, "utf-8");
    const { frontmatter, body, strategicNotes } = parseFrontmatter(content);

    // Build display name
    const formatMap: Record<string, string> = {
      "01-authority-post.md": "Authority Post",
      "02-framework-article.md": "DARI Framework Article",
      "03-story-post.md": "Story Post",
      "04-myth-buster-post.md": "Myth-Buster Post",
      "05-quick-win-1.md": "Quick Win: Flow Bridge Test",
      "06-quick-win-2.md": "Quick Win: Drift Monitoring",
      "07-case-study-post.md": "Case Study Post",
      "08-contrarian-take.md": "Contrarian Take",
    };
    // Use hook text (first line of post) as Content Name — more descriptive than format label
    const hookText = extractHook(content);
    const postName = hookText || formatMap[filename] || filename;

    process.stdout.write(`→ ${filename} (${frontmatter.format_type ?? "Unknown"})... `);

    if (dryRun) {
      console.log(`[DRY RUN] Would create: "${postName}"`);
      postResults.push({ file: filename, notionId: "dry-run" });
      continue;
    }

    // Check if already synced (notion_id in frontmatter)
    if (frontmatter.notion_id) {
      process.stdout.write(`already synced — re-syncing body + images... `);
      try {
        await syncBody(apiKey, frontmatter.notion_id, body, strategicNotes, filePath);
        // Re-link images (handles new infographics added after initial push)
        const postNum = filename.match(/(\d+)/)?.[1];
        const matchedImages = imageEntries.filter(img => img.file.match(/(\d+)/)?.[1] === postNum);
        if (matchedImages.length > 0) {
          await notionRequest(apiKey, `/pages/${frontmatter.notion_id}`, {
            method: "PATCH",
            body: JSON.stringify({ properties: { "Images": { relation: matchedImages.map(img => ({ id: img.notion_id })) } } }),
          });
          process.stdout.write(`linked ${matchedImages.length} image(s) → `);
        }
        console.log(`✅`);
        postResults.push({ file: filename, notionId: frontmatter.notion_id });
      } catch (err) {
        console.error(`\n  ❌ Body sync failed: ${err}`);
        postResults.push({ file: filename, notionId: null, error: String(err) });
      }
      continue;
    }

    try {
      // Create entry
      const pageId = await createContentEntry(apiKey, postName, frontmatter, filePath, workflowNotionId, campaign, strategicNotes);
      const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, "")}`;

      // Sync body
      process.stdout.write(`created → syncing body... `);
      await syncBody(apiKey, pageId, body, strategicNotes, filePath);

      // Link ALL matching images (artwork + infographics + GIFs)
      // Match by leading number regardless of prefix — "01-post.md" and "post-01-art.png" both yield "01"
      const postNum = filename.match(/(\d+)/)?.[1];
      const matchedImages = imageEntries.filter(img => img.file.match(/(\d+)/)?.[1] === postNum);
      if (matchedImages.length > 0) {
        await notionRequest(apiKey, `/pages/${pageId}`, {
          method: "PATCH",
          body: JSON.stringify({ properties: { "Images": { relation: matchedImages.map(img => ({ id: img.notion_id })) } } }),
        });
        process.stdout.write(`linked ${matchedImages.length} image(s) → `);
      } else if (imageEntries.length > 0) {
        process.stdout.write(`⚠️  no image match for ${filename} → `);
      }

      // Update file frontmatter
      updateFileFrontmatter(filePath, pageId, notionUrl);

      console.log(`✅\n  🔗 ${notionUrl}`);
      postResults.push({ file: filename, notionId: pageId });
    } catch (err) {
      console.error(`\n  ❌ ${err}`);
      postResults.push({ file: filename, notionId: null, error: String(err) });
    }
  }

  // ── Phase 2: Add Campaign to existing image entries ──
  if (imageEntries.length > 0) {
    console.log(`\n── Phase 2: Add Campaign column to ${imageEntries.length} existing images ──\n`);

    for (const img of imageEntries) {
      process.stdout.write(`→ ${img.file}... `);

      if (dryRun) {
        console.log(`[DRY RUN] Would set Campaign="${campaign}"`);
        continue;
      }

      try {
        await updateImageCampaign(apiKey, img.notion_id, campaign, img.file);
        console.log("✅");
      } catch (err) {
        console.error(`\n  ❌ ${err}`);
      }
    }
  } else {
    console.log("\n⚠️  No image Notion IDs found in metadata.json step-13b — skipping image Campaign update");
  }

  // ── Summary ──
  const ok = postResults.filter(r => r.notionId && r.notionId !== "dry-run").length;
  const fail = postResults.filter(r => !r.notionId || r.error).length;

  console.log("\n" + "─".repeat(62));
  console.log(`Posts synced: ${ok}  ❌ Failed: ${fail}  📁 Total: ${postResults.length}`);

  if (!dryRun && ok > 0) {
    console.log("\n🔍 Review posts in Notion Content DB:");
    console.log("   https://www.notion.so/3030760eb0cd81c5874be6f7e9637807");
    console.log("\n🔍 Review images in Notion Images DB:");
    console.log("   https://www.notion.so/2733021756a1447d84a7143e2e9e97dd");
  }
}

main().catch(err => { console.error("❌ Fatal:", err); process.exit(1); });
