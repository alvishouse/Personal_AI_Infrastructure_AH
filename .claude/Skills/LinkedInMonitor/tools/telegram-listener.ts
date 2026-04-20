/**
 * telegram-listener.ts — Persistent long-polling Telegram bot listener.
 *
 * Listens for callback_query updates (inline button presses) and handles
 * "reply:<notionPageId>" callbacks by generating reply options via Claude
 * and writing them back to the Notion Engagement Queue entry.
 *
 * Run via start-listener.sh or directly:
 *   cd /home/alvis/PAI && bun --env-file .claude/.env run .claude/Skills/LinkedInMonitor/tools/telegram-listener.ts
 */

import Anthropic from "@anthropic-ai/sdk";
import { join } from "path";
import { getPageById, updateReplyOptions } from "./notion-queue.ts";
import { editMessage } from "./telegram.ts";
import { fetchTranscript } from "../../IdeaBank/tools/fetch-youtube-transcript.ts";
import { vetIdea, extractYouTubeConcepts } from "../../IdeaBank/tools/vet-idea.ts";
import { createIdeaEntry } from "../../IdeaBank/tools/notion-ideas.ts";
import type { IdeaSource } from "../../IdeaBank/tools/notion-ideas.ts";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "monitor-config.json");
const IDEABANK_CONFIG_PATH = join(SKILL_DIR, "..", "IdeaBank", "config", "ideabank-config.json");

async function loadReplyModel(): Promise<string> {
  try {
    const raw = Bun.file(CONFIG_PATH);
    const config = JSON.parse(new TextDecoder().decode(await raw.bytes()));
    return config.settings?.reply_model ?? "claude-haiku-4-5-20251001";
  } catch {
    return "claude-haiku-4-5-20251001";
  }
}

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

Format #6: Storytelling — A brief personal anecdote directly tied to the post's topic. Opens with a specific real moment (time + context: "Three years ago..." / "Last quarter we..."). Connects the experience to the post's insight without summarizing it. First-person, conversational. 3–5 sentences. If you have a relevant image or visual that would support it, suggest it at the end in brackets: [Attach: describe what image would work].

Format #7: Entertaining — A witty, personality-driven comment that shows you understand the industry's inside jokes or absurdities. Must be genuinely clever — not generic humor or a dad joke. Punchy. 2–4 sentences max. No exclamation points. Can be self-deprecating if it lands authentically.

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
[reply text]

Format 6 — Storytelling:
[reply text]

Format 7 — Entertaining:
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

async function answerCallbackQuery(
  botToken: string,
  callbackQueryId: string,
  text?: string
): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/answerCallbackQuery`;
  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text ?? "",
      }),
      signal: AbortSignal.timeout(8_000),
    });
  } catch (err) {
    console.error("[listener] answerCallbackQuery failed:", err);
  }
}

async function sendPlainMessage(
  botToken: string,
  chatId: string,
  text: string
): Promise<void> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        // No parse_mode — plain text to avoid MarkdownV2 escaping issues with generated content
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[listener] sendPlainMessage failed: ${resp.status} ${body}`);
    }
  } catch (err) {
    console.error("[listener] sendPlainMessage request failed:", err);
  }
}

async function getUpdates(
  botToken: string,
  offset: number,
  timeout: number
): Promise<Array<Record<string, unknown>>> {
  const url = `https://api.telegram.org/bot${botToken}/getUpdates?offset=${offset}&timeout=${timeout}`;
  const resp = await fetch(url, {
    signal: AbortSignal.timeout((timeout + 5) * 1000),
  });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`getUpdates failed: ${resp.status} ${body}`);
  }
  const data = await resp.json() as { ok: boolean; result: Array<Record<string, unknown>> };
  if (!data.ok) throw new Error("getUpdates returned ok=false");
  return data.result;
}

