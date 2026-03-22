# Publish Newsletter Workflow

Automated workflow for publishing a validated newsletter from the PAI content pipeline to WordPress newsletter CPT, with Brevo campaign auto-creation on publish.

## When to Use

Run this workflow after **Step 14 (Newsletter Creation)** is complete and the newsletter has been reviewed in Notion.

---

## Visual Design System

Every newsletter uses the **Acceleration Flywheel brand system**. All styling is inline CSS — no external stylesheets.

### Brand Colors

| Token | Hex | Use |
|-------|-----|-----|
| `ink` | `#3b546b` | Primary text, section titles, borders, header bg |
| `paper` | `#ece6d9` | Tan content section background |
| `rust` | `#cf5828` | Accent bar, Forward This section, icon box |
| `slate` | `#7a8c9b` | Secondary labels |
| `text` | `#2b2b2b` | Body paragraph text |

### Layout Zones

```
[HEADER — navy #3b546b]
  "THE AI ACCELERATION FLYWHEEL NEWSLETTER" (1.9em bold white)
  Formula for Acceleration image (55% width, centered)
[Rust accent bar — 3px]
[WHITE INTRO SECTION — #fff, padding 36/40]
  H1 newsletter name + issue/date subtitle
  Intro paragraphs
  Newsletter hero image (full width, issue-specific alchemy illustration)
[TAN CONTENT SECTION — #ece6d9, padding 32/40]
  [Section title (32px bold) ABOVE each card]
    Icon box (ink/rust rounded square) + section name
  [White card — border variant by section type]
    Card content (paragraphs, lists, bold)
    Infographic image slot (Myth vs Reality, Metric That Matters cards)
[FOOTER — navy #3b546b]
  "The Acceleration Flywheel" + ALVIS HOUSE
  alvishouse.io · Unsubscribe
```

### Section → Card Styling

| Section | Card Border | Title Color | Icon Box |
|---------|-------------|-------------|----------|
| `## TL;DR` | left 4px ink | ink | ink |
| `## Myth vs Reality` | 2px full ink | ink | ink |
| `## Quick Win of the Week` | left 4px ink | ink | ink |
| `## Metric That Matters` | 1px ink | ink | ink |
| `## Case Study Spotlight` | 1px ink | ink | ink |
| `## Forward This` | top 3px rust | rust | rust |
| `## Tool Spotlight` | 1.5px dashed ink | ink | ink |

---

## Responsive Design System

The newsletter HTML uses a `<style>` block with CSS class names for three-tier responsive breakpoints. This approach works on the WordPress web CPT (not email — email clients strip `<style>` blocks, but this is a "read online" page).

### Two-Layer Wrapper Architecture

```
<div class="nl-outer"  background:#d8d2c6; padding:48px 20px>    ← page background override
  <div class="nl-card" max-width:680px; border-radius:12px; overflow:hidden; box-shadow>
    [nl-header]
    [nl-intro]
    [nl-content]
    [nl-footer]
  </div>
</div>
```

**Why:** WP theme background is same navy color as the newsletter header/footer. The `nl-outer` div injects a warm tan page background (`#d8d2c6`) so the newsletter is visually self-contained regardless of WP theme.

### CSS Class Names

| Class | Element | Desktop Default |
|-------|---------|----------------|
| `nl-outer` | Page wrapper | `padding:48px 20px; background:#d8d2c6` |
| `nl-card` | Newsletter card | `max-width:680px; border-radius:12px; overflow:hidden` |
| `nl-header` | Navy header | `padding:32px 40px 28px; border-radius:10px 10px 0 0` |
| `nl-header-title` | "THE AI ACCELERATION..." | `font-size:1.9em; font-weight:800` |
| `nl-formula-img` | Formula image in header | `max-width:300px; width:55%` |
| `nl-intro` | White intro section | `padding:36px 40px` |
| `nl-content` | Tan content section | `padding:32px 40px` |
| `nl-section-title-row` | Section title + icon row | `margin:2em 0 .75em` |
| `nl-section-title` | Section heading text | `font-size:32px; font-weight:700` |
| `nl-card-inner` | White card inside section | `padding:24px 28px` |
| `nl-infographic` | Myth/Metric images | `width:100%; border-radius:8px` |
| `nl-para` | Body paragraphs and lists | `font-size:20px; line-height:1.8` |
| `nl-footer` | Navy footer | `padding:28px 40px` |

### Three-Tier Breakpoints

#### Phone (≤480px)
Key changes: full-width card (no border-radius, no side padding), shrink fonts, letterbox infographics.

