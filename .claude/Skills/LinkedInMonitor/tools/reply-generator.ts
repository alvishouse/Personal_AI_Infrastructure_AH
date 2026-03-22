/**
 * reply-generator.ts — On-demand Feature 3: generate 5 reply options for a
 * Notion Engagement Queue entry using the comment_engagement_generator prompt.
 *
 * Usage:
 *   cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/reply-generator.ts <notion-page-id>
 *
 * Reads the Excerpt from the Notion entry, calls Claude API, writes 5 reply
 * options back to the "Reply Options" field.
 */

import Anthropic from "@anthropic-ai/sdk";
import { getPageById, updateReplyOptions } from "./notion-queue.ts";

const COMMENT_GENERATOR_PROMPT = `Comment Engagement Generator
Writing "thoughtful comments" (on your posts, or other people's posts) is actually the same exact thing as writing valuable short-form content.
Which means it's possible to reverse-engineer "writing thoughtful comments" into proven, repeatable formats AI can replicate on your behalf.

You are a Comment Machine, and your primary function is to thoughtfully respond to a piece of content on social media with a Thought Leadership style short-form post.

However, since these are "comments," you should write these in a very conversational tone. This means you can use contractions, abbreviations, and more casual language—as long as the comment itself delivers something valuable in response to the original post.

I will give you the text from the piece of content I would like you to reply to, and I would like you to provide me with 5 different reply options—each based on one of the five "comment formats":

Format #1: Counterpoint — A declarative perspective that presents the opposing view of the original post. Single paragraph. Alternating long/short sentences for emphasis and rhythm.

Format #2: Listicle Examples — A "continued list" of examples or added insights. First 1-2 sentences validate the post, then numbered/bulleted list adds 3-10 specific, tangible items.

Format #3: Unique Stat — A verifiable unique or weird stat, study, or fun fact that adds to the conversation. Must either provide a source link or clearly note the stat needs verification.

Format #4: Old vs New — Compares "old way" vs "new way" (or Bad vs Good, Platform vs Platform). Very specific visual format: 1-3 word category header, then 3 bullets, then opposing category, then 3 bullets, then short closing.

Format #5: Mistakes — Takes the topic and elaborates on where people typically go wrong. Validates the original post, then bulleted list of specific mistakes with causes and/or fixes.

IMPORTANT RULES:
- Write in first-person, conversational tone — sounds like a real person typing in a LinkedIn comment box
- Use contractions (I've, don't, isn't, here's, etc.)
- Limit exclamation points — they sound "too friendly"
- Use conversational phrases: "honestly," "I think," "you know," "I mean"
- Shorter sentences mixed with occasional longer thoughts
- Casual punctuation (dashes, ellipses...)
- NEVER present statistics as factual without a verifiable source link — if uncertain, say so
- Never write polished marketing copy — be direct and informal
- Alvis House voice: direct, no hedging, no fluff

Output format (use these EXACT headers):
Format 1 — Counterpoint:
[reply text]

Format 2 — Listicle Examples:
[reply text]

Format 3 — Unique Stat:
[reply text]

Format 4 — Old vs New:
[reply text]

Format 5 — Mistakes:
[reply text]`;

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

function extractExcerpt(page: Record<string, unknown>): string | null {
  try {
    const props = page.properties as Record<string, unknown>;
    const excerptProp = props["Excerpt"] as {
      rich_text?: Array<{ plain_text?: string }>;
    };
    return excerptProp?.rich_text?.map((t) => t.plain_text ?? "").join("") || null;
  } catch {
    return null;
  }
}

function extractEntryName(page: Record<string, unknown>): string {
  try {
    const props = page.properties as Record<string, unknown>;
    const titleProp = props["Entry Name"] as {
      title?: Array<{ plain_text?: string }>;
    };
    return titleProp?.title?.map((t) => t.plain_text ?? "").join("") || "Unknown entry";
  } catch {
    return "Unknown entry";
  }
}

async function main() {
  const pageId = process.argv[2];
  if (!pageId) {
    console.error("Usage: bun run reply-generator.ts <notion-page-id>");
    process.exit(1);
  }

  const notionApiKey = getEnv("NOTION_API_KEY");
  const anthropicApiKey = getEnv("ANTHROPIC_API_KEY");

  console.log(`[reply-generator] Fetching Notion page ${pageId}...`);
  const page = await getPageById(notionApiKey, pageId);
  if (!page) {
    console.error("[reply-generator] Could not fetch page — check the page ID and NOTION_API_KEY");
    process.exit(1);
  }

  const entryName = extractEntryName(page);
  const excerpt = extractExcerpt(page);
  if (!excerpt) {
    console.error(`[reply-generator] No Excerpt found on page "${entryName}"`);
    process.exit(1);
  }

  console.log(`[reply-generator] Generating replies for: "${entryName}"`);
  console.log(`[reply-generator] Post excerpt (first 100 chars): ${excerpt.slice(0, 100)}...`);

  const client = new Anthropic({ apiKey: anthropicApiKey });
  const response = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: `${COMMENT_GENERATOR_PROMPT}\n\nHere is the post/comment I'd like you to draft replies for:\n\n---\n${excerpt}\n---\n\nPlease generate all 5 reply options now.`,
      },
    ],
  });

  const replyText = response.content
    .filter((block) => block.type === "text")
    .map((block) => (block as { type: "text"; text: string }).text)
    .join("\n");

  console.log("\n[reply-generator] Generated replies:\n");
  console.log(replyText);

  console.log("\n[reply-generator] Writing back to Notion...");
  const success = await updateReplyOptions(notionApiKey, pageId, replyText);

  if (success) {
    console.log(`[reply-generator] Done — reply options saved to Notion entry "${entryName}"`);
  } else {
    console.error("[reply-generator] Failed to save to Notion — check logs above");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("[reply-generator] Fatal error:", err);
  process.exit(1);
});
