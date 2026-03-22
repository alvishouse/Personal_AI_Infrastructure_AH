# Publish Post Workflow

Automated workflow for publishing blog content from PAI to WordPress.

## Workflow Overview

```
Markdown Blog Post
       ↓
[BrandHTMLConverter] → Styled HTML
       ↓
[Metadata Extraction] → Title, Excerpt, Categories, Tags
       ↓
[Featured Image Processing] → Upload to WordPress
       ↓
[WordPress MCP] → Create Post (draft)
       ↓
[Review] → User verification
       ↓
[Publish] → Set status to published
```

## Step-by-Step Process

### Step 1: Prepare Content

**Input:** Markdown blog post file

**Actions:**
1. Read the markdown source file
2. Extract front matter if present (title, excerpt, categories, tags, featured image)
3. Validate content structure

**Output:** Content data object

### Step 2: Convert to HTML

**Tool:** BrandHTMLConverter skill

**Actions:**
1. Analyze markdown for aesthetic opportunities
2. Create visual elements (callouts, stats, pull quotes, frameworks, case studies)
3. Apply brand styling (ink/rust/slate/paper color system)
4. Generate complete HTML with inline styles

**Output:** Publication-ready HTML file

### Step 3: Extract Metadata

**Actions:**
1. Parse markdown front matter or H1 for title
2. Extract first paragraph or meta description for excerpt
3. Identify category keywords from content
4. Generate or extract tag list
5. Locate featured image path if specified

**Metadata Structure:**
```json
{
  "title": "Article Title from H1 or Front Matter",
  "excerpt": "First compelling paragraph or specified excerpt",
  "categories": ["AI Strategy", "Digital Transformation"],
  "tags": ["artificial intelligence", "automation", "business strategy"],
  "featured_image": "/path/to/image.png",
  "status": "draft",
  "author": "Your Name"
}
```

### Step 4: Process Featured Image

**If featured image provided:**

1. Check if image exists locally
2. Upload via `create_media` MCP tool:
   ```
   create_media(
     file: image_data,
     title: "Featured Image Title",
     alt_text: "Descriptive alt text",
     caption: "Optional caption"
   )
   ```
3. Capture returned media ID

**Output:** WordPress media ID

### Step 5: Map Categories and Tags

**Category Mapping:**

1. List existing WordPress categories:
   ```
   list_terms(taxonomy: "category")
   ```
2. Match content categories to WordPress category IDs
3. Create new categories if needed:
   ```
   create_term(
     taxonomy: "category",
     name: "New Category",
     slug: "new-category",
     description: "Category description"
   )
   ```

**Tag Mapping:**

1. List existing tags:
   ```
   list_terms(taxonomy: "post_tag")
   ```
2. Match or create tags similarly

**Output:** Arrays of category IDs and tag IDs

### Step 6: Create WordPress Post

**MCP Tool:** `create_content`

**Parameters:**
```json
{
  "content_type": "post",
  "title": "Your Article Title",
  "content": "<complete HTML from Step 2>",
  "excerpt": "Compelling first paragraph",
  "status": "draft",
  "categories": [1, 5, 12],
  "tags": [3, 7, 9, 14],
  "featured_media": 123,
  "meta": {
    "custom_field_key": "value if needed"
  }
}
```

**Output:** WordPress post ID and URL

### Step 7: Review Draft

**Actions:**
1. Display WordPress edit URL to user
2. Log post details (ID, title, URL)
3. Prompt user for verification

**User Options:**
- View draft in WordPress
- Request modifications
- Approve for publishing

### Step 8: Publish Post

**If approved:**

**MCP Tool:** `update_content`

```json
{
  "content_type": "post",
  "id": post_id,
  "status": "publish"
}
```

**Output:** Published post URL

### Step 9: Cleanup and Logging

**Actions:**
1. Move markdown source to archive: `${PAI_DIR}/History/blog/published/`
2. Save HTML version: `${PAI_DIR}/History/blog/html/`
3. Log publishing details:
   ```
   ${PAI_DIR}/History/blog/publishing-log.md
   ```
4. Update content inventory

## Usage Examples

### Example 1: Publish Single Post

```
User: "Publish the amplify humans blog post to WordPress"

PAI:
1. Reads /Scratchpad/blog/drafts/Blog_LF_StopDeployingAI.md
2. Converts to HTML using BrandHTMLConverter
3. Extracts: "Stop Deploying AI. Start Amplifying Humans."
4. Maps categories: "AI Strategy", "Leadership"
5. Creates WordPress draft post
6. Returns: "Draft created: https://yoursite.com/wp-admin/post.php?post=123&action=edit"
7. Awaits approval
8. On approval: Publishes and archives
```

### Example 2: Batch Publish