```css
@media(max-width:480px){
  .nl-outer{padding:0 !important;}
  .nl-card{border-radius:0 !important;}
  .nl-header{padding:22px 20px 18px !important;border-radius:0 !important;}
  .nl-header-title{font-size:1.35em !important;letter-spacing:.02em !important;}
  .nl-formula-img{width:72% !important;max-width:240px !important;margin-top:14px !important;}
  .nl-intro{padding:22px 20px 20px !important;}
  .nl-content{padding:16px 10px 28px !important;}
  .nl-section-title-row{margin:1.4em 0 .5em !important;}
  .nl-section-title{font-size:22px !important;}
  .nl-card-inner{padding:16px 14px !important;}
  .nl-infographic{width:100% !important;height:190px !important;object-fit:contain !important;background:#f6efd8 !important;border-radius:6px !important;}
  .nl-para{font-size:17px !important;}
  .nl-footer{padding:22px 20px !important;border-radius:0 !important;}
}
```

#### Tablet (481–900px)
Key insight: WP admin bar + theme chrome reduces effective content area to ~420-450px. Font sizes should stay near desktop — only horizontal padding needs aggressive reduction to reclaim width.

```css
@media(min-width:481px) and (max-width:900px){
  .nl-outer{padding:20px 6px !important;}
  .nl-card{border-radius:10px !important;}
  .nl-header{padding:28px 22px 22px !important;}
  .nl-header-title{font-size:1.75em !important;}
  .nl-formula-img{width:62% !important;max-width:290px !important;}
  .nl-intro{padding:28px 22px 24px !important;}
  .nl-content{padding:24px 14px 32px !important;}
  .nl-section-title-row{margin:1.8em 0 .7em !important;}
  .nl-section-title{font-size:30px !important;}
  .nl-card-inner{padding:20px 18px !important;}
  .nl-infographic{width:100% !important;height:280px !important;object-fit:contain !important;background:#f6efd8 !important;border-radius:7px !important;}
  .nl-para{font-size:19px !important;}
  .nl-footer{padding:24px 22px !important;}
}
```

### Infographic Strategy on Small Screens

Infographics are 800×380px PNGs with baked-in SVG text designed for desktop width. On mobile, they'd display at ~40px effective width — illegible. Solution:

```css
/* Fixed height + object-fit:contain + matching cream background */
.nl-infographic { height:190px; object-fit:contain; background:#f6efd8; }
```

This letterboxes the full image with matching cream background — all content visible, text ~50% of designed size but still legible.

---

## Images Required Per Issue

Each newsletter requires **4 images**. Create them before running the publisher.

### Image 1: Formula for Acceleration (reused every issue)

- **What:** The alchemy-style "Formula for Acceleration" sketch
- **Source:** `/home/alvis/PAI/Screenshots/formula accerations screen shot.jpg`
- **Where:** Embedded in the navy header below the newsletter title
- **Status:** Already uploaded to WP — reuse URL unless you want a new version
- **WP URL (current):** `https://alvishouse.io/wp-content/uploads/2026/03/formula-acceleration.jpg`

### Image 2: Newsletter Hero (new each issue)

- **What:** Issue-specific alchemy-style illustration representing the newsletter topic
- **Style:** Cream/paper background (`#f6efd8`), thin SVG sketch strokes, hand-drawn aesthetic
- **Dimensions:** 800×380px viewport, 762×352px paper frame
- **File:** `scratchpad/infographics/newsletter-hero.html` → screenshot to `newsletter-hero.png`
- **Where:** Bottom of white intro section, full width, before TL;DR
- **CLI param:** `--hero-image=<wp-url>`

**Design notes:**
- Show the core concept of the newsletter topic as a before/after or transformation illustration
- Use the alchemy sketch style: double-border paper frame, ruled-paper line overlay, thin SVG paths
- Keep text minimum 11px, opacity minimum 0.7 for any text
- Header at top with topic title (16px bold) + subtitle (11px, opacity 0.72)

### Image 3: Myth vs Reality Infographic (new each issue)

- **What:** Side-by-side comparison infographic for the Myth vs Reality section
- **Style:** Same alchemy paper style, two-column layout with VS divider
- **Dimensions:** 800×380px
- **File:** `scratchpad/infographics/myth-vs-reality.html` → screenshot to `myth-vs-reality.png`
- **Where:** Top of the Myth vs Reality white card (above body text)
- **CLI param:** `--myth-infographic=<wp-url>`

