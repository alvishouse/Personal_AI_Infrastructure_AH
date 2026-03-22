---
name: LandingPage
description: HTML-first landing page system for Alvis House — opt-in pages, homepages, and download pages. USE WHEN user wants to redesign or build a homepage OR create an opt-in landing page OR build a download/thank-you page OR user says "redo my homepage" OR "build a landing page" OR "create an opt-in page". Uses Navy/Orange/Cream brand system with long-form conversion architecture. Publishes to WordPress.
---

# LandingPage Skill

Builds conversion-optimized landing pages for Alvis House — homepage, opt-in pages, and lead magnet download pages — as custom HTML deployed to WordPress.

**Key principle:** HTML-first with full design control. No Elementor dependency — pages are custom HTML/CSS deployed as WordPress custom page templates or full-width pages.

---

## Design System

Full brand reference: `DesignSystem.md`
Section patterns: `SectionLibrary.md`

---

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script:**
   ```bash
   ~/.claude/Tools/SkillWorkflowNotification [WorkflowName] LandingPage
   ```
2. **Output the text notification:**
   ```
   Running the **[WorkflowName]** workflow from the **LandingPage** skill...
   ```

| Workflow | Trigger | File |
|----------|---------|------|
| **Homepage** | "redo homepage", "redesign homepage", "build homepage" | `workflows/Homepage.md` |
| **DownloadPage** | "build download page", "thank you page", "lead magnet landing" | `workflows/DownloadPage.md` |

---

## Conversion Architecture (Core Principle)

The long-form opt-in homepage follows this section sequence — every section has ONE job:

```
1. Hero           → State the value proposition + primary CTA
2. Pain Point     → Name the problem the reader has right now
3. What's Inside  → Make the offer tangible (mockup + bullets)
4. Why This Works → Numbered benefit grid (4 blocks)
5. Author Bio     → Story arc: I struggled → I found → You get
6. Testimonials   → 2–3 star-rated social proof cards
7. Press Strip    → Third-party credibility logos
8. Quote + CTA    → Pull quote + secondary opt-in
9. Final CTA      → Dark-bg urgency hammer
10. Footer        → Minimal — privacy + terms only
```

**Rules:**
- No top navbar on conversion pages — nothing competes with the CTA
- Repeat the opt-in form/button minimum 4× (hero, what's inside, quote section, final CTA)
- Button text must be outcome-language: "Get the Playbook" not "Subscribe"
- Sticky CTA bar triggers on scroll past hero

---

## Agents

| Agent | File | Role |
|-------|------|------|
| PageDesigner | `agents/PageDesigner.md` | Maps offer to section plan + writes conversion copy |

---

## Reference

- `reference/alvishouse-current.md` — Current alvishouse.io structure notes
- `reference/long-form-freebie-analysis.md` — Reference page breakdown

---

## Scratchpad Structure

```
scratchpad/landing-pages/
  YYYY-MM-DD-{slug}/
    01-brief/
      brief.md
    02-copy/
      section-copy.md       ← all copy written before HTML
    03-output/
      page.html             ← source of truth
      page-preview.png      ← Playwright screenshot
    metadata.json
```

---

## Examples

**Example 1: Homepage redesign**
```
User: "Redo my homepage to the long-form opt-in style"
→ Runs Homepage workflow
→ PageDesigner maps current content to 10-section conversion architecture
→ Writes section copy using Alvis House voice
→ Builds HTML using SectionLibrary + DesignSystem
→ Reviews in browser → deploys to WordPress
```

**Example 2: Download page**
```
User: "Build the download page for the 90-Day Tax guide"
→ Runs DownloadPage workflow
→ Builds hero + guide preview + download CTA + author strip
→ Deploys to WordPress as a private/unlisted page
```
