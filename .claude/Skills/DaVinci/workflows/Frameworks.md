# Da Vinci Framework Workflow

**Hand-drawn 2x2 matrices and mental models using Leonardo notebook aesthetic.**

Creates **FRAMEWORKS** — quadrant diagrams, 2x2 matrices, axis-based models.

---

## Purpose

Frameworks show:
- 2x2 matrices
- Quadrant analyses
- Axis-based positioning
- Mental models
- Strategic frameworks

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Framework Structure

```
FRAMEWORK: [Name]

X-AXIS: [Low ← Label → High]
Y-AXIS: [Low ← Label → High]

QUADRANTS:
┌─────────────────┬─────────────────┐
│ Q2: [Name]      │ Q1: [Name]      │
│ High Y, Low X   │ High Y, High X  │
├─────────────────┼─────────────────┤
│ Q3: [Name]      │ Q4: [Name]      │
│ Low Y, Low X    │ Low Y, High X   │
└─────────────────┴─────────────────┘
```

---

### Step 2: Construct Prompt

```
2x2 framework matrix in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

FRAMEWORK: [Name of framework]

AXES:
- X-axis (horizontal): [Low label] ←→ [High label]
- Y-axis (vertical): [Low label] ↕ [High label]
- Hand-drawn with slight imperfection
- Measurement ticks along axes
- Deep slate blue (#3B546B) linework

QUADRANTS:
Q1 (Top Right): [Name]
- Key characteristic: [Description]
- Optional: Small icon or symbol

Q2 (Top Left): [Name]
- Key characteristic: [Description]

Q3 (Bottom Left): [Name]
- Key characteristic: [Description]

Q4 (Bottom Right): [Name]
- Key characteristic: [Description]

VISUAL STYLE:
- Hand-drawn axis lines (not perfectly straight)
- Sketchy quadrant divisions
- Hand-lettered quadrant labels
- Proportion marks on axes
- Construction lines visible at origin

CONSTRUCTION:
- Guide circles at axis intersection
- Measurement ticks for scale
- Ghost lines showing grid structure
- Imperfect but intentional alignment

ACCENT:
- Burnt copper (#CF5828) on [key quadrant]
- Highlight the "goal" or "ideal" quadrant

CRITICAL:
- Hand-drawn imperfect lines
- Visible construction geometry
- Clear axis labels
- Leonardo notebook aesthetic
```

---

### Step 3: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/framework.png
```

**Aspect ratio:** 1:1 (square works best for 2x2)

---

### Step 4: Validation

**Must Have:**
- [ ] Clear axis labels
- [ ] Four distinct quadrants
- [ ] Readable quadrant names
- [ ] Hand-drawn axes
- [ ] Construction marks at origin
- [ ] Burnt copper on key quadrant

**Must NOT Have:**
- [ ] Perfect perpendicular lines
- [ ] Corporate chart aesthetic
- [ ] Illegible labels
