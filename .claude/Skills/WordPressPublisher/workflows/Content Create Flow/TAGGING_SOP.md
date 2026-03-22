# Content Tagging SOP: Callout Boxes & Image Insertion

**Purpose:** Standard Operating Procedure for tagging images and callout boxes in cornerstone content drafts before WordPress conversion.

---

## Quick Reference Card

```
IMAGES:           <!-- IMAGE ... -->
MECHANISM:        > **[MECHANISM]** LABEL
WARNING:          > **[WARNING]** LABEL
INSIGHT:          > **[INSIGHT]** LABEL
TIP:              > **[TIP]** LABEL
PULL QUOTE:       > **[PULLQUOTE]**
STAT:             > **[STAT: XX%]**
BLOCKQUOTE:       > Quote text
                  > — Attribution
```

**Why this syntax?** The blockquote `>` creates visual indentation in any markdown preview, and the bold `**[TYPE]**` prefix is immediately visible. BrandHTMLConverter parses these into styled HTML callout boxes.

---

## 1. Image Insertion Tags

### Syntax

```markdown
<!-- IMAGE
Type: [featured|diagram|inline|chart]
Concept: [Detailed description for art generation]
Style: [Modern Alchemist|Excalidraw|Napkin|Photo]
Size: [WIDTHxHEIGHT]
Alt Text: [Accessibility description]
-->
```

### Image Types

| Type | Purpose | Typical Size | Placement |
|------|---------|--------------|-----------|
| `featured` | Hero/thumbnail image | 1200x630 | After deck, before first section |
| `diagram` | Framework/process visual | 800x800 | Within framework explanation |
| `inline` | Supporting visual | 800x500 | Within body content |
| `chart` | Data visualization | 800x500 | Near statistics/data |

### Style Options

| Style | Description | Best For |
|-------|-------------|----------|
| `Modern Alchemist` | Your brand visual style | Featured images, hero shots |
| `Excalidraw` | Hand-drawn sketch look | Frameworks, diagrams |
| `Napkin` | Quick sketch on napkin | Simple concepts, graphs |
| `Photo` | Photographic style | Real-world examples |

### Examples

**Featured Image:**
```markdown
<!-- IMAGE
Type: featured
Concept: A visual metaphor showing two paths diverging - one labeled "Wait for Proof" leading to a shrinking spiral, another labeled "Grow With" leading to an expanding compound curve.
Style: Modern Alchemist
Size: 1200x630
Alt Text: Two diverging paths illustrating the compound difference between waiting for proven AI solutions versus growing with emerging partners
-->
```

**Framework Diagram:**
```markdown
<!-- IMAGE
Type: diagram
Concept: A flywheel diagram with four connected segments: "Partner Early" → "Accept Failure as Investment" → "Compound the Learning" → "Recycle the Capital" → back to "Partner Early". Arrows show momentum building with each cycle. Center text: "The Grow-With Model"
Style: Excalidraw
Size: 800x800
Alt Text: Flywheel diagram showing the four interconnected stages of the Grow-With Model
-->
```

**Inline Graph:**
```markdown
<!-- IMAGE
Type: inline
Concept: A compound growth curve showing two lines starting from the same point. One line (labeled "Start Now") curves sharply upward. The other line (labeled "Wait for Proof") stays flat for 2-3 years then begins rising — but never catches the first line. The vertical gap is labeled "The Unbridgeable Gap"
Style: Napkin
Size: 800x500
Alt Text: Graph showing compound learning curves demonstrating how early AI adoption creates an exponentially growing advantage
-->
```

### Placement Rules

1. **Featured image:** Always immediately after the deck paragraph (bold intro), before the `---` divider
2. **Diagrams:** Place immediately after explaining a concept, before detailed breakdown
3. **Inline images:** Place near the content they illustrate
4. **Charts:** Place immediately after citing the statistic

---

## 2. Callout Box Tags

### Syntax (Visual Markdown)

Uses blockquote `>` for visual indentation + bold `**[TYPE]**` prefix for easy identification:

```markdown
> **[MECHANISM]** LABEL
>
> **Bold statement or title**
>
> Supporting text and explanation.
```

**Why this works:**
- Blockquote `>` creates visual indentation in ANY markdown preview
- Bold `**[TYPE]**` is immediately visible
- BrandHTMLConverter parses these into proper HTML callout boxes

### Callout Types

| Type | Markdown Prefix | HTML Class | Use For |
|------|-----------------|------------|---------|
| Mechanism | `> **[MECHANISM]**` | `callout mechanism` | Core frameworks, how-it-works |
| Insight | `> **[INSIGHT]**` | `callout insight` | Key takeaways, aha moments |
| Warning | `> **[WARNING]**` | `callout warning` | Common mistakes, cautions |
| Tip | `> **[TIP]**` | `callout tip` | Practical advice |

