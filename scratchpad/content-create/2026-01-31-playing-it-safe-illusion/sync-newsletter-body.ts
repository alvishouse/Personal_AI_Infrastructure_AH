#!/usr/bin/env bun

/**
 * Sync newsletter body content to Notion
 * This pushes the actual markdown content as Notion blocks
 */

import { ContentWorkflowNotionSync } from "/home/alvis/.claude/Skills/ContentWorkflow/tools/notion-sync.ts";
import { join } from "path";

const WORKFLOW_DIR = "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion";

async function main() {
  console.log("📤 Syncing newsletter body to Notion...\n");

  // Initialize Notion sync
  const sync = new ContentWorkflowNotionSync();

  // Path to newsletter file
  const newsletterPath = join(WORKFLOW_DIR, "14-newsletter/newsletter-final.md");

  console.log(`File: ${newsletterPath}\n`);

  // Sync the body content
  await sync.syncContentBody(newsletterPath);

  console.log("\n✅ Newsletter body synced successfully!");
  console.log("\nThe full newsletter content is now visible in Notion.");
}

main().catch(error => {
  console.error("❌ Error:", error.message);
  console.error(error.stack);
  process.exit(1);
});
