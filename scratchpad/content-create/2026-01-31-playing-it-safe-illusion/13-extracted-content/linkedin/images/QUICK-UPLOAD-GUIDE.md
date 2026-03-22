# Quick Image Upload Guide

## Problem
Local file:// links aren't clickable/accessible from Notion or browser.

## Solution Options

### Option 1: Copy Images to Windows Desktop (Fastest)
```bash
# Run these commands to copy images to Windows Desktop for easy access:
cp /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png ~/../../mnt/c/Users/$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')/Desktop/napkin-sketch.png

cp /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png ~/../../mnt/c/Users/$(cmd.exe /c "echo %USERNAME%" 2>/dev/null | tr -d '\r')/Desktop/modern-alchemist.png
```

Then:
1. Open Notion database entries
2. Click "+" to add image
3. Select "Upload"
4. Browse to Desktop and upload

### Option 2: Direct Path in File Explorer
Open Windows File Explorer and paste this path:
```
\\wsl.localhost\Ubuntu\home\alvis\PAI\scratchpad\content-create\2026-01-31-playing-it-safe-illusion\13-extracted-content\linkedin\images
```

Then drag-and-drop images into Notion.

### Option 3: Open WSL Location from Terminal
```bash
# Open the folder in Windows Explorer:
explorer.exe /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images
```

Then drag images to Notion.

---

## Notion Links to Upload Images

**Napkin Sketch Entry:**
https://www.notion.so/3030760eb0cd8148aeaceaa6246b199c

**Modern Alchemist Entry:**
https://www.notion.so/3030760eb0cd810e8f0dc5248d6b97d1

**LinkedIn Authority Post (for body images):**
https://www.notion.so/3030760eb0cd8147abbac459b990a7a3

---

## Quick Reference

**Files:**
- `singapore-napkin-sketch.png` - 3.5MB, 2752x1536, Napkin style
- `singapore-modern-alchemist-paradox.png` - 2.9MB, 1792x1024, Modern Alchemist style

**Where to add:**
1. Images database entries (metadata records)
2. LinkedIn post body (actual post content)
