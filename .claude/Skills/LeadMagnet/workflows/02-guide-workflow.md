# Workflow: Lead Magnet Guide Creation

> **Status:** Stub — update after `reference-guidelines.md` is added to the skill root.

Produces a multi-page PDF guide (how-to, framework, checklist, or playbook) for lead capture.

---

## Phases

### Phase 1 — Topic & Outline
- Define the guide title and core promise (what the reader walks away with)
- Choose guide type: How-To, Framework, Checklist, Playbook
- Target page count: 5 (checklist), 10 (framework), 15–20 (playbook)
- Reference: `reference-guidelines.md` for content examples and structural patterns

### Phase 2 — Research
- Agent: `content-researcher` (sonnet)
- Output: `01-research/research.md`

### Phase 3 — Content Writing
- Agent: `LeadMagnetWriter` (sonnet)
- Input: research.md + reference-guidelines.md
- Output: `03-content/guide-draft.md`
  - Cover page copy
  - Chapter/section content
  - Callout boxes, stats, examples
  - CTA page

### Phase 4 — Design Brief
- Agent: `InfographicDesigner` (sonnet)
- Input: guide-draft.md + reference-guidelines.md
- Output: `02-design-brief/design-brief.md`
  - Page layout per section
  - Cover image prompt
  - Supporting visual prompts (charts, icons, illustrations)

### Phase 5 — Asset Generation
- Tool: Art skill for cover + supporting visuals
- Tool: `BrandHTMLConverter` for styled HTML → PDF source

### Phase 6 — PDF Generation
- Tool: `tools/generate-pdf.ts` (Puppeteer headless HTML → PDF)
- Output: `05-output/guide-final.pdf`

### Phase 7 — Validation
- Agent: `LeadMagnetValidator` (haiku)
- Checks: brand alignment, promise fulfilled, CTA on final page, page count target met

### Phase 8 — Upload & Publish
- Upload PDF to WordPress media library
- Create Notion entry (Content Type: Lead Magnet Guide)
- Update `metadata.json`

---

## Output Files

```
05-output/
  guide-final.pdf
  guide-cover.jpg              ← cover image for social/WP preview
metadata.json
```

---

## Metadata Schema

```json
{
  "workflow_id": "YYYY-MM-DD-{slug}",
  "type": "lead-magnet-guide",
  "topic": "",
  "guide_type": "how-to | framework | checklist | playbook",
  "status": "draft",
  "page_count": 0,
  "wordpress": { "pdf_id": "", "cover_id": "" },
  "notion": { "page_id": "", "url": "" }
}
```
