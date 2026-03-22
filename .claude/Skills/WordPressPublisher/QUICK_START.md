# Quick Start - WordPress Automation

**Your complete markdown-to-WordPress automation is ready!**

---

## ✅ What's Been Built

1. **`post-to-wordpress.py`** - Main automation script
2. **`config-template.yaml`** - Configuration template
3. **`example-article.md`** - Full example with callouts and images
4. **`AUTOMATION_SETUP.md`** - Complete documentation

---

## 🚀 Test It Now

**Try the example article:**

```bash
# 1. Install Python dependencies
pip install pyyaml requests

# 2. Create test image folder
mkdir -p ~/temp_test_files/blog-images/example/

# 3. Add a test image (any image will do)
cp ~/PAI/Screenshots/image-1.png ~/temp_test_files/blog-images/example/hero.jpg

# 4. Copy example to temp folder
cp ~/.claude/Skills/WordPressPublisher/example-article.md ~/temp_test_files/

# 5. Create config
cat > ~/temp_test_files/example.yaml << 'EOF'
markdown: ~/temp_test_files/example-article.md
images: ~/temp_test_files/blog-images/example/
metadata:
  eyebrow: "THE EFFICIENCY TRAP"
  subtitle: "Testing the automation workflow"
  author_title: "AI Readiness Consultant"
  read_time: "8"
category: "Strategy"
status: "draft"
EOF

# 6. Post to WordPress
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --config ~/temp_test_files/example.yaml
```

---

## 📝 Features

### Callout Boxes

**In your markdown:**
```markdown
:::mechanism CORE INSIGHT
**Bold statement**
Explanation...
:::

:::warning COMMON MISTAKE
Don't do this...
:::

:::insight KEY TAKEAWAY
Main takeaway...
:::
```

**Becomes styled callout boxes with:**
- Paper background (#ece6d9)
- Ink border (#3b546b)
- Uppercase labels
- Full BrandHTMLConverter styling

### Images

**In your markdown:**
```markdown
![Description](hero.jpg)
![Diagram](framework.png)
```

**Script automatically:**
- Finds images in your folder
- Uploads to WordPress
- Replaces paths with WordPress URLs
- Sets featured image

### Title Format

**Config file:**
```yaml
metadata:
  eyebrow: "YOUR EYEBROW"
  subtitle: "Your subtitle"
  author_title: "AI Readiness Consultant"
  read_time: "8"
```

**Displays:**
- Eyebrow in rust color, uppercase
- Title (from markdown)
- Subtitle in italic, muted
- Author box (your Elementor template)

---

## 📁 File Organization

**For each article:**
```
~/temp_test_files/
├── article-name.md          # Your markdown
├── article-name.yaml        # Config file
└── blog-images/
    └── article-name/        # Images folder
        ├── hero.jpg
        └── diagram.png
```

---

## 🎯 Real Workflow

**1. Write your article in markdown:**
```markdown
---
title: "Your Title"
metadata:
  eyebrow: "YOUR CATEGORY"
  subtitle: "Your subtitle"
  read_time: "6"
---

# Your Title

![Hero image](hero.jpg)

Your content...

:::mechanism HOW IT WORKS
Explanation...
:::

More content...

![Diagram](diagram.png)
```

**2. Add images to folder:**
```bash
mkdir -p ~/temp_test_files/blog-images/your-article/
cp ~/Downloads/*.jpg ~/temp_test_files/blog-images/your-article/
```

**3. Create simple config:**
```yaml
markdown: ~/temp_test_files/your-article.md
images: ~/temp_test_files/blog-images/your-article/
status: "draft"
```

**4. Post:**
```bash
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --config ~/temp_test_files/your-article.yaml
```

**5. Preview and publish!**

---

## 🔍 What to Check

**After posting, verify:**
- ✅ Eyebrow text in rust color
- ✅ Subtitle in italic below title
- ✅ Featured image displays
- ✅ All images loaded correctly
- ✅ Callout boxes styled with paper background
- ✅ All BrandHTMLConverter elements working

---

## 📚 Documentation

**Full guides:**
- `AUTOMATION_SETUP.md` - Complete setup and usage
- `IMAGE_WORKFLOW_DESIGN.md` - Technical design
- `example-article.md` - Full example with all features

**Templates:**
- `config-template.yaml` - Copy and customize
- `example-article.md` - Markdown template

---

## 💡 Next Steps

1. **Test with example** (commands above)
2. **Review the output** in WordPress
3. **Write your first real article**
4. **Customize as needed**

---

**🎉 You now have a complete automated publishing workflow!**

Markdown → Callouts → Images → WordPress → Fully Styled Post

All in one command.
