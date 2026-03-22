# WordPress Image Upload Workflow Design

**Goal:** Reference images in markdown by filename, automatically upload to WordPress during posting.

---

## 📁 Folder Structure

```
~/temp_test_files/
└── blog-images/
    ├── efficiency-trap/
    │   ├── hero.jpg
    │   ├── diagram-1.png
    │   └── screenshot-metrics.png
    ├── ai-implementation/
    │   ├── hero.jpg
    │   └── framework-visual.png
    └── shared/
        ├── author-headshot.jpg
        └── logo.png
```

**Convention:**
- One subfolder per blog post (named after post slug or topic)
- `shared/` folder for reusable images (logos, headshots, etc.)
- Clear, descriptive filenames

---

## ✍️ Markdown Image Syntax

**Standard markdown (recommended):**
```markdown
# Your AI Strategy Is Solving the Wrong Problem

![Hero image showing efficiency vs amplification](hero.jpg)

## The Efficiency Paradox

Text here...

![Framework diagram](diagram-1.png)

More text...
```

**The script will:**
1. Detect `![alt text](filename.jpg)`
2. Look for `filename.jpg` in the post's image folder
3. Upload to WordPress
4. Replace with WordPress URL

**Alternative: Custom shortcode syntax (if you prefer):**
```markdown
{{image:hero.jpg|alt=Hero showing efficiency vs amplification}}

{{image:diagram-1.png|alt=Framework diagram|caption=The Amplification Framework}}
```

---

## 🔧 How It Works

### Step 1: Prepare Images
```bash
# Create folder for your post
mkdir -p ~/temp_test_files/blog-images/efficiency-trap/

# Add images
cp hero-image.jpg ~/temp_test_files/blog-images/efficiency-trap/hero.jpg
cp diagram.png ~/temp_test_files/blog-images/efficiency-trap/diagram-1.png
```

### Step 2: Write Markdown
```markdown
# Your AI Strategy Is Solving the Wrong Problem

![Opening visual](hero.jpg)

Your content here...

![The framework](diagram-1.png)
```

### Step 3: Convert with BrandHTMLConverter
```bash
brand-html-converter convert \
  --input efficiency-trap.md \
  --output efficiency-trap.html \
  --template wordpress
```

**Result:**
```html
<img src="hero.jpg" alt="Opening visual">
<p>Your content here...</p>
<img src="diagram-1.png" alt="The framework">
```

### Step 4: Post to WordPress (with image upload)
```bash
python3 post-to-wordpress.py \
  --html efficiency-trap.html \
  --images ~/temp_test_files/blog-images/efficiency-trap/ \
  --eyebrow "THE EFFICIENCY TRAP" \
  --subtitle "Every organization asks..."
```

**Script does:**
1. Reads HTML file
2. Finds all `<img src="local-file.jpg">` references
3. Uploads each image to WordPress Media Library
4. Gets WordPress URL: `https://alvishouse.io/wp-content/uploads/2026/01/hero.jpg`
5. Replaces: `<img src="https://alvishouse.io/wp-content/uploads/2026/01/hero.jpg">`
6. Posts final HTML with metadata

---

## 🎯 Naming Conventions

### Image Filenames

**Good:**
- `hero.jpg` - Main featured/hero image
- `diagram-amplification-framework.png` - Descriptive diagram
- `screenshot-dashboard.png` - Screenshots
- `photo-author.jpg` - Photos
- `chart-growth-metrics.png` - Charts/graphs

**Avoid:**
- `IMG_1234.jpg` - Non-descriptive
- `Screen Shot 2026-01-28 at 3.45.23 PM.png` - Too verbose
- `final-final-v3.jpg` - Version numbers

### Folder Names

**Match your post slug:**
- Markdown: `efficiency-trap.md`
- Image folder: `blog-images/efficiency-trap/`
- WordPress slug: `your-ai-strategy-is-solving-the-wrong-problem` (auto-generated)

---

## 🚀 Automation Script Features

### WordPress Image Uploader Script

