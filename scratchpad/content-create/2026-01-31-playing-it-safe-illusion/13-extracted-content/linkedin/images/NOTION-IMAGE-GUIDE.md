# Adding Images to Notion LinkedIn Post

## Current Status

✅ **Image reference blocks added to Notion post body**

The LinkedIn Authority Post now has placeholder blocks showing where the images should go:
- Image 1: Singapore AI Paradox - Napkin Sketch
- Image 2: Playing It Safe = Failing Slowly - Modern Alchemist

**View post:** https://www.notion.so/3030760eb0cd8147abbac459b990a7a3

---

## Option 1: Manual Upload via Notion UI (Recommended - Fastest)

### Steps:

1. **Open the Notion post** (link above)

2. **Find the image placeholder blocks** (they have 🖼️ icons)

3. **Click the "+" button** or type `/image` at the location

4. **Select "Upload"**

5. **Browse to image locations:**
   - **Napkin Sketch:**
     ```
     /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png
     ```

   - **Modern Alchemist:**
     ```
     /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png
     ```

6. **Upload both images**

7. **Delete the placeholder callout blocks** after uploading actual images

**Time:** 2-3 minutes
**Pros:** Simple, direct, no API issues
**Cons:** Manual process

---

## Option 2: Upload to WordPress First, Then Embed (Automated)

If you have WordPress credentials configured, you can upload the images to WordPress media library first, then embed using the public URLs.

### Prerequisites:

WordPress credentials needed in one of:
- Environment variables: `WP_SITE_URL`, `WP_USERNAME`, `WP_APP_PASSWORD`
- `.claude/.credentials.json` with wordpress section
- MCP WordPress server configuration

### Steps:

```bash
# 1. Upload images to WordPress (if credentials available)
bun run /home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/upload-images-to-wordpress.ts

# 2. Images will automatically embed in Notion post using WordPress URLs
```

**Time:** 30 seconds (automated)
**Pros:** Creates publicly accessible URLs, good for sharing
**Cons:** Requires WordPress credentials

---

## Option 3: Use Image URLs from WordPress Media Library (If Already Uploaded)

If these images are already in WordPress:

1. Go to WordPress Media Library
2. Find the images
3. Copy the direct URLs
4. Use Notion's "Embed link" option

---

## Image Details

### Image 1: Napkin Sketch

- **File:** `singapore-napkin-sketch.png`
- **Size:** 2752x1536 (300 DPI)
- **Style:** Napkin sketch
- **Alt Text:** "Napkin sketch showing the paradox: 'Playing it Safe = Failing Slowly' with Singapore's $1B AI investment as context"
- **Caption:** "Singapore AI Paradox: Playing it Safe = Failing Slowly"

### Image 2: Modern Alchemist

- **File:** `singapore-modern-alchemist-paradox.png`
- **Size:** 1792x1024 (2K, 16:9)
- **Style:** Modern Alchemist
- **Alt Text:** "Modern Alchemist technical illustration showing the paradox. Left: figure wrapped in protective layers. Right: freed figure climbing stairs."
- **Caption:** "The Singapore Paradox - Professional illustration"

---

## Recommended Placement in Post

**Ideal image placement:**

1. **After hook section** (Lines 1-3)
2. **After initial CTA** (Newsletter subscription line)
3. **Before main content starts**

This ensures maximum visibility and engagement.

### Current Structure:

```
Hook (Lines 17-23)
↓
Newsletter CTA (Line 23)
↓
[INSERT IMAGES HERE] ← You are here
↓
Main Content (Lines 25+)
```

---

## Quick Manual Upload Script (Copy-Paste into Notion)

If you want to copy-paste the image paths:

**Napkin Sketch Path:**
```
/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png
```

**Modern Alchemist Path:**
```
/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png
```

---

## Why Two Images?

### Napkin Sketch:
- **Authenticity signal** - "I thought of this on a napkin"
- **Vulnerable positioning** - Shows spontaneous insight
- **Lower barrier** - Feels approachable
- **Use for:** First impression, authentic brainstorm posts

### Modern Alchemist:
- **Professional authority** - Technical precision
- **High credibility** - Intellectual blueprint aesthetic
- **Polished thought leadership** - Silicon Valley meets Leonardo
- **Use for:** Frameworks, strategic concepts, credibility-building

### Strategy:
- **Option A:** Use napkin sketch for LinkedIn (authentic)
- **Option B:** Use Modern Alchemist (professional)
- **Option C:** Show both as before/after evolution of idea

---

## Next Steps

1. ✅ Image reference blocks added to Notion
2. ⏭️ Upload images via Notion UI (Option 1 - Recommended)
3. ⏭️ Delete placeholder callout blocks after upload
4. ⏭️ Add captions if needed
5. ⏭️ Verify image placement and post flow

---

## Troubleshooting

### "File not found" when browsing
- Make sure you're in WSL/Ubuntu file system
- Navigate to `/home/alvis/PAI/...` path shown above

### "Image too large"
- Both images are optimized and should upload fine
- If issues, they can be resized (napkin is 300 DPI, can go to 72 DPI)

### "Can't see placeholder blocks"
- Scroll through the Notion post body
- Look for 🖼️ callout blocks with image paths

---

**Current Status:** ✅ Ready for manual upload (Option 1)
**Time to Complete:** 2-3 minutes
**Recommended:** Upload both images, use whichever resonates more with audience
