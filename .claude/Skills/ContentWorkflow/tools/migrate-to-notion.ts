#!/usr/bin/env bun

/**
 * One-Time Migration Script
 *
 * Migrates the 2026-01-31-playing-it-safe-illusion workflow to Notion.
 *
 * Usage:
 *   bun run migrate-to-notion.ts
 */

import { readFileSync, readdirSync, existsSync } from "fs";
import { join } from "path";
import { notionSync } from "./notion-sync";

const WORKFLOW_DIR = join(
  process.env.HOME!,
  "PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion"
);

interface LinkedInPostFrontmatter {
  format_type: string;
  funnel_position: string;
  engagement_potential: string;
  posting_order: string;
  hook_type: string;
  word_count: string;
  estimated_read_time: string;
}

/**
 * Parse frontmatter from markdown file
 */
function parseFrontmatter(content: string): {
  frontmatter: LinkedInPostFrontmatter;
  body: string;
} {
  const match = content.match(/^---\nMETADATA:\n([\s\S]*?)\n---\n([\s\S]*)$/);

  if (!match) {
    return { frontmatter: {} as LinkedInPostFrontmatter, body: content };
  }

  const frontmatter: any = {};
  const yamlLines = match[1].split("\n");

  yamlLines.forEach(line => {
    const keyValue = line.match(/^(\w+):\s*"?(.+?)"?$/);
    if (keyValue) {
      frontmatter[keyValue[1]] = keyValue[2].replace(/^["']|["']$/g, "");
    }
  });

  return { frontmatter, body: match[2] };
}

/**
 * Map format_type to LinkedIn Format enum
 */
function mapLinkedInFormat(formatType: string): string {
  const mapping: Record<string, string> = {
    "Authority Post (Credibility + Framework)": "Authority Post",
    "Framework Article": "Framework Article",
    "Story Post": "Story",
    "Case Study": "Story",
    "Myth Busting": "Mythbuster",
    "Quick Win": "Proof",
    "Authority Post (Stats)": "Authority Post",
    "Implementation Guide": "Framework Article"
  };

  return mapping[formatType] || "Authority Post";
}

/**
 * Map hook_type to Hook Type enum
 */
function mapHookType(hookType: string): string {
  if (hookType.includes("Contrarian")) return "Contrarian";
  if (hookType.includes("Statistic")) return "Statistic";
  if (hookType.includes("Question")) return "Question";
  if (hookType.includes("Bold")) return "Bold Statement";
  return "Story";
}

/**
 * Map funnel_position to Funnel Position enum
 */
function mapFunnelPosition(position: string): string {
  const mapping: Record<string, string> = {
    "Top": "Awareness",
    "Middle": "Consideration",
    "Bottom": "Decision"
  };

  return mapping[position] || "Awareness";
}

/**
 * Main migration function
 */
async function migrate() {
  console.log(`\n🚀 Starting migration for 2026-01-31-playing-it-safe-illusion\n`);

  // Load metadata
  const metadataPath = join(WORKFLOW_DIR, "metadata.json");
  const metadata = JSON.parse(readFileSync(metadataPath, "utf-8"));

  // Step 1: Create Workflow entry
  console.log(`📋 Step 1: Creating Workflow entry...`);

  const workflowId = await notionSync.createWorkflow({
    workflow_id: metadata.workflow_id,
    topic: metadata.topic,
    big_idea: metadata.big_idea,
    magic_mechanism: metadata.magic_mechanism,
    status: "Complete",
    current_step: "Complete",
    wordpress_url: metadata.checkpoints["step-12"].wordpress_url,
    wordpress_post_id: metadata.checkpoints["step-12"].wordpress_post_id,
    campaign_start: "2026-02-10",
    campaign_end: "2026-02-28",
    local_directory: WORKFLOW_DIR
  });

  console.log(`✅ Workflow created: ${workflowId}\n`);

  // Step 2: Create Image entries
  console.log(`🖼️  Step 2: Creating Image entries...`);

  const imagesDir = join(WORKFLOW_DIR, "images");
  const imageFiles = ["01-featured.png", "02-flywheel.png", "03-compound-curve.png"];
  const imageNotionIds: string[] = [];

  const imageData = [
    {
      name: "Featured Image - Singapore AI Strategy",
      type: "Featured" as const,
      style: "Photorealistic" as const,
      prompt: "User-provided image for Singapore AI strategy post"
    },
    {
      name: "Flywheel Diagram - Grow-With Model",
      type: "Inline" as const,
      style: "Napkin" as const,
      prompt: "Napkin-style diagram showing the Grow-With Model flywheel: early partnership → learning → capability → loyalty → competitive advantage"
    },
    {
      name: "Compound Curve - AI Learning vs Investment",
      type: "Inline" as const,
      style: "Da Vinci" as const,
      prompt: "Da Vinci-style chart showing compound learning curve vs linear investment curve"
    }
  ];

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    const data = imageData[i];

    const imageId = await notionSync.createImage({
      image_name: data.name,
      image_id: `${metadata.workflow_id}-${i + 1}-${data.type.toLowerCase()}`,
      file_name: file,
      file_path: join(imagesDir, file),
      image_type: data.type,
      model: "ulart-v1",
      style: data.style,
      prompt: data.prompt,
      aspect_ratio: "16:9",
      resolution: "1920x1080",
      wordpress_media_id: metadata.checkpoints["step-12"].images_uploaded[file],
      wordpress_url: `https://alvishouse.io/wp-content/uploads/2026/01/${file}`,
      status: "Published",
      workflow_notion_id: workflowId
    });

    imageNotionIds.push(imageId);
    console.log(`✅ Image created: ${file} → ${imageId}`);
  }

  console.log(``);

  // Step 3: Create Cornerstone Content entry
  console.log(`📄 Step 3: Creating Cornerstone Content entry...`);

  const cornerstoneFile = join(WORKFLOW_DIR, "06-cornerstone-draft-v3.md");
  const cornerstoneContent = readFileSync(cornerstoneFile, "utf-8");
  const cornerstoneWordCount = cornerstoneContent.split(/\s+/).length;

  const cornerstoneId = await notionSync.createContent({
    content_name: metadata.selected_headline.headline,
    content_type: "Cornerstone Blog",
    platform: "Essay",
    word_count: cornerstoneWordCount,
    local_file_path: cornerstoneFile,
    workflow_notion_id: workflowId,
    image_notion_ids: imageNotionIds,
    status: "Published",
    publish_date: "2026-02-03",
    estimated_read_time: Math.ceil(cornerstoneWordCount / 200),
    strategic_notes: `Big Idea: ${metadata.big_idea}\nMagic Mechanism: ${metadata.magic_mechanism}`
  });

  console.log(`✅ Cornerstone created: ${cornerstoneId}\n`);

  // Step 4: Create LinkedIn Post entries
  console.log(`📱 Step 4: Creating LinkedIn Post entries...`);

  const linkedinDir = join(WORKFLOW_DIR, "13-extracted-content/linkedin/posts");
  const postFiles = readdirSync(linkedinDir)
    .filter(f => f.endsWith(".md"))
    .sort();

  const linkedinNotionIds: string[] = [];

  for (const postFile of postFiles) {
    const postPath = join(linkedinDir, postFile);
    const postContent = readFileSync(postPath, "utf-8");
    const { frontmatter, body } = parseFrontmatter(postContent);

    // Extract title from first line of body
    const firstLine = body.split("\n").find(line => line.trim().length > 0) || "";
    const title = firstLine.substring(0, 80).replace(/[*_]/g, "");

    const contentId = await notionSync.createContent({
      content_name: title || postFile.replace(".md", ""),
      content_type: "LinkedIn Post",
      platform: "LinkedIn",
      linkedin_format: mapLinkedInFormat(frontmatter.format_type),
      word_count: parseInt(frontmatter.word_count),
      posting_priority: parseInt(frontmatter.posting_order),
      hook_type: mapHookType(frontmatter.hook_type),
      funnel_position: mapFunnelPosition(frontmatter.funnel_position),
      estimated_read_time: parseInt(frontmatter.estimated_read_time),
      local_file_path: postPath,
      workflow_notion_id: workflowId,
      featured_image_notion_id: imageNotionIds[0], // All use featured image
      status: "Idea",
      engagement_score: frontmatter.engagement_potential === "HIGH" ? 8 : 6
    });

    linkedinNotionIds.push(contentId);
    console.log(`✅ LinkedIn post created: ${postFile.substring(0, 30)}... → ${contentId}`);
  }

  console.log(``);

  // Step 5: Link images to all content
  console.log(`🔗 Step 5: Linking images to content...`);

  // Link all images to cornerstone
  for (const imageId of imageNotionIds) {
    await notionSync.linkImageToContent(imageId, cornerstoneId);
  }

  console.log(`✅ Linked ${imageNotionIds.length} images to cornerstone`);

  // Link featured image to all LinkedIn posts
  for (const postId of linkedinNotionIds) {
    await notionSync.linkImageToContent(imageNotionIds[0], postId);
  }

  console.log(`✅ Linked featured image to ${linkedinNotionIds.length} LinkedIn posts\n`);

  // Summary
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✅ Migration Complete!`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
  console.log(`📊 Summary:`);
  console.log(`   Workflow:        ${workflowId}`);
  console.log(`   Images:          ${imageNotionIds.length} created`);
  console.log(`   Cornerstone:     ${cornerstoneId}`);
  console.log(`   LinkedIn Posts:  ${linkedinNotionIds.length} created`);
  console.log(`   Total Entries:   ${1 + imageNotionIds.length + 1 + linkedinNotionIds.length}`);
  console.log(``);
  console.log(`🔍 Verify in Notion:`);
  console.log(`   1. Open Content Workflows database`);
  console.log(`   2. Search for: "2026-01-31-playing-it-safe-illusion"`);
  console.log(`   3. Check relations to Images and Content`);
  console.log(``);
}

// Run migration
migrate()
  .then(() => {
    console.log(`✨ Done!`);
    process.exit(0);
  })
  .catch(error => {
    console.error(`\n❌ Migration failed: ${error}`);
    console.error(error.stack);
    process.exit(1);
  });
