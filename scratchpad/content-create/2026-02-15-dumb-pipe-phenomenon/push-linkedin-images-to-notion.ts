#!/usr/bin/env bun
/**
 * Upload 8 LinkedIn Opening Wound images to WordPress + push to Notion Content Images DB
 */

import { readFileSync, existsSync } from 'fs';

const WP_URL = "https://alvishouse.io";
const WP_CONFIG = JSON.parse(readFileSync(`${process.env.HOME}/.claude/Skills/WordPressPublisher/config/wordpress-sites.json`, 'utf-8'));
const WP_SITE = WP_CONFIG.sites[WP_CONFIG.active_site];
const WP_CREDS = Buffer.from(`${WP_SITE.username}:${WP_SITE.password}`).toString('base64');

const NOTION_TOKEN = "ntn_V1980674253b9fUYx7YMQTfkjff8dcG3dFxr3rRp9199Hb";
const DB_ID = "2733021756a1447d84a7143e2e9e97dd";
const IMG_DIR = `${import.meta.dir}/13-extracted-content/linkedin/images`;

// Content relation page ID (Dumb Pipe content)
const CONTENT_PAGE_ID = "3090760e-b0cd-8175-bfdb-fb56f4a8a5b8";

// Existing Notion DB entry IDs (from previous session)
const EXISTING_ENTRIES: Record<string, string> = {
  "post-01": "30b0760e-b0cd-81d9-825b-f8ffd26ce18d", // Authority Post
  "post-02": "30b0760e-b0cd-81fb-a356-e1f387d93390", // Framework Article
  "post-03": "30b0760e-b0cd-8191-a305-c2a9eb2706fc", // Story Post
  "post-07": "30b0760e-b0cd-81a0-9a7a-c226dcc882b5", // Case Study
};

const posts = [
  {
    key: "post-01",
    imageName: "post-01-ow.png",
    dbName: "Authority Post — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-01-authority",
    altText: "Operations manager slumped at desk in exhaustion, graphite sketch style",
    prompt: "Operations manager in rolled sleeves and loosened tie, slumped over desk piled with unfinished reports and spreadsheets, head resting on one hand in defeat, staring at a number that won't move, face showing quiet exhaustion and resignation rather than anger, graphite pencil sketch on rough aged paper, high contrast, tired expression of someone who has stopped believing, no text",
  },
  {
    key: "post-02",
    imageName: "post-02-ow.png",
    dbName: "Framework Article — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-02-framework",
    altText: "Weathered operations manager hunched over desk late at night, vintage ink wash",
    prompt: "Weathered operations manager in his mid-40s hunched over a desk covered in scattered reports and spreadsheets, late night glow from multiple monitors illuminating his exhausted face, jaw clenched and shoulders tensed, fingers gripping keyboard, eyes hollow but determined, the weight of overwhelming workload visible in every muscle, vintage ink wash drawing on aged yellowed paper with heavy contrast, dramatic shadows across face and desk, raw graphite texture, no text",
  },
  {
    key: "post-03",
    imageName: "post-03-ow.png",
    dbName: "Story Post — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-03-story",
    altText: "VP of operations grinding pen against paper with hollow eyes, ink wash illustration",
    prompt: "Vintage ink wash illustration on aged textured paper, a VP of operations in rolled-up sleeves hunched over a desk stacked with reports, his face drawn with exhaustion, jaw clenched, eyes hollow and staring at nothing, mechanically grinding a pen against paper as error logs multiply in front of him, high contrast charcoal and sepia tones, raw editorial illustration style, no text",
  },
  {
    key: "post-04",
    imageName: "post-04-ow.png",
    dbName: "Myth-Buster — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-04-myth-buster",
    altText: "Operations manager frozen while blurred competitor races past, sepia ink wash",
    prompt: "A competent operations manager in rolled-up sleeves, frozen mid-stride while a blurred shadow of a competitor races past at impossible speed, the manager face locked in the exact moment of realization that their next hire won't change the trajectory, vintage ink wash on aged textured paper, high contrast, sepia tones, no text",
  },
  {
    key: "post-05",
    imageName: "post-05-ow.png",
    dbName: "Quick Win (Repetition Tax) — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-05-repetition-tax",
    altText: "Operations manager in shocked realization staring at task logs, vintage ink wash",
    prompt: "Operations manager in his 40s sitting at a cluttered desk, hand pressed to forehead in shocked realization, staring down at dozens of identical task logs and spreadsheets spread across the surface, his face showing the exact moment of understanding that 40-60 percent of his team time is vanishing into repetitive pattern work, vintage ink wash on aged paper with high contrast, rough textured surface, no text",
  },
  {
    key: "post-06",
    imageName: "post-06-ow.png",
    dbName: "Quick Win (CFO Redirect) — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-06-cfo-redirect",
    altText: "Weary manager with red-stamped rejection forms, looking at numbers differently",
    prompt: "A weary operations manager in their 40s, alone at a cluttered desk scattered with budget spreadsheets and headcount request forms marked with red rejection stamps, leaning back in their chair with one hand pressed to their temple and the other hovering uncertainly over a budget line item, eyes hollow from years of the same conversation, jaw clenched, ink wash on aged textured paper, high contrast with deep blacks and stark whites, no text",
  },
  {
    key: "post-07",
    imageName: "post-07-ow.png",
    dbName: "Case Study — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-07-case-study",
    altText: "Operations manager in Friday night office light, graphite crosshatching",
    prompt: "A weary operations manager with rolled-up sleeves hunched over a desk stacked with papers and spreadsheets, hand pressed to forehead in exhaustion, jaw tight with the weight of endless manual work, eyes half-closed in resignation, the glow of a computer screen illuminating their face in dim Friday night office light, graphite pencil sketch on weathered textured paper with heavy shadows and fine crosshatching, high contrast black and white, no text",
  },
  {
    key: "post-08",
    imageName: "post-08-ow.png",
    dbName: "Contrarian CFO — 2026-02-15-dumb-pipe-phenomenon",
    imageId: "2026-02-15-dumb-pipe-08-contrarian",
    altText: "Operations manager mid-sentence holding crumpled headcount memo, recalibration expression",
    prompt: "Operations manager in their 40s, mid-sentence with mouth slightly open, holding a crumpled headcount memo in one hand while the other hand pauses mid-gesture, eyes widening with internal recognition of a logical gap, forehead creased in that exact moment between conviction and doubt, a budget printout partially visible on the desk, rendered in vintage ink wash on aged cream paper with heavy charcoal shadows, stark high contrast, intimate close-up framing capturing the micro-expression of recalibration, no text",
  },
];

