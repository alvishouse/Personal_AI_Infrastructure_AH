# Excalidraw Visual Aesthetic System

**"Digital whiteboards that feel human."**

A visual system emulating the Excalidraw digital whiteboard tool - deliberately imperfect lines, hatched fills, and approachable technical diagrams that feel less rigid and intimidating.

---

## Core Concept: Approachable Precision

Every visualization balances **technical clarity** with **hand-drawn warmth** — the precision of digital tools with the humanity of sketched diagrams.

**The Philosophy:** *"Technical diagrams that don't intimidate."*
- Wiggly lines that reduce visual formality
- Hatched fills that add texture without clutter
- Architect font that feels crafted, not typed
- Limited color palette for focus

---

## The Excalidraw Look

### What We Want
- **Wiggly imperfect lines** — Deliberate jitter, not laser-straight
- **Hand-drawn shapes** — Corners don't perfectly connect, lines overshoot
- **Hatched fills** — Cross-hatching or scribbled texture instead of solid colors
- **Architect print font** — Blocky handwriting style (like "Excalifont")
- **Limited marker palette** — Black + 2-3 accent colors maximum
- **White/light gray background** — Clean whiteboard aesthetic

### Reference Styles
- **Excalidraw.com** — The canonical digital whiteboard tool
- **Hand-drawn wireframes** — UI mockups with sketchy quality
- **Whiteboard photography** — Marker sketches on whiteboards
- **Digital pen tablets** — Imperfect but intentional lines

### What to AVOID
❌ Perfect vector lines
❌ Solid color fills
❌ Typed fonts (Arial, Helvetica, etc.)
❌ Photorealistic rendering
❌ Gradients or glow effects
❌ More than 4-5 colors total
❌ Corporate polish

**If it looks like a Figma mockup, it's wrong.**

---

## Color System

### Background
```
White              #FFFFFF   (primary whiteboard background)
Light Gray         #F8F9FA   (subtle alternative background)
```

### Primary Lines
```
Black              #1E1E1E   (all primary drawing lines, shapes, text)
Dark Gray          #6B7280   (secondary lines, supporting elements)
```

### Accent Colors (Marker Palette)
```
Blue               #3B82F6   (highlights, key elements, emphasis)
Red                #EF4444   (alerts, warnings, critical paths)
Green              #10B981   (success, growth, positive indicators)
Yellow             #FBBF24   (caution, attention, notes)
```

### Color Usage Rules
| Color | Usage | Proportion |
|-------|-------|------------|
| White/Light Gray | Background | ~80% |
| Black | Primary lines, text | ~15% |
| Blue | Key highlights | ~3% |
| Red | Emphasis only | ~1% |
| Green | Success indicators | ~1% |

**The scarcity of color makes it powerful.**

---

## Linework & Texture Rules

This is where the style lives or dies.

### Line Quality
- **Wiggly and imperfect** — NOT straight vectors, add deliberate jitter
- **Variable thickness** — Slightly thicker at corners, thinner mid-stroke
- **Overshooting** — Lines extend slightly past connection points
- **Multiple passes** — Circles drawn as overlapping spirals

### Shape Characteristics
- **Rectangles** — Corners don't perfectly meet, slight gaps or overlaps
- **Circles** — Drawn as spirals or multiple overlapping strokes
- **Arrows** — Bold, hand-drawn with triangular heads
- **Connectors** — Wiggly lines, not straight

### Fill Patterns (Critical Element)
- **Hatched fills** — Diagonal line patterns, not solid colors
- **Scribbled texture** — Quick back-and-forth strokes for fills
- **Cross-hatching** — Perpendicular line patterns for depth
- **NO solid fills** — Ever. Always use line patterns.

### Texture
- **No paper grain** — This is digital whiteboard, not paper
- **Clean background** — White or light gray only
- **Digital pen quality** — Smooth but wiggly lines

### Absolute Rule
> **Nothing should look like it was made in Illustrator or Figma.**
> Even the imperfection should feel intentional and consistent.

---

## Typography Rules

### Font Style
**Architect Print Font** — Blocky handwriting style like "Excalifont" or "Virgil"

### Characteristics
- All-caps for labels and titles
- Hand-drawn letterforms (not typed fonts)
- Blocky, consistent character width
- Slightly irregular baseline
- Clear and readable despite imperfection

### Usage
| Context | Style | Notes |
|---------|-------|-------|
| Labels | All-caps, medium size | Clear identification |
| Annotations | All-caps, small size | Supporting text |
| Titles | All-caps, large size | Section headers |
| Body text | Avoid long paragraphs | Keep text minimal |

