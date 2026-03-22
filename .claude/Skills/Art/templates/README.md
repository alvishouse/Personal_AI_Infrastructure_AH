# Art Style Templates

Reusable prompt templates for generating consistent visual styles across any content.

---

## Available Templates

### ModernAlchemist_Template.txt

**Purpose:** Universal template for creating Modern Alchemist images from scratch.

**What it includes:**
- Complete style specification (cream background, faint grid, mono-line vectors, gold accents)
- Placeholder sections for your custom content
- Typography guidelines (serif headings, sans-serif body)
- Composition guidance
- Optional elements (metaphors, formulas, annotations)
- Usage instructions and quick-start examples

**When to use:**
- Blog featured images requiring professional authority
- Strategic framework visualizations
- Business concept diagrams
- Thought leadership content
- Executive presentation graphics
- Any content requiring sophisticated intellectual aesthetic

**How to use:**
1. Copy the template content
2. Replace [bracketed placeholders] with your specific content
3. Choose which optional sections to include
4. Specify composition details and hierarchy
5. Generate image with completed prompt

### ModernAlchemist_FromReferenceImage.txt

**Purpose:** Template for converting reference images to Modern Alchemist style.

**What it includes:**
- Reference image analysis framework
- Style translation rules (background → colors → lines → typography)
- Conversion examples for common image types (whiteboard, napkin, watercolor, etc.)
- Preserves concept while transforming aesthetic
- Quick reference checklist

**When to use:**
- Have existing image in different style that needs rebranding
- Want to recreate competitor content in your brand style
- Need to maintain concept but elevate aesthetic to professional
- Converting informal sketches to polished diagrams
- Standardizing visual brand across mixed content sources

**How to use:**
1. Provide reference image to PAI: "analyze this image and generate a prompt using the modern alchemist style"
2. PAI automatically analyzes reference and maps to Modern Alchemist aesthetic
3. Generated prompt preserves concept while transforming style
4. Generate image with resulting prompt

---

## Template Structure

All style templates follow this structure:

1. **Style Definition** - Core aesthetic characteristics
2. **Background Specification** - Colors, textures, grids
3. **Line Work Rules** - Weight, style, precision
4. **Content Placeholders** - Main elements, supporting elements
5. **Color Palette** - Primary, accents, usage rules
6. **Typography Guidelines** - Fonts, hierarchy, placement
7. **Composition Guidance** - Layout, hierarchy, spacing
8. **Critical Characteristics** - Non-negotiable style elements
9. **Usage Instructions** - How to customize the template
10. **Quick Start Examples** - Common use cases

---

## Creating Images from Templates

### Step 1: Customize Template
Copy template and fill in all [placeholders] with your specific content.

### Step 2: Save Custom Prompt
Save completed prompt to a file:
```bash
/home/alvis/.claude/Scratchpad/blog/images/prompt_[your_concept]_modernalchemist.txt
```

### Step 3: Generate Image
```bash
generate-ulart-image \
  --prompt-file /path/to/your/prompt.txt \
  --output /path/to/output.png \
  --size 2K \
  --aspect-ratio 16:9
```

---

## Style Consistency

**Why use templates?**

Templates ensure visual consistency across all your content:
- Same color palette every time
- Same line quality and precision
- Same typographic hierarchy
- Same grid structure and spacing
- Recognizable brand aesthetic

**Building a visual identity:**
1. Use the same template for all content in a series
2. Only vary the content (elements, text, concepts)
3. Keep style characteristics identical
4. Result: Cohesive visual brand

---

## Template Customization Guidelines

### What to Change
✓ Concept description (your strategic idea)
✓ Main elements (your specific visuals)
✓ Typography content (your headings, labels)
✓ Composition specifics (placement, percentages)
✓ Which elements get gold accent
✓ Annotations and callouts

### What NOT to Change
✗ Background color (#F5F5DC)
✗ Grid specification (faint, not strong)
✗ Primary color (#2C2C2C)
✗ Accent color (#C5A059)
✗ Line weight rule (mono-line uniform)
✗ 3-color palette restriction
✗ Grid visibility rule (barely visible)

**Consistency comes from keeping style rules constant while varying content.**

---

## Common Use Cases

### Blog Series
Use same template for all posts in series:
- Only change: Main concept and elements
- Keep consistent: Style, colors, composition structure
- Result: Recognizable visual series

### Presentation Decks
Use template for all slides requiring diagrams:
- Only change: Framework, data, labels
- Keep consistent: Style aesthetic, professional authority
- Result: Cohesive presentation visual language

### Social Media Content
Use template for all strategic posts:
- Only change: Concept and text
- Keep consistent: Modern Alchemist sophistication
- Result: Recognizable brand aesthetic on social

### Newsletter Headers
Use template for weekly/monthly headers:
- Only change: Issue number, featured concept
- Keep consistent: Professional technical aesthetic
- Result: Newsletter visual identity

---

## Template Best Practices

### 1. Start Simple
First time using a template:
- Use one of the quick-start examples
- Minimal customization
- Get comfortable with the structure

### 2. Build a Library
Save completed prompts for reuse:
- Organize by content type or topic
- Reference previous prompts for consistency
- Build visual pattern library over time

### 3. Iterate and Refine
Generate test images:
- Compare to style reference
- Adjust emphasis or composition if needed
- Refine accent color placement
- Document what works

### 4. Maintain Discipline
Style consistency requires discipline:
- Resist urge to add extra colors
- Don't make grid stronger "just this once"
- Keep line weight uniform
- Trust the template constraints

---

## Future Templates

Additional style templates planned:
- **DaVinci_Template.txt** - Renaissance notebook aesthetic
- **Excalidraw_Template.txt** - Digital whiteboard style
- **Napkin_Template.txt** - Spontaneous sketch aesthetic

Each will follow same structure as Modern Alchemist template.

---

## Questions or Issues

**Template not working as expected?**
1. Check that all [placeholders] are replaced
2. Verify 3-color palette is maintained
3. Confirm grid specification is "faint" not "strong"
4. Review Critical Characteristics section

**Need help customizing?**
Review the Quick Start Examples in the template file for common patterns.

**Want to suggest improvements?**
Templates evolve based on usage. Document what works and what doesn't.

---

**Remember: Templates are about consistency, not constraint. They free you to focus on content while maintaining professional visual quality.**
