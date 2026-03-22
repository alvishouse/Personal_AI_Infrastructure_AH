# Second Brain Integration with PAI

## Overview

This document describes how to integrate a personal knowledge management system (Second Brain) with PAI while maintaining clean separation of concerns.

**Key Principle:** PAI handles AI execution; Obsidian handles human knowledge curation.

---

## Dual-System Architecture

```
┌─────────────────────────────────────┐     ┌─────────────────────────────────────┐
│                                     │     │                                     │
│      PAI (.claude/)                 │     │     OBSIDIAN VAULT                  │
│      *AI Execution System*          │     │     *Human Knowledge System*        │
│                                     │     │                                     │
│   • Executes AI tasks               │     │   • Curates knowledge               │
│   • Captures work output            │     │   • Builds connections              │
│   • Routes to specialists           │     │   • Progressive refinement          │
│   • Logs everything (JSONL)         │     │   • Creates outputs                 │
│                                     │     │                                     │
│   Technology:                       │     │   Technology:                       │
│   • Bun + TypeScript                │     │   • Obsidian app                    │
│   • Hooks (automated)               │     │   • [[Wiki-links]]                  │
│   • JSONL event logs                │     │   • Graph view + plugins            │
│                                     │     │                                     │
└─────────────────────────────────────┘     └─────────────────────────────────────┘
                    │                                        │
                    │            BRIDGE LAYER                │
                    └────────────────┬───────────────────────┘
                                     │
                    ┌────────────────┴────────────────┐
                    │                                 │
                    ▼                                 ▼
              PAI → Obsidian                  Obsidian → PAI
              (Export learnings)             (Query knowledge)
```

---

## Why Separate Systems?

| Aspect | PAI | Obsidian |
|--------|-----|----------|
| **Primary User** | AI agents | Human |
| **Content Type** | Execution logs, code | Knowledge notes |
| **Organization** | By execution type | By purpose (PARA) |
| **Linking** | File references | [[Wiki-links]] |
| **Visualization** | Dashboard/JSONL | Graph view |
| **Capture** | Automated (hooks) | Manual + import |
| **Processing** | Real-time | Asynchronous review |

---

## Obsidian Vault Structure (PARA + Zettelkasten)

```
~/SecondBrain/                            # Obsidian vault location
│
├── .obsidian/                            # Obsidian config
│   └── plugins/
│       ├── dataview/                     # Query notes
│       ├── templater/                    # Note templates
│       └── obsidian-git/                 # Version control
│
├── Inbox/                                # ════════════════════════
│   │                                     #   CAPTURE (CODE: C)
│   │                                     # ════════════════════════
│   ├── YYYY-MM-DD_source_title.md        # Unsorted captures
│   └── _PAI-Exports/                     # ← PAI exports land here
│       ├── learnings/
│       ├── research/
│       └── decisions/
│
├── Projects/                             # ════════════════════════
│   │                                     #   PARA: Active goals
│   │                                     # ════════════════════════
│   ├── ProjectName/
│   │   ├── _index.md                     # Project dashboard
│   │   └── notes/
│   └── ...
│
├── Areas/                                # ════════════════════════
│   │                                     #   PARA: Ongoing areas
│   │                                     # ════════════════════════
│   ├── Health/
│   ├── Career/
│   └── Finance/
│
├── Resources/                            # ════════════════════════
│   │                                     #   PARA: Reference topics
│   │                                     # ════════════════════════
│   ├── AI-ML/
│   ├── Security/
│   └── Programming/
│
├── Archives/                             # ════════════════════════
│   │                                     #   PARA: Completed items
│   │                                     # ════════════════════════
│   └── [moved projects/areas]
│
├── Atoms/                                # ════════════════════════
│   │                                     #   ZETTELKASTEN
│   │                                     #   Atomic evergreen notes
│   │                                     # ════════════════════════
│   ├── 202501151430-concept-name.md      # One idea per note
│   └── _MOC.md                           # Map of content
│
└── Templates/                            # Note templates
    ├── atom.md
    ├── project.md
    └── capture.md
```

---

## CODE Framework (Capture → Organize → Distill → Express)

### C: Capture
Sources flow into `/Inbox/`:
- Manual: Web clips, book highlights, podcast notes
- Automated: PAI exports, Readwise, Limitless
- All captures are temporary - await triage

### O: Organize (PARA)
Weekly triage moves items to appropriate locations:
- **Projects** - Active work with deadlines
- **Areas** - Ongoing responsibilities
- **Resources** - Topics of interest
- **Archives** - Completed/inactive

### D: Distill (Progressive Summarization)
Process notes through layers:
1. **Layer 0** - Full source text
2. **Layer 1** - **Bold** key passages
3. **Layer 2** - ==Highlight== essential points
4. **Layer 3** - Executive summary at top
5. **Layer 4** - Extract atomic note to `/Atoms/`

### E: Express
Create outputs from accumulated knowledge:
- Blog posts assembled from atoms
- Tutorials synthesized from notes
- Projects built with curated knowledge

---

## Information Flow

