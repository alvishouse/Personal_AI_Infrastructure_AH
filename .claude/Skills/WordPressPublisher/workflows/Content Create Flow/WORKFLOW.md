# Content Creation Workflow

## Overview

A 14-step semi-automated workflow for creating cornerstone content with full image workflow and multi-platform extraction.

> **Note on Image Upload (Step 12):** WordPress MCP `create_media` requires a public source_url.
> Local images MUST be uploaded via WordPress REST API binary upload before creating the post.
> See Step 12 for the exact curl commands and `tools/upload-images-to-wordpress.ts` for automation.

**Workflow ID Format:** `[YYYY-MM-DD]-[topic-slug]`

---

## Workflow Architecture

```
                    ┌─────────────────────┐
                    │   MAIN ORCHESTRATOR │
                    │    (Claude Code)    │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌───────────────────┐ ┌───────────────────┐ ┌───────────────────┐
│ content-researcher│ │  content-writer   │ │  content-editor   │
│   (Sonnet)        │ │    (Opus)         │ │   (Sonnet)        │
│   Color: CYAN     │ │   Color: GREEN    │ │   Color: ORANGE   │
│                   │ │                   │ │                   │
│ • WebSearch       │ │ • Big Ideas       │ │ • Review          │
│ • 100+ research   │ │ • Headlines       │ │ • Checklist       │
│   points          │ │ • Cornerstone     │ │ • Voice match     │
└───────────────────┘ └───────────────────┘ └───────────────────┘
```

### Custom Agents Location

The three content agents are defined in:
- `${PAI_DIR}/.claude/Agents/ContentResearcher.md` (cyan, sonnet)
- `${PAI_DIR}/.claude/Agents/ContentWriter.md` (green, opus)
- `${PAI_DIR}/.claude/Agents/ContentEditor.md` (orange, sonnet)

---

## Complete Workflow (14 Steps)

### Phase 1: Ideation & Research

| Step | Name | Type | Agent | Output |
|------|------|------|-------|--------|
| 1 | Ideation | **PAUSE** | Human | Topic selection |
| 2 | Deep Research | Auto | **content-researcher** (cyan) | `01-research.md` |
| 3 | Create Big Ideas | Auto | **content-writer** (green) | `02-big-ideas.md` |

### Phase 2: Selection & Headlines

| Step | Name | Type | Agent | Output |
|------|------|------|-------|--------|
| 4 | Select Big Idea | **PAUSE** | Human | `03-selected-big-idea.md` |
| 5 | Create Headlines | Auto | **content-writer** (green) | `04-headlines.md` |
| 6 | Select Headline | **PAUSE** | Human | `05-selected-headline.md` |

### Phase 3: Creation & Review

| Step | Name | Type | Agent | Output |
|------|------|------|-------|--------|
| 7 | Long Form Post | Auto | **content-writer** (green) | `06-cornerstone-draft.md` |
| 8 | Sub-agent Review | Auto | **content-editor** (orange) | `07-editor-review.md` |
| 9 | Manual Review + Image Reqs | **PAUSE** | Human | `08-cornerstone-final.md`, `09-image-manifest.md` |

### Phase 4: Images & Preview

| Step | Name | Type | Agent | Output |
|------|------|------|-------|--------|
| 10 | Create All Images | **PAUSE** | Art Skill | `10-images/` directory |
| 11 | HTML Preview & Assembly | **PAUSE** | Human | `11-cornerstone-assembled.md`, `12-html-preview/` |

### Phase 5: Publish & Extract

| Step | Name | Type | Agent | Output |
|------|------|------|-------|--------|
| 12 | Image Upload + WordPress Post | Auto | WP REST API + WP Publisher | Published draft with images |
| 13 | Content Extraction + Platform Images | **PAUSE** | **content-researcher** (cyan) + Human | `13-extracted-content/` |
| 13b | LinkedIn Image Generation | **PAUSE** | Art Skill | `13-extracted-content/linkedin/images/` |

---

## Step-by-Step Instructions

### Step 1: Ideation [PAUSE]

**Purpose:** Select topic from evergreen or other topics.

**Action:**
1. Present topics from `inner-album-of-greatest-hits.md` (Tracks 1-10)
2. Present topics from `other-topics.md`
3. User selects one topic

**User Prompt:**
```
Which topic would you like to create content about?

**Evergreen Tracks:**
1. AI Fails When You Ignore the System (Systems)
2. The Training Trap (Culture)
3. Your AI Is Only as Smart as Your Data Flow (Workflow)
4. The 60% Problem (Strategy)
5. From Pilot to Scale — The 74% Trap (Paradigm Shift)
6. Design Thinking Is AI's Missing Language (Communication)
7. BYOAI Is Killing Your Strategy (Resources)
8. The 6 Pillars of AI Readiness (Resiliency)
9. Efficiency Is the Gateway Drug (Efficiency)
10. Judgment Over Automation (Decisions)

**Other Topics:** [List from other-topics.md]

**Or:** Enter a custom topic
```

**Output:** Save selection to `metadata.json`:
```json
{
  "workflow_id": "2026-01-31-ai-strategy-gap",
  "topic": "The 60% Problem (AI Strategy Gap)",
  "track": "Track 4",
  "status": "step-1-complete"
}
```

---

### Step 2: Deep Research [AUTO]

**Purpose:** Conduct comprehensive research on selected topic.

**Agent:** Sonnet (Research)

**Context Files to Load:**
- `icp-mid-market-squeezed.md`
- `business-offer-profile.md`
- `alvis-house-voice-style-guide.md`
- `00-brief.md` ← **User-provided brief (if exists).** Check the workflow directory for this file FIRST. If present, treat it as the primary creative brief — the researcher's job is to find evidence, data, and depth that supports and expands the concepts in the brief, not to reframe the topic from scratch.

