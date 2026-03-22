#!/usr/bin/env bun

import { ContentWorkflowNotionSync } from "/home/alvis/PAI/.claude/Skills/ContentWorkflow/tools/notion-sync";

const sync = new ContentWorkflowNotionSync();

async function syncOptimizedPosts() {
  console.log("🔄 Syncing optimized LinkedIn posts to Notion...\n");

  const posts = [
    "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/posts/01-authority-post-OPTIMIZED.md",
    "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/posts/05-myth-busting-OPTIMIZED.md"
  ];

  for (const post of posts) {
    try {
      console.log(`\n📝 Syncing: ${post.split('/').pop()}`);
      await sync.syncContentBody(post);
      console.log(`✅ Successfully synced`);
    } catch (error) {
      console.error(`❌ Failed: ${error}`);
    }
  }

  console.log("\n✅ All optimized posts synced to Notion!");
}

syncOptimizedPosts();
