# Step 13: LinkedIn-First Content Extraction

## Overview

Transform cornerstone content into LinkedIn + Newsletter content using **Outlier Scout methodology** for maximum engagement potential.

**Philosophy:** Quality over quantity. Extract 8-10 Scout-validated LinkedIn pieces (not all 16) + 3-4 newsletter editions. Focus on highest engagement potential content.

**Time:** ~75 minutes total
- Phase 1: Scout analysis (15 min, haiku)
- Phase 2: LinkedIn extraction (30 min, sonnet)
- Phase 3: Posting schedule (10 min, haiku)

## Input Requirements

**Before starting Step 13, ensure you have:**

- [ ] Cornerstone content assembled (06-cornerstone-draft-v3.md or 11-cornerstone-assembled.md)
- [ ] WordPress post published (Step 12 complete)
- [ ] Content metadata available (title, core framework, ICP)

**Load these files into context:**
- Cornerstone content file
- `alvis-house-voice-style-guide.md`
- `02-content-extraction-system-prompt.md` (LinkedIn templates only)
- `Linkedin-outlier-scout.md` (reference)
- `LINKEDIN-HOOK-STRUCTURE.md` (Sanders hook methodology — MANDATORY)

## Phase 1: Scout Analysis (15 minutes)

### Purpose

Use LinkedIn Outlier Scout to analyze cornerstone architecture and identify which sections map to high-engagement LinkedIn formats.

### Agent Configuration

```yaml
agent: LinkedInScout
model: haiku  # Fast analysis
mode: DISSECT  # Post architecture analysis
```

### Task Invocation

```typescript
Task({
  subagent_type: "LinkedInScout",
  model: "haiku",
  description: "Analyze cornerstone structure",
  prompt: `
Run DISSECT mode on the cornerstone content.

INPUT: [Cornerstone file path]

ANALYSIS GOALS:
1. Map each major section to LinkedIn format taxonomy
2. Identify hook types present (Question, Contrarian, Story, Statistic, Bold Claim)
3. Extract reusable skeletons for each section
4. Rate engagement potential (HIGH/MEDIUM/LOW)
5. Provide 3 adaptation angles per section

OUTPUT FORMAT: YAML structure with:
- Total sections analyzed
- Format recommendations for each section
- Engagement potential rankings
- Reusable skeletons with placeholders
- Priority order for extraction (1-10)

Focus on these LinkedIn formats:
- Authority Posts (Credibility + Framework)
- Framework Posts (Mental Model)
- Story Posts (Vulnerability-Based)
- Myth-Busting Posts (Contrarian)
- Case Study Posts (Social Proof)
- Quick Win Posts (Actionable)

CRITICAL: Prioritize formats with highest outlier potential based on:
- Golden Ratio (Comments + Shares / Likes > 0.15)
- Structural patterns that drive conversation
- Hooks that stop the scroll
  `
})
```

### Expected Output

**File:** `13-extracted-content/00-scout-analysis.yaml`

**Structure:**
```yaml
scout_analysis:
  cornerstone_title: "[Title]"
  analysis_date: "[YYYY-MM-DD]"
  total_sections: "[Number]"

  format_recommendations:
    - section: "[Cornerstone Section Name]"
      format: "[LinkedIn Format from Taxonomy]"
      engagement_potential: "[HIGH / MEDIUM / LOW]"
      priority: "[1-10]"
      hook_type: "[Question / Contrarian / Story / Statistic / Bold Claim]"
      reusable_skeleton: |
        [Template with [PLACEHOLDERS]]
      adaptation_angles:
        - angle: "[How to adapt this section]"
          rationale: "[Why this will work]"
        - angle: "[Alternative approach]"
          rationale: "[Why this will work]"
      psychological_pattern: "[Why this structure works]"

  extraction_priority:
    priority_1:
      section: "[Section name]"
      format: "Authority Post"
      rationale: "[Why this should be first]"
    priority_2:
      section: "[Section name]"
      format: "Framework Post"
      rationale: "[Why this should be second]"
    # ... continue for 8-10 pieces

  strategic_notes: |
    [High-level observations about the cornerstone's LinkedIn potential]
```

