# Content Image References

## Overview

This document provides the image creation standards for the Content Creation Workflow, including placeholder syntax, platform sizes, art style guidelines, and the image manifest template.

---

## Image Placeholder Syntax

When drafting cornerstone content, use these placeholder formats to mark where images should appear:

### Standard Placeholder Format

```markdown
[IMAGE: description of the visual concept]
```

### Extended Placeholder Format (Recommended)

```markdown
<!-- IMAGE
Type: [featured | inline | callout | diagram]
Concept: [Description of what the image should convey]
Style: [Modern Alchemist | Da Vinci | Excalidraw | Napkin | Default PAI]
Size: [Platform size or custom dimensions]
Alt Text: [Accessibility description]
-->
```

### Examples

**Simple inline image:**
```markdown
[IMAGE: diagram showing the AI Adoption Flywheel with 4 pillars]
```

**Featured image with full specification:**
```markdown
<!-- IMAGE
Type: featured
Concept: Leader standing at crossroads, one path showing chaotic AI tools, other showing structured adoption pathway
Style: Modern Alchemist
Size: 1200x630
Alt Text: Strategic choice between chaotic and structured AI adoption
-->
```

**Framework diagram:**
```markdown
<!-- IMAGE
Type: diagram
Concept: 3-step process showing Assessment → Education → Roadmap flow
Style: Excalidraw
Size: 800x600
Alt Text: AI Readiness program flow diagram
-->
```

---

## Platform Size Reference

### WordPress Blog

| Image Type | Dimensions | Aspect Ratio | Notes |
|------------|-----------|--------------|-------|
| **Featured Image** | 1200 x 630 | 1.91:1 | Social preview optimized |
| **Full-width Inline** | 1200 x 800 | 3:2 | Large supporting visual |
| **Medium Inline** | 800 x 600 | 4:3 | Standard diagram size |
| **Small Inline** | 600 x 400 | 3:2 | Thumbnail or accent |
| **Hero Banner** | 1920 x 600 | 32:10 | Full-width header |

### LinkedIn

| Content Type | Dimensions | Aspect Ratio | Notes |
|--------------|-----------|--------------|-------|
| **Link Preview** | 1200 x 627 | 1.91:1 | Shared article thumbnail |
| **Single Image Post** | 1200 x 1200 | 1:1 | Maximum engagement |
| **Carousel Slide** | 1080 x 1080 | 1:1 | Per-slide for carousels |
| **Article Cover** | 1280 x 720 | 16:9 | LinkedIn article header |

### Substack

| Content Type | Dimensions | Aspect Ratio | Notes |
|--------------|-----------|--------------|-------|
| **Hero Image** | 1456 x 816 | 16:9 | Newsletter header |
| **Inline Image** | 600 x 338 | 16:9 | Body content |
| **Social Card** | 1200 x 630 | 1.91:1 | Preview when shared |

### Twitter/X

| Content Type | Dimensions | Aspect Ratio | Notes |
|--------------|-----------|--------------|-------|
| **Single Image** | 1600 x 900 | 16:9 | Single tweet image |
| **In-stream** | 1200 x 675 | 16:9 | Timeline display |
| **Card Image** | 1200 x 628 | 1.91:1 | Link card preview |

---

## Opening Wound Framework (All AI-Generated Images)

**This framework applies to every AI-generated image — blog featured, blog inline, newsletter hero, and LinkedIn post images.**

The goal of every image is the same regardless of platform: show the maximum pain moment (the BEFORE state), make the viewer feel something without reading any text, and leave a gap that can only be closed by reading the content.

### The Three Pillars (all images must pass all three)

| Pillar | Weight | Pass Condition |
|--------|--------|----------------|
| **Emotion — Visceral Wound** | 40% | Human/animal subject with specific physical state described; shows wound (BEFORE), not resolution (AFTER); viewer feels the emotion without text |
| **Scroll-Stopping — Visual Disruption** | 30% | Artistic medium is textured + hand-drawn (ink wash, graphite, vintage editorial, technical schematic); visually contrasts polished corporate feeds |
| **Curiosity — Intellectual Gap** | 30% | Leaves a gap between what's shown and what it means; viewer must read to understand; does not give away the solution |

