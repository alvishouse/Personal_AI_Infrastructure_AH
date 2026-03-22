# Mid-Market AI Newsletter System

## System Architecture for Claude Code Integration

This document defines the newsletter format, content extraction pipeline, and validation framework for building a high-signal AI newsletter targeting VPs and C-suite leaders at $50M–$150M companies. It is designed to operate as a modular system within Claude Code, with discrete skills and sub-agents handling extraction, drafting, validation, and formatting.

---

## Part 1: The Newsletter Blueprint

### Core Design Constraints

- **51 seconds** — average time an executive spends reading a newsletter
- **70% of CEO schedules** are consumed by meetings and emails
- **91% of mid-market leaders** use GenAI, but only **53% feel prepared** to implement it
- Weekly cadence, **1,500–2,000 words** per issue
- Every item must pass the "Forward to the Board" test: does sharing this make the reader look smart?

### Editorial Point of View

Mid-market companies can win with AI *precisely because* they're not enterprises. Agility beats resources. Implementation speed beats sophistication. The newsletter exists to arm executives with the insights, data, and frameworks that make them the most informed person in the room.

---

### Newsletter Structure: The Triage Model

Each issue follows a tiered architecture that serves both scanners (51-second readers) and deep readers. Sections are ordered by urgency and scan-ability.

#### Section 1: TL;DR (Required — Every Issue)

- **Purpose:** The single most important insight, up front. This is the open-rate driver.
- **Length:** 2–3 sentences maximum.
- **Format:** Bold headline + one-line insight + one-line "so what."
- **Example:** *"Your competitors are implementing AI in 90 days, not 18 months. Mid-market agility is the advantage nobody is talking about."*

#### Section 2: Myth vs. Reality — The Assumption Buster (Required — Every Issue)

- **Purpose:** Deliver an immediate belief shift by tackling a widely held assumption and flipping it with evidence.
- **Length:** 100–150 words.
- **Format:** State the myth → provide the reality with a data point or mini case → one-line takeaway.
- **Content Pillar:** Rotates across Strategy, Operations, Culture, ROI.
- **Shareability trigger:** Readers can drop this in conversation: *"Actually, did you know…"*
- **Example Myth:** "AI requires massive data and budget to get results." **Reality:** Mid-sized firms are beating giants by starting with narrow AI projects using existing data, often seeing ROI in under 6 months.

#### Section 3: Quick Win of the Week (Required — Every Issue)

- **Purpose:** A 3-minute implementation tip for immediate value. Low effort, high reward.
- **Length:** 100–150 words.
- **Format:** What to do → why it works → expected result → challenge/CTA.
- **Selection Criteria (The Golden Triangle):** High pain point + Low complexity + Clear ROI measurable within 30 days.
- **Best First Pilots:** Email summarization (saves 2–5 hrs/week), meeting notes automation (30 min/meeting saved), customer FAQ automation (70% ticket reduction in 4–6 weeks).
- **Example:** *"Automate your Monday data report: One sales VP used an AI tool to auto-generate her team's weekly pipeline report — freeing 4 hours/week to focus on closing deals."*

#### Section 4: Metric That Matters (Required — Every Issue)

- **Purpose:** One compelling statistic with context that tells a story. Gives executives shareable proof points.
- **Length:** 75–100 words.
- **Format:** The number (bold, specific) → what it means → why it matters for the reader → provocative question.
- **Stat Selection Criteria:** Must be surprising, specific ("4.5X" beats "much more"), counterintuitive, and ideally proprietary or hard-to-find.
- **Example:** *"26% — That's the share of mid-market firms that don't know how to measure AI ROI. If you can crack measurement, you're ahead of three-quarters of your peers."*

#### Section 5: Rotating Deep Section (1 of 3 — Rotates Each Issue)

Rotate between these three formats to keep the newsletter fresh while maintaining the editorial mix of 30% Strategy / 30% Operations / 20% Culture & People / 20% ROI & Outcomes.

**Option A: Case Study Spotlight**

