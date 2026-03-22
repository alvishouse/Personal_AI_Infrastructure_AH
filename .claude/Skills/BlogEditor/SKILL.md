---
name: BlogEditor
description: Elite-level blog content editing and editorial review. USE WHEN user wants to edit blog posts OR user mentions review, polish, proofread, or editorial critique OR user asks to check blog quality, voice consistency, or SEO optimization. Separate from content creation - focuses purely on improving existing drafts.
version: 1.0.0
---

# BlogEditor - Editorial Excellence for Blog Content

**Auto-invoked when editing blog posts.** This skill provides systematic editorial review, brand voice consistency, SEO optimization, and content quality assurance for blog content.

## Core Purpose

Transform draft blog posts into polished, publication-ready content through:
- Multi-pass editing (structural → line → copy → proof)
- Brand voice consistency
- SEO optimization
- Clarity and flow enhancement
- Editorial frameworks for analysis

## When to Use This Skill

**Invoke BlogEditor when:**
- User asks to "edit", "review", "polish", or "proofread" blog content
- User wants editorial feedback on a draft
- User mentions "is this ready to publish?"
- User requests brand voice consistency check
- User asks for SEO optimization review

**DO NOT invoke for:**
- Creating new blog content from scratch (that's drafting/creation)
- Generating blog ideas or outlines
- Writing first drafts

## Integration Points

**Art Skills Integration:**
- Can call DaVinci, Excalidraw, or NapkinSketch skills for visual content
- Recommends featured images and supporting visuals
- Ensures visual metaphors align with written content

**Workflow References:**
- See `workflows/FullEdit.md` - Complete editorial review
- See `workflows/QuickPolish.md` - Fast final polish
- See `workflows/VoiceCheck.md` - Brand voice consistency only
- See `workflows/SEOReview.md` - SEO optimization focus

## Quick Reference

| Task | Workflow |
|------|----------|
| Complete editorial review | `FullEdit.md` |
| Final polish before publish | `QuickPolish.md` |
| Brand voice consistency | `VoiceCheck.md` |
| SEO optimization | `SEOReview.md` |
| Headline/hook critique | Use frameworks in `EditingFrameworks.md` |

## Core Editing Philosophy

**Multi-Pass Approach:**
```
PASS 1 → Structural (Big idea, flow, organization)
PASS 2 → Line editing (Clarity, concision, word choice)
PASS 3 → Copy editing (Grammar, style, consistency)
PASS 4 → Proofreading (Typos, formatting, final polish)
```

**Always maintain:**
- Intellectual rigor and depth
- Clear metaphorical thinking
- Scannable structure (headers, short paragraphs)
- Conversational yet authoritative tone
- Reader-first perspective

## Tool Usage

**Read before edit:**
```bash
# Always read the draft first
Read /path/to/blog/draft.md
```

**Apply frameworks:**
- See `EditingFrameworks.md` for:
  - BIG_IDEA_ANALYSIS
  - HEADLINE_CRITIQUE
  - BODY_CONTENT_CRITIQUE
  - FLOW_ANALYSIS

**Output structure:**
- Use structured report format (see frameworks)
- Provide specific line-level edits
- Prioritize fixes (Critical → Important → Nice-to-have)
- Give clear verdict (Reject / Revise / Approve / Exceptional)

## Key Principles

1. **Clarity over cleverness** - Intellectual content made accessible
2. **Show, don't tell** - Use examples and metaphors
3. **Structure for scanning** - Headers, lists, short paragraphs
4. **Voice consistency** - Match established brand tone
5. **SEO without sacrifice** - Optimize without hurting readability

## Output Format

All editorial reports follow this structure:

```
╔═══════════════════════════════════════════════════════════╗
║           BLOG EDITORIAL REVIEW                          ║
╠═══════════════════════════════════════════════════════════╣
║ Title: [Blog Title]  |  Word Count: [X]                 ║
╚═══════════════════════════════════════════════════════════╝

[Framework analysis results]

─────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
[2-3 sentences on quality and key issues]

─────────────────────────────────────────────────────────────
PRIORITY ACTIONS
🔴 CRITICAL: [Must fix before publish]
🟡 IMPORTANT: [Should fix for quality]
🟢 NICE-TO-HAVE: [Would enhance but optional]

─────────────────────────────────────────────────────────────
VERDICT: [REJECT / REVISE / APPROVE / EXCEPTIONAL]
```

---

**See `EditingFrameworks.md` for detailed analysis frameworks.**
**See `workflows/` for specific editing processes.**
