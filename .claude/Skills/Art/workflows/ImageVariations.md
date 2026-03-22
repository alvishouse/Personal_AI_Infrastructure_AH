# Image Variations Workflow

**Generate a styled base image from a reference, then create creative variations - different poses, positions, elements, and scenes.**

Takes a reference image, creates a styled BASE image, then generates multiple variation prompts that explore the same concept through different visual interpretations.

---

## Complete Flow

```
REFERENCE IMAGE (user provides - any style/source)
      ↓
[Step 1] Create BASE image in chosen style (Modern Alchemist, Da Vinci, Napkin, etc.)
      ↓
[Step 2] Generate N VARIATIONS (different poses, elements, scenes)
      ↓
[Step 3] /image-resize (separate workflow) → Size for platforms
```

---

## Purpose

**Use this workflow when:**
- You have a reference/inspiration image and want a styled base + variations
- You need multiple versions of a concept for A/B testing
- You want to explore different visual angles of the same idea
- You're building a library of related visuals for content series

**Output:**
- BASE image (reference transformed to chosen style)
- Variation manifest with multiple creative prompts
- Each variation is a distinct image (different pose, position, element, scene)
- All variations maintain the core concept and style

---

## Slash Command

```
/image-variations <reference-image> -s <style> [-n count] [-g] [-b]
```

**Arguments:**

| Long | Short | Description |
|------|-------|-------------|
| `--style` | `-s` | Target style (required) |
| `--count` | `-n` | Number of variations (default: 5) |
| `--generate` | `-g` | Generate all images |
| `--base-only` | `-b` | Only create base, skip variations |
| `--describe` | `-d` | Provide your own variation descriptions |
| `--prompt` | `-p` | Custom prompt for base image |

**Style Shortcuts:**

| Style | Shortcut |
|-------|----------|
| Modern Alchemist | `ma` |
| Da Vinci | `dv` |
| Napkin | `nk` |
| Excalidraw | `ex` |

**Quick Examples:**
```bash
# Napkin style, 3 variations, generate all
/image-variations ./ref.png -s nk -n 3 -g

# Da Vinci, base only
/image-variations ./ref.png -s dv -b -g

# Modern Alchemist, 5 variations (prompts only)
/image-variations ./ref.png -s ma

# With custom variation descriptions
/image-variations ./ref.png -s ma -d
```

---

## Describing Variations (`-d` flag)

Use `-d` or `--describe` to provide your own variation descriptions instead of auto-generating.

**Interactive mode:**
```
/image-variations ./ref.png -s nk -d

PAI: Describe your variations (one per line, blank line to finish):

> head buried in sand like ostrich
> same pose but surrounded by alarm bells instead of lightning
> curled up in fetal position on office floor
> standing on sinking ship deck, water at ankles
>

PAI: Created 4 variation prompts based on your descriptions.
```

**Inline mode - Multiple `-d` flags (recommended):**
```bash
/image-variations ./ref.png -s nk -g \
  -d "head buried in sand like ostrich" \
  -d "surrounded by alarm bells instead of lightning" \
  -d "curled up in fetal position" \
  -d "standing on sinking ship deck"
```

**Inline mode - Semicolon separated:**
```bash
/image-variations ./ref.png -s nk -g -d "ostrich pose; alarm bells; fetal position; sinking ship"
```

**From file:**
```bash
/image-variations ./ref.png -s nk -d @variations.txt
```

Where `variations.txt` contains:
```
head buried in sand like ostrich
same pose but surrounded by alarm bells
curled up in fetal position
standing on sinking ship deck
```

---

## Variation Dimensions

The workflow generates variations across these dimensions:

| Dimension | Description | Example |
|-----------|-------------|---------|
| **Position** | Subject placement/orientation | Facing left vs right, centered vs off-center |
| **Pose** | Body language/gesture | Covering ears vs burying head vs looking away |
| **Elements** | Supporting visual components | Lightning bolts vs question marks vs alarm bells |
| **Scene** | Environment/context | Office setting vs abstract vs outdoor |
| **Angle** | Perspective/viewpoint | Front-facing vs profile vs from behind |
| **Intensity** | Emotional amplification | Subtle stress vs extreme panic |