**Research Prompt:**
```
[Load the Research prompt from Content-creation-flow.md]

Topic: [SELECTED_TOPIC]
ICP: Mid-Market Squeezed (Directors/VPs of Operations, C-Level Executives)
Business Context: AI Readiness & Adoption Program

If 00-brief.md exists in the workflow directory:
- Read it first. Treat the user's concepts, framing, and examples as anchors.
- Research goal: find data, studies, and case studies that validate and deepen
  what the brief already contains. Surface evidence the user may not have.
- Do NOT replace the brief's core angles — build on them.

Compile 100+ research points including:
- Academic/industry studies with citations
- Contrarian patterns vs. common advice
- Case studies and real examples
- Common objections from forums
- Analogies and frameworks
```

**Output:** Save to `01-research.md`

**Automatic Transition:** Proceed to Step 3

---

### Step 3: Create Big Ideas [AUTO]

**Purpose:** Generate 3-5 big ideas from research.

**Agent:** Opus (Writer)

**Context Files:**
- `01-research.md`
- `icp-mid-market-squeezed.md`
- `business-offer-profile.md`
- `alvis-house-voice-style-guide.md`

**Big Idea Prompt:**
```
[Load the Big Idea prompt from Content-creation-flow.md]

Based on the research provided, create 3-5 Big Ideas that:
1. Capture attention relative to the ICP's situation
2. Provide clarity and new hope
3. Stand out from solutions they've heard before
4. Bridge the gap between current situation and desired outcome

For each Big Idea, identify which discovery method applies:
- Loophole/Flaw
- Insider Secret
- Massive Result
- New Discovery/Unique Mechanism
- Advantage
- Controversial Opinion
```

**Output:** Save to `02-big-ideas.md`

**Automatic Transition:** Pause for Step 4

---

### Step 4: Select Big Idea [PAUSE]

**Purpose:** User selects the winning big idea.

**Action:**
1. Present 3-5 big ideas
2. User selects one

**User Prompt:**
```
Here are the Big Ideas generated:

**Big Idea 1:** [Title]
[Description]
Discovery Method: [Method]

**Big Idea 2:** [Title]
[Description]
Discovery Method: [Method]

[Continue for all ideas]

Which Big Idea resonates most with your audience?
```

**Output:** Save selection to `03-selected-big-idea.md` and update `metadata.json`

---

### Step 5: Create Headlines [AUTO]

**Purpose:** Generate 5 headline sets (eyebrow/headline/deck).

**Agent:** Opus (Writer)

**Context Files:**
- `03-selected-big-idea.md`
- `01-research.md`
- `alvis-house-voice-style-guide.md`

**Headline Prompt:**
```
[Load the Headline prompt from Content-creation-flow.md]

Based on the selected Big Idea, create 5 different headline sets.

Each set must include:
- Eyebrow (pre-head): Sets context, identifies audience
- Headline: Main attention-grabber
- Deck Copy (subhead): Supporting information

Each headline must hit these elements:
- Curiosity
- Call Out Pain Point
- Promise Solution
- Specificity
- Simplicity
- Credibility/Address Skepticism
- Time Frame (when applicable)

Incorporate the Big 4 sentiments: New, Easy, Safe, Big
```

**Output:** Save to `04-headlines.md`

**Automatic Transition:** Pause for Step 6

---

### Step 6: Select Headline [PAUSE]

**Purpose:** User selects the winning headline set.

**User Prompt:**
```
Here are the headline sets:

**Set 1:**
Eyebrow: [Eyebrow]
Headline: [Headline]
Deck: [Deck]

[Continue for all sets]

Which headline set would you like to use?
```

**Output:** Save to `05-selected-headline.md` and update `metadata.json`

---

### Step 7: Long Form Post [AUTO]

**Purpose:** Generate cornerstone content using 7-Element Blueprint.

**Agent:** Opus (Writer)

**Context Files:**
- `01-cornerstone-creation-system-prompt.md`
- `05-selected-headline.md`
- `03-selected-big-idea.md`
- `01-research.md`
- `alvis-house-voice-style-guide.md`
- `icp-mid-market-squeezed.md`
- `business-offer-profile.md`

**Creation Instructions:**
```
Create a cornerstone post (2,500-5,000 words) using the 7-Element Magnetic Blueprint:

1. HOOK (200-300 words) - Pattern interrupt + identity filter
2. CHALLENGE (embedded) - 3 specific pain points
3. OPPORTUNITY (embedded) - 3-4 transformations
4. EXPERT STORY (400-600 words) - 3S Formula: Structure, Struggle, Solution
5. FRAMEWORK (800-1200 words) - Named system with steps + 2 research studies
6. CASE STUDIES (600-800 words) - 5 examples (famous, client, personal, relatable, cautionary)
7. MYTH/MINDSET (300-400 words) - Limiting belief addressed
8. APPLICATION (500-700 words) - Week-by-week plan + checklist
9. CLOSE (150-200 words) - Framework recap + identity affirmation + next step

Include image placeholders using the format from content-image-references.md:
<!-- IMAGE
Type: [type]
Concept: [concept]
Style: [style]
Size: [dimensions]
Alt Text: [description]
-->

Voice: Alvis House - declarative, optimistic yet challenging, 5th-grade reading level
```

**Output:** Save to `06-cornerstone-draft.md`

**Automatic Transition:** Proceed to Step 8

---

### Step 8: Sub-agent Review + Notion Sync [AUTO]

**Purpose:** Editor reviews against checklist, voice, and ICP. On completion, automatically pushes content to Notion for human review.

**Agent:** Sonnet (Editor) → then Notion sync (automatic)

