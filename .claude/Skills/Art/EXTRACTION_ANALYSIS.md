# Art Skill Extraction Analysis

**Purpose:** Analysis for extracting the PAI Art Skill into a standalone Claude Code project with support for multiple art styles.

---

## Current Architecture Overview

### File Structure

```
.claude/Skills/Art/
├── SKILL.md                          # Skill entry point & routing
├── tools/
│   ├── generate-ulart-image.ts       # 625 lines - Core image generation CLI
│   └── generate-prompt.ts            # 454 lines - DEPRECATED, needs rewrite
└── workflows/                        # 14 specialized workflow files (5,989 lines total)
    ├── Workflow.md                   # Editorial illustration (master)
    ├── Visualize.md                  # Adaptive content orchestrator
    ├── Mermaid.md                    # Technical diagrams via Mermaid
    ├── TechnicalDiagrams.md          # System architecture
    ├── Comics.md                     # Sequential panel comics
    ├── Maps.md                       # Conceptual/idea maps
    ├── Comparisons.md                # X vs Y visualizations
    ├── Frameworks.md                 # 2x2 matrices, mental models
    ├── Taxonomies.md                 # Classification grids
    ├── Timelines.md                  # Chronological progressions
    ├── RecipeCards.md                # Step-by-step process cards
    ├── Stats.md                      # Big number stat cards
    ├── Aphorisms.md                  # Quote/aphorism cards
    └── AnnotatedScreenshots.md       # Screenshot markup

.claude/Skills/CORE/
└── Aesthetic.md                      # Core visual aesthetic (334 lines)
```

### Current Style: "Tron-meets-Excalidraw"

The current system is **hardcoded to a single aesthetic**:

| Element | Current Value |
|---------|---------------|
| **Philosophy** | "Digital Warmth" - Technology with humanity |
| **Background** | Deep Slate #1A202C or Pure Black #000000 |
| **Primary Lines** | Bright White #FFFFFF, Light Gray #E2E8F0 |
| **Accent 1** | Neon Orange #FF6B35 (Anthropic warmth) |
| **Accent 2** | Cyan Glow #00D9FF (Tron digital) |
| **Supporting** | Deep Purple #4A148C, Deep Teal #00796B |
| **Linework** | Excalidraw-style hand-drawn, imperfect, variable weight |
| **Composition** | 2-4 elements, 40-50% negative space, asymmetric |

### Alternative Style in Workflow.md: "Anthropic Editorial"

The `Workflow.md` uses a **different aesthetic** (New Yorker / Saul Steinberg):

| Element | Editorial Style Value |
|---------|----------------------|
| **Philosophy** | Editorial conceptual illustration |
| **Background** | White #FFFFFF (for transparency removal) or muted earth tones |
| **Primary Lines** | Black #000000 (dominant) |
| **Accents** | Deep Purple #4A148C, Deep Teal #00796B |
| **Linework** | Saul Steinberg / New Yorker / risograph aesthetic |
| **Composition** | 2-3 elements, full-bleed edge-to-edge |

---

## Gap Analysis: Style System Requirements

### Current Limitations

1. **Single Hardcoded Style** - Aesthetic is embedded in workflow files, not parameterized
2. **No Style Selection** - CLI has no `--style` flag
3. **No Style Definitions** - No structured format for defining new styles
4. **Style Mixed with Workflow** - Visual rules interleaved with process rules

### Required Capabilities

1. **Named Style Definitions** - JSON/YAML files defining visual parameters
2. **Runtime Style Selection** - `--style <name>` flag in CLI
3. **Style Inheritance** - Base styles with overrides
4. **Prompt Template Integration** - Styles inject into prompt construction
5. **Validation Rules per Style** - Different "must have" / "must not have" per style

---

## Proposed Extraction Architecture

### 1. Directory Structure for Extracted Project

```
claude-art/
├── README.md                         # Documentation
├── package.json                      # Dependencies (Bun/Node compatible)
├── src/
│   ├── cli.ts                        # Main CLI entry point
│   ├── generate.ts                   # Image generation logic
│   ├── prompt-builder.ts             # Prompt construction with style injection
│   └── validators/
│       └── image-validator.ts        # Style-aware validation
├── styles/                           # Style definition files
│   ├── _base.yaml                    # Base style (shared defaults)
│   ├── tron-excalidraw.yaml          # Tron meets Excalidraw
│   ├── anthropic-editorial.yaml      # Saul Steinberg / New Yorker
│   ├── corporate-minimal.yaml        # Clean corporate
│   └── custom/                       # User custom styles
├── workflows/                        # Workflow templates (style-agnostic)
│   ├── editorial.md
│   ├── diagram.md
│   ├── data-viz.md
│   └── ...
├── skills/                           # Claude Code skill files
│   └── SKILL.md                      # Main skill definition
└── .env.example                      # API key template
```

