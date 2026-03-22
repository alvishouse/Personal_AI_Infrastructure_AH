#!/usr/bin/env bun

/**
 * Add image blocks to the page content of image entries
 */

import { notionSync } from "./notion-sync";

const IMAGE_IDS = [
  {
    notion_id: "3030760e-b0cd-8131-b21b-ddbd89c2b44b",
    image_url: "https://alvishouse.io/wp-content/uploads/2026/02/01-featured-300x192.png",
    name: "Featured Image - Singapore AI Strategy",
    caption: "Featured image for the cornerstone blog post"
  },
  {
    notion_id: "3030760e-b0cd-81be-8c23-deaea41ab64e",
    image_url: "https://alvishouse.io/wp-content/uploads/2026/02/02-flywheel-300x300.jpg",
    name: "Flywheel Diagram - Grow-With Model",
    caption: "Napkin-style diagram showing the Grow-With Model flywheel"
  },
  {
    notion_id: "3030760e-b0cd-81c3-8cb6-d665ac7bf4fa",
    image_url: "https://alvishouse.io/wp-content/uploads/2026/02/03-compound-curve-300x167.jpg",
    name: "Compound Curve - AI Learning vs Investment",
    caption: "Da Vinci-style chart showing compound learning curve"
  }
];

async function addImageContent() {
  console.log("📸 Adding images to page content...\n");

  for (const image of IMAGE_IDS) {
    try {
      // Add image block to page content
      await (notionSync as any).notionRequest(`/blocks/${image.notion_id}/children`, {
        method: "PATCH",
        body: JSON.stringify({
          children: [
            {
              type: "heading_2",
              heading_2: {
                rich_text: [
                  {
                    type: "text",
                    text: { content: image.name }
                  }
                ]
              }
            },
            {
              type: "image",
              image: {
                type: "external",
                external: {
                  url: image.image_url
                },
                caption: [
                  {
                    type: "text",
                    text: { content: image.caption }
                  }
                ]
              }
            },
            {
              type: "divider",
              divider: {}
            }
          ]
        })
      });

      console.log(`✅ Added image content to ${image.name}`);
    } catch (error) {
      console.error(`❌ Failed to add content to ${image.name}: ${error}`);
    }
  }

  console.log("\n✨ Done! Images are now visible in page content!");
}

addImageContent();
