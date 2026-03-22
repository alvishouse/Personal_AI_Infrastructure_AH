---
name: ContentWorkflow
description: Orchestrates content creation with specialized agents (content-researcher, content-writer, content-editor). USE WHEN user wants to create cornerstone content, run content workflow, research content topics, write cornerstone posts, OR review content drafts. Manages the 13-step content creation process.
---

# ContentWorkflow

Orchestrates the full content creation workflow using specialized agents with distinct visual identities.

## Agent Architecture

```
                    ┌─────────────────────┐
                    │   CONTENT WORKFLOW  │
                    │   (Orchestrator)    │
                    └──────────┬──────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│ @content-researcher│ │ @content-writer │   │ @content-editor │
│   (Sonnet)       │ │    (Opus)        │   │   (Sonnet)      │
│   Color: CYAN    │ │   Color: GREEN   │   │   Color: ORANGE │
│                  │ │                   │   │                 │
│ • Deep research  │ │ • Big Ideas      │   │ • Quality review│
│ • 100+ points    │ │ • Headlines      │   │ • Voice check   │
│ • Statistics     │ │ • Cornerstone    │   │ • ICP alignment │
└─────────────────┘ └─────────────────┘   └─────────────────┘
```

## Workflow Routing

**When executing a workflow, do BOTH of these:**

1. **Call the notification script** (for observability tracking):
   ```bash
   ~/.claude/Tools/SkillWorkflowNotification WORKFLOWNAME ContentWorkflow
   ```

2. **Output the text notification** (for user visibility):
   ```
   Running the **WorkflowName** workflow from the **ContentWorkflow** skill...
   ```

| Workflow | Trigger | File | Agent |
|----------|---------|------|-------|
| **Research** | "research content", "gather research" | `workflows/Research.md` | @content-researcher (cyan) |
| **Write** | "write cornerstone", "create content", "generate headlines" | `workflows/Write.md` | @content-writer (green) |
| **Review** | "review content", "edit cornerstone", "check draft" | `workflows/Review.md` | @content-editor (orange) |
| **FullWorkflow** | "run full content workflow", "create cornerstone from scratch" | `workflows/FullWorkflow.md` | All agents in sequence |

## How to Invoke Agents

**IMPORTANT:** To invoke custom agents with their visual identity, use @-mentions:

```
@content-researcher compile 100+ research points on [topic]
@content-writer write cornerstone post using 7-Element Blueprint
@content-editor review draft against quality checklist
```

The @-mention triggers the agent defined in `.claude/Agents/` with its configured:
- **Color** - Displays in terminal during execution
- **Model** - Uses specified model (sonnet/opus)
- **Voice** - Announces completion via voice server

## Examples

**Example 1: Research a topic**
```
User: "Research AI adoption trends for mid-market companies"
→ Invokes Research workflow
→ @content-researcher agent activates (cyan)
→ Compiles 100+ data points with citations
→ Saves to workflow directory
```

**Example 2: Write cornerstone post**
```
User: "Write the cornerstone post for the AI adoption topic"
→ Invokes Write workflow
→ @content-writer agent activates (green)
→ Writes 2,500-5,000 word post using 7-Element Blueprint
→ Includes image placeholders
→ Saves to 06-cornerstone-draft.md
```

**Example 3: Review draft**
```
User: "Review the cornerstone draft"
→ Invokes Review workflow
→ @content-editor agent activates (orange)
→ Checks against quality checklist, voice guide, ICP alignment
→ Provides specific improvement recommendations
→ Saves review to 07-editor-review.md
```

**Example 4: Full workflow**
```
User: "Create a complete cornerstone on [topic]"
→ Invokes FullWorkflow
→ Runs all 13 steps with PAUSE points for human review
→ Uses all three agents in sequence
```

## Workflow Context Files

Located in `/home/alvis/PAI/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/`:

| File | Purpose |
|------|---------|
| `WORKFLOW.md` | Full 13-step workflow definition |
| `alvis-house-voice-style-guide.md` | Voice/tone guide |
| `icp-mid-market-squeezed.md` | Target audience profile |
| `business-offer-profile.md` | Offer context |
| `01-cornerstone-creation-system-prompt.md` | 7-Element Blueprint |

## Output Directory

All workflow outputs saved to:
```
${PAI_DIR}/scratchpad/content-create/[workflow-id]/
```

Files generated:
- `01-research.md` - Research points
- `02-big-ideas.md` - Generated ideas
- `03-selected-big-idea.md` - User selection
- `04-headlines.md` - Headline sets
- `05-selected-headline.md` - User selection
- `06-cornerstone-draft.md` - Written post
- `07-editor-review.md` - Quality review
- `metadata.json` - Workflow state
- `HANDOFF-SUMMARY.md` - Session continuity
