# Infographic Component Library

Reusable HTML sections for building infographics. All CSS classes are defined in `templates/linkedin-standard.html`.

Reference the base template for complete CSS — this document covers usage and variants.

---

## Component Map

```
┌─────────────────────────────────────┐
│         .ig-header (navy)           │  ← Always present
├─────────────────────────────────────┤
│     .problem-headline (orange)      │  ← Optional: problem/hook bar
│         .stat-strip                 │  ← Optional: 3 data points
├──────────┬──────────┬───────────────┤
│  .col    │  .col    │  .col         │  ← 1, 2, or 3 columns
│  (WHY)   │ (MIDDLE) │  (PATH)       │    inside .three-cols
├─────────────────────────────────────┤
│    .solution-section (orange bar)   │  ← Optional: solution header
│         .two-models                 │  ← Optional: 2-col blocks
├─────────────────────────────────────┤
│      .footer-cta (navy slim)        │  ← Always present
└─────────────────────────────────────┘
```

---

## 1. Header Block

**Class:** `.ig-header`
**Background:** Navy (`--navy`)

```html
<div class="ig-header">
  <div class="ig-kicker">Optional kicker line — context above the title</div>
  <div class="ig-title">Main <em>Title Here</em></div>
</div>
```

**Rules:**
- Kicker: 7px, 700 weight, letter-spacing 0.22em, white at 45% opacity
- Title: Bebas Neue, 26px, white — use `<em>` for amber accent word(s)
- Keep it to 1–2 lines maximum

---

## 2. Problem Bar

**Class:** `.problem-headline`
**Background:** Orange (`--orange`)

```html
<div class="problem-section">
  <div class="problem-headline">
    <div class="problem-headline-icon">
      <i data-lucide="trending-down"></i>
      <div class="problem-headline-title">Main Problem Statement.<br><em>Subtext in muted white.</em></div>
    </div>
  </div>
  <!-- .stat-strip goes here if needed -->
</div>
```

**Rules:**
- Icon: 20×20px, white stroke
- Title: Bebas Neue, 18px, white; use `<em>` for muted (65% opacity) subtext
- Always pair with stat-strip below if you have data

---

## 3. Stat Strip

**Class:** `.stat-strip`
**Slots:** 3 cells (`.stat-cell`)

```html
<div class="stat-strip">
  <div class="stat-cell">
    <span class="stat-num">60–90</span>
    <span class="stat-unit">Days</span>
    <div class="stat-desc">Description of what this number means</div>
  </div>
  <div class="stat-cell">
    <span class="stat-num">40%</span>
    <span class="stat-unit">Stall Rate</span>
    <div class="stat-desc">Supporting context for the stat</div>
  </div>
  <div class="stat-cell">
    <span class="stat-num">3–5×</span>
    <span class="stat-unit">ROI</span>
    <div class="stat-desc">What this stat represents</div>
  </div>
</div>
```

**Rules:**
- `.stat-num`: Bebas Neue, 26px, navy — the big number
- `.stat-unit`: 7px, 800 weight, orange, uppercase, letter-spacing — the label above desc
- `.stat-desc`: 6.5px, ink-mid, uppercase — brief explanation
- Dividers between cells via `border-right: 1.5px solid var(--rule)`

---

## 4. Column Grid

**Class:** `.three-cols` (3-col) or `.two-models` (2-col)

```html
<div class="three-cols">
  <div class="col">
    <div class="col-header col-header-amber">
      <i data-lucide="alert-triangle"></i>Column Title
    </div>
    <div class="col-body">
      <!-- column content -->
    </div>
  </div>
  <div class="col">
    <div class="col-header col-header-navy">
      <i data-lucide="clipboard-list"></i>Column Title
    </div>
    <div class="col-body">
      <!-- column content -->
    </div>
  </div>
  <div class="col">
    <div class="col-header col-header-steel">
      <i data-lucide="git-branch"></i>Column Title
    </div>
    <div class="col-body">
      <!-- column content -->
    </div>
  </div>
</div>
```

**Column header color variants:**

| Class | Background | Text | Use |
|-------|-----------|------|-----|
| `.col-header-orange` | Orange | White | Problems, urgency |
| `.col-header-amber` | Amber | Ink (dark) | Warning, attention |
| `.col-header-navy` | Navy | White | Authority, structure |
| `.col-header-steel` | Steel | White | Neutral, paths |

**Rules:**
- Always use 3 distinct header colors across columns — never repeat
- Column last child has no right border

---

## 5. Obstacle List (inside WHY column)

```html
<div class="obstacle-list">
  <div class="obstacle-item">
    <div class="obstacle-icon"><i data-lucide="map"></i></div>
    <div class="obstacle-text">
      <div class="obstacle-title">Obstacle Name</div>
      <div class="obstacle-sub">Short description of the problem</div>
    </div>
  </div>
  <!-- repeat for each obstacle (5–6 items) -->
</div>
```

**Rules:**
- Icon box: 16×16px, navy bg, 3px border-radius, centers 9×9px Lucide icon
- Title: 7px, 700 weight, ink
- Sub: 6px, steel, 1.25 line-height
- Items separated by 1px rule border

---

## 6. Diagnostic Questions (inside Readiness Gap column)

