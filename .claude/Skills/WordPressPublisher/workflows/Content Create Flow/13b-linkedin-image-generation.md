# Step 13b: LinkedIn Image Generation

**Workflow Step:** 13b (between LinkedIn Extraction and Newsletter)
**Type:** PAUSE — Human review required
**Agent:** Art Skill (direct tool invocation)
**Est. Time:** 15-30 minutes

---

## Purpose

Generate platform-optimized 1:1 square images for each LinkedIn post using the Art skill. Images dramatically increase native reach on LinkedIn — posts with images get 2-3× more impressions than text-only.

This step mirrors Step 10 (long-form images) but is tuned for LinkedIn's feed format and audience expectations.

---

## Prerequisites

- Step 13 complete: `13-extracted-content/linkedin/posts/` populated with all 8 posts
- Art skill operational: `${PAI_DIR}/Skills/art/tools/generate-ulart-image.ts`
- Output directory created: `13-extracted-content/linkedin/images/`

---

## LinkedIn Image Specs

| Type | Width | Height | Aspect Ratio | Format | Command |
|------|-------|--------|--------------|--------|---------|
| **Portrait post (default)** | **1080px** | **1350px** | **4:5** | **PNG** | `--size 2K --aspect-ratio 4:5` |
| Square post | 1080px | 1080px | 1:1 | PNG | `--size 2K --aspect-ratio 1:1` |
| Infographic (HTML→PNG) | 1080px | 1350px | 4:5 | PNG | Screenshot at 2× (540px canvas) |

**Why 4:5 portrait (not 1:1 square)?**
- 4:5 portrait occupies the most vertical real estate in the LinkedIn feed — ~35% more screen than square
- LinkedIn does NOT letterbox 4:5 images on mobile — the full image renders edge-to-edge
- More visual area = more scroll-stopping power = higher engagement rate
- Use 1:1 only for simple quote cards where vertical space isn't needed

**Infographic canvas sizing:**
- HTML canvas: `width: 540px; min-height: 675px` (4:5 at 1×)
- Screenshot at `deviceScaleFactor: 2` → final 1080×1350px PNG
- The `.ig` element must NOT have `box-shadow`, and `body` must have `padding: 0; background: white`

---

## Which Posts Need Images

| Post | Type | Image Priority | Reasoning |
|------|------|----------------|-----------|
| Post 01 | Authority Post | ✅ **ALWAYS** | Highest reach potential — image amplifies authority signal |
| Post 02 | Framework Article | ✅ **ALWAYS** | Framework posts with visuals get saved/reshared more |
| Post 03 | Story Post | ✅ **ALWAYS** | Human story + image = highest emotional connection |
| Post 04 | Myth-Buster | Optional | Strong text-only if hook is sharp; image adds reach |
| Post 05 | Quick Win 1 | Optional | Quick wins can be text-only; image if time allows |
| Post 06 | Quick Win 2 | Optional | Same as Quick Win 1 |
| Post 07 | Case Study | ✅ **ALWAYS** | Proof point posts with visuals drive trust/credibility |
| Post 08 | Contrarian Take | Optional | Contrarian hooks are powerful solo; image is bonus |

**Minimum viable run:** Posts 01, 02, 03, 07 (4 images)
**Full run:** All 8 posts

---

## Prompt Generation — LinkedInImageGenerator Agent (MANDATORY)

> ⚠️ **DO NOT write prompts manually.** All prompts must come from the `LinkedInImageGenerator` agent. The agent applies the Opening Wound framework AND the style decision matrix (Da Vinci / Modern Alchemist / Napkin / Excalidraw). Bypassing the agent produces uniform "vintage ink wash" across all 8 images — no style variation.

### Step 13b-i: Generate All 8 Prompts via Agent

Launch a **single** `LinkedInImageGenerator` agent (model: `opus`) with all 8 post files. The agent will:

1. **Read each post in full** (three-pass method)
2. **Select the Opening Wound** — the single most emotionally resonant moment
3. **Choose the PAI Style** using the style decision matrix:

| Post Type | Audience Energy | Style |
|-----------|----------------|-------|
| Authority / Contrarian | C-Suite, declarative, timeless | **Da Vinci** |
| Framework / Quick Win | Operations leaders, professional | **Modern Alchemist** |
| Story / Case Study | Vulnerable, human, narrative | **Napkin** |
| Myth-Buster / Explanation | Educational, mechanism visible | **Excalidraw** |

4. **Apply the full PAI style spec** (colors, line weight, texture, rendering rules)
5. **Track style usage** across all 8 posts — max 2-3 per style, never 3+ consecutive same style
6. **Output validated candidate prompts** in the agent's standard format

