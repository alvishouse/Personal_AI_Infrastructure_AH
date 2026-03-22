# Research Workflow

Invokes the **@content-researcher** agent (cyan, sonnet) to compile comprehensive research.

## Agent Invocation

**USE THIS EXACT FORMAT to trigger the agent with visual identity:**

```
@content-researcher [research task description]
```

## Workflow Steps

1. **Load Context**
   - Read workflow definition from `${PAI_DIR}/.claude/Skills/WordPressPublisher/workflows/Content Create Flow/WORKFLOW.md`
   - Read ICP profile from `icp-mid-market-squeezed.md`

2. **Invoke Agent**
   ```
   @content-researcher Compile 100+ research points on [TOPIC]:

   Research Requirements:
   - Hard statistics with sources and dates
   - Contrarian patterns (what conventional wisdom gets wrong)
   - Case studies (success and failure examples)
   - Common objections with counter-evidence
   - Analogies and frameworks

   Target: Mid-Market Squeezed ICP (Director+ level, $10M-$100M companies)

   Save output to: ${PAI_DIR}/scratchpad/content-create/[workflow-id]/01-research.md
   ```

3. **Verify Output**
   - Check research file contains 100+ data points
   - Verify citations are included
   - Update metadata.json with step completion

## Expected Agent Behavior

When @content-researcher is invoked:
- Terminal displays agent name in **CYAN** color
- Uses **Sonnet** model for efficient research
- Announces completion via voice server
- Saves structured research to workflow directory

## Voice Announcement

Agent will run:
```bash
curl -X POST http://localhost:8888/notify -H "Content-Type: application/json" \
  -d '{"message":"Content Researcher completed research compilation","rate":260,"voice_enabled":true}'
```
