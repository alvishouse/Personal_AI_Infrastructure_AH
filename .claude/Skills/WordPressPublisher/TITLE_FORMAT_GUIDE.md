# Title Format Implementation Guide

## Goal: Match image-5.png Format

Implement the eyebrow + title + subtitle + author meta format shown in image-5.png.

## Format Structure

```
[EYEBROW TEXT - uppercase, rust color]
THE HIDDEN FLAW IN EVERY AI ROADMAP

[MAIN TITLE - large serif, dark]
Stop Deploying AI. Start Amplifying Humans.

[SUBTITLE - italic serif, slate]
Organizations chasing efficiency are automating their differentiation
away. The winners are using AI to multiply what their best people
already do—and it's not even close.

[AUTHOR META - small, slate]
By Alvis Lazarus | AI Readiness Consultant | January 2026 | 25 min read
```

---

## Implementation Steps

### 1. Extract Metadata from Markdown

When processing markdown, extract these fields:

```python
import re

def extract_post_metadata(markdown_content):
    """Extract eyebrow, title, subtitle from markdown."""

    lines = markdown_content.strip().split('\n')

    # Pattern: First ## heading becomes eyebrow (uppercase)
    # First # heading becomes title
    # First italic paragraph becomes subtitle

    eyebrow = None
    title = None
    subtitle = None
    author = "Alvis Lazarus"
    author_title = "AI Readiness Consultant"
    read_time = None

    for i, line in enumerate(lines):
        line = line.strip()

        # Extract eyebrow (## heading)
        if not eyebrow and line.startswith('## '):
            eyebrow = line[3:].strip().upper()

        # Extract title (# heading)
        elif not title and line.startswith('# '):
            title = line[2:].strip()

        # Extract subtitle (first *italic* or _italic_ paragraph after title)
        elif title and not subtitle:
            if line.startswith('*') or line.startswith('_'):
                subtitle = line.strip('*_').strip()

        # Calculate read time (rough estimate: 200 words/min)
        if line:
            word_count = len(markdown_content.split())
            read_time = max(1, round(word_count / 200))

    return {
        'eyebrow': eyebrow or '',
        'title': title or 'Untitled',
        'subtitle': subtitle or '',
        'author': author,
        'author_title': author_title,
        'read_time': read_time or 5
    }
```

**Example Input Markdown:**

```markdown
## The Hidden Flaw in Every AI Roadmap

# Stop Deploying AI. Start Amplifying Humans.

*Organizations chasing efficiency are automating their differentiation away. The winners are using AI to multiply what their best people already do—and it's not even close.*

<!-- Rest of content -->
```

**Example Output:**

```python
{
    'eyebrow': 'THE HIDDEN FLAW IN EVERY AI ROADMAP',
    'title': 'Stop Deploying AI. Start Amplifying Humans.',
    'subtitle': 'Organizations chasing efficiency are automating...',
    'author': 'Alvis Lazarus',
    'author_title': 'AI Readiness Consultant',
    'read_time': 25
}
```

---

### 2. WordPress Post Structure

Post to WordPress with custom meta fields:

```python
import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime

def create_wordpress_post(metadata, html_content, wp_config):
    """Create WordPress post with eyebrow/subtitle metadata."""

    post_data = {
        "title": metadata['title'],
        "content": html_content,  # Content fragment from BrandHTMLConverter
        "excerpt": metadata['subtitle'],
        "status": "draft",
        "categories": [18],  # Strategy
        "template": "",  # Use site default (Elementor Single Post template)

        # Custom meta fields for title format
        "meta": {
            "eyebrow_text": metadata['eyebrow'],
            "subtitle": metadata['subtitle'],
            "author_title": metadata['author_title'],
            "read_time": metadata['read_time']
        }
    }

    response = requests.post(
        f"{wp_config['url']}/wp-json/wp/v2/posts",
        auth=HTTPBasicAuth(wp_config['username'], wp_config['password']),
        json=post_data,
        headers={"Content-Type": "application/json"}
    )

    return response.json()
```

