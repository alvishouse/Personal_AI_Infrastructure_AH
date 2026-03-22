# Da Vinci Stats Workflow

**Hand-drawn stat cards with big numbers using Leonardo notebook aesthetic.**

Creates **STAT CARDS** — striking single statistics with Da Vinci construction.

---

## Purpose

Stat cards show:
- Key metrics
- Big numbers
- Impactful statistics
- Data highlights
- Percentage/growth figures

---

## 🚨 WORKFLOW STEPS

### Step 1: Extract Stat Elements

```
STAT: [The number — e.g., "73%", "2.4M", "10x"]
LABEL: [What it measures]
CONTEXT: [What makes it significant]
```

---

### Step 2: Construct Prompt

```
Stat card in Leonardo da Vinci notebook style
on warm parchment background (#ECE6D9).

STATISTIC: [Number]
LABEL: [What it measures]

LAYOUT:
- Large number as hero element (40-50% of frame)
- Label below or beside
- Supporting context as annotation
- Visual construction around number

NUMBER TREATMENT:
- Hand-lettered large numeral
- Burnt copper (#CF5828) for the number itself
- Construction lines showing numeral proportions
- Variable stroke weight (thicker strokes)

LABEL:
- Deep slate blue (#3B546B)
- Hand-lettered Montserrat style
- Smaller than number
- Clear and readable

VISUAL CONTEXT:
- Small sketch illustrating the metric
- Trend arrow if showing change
- Scale or comparison element
- Proportion marks around number

CONSTRUCTION:
- Guide lines for number placement
- Golden ratio construction visible
- Measurement ticks for scale
- Ghost circles around numeral

CRITICAL:
- Number is HERO — large and prominent
- Burnt copper for impact
- Hand-drawn not typed
- Leonardo notebook aesthetic
- Construction geometry visible
```

---

### Step 3: Execute

```bash
bun run ~/.claude/Skills/Art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "[YOUR PROMPT]" \
  --size 2K \
  --aspect-ratio 1:1 \
  --output /path/to/stat.png
```

**Square (1:1)** for social sharing, **16:9** for presentations.

---

### Step 4: Validation

**Must Have:**
- [ ] Large, prominent number
- [ ] Burnt copper number color
- [ ] Clear label
- [ ] Hand-lettered numerals
- [ ] Construction geometry

**Must NOT Have:**
- [ ] Typed font numbers
- [ ] Corporate chart style
- [ ] Cluttered context
- [ ] Small/buried statistic
