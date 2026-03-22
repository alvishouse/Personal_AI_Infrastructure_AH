# Elementor CSS Setup - Step-by-Step Checklist

**Goal:** Add BrandHTMLConverter styles to WordPress so all aesthetic elements work automatically.

---

## ✅ Step-by-Step Checklist

### □ Step 1: Copy CSS to Clipboard

```bash
# Read the CSS file
cat /home/alvis/temp_test_files/brand-html-converter_extracted/brand-html-converter/assets/brand-styles.css
```

**Or copy from:** `/home/alvis/temp_test_files/brand-html-converter_extracted/brand-html-converter/assets/brand-styles.css`

**What you're copying:** 713 lines of CSS (color variables, callouts, stat highlights, pull quotes, etc.)

---

### □ Step 2: Log into WordPress Admin

**URL:** `https://alvishouse.io/wp-admin`

**Credentials:**
- Username: `alvishousepoompow@gmail.com`
- Password: [Your WordPress password]

---

### □ Step 3: Navigate to Elementor Custom Code

**Two ways to get there:**

**Method A (Sidebar):**
1. Look at left sidebar
2. Find **"Elementor"** (blue icon)
3. Click **"Custom Code"**

**Method B (Top Bar):**
1. Hover over **"Elementor"** in top bar
2. Click **"Settings"**
3. Click **"Custom Code"** tab

**What you'll see:** A screen titled "Custom Code" with an "Add New" button

---

### □ Step 4: Create New CSS Snippet

**Click:** "Add New" button (top right)

**What you'll see:** A form with several fields

---

### □ Step 5: Fill Out the Form

**Title:**
```
BrandHTMLConverter Styles
```

**Code Type:** Select **"CSS"** from dropdown
- Options: HTML, CSS, JavaScript
- Choose: **CSS**

**Location:** Select **"Body - End"** from dropdown
- Options: Header, Body - Start, Body - End, Footer
- Choose: **Body - End** (loads after content)

**Display Conditions:**

**Click "Add Condition" if not already visible**

Then:
- **Include/Exclude:** Leave as **"Include"**
- **Where:** Select **"Entire Site"** from dropdown

**Alternative options for "Where":**
- **Entire Site** - applies everywhere (recommended)
- **Posts** - applies only to blog posts
- **Singular → Post** - applies only to single posts
- **Singular → Strategy** - applies only to Strategy category posts

**Recommended:** Choose **"Posts"** to only affect blog content

---

### □ Step 6: Add Google Fonts

In the **Code Editor** box, paste THIS FIRST:

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');
```

**CRITICAL:** This MUST be the first line (before everything else)

---

### □ Step 7: Paste Brand Styles CSS

**Below the Google Fonts import**, paste the entire contents of `brand-styles.css`

**Your code editor should look like:**

```css
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700&family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

/* ============================================
   BRAND COLOR SYSTEM
   ============================================ */
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

/* ... [rest of 713 lines] ... */
```

**Total lines:** ~720 (1 font import + 713 CSS lines)

---

### □ Step 8: Set Status to Active

**Look for:** Status toggle switch

**Ensure:** Toggle is ON (blue/green) showing **"Active"**

**If it says "Inactive":** Click the toggle to activate

---

### □ Step 9: Save Changes

**Click:** "Save Changes" button (top right or bottom right)

**What happens:** WordPress saves the CSS snippet

**Look for:** Success message (usually green banner at top)

---

### □ Step 10: Clear Elementor Cache

**Navigate to:** Elementor → Tools

**Or:**
1. Sidebar → Elementor
2. Click "Tools"

**On the Tools screen:**

1. Find section: **"Regenerate CSS & Data"**
2. Click button: **"Regenerate Files & Data"**
3. Wait for success message

**Why:** This clears cached CSS so your new styles load immediately

---

### □ Step 11: Test CSS Loading

**Method 1: Check Source Code**

1. Open any post on your site (e.g., post #467)
2. Right-click → **"View Page Source"** (or Ctrl+U)
3. Search (Ctrl+F) for: `--ink: #3b546b`
4. **If found:** ✓ CSS is loading

**Method 2: Browser Inspector**

1. Open any post on your site
2. Right-click → **"Inspect"** (or F12)
3. Go to **"Elements"** or **"Inspector"** tab
4. Search for `<style>` tags containing `.callout` or `--ink`
5. **If found:** ✓ CSS is loading

---

### □ Step 12: Test Aesthetic Elements

**Post test content to WordPress:**