async function uploadToWordPress(localPath: string, filename: string): Promise<{ id: number; url: string }> {
  const imageData = readFileSync(localPath);
  const response = await fetch(`${WP_URL}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${WP_CREDS}`,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Type': 'image/png',
    },
    body: imageData,
  });
  const data = await response.json() as any;
  if (!data.id) throw new Error(`WP upload failed: ${JSON.stringify(data)}`);
  return { id: data.id, url: data.source_url };
}

async function updateNotionEntry(pageId: string, wpUrl: string, wpId: number, post: typeof posts[0]) {
  // Update properties
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      cover: { type: "external", external: { url: wpUrl } },
      properties: {
        "Image Name": { title: [{ text: { content: post.dbName } }] },
        "Prompt": { rich_text: [{ text: { content: post.prompt } }] },
        "Alt Text": { rich_text: [{ text: { content: post.altText } }] },
        "Image ID": { rich_text: [{ text: { content: post.imageId } }] },
        "File Name": { rich_text: [{ text: { content: post.imageName } }] },
        "WordPress URL": { url: wpUrl },
        "WordPress Media ID": { number: wpId },
        "Image Type": { select: { name: "Social" } },
        "Aspect Ratio": { select: { name: "1:1" } },
        "Model": { select: { name: "flux-pro" } },
        "Resolution": { rich_text: [{ text: { content: "1024x1024" } }] },
        "Status": { select: { name: "Generated" } },
        "Style": { select: { name: "Da Vinci" } },
      }
    }),
  });
}

async function createNotionEntry(wpUrl: string, wpId: number, post: typeof posts[0]) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${NOTION_TOKEN}`,
      'Content-Type': 'application/json',
      'Notion-Version': '2022-06-28',
    },
    body: JSON.stringify({
      parent: { database_id: DB_ID },
      cover: { type: "external", external: { url: wpUrl } },
      properties: {
        "Image Name": { title: [{ text: { content: post.dbName } }] },
        "Prompt": { rich_text: [{ text: { content: post.prompt } }] },
        "Alt Text": { rich_text: [{ text: { content: post.altText } }] },
        "Image ID": { rich_text: [{ text: { content: post.imageId } }] },
        "File Name": { rich_text: [{ text: { content: post.imageName } }] },
        "WordPress URL": { url: wpUrl },
        "WordPress Media ID": { number: wpId },
        "Image Type": { select: { name: "Social" } },
        "Aspect Ratio": { select: { name: "1:1" } },
        "Model": { select: { name: "flux-pro" } },
        "Resolution": { rich_text: [{ text: { content: "1024x1024" } }] },
        "Status": { select: { name: "Generated" } },
        "Style": { select: { name: "Da Vinci" } },
      }
    }),
  });
  const data = await response.json() as any;
  return data.id;
}

console.log("🚀 Uploading 8 LinkedIn images to WordPress + Notion...\n");

for (const post of posts) {
  const localPath = `${IMG_DIR}/${post.imageName}`;
  if (!existsSync(localPath)) {
    console.error(`❌ ${post.key}: Image file not found at ${localPath}`);
    continue;
  }

  try {
    // 1. Upload to WordPress
    process.stdout.write(`⬆️  ${post.key}: Uploading to WordPress...`);
    const { id: wpId, url: wpUrl } = await uploadToWordPress(localPath, post.imageName);
    console.log(` ✅ WP ID: ${wpId}`);

    // 2. Update or create Notion entry
    const existingId = EXISTING_ENTRIES[post.key];
    if (existingId) {
      process.stdout.write(`    Updating Notion entry ${existingId}...`);
      await updateNotionEntry(existingId, wpUrl, wpId, post);
      console.log(` ✅ Updated`);
    } else {
      process.stdout.write(`    Creating new Notion entry...`);
      const newId = await createNotionEntry(wpUrl, wpId, post);
      console.log(` ✅ Created: ${newId}`);
    }

    console.log(`    🌐 WordPress: ${wpUrl}`);
    console.log('');
  } catch (err) {
    console.error(`❌ ${post.key}: ${err}`);
  }
}

console.log("✅ All done! Check Content Images gallery in Notion.");
