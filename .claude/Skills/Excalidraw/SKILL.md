---
name: excalidraw
description: |
  Visual content system for Excalidraw aesthetic.
  Digital hand-drawn whiteboard style - wiggly lines, hatched fills, architect font.

# Skill Triggers
triggers:
  - USE WHEN user wants Excalidraw style illustrations
  - USE WHEN user mentions whiteboard, digital hand-drawn, or wiggly lines
  - USE WHEN user wants approachable technical diagrams
  - USE WHEN user references marker-style or sketchy digital aesthetic

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

# Excalidraw Art Skill

Visual content system using the **Excalidraw Aesthetic**.

*"Digital whiteboards that feel human."*

---

## Core Aesthetic

**Digital Hand-Drawn** — Approachable whiteboard energy combining:
- Wiggly, imperfect lines (deliberate jitter and variance)
- Hand-drawn shapes with corners that don't perfectly connect
- Architect print font (blocky handwriting style)
- Hatched fills instead of solid colors
- Limited marker color palette

**Full aesthetic documentation:** `Aesthetic.md`

**This is the SINGLE SOURCE OF TRUTH for all visual styling.**

---

## Color Quick Reference

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | White/Light Gray | `#FFFFFF` / `#F8F9FA` | ~80% |
| Primary Lines | Black | `#1E1E1E` | Main drawings |
| Accent 1 | Blue | `#3B82F6` | Highlights, key elements |
| Accent 2 | Red | `#EF4444` | Alerts, emphasis |
| Accent 3 | Green | `#10B981` | Success, growth |
| Secondary | Dark Gray | `#6B7280` | Supporting lines |

---

## Style Checklist

Before generating any visual, confirm:

- [ ] Wiggly, imperfect lines (NOT straight vectors)
- [ ] Hand-drawn shapes with slight overshoots
- [ ] Hatched or scribbled fills (NO solid colors)
- [ ] Architect print font for text
- [ ] Limited marker palette (black + 2-3 accent colors)
- [ ] White or light gray background
- [ ] Corners don't perfectly connect
- [ ] Lines have slight jitter

---

## Quick Decision Tree

```
What does user need?

├─ Technical system diagram? → Wiggly boxes + hatched fills
├─ Data/process flow? → Hand-drawn arrows with jitter
├─ Concept explanation? → Whiteboard exploration style
├─ Architecture overview? → Marker-style technical diagram
├─ Comparison/contrast? → Split composition with sketchy divisions
└─ Abstract metaphor? → Digital whiteboard with imperfect shapes
```

---

## Generation Workflow

### Step 1: Read Aesthetic
Always read `Aesthetic.md` before generating any image.

### Step 2: Build Prompt
Use this template structure:

```
Digital whiteboard illustration in Excalidraw style
on white background (#FFFFFF).

STYLE: Hand-drawn digital sketch with wiggly imperfect lines.
Deliberate jitter and variance in all strokes. Corners don't perfectly
connect. Hand-drawn shapes look sketched with digital pen.

COMPOSITION:
[Central element description]
[Supporting annotations]
[Wiggly connecting lines]

LINE QUALITY:
- Wiggly, imperfect strokes (NOT straight vectors)
- Lines overshoot at corners slightly
- Circles are imperfect, multiple overlapping strokes
- Variable thickness with digital pen pressure

TEXT:
- Architect print font (blocky handwriting)
- All caps for labels
- Hand-drawn letter style

FILLS:
- Cross-hatching for shading
- Scribbled fills instead of solid colors
- Diagonal line patterns for texture

COLORS:
- Black (#1E1E1E) for primary lines
- Blue (#3B82F6) for key elements
- Red (#EF4444) for emphasis (sparingly)
- White/light gray background

CRITICAL:
- Wiggly lines throughout (NOT clean vectors)
- Hatched fills only
- Digital whiteboard energy
- Approachable, non-intimidating
```

### Step 3: Validate Output
Ask: *"Does this look like an Excalidraw whiteboard sketch?"*

If it looks too polished → regenerate with more imperfection.

---

## Anti-Patterns (Never Do)

❌ Perfect straight lines
❌ Solid color fills
❌ Typed fonts
❌ Photorealistic rendering
❌ Gradients or glow effects
❌ Corporate polish
❌ More than 4 colors

---

**For complete visual styling rules, ALWAYS read:** `Aesthetic.md`
