# Da Vinci Timeline Workflow

**Hand-drawn chronological progressions using Leonardo notebook aesthetic.**

Creates **TIMELINES** — historical or sequential progressions with Da Vinci construction marks.

---

## Purpose

Timelines show:
- Historical progressions
- Evolution over time
- Phase sequences
- Era comparisons
- Project milestones

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Time Points

```
TIMELINE: [Title]
SPAN: [Start date] → [End date]

POINTS:
1. [Date/Era]: [Event/Phase] — [Brief description]
2. [Date/Era]: [Event/Phase] — [Brief description]
3. [Date/Era]: [Event/Phase] — [Brief description]
...
```

**Max:** 5-7 points for clarity

---

### Step 2: Choose Direction

| Type | Direction | Ratio |
|------|-----------|-------|
| Historical | Left → Right | 16:9 |
| Evolution | Bottom → Top | 9:16 |
| Phases | Left → Right | 16:9 |
| Spiral | Center out | 1:1 |

---

### Step 3: Construct Prompt

```
Historical timeline in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

TIMELINE: [Title/Subject]
DIRECTION: [Left to right / Bottom to top]

MAIN AXIS:
- Hand-drawn line with slight wave (not perfectly straight)
- Measurement ticks at regular intervals
- Time labels along axis
- Deep slate blue (#3B546B) ink

TIME POINTS:
1. [Date]: [Event]
   - Position: [Left/Start]
   - Draw as: Small node with annotation
   
2. [Date]: [Event]
   - Position: [Middle]
   - Draw as: Node with brief label

3. [Date]: [Event]
   - Position: [Right/End]
   - Draw as: Node with burnt copper accent (key moment)

VISUAL ELEMENTS:
- Connection line with variable weight
- Small icons or symbols at each point (hand-drawn)
- Annotation labels in hand-lettered style
- Proportion marks showing intervals

CONSTRUCTION:
- Visible guide lines for spacing
- Ghost measurement marks
- Overlapping construction circles at nodes
- Time scale indicators

ACCENT:
- Burnt copper (#CF5828) on pivotal moment
- Use on ONE key event only

CRITICAL:
- Hand-drawn imperfect axis line
- Visible construction geometry
- Clear chronological direction
- Leonardo notebook aesthetic
- Not a corporate timeline graphic
```

---

### Step 4: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/timeline.png
```

---

### Step 5: Validation

**Must Have:**
- [ ] Clear chronological direction
- [ ] Readable dates/labels
- [ ] Hand-drawn axis and nodes
- [ ] Construction marks visible
- [ ] Balanced spacing

**Must NOT Have:**
- [ ] Perfect straight lines
- [ ] Overcrowded labels
- [ ] Unclear time direction
