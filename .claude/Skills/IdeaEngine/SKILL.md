---
name: IdeaEngine
description: Ad-hoc content idea generator with two modes. USE WHEN user wants to generate new topic ideas OR user provides a seed topic/concept to explore OR user wants to find ideas from LinkedIn data OR user says "expand this idea" or "give me ideas from" or "what should I write about". Outputs formatted entries for other-topics.md to feed the content workflow. NOT part of the 14-step content sequence — runs independently.
---

# IdeaEngine Skill

**Purpose:** Generate new content ideas on demand. Feeds `other-topics.md` and the content workflow without being part of the automated sequence.

**Two Modes:**
- **Signal Scan** — mines LinkedIn engagement data to surface what your audience is signaling they want
- **Polymath Expand** — takes any seed (word, concept, event, question) and generates a cross-domain portfolio of blog ideas

---

## Mode 1: Signal Scan

**Trigger phrases:** "scan my signals", "find ideas from my LinkedIn", "what's resonating", "what should I write about based on my data"

### What to Read

**Step 1: Performance benchmarks**
```
.claude/Skills/WordPressPublisher/workflows/Content Create Flow/linkedin-top-post-benchmarks.md
```

**Step 2: Published LinkedIn posts** — scan scratchpad for any workflow's extracted LinkedIn posts:
```
scratchpad/content-create/*/13-extracted-content/linkedin/posts/*.md
```
Look for: hook patterns, comment-bait structures, what topics were actually written.

**Step 3: LinkedInMonitor database** (if active):
```bash
# Check if monitor DB exists
ls ~/.claude/Skills/LinkedInMonitor/data/*.db 2>/dev/null || echo "No DB yet"

# If exists, query for high-engagement signals
bun -e "
import Database from 'bun:sqlite';
const db = new Database('/home/alvis/PAI/.claude/Skills/LinkedInMonitor/data/monitor.db');
const posts = db.query('SELECT * FROM posts ORDER BY likes DESC LIMIT 20').all();
console.log(JSON.stringify(posts, null, 2));
"
```

**Step 4: Comment themes from monitor** (if active):
```bash
bun -e "
import Database from 'bun:sqlite';
const db = new Database('/home/alvis/PAI/.claude/Skills/LinkedInMonitor/data/monitor.db');
const comments = db.query('SELECT content, post_url FROM comments ORDER BY created_at DESC LIMIT 50').all();
console.log(JSON.stringify(comments, null, 2));
"
```

### Signal Analysis Framework

After reading available data, identify:

**1. Engagement Anomalies**
- Which posts exceeded expected engagement? What topic cluster do they share?
- What hook structures generated the most comments (Golden Ratio > 10%)?

**2. Comment Pattern Mining**
- What objections or questions appear in comment threads?
- What follow-up content are commenters implicitly requesting?
- What phrases/vocabulary does the audience use that you're not using in posts?

**3. Topic Gaps**
- Cross-reference published topics against the 10 Evergreen Tracks
- Which tracks have NO derivative content yet?
- What's the most recent track used? What would complement it in sequence?

**4. Trend Signals** (from watched account posts in monitor)
- What topics are high-engagement accounts in your niche writing about?
- Any vocabulary patterns or frame shifts emerging across multiple accounts?

### Signal Scan Output

Produce **5-8 topic ideas** derived from signals. For each:

```
**[Topic Title]**
Signal Source: [comment theme / engagement spike / gap analysis / watch account trend]
Why Now: [1-2 sentences on timing/urgency]
The Angle: [your unique take — not what everyone else would say]
Related Evergreen Track: [Track # or "None — standalone"]
Audience Signal Quote: [verbatim language from a comment or post that points to this need, if available]
Evaluation Score: [/25 using other-topics.md criteria]
```

Then output **2-3 ready-to-paste `other-topics.md` Quick Add entries** for the highest-scoring ideas.

---

## Mode 2: Polymath Expand

**Trigger phrases:** "expand this idea", "polymath", "give me blog ideas from [seed]", "what can I write about [topic]", user provides a seed concept

**The Polymath Engine** — full system prompt is in `polymath-engine.md`.

**Before running the Polymath Engine**, do this contextual grounding:

### Alvis House Context Filter

