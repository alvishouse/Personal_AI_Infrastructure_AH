---
name: sketchnote-infographic
description: Create sketchnote-style visual infographics as downloadable PNG images sized for LinkedIn. Use this skill whenever the user asks for a sketchnote, visual explainer, visual one-pager, infographic with a hand-drawn or notebook aesthetic, concept comparison diagram, framework visualization, LinkedIn carousel slide, or any request that mentions "sketchnote," "visual notes," "whiteboard style," or wants to explain a concept using a multi-column visual layout with icons and illustrations. Also trigger when the user uploads a sketchnote image and wants to recreate or adapt it, or asks for a "visual summary" of a framework or methodology. This skill produces downloadable PNG image files at LinkedIn-optimized dimensions.
---

# Sketchnote Infographic Skill

Create polished, consistent sketchnote-style infographics as **downloadable PNG images** optimized for LinkedIn posting. The output looks like a hand-drawn notebook page with a warm, approachable visual style — perfect for explaining frameworks, comparisons, processes, and mental models.

## LinkedIn Format Presets

Always ask the user which format they want, or default to **Portrait (4:5)** since it dominates the mobile feed:

| Format | Pixels | Aspect Ratio | Best For |
|--------|--------|-------------|----------|
| **Portrait** | 1080 × 1350 | 4:5 | Maximum mobile screen presence, detailed infographics |
| **Square** | 1080 × 1080 | 1:1 | Universal compatibility, balanced layout |
| **Landscape** | 1200 × 627 | 1.91:1 | Link previews, wide comparisons |
| **Carousel slide** | 1080 × 1350 | 4:5 | Multi-slide PDF carousels (each slide is a PNG) |

Export as **PNG** (best for graphics with text — preserves sharp edges). File size should stay under 5 MB. Use sRGB color space.

## Generation Pipeline

The pipeline is: **Content → HTML → Screenshot → PNG**

### Step 1: Parse Content

Extract from the user's request: title, subtitle, columns (2-4), each with a header, key visual/diagram, character quote, and bullet points. Plus a bottom progression flow and attribution.

### Step 2: Read the Reference Template

Before generating ANY code, read `references/react-template.md` — it contains the exact HTML structure, CSS patterns, color palette, font stacks, SVG icon library, and component primitives. These ensure visual consistency across every generation.

### Step 3: Generate the HTML File

Create a self-contained HTML file at `/home/claude/sketchnote.html` with:
- Viewport and body sized to the chosen LinkedIn dimensions (e.g., `width: 1080px; height: 1350px`)
- All Google Fonts loaded via `<link>` tags (Caveat, Patrick Hand, Fredoka)
- Inline SVG icons and stick figure illustrations
- The complete sketchnote layout (spiral binding, title, columns, progression flow, attribution)
- A `<meta charset="utf-8">` and explicit `box-sizing: border-box`

The HTML body dimensions MUST match the target pixel size exactly. Do not use responsive/fluid layouts — use fixed pixel values throughout since this will be screenshotted at 1:1 device pixel ratio.

### Step 4: Screenshot with Playwright

Use this exact Python script pattern:

```python
import asyncio
from playwright.async_api import async_playwright

async def capture():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(
            viewport={"width": WIDTH, "height": HEIGHT},
            device_scale_factor=2,  # 2x for crisp text on retina
        )
        await page.goto(f"file:///home/claude/sketchnote.html")
        await page.wait_for_load_state("networkidle")
        # Wait for Google Fonts to load
        await page.wait_for_timeout(2000)
        await page.screenshot(
            path="/mnt/user-data/outputs/sketchnote-linkedin.png",
            type="png",
            clip={"x": 0, "y": 0, "width": WIDTH, "height": HEIGHT},
        )
        await browser.close()

asyncio.run(capture())
```

Set `device_scale_factor=2` for retina-quality output. The resulting PNG will be 2x the viewport dimensions (e.g., 2160x2700 for portrait). LinkedIn handles downscaling well and the image stays sharp.

If the user wants a standard-resolution image (exact 1080x1350), set `device_scale_factor=1`.

### Step 5: Present the File

