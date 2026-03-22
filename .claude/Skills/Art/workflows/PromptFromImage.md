# Prompt From Image Workflow

**Reverse-engineer detailed prompts from reference images.**

Analyzes existing images to extract visual characteristics and generate prompts that capture the style, composition, technique, and aesthetic.

---

## Purpose

**Use this workflow when:**
- You have a reference image and want to recreate its style
- You need to understand what makes a visual aesthetic work
- You want to generate variations based on existing imagery
- You're learning from competitor or inspiration content

**Output:** Detailed prompt file ready for use with generate-ulart-image.ts

---

## 🚨 MANDATORY STEPS

```
INPUT: Reference image path
     ↓
[1] READ: View image using Read tool
     ↓
[2] ANALYZE: Extract visual characteristics
     ↓
[3] MAP: Determine style aesthetic (Modern Alchemist / Da Vinci / Excalidraw / Napkin)
     ↓
[4] CONSTRUCT: Build detailed prompt matching characteristics
     ↓
[5] SAVE: Write prompt to file
     ↓
[6] VALIDATE: Review prompt completeness (optional: test generate)
```

---

## Step 1: Read Reference Image

**Use the Read tool to view the image:**

```
Read /path/to/reference/image.png
```

Claude's vision capabilities will process the image. You'll see the visual content.

**Initial assessment:**
- What's the overall style/aesthetic?
- What medium does it appear to be? (sketch, digital, painted, etc.)
- What's the primary subject or metaphor?
- What mood or feeling does it convey?

---

## Step 2: Analyze Visual Characteristics

**Extract specific details systematically:**

### 2A: Color Palette

- **Background color:** Specific hex codes or descriptive names
- **Primary colors:** Main colors used for key elements
- **Accent colors:** Secondary or emphasis colors
- **Color relationships:** Warm/cool, saturated/muted, monochrome/varied

**Example:**
```
Background: Warm parchment (#ECE6D9)
Primary: Deep slate blue (#3B546B)
Accent: Burnt copper (#CF5828)
Relationship: Warm background with cool primary, limited palette
```

### 2B: Line Quality & Technique

- **Line style:** Clean, wiggly, gestural, precise, hand-drawn, imperfect
- **Line weight:** Variable, consistent, bold, delicate
- **Line character:** Confident, sketchy, architectural, organic
- **Construction:** Visible geometry, hidden structure, spontaneous

**Example:**
```
Lines: Hand-drawn, deliberately imperfect
Weight: Variable with emphasis on key elements
Character: Leonardo sketch quality with visible construction
Construction: Geometry visible, shows thinking process
```

### 2C: Composition & Layout

- **Main elements:** What's the focal point? Supporting elements?
- **Arrangement:** Center-weighted, asymmetric, rule of thirds, organic
- **White space:** Generous, tight, balanced, intentional
- **Visual hierarchy:** What draws eye first, second, third?

**Example:**
```
Main: Lever mechanism (center-left, 40% of frame)
Supporting: Gears and annotations orbiting
Arrangement: Asymmetric with deliberate white space
Hierarchy: Hand → lever → gears → labels
```

### 2D: Texture & Surface Quality

- **Background texture:** Smooth, grainy, paper-like, digital
- **Surface characteristics:** Visible grain, texture, material quality
- **Medium indicators:** What does it look like it's drawn on/with?

**Example:**
```
Background: Visible parchment texture and grain
Surface: Paper fiber visible, aged quality
Medium: Appears drawn on actual aged paper
```

### 2E: Style & Aesthetic Markers

- **Historical reference:** Leonardo notebooks, Excalidraw digital, napkin sketch
- **Aesthetic qualities:** Intellectual, spontaneous, technical, organic
- **Key characteristics:** What makes this style distinctive?
- **Emotional tone:** Thoughtful, urgent, playful, serious