Apply this filter to everything the Polymath Engine generates:

**ICP:** Mid-Market Squeezed — Directors/VPs of Operations and C-Level executives (50-500 employees) who are responsible for AI adoption outcomes but are squeezed between board pressure to move fast and front-line resistance to change. They feel behind, misled by hype, and embarrassed by pilot failures.

**The Offer:** AI Readiness & Adoption Program — helps organizations move from chaotic AI experimentation to structured, measurable AI adoption.

**Positioning:** Alvis House is the person who reads widely, synthesizes across domains, and delivers business clarity through unexpected lenses. Cross-disciplinary insight is the brand differentiator.

**Voice:** Declarative. Optimistic but challenging. No hedge words. Concrete metaphors. 5th-grade reading level with MBA-level insight.

**Evergreen Track Alignment:** Before finalizing any idea, check it against the 10 Tracks:
- T1: Systems — T2: Culture — T3: Data Flow
- T4: Strategy — T5: Pilot-to-Scale — T6: Design Thinking
- T7: BYOAI — T8: 6 Pillars of Readiness
- T9: Efficiency → Innovation — T10: Judgment over Automation

For each blog concept brief, note: **Does this extend, deepen, or reframe an existing Track? Or is it genuinely new territory?**

### Running the Polymath Expand

1. Load `polymath-engine.md` — this is the full system prompt
2. Apply the Alvis House Context Filter to ALL outputs
3. For every Blog Concept Brief, add:
   - **Track Alignment:** Which Evergreen Track this touches (or "New Territory")
   - **Inner Album Candidate:** Yes/No — could this become a permanent evergreen thread?
4. After the full Polymath output, generate the **`other-topics.md` Quick Add entries** for the top 3 concepts

### Polymath Expand Output

Deliver the full Polymath Engine analysis (see `polymath-engine.md` for section structure), then close with:

**→ CONTENT WORKFLOW FEED**

```
Top 3 concepts formatted for other-topics.md:

### [Concept Title]

**Category:** [AI Trends / Case Study / Contrarian / Story / etc.]

**One-Line Summary:** [The core insight in 15 words or less]

**Related Evergreen Track:** [Track # and name, or "New Territory"]

**Why Now:** [1-2 sentences]

**Unique Angle:** [The cross-domain connection that makes this distinctly Alvis House]

**Evaluation Score:** [/25]
  - Audience Relevance: /5
  - Business Alignment: /5
  - Timeliness: /5
  - Differentiation: /5
  - Extraction Potential: /5

**Inner Album Candidate:** [Yes — rationale / No — rationale]

**Status:** Queued

**Date Added:** [today's date]
```

---

## Combined Mode: Idea Sprint

**Trigger:** "run an idea sprint", "give me everything", "full idea generation"

Run both modes in sequence:
1. Signal Scan (data-grounded ideas)
2. Polymath Expand on the top signal (or a seed if provided)
3. Merge into a single queue of 8-12 prioritized, formatted `other-topics.md` entries

---

## Feeding the Content Workflow

Once ideas are generated, the user has three paths:

**Path A: Add to Queue**
Copy the Quick Add entries into `other-topics.md` under the appropriate category table.

**Path B: Promote to Inner Album**
If Inner Album Candidate = Yes, draft a new Track entry in `inner-album-of-greatest-hits.md` using the existing Track format (Core Principle / Enemy / Picture / Parable / Reuse Map).

**Path C: Start Immediately**
Tell Claude: "Start the content workflow with [idea title]" — this triggers Step 1 of the 14-step workflow using the selected concept.

---

## Quick Reference

| User Says | Mode | Action |
|-----------|------|--------|
| "What should I write about?" | Signal Scan | Mine engagement data → surface 5-8 ideas |
| "Give me ideas from [topic]" | Polymath Expand | Full Polymath analysis of seed |
| "Expand this idea: [concept]" | Polymath Expand | Polymath analysis of specific seed |
| "Scan my signals" | Signal Scan | Data mining only |
| "Run an idea sprint" | Combined | Both modes, full queue |
| "What's resonating?" | Signal Scan | Focus on engagement anomalies |
| "Add this to my ideas queue" | Output | Format → paste into other-topics.md |
