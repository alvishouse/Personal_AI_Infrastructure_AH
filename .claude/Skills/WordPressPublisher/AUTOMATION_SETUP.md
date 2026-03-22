# WordPress Automation Setup Guide

**Complete workflow: Markdown → HTML → WordPress with automatic image upload**

---

## 🎯 What This Does

**Single command posts to WordPress with:**
- ✅ Title format (eyebrow, subtitle, author meta)
- ✅ BrandHTMLConverter HTML styling
- ✅ Callout boxes (mechanism, warning, insight)
- ✅ Automatic image upload from local folder
- ✅ Featured image set automatically
- ✅ Image URLs replaced in content

---

## 📦 Prerequisites

**Python packages:**
```bash
pip install pyyaml requests
```

**Optional (for better markdown conversion):**
```bash
pip install markdown
```

**BrandHTMLConverter** (if you have it):
- The script will use it if available
- Falls back to basic conversion if not

---

## 🚀 Quick Start

### 1. Prepare Your Content

**Create markdown file:**
```bash
touch ~/temp_test_files/efficiency-trap.md
```

**Create image folder:**
```bash
mkdir -p ~/temp_test_files/blog-images/efficiency-trap/
```

**Add images to folder:**
```bash
cp ~/Downloads/hero.jpg ~/temp_test_files/blog-images/efficiency-trap/
cp ~/Downloads/framework.png ~/temp_test_files/blog-images/efficiency-trap/
```

### 2. Write Markdown with Callouts

**See `example-article.md` for complete example.**

**Callout syntax:**
```markdown
:::mechanism CORE INSIGHT
**Technology adoption follows human adoption patterns.**

If your team doesn't understand why they're using AI...
:::

:::warning COMMON MISTAKE
Optimizing for efficiency before understanding advantage will commoditize your team.
:::

:::insight KEY TAKEAWAY
The future belongs to organizations that amplify what makes people irreplaceable.
:::
```

**Image syntax:**
```markdown
![Alt text describing the image](hero.jpg)
![Framework diagram](framework-diagram.png)
```

### 3. Create Config File

**Copy template:**
```bash
cp ~/.claude/Skills/WordPressPublisher/config-template.yaml ~/temp_test_files/efficiency-trap.yaml
```

**Edit config:**
```yaml
markdown: ~/temp_test_files/efficiency-trap.md
images: ~/temp_test_files/blog-images/efficiency-trap/
metadata:
  eyebrow: "THE EFFICIENCY TRAP"
  subtitle: "Every organization asks how to make their teams more efficient with AI. It's the wrong question."
  author_title: "AI Readiness Consultant"
  read_time: "8"
category: "Strategy"
status: "draft"
featured_image: "hero.jpg"
```

### 4. Post to WordPress

**Using config file (recommended):**
```bash
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --config ~/temp_test_files/efficiency-trap.yaml
```

**Or using command-line arguments:**
```bash
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --markdown ~/temp_test_files/efficiency-trap.md \
  --images ~/temp_test_files/blog-images/efficiency-trap/ \
  --eyebrow "THE EFFICIENCY TRAP" \
  --subtitle "Every organization asks..." \
  --read-time "8" \
  --status "draft"
```

---

## 📝 Markdown Features

### Frontmatter (Optional)

**Add at top of markdown file:**
```markdown
---
title: "Your Post Title"
metadata:
  eyebrow: "YOUR EYEBROW"
  subtitle: "Your subtitle"
  author_title: "AI Readiness Consultant"
  read_time: "8"
  excerpt: "SEO excerpt"
---

# Your Post Title

Content starts here...
```

**Benefits:**
- Keep metadata with content
- Override config file settings
- Single source of truth

### Callout Boxes

**Three types:**

**1. Mechanism (explains how/why):**
```markdown
:::mechanism CORE INSIGHT
**Bold statement**

Explanation of how this works...
:::
```

**2. Warning (common mistakes):**
```markdown
:::warning COMMON MISTAKE
Don't do this thing.

Here's why it fails...
:::
```

**3. Insight (key takeaways):**
```markdown
:::insight KEY TAKEAWAY
The main point you want readers to remember.
:::
```

**Becomes:**
```html
<div class="callout mechanism">
    <div class="label">CORE INSIGHT</div>
    <p><strong>Bold statement</strong></p>
    <p>Explanation of how this works...</p>
</div>
```

### Images

**Standard markdown:**
```markdown
![Alt text](filename.jpg)
```

**With caption:**
```markdown
![Alt text](filename.jpg "This becomes the caption")
```

**Image naming:**
- `hero.jpg` - Automatically set as featured image (or specify in config)
- `diagram-framework.png` - Descriptive names
- `screenshot-dashboard.png` - Clear purpose

---

## 🔧 Script Options

### Command-Line Arguments