---

## Workflow Steps

```
INPUT: Reference image + target style
     ↓
[1] ANALYZE: Extract concept and core elements from reference
     ↓
[2] CREATE BASE: Generate base image in target style
     ↓
[3] IDENTIFY: What can vary vs what must stay constant
     ↓
[4] GENERATE PROMPTS: Create N variation descriptions
     ↓
[5] OUTPUT: Manifest with base + all variation prompts
     ↓
[6] GENERATE IMAGES (if --generate): Create base + all variations
```

---

## Step 1: Analyze Reference Image

**Extract from the base image:**

```yaml
concept:
  core_idea: "Executive in denial about disruption"
  metaphor: "Refusing to hear/see warning signs"
  emotional_tone: "Frustrated, overwhelmed, avoidance"

subject:
  who: "Middle-aged businessman in suit"
  action: "Covering ears with hands"
  expression: "Eyes squeezed shut, grimacing"

style:
  name: "Editorial Illustration"
  palette:
    background: "#F5F2E8"
    primary: "#2C2C2C"
    accent: "#C5A059"
  technique: "Hand-drawn linework, muted professional colors"

elements:
  - "Business suit (charcoal)"
  - "Stress indicators (gold lightning bolts)"
  - "Grid paper background"
```

---

## Step 2: Create Base Image

**Transform reference into target style:**

Using the analyzed concept, generate the BASE image prompt in the chosen style:

```yaml
base_image:
  name: "Base - [Concept Summary]"
  style: "[Target Style]"
  reference: "[Path to reference image]"
  output: "[name]-base.png"
  prompt: |
    [Full prompt in target style format]

    Uses reference image as composition/concept guide.
    Transforms to [style] aesthetic with appropriate:
    - Color palette
    - Line quality
    - Texture
    - Typography style
```

**Generation command:**
```bash
bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --size 2K \
  --aspect-ratio 16:9 \
  --reference-image "[reference-path]" \
  --output "[output-path]-base.png" \
  --prompt "[base prompt in target style]"
```

The base image becomes the "canonical" version that all variations relate to.

---

## Step 3: Identify Variable vs Constant

**MUST STAY CONSTANT** (defines the concept):
- Core metaphor (denial/avoidance)
- Subject type (business professional)
- Style and color palette
- Emotional tone

**CAN VARY** (creates interest):
- Specific pose/gesture
- Supporting elements
- Background/scene
- Angle/perspective
- Intensity level
- Gender/appearance details

---

## Step 4: Generate Variation Descriptions

For each variation, define what changes:

### Variation 1: Original (Reference)
```yaml
name: "Base - Covering Ears"
pose: "Standing, hands pressing against ears"
elements: "Lightning bolt stress indicators"
scene: "Neutral grid paper background"
angle: "Front-facing, slight low angle"
prompt: |
  [Full prompt matching the reference image]
```

### Variation 2: Position Change
```yaml
name: "Ostrich Pose"
pose: "Head buried in sand/desk, only back visible"
elements: "Storm clouds gathering above"
scene: "Desert sand or office desk"
angle: "Side profile view"
change_rationale: "Different metaphor for same concept - hiding from reality"
prompt: |
  Editorial illustration of a businessman in charcoal suit with head
  buried in sand like an ostrich, back and shoulders visible, storm
  clouds gathering above. Side profile view. Same muted professional
  palette (#F5F2E8 background, #2C2C2C suit, #C5A059 accents)...
```

### Variation 3: Element Change
```yaml
name: "Alarm Bells"
pose: "Same covering ears pose"
elements: "Alarm bells ringing around head instead of lightning"
scene: "Same grid background"
angle: "Same front-facing"
change_rationale: "Different visual metaphor - explicit warning signals"
prompt: |
  Editorial illustration of businessman covering ears, surrounded by
  ringing alarm bells instead of lightning bolts. Same composition
  and style as base...
```

