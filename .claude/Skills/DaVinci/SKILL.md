---
name: davinci
description: |
  Visual content system for Da Vinci notebook aesthetic.
  Leonardo invention sketches + vintage engineering blueprints + hand-drawn infographics.
  Warm parchment, slate blue ink, burnt copper accents.

# Skill Triggers
triggers:
  - USE WHEN user wants Leonardo da Vinci style illustrations
  - USE WHEN user mentions notebook sketches, invention drawings, or engineering blueprints
  - USE WHEN user wants hand-drawn technical diagrams with vintage aesthetic
  - USE WHEN user references parchment, blueprint, or patent drawing style

# Workflow Routing  
workflows:
  - USE WHEN user wants blog header or editorial illustration: workflows/Workflow.md
  - USE WHEN user is unsure which format to use: workflows/Visualize.md
  - USE WHEN user wants flowchart or sequence diagram: workflows/Mermaid.md
  - USE WHEN user wants system architecture or technical diagram: workflows/SystemDiagrams.md
  - USE WHEN user wants classification grid or taxonomy: workflows/Taxonomies.md
  - USE WHEN user wants timeline or chronology: workflows/Timelines.md
  - USE WHEN user wants 2x2 matrix or framework: workflows/Frameworks.md
  - USE WHEN user wants side-by-side comparison: workflows/Comparisons.md
  - USE WHEN user wants annotated screenshot: workflows/AnnotatedScreenshots.md
  - USE WHEN user wants step-by-step recipe card: workflows/RecipeCards.md
  - USE WHEN user wants quote card or aphorism: workflows/Aphorisms.md
  - USE WHEN user wants conceptual map: workflows/Maps.md
  - USE WHEN user wants stat card with big number: workflows/Stats.md
  - USE WHEN user wants comic or sequential panels: workflows/Comics.md
  - USE WHEN user wants abstract concept visualization: workflows/ConceptSketches.md
  - USE WHEN user wants process flow: workflows/ProcessFlows.md
---

# Da Vinci Art Skill

Visual content system using the **Da Vinci Notebook Aesthetic**.

*"Human ingenuity, sketched before it's automated."*

---

## Core Aesthetic

**Leonardo-meets-Engineering** — Intellectual warmth combining:
- Leonardo da Vinci invention notebook energy
- Vintage engineering/blueprint draftsmanship
- Hand-drawn infographic clarity
- Visible construction geometry and thinking process

**Full aesthetic documentation:** `Aesthetic.md`

**This is the SINGLE SOURCE OF TRUTH for all visual styling.**

---

## 14 Available Workflows

| What You Want | Workflow |
|---------------|----------|
| Blog header or editorial illustration | `workflows/Workflow.md` |
| Not sure which format to use | `workflows/Visualize.md` (analyzes & picks) |
| Flowchart or sequence diagram | `workflows/Mermaid.md` |
| Architecture or technical diagram | `workflows/SystemDiagrams.md` |
| Classification grid or taxonomy | `workflows/Taxonomies.md` |
| Timeline or chronology | `workflows/Timelines.md` |
| 2x2 matrix or framework | `workflows/Frameworks.md` |
| Side-by-side comparison | `workflows/Comparisons.md` |
| Annotated screenshot | `workflows/AnnotatedScreenshots.md` |
| Step-by-step recipe card | `workflows/RecipeCards.md` |
| Quote card or aphorism | `workflows/Aphorisms.md` |
| Conceptual map | `workflows/Maps.md` |
| Stat card with big number | `workflows/Stats.md` |
| Comic or sequential panels | `workflows/Comics.md` |
| Abstract concept | `workflows/ConceptSketches.md` |
| Process flow | `workflows/ProcessFlows.md` |

---

## Color Quick Reference

| Role | Color | Hex | Proportion |
|------|-------|-----|------------|
| Background | Warm Parchment | `#ECE6D9` | ~70% |
| Primary Ink | Deep Slate Blue | `#3B546B` | ~20% |
| Secondary | Muted Steel Gray | `#7A8C9B` | Variable |
| Accent | Burnt Copper | `#CF5828` | ≤10% |

---

## Style Checklist

Before generating any visual, confirm:

- [ ] Warm parchment background (`#ECE6D9`)
- [ ] Hand-drawn imperfect lines (NOT vectors)
- [ ] Visible construction geometry (ghost lines, circles, guides)
- [ ] Cross-hatching for shading (NO gradients)
- [ ] Measurement marks and proportion indicators
- [ ] Burnt copper accents used sparingly
- [ ] Central hero concept with orbiting annotations
- [ ] Generous thinking space

---

## Quick Decision Tree

```
What does user need?

├─ Technical system diagram? → Central mechanism + construction lines
├─ Data/process flow? → Hand-drawn arrows with measurement marks
├─ Concept explanation? → Leonardo notebook exploration style
├─ Architecture overview? → Blueprint aesthetic with annotations
├─ Comparison/contrast? → Split composition with shared construction
└─ Abstract metaphor? → Invention sketch with geometric scaffolding
```

---

## Generation Workflow

### Step 1: Read Aesthetic
Always read `Aesthetic.md` before generating any image.

### Step 2: Build Prompt
Use this template structure:

```
Technical illustration in Leonardo da Vinci notebook style 
on warm parchment background (#ECE6D9).

STYLE: Hand-drawn engineering sketch with visible construction lines.
Imperfect ink strokes in deep slate blue (#3B546B). Variable line weight.
Visible measurement marks, overlapping guide circles, geometric scaffolding.
Cross-hatching for any shading. Subtle paper grain texture.

COMPOSITION:
[Central hero element]
[3-5 annotations]
[Construction geometry visible]

ACCENTS:
- Burnt copper (#CF5828) sparingly on key elements
- Steel gray (#7A8C9B) for secondary guides

CRITICAL:
- Hand-drawn imperfect quality (NOT clean vectors)
- Visible construction lines and geometry  
- Cross-hatching only, NO gradients
- Should feel like a page from an inventor's notebook
```

### Step 3: Validate Output
Ask: *"Does this look like it came from an inventor's notebook?"*

If it looks AI-generated → regenerate with more imperfection.

---

## Anti-Patterns (Never Do)

❌ Neon colors or glow effects
❌ Perfect symmetry
❌ Clean vector lines
❌ Digital gradients
❌ Corporate polish
❌ Futuristic/Web3 aesthetic
❌ Overcrowded compositions

---

**For complete visual styling rules, ALWAYS read:** `Aesthetic.md`