### Validation Checks

Before proceeding to Phase 2:

- [ ] Scout analysis YAML exists and is complete
- [ ] ALL major cornerstone sections mapped to LinkedIn formats
- [ ] Engagement potential rated for each section
- [ ] Extraction priority order provided (1-10)
- [ ] Reusable skeletons include clear placeholders

## The Sanders Hook Standard (MANDATORY FOR ALL POSTS)

Every LinkedIn post produced in Phase 2 MUST pass all four Sanders criteria before it is considered complete. These are not suggestions — they are quality gates.

### Criterion 1: See More Format

Structure every post as Line → Break → Line. LinkedIn shows approximately **200–210 characters** before the "see more" truncation. Everything that matters must land in that window.

- **Total post limit:** 3,000 characters (letters + spaces + emojis)
- **Visible before "see more":** ~200–210 characters total
- **Line 1:** ≤ 55 characters (mobile-first — 80% of LinkedIn users are on mobile)
- **Line 2:** ≤ 40 characters
- **Format:** [Line 1] + hard paragraph break + [Line 2] + hard paragraph break + body copy
- Lines 1 and 2 together should use ~95–105 of the 200-character visible window, leaving room for the paragraph breaks to register visually

### Criterion 2: High-Performing Hook Types

Every hook must use at least one of these three proven structures:

| Type | Rule | Example |
|------|------|---------|
| **Specific Number** | Use weird, non-rounded numbers — specificity signals authenticity | `"I analyzed 318,842 posts"` not `"I analyzed 300K posts"` |
| **Contrarian** | State an opinion that directly challenges conventional wisdom | `"Your CFO is accidentally right."` |
| **Old vs New** | Position the audience on the cutting edge by naming what changed | `"The myth: more headcount = more capacity. The truth: it worked. Then it stopped."` |

**Number specificity rule:** If a statistic is available as a specific number (e.g., from research), use it exactly. Never round up to a "cleaner" number. `"$2,400,000"` outperforms `"$2.4M"` as a hook.

### Criterion 3: Roll Off the Tongue Test

Before finalizing any hook, read Lines 1 and 2 aloud. If you stumble, rewrite.

- The hook must flow effortlessly when read as an internal voice
- No awkward word order, no grammatical fragments that break rhythm
- Short words preferred over long ones at equal meaning

**Test:** Read it out loud. If it sounds like you're reading a contract, rewrite it.

### Criterion 4: Expansion (Lines 3–4 Make the Reader Feel Seen)

Lines 3–4 (the first lines after the hook) must acknowledge the reader's pain or situation BEFORE delivering any data, solution, or framework. The reader must think "that's me" before they receive value.

**Wrong order:** Hook → Data → Pain → Solution
**Right order:** Hook → Pain (reader feels seen) → Data/Reframe → Solution

**Example of correct expansion:**
```
Line 1: Your CFO is accidentally right.
Line 2: Not for the reason you think.
[break]
Line 3: Everyone in operations treats "do more with less" as a slap.
Line 4: A polite way of saying your problems don't matter.
```
The reader feels seen (lines 3-4) before learning why the CFO is right (lines 5+).

---

## Phase 2: LinkedIn Extraction (30 minutes)

### Purpose

Extract 8-10 LinkedIn pieces using Scout-validated structures. Focus on highest engagement potential formats.

### Agent Configuration

```yaml
agent: content-writer
model: sonnet  # Quality writing needed
color: green
```

### Task Invocation

```typescript
Task({
  subagent_type: "content-writer",
  model: "sonnet",
  description: "Extract LinkedIn content",
  prompt: `
Extract LinkedIn content using Scout analysis + cornerstone content.

INPUT FILES:
- 13-extracted-content/00-scout-analysis.yaml (Scout recommendations)
- [Cornerstone file path]
- 02-content-extraction-system-prompt.md (LinkedIn templates)
- alvis-house-voice-style-guide.md

EXTRACTION RULES:
1. Extract ONLY the top 8-10 pieces from Scout's priority list (not all 16)
2. Use Scout's reusable skeletons as structural templates
3. Maintain Alvis House voice (confident, direct, data-driven)
4. Include specific metrics and examples from cornerstone
5. Each piece must be publication-ready (no placeholders)