**Example:**
```
Historical: Leonardo da Vinci technical sketches
Aesthetic: Intellectual rigor with hand-crafted warmth
Distinctive: Cross-hatching, visible construction, annotations
Tone: Thoughtful and timeless
```

### 2F: Text & Annotation Style

- **Font/handwriting:** All-caps, script, printed, sketchy
- **Text placement:** Labels, callouts, integrated, scattered
- **Text style:** Architectural, hurried, precise, casual

**Example:**
```
Font: Hand-lettered script matching sketch style
Placement: Organic callouts with arrow indicators
Style: Precise but hand-drawn, not typed
```

---

## Step 3: Map to Style Aesthetic

**Based on your analysis, determine which style this matches:**

### Modern Alchemist / Intellectual Blueprint

**Indicators:**
- Warm cream/bone background (#F5F5DC or #FAF9F6)
- FAINT technical grid pattern (barely visible)
- Deep charcoal mono-line vectors (#2C2C2C)
- Muted gold/bronze accents (#C5A059) used sparingly
- Minimal light grey washes for depth
- Patent illustration precision
- Clean uniform line weight
- Bold serif headings + sans-serif body
- Professional sophistication

**If matched:** Use Modern Alchemist aesthetic guidelines

**Reference Image Template:** `templates/ModernAlchemist_FromReferenceImage.txt`
- Complete analysis framework for reference image conversion
- Style translation rules (background, lines, colors, typography)
- Conversion examples for common reference types
- Preserves concept while transforming aesthetic

### Da Vinci Notebook Style

**Indicators:**
- Warm parchment background (#ECE6D9)
- Deep slate blue ink (#3B546B)
- Burnt copper accents (#CF5828)
- Cross-hatching for shading
- Visible construction geometry
- Leonardo invention sketch energy
- Hand-lettered annotations

**If matched:** Use Da Vinci aesthetic guidelines

### Excalidraw Digital Whiteboard

**Indicators:**
- White background (#FFFFFF)
- Wiggly imperfect lines
- Hatched fills (no solid colors)
- Architect print font (all-caps)
- Lines overshoot at corners
- Digital whiteboard energy
- Black primary with blue/red accents

**If matched:** Use Excalidraw aesthetic guidelines

### Napkin Sketch Analog

**Indicators:**
- Napkin beige background (#F5F2E8)
- Visible paper texture and grain
- Ballpoint blue ink (#2C5F8D) or Sharpie black
- Quick gestural confident lines
- All-caps hurried handwriting
- Visible corrections (scribbled out)
- Coffee stains (optional)

**If matched:** Use Napkin Sketch aesthetic guidelines

### Unknown/Custom Style

**If none of the above match:**
- Document the unique characteristics
- Create custom prompt based on analysis
- Consider adding new style to skill system

---

## Step 4: Construct Detailed Prompt

**Using your analysis and style mapping, build the prompt:**

### Prompt Structure Template

```
[Medium description] in [style name] style
on [background description with hex code].

CONCEPT: [One sentence describing the main metaphor or subject]

CENTRAL ELEMENT:
[Describe the primary visual focus]
[Include composition details]
[Reference arrangement and hierarchy]

MEDIUM & TEXTURE:
- [Background material and color]
- [Texture characteristics]
- [Surface quality details]
- [Material indicators]

LINE QUALITY:
- [Line style description]
- [Weight variation notes]
- [Character and technique]
- [Construction visibility]

COMPOSITION:
- [Main element placement and size]
- [Supporting elements arrangement]
- [White space usage]
- [Visual hierarchy flow]

COLOR (Match exactly):
- [Background color with hex]
- [Primary color with hex]
- [Accent colors with hex]
- [Color usage rules]

TEXT & ANNOTATIONS:
- [Font/handwriting style]
- [Placement approach]
- [Integration with visual]
- [Specific labels or callouts]

CRITICAL:
- [Essential style characteristics]
- [Must-have elements]
- [Aesthetic non-negotiables]
- [What makes this style distinctive]

--no [what to avoid], --no [what to avoid], --no [what to avoid]
```

### Da Vinci Example

```
Technical sketch on aged parchment in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

CONCEPT: Hand operating lever mechanism showing mechanical advantage

CENTRAL ELEMENT:
A human hand gripping a lever attached to a gear system.
Drawn with Leonardo's characteristic technical precision.
Shows construction geometry and thinking process visible.

MEDIUM & TEXTURE:
- Aged parchment paper with visible grain
- Natural paper aging and slight discoloration
- Parchment beige tone throughout
- Ink slightly aged into paper fibers

LINE QUALITY:
- Hand-drawn with deliberate imperfection
- Variable line weight (heavier on key elements)
- Leonardo technical sketch style
- Visible construction circles and guide lines

COMPOSITION:
- Hand and lever mechanism (center-left, 40% of frame)
- Gear system extends right
- Annotations orbit naturally around sketch
- Generous negative space (upper right)

COLOR (Leonardo Palette):
- Parchment background: #ECE6D9
- Deep slate blue ink: #3B546B
- Burnt copper accents: #CF5828 (on key elements only)
- Cross-hatching for shading depth

TEXT & ANNOTATIONS:
- Hand-lettered in Leonardo script style
- Italicized precise handwriting
- Labels with arrow indicators
- Technical notes in margins

CRITICAL:
- Parchment texture visible throughout entire image
- Cross-hatching for all shading (no solid fills)
- Visible construction geometry
- Hand-drawn imperfection (not digital perfect)
- Leonardo da Vinci invention sketch aesthetic
- Intellectual depth with hand-crafted warmth

--no clean white paper, --no typed fonts, --no perfect lines, --no digital polish
```

### Modern Alchemist Example

```
Modern Alchemist illustration on warm cream technical paper
with faint grid background.

CONCEPT: Strategic framework diagram showing interconnected systems

CENTRAL ELEMENT:
Framework showing four interconnected components with geometric precision.
Clean mono-line aesthetic with professional sophistication.
Patent illustration quality meets modern corporate design.

BACKGROUND:
- Warm cream/bone color (#F5F5DC)
- FAINT technical grid pattern throughout (graph paper style)
- Grid lines VERY light (#E8E6E0) - barely visible, not strong
- Subtle paper grain texture on background
- Square grid pattern

LINE WORK:
- Clean, uniform weight mono-line vectors
- Deep charcoal/jet black (#2C2C2C) for all primary linework
- Patent illustration precision style
- Consistent line thickness throughout
- Modern readability (not scratchy vintage)

MAIN ELEMENTS:
- Four geometric shapes representing framework components
- Clean circles or rectangles with precise edges
- Connecting lines showing relationships
- Strategic arrangement with breathing room

ACCENT COLOR (Muted Gold/Bronze #C5A059):
- Used SPARINGLY (5-10% of composition)
- Applied to key emphasis elements
- One or two strategic highlights
- Guides eye to important components

SHADING:
- Minimal light grey washes (#D3D3D3) for volume
- Applied with restraint to avoid clutter
- Creates subtle dimensionality

TYPOGRAPHY:
- Headings: Bold authoritative Serif font (Garamond style)
- Body/Labels: Clean geometric Sans-Serif (Inter style)
- Professional typographic spacing
- Text aligned with grid where possible

COMPOSITION:
- Central framework (50-60% of space)
- Technical precision with breathing room
- Grid-based alignment
- Balanced negative space

TEXTURE:
- Background: Subtle paper grain
- Foreground: Smooth digital precision
- Contrast between textured background and clean elements

CRITICAL:
- Faint grid lines (NOT strong/dark) - barely visible
- Clean mono-line vectors (uniform weight throughout)
- 3-color palette: Cream background, charcoal primary, gold accents
- Modern readability with vintage warmth
- Professional sophistication
- Leonardo meets Silicon Valley aesthetic

--no strong grid lines, --no variable line weights, --no scratchy texture, --no solid fills, --no gradients
```

### Excalidraw Example

```
Digital whiteboard illustration in Excalidraw style
on white background (#FFFFFF).

CONCEPT: Flowchart showing decision branching with wiggly connectors

CENTRAL ELEMENT:
Connected boxes with arrows showing process flow.
Drawn as if sketching on Excalidraw.com whiteboard.
Wiggly imperfect lines, corners don't perfectly connect.

AESTHETIC:
- Wiggly lines throughout (deliberate jitter)
- Lines overshoot at corners slightly
- Boxes drawn with multiple overlapping strokes
- Variable line thickness
- Hand-drawn whiteboard quality

FILLS:
- Hatched diagonal lines for filled shapes
- Cross-hatching for emphasis
- Scribbled texture patterns
- NO solid colors anywhere

COMPOSITION:
- Central process flow (40-60% of frame)
- Generous white space around edges
- Wiggly connecting arrows
- 3-4 labeled components

TEXT:
- All-caps architect print font
- Blocky handwritten style
- Labels on key elements
- Hand-drawn appearance

COLOR:
- Black (#1E1E1E) for all primary lines and text
- Blue (#3B82F6) accent on key decision point
- White background

CRITICAL:
- Wiggly imperfect lines (NOT straight vectors)
- Hatched fills only, never solid
- Digital whiteboard energy
- Should look like Excalidraw.com sketch
- Approachable, non-intimidating

--no perfect lines, --no solid colors, --no typed fonts, --no corporate polish
```

### Napkin Sketch Example

```
Spontaneous sketch on paper napkin in ballpoint pen style
on textured napkin background (#F5F2E8).

CONCEPT: Quick ideation sketch showing gear mechanism amplification

CENTRAL SKETCH:
Gears and lever sketched quickly with ballpoint pen.
Gestural confident lines showing the amplification concept.
Drawn as if sketched during coffee shop brainstorm.

MEDIUM & TEXTURE:
- Paper napkin with visible grain texture throughout
- Slight creases and natural folds in napkin
- Napkin beige color (#F5F2E8)
- Ballpoint ink slightly bleeds into napkin fibers
- Optional: coffee ring stain in corner

LINE QUALITY:
- Quick confident ballpoint pen strokes
- Gestural arrows and connections
- Circles drawn as spirals or overlapping loops
- Variable pressure (darker where pen pressed hard)
- Lines show momentum and speed

CORRECTIONS (Important for authenticity):
- One element scribbled out with quick scratch marks
- Arrow pointing to revised sketch
- Shows real-time thinking iteration
- Not cleaned up or erased

TEXT:
- All-caps hurried handwriting
- Quick scratchy pen letters
- Readable but shows haste
- Ballpoint pen script style
- Labels scattered naturally

COMPOSITION:
- Central sketch (50-60% of napkin)
- Annotations orbiting main sketch
- Gestural arrows showing relationships
- Asymmetric natural placement

COLOR (Single Tool Rule):
- Ballpoint blue (#2C5F8D) for all sketching
- Napkin beige textured background
- Optional: Coffee stain (#8B7355)
- NO other colors (single pen only)

CRITICAL:
- Napkin texture visible throughout entire image
- Gestural spontaneous energy (not planned)
- Single tool consistency (pen only, not mixed)
- Shows real-time brainstorm thinking
- 1-2 scribbled corrections visible
- Must look like sketched in 2-3 minutes on actual napkin

--no clean paper, --no perfect lines, --no typed fonts, --no digital polish, --no multiple tools
```

---

## Step 5: Save Prompt to File

**Write the prompt to a file for reuse:**

```bash
# Save to appropriately named file
/home/alvis/.claude/Scratchpad/blog/images/prompt_[descriptive_name].txt
```

**Naming convention:**
- `prompt_[subject]_[style].txt`
- Example: `prompt_lever_amplification_davinci.txt`
- Example: `prompt_strategic_framework_modernalchemist.txt`
- Example: `prompt_decision_flow_excalidraw.txt`
- Example: `prompt_gear_sketch_napkin.txt`

**File content:**
The complete prompt from Step 4, exactly as constructed.

---

## Step 6: Validate Prompt

**Review the prompt for completeness:**

### Checklist:

- [ ] Medium and background clearly specified
- [ ] Color palette with hex codes included
- [ ] Line quality and technique described
- [ ] Composition and layout detailed
- [ ] Text/annotation style specified
- [ ] Critical style characteristics listed
- [ ] Negative prompts included (--no)
- [ ] Style aesthetic clearly identifiable

### Optional: Test Generation

**Generate an image to validate the prompt:**

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model gpt-image-1 \
  --prompt "$(cat /path/to/prompt_file.txt)" \
  --size 1536x1024 \
  --output /path/to/test_output.png
```

**Compare generated image to reference:**
- Does it capture the same style aesthetic?
- Are colors accurate?
- Is line quality similar?
- Does composition match?
- Is the overall feel correct?

**If mismatches:**
- Refine prompt with stronger emphasis on missing elements
- Add more specific details about style characteristics
- Strengthen negative prompts (--no)
- Iterate and test again

---

## Usage Examples

### Example 1: Recreate Style from Competitor Blog

```
User: "I have a reference image from a competitor's blog. Can you generate a prompt that captures this style?"

PAI: [Runs PromptFromImage workflow]
→ Step 1: Reads the reference image
→ Step 2: Analyzes colors (coral/navy/cream palette)
→ Step 3: Maps to custom style (minimalist modern)
→ Step 4: Constructs detailed prompt with exact colors and style
→ Step 5: Saves to prompt_competitor_style.txt
→ Step 6: Optionally tests generation to validate

Result: Prompt file ready to recreate similar aesthetic
```

### Example 2: Learn from Existing Da Vinci Image

```
User: "Analyze this Da Vinci-style image I created and give me the prompt so I can make variations"

PAI: [Runs PromptFromImage workflow]
→ Step 1: Reads existing Da Vinci image
→ Step 2: Extracts parchment color, ink colors, line quality
→ Step 3: Maps to Da Vinci aesthetic
→ Step 4: Generates detailed Da Vinci prompt
→ Step 5: Saves to prompt_lever_mechanism_davinci.txt
→ Step 6: User can now generate variations with same style

Result: Documented prompt for consistent variations
```

### Example 3: Reverse-Engineer Inspiration Image

```
User: "I found this amazing sketch style online. Help me understand what makes it work."

PAI: [Runs PromptFromImage workflow]
→ Step 1: Reads inspiration image
→ Step 2: Analyzes all visual characteristics systematically
→ Step 3: Maps to Napkin Sketch aesthetic (closest match)
→ Step 4: Constructs prompt explaining each characteristic
→ Step 5: Saves prompt as learning reference
→ Step 6: User gains understanding of style components

Result: Educational breakdown of what makes the style effective
```

---

## Tips for Accurate Prompt Extraction

### 1. Be Specific with Colors

**Don't:**
- "Blue background"
- "Reddish accent"

**Do:**
- "Deep slate blue (#3B546B) background"
- "Burnt copper (#CF5828) accent on key elements only"

### 2. Describe Line Quality Precisely

**Don't:**
- "Hand-drawn lines"

**Do:**
- "Variable weight lines with deliberate imperfection, heavier on focal elements, lighter on supporting geometry"

### 3. Capture Texture Details

**Don't:**
- "Paper texture"

**Do:**
- "Visible parchment grain with natural aging, ink slightly absorbed into paper fibers creating soft edges"

### 4. Document Composition Exactly

**Don't:**
- "Centered design"

**Do:**
- "Main element center-left occupying 40% of frame, supporting elements orbit right, generous white space upper-right quadrant"

### 5. Include Critical Style Markers

**Don't:**
- "Leonardo style"

**Do:**
- "Leonardo da Vinci invention sketch aesthetic: cross-hatching for shading, visible construction geometry, hand-lettered annotations with arrow indicators, intellectual depth with hand-crafted warmth"

---

## Common Pitfalls to Avoid

### Pitfall 1: Generic Descriptions

**Problem:** "Digital art with blue colors"
**Fix:** "Digital whiteboard illustration with wiggly imperfect black lines (#1E1E1E), blue accent (#3B82F6) on decision point, hatched diagonal fills, Excalidraw aesthetic"

### Pitfall 2: Missing Color Specifications

**Problem:** Describing style without exact colors
**Fix:** Always include hex codes for background, primary, and accent colors

### Pitfall 3: Overlooking Texture

**Problem:** Focusing only on linework and ignoring surface quality
**Fix:** Explicitly describe background texture, paper grain, material characteristics

### Pitfall 4: Forgetting Negative Prompts

**Problem:** Only saying what to include
**Fix:** Always add --no prompts for what to avoid (--no clean paper, --no typed fonts, --no perfect lines)

### Pitfall 5: Ignoring Text Style

**Problem:** Not documenting how text/annotations appear
**Fix:** Describe font/handwriting style, placement, integration with visual

---

## Advanced: Creating Custom Style Prompts

**If the reference doesn't match Da Vinci/Excalidraw/Napkin:**

### 1. Document All Characteristics

Use the analysis framework from Step 2, but don't force-fit to existing styles.

### 2. Create Unique Style Template

```
[Custom medium description] in [unique style name]
on [background description].

[Follow same structure as templates above but with unique characteristics]
```

### 3. Name the Style

Give it a memorable name for future reference:
- "Minimalist Coral" style
- "Technical Blueprint" style
- "Watercolor Sketch" style

### 4. Save as New Reference

Add to style library for consistency across future work.

---

## Quick Reference: Analysis Checklist

**Use this when analyzing any reference image:**

- [ ] Background color (hex code)
- [ ] Primary colors (hex codes)
- [ ] Accent colors (hex codes)
- [ ] Line style (wiggly, clean, gestural, etc.)
- [ ] Line weight (variable, consistent, bold)
- [ ] Texture (paper grain, surface quality)
- [ ] Composition (focal point, arrangement)
- [ ] White space (generous, tight, balanced)
- [ ] Text style (handwritten, typed, all-caps)
- [ ] Text placement (integrated, orbiting, margins)
- [ ] Medium indicators (what it's drawn on/with)
- [ ] Aesthetic qualities (intellectual, spontaneous, technical)
- [ ] Style markers (cross-hatching, corrections, construction)
- [ ] Emotional tone (serious, playful, urgent)

---

## Integration with Art Skills

**This workflow integrates with:**

- **Da Vinci skill** - Use for Leonardo-style analysis
- **Excalidraw skill** - Use for whiteboard-style analysis
- **NapkinSketch skill** - Use for analog napkin-style analysis

**Workflow sequence:**
1. User provides reference image
2. Run PromptFromImage workflow (this file)
3. Generate prompt matching appropriate style
4. Save prompt to style-specific skill directory
5. Use with generate-ulart-image.ts

---

## Workflow Validation

**Successful execution includes:**

✓ Reference image read and viewed
✓ All 6 characteristics analyzed (color, line, texture, composition, text, style)
✓ Style mapped to Da Vinci/Excalidraw/Napkin or custom
✓ Detailed prompt constructed with hex codes
✓ Prompt saved to appropriately named file
✓ Validation checklist completed

**Incomplete execution would be:**

✗ Skipping Read tool (describing without viewing)
✗ Generic color descriptions (no hex codes)
✗ Missing texture or composition details
✗ No negative prompts included
✗ Prompt not saved to file

---

**Remember:** The goal is to capture EXACTLY what makes the reference image's style work, so you can recreate or vary it with precision.