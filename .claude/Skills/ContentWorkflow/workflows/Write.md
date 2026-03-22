# Write Workflow

Invokes the **@content-writer** agent (green, opus) to create content.

## Agent Invocation

**USE THIS EXACT FORMAT to trigger the agent with visual identity:**

```
@content-writer [writing task description]
```

## Workflow Steps

### For Big Ideas (Step 3)

```
@content-writer Generate 5 Big Ideas from the research:

Read: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/01-research.md

For each Big Idea include:
- The Hook (one powerful sentence)
- The Insight (2-3 sentences)
- Why It's Different
- The Promise
- Discovery Method (Loophole/Insider Secret/Massive Result/New Discovery/Advantage/Controversial)
- Key Proof Point

Save to: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/02-big-ideas.md
```

### For Headlines (Step 5)

```
@content-writer Create 5 Headline Sets for the selected Big Idea:

Read:
- ${PAI_DIR}/scratchpad/content-create/[workflow-id]/03-selected-big-idea.md
- ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/alvis-house-voice-style-guide.md

Each set needs:
- Eyebrow (5-10 words, identifies audience)
- Headline (main attention-grabber)
- Deck Copy (15-25 words supporting info)

Save to: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/04-headlines.md
```

### For Cornerstone (Step 7)

```
@content-writer Write cornerstone post using 7-Element Magnetic Blueprint:

Read:
- Research: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/01-research.md
- Big Idea: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/03-selected-big-idea.md
- Headline: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/05-selected-headline.md
- Voice Guide: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/alvis-house-voice-style-guide.md
- ICP: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/icp-mid-market-squeezed.md
- Blueprint: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/01-cornerstone-creation-system-prompt.md

Requirements:
- 2,500-5,000 words
- All 9 elements of 7-Element Blueprint
- Include 3 image placeholders
- Alvis House voice style

Save to: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/06-cornerstone-draft.md
```

## Expected Agent Behavior

When @content-writer is invoked:
- Terminal displays agent name in **GREEN** color
- Uses **Opus** model for high-quality writing
- Follows Alvis House voice style
- Announces completion via voice server

## Voice Announcement

Agent will run:
```bash
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"Content Writer completed [task type]","rate":260,"voice_enabled":true}'
```