PRIORITY ORDER (extract in this sequence):
1. Authority Post (PRIORITY 1) - Framework + Credibility
2. Framework Article (PRIORITY 1) - 800-1200 words for LinkedIn long-form
3. Story Post - Vulnerability-based connection
4. Myth-Busting Post - Contrarian, high engagement
5. Quick Win Posts (2-3) - From framework steps
6. Case Study Post - Social proof
7. Contrarian Take - If cornerstone has strong contrarian angle
8. How-To Post - If implementation section is strong

FOR EACH PIECE, INCLUDE:
---
METADATA:
format_type: "[From Scout taxonomy]"
content_style: "[Steps / Stats / Mistakes / Lessons / Examples]"
funnel_position: "[Top / Middle / Bottom]"
engagement_potential: "[HIGH / MEDIUM / LOW]"
posting_order: "[1-10]"
hook_type: "[From Scout analysis]"
word_count: "[Number]"
estimated_read_time: "[Minutes]"
---

[LINKEDIN CONTENT HERE]

---
STRATEGIC NOTES:
- Best time to post: "[Based on funnel position]"
- Comment strategy: "[Which creators to engage with]"
- Expected engagement: "[Likes/Comments/Shares estimate]"
---

OUTPUT LOCATION: 13-extracted-content/linkedin/posts/
FILE NAMING: 01-authority-post.md, 02-framework-article.md, etc.

POST STRUCTURE REQUIREMENTS (MANDATORY — apply to every post):

RULE 1: CONTENT STYLE VARIETY
Ensure the 8 posts collectively cover all 5 style types:
- Steps: Sequential process, how-to, ordered actions
- Stats: Data-driven, research-backed, metric-led
- Mistakes: Error patterns, what not to do, cautionary
- Lessons: Insights learned, retrospectives, realizations
- Examples: Case studies, stories, concrete illustrations
Add content_style: [Steps/Stats/Mistakes/Lessons/Examples] to each post's metadata.

RULE 2: HEADER FORMATTING DISCIPLINE
Every section header must follow:
- Format: "1 - THE SECTION NAME" (number + space + dash + space + ALL CAPS — no bold markdown, no period)
- ALL CAPS is mandatory: section names are fully uppercase — not sentence case, not title case
- Standalone value test: A reader skimming only the headers must extract 80% of the post's value
- Header count must match the intro promise exactly: if intro says "3 mistakes," there are exactly 3 headers

RULE 3: 4-BLOCK INTRODUCTION STRUCTURE
After the Sanders Hook (Lines 1-2), the introduction must contain:
- Block 2 (Promise): 3-5 sentences OR a bulleted list of 3-5 bullets — name the problem or outcome, why it exists, what's at stake if unsolved
- Block 3 (Solution): 1-2 sentences — complete the promise by stating this post solves that exact problem or delivers that outcome
- Block 4 (Transition): 1 sentence — "Let's walk through each one." / "Here's how." / "Let's dive in."
Total introduction target: ~300-400 characters

RULE 4: WITHIN-SECTION STRUCTURE (labels are internal only — do NOT appear in post)
Every section must follow:
- What: Opening declarative sentence (the hook of this section — states the point directly)
- How: 3-5 tactical pieces using one of: tips, stats, steps, lessons, benefits, mistakes, examples
- Why: One closing sentence — the insight, benefit, or motivating reason that makes the section memorable

RULE 5: ALTERNATING FORMAT + ICONOGRAPHY (CRITICAL)
Sections MUST alternate between bulleted lists and paragraph style throughout the post:
- Section 1 → bulleted list (3-5 bullets)
- Section 2 → paragraph style (3-5 sentences)
- Section 3 → bulleted list
- Section 4 → paragraph style
- (continue alternating)
Conclusion: always short paragraph, never bulleted

SECTION HEADING ICONOGRAPHY — apply to EVERY numbered section heading:
- Format: 📌 1 - THE SECTION NAME IN ALL CAPS
- 📌 (red push pin) always prefixes the section number — signals a new section visually
- One space between 📌 and the number
- Example: 📌 1 - THE CRACK SPREAD, 📌 2 - WHERE THE MONEY LIVES

