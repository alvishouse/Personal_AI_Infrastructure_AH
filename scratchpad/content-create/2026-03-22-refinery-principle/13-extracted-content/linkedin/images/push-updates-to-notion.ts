#!/usr/bin/env bun
/**
 * Push updated images to Notion:
 * 1. Update post-03-featured-frame.png (existing page)
 * 2. Push post-03-story-animated-linkedin.gif (new page)
 * 3. Push post-04-myth-buster-animated-linkedin.gif (new page)
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, basename, resolve } from "path";

const NOTION_API_URL = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const IMAGES_DB = "2733021756a1447d84a7143e2e9e97dd";

const WORKFLOW_DIR = "/home/alvis/PAI/scratchpad/content-create/2026-03-22-refinery-principle";
const IMAGES_DIR = join(WORKFLOW_DIR, "13-extracted-content", "linkedin", "images");
const METADATA_PATH = join(WORKFLOW_DIR, "metadata.json");

// Existing Notion page IDs from metadata
const FEATURED_FRAME_NOTION_ID = "32c0760e-b0cd-8138-952a-d56d368d24b7";

function loadNotionApiKey(): string {
  if (process.env.NOTION_API_KEY) return process.env.NOTION_API_KEY;
  const mcpPath = join(process.env.HOME!, ".claude", "mcpServers.json");
  if (existsSync(mcpPath)) {
    const cfg = JSON.parse(readFileSync(mcpPath, "utf-8"));
    if (cfg.mcpServers?.notion?.env?.NOTION_API_KEY) {
      return cfg.mcpServers.notion.env.NOTION_API_KEY;
    }
  }
  throw new Error("Notion API key not found");
}

async function uploadToNotion(apiKey: string, filePath: string): Promise<string> {
  const filename = basename(filePath);
  const ext = filename.split(".").pop()?.toLowerCase() ?? "png";
  const contentTypeMap: Record<string, string> = {
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
  };
  const contentType = contentTypeMap[ext] ?? "image/png";

  const buffer = await Bun.file(filePath).arrayBuffer();

  // Step 1: Declare upload intent
  const intentResponse = await fetch(`${NOTION_API_URL}/file_uploads`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ filename, content_type: contentType }),
  });

  if (!intentResponse.ok) {
    const err = await intentResponse.json().catch(() => ({}));
    throw new Error(`Upload intent failed ${intentResponse.status}: ${JSON.stringify(err)}`);
  }

  const intent = await intentResponse.json();
  const uploadId = intent.id as string;
  const uploadUrl = intent.upload_url as string;

  // Step 2: Send file bytes
  const form = new FormData();
  form.append("file", new File([buffer], filename, { type: contentType }));

  const sendResponse = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
    },
    body: form,
  });

  if (!sendResponse.ok) {
    const err = await sendResponse.json().catch(() => ({}));
    throw new Error(`Upload send failed ${sendResponse.status}: ${JSON.stringify(err)}`);
  }

  const sent = await sendResponse.json();
  if (sent.status !== "uploaded") throw new Error(`Unexpected upload status: ${sent.status}`);

  return uploadId;
}

async function updatePageWithNewImage(apiKey: string, pageId: string, uploadId: string, altText: string): Promise<void> {
  // Get existing blocks to find the image block
  const blocksResponse = await fetch(`${NOTION_API_URL}/blocks/${pageId}/children`, {
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
    },
  });

  if (!blocksResponse.ok) {
    console.warn(`  ⚠️  Could not fetch page blocks`);
    return;
  }

  const blocks = await blocksResponse.json();
  const imageBlock = blocks.results?.find((b: any) => b.type === "image");

  if (imageBlock) {
    // Update existing image block
    const updateResponse = await fetch(`${NOTION_API_URL}/blocks/${imageBlock.id}`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: {
          type: "file_upload",
          file_upload: { id: uploadId },
          caption: [{ type: "text", text: { content: altText } }],
        },
      }),
    });

    if (!updateResponse.ok) {
      const err = await updateResponse.json().catch(() => ({}));
      console.warn(`  ⚠️  Image block update failed: ${JSON.stringify(err)}`);
    } else {
      console.log(`  ✅ Image block updated`);
    }
  } else {
    // Add new image block
    await fetch(`${NOTION_API_URL}/blocks/${pageId}/children`, {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Notion-Version": NOTION_VERSION,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        children: [{
          object: "block",
          type: "image",
          image: {
            type: "file_upload",
            file_upload: { id: uploadId },
            caption: [{ type: "text", text: { content: altText } }],
          },
        }],
      }),
    });
    console.log(`  ✅ Image block added`);
  }
}

async function createGifPage(
  apiKey: string,
  filename: string,
  uploadId: string,
  meta: { imageName: string; imageId: string; displayName: string; workflowId: string; workflowNotionId: string }
): Promise<string> {
  const pageBody = {
    parent: { type: "database_id", database_id: IMAGES_DB },
    properties: {
      "Image Name": { title: [{ text: { content: meta.imageName } }] },
      "Image ID": { rich_text: [{ text: { content: meta.imageId } }] },
      "File Name": { rich_text: [{ text: { content: filename } }] },
      "Image Type": { select: { name: "Social" } },
      "Model": { select: { name: "wan-720p" } },
      "Style": { select: { name: "Animated GIF" } },
      "Aspect Ratio": { select: { name: "4:5" } },
      "Resolution": { rich_text: [{ text: { content: "540x675" } }] },
      "Status": { select: { name: "Generated" } },
      "Tags": { multi_select: [{ name: "LinkedIn" }, { name: "Animated GIF" }, { name: "Replicate" }] },
      "Workflow": { relation: [{ id: meta.workflowNotionId }] },
    },
  };

  const page = await fetch(`${NOTION_API_URL}/pages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pageBody),
  });

  if (!page.ok) {
    const err = await page.json().catch(() => ({}));
    throw new Error(`Page creation failed ${page.status}: ${JSON.stringify(err)}`);
  }

  const created = await page.json();
  const pageId = created.id as string;

  // Add image block
  await fetch(`${NOTION_API_URL}/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      children: [{
        object: "block",
        type: "image",
        image: {
          type: "file_upload",
          file_upload: { id: uploadId },
          caption: [{ type: "text", text: { content: `LinkedIn Animated GIF — ${meta.displayName}` } }],
        },
      }],
    }),
  });

  return pageId;
}

// --- Main ---
const apiKey = loadNotionApiKey();
const metadata = JSON.parse(readFileSync(METADATA_PATH, "utf-8"));
const workflowId = metadata.workflow_id as string;
const workflowNotionId = metadata.notion?.workflow_id as string;

console.log(`🔄 Pushing updated images to Notion`);
console.log(`   Workflow: ${workflowId}\n`);

const newNotionIds: { file: string; notion_id: string; notion_url: string; is_gif?: boolean }[] = [];

// ─── 1. Update featured frame PNG ───
console.log(`1/3 Updating post-03-featured-frame.png in Notion...`);
const featuredPath = join(IMAGES_DIR, "post-03-featured-frame.png");
if (existsSync(featuredPath)) {
  process.stdout.write(`  📤 Uploading new PNG...`);
  const uploadId = await uploadToNotion(apiKey, featuredPath);
  console.log(` ✅ (uploadId: ${uploadId})`);

  process.stdout.write(`  📝 Updating Notion page...`);
  await updatePageWithNewImage(apiKey, FEATURED_FRAME_NOTION_ID, uploadId, "Featured Frame — The Refinery Principle");

  const notionUrl = `https://www.notion.so/${FEATURED_FRAME_NOTION_ID.replace(/-/g, "")}`;
  console.log(`  🔗 ${notionUrl}\n`);
} else {
  console.log(`  ⚠️  File not found: ${featuredPath}\n`);
}

// ─── 2. Push story GIF ───
console.log(`2/3 Pushing post-03-story-animated-linkedin.gif...`);
const storyGifPath = join(IMAGES_DIR, "post-03-story-animated-linkedin.gif");
if (existsSync(storyGifPath)) {
  process.stdout.write(`  📤 Uploading GIF...`);
  const uploadId = await uploadToNotion(apiKey, storyGifPath);
  console.log(` ✅ (uploadId: ${uploadId})`);

  process.stdout.write(`  📝 Creating Notion page...`);
  const pageId = await createGifPage(apiKey, "post-03-story-animated-linkedin.gif", uploadId, {
    imageName: `Story Post — Animated GIF — ${workflowId}`,
    imageId: `${workflowId}-post-03-story-animated`,
    displayName: "Story Post — Animated GIF",
    workflowId,
    workflowNotionId,
  });
  const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, "")}`;
  console.log(` ✅`);
  console.log(`  🔗 ${notionUrl}\n`);
  newNotionIds.push({ file: "post-03-story-animated-linkedin.gif", notion_id: pageId, notion_url: notionUrl, is_gif: true });
} else {
  console.log(`  ⚠️  File not found: ${storyGifPath}\n`);
}

// ─── 3. Push myth-buster GIF ───
console.log(`3/3 Pushing post-04-myth-buster-animated-linkedin.gif...`);
const mythGifPath = join(IMAGES_DIR, "post-04-myth-buster-animated-linkedin.gif");
if (existsSync(mythGifPath)) {
  process.stdout.write(`  📤 Uploading GIF...`);
  const uploadId = await uploadToNotion(apiKey, mythGifPath);
  console.log(` ✅ (uploadId: ${uploadId})`);

  process.stdout.write(`  📝 Creating Notion page...`);
  const pageId = await createGifPage(apiKey, "post-04-myth-buster-animated-linkedin.gif", uploadId, {
    imageName: `Myth-Buster — Animated GIF — ${workflowId}`,
    imageId: `${workflowId}-post-04-myth-buster-animated`,
    displayName: "Myth-Buster — Animated GIF",
    workflowId,
    workflowNotionId,
  });
  const notionUrl = `https://www.notion.so/${pageId.replace(/-/g, "")}`;
  console.log(` ✅`);
  console.log(`  🔗 ${notionUrl}\n`);
  newNotionIds.push({ file: "post-04-myth-buster-animated-linkedin.gif", notion_id: pageId, notion_url: notionUrl, is_gif: true });
} else {
  console.log(`  ⚠️  File not found: ${mythGifPath}\n`);
}

// ─── Update metadata.json ───
if (newNotionIds.length > 0) {
  const existingIds = metadata.checkpoints["step-13b"]?.notion_image_ids ?? [];
  const mergedIds = [
    ...existingIds.filter((e: any) => !newNotionIds.some(n => n.file === e.file)),
    ...newNotionIds,
  ];
  metadata.checkpoints["step-13b"].notion_image_ids = mergedIds;
  metadata.checkpoints["step-13b"].gif_push_timestamp = new Date().toISOString();
  metadata.updated_at = new Date().toISOString();
  writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
  console.log(`💾 metadata.json updated with ${newNotionIds.length} new GIF entries`);
}

console.log(`\n✅ Done!`);
