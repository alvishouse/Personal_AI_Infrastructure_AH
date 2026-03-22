/**
 * monitor-own-comments.ts — Feature 2: Watch own LinkedIn posts for new comments.
 *
 * For each own post URL in config:
 *   1. Skip if post is older than own_post_expiry_days
 *   2. Fetch comments via Proxycurl
 *   3. Skip if already seen (SQLite deduplication)
 *   4. Create Notion Engagement Queue entry
 *   5. Send Telegram alert
 *   6. Mark seen in SQLite
 *
 * Flags:
 *   --dry-run    Fetch from Proxycurl but don't write to DB, Notion, or Telegram
 */

import { join } from "path";
import { fetchPostComments } from "./proxycurl.ts";
import { isCommentSeen, markCommentSeen } from "./database.ts";
import { sendCommentAlert } from "./telegram.ts";
import { createEngagementEntry } from "./notion-queue.ts";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "monitor-config.json");
const DB_PATH = join(SKILL_DIR, "data", "seen.db");

interface OwnPost {
  url: string;
  title: string;
  published_at: string; // ISO date string e.g. "2026-03-15"
}

interface MonitorConfig {
  own_posts: OwnPost[];
  notion_engagement_db_id: string;
  settings: {
    own_post_expiry_days: number;
    generate_replies: boolean;
  };
}

function getEnv(key: string): string {
  const val = process.env[key];
  if (!val) throw new Error(`Missing required env var: ${key}`);
  return val;
}

async function loadConfig(): Promise<MonitorConfig> {
  const raw = Bun.file(CONFIG_PATH);
  return JSON.parse(new TextDecoder().decode(await raw.bytes()));
}

function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now = Date.now();
  return (now - then) / (1000 * 60 * 60 * 24);
}

async function processOwnPost(
  post: OwnPost,
  cfg: MonitorConfig,
  env: { proxycurl: string; telegram: string; chatId: string; notion: string },
  dryRun: boolean
): Promise<void> {
  const { url, title, published_at } = post;

  // Auto-expiry check
  const age = daysSince(published_at);
  if (age > cfg.settings.own_post_expiry_days) {
    console.log(`[monitor] Skipping "${title}" — ${Math.round(age)} days old (expiry: ${cfg.settings.own_post_expiry_days})`);
    return;
  }

  console.log(`\n[monitor] Checking comments on "${title}" (${url})`);

  const comments = await fetchPostComments(env.proxycurl, url);

  if (!comments.length) {
    console.log(`[monitor] No comments found on "${title}"`);
    return;
  }

  let newCount = 0;

  for (const comment of comments) {
    const commentId = comment.comment_id;
    if (!commentId) {
      console.warn("[monitor] Comment missing comment_id — skipping");
      continue;
    }

    if (!dryRun && isCommentSeen(DB_PATH, commentId)) {
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] Would process comment ${commentId} by ${comment.commenter_name}`);
      continue;
    }

    newCount++;
    const commentText = comment.text ?? "";
    const commentDate = comment.created_at ?? new Date().toISOString();
    const commenterName = comment.commenter_name ?? "Unknown";
    const excerpt = commentText.slice(0, 300);

    console.log(`[monitor] NEW comment by ${commenterName}: ${commentId}`);

    // Create Notion entry
    if (cfg.notion_engagement_db_id) {
      await createEngagementEntry(env.notion, cfg.notion_engagement_db_id, {
        entryName: `${commenterName} commented on "${title}"`,
        type: "Own Post Comment",
        account: commenterName,
        linkedinUrl: url,
        excerpt,
        detectedAt: new Date().toISOString(),
      });
    } else {
      console.warn("[monitor] notion_engagement_db_id not set — skipping Notion");
    }

    // Send Telegram alert
    await sendCommentAlert(env.telegram, env.chatId, {
      commenterName,
      postTitle: title,
      commentText,
      commentDate,
      postUrl: url,
    });

    // Mark seen AFTER successful notifications
    markCommentSeen(DB_PATH, commentId, url, commenterName);
  }

  if (!dryRun) {
    if (newCount === 0) {
      console.log(`[monitor] No new comments on "${title}"`);
    } else {
      console.log(`[monitor] Processed ${newCount} new comment(s) on "${title}"`);
    }
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("[monitor] DRY RUN — no writes to DB, Notion, or Telegram");

  console.log("═".repeat(60));
  console.log("LinkedIn Own-Post Comment Monitor starting...");

  const cfg = await loadConfig();

  if (!cfg.own_posts.length) {
    console.log("[monitor] No own_posts configured. Add them to config/monitor-config.json after publishing on LinkedIn.");
    return;
  }

  const env = {
    proxycurl: getEnv("PROXYCURL_API_KEY"),
    telegram: getEnv("TELEGRAM_BOT_TOKEN"),
    chatId: getEnv("TELEGRAM_CHAT_ID"),
    notion: getEnv("NOTION_API_KEY"),
  };

  for (const post of cfg.own_posts) {
    try {
      await processOwnPost(post, cfg, env, dryRun);
    } catch (err) {
      console.error(`[monitor] Unexpected error for "${post.title}":`, err);
    }
  }

  console.log("\nLinkedIn Own-Post Comment Monitor run complete.");
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("[monitor] Fatal error:", err);
  process.exit(1);
});
