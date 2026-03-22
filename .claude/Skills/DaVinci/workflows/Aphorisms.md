# Da Vinci Aphorism Workflow

**Hand-drawn quote cards using Leonardo notebook aesthetic.**

Creates **QUOTE CARDS** — wisdom framed with Da Vinci construction.

---

## Purpose

Aphorism cards show:
- Memorable quotes
- Key insights
- Wisdom statements
- Pull quotes
- Principle declarations

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Quote Elements

```
QUOTE: "[The actual quote text]"
ATTRIBUTION: — [Author/Source]
CONTEXT: [Optional — what it relates to]
```

---

### Step 2: Construct Prompt

```
Quote card in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

QUOTE: "[The quote text]"
ATTRIBUTION: [Author]

LAYOUT:
- Quote as central text element
- Hand-lettered typography (Montserrat style interpretation)
- Attribution below, smaller
- Visual framing elements around

TYPOGRAPHY:
- Quote in deep slate blue (#3B546B)
- Hand-drawn letterforms, imperfect spacing
- Key word in burnt copper (#CF5828) for emphasis
- Attribution in muted steel gray (#7A8C9B)

FRAMING:
- Hand-drawn border or bracket elements
- Construction lines visible at corners
- Proportion marks suggesting golden ratio
- Small decorative elements (sketchy flourishes)

VISUAL ELEMENTS (optional):
- Small metaphorical sketch relating to quote
- Geometric construction around key word
- Ghost guide lines for text alignment

CONSTRUCTION:
- Visible margin guidelines
- Proportion marks for text placement
- Center alignment guides (imperfect)
- Text baseline indicators

CRITICAL:
- Hand-lettered feel (not typed font)
- Visible construction geometry
- Not a Canva quote graphic
- Leonardo notebook aesthetic
- Feels like wisdom recorded in a journal
```

---

### Step 3: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/quote.png
```

**Square (1:1)** works best for quote cards.

---

### Step 4: Validation

**Must Have:**
- [ ] Readable quote text
- [ ] Clear attribution
- [ ] Hand-lettered aesthetic
- [ ] Key word emphasized
- [ ] Construction framing

**Must NOT Have:**
- [ ] Generic quote graphic look
- [ ] Typed font appearance
- [ ] Stock image backing
- [ ] Overcrowded decoration