**Review Checklist:**
```
## Content Quality
- [ ] 2 research studies cited with full attribution
- [ ] 5 diverse examples present
- [ ] 10+ outbound links/citations
- [ ] Consistent Alvis House voice throughout
- [ ] All 7 Blueprint elements present

## Structural Integrity
- [ ] Pattern-interrupt hook
- [ ] Clear identity filter
- [ ] 3S Expert Story
- [ ] Named framework with steps
- [ ] Myth directly addressed
- [ ] Application guide included
- [ ] Identity-affirming close

## Voice Verification
- [ ] No hedge words (maybe, perhaps, I think)
- [ ] Short declarative sentences
- [ ] Concrete metaphors/analogies
- [ ] 5th-8th grade reading level
- [ ] Warm challenge tone

## ICP Alignment
- [ ] Speaks to Director/VP Operator pain points
- [ ] Addresses C-Level strategic concerns
- [ ] Uses ICP language and scenarios

## Extraction Readiness
- [ ] Each section can stand alone
- [ ] Hook contains tweetable statements
- [ ] Framework steps can be individual posts
- [ ] Examples work as case study threads
```

**Output — TWO SEPARATE FILES (critical):**

- `07-editor-review.md` — Editorial report ONLY (assessment, checklist, voice audit, top fixes). No draft content.
- `06-cornerstone-draft.md` — **Overwrite with the fully revised draft.** The editor applies all fixes directly to this file. This is the single source of truth for the article body.

**Why this matters:** The Notion sync reads `06-cornerstone-draft.md`. If the revised draft is embedded inside `07-editor-review.md` instead, Notion receives the unedited original. Always overwrite `06-cornerstone-draft.md` with the editor-revised version before the sync runs.

**Automatic Notion Sync (runs immediately after editor saves revised draft to `06-cornerstone-draft.md`):**
```bash
PAI_DIR=/home/alvis/PAI bun run workflow-orchestrator.ts \
  --workflow-id=[workflow-id] \
  --push-to-notion
```

This automatically:
1. Creates workflow entry in Notion Content database
2. Creates content page with all properties (Content Type: Cornerstone Blog, Platform: Essay)
3. Sets Campaign = `workflow_id` (e.g. `2026-03-22-refinery-principle`) — used as Notion filter key
4. Sets 📝 blog icon on the page
5. Syncs `06-cornerstone-draft.md` (editor-revised) body to Notion page
6. Saves Notion IDs to metadata.json
7. Advances status to Step 9

**Automatic Transition:** Notion sync → Pause for Step 9

---

### Step 9: Manual Review + Image Requirements [PAUSE]

**Purpose:** Human reviews content and creates image manifest.

**⛔ GATE — Run this check before anything else:**
```bash
# Verify Notion sync ran after Step 8. If notion.content_id is missing, sync was skipped.
cat scratchpad/content-create/[workflow-id]/metadata.json | grep -A4 '"notion"'
```
If `notion.content_id` is absent, run the sync now before proceeding:
```bash
PAI_DIR=/home/alvis/PAI bun run .claude/Skills/WordPressPublisher/tools/workflow-orchestrator.ts \
  --workflow-id=[workflow-id] --push-to-notion
```
Do not advance to Step 9 review until `metadata.json` shows a Notion content URL.

**Actions:**
1. Review `08-cornerstone-final.md` (edited by editor) with `07-editor-review.md` notes
2. Make manual edits if needed
3. Create image manifest using template from `content-image-references.md`

**User Prompt:**
```
The cornerstone draft is ready for your review.

Draft: 06-cornerstone-draft.md
Editor Notes: 07-editor-review.md

Please:
1. Review and make any needed edits
2. Identify ALL image requirements (featured + inline + extraction)
3. Complete the image manifest

When done, save:
- Final content to: 08-cornerstone-final.md
- Image manifest to: 09-image-manifest.md
```

**Output:**
- `08-cornerstone-final.md` (edited cornerstone with image placeholders)
- `09-image-manifest.md` (complete image requirements)

---

### Step 10: Create All Images [PAUSE]

**Purpose:** Generate all images using the Opening Wound framework before publishing.

**Integration:** Art Skill (`${PAI_DIR}/Skills/art/`) + LinkedInImageGenerator (opus) + LinkedInImagePromptValidator (sonnet)

**Pipeline — run this for EVERY image (featured, inline, newsletter hero):**

#### Step 10a: Wound Analysis (per image)

Run the **LinkedInImageGenerator agent** (`opus`) with:
- The full cornerstone content (`08-cornerstone-final.md`)
- The image type and context (featured / inline / newsletter hero)
- The image placeholder concept from `09-image-manifest.md` as a starting hint — not a constraint

The agent reads the full content, finds the opening wound moment most relevant to this image's placement in the piece, selects image type (A/B/C/D/E) and PAI style, and produces a candidate prompt.

#### Step 10b: Validation (per image)

Run the **LinkedInImagePromptValidator agent** (`sonnet`) with:
- The full content
- The candidate prompt from 10a

The validator scores against Three Pillars + 7 Anti-Patterns and returns PASS or FAIL.

- **PASS** → proceed to generation
- **FAIL** → return specific revision notes to generator → re-run 10a → re-validate → maximum 2 revision cycles

#### Step 10c: Generation (per image)

```bash
# Blog featured image (1200×630)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ${PAI_DIR}/scratchpad/content-create/[workflow-id]/images/featured.png \
  "[APPROVED PROMPT]"

# Blog inline / diagram image (1080×720)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 3:2 \
  --output ${PAI_DIR}/scratchpad/content-create/[workflow-id]/images/inline-01.png \
  "[APPROVED PROMPT]"

# Newsletter hero (1200×630)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ${PAI_DIR}/scratchpad/content-create/[workflow-id]/images/newsletter-hero.png \
  "[APPROVED PROMPT]"
```

After generation, verify dimensions:
```bash
file ${PAI_DIR}/scratchpad/content-create/[workflow-id]/images/featured.png
```