### Variation 4: Scene Change
```yaml
name: "Sinking Ship"
pose: "Similar defensive posture"
elements: "Water rising around ankles"
scene: "Ship deck or flooding office"
angle: "Wide shot showing environment"
change_rationale: "Environmental storytelling - danger is tangible"
prompt: |
  Editorial illustration of businessman in denial while standing on
  sinking ship deck, water at ankles, still covering ears. Wider
  composition showing the danger he's ignoring...
```

### Variation 5: Intensity Change
```yaml
name: "Extreme Denial"
pose: "Curled up fetal position"
elements: "Multiple overlapping warning signs"
scene: "Surrounded by chaos"
angle: "Overhead looking down"
change_rationale: "Amplified version - complete shutdown"
prompt: |
  Editorial illustration of businessman curled in fetal position on
  office floor, surrounded by warning signs, alarms, and chaos he
  refuses to acknowledge. Overhead perspective...
```

---

## Step 5: Output Manifest

Save as `[image-name]-variations.yaml`:

```yaml
# Image Variations Manifest
# Generated: [timestamp]
# Reference: [path to reference image]

concept:
  core_idea: "Executive in denial about disruption"
  metaphor: "Refusing to acknowledge warning signs"

style:
  name: "Editorial Illustration"
  palette:
    background: "#F5F2E8"
    primary: "#2C2C2C"
    accent: "#C5A059"

constants:
  - "Business professional subject"
  - "Denial/avoidance emotional tone"
  - "Muted professional color palette"
  - "Hand-drawn editorial style"

variations:
  - id: "v1-base"
    name: "Base - Covering Ears"
    dimension: "reference"
    changes: "None - this is the original"
    output: "[name]-v1-base.png"
    prompt: |
      [Full prompt]

  - id: "v2-ostrich"
    name: "Ostrich Pose"
    dimension: "pose"
    changes: "Head buried instead of ears covered"
    output: "[name]-v2-ostrich.png"
    prompt: |
      [Full prompt]

  - id: "v3-alarms"
    name: "Alarm Bells"
    dimension: "elements"
    changes: "Alarm bells instead of lightning bolts"
    output: "[name]-v3-alarms.png"
    prompt: |
      [Full prompt]

  - id: "v4-sinking"
    name: "Sinking Ship"
    dimension: "scene"
    changes: "Environmental danger context"
    output: "[name]-v4-sinking.png"
    prompt: |
      [Full prompt]

  - id: "v5-extreme"
    name: "Extreme Denial"
    dimension: "intensity"
    changes: "Amplified emotional state"
    output: "[name]-v5-extreme.png"
    prompt: |
      [Full prompt]

generation_commands:
  v1-base: |
    bun ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
      --model nano-banana-pro --size 2K --aspect-ratio 3:2 \
      --output "[output-dir]/[name]-v1-base.png" \
      --prompt "[prompt]"
  # ... etc
```

---

## Step 6: Generate Images (Optional)

If `--generate` flag provided:

```bash
# Generate each variation
# Use reference image for style consistency where supported
# Wait between generations for rate limits
```

---

## Example Usage

### Example 1: Create Base + Variation Prompts

```
User: /image-variations ./reference.jpg --style "Modern Alchemist" --count 5

PAI:
→ Analyzes reference: "Executive covering ears, denial concept"
→ Creates BASE prompt in Modern Alchemist style
→ Generates 5 variation descriptions:
  1. Base (Modern Alchemist version of reference)
  2. Ostrich pose variation
  3. Different warning elements
  4. Environmental scene change
  5. Intensity amplification
→ Saves manifest with all prompts
→ "Created base + 5 variation prompts. Use --generate to create images."
```

### Example 2: Generate Base + All Variations

```
User: /image-variations ./inspiration.png --style "Napkin" --count 3 --generate

PAI:
→ Analyzes reference
→ Generates BASE image in Napkin style
→ Generates 3 variation images
→ Reports: "Generated base + 3 creative variations"
```

