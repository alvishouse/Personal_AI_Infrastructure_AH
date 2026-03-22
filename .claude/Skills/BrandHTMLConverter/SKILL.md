---
name: BrandHTMLConverter
description: |\
  Convert markdown blog content to publication-ready HTML with brand styling and aesthetic elements.
  USE WHEN user wants to convert markdown to HTML OR user mentions "styled blog post" OR user asks to "create HTML" OR user wants to "publish content" OR user wants to "apply brand styling".
  Creates intelligent visual elements: callout boxes, stat highlights, pull quotes, framework visualizations, case studies, CTA boxes.
---

# Brand HTML Converter

Convert markdown content to publication-ready, branded HTML with aesthetic visual elements.

## Core Principle

This is NOT a 1:1 markdown-to-HTML conversion. Analyze content meaning to create appropriate visual elements:

- Key insights → **Callout boxes**
- Prominent statistics → **Stat highlights**
- Memorable standalone lines → **Pull quotes**
- Attributed quotes → **Blockquotes with citations**
- Opening hook → **Lead section** (dark background)
- Frameworks/processes → **Framework visualization boxes**
- Before/after examples → **Case study boxes**
- Action items → **CTA boxes** (dark background)

## Conversion Workflow

1. Read source markdown content
2. **Determine output target**: HTML preview (standalone) OR WordPress post
3. **Analyze content for aesthetic opportunities** (see references/conversion-rules.md)
4. Load `assets/template.html` as base structure
5. Map standard elements (see references/element-mapping.md)
6. **Create aesthetic elements** based on content meaning
7. Apply brand CSS from `assets/brand-styles.css`
8. **Apply output-target rules** (see WordPress Mode below)
9. Output complete HTML file to `${PAI_DIR}/Scratchpad/blog/html/` (or user-specified location)

## WordPress Output Mode

**Always use WordPress Mode when the output will be posted to WordPress.**

WordPress breaks embedded CSS via `wpautop()` (paragraph auto-formatter inserts `<p>` tags inside `<style>` blocks, corrupting CSS variable resolution). Apply these rules:

### Rule 1 — Remove the article-header block entirely
```html
<!-- DELETE this entire block for WordPress output: -->
<header class="article-header">
    <p class="eyebrow">...</p>
    <p class="subtitle">...</p>
    <p class="meta">...</p>
</header>
```
WordPress displays title from its own title field. Eyebrow and subtitle go in `meta.eyebrow_text` and `meta.subtitle` fields — not in content HTML. Keeping the header creates a redundant block that appears below the featured image.

### Rule 2 — Use inline styles for all paper-background elements
CSS variables like `var(--paper)` fail in WordPress due to `wpautop()` corruption. Hard-code hex values as inline `style` attributes on these elements:

| Element | Inline Style to Add |
|---------|---------------------|
| `.case-study` outer div | `style="background: #ece6d9; border: 1px solid rgba(59,84,107,.22); border-radius: 10px; padding: 2em; margin: 2em 0;"` |
| `.framework-box` | `style="background: #ece6d9; padding: 2em; margin: 2em 0; border-radius: 10px; border: 2px solid rgba(59,84,107,.22);"` |
| `.callout.mechanism` | `style="background: #ece6d9; border: 1.5px solid rgba(59,84,107,.5); border-left: 5px solid #3b546b; border-radius: 10px; padding: 20px 22px; margin: 2em 0;"` |
| `.callout.warning` | `style="background: rgba(59,84,107,.08); border: 1.5px solid rgba(59,84,107,.5); border-left: 5px solid #3b546b; border-radius: 10px; padding: 20px 22px; margin: 2em 0;"` |
| `.stat-highlight` | `style="display: flex; align-items: center; gap: 1.5em; margin: 2em 0; padding: 1.5em; background: #ece6d9; border-radius: 8px; border: 1px solid rgba(59,84,107,.22);"` |

Elements with dark/solid backgrounds (`.lead-section`, `.cta-box`, `.case-study .result`) use `rgba()` or hex — these survive `wpautop()` and do NOT need inline style overrides.

### Rule 3 — Featured image stays out of content
Do NOT embed the featured image as an `<img>` tag in the content HTML.
Set it via the WordPress `featured_media` field (uploaded media ID).
Inline images (inline-01 through inline-0N) go in the content, using WordPress-hosted URLs after upload.

### Rule 4 — Image URLs must be WordPress-hosted
Local paths (`./10-images/inline-01.png`) do not work in WordPress.
All inline `<img>` tags must use WordPress media library URLs (`https://alvishouse.io/wp-content/uploads/...`).
Upload images first (Step 12a), then embed the returned URLs.

## Critical References

- **When to create aesthetic elements**: [references/conversion-rules.md](references/conversion-rules.md)
- **HTML patterns for each element**: [references/element-mapping.md](references/element-mapping.md)
- **Complete CSS**: [assets/brand-styles.css](assets/brand-styles.css)

## Brand Color System

```css
:root {
  --ink: #3b546b;      /* Primary: headings, links, borders, callout accents */
  --rust: #cf5828;     /* Accent: eyebrow text, hover states ONLY */
  --slate: #7a8c9b;    /* Secondary: meta text, labels, "traditional" boxes */
  --paper: #ece6d9;    /* Background: boxes, callouts against white page */
  --text: #2b2b2b;     /* Body copy */
  --bg: #ffffff;       /* Page background */
}
```

### Color Rules

1. **Never use rust (#cf5828) adjacent to ink (#3b546b)**
2. **Rust only for**: eyebrow text, link hover states
3. **Ink for**: headings, borders, stat numbers, callout accents, strong text

## Quick Reference: Aesthetic Elements

| Content Pattern | Creates | Class |
|-----------------|---------|-------|
| Opening hook paragraphs | Dark lead section | `.lead-section` |
| `> **Key Insight:**` | Callout box | `.callout.mechanism` |
| "42% of companies..." | Stat highlight | `.stat-highlight` |
| Standalone powerful line | Pull quote | `.pull-quote` |
| `> "Quote" — Name` | Blockquote | `<blockquote>` + `<cite>` |
| Named framework + steps | Framework box | `.framework-box` |
| Traditional vs. alternative | Case study | `.case-study` |
| "Tomorrow, do this..." | CTA box | `.cta-box` |

## Density Guidelines (5,000 words)

- 1 lead section (opening)
- 2-4 callout boxes
- 2-3 stat highlights  
- 2-4 pull quotes
- 1 framework box (if applicable)
- 3-5 case studies (if applicable)
- 1 CTA box (closing)

Standard paragraphs should dominate. Aesthetic elements create rhythm—don't overuse.
