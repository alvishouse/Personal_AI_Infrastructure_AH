#!/usr/bin/env bun

/**
 * Add cover images to Notion image pages so they show in gallery view
 */

import { notionSync } from "./notion-sync";

const IMAGE_IDS = [
  {
    notion_id: "3030760e-b0cd-8131-b21b-ddbd89c2b44b",
    cover_url: "https://alvishouse.io/wp-content/uploads/2026/02/01-featured-300x192.png",
    name: "Featured Image"
  },
  {
    notion_id: "3030760e-b0cd-81be-8c23-deaea41ab64e",
    cover_url: "https://alvishouse.io/wp-content/uploads/2026/02/02-flywheel-300x300.jpg",
    name: "Flywheel Diagram"
  },
  {
    notion_id: "3030760e-b0cd-81c3-8cb6-d665ac7bf4fa",
    cover_url: "https://alvishouse.io/wp-content/uploads/2026/02/03-compound-curve-300x167.jpg",
    name: "Compound Curve"
  }
];

async function addImageCovers() {
  console.log("🖼️  Adding cover images to Notion pages...\n");

  for (const image of IMAGE_IDS) {
    try {
      // Set page cover
      await (notionSync as any).notionRequest(`/pages/${image.notion_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          cover: {
            type: "external",
            external: {
              url: image.cover_url
            }
          }
        })
      });

      console.log(`✅ Added cover to ${image.name}`);
    } catch (error) {
      console.error(`❌ Failed to add cover to ${image.name}: ${error}`);
    }
  }

  console.log("\n✨ Done! Images should now be visible in gallery view!");
}

addImageCovers();