### 2. Style Definition Schema

```yaml
# styles/anthropic-editorial.yaml
name: anthropic-editorial
description: "Saul Steinberg / New Yorker editorial illustration style"
version: "1.0"

# Inherit from base (optional)
extends: _base

# Color palette
colors:
  background:
    primary: "#FFFFFF"       # White (for transparency removal)
    secondary: "#F5E6D3"     # Light cream
    options:                 # Alternative backgrounds
      - "#F4D7C8"            # Peach
      - "#D4C5B9"            # Warm taupe
      - "#C5D4C8"            # Sage

  linework:
    primary: "#000000"       # Black
    weight: "dominant"       # 70-80% of composition

  accents:
    primary:
      color: "#4A148C"       # Deep Purple
      usage: "key-elements"
      weight: "10-15%"
    secondary:
      color: "#00796B"       # Deep Teal
      usage: "supporting"
      weight: "5-10%"

  text:
    body: "#2D2D2D"          # Charcoal
    signature: "#2D2D2D"     # Charcoal

# Linework characteristics
linework:
  style: "hand-drawn"
  reference: ["Saul Steinberg", "New Yorker", "risograph"]
  characteristics:
    - "Variable stroke weight (thicker where pressure would be)"
    - "Imperfect, slightly wobbly lines (human quality)"
    - "Gestural brush strokes, NOT smooth vectors"
    - "Multiple overlapping strokes"
  avoid:
    - "Clean vector illustration"
    - "Perfectly smooth curves"
    - "Uniform stroke weight"
    - "Polished corporate graphics"

# Composition rules
composition:
  elements: "2-3 maximum"
  layout: "full-bleed edge-to-edge"
  aspect_ratios:
    preferred: "1:1"
    allowed: ["1:1", "16:9", "4:3"]
  negative_space: "30-40%"
  alignment: "asymmetric"

# Typography (if applicable)
typography:
  tiers:
    - name: "title"
      style: "Advocate Block Display"
      case: "ALL-CAPS"
    - name: "labels"
      style: "Concourse Sans"
      case: "mixed"
    - name: "annotations"
      style: "Advocate Condensed Italic"
      case: "mixed"

# Prompt modifiers (injected into prompts)
prompt_injection:
  positive:
    - "Editorial conceptual illustration"
    - "Saul Steinberg / New Yorker style"
    - "Hand-drawn black ink linework"
    - "Imperfect, gestural brush strokes"
    - "Risograph aesthetic"
    - "Flat colors only"
  negative:
    - "gradients"
    - "shadows"
    - "3D rendering"
    - "glossy surfaces"
    - "smooth perfect vector lines"
    - "photorealistic"

# Validation rules
validation:
  must_have:
    - "Flat background (zero gradients)"
    - "Hand-drawn quality lines"
    - "Black linework (not smooth vectors)"
    - "Abstract metaphorical composition"
    - "Color accents visible (not microscopic)"
  must_not_have:
    - "Gradients anywhere"
    - "Shadows or glows"
    - "3D rendering or depth"
    - "Saturated or cool colors"
    - "Photorealistic elements"

# Signature
signature:
  text: "{{{assistantName}}}"
  position: "bottom-right"
  color: "#2D2D2D"
  size: "tiny"
```

### 3. CLI Interface Changes

```bash
# Current (no style support)
bun run generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "..." \
  --size 2K

# Proposed (with style support)
bun run claude-art generate \
  --model nano-banana-pro \
  --style anthropic-editorial \
  --prompt "..." \
  --size 2K \
  --output image.png

# List available styles
bun run claude-art styles list

# Show style details
bun run claude-art styles show anthropic-editorial

# Create custom style (interactive)
bun run claude-art styles create my-style

# Validate image against style
bun run claude-art validate --style anthropic-editorial image.png
```

### 4. Prompt Builder Integration

