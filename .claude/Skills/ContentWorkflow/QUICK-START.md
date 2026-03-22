# Notion Integration - Quick Start Guide

Get started with the Content Workflow → Notion integration in 5 minutes.

## Prerequisites

1. **Notion Integration Token**

   Get your token:
   - Go to https://www.notion.so/my-integrations
   - Click "+ New integration"
   - Name it "PAI Content Workflow"
   - Copy the "Internal Integration Token"

2. **Configure Credentials**

   Create `~/.claude/.credentials.json`:
   ```bash
   mkdir -p ~/.claude
   cat > ~/.claude/.credentials.json << 'EOF'
   {
     "notion": {
       "api_key": "secret_YOUR_TOKEN_HERE"
     }
   }
   EOF
   chmod 600 ~/.claude/.credentials.json
   ```

3. **Share Databases with Integration**

   In Notion:
   - Open "Content Workflows" database
   - Click "..." → "Connect to"
   - Select "PAI Content Workflow"
   - Repeat for "Content Images" and "Content" databases

## Verify Setup

Run the verification script:

```bash
cd /home/alvis/PAI
bun run .claude/Skills/ContentWorkflow/tools/verify-notion-integration.ts
```

Expected output:
```
✅ All tests passed! Integration is ready.
```

## Migrate Existing Content

Sync the 2026-01-31 workflow to Notion:

```bash
bun run .claude/Skills/ContentWorkflow/tools/migrate-to-notion.ts
```

This creates:
- 1 Workflow entry
- 3 Image entries
- 1 Cornerstone blog entry
- 8 LinkedIn post entries

Expected output:
```
✅ Migration Complete!

📊 Summary:
   Workflow:        [notion-id]
   Images:          3 created
   Cornerstone:     [notion-id]
   LinkedIn Posts:  8 created
   Total Entries:   13
```

## View in Notion

1. Open your Notion workspace
2. Navigate to "Content Generation" → "Content Workflows"
3. You should see: "2026-01-31-playing-it-safe-illusion"
4. Click to explore relations to Images and Content

## Everyday Usage

### After Creating Images (Step 10)

```bash
# Auto-sync happens during workflow
# Or manually trigger:
bun run .claude/Skills/ContentWorkflow/tools/sync-images.ts \
  --workflow your-workflow-id
```

### After WordPress Publish (Step 12)

```bash
# Auto-sync happens during workflow
# Or manually trigger:
bun run .claude/Skills/ContentWorkflow/tools/sync-wordpress.ts \
  --workflow your-workflow-id
```

### After LinkedIn Extraction (Step 13)

```bash
# Auto-sync happens during workflow
# Or manually trigger:
bun run .claude/Skills/ContentWorkflow/tools/sync-linkedin.ts \
  --workflow your-workflow-id
```

### Edit Content Locally

1. Edit file in PAI:
   ```bash
   code ~/PAI/scratchpad/content-create/[workflow]/[file].md
   ```

2. Resync to Notion:
   ```bash
   bun run .claude/Skills/ContentWorkflow/tools/notion-resync.ts \
     --file [filename]
   ```

3. Refresh Notion to see updates

### Check Sync Status

```bash
bun run .claude/Skills/ContentWorkflow/tools/notion-resync.ts --check
```

Shows which files have been edited since last sync.

## Navigation

### Notion → PAI

Every Notion entry has a "Local File Path" property:
- Click the `file://` link
- Opens file directly in VS Code/Cursor

### PAI → Notion

Every synced file has frontmatter:
```yaml
---
notion_url: "https://notion.so/..."
last_synced: "2026-02-09T..."
---
```

Click the notion_url to view in Notion.

## Troubleshooting

### "Notion API key not found"

**Solution:** Check `~/.claude/.credentials.json` exists and has correct format.

```bash
cat ~/.claude/.credentials.json
```

### "Database not found"

**Solution:** Share databases with your Notion integration.

1. Open each database in Notion
2. Click "..." → "Connect to"
3. Select "PAI Content Workflow"

### "File not synced to Notion"

**Solution:** File is missing `notion_id` frontmatter. Run initial sync first.

### Sync Failed (Non-Critical)

**Solution:** Workflow continues. Bulk-sync later:

```bash
bun run .claude/Skills/ContentWorkflow/tools/migrate-to-notion.ts
```

## Next Steps

- **Explore Databases:** Open Notion and browse the synced content
- **Try Resync:** Edit a local file and resync to test bidirectional flow
- **Customize Views:** Create custom Notion views for your workflow
- **Read Full Docs:** See README-NOTION.md for complete documentation

## File Organization

```
.claude/Skills/ContentWorkflow/
├── README-NOTION.md              # Complete documentation
├── NOTION-INTEGRATION.md         # Step-by-step integration guide
├── QUICK-START.md               # This file
└── tools/
    ├── notion-sync.ts           # Core sync utility
    ├── notion-resync.ts         # Bidirectional sync CLI
    ├── migrate-to-notion.ts     # One-time migration
    └── verify-notion-integration.ts  # Verification tests
```

## Support

For issues or questions:
1. Check troubleshooting section above
2. Review full documentation in README-NOTION.md
3. Run verification: `verify-notion-integration.ts`
4. Check Notion integration settings

## Success Criteria

✅ Verification script passes all tests
✅ Migration creates 13 entries in Notion
✅ Can navigate from Notion to PAI files
✅ Can edit PAI files and resync to Notion
✅ All images tracked with DRY principle
✅ Workflow status updates correctly

You're all set! 🚀
