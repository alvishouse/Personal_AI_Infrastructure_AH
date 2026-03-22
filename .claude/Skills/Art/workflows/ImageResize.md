# Image Resize Workflow

**Adapt one image to multiple social media sizes and aspect ratios.**

Takes a single image and generates versions optimized for different platforms - cropping, reframing, or regenerating to fit each channel's requirements.

---

## Purpose

**Use this workflow when:**
- You have a final image and need it sized for multiple platforms
- You want consistent branding across social channels
- You need quick exports for distribution

**Output:**
- Multiple sized versions of the same image
- Each optimized for its target platform

---

## Slash Command

```
/image-resize <source-image> [-c channels] [-o /path]
```

**Arguments:**

| Long | Short | Description |
|------|-------|-------------|
| `--channels` | `-c` | Channels to export (default: all) |
| `--output-dir` | `-o` | Output directory |

**Channel Shortcuts:**

| Channel | Shortcut |
|---------|----------|
| blog | `bl` |
| linkedin | `li` |
| twitter | `tw` |
| instagram_feed | `ig` |
| instagram_story | `igs` |
| newsletter | `nl` |
| opengraph | `og` |
| all social | `social` |
| all | `all` |

**Quick Examples:**
```bash
# All channels
/image-resize ./image.png

# LinkedIn + Twitter only
/image-resize ./image.png -c li,tw

# Social preset (li, tw, ig, igs)
/image-resize ./image.png -c social
```

---

## Channel Specifications

| Channel | Aspect Ratio | Dimensions | Notes |
|---------|--------------|------------|-------|
| `blog` | 16:9 | 1200x675 | Featured image, allows text overlay |
| `linkedin` | 1:1 | 1200x1200 | Feed post, square crop |
| `linkedin_article` | 1.91:1 | 1200x628 | Article header |
| `twitter` | 16:9 | 1200x675 | Tweet image |
| `twitter_header` | 3:1 | 1500x500 | Profile header |
| `instagram_feed` | 1:1 | 1080x1080 | Square post |
| `instagram_story` | 9:16 | 1080x1920 | Vertical story |
| `instagram_landscape` | 1.91:1 | 1080x566 | Landscape post |
| `facebook` | 1.91:1 | 1200x630 | Shared post |
| `opengraph` | 1.91:1 | 1200x630 | Link preview |
| `youtube_thumb` | 16:9 | 1280x720 | Video thumbnail |
| `newsletter` | 3:2 | 1200x800 | Email header |

---

## Resize Methods

### Method 1: Smart Crop (Default)
- Crops from center or focal point
- Preserves most important content
- Fast, no regeneration needed

### Method 2: Regenerate with Reference
- Uses source as reference image
- Regenerates at target aspect ratio
- Better for extreme ratio changes (e.g., 16:9 → 9:16)
- Uses `--reference-image` with nano-banana-pro

### Method 3: Canvas Extension
- Extends background to fit new ratio
- Good when subject shouldn't be cropped
- May need inpainting for seamless extension

---

## Workflow Steps

```
INPUT: Source image + target channels
     ↓
[1] ANALYZE: Get source dimensions and focal point
     ↓
[2] PLAN: Determine best resize method per channel
     ↓
[3] EXECUTE: Generate each sized version
     ↓
[4] OUTPUT: All sized images + manifest
```

---

## Example Usage

### Resize for All Channels
```
/image-resize ./featured.png

→ Creates: featured-blog.png, featured-linkedin.png, featured-twitter.png, etc.
```

### Resize for Specific Channels
```
/image-resize ./featured.png --channels "linkedin,twitter,instagram_story"

→ Creates only the specified channel versions
```

### Custom Output Directory
```
/image-resize ./featured.png --output-dir ./social-exports/

→ Saves all versions to the specified directory
```

---

## Output Manifest

```yaml
# Image Resize Manifest
source: ./featured.png
source_dimensions: 1200x800

exports:
  - channel: blog
    file: featured-blog.png
    dimensions: 1200x675
    method: smart_crop

  - channel: linkedin
    file: featured-linkedin.png
    dimensions: 1200x1200
    method: regenerate

  - channel: instagram_story
    file: featured-instagram_story.png
    dimensions: 1080x1920
    method: regenerate
```

---

## Integration with Image Variations

**Typical content workflow:**

```
1. Create featured image
       ↓
2. /image-variations → Generate creative alternatives
       ↓
3. Select best image per use case
       ↓
4. /image-resize → Export each to required sizes
       ↓
5. Distribute across channels
```

---

**This workflow handles the mechanical task of sizing images for different platforms, separate from the creative task of generating variations.**
