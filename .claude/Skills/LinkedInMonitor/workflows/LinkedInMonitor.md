---
name: LinkedInMonitor
description: Usage guide for the LinkedIn engagement monitoring system. USE WHEN user needs to set up monitoring, add watched profiles, add own post URLs, run monitors, or generate replies.
---

# LinkedIn Monitor — Usage Guide

Monitors LinkedIn for engagement opportunities and queues them for action in Notion.

---

## First-Time Setup

### 1. Get your API keys

Add these to `/home/alvis/PAI/.env`:

```env
PROXYCURL_API_KEY=your_key_here
TELEGRAM_BOT_TOKEN=your_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
# NOTION_API_KEY is already in mcpServers.json — also add here for bun scripts:
NOTION_API_KEY=your_notion_key_here
ANTHROPIC_API_KEY=your_key_here
```

**Where to get each:**
- **Proxycurl:** nubela.co → API Keys
- **Telegram Bot:** Talk to @BotFather on Telegram → `/newbot`
- **Telegram Chat ID:** Send a message to your bot, then visit `https://api.telegram.org/bot<TOKEN>/getUpdates`
- **Notion:** Settings → Connections → Develop integrations → New integration

### 2. Create the Notion Engagement Queue DB

```bash
cd /home/alvis/PAI
bun run .claude/Skills/LinkedInMonitor/tools/setup-notion-db.ts <your-notion-page-id>
```

This creates the DB and saves its ID to `config/monitor-config.json` automatically.

**Important:** Make sure your Notion integration has access to the parent page (Connections → Add connection in the page settings).

### 3. Install dependencies

```bash
cd /home/alvis/PAI
bun add @anthropic-ai/sdk
```

(`bun:sqlite` is built into Bun — no separate install needed.)

### 4. Add watched profiles to config

Edit `.claude/Skills/LinkedInMonitor/config/monitor-config.json`:

```json
{
  "watched_profiles": [
    {
      "name": "Alex Hormozi",
      "linkedin_url": "https://www.linkedin.com/in/alexanderhormozi"
    }
  ],
  "own_posts": [],
  "notion_engagement_db_id": "YOUR_DB_ID_HERE",
  "settings": {
    "posts_per_profile": 5,
    "inactive_skip_days": 30,
    "own_post_expiry_days": 10,
    "generate_replies": false
  }
}
```

### 5. Set up cron jobs

```bash
# Create cron jobs via PAI's CronCreate
```

Or manually run `CronCreate` with:
- **Watched accounts:** `cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts`
- **Own post comments:** `cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts`
- **Schedule:** `0 8 * * *` (daily at 8 AM)

---

## Running Manually

```bash
# Feature 1: Check watched profiles for new posts
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts

# Feature 1 (dry run — no writes):
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts --dry-run

# Feature 2: Check own posts for new comments
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts

# Feature 2 (dry run):
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts --dry-run
```

---

## After Publishing a LinkedIn Post

LinkedIn's API is read-only — there's no way to auto-detect your own post URLs. Add them manually:

1. Publish your post on LinkedIn
2. Copy the post URL (click the three dots → "Copy link to post")
3. Add it to `config/monitor-config.json → own_posts[]`:

```json
"own_posts": [
  {
    "url": "https://www.linkedin.com/posts/alvishouse_...",
    "title": "The Dumb Pipe Phenomenon",
    "published_at": "2026-03-15"
  }
]
```

Posts older than `own_post_expiry_days` (default: 10) are automatically skipped. Old entries stay in config for history but don't incur Proxycurl costs.

---

## Generating Reply Options (Feature 3)

When you see an interesting entry in your Notion Engagement Queue:

1. Open the entry and copy the Notion page ID from the URL
2. Run:

```bash
cd /home/alvis/PAI
bun run .claude/Skills/LinkedInMonitor/tools/reply-generator.ts <notion-page-id>
```

This reads the `Excerpt` field, generates 5 reply options (using the 5 comment formats: Counterpoint, Listicle Examples, Unique Stat, Old vs New, Mistakes), and writes them back to the `Reply Options` field in Notion.

Copy the best option from Notion and paste it manually into LinkedIn.

**Cost:** ~$0.003–0.008 per call. Run it only when you actually want to engage.

---

## Config Reference

| Field | Default | Description |
|-------|---------|-------------|
| `watched_profiles` | `[]` | Profiles to monitor for new posts |
| `own_posts` | `[]` | Your published LinkedIn post URLs |
| `notion_engagement_db_id` | `""` | Set automatically by setup-notion-db.ts |
| `settings.posts_per_profile` | `5` | How many recent posts to fetch per profile |
| `settings.inactive_skip_days` | `30` | Skip profiles with no post in N days (saves Proxycurl credits) |
| `settings.own_post_expiry_days` | `10` | Stop monitoring own posts after N days |
| `settings.generate_replies` | `false` | Legacy flag — replies are always on-demand now |

---

## Cost Reference

**Proxycurl (PAYG ~$0.01/credit):**

| Setup | Credits/run | Cost/day | Cost/month |
|-------|-------------|----------|------------|
| 2 profiles + 2 own posts | ~10 | $0.10 | $3.00 |
| 5 profiles + 3 own posts | ~21 | $0.21 | $6.30 |
| 10 profiles + 5 own posts | ~40 | $0.40 | $12.00 |

**Claude API (on-demand replies only):** ~$0.005/call. Essentially free unless you're generating dozens of replies daily.

---

## Verification Checklist

- [ ] `monitor-watched-accounts.ts --dry-run` returns posts without writing
- [ ] Live run populates `data/seen.db` (seen_posts table)
- [ ] Second run produces no duplicate Telegram alerts
- [ ] Notion Engagement Queue entries appear after run
- [ ] `monitor-own-comments.ts` with a real post URL detects comments
- [ ] `reply-generator.ts <page-id>` writes 5 labeled options to Notion
- [ ] Cron jobs fire at 8 AM daily

---

## Data Location

- **SQLite DB:** `.claude/Skills/LinkedInMonitor/data/seen.db` (gitignored)
- **Config:** `.claude/Skills/LinkedInMonitor/config/monitor-config.json`
- **Logs:** Printed to stdout — visible in cron output and PAI session history
