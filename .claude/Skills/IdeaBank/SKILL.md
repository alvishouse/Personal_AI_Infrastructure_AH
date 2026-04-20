---
name: IdeaBank
description: Telegram-triggered content idea capture and scoring system. USE WHEN user sends #idea or #vet via Telegram OR wants to set up the Idea Bank OR asks about the Notion Idea Bank database. Captures ideas from text or YouTube URLs, scores on 5 dimensions, saves to Notion.
---

# IdeaBank Skill

**Purpose:** Capture content ideas on-the-fly via Telegram — from a passing thought, a YouTube video, or a podcast moment — and immediately score them for LinkedIn/newsletter potential.

**Trigger tags (send via Telegram bot):**
- `#idea <text>` — capture a manual idea, auto-score, add to Notion
- `#idea https://youtube.com/... [optional callouts]` — fetch transcript, extract concepts, score, add to Notion
- `#vet <text>` — same as #idea; the word "vet" signals explicit scoring intent but processing is identical

---

## How It Works

### Manual idea
```
User sends: #idea AI tools fail because companies optimize for tool adoption not behavior change

Claude:
1. Scores across 5 dimensions (Audience Relevance, Business Alignment, Timeliness, Differentiation, Extraction Potential)
2. Assigns tier: 🔥 Hot (≥20) | ♨️ Warm (≥14) | ❄️ Cold (<14)
3. Creates Notion entry in Idea Bank database
4. Replies with score card + rationale
```

### YouTube idea
```
User sends: #idea https://youtube.com/watch?v=xyz

Claude:
1. Fetches transcript via yt-dlp (no API key needed)
2. Extracts 5-8 key content angles via Claude Haiku
3. Scores idea from transcript concepts
4. Creates Notion entry with full transcript summary
5. Replies with score card + top concepts preview
```

### YouTube idea + user callouts
```
User sends: #idea https://youtube.com/watch?v=xyz The part about measurement frameworks was key. Also noticed the 70/20/10 model.

Claude:
1. Fetches transcript
2. Extracts concepts from transcript
3. Adds user's callouts as supplementary input
4. Scores combining transcript concepts + user highlights
5. Creates Notion entry with both transcript summary and addendum
```

---

## Scoring Framework (5 dimensions × 5 points = 25 max)

| Dimension | What it measures |
|-----------|-----------------|
| **Audience Relevance** | How directly does this address Mid-Market squeezed leaders' daily pain? |
| **Business Alignment** | Does this support AI Readiness & Adoption positioning and the offer? |
| **Timeliness** | Is this relevant NOW? News hook? Will it still resonate in 3 months? |
| **Differentiation** | Fresh take? Cross-domain angle? Could only Alvis House write this? |
| **Extraction Potential** | Can this become 3+ LinkedIn posts + newsletter + cornerstone? |

**Tiers:**
- `🔥 Hot` — ≥20/25: Start content workflow now
- `♨️ Warm` — 14–19/25: Add to queue, revisit monthly
- `❄️ Cold` — <14/25: Archive; don't invest more time

---

## Notion Idea Bank Database

**Views (create manually in Notion UI after setup):**

| View | Type | Filter/Sort |
|------|------|------------|
| **Capture** | Table | Sorted by Created Date desc — all recent ideas |
| **Ranked** | Table | Sorted by Total Score desc — filter: Status = Captured/In Progress |
| **Hot Ideas** | Gallery | Filter: Tier = 🔥 Hot |
| **Archive** | Table | Filter: Status = Used or Archived |

**Properties:**

| Property | Type | Notes |
|----------|------|-------|
| Name | Title | AI-generated short title (max 8 words) |
| Source | Select | Manual, YouTube, Podcast, Article, Observation |
| Raw Input | Text | Original message sent to Telegram |
| YouTube URL | URL | When source is YouTube |
| Transcript Summary | Text | AI-extracted key concepts from video |
| Addendum | Text | User's own callouts after YouTube URL |
| Audience Relevance | Number | 1–5 |
| Business Alignment | Number | 1–5 |
| Timeliness | Number | 1–5 |
| Differentiation | Number | 1–5 |
| Extraction Potential | Number | 1–5 |
| Total Score | Formula | Sum of 5 dimensions (auto-calculated by Notion) |
| Tier | Select | 🔥 Hot / ♨️ Warm / ❄️ Cold |
| Scoring Notes | Text | Claude's 2-3 sentence rationale |
| Track Alignment | Text | Which Evergreen Track this connects to |
| Status | Select | Captured → In Progress → Used / Archived |
| Created Date | Date | When captured |

---

## Setup (one-time)

### 1. Create the Notion database
```bash
cd /home/alvis/PAI && bun run --env-file .claude/.env .claude/Skills/IdeaBank/tools/setup-notion-db.ts <parent-page-id>
```

The parent page ID is the last 32 hex characters of any Notion page URL. The database will be created under that page, and the DB ID saved to `config/ideabank-config.json` automatically.

### 2. Create 4 views in Notion UI
After setup, open the database in Notion and add:
- **Capture** — Table view, sort: Created Date desc
- **Ranked** — Table view, sort: Total Score desc, filter: Status ≠ Used/Archived
- **Hot Ideas** — Gallery view, filter: Tier = 🔥 Hot
- **Archive** — Table view, filter: Status = Used or Archived

### 3. Restart the Telegram listener
```bash
# Stop existing listener if running
bash .claude/Skills/LinkedInMonitor/tools/stop-listener.sh 2>/dev/null || true

# Start unified listener (handles both reply callbacks AND #idea/#vet)
bash .claude/Skills/LinkedInMonitor/tools/start-listener.sh
```

### 4. Test
Send `#idea AI tools fail because companies optimize for tool adoption not behavior change` in Telegram.
You should receive a score card reply within ~10 seconds.

---

## Tools

| Tool | Purpose |
|------|---------|
| `tools/fetch-youtube-transcript.ts` | Fetches YouTube transcript via yt-dlp, parses VTT to plain text |
| `tools/vet-idea.ts` | Scores an idea across 5 dimensions, extracts YouTube concepts |
| `tools/notion-ideas.ts` | Creates Notion Idea Bank entries |
| `tools/setup-notion-db.ts` | One-time database creation |

---

## Quick Commands

```bash
# Set up Notion database
cd /home/alvis/PAI && bun run --env-file .claude/.env .claude/Skills/IdeaBank/tools/setup-notion-db.ts <parent-page-id>

# Test transcript fetching
cd /home/alvis/PAI && bun run --env-file .claude/.env .claude/Skills/IdeaBank/tools/fetch-youtube-transcript.ts https://youtube.com/watch?v=...

# Start the Telegram listener (also handles LinkedIn reply callbacks)
bash /home/alvis/PAI/.claude/Skills/LinkedInMonitor/tools/start-listener.sh
```

---

## Config

`config/ideabank-config.json`:
```json
{
  "notion_ideas_db_id": "<set by setup-notion-db.ts>",
  "settings": {
    "vet_model": "claude-sonnet-4-6",
    "concept_model": "claude-haiku-4-5-20251001"
  }
}
```

- `vet_model` — model used for 5-dimension scoring (default: Sonnet)
- `concept_model` — model used for YouTube concept extraction (default: Haiku — cheaper, fast enough)
