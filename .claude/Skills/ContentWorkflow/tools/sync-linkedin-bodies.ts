#!/usr/bin/env bun

/**
 * Sync LinkedIn Post Bodies to Notion
 *
 * Populates Notion page bodies with actual post content from PAI markdown files.
 * Run this after the initial property sync to fill in the content bodies.
 *
 * Usage:
 *   bun run sync-linkedin-bodies.ts [workflow-directory]
 *
 * Example:
 *   bun run sync-linkedin-bodies.ts /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin
 */

import { ContentWorkflowNotionSync } from "./notion-sync";
import { join } from "path";

async function main() {
  const args = process.argv.slice(2);

  // Default to current workflow if no argument provided
  const workflowDir = args[0] || join(
    process.env.HOME!,
    "PAI",
    "scratchpad",
    "content-create",
    "2026-01-31-playing-it-safe-illusion",
    "13-extracted-content",
    "linkedin"
  );

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  LinkedIn Post Body Sync to Notion                         ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log(`📁 Working directory: ${workflowDir}\n`);

  // Initialize Notion sync
  const notionSync = new ContentWorkflowNotionSync();

  try {
    await notionSync.batchSyncLinkedInBodies(workflowDir);

    console.log("╔════════════════════════════════════════════════════════════╗");
    console.log("║  ✅ All LinkedIn posts synced successfully!                ║");
    console.log("╚════════════════════════════════════════════════════════════╝\n");

    console.log("Next steps:");
    console.log("  1. Open Notion and refresh the Content database");
    console.log("  2. Click any LinkedIn post to see the populated body");
    console.log("  3. Verify the content matches your PAI files\n");

  } catch (error) {
    console.error(`\n❌ Batch sync failed: ${error}\n`);
    process.exit(1);
  }
}

main();
