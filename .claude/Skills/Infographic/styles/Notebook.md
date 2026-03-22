# Notebook Infographic Style

## Style Overview
**"Teaching Worksheet"**

Clean educational worksheet aesthetic modeled after hand-drawn sketchnote style (see: Chris Donnelly "How People See Marketing" format). White background, soft highlight-colored section labels, simple stroke diagrams (funnels, mind maps, flow arrows), rounded borders throughout. Approachable and immediately readable — feels like a teacher's printed handout or a sketchnote capture.

**This is an HTML-first style.** Output is an HTML file exported to PNG via Playwright at 2× (540px → 1080px).

---

## When to Use This Style

- Concept explainers for general/mixed audiences
- "What people think vs. what it actually is" comparisons
- Framework posts with visual diagrams (funnel, mind map, flow chart)
- Educational LinkedIn posts where the infographic IS the post
- Lower-stakes / broader reach content (not C-suite authority)

---

## COLOR PALETTE

```css
:root {
  --white:        #FFFFFF;   /* Canvas background */
  --page-bg:      #F9F9F9;   /* Very subtle off-white — mimics notebook paper */
  --text-primary: #1A1A1A;   /* All headings, labels */
  --text-body:    #444444;   /* Body copy */
  --text-muted:   #777777;   /* Secondary labels, captions */
  --border:       #DDDDDD;   /* Light borders around sections */
  --rule:         #EEEEEE;   /* Horizontal dividers, lighter than border */

  /* Section header highlight fills — use one per section, alternate */
  --highlight-warm:  #FFD8A8;  /* Warm peach/orange fill — section label bg */
  --highlight-cool:  #C3FAD8;  /* Soft green fill — section label bg */
  --highlight-blue:  #BDE4F4;  /* Light blue fill — optional third color */

  /* Diagram stroke color */
  --stroke:       #333333;   /* Lines, arrows, funnel shapes */
  --stroke-light: #AAAAAA;   /* Secondary diagram lines */

  /* Spiral binding */
  --spiral:       #BBBBBB;   /* Spiral ring color */
}
```

---

## TYPOGRAPHY

```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

| Use | Font | Settings |
|-----|------|----------|
| Page title (large) | `Nunito` | 28px / weight 900 / color var(--text-primary) |
| Section label text | `Nunito` | 13px / weight 700 / color var(--text-primary) |
| Diagram labels | `Nunito Sans` | 10px / weight 600 / color var(--text-primary) |
| Body copy | `Nunito Sans` | 10px / weight 400 / color var(--text-body) |
| Caption / muted | `Nunito Sans` | 9px / weight 400 / color var(--text-muted) |

**Key rule:** No all-caps. Nunito's rounded letterforms at sentence case or title case only. This is what gives the notebook its approachable feel.

---

## LAYOUT STRUCTURE

### Canvas
- HTML width: **540px**
- Export: 2× deviceScaleFactor → **1080px wide PNG**
- Background: `var(--page-bg)` with subtle horizontal rule lines (optional — use CSS repeating gradient)
- Left edge: spiral binding simulation (see Spiral component below)
- Height: variable; content-determined

### Section Stacking Order
```
1. SPIRAL + TITLE AREA   — white/page-bg, large title
2. SECTION A             — white panel with highlight label + content
3. DIVIDER               — 1px rule in --rule
4. SECTION B             — white panel with highlight label + content
   ...
N. FOOTER                — light bg, name + CTA
```

Sections have generous padding (16px sides) and breathe — avoid cramming. The style's power is in its lightness.

---

## COMPONENT PATTERNS

### Page Background (Lined Notebook Effect)
```css
body {
  background-color: var(--page-bg);
  background-image: repeating-linear-gradient(
    transparent,
    transparent 23px,
    var(--rule) 23px,
    var(--rule) 24px
  );
  background-attachment: local;
}
.ig {
  background: white;
  padding: 20px 24px 20px 40px; /* extra left padding for spiral */
}
```

---

### Spiral Binding (Left Edge)
Visual element only — a column of circles on the left edge.

```css
.spiral-col {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 16px 0;
  background: var(--page-bg);
  border-right: 1.5px solid var(--border);
}
.spiral-ring {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--spiral);
  background: white;
  flex-shrink: 0;
}
```

Render ~18–24 rings down the left edge depending on content height.

---

### Section Label (Highlight Box)
Rounded rectangle with soft highlight fill. No hard borders — the fill is the indicator.

```css
.section-label {
  display: inline-block;
  padding: 5px 14px;
  border-radius: 20px;    /* fully rounded pill */
  font-family: 'Nunito', sans-serif;
  font-size: 13px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 14px;
}
.section-label.warm { background: var(--highlight-warm); }
.section-label.cool { background: var(--highlight-cool); }
.section-label.blue { background: var(--highlight-blue); }
```

Usage: wrap section title in `.section-label.warm` or `.section-label.cool`. Alternate between sections.

---

### Stroke Diagram — Funnel
Pure SVG inline. Use `stroke` only — no fills. Clean and hand-drawn-ish.

```html
<svg width="200" height="130" viewBox="0 0 200 130" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Stage 1 (wide) -->
  <path d="M20 20 L180 20 L150 55 L50 55 Z" stroke="#333" stroke-width="1.5" fill="none"/>
  <!-- Stage 2 (mid) -->
  <path d="M50 60 L150 60 L130 90 L70 90 Z" stroke="#333" stroke-width="1.5" fill="none"/>
  <!-- Stage 3 (narrow) -->
  <path d="M70 95 L130 95 L115 120 L85 120 Z" stroke="#333" stroke-width="1.5" fill="none"/>
  <!-- Stage labels -->
  <text x="100" y="42" text-anchor="middle" font-family="Nunito Sans" font-size="10" fill="#1A1A1A" font-weight="600">STAGE 1</text>
  <text x="100" y="77" text-anchor="middle" font-family="Nunito Sans" font-size="10" fill="#1A1A1A" font-weight="600">STAGE 2</text>
  <text x="100" y="111" text-anchor="middle" font-family="Nunito Sans" font-size="10" fill="#1A1A1A" font-weight="600">STAGE 3</text>