### Examples

**Mechanism (How it works):**
```markdown
> **[MECHANISM]** CORE INSIGHT
>
> **Technology adoption follows human adoption patterns, not deployment schedules.**
>
> If your team doesn't understand why they're using AI, they won't use it effectively—no matter how sophisticated the tool.
```

**Warning (Common mistake):**
```markdown
> **[WARNING]** COMMON MISTAKE
>
> Optimizing for efficiency before understanding your competitive advantage will commoditize your team.
>
> The companies winning with AI aren't asking "how do we do this faster?" They're asking "what becomes possible when our best people have infinite leverage?"
```

**Insight (Key takeaway):**
```markdown
> **[INSIGHT]** KEY TAKEAWAY
>
> **The future belongs to organizations that use AI to multiply what makes their people irreplaceable.**
>
> Efficiency is table stakes. Amplification is competitive advantage.
```

**Tip (Practical advice):**
```markdown
> **[TIP]** PRO TIP
>
> Start your shadow AI audit by asking customer-facing employees what tools they're already using. You'll often find the best use cases are already happening unofficially.
```

### Label Conventions

| Label | When to Use |
|-------|-------------|
| `CORE INSIGHT` | Central thesis or mechanism |
| `KEY TAKEAWAY` | Summary of a section |
| `COMMON MISTAKE` | Warning about pitfalls |
| `PRO TIP` | Practical implementation advice |
| `HOW THIS WORKS` | Explaining a mechanism |
| `IMPORTANT` | Critical information |
| `REMEMBER` | Key point to retain |

---

## 3. Pull Quotes

### Syntax

```markdown
> **[PULLQUOTE]**
>
> Memorable standalone line that captures the essence of the article.
```

### Example

```markdown
> **[PULLQUOTE]**
>
> In AI economics, waiting for proof is the proof that you'll arrive too late.
```

### Rules

- Maximum 25 words
- No attribution (save those for blockquotes)
- Should be tweetable/shareable
- Place 1-2 per 1000 words of content

---

## 4. Stat Highlights

### Syntax

```markdown
> **[STAT: 42%]**
>
> Description of what this statistic means and its source.
```

### Example

```markdown
> **[STAT: 71%]**
>
> of employees are already using AI tools — with or without corporate strategy.
> *Source: Salesforce 2024 State of IT Report*
```

### Rules

- Number should be impactful and memorable
- Include source attribution
- Use sparingly (1-2 per article)

---

## 5. Standard Blockquotes (with Attribution)

### Syntax

```markdown
> Quote text here. Can be multiple sentences. This is what someone actually said.
>
> — Name, Title, Organization
```

### Example

```markdown
> We stopped asking AI to do our work. We started asking it to show us work we didn't know existed.
>
> — Chief Strategy Officer, Global Financial Services
```

### Rules

- Use for real quotes from real people
- Include attribution with em-dash (—)
- Can use title/organization if name is confidential

---

## 6. Framework Boxes

### Syntax

```markdown
> **[FRAMEWORK]** FRAMEWORK NAME
>
> **Step 1: First Stage**
> Description of first stage.
>
> **Step 2: Second Stage**
> Description of second stage.
>
> **Step 3: Third Stage**
> Description of third stage.
```

### Example

```markdown
> **[FRAMEWORK]** THE GROW-WITH MODEL
>
> **Stage 1: Partner Early**
> Find promising AI partners before they're proven. Accept some will fail.
>
> **Stage 2: Accept Failure as Investment**
> Reframe failures as tuition for catching future giants.
>
> **Stage 3: Compound the Learning**
> Build institutional knowledge that grows exponentially.
>
> **Stage 4: Recycle the Capital**
> Extract learning from failures and redeploy quickly.
```

---

## 7. Complete Tagging Checklist

### Pre-Tagging Review

Before tagging, ensure the draft has:
- [ ] Clear section headers (H2, H3)
- [ ] Identified key insights/mechanisms
- [ ] Statistics with sources
- [ ] Quotable moments
- [ ] Framework or model to visualize

### Tagging Pass

Go through the draft and add:

**Images (3-5 per cornerstone):**
- [ ] Featured image after deck
- [ ] Framework diagram (if applicable)
- [ ] 1-2 supporting inline images
- [ ] Charts for key statistics (if applicable)

**Callouts (3-6 per cornerstone):**
- [ ] 1-2 mechanism/insight callouts for key concepts
- [ ] 1 warning callout for common mistakes
- [ ] 1 key takeaway near the end

**Pull Quotes (2-4 per cornerstone):**
- [ ] 1 near the opening (hook)
- [ ] 1-2 in the body (memorable lines)
- [ ] 1 near the close