---

### 3. Elementor Single Post Template

Create this structure in Elementor Theme Builder → Single Post template:

#### Template Structure

```
┌─────────────────────────────────────┐
│ [Text Editor Widget - Eyebrow]     │  ← Custom meta: eyebrow_text
│ THE HIDDEN FLAW IN EVERY AI ROADMAP│
├─────────────────────────────────────┤
│ [Post Title Widget]                 │  ← Dynamic: Post title
│ Stop Deploying AI. Start...         │
├─────────────────────────────────────┤
│ [Text Editor Widget - Subtitle]     │  ← Custom meta: subtitle
│ Organizations chasing efficiency... │
├─────────────────────────────────────┤
│ [Post Meta Widget]                  │  ← Dynamic: Author, date, read_time
│ By Alvis | Jan 2026 | 25 min read   │
├─────────────────────────────────────┤
│                                     │
│ [Post Content Widget]               │  ← HTML from BrandHTMLConverter
│ (Main article content)              │
│                                     │
└─────────────────────────────────────┘
```

#### Widget Configuration

**1. Eyebrow Text Widget:**
- Type: Text Editor
- Content: Dynamic Tags → Post Custom Field → `eyebrow_text`
- Style:
  ```
  Typography: Montserrat, 14px, 600 weight
  Color: #cf5828 (rust)
  Transform: Uppercase
  Letter Spacing: 0.1em
  Margin Bottom: 1rem
  ```

**2. Post Title Widget:**
- Type: Post Title
- Content: Automatic (pulls from post title)
- Style:
  ```
  Typography: Lora, 48px, 600 weight
  Color: #2b2b2b (dark text)
  Line Height: 1.2
  Margin Bottom: 1.5rem
  ```

**3. Subtitle Widget:**
- Type: Text Editor
- Content: Dynamic Tags → Post Custom Field → `subtitle`
- Style:
  ```
  Typography: Lora, 20px, 400 weight, italic
  Color: #7a8c9b (slate)
  Line Height: 1.5
  Margin Bottom: 2rem
  ```

**4. Author Meta Widget:**
- Type: Custom HTML
- Content:
  ```html
  <p class="post-meta">
    By <strong><?php the_author(); ?></strong>
    | <?php echo get_post_meta(get_the_ID(), 'author_title', true); ?>
    | <?php echo get_the_date('F Y'); ?>
    | <?php echo get_post_meta(get_the_ID(), 'read_time', true); ?> min read
  </p>
  ```
- Style:
  ```
  Typography: Montserrat, 14px, 400 weight
  Color: #7a8c9b (slate)
  Margin Bottom: 3rem
  ```

**5. Post Content Widget:**
- Type: Post Content
- Content: Automatic (pulls from post content field)
- No additional styling needed (BrandHTMLConverter handles this)

---

### 4. CSS Styling (Add to Elementor → Custom CSS)

```css
/* Article Header Styling */
.article-header {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: left;
}

/* Eyebrow Text */
.eyebrow,
.elementor-widget-text-editor .eyebrow {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #cf5828;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
  display: block;
}

/* Main Title */
.post-title,
.elementor-heading-title {
  font-family: 'Lora', serif;
  font-size: 3rem;
  font-weight: 600;
  color: #2b2b2b;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

/* Subtitle */
.subtitle,
.elementor-widget-text-editor .subtitle {
  font-family: 'Lora', serif;
  font-size: 1.25rem;
  font-weight: 400;
  font-style: italic;
  color: #7a8c9b;
  line-height: 1.5;
  margin-bottom: 2rem;
}

/* Author Meta */
.post-meta {
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  color: #7a8c9b;
  margin-bottom: 3rem;
}

.post-meta strong {
  color: #3b546b;
}

/* Responsive */
@media (max-width: 768px) {
  .post-title,
  .elementor-heading-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }
}
```

---

## Complete Publishing Workflow

### Step-by-Step Example

