#!/usr/bin/env bun
/**
 * Push Newsletter Issue #5 to Notion Content Database
 * Campaign: 2026-03-22-refinery-principle
 */

import { readFileSync } from "fs";

const NOTION_TOKEN = "ntn_V1980674253b9fUYx7YMQTfkjff8dcG3dFxr3rRp9199Hb";
const CONTENT_DB = "3030760eb0cd81c5874be6f7e9637807";
const NEWSLETTER_ICON = "https://alvishouse.io/wp-content/uploads/2026/02/newsletter-icon.png";

// From metadata.json
const CORNERSTONE_NOTION_ID = "32c0760e-b0cd-8107-a1c9-d8e8a7fbed13";
const WORKFLOW_NOTION_ID = "32c0760e-b0cd-81b7-a617-e1d6131d42ae";

const NEWSLETTER_PATH = "/home/alvis/PAI/scratchpad/content-create/2026-03-22-refinery-principle/14-newsletter/newsletter-final.md";

const headers = {
  "Authorization": `Bearer ${NOTION_TOKEN}`,
  "Content-Type": "application/json",
  "Notion-Version": "2022-06-28",
};

// Parse markdown into Notion blocks
function markdownToNotionBlocks(markdown: string): any[] {
  const blocks: any[] = [];
  const lines = markdown.split("\n");
  let i = 0;

  // Skip frontmatter
  if (lines[0] === "---") {
    i = 1;
    while (i < lines.length && lines[i] !== "---") i++;
    i++; // skip closing ---
    i++; // skip blank line after frontmatter
  }

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: line.replace("## ", "") } }],
        },
      });
    } else if (line.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_1",
        heading_1: {
          rich_text: [{ type: "text", text: { content: line.replace("# ", "") } }],
        },
      });
    } else if (line.match(/^---+$/)) {
      blocks.push({ object: "block", type: "divider", divider: {} });
    } else if (line.trim() === "") {
      // skip blank lines
    } else {
      // Regular paragraph — split into 1900-char chunks
      const text = line;
      if (text.length > 0) {
        const chunks: string[] = [];
        for (let start = 0; start < text.length; start += 1900) {
          chunks.push(text.slice(start, start + 1900));
        }
        for (const chunk of chunks) {
          // Handle bold text
          const richText = parseInlineMarkdown(chunk);
          blocks.push({
            object: "block",
            type: "paragraph",
            paragraph: { rich_text: richText },
          });
        }
      }
    }
    i++;
  }

  return blocks;
}

function parseInlineMarkdown(text: string): any[] {
  const parts: any[] = [];
  const regex = /\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: { content: text.slice(lastIndex, match.index) } });
    }
    if (match[1]) {
      // Bold
      parts.push({ type: "text", text: { content: match[1] }, annotations: { bold: true } });
    } else if (match[2] && match[3]) {
      // Link
      parts.push({ type: "text", text: { content: match[2], link: { url: match[3] } } });
    }
    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push({ type: "text", text: { content: text.slice(lastIndex) } });
  }

  return parts.length > 0 ? parts : [{ type: "text", text: { content: text } }];
}

async function pushToNotion() {
  const newsletterContent = readFileSync(NEWSLETTER_PATH, "utf-8");

  // Build body blocks
  const calloutBlock = {
    object: "block",
    type: "callout",
    callout: {
      rich_text: [
        {
          type: "text",
          text: {
            content: "📬 Issue #5 · April 1, 2026 · Subject: \"Your AI outputs aren't failing. They're unrefined.\" · Preheader: \"Why 80% of what your tools produce never reaches a decision\" · Validation: 0.95/1.0 · Forward Test: 5/5 · Words: 1,847",
          },
        },
      ],
      icon: { type: "emoji", emoji: "📬" },
      color: "blue_background",
    },
  };

  const contentBlocks = markdownToNotionBlocks(newsletterContent);
  const allBlocks = [calloutBlock, { object: "block", type: "divider", divider: {} }, ...contentBlocks];

  // Notion API max 100 children per request
  const firstBatch = allBlocks.slice(0, 95);
  const remainingBatches: any[][] = [];
  for (let i = 95; i < allBlocks.length; i += 95) {
    remainingBatches.push(allBlocks.slice(i, i + 95));
  }

  // Create the page
  const pagePayload = {
    parent: { database_id: CONTENT_DB },
    icon: { type: "external", external: { url: NEWSLETTER_ICON } },
    properties: {
      "Content Name": {
        title: [{ text: { content: "Newsletter Issue #5: Your AI outputs aren't failing. They're unrefined." } }],
      },
      "Platform": { select: { name: "Newsletter" } },
      "Content Type": { select: { name: "Newsletter" } },
      "Status": { status: { name: "In Progress" } },
      "Campaign": { select: { name: "2026-03-22-refinery-principle" } },
      "Word Count": { number: 1847 },
      "Estimated Read Time": { number: 7 },
    },
    children: firstBatch,
  };

  console.log("Creating Notion page...");
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers,
    body: JSON.stringify(pagePayload),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Failed to create page:", error);
    process.exit(1);
  }

  const page = await response.json() as any;
  const pageId = page.id;
  console.log(`✓ Page created: ${pageId}`);
  console.log(`  URL: https://www.notion.so/${pageId.replace(/-/g, "")}`);

  // Append remaining blocks if any
  for (const batch of remainingBatches) {
    const appendResponse = await fetch(`https://api.notion.com/v1/blocks/${pageId}/children`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ children: batch }),
    });
    if (!appendResponse.ok) {
      const error = await appendResponse.text();
      console.error("Failed to append blocks:", error);
    } else {
      console.log(`✓ Appended ${batch.length} more blocks`);
    }
  }

  // Add relations: Related Content (cornerstone) and Workflow
  // Try to update with relations
  const updatePayload: any = { properties: {} };

  // Try to link Related Content
  try {
    const relUpdateResponse = await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({
        properties: {
          "Related Content": {
            relation: [{ id: CORNERSTONE_NOTION_ID }],
          },
          "Workflow": {
            relation: [{ id: WORKFLOW_NOTION_ID }],
          },
        },
      }),
    });
    if (relUpdateResponse.ok) {
      console.log("✓ Relations linked (cornerstone + workflow)");
    } else {
      const err = await relUpdateResponse.text();
      console.log("Note: Could not set relations (may need different property names):", err.slice(0, 100));
    }
  } catch (e) {
    console.log("Note: Relations update skipped");
  }

  console.log("\n✅ Newsletter pushed to Notion successfully!");
  console.log(`   Page ID: ${pageId}`);
  console.log(`   URL: https://www.notion.so/${pageId.replace(/-/g, "")}`);

  return { pageId, pageUrl: `https://www.notion.so/${pageId.replace(/-/g, "")}` };
}

const result = await pushToNotion();
console.log(JSON.stringify(result, null, 2));