```bash
python3 << 'EOF'
import requests
from requests.auth import HTTPBasicAuth

test_html = """
<h2>Test: BrandHTMLConverter Aesthetic Elements</h2>

<div class="callout mechanism">
    <div class="label">Core Insight</div>
    <p><strong>This is a callout box.</strong></p>
    <p>If you see this with a paper background (#ece6d9) and left border (ink color #3b546b), CSS is working!</p>
</div>

<div class="stat-highlight">
    <div class="stat-number">100%</div>
    <div class="stat-label">This stat should show a large number on the left with description on right.</div>
</div>

<div class="pull-quote">
    This pull quote should be centered, italic, with top and bottom borders in ink color.
</div>

<blockquote>
    <p>This blockquote should have paper background and left border.</p>
    <cite>— Citation should be smaller and muted color</cite>
</blockquote>
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
print(f"✓ Test content posted")
print(f"Preview: {result['link']}")
print("\nCheck if elements are styled:")
print("  1. Callout has paper background with left border")
print("  2. Stat shows large number on left")
print("  3. Pull quote is centered with borders")
print("  4. Blockquote has paper background")

EOF
```

**Then:**

1. Visit: `https://alvishouse.io/?p=467`
2. Check if all 4 elements are styled correctly

**If YES:** ✓ CSS setup complete! Proceed with Elementor template.

**If NO:** See Troubleshooting section below.

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] CSS snippet appears in Elementor → Custom Code list
- [ ] Status shows "Active" (green/blue toggle)
- [ ] CSS appears in page source code (`--ink: #3b546b` found)
- [ ] Test callout box has paper background and left border
- [ ] Test stat highlight shows large number on left
- [ ] Test pull quote is centered with borders
- [ ] Test blockquote has paper background

**All checked?** ✓ You're ready to set up the Elementor Single Post template!

---

## 🚨 Troubleshooting

### Issue: "Custom Code" menu not visible

**Possible causes:**
- Elementor Pro not installed
- Feature disabled

**Solutions:**

**Option 1: Check Elementor version**
- Go to: Plugins → Installed Plugins
- Find: Elementor Pro
- If not installed: Custom Code requires Elementor Pro

**Option 2: Use Theme Customizer instead**
1. Go to: **Appearance → Customize**
2. Find: **"Additional CSS"** panel (usually near bottom)
3. Click to open
4. Paste: Google Fonts import + brand-styles.css
5. Click: **"Publish"**

---

### Issue: CSS not applying (elements unstyled)

**Check 1: Is CSS loading?**
- View page source (Ctrl+U)
- Search for `--ink: #3b546b`
- If NOT found → CSS isn't loading

**Fix:** Check Display Conditions in Custom Code snippet

**Check 2: Is CSS being overridden?**
- Right-click element → Inspect
- Look at "Styles" panel in DevTools
- See if CSS is crossed out (overridden)

**Fix:** Add `!important` to styles that are overridden:

```css
.callout {
    background: var(--paper) !important;
}
```

**Check 3: Cache issue?**
- Clear cache: Elementor → Tools → Regenerate CSS
- Hard refresh browser: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)

---

### Issue: Fonts not loading

**Check:** Google Fonts import is FIRST line

**Wrong order:**
```css
:root { --ink: #3b546b; }
@import url('...');  /* ← TOO LATE */
```

**Correct order:**
```css
@import url('...');  /* ← MUST BE FIRST */
:root { --ink: #3b546b; }
```

**Fix:** Move `@import` to be the very first line in the code editor.

---

### Issue: CSS snippet saves but doesn't appear on site

**Check:** Display Conditions

**Wrong:**
- Include: Entire Site
- **Exclude**: Posts ← This cancels it out!

**Correct:**
- Include: Posts (or Entire Site)
- No exclusions

**Fix:** Edit snippet → Check Display Conditions → Remove any exclusions

---

## 🎯 Quick Summary

**What you're doing:**
Adding BrandHTMLConverter CSS to WordPress so aesthetic elements (callouts, stats, pull quotes, etc.) work automatically.

**Where to add it:**
Elementor → Custom Code → Add New → CSS → Body - End → Posts (or Entire Site)

**What to paste:**
1. Google Fonts import (FIRST)
2. All 713 lines from brand-styles.css

**How to test:**
Post test content to #467, check if elements are styled.

**Result:**
All future posts automatically have aesthetic element styling without any additional CSS.

---

## 📋 Next Steps After CSS Setup

Once CSS is working:

1. **Set up Elementor Single Post template** (TITLE_FORMAT_SETUP_CHECKLIST.md)
2. **Configure BrandHTMLConverter for WordPress output** (BRANDHTML_WORDPRESS_INTEGRATION.md)
3. **Test full publishing workflow** (convert markdown → post to WordPress → preview)
4. **Delete test post #467** once production workflow is verified

---

**Estimated time:** 10-15 minutes

**Difficulty:** Easy (just copy/paste and clicking)

**After this:** You never need to think about CSS again - it just works!