SUB-BULLET SYSTEM — apply in ALL bulleted list sections:
- Default sub-bullet: • (navy blue round bullet — replaces plain "-" dashes)
- Key insight or learning: 💡
- Problem / failure / blocker / risk: 🔻
- Time delay / sequence / "then" / "before": ⏱️
- Win / correct approach / what works: ✅
- Wrong approach / what not to do: ❌
- Goal / target / desired outcome: 🎯
- Speed / urgency / quick action: ⚡
- Never use 📌 as a sub-bullet — it is reserved for section headings only
- Never use plain "-" dashes as bullets
- Never use emojis decoratively — only when the emoji TYPE matches the content type

RULE 6: PER-SECTION CHARACTER TARGETS
- Hook (Lines 1-2): ~200 characters total visible zone
- Introduction (Blocks 2-4): ~300-400 characters
- Each main section: ~300-450 characters maximum
- Conclusion: ~100-200 characters
- Post target: 2,800 characters (hard ceiling: 3,000)

Compression order when over limit (apply in sequence):
1. Remove redundant phrases and filler words
2. Shorten bullet points to essential elements only
3. Condense paragraph sections while keeping key tactical details
4. Reduce number of examples/bullets per section if necessary

QUALITY BAR:
- Every piece must stop the scroll (strong hook)
- Include at least 1 metric per post
- Action-oriented (tell readers what to do)
- No jargon without definitions
- Confident tone (no hedging)

MANDATORY: SANDERS HOOK STANDARD (apply to every post before output)

Every post MUST pass all four criteria:

1. SEE MORE FORMAT
   - Total post: max 3,000 characters (LinkedIn hard limit)
   - Visible before "see more": ~200–210 characters total
   - Line 1: ≤ 55 characters (mobile-first — 80% of readers are on mobile)
   - Line 2: ≤ 40 characters
   - Structure: [Line 1] + [hard paragraph break] + [Line 2] + [hard paragraph break] + [body]
   - After writing each hook, count characters explicitly and confirm

2. HOOK TYPE (use at least one per post)
   - Specific Number: Use exact, non-rounded numbers (e.g., "318,842" not "300K", "$2,400,000" not "$2.4M")
   - Contrarian: Directly challenge a widely held belief
   - Old vs New: Name what used to work and what replaced it

3. ROLL OFF THE TONGUE TEST
   - Read Lines 1 and 2 aloud before finalizing
   - If you stumble, rewrite
   - Short words preferred; no awkward fragments that break rhythm

4. EXPANSION (Lines 3–4)
   - FIRST: acknowledge the reader's pain or situation (make them feel seen)
   - THEN: deliver data, reframe, or solution
   - Wrong: Hook → Data → Pain
   - Right: Hook → Pain (felt) → Data → Solution

After writing each post, include a Sanders Check block:
SANDERS CHECK:
  line_1_chars: [number] ✓/✗
  line_2_chars: [number] ✓/✗
  hook_type: [Specific Number / Contrarian / Old vs New]
  tongue_test: [pass/fail — note any stumbles]
  expansion_order: [Pain first? yes/no]
  `
})
```

### Expected Output Structure

```
13-extracted-content/
└── linkedin/
    └── posts/
        ├── 01-authority-post.md (PRIORITY 1)
        ├── 02-framework-article.md (PRIORITY 1)
        ├── 03-story-post.md
        ├── 04-myth-buster-post.md
        ├── 05-quick-win-1.md
        ├── 06-quick-win-2.md
        ├── 07-case-study-post.md
        ├── 08-contrarian-take.md (if applicable)
        └── 09-how-to-post.md (if applicable)
```

### LinkedIn Format Templates (Reference)

