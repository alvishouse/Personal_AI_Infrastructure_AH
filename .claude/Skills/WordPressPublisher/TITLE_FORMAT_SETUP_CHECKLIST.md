# Title Format Setup Checklist

## Goal
Implement the eyebrow + title + subtitle + author meta format from image-5.png.

---

## Step 1: Register Meta Fields in WordPress

Add this code to your WordPress site (choose one method):

### Method A: Add to Theme functions.php (Recommended)

1. Go to: **WordPress Admin → Appearance → Theme File Editor**
2. Select: **functions.php** (right sidebar)
3. Scroll to bottom and paste the code from `wordpress-meta-registration.php`
4. Click **Update File**

### Method B: Create Custom Plugin

1. Create file: `wp-content/plugins/pai-meta-fields/pai-meta-fields.php`
2. Paste this code:

```php
<?php
/**
 * Plugin Name: PAI Meta Fields
 * Description: Registers custom meta fields for AI-generated content
 * Version: 1.0
 */

// Paste contents of wordpress-meta-registration.php here
```

3. Go to: **Plugins → Activate "PAI Meta Fields"**

**✓ After this step:** Meta fields are accessible via REST API

---

## Step 2: Test Meta Field Registration

Run this command to verify registration:

```bash
curl -X GET "https://alvishouse.io/wp-json/wp/v2/posts/467" \
  -u "alvishousepoompow@gmail.com:ez4D2i98iKJJ7JDo2K2PNZmE" \
  | python3 -c "import json, sys; post = json.load(sys.stdin); print('Meta fields:', list(post.get('meta', {}).keys()))"
```

**Expected output:**
```
Meta fields: ['eyebrow_text', 'subtitle', 'author_title', 'read_time', ...]
```

**✓ After this step:** Confirm meta fields appear in API response

---

## Step 3: Create Elementor Single Post Template

1. Go to: **Templates → Theme Builder → Add New**
2. Select: **Single Post**
3. Name: "AI Blog Post Template"
4. Click **Create Template**

### Template Structure

Build this layout in Elementor:

```
┌─────────────────────────────────────────────────┐
│ SECTION: Article Header                         │
│ (max-width: 800px, centered)                    │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Text Editor Widget]                            │
│ Content: Dynamic Tags → Post Custom Field       │
│          → eyebrow_text                         │
│ Style:                                          │
│   - Typography: Montserrat, 14px, 600          │
│   - Color: #cf5828 (rust)                      │
│   - Transform: Uppercase                        │
│   - Letter Spacing: 0.1em                      │
│   - Margin Bottom: 1rem                        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Post Title Widget]                             │
│ (Default settings, auto pulls post title)       │
│ Style:                                          │
│   - Typography: Lora, 48px, 600                │
│   - Color: #2b2b2b (dark)                      │
│   - Line Height: 1.2                           │
│   - Margin Bottom: 1.5rem                      │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Text Editor Widget]                            │
│ Content: Dynamic Tags → Post Custom Field       │
│          → subtitle                             │
│ Style:                                          │
│   - Typography: Lora, 20px, 400, Italic        │
│   - Color: #7a8c9b (slate)                     │
│   - Line Height: 1.5                           │
│   - Margin Bottom: 2rem                        │
│                                                 │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Custom HTML Widget]                            │
│ Content:                                        │
│   <p class="post-meta">                         │
│     By <strong><?php the_author(); ?></strong>  │
│     | <?php echo get_post_meta(                │
│         get_the_ID(), 'author_title', true); ?> │
│     | <?php echo get_the_date('F Y'); ?>        │
│     | <?php echo get_post_meta(                │
│         get_the_ID(), 'read_time', true); ?>    │
│       min read                                  │
│   </p>                                          │
│ Style:                                          │
│   - Typography: Montserrat, 14px, 400          │
│   - Color: #7a8c9b (slate)                     │
│   - Margin Bottom: 3rem                        │
│                                                 │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ SECTION: Main Content                           │
├─────────────────────────────────────────────────┤
│                                                 │
│ [Post Content Widget]                           │
│ (Default settings, auto pulls post content)     │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Display Conditions

Set template to apply to:
- **Include: All → Posts in Category → Strategy** (ID: 18)
- Or: **Include: All → Posts** (if you want it for all posts)

**Save & Publish Template**

**✓ After this step:** Template is live and ready for content

---

## Step 4: Add Custom CSS

Go to: **Elementor → Custom CSS** (site-wide) and paste:

```css
/* Article Header */
.article-header {
  max-width: 800px;
  margin: 0 auto 3rem;
}

/* Eyebrow Text */
.eyebrow {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #cf5828;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  display: block;
}

