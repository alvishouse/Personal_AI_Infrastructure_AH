# Napkin Sketch Editorial Illustration Workflow

**Spontaneous analog sketches for blog headers using napkin sketch aesthetic.**

Creates **ONE ABSTRACT VISUAL METAPHOR** — napkin texture, ballpoint pen, gestural lines, authentic imperfection.

---

## Purpose

Editorial illustrations capture the essence of written content as if sketched during a spontaneous brainstorm.

**Use this workflow for:**
- Blog post headers
- Article illustrations
- Newsletter visuals
- Concept ideation art

---

## 🚨 MANDATORY STEPS

```
INPUT CONTENT
     ↓
[1] EXTRACT: Identify core thesis/concept
     ↓
[2] METAPHOR: Find physical representation
     ↓
[3] AESTHETIC: Apply napkin sketch style
     ↓
[4] PROMPT: Construct with template
     ↓
[5] GENERATE: Execute CLI tool
     ↓
[6] VALIDATE: Texture? Spontaneous? Napkin feel?
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

**CRITICAL:** Concepts must be SKETCHABLE in 2 minutes with a pen.

✅ **Good metaphors:**
- "Gears meshing" (simple mechanical concept)
- "Path with fork" (decision point)
- "Ladder or stairs" (progression)
- "Bridge connecting islands" (integration)
- "Plant growing from seed" (development)

❌ **Bad (too complex for quick sketch):**
- "Detailed circuit board"
- "Photorealistic portrait"
- "Intricate mandala pattern"

**Test:** Could you sketch this on a napkin in under 3 minutes?

---

## Step 3: Apply Napkin Sketch Aesthetic

Map your metaphor to the style:

```
METAPHOR: [Your quick sketch concept]
BACKGROUND: Napkin beige (#F5F2E8) with visible texture
TOOL: Ballpoint blue (#2C5F8D) OR Sharpie black (#1A1A1A)
LINES: Quick, confident, gestural
TEXT: All-caps hurried handwriting
CORRECTIONS: 1-2 scribbled-out mistakes visible
```

---

## Step 4: Construct Prompt

```
Spontaneous sketch on paper napkin in ballpoint pen style
on textured napkin background (#F5F2E8).

CONCEPT: [One sentence describing the metaphor]

CENTRAL SKETCH:
[Describe your concept to be sketched]
Draw as if quickly sketched during coffee shop brainstorm
Quick confident pen strokes on napkin
Gestural lines showing hand movement

MEDIUM & TEXTURE:
- Paper napkin with visible grain texture throughout
- Slight creases and natural folds in napkin
- Napkin beige color (#F5F2E8)
- Ink slightly bleeds into napkin fibers
- Optional: coffee ring stain in corner for authenticity

LINE QUALITY:
- Quick confident ballpoint pen strokes
- Gestural arrows and connections
- Circles drawn as spirals or overlapping loops
- Variable pressure (darker where pen pressed hard)
- Lines show momentum and speed

CORRECTIONS (Important for authenticity):
- One element scribbled out with quick scratch marks
- Arrow pointing to revised sketch
- Shows real-time thinking iteration
- Not cleaned up or erased

TEXT:
- All-caps hurried handwriting
- Quick scratchy pen letters
- Readable but shows haste
- Ballpoint pen script style
- Labels and annotations around sketch

COMPOSITION:
- Central sketch (50-60% of napkin)
- Annotations and labels orbiting
- Gestural arrows showing relationships
- Asymmetric natural placement
- Uses most of napkin space

COLOR (Single Tool Rule):
- Ballpoint blue (#2C5F8D) for all sketching
- OR Sharpie black (#1A1A1A) for bolder version
  (Choose ONE, never both tools)
- Optional: Red pen (#C41E3A) for single circled emphasis
- Napkin beige textured background
- Optional: Coffee stain (#8B7355)

CRITICAL:
- Napkin texture visible throughout entire image
- Gestural spontaneous energy (not planned)
- Single tool consistency (pen OR marker, not both)
- Shows real-time brainstorm thinking
- 1-2 scribbled corrections visible
- Abstract metaphor, not literal illustration
- Must look like it was sketched in 2-3 minutes
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

**Blog headers:** Use 1536x1024 (landscape)
**Square format:** Use 1024x1024 for social media

---

## Step 6: Validation (MANDATORY)

**Must Have:**
- [ ] Visible napkin texture throughout
- [ ] Gestural confident pen strokes
- [ ] Single tool (pen OR marker, not both)
- [ ] All-caps hurried handwriting
- [ ] 1-2 visible corrections (scribbled out)
- [ ] Abstract metaphor (not literal)
- [ ] Spontaneous energy (not planned)
- [ ] Looks like napkin sketch

**Must NOT Have:**
- [ ] Clean white paper background
- [ ] Perfect lines or circles
- [ ] Typed fonts
- [ ] Multiple mixed tools
- [ ] Erased/cleaned corrections
- [ ] Digital polish
- [ ] Careful planning aesthetic

**If fails → regenerate with stronger emphasis on failed criteria.**

---

## Quick Reference

### Metaphor Starters

| Content Theme | Possible Metaphor |
|---------------|-------------------|
| Growth | Plant sprouting, upward arrow |
| Connection | Linked circles, bridge |
| Decision | Fork in path, branching tree |
| Transformation | Caterpillar → butterfly |
| Process | Gear, assembly line |
| Balance | Scale, seesaw |
| Journey | Winding path, map |

### Tool Choice
- **Ballpoint blue:** Friendly, approachable, classic
- **Sharpie black:** Bold, confident, decisive
- **Never both:** Pick ONE tool per image

### Authenticity Markers
- Napkin texture visible
- Ink bleed at pressure points
- 1-2 scribbled corrections
- Quick gestural lines
- Hurried all-caps text
- Optional coffee stain

---

**Remember:** Napkin texture + gestural lines + visible corrections = Authentic napkin sketch
