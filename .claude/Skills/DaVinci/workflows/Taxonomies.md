# Da Vinci Taxonomy Workflow

**Hand-drawn classification grids using Leonardo notebook aesthetic.**

Creates **TAXONOMY GRIDS** — organized categories with Da Vinci construction geometry.

---

## Purpose

Taxonomies show:
- Classification systems
- Category hierarchies
- Type breakdowns
- Organized groupings

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Category Structure

```
MAIN CATEGORY: [Top-level name]

SUBCATEGORIES:
├─ [Type A]: [Items]
├─ [Type B]: [Items]
├─ [Type C]: [Items]
└─ [Type D]: [Items]
```

**Max:** 4-6 categories for clarity

---

### Step 2: Choose Layout

| Structure | Layout |
|-----------|--------|
| Equal categories | Grid (2x2, 3x2) |
| Hierarchy | Tree structure |
| Spectrum | Linear with divisions |
| Nested | Concentric zones |

---

### Step 3: Construct Prompt

```
Classification taxonomy in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

TAXONOMY: [Name of classification]

STRUCTURE:
[Describe grid or hierarchy layout]

CATEGORIES:
1. [Category A]: [Brief description]
   - Draw as: [Box/region style]
   - Contents: [Items to include]

2. [Category B]: [Brief description]
   - Draw as: [Box/region style]
   - Contents: [Items to include]

[Continue for each category...]

VISUAL STYLE:
- Hand-drawn boxes with sketchy borders
- Deep slate blue (#3B546B) linework
- Labels in hand-lettered Montserrat style
- Dividing lines with measurement marks
- Construction geometry showing grid structure

GRID CONSTRUCTION:
- Visible guide lines for alignment
- Proportion marks showing divisions
- Ghost circles at intersections
- Imperfect but intentional spacing

ACCENT:
- Burnt copper (#CF5828) on [key category]
- Use sparingly

CRITICAL:
- Hand-drawn imperfect boxes
- Visible construction grid
- Clear readable labels
- Leonardo notebook aesthetic
```

---

### Step 4: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/taxonomy.png
```

---

### Step 5: Validation

**Must Have:**
- [ ] Clear category divisions
- [ ] Readable labels
- [ ] Hand-drawn borders
- [ ] Construction grid visible
- [ ] Balanced layout

**Must NOT Have:**
- [ ] Perfect grid lines
- [ ] Overcrowded cells
- [ ] Illegible text
