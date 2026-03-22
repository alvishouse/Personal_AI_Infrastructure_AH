# Da Vinci Annotated Screenshots Workflow

**Hand-drawn markup on screenshots using Leonardo notebook aesthetic.**

Creates **ANNOTATED SCREENSHOTS** — callouts and labels with Da Vinci construction style.

---

## Purpose

Annotated screenshots show:
- UI element callouts
- Feature highlights
- Step-by-step walkthroughs
- Bug/issue markers
- Design annotations

---

## 🚨 WORKFLOW STEPS

### Step 1: Identify Annotation Points

```
SCREENSHOT: [Description of what's shown]

CALLOUTS:
1. [Element]: [Description] — Position: [location]
2. [Element]: [Description] — Position: [location]
3. [Element]: [Description] — Position: [location]
```

**Max:** 3-5 callouts for clarity

---

### Step 2: Plan Annotation Style

| Callout Type | Style |
|--------------|-------|
| Important | Burnt copper circle |
| Sequence | Numbered nodes |
| Description | Line + label |
| Warning | Circle with emphasis |

---

### Step 3: Construct Prompt

```
Annotated interface mockup in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

BASE: [Describe the interface/screenshot abstractly]
- Draw as hand-sketched wireframe
- Deep slate blue (#3B546B) linework
- Simplified shapes, not detailed UI

ANNOTATIONS:

1. [Element at location]
   - Draw: Circle callout with line to label
   - Label: "[Description]"
   - Style: Hand-drawn circle, variable line weight

2. [Element at location]
   - Draw: Arrow pointing to element
   - Label: "[Description]"
   - Position: [Outside the element]

3. [Key element]
   - Draw: Burnt copper (#CF5828) highlight circle
   - Label: "[Important note]"
   - This is the PRIMARY callout

CALLOUT STYLE:
- Hand-drawn circles (imperfect, organic)
- Connecting lines with slight curve
- Hand-lettered labels
- Variable stroke weight

CONSTRUCTION:
- Guide lines for annotation alignment
- Proportion marks near measured elements
- Ghost lines connecting related callouts

CRITICAL:
- NOT a perfect screenshot — sketched interpretation
- Hand-drawn callout circles
- Leonardo notebook aesthetic
- Readable annotations
```

---

### Step 4: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/annotated.png
```

---

### Step 5: Validation

**Must Have:**
- [ ] Clear callout connections
- [ ] Readable labels
- [ ] Hand-drawn circles/arrows
- [ ] Primary element highlighted
- [ ] Notebook sketch feel

**Must NOT Have:**
- [ ] Perfect circles
- [ ] Too many callouts
- [ ] Illegible text
