# Animate Workflow

Full end-to-end: static image → LinkedIn-optimized animated GIF → Notion (separate entry, linked to article).

## Complete Steps (run every time, no shortcuts)

### 1. Confirm the image

User points at an image. Identify the full absolute path.

### 2. Analyze the image with Claude Vision (YOU do this)

Read the image. Generate a concise motion prompt (1-3 sentences) describing ONLY natural, realistic motion:
- Physical activities (washing, typing, writing, stirring)
- Environmental motion (water flowing, steam rising, leaves swaying, fire flickering)
- Body movement implied by pose (arms scrubbing, hands moving, figures walking)

Do NOT describe camera movement, facial expressions, or scene changes.

### 3. Generate the GIF

```bash
bun run /home/alvis/PAI/.claude/Skills/AnimateImage/tools/animate-image.ts \
  --image /absolute/path/to/image.png \
  --prompt "your motion prompt here"
```

Output is automatically LinkedIn-optimized:
- **Dimensions:** 540×675px (4:5 portrait)
- **FPS:** 6
- **Colors:** 64
- **Target size:** <5MB
- **File:** `{original-name}-animated-linkedin.gif` saved alongside source image

### 4. Push to Notion

```bash
bun run /home/alvis/PAI/.claude/Skills/AnimateImage/tools/push-to-notion.ts \
  --gif /absolute/path/to/output-animated-linkedin.gif \
  --campaign "YYYY-MM-DD-slug" \
  --post-num "02" \
  --post-name "Short descriptive name of the post" \
  --article-title "Partial title to match article in Content DB"
```

This does all of the following automatically:
- Uploads GIF **directly to Notion** (not WordPress)
- Creates a **new separate DB entry** in Content Images DB (static entry is untouched)
- Adds GIF as animated **image block** inside the new page
- Finds the article in the Content DB and **appends** to its Images relation (preserving existing links)

### 5. Report to user

Tell the user:
- Notion page URL for the new animated GIF entry
- GIF file size
- Motion prompt used
- Article it was linked to

---

## Rules (never skip these)

- **ALWAYS** create a separate Notion entry — never modify the static image entry
- **NEVER** upload to WordPress — Notion direct upload only
- **ALWAYS** preserve existing Images relations when linking to articles
- **ALWAYS** use the LinkedIn-optimized output (`-animated-linkedin.gif`), not the raw GIF
- The GIF must be **<5MB** — if the tool warns about size, re-run with `--model wan-480p`

---

## Example (full run)

User: "Animate the dishes image from the dumb pipe series"

**Step 2 — Vision analysis:**
"Two stick figures — top has 2 arms washing dishes slowly at a sink with water running. Bottom figure has 8 arms moving simultaneously, scrubbing, rinsing, wiping dishes rapidly with water splashing."

**Motion prompt:** `"Water trickles from the faucet as the top figure scrubs slowly with 2 arms. The bottom multi-armed figure moves all 8 arms simultaneously — scrubbing, wiping, rinsing — with water splashing dynamically."`

**Step 3:**
```bash
bun run /home/alvis/PAI/.claude/Skills/AnimateImage/tools/animate-image.ts \
  --image /home/alvis/PAI/scratchpad/content-create/2026-02-15-dumb-pipe-phenomenon/13-extracted-content/linkedin/images/post-02-ow.png \
  --prompt "Water trickles from the faucet as the top figure scrubs slowly with 2 arms. The bottom multi-armed figure moves all 8 arms simultaneously — scrubbing, wiping, rinsing — with water splashing dynamically."
```

**Step 4:**
```bash
bun run /home/alvis/PAI/.claude/Skills/AnimateImage/tools/push-to-notion.ts \
  --gif /home/alvis/PAI/scratchpad/content-create/2026-02-15-dumb-pipe-phenomenon/13-extracted-content/linkedin/images/post-02-ow-animated-linkedin.gif \
  --campaign "2026-02-15-dumb-pipe" \
  --post-num "02" \
  --post-name "2 Arms vs Intelligence Layer" \
  --article-title "Outgunned"
```
