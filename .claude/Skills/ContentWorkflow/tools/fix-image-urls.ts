#!/usr/bin/env bun

/**
 * Fix image WordPress URLs in Notion
 */

import { notionSync } from "./notion-sync";

const IMAGE_IDS = [
  {
    notion_id: "3030760e-b0cd-8131-b21b-ddbd89c2b44b",
    wordpress_url: "https://alvishouse.io/wp-content/uploads/2026/02/01-featured-300x192.png",
    name: "Featured Image"
  },
  {
    notion_id: "3030760e-b0cd-81be-8c23-deaea41ab64e",
    wordpress_url: "https://alvishouse.io/wp-content/uploads/2026/02/02-flywheel-300x300.jpg",
    name: "Flywheel Diagram"
  },
  {
    notion_id: "3030760e-b0cd-81c3-8cb6-d665ac7bf4fa",
    wordpress_url: "https://alvishouse.io/wp-content/uploads/2026/02/03-compound-curve-300x167.jpg",
    name: "Compound Curve"
  }
];

async function updateImageUrls() {
  console.log("🔧 Updating WordPress URLs in Notion...\n");

  for (const image of IMAGE_IDS) {
    try {
      // Update WordPress URL property
      await (notionSync as any).notionRequest(`/pages/${image.notion_id}`, {
        method: "PATCH",
        body: JSON.stringify({
          properties: {
            "WordPress URL": {
              url: image.wordpress_url
            }
          }
        })
      });

      console.log(`✅ Updated ${image.name}`);
      console.log(`   URL: ${image.wordpress_url}\n`);
    } catch (error) {
      console.error(`❌ Failed to update ${image.name}: ${error}\n`);
    }
  }

  console.log("✨ Done!");
}

updateImageUrls();
