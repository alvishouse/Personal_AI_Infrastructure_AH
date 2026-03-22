# Art Styles Guide

PAI supports four distinct illustration styles, each optimized for different contexts and audiences. Choose the style that best matches your content's purpose and emotional tone.

**Quick Links:**
- **Style Definitions:** `styles/[StyleName].md` (detailed style documentation)
- **Reusable Templates:** `templates/ModernAlchemist_Template.txt` (universal prompt template)
- **Template Guide:** `templates/README.md` (how to use templates)

---

## Style Overview

| Style | Best For | Energy | Authority | Speed |
|-------|----------|--------|-----------|-------|
| **Modern Alchemist** | Professional content, thought leadership | Sophisticated | High | Planned |
| **Da Vinci** | Timeless concepts, technical depth | Intellectual | Very High | Study |
| **Excalidraw** | Team collaboration, explanations | Approachable | Medium | Quick |
| **Napkin** | Authentic insights, origin stories | Spontaneous | Vulnerable | Very Fast |

---

## 🎨 Modern Alchemist

**"Intellectual Blueprint"**

### Visual Identity
- Warm cream background with **faint** grid pattern (#F5F5DC)
- Clean mono-line vectors in deep charcoal (#2C2C2C)
- Muted gold/bronze accents (#C5A059) used sparingly
- Minimal grey washes for subtle depth

### Character
Leonardo da Vinci's notebook meets Silicon Valley. Vintage engineering schematics updated with modern corporate polish. Patent illustration precision without cold sterility.

### When to Use
- Professional blog posts and articles
- Strategic frameworks for business audiences
- Thought leadership content
- Corporate presentations requiring sophistication
- Content that demands both depth and accessibility

### Key Characteristics
- **Grid:** FAINT technical grid (barely visible, not strong)
- **Lines:** Uniform weight mono-line vectors (modern readability)
- **Precision:** Clean digital precision with analog warmth
- **Typography:** Bold serif headings + clean sans-serif body
- **Subject:** Varies by context (metaphorical objects, frameworks, figures)

### Emotional Tone
Professional, sophisticated, intellectually authoritative, timeless without being dated.

**Style File:** `styles/ModernAlchemist.md`
**Template:** `templates/ModernAlchemist_Template.txt` (reusable prompt template)

---

## 📜 Da Vinci

**"Renaissance Notebook"**

### Visual Identity
- Aged parchment background (#ECE6D9)
- Deep slate blue primary ink (#3B546B)
- Burnt copper accents (#CF5828)
- Cross-hatching for ALL shading (no solid fills)

### Character
Leonardo da Vinci's actual technical notebooks. Hand-drawn studies with visible construction geometry, multiple overlapping strokes, and intellectual annotations. Renaissance genius documenting mechanical systems.

### When to Use
- Content requiring timeless intellectual gravitas
- Historical or philosophical depth
- Complex systems thinking visualization
- Technical concepts with centuries of wisdom
- Bridging past and future perspectives

### Key Characteristics
- **Texture:** Visible parchment grain throughout
- **Lines:** Variable weight showing hand-drawn quality
- **Shading:** Cross-hatching exclusively (NEVER solid fills)
- **Construction:** Compass marks and guide lines visible
- **Typography:** Leonardo's italic technical script

### Emotional Tone
Timeless wisdom, intellectual depth, Renaissance genius, centuries of authority.

**Style File:** `styles/DaVinci.md`

---

## ✏️ Excalidraw

**"Digital Whiteboard"**

### Visual Identity
- Clean white background (#FFFFFF)
- Wiggly imperfect lines in black (#1E1E1E)
- Strategic color accents (blue #3B82F6, red #DC2626, etc.)
- Hatched diagonal fills (never solid)

### Character
Digital whiteboard collaboration tool (Excalidraw.com). Hand-drawn with mouse/tablet quality. Modern, approachable, team-oriented energy. Perfect for explaining concepts in collaborative contexts.

### When to Use
- Team collaboration and brainstorming
- Educational or explanatory content
- Modern approachable professional material
- Digital-native audiences
- Concepts benefiting from informal clarity

### Key Characteristics
- **Lines:** Wiggly imperfect (NOT straight vectors)
- **Corners:** Overshoot slightly, don't connect perfectly
- **Circles:** Overlapping spirals (not perfect)
- **Fills:** Hatched diagonal lines only
- **Typography:** All-caps architect font

### Emotional Tone
Collaborative, approachable, modern, team-oriented, unpretentious.

**Style File:** `styles/Excalidraw.md`

---

## ☕ Napkin

**"Back of Napkin Sketch"**

### Visual Identity
- Napkin beige textured background (#F5F2E8)
- Single ballpoint blue pen only (#2C5F8D)
- Hurried all-caps handwriting
- Visible corrections (scribbled out, not erased)

### Character
Spontaneous strategic insight captured on paper napkin during a strategy session. Drawn in 2-4 minutes with single ballpoint pen. Raw, authentic, vulnerable thinking process visible. The "aha moment" sketch. CLEAN napkin — no coffee stains, no ring marks, no liquid stains of any kind.

### When to Use
- Authentic strategic storytelling
- Origin story moments ("here's where the breakthrough happened")
- Vulnerable, unpolished thinking process
- Startup/entrepreneurial contexts
- Social media showing real work
- Email: "I sketched this on a napkin..."

### Key Characteristics
- **Single Tool Rule:** ONLY ballpoint blue (MANDATORY)
- **Speed:** 2-4 minutes execution (visible in strokes)
- **Corrections:** 1-2 visible scribbled-out mistakes (REQUIRED)
- **Energy:** Gestural, spontaneous, fast
- **Typography:** Hurried handwriting with abbreviations

### Emotional Tone
Authentic, vulnerable, spontaneous, entrepreneurial, "garage startup" energy.

**Style File:** `styles/Napkin.md`

---

## Decision Framework

### Choose by Purpose

**Need professional authority?** → **Modern Alchemist**
- Clean, sophisticated, corporate-ready
- Silicon Valley meets vintage engineering

**Need timeless intellectual depth?** → **Da Vinci**
- Centuries of wisdom and authority
- Renaissance genius quality

**Need approachable collaboration?** → **Excalidraw**
- Team whiteboard energy
- Modern, friendly, clear

**Need authentic vulnerability?** → **Napkin**
- Raw strategic insight
- "Here's how it happened" energy

### Choose by Audience

**C-Suite / Corporate:** Modern Alchemist or Da Vinci
**Practitioners / Teams:** Excalidraw
**Entrepreneurs / Startups:** Napkin
**Academic / Intellectual:** Da Vinci
**General Professional:** Modern Alchemist or Excalidraw

### Choose by Speed

**Planned Content:** Modern Alchemist or Da Vinci
**Quick Collaboration:** Excalidraw
**Spontaneous Insight:** Napkin

---

## Style Comparison Matrix

| Feature | Modern Alchemist | Da Vinci | Excalidraw | Napkin |
|---------|------------------|----------|------------|---------|
| **Background** | Cream + faint grid | Aged parchment | White | Napkin beige |
| **Line Style** | Mono-line vectors | Variable hand-drawn | Wiggly digital | Gestural ballpoint |
| **Line Weight** | Uniform | Variable | Variable | Variable pressure |
| **Shading** | Light grey washes | Cross-hatching | Hatched fills | None (single pen) |
| **Color Palette** | 3-color restrained | 3-color warm | Multi-color strategic | Single color only |
| **Primary Color** | Deep charcoal | Slate blue | Black | Ballpoint blue |
| **Accent Color** | Muted gold | Burnt copper | Blue/red/orange | None (single pen only) |
| **Typography** | Serif + Sans | Leonardo script | Architect font | Hurried handwriting |
| **Precision** | Technical precision | Study quality | Mouse-drawn | Quick gestural |
| **Planning** | Designed | Studied | Sketched | Spontaneous |
| **Time to Create** | Planned session | Study session | 10-15 minutes | 2-4 minutes |
| **Corrections** | None visible | Exploration visible | None | Required (1-2) |
| **Authority Level** | High professional | Very high timeless | Medium collaborative | Vulnerable authentic |
| **Best For** | Corporate thought leadership | Historical/technical depth | Team collaboration | Origin stories |

---

## Color Palettes Quick Reference

### Modern Alchemist
- Background: #F5F5DC or #FAF9F6 (cream/bone)
- Primary: #2C2C2C (deep charcoal)
- Accent: #C5A059 (muted gold)
- Shading: #D3D3D3 (light grey)

### Da Vinci
- Background: #ECE6D9 (parchment)
- Primary: #3B546B (slate blue)
- Accent: #CF5828 (burnt copper)

### Excalidraw
- Background: #FFFFFF (white)
- Primary: #1E1E1E (black)
- Accent: #3B82F6 (blue), #DC2626 (red), #F97316 (orange)

### Napkin
- Background: #F5F2E8 (napkin beige) — CLEAN, no stains
- Primary: #2C5F8D (ballpoint blue) - ONLY color
- NO other colors — NO coffee stains, NO ring marks, NO liquid marks

---

## Using Styles with PromptFromImage Workflow

When running the **PromptFromImage** workflow (`workflows/prompt-from-image.md`), you can specify any of these four styles:

```bash
# Example usage
"analyze this image and generate a prompt using the [STYLE NAME] style"
```

**Available style names:**
- `da vinci` or `davinci`
- `excalidraw`
- `napkin`
- `modern alchemist` or `modernalchemist`

The workflow will:
1. Analyze the reference image
2. Map visual elements to the chosen style aesthetic
3. Generate a complete prompt ready for image generation
4. Save the prompt to your specified location

---

## Best Practices

### Consistency
- Use the same style throughout a piece of content or series
- Different styles signal different content types to your audience
- Build style associations: Napkin = origin stories, Da Vinci = deep concepts

### Mixing Styles
**Within Same Article:**
- Generally avoid mixing styles in single article
- Exception: Napkin sketch of concept → Da Vinci detailed study (showing evolution)

**Across Content Series:**
- Newsletter series: Pick one style and stick with it
- Different content types: Different styles OK
  - Blog posts: Modern Alchemist or Da Vinci
  - Social posts: Napkin or Excalidraw
  - Presentations: Modern Alchemist or Excalidraw

### Style Selection Checklist

Before choosing a style, ask:
1. **Who is my audience?** (Corporate? Entrepreneurial? Technical?)
2. **What's my goal?** (Teach? Inspire? Document insight?)
3. **What's the tone?** (Professional? Vulnerable? Collaborative?)
4. **How much time?** (Planned content? Spontaneous share?)
5. **What authority level?** (High gravitas? Approachable? Authentic?)

---

## Examples by Content Type

### Blog Post Header Images
- **Strategic frameworks:** Modern Alchemist or Da Vinci
- **Collaborative concepts:** Excalidraw
- **Origin stories:** Napkin

### Social Media
- **LinkedIn thought leadership:** Modern Alchemist
- **Twitter insight shares:** Napkin or Excalidraw
- **Technical deep dives:** Da Vinci

### Presentations
- **Corporate deck:** Modern Alchemist
- **Team workshop:** Excalidraw
- **Historical context:** Da Vinci
- **Startup pitch:** Napkin (for "origin story" moments)

### Email Newsletters
- **Professional series:** Modern Alchemist
- **Technical deep dive:** Da Vinci
- **Quick tips:** Excalidraw
- **Behind-the-scenes:** Napkin

---

## Getting Started

1. **Read the full style file** in `styles/[StyleName].md`
2. **Review the prompt template** in each style file
3. **Use PromptFromImage workflow** to generate style-specific prompts
4. **Generate images** using `generate-ulart-image` tool
5. **Build your style library** over time

---

**Each style serves a strategic purpose. Choose deliberately based on your content goals and audience expectations.**
