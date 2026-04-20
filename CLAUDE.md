# PAI — Personal Workflow Operating Rules

This is **Personal Mode**. Full 14-step content production workflow for Alvis House.
For client work, open Ghost Agency Hub: `/home/alvis/GhostAgencyHub/`

---

## Workflow Gates — Never Skip

The 14-step workflow has 7 mandatory PAUSE points. Do not proceed past any gate without explicit user input.

| Step | Gate | Waits For |
|------|------|-----------|
| 1 | Ideation | User selects topic from evergreen tracks or other-topics.md |
| 4 | Select Big Idea | User selects one from the 3-5 generated big ideas |
| 6 | Select Headline | User selects one headline set from the 5 generated |
| 9 | Manual Review + Image Reqs | User approves cornerstone draft + creates image manifest |
| 10 | Create All Images | User reviews and approves all generated images |
| 11 | HTML Preview & Assembly | User approves HTML preview before publish |
| 13 | Content Extraction + LinkedIn Images | User reviews extracted LinkedIn posts before image gen |

**Never auto-advance past a PAUSE step.** Present output, stop, wait.
Step 13b (LinkedIn image generation) does not begin until Step 13 posts are explicitly approved.

---

## Image Generation Pre-flight

Run this checklist mentally before every `generate-ulart-image.ts` call. Wrong flags waste API credits and produce unusable output.

### Model + size flag compatibility

| Model | Correct size flag | Common failure |
|-------|------------------|----------------|
| `flux` | `--size 1:1` (aspect ratio) | Using pixel dimensions |
| `nano-banana` | `--size 4:5` (aspect ratio) | Using pixel dimensions |
| `nano-banana-pro` | `--size 2K --aspect-ratio 4:5` (BOTH required) | Using `--size 4:5` alone — silently wrong |
| `gpt-image-1` | `--size 1024x1536` (pixel dimensions) | Using aspect ratio string |

**nano-banana-pro is the most common failure**: it requires `--size` (quality: 1K/2K/4K) AND `--aspect-ratio` as separate flags. Never combine them into one.

### Standard LinkedIn image command
```bash
bun /home/alvis/PAI/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 4:5 \
  --output scratchpad/content-create/{workflow-id}/10-images/{filename}.png \
  "{prompt}"
```

### Standard blog featured image
```bash
--size 2K --aspect-ratio 16:9
```

### Pre-flight steps
1. Confirm model name is exactly one of: `flux | nano-banana | nano-banana-pro | gpt-image-1`
2. Confirm size + aspect-ratio flags match model requirements above
3. Confirm output directory exists before running
4. For LinkedIn posts: confirm `--aspect-ratio 4:5` (not 1:1 unless specifically requested)
5. Read `09-image-manifest.md` — use the approved prompts, not improvised ones

---

## Notion Integration — Required Fields

Every LinkedIn post push to Notion must include ALL of these fields in the same API call. Missing any field = silent data corruption or broken relations.

| Field | Type | Notes |
|-------|------|-------|
| Title | String | Hook line 1 of the post |
| Status | Select | Set to "Generated" for new pushes |
| Post Type | Select | Authority / Framework / Story / Myth-Buster / Quick Win / Case Study / Contrarian |
| Word Count | Number | Required — do not omit |
| Posting Number | Number | 1–8 sequential |
| Icon | Emoji | Authority=🏆 Framework=🗺️ Story=📖 Myth-Buster=💡 Quick Win=⚡ Case Study=📊 Contrarian=🔄 |
| Workflow | Relation | Link to parent workflow page ID from `metadata.json` → `notion.workflow_id` |

### Push sequence
1. Read `metadata.json` → get `notion.workflow_id` — abort if null
2. Push post body (no title in body — title goes in the Title property only)
3. Set all required property fields in the same API call
4. Save returned Notion page ID back to `metadata.json`

### Use MCP tools, not raw API
Use Notion MCP tools for all Notion operations. Auth is handled automatically.
Only fall back to raw API if MCP is unavailable.

---

## API Integration Pre-flight

Before any call to an external API, run this checklist. Guessing API contracts is the #1 source of wasted debugging cycles.

1. **Can the MCP tool handle this?** Use MCP first — it manages auth, rate limits, and field mapping. Only use curl/REST if MCP is unavailable or insufficient.

