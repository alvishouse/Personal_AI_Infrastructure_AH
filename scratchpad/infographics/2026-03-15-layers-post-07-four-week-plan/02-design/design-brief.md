# Design Brief — Post 07: Four-Week AI Diagnostic

## Design System
Alvis House Infographic Design System v1 (linkedin-standard.html)

## Canvas
540px HTML → 1080×1350px LinkedIn 4:5 portrait at 2x Playwright

## Layout Structure

```
┌─────────────────────────────────────┐
│  HEADER — Navy                      │
│  "LAYERS & LADDERS FRAMEWORK"       │
│  "Your 4-Week AI Diagnostic"        │
├─────────────────────────────────────┤
│  PROBLEM BAR — Orange               │
│  "You Don't Need a $200K…"          │
├──────────┬──────────┬───────────────┤
│  $0      │  4       │  $500K        │
│  TO START│  WEEKS   │  SAVED        │
├──────────┴──────────┴───────────────┤
│  THREE COLUMNS — Cream background   │
│  DIAGNOSE│PRESCRIBE │OBSTACLES      │
│  Orange  │Amber     │Teal           │
│  ────────┼──────────┼────────       │
│  Wk 1    │Wk 3      │No Budget      │
│  Wk 2    │Wk 4      │No Sponsor     │
│          │          │No Start Point │
├─────────────────────────────────────┤
│  SOLUTION — Teal header             │
│  "After 4 Weeks: Clarity Not…"      │
│  ─────────────────────────────      │
│  Traditional    │ L&L Approach      │
│  Navy           │ Teal              │
├─────────────────────────────────────┤
│  FOOTER CTA — Navy                  │
└─────────────────────────────────────┘
```

## Color Decisions

| Section | Color | Rationale |
|---------|-------|-----------|
| Header | Navy | Authority, framework-level framing |
| Problem bar | Orange | Urgency, challenge hook |
| DIAGNOSE column header | Orange | Action/urgency for the first step |
| PRESCRIBE column header | Amber | Attention/caution for the prescription phase |
| OBSTACLES column header | Teal | Reframing obstacles as solvable (positive) |
| Obstacle icons — Col 1 | Orange | Matches column header color |
| Obstacle icons — Col 2 | Amber | Matches column header color |
| Obstacle icons — Col 3 | Teal | Matches column header color |
| Solution header | Teal | Positive outcome framing |
| Model 1 tag | Navy | Traditional/conservative path |
| Model 2 tag | Teal | Accelerated/positive path |
| Footer | Navy | Consistent brand anchor |

## Typography Choices

- **Main title:** Bebas Neue 26px — "Diagnostic" in amber via `<em>`
- **Problem headline:** Bebas Neue 18px — subtext in muted white via `<em>`
- **Stat numbers:** Bebas Neue 26px, navy
- **Stat units:** Inter 800 7px, orange, uppercase
- **Column headers:** Inter 800 7.5px, letter-spacing 0.18em, uppercase
- **Obstacle titles:** Inter 700 7px, ink
- **Obstacle subtitles:** Inter 400 6px, steel
- **Model headings:** Inter 800 10px
- **Model list items:** Inter 400 7px with arrow bullets
- **Footer CTA:** Inter 400 8px

## Icon Choices

| Location | Icon | Rationale |
|----------|------|-----------|
| Problem bar | `alert-triangle` | Warning/attention hook |
| DIAGNOSE header | `search` | Finding/discovering |
| PRESCRIBE header | `clipboard-list` | Prescription/action plan |
| OBSTACLES header | `shield-check` | Defense/resolution |
| Week 1 | `layers` | The 6-layer model |
| Week 2 | `bar-chart` | Scoring/assessment |
| Week 3 | `crosshair` | Single-point focus |
| Week 4 | `git-merge` | Human-to-agent handoff |
| No Budget | `dollar-sign` | Money/cost |
| No Sponsor | `user-check` | Executive approval |
| No Start Point | `map-pin` | Location/starting point |
| Solution header | `check-circle` | Positive outcome |

## Key Design Decisions

1. **Solution header uses Teal instead of Orange** — This is the outcome/resolution section. Teal signals success, not urgency.
2. **Obstacle column uses Teal header** — Counter-intuitive but deliberate: framing the OBSTACLES column in teal signals these are surmountable, not blocking.
3. **Icon bg colors match column header colors** — Creates visual consistency within each column; reader's eye maps icon color to column meaning instantly.
4. **Two-model comparison** — Navy (traditional) vs Teal (Layers & Ladders) reinforces the brand framing without extra explanation.
5. **$500K stat** — Concrete cost anchor that makes the $0 diagnostic feel like a no-brainer.