⚠️ nano-banana-pro saves as **JPEG despite the .png extension** — verify with `file` command before uploading.

#### Step 10d: Review & Accept

Present each generated image to the user. For each:
- Show file path and dimensions
- Show the opening wound quote the image is based on
- Show the validator score (Emotion / Scroll-Stopping / Curiosity)
- Accept / Regenerate decision

**Output:** `images/` directory inside the workflow scratchpad with all generated images, validator scores logged in manifest.

**User Prompt:**
```
Image generation complete.

For each image:
- File: [path]
- Wound quote: "[quote the image is based on]"
- Validator scores: Emotion [X]/10 · Scroll-Stopping [X]/10 · Curiosity [X]/10
- Verdict: PASS ✅

Accept this image? [Y / Regenerate]
```

---

### Step 11: HTML Preview & Assembly [PAUSE]

**Purpose:** Assemble final content with images and preview HTML.

**Actions:**
1. Replace image placeholders with actual paths in `08-cornerstone-final.md` → save as `11-cornerstone-assembled.md`
2. Build HTML preview from the brand template
3. Serve preview via `python3 -m http.server` and open in browser

**Assembly Process:**
```markdown
<!-- Before -->
<!-- IMAGE
Type: inline
Concept: AI Adoption Flywheel diagram
...
-->

<!-- After -->
![AI Adoption Flywheel](./images/inline-01.png)
```

**⚠️ HTML Generation — NON-NEGOTIABLE REQUIREMENTS:**

Always start from `cornerstone-post-template.html`. The template already includes the `<!DOCTYPE html>` + `<meta charset="UTF-8">` header and the article header placeholder. Never skip these — missing charset causes `â€"` garbage characters; missing the header block means no eyebrow/title/deck.

**Required output structure (in this exact order):**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">              ← REQUIRED — prevents â€" garbage
  <title>[headline]</title>
</head>
<body>
<article>
  <!-- 1. Article header (eyebrow → h1 → deck) -->
  <div class="article-header">...</div>

  <!-- 2. Featured image — AFTER header, BEFORE lead section -->
  <img class="featured-image" src="./images/featured.png" ...>

  <!-- 3. Lead section (.lead-section dark navy box) -->
  <section class="lead-section">...</section>

  <!-- 4. Body content -->
  ...
</article>
</body>
</html>
```

**Serve the preview:**
```bash
cd scratchpad/content-create/[workflow-id]
python3 -m http.server 7823 &
# Open: http://localhost:7823/11-html-preview.html
explorer.exe "http://localhost:7823/11-html-preview.html"
```

**Preview Options:**
1. **VS Code Live Server:** Right-click `preview.html` → Open with Live Server
2. **VS Code HTML Preview:** Use HTML Preview extension
3. **Browser:** Open file directly in default browser

**User Prompt:**
```
Content assembled with images.

Preview: 12-html-preview/preview.html

Please review:
1. All images display correctly
2. Content formatting looks good
3. Links work properly

Approve to continue to WordPress publishing? [Y/N/Edit]
```

**Output:**
- `11-cornerstone-assembled.md` (final markdown with image refs)
- `12-html-preview/preview.html` (styled HTML preview)

---

### Step 12: WordPress Post [AUTO]

**Purpose:** Upload all images to WordPress, then publish post as draft with images embedded.

**Integration:** WordPress Publisher Skill + WordPress REST API (binary upload)

**⚠️ CRITICAL: Always upload images BEFORE creating the post.**

The WordPress MCP `create_media` tool requires a public source_url and cannot handle local files.
Use the WordPress REST API binary upload approach for local images.

**Step 12a: Upload All Images to WordPress**

```bash
# WordPress credentials from: ${PAI_DIR}/Skills/WordPressPublisher/config/wordpress-sites.json
WP_URL="https://alvishouse.io"
AUTH=$(echo -n "username:password" | base64 -w0)
IMG_DIR="${WORKFLOW_DIR}/10-images"

# Upload each image via REST API binary upload
# Returns JSON with media ID and WordPress-hosted URL
curl -X POST \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Disposition: attachment; filename=featured.png" \
  -H "Content-Type: image/png" \
  --data-binary @"${IMG_DIR}/featured.png" \
  "${WP_URL}/wp-json/wp/v2/media"

# Repeat for each inline image
# Save all media IDs to metadata.json under "wordpress.media_ids"
```

**Step 12b: Image Placement Rules**

- Featured image → `featured_media` field only. Do NOT repeat it in the post content.
- Inline images → `<img class="inline-image" src="[WP_URL]" alt="[description]">` in content body.
- **No redundant images:** If two images show the same concept, replace one. The featured image and first inline image must be visually distinct — different metaphors, different scenes.
- WordPress scales uploaded images and appends `-scaled` to the filename. Use the `source_url` returned by the upload API as the `src`.
- **No article header in content.** WordPress renders title from its own field; eyebrow and subtitle from meta fields (Step 12d). Never put an `<article-header>` block in the content HTML.

**Step 12c: Build Content from Template**

**⚠️ ALWAYS start from the brand template — never send plain HTML.**

The brand CSS component library lives in:
```
${PAI_DIR}/.claude/Skills/WordPressPublisher/templates/cornerstone-post-template.html
```

This template contains the full `<style>` block with all components:
- `.lead-section` — dark navy hook box (always first, before any h2)
- `.stat-highlight` — big stat number + label in parchment box
- `.callout.mechanism` / `.callout.warning` — concept and obstacle boxes
- `.framework-box` + `.framework-step` — step-by-step frameworks
- `.case-study` + `.result` — case study cards with navy result block
- `.pull-quote` — centered italic pull quote with borders
- `.cta-box` — dark navy CTA closing box
- `.final-quote` — large closing quote with top/bottom borders
- `h2` — automatically gets bottom underline (border-bottom: 2px solid) via CSS
- `h4` — uppercase slate section labels (THE PATTERN, THE STORY, etc.)
- `blockquote` — parchment left-border quote block
- `hr` — light rule divider between major sections

**Width:** The template uses `article { max-width: 100%; padding: 0; }` — this lets the WordPress theme control column width. Never set a fixed pixel width on `article` or content will appear narrow inside the theme wrapper. The `article > *:first-child { margin-top: 0; }` rule prevents the first heading from adding extra space below the featured image.

**Fill in the template with the article content. Replace every `[PLACEHOLDER]` with actual content. Use rich components throughout — every section should have at least one stat, callout, pull-quote, or framework box. Plain paragraphs only are not enough.**

**⚠️ STRIP THE HTML WRAPPER before saving.** `12-wp-content.html` must contain ONLY `<style>...</style>` + `<article>...</article>`. Never include `<!DOCTYPE html>`, `<html>`, `<head>`, `<meta>`, or `<body>` tags — WordPress wraps any stray document-level tags in `<p>` blocks, creating large gaps above the content.

Save the stripped content to `12-wp-content.html` in the workflow scratchpad. Upload via:

```bash
AUTH=$(echo -n "username:app_password" | base64 -w0)

