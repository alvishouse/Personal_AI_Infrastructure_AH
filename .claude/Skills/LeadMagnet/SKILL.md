---
name: LeadMagnet
description: Infographic and lead magnet guide creation system. USE WHEN user wants to create an infographic OR lead magnet guide OR downloadable PDF content OR visual data storytelling asset. Produces print-ready infographics and multi-page guide PDFs using brand guidelines.
---

# LeadMagnet Skill

Produces two types of high-value downloadable content assets:

1. **Infographics** — Single or multi-panel visual assets (data storytelling, process flows, frameworks)
2. **Lead Magnet Guides** — Multi-page PDF guides (how-to, frameworks, checklists, playbooks)

Both asset types share the same research foundation and brand design system.

---

## Reference Documents

- `reference-guidelines.md` — Content examples and design guidelines (add your file here)

---

## Workflows

| Workflow | File | Use When |
|----------|------|----------|
| Infographic Creation | `workflows/01-infographic-workflow.md` | Single visual asset (1–3 panels) |
| Lead Magnet Guide | `workflows/02-guide-workflow.md` | Multi-page PDF guide (5–20 pages) |

---

## Agents

| Agent | File | Role |
|-------|------|------|
| InfographicDesigner | `agents/InfographicDesigner.md` | Translates research into visual layout briefs + image prompts |
| LeadMagnetWriter | `agents/LeadMagnetWriter.md` | Writes chapter-structured long-form guide content |
| LeadMagnetValidator | `agents/LeadMagnetValidator.md` | Quality checks design brief and content against brand guidelines |

---

## Reused PAI Assets

- `content-researcher` agent — Research phase (identical to content workflow)
- `Art/` skill — Image generation using brand style templates
- `BrandHTMLConverter` skill — HTML → styled PDF source
- `WordPressPublisher/tools/upload-images-to-wordpress.ts` — Asset upload pattern

---

## Scratchpad Structure

```
scratchpad/lead-magnets/
  YYYY-MM-DD-{slug}/
    metadata.json
    01-research/
    02-design-brief/
    03-content/
    04-assets/          ← generated images
    05-output/          ← final PDF + PNG exports
```

---

## Notion Integration

Uses existing Content DB. Content Types:
- `Infographic`
- `Lead Magnet Guide`
