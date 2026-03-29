#!/usr/bin/env bun
import { readFileSync } from "fs";
import { join } from "path";

const mcpPath = join(process.env.HOME!, ".claude", "mcpServers.json");
const cfg = JSON.parse(readFileSync(mcpPath, "utf-8"));
const apiKey = cfg.mcpServers.notion.env.NOTION_API_KEY;
const NOTION_VERSION = "2022-06-28";
const PAGE_ID = "32c0760e-b0cd-8138-952a-d56d368d24b7";
const IMAGE_PATH = "/home/alvis/PAI/scratchpad/content-create/2026-03-22-refinery-principle/13-extracted-content/linkedin/images/post-03-featured-frame.png";

// Upload new PNG
import { readFileSync as readfs, basename as bn } from "fs";
const imgBuffer = await Bun.file(IMAGE_PATH).arrayBuffer();
const imgFilename = "post-03-featured-frame.png";
const intentRes = await fetch("https://api.notion.com/v1/file_uploads", {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
  body: JSON.stringify({ filename: imgFilename, content_type: "image/png" }),
});
const intent = await intentRes.json();
const UPLOAD_ID = intent.id as string;
const form = new FormData();
form.append("file", new File([imgBuffer], imgFilename, { type: "image/png" }));
const sendRes = await fetch(intent.upload_url, {
  method: "POST",
  headers: { Authorization: `Bearer ${apiKey}`, "Notion-Version": NOTION_VERSION },
  body: form,
});
const sent = await sendRes.json();
console.log(`Uploaded new PNG → uploadId: ${UPLOAD_ID} (status: ${sent.status})`);

// Get existing blocks
const blocksRes = await fetch(`https://api.notion.com/v1/blocks/${PAGE_ID}/children`, {
  headers: { Authorization: `Bearer ${apiKey}`, "Notion-Version": NOTION_VERSION }
});
const blocks = await blocksRes.json();
const imageBlocks = blocks.results?.filter((b: any) => b.type === "image") ?? [];
console.log(`Found ${imageBlocks.length} image block(s)`);

// Delete old image blocks
for (const block of imageBlocks) {
  const delRes = await fetch(`https://api.notion.com/v1/blocks/${block.id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${apiKey}`, "Notion-Version": NOTION_VERSION }
  });
  console.log(`Deleted block ${block.id}:`, delRes.ok ? "✅" : await delRes.text());
}

// Add new image block with file_upload
const appendRes = await fetch(`https://api.notion.com/v1/blocks/${PAGE_ID}/children`, {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Notion-Version": NOTION_VERSION,
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    children: [{
      object: "block",
      type: "image",
      image: {
        type: "file_upload",
        file_upload: { id: UPLOAD_ID },
        caption: [{ type: "text", text: { content: "Featured Frame — The Refinery Principle (updated)" } }]
      }
    }]
  })
});
const appended = await appendRes.json();
if (!appendRes.ok) {
  console.error("Append failed:", JSON.stringify(appended, null, 2));
} else {
  console.log("New image block added ✅");
  console.log("Page:", `https://www.notion.so/${PAGE_ID.replace(/-/g, "")}`);
}
