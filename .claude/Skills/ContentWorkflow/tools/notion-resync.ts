#!/usr/bin/env bun

/**
 * Notion Resync CLI Tool
 *
 * Bidirectional sync between PAI markdown files and Notion.
 * Detects changes and updates Notion when local files are modified.
 *
 * Usage:
 *   bun run notion-resync.ts --file 01-authority-post.md
 *   bun run notion-resync.ts --notion-id abc123
 *   bun run notion-resync.ts --workflow 2026-01-31-playing-it-safe-illusion
 *   bun run notion-resync.ts --check
 */

import { parseArgs } from "node:util";
import { existsSync, readFileSync, statSync, readdirSync } from "fs";
import { join, basename, dirname } from "path";
import { glob } from "glob";

interface CliOptions {
  file?: string;
  "notion-id"?: string;
  workflow?: string;
  check?: boolean;
  force?: boolean;
  help?: boolean;
}

interface FileFrontmatter {
  notion_id?: string;
  notion_url?: string;
  last_synced?: string;
  sync_status?: string;
  [key: string]: any;
}

interface OutOfSyncFile {
  path: string;
  modifiedAgo: string;
  notionId: string;
}

/**
 * Parse markdown frontmatter
 */
function parseFrontmatter(content: string): { frontmatter: FileFrontmatter; body: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter: FileFrontmatter = {};
  const yamlLines = match[1].split("\n");

  yamlLines.forEach(line => {
    const keyValue = line.match(/^(\w+):\s*(.+)$/);
    if (keyValue) {
      frontmatter[keyValue[1]] = keyValue[2].replace(/^["']|["']$/g, "");
    }
  });

  return { frontmatter, body: match[2] };
}

/**
 * Find workflow directory containing a file
 */
function findWorkflowByFile(fileName: string): string | null {
  const scratchpadDir = join(process.env.HOME!, "PAI", "scratchpad", "content-create");

  if (!existsSync(scratchpadDir)) {
    console.error("❌ Scratchpad directory not found:", scratchpadDir);
    return null;
  }

  const workflows = readdirSync(scratchpadDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  for (const workflow of workflows) {
    const workflowDir = join(scratchpadDir, workflow);

    // Search for file in workflow directory
    const files = glob.sync(`**/${fileName}`, { cwd: workflowDir });

    if (files.length > 0) {
      return workflow;
    }
  }

  return null;
}

/**
 * Resolve full file path from workflow and filename
 */
function resolveFilePath(workflow: string, fileName: string): string | null {
  const scratchpadDir = join(process.env.HOME!, "PAI", "scratchpad", "content-create");
  const workflowDir = join(scratchpadDir, workflow);

  if (!existsSync(workflowDir)) {
    return null;
  }

  const files = glob.sync(`**/${fileName}`, { cwd: workflowDir, absolute: true });

  if (files.length === 0) {
    return null;
  }

  return files[0];
}

/**
 * Get human-readable time ago
 */
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
}

/**
 * Find all files with notion_id that are out of sync
 */
async function findOutOfSyncFiles(): Promise<OutOfSyncFile[]> {
  const scratchpadDir = join(process.env.HOME!, "PAI", "scratchpad", "content-create");

  if (!existsSync(scratchpadDir)) {
    return [];
  }

  const markdownFiles = glob.sync("**/*.md", {
    cwd: scratchpadDir,
    absolute: true
  });

  const outOfSync: OutOfSyncFile[] = [];

  for (const filePath of markdownFiles) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const { frontmatter } = parseFrontmatter(content);

      if (!frontmatter.notion_id) continue;

      const stats = statSync(filePath);
      const lastModified = stats.mtime;
      const lastSynced = frontmatter.last_synced ? new Date(frontmatter.last_synced) : new Date(0);

      if (lastModified > lastSynced) {
        outOfSync.push({
          path: filePath,
          modifiedAgo: getTimeAgo(lastModified),
          notionId: frontmatter.notion_id
        });
      }
    } catch (error) {
      // Skip files that can't be read
    }
  }

  return outOfSync;
}

/**
 * Resync a single file to Notion
 */
async function resyncFile(filePath: string, force: boolean = false): Promise<void> {
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);
    process.exit(1);
  }

  const content = readFileSync(filePath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(content);

  if (!frontmatter.notion_id) {
    console.error(`❌ File not yet synced to Notion. Run initial sync first.`);
    console.log(`   Missing notion_id in frontmatter: ${filePath}`);
    process.exit(1);
  }

  // Check if file changed since last sync
  const stats = statSync(filePath);
  const fileModified = stats.mtime;
  const lastSynced = frontmatter.last_synced ? new Date(frontmatter.last_synced) : new Date(0);

  if (!force && fileModified <= lastSynced) {
    console.log(`✅ No changes since last sync (${frontmatter.last_synced})`);
    return;
  }

  console.log(`🔄 Syncing changes to Notion...`);
  console.log(`   File: ${basename(filePath)}`);
  console.log(`   Notion ID: ${frontmatter.notion_id}`);
  console.log(`   Last Modified: ${getTimeAgo(fileModified)}`);

  try {
    // Use ContentWorkflowNotionSync to update the page body
    const { ContentWorkflowNotionSync } = await import("./notion-sync");
    const notionSync = new ContentWorkflowNotionSync();

    console.log(`\n📝 Updating Notion page body...`);
    await notionSync.syncContentBody(filePath);

    console.log(`\n✅ Sync complete!`);
    console.log(`   Notion URL: ${frontmatter.notion_url || "N/A"}`);
    console.log(`   Updated: ${new Date().toLocaleString()}`);
  } catch (error) {
    console.error(`❌ Sync failed: ${error}`);
    process.exit(1);
  }
}

