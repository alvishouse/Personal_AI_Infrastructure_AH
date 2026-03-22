# Notion Integration - Step-by-Step Instructions

This document provides exact integration steps for syncing content workflow data to Notion at checkpoints throughout the 13-step process.

## Prerequisites

1. **Notion API Key** configured in `~/.claude/.credentials.json`:
   ```json
   {
     "notion": {
       "api_key": "secret_YOUR_INTEGRATION_TOKEN"
     }
   }
   ```

2. **Database IDs** (already configured in notion-sync.ts):
   - Content Workflows: `a359475b-326e-4ebe-9a4a-b9ea7115c5db`
   - Content Images: `e5168f8d-8d75-46b1-9d33-902a8d973651`
   - Content: `3030760e-b0cd-811b-8525-000b50abf80b`

## Integration Checkpoints

### Checkpoint 1: After Step 10 (Images Created)

**When:** After all images are generated and approved via Art skill

**What to Sync:** All final images to Content Images database

**How:**

```typescript
import { notionSync } from "@/Skills/ContentWorkflow/tools/notion-sync.ts";

// Read metadata.json to get workflow info
const metadata = JSON.parse(
  readFileSync(`${workflowDir}/metadata.json`, "utf-8")
);

// Get workflow Notion ID (create if doesn't exist)
let workflowNotionId = metadata.notion_workflow_id;
if (!workflowNotionId) {
  workflowNotionId = await notionSync.createWorkflow({
    workflow_id: metadata.workflow_id,
    topic: metadata.topic || "",
    big_idea: metadata.big_idea || "",
    magic_mechanism: metadata.magic_mechanism || "",
    status: "Images",
    current_step: "Step 10: Images",
    local_directory: workflowDir
  });

  // Save to metadata
  metadata.notion_workflow_id = workflowNotionId;
  writeFileSync(
    `${workflowDir}/metadata.json`,
    JSON.stringify(metadata, null, 2)
  );
}

// Sync each image
const imagesDir = join(workflowDir, "images");
const imageFiles = readdirSync(imagesDir).filter(f => f.endsWith(".png"));

for (const imageFile of imageFiles) {
  // Parse image metadata from filename or manifest
  const imageData = parseImageMetadata(imageFile);

  const notionImageId = await notionSync.createImage({
    image_name: imageData.name,
    image_id: `${metadata.workflow_id}-${imageData.sequence}-${imageData.type}`,
    file_name: imageFile,
    file_path: join(imagesDir, imageFile),
    image_type: imageData.type,
    model: imageData.model,
    style: imageData.style,
    prompt: imageData.prompt,
    aspect_ratio: imageData.aspect_ratio,
    resolution: imageData.resolution,
    status: "Approved",
    workflow_notion_id: workflowNotionId
  });

  console.log(`✅ Synced image: ${imageFile} → ${notionImageId}`);
}
```

**Manual Alternative** (if not automated):

```bash
# Run after Step 10 completes
cd /home/alvis/PAI
bun run .claude/Skills/ContentWorkflow/tools/sync-images.ts --workflow 2026-01-31-playing-it-safe-illusion
```

### Checkpoint 2: After Step 12 (WordPress Published)

**When:** After cornerstone blog is published to WordPress

**What to Sync:**
1. Update workflow with WordPress details
2. Create Content entry for cornerstone blog

**How:**

```typescript
import { notionSync } from "@/Skills/ContentWorkflow/tools/notion-sync.ts";

const metadata = JSON.parse(
  readFileSync(`${workflowDir}/metadata.json`, "utf-8")
);

// Update workflow with WordPress info
if (metadata.notion_workflow_id) {
  await notionSync.updateWorkflowStatus(
    metadata.notion_workflow_id,
    "Step 12: WordPress",
    "Publishing"
  );

  // Update workflow with WordPress details
  await notionRequest(`/pages/${metadata.notion_workflow_id}`, {
    method: "PATCH",
    body: JSON.stringify({
      properties: {
        "WordPress URL": { url: metadata.wordpress_url },
        "WordPress Post ID": { number: metadata.wordpress_post_id }
      }
    })
  });
}

// Create content entry for cornerstone
const cornerstoneFile = join(workflowDir, "08-cornerstone-final.md");
const cornerstoneContent = readFileSync(cornerstoneFile, "utf-8");
const wordCount = cornerstoneContent.split(/\s+/).length;

const contentResult = await notionSync.createContent({
  content_name: metadata.headline || metadata.topic,
  content_type: "Cornerstone Blog",
  platform: "Essay",
  word_count: wordCount,
  local_file_path: cornerstoneFile,
  workflow_notion_id: metadata.notion_workflow_id,
  image_notion_ids: metadata.notion_image_ids || [],
  status: "Published",
  publish_date: new Date().toISOString().split("T")[0]
});

// Update metadata with content Notion ID
metadata.notion_cornerstone_id = contentResult.id;
writeFileSync(
  `${workflowDir}/metadata.json`,
  JSON.stringify(metadata, null, 2)
);

console.log(`✅ Synced cornerstone: ${contentResult.url}`);
```

**Manual Alternative:**

