# Da Vinci Editorial Illustration Workflow

**Hand-drawn editorial illustrations for blog headers and article visuals using Leonardo notebook aesthetic.**

Creates **ONE ABSTRACT VISUAL METAPHOR** — parchment background, slate blue ink, hand-drawn sketch style.

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
[3] AESTHETIC: Apply Da Vinci notebook style
     ↓
[4] PROMPT: Construct with template
     ↓
[5] GENERATE: Execute CLI tool
     ↓
[6] VALIDATE: Hand-drawn? Parchment? Minimal?
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
- "Gears meshing together" (systems working)
- "Roots spreading underground" (hidden connections)
- "Hand holding compass" (navigation/direction)
- "Pulleys lifting weight" (leverage)
- "Lens focusing light" (clarity)

❌ **Bad (too abstract):**
- "Flowing shapes representing data"
- "Geometric transformation"
- "Abstract energy patterns"

**Test:** Can you close your eyes and picture it like a physical object?

---

## Step 3: Apply Da Vinci Aesthetic

Map your metaphor to the style:

```
METAPHOR: [Your physical concept]
BACKGROUND: Warm parchment (#ECE6D9)
LINEWORK: Slate blue (#3B546B), hand-drawn, imperfect
CONSTRUCTION: Visible guide circles, measurement marks
ACCENT: Burnt copper (#CF5828) on focal point only
```

---

## Step 4: Construct Prompt

```
Editorial illustration in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

CONCEPT: [One sentence describing the metaphor]

CENTRAL ELEMENT:
[Describe your physical metaphor in detail]
Draw as if Leonardo was exploring this mechanism/object
Visible construction geometry — guide circles, proportion marks
Hand-drawn imperfect lines in deep slate blue (#3B546B)

AESTHETIC:
- Variable stroke width (thicker at pressure points)
- Multiple overlapping sketch strokes
- Ghost construction lines showing thinking
- Cross-hatching for any shading (NO gradients)
- Paper grain texture visible

COMPOSITION:
- Central hero element (40-60% of frame)
- Generous negative space (thinking space)
- Asymmetric but balanced
- 2-3 annotation elements orbiting

COLOR:
- Deep slate blue (#3B546B) for all primary linework
- Muted steel gray (#7A8C9B) for construction lines
- Burnt copper (#CF5828) accent ONLY on key focal point

CRITICAL:
- Hand-drawn imperfect quality (NOT vectors)
- Looks like inventor's notebook page
- Abstract metaphor, not literal illustration
- Should feel thought through by human
```

---

## Step 5: Execute Generation

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/header.png
```

**Blog headers:** Use 16:9 aspect ratio
**Square format:** Use 1:1 for social media

---

## Step 6: Validation (MANDATORY)

**Must Have:**
- [ ] Warm parchment background
- [ ] Hand-drawn imperfect lines
- [ ] Abstract metaphor (not literal)
- [ ] Construction geometry visible
- [ ] Cross-hatching only
- [ ] Burnt copper sparingly
- [ ] Feels like notebook sketch

**Must NOT Have:**
- [ ] Clean vectors
- [ ] Digital gradients
- [ ] Literal illustration of content
- [ ] Neon or glow effects
- [ ] Corporate polish

**If fails → regenerate with stronger emphasis on failed criteria.**

---

## Quick Reference

### Metaphor Starters

| Content Theme | Possible Metaphor |
|---------------|-------------------|
| Learning | Gears meshing, root systems |
| Discovery | Compass, telescope, map |
| Building | Architecture, scaffolding |
| Connection | Bridges, networks, threads |
| Transformation | Metamorphosis, alchemy |
| Balance | Scales, counterweights |
| Growth | Tree rings, spiral shells |
