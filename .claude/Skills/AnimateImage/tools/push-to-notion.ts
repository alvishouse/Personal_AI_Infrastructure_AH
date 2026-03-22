#!/usr/bin/env bun
/**
 * push-to-notion.ts — Upload animated GIF to Notion Content Images DB
 *
 * Does everything in one shot:
 *   1. Upload GIF directly to Notion file storage
 *   2. Create a new Content Images DB entry (separate from the static image entry)
 *   3. Add GIF as an image block inside the new page
 *   4. Find the article in the Content DB and append to its Images relation
 *      (preserving all existing image links)
 *
 * Usage:
 *   bun run push-to-notion.ts \
 *     --gif /path/to/post-02-ow-animated-linkedin.gif \
 *     --campaign "2026-02-15-dumb-pipe" \
 *     --post-num "02" \
 *     --post-name "2 Arms vs Intelligence Layer" \
 *     --article-title "Outgunned"
 *
 * --article-title: partial match used to find the article in Content DB
 */

import { readFileSync, existsSync } from "node:fs";
import { resolve, basename } from "node:path";

// ─── Load env ─────────────────────────────────────────────────────────────────
const ENV_PATH = resolve(import.meta.dir, "../../../.env");
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, "utf-8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim();
  }
}

// Also check mcpServers.json as fallback (where NOTION_API_KEY lives)
if (!process.env.NOTION_API_KEY) {
  const mcpPath = resolve(import.meta.dir, "../../../../.claude/mcpServers.json");
  if (existsSync(mcpPath)) {
    try {
      const mcp = JSON.parse(readFileSync(mcpPath, "utf-8"));
      const key = mcp?.mcpServers?.notion?.env?.NOTION_API_KEY;
      if (key) process.env.NOTION_API_KEY = key;
    } catch {}
  }
}

const NOTION_KEY = process.env.NOTION_API_KEY;
if (!NOTION_KEY) {
  console.error("❌ NOTION_API_KEY not found in .env or mcpServers.json");
  process.exit(1);
}

// ─── Notion DB IDs ────────────────────────────────────────────────────────────
const IMAGES_DB_ID  = "2733021756a1447d84a7143e2e9e97dd"; // Content Images DB
const CONTENT_DB_ID = "3030760eb0cd81c5874be6f7e9637807"; // Content (LinkedIn posts) DB

// ─── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const gifPath     = getArg("--gif");
const campaign    = getArg("--campaign");     // e.g. "2026-02-15-dumb-pipe"
const postNum     = getArg("--post-num");     // e.g. "02"
const postName    = getArg("--post-name");    // e.g. "2 Arms vs Intelligence Layer"
const articleTitle = getArg("--article-title"); // partial match, e.g. "Outgunned"

if (!gifPath || !campaign || !postNum || !postName || !articleTitle) {
  console.error(`Usage: push-to-notion.ts
  --gif /path/to/file.gif
  --campaign "2026-02-15-dumb-pipe"
  --post-num "02"
  --post-name "2 Arms vs Intelligence Layer"
  --article-title "Outgunned"`);
  process.exit(1);
}

const absGifPath = resolve(gifPath);
if (!existsSync(absGifPath)) {
  console.error(`❌ GIF not found: ${absGifPath}`);
  process.exit(1);
}

const gifFileName = basename(absGifPath);
const gifSizeMb   = (readFileSync(absGifPath).length / 1024 / 1024).toFixed(1);