/**
 * Resync entire workflow
 */
async function resyncWorkflow(workflowId: string): Promise<void> {
  const scratchpadDir = join(process.env.HOME!, "PAI", "scratchpad", "content-create");
  const workflowDir = join(scratchpadDir, workflowId);

  if (!existsSync(workflowDir)) {
    console.error(`❌ Workflow not found: ${workflowId}`);
    process.exit(1);
  }

  console.log(`🔄 Syncing workflow: ${workflowId}`);

  const markdownFiles = glob.sync("**/*.md", {
    cwd: workflowDir,
    absolute: true
  });

  let syncedCount = 0;
  let skippedCount = 0;

  for (const filePath of markdownFiles) {
    try {
      const content = readFileSync(filePath, "utf-8");
      const { frontmatter } = parseFrontmatter(content);

      if (!frontmatter.notion_id) {
        continue; // Skip files not yet synced
      }

      const stats = statSync(filePath);
      const fileModified = stats.mtime;
      const lastSynced = frontmatter.last_synced ? new Date(frontmatter.last_synced) : new Date(0);

      if (fileModified > lastSynced) {
        console.log(`\n✅ Synced: ${basename(filePath)}`);
        await resyncFile(filePath);
        syncedCount++;
      } else {
        console.log(`⏭️  Skipped: ${basename(filePath)} (no changes)`);
        skippedCount++;
      }
    } catch (error) {
      console.error(`❌ Error processing ${basename(filePath)}: ${error}`);
    }
  }

  console.log(`\n📊 Complete: ${syncedCount} files synced, ${skippedCount} skipped`);
}

/**
 * Main CLI function
 */
async function main() {
  const { values } = parseArgs({
    options: {
      file: { type: "string" },
      "notion-id": { type: "string" },
      workflow: { type: "string" },
      check: { type: "boolean" },
      force: { type: "boolean" },
      help: { type: "boolean" }
    }
  }) as { values: CliOptions };

  if (values.help) {
    console.log(`
Notion Resync Tool - Bidirectional sync for PAI content

Usage:
  bun run notion-resync.ts [options]

Options:
  --file <filename>       Sync specific file (auto-detects workflow)
  --notion-id <id>        Sync by Notion page ID
  --workflow <id>         Sync entire workflow
  --check                 Check which files need syncing
  --force                 Force sync even if unchanged
  --help                  Show this help message

Examples:
  # Sync a specific file
  bun run notion-resync.ts --file 01-authority-post.md

  # Check sync status
  bun run notion-resync.ts --check

  # Sync entire workflow
  bun run notion-resync.ts --workflow 2026-01-31-playing-it-safe-illusion

  # Force sync a file
  bun run notion-resync.ts --file 01-authority-post.md --force
    `);
    process.exit(0);
  }

  // Handle --check
  if (values.check) {
    console.log(`🔍 Checking sync status...`);

    const outOfSync = await findOutOfSyncFiles();

    if (outOfSync.length === 0) {
      console.log(`✅ All files in sync`);
      process.exit(0);
    }

    console.log(`\n📋 Files needing resync (${outOfSync.length}):\n`);
    outOfSync.forEach(file => {
      console.log(`  - ${file.path}`);
      console.log(`    Modified: ${file.modifiedAgo}`);
      console.log(`    Notion ID: ${file.notionId}\n`);
    });

    console.log(`\nTo sync all: bun run notion-resync.ts --workflow <workflow-id>`);
    process.exit(0);
  }

  // Handle --file
  if (values.file) {
    const workflow = findWorkflowByFile(values.file);

    if (!workflow) {
      console.error(`❌ Could not find workflow containing: ${values.file}`);
      process.exit(1);
    }

    const filePath = resolveFilePath(workflow, values.file);

    if (!filePath) {
      console.error(`❌ Could not resolve file path: ${values.file}`);
      process.exit(1);
    }

    await resyncFile(filePath, values.force || false);
    process.exit(0);
  }

  // Handle --workflow
  if (values.workflow) {
    await resyncWorkflow(values.workflow);
    process.exit(0);
  }

  // Handle --notion-id
  if (values["notion-id"]) {
    console.error(`❌ Sync by Notion ID not yet implemented`);
    console.log(`   Use --file or --workflow instead`);
    process.exit(1);
  }

  // No valid option provided
  console.error(`❌ No valid option provided. Use --help for usage information.`);
  process.exit(1);
}

// Run CLI
main().catch(error => {
  console.error(`❌ Fatal error: ${error}`);
  process.exit(1);
});
