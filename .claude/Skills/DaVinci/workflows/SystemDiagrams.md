# Da Vinci System Diagram Workflow

**Hand-drawn invention sketches for technical systems using Leonardo notebook + engineering blueprint aesthetic.**

Creates **TECHNICAL ARCHITECTURE DIAGRAMS** — Da Vinci invention-style with visible construction geometry, measurement marks, and cross-hatching.

---

## Purpose

System diagrams explain architectures, mechanisms, and flows using the Da Vinci aesthetic.

**Use this workflow for:**
- System architecture diagrams
- Process flows and pipelines
- Component relationships
- Technical explainers
- Infrastructure maps
- Mechanism breakdowns

---

## Visual Aesthetic: Leonardo Notebook Engineering

**Think:** Inventor's notebook, not corporate diagram

### Core Characteristics
1. **Visible construction geometry** — Guide circles, measurement ticks, "ghost lines"
2. **Hand-drawn imperfection** — Lines wobble, boxes are slightly off
3. **Variable line weight** — Pressure points have thicker lines
4. **Cross-hatching only** — No gradients, no shading
5. **Annotations encouraged** — Labels, notes, proportion marks
6. **Burnt copper sparingly** — ≤10% accent on key elements

### Color System

| Role | Hex | Usage |
|------|-----|-------|
| Background | `#ECE6D9` | Warm parchment |
| Primary Ink | `#3B546B` | All structure, text, lines |
| Secondary | `#7A8C9B` | Construction lines, guides |
| Accent | `#CF5828` | Key components, arrows |

**Ratio:** 70% background / 20% ink / ≤10% accent

---

## 🚨 MANDATORY WORKFLOW STEPS

### Step 1: Extract Technical Structure

1. Identify the system being explained
2. List components and their roles
3. Map relationships and flows
4. Choose 1-3 elements for burnt copper emphasis

**Output:**
```
COMPONENTS:
- [Name]: [Role]
- [Name]: [Role]

RELATIONSHIPS:
- [How they connect]

EMPHASIS (burnt copper):
- [Key element to highlight]
```

---

### Step 2: Design Diagram Structure

**Layout types:**
- Horizontal flow (left → right)
- Vertical flow (top → bottom)
- Hub-and-spoke (centered mechanism)
- Layered stack (architectural)

**Plan construction geometry:**
- What guide circles/lines should be visible
- Where measurement ticks make sense
- How to show "thinking process"

---

### Step 3: Construct Prompt

```
Technical illustration in Leonardo da Vinci notebook style 
on warm parchment background (#ECE6D9).

SYSTEM: [What you're diagramming]

STYLE:
- Hand-drawn engineering sketch in deep slate blue (#3B546B)
- Visible construction geometry — guide circles, measurement ticks
- Ghost lines showing the thinking process
- Variable line weight, imperfect strokes
- Cross-hatching for any shading

COMPONENTS TO DRAW:
- [Component 1]: [Description, position]
- [Component 2]: [Description, position]
- [Component 3]: [If burnt copper accent, note here]

CONNECTIONS:
- [How components connect with arrows/lines]
- Connection lines in muted steel gray (#7A8C9B)

ANNOTATIONS:
- Hand-lettered labels in Montserrat style (clean, modern)
- Proportion marks near complex elements
- Small annotation notes where helpful

COLOR:
- Deep slate blue (#3B546B) for all primary linework
- Muted steel gray (#7A8C9B) for construction lines/guides
- Burnt copper (#CF5828) ONLY on [key element] — sparingly

CRITICAL:
- Hand-drawn imperfect quality (NOT clean vectors)
- Visible construction geometry (ghost lines, circles, guides)
- Cross-hatching only, NO gradients
- Should feel like a page from Leonardo's notebook
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
  --output /path/to/diagram.png
```

**Aspect Ratio Guide:**

| Diagram Type | Ratio |
|--------------|-------|
| Horizontal flow | 16:9 |
| Vertical flow | 9:16 |
| Centered/hub | 1:1 |
| Complex system | 4:3 |

---

### Step 5: Validation (MANDATORY)

**Must Have:**
- [ ] Warm parchment background
- [ ] Hand-drawn imperfect lines
- [ ] Visible construction geometry
- [ ] Cross-hatching only (no gradients)
- [ ] Burnt copper used sparingly
- [ ] Labels readable
- [ ] Looks like Leonardo notebook page

**Must NOT Have:**
- [ ] Clean vector lines
- [ ] Digital gradients
- [ ] Neon colors or glow
- [ ] Perfect symmetry
- [ ] Corporate polish

**If validation fails → regenerate with stronger emphasis on failed criteria.**

---

## Quick Reference

### The Da Vinci Diagram Formula
```
1. Extract structure → components, relationships
2. Design layout → geometry, emphasis points
3. Construct prompt → Da Vinci aesthetic applied
4. Generate → nano-banana-pro with correct aspect
5. Validate → notebook feel test
6. Regenerate if needed
```

### The Test
> *"Does this look like it came from Leonardo's workshop?"*

If yes → done. If it looks AI-generated → add more imperfection.