python3 -c "
import json, sys
content = open('12-wp-content.html').read()
sys.stdout.write(json.dumps({'content': content}))
" > /tmp/wp-payload.json

curl -s -X POST \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: application/json" \
  "https://alvishouse.io/wp-json/wp/v2/posts/[POST_ID]" \
  --data @/tmp/wp-payload.json
```

Then create the post via MCP (title, excerpt, status, categories, featured_media only):

```javascript
{
  title: "[From selected headline]",
  content: "[Full HTML from completed template — <style> block + <article> block]",
  excerpt: "[From hook/deck]",
  status: "draft",
  categories: [/* Strategy: 18, Insights: 15, etc. */],
  featured_media: /* ID of uploaded featured image */
}
```

**⚠️ CRITICAL — Step 12d: Set Meta Fields via REST API (ALWAYS REQUIRED)**

The WordPress MCP `create_post` tool does NOT support meta fields. The `eyebrow_text` and `subtitle` meta fields MUST be set separately via REST API or the post header will render with no eyebrow and no subtitle.

This step is MANDATORY after every post creation. Do not skip it.

```bash
AUTH=$(echo -n "username:app_password" | base64 -w0)

curl -s -X POST \
  -H "Authorization: Basic ${AUTH}" \
  -H "Content-Type: application/json" \
  "https://alvishouse.io/wp-json/wp/v2/posts/[POST_ID]" \
  -d '{
    "meta": {
      "eyebrow_text": "[From selected headline eyebrow field]",
      "subtitle": "[From selected headline deck copy]"
    }
  }'
```

**Verify meta was saved:**
```bash
curl -s -H "Authorization: Basic ${AUTH}" \
  "https://alvishouse.io/wp-json/wp/v2/posts/[POST_ID]?context=edit" \
  | python3 -c "import sys,json; p=json.load(sys.stdin); m=p.get('meta',{}); print('eyebrow:', m.get('eyebrow_text')); print('subtitle:', m.get('subtitle','')[:80])"
```

**Output:** Update `metadata.json` with:
```json
"wordpress": {
  "post_id": 765,
  "post_url": "https://alvishouse.io/?p=765",
  "status": "draft",
  "media_ids": {
    "featured": 770,
    "inline_01": 771,
    "inline_02": 772,
    "inline_03": 773,
    "inline_04": 774
  }
}
```

**Automatic Transition:** Pause for Step 13

---

### Step 13: LinkedIn-First Content Extraction [PAUSE]

**Purpose:** Extract LinkedIn + Newsletter content using Outlier Scout methodology for maximum engagement potential.

**Integration:** LinkedIn Scout Agent + Content Writer/Researcher Agents

**Process:** See detailed guide in `13-linkedin-first-extraction.md`

**Actions:**
1. **Phase 1:** Scout analyzes cornerstone (15 min, haiku)
   - DISSECT mode identifies viral structures
   - Outputs format recommendations with engagement rankings

2. **Phase 2:** Extract 8-10 LinkedIn pieces (30 min, sonnet)
   - Authority Post + Framework Article (priority)
   - Story, Myth-Buster, Quick Wins, Case Study
   - Each piece tagged with engagement potential

3. **Phase 3:** Create posting schedule (10 min, haiku)
   - Strategic posting order
   - Creator engagement targets (30/30/30/10 model)

**Output:**
```
13-extracted-content/
├── 00-scout-analysis.yaml
├── linkedin/
│   ├── posts/
│   │   ├── 01-authority-post.md (PRIORITY 1)
│   │   ├── 02-framework-article.md (PRIORITY 1)
│   │   ├── 03-story-post.md
│   │   ├── 04-myth-buster-post.md
│   │   ├── 05-quick-win-1.md
│   │   ├── 06-quick-win-2.md
│   │   ├── 07-case-study-post.md
│   │   └── 08-contrarian-take.md
│   └── images/               (generated in Step 13b)
└── posting-schedule.md
```

**User Prompt:**
```
LinkedIn-first extraction complete.

LinkedIn Posts: 8-10 pieces ready (see posting-schedule.md for priority order)

Next steps:
1. Review posting-schedule.md for strategic posting order
2. Proceed to Step 13b (LinkedIn Image Generation)
3. After images approved, proceed to Step 14 (Newsletter Creation)

