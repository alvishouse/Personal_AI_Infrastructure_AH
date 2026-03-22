# Notion File Link Fix for WSL/Windows

## Problem

Notion was generating `file://` links with Linux paths that Windows File Explorer couldn't open:

❌ **Before:** `file:///home/alvis/PAI/scratchpad/content-create/...`
✅ **After:** `file://wsl.localhost/Ubuntu/home/alvis/PAI/scratchpad/content-create/...`

## Solution Implemented

### 1. Path Conversion Function

Added `linuxPathToWindowsFileUrl()` function to `notion-sync.ts`:

```typescript
function linuxPathToWindowsFileUrl(linuxPath: string): string {
  const pathWithoutLeadingSlash = linuxPath.replace(/^\//, "");
  return `file://wsl.localhost/Ubuntu/${pathWithoutLeadingSlash}`;
}
```

### 2. Updated All Notion URL Properties

Updated three locations where `file://` URLs are generated:

- **Workflows Database** → "Local Directory" property
- **Images Database** → "File Path" property
- **Content Database** → "Local File Path" property

All now use Windows WSL-compatible format.

## How It Works

### Path Conversion

```
Linux Path:     /home/alvis/PAI/scratchpad/content-create/2026-01-31-topic/file.md
                     ↓ remove leading /
                home/alvis/PAI/scratchpad/content-create/2026-01-31-topic/file.md
                     ↓ prepend wsl.localhost/Ubuntu/
Windows URL:    file://wsl.localhost/Ubuntu/home/alvis/PAI/scratchpad/content-create/2026-01-31-topic/file.md
```

### Why `wsl.localhost`?

- Works on Windows 11 and modern Windows 10
- More reliable than `\\wsl$\` format
- Directly compatible with File Explorer address bar
- No UNC path conversion needed

## Usage

### For New Content

All new content synced to Notion will automatically use Windows-compatible URLs.

No action needed - just use the workflow as normal!

### For Existing Content

Run the migration script to fix existing Notion entries:

```bash
cd /home/alvis/PAI

# Fix all existing Notion entries
bun run .claude/Skills/ContentWorkflow/tools/fix-notion-file-links.ts
```

This updates:
- All workflow "Local Directory" links
- All image "File Path" links
- All content "Local File Path" links

## Testing

### Test Path Conversion

```bash
bun run .claude/Skills/ContentWorkflow/tools/test-path-conversion.ts
```

### Test in Notion

1. Open any Notion database (Workflows, Images, or Content)
2. Click on a "Local File Path" or "File Path" link
3. Should open in Windows File Explorer at the correct location

### Manual Test

Copy this URL and paste into Windows File Explorer address bar:

```
file://wsl.localhost/Ubuntu/home/alvis/PAI/.claude/Skills/ContentWorkflow/NOTION-WSL-FIX.md
```

Should open this file!

## Files Modified

- `tools/notion-sync.ts` - Added path conversion function and updated 3 URL properties
- `tools/test-path-conversion.ts` - Test script for path conversion
- `tools/fix-notion-file-links.ts` - Migration script for existing entries
- `NOTION-WSL-FIX.md` - This documentation

## Backward Compatibility

This change is **backward compatible**:

- WSL can still access files normally (internal operations use Linux paths)
- Only affects Notion `file://` URL properties
- No changes to local file storage or workflow logic
- Works whether accessed from Windows or WSL

## Future Content

All content created from now on will use Windows-compatible links automatically.

The workflow remains exactly the same - this is a transparent fix.

## Troubleshooting

### Links Still Don't Work

**Check WSL distribution name:**
```bash
wsl -l -v
```

If your distribution isn't "Ubuntu", update the function in `notion-sync.ts`:

```typescript
// Replace "Ubuntu" with your actual distribution name
return `file://wsl.localhost/YourDistroName/${pathWithoutLeadingSlash}`;
```

### File Explorer Shows "Location is not available"

1. Ensure WSL is running: `wsl --version`
2. Try accessing via network path first: `\\wsl.localhost\Ubuntu\home\alvis\PAI`
3. Check Windows 10 version (needs 1903 or later for `wsl.localhost`)

### Alternative Format (if wsl.localhost doesn't work)

Edit the function to use `wsl$` format instead:

```typescript
function linuxPathToWindowsFileUrl(linuxPath: string): string {
  const pathWithoutLeadingSlash = linuxPath.replace(/^\//, "");
  return `file://wsl$/Ubuntu/${pathWithoutLeadingSlash}`;
}
```

## Related Documentation

- `README-NOTION.md` - Notion integration overview
- `QUICK-START.md` - Getting started guide
- `NOTION-INTEGRATION.md` - Technical integration details

---

**Status:** ✅ Implemented and tested
**Date:** 2026-02-10
**Impact:** All Notion file links now work from Windows File Explorer
