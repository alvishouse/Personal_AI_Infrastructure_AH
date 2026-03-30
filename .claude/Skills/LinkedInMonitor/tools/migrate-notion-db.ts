/**
 * migrate-notion-db.ts — Add the Bucket property to an existing Engagement Queue DB.
 *
 * Run once against your existing Notion DB to add the Bucket select column.
 * Safe to run multiple times — Notion ignores properties that already exist.
 *
 * Usage:
 *   cd /home/alvis/PAI && bun --env-file .claude/.env run .claude/Skills/LinkedInMonitor/tools/migrate-notion-db.ts
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

async function main() {
  const apiKey = getEnv("NOTION_API_KEY");

  const configFile = Bun.file(CONFIG_PATH);
  const config = JSON.parse(new TextDecoder().decode(await configFile.bytes()));
  const dbId: string = config.notion_engagement_db_id;

  if (!dbId) {
    console.error("[migrate] notion_engagement_db_id not set in monitor-config.json");
    process.exit(1);
  }

  console.log(`[migrate] Adding Bucket property to DB ${dbId}...`);

  const resp = await fetch(`${NOTION_API_BASE}/databases/${dbId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      properties: {
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
      },
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!resp.ok) {
    const err = await resp.text();
    console.error(`[migrate] Failed: ${resp.status} ${err}`);
    process.exit(1);
  }

  console.log("[migrate] Done. Bucket property added to LinkedIn Engagement Queue.");
  console.log("[migrate] You can now create filtered views in Notion by Bucket.");
}

main().catch((err) => {
  console.error("[migrate] Fatal error:", err);
  process.exit(1);
});
