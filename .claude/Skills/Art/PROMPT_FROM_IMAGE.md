# Prompt From Image - Quick Start

**Reverse-engineer prompts from reference images using Claude's vision.**

---

## What It Does

Analyzes reference images and generates detailed prompts that capture the style, so you can:
- Recreate competitor styles
- Generate consistent variations
- Learn what makes visual aesthetics work
- Build prompt libraries for your styles

---

## How to Use

### Basic Usage

```
User: "Analyze this image and generate a prompt for it"
User: [Provides image path]

PAI: [Automatically invokes PromptFromImage workflow]
→ Reads and views the image
→ Analyzes colors, lines, texture, composition
→ Maps to style (Modern Alchemist / Da Vinci / Excalidraw / Napkin / Custom)
→ Generates detailed prompt with hex codes
→ Saves to file
```

### Example 1: Recreate Blog Header Style

```
You: "I love this blog header style. Help me recreate it."
You: /home/alvis/Downloads/competitor-header.png

PAI: [Runs PromptFromImage]
→ Analyzes: White background, wiggly lines, hatched fills
→ Maps to: Excalidraw aesthetic
→ Generates prompt with exact colors (#FFFFFF, #1E1E1E, #3B82F6)
→ Saves: prompt_competitor_style_excalidraw.txt

You can now generate images with that exact style.
```

### Example 2: Document Your Own Style

```
You: "I created this Da Vinci image. Extract the prompt so I can make variations."
You: /home/alvis/.claude/Scratchpad/blog/images/amplifying_humans_header.png

PAI: [Runs PromptFromImage]
→ Reads your existing image
→ Extracts: Parchment (#ECE6D9), ink (#3B546B), cross-hatching
→ Generates detailed Da Vinci prompt
→ Saves: prompt_lever_mechanism_davinci.txt

You now have documented prompt for consistent variations.
```

---

## Supported Styles

### 1. Modern Alchemist / Intellectual Blueprint
- Warm cream background with faint grid (#F5F5DC)
- Deep charcoal mono-line vectors (#2C2C2C)
- Muted gold accents (#C5A059) used sparingly
- Professional sophistication, Leonardo meets Silicon Valley

### 2. Da Vinci Notebook
- Parchment background (#ECE6D9)
- Deep slate blue ink (#3B546B)
- Cross-hatching, visible construction geometry
- Leonardo invention sketch aesthetic

### 3. Excalidraw Digital Whiteboard
- White background (#FFFFFF)
- Wiggly imperfect lines
- Hatched fills, no solid colors
- Digital whiteboard energy

### 4. Napkin Sketch Analog
- Napkin beige (#F5F2E8)
- Ballpoint blue (#2C5F8D)
- Gestural lines, visible corrections
- Spontaneous brainstorm feel

### 5. Custom Styles
- If your image doesn't match above, PAI will analyze and create custom prompt
- Documents unique characteristics for future use

---

## What Gets Analyzed

**Every reference image analysis includes:**

✓ **Color Palette** - Exact hex codes for background, primary, accents
✓ **Line Quality** - Style, weight, character (wiggly, clean, gestural)
✓ **Texture** - Background texture, paper grain, surface quality
✓ **Composition** - Layout, focal points, white space
✓ **Text Style** - Handwriting, fonts, placement
✓ **Aesthetic Markers** - Cross-hatching, corrections, construction lines
✓ **Emotional Tone** - Intellectual, spontaneous, technical, playful

**Output:** Detailed prompt with all characteristics captured

---

## Generated Prompt Structure

```
[Medium] in [style] on [background color #HEXCODE].

CONCEPT: [One sentence description]

CENTRAL ELEMENT:
[Detailed description of main visual]

MEDIUM & TEXTURE:
- [Background material and texture]
- [Surface quality]

LINE QUALITY:
- [Line style and technique]
- [Weight variations]

COMPOSITION:
- [Layout and arrangement]
- [White space usage]

COLOR:
- Background: #HEXCODE
- Primary: #HEXCODE
- Accent: #HEXCODE

TEXT & ANNOTATIONS:
- [Font/handwriting style]
- [Placement approach]

CRITICAL:
- [Essential style characteristics]
- [Must-have elements]

--no [what to avoid], --no [what to avoid]
```

---

## Using Generated Prompts

### Generate image from saved prompt:

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model gpt-image-1 \
  --prompt "$(cat /path/to/prompt_file.txt)" \
  --size 1536x1024 \
  --output /path/to/new_image.png
```

### Or with nano-banana-pro:

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "$(cat /path/to/prompt_file.txt)" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output /path/to/new_image.png
```

---

## Pro Tips

### 1. Use for Style Learning

When you see a visual aesthetic you like:
1. Run PromptFromImage workflow
2. Read the generated prompt carefully
3. You'll understand EXACTLY what makes that style work
4. Apply those principles to your own work

### 2. Build Prompt Libraries

Create organized prompt collections:
```
/blog/images/prompts/
  modernalchemist_framework.txt
  davinci_lever.txt
  davinci_gears.txt
  excalidraw_flowchart.txt
  napkin_sketch.txt
```

Consistent styles across all your content.

### 3. Iterate and Refine

Generated prompts are starting points:
1. Test generate with the prompt
2. Compare to reference
3. Refine prompt if needed
4. Add stronger emphasis on key characteristics

### 4. Document Your Process

When you create a style you love:
1. Immediately run PromptFromImage on it
2. Save the prompt with version notes
3. You can recreate it exactly anytime

---

## Common Use Cases

| Situation | Action |
|-----------|--------|
| Love competitor's style | Run PromptFromImage → Save prompt → Generate variations |
| Want consistent blog headers | Run on one good header → Use prompt for all future headers |
| Learning visual design | Analyze great examples → Study what makes them work |
| Building style guide | Document your styles as prompts → Consistent brand visuals |
| Training team member | Share prompts → Everyone creates consistent visuals |

---

## Workflow Location

**Full workflow documentation:**
`/home/alvis/.claude/Skills/Art/workflows/PromptFromImage.md`

**Includes:**
- Complete 6-step process
- Detailed analysis frameworks
- Style-specific templates
- Validation checklists
- Advanced techniques

---

## Quick Start Checklist

To use PromptFromImage right now:

- [ ] Have a reference image path ready
- [ ] Tell PAI: "Generate a prompt from this image"
- [ ] Provide image path
- [ ] PAI runs automatic analysis
- [ ] Review generated prompt
- [ ] Prompt saved to file
- [ ] Use with generate-ulart-image.ts

**That's it!** Claude's vision + systematic analysis = precise prompt extraction.

---

**Questions? See full workflow at:** `workflows/PromptFromImage.md`
