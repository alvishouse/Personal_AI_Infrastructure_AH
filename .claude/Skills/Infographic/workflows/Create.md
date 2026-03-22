# Workflow: Create Infographic

Produces a LinkedIn-ready infographic as HTML exported to 1080×1350px PNG via Playwright.

---

## Phase 1 — Brief

**Goal:** Define the topic, style, and content source.

Ask or confirm:
1. What is the topic or title?
2. What content drives this? (existing post, guide, or describe the framework)
3. Who is the audience?
4. What is the ONE takeaway the viewer must leave with?
5. Which style? (see Style Decision below)

### Style Decision

| Style | File | Best For |
|-------|------|----------|
| **CheatSheet** | `styles/CheatSheet.md` | Step-by-step guides, numbered frameworks, comparison tables, 4+ steps — default for B2B |
| **Notebook** | `styles/Notebook.md` | "What people think vs. reality", visual diagrams (funnels, ladders, mind maps), general audiences |

**Default: CheatSheet** for thought leadership content. **Notebook** when the content has a strong visual diagram as its core.

**Output:** `01-brief/brief.md`

```markdown
# Brief: [Title]

**Topic:** ...
**Source content:** [file path or description]
**Audience:** ...
**Core takeaway:** [one sentence]
**Style:** CheatSheet | Notebook
**Narrative arc pattern:** [A / B / C / D — see InfographicDesigner.md]
```

---

## Phase 2 — Design Brief

**Goal:** Map content to specific HTML components.

Agent: `InfographicDesigner` (sonnet) — reads `../styles/[CheatSheet|Notebook].md` first

Input: `01-brief/brief.md` + source content

Output: `02-design/design-brief.md`

The brief specifies:
- Chosen style and color assignments
- Section-by-section component selection
- All Lucide icons to use (contextual — viewer understands concept from icon alone)
- Stat or callout content (no placeholders — real numbers only)

**PAUSE: Review design brief before building.**

---

## Phase 3 — HTML Build

**Goal:** Construct the infographic HTML.

### Canvas — LOCKED SIZE (CRITICAL)

```css
body { background: white; padding: 0; margin: 0; }
.ig {
  width: 540px;
  height: 675px;        /* LOCKED — do not make variable */
  overflow: hidden;
  background: white;
  display: flex;
  flex-direction: column;
}
```

**Why 675px?** `540 × 2 = 1080px wide`, `675 × 2 = 1350px tall` → exactly LinkedIn 4:5 portrait at 2x. Content taller than 675px gets cut off. Design to fit.

### Fonts

**CheatSheet:** Inter
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
```

**Notebook:** Nunito
```html
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet">
```

### Icons — Lucide (CRITICAL RULES)

Load via CDN:
```html
<script src="https://unpkg.com/lucide@latest"></script>
```

Call at end of `<body>`:
```html
<script>lucide.createIcons();</script>
```

**⚠️ Icon color fix — MANDATORY:**

`lucide.createIcons()` replaces every `<i data-lucide="...">` with an `<svg>`. After replacement, CSS rules targeting `i` stop working. You MUST:

1. Set `color: white` on the **parent container**, not on `<i>`
2. Add explicit `svg` targeting rules for every dark-background container:

```css
/* CheatSheet: section headers and icon badges */
.cs-header { color: white; }
.cs-header svg { width: 14px; height: 14px; stroke: white; color: white; }

.cs-icon-badge { color: white; }
.cs-icon-badge svg { width: 13px; height: 13px; stroke: white; color: white; }

/* Any other dark container */
.dark-callout svg { stroke: white; color: white; }
```

3. For **light backgrounds** (Notebook style), icons inherit dark stroke — no override needed unless the container has a colored fill.

**Icon selection rule:** Every icon must be contextual — a viewer who doesn't read the label should understand the concept from the icon alone. Use the icon selection guides in each style file.

### Profile Picture — ALWAYS in Footer

Every infographic footer must include the profile picture:

```html
<img src="https://alvishouse.io/wp-content/uploads/2026/02/alvis-profile.png"
     alt="Alvis House"
     style="width:32px;height:32px;border-radius:50%;object-fit:cover;flex-shrink:0;">
```

Footer layout (flex row, dark background for CheatSheet, light for Notebook):
```
[profile pic 32px round] [name · linkedin.com/in/alvishouse · alvishouse.io]
```

### Size Budget (CheatSheet, 675px)

| Block | Height |
|-------|--------|
| Title + subtitle | ~52px |
| Per section header | ~22px |
| Per content row (layer/step) | ~58–65px |
| Bottom callout | ~38px |
| Footer with pic | ~34px |

Plan the layout before building. Count rows × row-height to confirm it fits.

---

## Phase 4 — Browser Review

**Goal:** Visual QC before export.

Check:
- [ ] Total height = exactly 675px (`.ig` has `height: 675px; overflow: hidden`)
- [ ] No text overflow in any section
- [ ] Profile pic loads (URL resolves)
- [ ] Lucide icons render as white on all dark backgrounds
- [ ] Lucide icons render as dark on all light backgrounds (Notebook)
- [ ] Footer CTA is single line — not wrapping
- [ ] All section headers have the correct section color
- [ ] `lucide.createIcons()` is called at end of `<body>` — not in `<head>`

---

## Phase 5 — Export to LinkedIn PNG

**Goal:** Produce final 1080×1350 PNG.

Screenshot the `.ig` element at `deviceScaleFactor: 2`:

```typescript
import { chromium } from "playwright";

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });
const page = await context.newPage();

await page.goto(`file://${htmlPath}`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500);   // let Lucide render icons

const element = page.locator(".ig");
await element.screenshot({
  path: outputPath,
  type: "png",
  scale: "device",
});

await browser.close();
```

**Verify:** Output must be exactly **1080×1350px**. Read from PNG header:
```typescript
const buf = readFileSync(outputPath);
const width  = buf.readUInt32BE(16);   // must = 1080
const height = buf.readUInt32BE(20);   // must = 1350
```

If height ≠ 1350: the `.ig` CSS `height: 675px` is not being respected — check for `flex-shrink` or height override issues.

---

## Phase 6 — Publish

1. Upload `infographic.png` to WordPress media library → note media ID
2. Create Notion entry (Content Type: `Infographic`)
   - Title, Status: `Draft`, WordPress media URL
3. Update `metadata.json`

---

## Output Files

```
scratchpad/infographics/YYYY-MM-DD-{slug}/
  01-brief/
    brief.md
  02-design/
    design-brief.md
  03-output/
    infographic.html      ← source of truth
    infographic.png       ← LinkedIn export (1080×1350px exactly)
  metadata.json
```