```
User: "Publish all reviewed blog posts in the drafts folder"

PAI:
1. Lists all .md files in /Scratchpad/blog/drafts/
2. Filters for files marked as reviewed
3. Processes each sequentially
4. Creates drafts for all
5. Reports: "Created 5 draft posts. Review URLs: [list]"
6. Awaits bulk approval
7. Publishes approved posts
```

### Example 3: Update Existing Post

```
User: "Update the WordPress post for amplify humans article with new version"

PAI:
1. Finds existing post via find_content_by_url or slug
2. Reads updated markdown version
3. Converts to HTML
4. Updates WordPress post content
5. Maintains same categories, tags, featured image
6. Reports: "Post updated: [URL]"
```

## Error Handling

### Missing Featured Image

**If image path invalid or missing:**
- Log warning
- Proceed without featured image
- Notify user to add manually

### Category/Tag Not Found

**If category doesn't exist:**
- Create new category automatically
- Log creation
- Proceed with new category ID

### Authentication Failure

**If WordPress auth fails:**
- Display clear error message
- Check Application Password validity
- Verify site URL and credentials
- Halt workflow

### Content Too Large

**If content exceeds limits:**
- WordPress typically handles up to 64KB
- If larger, suggest splitting into series
- Or reduce HTML verbosity

## Customization Options

### Publishing Defaults

Configure in `config/default-settings.json`:

```json
{
  "default_status": "draft",
  "default_author": 1,
  "default_categories": [1],
  "auto_publish": false,
  "archive_after_publish": true,
  "notify_on_publish": true
}
```

### Content Transformations

Optional preprocessing:

1. **Strip comments** - Remove HTML comments before publishing
2. **Compress images** - Optimize featured images before upload
3. **Add tracking** - Insert analytics tags
4. **SEO optimization** - Add meta descriptions, schema markup

### Multi-Site Publishing

For multiple WordPress sites:

```json
{
  "sites": {
    "production": {
      "url": "https://main-site.com",
      "username": "user1",
      "password": "app_pass_1"
    },
    "staging": {
      "url": "https://staging-site.com",
      "username": "user2",
      "password": "app_pass_2"
    }
  }
}
```

Select target site at publish time.

## Integration with Existing Workflows

### With BlogEditor Skill

```
1. Draft content in markdown
2. Run BlogEditor FullEdit workflow
3. If approved (95+/100), proceed to publishing
4. If needs revision, iterate
5. Once finalized, trigger PublishPost workflow
```

### With Art Skill

```
1. Generate featured image using Art skill
2. Save to /Scratchpad/blog/images/
3. Reference in markdown front matter
4. PublishPost workflow auto-uploads to WordPress
```

### With Research Workflows

```
1. Research topic using research agents
2. Generate draft from research
3. Edit and refine
4. Convert to HTML
5. Publish to WordPress
```

## Performance Considerations

### Batch Operations

- Process posts sequentially (not parallel) to avoid rate limits
- Add 2-3 second delay between operations
- WordPress REST API typically handles 60 requests/minute

### Large Content

- HTML with inline styles can be large
- Consider minification for very long posts
- WordPress has no hard limit but practical limit ~100KB

### Media Uploads

- Compress images before upload
- Typical limit: 2MB per image (server dependent)
- Upload featured image first, get ID, then create post

## Monitoring and Logs

### Publishing Log Format

```markdown
## 2026-01-27 09:30:45

**Post:** Stop Deploying AI. Start Amplifying Humans.
**WordPress ID:** 123
**Status:** published
**URL:** https://yoursite.com/stop-deploying-ai-start-amplifying-humans/
**Categories:** AI Strategy, Leadership
**Tags:** artificial intelligence, automation, capability amplification
**Featured Image:** Modern Alchemist style diagram (Media ID: 98)
**Source:** /Scratchpad/blog/drafts/Blog_LF_StopDeployingAI.md
**Archived to:** /History/blog/published/2026-01-27_StopDeployingAI.md

---
```

### Success Metrics

Track in publishing log:
- Total posts published
- Average time from draft to published
- Error rate
- Category distribution
- Publishing cadence

## Command Reference

### Quick Commands

```bash
# Publish single post (draft status)
"Publish [filename] to WordPress as draft"

# Publish and immediately go live
"Publish [filename] to WordPress and make it live"

# Update existing post
"Update WordPress post [ID or URL] with revised version from [filename]"

# Batch publish
"Publish all finalized drafts to WordPress"

# Create custom post type
"Create product post for [topic] in WordPress"
```

## Next Steps

After setting up this workflow:

1. Test with simple post first
2. Verify HTML rendering in WordPress theme
3. Adjust brand styles if needed for theme compatibility
4. Configure automatic archiving
5. Set up publishing schedule if desired

---

**Pro Tip:** Always start with `draft` status. Review in WordPress before publishing. This prevents accidental publication of unformatted content.
