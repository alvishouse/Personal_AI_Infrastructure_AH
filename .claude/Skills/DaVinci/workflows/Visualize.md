# Da Vinci Visualize Workflow

**Adaptive orchestrator that analyzes content and routes to the best visualization workflow.**

When unsure which format to use, this workflow analyzes the content and picks the optimal approach.

---

## Purpose

Use this when:
- You're not sure which diagram type fits best
- Content could work multiple ways
- You want an intelligent recommendation

---

## 🚨 ANALYSIS PROCESS

### Step 1: Analyze Content Type

Read the input and categorize:

| If Content Contains... | Route To |
|-----------------------|----------|
| System architecture, components, infrastructure | `SystemDiagrams.md` |
| Abstract idea, mental model, theory | `ConceptSketches.md` |
| Step sequence, transformation, pipeline | `ProcessFlows.md` |
| Flowchart logic, decision trees | `Mermaid.md` |
| Categories, classification, taxonomy | `Taxonomies.md` |
| Historical progression, dates, evolution | `Timelines.md` |
| 2x2 matrix, quadrants, framework | `Frameworks.md` |
| X vs Y, pros/cons, alternatives | `Comparisons.md` |
| Screenshot with callouts | `AnnotatedScreenshots.md` |
| How-to steps, recipe, instructions | `RecipeCards.md` |
| Quote, aphorism, wisdom | `Aphorisms.md` |
| Territory, landscape, conceptual space | `Maps.md` |
| Single striking statistic | `Stats.md` |
| Narrative sequence, story panels | `Comics.md` |
| Blog header, abstract metaphor | `Workflow.md` |

---

### Step 2: Confirm Selection

Before proceeding, verify:
1. Does this format match the content's structure?
2. Will the Da Vinci aesthetic enhance it?
3. Is there a simpler format that works?

---

### Step 3: Execute Chosen Workflow

Read the selected workflow file and follow its steps exactly.

**All workflows use the same core aesthetic:**
- Parchment background (#ECE6D9)
- Slate blue ink (#3B546B)
- Hand-drawn imperfect lines
- Construction geometry visible
- Burnt copper accent sparingly

---

## Quick Decision Tree

```
What's the core structure?

├─ Shows COMPONENTS + RELATIONSHIPS? → SystemDiagrams.md
├─ Shows SEQUENCE over TIME? 
│   ├─ Historical with dates → Timelines.md
│   └─ Process with steps → ProcessFlows.md
├─ Shows CATEGORIES or TYPES? → Taxonomies.md
├─ Shows COMPARISON (A vs B)? → Comparisons.md
├─ Shows 2x2 or MATRIX? → Frameworks.md
├─ Shows TERRITORY or SPACE? → Maps.md
├─ Is a SINGLE QUOTE? → Aphorisms.md
├─ Is a SINGLE STAT? → Stats.md
├─ Is a STORY sequence? → Comics.md
├─ Is a HOW-TO? → RecipeCards.md
├─ Needs FLOWCHART logic? → Mermaid.md
├─ Is ABSTRACT metaphor? → Workflow.md (editorial)
└─ Is CONCEPTUAL idea? → ConceptSketches.md
```

---

## When Multiple Formats Work

If content could fit multiple formats:
1. **Prefer simpler** — Less complex is often clearer
2. **Match the primary purpose** — What does reader need most?
3. **Consider aspect ratio needs** — Blog header vs. standalone
4. **Ask if unclear** — Clarify with user before generating