- **Purpose:** Bite-sized success story of a mid-market company leveraging AI.
- **Length:** 150–200 words.
- **Format:** Scenario → AI solution → outcome with metrics → lesson for the reader.
- **Key Rule:** Must include at least one quantified outcome (dollars, percentage, time saved).
- **Example:** *"How BetaCo reduced customer churn 15% with AI-driven insights — preserving $1.2M in annual revenue."*

**Option B: What It Means for You (Trend Radar)**

- **Purpose:** Take a current AI trend or headline and translate it into mid-market implications.
- **Length:** 150–200 words.
- **Format:** The development (plain language) → 1–2 implications for mid-sized businesses → what to do now.
- **Key Rule:** Always end with a concrete preparation step, not just awareness.
- **Example:** *"GPT-5 launches with advanced reasoning — what it means for you: Customer service bots could handle complex queries, but prepare your data now to capitalize on it."*

**Option C: Culture & Leadership Insight**

- **Purpose:** The human side of AI transformation — leadership tips, change management, upskilling.
- **Length:** 150–200 words.
- **Format:** Insight or mini-story → why it matters → tactical tip or checklist.
- **Key Rule:** Emphasize "augmentation over automation" frame — AI enhances human capability.
- **Example:** *"Why you need an 'AI Champion' in every department — and how one CFO's champion cut budget variance by 20%."*

#### Section 6: Tool of the Week (Optional — Every 2nd or 3rd Issue)

- **Purpose:** Spotlight a specific AI tool with a concrete mid-market use case.
- **Length:** 75–100 words.
- **Format:** Tool name → what it does → specific use case → expected outcome → price range.
- **Key Rule:** Must be implementable by a team of <10 without dedicated IT support.

#### Section 7: Forward CTA (Required — Every Issue)

- **Purpose:** Explicit prompt to share. Research shows prominent "Forward" CTAs make emails 13X more likely to be forwarded.
- **Length:** 1–2 sentences.
- **Format:** Direct ask + value statement.
- **Example:** *"Know a leader wrestling with AI strategy? Forward this — it'll take them 3 minutes and save them 3 months of guesswork."*

---

### Content Pillar Balance (Per Month Across 4 Issues)

| Pillar           | Allocation | Covers                                                         |
| ---------------- | ---------- | -------------------------------------------------------------- |
| Strategy         | 30%        | Positioning, competitive advantage, governance, AI vision      |
| Operations       | 30%        | Implementation playbooks, workflow automation, tool spotlights |
| Culture & People | 20%        | Change management, upskilling, ethical AI, leadership          |
| ROI & Outcomes   | 20%        | Case studies with metrics, benchmarks, cost-benefit analyses   |

### Content Type Distribution (Per Issue)

| Type                       | Weight | Description                                |
| -------------------------- | ------ | ------------------------------------------ |
| Educational / How-to       | 35%    | Frameworks, explanations, step-by-step     |
| Tactical / Tool-focused    | 25%    | Quick wins, tool spotlights, prompts       |
| Data-driven Analysis       | 20%    | Stats, benchmarks, ROI metrics             |
| Inspirational Case Studies | 15%    | Success stories with quantified outcomes   |
| Curated News               | 5%     | Only if directly actionable for mid-market |

---

## Part 2: Content Extraction & Transformation Pipeline

### Overview

The extraction system takes raw source material (long-form articles, LinkedIn posts, big ideas, research reports) and transforms it into newsletter-ready content items that match the defined sections above.

### Sub-Agent Architecture

```
┌─────────────────────────────────────────────────────┐
│                  ORCHESTRATOR AGENT                  │
│  Receives raw input → routes to sub-agents →        │
│  assembles final newsletter draft                    │
└──────────┬──────────┬──────────┬───────────┬────────┘
           │          │          │           │
     ┌─────▼───┐ ┌────▼────┐ ┌──▼──────┐ ┌──▼──────┐
     │EXTRACTOR│ │ DRAFTER │ │VALIDATOR│ │FORMATTER│
     │  AGENT  │ │  AGENT  │ │  AGENT  │ │  AGENT  │
     └─────────┘ └─────────┘ └─────────┘ └─────────┘
```

