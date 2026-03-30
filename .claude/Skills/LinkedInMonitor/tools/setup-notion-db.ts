/**
 * setup-notion-db.ts — One-time setup: create the Notion Engagement Queue DB.
 *
 * Usage:
 *   cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/setup-notion-db.ts <parent-page-id>
 *
 * The parent-page-id is the Notion page where the new DB will be created.
 * After running, the DB ID is saved to config/monitor-config.json automatically.
 */

import { join } from "path";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "monitor-config.json");
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

async function createDatabase(
  apiKey: string,
  parentPageId: string
): Promise<string> {
  const headers = {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };

  const body = {
    parent: { type: "page_id", page_id: parentPageId },
    title: [{ text: { content: "LinkedIn Engagement Queue" } }],
    properties: {
      "Entry Name": { title: {} },
      Type: {
        select: {
          options: [
            { name: "Watched Post", color: "blue" },
            { name: "Own Post Comment", color: "green" },
          ],
        },
      },
      Account: { rich_text: {} },
      Bucket: {
        select: {
          options: [
            { name: "Large Creator", color: "purple" },
            { name: "Peer", color: "blue" },
            { name: "ICP", color: "orange" },
            { name: "Friend", color: "green" },
          ],
        },
      },
      "LinkedIn URL": { url: {} },
      Status: {
        status: {
          options: [
            { name: "To Engage", color: "yellow" },
            { name: "Engaged", color: "green" },
            { name: "Skipped", color: "gray" },
          ],
        },
      },
      Excerpt: { rich_text: {} },
      "Reply Options": { rich_text: {} },
      "Detected At": { date: {} },
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

  const data = await resp.json() as { id: string };
  return data.id;
}

async function main() {
  const parentPageId = process.argv[2];
  if (!parentPageId) {
    console.error("Usage: bun run setup-notion-db.ts <parent-page-id>");
    console.error("\nTo find your parent page ID:");
    console.error("  1. Open the Notion page where you want the DB");
    console.error("  2. Copy the URL — the ID is the last part (32 hex chars)");
    process.exit(1);
  }

  const apiKey = getEnv("NOTION_API_KEY");

  console.log(`[setup] Creating LinkedIn Engagement Queue DB under page ${parentPageId}...`);
  const dbId = await createDatabase(apiKey, parentPageId);
  console.log(`[setup] Created DB with ID: ${dbId}`);

  // Save to config
  const configFile = Bun.file(CONFIG_PATH);
  const config = JSON.parse(new TextDecoder().decode(await configFile.bytes()));
  config.notion_engagement_db_id = dbId;
  await Bun.write(CONFIG_PATH, JSON.stringify(config, null, 2) + "\n");

  console.log(`[setup] Saved DB ID to config/monitor-config.json`);
  console.log(`[setup] Also set LINKEDIN_MONITOR_NOTION_DB=${dbId} in your .env if needed`);
  console.log("\n[setup] Setup complete! Your LinkedIn Engagement Queue is ready.");
}

main().catch((err) => {
  console.error("[setup] Fatal error:", err);
  process.exit(1);
});
