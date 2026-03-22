/**
 * monitor-watched-accounts.ts — Feature 1: Watch LinkedIn profiles for new posts.
 *
 * For each watched profile:
 *   1. Fetch last N posts via Proxycurl
 *   2. Skip if already seen (SQLite deduplication)
 *   3. Create Notion Engagement Queue entry
 *   4. Send Telegram alert
 *   5. Mark seen in SQLite
 *
 * Flags:
 *   --dry-run    Fetch from Proxycurl but don't write to DB, Notion, or Telegram
 */

import { join } from "path";
import {
  fetchRecentPosts,
  formatPostDate,
} from "./proxycurl.ts";
import {
  isPostSeen,
  markPostSeen,
  recordProfilePost,
  recordProfileChecked,
  daysSinceLastPost,
} from "./database.ts";
import { sendWatchedPostAlert } from "./telegram.ts";
import { createEngagementEntry } from "./notion-queue.ts";

const SKILL_DIR = join(import.meta.dir, "..");
const CONFIG_PATH = join(SKILL_DIR, "config", "monitor-config.json");
const DB_PATH = join(SKILL_DIR, "data", "seen.db");

interface WatchedProfile {
  name: string;
  linkedin_url: string;
}

interface MonitorConfig {
  watched_profiles: WatchedProfile[];
  notion_engagement_db_id: string;
  settings: {
    posts_per_profile: number;
    inactive_skip_days: number;
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

async function processProfile(
  profile: WatchedProfile,
  cfg: MonitorConfig,
  env: { proxycurl: string; telegram: string; chatId: string; notion: string },
  dryRun: boolean
): Promise<void> {
  const { name, linkedin_url: url } = profile;
  console.log(`\n[monitor] Checking posts for ${name} (${url})`);

  // Skip-inactive optimization
  const skipDays = cfg.settings.inactive_skip_days;
  if (skipDays > 0) {
    const since = daysSinceLastPost(DB_PATH, url);
    if (since !== null && since > skipDays) {
      console.log(`[monitor] Skipping ${name} — no post seen in ${Math.round(since)} days (threshold: ${skipDays})`);
      return;
    }
  }

  const posts = await fetchRecentPosts(
    env.proxycurl,
    url,
    cfg.settings.posts_per_profile
  );

  if (!posts.length) {
    console.log(`[monitor] No posts returned for ${name}`);
    if (!dryRun) recordProfileChecked(DB_PATH, url);
    return;
  }

  let newCount = 0;

  for (const post of posts) {
    const postUrl = post.post_url;
    if (!postUrl) continue;

    if (!dryRun && isPostSeen(DB_PATH, postUrl)) {
      continue;
    }
    if (dryRun) {
      console.log(`[dry-run] Would process post: ${postUrl}`);
      continue;
    }

    newCount++;
    const postText = post.text ?? "";
    const postDate = formatPostDate(post.posted_on);
    const numLikes = post.num_likes ?? 0;
    const numComments = post.num_comments ?? 0;
    const excerpt = postText.slice(0, 300);

    console.log(`[monitor] NEW post: ${postUrl}`);

    // Create Notion entry
    if (cfg.notion_engagement_db_id) {
      await createEngagementEntry(env.notion, cfg.notion_engagement_db_id, {
        entryName: `${name} posted`,
        type: "Watched Post",
        account: name,
        linkedinUrl: postUrl,
        excerpt,
        detectedAt: new Date().toISOString(),
      });
    } else {
      console.warn("[monitor] notion_engagement_db_id not set — skipping Notion");
    }

    // Send Telegram alert
    await sendWatchedPostAlert(env.telegram, env.chatId, {
      authorName: name,
      postDate,
      numLikes,
      numComments,
      postText,
      postUrl,
    });

    // Mark seen AFTER successful notifications
    markPostSeen(DB_PATH, postUrl, name);
    recordProfilePost(DB_PATH, url);
  }

  if (!dryRun) {
    if (newCount === 0) {
      console.log(`[monitor] No new posts for ${name}`);
      recordProfileChecked(DB_PATH, url);
    } else {
      console.log(`[monitor] Processed ${newCount} new post(s) for ${name}`);
    }
  }
}

async function main() {
  const dryRun = process.argv.includes("--dry-run");
  if (dryRun) console.log("[monitor] DRY RUN — no writes to DB, Notion, or Telegram");

  console.log("═".repeat(60));
  console.log("LinkedIn Watched-Account Monitor starting...");

  const cfg = await loadConfig();

  if (!cfg.watched_profiles.length) {
    console.log("[monitor] No watched_profiles configured. Add them to config/monitor-config.json");
    return;
  }

  const env = {
    proxycurl: getEnv("PROXYCURL_API_KEY"),
    telegram: getEnv("TELEGRAM_BOT_TOKEN"),
    chatId: getEnv("TELEGRAM_CHAT_ID"),
    notion: getEnv("NOTION_API_KEY"),
  };

  for (const profile of cfg.watched_profiles) {
    try {
      await processProfile(profile, cfg, env, dryRun);
    } catch (err) {
      console.error(`[monitor] Unexpected error for ${profile.name}:`, err);
    }
  }

  console.log("\nLinkedIn Watched-Account Monitor run complete.");
  console.log("═".repeat(60));
}

main().catch((err) => {
  console.error("[monitor] Fatal error:", err);
  process.exit(1);
});