```bash
--config FILE          # YAML config file (recommended)
--markdown FILE        # Markdown file path
--images FOLDER        # Image folder path
--eyebrow TEXT         # Eyebrow text
--subtitle TEXT        # Subtitle text
--author-title TEXT    # Author title (default: "AI Readiness Consultant")
--read-time NUMBER     # Read time in minutes (default: "5")
--category NAME        # WordPress category (default: "Strategy")
--status draft|publish # Post status (default: "draft")
--featured-image FILE  # Specific featured image filename
```

---

## 📁 Folder Organization

**Recommended structure:**
```
~/temp_test_files/
├── efficiency-trap.md
├── efficiency-trap.yaml
├── ai-implementation.md
├── ai-implementation.yaml
└── blog-images/
    ├── efficiency-trap/
    │   ├── hero.jpg
    │   ├── framework-diagram.png
    │   └── results-chart.png
    ├── ai-implementation/
    │   ├── hero.jpg
    │   └── process-visual.png
    └── shared/
        ├── author-headshot.jpg
        └── logo.png
```

**Convention:**
- One folder per article
- Match markdown filename to folder name
- `shared/` for reusable images

---

## 🎨 Output Example

**When you run the script, you'll see:**

```
🔄 Processing markdown: efficiency-trap.md
🔄 Processing callout boxes...
🔄 Converting to HTML...
✅ HTML conversion complete

📸 Processing images from: ~/temp_test_files/blog-images/efficiency-trap/
   Found 3 image references
   ✓ Uploaded: hero.jpg → https://alvishouse.io/wp-content/uploads/2026/01/hero.jpg
   ⭐ Set as featured image: hero.jpg
   ✓ Using cached: framework-diagram.png
   ✓ Uploaded: results-chart.png → https://alvishouse.io/wp-content/uploads/2026/01/results-chart.png

📝 Creating WordPress post...
   Title: Your AI Strategy Is Solving the Wrong Problem
   Eyebrow: THE EFFICIENCY TRAP
   Subtitle: Every organization asks how to make their teams...
   Category: Strategy
   Status: draft

✅ Post created successfully!
   Post ID: 504
   Preview: https://alvishouse.io/?p=504&preview=true
```

---

## 🔍 Troubleshooting

### Images Not Found

**Problem:** `⚠️ Image not found: hero.jpg`

**Solution:**
- Check image folder path is correct
- Verify image filename matches exactly (case-sensitive)
- Check image is in correct folder

### Callouts Not Rendering

**Problem:** Callouts show as plain text

**Solution:**
- Check syntax: `:::mechanism LABEL` (three colons, space, label)
- Ensure closing `:::` on new line
- Verify CSS is in Additional CSS

### BrandHTMLConverter Not Found

**Problem:** `❌ BrandHTMLConverter not found`

**Solution:**
- Script will use basic markdown conversion
- Or install BrandHTMLConverter if you have it
- HTML will still work, just simpler conversion

### Post Creation Failed

**Problem:** `❌ Post creation failed: 401`

**Solution:**
- Check WordPress credentials in `post-to-wordpress.py`
- Verify application password is correct
- Test with: `curl -u "email:password" https://alvishouse.io/wp-json/wp/v2/posts`

---

## 🎯 Complete Workflow Example

**1. Write content:**
```bash
# Create files
touch ~/temp_test_files/my-article.md
mkdir -p ~/temp_test_files/blog-images/my-article/

# Add images
cp ~/Downloads/hero.jpg ~/temp_test_files/blog-images/my-article/

# Write markdown (use example-article.md as template)
nano ~/temp_test_files/my-article.md
```

**2. Create config:**
```bash
cp ~/.claude/Skills/WordPressPublisher/config-template.yaml \
   ~/temp_test_files/my-article.yaml

# Edit config
nano ~/temp_test_files/my-article.yaml
```

**3. Post:**
```bash
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --config ~/temp_test_files/my-article.yaml
```

**4. Preview:**
- Click the preview URL from output
- Check eyebrow, subtitle, images, callouts
- Publish when ready (or edit in WordPress)

---

## 💡 Tips

**Image caching:**
- Script caches uploaded images in `.image-cache.json`
- Won't re-upload same image twice
- Speeds up re-runs during testing

**Iterating on drafts:**
- Post as draft first (`status: "draft"`)
- Preview and check formatting
- Edit in WordPress if needed
- Publish when ready

**Reusing images:**
- Put common images in `blog-images/shared/`
- Reference with: `![Alt](../shared/logo.png)`

**Markdown tips:**
- Use descriptive image alt text for SEO
- Keep callouts concise (1-3 paragraphs)
- Use mechanism for "how it works"
- Use warning for "don't do this"
- Use insight for "key takeaway"

---

## 📚 Files Reference

| File | Purpose |
|------|---------|
| `post-to-wordpress.py` | Main automation script |
| `config-template.yaml` | Config file template |
| `example-article.md` | Markdown example with all features |
| `.image-cache.json` | Image upload cache (auto-created) |
| `AUTOMATION_SETUP.md` | This guide |
| `IMAGE_WORKFLOW_DESIGN.md` | Technical design doc |

---

**🎉 You're ready to automate your WordPress publishing workflow!**

Start with `example-article.md` to see all features in action.