---

### Sub-Agent 1: EXTRACTOR

**Role:** Parse raw source material and extract structured insight atoms.

**Input Types Handled:**

- Long-form articles or blog posts (1,000–10,000 words)
- LinkedIn post or series of posts
- Raw "big idea" notes or bullet points
- Research reports or survey data
- Podcast transcripts or meeting notes

**Extraction Schema — The Insight Atom:**

Every extracted piece of content is normalized into an "insight atom" — the smallest unit of newsletter-ready information.

```yaml
insight_atom:
  id: string                    # unique identifier
  source_title: string          # original source title
  source_url: string | null     # link if available
  source_type: enum             # article | linkedin | idea | research | transcript
  
  # Core content
  headline: string              # 8–12 word punchy headline
  insight: string               # 1–2 sentence core insight (the "aha")
  evidence: string              # supporting data point, stat, or example
  so_what: string               # 1 sentence: why this matters to a mid-market exec
  action_step: string | null    # concrete next step the reader can take
  
  # Classification
  content_pillar: enum          # strategy | operations | culture | roi
  newsletter_section_fit: list  # which sections this could populate
    # options: tldr | myth_buster | quick_win | metric | case_study | trend | culture | tool
  belief_shift: string | null   # the "from → to" reframe if applicable
  
  # Quality signals
  has_quantified_outcome: bool  # does it include a specific number/metric?
  shareability_score: 1-5       # would an exec forward this? (5 = definitely)
  novelty_score: 1-5            # how counterintuitive is this? (5 = very)
  actionability_score: 1-5      # can they act on this Monday morning? (5 = immediately)
  
  # Metadata
  extracted_stats: list[string] # specific numbers pulled from source
  key_quotes: list[string]      # notable quotes (keep under 14 words each)
  related_frameworks: list      # RTFD, Golden Triangle, etc. if applicable
```

**Extraction Rules:**

1. **Strip all jargon.** Rewrite technical language into executive-friendly plain language.
2. **Prioritize counterintuitive insights.** If the source says something that challenges conventional wisdom, that's the lead.
3. **Quantify everything possible.** Vague claims ("significant improvement") get flagged for validation or removal.
4. **Apply the Cocktail Party Formula** to every atom: surprising stat + why it matters + what to do.
5. **Tag for mid-market relevance.** If the insight only applies to enterprise or small business, flag it. Adapt if possible, discard if not.
6. **Extract no more than 5–7 atoms** per source. Quality over quantity.
7. **Preserve attribution.** Track where each claim originated for fact-checking.

---

### Sub-Agent 2: DRAFTER

**Role:** Transform insight atoms into newsletter section drafts matching the defined formats.

**Section Templates:**

```yaml
# TL;DR Template
tldr_draft:
  headline: "{{ insight_atom.headline }}"
  body: |
    {{ insight_atom.insight }}
    {{ insight_atom.so_what }}
  word_count_target: 40-60

# Myth Buster Template
myth_buster_draft:
  myth_statement: "Myth: {{ conventional_wisdom }}"
  reality_statement: "Reality: {{ insight_atom.insight }}"
  evidence: "{{ insight_atom.evidence }}"
  takeaway: "{{ insight_atom.so_what }}"
  word_count_target: 100-150

# Quick Win Template
quick_win_draft:
  title: "{{ action-oriented headline }}"
  what_to_do: "{{ step-by-step or description }}"
  why_it_works: "{{ insight_atom.evidence }}"
  expected_result: "{{ quantified outcome }}"
  challenge_cta: "{{ insight_atom.action_step }}"
  word_count_target: 100-150

# Metric That Matters Template
metric_draft:
  the_number: "{{ bold stat }}"
  context: "{{ what this measures }}"
  why_it_matters: "{{ insight_atom.so_what }}"
  provocative_question: "{{ question that makes reader think }}"
  word_count_target: 75-100

# Case Study Template
case_study_draft:
  scenario: "{{ the problem }}"
  solution: "{{ the AI approach }}"
  outcome: "{{ quantified result — required }}"
  lesson: "{{ what the reader should take away }}"
  word_count_target: 150-200

# Trend Radar Template
trend_draft:
  development: "{{ what happened, plain language }}"
  implications: "{{ 1-2 mid-market implications }}"
  what_to_do_now: "{{ preparation step }}"
  word_count_target: 150-200

# Culture/Leadership Template
culture_draft:
  insight_or_story: "{{ the human element }}"
  why_it_matters: "{{ connection to AI success }}"
  tactical_tip: "{{ what to do Monday morning }}"
  word_count_target: 150-200
```

