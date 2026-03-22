# Blog Test Area

**Purpose:** Testing blog content and art skill integration before moving to permanent locations.

## Directory Structure

```
blog/
├── drafts/       - Blog post drafts in markdown
├── images/       - Generated header images from art skill
├── test-posts/   - Experimental/throwaway content
└── README.md     - This file
```

## Workflow

1. **Create test posts** in `test-posts/` or `drafts/`
2. **Generate header images** using art skill → save to `images/`
3. **Test and iterate** until satisfied
4. **Promote to History** when ready: `~/.claude/History/blog/YYYY-MM/`

## Art Skill Integration

When testing the art skill for blog headers:

```bash
# Generate blog header image
bun run ~/.claude/Skills/art/tools/generate-ulart-image.ts \
  --model nano-banana-pro \
  --prompt "Your blog header prompt" \
  --size 2K \
  --aspect-ratio 16:9 \
  --output ~/.claude/Scratchpad/blog/images/header-name.png
```

## Cleanup Policy

**This is Scratchpad - delete when done!**

Move valuable content to History or Projects, then clean up test files.
