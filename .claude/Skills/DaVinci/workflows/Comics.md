# Da Vinci Comics Workflow

**Hand-drawn sequential panels using Leonardo notebook aesthetic.**

Creates **COMIC PANELS** — multi-panel narratives with Da Vinci construction.

---

## Purpose

Comics show:
- Sequential stories
- Before/during/after narratives
- Multi-step explanations
- Character journeys
- Transformation sequences

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Panel Sequence

```
STORY: [Title/Theme]

PANELS:
1. [Scene]: [What happens] — [Caption if any]
2. [Scene]: [What happens] — [Caption if any]
3. [Scene]: [What happens] — [Caption if any]
```

**Standard:** 3-4 panels tells most stories

---

### Step 2: Choose Panel Layout

| Panels | Layout |
|--------|--------|
| 2 | Side by side (16:9) |
| 3 | Triptych or L-shape |
| 4 | 2x2 grid (1:1) |
| 6 | 2x3 or 3x2 |

---

### Step 3: Construct Prompt

```
Sequential comic panels in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

STORY: [Theme/Title]
LAYOUT: [X panels in arrangement]

PANEL 1:
- Scene: [Description]
- Caption: "[Text if any]"
- Draw: [Visual elements]
- Position: [Top-left / etc.]

PANEL 2:
- Scene: [Description]
- Caption: "[Text if any]"
- Draw: [Visual elements]
- Transition: [What changes from Panel 1]

PANEL 3:
- Scene: [Description]
- Caption: "[Text if any]"
- Draw: [Visual elements]
- Highlight: Burnt copper (#CF5828) — climax moment

PANEL 4:
- Scene: [Description]
- Draw: [Visual elements]
- Resolution: [How story concludes]

PANEL STYLE:
- Hand-drawn borders (imperfect rectangles)
- Deep slate blue (#3B546B) linework
- Sketchy character/object representations
- Hand-lettered captions
- Gutter space between panels

CONSTRUCTION:
- Guide lines for panel alignment
- Proportion marks for panel sizes
- Flow direction indicators
- Ghost lines connecting sequence

CRITICAL:
- Hand-drawn panel borders
- Clear narrative sequence
- Sketchy illustration style
- Leonardo notebook aesthetic
- Not a polished comic — exploratory sketches
```

---

### Step 4: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/comic.png
```

---

### Step 5: Validation

**Must Have:**
- [ ] Clear panel sequence
- [ ] Readable if captions exist
- [ ] Hand-drawn borders
- [ ] Narrative flow
- [ ] Key moment highlighted

**Must NOT Have:**
- [ ] Confusing sequence order
- [ ] Perfect panel borders
- [ ] Overdetailed art
- [ ] Modern comic book polish
