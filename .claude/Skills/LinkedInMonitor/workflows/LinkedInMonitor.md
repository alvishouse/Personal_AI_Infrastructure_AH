---
name: LinkedInMonitor
description: Usage guide for the LinkedIn engagement monitoring system. USE WHEN user needs to set up monitoring, add watched profiles, add own post URLs, run monitors, or generate replies.
---

# LinkedIn Engagement Strategy — Process Guide

This system implements the **30/30/30/10 engagement strategy**: systematically monitor target creators, get notified when they post, generate high-quality comments, and build authority through consistent engagement.

---

## How It Works (End-to-End)

```
Cron (8 AM daily)
  → monitor-watched-accounts.ts
      → LinkdAPI fetches new posts from 30 watched profiles
      → Deduplicates against SQLite (seen.db)
      → Creates Notion Engagement Queue entry (with Bucket label)
      → Sends Telegram alert (with bucket label + "✍️ Generate Replies" button)

  → monitor-own-comments.ts
      → LinkdAPI fetches new comments on your own posts
      → Deduplicates against SQLite
      → Creates Notion Engagement Queue entry
      → Sends Telegram alert

Telegram Button Press ("✍️ Generate Replies")
  → telegram-listener.ts (always-on background process)
      → Fetches post excerpt from Notion
      → Calls Claude (Haiku) with 7-format comment prompt
      → Sends 7 reply options as plain text in Telegram
      → Writes reply options back to Notion entry
```

---

## The 30/30/30/10 Buckets

| Bucket | % | Goal | Notion Label |
|--------|---|------|-------------|
| **Large Creator** | 30% | Piggyback on massive audience — comment early for visibility | 🚀 Large Creator |
| **Peer** | 30% | Build community authority among relevant creators | 👥 Peer |
| **ICP** | 30% | Understand client pain language, get on their radar | 🎯 ICP |
| **Friend** | 10% | Support real-life network | 👋 Friend |

All 30 profiles (10 per bucket) are pre-configured in `config/monitor-config.json`.

---

## Daily Workflow

### 1. Monitor runs at 8 AM automatically
New posts from watched profiles appear in your Telegram and Notion Engagement Queue.

### 2. Triage in Telegram
Each alert shows:
- Creator name + bucket label
- Post date, likes, comments
- First 200 chars of post
- Link to full post
- "✍️ Generate Replies" button

**Priority order:** Large Creator posts first (timing matters most — comment early).

### 3. Generate reply options
Press **✍️ Generate Replies** in Telegram (requires `telegram-listener.ts` running).

You get 7 formats:
1. **Counterpoint** — respectful opposing view (= Contrarian Take)
2. **Listicle Examples** — added insights as a list
3. **Unique Stat** — verifiable stat or study
4. **Old vs New** — before/after comparison
5. **Mistakes** — where people go wrong on this topic
6. **Storytelling** — personal anecdote tied to the post
7. **Entertaining** — witty, personality-driven comment

### 4. Pick and post
Copy the best option from Telegram or Notion. Post it on LinkedIn manually.
Update the Notion entry Status: **To Engage → Engaged**.

---

## Setup (First Time Only)

### 1. Environment variables
Add to `/home/alvis/PAI/.env`:

```env
LINKDAPI_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
NOTION_API_KEY=your_notion_key_here
ANTHROPIC_API_KEY=your_key_here
```

**Where to get each:**
- **LinkdAPI:** linkdapi.com → Dashboard → API Keys (100 free credits on signup)
- **Telegram Bot:** Talk to @BotFather → `/newbot`
- **Telegram Chat ID:** Send a message to your bot → visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
- **Notion:** Settings → Connections → Develop integrations → New integration

### 2. Migrate the existing Notion DB (adds Bucket property)
```bash
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/migrate-notion-db.ts
```

### 3. Start the Telegram listener
```bash
.claude/Skills/LinkedInMonitor/tools/start-listener.sh
```

This keeps the "✍️ Generate Replies" button working. Runs in background. Check status:
```bash
cat .claude/Skills/LinkedInMonitor/logs/listener.pid
```

Stop it:
```bash
.claude/Skills/LinkedInMonitor/tools/stop-listener.sh
```

### 4. Set up cron jobs (daily at 8 AM)
Use PAI's `CronCreate` with:
```
cd /home/alvis/PAI && bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts
cd /home/alvis/PAI && bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts
```
Schedule: `0 8 * * *`

---

## Running Manually

