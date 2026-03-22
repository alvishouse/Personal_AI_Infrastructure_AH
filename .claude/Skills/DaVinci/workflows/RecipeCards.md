# Da Vinci Recipe Card Workflow

**Hand-drawn step-by-step instructions using Leonardo notebook aesthetic.**

Creates **RECIPE CARDS** — numbered step sequences with Da Vinci construction.

---

## Purpose

Recipe cards show:
- How-to instructions
- Step-by-step processes
- Tutorial sequences
- Setup guides
- Procedures

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Steps

```
RECIPE: [Title — what you're creating/doing]

STEPS:
1. [Action verb] [Object] — [Brief detail]
2. [Action verb] [Object] — [Brief detail]
3. [Action verb] [Object] — [Brief detail]
4. [Action verb] [Object] — [Brief detail]
```

**Max:** 4-6 steps for clarity

---

### Step 2: Construct Prompt

```
Step-by-step recipe card in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

RECIPE: [Title]

STEPS LAYOUT:
- Numbered steps flowing down or across
- Each step in its own hand-drawn container
- Connecting arrows between steps
- Clear visual sequence

STEP 1: [Action]
- Draw: Hand-drawn numbered circle "1"
- Content: [Brief instruction]
- Icon: [Small sketch of action]

STEP 2: [Action]
- Draw: Hand-drawn numbered circle "2"
- Arrow from Step 1
- Content: [Brief instruction]

STEP 3: [Action]
- Draw: Hand-drawn numbered circle "3"
- Arrow from Step 2
- Content: [Brief instruction]

STEP 4 (Key step): [Action]
- Draw: Burnt copper (#CF5828) numbered circle
- This is the crucial step
- Content: [Brief instruction]

VISUAL STYLE:
- Deep slate blue (#3B546B) linework
- Hand-lettered numbers and text
- Sketchy containers for each step
- Variable line weight on arrows

CONSTRUCTION:
- Alignment guides visible
- Proportion marks on sequence
- Ghost lines showing flow

CRITICAL:
- Hand-drawn imperfect numbers
- Clear step sequence
- Not a corporate infographic
- Leonardo notebook aesthetic
```

---

### Step 3: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 9:16 \
  --output /path/to/recipe.png
```

**Vertical (9:16)** works best for step sequences.

---

### Step 4: Validation

**Must Have:**
- [ ] Clear step numbers
- [ ] Logical sequence flow
- [ ] Readable instructions
- [ ] Hand-drawn containers
- [ ] Key step highlighted

**Must NOT Have:**
- [ ] Confusing order
- [ ] Too many steps
- [ ] Perfect vector shapes
