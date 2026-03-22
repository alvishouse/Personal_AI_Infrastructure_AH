# Excalidraw Editorial Illustration Workflow

**Digital whiteboard editorial illustrations for blog headers using Excalidraw aesthetic.**

Creates **ONE ABSTRACT VISUAL METAPHOR** — wiggly lines, hatched fills, whiteboard sketch style.

---

## Purpose

Editorial illustrations capture the essence of written content as abstract visual metaphors.

**Use this workflow for:**
- Blog post headers
- Article illustrations
- Newsletter visuals
- Abstract concept art

---

## 🚨 MANDATORY STEPS

```
INPUT CONTENT
     ↓
[1] EXTRACT: Identify core thesis/concept
     ↓
[2] METAPHOR: Find physical representation
     ↓
[3] AESTHETIC: Apply Excalidraw whiteboard style
     ↓
[4] PROMPT: Construct with template
     ↓
[5] GENERATE: Execute CLI tool
     ↓
[6] VALIDATE: Wiggly? Hatched? Whiteboard feel?
```

---

## Step 1: Extract Core Concept

Read the content and identify:
1. **The ONE key idea** — What is this really about?
2. **The transformation** — What changes or emerges?
3. **The tension** — What opposing forces exist?

**Output:** One sentence summarizing the core concept.

---

## Step 2: Find Physical Metaphor

**CRITICAL:** Concepts must use PHYSICAL RECOGNIZABLE objects.

✅ **Good metaphors:**
- "Connected boxes with arrows" (systems working)
- "Network nodes with links" (relationships)
- "Gears meshing" (processes integrating)
- "Flowchart with decision points" (logic paths)
- "Layered stack diagram" (hierarchy)

❌ **Bad (too abstract):**
- "Flowing energy patterns"
- "Abstract transformation"
- "Geometric evolution"

**Test:** Can you sketch it on a whiteboard in 2 minutes?

---

## Step 3: Apply Excalidraw Aesthetic

Map your metaphor to the style:

```
METAPHOR: [Your whiteboard concept]
BACKGROUND: White (#FFFFFF)
LINEWORK: Black (#1E1E1E), wiggly, imperfect
FILLS: Hatched diagonal lines (no solid colors)
ACCENT: Blue (#3B82F6) on key element only
TEXT: All-caps architect font
```

---

## Step 4: Construct Prompt

```
Digital whiteboard illustration in Excalidraw style
on white background (#FFFFFF).

CONCEPT: [One sentence describing the metaphor]

CENTRAL ELEMENT:
[Describe your diagram/system in detail]
Draw as if sketching on Excalidraw.com
Wiggly imperfect lines, corners don't perfectly connect
Hand-drawn shapes with deliberate jitter

AESTHETIC:
- Wiggly lines throughout (deliberate jitter)
- Lines overshoot at corners slightly
- Circles as overlapping spirals
- Variable line thickness
- Hand-drawn imperfect quality

FILLS:
- Hatched diagonal lines for filled shapes
- Cross-hatching for emphasis
- Scribbled texture patterns
- NO solid colors ever

COMPOSITION:
- Central concept (40-60% of frame)
- Generous white space (not cluttered)
- Supporting elements with wiggly connectors
- 2-4 labeled components

TEXT:
- All-caps architect print font
- Blocky handwritten style
- Labels on key elements
- Hand-drawn appearance

COLOR:
- Black (#1E1E1E) for all primary lines and text
- Blue (#3B82F6) accent on [specific key element]
- Optional: Red (#EF4444) for one emphasis point
- White background

CRITICAL:
- Wiggly imperfect lines (NOT straight vectors)
- Hatched fills only, never solid
- Digital whiteboard energy
- Abstract metaphor, not literal illustration
- Should look like Excalidraw.com sketch
```

---

## Step 5: Execute Generation

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model gpt-image-1 \
  --prompt "[YOUR PROMPT]" \
  --size 1536x1024 \
  --output /path/to/header.png
```

**Blog headers:** Use 1536x1024 (16:9-ish landscape)
**Square format:** Use 1024x1024 for social media

---

## Step 6: Validation (MANDATORY)

**Must Have:**
- [ ] White background
- [ ] Wiggly imperfect lines
- [ ] Abstract metaphor (not literal)
- [ ] Hatched fills (no solid colors)
- [ ] All-caps text labels
- [ ] Looks like digital whiteboard
- [ ] Approachable, non-intimidating

**Must NOT Have:**
- [ ] Perfect straight lines
- [ ] Solid color fills
- [ ] Typed fonts
- [ ] Corporate polish
- [ ] Photorealistic elements
- [ ] Literal illustration

**If fails → regenerate with stronger emphasis on failed criteria.**

---

## Quick Reference

### Metaphor Starters

| Content Theme | Possible Metaphor |
|---------------|-------------------|
| Systems/Process | Flowchart, boxes with arrows |
| Connection | Network nodes, linked circles |
| Growth | Tree diagram, expanding layers |
| Transformation | Before/after states |
| Hierarchy | Pyramid, layered stack |
| Comparison | Split diagram, A vs B |
| Cycle | Circular flow, feedback loop |

### Color Usage
- **Black:** All lines and text
- **Blue:** One key element highlight
- **Red:** Optional single emphasis point
- **White:** Background only

---

**Remember:** Wiggly lines + hatched fills + whiteboard feel = Excalidraw aesthetic
