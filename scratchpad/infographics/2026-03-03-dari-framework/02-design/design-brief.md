# Infographic Design Brief: The DARI Framework

## Core Message
AI agents fail not because of the model, but because of missing process discipline — DARI gives operations leaders the Lean-equivalent for delegation.

## Narrative Arc
Pattern B: Framework / Steps, adapted for 4 stages using a **Step Strip + 2+2 Column Layout**.

**4-Stage Adaptation Decision: Option 1 (Step Strip + 2+2 columns)**

A horizontal Step Strip across the top names all four stages (D-A-R-I) with their one-word verbs, giving readers an at-a-glance orientation before diving into detail. Below it, two rows of two columns hold the stage content:
- Row 1: Discover (left) | Architect (right)
- Row 2: Run (left) | Improve (right)

This preserves the three-column maximum rule (each row is two columns, which is within the limit), gives Architect the space it needs for its four handoff types, and gives Improve room for its three drift types. Neither Discover nor Run gets crowded. The layout reads top-to-bottom and left-to-right, which maps naturally to the sequential DARI logic.

---

## Canvas Format
- Size: 4:5 Portrait (1080×1350)
- HTML canvas: 540px wide

---

## Section Plan

### Header
- Kicker: `PROCESS DISCIPLINE FOR AI DELEGATION`
- Title: `Lean gave you PDCA. AI needs <em>DARI</em>.`
- Subhead: `The method high performers use before they deploy.`
- Background: Navy (`--navy`)

### Stat Strip
Three cells drawn directly from the McKinsey 2025 data in the source post.

- Stat 1: `2.8×` / `MORE LIKELY` / `High performers redesign workflows before deploying AI`
- Stat 2: `55%` / `OF HIGH PERFORMERS` / `Redesign workflows before deployment`
- Stat 3: `20%` / `OF LAGGARDS` / `Redesign workflows before deployment`

Background: `--ink` strip with orange `stat-num`, cream `stat-desc`. Three cells separated by thin vertical rules.

### DARI Step Strip
A single horizontal bar — four equal-width pills labeling the stages. Each pill has a stage letter in Bebas Neue (large, amber) and the verb beneath it (cream, small caps).

- D — DISCOVER
- A — ARCHITECT
- R — RUN
- I — IMPROVE

Background: `--steel`. Serves as visual chapter marker between the stat strip and the stage columns.

---

### Stage Columns — Row 1

#### Column Left: Discover
- Column header color: `col-header-teal`
- Column header icon: `search` (Lucide)
- Header label: `DISCOVER`
- Subhead: `Map the work before you automate it.`
- Component type: `obstacle-list` (3 items, each an icon + title + subtitle)

Items:
1. Icon: `git-branch` | Title: `Boundary Mapping` | Subtitle: `Identify every task crossing a human-agent boundary`
2. Icon: `clipboard-list` | Title: `Input / Output Spec` | Subtitle: `Document inputs, expected outputs, and what "done right" looks like`
3. Icon: `target` | Title: `Define Success` | Subtitle: `If you can't define success, you can't detect failure`

#### Column Right: Architect
- Column header color: `col-header-orange`
- Column header icon: `layout` (Lucide)
- Header label: `ARCHITECT`
- Subhead: `Design the handoffs, not just the tasks.`
- Component type: `obstacle-list` (4 handoff items + 1 rule item)

Handoff items:
1. Icon: `arrow-right` | Title: `Human → Agent` | Subtitle: `What does the agent need to do the job?`
2. Icon: `arrow-left` | Title: `Agent → Human` | Subtitle: `What must a human verify before trusting the output?`
3. Icon: `link` | Title: `Agent → Agent` | Subtitle: `What checkpoints exist between models in a chain?`
4. Icon: `shield` | Title: `Agent → System` | Subtitle: `What guardrails exist before data touches a live system?`

Rule callout (small accent block below items, amber background):
- Text: `Every handoff must be: **Clear · Verifiable · Recoverable**`

---

### Stage Columns — Row 2

#### Column Left: Run
- Column header color: `col-header-amber`
- Column header icon: `play` (Lucide)
- Header label: `RUN`
- Subhead: `Execute with visibility.`
- Component type: `obstacle-list` (3 items)

