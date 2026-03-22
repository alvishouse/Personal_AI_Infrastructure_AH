# BrandHTMLConverter → WordPress Integration Guide

## Current State: BrandHTMLConverter

The BrandHTMLConverter skill ALREADY creates all aesthetic elements:
- Lead sections (dark ink wash)
- Callout boxes (Johnson box style: mechanism, insight, warning)
- Stat highlights
- Pull quotes
- Framework boxes (visual diagrams)
- Case study boxes (comparison grids)
- Research tables
- CTA boxes
- Final quotes
- Blockquotes with citations

**Current output format:** Full HTML document (`<html>`, `<head>`, `<body>`) with embedded CSS in `<style>` tag

---

## The One Critical Change Required

### Change: Output Format + CSS Delivery

**Problem:** BrandHTMLConverter currently outputs a FULL HTML document, but WordPress/Elementor needs:
1. **Content fragment only** (for Elementor Post Content widget)
2. **CSS available separately** (since WordPress strips `<html>` and `<head>` tags)

**Solution:** Two-part update

---

## Part 1: Create WordPress Output Mode

### Option A: WordPress-Specific Template (Recommended)

I already created this: `/home/alvis/temp_test_files/brand-html-converter_extracted/brand-html-converter/assets/template-wordpress.html`

```html
<!-- WordPress Content Fragment Template -->
<!-- This outputs ONLY content (no <html>, <head>, <body>) -->
<!-- Elementor Single Post template handles page structure -->

<article class="brand-content">
    {{CONTENT}}
</article>
```

**When to use:** When BrandHTMLConverter is converting FOR WordPress

### Option B: Strip Wrapper (Alternative)

Keep current template, but remove `<html>`, `<head>`, `<body>` programmatically:

```python
html_output = brand_html_converter.convert(markdown)
# Extract just the <article> content
content_only = extract_article_content(html_output)
```

---

## Part 2: CSS Delivery to WordPress

### The Core Issue

BrandHTMLConverter embeds CSS in `<style>` tags inside `<head>`:

```html
<head>
    <style>
        {{STYLES}}  <!-- brand-styles.css content goes here -->
    </style>
</head>
```

But WordPress/Elementor strips `<head>` when you post to the content field.

### Solution: Choose CSS Strategy

You have **2 viable options**:

---

### Option 1: Site-Wide CSS in Elementor (RECOMMENDED)

**What to do:**
1. Copy entire contents of `brand-styles.css` (713 lines)
2. Go to: **WordPress Admin → Elementor → Custom CSS**
3. Paste CSS
4. Save

**Then:**
- BrandHTMLConverter outputs content with class names only
- WordPress theme applies the styles automatically
- All posts use the same consistent styling

**Pros:**
- Clean HTML (no inline styles)
- Easy to update styles globally
- Consistent across all posts
- Best for production

**Cons:**
- Requires one-time WordPress setup
- Must complete before first post

**Implementation:**
```html
<!-- BrandHTMLConverter outputs this: -->
<div class="callout mechanism">
    <div class="label">Core Insight</div>
    <p>Content...</p>
</div>

<!-- WordPress applies CSS from Elementor Custom CSS automatically -->
```

---

### Option 2: Inline Styles (TESTING ONLY)

**What to do:**
- Modify BrandHTMLConverter to generate inline `style` attributes for each element

**Example:**
```html
<div class="callout mechanism" style="background: #ece6d9; border-left: 5px solid #3b546b; padding: 20px; border-radius: 10px;">
    <div class="label" style="font-family: Montserrat, sans-serif; text-transform: uppercase; color: #3b546b;">Core Insight</div>
    <p>Content...</p>
</div>
```

**Pros:**
- Works immediately without WordPress setup
- Good for testing
- Survives theme changes

**Cons:**
- Much larger HTML file size
- Hard to update styles globally
- Not recommended for production

---

## Recommended Implementation Path

### Phase 1: WordPress CSS Setup (One-Time, 5 minutes)

1. Copy CSS from `brand-styles.css`
2. Go to WordPress: **Elementor → Custom CSS**
3. Paste:

```css
/* BrandHTMLConverter Aesthetic Elements */
/* Auto-generated from brand-styles.css */

:root {
    --ink: #3b546b;
    --rust: #cf5828;
    --slate: #7a8c9b;
    --paper: #ece6d9;
    --text: #2b2b2b;
    --muted: rgba(59,84,107,.75);
    --rule: rgba(59,84,107,.22);
    --bg: #ffffff;
}

/* [Paste all 713 lines from brand-styles.css] */
```

4. Add Google Fonts to Elementor:
   - **Elementor → Custom Fonts** OR
   - Add to Custom CSS:
```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
```

**✓ After this step:** All aesthetic element classes will work in WordPress

---

### Phase 2: Update BrandHTMLConverter Workflow

When converting markdown for WordPress:

```python
# 1. Read markdown source
with open(markdown_path, 'r') as f:
    markdown_content = f.read()

# 2. Convert to HTML using WordPress template
# (BrandHTMLConverter creates all aesthetic elements automatically)
html_content = brand_html_converter.convert(
    markdown_content,
    template='wordpress'  # Uses template-wordpress.html (content fragment only)
)

# 3. Extract metadata (for title format)
metadata = extract_metadata(markdown_content)

# 4. Post to WordPress
post_data = {
    "title": metadata['title'],
    "content": html_content,  # Content fragment with aesthetic elements
    "excerpt": metadata['subtitle'],
    "meta": {
        "eyebrow_text": metadata['eyebrow'],
        "subtitle": metadata['subtitle'],
        "author_title": metadata['author_title'],
        "read_time": metadata['read_time']
    }
}

response = requests.post(
    f"{wp_url}/wp-json/wp/v2/posts",
    auth=HTTPBasicAuth(wp_user, wp_pass),
    json=post_data
)
```

**✓ After this step:** BrandHTMLConverter → WordPress publishing works end-to-end

---

## What BrandHTMLConverter Doesn't Need to Change

**The aesthetic elements themselves are perfect.** No changes needed to:
- Element HTML structure
- Class naming (`.callout.mechanism`, `.stat-highlight`, `.pull-quote`, etc.)
- Markdown conversion logic
- Visual design

**The ONLY changes:**
1. Output format: Content fragment instead of full HTML document
2. CSS delivery: Let WordPress handle CSS via Elementor Custom CSS

---

## Testing Checklist

Before full Elementor setup, test aesthetic elements:

### Test 1: Add CSS to WordPress
- [ ] Copy `brand-styles.css` content
- [ ] Go to Elementor → Custom CSS
- [ ] Paste CSS
- [ ] Add Google Fonts import
- [ ] Save

### Test 2: Post Sample Aesthetic Elements
- [ ] Create HTML with one callout box
- [ ] Create HTML with one stat highlight
- [ ] Create HTML with one pull quote
- [ ] Post to WordPress (update post #467)
- [ ] Preview in browser
- [ ] Verify styling works

### Test 3: Full BrandHTMLConverter Content
- [ ] Convert full markdown to HTML (WordPress mode)
- [ ] Post to WordPress
- [ ] Verify all aesthetic elements render correctly
- [ ] Check mobile responsive
- [ ] Verify no CSS conflicts with theme

---

## Quick Test: Verify CSS Strategy

**Test right now with post #467:**

```bash
python3 << 'EOF'
import requests
from requests.auth import HTTPBasicAuth

# Sample HTML with BrandHTMLConverter classes (NO inline styles)
test_html = """
<h2>Test: Aesthetic Elements (WordPress CSS)</h2>

<div class="callout mechanism">
    <div class="label">Core Insight</div>
    <p><strong>This callout uses CSS classes only (no inline styles).</strong></p>
    <p>If you see this styled correctly with paper background and left border,
    then brand-styles.css is loaded in WordPress.</p>
</div>

<div class="stat-highlight">
    <div class="stat-number">100%</div>
    <div class="stat-label">This stat highlight should show large number on left.</div>
</div>

<div class="pull-quote">
    This pull quote should be centered, italic, with top and bottom borders.
</div>

<p><strong>If all three elements above are styled correctly, proceed with Elementor setup.</strong></p>
<p><em>If they're unstyled (no colors, no borders), you need to add CSS to Elementor Custom CSS first.</em></p>
"""

wp_url = "https://alvishouse.io"
wp_user = "alvishousepoompow@gmail.com"
wp_pass = "ez4D2i98iKJJ7JDo2K2PNZmE"

response = requests.post(
    f"{wp_url}/wp-json/wp/v2/posts/467",
    auth=HTTPBasicAuth(wp_user, wp_pass),
    json={"content": test_html},
    headers={"Content-Type": "application/json"}
)

result = response.json()
print(f"✓ Test posted to: {result['link']}")
print(f"\nPreview: {result['link']}")
print("\n**Check if aesthetic elements are styled:**")
print("  - If YES → CSS is working, proceed with Elementor setup")
print("  - If NO → Add brand-styles.css to Elementor Custom CSS first")

EOF
```

---

## Summary: What Changes Are Required?

### Required Changes BEFORE Elementor Setup:

1. **Add CSS to WordPress** (5 minutes)
   - Go to: Elementor → Custom CSS
   - Paste: All of `brand-styles.css`
   - Add: Google Fonts import

2. **Update BrandHTMLConverter output format** (already done)
   - Use: `template-wordpress.html` (content fragment)
   - Instead of: `template.html` (full HTML document)

### NOT Required:

- ✓ Aesthetic element HTML structure (already perfect)
- ✓ Element styling (already defined in brand-styles.css)
- ✓ Markdown conversion logic (already works)
- ✓ Class naming conventions (already correct)

---

## Next Steps

1. **Test CSS strategy** (run command above to test post #467)
2. **If unstyled:** Add `brand-styles.css` to Elementor Custom CSS
3. **If styled:** Proceed with Elementor Single Post template setup
4. **Update publishing workflow** to use WordPress output mode

**The aesthetic elements are ready. You just need to deliver the CSS to WordPress.**
