# CheatSheet Infographic Style

## Style Overview
**"Dense Reference Card"**

Information-dense multi-section layout modeled after creator cheat sheets and newsletter reference cards (see: Chris Donnelly "How To Master Claude Skills" and "How Lovable Built A $6bn Company" formats). White base with bold colored section header bars, numbered steps, comparison tables, and callout boxes. Designed for maximum information density without feeling cluttered.

**This is an HTML-first style.** Output is an HTML file exported to PNG via Playwright at 2× (540px → 1080px).

---

## When to Use This Style

- How-to guides and step-by-step frameworks (6+ steps)
- Reference cheat sheets meant to be saved and referred back to
- "Complete guide to X" posts with multiple distinct sections
- Content comparing multiple options (tables, side-by-side)
- Posts where density = credibility (this IS the guide, not a teaser)

---

## COLOR PALETTE

```css
:root {
  --white:         #FFFFFF;   /* Base background */
  --page-bg:       #F8F8F8;   /* Very light grey outer bg */
  --text-primary:  #1A1A1A;   /* Headings, bold labels */
  --text-body:     #333333;   /* Body copy */
  --text-muted:    #666666;   /* Secondary labels, captions */
  --border:        #E5E7EB;   /* Card borders, table lines */
  --rule:          #F0F0F0;   /* Light row separators */

  /* Section header fills — each section gets ONE color */
  --section-1:     #1B4D3E;   /* Dark forest green */
  --section-2:     #C85C1A;   /* Burnt orange */
  --section-3:     #6B21A8;   /* Deep purple */
  --section-4:     #BE185D;   /* Magenta pink */
  --section-5:     #0F4C75;   /* Navy blue */
  --section-6:     #7C3E11;   /* Dark brown */
  --section-on:    #FFFFFF;   /* Text on colored section headers */

  /* Callout fills (light tints of section colors for body callouts) */
  --callout-green: #F0FFF4;
  --callout-orange:#FFF4EF;
  --callout-purple:#FAF0FF;
  --callout-pink:  #FFF0F7;

  /* Step number circles */
  --step-bg:       #1B4D3E;   /* Default = section-1; override per section */
  --step-text:     #FFFFFF;

  /* Table */
  --table-head:    #1A1A1A;
  --table-head-bg: #F5F5F5;
  --table-alt:     #FAFAFA;

  /* CTA bar at bottom */
  --cta-bg:        #1A1A1A;
  --cta-text:      #FFFFFF;
  --cta-highlight: #F59E0B;   /* Amber — subscribe/link highlight */
}
```

**Section color assignment rule:** Assign colors in order (section-1, section-2, section-3…). Never use the same color twice consecutively. With 4+ sections, cycle through green → orange → purple → pink → navy.

---

## TYPOGRAPHY

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

| Use | Font | Settings |
|-----|------|----------|
| Page title (hero) | `Inter` | 26px / weight 900 / color var(--text-primary) |
| Title accent word | `Inter` | 26px / weight 900 / colored span (matches section-1 or section-2) |
| Page subtitle | `Inter` | 11px / weight 400 / italic / color var(--text-muted) |
| Section header text | `Inter` | 11px / weight 800 / uppercase / letter-spacing 1.5px / white |
| Step title | `Inter` | 11px / weight 700 / color var(--text-primary) |
| Body copy | `Inter` | 10px / weight 400 / color var(--text-body) |
| Table header | `Inter` | 9px / weight 700 / uppercase / letter-spacing 1px |
| Table body | `Inter` | 9.5px / weight 400 |
| Callout label | `Inter` | 9px / weight 700 / uppercase / color matching section color |
| Caption/footer | `Inter` | 9px / weight 400 / color var(--text-muted) |

---

## LAYOUT STRUCTURE

### Canvas
- HTML width: **540px**
- Export: 2× deviceScaleFactor → **1080px wide PNG**
- Background: `var(--page-bg)` outer, white panels for each section
- Height: variable; content-determined (typically 900–1600px for a full cheat sheet)

### Section Stacking Order
```
1. TITLE BLOCK          — white, large bold title + subtitle
2. SECTION A            — colored header bar + white content area
3. SECTION B            — colored header bar + white content area
   ...
N. KEY RULE / CALLOUT   — dark bg callout box (optional closing section)
N+1. CTA BAR            — dark bg, subscribe/follow CTA
```

Each section = colored header strip + content area with 16px padding. Sections are direct children of the `.ig` container with `margin-bottom: 4px` gaps between.

---

## COMPONENT PATTERNS