**Drafting Rules:**

1. **Write at a Grade 8–10 reading level.** No academic language.
2. **Use active voice.** "Teams that adopted AI saw 20% gains" not "A 20% gain was observed."
3. **Front-load value.** The most important information goes in the first sentence.
4. **One idea per section.** If a draft covers two ideas, split it into two atoms.
5. **Include the belief shift.** Every section should move the reader from an old mental model to a new one.
6. **End with energy.** Each section should close with either a question, a challenge, or a forward-looking statement.
7. **No emojis. No exclamation marks.** Executive tone is confident and understated.

---

### Sub-Agent 3: VALIDATOR

**Role:** Quality-check every drafted section against editorial standards before assembly.

**Validation Checklist (All Must Pass):**

```yaml
validation_checks:
  
  # Content Quality
  - name: "Mid-Market Relevance"
    check: "Is this actionable for a $50M–$150M company with <10 person teams?"
    fail_action: "Rewrite with mid-market framing or discard"
  
  - name: "Belief Shift Present"
    check: "Does this challenge an assumption or offer a new mental model?"
    fail_action: "Add 'from → to' reframe or flag as low-priority filler"
  
  - name: "Quantified Evidence"
    check: "Is there at least one specific number, percentage, or dollar figure?"
    fail_action: "Research and add a supporting stat, or flag for manual review"
  
  - name: "Actionability"
    check: "Could a reader act on this within 90 days (or sooner)?"
    fail_action: "Add concrete next step or downgrade to 'Trend Radar' section"
  
  # Tone & Voice
  - name: "Jargon Check"
    check: "Are there any words a non-technical VP wouldn't immediately understand?"
    fail_action: "Replace with plain-language equivalent"
  
  - name: "Word Count"
    check: "Does the section fall within its target word count range?"
    fail_action: "Trim or expand to fit"
  
  - name: "Confidence Tone"
    check: "Does the writing sound like a trusted advisor, not a salesperson or academic?"
    fail_action: "Rewrite hedging language ('might,' 'could potentially') into confident guidance"
  
  # Shareability
  - name: "Forward Test"
    check: "Would an exec forward this to their leadership team?"
    fail_action: "Sharpen the headline, add a more surprising stat, or reframe"
  
  - name: "Cocktail Party Test"
    check: "Could the reader mention this at a dinner and sound informed?"
    fail_action: "Simplify and add the 'surprising stat + why it matters + what to do' structure"
  
  # Structural
  - name: "Pillar Balance"
    check: "Does this issue maintain the 30/30/20/20 pillar balance across the month?"
    fail_action: "Swap section content to underrepresented pillar"
  
  - name: "No Duplicate Insights"
    check: "Has this insight or a very similar one appeared in the last 4 issues?"
    fail_action: "Replace with fresh atom from extraction backlog"
  
  # Factual
  - name: "Source Attribution"
    check: "Can every stat and claim be traced to a named source?"
    fail_action: "Flag for fact-check or remove unverifiable claim"
  
  - name: "Recency Check"
    check: "Is the data from the last 12 months? (24 months max for foundational research)"
    fail_action: "Search for updated figures or add date context"
```

**Validation Output:**

```yaml
validation_result:
  section_id: string
  status: enum  # pass | pass_with_notes | fail
  issues: list[string]
  suggestions: list[string]
  overall_score: float  # 0.0–1.0 composite of quality signals
  ready_for_assembly: bool
```

