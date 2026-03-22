# Workflow: Infographic Creation

> **Status:** Stub — update after `reference-guidelines.md` is added to the skill root.

Produces a single or multi-panel infographic asset ready for web, social, or print.

---

## Phases

### Phase 1 — Topic & Brief
- Define the core message (one sentence)
- Identify data points or framework to visualize
- Choose panel count: 1 (single stat/quote), 2–3 (process/comparison), 5+ (full story)
- Reference: `reference-guidelines.md` for tone, format examples, and brand rules

### Phase 2 — Research
- Agent: `content-researcher` (sonnet)
- Output: `01-research/research.md`

### Phase 3 — Design Brief
- Agent: `InfographicDesigner` (sonnet)
- Input: research.md + reference-guidelines.md
- Output: `02-design-brief/design-brief.md`
  - Panel layout (title, subtitle, data sections, CTA)
  - Visual hierarchy notes
  - Color palette references
  - Image prompt per panel

### Phase 4 — Asset Generation
- Tool: Art skill (nano-banana-pro or gpt-image-1)
- Size: 1080×1350 (4:5 portrait) or 1080×1080 (square)
- Output: `04-assets/panel-01.jpg`, `panel-02.jpg`, etc.

### Phase 5 — Validation
- Agent: `LeadMagnetValidator` (haiku)
- Checks: brand alignment, message clarity, CTA present

### Phase 6 — Upload & Publish
- Tool: `tools/upload-assets.ts`
- Upload to WordPress media library
- Create Notion entry (Content Type: Infographic)
- Update `metadata.json`

---

## Output Files

```
05-output/
  infographic-final.jpg        ← assembled or primary panel
  infographic-panels/          ← individual panels if multi-panel
metadata.json
```

---

## Metadata Schema

```json
{
  "workflow_id": "YYYY-MM-DD-{slug}",
  "type": "infographic",
  "topic": "",
  "status": "draft",
  "panels": 1,
  "wordpress": { "media_ids": [] },
  "notion": { "page_id": "", "url": "" }
}
```
