# Design Brief — The 6 Layers AI Requires

## Infographic Series
Layers & Ladders — Post 03

## Layout Structure

```
┌─────────────────────────────────────┐
│    HEADER (navy)                    │
│    Kicker: LAYERS & LADDERS         │
│    Title: The 6 Layers AI Requires  │
├─────────────────────────────────────┤
│    PROBLEM BAR (orange)             │
│    Icon: trending-down              │
│    "80% of AI Projects Fail."       │
│    Stat Strip (3 cells)             │
├──────────┬──────────┬───────────────┤
│ Col 1    │ Col 2    │ Col 3         │
│ ORANGE   │ AMBER    │ TEAL          │
│ Foundation│ Critical │ People &     │
│ Layers   │ Layers   │ Strategy      │
│ L1 + L2  │ L3 + L4  │ L5 + L6       │
├─────────────────────────────────────┤
│    SOLUTION (orange header)         │
│    "THE DIAGNOSTIC"                 │
│    Score Each Layer 1-5             │
│    ├── SKIP (navy) │ BUILD (teal) ──┤
├─────────────────────────────────────┤
│    FOOTER CTA (navy)                │
└─────────────────────────────────────┘
```

## Design Decisions

### Color Scheme
- **Column 1 (Foundation Layers)**: Orange header (`col-header-orange`), navy obstacle icon backgrounds
- **Column 2 (Critical Layers)**: Amber header (`col-header-amber`), amber obstacle icon backgrounds
- **Column 3 (People & Strategy)**: Teal header (`col-header-teal`), teal obstacle icon backgrounds
- Icon background color matches the column's thematic color, set via inline `style` override

### Obstacle Icons
- Column 1: `server`, `database` icons — navy background
- Column 2: `git-branch`, `shield` icons — amber background
- Column 3: `users`, `target` icons — teal background

### Solution Section — Two Models
- **Model 1 "SKIP THE LAYERS"**: `model-tag-blue` (navy color) — the wrong path
- **Model 2 "BUILD THE LAYERS"**: `model-tag-teal` (teal color) — the right path
- List arrows inherit color from the preceding `.model-tag` class via CSS sibling selector

### Typography
- Header title: Bebas Neue 26px, "Layers" in amber (`<em>`)
- Problem bar: Bebas Neue 18px, subtext in muted white (`<em>`)
- Stat numbers: Bebas Neue 26px, navy
- Solution title: Bebas Neue 15px, italic phrase in 70% white (`<em>`)
- All body text: Inter, 6–7.5px per design system scale

### Canvas
- Width: 540px (renders at 1080px at 2x Playwright export)
- Body: `background: white; padding: 0` — clean Playwright export
- `.ig`: no `box-shadow` — clean export

## Component Usage
- `ig-header` — navy, kicker + Bebas title
- `problem-section` — orange bar + stat-strip
- `three-cols` — 3 columns with obstacle-list in each
- `solution-section` — orange header + two-models grid
- `footer-cta` — navy slim footer with profile pic

## Export Target
- Playwright 2x deviceScaleFactor
- Output: 1080×1350 PNG (4:5 portrait LinkedIn standard)