Want to extract Twitter/Visual content later? (Future on-demand)
```

**Metadata Update:**
```json
"step-13": {
  "completed": true,
  "linkedin_pieces": 8,
  "scout_analysis": "00-scout-analysis.yaml",
  "posting_schedule": "posting-schedule.md",
  "twitter_extracted": false,
  "visuals_extracted": false
}
```

**Automatic Transition:** Pause for user review, then proceed to Step 13b

---

### Step 13b: LinkedIn Image Generation [PAUSE]

**Purpose:** Generate platform-optimized images for each LinkedIn post using the Art skill.

**Integration:** Art Skill (`${PAI_DIR}/Skills/art/`)

**Process:** See detailed guide in `13b-linkedin-image-generation.md`

**Which Posts Get Images:**

| Priority | Post Type | Generate Image? |
|----------|-----------|-----------------|
| 1 | Authority Post | ✅ Always |
| 1 | Framework Article | ✅ Always |
| 2 | Story Post | ✅ Always |
| 2 | Case Study | ✅ Always |
| 2 | Myth-Buster | Optional |
| 2 | Quick Win 1 | Optional |
| 2 | Quick Win 2 | Optional |
| 2 | Contrarian Take | Optional |

**LinkedIn Image Specs:**

| Type | Dimensions | Aspect Ratio | Use Case |
|------|-----------|--------------|----------|
| Native post image | 1200×1200 px | 1:1 square | Feed posts (mobile-optimized) |
| Carousel slide | 1080×1080 px | 1:1 square | Carousel posts |

**Actions:**
1. Read each post file in `13-extracted-content/linkedin/posts/`
2. For each post needing an image, craft a visual prompt from the hook/theme:

```bash
bun run ${PAI_DIR}/Skills/art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[VISUAL CONCEPT FROM POST THEME]" \
  --aspect-ratio 1:1 \
  --output ${PAI_DIR}/scratchpad/content-create/[workflow-id]/13-extracted-content/linkedin/images/post-01-authority.png
```

3. Review each generated image
4. Regenerate if needed
5. Update manifest status

**Prompt Engineering Guidelines:**
- Translate the hook concept into a visual metaphor (no literal text descriptions)
- Abstract/geometric > stock-photo-realistic
- Dark backgrounds + accent lighting match the Alvis House brand
- Avoid any text elements in the image (LinkedIn renders text poorly at feed size)
- Example: "Intelligence multiplying across a network of human decision nodes, dark background, electric blue accent lighting, clean minimal composition"

**Output:**
```
13-extracted-content/linkedin/images/
├── post-01-authority.png         (Priority 1 — always)
├── post-02-framework.png         (Priority 1 — always)
├── post-03-story.png             (always)
├── post-04-myth-buster.png       (if created)
├── post-05-quick-win-1.png       (if created)
├── post-06-quick-win-2.png       (if created)
├── post-07-case-study.png        (always)
└── post-08-contrarian.png        (if created)
```

**Notion Push (after local approval):**

Once images are locally reviewed, push them directly to Notion:

```bash
bun run ${PAI_DIR}/.claude/Skills/ContentWorkflow/tools/push-linkedin-images-to-notion.ts \
  --workflow-dir ${PAI_DIR}/scratchpad/content-create/[workflow-id]
```

This uploads image binaries directly to Notion (no WordPress), creates database entries with rendered image previews, and links them to the workflow record. Status = "Generated" for review in:
```
https://www.notion.so/2733021756a1447d84a7143e2e9e97dd?v=fa8b79c2671347d69859aa99a67da0e4
```

**User Prompt:**
```
LinkedIn images ready for local review.

[Show each image as generated]

Post 01 (Authority): [path] — Accept? [Y/N/Regenerate]
Post 02 (Framework): [path] — Accept? [Y/N/Regenerate]
Post 03 (Story): [path] — Accept? [Y/N/Regenerate]
Post 07 (Case Study): [path] — Accept? [Y/N/Regenerate]

Approved images? → Run Notion push to upload for review
Proceed to Step 14 (Newsletter Creation)? [Y/N]
```

**Metadata Update:**
```json
"step-13b": {
  "completed": true,
  "images_created": 4,
  "images_total": 8,
  "images_dir": "13-extracted-content/linkedin/images/",
  "posts_with_images": ["post-01", "post-02", "post-03", "post-07"],
  "notion_push_completed": true,
  "notion_image_ids": [...]
}
```

**Automatic Transition:** Pause for review, then proceed to Step 14

---

### Step 14: Newsletter Creation (Triage Model) [AUTO]

**Purpose:** Transform LinkedIn content + cornerstone into executive-grade weekly newsletter.

**System:** 5-phase pipeline (Extractor → Drafter → Validator → Formatter → **Notion Sync**)

**Integration:** Newsletter agents + BrandHTMLConverter skill

**Process:** See detailed guide in `14-newsletter-creation.md`

**Input Sources (Priority Order):**
1. LinkedIn posts from Step 13 (8-10 pieces)
2. Cornerstone content (06-cornerstone-draft-v3.md)
3. External research (optional)

**Output:**
```
14-newsletter/
├── insight-atoms-linkedin.yaml (5-7 atoms)
├── insight-atoms-cornerstone.yaml (5-7 atoms)
├── insight-atoms-research.yaml (optional, 3-5 atoms)
├── newsletter-draft.md
├── issue-meta.yaml
├── validation-report.md
├── newsletter-final.md
├── newsletter-final.html
└── issue-meta-final.yaml
```

**Phase 5 — Notion Sync (automatic after formatter):**
- Pushes `newsletter-final.md` to Notion Content database
- Icon: `https://alvishouse.io/wp-content/uploads/2026/02/newsletter-icon.png` (same for all issues)
- Sets Campaign, Related Content (→ cornerstone), Workflow relations
- Saves Notion page ID to `metadata.json`