```
                              CAPTURE SOURCES
                                    │
        ┌───────────────────────────┼───────────────────────────┐
        │                           │                           │
        ▼                           ▼                           ▼
┌───────────────┐           ┌───────────────┐           ┌───────────────┐
│  PAI HISTORY  │           │    MANUAL     │           │   IMPORTS     │
│               │           │               │           │               │
│ • Learnings   │           │ • Web clips   │           │ • Readwise    │
│ • Research    │           │ • Book notes  │           │ • Limitless   │
│ • Decisions   │           │ • Ideas       │           │ • Kindle      │
│               │           │               │           │               │
└───────┬───────┘           └───────┬───────┘           └───────┬───────┘
        │                           │                           │
        │        EXPORT HOOK        │                           │
        │                           │                           │
        └───────────────────────────┼───────────────────────────┘
                                    │
                                    ▼
                          ┌─────────────────┐
                          │                 │
                          │     INBOX       │
                          │                 │
                          │  Unsorted       │
                          │  captures       │
                          │                 │
                          └────────┬────────┘
                                   │
                              WEEKLY TRIAGE
                                   │
           ┌───────────────────────┼───────────────────────────┐
           │                       │                           │
           ▼                       ▼                           ▼
    ┌────────────┐          ┌────────────┐          ┌────────────┐
    │  PROJECTS  │          │  RESOURCES │          │   AREAS    │
    │            │          │            │          │            │
    │  Active    │          │  Reference │          │  Ongoing   │
    │  goals     │          │  topics    │          │  duties    │
    └─────┬──────┘          └─────┬──────┘          └────────────┘
          │                       │
          │    PROGRESSIVE        │
          │    SUMMARIZATION      │
          │                       │
          └───────────┬───────────┘
                      │
                      ▼
              ┌────────────────┐
              │                │
              │     ATOMS      │
              │                │
              │  Evergreen     │
              │  [[linked]]    │
              │  notes         │
              │                │
              └───────┬────────┘
                      │
                      │
          ┌───────────┴───────────┐
          │                       │
          ▼                       ▼
    ┌──────────────┐       ┌──────────────┐
    │  EXPRESSION  │       │  PAI QUERY   │
    │              │       │              │
    │  Blog posts  │       │  Load atoms  │
    │  Tutorials   │       │  as context  │
    │  Projects    │       │  for tasks   │
    └──────────────┘       └──────────────┘
```

---

## Bridge Implementation

### PAI → Obsidian (Export)

Add to `stop-hook.ts` or create `export-to-obsidian.ts`:

```typescript
// Configuration
const OBSIDIAN_VAULT = process.env.OBSIDIAN_VAULT || `${process.env.HOME}/SecondBrain`;
const PAI_EXPORT_DIR = `${OBSIDIAN_VAULT}/Inbox/_PAI-Exports`;

// Export categories
const exportMap = {
  'Learnings': 'learnings',
  'Research': 'research',
  'Decisions': 'decisions'
};

async function exportToObsidian(content: string, category: string, filename: string) {
  const targetDir = `${PAI_EXPORT_DIR}/${exportMap[category]}`;
  await Bun.write(`${targetDir}/${filename}`, content);
}
```

### Obsidian → PAI (Query)

Create a skill or MCP server that can query Obsidian:

```typescript
// Query atoms for context
async function queryAtoms(topic: string): Promise<string[]> {
  const atomsDir = `${OBSIDIAN_VAULT}/Atoms`;
  // Use grep to find relevant atoms
  const results = await $`rg -l "${topic}" ${atomsDir}`.text();
  return results.split('\n').filter(Boolean);
}

// Load project context
async function loadProjectContext(projectName: string): Promise<string> {
  const indexPath = `${OBSIDIAN_VAULT}/Projects/${projectName}/_index.md`;
  return await Bun.file(indexPath).text();
}
```

---

## Recommended Obsidian Plugins

| Plugin | Purpose |
|--------|---------|
| **Dataview** | Query notes programmatically |
| **Templater** | Consistent note templates |
| **QuickAdd** | Fast capture workflow |
| **Obsidian Git** | Version control sync |
| **Periodic Notes** | Daily/weekly reviews |
| **Graph Analysis** | Visualize connections |

---

## Templates

### Atom Template (`Templates/atom.md`)

```markdown
---
created: {{date:YYYY-MM-DD}}
type: atom
tags: []
source:
---

# {{title}}

<!-- One idea, in your own words -->



---

## Related
- [[]]

## Source
<!-- Where this idea came from -->
```

### Capture Template (`Templates/capture.md`)

```markdown
---
created: {{date:YYYY-MM-DD}}
source:
type: capture
status: inbox
---

# {{title}}

## Summary
<!-- Brief description -->

## Key Points
-

## Raw Content
<!-- Full text or link -->

## Actions
- [ ] Triage to PARA location
- [ ] Extract atoms if valuable
```

---

## Workflow Examples

### Weekly Review

1. **Process Inbox**
   - Review all items in `/Inbox/`
   - Move to PARA locations or delete
   - Tag appropriately

2. **Check PAI Exports**
   - Review `/Inbox/_PAI-Exports/`
   - Move valuable learnings to Resources
   - Extract atoms from insights

3. **Update Projects**
   - Review active project `_index.md` files
   - Archive completed projects
   - Identify blocked items

### When Starting PAI Task

1. **Load relevant context**
   ```
   /load-context [project-name]
   ```

2. **PAI queries Obsidian**
   - Finds relevant atoms
   - Loads project notes
   - Injects as context

3. **Work is captured**
   - PAI History logs execution
   - Valuable insights export to Obsidian

---

## Environment Variables

Add to `.env`:

```bash
# Obsidian Integration
OBSIDIAN_VAULT="${HOME}/SecondBrain"
OBSIDIAN_EXPORT_ENABLED=true
```

---

## Summary

| System | Role | Strength |
|--------|------|----------|
| **PAI** | AI execution | Automated capture, reliable workflows |
| **Obsidian** | Knowledge curation | Linking, visualization, human review |
| **Bridge** | Integration | Export + query bidirectionally |

This separation ensures:
- PAI's deliberate structure remains intact
- Obsidian's PKM features are fully utilized
- Knowledge flows between systems naturally
- Each tool does what it's best at
