#!/usr/bin/env bun

import { ContentWorkflowNotionSync } from "/home/alvis/PAI/.claude/Skills/ContentWorkflow/tools/notion-sync";

const sync = new ContentWorkflowNotionSync();

async function pushImageToNotion() {
  console.log("🎨 Pushing Modern Alchemist paradox illustration to Notion...\n");

  // Get workflow notion ID from the authority post
  const workflowNotionId = "3030760e-b0cd-8147-abba-c459b990a7a3"; // From Post 1 metadata

  const imageMetadata = {
    image_name: "Playing It Safe = Failing Slowly - Modern Alchemist",
    image_id: "2026-01-31-playing-it-safe-modern-alchemist",
    file_name: "singapore-modern-alchemist-paradox.png",
    file_path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png",
    image_type: "Social" as const,
    model: "ulart-v1" as const, // nano-banana-pro maps to ulart-v1
    style: "Modern Alchemist" as const,
    prompt: "Modern Alchemist illustration showing 'PLAYING IT SAFE = FAILING SLOWLY' paradox. Visual split: Left shows figure bound in protective layers unable to move on stairs (cautious tradition), right shows freed figure actively climbing (Singapore's bold decision). Warm cream background with faint grid, charcoal mono-line engraving style, muted gold accents on gears and compass. Technical annotations: $1B investment, Singapore 2025, compound learning curve (y = e^x). Cross-hatching on figures, geometric elements (compass rose, gears), professional serif typography.",
    aspect_ratio: "16:9" as const,
    resolution: "1792x1024 (2K)",
    alt_text: "Modern Alchemist technical illustration showing the paradox of 'Playing it Safe = Failing Slowly'. Left side: figure wrapped in protective layers, immobilized on stairs representing cautious tradition. Right side: freed figure climbing stairs representing Singapore's bold $1B AI investment decision. Includes compass rose, gears labeled 'Compound Learning', and exponential growth curve showing early partnership advantage.",
    tags: ["LinkedIn", "Authority Post", "Singapore", "AI Strategy", "Modern Alchemist", "Paradox"],
    status: "Generated" as const,
    workflow_notion_id: workflowNotionId
  };

  try {
    const notionId = await sync.createImage(imageMetadata);
    console.log(`\n✅ Image successfully added to Notion!`);
    console.log(`📍 Notion ID: ${notionId}`);
    console.log(`🔗 Image linked to workflow: ${workflowNotionId}`);
    console.log(`\n📊 Status: Generated`);
    console.log(`🎨 Style: Modern Alchemist`);
    console.log(`📁 Local path: ${imageMetadata.file_path}`);
  } catch (error) {
    console.error(`❌ Failed to push image to Notion: ${error}`);
    process.exit(1);
  }
}

pushImageToNotion();
