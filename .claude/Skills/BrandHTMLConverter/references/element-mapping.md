# Element Mapping Reference

Detailed mappings from markdown elements to branded HTML.

## Table of Contents

1. [Article Structure](#article-structure)
2. [Typography](#typography)
3. [Blockquotes](#blockquotes)
4. [Callout Boxes](#callout-boxes)
5. [Statistics Highlights](#statistics-highlights)
6. [Pull Quotes](#pull-quotes)
7. [Framework Boxes](#framework-boxes)
8. [Case Studies](#case-studies)
9. [Tables](#tables)
10. [CTA Boxes](#cta-boxes)
11. [Author Box](#author-box)

---

## Article Structure

```html
<article>
    <header class="article-header">
        <p class="eyebrow">Category or Eyebrow Text</p>
        <h1>Main Headline</h1>
        <p class="subtitle">Deck or subtitle text</p>
        <p class="meta">By <strong>Author Name</strong> | Date | Read time</p>
    </header>
    
    <!-- Content sections here -->
</article>
```

### Eyebrow
- Class: `.eyebrow`
- Color: `var(--rust)` — one of few places rust is allowed
- Font: Montserrat, uppercase, letter-spacing 0.12em

### Subtitle
- Class: `.subtitle`
- Color: `var(--muted)`
- Style: italic

---

## Typography

### Headings

```html
<h1>Only in article-header</h1>
<h2>Section headings — has ink bottom border</h2>
<h3>Subsection headings</h3>
<h4>Labels — uppercase, slate color</h4>
```

H2 styling:
```css
h2 {
    border-bottom: 2px solid var(--ink);
    padding-bottom: 0.4em;
}
```

### Paragraphs

```html
<p>Standard paragraph with 1.8 line-height.</p>
```

### Strong/Bold

```html
<strong>Bold text uses ink color</strong>
```

### Links

```html
<a href="#">Ink color, rust on hover</a>
```

---

## Blockquotes

Standard quote with optional citation:

```html
<blockquote>
    <p>"Quote text here."</p>
    <cite>— Attribution</cite>
</blockquote>
```

CSS:
```css
blockquote {
    background: var(--paper);
    border-left: 4px solid var(--ink);
    border-radius: 0 8px 8px 0;
    padding: 1.5em 2em;
}
```

---

## Callout Boxes

### Markdown Source (Explicit Syntax)

Use blockquote + bold type prefix for visual editing:

```markdown
> **[MECHANISM]** CORE INSIGHT
>
> **Key point in bold.**
>
> Supporting text.
```

**Supported prefixes:** `[MECHANISM]`, `[INSIGHT]`, `[WARNING]`, `[TIP]`

### Basic Callout

```html
<div class="callout">
    <div class="label">Label Text</div>
    <p>Callout content here.</p>
</div>
```

### Mechanism/Insight Callout (ink accent)

**Markdown:**
```markdown
> **[MECHANISM]** CORE INSIGHT
>
> **Key point in bold.**
>
> Supporting text.
```

**HTML:**
```html
<div class="callout mechanism">
    <div class="label">CORE INSIGHT</div>
    <p><strong>Key point in bold.</strong></p>
    <p>Supporting text.</p>
</div>
```

### Warning Callout (ink accent with tinted bg)

**Markdown:**
```markdown
> **[WARNING]** COMMON MISTAKE
>
> Important warning text.
```

**HTML:**
```html
<div class="callout warning">
    <div class="label">COMMON MISTAKE</div>
    <p>Important warning text.</p>
</div>
```

### Tip Callout

**Markdown:**
```markdown
> **[TIP]** PRO TIP
>
> Helpful advice here.
```

**HTML:**
```html
<div class="callout tip">
    <div class="label">PRO TIP</div>
    <p>Helpful advice here.</p>
</div>
```

CSS for mechanism/warning:
```css
.callout.mechanism,
.callout.warning {
    border-left: 5px solid var(--ink);
}
.callout.warning {
    background: rgba(59,84,107,.08);
}
```

---

## Statistics Highlights

### Markdown Source (Explicit Syntax)

```markdown
> **[STAT: 42%]**
>
> Description of the statistic with emphasis as needed.
> *Source: Research Study 2024*
```

### HTML Output

```html
<div class="stat-highlight">
    <div class="stat-number">42%</div>
    <div class="stat-label">Description of the statistic with <strong>emphasis</strong> as needed.</div>
</div>
```

CSS:
```css
.stat-highlight {
    background: var(--paper);
    border: 1px solid var(--rule);
    border-radius: 8px;
}
.stat-number {
    color: var(--ink);
    font-size: 3em;
    font-weight: 700;
}
```

---

## Pull Quotes

### Markdown Source (Explicit Syntax)

```markdown
> **[PULLQUOTE]**
>
> You can't borrow someone else's answer to the question: "What makes our people great?"
```

### HTML Output

```html
<div class="pull-quote">
    You can't borrow someone else's answer to the question: "What makes our people great?"
</div>
```

CSS:
```css
.pull-quote {
    text-align: center;
    font-style: italic;
    color: var(--ink);
    border-top: 2px solid var(--ink);
    border-bottom: 2px solid var(--ink);
    padding: 1.5em 2em;
}
```

---

## Framework Boxes

### Markdown Source (Explicit Syntax)

```markdown
> **[FRAMEWORK]** THE GROW-WITH MODEL
>
> **Stage 1: Partner Early**
> Find promising AI partners before they're proven.
>
> **Stage 2: Accept Failure**
> Reframe failures as tuition for catching giants.
>
> **Stage 3: Compound Learning**
> Build institutional knowledge that grows exponentially.
>
> **Stage 4: Recycle Capital**
> Extract learning from failures and redeploy quickly.
```

### HTML Output

```html
<div class="framework-box">
    <h3>THE GROW-WITH MODEL</h3>

    <div class="framework-visual">
        <div class="framework-step">
            <div class="step-title">Stage 1: Partner Early</div>
            <div class="step-desc">Find promising AI partners before they're proven.</div>
        </div>
        <div class="framework-arrow">→</div>
        <div class="framework-step">
            <div class="step-title">Stage 2: Accept Failure</div>
            <div class="step-desc">Reframe failures as tuition for catching giants.</div>
        </div>
        <div class="framework-arrow">→</div>
        <div class="framework-step">
            <div class="step-title">Stage 3: Compound Learning</div>
            <div class="step-desc">Build institutional knowledge that grows exponentially.</div>
        </div>
        <div class="framework-arrow">→</div>
        <div class="framework-step">
            <div class="step-title">Stage 4: Recycle Capital</div>
            <div class="step-desc">Extract learning from failures and redeploy quickly.</div>
        </div>
    </div>
</div>
```

Note: Framework arrows use `var(--slate)`, not rust.

---

## Case Studies

Comparison format showing traditional vs. amplification approaches:

```html
<div class="case-study">
    <h4>Pattern 1: Industry Name</h4>
    
    <div class="approach-comparison">
        <div class="approach traditional">
            <h5>Traditional Approach</h5>
            <p>Description of traditional method.</p>
        </div>
        <div class="approach amplification">
            <h5>Amplification Approach</h5>
            <p>Description with <strong>key insight</strong> highlighted.</p>
        </div>
    </div>
    
    <p class="strategy"><strong>The AI strategy:</strong> Explanation of approach.</p>
    
    <div class="result">
        <p><strong>Result:</strong> Metrics and outcomes.</p>
    </div>
</div>
```

Color notes:
- `.traditional` uses slate border and background tint
- `.amplification` uses ink border and background tint
- Case study h4 uses ink (not rust)

---

## Tables

Research/data tables:

```html
<table class="research-table">
    <thead>
        <tr>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>Data</td>
            <td><a href="#">Linked source</a></td>
            <td>Implication</td>
        </tr>
    </tbody>
</table>
```

CSS:
```css
.research-table th {
    background: var(--ink);
    color: #fff;
}
.research-table tr:nth-child(even) {
    background: rgba(255,255,255,.4);
}
```

---

## CTA Boxes

Call-to-action sections with ink wash background:

```html
<div class="cta-box">
    <h3>CTA Heading</h3>
    <p>Introductory text.</p>
    
    <ol class="cta-list">
        <li><strong>Item one</strong> with description</li>
        <li><strong>Item two</strong> with description</li>
        <li><strong>Item three</strong> with description</li>
    </ol>
    
    <p><strong>Closing emphasis.</strong></p>
</div>
```

CSS:
```css
.cta-box {
    background: rgba(59,84,107,.92);
    color: #fff;
    border-radius: 10px;
}
```

---

## Author Box

```html
<div class="author-box">
    <div class="author-info">
        <h4>About the Author</h4>
        <p><strong>Author Name</strong> bio text here.</p>
        <p><em>Contact or CTA text.</em></p>
    </div>
</div>
```

---

## Lead Sections

Dark ink wash sections for emphasis:

```html
<section class="lead-section">
    <p><strong>Bold opening statement.</strong></p>
    <p>Supporting text with <span class="highlight-text">highlighted phrases</span>.</p>
</section>
```

Note: `.highlight-text` uses `var(--paper)` color (cream) on dark background.

---

## Final Quote

Closing emphasis block:

```html
<div class="final-quote">
    <span class="highlight">Key phrase.</span><br>
    Rest of quote.<br><br>
    <strong>Bold conclusion.</strong>
</div>
```

Note: `.highlight` uses ink color with font-weight 600 (not rust).

---

## Horizontal Rules

```html
<hr>
```

CSS:
```css
hr {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 3em 0;
}
```