**User Prompt:**
```
Newsletter Issue #[X] ready for review.

Subject Line (Recommended): "[Selected subject]"
Word Count: [Count] (target: 1,500-2,000)
Validation Score: [Score]/1.0 (threshold: 0.7)

Sections:
✓ TL;DR
✓ Myth vs Reality
✓ Quick Win of the Week
✓ Metric That Matters
✓ [Rotating: Case Study/Trend/Culture]
✓ Forward CTA

LinkedIn References: [X] posts linked
Review: 14-newsletter/newsletter-final.md

Ready to publish? [Y/N]
```

**Metadata Update:**
```json
"step-14": {
  "completed": true,
  "issue_number": 1,
  "validation_score": 0.85,
  "word_count": 1847,
  "linkedin_references": 3
}
```

**Automatic Transition:** Workflow complete after user approval

---

## Output Structure

```
${PAI_DIR}/scratchpad/content-create/[workflow-id]/
├── 01-research.md
├── 02-big-ideas.md
├── 03-selected-big-idea.md
├── 04-headlines.md
├── 05-selected-headline.md
├── 06-cornerstone-draft.md
├── 07-editor-review.md
├── 08-cornerstone-final.md
├── 09-image-manifest.md
├── 10-images/
│   ├── featured.png
│   ├── inline-01.png
│   ├── inline-02.png
│   └── extraction/ (on-demand)
│       ├── linkedin-carousel/
│       ├── linkedin-post.png
│       └── substack-hero.png
├── 11-cornerstone-assembled.md
├── 12-html-preview/
│   ├── preview.html
│   └── assets/
├── 13-extracted-content/
│   ├── 00-scout-analysis.yaml
│   ├── linkedin/
│   │   ├── posts/
│   │   │   ├── 01-authority-post.md
│   │   │   ├── 02-framework-article.md
│   │   │   ├── 03-story-post.md
│   │   │   ├── 04-myth-buster-post.md
│   │   │   ├── 05-quick-win-1.md
│   │   │   ├── 06-quick-win-2.md
│   │   │   ├── 07-case-study-post.md
│   │   │   └── 08-contrarian-take.md
│   │   └── images/               (Step 13b)
│   │       ├── post-01-authority.png
│   │       ├── post-02-framework.png
│   │       ├── post-03-story.png
│   │       └── post-07-case-study.png
│   ├── posting-schedule.md
│   ├── twitter/ (on-demand)
│   └── visuals/ (on-demand)
├── 14-newsletter/
│   ├── insight-atoms-linkedin.yaml
│   ├── insight-atoms-cornerstone.yaml
│   ├── insight-atoms-research.yaml (optional)
│   ├── newsletter-draft.md
│   ├── issue-meta.yaml
│   ├── validation-report.md
│   ├── newsletter-final.md
│   ├── newsletter-final.html
│   └── issue-meta-final.yaml
└── metadata.json
```

---

## Status Tracking

### metadata.json Schema

```json
{
  "workflow_id": "2026-01-31-ai-strategy-gap",
  "topic": "The 60% Problem (AI Strategy Gap)",
  "track": "Track 4",
  "status": "step-10-create-images",
  "created_at": "2026-01-31T10:00:00Z",
  "updated_at": "2026-01-31T14:30:00Z",
  "checkpoints": {
    "step-1": { "completed": true, "selection": "Track 4", "timestamp": "..." },
    "step-2": { "completed": true, "agent": "sonnet", "timestamp": "..." },
    "step-3": { "completed": true, "agent": "opus", "timestamp": "..." },
    "step-4": { "completed": true, "selection": "Big Idea #2", "timestamp": "..." },
    "step-5": { "completed": true, "agent": "opus", "timestamp": "..." },
    "step-6": { "completed": true, "selection": "Headline #3", "timestamp": "..." },
    "step-7": { "completed": true, "agent": "opus", "word_count": 3500, "timestamp": "..." },
    "step-8": { "completed": true, "agent": "sonnet", "timestamp": "..." },
    "step-9": { "completed": true, "images_identified": 5, "timestamp": "..." },
    "step-10": { "completed": false, "images_created": 2, "images_total": 5 },
    "step-11": { "completed": false },
    "step-12": { "completed": false },
    "step-13": {
      "completed": false,
      "approach": "linkedin-first-scout-validated",
      "linkedin_pieces": 0,
      "scout_analysis": null,
      "posting_schedule": null,
      "twitter_extracted": false,
      "visuals_extracted": false,
      "future_extraction": {
        "twitter": "on-demand",
        "newsletter": "automated (Step 14)",
        "visuals": "on-demand"
      }
    },
    "step-13b": {
      "completed": false,
      "images_created": 0,
      "images_total": null,
      "images_dir": "13-extracted-content/linkedin/images/",
      "posts_with_images": []
    },
    "step-14": {
      "completed": false,
      "issue_number": null,
      "issue_date": null,
      "insight_atoms_extracted": 0,
      "sections": {
        "tldr": false,
        "myth_buster": false,
        "quick_win": false,
        "metric": false,
        "rotating_section": null,
        "tool_spotlight": false,
        "forward_cta": false
      },
      "validation_score": null,
      "forward_test_score": null,
      "word_count": 0,
      "linkedin_references": 0,
      "subject_lines": [],
      "selected_subject": null,
      "outputs": {
        "markdown": null,
        "html": null,
        "meta": null
      }
    }
  },
  "wordpress": {
    "post_id": null,
    "post_url": null,
    "status": null
  },
  "image_manifest": {
    "featured": { "status": "complete", "path": "./images/featured.png" },
    "inline": [
      { "id": 1, "status": "complete", "path": "./images/inline-01.png" },
      { "id": 2, "status": "pending", "path": null }
    ],
    "extraction": []
  }
}
```

---

## Resume Workflow

To resume an in-progress workflow:

1. Read `metadata.json` from workflow directory
2. Identify current step from `status` field
3. Load relevant context files
4. Continue from that step

**Resume Prompt:**
```
Resume Content Creation Workflow

Workflow ID: [workflow-id]
Current Status: [step-X]
Topic: [topic]

Loading context and continuing from [step-X]...
```