// ─── Notion API helper ────────────────────────────────────────────────────────
async function notion(method: string, path: string, body?: object) {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${NOTION_KEY}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

console.log(`\n📤 Push to Notion`);
console.log(`   GIF      : ${absGifPath} (${gifSizeMb}MB)`);
console.log(`   Campaign : ${campaign}`);
console.log(`   Post     : ${postNum} — ${postName}\n`);

// ─── Step 1: Upload GIF to Notion file storage ────────────────────────────────
console.log("⬆️  Uploading GIF to Notion...");

const uploadSession = await notion("POST", "/file_uploads", { type: "single_part" });
const fileUploadId  = uploadSession.id;

const formData = new FormData();
const gifBuffer = readFileSync(absGifPath);
formData.append("file", new Blob([gifBuffer], { type: "image/gif" }), gifFileName);

const uploadRes = await fetch(
  `https://api.notion.com/v1/file_uploads/${fileUploadId}/send`,
  {
    method: "POST",
    headers: { Authorization: `Bearer ${NOTION_KEY}`, "Notion-Version": "2022-06-28" },
    body: formData,
  }
);
const uploadResult = await uploadRes.json();
if (uploadResult.status !== "uploaded") {
  console.error("❌ Upload failed:", uploadResult);
  process.exit(1);
}
console.log(`   ✅ Uploaded (ID: ${fileUploadId})`);

// ─── Step 2: Create new Content Images DB entry ───────────────────────────────
console.log("\n📄 Creating Notion DB entry...");

const imageId   = `${campaign}-post-${postNum}-animated-gif`;
const imageName = `Post ${postNum} — ${postName} (Animated GIF) — ${campaign}`;

const newPage = await notion("POST", "/pages", {
  parent: { database_id: IMAGES_DB_ID },
  properties: {
    "Image Name":  { title:     [{ text: { content: imageName } }] },
    "Image ID":    { rich_text: [{ text: { content: imageId   } }] },
    "Style":       { select:    { name: "Animated" } },
    "Model":       { select:    { name: "animated" } },
    "Image Type":  { select:    { name: "Animated GIF" } },
    "Status":      { select:    { name: "Generated" } },
    "File Name":   { rich_text: [{ text: { content: gifFileName } }] },
    "Campaign":    { select:    { name: campaign } },
    "Aspect Ratio":{ select:    { name: "4:5" } },
    "Resolution":  { rich_text: [{ text: { content: "540x675px" } }] },
  },
});

if (!newPage.id) {
  console.error("❌ Failed to create DB entry:", newPage.message);
  process.exit(1);
}

const newPageId = newPage.id.replace(/-/g, "");
console.log(`   ✅ DB entry created: ${newPage.id}`);

// ─── Step 3: Add GIF as image block inside the new page ──────────────────────
console.log("\n🖼️  Adding image block to page...");

const blockRes = await notion("PATCH", `/blocks/${newPageId}/children`, {
  children: [{
    type: "image",
    image: {
      type: "file_upload",
      file_upload: { id: fileUploadId },
      caption: [{ type: "text", text: { content: imageName } }],
    },
  }],
});

if (blockRes.object !== "list") {
  console.error("❌ Failed to add image block:", blockRes.message);
  process.exit(1);
}
console.log("   ✅ Image block added");

// ─── Step 4: Find article in Content DB and append to Images relation ─────────
console.log(`\n🔗 Finding article containing "${articleTitle}"...`);

const contentQuery = await notion("POST", `/databases/${CONTENT_DB_ID}/query`, {
  filter: { property: "Content Name", title: { contains: articleTitle } },
});

const article = contentQuery.results?.[0];
if (!article) {
  console.error(`❌ Article not found matching "${articleTitle}"`);
  process.exit(1);
}

const articlePageId = article.id.replace(/-/g, "");
const articleTitle_ = article.properties["Content Name"]?.title?.[0]?.plain_text || article.id;
console.log(`   ✅ Found: "${articleTitle_}"`);

// Get existing image relations
const existingImages: { id: string }[] = article.properties["Images"]?.relation || [];
console.log(`   Existing images linked: ${existingImages.length}`);

// Append new animated GIF entry (preserve existing)
const updatedImages = [...existingImages, { id: newPage.id }];
const updateRes = await notion("PATCH", `/pages/${articlePageId}`, {
  properties: {
    Images: { relation: updatedImages },
  },
});

if (updateRes.object !== "page") {
  console.error("❌ Failed to update article Images relation:", updateRes.message);
  process.exit(1);
}

console.log(`   ✅ Linked to article (total images: ${updatedImages.length})`);

// ─── Done ─────────────────────────────────────────────────────────────────────
console.log(`\n✅ All done!`);
console.log(`   Notion page : https://www.notion.so/${newPageId}`);
console.log(`   Article     : "${articleTitle_}"`);
console.log(`   Images      : ${updatedImages.length} total (static + animated)`);
