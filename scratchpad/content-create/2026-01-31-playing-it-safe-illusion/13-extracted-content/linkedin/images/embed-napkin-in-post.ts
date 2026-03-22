#!/usr/bin/env bun

/**
 * Embed napkin sketch image into LinkedIn post body in Notion
 */

import { readFileSync } from "fs";
import { join } from "path";

// Load Notion API key
function loadNotionApiKey(): string {
  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  const creds = JSON.parse(readFileSync(credPath, "utf-8"));
  return creds.notion.api_key;
}

// Convert image to base64 data URL
function imageToDataUrl(imagePath: string): string {
  const imageBuffer = readFileSync(imagePath);
  const base64 = imageBuffer.toString('base64');
  return `data:image/png;base64,${base64}`;
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
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

async function embedImageInPost() {
  console.log("🖼️  Embedding napkin sketch in LinkedIn post body...\n");

  const apiKey = loadNotionApiKey();
  const postNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3"; // Authority Post ID
  const imagePath = "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png";

  try {
    // Get current blocks to find where to insert image
    const blocksResponse = await notionRequest(apiKey, `/blocks/${postNotionId}/children`);
    const existingBlocks = blocksResponse.results || [];

    console.log(`📄 Current post has ${existingBlocks.length} blocks`);

    // Create image block using external URL (Notion will host it)
    // We'll use a local file path for now and convert to external later
    // For now, let's add it as a file block first

    // Option 1: Try adding as external URL (using file:// URL)
    const fileUrl = `file://wsl.localhost/Ubuntu/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png`;

    const imageBlock = {
      object: "block",
      type: "image",
      image: {
        type: "external",
        external: {
          url: fileUrl
        },
        caption: [
          {
            type: "text",
            text: {
              content: "Singapore AI Paradox - Napkin Sketch: Playing it Safe = Failing Slowly"
            }
          }
        ]
      }
    };

    // Append image block after first paragraph (typically after hook)
    // Find a good insertion point (after the hook lines and initial CTA)
    let insertAfterIndex = 3; // After hook and first CTA typically

    if (insertAfterIndex >= existingBlocks.length) {
      // Just append at the end if not enough blocks
      console.log(`📌 Appending image at end of post`);

      await notionRequest(apiKey, `/blocks/${postNotionId}/children`, {
        method: "PATCH",
        body: JSON.stringify({
          children: [imageBlock]
        })
      });
    } else {
      // Insert after specific block
      console.log(`📌 Inserting image after block ${insertAfterIndex}`);

      const afterBlockId = existingBlocks[insertAfterIndex].id;

      await notionRequest(apiKey, `/blocks/${afterBlockId}/children`, {
        method: "PATCH",
        body: JSON.stringify({
          children: [imageBlock],
          after: afterBlockId
        })
      });
    }

    console.log(`\n✅ Napkin sketch image embedded in post body!`);
    console.log(`📍 Post: https://www.notion.so/${postNotionId.replace(/-/g, '')}`);
    console.log(`🖼️  Image: Singapore AI Paradox napkin sketch`);

  } catch (error) {
    console.error(`❌ Failed to embed image: ${error}`);

    // Try alternative approach: add at the end
    console.log(`\n🔄 Trying alternative approach: uploading to Notion as external file...`);

    // Notion doesn't support file:// URLs for external images
    // We need to either:
    // 1. Upload to a public URL first (WordPress, Imgur, etc.)
    // 2. Use Notion's file upload (requires different API)

    console.log(`\n💡 Alternative: Add image manually via Notion UI using path:`);
    console.log(`   ${imagePath}`);
    console.log(`\nOr upload to WordPress first and use that URL.`);

    process.exit(1);
  }
}

embedImageInPost();