---

## Quick Start

**Start New Workflow:**
```
Start Content Creation Workflow

This will guide you through 13 steps to create a cornerstone blog post with full image workflow and multi-platform extraction.

Step 1: Select your topic...
```

**Resume Existing:**
```
Resume Content Creation Workflow: [workflow-id]
```

**Check Status:**
```
Content Workflow Status: [workflow-id]
```

---

## Content Hub Page — Design Patterns & Known Solutions

This section documents hard-won solutions for the `/insightcontent` WordPress page (ID 891) that displays all cornerstone blog posts as a card grid. Apply these patterns when updating the hub page or building similar card layouts.

### WordPress Gotchas

**wpautop filter** — WordPress auto-inserts `</p><p>` at blank lines and `<br>` at single newlines inside page content. Avoid by:
- Writing all CSS rules on a single line (no blank lines between rules)
- Never mixing `<img>` and `<div>` inside the same `<a>` tag — wpautop injects `<br>` after the `<a>` and orphan `</p>` before `</a>`

**wptexturize** — encodes `&&` as `&#038;&#038;` inside `<script>` tags, breaking JS conditionals. Solution: use fully static HTML instead of JavaScript where possible.

**`update_page` MCP tool** — `id` parameter must be a JSON integer (e.g. `891`), not a quoted string (`"891"`).

### Image Display — Editorial Illustrations

Editorial illustrations are typically wide-format (wider than card aspect ratio). Using `object-fit:cover` crops the sides off. Use `object-fit:contain` instead:

```css
.ch-card__img a { display:block; overflow:hidden; background:var(--paper); }
.ch-card__img img { width:100%; height:220px; object-fit:contain; display:block; }
```

The `background:var(--paper)` on the wrapper fills letterbox gaps with the brand warm paper tone, blending naturally with the card background.

### Hello Biz Theme — Dark Background Override

The Hello Biz theme applies a dark slate background to page content areas. Override with:

```css
.entry-content, .site-main, .hentry { background: #fff !important; }
```

### Card Shadows / Depth

Raised card effect with hover lift:

```css
.ch-card {
  box-shadow: 0 2px 4px rgba(0,0,0,.05), 0 8px 28px rgba(0,0,0,.08);
  transition: box-shadow .2s ease, transform .2s ease;
}
.ch-card:hover {
  box-shadow: 0 6px 12px rgba(0,0,0,.09), 0 20px 48px rgba(0,0,0,.13);
  transform: translateY(-3px);
}
```

### Full-Card Click — Stretched Link (no block-in-anchor)

To make the entire card clickable without wrapping block elements in `<a>` (which breaks wpautop):

```css
.ch-card { position: relative; }
.ch-card__title a::after { content: ""; position: absolute; inset: 0; }
```

The `::after` pseudo-element on the title link expands to cover the full card.

### Flexbox Date Alignment Across Cards

To keep dates pinned to the bottom of every card (aligned horizontally across a row regardless of excerpt length):

```css
.ch-card { display: flex; flex-direction: column; }
.ch-card__body { display: flex; flex-direction: column; flex: 1; padding: 20px; }
.ch-card__excerpt { flex: 1; }
.ch-card__date { margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(59,84,107,.1); }
```

### Current Hub Page Posts (ID 891)

| Post | WP ID | Featured Image URL | Status |
|------|-------|--------------------|--------|
| The Refinery Principle | 885 | `/wp-content/uploads/2026/03/refinery-principle-featured-scaled.jpg` | draft |
| Layers & Ladders | 874 | `/wp-content/uploads/2026/03/layers-ladders-featured-scaled.jpg` | draft |
| Efficiency Gateway Drug | 860 | `/wp-content/uploads/2026/03/lemonade-stand-featured-1-scaled.jpg` | draft |
| Dumb Pipe Phenomenon | 765 | `/wp-content/uploads/2026/02/featured-scaled.jpg` | draft |
| Playing It Safe Illusion | 604 | `/wp-content/uploads/2026/02/01-featured.png` | draft |

Hub page (ID 891) remains in **draft** status until cornerstone posts are published.

---

## Skill & Agent Summary

| Step | Agent | Color | Skill/Tool | Notes |
|------|-------|-------|------------|-------|
| 1 | - | - | AskUserQuestion | Topic selection |
| 2 | **content-researcher** | CYAN | WebSearch + Research prompt | 100+ data points |
| 3 | **content-writer** | GREEN | Big Idea prompt | 3-5 big ideas |
| 4 | - | - | AskUserQuestion | User selects |
| 5 | **content-writer** | GREEN | Headline prompt | 5 headline sets |
| 6 | - | - | AskUserQuestion | User selects |
| 7 | **content-writer** | GREEN | Cornerstone system prompt | 2,500-5,000 words |
| 8 | **content-editor** | ORANGE | Review checklist | Quality review |
| 9 | - | - | Manual review | Human creates image manifest |
| 10 | - | - | **Art skill** | Generate all images |
| 11 | - | - | **BrandHTMLConverter** | Preview + assembly |
| 12 | - | - | **WP REST API** binary upload → **WordPress Publisher** MCP | Upload images → Publish as draft |
| 13 | **content-researcher** | CYAN | Extraction prompt | 8 LinkedIn posts + schedule |
| 13b | - | - | **Art skill** | LinkedIn post images (4:5 portrait, LinkedIn standard) |
| 14 | **NewsletterExtractor** × 2, **NewsletterDrafter**, **NewsletterValidator**, **NewsletterFormatter** | BLUE | 5-phase pipeline | Newsletter → Notion Content DB (with newsletter icon) |

---

*This workflow integrates with the PAI ecosystem. All outputs are saved to scratchpad during creation, then moved to History upon completion.*