**Agent prompt template:**
```
You are the LinkedInImageGenerator agent.
Read: ${PAI_DIR}/.claude/Skills/Art/agents/LinkedInImageGenerator.md

Generate prompts for all 8 LinkedIn posts from the workflow at:
${WORKFLOW_DIR}/13-extracted-content/linkedin/posts/

Posts: 01-authority-post.md through 08-closing-authority-post.md

Apply the full Style Decision Framework (Da Vinci / Modern Alchemist / Napkin / Excalidraw).
Track styles across the batch — max 2-3 per style, never 3+ consecutive.
Apply the complete PAI style spec (colors, line weight, texture) for every prompt.
Output all 8 prompts in the standard LinkedInImageGenerator output format.
```

### Step 13b-i.b: Validate Each Prompt via LinkedInImagePromptValidator

After the generator produces prompts, run **LinkedInImagePromptValidator** (model: `sonnet`) on each candidate.

- PASS → proceed to generation
- FAIL → the validator provides a revised prompt; use that instead

The validator checks:
- Three Pillars (Emotion, Scroll-Stopping, Curiosity)
- 7-point Anti-Pattern audit
- Opening Wound (Before state only — no resolution shown)

---

## Generation Commands

Once you have validated prompts from the `LinkedInImageGenerator` agent, generate with:

```bash
# Set workflow variables
WORKFLOW_ID="[your-workflow-id]"
PAI_DIR="/home/alvis/PAI"
IMG_DIR="${PAI_DIR}/scratchpad/content-create/${WORKFLOW_ID}/13-extracted-content/linkedin/images"

# Create output directory
mkdir -p "${IMG_DIR}"

# Replace [VALIDATED PROMPT N] with the exact prompt from the LinkedInImageGenerator agent output
# Each prompt will embed its own full PAI style spec (Da Vinci / Modern Alchemist / Napkin / Excalidraw)

bun run ${PAI_DIR}/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro --size 2K --aspect-ratio 4:5 \
  --output "${IMG_DIR}/post-01-authority.png" \
  "[VALIDATED PROMPT 01]"

bun run ${PAI_DIR}/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro --size 2K --aspect-ratio 4:5 \
  --output "${IMG_DIR}/post-02-case-study.png" \
  "[VALIDATED PROMPT 02]"

# ... repeat for posts 03-08
```

> The prompts come from the agent — do NOT write them manually. Each validated prompt includes the full style spec so no additional styling flags are needed.

---

## Review Checklist

**Batch-level (check before generating):**
- [ ] **Style variety confirmed:** Agent assigned different styles across the 8 posts — not all the same
- [ ] **No 3+ consecutive same style:** Review the style assignment list from the agent output
- [ ] **Style distribution:** All 4 styles (Da Vinci / Modern Alchemist / Napkin / Excalidraw) represented in the batch

**Per-image (check after generating):**
- [ ] **Opening Wound:** Does the image show the BEFORE pain — NOT the solution, framework, or resolution?
- [ ] **Human/Expressive Subject:** Is there a human, animal, or anthropomorphic figure with visible emotion, strain, or conflict?
- [ ] **Emotional Gut-Check:** Does it make you feel *"I know exactly how that feels"* before you read the post?
- [ ] **Style applied correctly:** Does the image match the assigned PAI style (Da Vinci parchment / Alchemist cream grid / Napkin beige / Excalidraw white)?
- [ ] **Scroll-Stop Quality:** Would this visually disrupt a feed of sterile corporate graphics?
- [ ] **Curiosity Gap:** Does the image create a puzzle that requires reading the post to understand?
- [ ] **No Text:** Zero readable text elements in the image

**Regenerate if:** Image is abstract geometry, a data visualization, a "metaphor" with no human, shows the resolution instead of the wound, looks clean/corporate/sterile, all images look the same style, or could apply to any post (not this specific one).

---

---

## Step 13b-ii: Push ALL Images to Notion for Review

After generation and local review, push **all image assets** — Opening Wound artwork AND infographics — to the **Notion Content Images database**. Each post can have multiple images; the Images relation on each post gives you options when publishing.

**Why multiple images per post?** Posts with infographics have both an Opening Wound art image (emotional/scroll-stopping) and an infographic (informational/saveable). Notion stores both so you can choose the right one per platform or use case at publish time.

### Step 13b-ii-a: Push Opening Wound Artwork

**Tool:**
```
${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-images-to-notion.ts
```

Automatically discovers all `post-NN-*.png` files in `13-extracted-content/linkedin/images/` and uploads them.

**Dry run first:**
```bash
bun run ${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-images-to-notion.ts \
  --workflow-dir ${PAI_DIR}/scratchpad/content-create/[workflow-id] \
  --dry-run
```

