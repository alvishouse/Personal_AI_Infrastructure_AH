# Da Vinci Process Flow Workflow

**Hand-drawn process visualizations using Leonardo notebook + engineering blueprint aesthetic.**

Creates **PROCESS FLOW DIAGRAMS** — Da Vinci invention-style showing steps, transformations, and sequences with visible construction geometry.

---

## Purpose

Process flows show sequences, transformations, and step-by-step progressions.

**Use this workflow for:**
- Step-by-step processes
- Data transformation pipelines
- Workflows and procedures
- Input → Output transformations
- Before/After sequences
- Manufacturing or creation flows

---

## Visual Aesthetic: Mechanical Process Diagram

**Think:** Leonardo diagramming how water flows through an aqueduct

### Core Characteristics
1. **Directional flow** — Clear start → end progression
2. **Transformation stages** — Each step as a "mechanism"
3. **Connection lines** — Hand-drawn arrows with measurement marks
4. **Stage labels** — Clear identification of each phase

---

## 🚨 MANDATORY WORKFLOW STEPS

### Step 1: Extract Process Structure

1. Identify INPUT and OUTPUT
2. List transformation STAGES (3-5 max)
3. Note what changes at each stage
4. Choose 1 stage for burnt copper emphasis

**Output:**
```
INPUT: [Starting state]
OUTPUT: [End state]

STAGES:
1. [Stage name]: [What happens]
2. [Stage name]: [What happens]
3. [Stage name]: [What happens]

EMPHASIS: Stage [N] with burnt copper (key transformation)
```

---

### Step 2: Design Flow Direction

**Layout options:**
- **Horizontal (L→R):** Standard reading flow, use 16:9
- **Vertical (T→B):** Gravity/cascade, use 9:16
- **Circular:** Cycles/loops, use 1:1
- **Branching:** Decision points, use 4:3

**Plan connectors:**
- Arrow style (thick, thin, dotted)
- Where measurement marks appear
- How stages are visually distinct

---

### Step 3: Construct Prompt

```
Process flow diagram in Leonardo da Vinci notebook style 
on warm parchment background (#ECE6D9).

PROCESS: [Name of process being shown]
DIRECTION: [Left to right / Top to bottom / Circular]

STAGES TO DRAW:

STAGE 1 - INPUT: [Description]
- Draw as: [Container, object, or mechanism shape]
- Position: [Left/Top start]
- Slate blue ink, hand-drawn

STAGE 2 - [NAME]: [Description]
- Draw as: [Transformation mechanism]
- Connection from Stage 1: Hand-drawn arrow with measurement ticks

STAGE 3 - [NAME]: [Description]
- Draw as: [Mechanism/container]
- Highlight: Burnt copper (#CF5828) accent (key stage)

STAGE 4 - OUTPUT: [Description]
- Draw as: [Final form]
- Position: [Right/Bottom end]

CONNECTORS:
- Hand-drawn arrows between stages
- Variable line weight (thicker at connections)
- Small measurement marks on arrow shafts
- Muted steel gray (#7A8C9B) for secondary lines

AESTHETIC:
- Deep slate blue (#3B546B) primary ink
- Visible construction circles at stage boundaries
- Ghost lines suggesting flow direction
- Cross-hatching for any depth (NO gradients)
- Hand-lettered stage labels

ANNOTATIONS:
- Stage names as hand-lettered labels
- Small notes at key transformations
- Proportion marks near complex stages

CRITICAL:
- Hand-drawn imperfect lines
- Visible thinking/construction
- Looks like Leonardo explaining a mechanism
- Paper grain texture
- Flow direction immediately clear
```

---

### Step 4: Execute Generation

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio [16:9 for horizontal, 9:16 for vertical, 1:1 for circular] \
  --output /path/to/process.png
```

---

### Step 5: Validation (MANDATORY)

**Must Have:**
- [ ] Warm parchment background
- [ ] Clear flow direction
- [ ] Distinct stages (3-5 max)
- [ ] Hand-drawn connectors
- [ ] Construction geometry visible
- [ ] Burnt copper on key stage
- [ ] Readable labels

**Must NOT Have:**
- [ ] Confusing flow direction
- [ ] Too many stages (overcrowded)
- [ ] Clean vector lines
- [ ] Digital gradients
- [ ] Corporate flowchart look

---

## Quick Reference

### Aspect Ratio Decision

| Flow Type | Ratio | Why |
|-----------|-------|-----|
| Horizontal L→R | 16:9 | Natural reading flow |
| Vertical T→B | 9:16 | Gravity, cascade |
| Circular/loop | 1:1 | No start/end bias |
| Branching | 4:3 | Room for splits |

### The Test
> *"Does the flow direction feel natural and mechanically sound?"*

If yes → done. If confusing → simplify stages or adjust layout.
