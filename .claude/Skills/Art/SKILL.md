---
name: art
description: |
  Complete visual content system for PAI.
  Tron-meets-Excalidraw aesthetic - dark backgrounds, neon accents, hand-drawn sketch style.

# Skill Triggers
triggers:
  - USE WHEN user wants to create visual content, illustrations, or diagrams
  - USE WHEN user mentions art, header images, visualizations, or any visual request
  - USE WHEN user references mermaid, flowchart, technical diagram, or infographic

# Workflow Routing
workflows:
  - USE WHEN user wants blog header or editorial illustration: workflows/workflow.md
  - USE WHEN user wants visualization or is unsure which format: workflows/visualize.md
  - USE WHEN user wants to generate image for LinkedIn post OR needs scroll-stopping social image from post text: workflows/LinkedInPosts.md
  - USE WHEN user wants to generate prompt from reference image: workflows/prompt-from-image.md
  - USE WHEN user wants creative image variations OR different poses/scenes of same concept: workflows/ImageVariations.md
  - USE WHEN user wants to resize image for social media OR export to multiple sizes: workflows/ImageResize.md
  - USE WHEN user wants mermaid flowchart or sequence diagram: workflows/mermaid.md
  - USE WHEN user wants technical or architecture diagram: workflows/technical-diagrams.md
  - USE WHEN user wants taxonomy or classification grid: workflows/taxonomies.md
  - USE WHEN user wants timeline or chronological progression: workflows/timelines.md
  - USE WHEN user wants framework or 2x2 matrix: workflows/frameworks.md
  - USE WHEN user wants comparison or X vs Y: workflows/comparisons.md
  - USE WHEN user wants annotated screenshot: workflows/annotated-screenshots.md
  - USE WHEN user wants recipe card or step-by-step: workflows/recipe-cards.md
  - USE WHEN user wants aphorism or quote card: workflows/aphorisms.md
  - USE WHEN user wants conceptual map or territory: workflows/maps.md
  - USE WHEN user wants stat card or big number visual: workflows/stats.md
  - USE WHEN user wants comic or sequential panels: workflows/comics.md
---

# Art Skill

Complete visual content system with multiple professional illustration styles.

---

## Available Illustration Styles

PAI supports **four distinct illustration styles**, each optimized for different content contexts:

| Style | Best For | Authority Level | Speed |
|-------|----------|-----------------|-------|
| **Modern Alchemist** | Professional thought leadership | High | Planned |
| **Da Vinci** | Timeless technical depth | Very High | Study |
| **Excalidraw** | Collaborative explanations | Medium | Quick |
| **Napkin** | Authentic strategic insights | Vulnerable | Very Fast |

**Full style guide:** `STYLES.md`
**Individual style docs:** `styles/[StyleName].md`

### Quick Style Selection

- **Need professional corporate authority?** → Modern Alchemist
- **Need timeless intellectual gravitas?** → Da Vinci
- **Need approachable team collaboration?** → Excalidraw
- **Need authentic origin story vulnerability?** → Napkin

---

## Core Aesthetic (Default PAI Style)

**Tron-meets-Excalidraw** - Digital warmth combining:
- Hand-drawn Excalidraw-style sketch lines (NOT clean vectors)
- Dark slate backgrounds for modern contrast
- Neon orange (warmth) + cyan (tech) accents
- Subtle glows on key elements

**Full aesthetic documentation:** `${PAI_DIR}/Skills/CORE/aesthetic.md`

**This is the SINGLE SOURCE OF TRUTH for default PAI visual styling.**

---

## Workflow Routing