**Design notes:**
- Left column: THE MYTH (rust color `#cf5828`) — the wrong belief
- Right column: THE REALITY (ink color `#3b546b`) — the correct framing
- Icon box in each column with SVG illustration
- Claim text (14px bold #2b2b2b) + Note text (12px, opacity 0.78)

### Image 4: Metric That Matters Infographic (new each issue)

- **What:** Data visualization for the Metric That Matters section
- **Style:** Same alchemy paper style, typically a bar chart comparison
- **Dimensions:** 800×380px
- **File:** `scratchpad/infographics/metric-that-matters.html` → screenshot to `metric-that-matters.png`
- **Where:** Top of the Metric That Matters white card (above body text)
- **CLI param:** `--metric-infographic=<wp-url>`

**Design notes:**
- Show the key stat from the Metric section visually (bar chart, side-by-side, etc.)
- Header (16px bold) identifies the metric; subtitle (11px, opacity 0.72) cites the source
- Key numbers in large font (40–58px) with clear contrast
- Gap/difference highlighted with rust color badge

---

## Screenshot Infographics to PNG

After creating/editing the HTML infographic files:

```bash
cat > /tmp/screenshot-infographics.ts << 'EOF'
import { chromium } from "playwright";
import { resolve } from "path";
const DIR = "/home/alvis/PAI/scratchpad/infographics";
const CHROME = "/home/alvis/.cache/ms-playwright/chromium-1208/chrome-linux64/chrome";
const files = [
  { html: "newsletter-hero.html",     png: "newsletter-hero.png",     w: 800, h: 380 },
  { html: "myth-vs-reality.html",     png: "myth-vs-reality.png",     w: 800, h: 380 },
  { html: "metric-that-matters.html", png: "metric-that-matters.png", w: 800, h: 380 },
];
const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
for (const f of files) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: f.w, height: f.h });
  await page.goto("file://" + resolve(DIR, f.html), { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(DIR, f.png), clip: { x:0, y:0, width:f.w, height:f.h } });
  await page.close();
  console.log("Saved:", f.png);
}
await browser.close();
EOF
bun run /tmp/screenshot-infographics.ts
```

---

## Upload Images to WordPress

Upload local PNGs to WP media library to get hosted URLs:

```bash
cat > /tmp/upload-newsletter-images.ts << 'EOF'
import { readFileSync } from 'fs';
const CONFIG_PATH = '/home/alvis/PAI/.claude/Skills/WordPressPublisher/config/wordpress-sites.json';
const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'));
const site = config.sites[config.active_site];
const creds = Buffer.from(`${site.username}:${site.password}`).toString('base64');
const images = [
  { local: '/home/alvis/PAI/Screenshots/formula accerations screen shot.jpg', name: 'formula-acceleration.jpg', mime: 'image/jpeg' },
  { local: '/home/alvis/PAI/scratchpad/infographics/newsletter-hero.png',     name: 'newsletter-hero-[issue-slug].png', mime: 'image/png' },
  { local: '/home/alvis/PAI/scratchpad/infographics/myth-vs-reality.png',     name: 'myth-vs-reality-[issue-slug].png', mime: 'image/png' },
  { local: '/home/alvis/PAI/scratchpad/infographics/metric-that-matters.png', name: 'metric-[issue-slug].png', mime: 'image/png' },
];
for (const img of images) {
  const data = readFileSync(img.local);
  const res = await fetch(`${site.url}/wp-json/wp/v2/media`, {
    method: 'POST',
    headers: { 'Authorization': `Basic ${creds}`, 'Content-Disposition': `attachment; filename="${img.name}"`, 'Content-Type': img.mime },
    body: data,
  });
  const json: any = await res.json();
  console.log(`${img.name} → ${json.source_url}`);
}
EOF
bun run /tmp/upload-newsletter-images.ts
```

Replace `[issue-slug]` with the workflow topic slug (e.g., `dumb-pipe`) to avoid filename collisions between issues.

---

## Preview Before Publishing

Generate a browser preview without touching WordPress:

```bash
bun run /home/alvis/PAI/.claude/Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts \
  --workflow-id [workflow-id] \
  --preview \
  --formula-image=formula-acceleration.jpg \
  --hero-image=newsletter-hero.png \
  --myth-infographic=myth-vs-reality.png \
  --metric-infographic=metric-that-matters.png
```

Writes to `scratchpad/newsletter-preview-v5.html`. Copy to Windows and open:
```bash
cp /home/alvis/PAI/scratchpad/newsletter-preview-v5.html /mnt/c/Users/alvis/Documents/ && \
cp /home/alvis/PAI/scratchpad/infographics/*.png /mnt/c/Users/alvis/Documents/ && \
powershell.exe -Command "Start-Process 'C:\Users\alvis\Documents\newsletter-preview-v5.html'"
```

---

## Full Publish Command

```bash
bun run /home/alvis/PAI/.claude/Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts \
  --workflow-id [workflow-id] \
  --formula-image=https://alvishouse.io/wp-content/uploads/2026/03/formula-acceleration.jpg \
  --hero-image=[wp-url-for-hero] \
  --myth-infographic=[wp-url-for-myth] \
  --metric-infographic=[wp-url-for-metric]
```

The formula image URL is reused every issue (already uploaded). Only the three issue-specific images need new uploads each time.

**Expected output:**
```
Converting newsletter markdown to HTML...
Creating WordPress newsletter draft at https://alvishouse.io...
  Title: The Mid-Market AI Playbook — Issue #2: 55% more output. Zero new hires. 90 days.
  Slug: newsletter-issue-2-[slug]
  Created: ID 837, URL: https://alvishouse.io/?post_type=newsletter&p=837

Setting newsletter meta fields...
  Meta fields set successfully.

NEWSLETTER DRAFT CREATED SUCCESSFULLY
  Post ID:    837
  Subject:    55% more output. Zero new hires. 90 days.
  Preheader:  Why your competitor stopped asking for headcount...
  Issue #:    2
```

---

## Step-by-Step Process

### Step 1: Create Infographics

For each newsletter, create 3 new alchemy-style HTML files in `scratchpad/infographics/`:

- `newsletter-hero.html` — represents the newsletter topic
- `myth-vs-reality.html` — visual comparison for the Myth vs Reality section
- `metric-that-matters.html` — data visualization for the Metric That Matters section

Design rules:
- 800×380px body, 762×352px paper frame
- Header text: minimum 16px
- All other labels: minimum 11px, opacity minimum 0.7
- Cream paper background `#f6efd8`, outer wrap `#ede5d0`
- Brand colors: ink `#3b546b`, rust `#cf5828`

Screenshot all three to PNG using the Playwright script above.

### Step 2: Upload Images

Run the upload script to get WP-hosted URLs for all three infographics (formula image is already uploaded — reuse the URL).

### Step 3: Preview

Run with `--preview` flag + local file paths to verify layout before posting.

### Step 4: Publish Draft

Run the full publish command with WP-hosted image URLs. This creates a WordPress draft.

### Step 5: Verify Draft in WP Admin

- Open `https://alvishouse.io/wp-admin/`
- Check title = "The Mid-Market AI Playbook — Issue #N: [Subject]"
- Verify all images render (header formula, white section hero, myth card infographic, metric card infographic)
- Check Newsletter & Brevo metabox: subject, preheader, issue # populated

### Step 6: Publish and Send

**Publish the post** (triggers Brevo campaign auto-creation):
- WP admin → change Status to Publish → click Update

**Send to subscribers:**
- WP admin → Newsletter & Brevo metabox → click "Send to Subscribers"

---

## YAML Metadata Notes

The `issue-meta-final.yaml` generated by Step 14 uses a nested structure:

```yaml
issue_final:
  issue_number: 2
  subject_line:
    selected: "55% more output. Zero new hires. 90 days."
  preheader:
    text: "Why your competitor stopped asking for headcount..."
```

The publisher handles this automatically via regex field extraction (not a strict YAML parser). It also falls back to the front matter of `newsletter-final.md` if needed:

```yaml
---
subject: "55% more output. Zero new hires. 90 days."
preheader: "Why your competitor stopped asking for headcount..."
issue_number: 2
issue_date: "2026-02-28"
---
```

---

## Error Handling

### "newsletter_post_id already exists in metadata.json"
```bash
bun run publish-newsletter-to-wp.ts --workflow-id [id] --force
```

### "WP API error 404 on POST newsletter"
`pai-newsletter-plugin.php` is not active. Check WP admin → Plugins.

### "WP API error 401 Unauthorized"
Check `config/wordpress-sites.json` credentials.

### Subject shows "Newsletter Issue" (fallback)
YAML field extraction failed. Check that `issue-meta-final.yaml` has either:
- `selected: "..."` under `subject_line`
- Or `recommended_subject: "..."` at top level
- Or add `subject: "..."` to the front matter of `newsletter-final.md`

---

## Reused Assets

| Asset | Reuse Strategy |
|-------|---------------|
| Formula for Acceleration image | Same WP URL every issue: `formula-acceleration.jpg` |
| Brand colors and layout | Hardcoded in `publish-newsletter-to-wp.ts` — never change |
| Section icon SVGs | Lucide paths in `ICONS` map — no external scripts |
| HTML template structure | `convertNewsletterToHTML()` + `buildSectionWrapper()` |

---

**Tool:** `Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts`
**Config:** `Skills/WordPressPublisher/config/wordpress-sites.json`
**Infographics:** `scratchpad/infographics/` (HTML source + PNG output)
**Plugin:** `Skills/WordPressPublisher/pai-newsletter-plugin.php`
