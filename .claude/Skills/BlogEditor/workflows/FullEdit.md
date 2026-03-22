# Full Editorial Review Workflow

**Complete editorial review for blog posts ready for detailed editing.**

Use this workflow when the user asks for comprehensive editorial review or says "edit this blog post".

---

## Purpose

Systematic editorial review covering:
- Big Idea and thesis strength
- Structure and flow
- Clarity and readability
- Brand voice consistency
- SEO optimization
- Visual content recommendations

**Time investment:** Thorough, detailed analysis. Use for important posts.

---

## 🚨 MANDATORY STEPS

```
INPUT: Blog draft (markdown file)
     ↓
[1] READ: Full content review
     ↓
[2] ANALYZE: Apply editorial frameworks
     ↓
[3] REPORT: Structured editorial report
     ↓
[4] RECOMMEND: Priority actions + visuals
     ↓
[5] VERDICT: Reject / Revise / Approve / Exceptional
```

---

## Step 1: Read Full Content

**Read the blog draft completely:**
```bash
Read /path/to/blog/draft.md
```

**Initial assessment:**
- What's the word count?
- What's the reading time? (word count ÷ 250)
- What's the core thesis?
- What's the intended audience?
- What's the current status? (first draft? revision?)

---

## Step 2: Apply Editorial Frameworks

**Run these analyses in order:**

### 2A: BIG_IDEA_ANALYSIS

From `EditingFrameworks.md`:
- Extract the core thesis (one sentence)
- Rate: Uniqueness, Intellectual Depth, Reader Value, Proof Alignment, Memorability
- Score out of 50
- Identify thesis weaknesses

**Output:** Big Idea score and recommendations

---

### 2B: HEADLINE_CRITIQUE

From `EditingFrameworks.md`:
- Analyze current headline
- Rate: Attention Value, Clarity/Curiosity Balance, Authenticity, Thesis Connection
- Check proven elements used
- Score out of 100
- Suggest 2-3 alternative headlines

**Output:** Headline score and alternatives

---

### 2C: BODY_CONTENT_CRITIQUE

From `EditingFrameworks.md`:
- Evaluate: Structure & Flow, Transitions, Clarity, Scannability, Evidence & Support, Voice Consistency
- Map content flow: Hook → Context → Problem → Solution → Evidence → Action
- Identify breaks, foggy areas, density issues
- Score out of 60

**Output:** Body content score and specific fixes

---

### 2D: SEO_REVIEW

From `EditingFrameworks.md`:
- Identify primary and secondary keywords
- Check on-page SEO elements
- Assess readability (Flesch score, grade level)
- Evaluate content depth vs competitors
- Score out of 100

**Output:** SEO score and optimization recommendations

---

### 2E: VOICE_CONSISTENCY

From `EditingFrameworks.md`:
- Check tone, vocabulary, perspective, personality
- Compare to target voice attributes
- Identify voice breaks or inconsistencies
- Score out of 10

**Output:** Voice alignment score and adjustments

---

## Step 3: Generate Editorial Report

Use the template from `EditingFrameworks.md`:

```
╔═══════════════════════════════════════════════════════════╗
║           BLOG EDITORIAL REVIEW                          ║
╠═══════════════════════════════════════════════════════════╣
║ Title: [Blog Title]                                      ║
║ Word Count: [X]  |  Reading Time: [X] min               ║
║ Status: [DRAFT/REVISION/FINAL]                          ║
╚═══════════════════════════════════════════════════════════╝

[All framework results from Step 2]

─────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY

[2-3 sentences: What works? What needs work? Overall quality?]

─────────────────────────────────────────────────────────────
PRIORITY ACTIONS

🔴 CRITICAL (Must fix before publish):
1. [Specific, actionable fixes]
2. [Line numbers or section references]

🟡 IMPORTANT (Should fix for quality):
1. [Improvements that strengthen content]
2. [Line numbers or section references]

🟢 NICE-TO-HAVE (Would enhance but optional):
1. [Polish and optimization]
2. [Enhancement ideas]

─────────────────────────────────────────────────────────────
VISUAL RECOMMENDATIONS

Featured Image: [Da Vinci / Excalidraw / Napkin]
Concept: [One sentence describing visual metaphor]
Rationale: [Why this style fits content]

Supporting Visuals:
1. [Stat card / Framework / Diagram - Description]
2. [Additional visual - Description]

─────────────────────────────────────────────────────────────
SEO NOTES

Primary Keyword: [keyword]
Secondary Keywords: [keyword 2], [keyword 3]
Current Optimization: [LOW/MEDIUM/HIGH]
Quick Wins: [Specific SEO improvements]

─────────────────────────────────────────────────────────────
VERDICT: [REJECT / REVISE / APPROVE / EXCEPTIONAL]

[If REVISE: provide specific edits or rewrites]
[If APPROVE: note any final polish items]
[If EXCEPTIONAL: explain what makes it outstanding]
```

---

## Step 4: Provide Specific Edits (If REVISE)

**When verdict is REVISE, provide:**

### Line-Level Edits:

```
LINE-LEVEL EDITS
─────────────────────────────────────────────────────────────

Section: [Heading name]
Current: "[Exact text from draft]"
Revised: "[Your suggested rewrite]"
Reason: [Why this is better]

Section: [Heading name]
Current: "[Exact text from draft]"
Revised: "[Your suggested rewrite]"
Reason: [Why this is better]

[Continue for all critical and important edits]
```

### Structural Recommendations:

```
STRUCTURAL CHANGES
─────────────────────────────────────────────────────────────

1. [Move section X before section Y because...]
2. [Add transition between paragraphs X and Y...]
3. [Break dense paragraph in Section X into 2-3 shorter ones...]
4. [Add subheading before paragraph starting with "..."]
```

---

## Step 5: Call to Action

**End the editorial report with next steps:**

```
─────────────────────────────────────────────────────────────
NEXT STEPS

[For REJECT:]
□ Revisit Big Idea and thesis
□ Restructure content with new outline
□ Address fundamental issues listed above
□ Request new review when restructured

[For REVISE:]
□ Apply critical fixes (red flags)
□ Consider important improvements (yellow flags)
□ Request re-review or proceed to quick polish
□ Generate visual content (featured image + supporting)

[For APPROVE:]
□ Apply any nice-to-have polish items
□ Run final proofread (typos, formatting)
□ Generate visual content if not done
□ Ready for publication

[For EXCEPTIONAL:]
□ Final proofread only
□ Generate/verify visual content
□ Publish immediately
```

---

## Workflow Checklist

**Before starting:**
- [ ] Read draft completely
- [ ] Understand the intended audience
- [ ] Know the publication timeline (affects depth of edits)

**During analysis:**
- [ ] Apply all 5 frameworks systematically
- [ ] Take notes on specific issues with line/section references
- [ ] Identify patterns (repeated issues)
- [ ] Consider visual metaphors for images

**Report generation:**
- [ ] Use structured template
- [ ] Provide specific, actionable feedback
- [ ] Prioritize fixes (critical → important → nice-to-have)
- [ ] Include visual recommendations
- [ ] Give clear verdict with rationale

**After report:**
- [ ] If user requests, apply edits directly to draft
- [ ] If visual content requested, invoke appropriate art skill
- [ ] Save editorial report for reference

---

## Example Usage

```
User: "Edit this blog post"
User: [Provides path to draft]