---
name: LinkedInMonitor
description: LinkedIn engagement monitor for watched accounts and own post comments. USE WHEN user wants to check LinkedIn for new posts from watched profiles OR new comments on own posts OR generate reply options for a Notion engagement queue entry OR set up LinkedIn monitoring. Monitors via Proxycurl, alerts via Telegram, queues in Notion.
---

# LinkedInMonitor Skill

Monitors LinkedIn for engagement opportunities:
- **Feature 1:** Watched accounts post something new → Telegram alert + Notion queue entry
- **Feature 2:** Someone comments on Alvis's posts → Telegram alert + Notion queue entry
- **Feature 3:** On-demand reply generation → 5 options written back to Notion entry

## Quick Commands

```bash
# Run watched-account monitor (Feature 1)
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-watched-accounts.ts

# Run own-post comment monitor (Feature 2)
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/monitor-own-comments.ts

# One-time Notion DB setup
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/setup-notion-db.ts

# Generate replies for a Notion entry (on-demand)
cd /home/alvis/PAI && bun run .claude/Skills/LinkedInMonitor/tools/reply-generator.ts [notion-page-id]
```

## Workflows

- `workflows/LinkedInMonitor.md` — Full usage guide, config reference, add profiles

## Config

`config/monitor-config.json` — watched profiles, own post URLs, Notion DB ID, settings
