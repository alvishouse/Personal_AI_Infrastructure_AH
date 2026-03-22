# Da Vinci Comparison Workflow

**Hand-drawn side-by-side comparisons using Leonardo notebook aesthetic.**

Creates **COMPARISON DIAGRAMS** — X vs Y layouts with Da Vinci construction.

---

## Purpose

Comparisons show:
- A vs B analysis
- Pros/cons lists
- Before/after states
- Alternative options
- Feature comparisons

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Comparison Elements

```
COMPARISON: [A] vs [B]

ITEM A:
- Attribute 1: [Value]
- Attribute 2: [Value]
- Attribute 3: [Value]

ITEM B:
- Attribute 1: [Value]
- Attribute 2: [Value]
- Attribute 3: [Value]
```

---

### Step 2: Choose Layout

| Type | Layout |
|------|--------|
| Equal comparison | Split vertical |
| Before/After | Left/Right |
| Winner/Loser | Emphasized split |
| Multiple options | Multi-column |

---

### Step 3: Construct Prompt

```
Side-by-side comparison in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

COMPARISON: [A] vs [B]

LAYOUT:
- Split composition: left side vs right side
- Central dividing line (hand-drawn, not perfectly straight)
- Equal visual weight on both sides

LEFT SIDE — [A]:
- Draw as: [Visual representation]
- Key attributes listed
- Hand-drawn box or region

RIGHT SIDE — [B]:
- Draw as: [Visual representation]
- Key attributes listed
- Hand-drawn box or region

CONNECTING ELEMENTS:
- "VS" or dividing element in center
- Comparison lines between matching attributes
- Muted steel gray (#7A8C9B) for connection lines

VISUAL STYLE:
- Hand-drawn imperfect borders
- Deep slate blue (#3B546B) linework
- Hand-lettered labels
- Visible construction guides

CONSTRUCTION:
- Center line with measurement marks
- Guide circles at corners
- Proportion indicators
- Ghost alignment lines

ACCENT:
- Burnt copper (#CF5828) on [preferred option or key difference]

CRITICAL:
- Hand-drawn notebook aesthetic
- Clear visual separation
- Readable labels
- Not a corporate comparison chart
```

---

### Step 4: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/comparison.png
```

---

### Step 5: Validation

**Must Have:**
- [ ] Clear A vs B separation
- [ ] Readable labels
- [ ] Hand-drawn divider
- [ ] Balanced visual weight
- [ ] Construction geometry

**Must NOT Have:**
- [ ] Perfect symmetry
- [ ] Corporate chart look
- [ ] Overcrowded content
