# Notion Content Body Sync

This guide explains how to sync the **actual content** (post text, strategic notes) from PAI markdown files into Notion page bodies.

## Problem This Solves

After the initial Notion sync, your Content database has:
- ✅ **Properties filled in** (title, status, platform, dates, metadata)
- ❌ **Empty page bodies** (no actual post content visible)

The body sync populates Notion pages with:
- The actual LinkedIn post text
- Metadata (format, funnel position, hook type, word count, etc.)
- Strategic notes (posting tips, engagement strategy)
- Source file reference

## Body Structure in Notion

Each synced LinkedIn post will have this structure in Notion:

```markdown
# 📝 Post Content

[FULL LINKEDIN POST TEXT HERE]

---

## 📊 Metadata

**Format:** Authority Post (Credibility + Framework)
**Funnel Position:** Top
**Hook Type:** Contrarian + Statistic
**Word Count:** 487 words
**Read Time:** 2 minutes
**Engagement Potential:** HIGH
**Posting Order:** #1

---

## 🎯 Strategic Notes

- Best time to post: Tuesday or Wednesday 7-9am
- Comment strategy: Engage with responses...
- Expected engagement: HIGH (contrarian + credibility anchor)

---

## 🔗 Source

**PAI File:** `scratchpad/content-create/2026-01-31.../13-extracted-content/linkedin/posts/01-authority-post.md`
**Last Synced:** 2026-02-10
**Sync Status:** ✅ Synced from PAI
```

## Usage

### 1. Batch Sync All LinkedIn Posts

Sync all 8 LinkedIn posts from a workflow in one command:

```bash
cd /home/alvis/PAI/.claude/Skills/ContentWorkflow/tools

# Sync current workflow (auto-detects path)
bun run sync-linkedin-bodies.ts

# Sync specific workflow
bun run sync-linkedin-bodies.ts /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin
```

**Output:**
```
╔════════════════════════════════════════════════════════════╗
║  LinkedIn Post Body Sync to Notion                         ║
╚════════════════════════════════════════════════════════════╝

📁 Working directory: /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin

🚀 Starting batch sync for LinkedIn posts

Found 8 LinkedIn posts to sync

📤 Syncing content body: 01-authority-post.md
✅ Body synced successfully

📤 Syncing content body: 02-framework-article.md
✅ Body synced successfully

...

✅ Batch sync complete: 8 succeeded, 0 failed
```

### 2. Resync Single File After Edits

After editing a post in PAI, resync just that file:

```bash
# Auto-detects workflow from filename
bun run notion-resync.ts --file 01-authority-post.md

# Force resync even if unchanged
bun run notion-resync.ts --file 01-authority-post.md --force
```

### 3. Check What Needs Syncing

See which files have changed since last sync:

```bash
bun run notion-resync.ts --check
```

**Output:**
```
🔍 Checking sync status...

📋 Files needing resync (2):

  - /home/alvis/PAI/scratchpad/.../01-authority-post.md
    Modified: 5 minutes ago
    Notion ID: 3030760eb0cd8147abbac459b990a7a3

  - /home/alvis/PAI/scratchpad/.../03-story-post.md
    Modified: 2 hours ago
    Notion ID: abc123def456...

To sync all: bun run notion-resync.ts --workflow 2026-01-31-playing-it-safe-illusion
```

### 4. Resync Entire Workflow

After making bulk edits to multiple posts:

```bash
bun run notion-resync.ts --workflow 2026-01-31-playing-it-safe-illusion
```

## Workflow

### Initial Setup (First Time)

1. **Create content in PAI** (Steps 1-13 of Content Create Flow)
2. **Sync properties to Notion** (existing `notion-sync.ts` creates entries)
3. **Run body sync** (this tool populates the page bodies)

```bash
# After Step 13 completes
cd /home/alvis/PAI/.claude/Skills/ContentWorkflow/tools
bun run sync-linkedin-bodies.ts
```

### Ongoing Editing

1. **Edit post in PAI** (in VS Code/Cursor)
2. **Resync to Notion**

```bash
bun run notion-resync.ts --file 01-authority-post.md
```

3. **Verify in Notion** (refresh page to see updates)

### Bidirectional Navigation

**Notion → PAI (Edit Source):**
1. Open LinkedIn post in Notion
2. Scroll to bottom → See "Source" section
3. Copy PAI file path
4. Open in VS Code: `code /home/alvis/PAI/scratchpad/content-create/.../01-authority-post.md`

**PAI → Notion (View Published):**
1. Open markdown file in PAI
2. Check frontmatter for `notion_url`
3. Open URL in browser

## Technical Details

### What Gets Synced

**From PAI Markdown:**
- Frontmatter → Parsed for metadata
- Post body → Main content section
- Strategic notes → Separate section at bottom

**To Notion Blocks:**
- Headings (H1, H2)
- Paragraphs (with bold/italic formatting)
- Bullet lists
- Dividers
- Code blocks (for file paths)

