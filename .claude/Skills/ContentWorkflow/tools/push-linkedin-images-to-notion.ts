#!/usr/bin/env bun

/**
 * Push LinkedIn Images DIRECTLY to Notion Content Images Database
 *
 * Uploads image binaries directly to Notion using the File Upload API,
 * then creates a database entry with the image visible for review.
 *
 * NO WordPress intermediary — images are hosted by Notion.
 *
 * Usage:
 *   bun run push-linkedin-images-to-notion.ts --workflow-dir /path/to/workflow
 *   bun run push-linkedin-images-to-notion.ts --workflow-dir /path/to/workflow --dry-run
 *
 * Database: Content Images (2733021756a1447d84a7143e2e9e97dd)
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, basename } from "path";

// --- Config ---
const NOTION_API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const IMAGES_DB = "2733021756a1447d84a7143e2e9e97dd";
const IMAGES_REVIEW_URL = "https://www.notion.so/2733021756a1447d84a7143e2e9e97dd?v=fa8b79c2671347d69859aa99a67da0e4";

// --- CLI Args ---
const args = process.argv.slice(2);
const workflowDirIdx = args.indexOf("--workflow-dir");
const workflowDir = workflowDirIdx >= 0 ? args[workflowDirIdx + 1] : null;
const dryRun = args.includes("--dry-run");

if (!workflowDir) {
  console.error("❌ Missing --workflow-dir argument");
  console.error("   Usage: bun run push-linkedin-images-to-notion.ts --workflow-dir /path/to/workflow");
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
      if (cfg.mcpServers?.notion?.env?.NOTION_API_KEY) {
        return cfg.mcpServers.notion.env.NOTION_API_KEY;
      }
    } catch { /* fall through */ }
  }

  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  if (existsSync(credPath)) {
    try {
      const creds = JSON.parse(readFileSync(credPath, "utf-8"));
      if (creds.notion?.api_key) return creds.notion.api_key;
    } catch { /* fall through */ }
  }

  throw new Error("Notion API key not found. Set NOTION_API_KEY env var or add to ~/.claude/mcpServers.json");
}

// --- Notion API helpers ---
async function notionRequest(apiKey: string, endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `${NOTION_API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(`Notion API ${response.status}: ${err.message || JSON.stringify(err)}`);
  }

  return response.json();
}

/**
 * Upload an image file directly to Notion using the File Upload API.
 *
 * Two-step flow (confirmed working):
 * 1. POST JSON to /v1/file_uploads → declares filename + content_type → returns { id, upload_url }
 * 2. POST multipart to upload_url (/v1/file_uploads/{id}/send) → status becomes "uploaded"
 * 3. Reference in image blocks as { type: "file_upload", file_upload: { id } }
 */
async function uploadImageToNotion(apiKey: string, filePath: string): Promise<{ url: string; uploadId?: string }> {
  const fileBytes = Bun.file(filePath);
  const buffer = await fileBytes.arrayBuffer();
  const filename = basename(filePath);
  const contentType = filename.endsWith(".png") ? "image/png" : "image/jpeg";

  // Two-step upload:
  // Step 1 — Declare upload intent with JSON so Notion registers the MIME type correctly
  const intentResponse = await fetch(`${NOTION_API_URL}/file_uploads`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      filename: filename,
      content_type: contentType,
    }),
  });

  if (!intentResponse.ok) {
    const err = await intentResponse.json().catch(() => ({ message: intentResponse.statusText }));
    throw new Error(`Upload intent failed ${intentResponse.status}: ${err.message || JSON.stringify(err)}`);
  }

  const intent = await intentResponse.json();
  // intent shape: { id, upload_url (/send endpoint), expiry_time, status: "pending" }
  const uploadId = intent.id as string;
  const uploadUrl = intent.upload_url as string; // e.g. /v1/file_uploads/{id}/send

  // Step 2: POST multipart to the /send endpoint (requires Notion auth headers)
  const form = new FormData();
  form.append("file", new File([buffer], filename, { type: contentType }));

  const sendResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      // Do NOT set Content-Type — let runtime set it with the multipart boundary
    },
    body: form,
  });

  if (!sendResponse.ok) {
    const err = await sendResponse.json().catch(() => ({ message: sendResponse.statusText }));
    throw new Error(`Upload send failed ${sendResponse.status}: ${err.message || JSON.stringify(err)}`);
  }

  const sent = await sendResponse.json();
  if (sent.status !== "uploaded") {
    throw new Error(`Unexpected upload status after send: ${sent.status}`);
  }

  return { url: `notion://file_upload/${uploadId}`, uploadId };
}

/**
 * Create a page in the Notion Images database with the image visible.
 *
 * Properties stored in the database row + image block in page body for preview.
 */