2. **If using curl — read credentials from the config file, never from memory:**
   - WordPress: `/home/alvis/PAI/.claude/Skills/WordPressPublisher/config/wordpress-sites.json`
   - Substack: `/home/alvis/PAI/.claude/Skills/WordPressPublisher/config/substack-config.json`
   - Notion token: `/home/alvis/.claude/mcpServers.json` → `mcpServers.notion.env.NOTION_API_KEY`

3. **WordPress REST API requires an application password, not the account password:**
   ```bash
   # Generate auth header:
   echo -n "username:app_password" | base64 -w0
   # Header: "Authorization: Basic {base64string}"
   ```

4. **Image upload before post creation** — always upload images via REST API binary upload before creating the WordPress post. The MCP `create_media` tool requires a public source_url; local files must go through the REST endpoint first. See `tools/upload-images-to-wordpress.ts`.

5. **WordPress post content rules:**
   - Strip `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>` tags from content before upload
   - No CSS custom properties (`var(--x)`) — use inline hex values
   - Featured image goes in `featured_media` field only, not in content body
   - After `create_post`, set meta fields (`eyebrow_text`, `subtitle`) via a separate REST call

---

## LinkedIn Post Standards

These rules apply to all 8 posts extracted in Step 13. Verify before marking Step 13 complete.

### Hook character limits (check every post)
- Line 1: ≤65 chars (≤55 preferred for mobile)
- Line 2: ≤40 chars (≤35 preferred for mobile)
- Test: `echo -n "line text" | wc -c`

### Proven hook formula — Binary Reframe
```
Line 1: [The common belief stated neutrally]     ← ≤65 chars
Line 2: [The opposite is true — 4-8 words]       ← ≤40 chars
```

### Post type distribution (8 posts per run)
| File | Type |
|------|------|
| `post-01-authority.md` | Authority — credibility + framework signal |
| `post-02-framework.md` | Framework — named mental model or system |
| `post-03-story.md` | Story — vulnerability or transformation narrative |
| `post-04-myth-buster.md` | Myth-Buster — binary reframe hook (highest engagement) |
| `post-05-quick-win.md` | Quick Win — single actionable insight |
| `post-06-quick-win.md` | Quick Win — single actionable insight |
| `post-07-case-study.md` | Case Study — social proof with outcome |
| `post-08-contrarian.md` | Contrarian — challenges dominant industry belief |

### Formatting rules
- No external links in post body — LinkedIn suppresses reach ~40-50%. CTAs go in first comment.
- No em dashes (—) — AI content signal. Replace with comma, colon, or period.
- No hedge words: maybe, perhaps, I think, could be, might
- Max 2 lines per paragraph
- 5th-grade reading level
- End with a single question or engagement prompt — not a summary statement

---

## Newsletter Publishing Standards

Newsletter is a personal workflow deliverable (Step 14). These rules prevent the formatting failures that caused repeated Substack publishing friction.

### Tiptap JSON structure for Substack
Images require a `captionedImage` wrapper — bare `image2` nodes render broken:
```json
{
  "type": "captionedImage",
  "content": [{
    "type": "image2",
    "attrs": { "src": "...", "imageSize": "normal", "isProcessing": false }
  }]
}
```

### No duplicate titles
The newsletter title is set in the platform's title field. Do not include a matching H1 in the body. Both WordPress and Substack render the title separately — a body H1 creates a visible duplicate.

### Quality gates (do not publish below these)
- Validation score: ≥ 0.70 / 1.00
- Forward Test: ≥ 4 / 5
- Word count: 1,500–2,000 words
- No em dashes anywhere in body content

### Subject line + preheader formula
Write these as an inseparable 2-line inbox hook:
- **Subject** (≤50 chars): Pain-first or contrarian. No stats. No "How to" or "Why".
- **Preheader** (≤100 chars): Deepens the wound or raises stakes. Not explanatory.
- Test: read subject + preheader aloud as one sentence — if it sounds like a summary, rewrite it.

### Substack two-phase image process
1. API draft creation (images uploaded via API)
2. Playwright editor pass (converts images to Substack CDN URLs)
Skipping the Playwright pass = images invisible in the published post.
