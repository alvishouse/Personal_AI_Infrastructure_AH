---
name: napkin
description: |
  Visual content system for Napkin Sketch aesthetic.
  Spontaneous analog sketches - napkin texture, ballpoint pen, coffee stains, gestural lines.

# Skill Triggers
triggers:
  - USE WHEN user wants napkin sketch style illustrations
  - USE WHEN user mentions analog, textural, or spontaneous sketches
  - USE WHEN user wants back-of-napkin ideation aesthetic
  - USE WHEN user references pen-on-napkin or coffee shop brainstorm style

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

# Napkin Sketch Art Skill

Visual content system using the **Napkin Sketch Aesthetic**.

*"Ideas captured in the moment, imperfections included."*

---

## Core Aesthetic

**Spontaneous Analog** — Raw ideation energy combining:
- Paper napkin or scrap paper texture (creases, grain)
- Ballpoint pen or Sharpie marker
- Quick, gestural lines drawn confidently
- Visible corrections and scratch-outs
- All-caps hurried handwriting
- Coffee stains and real-world imperfections

**Full aesthetic documentation:** `Aesthetic.md`

**This is the SINGLE SOURCE OF TRUTH for all visual styling.**

---

## Color Quick Reference

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| Background | Napkin Beige | `#F5F2E8` | Paper texture |
| Primary Ink | Ballpoint Blue | `#2C5F8D` | Main sketches |
| Alternative | Sharpie Black | `#1A1A1A` | Bold marks |
| Accent | Red Pen | `#C41E3A` | Emphasis, corrections |
| Stains | Coffee Brown | `#8B7355` | Texture, authenticity |

---

## Style Checklist

Before generating any visual, confirm:

- [ ] Visible napkin/paper texture (grain, creases)
- [ ] Ballpoint pen or marker quality
- [ ] Quick, confident gestural lines
- [ ] Circles as spirals or overlapping strokes
- [ ] All-caps handwritten labels
- [ ] Visible corrections (scratch-outs, not erased)
- [ ] Optional: coffee ring stains, smudges
- [ ] Single tool aesthetic (pen or marker, not mixed media)

---

## Quick Decision Tree

```
What does user need?

├─ Technical system diagram? → Quick ballpoint sketch on napkin
├─ Data/process flow? → Gestural arrows, hurried boxes
├─ Concept explanation? → Spontaneous brainstorm on scrap paper
├─ Architecture overview? → Back-of-envelope technical sketch
├─ Comparison/contrast? → Split napkin with pen divisions
└─ Abstract metaphor? → Coffee shop ideation sketch
```

---

## Generation Workflow

### Step 1: Read Aesthetic
Always read `Aesthetic.md` before generating any image.

### Step 2: Build Prompt
Use this template structure:

```
Spontaneous sketch on paper napkin in ballpoint pen style
on textured napkin background (#F5F2E8).

STYLE: Quick, confident sketch drawn with ballpoint pen.
Gestural lines, spontaneous ideation energy. Looks like it was
drawn during a coffee shop brainstorm on whatever paper was available.

COMPOSITION:
[Central concept]
[Quick annotations in all-caps]
[Gestural arrows and connections]

LINE QUALITY:
- Quick, confident strokes
- Circles as spirals or overlapping loops
- Bold, gestural arrows
- Lines drawn fast without hesitation
- Ink bleed at pressure points

TEXTURE:
- Visible napkin paper grain
- Creases and folds visible
- Optional: coffee ring stain
- Ink slightly bleeds into napkin fibers
- Authentic paper texture throughout

TEXT:
- All-caps hurried handwriting
- Quick, scratchy letters
- Readable but rushed
- Pen script, not typed

CORRECTIONS:
- Scribbled-out mistakes visible
- Arrows redirecting thought flow
- Layered sketches showing iteration
- Shows thinking process in real-time

COLORS:
- Ballpoint blue (#2C5F8D) primary ink
- OR Sharpie black (#1A1A1A) for bolder version
- Optional red pen (#C41E3A) for emphasis
- Coffee stain brown (#8B7355) for texture
- Napkin beige background

CRITICAL:
- Napkin texture visible throughout
- Gestural, spontaneous energy
- Single tool (pen OR marker, not both)
- Shows real-time thinking
- Imperfections are authentic, not cleaned up
```

### Step 3: Validate Output
Ask: *"Does this look like it was sketched on a napkin during a brainstorm?"*

If it looks too clean → regenerate with more texture and imperfection.

---

## Anti-Patterns (Never Do)

❌ Clean white paper background
❌ Perfect circles or straight lines
❌ Typed fonts
❌ Multiple mixed media tools
❌ Digitally cleaned up corrections
❌ Corporate polish
❌ Missing paper texture

---

**For complete visual styling rules, ALWAYS read:** `Aesthetic.md`