```bash
bun run .claude/Skills/ContentWorkflow/tools/sync-wordpress.ts --workflow 2026-01-31-playing-it-safe-illusion
```

### Checkpoint 3: After Step 13 (LinkedIn Extraction)

**When:** After LinkedIn posts are extracted from cornerstone

**What to Sync:** All 8-10 LinkedIn posts to Content database

**How:**

```typescript
import { notionSync } from "@/Skills/ContentWorkflow/tools/notion-sync.ts";

const metadata = JSON.parse(
  readFileSync(`${workflowDir}/metadata.json`, "utf-8")
);

// Update workflow status
if (metadata.notion_workflow_id) {
  await notionSync.updateWorkflowStatus(
    metadata.notion_workflow_id,
    "Step 13: LinkedIn",
    "Publishing"
  );
}

// Sync each LinkedIn post
const linkedinDir = join(workflowDir, "13-extracted-content/linkedin/posts");
const postFiles = readdirSync(linkedinDir)
  .filter(f => f.endsWith(".md"))
  .sort();

const linkedinNotionIds = [];

for (const postFile of postFiles) {
  const postPath = join(linkedinDir, postFile);
  const postContent = readFileSync(postPath, "utf-8");
  const { frontmatter, body } = parseFrontmatter(postContent);

  const contentResult = await notionSync.createContent({
    content_name: frontmatter.title || postFile.replace(".md", ""),
    content_type: "LinkedIn Post",
    platform: "LinkedIn",
    linkedin_format: frontmatter.format_type,
    word_count: body.split(/\s+/).length,
    posting_priority: frontmatter.posting_order,
    hook_type: frontmatter.hook_type,
    funnel_position: frontmatter.funnel_position,
    estimated_read_time: frontmatter.read_time,
    local_file_path: postPath,
    workflow_notion_id: metadata.notion_workflow_id,
    featured_image_notion_id: determineFeaturedImage(frontmatter),
    status: "Idea",
    strategic_notes: frontmatter.strategic_notes
  });

  linkedinNotionIds.push(contentResult.id);
  console.log(`✅ Synced LinkedIn post: ${postFile} → ${contentResult.url}`);
}

// Update metadata
metadata.notion_linkedin_ids = linkedinNotionIds;
writeFileSync(
  `${workflowDir}/metadata.json`,
  JSON.stringify(metadata, null, 2)
);

// Update workflow to Complete
await notionSync.updateWorkflowStatus(
  metadata.notion_workflow_id,
  "Complete",
  "Complete"
);

console.log(`\n✅ All LinkedIn posts synced to Notion!`);
console.log(`   Workflow: ${metadata.notion_workflow_id}`);
console.log(`   Posts: ${linkedinNotionIds.length}`);
```

**Manual Alternative:**

```bash
bun run .claude/Skills/ContentWorkflow/tools/sync-linkedin.ts --workflow 2026-01-31-playing-it-safe-illusion
```

## Helper Functions

### Parse Image Metadata

```typescript
function parseImageMetadata(filename: string): ImageMetadata {
  // Parse from manifest file if exists
  const manifestPath = join(dirname(filename), "../09-image-manifest.md");

  if (existsSync(manifestPath)) {
    const manifest = readFileSync(manifestPath, "utf-8");
    // Extract image data from manifest
    // ...
  }

  // Fallback: parse from filename
  // e.g., "01-featured.png" → { sequence: 1, type: "Featured" }
  const match = filename.match(/^(\d+)-(.+)\.png$/);

  return {
    sequence: parseInt(match[1]),
    type: inferImageType(match[2]),
    // ... other fields with defaults
  };
}
```

### Determine Featured Image

```typescript
function determineFeaturedImage(postFrontmatter: any): string | undefined {
  // Check if post specifies an image
  if (postFrontmatter.image_id) {
    return metadata.notion_image_ids?.[postFrontmatter.image_id];
  }

  // Default to first image (featured)
  return metadata.notion_image_ids?.[0];
}
```

## Error Handling

All sync operations implement graceful degradation:

```typescript
try {
  await notionSync.createImage(imageData);
} catch (error) {
  console.warn(`⚠️  Notion sync failed (non-critical): ${error}`);
  console.log(`   Workflow continues. Can bulk-sync later.`);
  // Continue workflow - don't block on Notion errors
}
```

## Verification

After sync, verify in Notion:

1. **Workflows Database**
   - Find workflow by ID
   - Check all properties populated
   - Verify relations to Content and Images

2. **Images Database**
   - Filter by Workflow
   - Check all images present
   - Verify metadata (style, model, prompt)

3. **Content Database**
   - Filter by Workflow
   - Check cornerstone + all LinkedIn posts
   - Verify image relations

## Troubleshooting

**Issue:** "Notion API key not found"
- **Solution:** Add to `~/.claude/.credentials.json`

**Issue:** "Database not found"
- **Solution:** Share databases with Notion integration

**Issue:** "Rate limit exceeded"
- **Solution:** Retry logic handles this automatically (exponential backoff)

**Issue:** "Relation not working"
- **Solution:** Verify both databases shared with integration