```bash
# Watched accounts (Feature 1)
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts

# Dry run (no writes)
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts --dry-run

# Own post comments (Feature 2)
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts

# Generate replies for a Notion entry (CLI alternative to Telegram button)
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/reply-generator.ts <notion-page-id>
```

---

## After Publishing a LinkedIn Post

LinkedIn's API is read-only — add your own post URLs manually after publishing.

1. Publish your post on LinkedIn
2. Click the three dots → **Copy link to post**
3. Add to `config/monitor-config.json → own_posts[]`:

```json
"own_posts": [
  {
    "url": "https://www.linkedin.com/feed/update/urn:li:activity:...",
    "title": "Short description of the post",
    "published_at": "2026-03-29"
  }
]
```

Posts auto-expire after `own_post_expiry_days` (default: 10). Old entries stay in config for history but aren't polled.

---

## Adding New Profiles

Edit `config/monitor-config.json → watched_profiles[]`. Skip empty `linkedin_url` entries — the monitor will log them and move on. To look up URLs for new profiles:

```bash
# Edit CANDIDATE_USERNAMES in the script first, then:
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/lookup-profile-urls.ts
bun --env-file .claude/.env .claude/Skills/LinkedInMonitor/tools/lookup-profile-urls.ts --write
```

Profile schema:
```json
{
  "name": "Person Name",
  "linkedin_url": "https://www.linkedin.com/in/username/",
  "bucket": "large_creator",
  "notes": "Why this person — audience overlap, relevance"
}
```

Valid bucket values: `large_creator`, `peer`, `icp`, `friend`

---

## Notion Engagement Queue

The queue has these views (create them manually in Notion after migration):

| View | Filter |
|------|--------|
| **Today's Queue** | Status = To Engage, sorted by Detected At |
| **Own Post Comments** | Type = Own Post Comment |
| **Large Creator** | Bucket = Large Creator |
| **ICP Watch** | Bucket = ICP |
| **Kanban** | Grouped by Status |

**Status flow:** To Engage → (Engaged or Skipped)

---

## Config Reference

| Field | Default | Description |
|-------|---------|-------------|
| `watched_profiles[].bucket` | required | `large_creator`, `peer`, `icp`, or `friend` |
| `settings.posts_per_profile` | `5` | Recent posts to fetch per profile per run |
| `settings.inactive_skip_days` | `30` | Skip profiles with no post in N days |
| `settings.own_post_expiry_days` | `10` | Stop monitoring own posts after N days |
| `settings.reply_model` | `claude-haiku-4-5-20251001` | Model used by Telegram listener for reply generation |

---

## Cost Reference

**LinkdAPI:** ~2 calls per profile per run (URN lookup + posts fetch)

| Setup | Calls/day | Est. monthly |
|-------|-----------|-------------|
| 30 profiles + 5 own posts | ~65 | Check your LinkdAPI plan |

**Claude API (Haiku — reply generation only):** ~$0.005 per "Generate Replies" press.

| Usage | $/month |
|-------|---------|
| Light (3–5 per day) | ~$0.50–$0.75 |
| Active (10–15 per day) | ~$1.50–$2.25 |
| Heavy (all 30 profiles) | ~$3.75–$4.50 |

---

## Verification Checklist

- [ ] `migrate-notion-db.ts` runs without error
- [ ] `start-listener.sh` starts and PID file exists
- [ ] `monitor-watched-accounts.ts --dry-run` returns posts without writing
- [ ] Live run: Telegram alerts arrive with bucket label
- [ ] Live run: Notion Engagement Queue entries appear with Bucket property
- [ ] Second run: no duplicate alerts (SQLite deduplication working)
- [ ] Pressing "✍️ Generate Replies" in Telegram returns 7 formatted options
- [ ] Cron jobs fire at 8 AM daily

---

## File Reference

| File | Purpose |
|------|---------|
| `config/monitor-config.json` | All watched profiles, own posts, settings |
| `tools/monitor-watched-accounts.ts` | Feature 1: poll watched profiles |
| `tools/monitor-own-comments.ts` | Feature 2: poll own post comments |
| `tools/telegram-listener.ts` | Always-on bot for reply generation button |
| `tools/reply-generator.ts` | CLI: generate replies for a Notion entry |
| `tools/lookup-profile-urls.ts` | Utility: resolve LinkedIn URLs via LinkdAPI |
| `tools/migrate-notion-db.ts` | One-time: add Bucket property to existing DB |
| `tools/setup-notion-db.ts` | One-time: create fresh Notion DB |
| `data/seen.db` | SQLite deduplication store (gitignored) |
