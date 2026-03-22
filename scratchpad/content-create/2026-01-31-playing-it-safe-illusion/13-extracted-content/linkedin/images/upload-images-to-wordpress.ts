#!/usr/bin/env bun

/**
 * Upload LinkedIn images to WordPress and embed in Notion post
 */

import { readFileSync } from "fs";
import { join, basename } from "path";
import FormData from "form-data";

// Load WordPress credentials
function loadWordPressConfig() {
  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  const creds = JSON.parse(readFileSync(credPath, "utf-8"));

  if (!creds.wordpress) {
    throw new Error("WordPress credentials not found in .credentials.json");
  }

  return {
    siteUrl: creds.wordpress.site_url || "https://alvishouse.io",
    username: creds.wordpress.username,
    appPassword: creds.wordpress.app_password,
  };
}

// Load Notion API key
function loadNotionApiKey(): string {
  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  const creds = JSON.parse(readFileSync(credPath, "utf-8"));
  return creds.notion.api_key;
}

async function uploadImageToWordPress(
  imagePath: string,
  title: string,
  altText: string,
  wpConfig: any
): Promise<{ id: number; url: string }> {
  console.log(`📤 Uploading ${basename(imagePath)} to WordPress...`);

  const imageBuffer = readFileSync(imagePath);
  const form = new FormData();
  form.append("file", imageBuffer, {
    filename: basename(imagePath),
    contentType: "image/png",
  });

  const authHeader = `Basic ${Buffer.from(`${wpConfig.username}:${wpConfig.appPassword}`).toString("base64")}`;

  const response = await fetch(`${wpConfig.siteUrl}/wp-json/wp/v2/media`, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      ...form.getHeaders(),
    },
    body: form,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`WordPress upload failed: ${response.status} - ${error}`);
  }

  const mediaData = await response.json();

  // Update alt text and title
  await fetch(`${wpConfig.siteUrl}/wp-json/wp/v2/media/${mediaData.id}`, {
    method: "POST",
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      alt_text: altText,
    }),
  });

  console.log(`✅ Uploaded: ${mediaData.source_url}`);
  console.log(`   Media ID: ${mediaData.id}`);

  return {
    id: mediaData.id,
    url: mediaData.source_url,
  };
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

async function embedImageInNotionPost(
  apiKey: string,
  postId: string,
  imageUrl: string,
  caption: string
) {
  console.log(`🖼️  Embedding image in Notion post...`);

  const imageBlock = {
    object: "block",
    type: "image",
    image: {
      type: "external",
      external: {
        url: imageUrl,
      },
      caption: [
        {
          type: "text",
          text: {
            content: caption,
          },
        },
      ],
    },
  };

  // Append to post
  await notionRequest(apiKey, `/blocks/${postId}/children`, {
    method: "PATCH",
    body: JSON.stringify({
      children: [imageBlock],
    }),
  });

  console.log(`✅ Image embedded in Notion post`);
}

async function main() {
  console.log("🚀 Uploading LinkedIn images and embedding in Notion...\n");

  const wpConfig = loadWordPressConfig();
  const notionApiKey = loadNotionApiKey();
  const postNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3"; // Authority Post

  const images = [
    {
      path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png",
      title: "Singapore AI Paradox - Napkin Sketch",
      altText: "Napkin sketch showing the paradox: 'Playing it Safe = Failing Slowly' with Singapore's $1B AI investment as context.",
      caption: "Singapore AI Paradox: Playing it Safe = Failing Slowly (Napkin sketch)",
    },
    {
      path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png",
      title: "Playing It Safe = Failing Slowly - Modern Alchemist",
      altText: "Modern Alchemist technical illustration showing the paradox of 'Playing it Safe = Failing Slowly'. Left: figure wrapped in protective layers. Right: freed figure climbing stairs.",
      caption: "The Singapore Paradox - Modern Alchemist illustration",
    },
  ];

  for (const image of images) {
    try {
      console.log(`\n📸 Processing: ${basename(image.path)}`);

      // Upload to WordPress
      const { id, url } = await uploadImageToWordPress(
        image.path,
        image.title,
        image.altText,
        wpConfig
      );

      // Embed in Notion
      await embedImageInNotionPost(
        notionApiKey,
        postNotionId,
        url,
        image.caption
      );

      console.log(`✅ Completed: ${image.title}\n`);

    } catch (error) {
      console.error(`❌ Failed to process ${basename(image.path)}: ${error}`);
    }
  }

  console.log("\n🎉 All images processed!");
  console.log(`\n📍 View post: https://www.notion.so/${postNotionId.replace(/-/g, "")}`);
}

main();
