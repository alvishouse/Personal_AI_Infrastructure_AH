# Review Workflow

Invokes the **@content-editor** agent (orange, sonnet) to review content quality.

## Agent Invocation

**USE THIS EXACT FORMAT to trigger the agent with visual identity:**

```
@content-editor [review task description]
```

## Workflow Steps

```
@content-editor Review cornerstone draft against quality standards:

Read:
- Draft: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/06-cornerstone-draft.md
- Voice Guide: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/alvis-house-voice-style-guide.md
- ICP: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/icp-mid-market-squeezed.md
- Blueprint: ${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/01-cornerstone-creation-system-prompt.md

Review Framework:

1. Content Quality Checklist
   - 2 research studies cited
   - 5 diverse examples (famous, client, personal, relatable, cautionary)
   - 10+ citations
   - All 9 Blueprint elements present

2. Voice Verification (Alvis House)
   - No hedge words (maybe, perhaps, I think)
   - Short declarative sentences
   - Concrete metaphors/analogies
   - Warm challenge tone
   - Grade 5-8 reading level

3. ICP Alignment (Mid-Market Squeezed)
   - Speaks to Director/VP pain points
   - Addresses C-Level concerns
   - Uses ICP language
   - Acknowledges constraints

4. Extraction Readiness
   - Each section can stand alone
   - Tweet-worthy statements in hook
   - Framework steps extractable
   - Checklist can become graphic

Output Format:
- Quality Score: X/10
- Voice Consistency: High/Medium/Low
- ICP Alignment: Strong/Moderate/Weak
- Strengths (3+)
- Areas for Improvement with Before→After examples
- Priority Fixes (top 3)
- Ready for Publication: Yes/No

Save to: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/07-editor-review.md
```

## Expected Agent Behavior

When @content-editor is invoked:
- Terminal displays agent name in **ORANGE** color
- Uses **Sonnet** model for efficient review
- Provides specific, actionable feedback
- Announces completion via voice server

## Voice Announcement

Agent will run:
```bash
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"Content Editor completed quality review","rate":260,"voice_enabled":true}'
```