/* Post Title */
.post-title {
  font-family: 'Lora', serif;
  font-size: 3rem;
  font-weight: 600;
  color: #2b2b2b;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

/* Subtitle */
.subtitle {
  font-family: 'Lora', serif;
  font-size: 1.25rem;
  font-style: italic;
  color: #7a8c9b;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Author Meta */
.post-meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  color: #7a8c9b;
  margin-bottom: 3rem;
}

.post-meta strong {
  color: #3b546b;
}

/* Responsive */
@media (max-width: 768px) {
  .post-title {
    font-size: 2rem;
  }
  .subtitle {
    font-size: 1rem;
  }
}
```

**✓ After this step:** CSS styling is applied site-wide

---

## Step 5: Re-Post with Metadata

Now that meta fields are registered, re-post the content:

```bash
cd ~/.claude/Skills/WordPressPublisher
python3 << 'EOF'
import requests
from requests.auth import HTTPBasicAuth
import json

# Load metadata
metadata = {
    'eyebrow': 'THE HIDDEN FLAW IN EVERY AI ROADMAP',
    'title': 'Stop Deploying AI. Start Amplifying Humans.',
    'subtitle': 'Organizations chasing efficiency are automating their differentiation away. The winners are using AI to multiply what their best people already do—and it\'s not even close.',
    'read_time': 22
}

# WordPress configuration
wp_url = "https://alvishouse.io"
wp_user = "alvishousepoompow@gmail.com"
wp_pass = "ez4D2i98iKJJ7JDo2K2PNZmE"

# Update post #467
post_id = 467

update_data = {
    "title": metadata['title'],
    "excerpt": metadata['subtitle'],
    "meta": {
        "eyebrow_text": metadata['eyebrow'],
        "subtitle": metadata['subtitle'],
        "author_title": "AI Readiness Consultant",
        "read_time": str(metadata['read_time'])
    }
}

response = requests.post(
    f"{wp_url}/wp-json/wp/v2/posts/{post_id}",
    auth=HTTPBasicAuth(wp_user, wp_pass),
    json=update_data,
    headers={"Content-Type": "application/json"}
)

result = response.json()

if 'meta' in result:
    print("✓ Meta fields saved:")
    print(f"  eyebrow_text: {result['meta']['eyebrow_text']}")
    print(f"  subtitle: {result['meta']['subtitle'][:50]}...")
    print(f"  author_title: {result['meta']['author_title']}")
    print(f"  read_time: {result['meta']['read_time']}")
else:
    print("✗ Meta fields not in response (check WordPress registration)")

EOF
```

**✓ After this step:** Post has all metadata fields

---

## Step 6: Preview in Browser

1. Go to: https://alvishouse.io/?p=467
2. Verify you see:
   - [ ] Eyebrow text (rust color, uppercase)
   - [ ] Main title (large serif)
   - [ ] Subtitle (italic)
   - [ ] Author meta line
   - [ ] Main content

---

## Step 7: Update BrandHTMLConverter (Optional)

If you want BrandHTMLConverter to output WordPress-compatible content:

1. Use `template-wordpress.html` (content fragment only)
2. Extract metadata before conversion
3. Pass metadata to WordPress separately

See: `TITLE_FORMAT_GUIDE.md` for complete workflow example

---

## Troubleshooting

### Meta fields not appearing in Elementor
1. Clear Elementor cache: **Elementor → Tools → Regenerate CSS**
2. Clear WordPress cache
3. Verify meta fields registered: Check REST API response

### Eyebrow text not showing
1. Check Dynamic Tag: Post Custom Field → `eyebrow_text`
2. Check spelling: `eyebrow_text` (no spaces, no typos)
3. Check post has meta: View post in browser → Inspect element

### CSS not applying
1. Clear Elementor cache
2. Clear browser cache (Cmd/Ctrl + Shift + R)
3. Check Custom CSS saved: Elementor → Custom CSS
4. Check browser DevTools for CSS conflicts

---

## Quick Test Commands

**Check if meta fields are registered:**
```bash
curl "https://alvishouse.io/wp-json/wp/v2/posts/467" \
  -u "alvishousepoompow@gmail.com:ez4D2i98iKJJ7JDo2K2PNZmE" \
  | grep -o '"eyebrow_text"'
```

**Update meta fields directly:**
```bash
curl -X POST "https://alvishouse.io/wp-json/wp/v2/posts/467" \
  -u "alvishousepoompow@gmail.com:ez4D2i98iKJJ7JDo2K2PNZmE" \
  -H "Content-Type: application/json" \
  -d '{
    "meta": {
      "eyebrow_text": "TEST EYEBROW",
      "subtitle": "Test subtitle",
      "author_title": "Test Author",
      "read_time": "5"
    }
  }'
```

---

## Summary

**Once complete, your publishing workflow is:**

1. Write markdown with ## eyebrow, # title, *subtitle*
2. Extract metadata (Python script)
3. Convert to HTML (BrandHTMLConverter)
4. Post to WordPress via REST API with metadata
5. Elementor template automatically displays formatted title
6. Publish!

**No manual Elementor editing required!**