### Notion API Operations

1. **Clear existing blocks** (delete old content)
2. **Convert markdown to Notion blocks** (custom parser)
3. **Append new blocks** (populate body)
4. **Update frontmatter** (track last_synced timestamp)

### Error Handling

- **Missing notion_id:** Error message prompts to run initial sync first
- **API rate limits:** Exponential backoff with 3 retries
- **File not found:** Skip with warning, continue batch
- **Invalid markdown:** Skip parsing, log error

## Troubleshooting

### "No notion_id in frontmatter"

**Problem:** File hasn't been synced to Notion yet

**Solution:**
```bash
# Run initial property sync first (creates Notion entries)
# Then run body sync
```

### "Notion MCP requires re-authorization"

**Problem:** Notion API token expired

**Solution:**
1. Re-authenticate Notion MCP in Claude Code
2. Verify credentials in `~/.claude/.credentials.json`
3. Retry sync command

### "File not found"

**Problem:** File path is incorrect or file was moved

**Solution:**
1. Check file exists: `ls scratchpad/content-create/.../posts/`
2. Use correct workflow ID in path
3. Verify filename matches exactly (case-sensitive)

### Body Not Updating in Notion

**Problem:** Notion page doesn't show new content

**Solution:**
1. Hard refresh Notion page (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify `last_synced` timestamp updated in PAI file
4. Check Notion page history for changes

## Next Steps

After syncing bodies:

1. **Review in Notion**
   - Open Content database
   - Click any LinkedIn post
   - Verify content matches PAI source

2. **Customize Template**
   - Edit body structure in `notion-sync.ts`
   - Modify `generateLinkedInBody()` method
   - Add/remove sections as needed

3. **Extend to Other Content Types**
   - Blog posts (cornerstone content)
   - Newsletters
   - Email sequences
   - Use same pattern: parse markdown → generate body → sync

## Files Modified

**Created:**
- `sync-linkedin-bodies.ts` - Batch sync CLI tool
- `README-NOTION-BODY-SYNC.md` - This documentation

**Enhanced:**
- `notion-sync.ts` - Added body sync methods:
  - `syncContentBody()` - Sync single file
  - `batchSyncLinkedInBodies()` - Sync all posts
  - `generateLinkedInBody()` - Format body template
  - `markdownToNotionBlocks()` - Convert markdown to Notion
  - `parseMarkdownFormatting()` - Handle bold/italic
- `notion-resync.ts` - Integrated body sync into resync tool

## Template Customization

The body template is defined in `notion-sync.ts`:

```typescript
private generateLinkedInBody(data: {
  body: string;
  strategicNotes: string;
  frontmatter: Record<string, any>;
  filePath: string;
}): string {
  // Customize this method to change the body structure
  // Add/remove sections
  // Change formatting
  // Include different metadata fields
}
```

**Example Customizations:**

1. **Add Engagement Metrics Section:**
   ```typescript
   ## 📈 Expected Engagement

   **Likes:** ${frontmatter.expected_likes_min}-${frontmatter.expected_likes_max}
   **Comments:** ${frontmatter.expected_comments_min}-${frontmatter.expected_comments_max}
   **Golden Ratio:** ${frontmatter.golden_ratio_target}
   ```

2. **Add Related Content Links:**
   ```typescript
   ## 🔗 Related Content

   **Cornerstone:** [Blog Post Title](${wordpress_url})
   **Previous Post:** [Post #${posting_order - 1}](${prev_notion_url})
   **Next Post:** [Post #${posting_order + 1}](${next_notion_url})
   ```

3. **Add Publishing Checklist:**
   ```typescript
   ## ✅ Publishing Checklist

   - [ ] Reviewed for typos
   - [ ] Verified links work
   - [ ] Scheduled for optimal time
   - [ ] Prepared engagement responses
   - [ ] Tagged relevant connections
   ```

## Integration with Content Workflow

This body sync integrates with the existing 14-step Content Create Flow:

**Step 13: LinkedIn Extraction**
- Extracts 8-10 posts from cornerstone
- Creates markdown files with frontmatter
- **NEW:** Automatically syncs properties to Notion

**Step 13.5: Body Sync (NEW)**
- Reads markdown files
- Populates Notion page bodies
- Updates sync timestamps

**Step 14: Newsletter Creation**
- Can also use body sync for newsletter content
- Same pattern applies to any markdown content

## Performance

**Batch Sync (8 posts):**
- API calls: ~24 (3 per post: fetch, delete blocks, append blocks)
- Time: ~15-20 seconds total
- Rate limits: Well within Notion free tier (3 req/sec)

**Single File Resync:**
- API calls: ~3
- Time: ~2-3 seconds
- Real-time feedback in terminal

**Incremental Sync:**
- Only syncs files modified since last sync
- Checks file modification time vs `last_synced` timestamp
- Skips unchanged files automatically

---

**Questions or issues?** Check the troubleshooting section or file an issue in the PAI repository.