```html
<div class="gap-intro">Framing sentence for the questions.</div>
<div class="diag-q-item">
  <div class="diag-q-num">1</div>
  <div class="diag-q-text"><strong>Do execs share</strong> one definition of success?</div>
</div>
<!-- repeat for each question (5–6 items) -->

<!-- Score legend below questions -->
<div class="diag-score-mini">
  <div class="score-mini-row">
    <div class="score-mini-block score-mini-red">
      <div class="score-mini-num">0–2</div>
      <div class="score-mini-lbl">Label</div>
    </div>
    <div class="score-mini-block score-mini-yellow">
      <div class="score-mini-num">3–4</div>
      <div class="score-mini-lbl">Label</div>
    </div>
    <div class="score-mini-block score-mini-green">
      <div class="score-mini-num">5–6</div>
      <div class="score-mini-lbl">Label</div>
    </div>
  </div>
</div>
```

**Rules:**
- Question number: Bebas Neue, 13px, navy
- Question text: 7px, ink — bold the key phrase in each question
- Score mini: red (#f5ede8 / orange border), yellow (#fdf6e3 / amber border), green (#e6f2ef / teal border)

---

## 7. Two-Path Block (inside Paths column)

```html
<div class="path-block">
  <div class="path-block-label path-block-label-grey">❌ Unassisted</div>
  <div class="path-milestones">
    <div class="path-mile path-mile-grey">
      <span class="path-day">Days 1–30</span>
      <span class="path-act">What happens in this period</span>
    </div>
    <!-- repeat -->
  </div>
  <div class="path-result-tag path-result-bad">Negative outcome summary</div>
</div>

<div class="path-block">
  <div class="path-block-label path-block-label-teal">✓ Accelerated</div>
  <div class="path-milestones">
    <div class="path-mile">
      <span class="path-day">Pre-hire</span>
      <span class="path-act">What's done in advance</span>
    </div>
    <div class="path-mile path-mile-highlight">
      <span class="path-day">Day 45 ✓</span>
      <span class="path-act">Milestone achieved</span>
    </div>
  </div>
  <div class="path-result-tag path-result-good">Positive outcome summary</div>
</div>
```

---

## 8. Solution Section

**Class:** `.solution-section`

```html
<div class="solution-section">
  <div class="solution-header">
    <div class="solution-header-icon">
      <i data-lucide="shield-check"></i>
      <div class="solution-header-text">
        <div class="solution-tag">Section Label</div>
        <div class="solution-title">Primary Headline.<br><em>Secondary line in muted white.</em></div>
      </div>
    </div>
  </div>
  <div class="two-models">
    <!-- Model Block 1 -->
    <div class="model-block">
      <div class="model-tag model-tag-blue">Option A</div>
      <div class="model-heading">Heading for<br>This Option</div>
      <div class="model-for">Best for</div>
      <div class="model-for-body">Who this option serves and when.</div>
      <ul class="model-list">
        <li>Deliverable or outcome one</li>
        <li>Deliverable or outcome two</li>
      </ul>
      <div class="model-result model-result-blue">⏱ Timeframe → Outcome</div>
    </div>
    <!-- Model Block 2 -->
    <div class="model-block">
      <div class="model-tag model-tag-teal">Option B</div>
      <div class="model-heading">Heading for<br>This Option</div>
      <div class="model-for">Best for</div>
      <div class="model-for-body">Who this option serves and when.</div>
      <ul class="model-list">
        <li>Deliverable or outcome one</li>
        <li>Deliverable or outcome two</li>
      </ul>
      <div class="model-result model-result-teal">⏱ Timeframe → Outcome</div>
    </div>
  </div>
</div>
```

---

## 9. Footer CTA

**Class:** `.footer-cta`
**Background:** Navy

```html
<div class="footer-cta">
  <img class="profile-pic" src="[path-to-profile-pic]" alt="Author Name">
  <div class="cta-oneline">
    Enjoy this? Follow <strong>Author Name</strong> for more &nbsp;·&nbsp;
    📩 Join my newsletter &nbsp;·&nbsp; <span>alvishouse.io</span>
  </div>
</div>
```

**Rules:**
- Profile pic: 34×34px, border-radius 50%, 2px amber border
- CTA text: 8px, white 75% opacity; bold for name, amber for URL
- Keep it to ONE line — never let it wrap to two lines
- Remove social handles; URL goes after the middle break, not at the end of a separate line

---

## Black Hole SVG (for metaphorical WHY visuals)

Use the embedded SVG from the 90-Day Tax infographic when you need a "vortex/drain" metaphor:

```html
<svg width="48" height="48" viewBox="0 0 72 72" fill="none">
  <circle cx="36" cy="36" r="34" fill="#1a2635" stroke="#F0A500" stroke-width="0.8" stroke-opacity="0.4"/>
  <circle cx="36" cy="36" r="27" fill="#23344a" stroke="#3b546b" stroke-width="0.8"/>
  <circle cx="36" cy="36" r="20" fill="#2d3f52" stroke="#cf5828" stroke-width="0.8"/>
  <circle cx="36" cy="36" r="13" fill="#1a2635" stroke="#cf5828" stroke-width="1" stroke-opacity="0.7"/>
  <circle cx="36" cy="36" r="7" fill="#0d0d0d" stroke="#cf5828" stroke-width="1.5"/>
  <path d="M36 8 Q56 16 64 36" stroke="#F0A500" stroke-width="0.8" fill="none" stroke-dasharray="3,2" stroke-opacity="0.6"/>
  <path d="M36 64 Q16 56 8 36" stroke="#F0A500" stroke-width="0.8" fill="none" stroke-dasharray="3,2" stroke-opacity="0.6"/>
</svg>
```