### Anti-Patterns (any single one = automatic FAIL)

| ❌ Pattern | Why It Fails |
|---|---|
| Dark background + neon/electric accent colors | Known failed pattern — tested and rejected |
| "Clean minimal composition" or "professional atmosphere" | Corporate polish; feeds are already full of it |
| Abstract geometric shapes / clean vectors | No wound, no human |
| Data visualization (charts, percentages, growth curves) | Shows numbers, not feeling |
| Shows the resolution, pivot moment, or solution | Wrong state — must be pain, not fix |
| Faceless silhouettes, glowing nodes, two paths diverging | Sterile tropes |
| No human or animal subject | Fails Emotion pillar entirely |
| No expression or body language described | Subject becomes a prop, not a person |
| Napkin with coffee stains or ring marks | Models default to this — explicitly forbidden |

### Image Types

| Type | Use When | Visual |
|---|---|---|
| **A — Human Wound** | Post is about people grinding, burning out, being rejected | Human figure physically experiencing the wound |
| **B — Conceptual Mechanism** | Post explains a process or formula with a visual shape | Diagram making the mechanism visceral — gears, flows, formulas |
| **C — Comparison/Flow** | Post shows two paths, before/after, or a redirect | Side-by-side panels: old state vs. new state |
| **D — Loop/Cycle Trap** | Post describes an endless pattern or trap | Closed loop, same action repeating |
| **E — Quote Card** | Post contains a short, powerful statement that IS the image | Full-frame typographic composition — always Napkin style |

### Agent Pipeline (mandatory for all AI-generated images)

1. **LinkedInImageGenerator** (`opus`) — reads full content, finds opening wound, selects type + style, writes candidate prompt
2. **LinkedInImagePromptValidator** (`sonnet`) — scores against Three Pillars + 7 Anti-Patterns → PASS or FAIL with specific critique
3. If FAIL → generator revises → re-validate (max 2 cycles)
4. If PASS → generate with nano-banana-pro

---

## Art Style Guidelines

### When to Use Each Style

| Style | Best For | Authority Level | Content Type Match |
|-------|----------|-----------------|-------------------|
| **Modern Alchemist** | Professional thought leadership | High | Blog headers, LinkedIn articles, framework diagrams |
| **Da Vinci** | Timeless technical depth | Very High | Frameworks, deep-dive content, authority posts |
| **Excalidraw** | Collaborative explanations, mechanism diagrams | Medium | Process flows, Type B / Type C images |
| **Napkin** | Authentic strategic insights, quote cards | Vulnerable | Personal stories, Type E quote cards |

### Style Selection by Image Type

| Image Type | Primary Style | Alternative |
|---|---|---|
| **Type A — Human Wound** | Napkin (raw, gritty) or Da Vinci (timeless depth) | Modern Alchemist |
| **Type B — Conceptual Mechanism** | Excalidraw (collaborative) or Da Vinci (technical authority) | Modern Alchemist |
| **Type C — Comparison/Flow** | Excalidraw or Modern Alchemist | — |
| **Type D — Loop/Cycle Trap** | Napkin or Excalidraw | — |
| **Type E — Quote Card** | **Always Napkin** | — |

### Style Override Rules
- If image is a Quote Card (Type E) → always **Napkin**
- If image shows a formula or multiplication mechanism → **Da Vinci**
- If image is before/after comparison → **Excalidraw** or **Modern Alchemist**
- Never use the same style more than 3 times in a batch

### Art Skill Generation Commands

```bash
# Blog featured image (1200×630)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/featured.png \
  "[APPROVED PROMPT]"

# Blog inline / diagram (1080×720)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 3:2 \
  --output /path/to/inline-01.png \
  "[APPROVED PROMPT]"

# LinkedIn portrait (1080×1350)
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 4:5 \
  --output /path/to/linkedin-post.png \
  "[APPROVED PROMPT]"
```

