# Conversion Rules: Markdown to Aesthetic HTML

This file defines WHEN to create special aesthetic elements during markdown-to-HTML conversion. These are not 1:1 markdown mappings—they require interpretation of content meaning.

## Table of Contents

1. [Johnson Boxes / Callouts](#johnson-boxes--callouts)
2. [Statistics Highlights](#statistics-highlights)
3. [Pull Quotes](#pull-quotes)
4. [Blockquotes vs Pull Quotes](#blockquotes-vs-pull-quotes)
5. [Lead Sections](#lead-sections)
6. [Framework Visualizations](#framework-visualizations)
7. [Case Study Boxes](#case-study-boxes)
8. [CTA Boxes](#cta-boxes)
9. [Comparison Tables](#comparison-tables)
10. [Content Pattern Recognition](#content-pattern-recognition)

---

## Johnson Boxes / Callouts

### When to Create

Create a `.callout` box when content contains:

1. **Key insights or takeaways** — phrases like "here's the key," "the important thing," "remember this"
2. **Warnings or cautions** — "be careful," "avoid," "don't make this mistake"
3. **Definitions or core concepts** — when defining a term or framework
4. **Summary points** — condensed version of a longer argument
5. **Explicit callout markers** in markdown (see next section)

### Explicit Callout Syntax (Preferred)

Use blockquote + bold type prefix for visual markdown editing:

```markdown
> **[MECHANISM]** CORE INSIGHT
>
> **Bold statement here.**
>
> Supporting explanation text.
```

**Supported type prefixes:**

| Markdown Prefix | Creates Class | HTML Label |
|-----------------|---------------|------------|
| `> **[MECHANISM]** LABEL` | `.callout.mechanism` | LABEL text |
| `> **[INSIGHT]** LABEL` | `.callout.insight` | LABEL text |
| `> **[WARNING]** LABEL` | `.callout.warning` | LABEL text |
| `> **[TIP]** LABEL` | `.callout.tip` | LABEL text |
| `> **[PULLQUOTE]**` | `.pull-quote` | (no label) |
| `> **[STAT: XX%]**` | `.stat-highlight` | XX% as number |
| `> **[FRAMEWORK]** NAME` | `.framework-box` | NAME as h3 |

**Why this syntax?**
- Blockquote `>` creates visual indentation in any markdown preview
- Bold `**[TYPE]**` is immediately visible when editing
- Works with standard markdown editors (VS Code, Obsidian, etc.)

### Legacy Callout Markers (Also Supported)

These patterns are also recognized:
- `> **Key Insight:**` or `> **Note:**`
- Bold text followed by colon at start of blockquote

### Which Callout Type

| Content Type | Class | Label Text |
|--------------|-------|------------|
| Core insight, key point | `.callout.mechanism` | "Core Insight" or "Key Point" |
| Research finding, data | `.callout.insight` | "Key Research Finding" or "The Data" |
| Warning, caution, mistake | `.callout.warning` | "Warning" or "Caution" |
| Definition, concept | `.callout` (base) | "Definition" or concept name |
| Summary, takeaway | `.callout.mechanism` | "Key Takeaway" or "Summary" |

### Example Conversion

**Markdown:**
```markdown
> **Key Insight:** AI is a capability multiplier. When you multiply the wrong thing, you don't get efficiency—you get efficient destruction of value.
```

**HTML:**
```html
<div class="callout mechanism">
    <div class="label">Core Insight</div>
    <p><strong>AI is a capability multiplier.</strong></p>
    <p>When you multiply the wrong thing, you don't get efficiency—you get efficient destruction of value.</p>
</div>
```

---

## Statistics Highlights

### When to Create

Create a `.stat-highlight` box when:

1. **A prominent percentage or number** is the focal point of a paragraph
2. **Before/after comparisons** with specific metrics
3. **Research statistics** that deserve visual emphasis
4. Content contains patterns like:
   - "X% of companies..."
   - "grew from X to Y"
   - "increased by X%"
   - A number followed by explanatory context

### Recognition Patterns

Look for:
- Percentages at the start of sentences: "42% of companies..."
- Large numbers with context: "5,172 customer-support agents"
- Multipliers: "2x", "3x", "doubled", "tripled"
- Time comparisons: "up from 17% in 2024"

### Example Conversion

**Markdown:**
```markdown
42% of companies abandoned most of their AI initiatives this year—up from just 17% in 2024. The failure rate is *accelerating*.
```

**HTML:**
```html
<div class="stat-highlight">
    <div class="stat-number">42%</div>
    <div class="stat-label">of companies abandoned most of their AI initiatives this year—up from just 17% in 2024. The failure rate is <em>accelerating</em>.</div>
</div>
```

### When NOT to Create

- Statistics buried in longer paragraphs where they're not the main point
- Lists of multiple statistics (use a table instead)
- Numbers that are illustrative rather than impactful

---

## Pull Quotes

### When to Create

Create a `.pull-quote` when:

1. **A single powerful sentence** encapsulates the article's thesis
2. **Memorable, quotable lines** that could stand alone
3. **Transition statements** between major sections
4. Content is:
   - Short (1-3 sentences max)
   - Self-contained (makes sense without context)
   - Emotionally resonant or provocative

### Recognition Patterns

- Standalone paragraphs that are questions or declarations
- Lines that start with "The question isn't..." or "The difference is..."
- Aphoristic statements or "laws"
- Content the author clearly wants remembered

### Example Conversion

**Markdown:**
```markdown
You can't borrow someone else's answer to the question: "What makes our people great?"
```

**HTML:**
```html
<div class="pull-quote">
    You can't borrow someone else's answer to the question: "What makes our people great?"
</div>
```

### When NOT to Create

- Long explanatory passages
- Content that requires context to understand
- Multiple consecutive sentences that don't form a unified thought

---

## Blockquotes vs Pull Quotes

### Decision Tree

```
Is it attributed to a specific person/source?
├── YES → Use <blockquote> with <cite>
└── NO → Is it a memorable, standalone statement?
    ├── YES → Use .pull-quote
    └── NO → Is it a key insight or warning?
        ├── YES → Use .callout
        └── NO → Use standard <blockquote>
```

### Blockquote (with citation)

**Markdown:**
```markdown
> "I didn't leave because of the technology. I left because the technology showed me this company thinks my job is data processing."
> 
> — Exit interview, senior client advisor
```

**HTML:**
```html
<blockquote>
    <p>"I didn't leave because of the technology. I left because the technology showed me this company thinks my job is data processing."</p>
    <cite>— Exit interview, senior client advisor</cite>
</blockquote>
```

---

## Lead Sections

### When to Create

Create a `.lead-section` (dark ink wash background) for:

1. **Opening hook** — the first major content block after the header
2. **Fear lead or pattern interrupt** — provocative opening statements
3. Content that:
   - Sets up the article's central tension
   - Contains the "big idea" or thesis
   - Uses provocative or contrarian framing

### Recognition Patterns

- First 3-8 paragraphs that establish the problem
- Content before the first `## H2` heading
- Paragraphs with phrases like "Here's what nobody tells you" or "The uncomfortable truth"

### Example Conversion

**Markdown:**
```markdown
**That "best practice" everyone's following? It's why the smartest people in your organization are updating their LinkedIn profiles.**

Here's what nobody tells you about AI transformation:

The most dangerous failures don't come from doing things *wrong*.

They come from doing "best practices" *right*.
```

**HTML:**
```html
<section class="lead-section">
    <p><strong>That "best practice" everyone's following? It's why the smartest people in your organization are updating their LinkedIn profiles.</strong></p>
    
    <p>Here's what nobody tells you about AI transformation:</p>
    
    <p>The most dangerous failures don't come from doing things <em>wrong</em>.</p>
    
    <p>They come from doing "best practices" <em>right</em>.</p>
</section>
```

---

## Framework Visualizations

### When to Create

Create a `.framework-box` when content describes:

1. **A named framework or methodology** (e.g., "The Amplification Audit")
2. **A sequential process** with 3-5 distinct steps
3. **A transformation pattern** (before → after, input → output)

### Recognition Patterns

- Numbered steps or phases
- Arrow language: "leads to," "then," "followed by"
- Framework names with capitalization
- Content structured as: Step 1 → Step 2 → Step 3

### Example Conversion

**Markdown:**
```markdown
### The Amplification Audit

**PROTECT** → **ELIMINATE** → **AMPLIFY**

- Protect: What creates differentiation?
- Eliminate: What steals time from value work?
- Amplify: What happens with 2x capacity?

Human Domain → AI Elimination → Human Scale
```

**HTML:**
```html
<div class="framework-box">
    <h3>The Amplification Audit</h3>
    
    <div class="framework-visual">
        <div class="framework-step">
            <div class="step-title">PROTECT</div>
            <div class="step-desc">What creates differentiation?</div>
        </div>
        <div class="framework-arrow">→</div>
        <div class="framework-step">
            <div class="step-title">ELIMINATE</div>
            <div class="step-desc">What steals time from value work?</div>
        </div>
        <div class="framework-arrow">→</div>
        <div class="framework-step">
            <div class="step-title">AMPLIFY</div>
            <div class="step-desc">What happens with 2x capacity?</div>
        </div>
    </div>
    
    <p class="framework-summary">Human Domain → AI Elimination → Human Scale</p>
</div>
```

---

## Case Study Boxes

### When to Create

Create a `.case-study` box when content contains:

1. **Industry-specific examples** with before/after or comparison structure
2. **Pattern labels** like "Pattern 1:" or "Example:" or "Case Study:"
3. **Traditional vs. alternative approaches** being contrasted
4. **Concrete results** with metrics

### Recognition Patterns

- "Traditional approach:" vs "Our approach:" or "Amplification approach:"
- Industry identifiers: "The Law Firm," "Healthcare System," "Manufacturing"
- Result statements: "Result:" followed by metrics
- Strategy explanations: "The AI strategy:" or "What they did:"

### Structure to Extract

1. **Title**: Industry or pattern name
2. **Traditional approach**: What most organizations do
3. **Alternative approach**: The better way (with key insight bolded)
4. **Strategy**: How it was implemented
5. **Result**: Measurable outcomes

### Example Conversion

**Markdown:**
```markdown
### Pattern 1: The Law Firm

**Traditional approach:** Deploy AI for contract review. Reduce paralegal headcount.

**Amplification approach:** Ask the partners what clients pay $800 an hour for. Answer: **Negotiation strategy.**

**The AI strategy:** Eliminate everything that keeps partners away from negotiation strategy.

**Result:** Time to close deals dropped 30%. Win rate up 22%. Nobody lost their job.
```

**HTML (standalone preview):**
```html
<div class="case-study">
    ...
</div>
```

**HTML (WordPress output — always use inline style on outer div):**
```html
<div class="case-study" style="background: #ece6d9; border: 1px solid rgba(59,84,107,.22); border-radius: 10px; padding: 2em; margin: 2em 0;">
    <h4>Pattern 1: The Law Firm</h4>

    <div class="approach-comparison">
        <div class="approach traditional" style="background: #ffffff; border-left: 3px solid #7a8c9b;">
            <h5>Traditional Approach</h5>
            <p>Deploy AI for contract review. Reduce paralegal headcount.</p>
        </div>
        <div class="approach amplification" style="background: #ffffff; border-left: 3px solid #3b546b;">
            <h5>Amplification Approach</h5>
            <p>Ask the partners what clients pay $800 an hour for. Answer: <strong>Negotiation strategy.</strong></p>
        </div>
    </div>

    <p class="strategy"><strong>The AI strategy:</strong> Eliminate everything that keeps partners away from negotiation strategy.</p>

    <div class="result" style="background: #3b546b; padding: 1em; border-radius: 6px; margin-top: 1em;">
        <p style="margin: 0; color: rgba(255,255,255,.9);"><strong style="color: #fff;">Result:</strong> Time to close deals dropped 30%. Win rate up 22%. Nobody lost their job.</p>
    </div>
</div>
```

> **WordPress note:** `wpautop()` corrupts CSS variables inside embedded `<style>` blocks. The `background: var(--paper)` on the outer `.case-study` fails silently — the tan container becomes invisible. Inline styles bypass this entirely. See BrandHTMLConverter SKILL.md → WordPress Output Mode for full inline style table.

---

## CTA Boxes

### When to Create

Create a `.cta-box` (dark ink wash) when content contains:

1. **Action items** — numbered steps the reader should take
2. **"Tomorrow morning" or "Next steps"** language
3. **Questions to ask** — formatted as a list
4. **Urgency + specificity** — clear immediate actions

### Recognition Patterns

- Headers like "The Call to Action" or "Next Steps" or "Your Action Plan"
- Numbered lists of things to do
- Time markers: "tomorrow," "this week," "right now"
- Imperative verbs: "Pull," "Ask," "Write down," "Schedule"

### Example Conversion

**Markdown:**
```markdown
## The Call to Action

### Tomorrow Morning. One Meeting.

Pull your five best performers into a room.

**Ask them three questions:**

1. **What do you do that our clients actually pay a premium for?**
2. **What keeps you from doing more of that?**
3. **If you had twice the time for the work that matters, what would you do?**

Write down their answers. **That's your AI strategy.**
```

**HTML:**
```html
<div class="cta-box">
    <h3>Tomorrow Morning. One Meeting.</h3>
    
    <p>Pull your five best performers into a room.</p>
    
    <p><strong>Ask them three questions:</strong></p>
    
    <ol class="cta-list">
        <li><strong>What do you do that our clients actually pay a premium for?</strong></li>
        <li><strong>What keeps you from doing more of that?</strong></li>
        <li><strong>If you had twice the time for the work that matters, what would you do?</strong></li>
    </ol>
    
    <p>Write down their answers. <strong>That's your AI strategy.</strong></p>
</div>
```

---

## Comparison Tables

### When to Create

Create a `.research-table` when content contains:

1. **Multiple data points** that share the same structure
2. **Source citations** that should be linked
3. **Finding → Source → Implication** patterns
4. **Lists of statistics** from different sources

### Recognition Patterns

- Repeated structure: "According to [Source], [finding]"
- Multiple bullet points with similar format
- Research summaries with citations
- Before/after data comparisons

---

## Content Pattern Recognition

### Scanning for Aesthetic Opportunities

When converting markdown, scan for these patterns:

**Explicit Callout Syntax (Highest Priority):**

| Pattern in Markdown | Creates |
|---------------------|---------|
| `> **[MECHANISM]** LABEL` | `.callout.mechanism` with label |
| `> **[INSIGHT]** LABEL` | `.callout.insight` with label |
| `> **[WARNING]** LABEL` | `.callout.warning` with label |
| `> **[TIP]** LABEL` | `.callout.tip` with label |
| `> **[PULLQUOTE]**` | `.pull-quote` |
| `> **[STAT: XX%]**` | `.stat-highlight` with XX% |
| `> **[FRAMEWORK]** NAME` | `.framework-box` with NAME |

**Implicit Pattern Recognition (Fallback):**

| Pattern in Markdown | Creates |
|---------------------|---------|
| Opening paragraphs before first H2 | `.lead-section` |
| `> "Quote" — Attribution` | `<blockquote>` with `<cite>` |
| `> **Key Insight:**` or `> **Note:**` | `.callout.mechanism` |
| Standalone impactful sentence | `.pull-quote` |
| "X% of..." as paragraph focus | `.stat-highlight` |
| "Pattern 1:" with traditional/alternative | `.case-study` |
| Named framework with steps | `.framework-box` |
| "Next steps" or numbered actions | `.cta-box` |
| Multiple citations in list format | `.research-table` |
| Final memorable statement | `.final-quote` |

### Density Guidelines

For a 5,000-word article, aim for approximately:

- 1 lead section (opening)
- 2-4 callout boxes
- 2-3 stat highlights
- 2-4 pull quotes
- 3-5 case studies (if applicable)
- 1 framework box (if applicable)
- 1 CTA box (closing)
- 1 research table (if multiple citations)

**Don't over-design.** Standard paragraphs should still dominate. Aesthetic elements create rhythm and emphasis—too many defeats the purpose.
