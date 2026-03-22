#!/usr/bin/env bun

/**
 * Fix existing Notion entries with Windows-compatible file:// URLs
 *
 * This script updates all existing Notion database entries to use
 * Windows WSL-compatible file:// URLs instead of Linux paths.
 *
 * Run this ONCE after updating the notion-sync.ts code.
 */

import { ContentWorkflowNotionSync } from "./notion-sync";

function linuxPathToWindowsFileUrl(linuxPath: string): string {
  const pathWithoutLeadingSlash = linuxPath.replace(/^\//, "");
  return `file://wsl.localhost/Ubuntu/${pathWithoutLeadingSlash}`;
}

async function fixWorkflowLinks(sync: ContentWorkflowNotionSync) {
  console.log("\n🔧 Fixing Workflow database file:// links...\n");

  // Get all workflows
  const workflows = await (sync as any).notionRequest(`/databases/${(sync as any).WORKFLOWS_DB}/query`, {
    method: "POST"
  });

  let fixed = 0;
  let failed = 0;

  for (const page of workflows.results || []) {
    try {
      const localDirProp = page.properties["Local Directory"];
      if (localDirProp?.url) {
        const linuxPath = localDirProp.url.replace(/^file:\/\//, "");

        // Only update if it looks like a Linux path
        if (linuxPath.startsWith("/home/")) {
          const windowsUrl = linuxPathToWindowsFileUrl(linuxPath);

          await (sync as any).notionRequest(`/pages/${page.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              properties: {
                "Local Directory": { url: windowsUrl }
              }
            })
          });

          console.log(`✅ Fixed workflow: ${page.properties["Workflow ID"]?.title[0]?.text?.content}`);
          fixed++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fix ${page.id}: ${error}`);
      failed++;
    }
  }

  console.log(`\n📊 Workflows: ${fixed} fixed, ${failed} failed\n`);
}

async function fixImageLinks(sync: ContentWorkflowNotionSync) {
  console.log("🔧 Fixing Images database file:// links...\n");

  const images = await (sync as any).notionRequest(`/databases/${(sync as any).IMAGES_DB}/query`, {
    method: "POST"
  });

  let fixed = 0;
  let failed = 0;

  for (const page of images.results || []) {
    try {
      const filePathProp = page.properties["File Path"];
      if (filePathProp?.url) {
        const linuxPath = filePathProp.url.replace(/^file:\/\//, "");

        if (linuxPath.startsWith("/home/")) {
          const windowsUrl = linuxPathToWindowsFileUrl(linuxPath);

          await (sync as any).notionRequest(`/pages/${page.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              properties: {
                "File Path": { url: windowsUrl }
              }
            })
          });

          console.log(`✅ Fixed image: ${page.properties["Image Name"]?.title[0]?.text?.content}`);
          fixed++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fix ${page.id}: ${error}`);
      failed++;
    }
  }

  console.log(`\n📊 Images: ${fixed} fixed, ${failed} failed\n`);
}

async function fixContentLinks(sync: ContentWorkflowNotionSync) {
  console.log("🔧 Fixing Content database file:// links...\n");

  const content = await (sync as any).notionRequest(`/databases/${(sync as any).CONTENT_DB}/query`, {
    method: "POST"
  });

  let fixed = 0;
  let failed = 0;

  for (const page of content.results || []) {
    try {
      const filePathProp = page.properties["Local File Path"];
      if (filePathProp?.url) {
        const linuxPath = filePathProp.url.replace(/^file:\/\//, "");

        if (linuxPath.startsWith("/home/")) {
          const windowsUrl = linuxPathToWindowsFileUrl(linuxPath);

          await (sync as any).notionRequest(`/pages/${page.id}`, {
            method: "PATCH",
            body: JSON.stringify({
              properties: {
                "Local File Path": { url: windowsUrl }
              }
            })
          });

          console.log(`✅ Fixed content: ${page.properties["Content Name"]?.title[0]?.text?.content}`);
          fixed++;
        }
      }
    } catch (error) {
      console.error(`❌ Failed to fix ${page.id}: ${error}`);
      failed++;
    }
  }

  console.log(`\n📊 Content: ${fixed} fixed, ${failed} failed\n`);
}

async function main() {
  console.log("🚀 Starting Notion file:// URL migration to Windows WSL format\n");
  console.log("This will update all existing Notion entries with Windows-compatible file:// URLs\n");
  console.log("Format: file://wsl.localhost/Ubuntu/home/alvis/PAI/...\n");

  try {
    const sync = new ContentWorkflowNotionSync();

    await fixWorkflowLinks(sync);
    await fixImageLinks(sync);
    await fixContentLinks(sync);

    console.log("✅ Migration complete! All file:// links updated.\n");
    console.log("💡 Test by clicking a link in Notion - it should open in Windows Explorer.\n");
  } catch (error) {
    console.error(`❌ Migration failed: ${error}`);
    process.exit(1);
  }
}

main();
