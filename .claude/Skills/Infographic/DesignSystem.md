# Infographic Design System

Proven design system built and refined through the 90-Day Tax infographic project.

---

## Color Palette

```css
:root {
  --cream:    #ece6d9;   /* Primary background — warm off-white */
  --cream-dk: #ddd8ce;   /* Dividers, subtle row separators */
  --navy:     #3b546b;   /* Header blocks, authority sections, footer CTA */
  --orange:   #cf5828;   /* Problem bars, accent sections, CTA energy */
  --steel:    #7a8c9b;   /* Secondary labels, muted text, neutral headers */
  --teal:     #2E7D6B;   /* Positive outcomes, "accelerated" paths, success */
  --amber:    #F0A500;   /* Warning/attention, accent on dark backgrounds */
  --ink:      #1a2635;   /* Primary body text — near-black */
  --ink-mid:  #3d4f60;   /* Secondary body text */
  --rule:     #d4cdc3;   /* Borders, dividers */
  --white:    #ffffff;   /* Card backgrounds, clean sections */
}
```

### Color Semantics

| Color | Use |
|-------|-----|
| Navy | Headers, authority, "done/finished" states |
| Orange | Problems, urgency, attention-grabbing bars |
| Teal | Solutions, success, "accelerated" outcomes |
| Amber | Caution/warning, accent on dark backgrounds |
| Steel | Neutral headers, muted/secondary content |
| Cream | Section backgrounds, off-white warmth |
| Ink | All body text |

---

## Typography

```html
<!-- Always include both fonts -->
<link href="https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Bebas+Neue&display=swap" rel="stylesheet">
```

| Use | Font | Settings |
|-----|------|----------|
| Display titles, section headers, large numbers | `Bebas Neue` | letter-spacing: 0.03em; line-height: 1.0 |
| Body text, descriptions, labels | `Inter` | Multiple weights 400–900 |
| Kicker labels (above titles) | `Inter` | 700; letter-spacing: 0.22em; text-transform: uppercase |
| Stat labels | `Inter` | 800; letter-spacing: 0.18em; text-transform: uppercase |

**Key sizing scale (at 540px canvas):**

| Element | Size |
|---------|------|
| Main title (Bebas Neue) | 26px |
| Section header (Bebas Neue) | 18px |
| Large stat number | 26px |
| Column subheading | 10px bold |
| Body text | 7–7.5px |
| Micro labels | 6–6.5px |

---

## Icon System

**Lucide only. Never mix icon families.**

```html
<!-- CDN import -->
<script src="https://unpkg.com/lucide@latest"></script>

<!-- Usage in HTML -->
<i data-lucide="trending-down"></i>

<!-- Initialize at end of body -->
<script>lucide.createIcons();</script>
```

### Common Icons for Infographics

| Use | Lucide Name |
|-----|-------------|
| Obstacles / problems | `trending-down`, `alert-triangle`, `x-circle` |
| Org navigation | `map` |
| Data / archaeology | `database` |
| People / teams | `users` |
| Governance / policy | `shield` |
| Strategy / targeting | `target` |
| Time / deadline | `clock` |
| Checklist / audit | `clipboard-list` |
| Path / fork | `git-branch` |
| Solution / protection | `shield-check` |
| Growth / upward | `trending-up` |

**Icon sizing in components:**
- Column headers: 9×9px
- Obstacle/pillar icons: 9×9px inside a 16×16px colored box
- Section header icons: 20×20px

---

## Canvas Sizing

### HTML Canvas
```css
.ig {
  width: 540px;  /* 540px HTML = 1080px LinkedIn (at 2x device scale) */
}
```

### LinkedIn Output Standards

| Format | Ratio | LinkedIn Dimensions | Use |
|--------|-------|---------------------|-----|
| Portrait | 4:5 | 1080 × 1350px | Standard LinkedIn post image |
| Landscape | 3:2 | 1200 × 800px | Article headers, banners |
| Square | 1:1 | 1080 × 1080px | Alternative post format |

**Default: 4:5 Portrait (1080×1350).** This is the proven LinkedIn format.

---

## Export via Playwright

```typescript
// Screenshot at 2x scale for retina quality
await page.setViewportSize({ width: 540, height: measured_height });
await page.screenshot({
  path: 'infographic.png',
  deviceScaleFactor: 2,  // produces 1080px wide output
});
```

**Note:** Measure actual rendered height before screenshotting — infographic height varies by content.

---

## Layout Principles (Learned from 90-Day Tax)

1. **HTML-first.** Precise typography and alignment cannot be achieved with AI image generation. Always build in HTML.
2. **nano-banana-pro cannot replicate HTML infographics.** Don't attempt it.
3. **Narrative arc drives structure.** Every infographic should tell: Problem → Gap / Evidence → Solution.
4. **Column headers need distinct colors.** Use Amber, Navy, Steel (not all orange) — instant scanability.
5. **Stat strip packs a punch.** 3 data points in the strip do more than a paragraph of context.
6. **Icons are mandatory.** Every obstacle, pillar, or feature needs a Lucide icon. Plain text lists don't scan.
7. **Footer CTA stays slim.** One line, profile pic, alvishouse.io. Never bloat the footer.
8. **The infographic mirrors the guide.** Same narrative, same sections — just compressed.