</svg>
```

Pair with a label column to the right: `→ Run ads. Post content.` etc.

---

### Stroke Diagram — Mind Map
Central circle + spoke lines + box labels. All SVG stroke.

```html
<svg width="300" height="200" viewBox="0 0 300 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Center circle -->
  <circle cx="150" cy="100" r="30" stroke="#333" stroke-width="1.5" fill="none"/>
  <text x="150" y="96" text-anchor="middle" font-family="Nunito" font-size="9" fill="#1A1A1A" font-weight="700">CENTRAL</text>
  <text x="150" y="108" text-anchor="middle" font-family="Nunito" font-size="9" fill="#1A1A1A" font-weight="700">CONCEPT</text>
  <!-- Spokes + label boxes (repeat for each spoke) -->
  <line x1="120" y1="80" x2="60" y2="45" stroke="#AAAAAA" stroke-width="1"/>
  <rect x="10" y="30" width="80" height="26" rx="4" stroke="#333" stroke-width="1.2" fill="white"/>
  <text x="50" y="47" text-anchor="middle" font-family="Nunito Sans" font-size="9" fill="#1A1A1A">Label 1</text>
  <!-- ...repeat for all spokes -->
</svg>
```

---

### Arrow Connector
Simple right-pointing arrow between diagram elements and their text labels.

```css
.arrow-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 4px 0;
  font-family: 'Nunito Sans', sans-serif;
  font-size: 10px;
  color: var(--text-body);
}
.arrow-row::before {
  content: "→";
  color: var(--text-muted);
  font-size: 12px;
  flex-shrink: 0;
}
```

---

### Horizontal Divider
```css
.nb-divider {
  border: none;
  border-top: 1.5px solid var(--rule);
  margin: 14px 0;
}
```

---

### Footer
Light, minimal. Name + CTA. No dark background.

```css
.nb-footer {
  padding: 12px 24px;
  border-top: 1.5px solid var(--border);
  font-family: 'Nunito Sans', sans-serif;
  font-size: 9px;
  color: var(--text-muted);
  text-align: center;
}
```

---

## TYPOGRAPHY SCALE

```
Page title:        Nunito 900, 28px, color #1A1A1A
Section label:     Nunito 700, 13px, highlight bg pill
Diagram label:     Nunito Sans 600, 10px, color #1A1A1A
Arrow text:        Nunito Sans 400, 10px, color #444444
Caption:           Nunito Sans 400, 9px, color #777777
```

---

## ICONOGRAPHY (Lucide Icons)

Icons are used to make section labels and diagram nodes immediately scannable. **Every section label and every mind map node should have a Lucide icon where one exists.**

### Setup
```html
<script src="https://unpkg.com/lucide@latest"></script>
<!-- At end of body: -->
<script>lucide.createIcons();</script>
```

### Icon Usage Rules

1. **Always contextual** — the icon must visually represent the CONCEPT, not a generic action. A viewer who doesn't read the text should understand the section from the icon alone.
2. **Stroke style only** — Lucide icons are stroke-based, which matches the Notebook's hand-drawn aesthetic perfectly. Do not add colored backgrounds behind icons.
3. **Size:** 16px for section labels, 14px for diagram nodes, 12px for list items
4. **Color:** Match the section label highlight color or use `var(--text-primary)` on white

### Section Label with Icon
```html
<div class="section-label warm">
  <i data-lucide="layers" style="width:14px;height:14px;vertical-align:middle;margin-right:5px;"></i>
  What it actually involves
</div>
```

### Mind Map Node with Icon
```html
<div style="display:flex;align-items:center;gap:5px;">
  <i data-lucide="search" style="width:12px;height:12px;color:#444;"></i>
  <span>Google Search</span>
</div>
```

### Icon Selection Guide

| Content | Lucide Icon | Why |
|---------|-------------|-----|
| Funnel / pipeline | `filter` | Classic funnel shape |
| Stages / steps | `layers` | Stacked layers = stages |
| Mind map center | `target` | Central decision point |
| Brand awareness | `megaphone` | Broadcasting |
| Social media | `share-2` | Sharing network |
| Email | `mail` | Direct and clear |
| Analytics / data | `bar-chart-2` | Data representation |
| People / team | `users` | Group |
| Strategy | `compass` | Direction/navigation |
| Process flow | `git-branch` | Branching steps |
| Problem | `alert-triangle` | Warning |
| Success | `check-circle` | Achievement |
| Time | `clock` | Time pressure |
| Money / cost | `dollar-sign` | Financial |
| AI / automation | `cpu` | Processing/intelligence |
| Learning | `book-open` | Education |
| Growth | `trending-up` | Upward trend |

---

## WHAT THIS STYLE IS NOT

- Not dark backgrounds (entire style is light/white)
- Not colored section headers with white text (that's CheatSheet)
- Not dense/information-overloaded (this style breathes)
- Not bold/authoritative (see Editorial for authority positioning)
- Not all-caps text (Nunito's rounded forms need sentence/title case)
- Not Bebas Neue (this style uses Nunito exclusively)

---

## CANONICAL REFERENCE

Style modeled after: Chris Donnelly "How People See Marketing in 2026" infographic.
Key characteristics: spiral binding, pill-shaped section labels, inline stroke diagrams, white-dominant, friendly rounded typography.
