# Da Vinci Maps Workflow

**Hand-drawn conceptual maps using Leonardo notebook aesthetic.**

Creates **CONCEPTUAL MAPS** — idea territories and landscapes.

---

## Purpose

Conceptual maps show:
- Idea territories
- Landscape of a field
- Relationship spaces
- Conceptual geography
- Knowledge domains

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Territory Structure

```
MAP TITLE: [Domain/Space name]

REGIONS:
1. [Territory A]: [What belongs here]
2. [Territory B]: [What belongs here]
3. [Territory C]: [What belongs here]

BOUNDARIES: [What separates regions]
CONNECTIONS: [What flows between]
```

---

### Step 2: Construct Prompt

```
Conceptual map in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

MAP: [Title — the conceptual space]

CARTOGRAPHIC STYLE:
- Hand-drawn like an explorer's map
- Regions as territories with organic boundaries
- Labels as place names
- Legend or key elements

TERRITORIES:

Region 1: [Name]
- Position: [Location on map]
- Visual: [How to represent — hills, forest, plains?]
- Contents: [Key concepts within]

Region 2: [Name]
- Position: [Adjacent to Region 1]
- Visual: [Terrain style]
- Boundary: [What separates from Region 1]

Region 3: [Name]
- Position: [Location]
- Visual: [Terrain style]
- Highlight: Burnt copper (#CF5828) — key territory

CONNECTIONS:
- Rivers/paths between regions
- Hand-drawn flow lines
- Labels for connections

VISUAL STYLE:
- Deep slate blue (#3B546B) linework
- Sketchy terrain textures (cross-hatching)
- Hand-lettered region names
- Compass rose or orientation element

CONSTRUCTION:
- Grid underlying map (faint)
- Scale indicators
- Border with measurement marks
- Ghost exploration lines

CRITICAL:
- Feels like Leonardo mapping a new land
- Hand-drawn cartographic style
- Conceptual not geographic
- Notebook aesthetic
```

---

### Step 3: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 4:3 \
  --output /path/to/map.png
```

---

### Step 4: Validation

**Must Have:**
- [ ] Clear region territories
- [ ] Readable region names
- [ ] Hand-drawn boundaries
- [ ] Cartographic feel
- [ ] Construction elements

**Must NOT Have:**
- [ ] Geographic literalness
- [ ] Clean vector boundaries
- [ ] Modern infographic style
