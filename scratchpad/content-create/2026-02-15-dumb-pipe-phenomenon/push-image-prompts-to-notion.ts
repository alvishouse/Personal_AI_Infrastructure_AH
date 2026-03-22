#!/usr/bin/env bun
/**
 * Push LinkedIn image prompts to Notion
 * Creates child pages under the Dumb Pipe content page
 */

const NOTION_TOKEN = process.env.NOTION_TOKEN || "ntn_V1980674253b9fUYx7YMQTfkjff8dcG3dFxr3rRp9199Hb";
const PARENT_PAGE_ID = "3090760e-b0cd-8175-bfdb-fb56f4a8a5b8"; // Dumb Pipe content page

const posts = [
  {
    file: "post-01-authority",
    title: "🖼️ Image Prompt — Post 01: Authority (CFO Is Accidentally Right)",
    prompt: "Operations manager in rolled sleeves and loosened tie, slumped over desk piled with unfinished reports and spreadsheets, head resting on one hand in defeat, staring at a number that won't move, face showing quiet exhaustion and resignation rather than anger, graphite pencil sketch on rough aged paper, high contrast, tired expression of someone who has stopped believing, no text",
    post_type: "Authority Post",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-02-framework",
    title: "🖼️ Image Prompt — Post 02: Framework (Intelligence-Per-Person 4 Steps)",
    prompt: "Weathered operations manager in his mid-40s hunched over a desk covered in scattered reports and spreadsheets, late night glow from multiple monitors illuminating his exhausted face, jaw clenched and shoulders tensed, fingers gripping keyboard, eyes hollow but determined, the weight of overwhelming workload visible in every muscle, vintage ink wash drawing on aged yellowed paper with heavy contrast, dramatic shadows across face and desk, raw graphite texture, no text",
    post_type: "Framework Deep-Dive",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-03-story",
    title: "🖼️ Image Prompt — Post 03: Story (VP Who Stopped Asking for Headcount)",
    prompt: "Vintage ink wash illustration on aged textured paper, a VP of operations in rolled-up sleeves hunched over a desk stacked with reports, his face drawn with exhaustion, jaw clenched, eyes hollow and staring at nothing, mechanically grinding a pen against paper as error logs multiply in front of him, high contrast charcoal and sepia tones, raw editorial illustration style, no text",
    post_type: "Human Story",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-04-myth-buster",
    title: "🖼️ Image Prompt — Post 04: Myth-Buster (Linear vs Exponential)",
    prompt: "A competent operations manager in rolled-up sleeves, frozen mid-stride while a blurred shadow of a competitor races past at impossible speed, the manager's face locked in the exact moment of realization that their next hire won't change the trajectory, vintage ink wash on aged textured paper, high contrast, sepia tones, no text",
    post_type: "Myth-Buster",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-05-repetition-tax",
    title: "🖼️ Image Prompt — Post 05: Quick Win (Repetition Tax Audit)",
    prompt: "Operations manager in his 40s sitting at a cluttered desk, hand pressed to forehead in shocked realization, staring down at dozens of identical task logs and spreadsheets spread across the surface, his face showing the exact moment of understanding that 40-60% of his team's time is vanishing into repetitive pattern work, vintage ink wash on aged paper with high contrast, rough textured surface, the desk covered in evidence of the repetition tax he never measured, no text",
    post_type: "Quick Win",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-06-cfo-redirect",
    title: "🖼️ Image Prompt — Post 06: Quick Win (Redirecting Headcount Budget)",
    prompt: "A weary operations manager in their 40s, alone at a cluttered desk scattered with budget spreadsheets and headcount request forms marked with red rejection stamps, leaning back in their chair with one hand pressed to their temple and the other hovering uncertainly over a budget line item — eyes hollow from years of the same conversation, jaw clenched, but with a single moment of pause where they're looking at the numbers differently, seeing something the previous quarter's rejections didn't show them. Ink wash on aged textured paper, high contrast with deep blacks and stark whites, dramatic side lighting casting sharp shadows across the documents, conveying exhaustion before breakthrough, no text",
    post_type: "Quick Win / CFO Reframe",
    framework: "Opening Wound",
    validator_score: "PASS (revised)",
    attempts: 2
  },
  {
    file: "post-07-case-study",
    title: "🖼️ Image Prompt — Post 07: Case Study (Logistics Company)",
    prompt: "A weary operations manager with rolled-up sleeves hunched over a desk stacked with papers and spreadsheets, hand pressed to forehead in exhaustion, jaw tight with the weight of endless manual work, eyes half-closed in resignation, the glow of a computer screen illuminating their face in dim Friday night office light, graphite pencil sketch on weathered, textured paper with heavy shadows and fine crosshatching, high contrast black and white, no text",
    post_type: "Case Study",
    framework: "Opening Wound",
    validator_score: "PASS",
    attempts: 1
  },
  {
    file: "post-08-contrarian-cfo",
    title: "🖼️ Image Prompt — Post 08: Contrarian (Your CFO Is Accidentally Right)",
    prompt: "Operations manager in their 40s, mid-sentence with mouth slightly open, holding a crumpled headcount memo in one hand while the other hand pauses mid-gesture, eyes widening with internal recognition of a logical gap they've been missing, forehead creased in that exact moment between conviction and doubt, a budget printout partially visible on the desk behind their hand showing cost-per-headcount calculations, rendered in vintage ink wash on aged cream paper with heavy charcoal shadows defining the facial planes and hands, stark high contrast between the memo's printed text and the surrounding white space, no background figures or conference room, immediate and intimate close-up framing that captures the micro-expression of recalibration, no text",
    post_type: "Contrarian / Viral",
    framework: "Opening Wound",
    validator_score: "PASS (revised)",
    attempts: 2
  }
];

async function createNotionPage(post: typeof posts[0]) {
  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${NOTION_TOKEN}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28"
    },
    body: JSON.stringify({
      parent: { page_id: PARENT_PAGE_ID },
      properties: {
        title: {
          title: [{ text: { content: post.title } }]
        }
      },
      children: [
        {
          object: "block",
          type: "callout",
          callout: {
            rich_text: [{ type: "text", text: { content: `Framework: ${post.framework} | Type: ${post.post_type} | Validator: ${post.validator_score} | Attempts: ${post.attempts}` } }],
            icon: { emoji: "✅" },
            color: "green_background"
          }
        },
        {
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: "Image Prompt" } }]
          }
        },
        {
          object: "block",
          type: "quote",
          quote: {
            rich_text: [{ type: "text", text: { content: post.prompt } }]
          }
        },
        {
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: [{ type: "text", text: { content: "Copy the prompt above and use with Flux/Midjourney/DALL-E. Style: gritty human subjects, ink wash on aged paper, high contrast, no text." } }]
          }
        }
      ]
    })
  });

  const data = await response.json() as any;
  if (data.id) {
    return { id: data.id, url: data.url };
  }
  throw new Error(`Failed to create page for ${post.file}: ${JSON.stringify(data)}`);
}

console.log("🚀 Pushing 8 LinkedIn image prompts to Notion...\n");

const results: Array<{ file: string; notion_id: string; notion_url: string }> = [];

for (const post of posts) {
  try {
    const { id, url } = await createNotionPage(post);
    results.push({ file: post.file, notion_id: id, notion_url: url });
    console.log(`✅ ${post.file}: ${url}`);
  } catch (err) {
    console.error(`❌ ${post.file}: ${err}`);
  }
}

console.log("\n📋 Notion IDs for metadata.json:");
console.log(JSON.stringify(results, null, 2));