**Stats (1-2 per cornerstone):**
- [ ] Highlight most impactful statistics
- [ ] Ensure sources are attributed

**Blockquotes (1-3 per cornerstone):**
- [ ] Real quotes with attribution
- [ ] Case study quotes

---

## 8. Placement Guide

### Typical Cornerstone Structure

```
# Title
## Subtitle (deck)

<!-- IMAGE: featured -->

---

## Opening Section
[Content]

:::pullquote
[Memorable opening hook]
:::

[More content]

---

## Framework Section

<!-- IMAGE: diagram -->

[Framework explanation]

:::mechanism HOW THIS WORKS
[Core mechanism explanation]
:::

[Stage breakdowns]

---

## Evidence Section

[Case studies]

> [Quote from case study]
> — Attribution

:::stat XX%
[Impactful statistic]
:::

<!-- IMAGE: inline (optional chart) -->

---

## Myth/Mindset Section

:::warning COMMON MISTAKE
[What to avoid]
:::

[Reframe]

---

## Application Section

[How to implement]

:::tip PRO TIP
[Practical advice]
:::

---

## Close

:::insight KEY TAKEAWAY
[Summary of main point]
:::

:::pullquote
[Final memorable statement]
:::

[Call to action]
```

---

## 9. Conversion Notes

### How Tags Convert to HTML

| Markdown Tag | HTML Output |
|--------------|-------------|
| `<!-- IMAGE -->` | Extracted to image manifest, placeholder left |
| `> **[MECHANISM]** LABEL` | `<div class="callout mechanism"><div class="label">LABEL</div>...` |
| `> **[WARNING]** LABEL` | `<div class="callout warning"><div class="label">LABEL</div>...` |
| `> **[INSIGHT]** LABEL` | `<div class="callout insight"><div class="label">LABEL</div>...` |
| `> **[TIP]** LABEL` | `<div class="callout tip"><div class="label">LABEL</div>...` |
| `> **[PULLQUOTE]**` | `<div class="pull-quote">...` |
| `> **[STAT: XX%]**` | `<div class="stat-highlight"><div class="stat-number">XX%</div>...` |
| `> **[FRAMEWORK]** NAME` | `<div class="framework-box"><h3>NAME</h3>...` |
| `> Quote text` + `> — Attribution` | `<blockquote>...<cite>Attribution</cite></blockquote>` |

### Parser Logic

BrandHTMLConverter detects callout blocks by:
1. Finding blockquote lines starting with `> **[`
2. Extracting the TYPE from between `[` and `]`
3. Extracting the LABEL (text after `]**`)
4. Converting remaining blockquote content to callout body

### WordPress Rendering

All elements require CSS to be loaded either:
1. **Inline styles** (embedded in HTML)
2. **Site-wide CSS** (in Elementor Custom CSS)

See `AESTHETIC_ELEMENTS_COMPATIBILITY.md` for CSS details.

---

## 10. Examples from Real Content

### From "Playing It Safe Illusion" Cornerstone

**Featured Image:**
```markdown
<!-- IMAGE
Type: featured
Concept: A visual metaphor showing two paths diverging - one labeled "Wait for Proof" leading to a shrinking spiral, another labeled "Grow With" leading to an expanding compound curve. The paths start at the same point but end in dramatically different places.
Style: Modern Alchemist
Size: 1200x630
Alt Text: Two diverging paths illustrating the compound difference between waiting for proven AI solutions versus growing with emerging partners
-->
```

**Framework Diagram:**
```markdown
<!-- IMAGE
Type: diagram
Concept: A flywheel diagram with four connected segments: "Partner Early" → "Accept Failure as Investment" → "Compound the Learning" → "Recycle the Capital" → back to "Partner Early". Arrows show momentum building with each cycle. Center text: "The Grow-With Model"
Style: Excalidraw
Size: 800x800
Alt Text: Flywheel diagram showing the four interconnected stages of the Grow-With Model
-->
```

**Inline Chart:**
```markdown
<!-- IMAGE
Type: inline
Concept: A compound growth curve showing two lines starting from the same point. One line (labeled "Start Now") curves sharply upward. The other line (labeled "Wait for Proof") stays flat for 2-3 years then begins rising — but never catches the first line. The vertical gap between them is labeled "The Unbridgeable Gap"
Style: Napkin
Size: 800x500
Alt Text: Graph showing compound learning curves that demonstrate how early AI adoption creates an exponentially growing advantage that late starters cannot close
-->
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-02-01 | Initial SOP created |
| 1.1 | 2026-02-01 | Updated to visual blockquote syntax (`> **[TYPE]**`) for markdown preview compatibility |