---

### Sub-Agent 4: FORMATTER

**Role:** Assemble validated sections into the final newsletter format.

**Assembly Rules:**

1. **Order:** TL;DR → Myth Buster → Quick Win → Metric That Matters → Rotating Deep Section → (Tool of Week if included) → Forward CTA
2. **Total word count:** 1,500–2,000 words.
3. **Visual markers:** Each section gets a consistent emoji-free label/header for scan-ability.
4. **Separator lines** between sections.
5. **Bold key phrases** within body text (no more than 1 bold phrase per 50 words).
6. **Subject line generation:** Create 3 subject line options per issue. Characteristics: specific, curiosity-driven, under 50 characters. Example: *"The 90-day advantage nobody told you about"*

**Output Formats:**

- `newsletter_draft.md` — Markdown for review and editing
- `newsletter_final.html` — Publication-ready HTML (using brand-html-converter skill if available)
- `newsletter_meta.yaml` — Issue metadata (pillar balance, source list, stats used, section types)

---

## Part 3: Skill Definitions for Claude Code

### Skill 1: `newsletter-extractor`

```yaml
name: newsletter-extractor
trigger: "Extract newsletter content from [source]"
description: >
  Takes raw long-form content, LinkedIn posts, or big ideas and 
  extracts structured insight atoms for newsletter use. Outputs 
  a YAML file of insight atoms ranked by shareability and novelty.

inputs:
  - raw_content: string | file_path  # the source material
  - source_type: enum                # article | linkedin | idea | research | transcript
  - source_url: string | null
  - target_pillars: list | null      # filter to specific pillars if needed

outputs:
  - insight_atoms.yaml               # structured atoms per schema above
  - extraction_summary.md            # human-readable summary of what was found

process:
  1. Read and parse source material
  2. Identify key claims, stats, stories, and frameworks
  3. Normalize each into insight atom schema
  4. Score each atom (shareability, novelty, actionability)
  5. Classify by content pillar and section fit
  6. Rank and output top 5-7 atoms
```

### Skill 2: `newsletter-drafter`

```yaml
name: newsletter-drafter
trigger: "Draft newsletter issue [number/date]"
description: >
  Takes a set of insight atoms and assembles them into a complete 
  newsletter draft following the Triage Model structure.

inputs:
  - insight_atoms: list[insight_atom]  # from extractor or manual
  - issue_number: int
  - rotating_section: enum             # case_study | trend | culture
  - include_tool_spotlight: bool
  - previous_issues_meta: list | null  # for dedup and pillar balance

outputs:
  - newsletter_draft.md
  - issue_meta.yaml

process:
  1. Select best-fit atoms for each required section
  2. Apply section templates
  3. Generate 3 subject line options
  4. Generate TL;DR from strongest atom
  5. Write Forward CTA
  6. Check total word count (1,500–2,000)
  7. Output draft and metadata
```

### Skill 3: `newsletter-validator`

```yaml
name: newsletter-validator
trigger: "Validate newsletter draft"
description: >
  Runs the full validation checklist against a newsletter draft. 
  Returns pass/fail status per section with specific improvement suggestions.

inputs:
  - newsletter_draft: file_path
  - previous_issues_meta: list | null  # for dedup checking
  - target_pillar_balance: dict        # monthly targets

outputs:
  - validation_report.md
  - validation_results.yaml

process:
  1. Parse draft into sections
  2. Run each validation check per section
  3. Score composite quality
  4. Flag any failing sections with specific fix suggestions
  5. Check pillar balance against monthly target
  6. Output report
```

### Skill 4: `newsletter-formatter`

```yaml
name: newsletter-formatter
trigger: "Format newsletter for publication"
description: >
  Takes a validated draft and produces publication-ready outputs 
  in markdown and HTML. Applies brand styling if available.

inputs:
  - validated_draft: file_path
  - format: enum                # markdown | html | both
  - brand_styles: file_path | null

outputs:
  - newsletter_final.md
  - newsletter_final.html       # if html or both
  - issue_meta.yaml

process:
  1. Apply final formatting rules (bold limits, separators, headers)
  2. Generate HTML version with brand styles
  3. Add tracking metadata
  4. Output publication-ready files
```

