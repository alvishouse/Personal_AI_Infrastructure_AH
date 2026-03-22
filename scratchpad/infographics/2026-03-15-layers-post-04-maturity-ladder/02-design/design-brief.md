# Design Brief — AI Maturity Ladder Infographic

## File
`03-output/infographic.html`

## Layout Structure (top to bottom)

```
┌─────────────────────────────────────┐
│   .ig-header (navy)                 │
│   Kicker: LAYERS & LADDERS FRAMEWORK│
│   Title: Where Are You on the AI    │
│          Ladder? (Ladder in amber)  │
├─────────────────────────────────────┤
│   .problem-headline (orange)        │
│   trending-up icon                  │
│   "99% of Organizations Are Below   │
│    Rung 4."                         │
│   Subtext (muted white)             │
├──────────┬──────────┬───────────────┤
│   39%    │   11%    │    1%         │
│ STUCK    │ AGENTIC  │   MATURE      │
│ HERE     │          │               │
├──────────┴──────────┴───────────────┤
│ .three-cols                         │
├──────────┬──────────┬───────────────┤
│ AWARENESS│ PROCESS  │ AGENTIC       │
│& ADOPTION│    &     │   &           │
│ (orange) │INTELLIG. │ ADAPTIVE      │
│          │ (amber)  │  (teal)       │
│ Rung 1   │ Rung 3   │ Rung 5        │
│ Rung 2   │ Rung 4   │ Rung 6        │
├─────────────────────────────────────┤
│   .solution-header (orange)         │
│   search icon                       │
│   THE HONEST QUESTION               │
│   "Which Rung Are You Actually On?" │
├─────────────────┬───────────────────┤
│  ASPIRATIONAL   │   ACTUAL RUNG     │
│  RUNG (navy)    │   (teal)          │
│  "Where You     │  "Where the Data  │
│   Think You Are"│   Places You"     │
│  → failure loop │  → compound loop  │
├─────────────────────────────────────┤
│   .footer-cta (navy)                │
│   profile pic + CTA text            │
└─────────────────────────────────────┘
```

## Color Decisions

| Section | Color | Rationale |
|---------|-------|-----------|
| Header | Navy | Authority, framework positioning |
| Problem bar | Orange | Urgency, attention |
| Stat strip | White background | Clean data read |
| Column 1 header | Orange | Lower rungs = urgency/warning |
| Column 1 icons | Orange | Matches column header |
| Column 2 header | Amber | Transitional tier — caution |
| Column 2 icons | Amber | Matches column header |
| Column 3 header | Teal | Advanced tiers = positive/aspirational |
| Column 3 icons | Teal | Matches column header |
| Solution header | Orange | Problem framing — challenge to reader |
| Model 1 (Aspirational) | Navy tag | Neutral authority tone |
| Model 2 (Actual) | Teal tag | Solution/positive tone |
| Footer | Navy | Consistent with header |

## Typography Decisions

- Main title uses `<em>` around "Ladder?" → renders in amber (`--amber`)
- Solution title uses `<em>` around "Actually" → renders in muted white (70%)
- Stat numbers: Bebas Neue 26px navy — maximum visual impact
- Rung titles: 7px Inter 700 — compact but legible at 2x scale
- Rung sub descriptions: 6px Inter steel — deliberately muted so titles pop

## Icon Choices per Rung

| Rung | Icon | Rationale |
|------|------|-----------|
| 1 — Awareness | `eye` | Watching, noticing, not yet acting |
| 2 — Tool Adoption | `wrench` | Tool use (`tool` not in Lucide) |
| 3 — Process Integration | `git-branch` | Branching workflows, structured paths |
| 4 — Operational Intelligence | `cpu` | Systems thinking (`brain` not in Lucide) |
| 5 — Agentic Enablement | `zap` | Speed, autonomous action |
| 6 — Adaptive Enterprise | `refresh-cw` | Continuous learning loops |

## Notes on Production

- `body { background: white; padding: 0 }` — no grey box in screenshot
- `.ig` has no `box-shadow` — clean edge for Playwright crop
- Icon backgrounds use inline `style="background: var(--COLOR)"` to override default navy per column color spec
- `lucide.createIcons()` called at end of `<body>`
- All colors reference CSS vars — no hardcoded hex in HTML
