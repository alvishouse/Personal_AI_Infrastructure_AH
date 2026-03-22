# Content Workflow → Notion Integration

This document explains how the PAI content workflow integrates with Notion for centralized content management.

## Overview

The integration syncs content from the 14-step workflow to three interconnected Notion databases:

1. **Content Workflows** - Campaign-level tracking
2. **Content Images** - DRY-compliant image management
3. **Content** - All publishable content pieces

## Architecture

```
PAI (Source of Truth)                    Notion (Destination)
├── Voice Guide (VOICE.md)              ┌─────────────────────┐
├── Style Templates                     │ Content Workflows   │
├── ICP Definitions                     │ (Campaign tracking) │
├── 14-Step Workflow                    └─────────────────────┘
│   ├── Research                               │
│   ├── Drafting                               │
│   ├── Editing                                ▼
│   ├── Images ─────────────────────►  ┌─────────────────────┐
│   ├── Publishing                     │  Content Images     │
│   └── Extraction                     │  (DRY management)   │
│                                       └─────────────────────┘
└── Final Outputs ────────────────────►        │
                                               ▼
                                        ┌─────────────────────┐
                                        │  Content Database   │
                                        │  (Publishing queue) │
                                        └─────────────────────┘
```

## Sync Points

The workflow syncs to Notion at 3 checkpoints:

### Step 10: Images Created
```typescript
// After image approval
for (const image of approvedImages) {
  const notionId = await notionSync.createImage({
    image_name: "Featured image for Singapore AI post",
    image_id: "2026-01-31-playing-it-safe-illusion-01-featured",
    file_name: "01-featured.png",
    file_path: "/home/alvis/PAI/scratchpad/.../images/01-featured.png",
    image_type: "Featured",
    model: "flux-1.1-pro",
    style: "Modern Alchemist",
    prompt: "...",
    aspect_ratio: "16:9",
    resolution: "1920x1080",
    status: "Approved"
  });
}
```

### Step 12: WordPress Published
```typescript
// Create workflow + cornerstone
const workflowId = await notionSync.createWorkflow({
  workflow_id: "2026-01-31-playing-it-safe-illusion",
  topic: "Risk in B2B Marketing",
  big_idea: "Playing it safe is the biggest risk",
  magic_mechanism: "Counterintuitive truth framework",
  status: "Publishing",
  current_step: "Step 12: WordPress",
  wordpress_url: "https://example.com/...",
  wordpress_post_id: 123,
  local_directory: "/home/alvis/PAI/scratchpad/content-create/..."
});

const cornerstoneId = await notionSync.createContent({
  content_name: "Playing it Safe: The Biggest Risk in B2B Marketing",
  content_type: "Cornerstone Blog",
  platform: "Essay",
  word_count: 3500,
  local_file_path: ".../08-cornerstone-final.md",
  workflow_notion_id: workflowId,
  image_notion_ids: [imageId1, imageId2, imageId3],
  status: "Published"
});
```

### Step 13: LinkedIn Extracted
```typescript
// Create LinkedIn posts
for (const post of linkedinPosts) {
  await notionSync.createContent({
    content_name: post.title,
    content_type: "LinkedIn Post",
    platform: "LinkedIn",
    linkedin_format: post.format_type,
    word_count: post.word_count,
    posting_priority: post.posting_order,
    hook_type: post.hook_type,
    funnel_position: post.funnel_position,
    local_file_path: post.file_path,
    workflow_notion_id: workflowId,
    featured_image_notion_id: determineImage(post),
    status: "Idea"
  });
}
```

## Bidirectional Navigation

### Notion → PAI
Every Notion entry includes a "Local File Path" property with clickable `file://` links:

```
file:///home/alvis/PAI/scratchpad/content-create/2026-01-31.../13-extracted-content/linkedin/posts/01-authority-post.md
```

Click the link to open the file directly in VS Code/Cursor.

### PAI → Notion
Every synced markdown file gets frontmatter with Notion metadata:

```yaml
---
title: "Singapore's $1B Bet on Unproven AI Players"
notion_id: "abc123-def456-789"
notion_url: "https://notion.so/..."
last_synced: "2026-02-09T19:30:00Z"
sync_status: "synced"
---

[Content here...]
```

## Resync Workflow

After editing a file locally, resync to Notion:

```bash
cd /home/alvis/PAI

# Sync specific file
bun run .claude/Skills/ContentWorkflow/tools/notion-resync.ts --file 01-authority-post.md

# Check what needs syncing
bun run .claude/Skills/ContentWorkflow/tools/notion-resync.ts --check

# Sync entire workflow
bun run .claude/Skills/ContentWorkflow/tools/notion-resync.ts --workflow 2026-01-31-playing-it-safe-illusion
```

## Database Schemas

### Content Workflows Database
- **Workflow ID** (Title) - e.g., "2026-01-31-playing-it-safe-illusion"
- Topic, Big Idea, Magic Mechanism
- Status (Research → Drafting → Review → Images → Publishing → Complete)
- Current Step (Step 1-14)
- WordPress URL, WordPress Post ID
- Campaign Start/End dates
- Local Directory (file:// link)
- **Relations:** Content (many), Images (many)

### Content Images Database
- **Image Name** (Title) - Descriptive name
- Image ID - Unique identifier
- File Name, File Path (file:// link)
- Image Type (Featured, Inline, Extraction, Social)
- Model, Style, Prompt
- Aspect Ratio, Resolution
- WordPress Media ID, WordPress URL
- Alt Text, Tags, Status
- **Workflow** (Relation → Workflows)
- **Used In Content** (Relation → Content) - DRY tracking

### Content Database (Enhanced)
- **Content Name** (Title)
- **Content Type** - Cornerstone Blog, LinkedIn Post, Newsletter, Email
- Platform, Status, Publish Date
- **LinkedIn Format** - Authority Post, Framework Article, Mythbuster, etc.
- Word Count, Engagement Score, Posting Priority
- Hook Type, Funnel Position, Estimated Read Time
- Local File Path (file:// link)
- Metadata YAML, Strategic Notes
- **Workflow** (Relation → Workflows)
- **Images** (Relation → Images)

## Error Handling

The sync utility implements graceful degradation:

1. **Retry Logic** - 3 attempts with exponential backoff
2. **Non-Blocking** - Workflow continues even if Notion sync fails
3. **Error Logging** - Failed syncs logged to console
4. **Recovery** - Can bulk-sync later using migration script

## Credentials Setup

Create `~/.claude/.credentials.json`:

```json
{
  "notion": {
    "api_key": "secret_YOUR_NOTION_INTEGRATION_TOKEN"
  }
}
```

Get your Notion API key:
1. Go to https://www.notion.so/my-integrations
2. Create new integration
3. Copy "Internal Integration Token"
4. Share databases with the integration

## Development

Key files:
- `tools/notion-sync.ts` - Core sync operations
- `tools/notion-resync.ts` - Bidirectional sync CLI
- `tools/migrate-to-notion.ts` - One-time migration script (Phase 4)

## Notion Database IDs

```typescript
WORKFLOWS_DB = "a359475b-326e-4ebe-9a4a-b9ea7115c5db"
IMAGES_DB = "e5168f8d-8d75-46b1-9d33-902a8d973651"
CONTENT_DB = "3030760e-b0cd-811b-8525-000b50abf80b"
```

## Next Steps

1. ✅ Phase 1: Database Setup - Complete
2. ✅ Phase 2: Integration Code - Complete
3. 🔄 Phase 3: Workflow Integration - In Progress
4. ⏳ Phase 4: Migration - Pending
5. ⏳ Phase 5: Verification - Pending
