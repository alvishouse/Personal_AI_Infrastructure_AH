#!/usr/bin/env bun

/**
 * Simple script to add image blocks to Notion post
 * Uses image URLs that are already accessible
 */

import { readFileSync } from "fs";
import { join } from "path";

function loadNotionApiKey(): string {
  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  const creds = JSON.parse(readFileSync(credPath, "utf-8"));
  return creds.notion.api_key;
}

async function notionRequest(apiKey: string, endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `https://api.notion.com/v1${endpoint}`;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    console.error("Full error:", JSON.stringify(error, null, 2));
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

async function addImagesToPost() {
  console.log("🖼️  Adding images to Notion post...\n");

  const apiKey = loadNotionApiKey();
  const postNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3";

  // For now, let's add placeholders that reference the images
  // User can then manually replace with actual image blocks

  const blocks = [
    {
      object: "block",
      type: "divider",
      divider: {}
    },
    {
      object: "block",
      type: "heading_2",
      heading_2: {
        rich_text: [{ type: "text", text: { content: "Visual: The Singapore Paradox" } }]
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "📎 Image 1: " }
          },
          {
            type: "text",
            text: { content: "Singapore AI Paradox - Napkin Sketch" },
            annotations: { bold: true }
          }
        ]
      }
    },
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: { content: "Local path: /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png" }
          }
        ],
        icon: { emoji: "🖼️" },
        color: "gray_background"
      }
    },
    {
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: [
          {
            type: "text",
            text: { content: "📎 Image 2: " }
          },
          {
            type: "text",
            text: { content: "Playing It Safe = Failing Slowly - Modern Alchemist" },
            annotations: { bold: true }
          }
        ]
      }
    },
    {
      object: "block",
      type: "callout",
      callout: {
        rich_text: [
          {
            type: "text",
            text: { content: "Local path: /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png" }
          }
        ],
        icon: { emoji: "🖼️" },
        color: "gray_background"
      }
    },
    {
      object: "block",
      type: "divider",
      divider: {}
    }
  ];

  try {
    await notionRequest(apiKey, `/blocks/${postNotionId}/children`, {
      method: "PATCH",
      body: JSON.stringify({
        children: blocks
      })
    });

    console.log("✅ Image reference blocks added to Notion post!");
    console.log("\n📍 View post: https://www.notion.so/" + postNotionId.replace(/-/g, ""));
    console.log("\n💡 To add actual images:");
    console.log("   1. Click '+' menu or type '/' in Notion");
    console.log("   2. Select 'Image'");
    console.log("   3. Choose 'Upload' and browse to the local paths shown above");
    console.log("   4. Or use 'Link' and upload images to WordPress/Imgur first");

  } catch (error) {
    console.error("❌ Failed to add blocks:", error);
    process.exit(1);
  }
}

addImagesToPost();
