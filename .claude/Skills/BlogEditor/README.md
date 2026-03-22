# BlogEditor Skill

**Elite-level blog content editing and editorial review for PAI.**

Separate and distinct from content creation - focuses purely on improving existing drafts.

---

## Quick Start

### When to Use BlogEditor

BlogEditor auto-invokes when you:
- Ask to "edit this blog post"
- Request "editorial review"
- Say "is this ready to publish?"
- Want "voice consistency check"
- Need "SEO optimization"

### Which Workflow to Use

| Your Need | Workflow | Time |
|-----------|----------|------|
| Complete editorial review | `FullEdit.md` | 15-30 min |
| Final polish before publish | `QuickPolish.md` | 5-10 min |
| Brand voice consistency only | `VoiceCheck.md` | 5-10 min |
| SEO optimization focus | `SEOReview.md` | 10-15 min |

---

## Directory Structure

```
BlogEditor/
├── SKILL.md                     # Skill definition (auto-loaded by PAI)
├── README.md                    # This file
├── EditingFrameworks.md         # Analysis frameworks for editorial review
├── workflows/
│   ├── FullEdit.md             # Complete editorial review workflow
│   ├── QuickPolish.md          # Fast final polish workflow
│   ├── VoiceCheck.md           # Brand voice consistency workflow
│   └── SEOReview.md            # SEO optimization workflow
└── templates/
    └── StyleGuide.md           # Brand voice and editorial standards
```

---

## Core Philosophy

### Multi-Pass Editing

Always edit in this order:
```
PASS 1 → Structural (Big idea, flow, organization)
PASS 2 → Line editing (Clarity, concision, word choice)
PASS 3 → Copy editing (Grammar, style, consistency)
PASS 4 → Proofreading (Typos, formatting, final polish)
```

### Editorial Frameworks

Five systematic frameworks for analysis:

1. **BIG_IDEA_ANALYSIS** - Core thesis evaluation
2. **HEADLINE_CRITIQUE** - Title and hook assessment
3. **BODY_CONTENT_CRITIQUE** - Flow, clarity, engagement
4. **SEO_REVIEW** - Search optimization checklist
5. **VOICE_CONSISTENCY** - Brand voice alignment

All frameworks in `EditingFrameworks.md`.

---

## Typical Usage

### Full Editorial Review

```bash
User: "Edit this blog post"
User: [Provides /path/to/draft.md]

BlogEditor: [Invokes FullEdit workflow]
→ Reads complete draft
→ Applies all 5 frameworks
→ Generates structured editorial report
→ Provides priority actions (Critical/Important/Nice-to-have)
→ Recommends visual content
→ Gives verdict: Reject / Revise / Approve / Exceptional
```

### Quick Polish Only

```bash
User: "Quick polish before publish"
User: [Provides /path/to/draft.md]

BlogEditor: [Invokes QuickPolish workflow]
→ Rapid editorial checklist
→ Grammar, clarity, formatting fixes
→ Final verification scan
→ Status: Ready to publish or needs attention
```

### Voice Consistency Check

```bash
User: "Does this sound like me?"
User: [Provides content]

BlogEditor: [Invokes VoiceCheck workflow]
→ Samples key sections
→ Applies voice consistency framework
→ Scores tone, vocabulary, perspective, personality
→ Provides specific voice adjustments
→ Verdict: Off-brand / Inconsistent / Aligned / Exemplary
```

### SEO Optimization

```bash
User: "Optimize for SEO"
User: [Provides draft + optional keywords]

BlogEditor: [Invokes SEOReview workflow]
→ Keyword research (if needed)
→ On-page SEO audit
→ Readability assessment
→ Content depth evaluation
→ Prioritized optimization recommendations
→ Score: Needs work / Good foundation / Well optimized / Excellent
```

---

## Integration with Art Skills

BlogEditor works with visual content skills:

```
BlogEditor detects visual recommendations needed:
→ Analyzes content for visual metaphors
→ Recommends: Da Vinci / Excalidraw / Napkin style
→ Suggests: Featured image concept
→ Identifies: Supporting visual opportunities

User can then:
→ Invoke appropriate art skill (DaVinci / Excalidraw / NapkinSketch)
→ Generate images based on BlogEditor recommendations
```

---

## Output Format

All editorial reports follow structured format:

```
╔═══════════════════════════════════════════════════════════╗
║           [REPORT TYPE]                                  ║
╠═══════════════════════════════════════════════════════════╣
║ Title: [Blog Title]                                      ║
║ [Relevant metadata]                                      ║
╚═══════════════════════════════════════════════════════════╝

[Framework analysis results]

─────────────────────────────────────────────────────────────
EXECUTIVE SUMMARY
[2-3 sentences on quality and key issues]

─────────────────────────────────────────────────────────────
PRIORITY ACTIONS
🔴 CRITICAL: [Must fix]
🟡 IMPORTANT: [Should fix]
🟢 NICE-TO-HAVE: [Would enhance]

─────────────────────────────────────────────────────────────
[Additional sections based on workflow]

─────────────────────────────────────────────────────────────
VERDICT: [REJECT / REVISE / APPROVE / EXCEPTIONAL]
```

---

## Key Principles

1. **Clarity over cleverness** - Make complex ideas accessible
2. **Structure for scanning** - Headers, lists, short paragraphs
3. **Voice consistency** - Match established brand tone
4. **Evidence-based** - Support claims with data
5. **Reader-first** - Always ask "what does reader gain?"
6. **SEO without sacrifice** - Optimize without hurting quality

---

## Brand Voice Summary

**Core attributes:**
- Intellectual yet accessible
- Conversational authority (expert friend, not guru)
- Curiosity-driven with analytical rigor
- Pattern-recognizing and systems-thinking
- Practical idealism (grounded vision)
- Slightly irreverent (questions orthodoxy)

**Preferred metaphors:**
- Mechanical/physical (levers, gears, amplification)
- Architectural/structural (blueprints, frameworks)
- Everyday objects (napkins, whiteboards, tools)

**Avoid:**
- Buzzwords and hype (revolutionary, game-changing)
- War/sports metaphors
- Corporate-speak (leverage, synergy, paradigm)
- Jargon without explanation

See `templates/StyleGuide.md` for complete voice profile.

---

## Files Reference

### Primary Documents

- **SKILL.md** - Skill definition, triggers, integration points
- **EditingFrameworks.md** - All 5 analysis frameworks with scoring
- **StyleGuide.md** - Complete brand voice and editorial standards

### Workflows

- **FullEdit.md** - Comprehensive editorial review (all frameworks)
- **QuickPolish.md** - Fast final polish (grammar, clarity, formatting)
- **VoiceCheck.md** - Brand voice consistency only
- **SEOReview.md** - Search optimization focus

---

## Tips for Effective Editing

### For FullEdit:
- Read completely before analyzing
- Apply all 5 frameworks systematically
- Provide specific line references for issues
- Prioritize fixes clearly (Critical → Important → Nice-to-have)
- Include visual content recommendations

### For QuickPolish:
- Time-box to 10-15 minutes
- Focus on obvious issues only
- Use find/replace for repeated problems
- Escalate to FullEdit if major issues discovered

### For VoiceCheck:
- Sample key sections (don't need full read)
- Compare to target voice profile in StyleGuide.md
- Provide before/after examples for adjustments
- Score each voice attribute separately

### For SEOReview:
- Start with keyword research if not provided
- Never sacrifice quality for SEO
- Focus on natural keyword integration
- Prioritize high-impact optimizations first

---

## Common Editing Issues

### Structural:
- Unclear thesis (fix in first 2 paragraphs)
- Poor flow between sections (add transitions)
- Dense paragraphs >5 sentences (break into smaller chunks)
- Missing subheadings (add every 3-4 paragraphs)

### Voice:
- Too formal/academic (shift to conversational)
- Buzzwords and hype (replace with concrete language)
- Wrong POV (adjust we/you/I usage)
- Missing personality (add metaphors, examples)

### Clarity:
- Jargon without explanation (define or replace)
- Passive voice >10% (convert to active)
- Long sentences >25 words (break up)
- Vague claims (add specific data/examples)

### SEO:
- Missing primary keyword in title/H1 (add naturally)
- No meta description (write 155-160 chars)
- Poor readability score (simplify sentences, break paragraphs)
- No internal/external links (add relevant links)

---

## Version History

- **v1.0.0** (2026-01-26) - Initial BlogEditor skill creation
  - Five editorial frameworks
  - Four specialized workflows
  - Complete style guide
  - Integration with art skills

---

**Questions? Check workflow files for detailed step-by-step processes.**
**Need voice reference? See templates/StyleGuide.md.**
**Want framework details? See EditingFrameworks.md.**
