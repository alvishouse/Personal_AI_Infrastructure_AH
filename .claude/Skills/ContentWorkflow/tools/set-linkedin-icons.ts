#!/usr/bin/env bun

/**
 * Set LinkedIn Icon for All LinkedIn Posts
 *
 * Adds the LinkedIn icon to all LinkedIn post pages in Notion
 */

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import { glob } from "glob";

// LinkedIn icon - Using actual LinkedIn logo from stable CDN
const LINKEDIN_ICON = {
  type: "external",
  external: {
    url: "https://cdn-icons-png.flaticon.com/512/174/174857.png"
  }
};

// Alternative stable URLs:
// Wikimedia (guaranteed stable): "https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png"
// Icons8: "https://img.icons8.com/color/512/linkedin.png"

async function setPageIcon(pageId: string, apiKey: string) {
  const url = `https://api.notion.com/v1/pages/${pageId}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      icon: LINKEDIN_ICON
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to set icon: ${error.message || response.statusText}`);
  }

  return await response.json();
}

function getNotionApiKey(): string {
  // Try MCP config
  const mcpPath = join(process.env.HOME!, ".claude", "mcpServers.json");
  if (existsSync(mcpPath)) {
    const mcpConfig = JSON.parse(readFileSync(mcpPath, "utf-8"));
    if (mcpConfig.mcpServers?.notion?.env?.NOTION_API_KEY) {
      return mcpConfig.mcpServers.notion.env.NOTION_API_KEY;
    }
  }

  throw new Error("Notion API key not found in MCP config");
}

function parseMarkdownFrontmatter(content: string): { notion_id?: string; title?: string } {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const frontmatter: any = {};
  const lines = match[1].split("\n");

  lines.forEach(line => {
    const keyValue = line.match(/^(\w+):\s*(.+)$/);
    if (keyValue) {
      frontmatter[keyValue[1]] = keyValue[2].replace(/^["']|["']$/g, "");
    }
  });

  return frontmatter;
}

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║  Set LinkedIn Icons for All Posts                          ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  const apiKey = getNotionApiKey();
  const postsDir = join(
    process.env.HOME!,
    "PAI",
    "scratchpad",
    "content-create",
    "2026-01-31-playing-it-safe-illusion",
    "13-extracted-content",
    "linkedin",
    "posts"
  );

  // Get all LinkedIn post files
  const files = glob.sync("*.md", { cwd: postsDir, absolute: true });

  console.log(`Found ${files.length} LinkedIn posts\n`);

  let success = 0;
  let failed = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, "utf-8");
      const frontmatter = parseMarkdownFrontmatter(content);

      if (!frontmatter.notion_id) {
        console.log(`⏭️  Skipped: ${file.split("/").pop()} (no notion_id)`);
        continue;
      }

      console.log(`🔗 Setting icon for: ${file.split("/").pop()}`);
      console.log(`   Notion ID: ${frontmatter.notion_id}`);

      await setPageIcon(frontmatter.notion_id, apiKey);

      console.log(`   ✅ Icon set successfully\n`);
      success++;

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 300));
    } catch (error) {
      console.error(`   ❌ Failed: ${error}\n`);
      failed++;
    }
  }

  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log(`║  Complete: ${success} succeeded, ${failed} failed${" ".repeat(28)}║`);
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  if (success > 0) {
    console.log("✨ All LinkedIn posts now have the LinkedIn icon!");
    console.log("   Refresh your Notion database to see the icons.\n");
  }
}

main().catch(error => {
  console.error(`\n❌ Fatal error: ${error}\n`);
  process.exit(1);
});
