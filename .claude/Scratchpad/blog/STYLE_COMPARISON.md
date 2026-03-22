# Visual Style Comparison

Three distinct aesthetic options for blog imagery.

---

## 1. Da Vinci Notebook Style
**Location:** `~/.claude/Skills/DaVinci/`

### Visual Characteristics:
- Warm parchment background (#ECE6D9)
- Deep slate blue ink (#3B546B)
- Burnt copper accents (#CF5828)
- Hand-drawn imperfect lines
- Visible construction geometry
- Cross-hatching for shading
- Leonardo invention sketch energy

### Best For:
- Technical concepts with intellectual depth
- Engineering/architectural subjects
- Historical or timeless content
- When you want to convey thoughtful rigor

### Example:
`amplifying_humans_header.png` - Original Da Vinci style

**Feel:** "Human ingenuity, sketched before it's automated."

---

## 2. Excalidraw Digital Whiteboard
**Location:** `~/.claude/Skills/Excalidraw/`

### Visual Characteristics:
- White background (#FFFFFF)
- Wiggly imperfect lines (deliberate jitter)
- Hatched fills (never solid colors)
- Architect print font (all-caps)
- Limited marker palette (black + blue/red)
- Lines overshoot at corners
- Digital whiteboard energy

### Best For:
- Technical diagrams and flowcharts
- System architecture
- Approachable explanations
- When you want to reduce intimidation factor

### Example:
`amplifying_humans_excalidraw.png` - Excalidraw style

**Feel:** "Digital whiteboards that feel human."

---

## 3. Napkin Sketch Analog
**Location:** `~/.claude/Skills/NapkinSketch/`

### Visual Characteristics:
- Napkin beige background (#F5F2E8)
- Visible paper texture and grain
- Ballpoint blue ink (#2C5F8D)
- Quick gestural confident lines
- All-caps hurried handwriting
- Visible corrections (scribbled out)
- Optional coffee stains

### Best For:
- Raw ideation and brainstorming
- Spontaneous concepts
- "Back of napkin" startup energy
- When you want authentic, unpolished feel

### Example:
`amplifying_humans_napkin.png` - Napkin sketch style

**Feel:** "Ideas captured in the moment, imperfections included."

---

## Quick Decision Guide

**Choose Da Vinci when:**
- Content is technical and sophisticated
- You want timeless, intellectual aesthetic
- Concept deserves deep thinking energy

**Choose Excalidraw when:**
- You need clear technical diagrams
- Want approachable, non-intimidating feel
- Modern digital whiteboard vibe fits

**Choose Napkin Sketch when:**
- Emphasizing spontaneity and ideation
- Want raw, authentic brainstorm feel
- "Startup garage" or "coffee shop" energy

---

## All Three Styles Share:

✓ Hand-drawn imperfection (not clean vectors)
✓ Abstract metaphors over literal illustrations
✓ Construction/thinking process visible
✓ Human warmth in technical concepts
✓ Consistent aesthetic language

✗ NO perfect lines or shapes
✗ NO corporate polish
✗ NO photorealism
✗ NO typed fonts

---

## Usage

All three skills have identical workflow structure:

```bash
# Generate with Da Vinci style
cd ~/.claude/Skills/Art/tools
bun run generate-ulart-image.ts \
  --model gpt-image-1 \
  --prompt "$(cat prompt.txt)" \
  --size 1536x1024 \
  --output davinci_output.png

# Same for Excalidraw or Napkin - just change the prompt
```

---

## File Locations

**Skills:**
- `/home/alvis/.claude/Skills/DaVinci/`
- `/home/alvis/.claude/Skills/Excalidraw/`
- `/home/alvis/.claude/Skills/NapkinSketch/`

**Each contains:**
- `SKILL.md` - Skill definition and triggers
- `Aesthetic.md` - Complete visual style guide
- `workflows/` - Workflow templates for different content types

**Test Images:**
- Da Vinci: `amplifying_humans_header.png`
- Excalidraw: `amplifying_humans_excalidraw.png`
- Napkin: `amplifying_humans_napkin.png`

---

**Updated:** 2026-01-26
