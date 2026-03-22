# Step 14: Newsletter Creation (Triage Model)

## Overview

Transform LinkedIn content + cornerstone into executive-grade weekly newsletter using **4-agent pipeline**: Extractor → Drafter → Validator → Formatter.

**Target Audience:** Mid-market executives (VPs, C-suite at $50M-$150M companies)
**Format:** Triage Model (7 sections, 1,500-2,000 words, 51-second scan time)
**Philosophy:** Executive-scannable, board-forwardable insights

**Time:** ~50 minutes total
- Phase 1: Extract atoms (15 min, haiku)
- Phase 2: Draft newsletter (20 min, sonnet)
- Phase 3: Validate (10 min, haiku)
- Phase 4: Format (5 min, haiku)

## Input Requirements

**Before starting Step 14, ensure you have:**

- [ ] LinkedIn posts from Step 13 (8-10 pieces in `13-extracted-content/linkedin/posts/`)
- [ ] Cornerstone content (06-cornerstone-draft-v3.md or 11-cornerstone-assembled.md)
- [ ] Optional: External research articles for additional atoms

**Load these files into context:**
- All LinkedIn post files
- Cornerstone content
- `newsletter-config.yaml`
- `alvis-house-voice-style-guide.md`

## Phase 1: Extract Insight Atoms (15 minutes)

### Purpose

Transform LinkedIn posts, cornerstone, and optional research into **insight atoms**: executive-grade knowledge units scored on shareability, novelty, actionability.

### Agent Configuration

```yaml
agent: NewsletterExtractor
model: haiku  # Fast extraction
color: blue
```

### Task Invocation (Parallel Execution)

**Run 3 extractors in parallel** (one per source type):

```typescript
// Extractor 1: LinkedIn posts
Task({
  subagent_type: "NewsletterExtractor",
  model: "haiku",
  description: "Extract atoms from LinkedIn",
  prompt: `
Extract insight atoms from LinkedIn posts.