```python
#!/usr/bin/env python3
"""
Complete workflow: Markdown → WordPress with title format
"""

import requests
from requests.auth import HTTPBasicAuth
from datetime import datetime
import re

# 1. Read markdown source
markdown_path = "/home/alvis/.claude/Scratchpad/blog/drafts/Blog_LF_StopDeployingAIStartAmplifyingHumans"
with open(markdown_path, 'r') as f:
    markdown_content = f.read()

# 2. Extract metadata
metadata = extract_post_metadata(markdown_content)

# 3. Convert to HTML (using BrandHTMLConverter)
# For now, using simple conversion as placeholder
html_content = f"<article>{markdown_content}</article>"

# 4. WordPress configuration
wp_config = {
    'url': 'https://alvishouse.io',
    'username': 'alvishousepoompow@gmail.com',
    'password': 'ez4D2i98iKJJ7JDo2K2PNZmE'
}

# 5. Create WordPress post
post_data = {
    "title": metadata['title'],
    "content": html_content,
    "excerpt": metadata['subtitle'],
    "status": "draft",
    "categories": [18],
    "template": "",
    "meta": {
        "eyebrow_text": metadata['eyebrow'],
        "subtitle": metadata['subtitle'],
        "author_title": metadata['author_title'],
        "read_time": str(metadata['read_time'])
    }
}

response = requests.post(
    f"{wp_config['url']}/wp-json/wp/v2/posts",
    auth=HTTPBasicAuth(wp_config['username'], wp_config['password']),
    json=post_data,
    headers={"Content-Type": "application/json"}
)

result = response.json()

# 6. Output result
if response.status_code == 201:
    print(f"✓ Post created: {result['title']['rendered']}")
    print(f"  Post ID: {result['id']}")
    print(f"  Edit: {wp_config['url']}/wp-admin/post.php?post={result['id']}&action=edit")
    print(f"  Preview: {result['link']}")
else:
    print(f"✗ Error: {result}")
```

---

## Testing Checklist

- [ ] Markdown has ## eyebrow, # title, *subtitle* format
- [ ] Metadata extraction works correctly
- [ ] WordPress post created with custom meta fields
- [ ] Elementor template displays eyebrow text
- [ ] Elementor template displays subtitle
- [ ] Author meta line shows correctly
- [ ] CSS styling matches image-5.png format
- [ ] Responsive design works on mobile
- [ ] Content from BrandHTMLConverter displays correctly

---

## Troubleshooting

### Eyebrow not showing
- Check custom meta field name: `eyebrow_text` (no spaces)
- Verify dynamic tag in Elementor: Post Custom Field → eyebrow_text
- Check post has metadata: `wp post meta list <post-id>`

### Subtitle not showing
- Check custom meta field name: `subtitle`
- Verify dynamic tag in Elementor: Post Custom Field → subtitle
- Ensure excerpt is also populated (fallback)

### Author meta incomplete
- Verify `author_title` meta field exists
- Verify `read_time` meta field exists
- Check Custom HTML widget has correct PHP code

### CSS not applying
- Ensure Lora and Montserrat fonts are loaded
- Check Elementor → Custom CSS is saved
- Clear WordPress cache
- Check browser DevTools for CSS conflicts

---

## Quick Reference: Meta Fields

| Field | WordPress Meta Key | Example Value |
|-------|-------------------|---------------|
| Eyebrow | `eyebrow_text` | `THE HIDDEN FLAW IN EVERY AI ROADMAP` |
| Title | `post_title` (built-in) | `Stop Deploying AI. Start Amplifying Humans.` |
| Subtitle | `subtitle` | `Organizations chasing efficiency...` |
| Author | `post_author` (built-in) | `1` (user ID) |
| Author Title | `author_title` | `AI Readiness Consultant` |
| Date | `post_date` (built-in) | `2026-01-27` |
| Read Time | `read_time` | `25` |

---

**Next Step:** Test this workflow with the existing post #467 by updating it with custom meta fields.