⚠️ **nano-banana-pro saves as JPEG despite the `.png` extension.** Verify with `file /path/to/image.png` before uploading.

---

## Image Manifest Template

Use this template during Step 9 (Manual Review) to document all image requirements before creating images in Step 10.

### Image Manifest — [Workflow ID]

```markdown
# Image Manifest

**Workflow ID:** [date]-[topic-slug]
**Cornerstone Title:** [Title]
**Date Created:** YYYY-MM-DD
**Status:** [ ] Draft | [ ] Approved | [ ] In Progress | [ ] Complete

---

## Featured Image

- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Concept:** [Description of the visual concept]
- **Style:** [Modern Alchemist | Da Vinci | Excalidraw | Napkin]
- **Size:** 1200 x 630 (WordPress/Social)
- **File Path:** ./images/featured.png
- **Alt Text:** [Accessibility description]

**Prompt Notes:**
[Any specific prompt guidance or reference images]

---

## Inline Images

### Inline Image 1
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Location in Content:** [After which paragraph/section]
- **Concept:** [What this image shows]
- **Style:** [Style name]
- **Size:** 800 x 600
- **File Path:** ./images/inline-01.png
- **Alt Text:** [Description]

### Inline Image 2
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Location in Content:** [After which paragraph/section]
- **Concept:** [What this image shows]
- **Style:** [Style name]
- **Size:** 800 x 600
- **File Path:** ./images/inline-02.png
- **Alt Text:** [Description]

[Add more inline images as needed]

---

## Content Extraction Images (Step 13)

### LinkedIn Carousel
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Slide Count:** [Number]
- **Size per Slide:** 1080 x 1080
- **Style:** [Style name]
- **File Path:** ./images/extraction/linkedin-carousel/

### LinkedIn Post Image
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Size:** 1200 x 627
- **Style:** [Style name]
- **File Path:** ./images/extraction/linkedin-post.png

### Substack Hero
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Size:** 1456 x 816
- **Style:** [Style name]
- **File Path:** ./images/extraction/substack-hero.png

### Twitter Thread Header
- **Status:** [ ] Pending | [ ] In Progress | [ ] Complete
- **Size:** 1200 x 675
- **Style:** [Style name]
- **File Path:** ./images/extraction/twitter-header.png

---

## Image Generation Checklist

### Pre-Generation
- [ ] All image concepts clearly described
- [ ] Styles selected for each image
- [ ] Alt text written for accessibility
- [ ] File paths defined

### Generation
- [ ] Featured image generated
- [ ] All inline images generated
- [ ] Images reviewed for quality
- [ ] Images resized/optimized if needed

### Post-Generation
- [ ] Placeholders replaced with actual image paths
- [ ] Alt text verified in markdown
- [ ] Images properly named
- [ ] Backup copies created

---

## Notes

[Any additional notes about image requirements, changes, or decisions]
```

---

## Quick Reference: Common Image Needs

### By Cornerstone Element

| Element | Typical Image Need | Recommended Style |
|---------|-------------------|-------------------|
| **Hook** | Attention-grabbing featured image | Modern Alchemist |
| **Challenge** | Pain visualization | Excalidraw |
| **Opportunity** | Transformation visual | Modern Alchemist |
| **Expert Story** | Before/after or journey | Napkin |
| **Framework** | Process diagram | Excalidraw |
| **Case Studies** | Result visualization | Modern Alchemist |
| **Myth/Mindset** | Myth vs Reality comparison | Excalidraw |
| **Application** | Checklist or timeline | Excalidraw |
| **Close** | CTA or recap visual | Modern Alchemist |

### By Extraction Platform

| Platform | Required Images | Sizes |
|----------|----------------|-------|
| **LinkedIn Article** | 1 cover | 1280 x 720 |
| **LinkedIn Carousel** | 5-10 slides | 1080 x 1080 each |
| **LinkedIn Post** | 1 image | 1200 x 627 |
| **Substack** | 1 hero | 1456 x 816 |
| **Twitter Thread** | 1 header | 1200 x 675 |

---

*Always complete the image manifest before generating images. Know ALL your image needs before starting Step 10.*
