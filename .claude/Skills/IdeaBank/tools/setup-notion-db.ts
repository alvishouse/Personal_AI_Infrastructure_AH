/**
 * setup-notion-db.ts — One-time setup: create the Notion Idea Bank database.
 *
 * Usage:
 *   cd /home/alvis/PAI && bun run .claude/Skills/IdeaBank/tools/setup-notion-db.ts <parent-page-id>
 *
 * The parent-page-id is the Notion page where the new database will be created.
 * After running, the DB ID is saved to config/ideabank-config.json automatically.
 *
 * To find your parent page ID:
 *   1. Open the Notion page where you want the DB
 *   2. Copy the URL — the ID is the last 32 hex characters
 */

import { join } from "path";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "ideabank-config.json");
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

async function createDatabase(apiKey: string, parentPageId: string): Promise<string> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };

  const body = {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ text: { content: "Idea Bank" } }],
    properties: {
      // Title property (required)
      Name: { title: {} },

      // Source — where did the idea come from
      Source: {
        select: {
          options: [
            { name: "Manual", color: "gray" },
            { name: "YouTube", color: "red" },
            { name: "Podcast", color: "purple" },
            { name: "Article", color: "blue" },
            { name: "Observation", color: "green" },
          ],
        },
      },

      // Raw idea text from Telegram
      "Raw Input": { rich_text: {} },

      // YouTube link (when source is YouTube)
      "YouTube URL": { url: {} },

      // AI-extracted key concepts from transcript
      "Transcript Summary": { rich_text: {} },

      // User's own callouts added after the YouTube link
      "Addendum": { rich_text: {} },

      // 5-dimension scoring (1-5 each)
      "Audience Relevance": { number: { format: "number" } },
      "Business Alignment": { number: { format: "number" } },
      "Timeliness": { number: { format: "number" } },
      "Differentiation": { number: { format: "number" } },
      "Extraction Potential": { number: { format: "number" } },

      // Total Score — formula computed from 5 dimensions
      "Total Score": {
        formula: {
          expression:
            'prop("Audience Relevance") + prop("Business Alignment") + prop("Timeliness") + prop("Differentiation") + prop("Extraction Potential")',
        },
      },

      // Tier — hot/warm/cold (written by the tool, derived from total score)
      Tier: {
        select: {
          options: [
            { name: "🔥 Hot", color: "red" },
            { name: "♨️ Warm", color: "orange" },
            { name: "❄️ Cold", color: "blue" },
          ],
        },
      },

      // The ICP translation — what Alvis House would actually write about
      "ICP Angle": { rich_text: {} },

      // Local file path to full transcript (IdeaBank/transcripts/{videoId}.txt)
      "Transcript File": { rich_text: {} },

      // Claude's scoring rationale
      "Scoring Notes": { rich_text: {} },

      // Which Evergreen Track this connects to
      "Track Alignment": { rich_text: {} },

      // Workflow status
      Status: {
        select: {
          options: [
            { name: "Captured", color: "yellow" },
            { name: "In Progress", color: "blue" },
            { name: "Used", color: "green" },
            { name: "Archived", color: "gray" },
          ],
        },
      },

      // When idea was captured
      "Created Date": { date: {} },
    },
  };

  const resp = await fetch(`${NOTION_API_BASE}/databases`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  });

  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Failed to create Notion database: ${resp.status} ${err}`);
  }

  const data = await resp.json() as { id: string; url: string };
  console.log(`[setup] Database URL: ${data.url}`);
  return data.id;
}

async function main() {
  const parentPageId = process.argv[2];
  if (!parentPageId) {
    console.error("Usage: bun run setup-notion-db.ts <parent-page-id>");
    console.error("\nTo find your parent page ID:");
    console.error("  1. Open the Notion page where you want the Idea Bank DB");
    console.error("  2. Copy the URL — the page ID is the last 32 hex characters");
    console.error("  3. Example: https://notion.so/My-Page-abc123... → abc123...");
    process.exit(1);
  }

  const apiKey = getEnv("NOTION_API_KEY");

  console.log(`[setup] Creating Idea Bank database under page ${parentPageId}...`);
  const dbId = await createDatabase(apiKey, parentPageId);
  console.log(`[setup] Created database with ID: ${dbId}`);

  // Save DB ID to config
  const configFile = Bun.file(CONFIG_PATH);
  const config = JSON.parse(new TextDecoder().decode(await configFile.bytes()));
  config.notion_ideas_db_id = dbId;
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

  console.log(`[setup] Saved DB ID to config/ideabank-config.json`);
  console.log(`\n[setup] Idea Bank is ready.`);
  console.log(`\nNext steps:`);
  console.log(`  1. Open the DB in Notion — you'll see 4 views need to be created manually`);
  console.log(`     (Notion API doesn't support view creation — add them in the UI:`);
  console.log(`      "Capture" board, "Ranked" table by Total Score, "Hot Ideas" gallery filtered by 🔥, "Archive" filtered by Used/Archived)`);
  console.log(`  2. Start the Telegram listener: bash .claude/Skills/LinkedInMonitor/tools/start-listener.sh`);
  console.log(`  3. Send #idea <your idea> in Telegram to test`);
}

main().catch((err) => {
  console.error("[setup] Fatal error:", err);
  process.exit(1);
});
