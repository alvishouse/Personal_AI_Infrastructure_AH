#!/usr/bin/env bun
/**
 * Append image blocks to Notion Content Images pages
 * Gallery view thumbnail comes from the first image block in the page body
 */

const NOTION_TOKEN = "ntn_V1980674253b9fUYx7YMQTfkjff8dcG3dFxr3rRp9199Hb";

const pages = [
  { key: "post-01", pageId: "30b0760e-b0cd-81d9-825b-f8ffd26ce18d", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-01-ow.png" },
  { key: "post-02", pageId: "30b0760e-b0cd-81fb-a356-e1f387d93390", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-02-ow.png" },
  { key: "post-03", pageId: "30b0760e-b0cd-8191-a305-c2a9eb2706fc", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-03-ow.png" },
  { key: "post-04", pageId: "30f0760e-b0cd-81e3-87c1-f336e6df99d7", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-04-ow.png" },
  { key: "post-05", pageId: "30f0760e-b0cd-815c-bec2-c1592d9c6529", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-05-ow.png" },
  { key: "post-06", pageId: "30f0760e-b0cd-81b8-9131-e4d21a3a7b48", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-06-ow.png" },
  { key: "post-07", pageId: "30b0760e-b0cd-81a0-9a7a-c226dcc882b5", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-07-ow.png" },
  { key: "post-08", pageId: "30f0760e-b0cd-8174-a3c9-c73b9fea6d73", wpUrl: "https://alvishouse.io/wp-content/uploads/2026/02/post-08-ow.png" },
];

async function appendImageBlock(pageId: string, imageUrl: string) {
  const response = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify({
      children: [
        {
          object: "block",
          type: "image",
          image: {
            type: "external",
            external: { url: imageUrl },
          },
        },
      ],
    }),
  });
  const data = await response.json() as any;
  if (!data.results) throw new Error(JSON.stringify(data));
  return data.results[0].id;
}

console.log("🖼️  Appending image blocks to Notion pages...\n");

for (const page of pages) {
  try {
    process.stdout.write(`  ${page.key}: Adding image block...`);
    const blockId = await appendImageBlock(page.pageId, page.wpUrl);
    console.log(` ✅ Block ID: ${blockId}`);
  } catch (err) {
    console.error(` ❌ ${err}`);
  }
}

console.log("\n✅ Done! Gallery thumbnails should now show in Notion.");
