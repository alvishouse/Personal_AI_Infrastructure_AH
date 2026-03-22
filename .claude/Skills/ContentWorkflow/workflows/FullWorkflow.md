# Full Content Workflow

Orchestrates all 13 steps of content creation using specialized agents.

## Agent Sequence

```
Step 2:  @content-researcher (cyan)   → Research
Step 3:  @content-writer (green)      → Big Ideas
Step 5:  @content-writer (green)      → Headlines
Step 7:  @content-writer (green)      → Cornerstone
Step 8:  @content-editor (orange)     → Review
Step 13: @content-researcher (cyan)   → Extraction
```

## The 13 Steps

### Phase 1: Topic & Research

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 1 | Select Topic | Human | ⏸️ |
| 2 | Research (100+ points) | @content-researcher | |

**Step 2 Invocation:**
```
@content-researcher Compile 100+ research points on [TOPIC] for mid-market decision-makers.
Save to: scratchpad/content-create/[id]/01-research.md
```

### Phase 2: Ideation

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 3 | Generate 5 Big Ideas | @content-writer | |
| 4 | Select Big Idea | Human | ⏸️ |

**Step 3 Invocation:**
```
@content-writer Generate 5 Big Ideas from research.
Read: 01-research.md
Save to: 02-big-ideas.md
```

### Phase 3: Headlines

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 5 | Create 5 Headline Sets | @content-writer | |
| 6 | Select Headline | Human | ⏸️ |

**Step 5 Invocation:**
```
@content-writer Create 5 Headline Sets for selected Big Idea.
Read: 03-selected-big-idea.md
Save to: 04-headlines.md
```

### Phase 4: Writing & Review

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 7 | Write Cornerstone | @content-writer | |
| 8 | Editor Review | @content-editor | |
| 9 | Human Review + Images | Human | ⏸️ |

**Step 7 Invocation:**
```
@content-writer Write 2,500-5,000 word cornerstone using 7-Element Blueprint.
Read: 01-research.md, 03-selected-big-idea.md, 05-selected-headline.md
Save to: 06-cornerstone-draft.md
```

**Step 8 Invocation:**
```
@content-editor Review cornerstone against quality checklist.
Read: 06-cornerstone-draft.md
Save to: 07-editor-review.md
```

### Phase 5: Production

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 10 | Generate Images | Art Skill | |
| 11 | HTML Preview | BrandHTMLConverter | |
| 12 | Publish to WordPress | WordPressPublisher | ⏸️ |

### Phase 6: Extraction

| Step | Action | Agent | PAUSE |
|------|--------|-------|-------|
| 13 | Extract 60+ pieces | @content-researcher | |

**Step 13 Invocation:**
```
@content-researcher Extract 60+ derivative content pieces from cornerstone.
Read: 06-cornerstone-draft.md
Save to: 08-content-extraction.md
```

## PAUSE Points Summary

Human review required at:
1. **Step 1**: Topic selection
2. **Step 4**: Big Idea selection
3. **Step 6**: Headline selection
4. **Step 9**: Final review before images
5. **Step 12**: WordPress publish approval

## Metadata Tracking

Update `metadata.json` after each step:
```json
{
  "status": "step-X-pending",
  "checkpoints": {
    "step-X": { "completed": true, "output": "filename.md" }
  }
}
```

## Resume Command

To resume workflow at any step:
```
Resume Content Creation Workflow: [workflow-id]
```

Or invoke specific agent for current step.