| Content Type | Workflow | Supports Styles |
|--------------|----------|-----------------|
| **LinkedIn post images** | `workflows/LinkedInPosts.md` | **Wound-first (gritty/textured)** |
| Blog headers / Editorial | `workflows/workflow.md` | All 4 styles |
| Adaptive orchestrator | `workflows/visualize.md` | All 4 styles |
| **Prompt from reference image** | `workflows/prompt-from-image.md` | **All 4 styles** |
| **Creative variations (poses/scenes)** | `workflows/ImageVariations.md` | **Preserves source style** |
| **Resize for social media** | `workflows/ImageResize.md` | N/A (sizing only) |
| Flowcharts / Sequences | `workflows/mermaid.md` | Default PAI |
| Architecture diagrams | `workflows/technical-diagrams.md` | Default PAI |
| Classification grids | `workflows/taxonomies.md` | Default PAI |
| Chronological | `workflows/timelines.md` | Default PAI |
| 2x2 matrices | `workflows/frameworks.md` | Default PAI |
| X vs Y | `workflows/comparisons.md` | Default PAI |
| Screenshot markup | `workflows/annotated-screenshots.md` | Default PAI |
| Step-by-step | `workflows/recipe-cards.md` | Default PAI |
| Quote cards | `workflows/aphorisms.md` | Default PAI |
| Idea territories | `workflows/maps.md` | Default PAI |
| Big numbers | `workflows/stats.md` | Default PAI |
| Sequential panels | `workflows/comics.md` | Default PAI |

**Note:** The **PromptFromImage** workflow supports generating prompts in all four illustration styles (Modern Alchemist, Da Vinci, Excalidraw, Napkin). Other workflows use the default PAI Tron-meets-Excalidraw aesthetic.

---

## Style Templates

**Reusable prompt templates for consistent visuals across any content:**

### 1. Create from Scratch
- **Template:** `templates/ModernAlchemist_Template.txt`
- **Purpose:** Build new images with custom content
- **Usage:** Copy template → Fill placeholders → Generate
- **Example:** `templates/EXAMPLE_USAGE.md`

### 2. Convert Reference Images
- **Template:** `templates/ModernAlchemist_FromReferenceImage.txt`
- **Purpose:** Transform existing images to Modern Alchemist style
- **Usage:** "analyze [image] and generate prompt using modern alchemist style"
- **Examples:** `templates/REFERENCE_IMAGE_EXAMPLES.md`
- **Preserves:** Concept, composition, message
- **Transforms:** Background, colors, lines, typography to Modern Alchemist

**Quick commands:**
```bash
# Create from scratch
Copy templates/ModernAlchemist_Template.txt, fill [placeholders], generate

# Convert reference image
"analyze this image and generate a prompt using the modern alchemist style"
```

**Template documentation:** `templates/README.md`

---

## Image Generation

**Default model:** nano-banana-pro (Gemini 3 Pro)

```bash
bun run ${PAI_DIR}/Skills/art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/output.png
```

### Alternative Models

| Model | When to Use |
|-------|-------------|
| **flux** | Maximum quality |
| **gpt-image-1** | Different interpretation |

**API keys in:** `${PAI_DIR}/.env`
- `REPLICATE_API_TOKEN` - Flux and Nano Banana
- `OPENAI_API_KEY` - GPT-image-1
- `GOOGLE_API_KEY` - Nano Banana Pro
- `REMOVEBG_API_KEY` - Background removal

---

## Quick Decision Tree

```
What does user need?

├─ Unsure which approach? → VISUALIZE (analyzes & orchestrates)
├─ Generate prompt from reference image? → Prompt From Image
├─ Creative variations (different poses/scenes)? → Image Variations
├─ Resize one image for multiple platforms? → Image Resize
├─ Flowchart/sequence/state diagram? → MERMAID
├─ Abstract metaphor for article? → Editorial (workflow.md)
├─ System/architecture with labels? → Technical Diagram
├─ Categories in grid? → Taxonomy
├─ Change over time? → Timeline
├─ 2x2 matrix or mental model? → Framework
├─ Side-by-side contrast? → Comparison
├─ Markup existing screenshot? → Annotated Screenshot
├─ Step-by-step process? → Recipe Card
├─ Quote as social visual? → Aphorism
├─ Idea territories as map? → Conceptual Map
├─ Single striking number? → Stat Card
└─ Multi-panel story? → Comic
```

---

**For complete visual styling rules, ALWAYS read:** `${PAI_DIR}/Skills/CORE/aesthetic.md`