**Will handle:**
- ✅ Upload images to WordPress Media Library
- ✅ Set proper alt text from markdown
- ✅ Add captions (if specified)
- ✅ Set featured image (first image or `hero.jpg`)
- ✅ Return WordPress URLs
- ✅ Replace HTML image references
- ✅ Cache uploaded images (don't re-upload if already exists)
- ✅ Optimize images before upload (optional)

**Command:**
```bash
python3 ~/.claude/Skills/WordPressPublisher/post-to-wordpress.py \
  --markdown efficiency-trap.md \
  --images ~/temp_test_files/blog-images/efficiency-trap/ \
  --eyebrow "THE EFFICIENCY TRAP" \
  --subtitle "Every organization asks..." \
  --author-title "AI Readiness Consultant" \
  --read-time "6" \
  --category "Strategy" \
  --status "draft"
```

**Or simpler with config file:**
```bash
python3 post-to-wordpress.py --config efficiency-trap.yaml
```

**Config file (`efficiency-trap.yaml`):**
```yaml
markdown: efficiency-trap.md
images: ~/temp_test_files/blog-images/efficiency-trap/
metadata:
  eyebrow: "THE EFFICIENCY TRAP"
  subtitle: "Every organization asks how to make their teams more efficient with AI. It's the wrong question."
  author_title: "AI Readiness Consultant"
  read_time: "6"
category: "Strategy"
status: "draft"
featured_image: "hero.jpg"  # Optional, defaults to first image
```

---

## 📋 Complete Workflow Example

### 1. Create Post Structure
```bash
# Create markdown file
touch ~/temp_test_files/efficiency-trap.md

# Create image folder
mkdir -p ~/temp_test_files/blog-images/efficiency-trap/

# Add images
cp ~/Downloads/hero.jpg ~/temp_test_files/blog-images/efficiency-trap/
cp ~/Downloads/framework.png ~/temp_test_files/blog-images/efficiency-trap/
```

### 2. Write Markdown
```markdown
# Your AI Strategy Is Solving the Wrong Problem

![AI strategy visualization](hero.jpg)

## The Efficiency Paradox

Every organization I work with asks the same question...

![The Amplification Framework](framework.png)

Three shifts from efficiency-first to amplification-first AI:
1. Stop automating tasks
2. Stop measuring time saved
3. Stop replacing headcount
```

### 3. Post to WordPress
```bash
python3 post-to-wordpress.py \
  --markdown ~/temp_test_files/efficiency-trap.md \
  --images ~/temp_test_files/blog-images/efficiency-trap/ \
  --eyebrow "THE EFFICIENCY TRAP" \
  --subtitle "Every organization asks..." \
  --status "draft"
```

### 4. Script Output
```
🔄 Processing markdown...
✅ Converted to HTML via BrandHTMLConverter

📸 Found 2 images to upload:
   - hero.jpg
   - framework.png

⬆️  Uploading to WordPress...
   ✅ hero.jpg → https://alvishouse.io/wp-content/uploads/2026/01/hero.jpg
   ✅ framework.png → https://alvishouse.io/wp-content/uploads/2026/01/framework.png

🔄 Replacing image references in HTML...
✅ Updated 2 image references

📝 Creating WordPress post...
✅ Post created: #504
🔗 Preview: https://alvishouse.io/?p=504&preview=true

🖼️  Set featured image: hero.jpg (Media ID: 505)
```

---

## 🔧 Advanced Features

### Image Optimization
```bash
# Auto-resize large images before upload
--optimize-images
--max-width 2000  # Default: 2000px
--quality 85      # JPEG quality (default: 85)
```

### Image Caching
```bash
# Don't re-upload images that already exist
--cache ~/.claude/Skills/WordPressPublisher/.image-cache.json
```

### Shared Images
```bash
# Reference images from shared folder
![Author headshot](shared:author-headshot.jpg)

# Script looks in ~/temp_test_files/blog-images/shared/
```

### Multiple Image Folders
```bash
--images ~/temp_test_files/blog-images/efficiency-trap/
--shared-images ~/temp_test_files/blog-images/shared/
```

---

## 📊 Image Reference Formats

### Standard Markdown
```markdown
![Alt text](image.jpg)
```

### With Title (becomes caption in WordPress)
```markdown
![Alt text](image.jpg "This is the caption")
```

### Figure with Caption
```markdown
![Framework diagram](diagram.png "Figure 1: The Amplification Framework shows three key shifts")
```

**Becomes:**
```html
<figure class="wp-block-image">
  <img src="https://alvishouse.io/.../diagram.png" alt="Framework diagram">
  <figcaption>Figure 1: The Amplification Framework shows three key shifts</figcaption>
</figure>
```

---

## ✅ Next Steps

**I'll create:**

1. **`post-to-wordpress.py`** - Main posting script with image upload
2. **`upload-image.py`** - Standalone image uploader (if you want to upload manually)
3. **`config-template.yaml`** - Template for post configuration
4. **Image workflow documentation**

**Ready to build this?**

Let me know and I'll create the complete automation system!
