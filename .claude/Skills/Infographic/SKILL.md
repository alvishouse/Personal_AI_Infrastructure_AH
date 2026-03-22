---
name: Infographic
description: HTML-first infographic design system for LinkedIn and web publishing. USE WHEN user wants to create an infographic OR visualize a framework, data story, or process flow OR needs a LinkedIn-optimized visual asset OR user says "make an infographic" OR "build an infographic" OR "create a visual". Produces pixel-precise HTML infographics using the Navy/Orange/Cream design system with Playwright export to LinkedIn-standard PNG.
---

# Infographic Skill

Produces LinkedIn-ready infographics as HTML-first assets exported to PNG via Playwright.

**Key principle:** HTML is the source of truth. nano-banana-pro cannot replicate HTML infographics — never attempt it.

---

## Design System

Full reference: `DesignSystem.md`
Component patterns: `ComponentLibrary.md`
Base template: `templates/linkedin-standard.html`

---

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script:**
   ```bash
   ~/.claude/Tools/SkillWorkflowNotification Create Infographic
   ```
2. **Output the text notification:**
   ```
   Running the **Create** workflow from the **Infographic** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **Create** | "create infographic", "build infographic", "make a visual", any infographic request | `workflows/Create.md` |

---

## Agents

| Agent | File | Role |
|-------|------|------|
| InfographicDesigner | `agents/InfographicDesigner.md` | Maps content to narrative arc and HTML section plan |

---

## Scratchpad Structure

```
scratchpad/infographics/
  YYYY-MM-DD-{slug}/
    metadata.json
    01-brief/
      brief.md              ← topic, narrative arc, section plan
    02-design/
      design-brief.md       ← section-by-section content + layout decisions
    03-output/
      infographic.html      ← the infographic (source of truth)
      infographic.png       ← LinkedIn-exported PNG (1080×1350)
```

---

## Examples

**Example 1: Standalone framework infographic**
```
User: "Create an infographic on the 5 stages of AI maturity"
→ Runs Create workflow
→ Maps 5 stages to column structure
→ Produces HTML with navy header, 5-item column, solution CTA
→ Screenshots to 1080×1350 PNG via Playwright
→ Uploads to WordPress
```

**Example 2: Companion to a lead magnet**
```
User: "Build the infographic companion to the 90-Day Tax guide"
→ Runs Create workflow
→ Derives narrative arc from guide content (Problem → Gap → Paths → Solution)
→ Produces HTML using 3-column layout + stat strip
→ Exports PNG for LinkedIn post
```