async function createNotionImagePage(
  apiKey: string,
  imageFile: string,
  imageUrl: string,
  meta: {
    imageName: string;
    imageId: string;
    postType: string;
    tags: string[];
    prompt: string;
    altText: string;
    workflowId: string;
    workflowNotionId?: string;
  }
): Promise<string> {
  const isNotionHosted = !imageUrl.startsWith("notion://file_upload/");

  // Build image block — external URL for Notion-hosted, reference for upload ID
  const imageBlock = isNotionHosted
    ? {
        object: "block",
        type: "image",
        image: {
          type: "external",
          external: { url: imageUrl },
          caption: [{ type: "text", text: { content: meta.altText } }],
        },
      }
    : null; // If upload returned an ID, Notion will handle it differently

  // Build file_upload reference for image type block (newer API variant)
  const uploadId = !isNotionHosted
    ? imageUrl.replace("notion://file_upload/", "")
    : null;

  const imageBlockFinal = uploadId
    ? {
        object: "block",
        type: "image",
        image: {
          type: "file_upload",
          file_upload: { id: uploadId },
          caption: [{ type: "text", text: { content: meta.altText } }],
        },
      }
    : imageBlock;

  // Database properties
  const properties: Record<string, any> = {
    "Image Name": {
      title: [{ text: { content: meta.imageName } }],
    },
    "Image ID": {
      rich_text: [{ text: { content: meta.imageId } }],
    },
    "File Name": {
      rich_text: [{ text: { content: imageFile } }],
    },
    "Image Type": {
      select: { name: "Social" },
    },
    "Model": {
      select: { name: "ulart-v1" },
    },
    "Style": {
      select: { name: "Modern Alchemist" },
    },
    "Aspect Ratio": {
      select: { name: "1:1" },
    },
    "Resolution": {
      rich_text: [{ text: { content: "1200x1200" } }],
    },
    "Status": {
      select: { name: "Generated" },
    },
    ...(meta.prompt && {
      "Prompt": {
        rich_text: [{ text: { content: meta.prompt.substring(0, 2000) } }],
      },
    }),
    ...(meta.altText && {
      "Alt Text": {
        rich_text: [{ text: { content: meta.altText } }],
      },
    }),
    ...(meta.tags.length > 0 && {
      "Tags": {
        multi_select: meta.tags.map(t => ({ name: t })),
      },
    }),
    ...(meta.workflowNotionId && {
      "Workflow": {
        relation: [{ id: meta.workflowNotionId }],
      },
    }),
  };

  // If URL is accessible, also store it
  if (isNotionHosted) {
    properties["File Path"] = { url: imageUrl };
  }

  const pageBody: any = {
    parent: { type: "database_id", database_id: IMAGES_DB },
    properties,
  };

  // Set page cover to the image if we have a URL
  if (isNotionHosted) {
    pageBody.cover = { type: "external", external: { url: imageUrl } };
  }

  // Create page
  const page = await notionRequest(apiKey, "/pages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pageBody),
  });

  // Add image block to page body for inline preview
  if (imageBlockFinal) {
    try {
      await notionRequest(apiKey, `/blocks/${page.id}/children`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          children: [
            imageBlockFinal,
            {
              object: "block",
              type: "paragraph",
              paragraph: {
                rich_text: [
                  { type: "text", text: { content: `Post Type: ${meta.postType}   |   Workflow: ${meta.workflowId}` } },
                ],
              },
            },
          ],
        }),
      });
    } catch (blockErr) {
      console.warn(`  ⚠️  Could not add image block to page body: ${blockErr}`);
    }
  }

  return page.id;
}

// --- Post type metadata map ---
const POST_TYPE_MAP: Record<string, { displayName: string; tags: string[]; priority: number }> = {
  "post-01": { displayName: "Authority Post",    tags: ["LinkedIn", "Authority Post",    "Priority 1"], priority: 1 },
  "post-02": { displayName: "Framework Article", tags: ["LinkedIn", "Framework Article", "Priority 1"], priority: 1 },
  "post-03": { displayName: "Story Post",        tags: ["LinkedIn", "Story Post",        "Priority 2"], priority: 2 },
  "post-04": { displayName: "Myth-Buster",       tags: ["LinkedIn", "Myth-Buster",       "Priority 2"], priority: 2 },
  "post-05": { displayName: "Quick Win 1",       tags: ["LinkedIn", "Quick Win",         "Priority 2"], priority: 2 },
  "post-06": { displayName: "Quick Win 2",       tags: ["LinkedIn", "Quick Win",         "Priority 2"], priority: 2 },
  "post-07": { displayName: "Case Study",        tags: ["LinkedIn", "Case Study",        "Priority 2"], priority: 2 },
  "post-08": { displayName: "Contrarian Take",   tags: ["LinkedIn", "Contrarian Take",   "Priority 2"], priority: 2 },
};

function getPostKey(filename: string): string | null {
  const match = filename.match(/^(post-\d+)/);
  return match ? match[1] : null;
}

