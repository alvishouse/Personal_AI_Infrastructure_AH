#!/usr/bin/env bun

import { ContentWorkflowNotionSync } from "/home/alvis/PAI/.claude/Skills/ContentWorkflow/tools/notion-sync";

const sync = new ContentWorkflowNotionSync();

async function pushImageToNotion() {
  console.log("🎨 Pushing Excalidraw paradox illustration to Notion...\n");

  const workflowNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3"; // Authority Post

  const imageMetadata = {
    image_name: "Playing It Safe = Failing Slowly - Excalidraw",
    image_id: "2026-01-31-playing-it-safe-excalidraw",
    file_name: "singapore-excalidraw-paradox.png",
    file_path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-excalidraw-paradox.png",
    image_type: "Social" as const,
    model: "ulart-v1" as const,
    style: "Excalidraw" as const,
    prompt: "Digital whiteboard Excalidraw style illustration showing 'PLAYING IT SAFE = FAILING SLOWLY' paradox. Split composition: Left shows figure wrapped in protective bubble layers stuck on stairs (Cautious Tradition, WAIT FOR PROOF → TOO LATE in red), right shows freed figure actively climbing stairs (Bold Decision, START LEARNING NOW → COMPOUND ADVANTAGE in blue). White background, wiggly imperfect lines, hatched diagonal fills, all-caps architect font, hand-drawn with mouse quality. Singapore $1B AI investment context.",
    aspect_ratio: "16:9" as const,
    resolution: "1792x1024 (2K)",
    alt_text: "Excalidraw digital whiteboard illustration of the paradox 'Playing it Safe = Failing Slowly'. Left: figure trapped in protective bubble wrap on stairs labeled 'Cautious Tradition' with red arrow showing 'WAIT FOR PROOF' leading to 'TOO LATE'. Right: freed figure climbing stairs labeled 'Bold Decision' with blue arrow showing 'START LEARNING NOW' leading to 'COMPOUND ADVANTAGE'. Singapore $1B AI investment at top.",
    tags: ["LinkedIn", "Authority Post", "Singapore", "AI Strategy", "Excalidraw", "Whiteboard"],
    status: "Generated" as const,
    workflow_notion_id: workflowNotionId
  };

  try {
    const notionId = await sync.createImage(imageMetadata);
    console.log(`\n✅ Image successfully added to Notion!`);
    console.log(`📍 Notion ID: ${notionId}`);
    console.log(`🔗 Image linked to workflow: ${workflowNotionId}`);
    console.log(`\n📊 Status: Generated`);
    console.log(`🎨 Style: Excalidraw`);
    console.log(`📁 Local path: ${imageMetadata.file_path}`);
  } catch (error) {
    console.error(`❌ Failed to push image to Notion: ${error}`);
    process.exit(1);
  }
}

pushImageToNotion();
