#!/usr/bin/env bun

import { ContentWorkflowNotionSync } from "/home/alvis/PAI/.claude/Skills/ContentWorkflow/tools/notion-sync";

const sync = new ContentWorkflowNotionSync();

async function pushImageToNotion() {
  console.log("🖼️  Pushing Singapore napkin sketch to Notion...\n");

  // Get workflow notion ID from the authority post
  const workflowNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3"; // From Post 1 metadata

  const imageMetadata = {
    image_name: "Singapore AI Paradox - Napkin Sketch",
    image_id: "2026-01-31-playing-it-safe-singapore-napkin",
    file_name: "singapore-napkin-sketch.png",
    file_path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png",
    image_type: "Social" as const,
    model: "ulart-v1" as const, // Using ulart-v1 since nano-banana-pro maps to this
    style: "Napkin" as const,
    prompt: "Spontaneous sketch on paper napkin showing 'PLAYING IT SAFE = FAILING SLOWLY' paradox with Singapore $1B investment context. Two diverging paths: 'WAIT FOR PROOF' vs 'START LEARNING NOW'. Clean napkin with only ballpoint blue ink, gestural lines, hurried all-caps handwriting. Visible corrections (XXX marks). Napkin texture throughout.",
    aspect_ratio: "16:9" as const,
    resolution: "1792x1024 (2K)",
    alt_text: "Napkin sketch showing the paradox: 'Playing it Safe = Failing Slowly' with Singapore's $1B AI investment as context. Two paths diverge - waiting for proof leads to 'too late', starting learning now leads to compound advantage.",
    tags: ["LinkedIn", "Authority Post", "Singapore", "AI Strategy", "Napkin Sketch"],
    status: "Generated" as const,
    workflow_notion_id: workflowNotionId
  };

  try {
    const notionId = await sync.createImage(imageMetadata);
    console.log(`\n✅ Image successfully added to Notion!`);
    console.log(`📍 Notion ID: ${notionId}`);
    console.log(`🔗 Image linked to workflow: ${workflowNotionId}`);
    console.log(`\n📊 Status: Generated`);
    console.log(`📁 Local path: ${imageMetadata.file_path}`);
  } catch (error) {
    console.error(`❌ Failed to push image to Notion: ${error}`);
    process.exit(1);
  }
}

pushImageToNotion();