Copy the PNG to `/mnt/user-data/outputs/` and use `present_files` to share it with the user. Give a brief summary of format, dimensions, and file size.

## Visual Identity (Non-Negotiable)

**Paper & Binding**: Warm off-white background (#faf8f0). Spiral binding on the left edge using repeating SVG ovals. Faint ruled lines in background.

**Typography**: Google Fonts — "Fredoka" for headers, "Patrick Hand" for body, "Caveat" for handwriting accents and speech bubbles.

**Color Palette**: Pastel column headers: green (#d4edda), blue (#cce5ff), pink (#f8d7da), yellow (#fff3cd). Dark text (#2d3436). Marker highlight yellow (#ffeaa7).

**Illustrations**: Inline SVG stick figures and icons. Speech bubbles with asymmetric border-radius. Emoji-style bullet icons.

**Layout**: Title at top with highlighted keyword. Multi-column grid. Each column has colored header, diagram, character with speech bubble, and bullet points. Progression flow at bottom with arrows.

## Content Structure

```
+---------------------------------------------+
|  TITLE (large, bold, highlighted keyword)    |
|  Subtitle (smaller text)                     |
+----------+----------+----------+-------------+
| COLUMN 1 | COLUMN 2 | COLUMN 3 | (opt. 4)   |
| [header] | [header] | [header] |             |
| [visual] | [visual] | [visual] |             |
| [figure] | [figure] | [figure] |             |
| [speech] | [speech] | [speech] |             |
| [bullets]| [bullets]| [bullets]|             |
+----------+----------+----------+-------------+
|  BOTTOM: Progression flow with arrows        |
|  STEP 1  ->  STEP 2  ->  STEP 3             |
+---------------------------------------------+
|  Attribution / Source line                   |
+---------------------------------------------+
```

## Scaling Rules by Format

**Portrait (1080x1350)**: Full layout fits comfortably. Use 3 columns at ~320px each with 16px gaps. Title at ~42px. Body text at ~20px. Generous vertical spacing.

**Square (1080x1080)**: Tighter vertical spacing. Reduce diagram area height. Shorten bullet text. Title at ~38px.

**Landscape (1200x627)**: Very tight vertically. Use abbreviated bullets (label only, no detail). Smaller diagrams. Consider 2 columns instead of 3. Title at ~32px.

## Implementation Rules

**CRITICAL — FILL THE CANVAS**: The infographic must fill 100% of the canvas with zero extraneous whitespace at top, bottom, or sides. The content should look rich and full, like the original hand-drawn sketchnotes that use every inch of the notebook page. To achieve this:

- Set the `.content` wrapper to `height: [exact canvas height]px` with `display: flex; flex-direction: column` — NO `justify-content: center`.
- Use minimal padding: ~18px top/bottom, ~28px sides, ~58px left (for spiral).
- Set the `.columns` grid to `flex: 1` so columns stretch to fill all available vertical space.
- Set `.diagram-area` inside each column to `flex: 1` so diagrams expand to fill the column.
- Use large fonts: title ~46px, headers ~20px, body ~21px, progression steps ~42px.
- If content doesn't fill the frame, scale up fonts, add more bullet points, enlarge diagrams, or add a thesis callout box. Never leave dead space.

**Other rules:**

- **Self-contained HTML**: Everything in one `.html` file — styles, SVGs, fonts, content. No external dependencies except Google Fonts CDN.
- **Fixed pixel sizing**: All dimensions in `px`, not `rem` or `%`. The HTML is a fixed canvas, not a responsive page.
- **No JavaScript required**: Pure HTML + CSS. The screenshot captures the rendered DOM.
- **SVG icons inline**: All visuals are inline SVGs or CSS shapes. No external images.
- **Text safe zone**: Keep all text at least 18px from edges. Content should be close to edges but not clipped.
- **Marker highlight effect**: Use `background: linear-gradient(180deg, transparent 55%, #ffeaa7 55%, #ffeaa7 88%, transparent 88%)` on highlighted words.
- **Hand-drawn borders**: `border-radius` with slight variations (e.g., `12px 8px 14px 10px`).
