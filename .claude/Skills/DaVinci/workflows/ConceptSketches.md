# Da Vinci Concept Sketch Workflow

**Hand-drawn conceptual illustrations for abstract ideas using Leonardo notebook aesthetic.**

Creates **CONCEPTUAL EXPLORATION SKETCHES** — Da Vinci invention-style with visible thinking process, metaphorical elements, and geometric scaffolding.

---

## Purpose

Concept sketches visualize abstract ideas, mental models, and conceptual frameworks.

**Use this workflow for:**
- Abstract concept explanations
- Mental model visualizations
- Theoretical frameworks
- Big-picture thinking
- Metaphorical illustrations
- Idea exploration

---

## Visual Aesthetic: Inventor's Thinking Page

**Think:** The page where Leonardo worked out a new idea

### What Makes It Different from System Diagrams
- **More exploratory** — Multiple angles, partial ideas
- **More metaphorical** — Objects represent concepts
- **More "unfinished"** — Thinking visible, not polished
- **Central hero element** — One main concept visualization

---

## 🚨 MANDATORY WORKFLOW STEPS

### Step 1: Extract Core Concept

1. Identify the ONE key idea to visualize
2. Find a physical/mechanical metaphor
3. Plan supporting elements (max 3-5 annotations)

**Output:**
```
CORE CONCEPT: [The idea in one sentence]

METAPHOR: [Physical representation]
Example: "Knowledge building" → Gears interlocking
Example: "Emergence" → Small parts forming whole

SUPPORTING ELEMENTS:
- [Annotation 1]
- [Annotation 2]
```

**Metaphor Test:** Can you picture this as a physical mechanism or object?

---

### Step 2: Design Composition

**Central hero:** The main metaphorical element
**Orbiting elements:** Annotations and supporting sketches
**Construction visible:** Circles, guides, proportion marks

Layout approach:
- Hero element at center or slightly offset
- Annotations orbit naturally
- Ghost lines connect thinking
- White space = thinking space

---

### Step 3: Construct Prompt

```
Conceptual illustration in Leonardo da Vinci notebook style 
on warm parchment background (#ECE6D9).

CONCEPT: [The idea being visualized]

CENTRAL ELEMENT:
[Describe the hero metaphor — a mechanism, object, or scene]
Draw with deep slate blue (#3B546B) ink
Visible construction geometry around it — guide circles, proportion marks
The element should look like Leonardo was working out how it functions

SUPPORTING SKETCHES:
- [Small annotation sketch 1]
- [Small annotation sketch 2]
- Connected to central element with light construction lines

AESTHETIC:
- Hand-drawn imperfect strokes in slate blue ink
- Multiple overlapping construction lines
- Measurement ticks and ratio indicators
- Cross-hatching for any shadows (NO gradients)
- Variable line weight — thicker at key points
- Some lines "unfinished" — thinking in progress

ANNOTATIONS:
- Hand-lettered labels (Montserrat style)
- Small notes explaining connections
- Measurement marks near proportional elements

COLOR:
- Primary: Deep slate blue (#3B546B)
- Construction: Muted steel gray (#7A8C9B)
- Accent: Burnt copper (#CF5828) ONLY on the focal point (sparingly)

COMPOSITION:
- Central hero element with annotations orbiting
- 40% negative space (thinking space)
- Asymmetrical but balanced
- Feels like a page of discovery

CRITICAL:
- Exploratory, thinking-on-paper energy
- NOT a finished polished diagram
- Should feel like Leonardo puzzling through an idea
- Paper grain texture visible
```

---

### Step 4: Execute Generation

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/concept.png
```

**Default: 1:1 square** — Best for conceptual exploration

---

### Step 5: Validation (MANDATORY)

**Must Have:**
- [ ] Warm parchment background
- [ ] Hand-drawn exploratory quality
- [ ] Central hero metaphor
- [ ] Visible construction geometry
- [ ] Cross-hatching only
- [ ] Burnt copper sparingly
- [ ] Feels like discovery/exploration

**Must NOT Have:**
- [ ] Finished/polished look
- [ ] Clean vectors
- [ ] Digital gradients
- [ ] Neon or glow
- [ ] Corporate infographic style

---

## Quick Reference

### Concept → Metaphor Examples

| Abstract Concept | Physical Metaphor |
|------------------|-------------------|
| Emergence | Parts assembling into whole |
| Systems thinking | Interlocking gears/mechanisms |
| Knowledge growth | Root systems, branching trees |
| Transformation | Metamorphosis mechanism |
| Balance | Counterweights, pulleys |
| Flow | Channels, aqueducts |
| Structure | Anatomical skeleton, framework |

### The Test
> *"Does this feel like Leonardo working out a new idea?"*

If yes → done. If too finished → make it more exploratory.