---

## Part 4: Content Extraction Workflow — Step by Step

### Workflow: From Raw Source to Published Newsletter

```
INPUT                    EXTRACT              DRAFT                VALIDATE             FORMAT
────────────────────    ──────────────────   ──────────────────   ──────────────────   ──────────────────
Long-form article   →   Insight atoms    →   Section drafts   →   Quality checks   →   Final .md + .html
LinkedIn post(s)    →   (5-7 per source)     (templated)          (13-point check)     Publication-ready
Big idea notes      →                                                                  
Research report     →                                                                  
```

### Example: Processing a LinkedIn Post

**Raw Input:**

> "Most mid-market CEOs think AI adoption is about buying the right software. 
> Wrong. It's about learning to manage machines that behave like people. 
> The companies winning aren't the ones with the biggest tech budgets — 
> they're the ones whose leaders treat AI like a new intern: 
> give it clear instructions, check its work, and gradually expand its responsibilities. 
> Our data shows companies with this mindset implement 3X faster."

**Extracted Insight Atom:**

```yaml
- id: "atom_2026_0205_001"
  source_type: linkedin
  headline: "AI Adoption Is a Management Skill, Not a Tech Purchase"
  insight: "Companies that treat AI like managing an intern — clear instructions, oversight, gradual responsibility expansion — implement 3X faster than those treating it as a software purchase."
  evidence: "Companies with 'AI as intern' mindset implement 3X faster (source data)."
  so_what: "Your competitive advantage isn't your tech budget. It's your team's ability to delegate to and manage AI — a skill set you already have."
  action_step: "This week, give one team member a 30-minute challenge: delegate a recurring task to an AI tool using the RTFD framework (Role + Task + Format + Details)."
  content_pillar: culture
  newsletter_section_fit: [myth_buster, culture, tldr]
  belief_shift: "From 'AI is a tech purchase' → 'AI is a management skill'"
  has_quantified_outcome: true
  shareability_score: 5
  novelty_score: 4
  actionability_score: 5
  extracted_stats: ["3X faster implementation"]
  key_quotes: []
  related_frameworks: [RTFD, "AI as Intern"]
```

**Drafted as Myth Buster:**

> **MYTH VS. REALITY**
>
> **Myth:** AI adoption is about buying the right software.
>
> **Reality:** The companies implementing AI 3X faster aren't spending more on technology — they're treating AI like managing a new intern. Clear instructions, regular check-ins, gradually expanding responsibilities. Your competitive edge isn't your tech budget. It's your team's ability to delegate to machines — a management skill you already have.
>
> **Your move:** Give one team member a 30-minute challenge this week: delegate a recurring task to an AI tool using clear role, task, format, and detail instructions. Measure the result.

---

## Part 5: Key Frameworks to Embed in the System

These frameworks from the research should be referenced across the system and surfaced in content when relevant.

### The "AI as Intern" Model (Ethan Mollick, Wharton)

| Old Model: Software Update     | New Model: The Intern                    |
| ------------------------------ | ---------------------------------------- |
| Requires coding skills         | Requires clear instructions (prompting)  |
| Expects consistent output      | Needs oversight and review               |
| Owned by IT Department         | Owned by every manager                   |
| Intimidating technical barrier | Management challenge, not tech challenge |

### The Golden Triangle (Pilot Selection)

Select first AI implementations where three criteria intersect: **High Pain Point** (solves a real burning problem) + **Low Complexity** (no massive IT overhaul) + **Clear ROI** (measurable within 30 days).

### The RTFD Prompt Framework

**R**ole + **T**ask + **F**ormat + **D**etails — giving executives specific language to delegate to AI tools effectively.

### The 90-Day Quick-Start Scorecard