#### Authority Post (Framework + Credibility)
```
[Line 1: ≤55 chars — bold declarative or contrarian]

[Line 2: ≤40 chars — amplifies tension or adds specificity]

[Block 2 — Promise: 3-5 sentences naming the problem, why it persists, and what's at stake. Keep this under 250 characters.]

[Block 3 — Solution: 1-2 sentences. "That's exactly what [framework name] solves."]

[Block 4 — Transition: "Let's walk through each one."]

1 - THE SECTION NAME IN ALL CAPS

[Section 1 — BULLETED (alternating format):
📌 [Tactical detail 1]
📌 [Tactical detail 2]
📌 [Tactical detail 3]]

[One-sentence closing insight for this section.]

2 - THE NEXT SECTION NAME IN ALL CAPS

[Section 2 — PARAGRAPH (3-5 sentences). Elaborates the step or principle. Specific, not generic. Ends with concrete instruction.]

[One-sentence closing insight.]

3 - THE THIRD SECTION NAME IN ALL CAPS

[Section 3 — BULLETED (use contextual emoji — 🔻 for problems, 💡 for insights, ⏱️ for time delays):
🔻 [Problem or risk detail 1]
🔻 [Problem or risk detail 2]
🔻 [Problem or risk detail 3]]

[One-sentence closing insight.]

[Conclusion — short paragraph: recap the framework + challenge/question for engagement. ~100-200 characters.]
```

#### Story Post (Vulnerability-Based)
```
I [made a mistake / faced a challenge / learned something hard].

Here's what happened:

[Brief story setup - the problem]

[The turning point or realization]

[The lesson learned]

Now [X time later], I see this pattern everywhere:
→ [Universal insight 1]
→ [Universal insight 2]

If you're [facing similar situation], try this:
[Actionable advice]

Have you experienced this? Share in comments.
```

#### Myth-Busting Post (Contrarian)
```
Everyone says [common belief].

They're wrong.

Here's the reality:

[Counter-evidence with data]

Why this myth persists:
[Explanation of why people believe the wrong thing]

What actually works:
[Alternative approach with proof]

The data:
• [Metric 1]
• [Metric 2]

If you're still [following the myth], you're [consequence].

Try [alternative] instead.

Agree? Disagree? Let's discuss.
```

### Validation Checks

After Phase 2:

- [ ] 8-10 LinkedIn pieces created (not fewer, not more)
- [ ] Each piece includes complete metadata section with `content_style` tag
- [ ] 5 style types represented across the batch (Steps, Stats, Mistakes, Lessons, Examples)
- [ ] Each piece has engagement potential rating
- [ ] Posting order is clear (1-10)
- [ ] Strategic notes included for each piece
- [ ] All pieces follow Scout-validated structures
- [ ] Voice matches Alvis House style guide
- [ ] Every piece includes at least 1 metric

