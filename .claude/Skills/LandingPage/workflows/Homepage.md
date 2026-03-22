# Workflow: Homepage

Redesigns alvishouse.io homepage to the long-form opt-in conversion architecture.

---

## Context

**Current site:** alvishouse.io — Elementor-built, nav-heavy, newsletter opt-in
**Target style:** Long-form freebie conversion page (single-goal, no-nav, multi-CTA)
**Brand:** Keep Navy/Orange/Cream color system, Lora + Montserrat typography
**Autoresponder:** Keep existing connection — only replace HTML wrapper, not form action

---

## Phase 1 — Brief

Confirm before writing copy:
1. What is the primary lead magnet / offer on the homepage?
2. What is the autoresponder form action URL? (preserve exactly — do not change)
3. What mockup images are available for the "What's Inside" section?
4. Do testimonials exist? Who are they from?
5. What press/podcast/speaking logos can be used for the press strip?
6. What is the profile photo URL on WordPress?

**Output:** `01-brief/brief.md`

---

## Phase 2 — Copy

Agent: `PageDesigner` (sonnet)

Write all copy before building HTML. Use Alvis House voice (see `Skills/WordPressPublisher/workflows/Content Create Flow/alvis-house-voice-style-guide.md`).

Write these sections in order:

| Section | Copy needed |
|---------|------------|
| Hero | Headline (H1), sub (1–2 sentences), button text |
| Pain Point | H2, 2–3 sentences problem framing, bridge sentence |
| What's Inside | H2, 5 benefit bullets |
| Why This Works | H2, 4× [number + headline + 1–2 sentence explanation] |
| Author Bio | H2, 3 story-arc paragraphs, button text |
| Testimonials | 2–3 full testimonial cards (stars + quote + attribution) |
| Quote + CTA | 1 pull quote from guide/newsletter |
| Final CTA | H2 (urgent restate), 1-sentence stakes, button text |

**Output:** `02-copy/section-copy.md`

**PAUSE: Review copy before building HTML.**

---

## Phase 3 — HTML Build

Start from: `../templates/homepage-base.html`

Copy to: `03-output/page.html`

Fill in each section using copy from Phase 2 and the section patterns from `SectionLibrary.md`.

**Critical implementation rules:**
- Do NOT change the autoresponder form action URL — only update surrounding HTML
- No top navbar — remove completely for conversion focus
- Implement sticky bar JavaScript (triggers on scroll past hero)
- Repeat form/CTA a minimum of 4 times (hero, what's inside, quote section, final CTA)
- Verify all image paths before screenshotting
- Button text must be outcome-language (never "Subscribe" or "Submit")

---

## Phase 4 — Browser Review

Start HTTP server and review:
```bash
cd [output-dir] && python3 -m http.server 7777
# Open http://localhost:7777/page.html
```

Check:
- [ ] Sticky bar appears after scrolling past hero
- [ ] Form renders correctly (check autoresponder action URL is preserved)
- [ ] Image stack in hero is rotated correctly
- [ ] All 4 CTA instances visible
- [ ] Mobile layout at 390px width
- [ ] No nav elements present
- [ ] Section background rhythm: dark → light → white → dark → light → white → accent → dark

**PAUSE: Get user sign-off before deploying to WordPress.**

---

## Phase 5 — Deploy to WordPress

Two options depending on current setup:

### Option A: Replace Homepage Content (Elementor)
If keeping Elementor for other pages:
1. Go to WordPress Admin → Pages → Home
2. Switch to "Classic Editor" or "Custom HTML" widget
3. Paste the full HTML into a full-width HTML block
4. Set page template to "Full Width" (no sidebar, no header)
5. Preview and publish

### Option B: Custom Page Template (Recommended)
Upload as a standalone PHP template for full control:
```bash
# File: wp-content/themes/[theme]/template-homepage.php
# Include the HTML with PHP header/footer stripped
```

### Option C: Plugin-Based (Easiest)
Use "Insert Headers and Footers" or "WPCode" plugin to inject as a full-page override.

---

## Output Files

```
scratchpad/landing-pages/YYYY-MM-DD-homepage/
  01-brief/
    brief.md
  02-copy/
    section-copy.md
  03-output/
    page.html             ← source of truth
    page-preview.png      ← Playwright screenshot
  metadata.json
```