**Live run:**
```bash
bun run ${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-images-to-notion.ts \
  --workflow-dir ${PAI_DIR}/scratchpad/content-create/[workflow-id]
```

Saves all Notion IDs to `metadata.json → checkpoints.step-13b.notion_image_ids`.

### Step 13b-ii-b: Push Infographics (if any were created in Step 13b)

If infographics were built using the Infographic skill, upload them manually and add to `notion_image_ids` before running Step 13b-iii.

**Naming convention — CRITICAL:** Infographic files must be named `post-NN-infographic.png` (and animated GIFs `post-NN-animated.gif`) so Step 13b-iii can match them to the correct post by number.

```
post-03-infographic.png  ← matches post 03
post-04-infographic.png  ← matches post 04
post-04-animated.gif     ← also matches post 04 (multiple assets per post is fine)
post-07-infographic.png  ← matches post 07
```

Upload each infographic to Notion Images DB and append its entry to `metadata.json → checkpoints.step-13b.notion_image_ids`:

```json
{ "file": "post-03-infographic.png", "notion_id": "...", "notion_url": "https://..." }
```

**After this step, `notion_image_ids` contains ALL image assets** — artwork, infographics, and GIFs — for all posts.

**Review destination:**
```
https://www.notion.so/2733021756a1447d84a7143e2e9e97dd?v=fa8b79c2671347d69859aa99a67da0e4
```

---

## Metadata Update

After Step 13b-ii is complete, `metadata.json` holds all image entries across every asset type:

```json
"step-13b": {
  "completed": true,
  "notion_push_completed": true,
  "notion_push_timestamp": "[ISO8601]",
  "notion_image_ids": [
    { "file": "post-01-authority.png",    "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-02-case-study.png",   "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-03-framework.png",    "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-03-infographic.png",  "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-04-maturity.png",     "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-04-infographic.png",  "notion_id": "...", "notion_url": "https://..." },
    { "file": "post-04-animated.gif",     "notion_id": "...", "notion_url": "https://..." }
  ]
}
```

The matching key is the **leading post number** in the filename. Any file whose first digits match `NN` gets linked to post `NN`.

---

## Step 13b-iii: Push LinkedIn Post Text to Notion Content DB

After ALL images are in Notion (artwork + infographics), push the post text so every Content DB entry has the full body and all image options linked.

**Why?** The Content DB is the review hub. Opening any post shows the body text, strategic notes, and every image option in the Images relation — artwork, infographic, GIF — side by side for selection at publish time.

**Order dependency:** Run AFTER Step 13b-ii (both artwork AND infographics uploaded). The tool reads all `notion_image_ids` from `metadata.json` to build the full relation list.

**Tool:**
```
${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-posts-to-notion.ts
```

**How it works:**
1. Creates 8 Content DB entries (one per post) with all metadata properties
2. Sets the LinkedIn icon on each entry automatically
3. Sets `Campaign` = workflow ID for filtering
4. Links **ALL matching images** to each post via the Images relation — artwork + infographics + GIFs, not just one
5. Syncs full post body text to the Notion page
6. Writes `notion_id` to each post file's frontmatter (enables idempotent re-runs)
7. On re-runs, also re-links images (picks up new infographics added after the initial push)

**Image matching rule:** Files in `notion_image_ids` where the first digits in the filename match the post number are ALL linked. `post-04-infographic.png` and `post-04-animated.gif` both match post `04`.

**Dry run first:**
```bash
bun run ${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-posts-to-notion.ts \
  --workflow-dir ${PAI_DIR}/scratchpad/content-create/[workflow-id] \
  --dry-run
```

**Live run:**
```bash
bun run ${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-posts-to-notion.ts \
  --workflow-dir ${PAI_DIR}/scratchpad/content-create/[workflow-id]
```

**Review destination:**
```
https://www.notion.so/3030760eb0cd81c5874be6f7e9637807
```

**Verification checklist:**
- [ ] 8 Content entries visible in Notion Content DB
- [ ] Each entry has the LinkedIn icon (blue square with "in")
- [ ] Campaign column shows workflow ID on all entries
- [ ] Posts with infographics show **multiple images** in the Images relation (e.g., post 04 shows 3)
- [ ] Posts without infographics show exactly 1 image in the Images relation
- [ ] Clicking any entry shows the full post body text
- [ ] Console output shows `linked N image(s)` — if it says `⚠️ no image match`, stop and fix before proceeding

---

## Next Step

**→ Step 14: Newsletter Creation** (`14-newsletter-creation.md`)

Once posts and images are visible and linked in Notion, proceed to Step 14.

```
LinkedIn posts and images in Notion (Content DB + Images DB).
All entries have Campaign tag, LinkedIn icon, and image references.
Proceeding to Step 14: Newsletter Creation (Triage Model)...
```
