# Content Creation Workflow

Create cornerstone blog content with research, images, and multi-platform extraction in 13 semi-automated steps.

---

## Quick Start

### Start a New Workflow

```
Start Content Creation Workflow
```

or

```
Create cornerstone content about [TOPIC]
```

### Resume an Existing Workflow

```
Resume Content Creation Workflow: 2026-01-31-ai-strategy-gap
```

### Check Workflow Status

```
Content Workflow Status: 2026-01-31-ai-strategy-gap
```

---

## How It Works

### The 13 Steps at a Glance

| Step | What Happens | You Do | AI Does |
|------|--------------|--------|---------|
| **1** | Pick a topic | Select from list | Present options |
| **2** | Deep research | Wait | Research (Sonnet) |
| **3** | Generate big ideas | Wait | Write ideas (Opus) |
| **4** | Choose big idea | Select one | Present options |
| **5** | Generate headlines | Wait | Write headlines (Opus) |
| **6** | Choose headline | Select one | Present options |
| **7** | Write cornerstone | Wait | Write 2,500-5,000 words (Opus) |
| **8** | Editor review | Wait | Review checklist (Sonnet) |
| **9** | Manual review | Edit + plan images | Present draft |
| **10** | Create images | Approve each image | Generate via Art skill |
| **11** | Preview HTML | Approve final | Assemble + preview |
| **12** | Publish to WordPress | Wait | Publish as draft |
| **13** | Extract content | Select platforms | Extract 60+ pieces (Sonnet) |

**PAUSE steps (1, 4, 6, 9, 10, 11, 13):** Require your input
**AUTO steps (2, 3, 5, 7, 8, 12):** Run automatically

---

## What You'll Create

From ONE cornerstone post, the workflow produces:

| Platform | Pieces |
|----------|--------|
| **Blog** | 1 cornerstone (2,500-5,000 words) |
| **Twitter/X** | 29 pieces (5 threads + 24 tweets) |
| **LinkedIn** | 16 pieces (2 articles + 14 posts) |
| **Newsletter** | 6 themed editions |
| **Visuals** | 11 pieces (carousels, graphics) |
| **Total** | **62+ content pieces** |

---

## File Reference

### Context Files (Loaded Automatically)

| File | What It Contains |
|------|------------------|
| `inner-album-of-greatest-hits.md` | 10 evergreen topics (Tracks 1-10) |
| `other-topics.md` | Non-evergreen topic queue |
| `icp-mid-market-squeezed.md` | Target audience profile |
| `business-offer-profile.md` | Your offer context |
| `alvis-house-voice-style-guide.md` | Writing voice guide |

### System Prompts

| File | Used In |
|------|---------|
| `01-cornerstone-creation-system-prompt.md` | Step 7 (Long form writing) |
| `02-content-extraction-system-prompt.md` | Step 13 (Platform extraction) |

### Reference Guides

| File | Purpose |
|------|---------|
| `WORKFLOW.md` | Complete step-by-step instructions |
| `00-quick-reference.md` | Templates and extraction matrix |
| `content-image-references.md` | Image sizes and manifest template |

---

## Output Location

All workflow outputs are saved to:

```
${PAI_DIR}/scratchpad/content-create/[workflow-id]/
```

Example:
```
scratchpad/content-create/2026-01-31-ai-strategy-gap/
├── 01-research.md
├── 02-big-ideas.md
├── 03-selected-big-idea.md
├── 04-headlines.md
├── 05-selected-headline.md
├── 06-cornerstone-draft.md
├── 07-editor-review.md
├── 08-cornerstone-final.md
├── 09-image-manifest.md
├── 10-images/
├── 11-cornerstone-assembled.md
├── 12-html-preview/
├── 13-extracted-content/
└── metadata.json          ← Tracks workflow status
```

---

## Tips for Best Results

### Before Starting

1. **Review your evergreen topics** - Pick from Tracks 1-10 for consistent authority building
2. **Have examples ready** - Think of client stories, personal experiences, famous examples
3. **Block 2-3 hours** - The full workflow takes time, but you can pause anytime

### During the Workflow

1. **Trust the PAUSE points** - They're designed for meaningful review, not busywork
2. **Be specific in selections** - When choosing big ideas and headlines, pick the one that feels most "you"
3. **Plan images in Step 9** - List ALL images you'll need before Step 10

### Image Tips

1. **Featured image first** - This is the most important one
2. **Match style to content** - Use Excalidraw for diagrams, Modern Alchemist for headers
3. **Don't skip extraction images** - Platform-specific images boost engagement

---

## Troubleshooting

### "Where did my workflow go?"

Check `scratchpad/content-create/` for your workflow folder. Read `metadata.json` to see current status.

### "Can I edit the draft manually?"

Yes! Step 9 is specifically for manual edits. Edit `08-cornerstone-final.md` directly.

### "What if I don't like an image?"

In Step 10, you can reject and regenerate any image before proceeding.

### "Can I skip the extraction step?"

Yes, Step 13 is optional. You can publish to WordPress in Step 12 and extract content later.

---

## Related Skills

| Skill | Integration Point |
|-------|-------------------|
| **Art** | Step 10 - Image generation |
| **BrandHTMLConverter** | Step 11 - HTML preview |
| **WordPress Publisher** | Step 12 - Publish to WordPress |

---

## Next Steps After This Workflow

1. **Review WordPress draft** - Check formatting, images, links
2. **Schedule publication** - Set your publish date
3. **Queue extracted content** - Schedule Twitter threads, LinkedIn posts
4. **Track performance** - Note which pieces perform best for future reference

---

*For detailed step-by-step instructions, see `WORKFLOW.md`*