INPUT FILES:
- 13-extracted-content/linkedin/posts/* (all LinkedIn pieces)
- newsletter-config.yaml (quality thresholds)

EXTRACTION GOALS:
- Extract 5-7 atoms total (not per post, total across all LinkedIn content)
- Prioritize atoms with highest quality scores (shareability, novelty, actionability ≥3)
- Focus on distinct insights (no overlapping atoms)

OUTPUT FORMAT: YAML (see NewsletterExtractor agent guide)
OUTPUT FILE: 14-newsletter/insight-atoms-linkedin.yaml
  `
})

// Extractor 2: Cornerstone content
Task({
  subagent_type: "NewsletterExtractor",
  model: "haiku",
  description: "Extract atoms from cornerstone",
  prompt: `
Extract insight atoms from cornerstone content.

INPUT FILES:
- [Cornerstone file path]
- newsletter-config.yaml

EXTRACTION GOALS:
- Extract 5-7 atoms from different cornerstone sections
- Avoid duplicating LinkedIn post insights
- Focus on deeper strategic insights not covered in LinkedIn

OUTPUT FILE: 14-newsletter/insight-atoms-cornerstone.yaml
  `
})

// Extractor 3 (Optional): External research
Task({
  subagent_type: "NewsletterExtractor",
  model: "haiku",
  description: "Extract atoms from research",
  prompt: `
Extract insight atoms from external research.

INPUT FILES:
- [Research articles/reports]
- newsletter-config.yaml

EXTRACTION GOALS:
- Extract 3-5 atoms with strong quantified evidence
- Focus on recent data (<12 months)
- Complement (not duplicate) LinkedIn + cornerstone atoms

OUTPUT FILE: 14-newsletter/insight-atoms-research.yaml
  `
})
```

### Expected Output Structure

```
14-newsletter/
├── insight-atoms-linkedin.yaml (5-7 atoms)
├── insight-atoms-cornerstone.yaml (5-7 atoms)
└── insight-atoms-research.yaml (optional, 3-5 atoms)
```

### Insight Atom Example

```yaml
atoms:
  - insight_atom:
      id: "atom-001"
      source: "LinkedIn Post - Authority Post"
      source_url: "https://linkedin.com/posts/..."

      headline: "Why 70% of AI projects fail in month 4"
      insight: "AI projects fail not from technical issues, but from misaligned success metrics. Teams optimize for model accuracy while executives measure business impact. By month 4, the gap becomes unbridgeable."
      evidence: "Analysis of 200 enterprise AI projects shows 70% failure rate, with 85% citing metric misalignment as primary cause."
      so_what: "If you're starting an AI project in Q1 2026, you have a 4-month window to align metrics before the project becomes unrecoverable."
      action_step: "In your next AI kickoff, create a shared scorecard with 3 technical + 3 business metrics. Measure both weekly."

      quality_scores:
        shareability: 5
        novelty: 4
        actionability: 4

      classification:
        content_pillar: "Operations"
        newsletter_section_fit: "TL;DR"
        funnel_position: "Middle"

      metadata:
        word_count: 127
        extraction_date: "2026-02-05"
        confidence: "HIGH"
```

### Validation Checks

After Phase 1 (wait for all 3 extractors to complete):

- [ ] 15-20 total atoms extracted across all sources
- [ ] Every atom scores ≥3 on all three quality dimensions
- [ ] No duplicate insights across sources
- [ ] Pillar distribution roughly matches targets (30/30/20/20)
- [ ] At least 1 atom mapped to each newsletter section type
- [ ] All atoms have quantified evidence

## Phase 2: Draft Newsletter Sections (20 minutes)

### Purpose

Assemble insight atoms into 7-section Triage Model newsletter structure.

### Agent Configuration

```yaml
agent: NewsletterDrafter
model: sonnet  # Quality writing needed
color: blue
```

### Task Invocation

```typescript
Task({
  subagent_type: "NewsletterDrafter",
  model: "sonnet",
  description: "Draft newsletter issue",
  prompt: `
Draft newsletter issue using insight atoms.

INPUT FILES:
- 14-newsletter/insight-atoms-linkedin.yaml
- 14-newsletter/insight-atoms-cornerstone.yaml
- 14-newsletter/insight-atoms-research.yaml (if exists)
- newsletter-config.yaml (section templates, pillar targets)
- alvis-house-voice-style-guide.md

DRAFTING REQUIREMENTS:

SECTION SELECTION:
1. TL;DR (50-75 words): Select atom with shareability = 5
2. Myth vs Reality (200-250 words): Select atom with novelty ≥ 4
3. Quick Win (150-200 words): Select atom with actionability = 5
4. Metric That Matters (200-250 words): Select atom with strongest quantified evidence
5. Rotating Deep Section (400-500 words): Case Study OR Trend OR Culture (choose based on available atoms)
6. Tool Spotlight (150-200 words): Optional, every 2-3 issues
7. Forward CTA (75-100 words): Derive from TL;DR atom

INBOX HOOK FRAMEWORK (Subject + Preheader):
Subject and preheader work TOGETHER as a 2-line inbox hook — like the opening
2 lines of a LinkedIn post. They are inseparable. Read them aloud as one unit.

SUBJECT LINE RULES (Line 1 of the hook):
- Under 50 characters
- Pain-first, contrarian, or story — NOT stat-first
- Must sound like something a person would actually say
- Hook types: Contrarian ("Your CFO is accidentally right.") | Story ("He stopped
  asking for headcount.") | Direct wound ("Requesting headcount is the wrong answer.")
  | Threat ("Your competitor isn't hiring. They're winning.")
- Generate 5 options. Rank by emotional sharpness.

PREHEADER RULES (Line 2 of the hook):
- Under 100 characters
- Deepens the wound OR raises stakes — NEVER explains the subject
- Must add NEW information (don't restate the subject)
- AVOID starting with "Why" or "How to" — that's informational, not a hook
- Good: "The gap isn't people. It's intelligence per person. Here's the 3-move fix."
- Bad: "Why your competitor stopped asking for headcount — and how to close the gap"

INTRODUCTION STRUCTURE (4-Block Framework):
Every newsletter opens with these 4 blocks in order:
  Block 1 — Hook (1 sentence): question / surprising stat / moment-in-time / counterintuitive claim
             Must contain a specific number, company name, or counterintuitive claim. NO "Hey there!" openers.
  Block 2 — Stakes (3-5 sentences): what the problem is + why it exists + negative consequences of inaction
             Use tangible, viscerally measurable language (not abstract).
  Block 3 — Solution preview (1-2 sentences): what this issue covers / helps solve
  Block 4 — Transition (1 sentence): "Let's walk through each one" / "Here's what the data shows"

SECTION STRUCTURE:
- Start every section with a single framing sentence (sets the section's purpose)
- End every section with a single takeaway sentence (lands the section's core insight)

TANGIBLE LANGUAGE RULE:
Translate all abstract language to viscerally measurable outcomes.
  WRONG: "improves team efficiency"
  RIGHT: "saves 6 hours per week per employee"
Never use intangible phrases — every benefit or consequence must be measurable or physically feelable.

SENTENCE RHYTHM:
Alternate long and short sentences for pacing throughout.
  Example: Long sentence establishing context → Short sentence landing the insight → Long sentence with evidence → Short takeaway.

WRITING RULES:
- Confident, authoritative tone (confidence: 95/100)
- Active voice throughout
- No hedging ("might", "could", "possibly")
- Short paragraphs (max 4 sentences)
- Bold 1-2 key phrases per section
- Include LinkedIn cross-references where relevant

ADDITIONAL DELIVERABLES:
- 5 subject line options (30-50 characters each, built from full 6-part headline first)
- Preheader text (50-100 characters)
- Issue metadata (pillar %, atom IDs used, sources cited)

OUTPUT FILES:
- 14-newsletter/newsletter-draft.md (full newsletter)
- 14-newsletter/issue-meta.yaml (metadata + subject lines)
  `
})
```

### Expected Output Structure

**File: newsletter-draft.md**

```markdown
---
subject_line_options:
  - "The 4-month AI failure window (and how to close it)"
  - "Why 76% of AI projects fail by month 4"
  - "The one metric that predicts AI success"
preheader: "Why metric misalignment kills 85% of AI projects"
issue_number: "[Number]"
issue_date: "2026-02-10"
---

# [Newsletter Title]

---

## TL;DR

[Content from highest shareability atom]

---

## Myth vs Reality

[Content from highest novelty atom]

---

## Quick Win of the Week

[Content from highest actionability atom]

---

## Metric That Matters

[Content from best-evidenced atom]

---

## [Deep Section Title]

[Case Study OR Trend OR Culture content]

---

## Forward CTA

[Sharing prompt derived from TL;DR]
```

**File: issue-meta.yaml**

```yaml
issue_metadata:
  issue_number: 1
  issue_date: "2026-02-10"
  subject_line_options:
    - "[Option 1]"
    - "[Option 2]"
    - "[Option 3]"
    - "[Option 4]"
    - "[Option 5]"
  recommended_subject: "[Option X]"

  content_summary:
    tldr_topic: "[Core hook]"
    myth_addressed: "[Belief challenged]"
    quick_win_action: "[Main action]"
    metric_introduced: "[Metric name]"
    deep_section_type: "[Case Study / Trend / Culture]"
    tool_included: "[Y/N]"

  pillar_distribution:
    strategy: "[%]"
    operations: "[%]"
    culture: "[%]"
    roi: "[%]"

  atoms_used:
    - "atom-001"
    - "atom-002"
    # ...

  word_count:
    total: "[Number]"
    tldr: "[Number]"
    myth: "[Number]"
    quick_win: "[Number]"
    metric: "[Number]"
    deep: "[Number]"
    tool: "[Number or N/A]"
    forward_cta: "[Number]"

  linkedin_references:
    - post_title: "[LinkedIn post title]"
      link: "[URL]"
      section: "[Which newsletter section]"

  sources_cited:
    - "[Source 1]"
    - "[Source 2]"
```

### Validation Checks

After Phase 2:

- [ ] Newsletter draft exists with all 7 sections (or 6 if no Tool Spotlight)
- [ ] Total word count: 1,500-2,000
- [ ] Each section within word count ranges
- [ ] Introduction has 4-block structure (hook → stakes → solution → transition)
- [ ] Each section starts and ends with a single sentence
- [ ] 5 subject line options provided (under 50 characters each, pain/contrarian/story — NOT stat-first)
- [ ] Preheader generated as hook Line 2 (adds tension or stakes, does NOT start with "Why" or "How to")
- [ ] Issue metadata complete
- [ ] LinkedIn posts referenced with working links
- [ ] All atoms used are cited in metadata

## Phase 3: Validate Newsletter (10 minutes)

### Purpose

Run 13-point quality checklist to ensure newsletter meets mid-market executive editorial standards.

### Agent Configuration

```yaml
agent: NewsletterValidator
model: haiku  # Fast validation
color: blue
```

### Task Invocation

```typescript
Task({
  subagent_type: "NewsletterValidator",
  model: "haiku",
  description: "Validate newsletter draft",
  prompt: `
Run 13-point validation checklist on newsletter draft.

INPUT FILES:
- 14-newsletter/newsletter-draft.md
- 14-newsletter/issue-meta.yaml
- newsletter-config.yaml (validation rules)
- Previous 4 issues (for duplicate check) [if available]

VALIDATION CHECKLIST (must score all 13):
1. Mid-market relevance ($50M-$150M companies)
2. Belief shift present (challenges assumption)
3. Quantified evidence (all claims have numbers)
4. Actionability (Quick Win ≤90 days)
5. Jargon check (all terms defined)
6. Word count compliance (1,500-2,000 total)
7. Confidence tone (no hedging)
8. Forward Test (would VP forward? Score 4-5)
9. Cocktail Party Test (can explain TL;DR in 30 sec)
10. Pillar balance (monthly cumulative within ±10%)
11. No duplicates (distinct from last 4 issues)
12. Source attribution (all data attributed)
13. Recency check (all data <12 months)

PASS CRITERIA:
- Overall score ≥ 0.7
- Zero FAIL statuses
- Forward Test score ≥ 4

IF VALIDATION FAILS:
- Provide specific, actionable fixes ranked by priority
- Include estimated time to fix each issue
- Flag to user for manual edits

OUTPUT FILE: 14-newsletter/validation-report.md
  `
})
```

### Expected Output

**File: validation-report.md**

```yaml
validation_report:
  issue_number: 1
  validation_date: "2026-02-05"
  overall_score: 0.85
  ready_for_publication: "YES"

  checklist_results:
    1_mid_market_relevance:
      status: "PASS"
      score: 1.0
      notes: "All examples cite mid-market companies, budgets realistic"

    8_forward_test:
      status: "PASS"
      score: 5
      normalized_score: 1.0
      notes: "TL;DR is board-ready, Metric section is highly shareable"

    # ... all 13 checks

  priority_fixes: []  # Empty if passing

  summary: |
    Newsletter PASSED validation with score 0.85/1.0.
    Forward Test score: 5/5 (board-ready content).
    Ready for formatting and publication.
```

### Validation Outcomes

#### If PASS (Overall Score ≥ 0.7, no FAIL statuses):

```
Newsletter Validation PASSED

Overall Score: 0.85/1.0
Forward Test Score: 5/5

All checks passed. Newsletter is ready for formatting.

Optional Improvements (non-blocking):
- Consider adding one more mid-market case study in Deep Section
- TL;DR could be tightened by 5-10 words

Proceeding to Phase 4 (Formatter)...
```

#### If FAIL (Overall Score < 0.7 or any FAIL status):

```
Newsletter Validation FAILED

Overall Score: 0.65/1.0 (threshold: 0.7)

FAILING CHECKS:
- Check #3 (Quantified Evidence): FAIL
  Issue: Metric section lacks specific source attribution
  Fix: Add source name for "70% failure rate" statistic (Est: 5 min)

- Check #8 (Forward Test): Score 3/5
  Issue: TL;DR is interesting but lacks shareable hook
  Fix: Rewrite opening with specific number or surprising claim (Est: 10 min)

PRIORITY FIXES (ranked by impact):
1. TL;DR Hook: Add specific metric to opening sentence → Est: 10 min
2. Source Attribution: Add source to Metric section stat → Est: 5 min

Review 14-newsletter/validation-report.md for full details.

Make edits to newsletter-draft.md and re-run validator?
```

**USER ACTION REQUIRED:** If validation fails, user must edit `newsletter-draft.md` and re-run Phase 3 validator.

### Validation Checks

After Phase 3:

- [ ] Validation report exists and is complete
- [ ] Overall score calculated correctly
- [ ] Forward Test score provided
- [ ] All 13 checks executed with specific feedback
- [ ] If failing: Priority fixes ranked and specific
- [ ] Ready_for_publication: YES/NO determination made

## Phase 4: Format for Publication (5 minutes)

### Purpose

Generate publication-ready markdown and HTML formats with brand styling.

### Agent Configuration

```yaml
agent: NewsletterFormatter
model: haiku  # Fast formatting
color: blue
```

### Task Invocation

```typescript
Task({
  subagent_type: "NewsletterFormatter",
  model: "haiku",
  description: "Format newsletter for publication",
  prompt: `
Format validated newsletter into publication-ready outputs.

INPUT FILES:
- 14-newsletter/newsletter-draft.md (validated)
- 14-newsletter/validation-report.md (passed validation)
- 14-newsletter/issue-meta.yaml
- newsletter-config.yaml (brand colors, styling)

FORMATTING REQUIREMENTS:

MARKDOWN OUTPUT:
- Clean hierarchy (# for title, ## for sections)
- Visual breaks (---) between sections
- Bold key phrases (1-2 per section)
- Working links (no placeholders)
- LinkedIn cross-references with URLs

HTML OUTPUT:
- Inline CSS (email-compatible)
- Mobile-responsive (max-width: 600px)
- Dark mode support
- Brand colors from config
- TL;DR section in highlighted box
- CTA button for Forward action

ADDITIONAL DELIVERABLES:
- Subject line selection (choose 1 of 3, justify choice)
- Preheader text (complementary to subject)
- UTM parameters on all external links
- Complete metadata file

OUTPUT FILES:
- 14-newsletter/newsletter-final.md
- 14-newsletter/newsletter-final.html
- 14-newsletter/issue-meta-final.yaml
  `
})
```

### Expected Output Structure

```
14-newsletter/
├── newsletter-final.md (publication-ready markdown)
├── newsletter-final.html (email-optimized HTML with inline CSS)
└── issue-meta-final.yaml (complete metadata)
```

### Validation Checks

After Phase 4:

- [ ] Both markdown and HTML files generated
- [ ] HTML has inline CSS (not external stylesheet)
- [ ] All links are working (no placeholder URLs)
- [ ] Subject line selected with justification
- [ ] Preheader text generated
- [ ] UTM parameters added to external links
- [ ] Metadata file complete with final word counts
- [ ] HTML tested for email compatibility

## Phase 5: Push to Notion (Automatic)

### Purpose

Sync the validated, formatted newsletter to the Notion Content database for review, archiving, and cross-platform linking.

### When to Run

**Runs automatically after Phase 4 completes** (formatter outputs validated + final files). No manual trigger needed.

### Newsletter Icon

The newsletter icon is a custom PNG uploaded to WordPress for a stable permanent URL:
```
https://alvishouse.io/wp-content/uploads/2026/02/newsletter-icon.png
```
This matches the icon used on Newsletter Issue #1 ("The Learning Curve You Can't Buy Back"). Use this same icon for all newsletter issues.

### Task Invocation

```typescript
// Inline script or bun file — no subagent needed, runs in main context
const NOTION_TOKEN = "[from .credentials.json]";
const CONTENT_DB = "3030760eb0cd81c5874be6f7e9637807";
const NEWSLETTER_ICON = "https://alvishouse.io/wp-content/uploads/2026/02/newsletter-icon.png";

// Properties to set:
// - Content Name: "Newsletter Issue #N: [Subject Line or Campaign Title]"
// - Platform: Newsletter
// - Content Type: Newsletter
// - Status: In Progress
// - Campaign: [workflow campaign slug, e.g. "2026-02-15-dumb-pipe"]
// - Word Count, Estimated Read Time
// - Related Content: [cornerstone page ID]
// - Workflow: [workflow page ID]
// - Local File Path: file://[path to newsletter-final.md]
// - Strategic Notes: subject line + validation score + sections summary

// Body blocks:
// 1. Callout: "Issue #N · Date · Subject · Validation score · Forward Test"
// 2. Divider
// 3. Full newsletter body (split into 1900-char paragraphs, ## → heading_2, --- → divider)

// IMPORTANT: Notion API max 100 children per request.
// If body exceeds 95 blocks, create page with first 95, then PATCH remaining.
```

### Expected Notion Page Structure

```
Icon: [newsletter-icon.png] (custom PNG)
Title: Newsletter Issue #N: [Subject Line]
Properties:
  Platform: Newsletter
  Content Type: Newsletter
  Campaign: [slug]
  Status: In Progress
  Word Count: [N]
  Related Content: → [Cornerstone blog]
  Workflow: → [Workflow entry]

Body:
  📬 Callout: Issue metadata summary
  ---
  [Full newsletter content as headings + paragraphs]
```

### Validation Checks

After Phase 5:
- [ ] Notion page created with newsletter icon (not emoji, not LinkedIn icon)
- [ ] Campaign property set (matches LinkedIn posts + images from same campaign)
- [ ] Related Content links to the source cornerstone blog
- [ ] Workflow relation is set
- [ ] Full body is readable in Notion (all sections visible, headings formatted)
- [ ] Notion page ID saved to `metadata.json` under `step-14.notion_page_id`

---

## Step 14 Completion Checklist

Before marking Step 14 complete:

### File Structure Check
- [ ] `14-newsletter/` directory exists with all files
- [ ] Insight atom YAML files (2-3 sources)
- [ ] Newsletter draft, validation report, final outputs
- [ ] Issue metadata (draft + final versions)

### Content Quality Check
- [ ] 15-20 insight atoms extracted
- [ ] All atoms score ≥3 on quality dimensions
- [ ] Newsletter draft passes validation (score ≥0.7)
- [ ] Forward Test score ≥4
- [ ] Final outputs are publication-ready

### Cross-Platform Integration Check
- [ ] Newsletter references 3+ LinkedIn posts
- [ ] LinkedIn links are working
- [ ] Cross-platform traffic strategy in place

### Notion Sync Check
- [ ] Newsletter page created in Notion Content database
- [ ] Newsletter icon applied (newsletter-icon.png, not emoji)
- [ ] Campaign property matches LinkedIn posts from same workflow
- [ ] Notion page ID saved to metadata.json

## Metadata Update

Add this to `metadata.json` in the workflow directory:

```json
"step-14": {
  "completed": true,
  "completion_date": "2026-02-05",
  "issue_number": 1,
  "issue_date": "2026-02-10",
  "insight_atoms_extracted": 18,
  "sections": {
    "tldr": true,
    "myth_buster": true,
    "quick_win": true,
    "metric": true,
    "rotating_section": "case_study",
    "tool_spotlight": false,
    "forward_cta": true
  },
  "validation_score": 0.85,
  "forward_test_score": 5,
  "word_count": 1847,
  "linkedin_references": 3,
  "subject_lines": [
    "The 4-month AI failure window (and how to close it)",
    "Why 76% of AI projects fail by month 4",
    "The one metric that predicts AI success",
    "How 1 scorecard closes AI's 4-month gap",
    "76% failure rate — and the fix that takes a week"
  ],
  "selected_subject": "The 4-month AI failure window (and how to close it)",
  "notion_page_id": "[Notion page ID]",
  "notion_url": "[Notion page URL]",
  "outputs": {
    "markdown": "14-newsletter/newsletter-final.md",
    "html": "14-newsletter/newsletter-final.html",
    "meta": "14-newsletter/issue-meta-final.yaml"
  }
}
```

## User Prompt (When Complete)

```
Step 14 Complete: Newsletter Creation

NEWSLETTER ISSUE #1 READY FOR REVIEW

Subject Line (Recommended): "The 4-month AI failure window (and how to close it)"
Word Count: 1,847 (target: 1,500-2,000)
Validation Score: 0.85/1.0 (threshold: 0.7)
Forward Test Score: 5/5 (board-ready content)

SECTIONS:
✓ TL;DR
✓ Myth vs Reality
✓ Quick Win of the Week
✓ Metric That Matters
✓ Case Study Spotlight
✓ Forward CTA

LINKEDIN INTEGRATION:
• 3 LinkedIn posts referenced with links
• Cross-platform traffic strategy implemented

OUTPUTS:
• Markdown: 14-newsletter/newsletter-final.md
• HTML: 14-newsletter/newsletter-final.html (email-optimized)
• Metadata: 14-newsletter/issue-meta-final.yaml

NEXT STEPS:
1. Review newsletter-final.md for final approval
2. Run Step 14b: Publish to WordPress newsletter CPT + send via Brevo
   - Create post (type: newsletter) with excerpt + content
   - Fill Subject Line, Preheader, Issue # in WP admin metabox
   - Publish → Brevo campaign auto-created
   - Click "Send to Subscribers" when ready
3. Post LinkedIn teaser with link to WordPress newsletter URL

Want to make edits before publishing? [Y/N]
```

## Step 14b: Publish to WordPress + Send via Brevo (Optional, ~5 min)

### Purpose

After the newsletter passes validation (Step 14 Phase 3), publish it to WordPress as a `newsletter` custom post type. WordPress serves as the "read online" destination. Brevo sends a minimal excerpt email to subscribers with a CTA linking to the WordPress post.

**Plugin required:** `pai-newsletter-plugin.php` must be installed and active.
**File location:** `Skills/WordPressPublisher/pai-newsletter-plugin.php`

### What the Plugin Does

1. **Newsletter CPT** — Public post type at `/newsletter/[slug]/`, SEO-indexed
2. **On publish** — Automatically creates a Brevo campaign draft (List #4)
3. **Brevo email content** — Excerpt only + "Read the full issue →" button
4. **Manual send** — "Send to Subscribers" button in WP admin sidebar metabox
5. **Tracking** — Brevo handles opens, clicks, unsubscribes automatically

### WordPress HTML Template (REQUIRED)

The WordPress newsletter post MUST use the **alvishouse.io `nl-*` CSS class system** — NOT generic inline-CSS HTML. This template provides the brand identity: Montserrat font, navy/orange/cream palette, SVG section icons, card layout.

**Template reference:** Issue #2 (Dumb Pipe Phenomenon) at `https://alvishouse.io/newsletter/newsletter-issue-2-dumb-pipe-phenomenon/`

**Template structure:**

```html
<div class="nl-outer">
  <!-- Header: navy bg, orange bottom bar, logo -->
  <div class="nl-header"> ... </div>

  <!-- Issue metadata: issue #, subject, date -->
  <div class="nl-meta-bar"> ... </div>

  <!-- Per-section cards (one per section) -->
  <div class="nl-card">
    <div class="nl-content">
      <div class="nl-section-title-row">
        <!-- SVG icon + section label + section title -->
        <svg>...</svg>
        <span class="nl-section-label">SECTION TYPE</span>
        <h2>Section Title</h2>
      </div>
      <div class="nl-card-inner">
        <!-- Section content (p, ul, strong, etc.) -->
      </div>
    </div>
  </div>

  <!-- Footer: navy bg, links -->
  <div class="nl-footer"> ... </div>
</div>
```

**SVG icons by section type:**
- TL;DR → lightning bolt
- Myth vs Reality → scales of justice
- Quick Win → target/bullseye
- Metric That Matters → bar chart
- Case Study → briefcase
- Forward CTA → forward arrow

**Images to upload to WordPress media before building HTML:**
- Myth vs Reality section → editorial infographic (AI Cost Myth)
- Metric section → editorial infographic (Capacity Dividend Framework)
- Hero → featured AI-generated image for the campaign

### Task: Build and Publish Newsletter via Script

Build the WP-formatted HTML and publish in one step:

```bash
# Step 1: Upload section images + build nl-* template HTML + update WP post
bun run /tmp/build-newsletter.ts
# (or use publish-newsletter-to-wp.ts for the standard script)
```

**What the build step does:**
1. Reads `14-newsletter/newsletter-final.md` + section images from `scratchpad/infographics/`
2. Uploads 2-3 section images to WordPress media (returns media IDs + URLs)
3. Builds full `nl-*` template HTML using those image URLs
4. Saves HTML to `14-newsletter/newsletter-wp.html`
5. Creates or updates the WordPress `newsletter` CPT post via REST API
6. Updates `metadata.json` with `newsletter_post_id`, `newsletter_post_url`, WP media IDs

**Full workflow doc:** `Skills/WordPressPublisher/workflows/PublishNewsletter.md`

**Note on outputs:** You will have two HTML files after Step 14:
- `newsletter-final.html` — Generic inline-CSS email HTML (from NewsletterFormatter agent)
- `newsletter-wp.html` — alvishouse.io `nl-*` template HTML (from build step above)

**Full workflow doc:** `Skills/WordPressPublisher/workflows/PublishNewsletter.md`

### Send Flow

1. Script creates WordPress newsletter draft → prints draft URL
2. Check draft at `/newsletter/[slug]/` (optional visual review)
3. Change WP status to `publish` (via admin or MCP) → Brevo campaign auto-created
4. Click **"Send to Subscribers"** in WordPress admin metabox when ready
5. Status updates to Sent, timestamp recorded

### MCP Publish (when ready to go live)

```
mcp__wordpress__update_post:
  id: [newsletter_post_id from metadata.json]
  status: "publish"
```

Note: Publishing triggers the `publish_newsletter` hook, which creates the Brevo campaign automatically.

### Validation Checks

- [ ] WordPress newsletter post published at `/newsletter/[slug]/`
- [ ] Brevo campaign appears in Brevo dashboard (Campaigns → Email Campaigns)
- [ ] Email preview shows excerpt + "Read the full issue" button
- [ ] Subject line and preheader match `issue-meta-final.yaml`
- [ ] "Send to Subscribers" button visible in WP admin metabox
- [ ] After send: `newsletter_send_status = sent`, `newsletter_sent_at` populated

---

## Troubleshooting

### Issue: Low atom quality scores
**Symptoms:** Many atoms scoring <3 on quality dimensions
**Fix:** Re-run Phase 1 Extractor with explicit instruction to filter for high-quality insights only

### Issue: Validation fails on Forward Test
**Symptoms:** Forward Test score <4, newsletter not shareable
**Fix:** Rewrite TL;DR with stronger hook, add specific metric or surprising claim

### Issue: Word count out of range
**Symptoms:** Total <1,500 or >2,000 words
**Fix:** If too short, expand Deep Section. If too long, trim tertiary details from Deep Section

### Issue: Newsletter references no LinkedIn content
**Symptoms:** Missing cross-platform integration
**Fix:** Re-run Phase 2 Drafter with explicit instruction to reference LinkedIn posts

### Issue: HTML not rendering correctly in email
**Symptoms:** Broken layout, missing styles
**Fix:** Verify inline CSS (not external), test in email preview tool (Litmus, Email on Acid)

## Integration with Overall Workflow

**Step 13 Output → Step 14 Input:**
- LinkedIn posts become insight atoms
- Scout analysis informs atom selection
- Posting schedule aligns with newsletter send dates

**Step 14 Output → Distribution:**
- Newsletter references LinkedIn posts
- LinkedIn posts promote newsletter signup
- Cross-platform ecosystem created

**Monthly Rhythm:**
- Week 1: Publish cornerstone + LinkedIn posts
- Week 2-4: Send newsletters (1 per week)
- Month-end: Review pillar balance, adjust next month

---

## Next Step

**→ Workflow Complete.** Step 14 is the final step. After the newsletter is sent via Brevo, the content workflow for this piece is done. Archive the scratchpad folder to History if desired.

---

**End of Step 14 Guide**
