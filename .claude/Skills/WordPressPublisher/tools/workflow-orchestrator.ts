#!/usr/bin/env bun

/**
 * Content Workflow Orchestrator
 *
 * Automatically manages content creation workflow by:
 * - Reading current step from metadata
 * - Invoking appropriate custom agent
 * - Updating workflow state
 * - Handling transitions
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

interface WorkflowMetadata {
  workflow_id: string;
  topic: string;
  track: string;
  status: string;
  created_at: string;
  updated_at: string;
  checkpoints: Record<string, any>;
  wordpress?: {
    post_id: number | null;
    post_url: string | null;
    status: string | null;
  };
  notion?: {
    workflow_id: string | null;
    content_id: string | null;
    content_url: string | null;
    synced_at: string | null;
  };
  image_manifest?: Record<string, any>;
}

interface StepConfig {
  stepNumber: number;
  stepName: string;
  agentType: 'content-researcher' | 'content-writer' | 'content-editor' | 'human-pause';
  model: 'sonnet' | 'opus' | 'haiku';
  color: 'cyan' | 'green' | 'orange';
  autoTransition: boolean;
  outputFile: string;
  contextFiles: string[];
  promptTemplate: string;
}

// Step configuration mapping
const WORKFLOW_STEPS: Record<string, StepConfig> = {
  'step-2': {
    stepNumber: 2,
    stepName: 'Deep Research',
    agentType: 'content-researcher',
    model: 'sonnet',
    color: 'cyan',
    autoTransition: true,
    outputFile: '01-research.md',
    contextFiles: [
      'icp-mid-market-squeezed.md',
      'business-offer-profile.md',
    ],
    promptTemplate: 'research',
  },
  'step-3': {
    stepNumber: 3,
    stepName: 'Create Big Ideas',
    agentType: 'content-writer',
    model: 'opus',
    color: 'green',
    autoTransition: true,
    outputFile: '02-big-ideas.md',
    contextFiles: [
      '01-research.md',
      'icp-mid-market-squeezed.md',
      'business-offer-profile.md',
      'alvis-house-voice-style-guide.md',
    ],
    promptTemplate: 'big-ideas',
  },
  'step-5': {
    stepNumber: 5,
    stepName: 'Create Headlines',
    agentType: 'content-writer',
    model: 'opus',
    color: 'green',
    autoTransition: true,
    outputFile: '04-headlines.md',
    contextFiles: [
      '03-selected-big-idea.md',
      '01-research.md',
      'alvis-house-voice-style-guide.md',
    ],
    promptTemplate: 'headlines',
  },
  'step-7': {
    stepNumber: 7,
    stepName: 'Long Form Post',
    agentType: 'content-writer',
    model: 'opus',
    color: 'green',
    autoTransition: true,
    outputFile: '06-cornerstone-draft.md',
    contextFiles: [
      '01-cornerstone-creation-system-prompt.md',
      '05-selected-headline.md',
      '03-selected-big-idea.md',
      '01-research.md',
      'alvis-house-voice-style-guide.md',
      'icp-mid-market-squeezed.md',
      'business-offer-profile.md',
    ],
    promptTemplate: 'cornerstone',
  },
  'step-8': {
    stepNumber: 8,
    stepName: 'Sub-agent Review',
    agentType: 'content-editor',
    model: 'sonnet',
    color: 'orange',
    autoTransition: true,
    outputFile: '07-editor-review.md',
    contextFiles: [
      '06-cornerstone-draft.md',
      'alvis-house-voice-style-guide.md',
      'icp-mid-market-squeezed.md',
    ],
    promptTemplate: 'editor-review',
  },
  'step-13': {
    stepNumber: 13,
    stepName: 'LinkedIn-First Extraction',
    agentType: 'content-researcher',
    model: 'sonnet',
    color: 'cyan',
    autoTransition: false,
    outputFile: '13-extracted-content/',
    contextFiles: [
      '11-cornerstone-assembled.md',
      '13-linkedin-first-extraction.md',
    ],
    promptTemplate: 'extraction',
  },
};

class WorkflowOrchestrator {
  private workflowDir: string;
  private metadataPath: string;
  private metadata: WorkflowMetadata;
  private skillDir: string;

  constructor(workflowId: string) {
    const paiDir = process.env.PAI_DIR || '/home/alvis/PAI';
    this.workflowDir = join(paiDir, 'scratchpad', 'content-create', workflowId);
    this.metadataPath = join(this.workflowDir, 'metadata.json');
    this.skillDir = join(paiDir, '.claude', 'Skills', 'WordPressPublisher', 'workflows', 'Content Create Flow');

    if (!existsSync(this.metadataPath)) {
      throw new Error(`Workflow not found: ${workflowId}`);
    }

    this.metadata = JSON.parse(readFileSync(this.metadataPath, 'utf-8'));
  }

  getCurrentStep(): string {
    return this.metadata.status;
  }

  getStepConfig(): StepConfig | null {
    const currentStep = this.getCurrentStep();
    return WORKFLOW_STEPS[currentStep] || null;
  }

  buildAgentPrompt(stepConfig: StepConfig): string {
    const promptBuilders: Record<string, () => string> = {
      'research': () => this.buildResearchPrompt(stepConfig),
      'big-ideas': () => this.buildBigIdeasPrompt(stepConfig),
      'headlines': () => this.buildHeadlinesPrompt(stepConfig),
      'cornerstone': () => this.buildCornerstonePrompt(stepConfig),
      'editor-review': () => this.buildEditorPrompt(stepConfig),
      'extraction': () => this.buildExtractionPrompt(stepConfig),
    };

    const builder = promptBuilders[stepConfig.promptTemplate];
    return builder ? builder() : '';
  }

  private buildResearchPrompt(stepConfig: StepConfig): string {
    const topic = this.metadata.topic;
    const track = this.metadata.track;

    return `You are the **Content Researcher Agent** (${stepConfig.color.toUpperCase()}) conducting deep research for cornerstone blog content.

## RESEARCH ASSIGNMENT

**Topic:** "${topic}"
**Evergreen Pillar:** ${track}
**Workflow ID:** ${this.metadata.workflow_id}

## TARGET AUDIENCE

Load context from: ${this.skillDir}/icp-mid-market-squeezed.md

## RESEARCH METHODOLOGY

Compile **100+ research points** across these categories:

1. **HARD STATISTICS & STUDIES** (40+ points)
2. **CASE STUDIES & EXAMPLES** (20+ points)
3. **CONTRARIAN PATTERNS** (15+ points)
4. **COMMON OBJECTIONS** (15+ points)
5. **FRAMEWORKS & ANALOGIES** (10+ points)

Use WebSearch extensively. Focus on insights relevant to mid-market ICP.

## OUTPUT REQUIREMENTS

Save research to:
\`${this.workflowDir}/${stepConfig.outputFile}\`

Use the format specified in:
\`${process.env.PAI_DIR}/.claude/Agents/ContentResearcher.md\`

Include:
- Executive summary
- All 5 research categories
- Minimum 100 research points
- Full source citations
- Key takeaways for content creation

Begin research now.`;
  }

  private buildBigIdeasPrompt(stepConfig: StepConfig): string {
    return `You are the **Content Writer Agent** (${stepConfig.color.toUpperCase()}) creating Big Ideas for cornerstone content.

## ASSIGNMENT

**Topic:** "${this.metadata.topic}"
**Research File:** ${this.workflowDir}/01-research.md

Load:
- Research findings from 01-research.md
- ICP from: ${this.skillDir}/icp-mid-market-squeezed.md
- Business context from: ${this.skillDir}/business-offer-profile.md
- Voice guide from: ${this.skillDir}/alvis-house-voice-style-guide.md

## TASK

Create **3-5 Big Ideas** that:
1. Capture attention relative to ICP's situation
2. Provide clarity and new hope
3. Stand out from solutions they've heard before
4. Bridge gap between current situation and desired outcome

For each Big Idea, identify discovery method:
- Loophole/Flaw
- Insider Secret
- Massive Result
- New Discovery/Unique Mechanism
- Advantage
- Controversial Opinion

## OUTPUT

Save to: \`${this.workflowDir}/${stepConfig.outputFile}\`

Format:
\`\`\`markdown
# Big Ideas for [Topic]

## Big Idea 1: [Title]

**Discovery Method:** [Method]

**Core Concept:** [Description]

**Why It Resonates:** [Explanation]

**Bridges the Gap:** [How it connects current → desired state]

---

[Repeat for all big ideas]
\`\`\`

Begin creation now.`;
  }

  private buildHeadlinesPrompt(stepConfig: StepConfig): string {
    return `You are the **Content Writer Agent** (${stepConfig.color.toUpperCase()}) creating headlines for cornerstone content.

## ASSIGNMENT

**Selected Big Idea:** Load from ${this.workflowDir}/03-selected-big-idea.md
**Research:** ${this.workflowDir}/01-research.md
**Voice Guide:** ${this.skillDir}/alvis-house-voice-style-guide.md

## TASK

Create **5 different headline sets**. Each set includes:
- **Eyebrow** (pre-head): Sets context, identifies audience
- **Headline**: Main attention-grabber
- **Deck Copy** (subhead): Supporting information

Each headline must hit these elements:
- Curiosity
- Call Out Pain Point
- Promise Solution
- Specificity
- Simplicity
- Credibility/Address Skepticism
- Time Frame (when applicable)

Incorporate the Big 4 sentiments: New, Easy, Safe, Big

Use Alvis House voice: declarative, short sentences, no hedge words.

## OUTPUT

Save to: \`${this.workflowDir}/${stepConfig.outputFile}\`

Begin creation now.`;
  }

  private buildCornerstonePrompt(stepConfig: StepConfig): string {
    return `You are the **Content Writer Agent** (${stepConfig.color.toUpperCase()}) creating cornerstone long-form content.

## ASSIGNMENT

**Selected Headline:** Load from ${this.workflowDir}/05-selected-headline.md
**Selected Big Idea:** Load from ${this.workflowDir}/03-selected-big-idea.md
**Research:** Load from ${this.workflowDir}/01-research.md

**Context Files:**
- Creation System: ${this.skillDir}/01-cornerstone-creation-system-prompt.md
- Voice Guide: ${this.skillDir}/alvis-house-voice-style-guide.md
- ICP: ${this.skillDir}/icp-mid-market-squeezed.md
- Business Offer: ${this.skillDir}/business-offer-profile.md

## TASK

Create cornerstone post (2,500-5,000 words) using 7-Element Magnetic Blueprint:

1. **HOOK** (200-300 words) - Pattern interrupt + identity filter
2. **CHALLENGE** (embedded) - 3 specific pain points
3. **OPPORTUNITY** (embedded) - 3-4 transformations
4. **EXPERT STORY** (400-600 words) - 3S Formula: Structure, Struggle, Solution
5. **FRAMEWORK** (800-1200 words) - Named system with steps + 2 research studies
6. **CASE STUDIES** (600-800 words) - 5 examples (famous, client, personal, relatable, cautionary)
7. **MYTH/MINDSET** (300-400 words) - Limiting belief addressed
8. **APPLICATION** (500-700 words) - Week-by-week plan + checklist
9. **CLOSE** (150-200 words) - Framework recap + identity affirmation + next step

Include image placeholders using format from: ${this.skillDir}/content-image-references.md

Use Alvis House voice: declarative, optimistic yet challenging, 5th-grade reading level.

## OUTPUT

Save to: \`${this.workflowDir}/${stepConfig.outputFile}\`

Begin creation now.`;
  }

  private buildEditorPrompt(stepConfig: StepConfig): string {
    return `You are the **Content Editor Agent** (${stepConfig.color.toUpperCase()}) reviewing cornerstone content.

## ASSIGNMENT

**Draft to Review:** ${this.workflowDir}/06-cornerstone-draft.md

**Context Files:**
- Voice Guide: ${this.skillDir}/alvis-house-voice-style-guide.md
- ICP: ${this.skillDir}/icp-mid-market-squeezed.md

## REVIEW CHECKLIST

### Content Quality
- [ ] 2 research studies cited with full attribution
- [ ] 5 diverse examples present
- [ ] 10+ outbound links/citations
- [ ] Consistent Alvis House voice throughout
- [ ] All 7 Blueprint elements present

### Structural Integrity
- [ ] Pattern-interrupt hook
- [ ] Clear identity filter
- [ ] 3S Expert Story
- [ ] Named framework with steps
- [ ] Myth directly addressed
- [ ] Application guide included
- [ ] Identity-affirming close

### Voice Verification
- [ ] No hedge words (maybe, perhaps, I think)
- [ ] Short declarative sentences
- [ ] Concrete metaphors/analogies
- [ ] 5th-8th grade reading level
- [ ] Warm challenge tone

### ICP Alignment
- [ ] Speaks to Director/VP Operator pain points
- [ ] Addresses C-Level strategic concerns
- [ ] Uses ICP language and scenarios

### Extraction Readiness
- [ ] Each section can stand alone
- [ ] Hook contains tweetable statements
- [ ] Framework steps can be individual posts
- [ ] Examples work as case study threads

## OUTPUT

Save detailed review to: \`${this.workflowDir}/${stepConfig.outputFile}\`

Include:
- Checklist results
- Specific issues found with line references
- Suggestions for improvement
- Overall quality score (1-10)

Begin review now.`;
  }

  private buildExtractionPrompt(stepConfig: StepConfig): string {
    return `You are the **Content Researcher Agent** (${stepConfig.color.toUpperCase()}) extracting LinkedIn content.

## ASSIGNMENT

**Source Content:** ${this.workflowDir}/11-cornerstone-assembled.md
**Extraction Guide:** ${this.skillDir}/13-linkedin-first-extraction.md

## TASK

Extract **8-10 LinkedIn pieces** using Outlier Scout methodology:

1. Authority Post (PRIORITY 1)
2. Framework Article (PRIORITY 1)
3. Story Post
4. Myth-Buster Post
5. Quick Win #1
6. Quick Win #2
7. Case Study Post
8. Contrarian Take

Each piece should:
- Stand alone as complete post
- Include engagement potential ranking
- Use Alvis House voice
- Target mid-market ICP

## OUTPUT

Save to directory: \`${this.workflowDir}/${stepConfig.outputFile}\`

Create:
- 00-scout-analysis.yaml
- linkedin/posts/01-authority-post.md (through 08)
- posting-schedule.md

Begin extraction now.`;
  }

  /**
   * Push cornerstone draft to Notion after Step 8 completes.
   * Creates workflow + content entries, sets blog icon, syncs full body.
   */
  async pushToNotion(): Promise<void> {
    console.log('\n📤 Pushing content to Notion...\n');

    const paiDir = process.env.PAI_DIR || '/home/alvis/PAI';
    const syncPath = join(process.env.HOME!, '.claude/Skills/ContentWorkflow/tools/notion-sync.ts');

    if (!existsSync(syncPath)) {
      console.warn('⚠️  Notion sync tool not found at:', syncPath);
      return;
    }

    const { ContentWorkflowNotionSync } = await import(syncPath);
    const sync = new ContentWorkflowNotionSync();

    // 1. Create or find workflow entry
    let workflowNotionId = await sync.workflowExists(this.metadata.workflow_id);

    if (!workflowNotionId) {
      console.log('📝 Creating Notion workflow entry...');
      workflowNotionId = await sync.createWorkflow({
        workflow_id: this.metadata.workflow_id,
        topic: this.metadata.topic,
        big_idea: this.metadata.checkpoints['step-4']?.selection || '',
        magic_mechanism: this.metadata.big_idea_summary || '',
        status: 'Review',
        current_step: 'Step 8: Editor Review',
        local_directory: this.workflowDir,
      });
    } else {
      console.log(`✅ Workflow already in Notion: ${workflowNotionId}`);
      await sync.updateWorkflowStatus(workflowNotionId, 'Step 8: Editor Review', 'Review');
    }

    // 2. Create content entry
    const cornerstonePath = join(this.workflowDir, '06-cornerstone-draft.md');
    if (!existsSync(cornerstonePath)) {
      console.warn('⚠️  Cornerstone draft not found, skipping Notion content creation');
      return;
    }

    const cornerstoneContent = readFileSync(cornerstonePath, 'utf-8');

    // Check if already synced via frontmatter
    const existingIdMatch = cornerstoneContent.match(/notion_id: "([^"]+)"/);
    let contentNotionId: string;
    let contentUrl: string;

    if (existingIdMatch) {
      contentNotionId = existingIdMatch[1];
      const urlMatch = cornerstoneContent.match(/notion_url: "([^"]+)"/);
      contentUrl = urlMatch ? urlMatch[1] : '';
      console.log(`✅ Content already in Notion: ${contentNotionId}`);
    } else {
      console.log('📄 Creating Notion content entry...');

      const wordCount = cornerstoneContent.split(/\s+/).length;
      const selectedHeadline = this.metadata.checkpoints['step-6']?.headline || this.metadata.topic;

      const editorReviewPath = join(this.workflowDir, '07-editor-review.md');
      let strategicNotes = '';
      if (existsSync(editorReviewPath)) {
        const review = readFileSync(editorReviewPath, 'utf-8');
        strategicNotes = review.substring(0, 1800);
      }

      const result = await sync.createContent({
        content_name: selectedHeadline,
        content_type: 'Cornerstone Blog',
        platform: 'Essay',
        word_count: wordCount,
        local_file_path: cornerstonePath,
        strategic_notes: strategicNotes,
        publish_date: new Date().toISOString().split('T')[0],
        status: 'In Progress',
        workflow_notion_id: workflowNotionId,
        campaign: this.metadata.workflow_id,
      });

      contentNotionId = result.id;
      contentUrl = result.url;
    }

    // 3. Set blog icon on content page
    console.log('📝 Setting blog icon...');
    const notionApiKey = this.loadNotionApiKey();
    const iconResponse = await fetch(`https://api.notion.com/v1/pages/${contentNotionId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${notionApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ icon: { type: 'emoji', emoji: '📝' } }),
    });

    if (!iconResponse.ok) {
      console.warn('⚠️  Could not set icon:', await iconResponse.text());
    } else {
      console.log('✅ Blog icon set (📝)');
    }

    // 4. Sync full body content
    console.log('📤 Syncing body content...');
    await sync.syncContentBody(cornerstonePath);

    // 5. Persist Notion IDs to metadata
    this.metadata.notion = {
      workflow_id: workflowNotionId,
      content_id: contentNotionId,
      content_url: contentUrl,
      synced_at: new Date().toISOString(),
    };
    writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));

    console.log(`\n✅ Notion sync complete!`);
    console.log(`📍 Content URL: ${contentUrl}`);
  }

  private loadNotionApiKey(): string {
    if (process.env.NOTION_API_KEY) return process.env.NOTION_API_KEY;

    const mcpPath = join(process.env.HOME!, '.claude', 'mcpServers.json');
    if (existsSync(mcpPath)) {
      try {
        const cfg = JSON.parse(readFileSync(mcpPath, 'utf-8'));
        if (cfg.mcpServers?.notion?.env?.NOTION_API_KEY) return cfg.mcpServers.notion.env.NOTION_API_KEY;
      } catch {}
    }

    const credPath = join(process.env.HOME!, '.claude', '.credentials.json');
    if (existsSync(credPath)) {
      try {
        const creds = JSON.parse(readFileSync(credPath, 'utf-8'));
        if (creds.notion?.api_key) return creds.notion.api_key;
      } catch {}
    }

    throw new Error('Notion API key not found');
  }

  updateMetadata(stepKey: string, data: any) {
    this.metadata.checkpoints[stepKey] = {
      ...data,
      timestamp: new Date().toISOString(),
    };
    this.metadata.updated_at = new Date().toISOString();

    writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));
  }

  advanceToNextStep(currentStepKey: string) {
    const stepNumber = parseInt(currentStepKey.split('-')[1]);
    const nextStepKey = `step-${stepNumber + 1}`;

    this.metadata.status = nextStepKey;
    this.metadata.updated_at = new Date().toISOString();

    writeFileSync(this.metadataPath, JSON.stringify(this.metadata, null, 2));

    return nextStepKey;
  }

  getStatusSummary(): string {
    const currentStep = this.getCurrentStep();
    const stepConfig = this.getStepConfig();

    if (!stepConfig) {
      return `⚠️  Unknown step: ${currentStep}`;
    }

    return `
📍 **Workflow Status**
   ID: ${this.metadata.workflow_id}
   Topic: ${this.metadata.topic}
   Current: Step ${stepConfig.stepNumber} - ${stepConfig.stepName}
   Agent: ${stepConfig.agentType} (${stepConfig.color.toUpperCase()}, ${stepConfig.model})
   Auto-transition: ${stepConfig.autoTransition ? 'Yes' : 'No (pause for human)'}
`;
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2);
  const workflowIdArg = args.find(arg => arg.startsWith('--workflow-id='));

  if (!workflowIdArg) {
    console.error('Usage: workflow-orchestrator.ts --workflow-id=<workflow-id> [--push-to-notion]');
    process.exit(1);
  }

  const workflowId = workflowIdArg.split('=')[1];
  const pushToNotion = args.includes('--push-to-notion');

  try {
    const orchestrator = new WorkflowOrchestrator(workflowId);

    // --push-to-notion: runs after step 8 completes, then advances to step 9
    if (pushToNotion) {
      await orchestrator.pushToNotion();
      orchestrator.advanceToNextStep('step-8');
      console.log('\n➡️  Advanced to Step 9: Manual Review + Image Requirements');
      process.exit(0);
    }

    console.log(orchestrator.getStatusSummary());

    const stepConfig = orchestrator.getStepConfig();

    if (!stepConfig) {
      console.log('\n✅ Workflow complete or at manual step. Check metadata for next action.');
      process.exit(0);
    }

    console.log(`\n🚀 Launching ${stepConfig.agentType} for Step ${stepConfig.stepNumber}...\n`);

    const agentPrompt = orchestrator.buildAgentPrompt(stepConfig);

    // Output the prompt for Claude Code to execute via Task tool
    console.log('AGENT_PROMPT_START');
    console.log(JSON.stringify({
      subagent_type: stepConfig.agentType,
      model: stepConfig.model,
      description: `Step ${stepConfig.stepNumber}: ${stepConfig.stepName}`,
      prompt: agentPrompt,
    }, null, 2));
    console.log('AGENT_PROMPT_END');

  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