// --- Main ---
async function main() {
  console.log("🖼️  LinkedIn Images → Notion (Direct File Upload)\n");
  if (dryRun) console.log("🔍 DRY RUN — no files will be uploaded\n");

  // Load metadata
  const metadataPath = join(workflowDir, "metadata.json");
  if (!existsSync(metadataPath)) {
    console.error(`❌ metadata.json not found: ${metadataPath}`);
    process.exit(1);
  }

  const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));
  const workflowId = metadata.workflow_id as string;
  const workflowNotionId = metadata.notion?.workflow_id as string | undefined;
  const topic = metadata.topic as string;

  console.log(`📋 Workflow:  ${workflowId}`);
  console.log(`📝 Topic:     ${topic}`);
  console.log(`🔗 Linked to: ${workflowNotionId ?? "⚠️  No Notion workflow ID found"}`);
  console.log();

  // Load API key
  let apiKey: string;
  try {
    apiKey = loadNotionApiKey();
  } catch (err) {
    console.error(`❌ ${err}`);
    process.exit(1);
  }

  // Find images
  const imagesDir = join(workflowDir, "13-extracted-content", "linkedin", "images");
  if (!existsSync(imagesDir)) {
    console.error(`❌ Images directory not found: ${imagesDir}`);
    console.error("   Run Step 13b image generation first.");
    process.exit(1);
  }

  const fsAsync = await import("fs/promises");
  const imageFiles = (await fsAsync.readdir(imagesDir))
    .filter(f => f.match(/\.(png|jpg|jpeg|webp)$/i))
    .sort();

  if (imageFiles.length === 0) {
    console.error("❌ No image files found in linkedin/images/");
    process.exit(1);
  }

  console.log(`📁 ${imageFiles.length} image(s) found: ${imageFiles.join(", ")}\n`);

  // Load prompt manifest if exists
  const manifestPath = join(imagesDir, "prompts.json");
  let prompts: Record<string, string> = {};
  if (existsSync(manifestPath)) {
    try {
      prompts = JSON.parse(readFileSync(manifestPath, "utf-8"));
    } catch { /* ignore */ }
  }

  // Process each image
  const results: { file: string; notionId: string | null; notionUrl?: string; error?: string }[] = [];

  for (const filename of imageFiles) {
    const filePath = join(imagesDir, filename);
    const postKey = getPostKey(filename);
    const postMeta = postKey ? POST_TYPE_MAP[postKey] : null;
    const displayName = postMeta?.displayName ?? basename(filename, ".png");

    console.log(`→ ${filename}  (${displayName})`);

    if (dryRun) {
      console.log(`  [DRY RUN] Would upload to Notion + create database entry\n`);
      results.push({ file: filename, notionId: "dry-run" });
      continue;
    }

    try {
      // Step 1: Upload image binary to Notion
      process.stdout.write(`  📤 Uploading to Notion...`);
      const { url: imageUrl } = await uploadImageToNotion(apiKey, filePath);
      console.log(` ✅`);

      // Step 2: Create database page with image
      process.stdout.write(`  📝 Creating database entry...`);
      const notionId = await createNotionImagePage(apiKey, filename, imageUrl, {
        imageName: `${displayName} — ${workflowId}`,
        imageId: `${workflowId}-${basename(filename, ".png")}`,
        postType: displayName,
        tags: postMeta ? [...postMeta.tags] : ["LinkedIn"],
        prompt: prompts[filename] ?? prompts[postKey ?? ""] ?? "",
        altText: `LinkedIn ${displayName} image — ${topic}`,
        workflowId,
        workflowNotionId,
      });

      const notionUrl = `https://www.notion.so/${notionId.replace(/-/g, "")}`;
      console.log(` ✅`);
      console.log(`  🔗 ${notionUrl}\n`);

      results.push({ file: filename, notionId, notionUrl });

    } catch (error) {
      console.log();
      console.error(`  ❌ Failed: ${error}\n`);
      results.push({ file: filename, notionId: null, error: String(error) });
    }
  }

  // Summary
  const succeeded = results.filter(r => r.notionId && r.notionId !== "dry-run").length;
  const failed = results.filter(r => !r.notionId || r.error).length;

  console.log("─".repeat(60));
  console.log(`✅ Uploaded: ${succeeded}   ❌ Failed: ${failed}   📁 Total: ${results.length}`);

  if (dryRun) {
    console.log("\n🔍 Dry run complete.");
    return;
  }

  // Save Notion IDs to metadata.json
  if (succeeded > 0) {
    const notionImageIds = results
      .filter(r => r.notionId && r.notionId !== "dry-run")
      .map(r => ({ file: r.file, notion_id: r.notionId!, notion_url: r.notionUrl }));

    if (!metadata.checkpoints["step-13b"]) metadata.checkpoints["step-13b"] = {};

    metadata.checkpoints["step-13b"].notion_image_ids = notionImageIds;
    metadata.checkpoints["step-13b"].notion_push_completed = true;
    metadata.checkpoints["step-13b"].notion_push_timestamp = new Date().toISOString();
    metadata.updated_at = new Date().toISOString();

    writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n💾 Notion IDs saved to metadata.json`);
    console.log(`\n🔍 Review all LinkedIn images:`);
    console.log(`   ${IMAGES_REVIEW_URL}`);
  }
}

main().catch(err => {
  console.error("❌ Fatal error:", err);
  process.exit(1);
});