async function handleReplyCallback(
  botToken: string,
  chatId: string,
  messageId: number,
  notionPageId: string,
  notionApiKey: string,
  anthropicApiKey: string,
  model: string
): Promise<void> {
  console.log(`[listener] Handling reply callback for Notion page ${notionPageId}`);

  // Step 1: Fetch the Notion page
  const page = await getPageById(notionApiKey, notionPageId);
  if (!page) {
    await editMessage(botToken, chatId, messageId, `❌ Could not fetch Notion entry (ID: ${notionPageId})`);
    return;
  }

  const entryName = extractEntryName(page);
  const excerpt = extractExcerpt(page);

  if (!excerpt) {
    await editMessage(botToken, chatId, messageId, `❌ No Excerpt found on Notion entry: "${entryName}"`);
    return;
  }

  // Step 2: Edit original message to show in-progress state
  await editMessage(botToken, chatId, messageId, `⏳ Generating replies for "${entryName}"...`);

  // Step 3: Call Claude
  const client = new Anthropic({ apiKey: anthropicApiKey });
  console.log(`[listener] Using model: ${model}`);
  const response = await client.messages.create({
    model,
    max_tokens: 2800,
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

  // Step 4: Send replies as plain text message
  await sendPlainMessage(botToken, chatId, `Reply options for "${entryName}":\n\n${replyText}`);

  // Step 5: Update Notion
  await updateReplyOptions(notionApiKey, notionPageId, replyText);

  // Step 6: Edit original message to confirm completion
  await editMessage(botToken, chatId, messageId, `⏳ Generating replies for "${entryName}"...\n✅ Replies sent`);

  console.log(`[listener] Done generating replies for "${entryName}"`);
}

interface IdeaBankConfig {
  notion_ideas_db_id: string;
  settings: {
    vet_model: string;
    concept_model: string;
  };
}

async function loadIdeaBankConfig(): Promise<IdeaBankConfig | null> {
  try {
    const raw = Bun.file(IDEABANK_CONFIG_PATH);
    return JSON.parse(new TextDecoder().decode(await raw.bytes()));
  } catch {
    return null;
  }
}

/**
 * Parse a #idea or #vet Telegram message into its components.
 *
 * Formats supported:
 *   #idea <plain text idea>
 *   #idea https://youtube.com/watch?v=xyz
 *   #idea https://youtube.com/watch?v=xyz Some user callouts about what stood out
 *   #vet <same as #idea>
 */
function parseIdeaMessage(text: string): {
  rawIdea: string;
  youtubeUrl: string | null;
  addendum: string | null;
} {
  // Strip the trigger tag (#idea or #vet)
  const body = text.replace(/^#(?:idea|vet)\s*/i, "").trim();

  // Detect YouTube URL anywhere in the message
  const urlPattern = /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?[^\s]*v=[^\s]+|youtu\.be\/[^\s]+|youtube\.com\/shorts\/[^\s]+)/;
  const urlMatch = body.match(urlPattern);

  if (urlMatch) {
    const youtubeUrl = urlMatch[0];
    // Everything before the URL = preamble (rarely present)
    // Everything after the URL = user's addendum callouts
    const afterUrl = body.slice(urlMatch.index! + youtubeUrl.length).trim();
    return {
      rawIdea: body,
      youtubeUrl,
      addendum: afterUrl || null,
    };
  }

  return {
    rawIdea: body,
    youtubeUrl: null,
    addendum: null,
  };
}

async function handleIdeaCommand(
  botToken: string,
  chatId: string,
  text: string,
  notionApiKey: string,
  anthropicApiKey: string,
  ideaBankCfg: IdeaBankConfig
): Promise<void> {
  const { rawIdea, youtubeUrl, addendum } = parseIdeaMessage(text);

  if (!rawIdea) {
    await sendPlainMessage(botToken, chatId, "Usage: #idea <your idea text>\nOr: #idea https://youtube.com/watch?v=...");
    return;
  }

  // Acknowledge immediately
  await sendPlainMessage(botToken, chatId, `⏳ Processing idea${youtubeUrl ? " + YouTube transcript" : ""}...`);

  let transcriptSummary: string | undefined;
  let source: IdeaSource = "Manual";

  if (youtubeUrl) {
    source = "YouTube";
    try {
      console.log(`[ideabank] Fetching transcript for ${youtubeUrl}`);
      const result = await fetchTranscript(youtubeUrl);
      console.log(`[ideabank] Transcript fetched — ${result.wordCount} words`);

      console.log(`[ideabank] Extracting key concepts via ${ideaBankCfg.settings.concept_model}...`);
      transcriptSummary = await extractYouTubeConcepts(
        anthropicApiKey,
        result.fullText,
        ideaBankCfg.settings.concept_model
      );
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : String(err);
      console.error("[ideabank] Transcript fetch failed:", err);
      await sendPlainMessage(
        botToken,
        chatId,
        `⚠️ Could not fetch YouTube transcript: ${errMsg}\nScoring the idea from your text only.`
      );
    }
  }

  // Score the idea
  console.log(`[ideabank] Scoring idea via ${ideaBankCfg.settings.vet_model}...`);
  let scores;
  try {
    scores = await vetIdea(
      anthropicApiKey,
      {
        rawText: rawIdea,
        transcriptSummary,
        addendum: addendum ?? undefined,
      },
      ideaBankCfg.settings.vet_model
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error("[ideabank] Scoring failed:", err);
    await sendPlainMessage(botToken, chatId, `❌ Scoring failed: ${errMsg}`);
    return;
  }

  // Add to Notion
  let notionPageId: string | null = null;
  if (ideaBankCfg.notion_ideas_db_id) {
    console.log(`[ideabank] Creating Notion entry...`);
    notionPageId = await createIdeaEntry(notionApiKey, ideaBankCfg.notion_ideas_db_id, {
      name: scores.name,
      rawInput: rawIdea,
      source,
      youtubeUrl: youtubeUrl ?? undefined,
      transcriptSummary,
      addendum: addendum ?? undefined,
      scores,
    });
  } else {
    console.warn("[ideabank] notion_ideas_db_id not set — run setup-notion-db.ts first");
  }

  // Build confirmation message
  const tierLine = `${scores.tier} — ${scores.totalScore}/25`;
  const scoreLines = [
    `Audience Relevance: ${scores.audienceRelevance}/5`,
    `Business Alignment: ${scores.businessAlignment}/5`,
    `Timeliness: ${scores.timeliness}/5`,
    `Differentiation: ${scores.differentiation}/5`,
    `Extraction Potential: ${scores.extractionPotential}/5`,
  ].join("\n");

  const icpAngleLine = scores.icpAngle
    ? `\nICP Angle: ${scores.icpAngle}`
    : "";

  const conceptsPreview = transcriptSummary
    ? `\n\nKey concepts from video:\n${transcriptSummary.slice(0, 400)}${transcriptSummary.length > 400 ? "..." : ""}`
    : "";

  const notionLine = notionPageId ? `\n\nSaved to Notion ✓` : "\n\n⚠️ Notion DB not configured (run setup-notion-db.ts)";

  const reply = [
    `✅ Idea captured: "${scores.name}"`,
    icpAngleLine,
    ``,
    tierLine,
    ``,
    scoreLines,
    ``,
    `Track: ${scores.trackAlignment}`,
    ``,
    `Notes: ${scores.scoringNotes}`,
    conceptsPreview,
    notionLine,
  ].join("\n");

  await sendPlainMessage(botToken, chatId, reply);
  console.log(`[ideabank] Done — "${scores.name}" scored ${scores.totalScore}/25 (${scores.tier})`);
}

async function processUpdate(
  update: Record<string, unknown>,
  botToken: string,
  chatId: string,
  notionApiKey: string,
  anthropicApiKey: string,
  model: string,
  ideaBankCfg: IdeaBankConfig | null
): Promise<void> {
  // Handle text messages (#idea, #vet)
  const incomingMessage = update.message as Record<string, unknown> | undefined;
  if (incomingMessage) {
    const msgText = incomingMessage.text as string | undefined;
    const msgChatId = String((incomingMessage.chat as Record<string, unknown>)?.id ?? chatId);

    if (msgText && /^#(?:idea|vet)\s/i.test(msgText)) {
      if (!ideaBankCfg) {
        await sendPlainMessage(botToken, msgChatId, "⚠️ IdeaBank not configured. Run setup-notion-db.ts first.");
        return;
      }
      await handleIdeaCommand(botToken, msgChatId, msgText, notionApiKey, anthropicApiKey, ideaBankCfg);
    }
    return;
  }

  const callbackQuery = update.callback_query as Record<string, unknown> | undefined;
  if (!callbackQuery) return;

  const callbackQueryId = callbackQuery.id as string;
  const data = callbackQuery.data as string | undefined;
  const message = callbackQuery.message as Record<string, unknown> | undefined;
  const messageId = message?.message_id as number | undefined;
  const fromChatId = String((message?.chat as Record<string, unknown>)?.id ?? chatId);

  if (!data?.startsWith("reply:")) {
    // Unknown callback — just acknowledge
    await answerCallbackQuery(botToken, callbackQueryId);
    return;
  }

  // Must answer within 10s
  await answerCallbackQuery(botToken, callbackQueryId, "Generating replies...");

  const notionPageId = data.slice("reply:".length);

  if (!messageId) {
    console.error("[listener] No message_id on callback — cannot edit original message");
    await sendPlainMessage(botToken, fromChatId, `⏳ Generating replies for Notion page ${notionPageId}...`);
  }

  try {
    await handleReplyCallback(
      botToken,
      fromChatId,
      messageId ?? 0,
      notionPageId,
      notionApiKey,
      anthropicApiKey,
      model
    );
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : String(err);
    console.error(`[listener] Reply generation failed for ${notionPageId}:`, err);
    if (messageId) {
      await editMessage(botToken, fromChatId, messageId, `❌ Generation failed: ${errMsg}`);
    } else {
      await sendPlainMessage(botToken, fromChatId, `❌ Generation failed: ${errMsg}`);
    }
  }
}

async function main() {
  const botToken = getEnv("TELEGRAM_BOT_TOKEN");
  const chatId = getEnv("TELEGRAM_CHAT_ID");
  const notionApiKey = getEnv("NOTION_API_KEY");
  const anthropicApiKey = getEnv("ANTHROPIC_API_KEY");
  const model = await loadReplyModel();
  const ideaBankCfg = await loadIdeaBankConfig();

  console.log("═".repeat(60));
  console.log("Telegram bot listener starting...");
  console.log(`Reply model: ${model}`);
  if (ideaBankCfg?.notion_ideas_db_id) {
    console.log(`IdeaBank: active (DB: ${ideaBankCfg.notion_ideas_db_id.slice(0, 8)}...)`);
    console.log(`  Commands: #idea <text> | #idea <youtube-url> [callouts] | #vet <text>`);
  } else {
    console.log(`IdeaBank: not configured (run setup-notion-db.ts to enable #idea/#vet)`);
  }
  console.log("Waiting for inline button callbacks (reply:<notionPageId>)");
  console.log("Press Ctrl+C to stop");
  console.log("═".repeat(60));

  let offset = 0;
  let running = true;

  const shutdown = () => {
    console.log("\n[listener] Shutting down gracefully...");
    running = false;
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  while (running) {
    try {
      const updates = await getUpdates(botToken, offset, 60);

      for (const update of updates) {
        const updateId = update.update_id as number;
        offset = updateId + 1;

        try {
          await processUpdate(update, botToken, chatId, notionApiKey, anthropicApiKey, model, ideaBankCfg);
        } catch (err) {
          // Catch per-update errors so one bad update doesn't crash the loop
          console.error(`[listener] Error processing update ${updateId}:`, err);
        }
      }
    } catch (err) {
      if (!running) break;
      console.error("[listener] getUpdates error (will retry in 5s):", err);
      await new Promise((resolve) => setTimeout(resolve, 5_000));
    }
  }

  console.log("[listener] Stopped.");
}

main().catch((err) => {
  console.error("[listener] Fatal error:", err);
  process.exit(1);
});