Items:
1. Icon: `eye` | Title: `Log Outputs` | Subtitle: `Every agent run produces a traceable record`
2. Icon: `alert-triangle` | Title: `Flag Deviations` | Subtitle: `Surface exceptions before they compound`
3. Icon: `layers` | Title: `Designated Owner` | Subtitle: `Every agent needs an accountable human — same as a machine operator`

#### Column Right: Improve
- Column header color: `col-header-navy`
- Column header icon: `trending-up` (Lucide)
- Header label: `IMPROVE`
- Subhead: `Measure what's drifting, not just what's broken.`
- Component type: `obstacle-list` (3 drift types)

Items:
1. Icon: `zap` | Title: `Capability Drift` | Subtitle: `The model itself changes`
2. Icon: `activity` | Title: `Performance Drift` | Subtitle: `Outputs decline without any model change`
3. Icon: `refresh-cw` | Title: `Context Drift` | Subtitle: `Your business changed but the agent didn't`

Cadence callout (small accent block below items, steel background):
- Text: `Cadence: **Daily · Weekly · Monthly** checks`

---

### Positioning Bar
A single full-width cream band between the stage columns and footer. Short, high-contrast framing statement.

- Background: `--cream`
- Text color: `--ink`
- Copy: `DARI isn't a replacement for Lean — it's Lean extended to the delegation problem.`
- Style: centered, italic, 13px, with a short amber left-border rule (same as pull-quote treatment)

---

### Footer CTA
- Profile pic: `https://alvishouse.io/wp-content/uploads/2026/02/alvis-profile.png`
  (No local `assets/profile-pic.jpg` exists in the content-create directory — use the hosted URL as per the existing headcount-myth infographic pattern)
- CTA text: `The full DARI framework → alvishouse.io`
- Background: Navy (`--navy`)

---

## Lucide Icons Selected

| Icon name | Purpose |
|---|---|
| `search` | Discover stage header |
| `layout` | Architect stage header |
| `play` | Run stage header |
| `trending-up` | Improve stage header |
| `git-branch` | Boundary mapping (Discover item 1) |
| `clipboard-list` | Input/output spec (Discover item 2) |
| `target` | Define success (Discover item 3) |
| `arrow-right` | Human → Agent handoff (Architect item 1) |
| `arrow-left` | Agent → Human handoff (Architect item 2) |
| `link` | Agent → Agent handoff (Architect item 3) |
| `shield` | Agent → System guardrails (Architect item 4) |
| `eye` | Log outputs (Run item 1) |
| `alert-triangle` | Flag deviations (Run item 2) |
| `layers` | Designated owner (Run item 3) |
| `zap` | Capability drift (Improve item 1) |
| `activity` | Performance drift (Improve item 2) |
| `refresh-cw` | Context drift (Improve item 3) |

All icons verified as standard Lucide names (stable set, widely used in existing infographic toolchain).

---

## Content Gaps

1. **No specific "daily/weekly/monthly" breakdowns in the source.** The post says "DARI gives you a cadence to catch all three — daily, weekly, monthly" but does not assign which drift type maps to which cadence. The design brief treats this as a unified cadence statement rather than a per-drift schedule. If the full article (alvishouse.io/?p=851) breaks this down, the cadence callout could be made more specific.

2. **Stat source label.** McKinsey 2025 is cited but no specific report title or URL is in the post. The stat strip should include a micro-attribution line (`Source: McKinsey, 2025`) but cannot be more specific without the original source.

3. **No profile pic file locally.** `assets/profile-pic.jpg` does not exist in the content-create directory. Footer uses the hosted WordPress URL (`https://alvishouse.io/wp-content/uploads/2026/02/alvis-profile.png`) matching the pattern established in the headcount-myth infographic.

4. **Arrow icons (`arrow-right`, `arrow-left`).** These are standard Lucide icons but should be verified at lucide.dev before HTML build, as arrow direction variants sometimes have naming differences (`arrow-right` vs `chevron-right`). Safe fallback: use `chevron-right` and `chevron-left` if arrow versions render unexpectedly.