```typescript
// src/prompt-builder.ts

interface StyleDefinition {
  name: string;
  colors: ColorPalette;
  linework: LineworkStyle;
  composition: CompositionRules;
  prompt_injection: PromptModifiers;
  validation: ValidationRules;
}

function buildPrompt(
  userPrompt: string,
  style: StyleDefinition,
  workflow: WorkflowType
): string {
  const parts: string[] = [];

  // Add style reference
  parts.push(`Style: ${style.prompt_injection.positive.join(', ')}`);

  // Add background
  parts.push(`Background: ${style.colors.background.primary}`);

  // Add linework style
  parts.push(`Linework: ${style.linework.characteristics.join('. ')}`);

  // Add composition rules
  parts.push(`Composition: ${style.composition.elements}, ${style.composition.layout}`);

  // Add user prompt
  parts.push(userPrompt);

  // Add negative prompt
  parts.push(`AVOID: ${style.prompt_injection.negative.join(', ')}`);

  // Add signature
  parts.push(`Sign "${style.signature.text}" ${style.signature.position}`);

  return parts.join('\n\n');
}
```

---

## Extraction Steps

### Phase 1: Core Infrastructure

1. **Create new project structure**
   - Initialize package.json with dependencies
   - Set up TypeScript configuration
   - Create src/ directory structure

2. **Extract generation tool**
   - Copy `generate-ulart-image.ts` as base
   - Refactor to separate concerns (CLI, generation, validation)
   - Add style loading mechanism

3. **Create style definition system**
   - Define YAML/JSON schema for styles
   - Create style loader utility
   - Implement style validation

### Phase 2: Style System

4. **Convert existing aesthetics to style files**
   - Create `tron-excalidraw.yaml` from `Aesthetic.md`
   - Create `anthropic-editorial.yaml` from `Workflow.md`
   - Identify common base (`_base.yaml`)

5. **Implement prompt builder**
   - Style-aware prompt construction
   - Template variable injection
   - Negative prompt handling

6. **Add CLI style flags**
   - `--style <name>` flag
   - `styles list` command
   - `styles show <name>` command

### Phase 3: Workflows

7. **Extract workflows**
   - Make workflows style-agnostic
   - Reference styles by name, not inline
   - Keep process steps, parameterize visual rules

8. **Create skill definition**
   - Write SKILL.md for Claude Code
   - Document style selection triggers
   - Include workflow routing

### Phase 4: Polish

9. **Documentation**
   - README with usage examples
   - Style creation guide
   - API reference

10. **Validation system**
    - Style-specific validation rules
    - Image analysis (if feasible)
    - Regeneration guidance

---

## Pre-Defined Styles to Include

| Style Name | Description | Use Case |
|------------|-------------|----------|
| `tron-excalidraw` | Dark backgrounds, neon accents, hand-drawn | Technical diagrams, developer content |
| `anthropic-editorial` | New Yorker style, black linework, earth tones | Blog headers, editorial illustrations |
| `corporate-minimal` | Clean, professional, minimal color | Business presentations, slides |
| `data-journalism` | Infographic style, high information density | Data visualizations, reports |
| `sketch-notes` | Casual hand-drawn, whiteboard aesthetic | Process documentation, tutorials |
| `neon-cyberpunk` | High contrast, vibrant neon, dark | Gaming, tech, futuristic content |
| `vintage-risograph` | Limited palette, textured, retro | Creative, artistic, indie content |

---

## API Keys Required

```bash
# .env.example
REPLICATE_API_TOKEN=     # Flux, Nano Banana (Replicate)
OPENAI_API_KEY=          # GPT-image-1
GOOGLE_API_KEY=          # Nano Banana Pro (Gemini 3 Pro)
REMOVEBG_API_KEY=        # Background removal (optional)
```

---

## Dependencies

```json
{
  "dependencies": {
    "replicate": "^1.0.0",
    "openai": "^4.0.0",
    "@google/genai": "^1.0.0",
    "yaml": "^2.0.0",
    "commander": "^12.0.0",
    "chalk": "^5.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/node": "^20.0.0",
    "bun-types": "latest"
  }
}
```

---

## Summary

The art skill extraction requires:

1. **Separating style from workflow** - Visual parameters become data, not code
2. **Creating a style definition schema** - YAML/JSON format for styles
3. **Refactoring the CLI** - Add `--style` flag and style management commands
4. **Building a prompt construction layer** - Style-aware prompt building
5. **Converting existing aesthetics** - Port current hardcoded styles to files

The result will be a **modular, extensible art generation system** where:
- Users can select from pre-defined styles
- New styles can be added without code changes
- Workflows remain process-focused, referencing styles by name
- Validation rules are style-specific

---

*Generated for extraction analysis - Last updated: 2026-01-26*
