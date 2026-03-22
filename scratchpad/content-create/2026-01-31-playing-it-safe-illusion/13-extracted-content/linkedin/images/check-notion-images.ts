#!/usr/bin/env bun

/**
 * Check Notion Images database entries and see what's missing
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
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

async function checkImages() {
  console.log("🔍 Checking Notion Images database entries...\n");

  const apiKey = loadNotionApiKey();

  const imageIds = [
    { name: "Napkin Sketch", id: "3030760e-b0cd-8148-aeac-eaa6246b199c" },
    { name: "Modern Alchemist", id: "3030760e-b0cd-810e-8f0d-c5248d6b97d1" }
  ];

  for (const image of imageIds) {
    console.log(`📸 ${image.name}:`);
    console.log(`   Notion ID: ${image.id}`);
    console.log(`   URL: https://www.notion.so/${image.id.replace(/-/g, '')}`);

    try {
      const page = await notionRequest(apiKey, `/pages/${image.id}`);

      // Check if page has file/image property
      console.log(`   Properties:`, Object.keys(page.properties).join(", "));

      // Look for image/file properties
      const imageProps = Object.entries(page.properties).filter(([key, value]: [string, any]) =>
        value.type === 'files' || value.type === 'url'
      );

      if (imageProps.length > 0) {
        console.log(`   Image properties found:`);
        imageProps.forEach(([key, value]: [string, any]) => {
          console.log(`     - ${key}: ${value.type}`);
          if (value.type === 'files') {
            console.log(`       Files: ${JSON.stringify(value.files, null, 2)}`);
          }
          if (value.type === 'url') {
            console.log(`       URL: ${value.url}`);
          }
        });
      } else {
        console.log(`   ⚠️  No image/file properties found`);
      }

      // Check page body for images
      const blocks = await notionRequest(apiKey, `/blocks/${image.id}/children`);
      const imageBlocks = blocks.results.filter((b: any) => b.type === 'image');

      if (imageBlocks.length > 0) {
        console.log(`   ✅ ${imageBlocks.length} image block(s) in body`);
      } else {
        console.log(`   ⚠️  No image blocks in body`);
      }

    } catch (error) {
      console.error(`   ❌ Error: ${error}`);
    }

    console.log();
  }

  console.log("\n💡 The issue: Database entries exist but don't contain actual image files.");
  console.log("   Notion needs either:");
  console.log("   1. Uploaded file via Notion API");
  console.log("   2. Publicly accessible external URL");
  console.log("\n   Local file paths (file://wsl.localhost/...) don't work for image display.");
}

checkImages();