### Example 3: Base Only (No Variations)

```
User: /image-variations ./photo.jpg --style "Da Vinci" --base-only --generate

PAI:
→ Analyzes reference
→ Generates single BASE image in Da Vinci style
→ "Generated base image. Run again without --base-only for variations."
```

### Example 4: Full Pipeline

```
User: /image-variations ./rough-sketch.png --style "Modern Alchemist" --count 4 --generate

PAI:
→ Creates: concept-base.png (styled version of reference)
→ Creates: concept-v1-pose.png (different pose)
→ Creates: concept-v2-elements.png (different elements)
→ Creates: concept-v3-scene.png (different scene)
→ Creates: concept-v4-intensity.png (different intensity)

User: /image-resize ./concept-base.png --channels "linkedin,twitter,blog"

PAI:
→ Creates: concept-base-linkedin.png (1:1)
→ Creates: concept-base-twitter.png (16:9)
→ Creates: concept-base-blog.png (16:9)
```

---

## Variation Generation Principles

### 1. Maintain Concept Integrity
Every variation must clearly communicate the same core idea. If the concept is "denial about disruption," every variation should show denial, just expressed differently.

### 2. One Dimension Per Variation
Change ONE thing at a time for clarity:
- Variation 2: Change pose only
- Variation 3: Change elements only
- Variation 4: Change scene only

Avoid changing multiple dimensions in one variation.

### 3. Style Consistency
All variations should feel like they belong together:
- Same color palette
- Same illustration technique
- Same level of detail
- Same emotional register

### 4. Practical Diversity
Generate variations that serve different use cases:
- Some more dramatic (for attention-grabbing)
- Some more subtle (for professional contexts)
- Some with more context (for storytelling)
- Some tighter (for profile images)

---

## Variation Dimension Ideas

### Pose Variations
- Standing → Sitting → Crouching → Lying down
- Arms crossed → Arms raised → Hands on head → Fetal position
- Looking forward → Looking away → Looking down → Eyes closed

### Element Variations
- Lightning bolts → Alarm bells → Warning signs → Question marks
- Single indicator → Multiple indicators → Overwhelming chaos
- Abstract symbols → Literal objects → Environmental cues

### Scene Variations
- Neutral background → Office setting → Outdoor environment
- Clean/minimal → Cluttered/chaotic → Symbolic landscape
- Present day → Historical setting → Futuristic context

### Angle Variations
- Front-facing → Profile → Three-quarter → From behind
- Eye level → Low angle (heroic) → High angle (vulnerable)
- Close-up → Medium shot → Wide shot

### Intensity Variations
- Subtle discomfort → Visible stress → Extreme distress
- Quiet denial → Active avoidance → Complete shutdown
- Early stage → Crisis point → Aftermath

---

## Integration with Social Sizing

**This workflow creates DIFFERENT images.**

For adapting ONE image to multiple social media sizes, use a separate workflow:
- `/image-resize` - Takes one image, outputs multiple aspect ratios
- That's a cropping/reframing task, not a creative variation task

**Typical flow:**
1. `/image-variations` → Create 5 creative variations
2. Pick best variation for each channel
3. `/image-resize` → Adapt chosen images to channel sizes

---

## Output Summary

After running `/image-variations`:

```
## Image Variations Created

Reference: ./images/01-featured.png
Concept: "Executive in denial about disruption"
Style: Editorial Illustration

### Variations Generated:

| ID | Name | Dimension Changed | File |
|----|------|-------------------|------|
| v1 | Base - Covering Ears | (reference) | *-v1-base.png |
| v2 | Ostrich Pose | pose | *-v2-ostrich.png |
| v3 | Alarm Bells | elements | *-v3-alarms.png |
| v4 | Sinking Ship | scene | *-v4-sinking.png |
| v5 | Extreme Denial | intensity | *-v5-extreme.png |

Manifest: ./images/01-featured-variations.yaml
```

---

**This workflow transforms one concept into a library of related visuals, each exploring the idea through a different creative lens while maintaining stylistic consistency.**
