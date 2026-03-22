# Newsletter System — Current State Reference

Use this doc to orient a new session without re-explaining the full system.

---

## What Exists

### Core Tool
**`Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts`**
- Converts `newsletter-final.md` markdown → full-featured styled HTML
- POSTs to WordPress `/wp-json/wp/v2/newsletter` CPT (REST API, Basic auth)
- Sets meta fields: `newsletter_subject`, `newsletter_preheader`, `newsletter_issue_number`
- Updates `metadata.json` with `newsletter_post_id` and `newsletter_post_url`
- Supports `--preview` (local HTML only), `--force` (skip already-published guard)

### WordPress Plugin
**`Skills/WordPressPublisher/pai-newsletter-plugin.php`**
- Registers `newsletter` CPT, public at `/newsletter/[slug]/`
- On `publish`: auto-creates Brevo campaign draft (List #4, excerpt only + "Read full issue →" button)
- WP admin metabox: Subject, Preheader, Issue #, Send to Subscribers button

### Workflow Docs
**`Skills/WordPressPublisher/workflows/PublishNewsletter.md`**
- Complete step-by-step publish process (Steps 1–6)
- Visual design system, brand colors, section→card styling
- **Responsive CSS system** (three-tier breakpoints, CSS class names, infographic strategy)
- Image requirements (4 per issue), screenshot/upload scripts
- Error handling, YAML metadata notes

**`Skills/WordPressPublisher/workflows/Content Create Flow/14-newsletter-creation.md`**
- 4-phase newsletter creation pipeline: Extractor → Drafter → Validator → Formatter
- Agent configs, task invocations, expected output structures

**`Skills/WordPressPublisher/workflows/Content Create Flow/newsletter-config.yaml`**
- Triage Model section specs, validation checklist, voice/tone rules
- 6-part headline framework (headline_process)
- 4-block intro structure (intro_structure)
- Writing rules: tangible language, sentence rhythm, section opener/closer

---

## Visual Design System (Key Facts)

### Brand Colors
| Token | Hex | Use |
|-------|-----|-----|
| ink | `#3b546b` | Navy — header bg, section titles, borders |
| paper | `#ece6d9` | Tan — content section background |
| rust | `#cf5828` | Accent bar, Forward This section |
| text | `#2b2b2b` | Body paragraph text |
| page | `#d8d2c6` | Outer page background (WP theme override) |

### Layout
```
[nl-outer — page bg #d8d2c6 — overrides WP dark theme]
  [nl-card — max-width:680px, border-radius:12px, overflow:hidden]
    [nl-header — navy #3b546b]
      Title + Formula image
    [Rust accent bar — 3px]
    [nl-intro — white #fff]
      H1 title + intro paragraphs + hero image
    [nl-content — tan #ece6d9]
      [Section title row (nl-section-title-row)]
        [Icon box] [nl-section-title]
      [nl-card-inner — white card]
        [nl-infographic — Myth/Metric images only]
        [nl-para — body paragraphs, 20px]
    [nl-footer — navy #3b546b]
```

### Responsive Breakpoints
- **Phone ≤480px**: full-width card, 17px body, 190px infographic height, `object-fit:contain`
- **Tablet 481-900px**: near-desktop fonts (19px body, 30px section titles), aggressive padding reduction (6px sides), 280px infographic height
- **Desktop >900px**: all desktop defaults

**Key tablet insight:** WP admin bar + theme chrome eats ~80-100px, shrinking effective content area to ~420-450px. Fonts should match desktop; only horizontal padding needs reduction.

---

## Images Per Issue (4 Required)

| # | Name | Reuse? | WP URL / File |
|---|------|--------|---------------|
| 1 | Formula for Acceleration | Every issue | `https://alvishouse.io/wp-content/uploads/2026/03/formula-acceleration.jpg` |
| 2 | Newsletter Hero | New each issue | `scratchpad/infographics/newsletter-hero.html` → PNG |
| 3 | Myth vs Reality | New each issue | `scratchpad/infographics/myth-vs-reality.html` → PNG |
| 4 | Metric That Matters | New each issue | `scratchpad/infographics/metric-that-matters.html` → PNG |

Infographic spec: 800×380px, cream paper bg `#f6efd8`, outer wrap `#ede5d0`, SVG sketch style, Montserrat font, header 16px min, all labels 11px min.

---

## Publish Command

```bash
# Preview only (local file)
bun run /home/alvis/PAI/.claude/Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts \
  --workflow-id [workflow-id] --preview \
  --formula-image=formula-acceleration.jpg \
  --hero-image=newsletter-hero.png \
  --myth-infographic=myth-vs-reality.png \
  --metric-infographic=metric-that-matters.png

# Full publish to WordPress
bun run /home/alvis/PAI/.claude/Skills/WordPressPublisher/tools/publish-newsletter-to-wp.ts \
  --workflow-id [workflow-id] \
  --formula-image=https://alvishouse.io/wp-content/uploads/2026/03/formula-acceleration.jpg \
  --hero-image=[wp-url] \
  --myth-infographic=[wp-url] \
  --metric-infographic=[wp-url]
```

Preview writes to: `scratchpad/newsletter-preview-v5.html`

---

## Live WordPress Post

**Post ID 837** — Issue #2: "55% more output. Zero new hires. 90 days." (Dumb Pipe Phenomenon)
- Status: draft (needs publish → triggers Brevo)
- All responsive fixes applied (phone/tablet/desktop)
- All 4 images embedded: formula, hero, myth infographic, metric infographic
- Last patched: 2026-03-02

---

## Config & Credentials
- **WP credentials:** `Skills/WordPressPublisher/config/wordpress-sites.json`
- **WP site:** `https://alvishouse.io`
- **Auth:** Application Password (REST API only — separate from login password)
- **Notion token:** `.credentials.json` → `notion.api_key`

---

## Newsletter Content Quality Rules (Summary)

### Subject Lines — 6-Part Headline Framework
Build full headline first: `HOW MANY + THE WHAT + THE HOW + THE WHO + THE WHY + TWIST THE KNIFE`
Then condense to 30-50 chars. Produce 5 options (not 3).

### Introduction — 4-Block Structure
1. **Hook** (1 sentence): specific number/company/counterintuitive claim. No "Hey there!"
2. **Stakes** (3-5 sentences): problem + why it exists + negative consequences
3. **Solution preview** (1-2 sentences): what this issue covers
4. **Transition** (1 sentence): "Let's walk through each one" / "Here's what the data shows"

### Section Structure
- Start every section with a single framing sentence
- End every section with a single takeaway sentence

### Language Rules
- **Tangible over abstract**: "saves 6 hours/week" not "improves team efficiency"
- **Sentence rhythm**: alternate long and short sentences
- **No hedging**: never "might", "could", "possibly"
- **Bold**: 1-2 key phrases per section

---

## Known Errors & Fixes

| Error | Fix |
|-------|-----|
| `newsletter_post_id already exists in metadata.json` | Add `--force` flag |
| WP API 404 on POST newsletter | Activate `pai-newsletter-plugin.php` in WP admin |
| Subject shows "Newsletter Issue" (fallback) | Check `issue-meta-final.yaml` has `selected:` under `subject_line:` OR `subject:` in newsletter-final.md front matter |
| Infographic 404 | Re-upload via REST API binary POST (see PublishNewsletter.md upload script) |
| Preview always blocked by "already published" | `--preview` bypasses the guard — no `--force` needed |