### Section Header Bar
```css
.cs-section {
  border-radius: 0;          /* full-bleed edge-to-edge */
  overflow: hidden;
}
.cs-header {
  background: var(--section-1);   /* change per section */
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.cs-header-title {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: white;
}
.cs-body {
  background: white;
  padding: 14px 16px;
}
```

Optional: add a small emoji or icon before the title in `.cs-header` for visual variety.

---

### Numbered Steps (Vertical List)
```css
.cs-steps { display: flex; flex-direction: column; gap: 10px; }
.cs-step { display: flex; gap: 10px; align-items: flex-start; }
.cs-step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--section-1);   /* match section color */
  color: white;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}
.cs-step-content { flex: 1; }
.cs-step-title {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 3px;
}
.cs-step-body {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  font-weight: 400;
  color: var(--text-body);
  line-height: 1.45;
}
```

---

### Two-Column Layout (Side by Side)
For sections with a main content column + sidebar:

```css
.cs-cols { display: flex; gap: 12px; }
.cs-col-main { flex: 1; }
.cs-col-side { width: 170px; flex-shrink: 0; }
```

---

### Comparison Table
```css
.cs-table { width: 100%; border-collapse: collapse; }
.cs-table th {
  background: var(--table-head-bg);
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-primary);
  padding: 6px 8px;
  text-align: left;
  border-bottom: 2px solid var(--border);
}
.cs-table td {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  font-weight: 400;
  color: var(--text-body);
  padding: 6px 8px;
  border-bottom: 1px solid var(--rule);
  vertical-align: top;
}
.cs-table tr:nth-child(even) td { background: var(--table-alt); }
```

---

### Callout Box (Key Rule / Think of It This Way)
```css
.cs-callout {
  background: var(--callout-green);   /* match section tint */
  border-left: 3px solid var(--section-1);
  padding: 8px 12px;
  border-radius: 0 4px 4px 0;
  margin: 10px 0;
}
.cs-callout-label {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--section-1);
  margin-bottom: 4px;
}
.cs-callout-body {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  color: var(--text-body);
  line-height: 1.45;
}
```

---

### Stat Highlight (Big Number)
For sections leading with a key metric:

```css
.cs-stat { display: flex; align-items: baseline; gap: 6px; margin: 8px 0; }
.cs-stat-num {
  font-family: 'Inter', sans-serif;
  font-size: 32px;
  font-weight: 900;
  color: var(--section-1);   /* match section color */
  line-height: 1;
}
.cs-stat-label {
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: var(--text-body);
}
```

---

### Bullet List with Checkmarks / Arrows
```css
.cs-list { list-style: none; margin: 0; padding: 0; }
.cs-list li {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: var(--text-body);
  padding: 3px 0 3px 18px;
  position: relative;
  line-height: 1.4;
}
.cs-list li::before {
  content: "✓";   /* or "→" or "•" */
  position: absolute;
  left: 0;
  color: var(--section-1);
  font-weight: 700;
}
```

---

### Dark Callout Box (Key Rule / Warning)
Full-width dark section for emphasis:

```css
.cs-dark-callout {
  background: #1A1A1A;
  padding: 12px 16px;
  margin: 0 -16px;    /* bust out of section padding */
}
.cs-dark-label {
  font-family: 'Inter', sans-serif;
  font-size: 9px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: var(--cta-highlight);
  margin-bottom: 6px;
}
.cs-dark-body {
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  color: rgba(255,255,255,0.88);
  line-height: 1.5;
}
```

---

### CTA Bar (Bottom)
```css
.cs-cta {
  background: #1A1A1A;
  padding: 10px 16px;
  text-align: center;
}
.cs-cta-text {
  font-family: 'Inter', sans-serif;
  font-size: 9.5px;
  color: rgba(255,255,255,0.75);
}
.cs-cta-highlight {
  color: var(--cta-highlight);
  font-weight: 700;
}
```

---

## TYPOGRAPHY SCALE

```
Page title:          Inter 900, 26px, #1A1A1A (accent word colored)
Page subtitle:       Inter 400 italic, 11px, #666
Section header:      Inter 800 uppercase, 11px, white on color bg
Step title:          Inter 700, 11px, #1A1A1A
Body copy:           Inter 400, 9.5–10px, #333
Table header:        Inter 700 uppercase, 9px, #1A1A1A
Callout label:       Inter 700 uppercase, 9px, section color
Stat number:         Inter 900, 32px, section color
Footer/CTA:          Inter 400, 9px, muted
```

---

## TITLE TREATMENT

The page title should have at least ONE word in a color (matching section-1 or section-2). Use an inline `<span>` with a background highlight or just a color change:

```html
<h1 class="cs-title">
  How To Master
  <span style="color: var(--section-1);">Claude Skills</span>
  <span class="cs-title-icon">✳</span>
</h1>
```

Or use a highlighted background on the accent word (like Image 3):
```html
<span style="background: var(--section-2); color: white; padding: 0 6px; border-radius: 3px;">$6bn Company</span>
```

---

## ICONOGRAPHY (Lucide Icons)

Icons are mandatory in the CheatSheet style. Every section header, every step, and every table row type should have a contextual Lucide icon. **The icon must be intuitive — the concept should be understood from the icon without reading the text.**

### Setup
```html
<script src="https://unpkg.com/lucide@latest"></script>
<!-- At end of body: -->
<script>lucide.createIcons();</script>
```

### Icon Usage Rules

1. **Contextual always** — never generic. Don't use `star` for "best practice" — use `check-circle`. Don't use `arrow-right` for "step" — use the concept the step is about.
2. **Colored icon badges** — wrap icons in a small colored rounded-square badge matching the section color:
```css
.cs-icon-badge {
  width: 22px;
  height: 22px;
  border-radius: 5px;
  background: var(--section-1);   /* match section color */
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.cs-icon-badge i { width: 13px; height: 13px; color: white; }
```
3. **Section header icons** — use 18px icon, white, inline with title text
4. **Step number alternative** — for steps with strong conceptual icons, replace the circle number with an icon badge instead
5. **Table type column** — use 14px icon in first column to make each row's category scannable at a glance

### Section Header with Icon
```html
<div class="cs-header" style="background: var(--section-2);">
  <i data-lucide="layers" style="width:18px;height:18px;color:white;flex-shrink:0;"></i>
  <span class="cs-header-title">How To Set Up A Skill</span>
</div>
```

### Step with Icon Badge (instead of number circle)
```html
<div class="cs-step">
  <div class="cs-icon-badge" style="background: var(--section-1);">
    <i data-lucide="search"></i>
  </div>
  <div class="cs-step-content">
    <div class="cs-step-title">Identify a recurring task</div>
    <div class="cs-step-body">Any task you brief Claude on more than once is a Skill candidate.</div>
  </div>
</div>
```

### Icon Selection Guide

| Content | Lucide Icon | Why |
|---------|-------------|-----|
| Step: Identify/discover | `search` | Finding something |
| Step: Create/build | `hammer` | Building |
| Step: Write/document | `file-text` | Writing |
| Step: Test/validate | `flask-conical` | Testing |
| Step: Deploy/launch | `rocket` | Launch |
| Step: Refine/improve | `settings-2` | Tuning |
| Role / who | `user` | Person identity |
| Rules / constraints | `shield` | Protection/rules |
| Trigger / when | `zap` | Activation |
| Time saved | `clock` | Time |
| Consistency / quality | `layers` | Stacked consistency |
| AI / automation | `cpu` | Intelligence |
| Team / people | `users` | Group |
| Strategy | `compass` | Direction |
| Data / analytics | `bar-chart-2` | Data |
| Growth | `trending-up` | Upward trend |
| Problem / warning | `alert-triangle` | Warning |
| Success / done | `check-circle` | Achievement |
| Money / budget | `dollar-sign` | Financial |
| Workflow / process | `git-branch` | Flow branching |
| Communication | `message-square` | Messaging |
| Framework / system | `layout-grid` | Structured system |
| Speed / fast | `zap` | Speed |
| Research | `microscope` | Deep investigation |
| Content creation | `pen-tool` | Writing/creation |
| Newsletter / email | `mail` | Direct delivery |
| LinkedIn / social | `share-2` | Network sharing |

---

## WHAT THIS STYLE IS NOT

- Not light/minimal (this style is intentionally dense)
- Not stroke-diagram style (use Notebook for visual diagrams)
- Not single-color (each section gets its own color)
- Not all-caps throughout (only section headers and table headers are uppercase)
- Not centered layout (left-aligned content throughout, except CTA)
- Not equal-height card grids (sections vary in height based on content)

---

## CANONICAL REFERENCES

Style modeled after:
1. Chris Donnelly "How To Master Claude Skills" — multi-column sections, colored header bars, dense numbered steps
2. Chris Donnelly "How Lovable Built A $6bn Company" — step sections with colored borders, comparison columns
3. Ryan Lee "8 Steps to Set Up Your Entire Claude Cowork" — bold typography, radial layout variant

Key characteristics: colored section header strips, numbered circles, callout boxes, comparison tables, dark CTA bar at bottom.
