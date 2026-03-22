---
name: AnimateImage
description: AI-powered image animation skill. USE WHEN user wants to animate an image OR make an image a GIF OR bring a static image to life OR add motion to a photo OR user says "animate this" OR "make this a gif" OR "add movement to this image" OR "create animation for this image". Analyzes image with Claude Vision, infers natural motion, generates LinkedIn-optimized animated GIF via Replicate, and pushes to Notion as a separate entry linked to the correct article.
---

# AnimateImage Skill

Takes a static image → analyzes it with Claude Vision → generates motion via Replicate → produces a LinkedIn-optimized animated GIF → pushes directly to Notion as a separate entry linked to the article.

**Key principles:**
- Claude decides what to animate — user just points at an image
- Output is always LinkedIn-ready (540×675px, 6fps, <5MB) automatically
- Notion entry is always separate from the static image entry
- GIF uploads directly to Notion — never via WordPress

---

## Workflow

| Workflow | Trigger | File |
|----------|---------|------|
| **Animate** | any animation request | `workflows/Animate.md` |

**When executing, do BOTH:**
1. `~/.claude/Tools/SkillWorkflowNotification Animate AnimateImage`
2. Output: `Running the **Animate** workflow from the **AnimateImage** skill...`

---

## Tools

| Tool | Purpose |
|------|---------|
| `tools/animate-image.ts` | Image → Replicate → LinkedIn-optimized GIF |
| `tools/push-to-notion.ts` | GIF → Notion upload + DB entry + article link |

---

## LinkedIn Output Spec (non-negotiable)

| Property | Value | Why |
|----------|-------|-----|
| Dimensions | 540×675px | 4:5 portrait — LinkedIn standard |
| FPS | 6 | Smooth enough, keeps file small |
| Colors | 64 | Big savings for illustrated/cartoon images |
| Max size | 5MB | LinkedIn upload limit |
| Format | GIF | Loops automatically on LinkedIn |

---

## Notion Pattern

Animated GIFs always get their own separate DB entry in the Content Images DB:

| Property | Value |
|----------|-------|
| Style | Animated |
| Model | animated |
| Image Type | Animated GIF |
| Aspect Ratio | 4:5 |
| Resolution | 540x675px |
| Campaign | {campaign-tag} |

The static image entry is **never modified**. The animated entry is linked to the article's `Images` relation alongside the static image.

---

## Environment

Requires:
- `REPLICATE_API_KEY` in `/home/alvis/PAI/.claude/.env`
- `NOTION_API_KEY` in `/home/alvis/.claude/mcpServers.json` (auto-loaded)

---

## Models

| Key | Model | Cost/sec | Use when |
|-----|-------|----------|---------|
| `wan-720p` | wavespeedai/wan-2.1-i2v-720p | ~$0.25 | Default — best quality |
| `wan-480p` | wavespeedai/wan-2.1-i2v-480p | ~$0.09 | GIF is over 5MB, re-run cheaper |