**Post Structure — check every post:**
- [ ] 4-block introduction present (Promise block + Solution bridge + Transition)
- [ ] All headers use ALL CAPS format (`1 - THE SECTION NAME`) — no bold, no sentence case, no trailing period
- [ ] Each header delivers standalone value (80% test passes)
- [ ] Sections alternate bullet/paragraph format (odd = bullets, even = paragraphs)
- [ ] Section headings use 📌 prefix format (`📌 1 - THE SECTION NAME`)
- [ ] Bulleted sub-items use • default (💡 insights, 🔻 problems, ⏱️ time delays, ✅ wins, ❌ don'ts, 🎯 goals, ⚡ urgency) — no plain "-" dashes
- [ ] Each section follows What → How → Why structure
- [ ] Conclusion is short paragraph (not bulleted)
- [ ] Total post ≤ 2,800 characters

**Sanders Hook Standard — check every post:**
- [ ] Total post ≤ 3,000 characters (LinkedIn hard limit)
- [ ] Visible zone (Lines 1+2 combined) ≤ 200–210 characters total
- [ ] Line 1 ≤ 55 characters (confirmed by count)
- [ ] Line 2 ≤ 40 characters (confirmed by count)
- [ ] Line-Break-Line format (hard paragraph break between lines 1 and 2)
- [ ] Hook uses Specific Number, Contrarian, OR Old vs New structure
- [ ] Numbers in hooks are specific/non-rounded (e.g., "$2,400,000" not "$2.4M")
- [ ] Lines 1-2 pass the read-aloud tongue test (no stumbles)
- [ ] Lines 3-4 make reader feel seen BEFORE delivering data or solution
- [ ] SANDERS CHECK block present in each post file

## Phase 3: Strategic Posting Schedule (10 minutes)

### Purpose

Create posting schedule using Outlier Scout's 30/30/30/10 engagement framework.

### Agent Configuration

```yaml
agent: content-researcher
model: haiku  # Fast scheduling task
color: cyan
```

### Task Invocation

```typescript
Task({
  subagent_type: "content-researcher",
  model: "haiku",
  description: "Create posting schedule",
  prompt: `
Create a strategic posting schedule for LinkedIn content.

INPUT FILES:
- 13-extracted-content/linkedin/posts/* (all LinkedIn pieces)
- 13-extracted-content/00-scout-analysis.yaml

SCHEDULING FRAMEWORK (30/30/30/10 Model):
- 30% effort: Tier 1 Creators (3-5 with 10x+ follower count)
- 30% effort: Tier 2 Creators (5-10 with similar follower count)
- 30% effort: Tier 3 Creators (10-15 with smaller followings but high engagement)
- 10% effort: Your own content (reply to every comment within 1 hour)

SCHEDULE REQUIREMENTS:
1. Posting order based on Scout priority (Priority 1 pieces first)
2. Optimal timing for each post type
3. Strategic comment targets (which creators to engage with)
4. Expected engagement metrics for each post
5. Engagement tactics specific to each post type

OUTPUT FORMAT:

posting_schedule:
  start_date: "[YYYY-MM-DD]"
  posting_frequency: "[e.g., 3x per week]"

  posts:
    - post_number: 1
      file: "01-authority-post.md"
      format: "Authority Post"
      scheduled_date: "[YYYY-MM-DD]"
      optimal_time: "07:00-09:00 AM PT"
      engagement_strategy:
        tier_1_creators:
          - name: "[Creator name or role]"
            action: "Comment within 15 min of their next post"
            topic: "[Relevant topic to their content]"
        tier_2_creators:
          - name: "[Creator name or role]"
            action: "Deep engagement comment"
        tier_3_creators:
          - name: "[Creator name or role]"
            action: "Share + tag them"
      expected_engagement:
        likes: "[Range]"
        comments: "[Range]"
        shares: "[Range]"
        golden_ratio: "[Target]"

  engagement_calendar:
    week_1:
      - day: "Monday"
        action: "Post Authority Post (07:00 AM)"
      - day: "Monday"
        action: "Engage with Tier 1 creator [Name]"
      - day: "Tuesday"
        action: "Reply to all comments on Authority Post"
      # ... continue

  tier_lists:
    tier_1:
      - name: "[Creator name/role]"
        follower_count: "[Approximate]"
        engagement_rate: "[%]"
        topics: "[Relevant topics]"
        strategy: "[Specific engagement approach]"
    # ... continue for all tiers

OUTPUT FILE: 13-extracted-content/posting-schedule.md
  `
})
```

### Expected Output

**File:** `13-extracted-content/posting-schedule.md`

**Contents:**
- Complete posting calendar with dates and times
- Strategic comment targets (5-7 creators per post)
- Engagement tactics for each post type
- Expected engagement metrics
- Tier 1/2/3 creator lists with engagement strategies

### Validation Checks

After Phase 3:

- [ ] Posting schedule created with specific dates
- [ ] Each post has strategic comment targets (5-7 creators)
- [ ] Engagement tactics are specific (not generic)
- [ ] Tier 1/2/3 creators identified
- [ ] Expected engagement metrics provided
- [ ] Schedule prioritizes Authority Post + Framework Article first

## Step 13 Completion Checklist

Before marking Step 13 complete:

### File Structure Check
- [ ] `13-extracted-content/00-scout-analysis.yaml` exists
- [ ] `13-extracted-content/linkedin/posts/` directory contains 8-10 .md files
- [ ] `13-extracted-content/posting-schedule.md` exists
- [ ] All files are properly formatted (no corrupted YAML/markdown)

### Content Quality Check
- [ ] Scout analysis covers all major cornerstone sections
- [ ] Each LinkedIn piece has complete metadata including `content_style` tag
- [ ] 5 style types (Steps/Stats/Mistakes/Lessons/Examples) covered across 8 posts
- [ ] All headers use `1 - ALL CAPS` format, standalone-valuable
- [ ] Each post has 4-block introduction (Promise + Solution + Transition)
- [ ] Sections alternate bullet/paragraph throughout every post
- [ ] Each section follows What → How → Why structure
- [ ] Every post ≤ 2,800 characters
- [ ] Posting order is clear and justified
- [ ] Strategic notes are specific (not generic)
- [ ] All content matches Alvis House voice
- [ ] Every piece includes at least 1 metric
- [ ] No placeholders or [FILL THIS IN] markers

### Strategic Readiness Check
- [ ] Posting schedule has specific dates
- [ ] Creator engagement targets identified (5-7 per post)
- [ ] Expected engagement metrics provided
- [ ] Authority Post + Framework Article marked as Priority 1

## Metadata Update

Add this to `metadata.json` in the workflow directory:

```json
"step-13": {
  "completed": true,
  "completion_date": "2026-02-05",
  "approach": "linkedin-first-scout-validated",
  "linkedin_pieces": 8,
  "newsletter_editions": 0,
  "scout_analysis": "13-extracted-content/00-scout-analysis.yaml",
  "posting_schedule": "13-extracted-content/posting-schedule.md",
  "priority_posts": [
    "01-authority-post.md",
    "02-framework-article.md"
  ],
  "twitter_extracted": false,
  "visuals_extracted": false,
  "future_extraction": {
    "twitter": "on-demand (Step 13b)",
    "newsletter": "automated (Step 14)",
    "visuals": "on-demand"
  }
}
```

## User Prompt (When Complete)

```
Step 13 Complete: LinkedIn-First Extraction

OUTPUTS:
✓ Scout Analysis: 13-extracted-content/00-scout-analysis.yaml
✓ LinkedIn Posts: 8 pieces ready (see posting-schedule.md for priority order)
✓ Posting Schedule: 13-extracted-content/posting-schedule.md

PRIORITY 1 POSTS (publish these first):
• 01-authority-post.md (Authority Post - Framework + Credibility)
• 02-framework-article.md (Framework Article - 800-1200 words)

NEXT STEPS:
1. Review posting-schedule.md for strategic posting order
2. Post Priority 1 pieces first (highest engagement potential)
3. Engage with Tier 1/2/3 creators per schedule
4. Proceed to Step 13b (LinkedIn Image Generation) — generate images for all 8 posts
```

## Troubleshooting

### Issue: Scout analysis incomplete
**Symptoms:** YAML missing sections or has incomplete recommendations
**Fix:** Re-run Phase 1 with explicit instruction to analyze ALL cornerstone sections

### Issue: LinkedIn pieces generic or missing metrics
**Symptoms:** Content lacks specificity, no quantified data
**Fix:** Re-extract specific pieces with instruction to include cornerstone metrics

### Issue: Posting schedule lacks strategic detail
**Symptoms:** No creator targets, generic "post on LinkedIn" instructions
**Fix:** Re-run Phase 3 with explicit 30/30/30/10 framework requirements

### Issue: Too many/too few pieces extracted
**Symptoms:** More than 10 or fewer than 8 LinkedIn pieces
**Fix:** Review Scout analysis priority list, extract only top 8-10

## Future: On-Demand Extraction (Step 13b)

**Trigger:** "Extract Twitter content from [workflow-id]"

**Process:**
1. Load existing Scout analysis (00-scout-analysis.yaml)
2. Load existing LinkedIn posts (as reference for Twitter adaptation)
3. Extract Twitter threads using Scout's Twitter templates
4. Create visual content briefs from Scout analysis

**Output:**
```
13-extracted-content/
├── twitter/
│   ├── threads/
│   └── standalone/
└── visuals/
    ├── carousel-briefs/
    └── graphic-briefs/
```

---

## Next Step

**→ Step 13b: LinkedIn Image Generation** (`13b-linkedin-image-generation.md`)

Generate 1:1 images for all 8 LinkedIn posts using the Art skill (Wound Analyst → Validator → Generate pipeline). This always runs after Step 13. Do not proceed to Step 14 until images are generated and approved.

---

**End of Step 13 Guide**
