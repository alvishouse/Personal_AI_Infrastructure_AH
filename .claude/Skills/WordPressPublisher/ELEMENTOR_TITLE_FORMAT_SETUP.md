# Elementor Title Format Setup Guide

## ✅ Prerequisites (Already Complete)

- [x] Meta fields registered via plugin
- [x] Test metadata added to post #467
- [x] CSS infrastructure active

## 📝 What We're Building

Transform this plain title format:
```
Stop Deploying AI. Start Amplifying Humans.
```

Into this structured title format:
```
THE HIDDEN FLAW IN EVERY AI ROADMAP          ← Eyebrow (rust color, uppercase)
Stop Deploying AI. Start Amplifying Humans.  ← Title (standard)
Organizations chasing efficiency are...      ← Subtitle (italic, muted)
Alvis Lazarus • AI Readiness Consultant • 22 min read  ← Meta (small, slate color)
───────────────────────────────────────────
```

---

## 🎨 Step 1: Add CSS to Additional CSS

1. **Go to:** Appearance → Customize → Additional CSS
2. **Scroll to bottom** of existing CSS
3. **Add this CSS:**

```css
/* ============================================
   TITLE FORMAT STYLES
   ============================================ */

.article-header {
    margin-bottom: 2.5em;
    padding-bottom: 2em;
    border-bottom: 1px solid var(--rule);
}

.eyebrow {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 0.8em !important;
    font-weight: 600 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.12em !important;
    color: var(--rust) !important;
    margin-bottom: 0.5em !important;
    display: block !important;
}

.subtitle {
    font-size: 1.2em !important;
    color: var(--muted) !important;
    font-style: italic !important;
    margin-top: 0.5em !important;
    line-height: 1.5 !important;
    display: block !important;
}

.meta {
    font-family: 'Montserrat', sans-serif !important;
    font-size: 0.85em !important;
    color: var(--slate) !important;
    margin-top: 1.5em !important;
    display: block !important;
}

.meta strong {
    color: var(--ink) !important;
}
```

4. **Click:** Publish

---

## 🏗️ Step 2: Edit Single Post Template in Elementor

### Option A: Edit Existing Template

1. **Go to:** Elementor → Theme Builder → Single Post
2. **Click:** Edit (on your existing template)

### Option B: Create New Template

1. **Go to:** Elementor → Theme Builder
2. **Click:** "+ Add New" → Single Post
3. **Name it:** "Blog Post with Title Format"

---

## 📦 Step 3: Build Title Format Structure

### Layout Structure:

```
┌─────────────────────────────────────────┐
│  SECTION: Title Header                   │
│  ┌──────────────────────────────────┐   │
│  │  COLUMN (100% width)              │   │
│  │  ┌───────────────────────────┐    │   │
│  │  │ TEXT EDITOR: Eyebrow      │    │   │
│  │  │ (dynamic: eyebrow_text)   │    │   │
│  │  └───────────────────────────┘    │   │
│  │  ┌───────────────────────────┐    │   │
│  │  │ POST TITLE WIDGET         │    │   │
│  │  │ (default Elementor widget)│    │   │
│  │  └───────────────────────────┘    │   │
│  │  ┌───────────────────────────┐    │   │
│  │  │ TEXT EDITOR: Subtitle     │    │   │
│  │  │ (dynamic: subtitle)       │    │   │
│  │  └───────────────────────────┘    │   │
│  │  ┌───────────────────────────┐    │   │
│  │  │ TEXT EDITOR: Author Meta  │    │   │
│  │  │ (dynamic: author_title,   │    │   │
│  │  │  read_time)               │    │   │
│  │  └───────────────────────────┘    │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## 🔧 Step 4: Configure Each Widget

### Widget 1: Eyebrow Text

1. **Drag:** Text Editor widget to top of column
2. **Click:** Text Editor to open settings
3. **Content tab:**
   - Click inside text area
   - Click: **Dynamic Tags** icon (wrench/folder icon)
   - Select: **Post Custom Field**
   - Key: `eyebrow_text`
4. **Advanced tab:**
   - CSS Classes: `eyebrow`
5. **Save**

---

### Widget 2: Post Title

1. **Drag:** Post Title widget below eyebrow
2. **Style tab:**
   - Keep default styling (or customize as desired)
3. **Advanced tab:**
   - CSS Classes: `post-title` (optional)
4. **Save**

---

### Widget 3: Subtitle

1. **Drag:** Text Editor widget below title
2. **Click:** Text Editor to open settings
3. **Content tab:**
   - Click inside text area
   - Click: **Dynamic Tags** icon
   - Select: **Post Custom Field**
   - Key: `subtitle`
4. **Advanced tab:**
   - CSS Classes: `subtitle`
5. **Save**

---

### Widget 4: Author Meta Line

**Option A: Fully Dynamic (Recommended)**

1. **Drag:** Text Editor widget below subtitle
2. **Content tab:**
   - Type this HTML structure:
   ```html
   <strong>Alvis Lazarus</strong> • <span class="author-role"></span> • <span class="read-time"></span> min read
   ```
3. **For author_title:**
   - Select the text between `<span class="author-role">` tags
   - Click: **Dynamic Tags** icon
   - Select: **Post Custom Field**
   - Key: `author_title`
4. **For read_time:**
   - Select the text between `<span class="read-time">` tags
   - Click: **Dynamic Tags** icon
   - Select: **Post Custom Field**
   - Key: `read_time`
5. **Advanced tab:**
   - CSS Classes: `meta`
6. **Save**

**Option B: Simple Static (For Testing)**

1. **Drag:** Text Editor widget below subtitle
2. **Content tab:**
   - Type: `<strong>Alvis Lazarus</strong> • AI Readiness Consultant • 22 min read`
3. **Advanced tab:**
   - CSS Classes: `meta`
4. **Save**

---

## 🎯 Step 5: Set Display Conditions

1. **Click:** Settings icon (bottom left) or "Display Conditions"
2. **Include:**
   - Posts (all posts)
   - OR: Category → Strategy (specific category)
3. **Save template**
4. **Publish**

---

## ✅ Step 6: Test on Post #467

1. **Visit:** https://alvishouse.io/?p=467
2. **Hard refresh:** Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

**You should see:**
- `THE HIDDEN FLAW IN EVERY AI ROADMAP` (rust color, uppercase, small)
- `Stop Deploying AI. Start Amplifying Humans.` (normal title)
- `Organizations chasing efficiency are automating their differentiation away` (italic, muted color)
- `Alvis Lazarus • AI Readiness Consultant • 22 min read` (small, slate color)
- Horizontal rule below meta

---

## 🔍 Troubleshooting

### Eyebrow/Subtitle Not Showing

**Problem:** Dynamic tags showing as empty or not displaying

**Check:**
1. Meta fields exist: `curl -s "https://alvishouse.io/wp-json/wp/v2/posts/467" | grep eyebrow_text`
2. Custom field key is exact: `eyebrow_text` not `eyebrow-text`
3. Dynamic tag is set to "Post Custom Field" not "Meta Field"

### Styling Not Applying

**Problem:** Text showing but no color/size changes

**Check:**
1. CSS Classes are exact: `eyebrow`, `subtitle`, `meta`
2. Additional CSS includes the title format styles
3. Hard refresh browser: Ctrl+Shift+R
4. Inspect element to see if styles are crossed out (specificity issue)

**Solution:** Add `!important` to CSS rules if needed

### Meta Line Showing Dynamic Tag Syntax

**Problem:** Seeing `{dynamic_tag:...}` instead of value

**Check:**
1. You're in **Text Editor** widget (not HTML widget)
2. Dynamic Tags inserted via the Dynamic Tags icon (not typed manually)
3. Post #467 actually has the meta field values set

---

## 📊 Current Status

| Component | Status | Notes |
|-----------|--------|-------|
| Meta Fields Registered | ✅ Complete | Via plugin |
| Test Data Added | ✅ Complete | Post #467 has all fields |
| CSS Created | ✅ Complete | In title-format-css.css |
| CSS Added to WordPress | ⏸️ Manual Required | Copy to Additional CSS |
| Elementor Template | ⏸️ Manual Required | Follow steps above |
| Display Conditions | ⏸️ Manual Required | Set after template created |

---

## 🚀 What's Next

After completing the manual Elementor setup:

1. **Test workflow:** Create a new blog post with metadata
2. **Configure BrandHTMLConverter:** WordPress template mode
3. **Full automation:** Markdown → HTML → WordPress with metadata

---

## 📝 Production Workflow (Future)

Once template is configured, publishing will be:

```python
# Extract metadata from markdown
metadata = extract_metadata('blog-post.md')

# Convert to HTML
html = brand_html_converter.convert(
    'blog-post.md',
    template='wordpress'
)

# Post to WordPress
post_data = {
    "title": metadata['title'],
    "content": html,
    "excerpt": metadata['subtitle'],
    "status": "draft",
    "categories": [18],  # Strategy
    "meta": {
        "eyebrow_text": metadata['eyebrow'],
        "subtitle": metadata['subtitle'],
        "author_title": "AI Readiness Consultant",
        "read_time": metadata['read_time']
    }
}

response = requests.post(
    f"{wp_url}/wp-json/wp/v2/posts",
    auth=HTTPBasicAuth(wp_user, wp_pass),
    json=post_data
)
```

**Result:** Fully formatted blog post with eyebrow, title, subtitle, meta line, and styled content.

---

**Files Referenced:**
- Plugin: `/home/alvis/.claude/Skills/WordPressPublisher/pai-title-format-meta-fields.php`
- CSS: `/home/alvis/.claude/Skills/WordPressPublisher/title-format-css.css`
- Test Post: https://alvishouse.io/?p=467

**Current Step:** Add CSS to Additional CSS, then configure Elementor template