| Day 30 Targets                    | Day 90 Targets                    |
| --------------------------------- | --------------------------------- |
| 25% active AI users               | 60% active AI users               |
| 5 hours saved per team/weekly     | 17 hours saved per team/weekly    |
| 1 pilot launched (internal focus) | Move from pilot to implementation |

### Right-Sized Governance (4 Elements Only)

1. **AI Inventory** — document all tools in use, including shadow AI
2. **Acceptable Use Policy** — basic do's and don'ts
3. **Executive Ownership** — assigned responsibility, not a new hire
4. **Risk Categorization** — simple High/Medium/Low tags

### The Cocktail Party Formula (Shareability)

Every shareable insight combines three elements: **A Surprising Stat** + **Why It Matters** + **What To Do About It**.

### ROI Measurement Framework

| Quadrant                   | What to Track                                           |
| -------------------------- | ------------------------------------------------------- |
| Q1: Financial Impact       | (Revenue generated + costs saved) ÷ implementation cost |
| Q2: Operational Efficiency | Process automation rate, time savings metrics           |
| Q3: AI Adoption            | Active users, prompts per employee                      |
| Q4: Model Performance      | Resolution rates without human escalation               |

---

## Part 6: System Configuration & Defaults

```yaml
newsletter_config:
  name: "The Mid-Market AI Playbook"
  frequency: weekly
  target_audience: "VPs and C-suite at $50M–$150M companies"
  word_count_range: [1500, 2000]
  
  required_sections:
    - tldr
    - myth_buster
    - quick_win
    - metric_that_matters
    - forward_cta
  
  rotating_sections:
    - case_study        # every 3 issues
    - trend_radar       # every 3 issues
    - culture_insight   # every 3 issues
  
  optional_sections:
    - tool_of_the_week  # every 2nd or 3rd issue
  
  pillar_targets_monthly:
    strategy: 0.30
    operations: 0.30
    culture_people: 0.20
    roi_outcomes: 0.20
  
  content_type_targets:
    educational_howto: 0.35
    tactical_tools: 0.25
    data_analysis: 0.20
    case_studies: 0.15
    curated_news: 0.05
  
  tone:
    reading_level: "Grade 8-10"
    voice: "Trusted advisor — confident, concise, zero jargon"
    avoid: ["emojis", "exclamation marks", "hedging language", "academic tone"]
    embrace: ["active voice", "specific numbers", "belief shifts", "Monday morning actions"]
  
  subject_line_rules:
    max_characters: 50
    style: "specific + curiosity-driven"
    include_number: true  # when possible
    examples:
      - "The 90-day advantage nobody told you about"
      - "Why your AI budget is solving the wrong problem"
      - "26% can't measure AI ROI. Here's how."

  quality_thresholds:
    min_shareability_score: 3
    min_novelty_score: 3
    min_actionability_score: 3
    min_overall_validation_score: 0.7
```

---

## Appendix: Sample Issue Skeleton

```markdown
# [NEWSLETTER NAME] — Issue #[XX] | [Date]

**Subject Line Options:**
1. [Option A — under 50 chars]
2. [Option B — under 50 chars]  
3. [Option C — under 50 chars]

---

## TL;DR

[2-3 sentences. The single most important insight this week.]

---

## MYTH VS. REALITY

**Myth:** [Common assumption stated clearly]

**Reality:** [Evidence-backed reframe in 2-3 sentences]

**Your move:** [One concrete action step]

---

## QUICK WIN OF THE WEEK

**[Action-oriented headline]**

[What to do. Why it works. Expected result in 100-150 words.]

**Challenge:** [Specific call-to-action for this week]

---

## METRIC THAT MATTERS

**[The Number]** — [What it measures]

[Why this matters for you. 75-100 words.]

[Provocative closing question?]

---

## [ROTATING SECTION: Case Study / Trend Radar / Culture Insight]

**[Headline]**

[150-200 words following the appropriate template]

---

## FORWARD THIS →

[1-2 sentence CTA prompting the reader to share with their team]

---

*[Newsletter name] is read by [X] mid-market executives weekly.*
*[Unsubscribe] | [Share with a colleague]*
```