### Typography Rules
- Prefer labels over long text
- All-caps for clarity
- Hand-drawn appearance always
- No serif or sans-serif fonts

**Contrast Principle:**
> Hand-drawn text + hand-drawn visuals = consistency

---

## Composition Rules

### Layout Principles
1. **Central concept** — Main system or idea at center
2. **Supporting elements** — Connected boxes, circles, arrows
3. **Generous white space** — Not cluttered, breathing room

### Balance
- **Asymmetrical but stable** — Natural arrangement
- **Visual weight centered** — Primary focus clear
- **Whiteboard freedom** — Not grid-locked

### Element Limits
| Element Type | Guidelines |
|--------------|------------|
| Main shapes | 3-7 per diagram |
| Arrows/connectors | 5-12 maximum |
| Text labels | Keep concise |
| Colors | 2-3 accent colors max |

### Flow
- **Arrows guide reading** — Clear directional flow
- **Left-to-right or top-to-bottom** — Natural progression
- **Grouped elements** — Related items clustered

---

## Visual Metaphors

### How to Translate Concepts

| Concept Type | Visual Strategy | Style Notes |
|--------------|-----------------|-------------|
| System Architecture | Boxes connected with wiggly arrows | Hatched fills for emphasis |
| Data Flow | Arrows with labels, directional | Bold arrow heads |
| Process Steps | Numbered circles or boxes | Sequential left-to-right |
| Hierarchies | Tree structure with hatched nodes | Parent-child connections |
| Relationships | Network with labeled connections | Clustered groups |
| User Flows | Screen wireframes connected | Simple UI sketches |

### The Formula
```
1. Identify core concept (single clear idea)
2. Choose main shapes (boxes, circles, or custom icons)
3. Draw with wiggly black lines
4. Add hatched fills for emphasis
5. Connect with hand-drawn arrows
6. Label with all-caps text
7. Add 1-2 accent colors strategically
8. Leave generous white space
9. Verify it looks approachable, not intimidating
```

---

## AI Generation Prompting

### Positive Signals
```
"Excalidraw style"
"digital whiteboard sketch"
"hand-drawn diagram"
"wiggly imperfect lines"
"hatched fills"
"marker sketch"
"whiteboard drawing"
"architect print font"
"sketchy digital"
"deliberate jitter"
"rough sketch style"
"all-caps labels"
```

### Negative Signals
```
--no perfect lines
--no solid colors
--no typed fonts
--no gradients
--no photorealism
--no corporate polish
--no vector precision
--no symmetry
--no Figma aesthetic
```

---

## Example Prompt Template

```
Digital whiteboard illustration in Excalidraw style
on white background (#FFFFFF).

STYLE: Hand-drawn digital sketch with wiggly imperfect lines.
Deliberate jitter and variance in all strokes. Corners slightly
disconnected. Circles as overlapping spirals.

COMPOSITION:
[Describe central system/concept as boxes and shapes]
[Connecting arrows with labels]
[Supporting annotations]

LINE QUALITY:
- Wiggly, imperfect strokes (NOT straight vectors)
- Variable thickness (slightly thicker at corners)
- Lines overshoot connections slightly
- Circles drawn as multiple overlapping strokes

FILLS:
- Hatched diagonal lines for filled shapes
- Cross-hatching for emphasis
- Scribbled texture patterns
- NO solid colors

TEXT:
- All-caps architect print font
- Blocky handwritten style
- Labels on all major elements

COLORS:
- Black (#1E1E1E) for all primary lines and text
- Blue (#3B82F6) for [specific element]
- Red (#EF4444) for [emphasis element] (sparingly)
- White background

CRITICAL:
- Wiggly lines throughout (NOT clean vectors)
- Hatched fills only, never solid
- Digital whiteboard energy
- Approachable, non-intimidating
- Should look like someone sketched this on Excalidraw.com
```

---

## Quick Reference

### Color Swatches
| Role | Hex | Sample |
|------|-----|--------|
| Background | `#FFFFFF` | White |
| Lines/Text | `#1E1E1E` | Black |
| Blue Accent | `#3B82F6` | Marker Blue |
| Red Accent | `#EF4444` | Marker Red |
| Green Accent | `#10B981` | Marker Green |

### Line Rules
- Wiggly, not straight
- Overshoot at corners
- Variable thickness
- Hatched fills only

### The Test
> *"Does this look like it was drawn on Excalidraw.com?"*

If yes, it's right. If it looks like a Figma design, go more sketchy.

---

**This is the Excalidraw aesthetic: Where digital tools meet human imperfection, creating technical diagrams that feel approachable and alive.**
