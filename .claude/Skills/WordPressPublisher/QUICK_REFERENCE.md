# WordPress Publisher - Quick Reference

## Common Commands

### Publish Content

```bash
# Single post (draft)
"Publish [filename].md to WordPress as draft"

# Single post (immediate publish)
"Publish [filename].md to WordPress and make it live"

# Batch publish
"Publish all finalized drafts to WordPress"

# Specific category
"Publish [filename].md to WordPress in category 'AI Strategy'"
```

### Update Content

```bash
# Update existing post
"Update WordPress post [ID] with revised version from [filename].md"

# Update by URL
"Update WordPress post at [URL] with new content"

# Update by slug
"Update WordPress post 'amplify-humans' with latest version"
```

### Content Management

```bash
# List posts
"List my recent WordPress posts"
"Show all draft posts in WordPress"

# Get post details
"Show me WordPress post #123"
"Get details for post 'amplify-humans'"

# Delete post
"Delete WordPress post #123"
```

### Categories & Tags

```bash
# List
"Show my WordPress categories"
"List all tags in WordPress"

# Create
"Create WordPress category 'AI Strategy'"
"Add tag 'automation' to WordPress"

# Assign
"Add post #123 to category 'Leadership'"
"Tag post #123 with 'artificial-intelligence'"
```

### Media Operations

```bash
# Upload image
"Upload featured-image.png to WordPress"
"Upload all images in /images/ folder to WordPress"

# List media
"Show recent WordPress media uploads"

# Set featured image
"Set WordPress post #123 featured image to media #456"
```

### Site Management

```bash
# List plugins
"What plugins are installed on WordPress?"

# Activate/deactivate
"Activate WordPress plugin 'yoast-seo'"
"Deactivate WordPress plugin 'akismet'"

# Search plugins
"Search WordPress plugin repository for 'cache'"
```

## MCP Tool Reference

### Content Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `create_content` | Create post/page | Create new post |
| `update_content` | Modify existing | Update post #123 |
| `list_content` | Browse content | List recent posts |
| `get_content` | Get by ID | Show post #123 |
| `delete_content` | Remove content | Delete post #123 |
| `find_content_by_url` | Search by URL | Find post at URL |
| `get_content_by_slug` | Search by slug | Get post 'my-post' |

### Taxonomy Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `list_terms` | View categories/tags | List categories |
| `create_term` | Add new term | Create category |
| `update_term` | Modify term | Update category #5 |
| `delete_term` | Remove term | Delete tag #12 |
| `assign_terms_to_content` | Link terms | Tag post |
| `get_content_terms` | View assigned | Show post tags |

### Media Tools

| Tool | Purpose | Example |
|------|---------|---------|
| `create_media` | Upload file | Upload image |
| `list_media` | Browse uploads | List recent media |
| `update_media` | Modify metadata | Update alt text |
| `delete_media` | Remove file | Delete media #99 |

## Post Status Options

| Status | Description | Use When |
|--------|-------------|----------|
| `draft` | Not published, editable | Initial creation, review needed |
| `publish` | Live on site | Ready for public |
| `pending` | Awaiting review | Submit for approval |
| `private` | Admin-only visible | Internal content |
| `future` | Scheduled publish | Set future date |

## Content Structure

### Minimal Post

```json
{
  "content_type": "post",
  "title": "Post Title",
  "content": "<p>HTML content</p>",
  "status": "draft"
}
```

### Complete Post

```json
{
  "content_type": "post",
  "title": "Complete Post Title",
  "content": "<html>Full HTML content</html>",
  "excerpt": "Brief description for previews",
  "status": "draft",
  "categories": [1, 5],
  "tags": [3, 7, 9],
  "featured_media": 123,
  "date": "2026-01-27T10:00:00",
  "meta": {
    "custom_field": "value"
  }
}
```

## Workflow Steps

### Standard Publishing Flow

1. **Generate** markdown content
2. **Edit** using BlogEditor skill
3. **Convert** to HTML with BrandHTMLConverter
4. **Extract** metadata (title, excerpt, categories, tags)
5. **Upload** featured image if provided
6. **Create** draft post in WordPress
7. **Review** in WordPress admin
8. **Publish** when approved
9. **Archive** source files

### Quick Publish (Skip Review)

1. Generate markdown content
2. Convert to HTML
3. Publish directly (use with caution)

### Update Existing

1. Modify markdown source
2. Convert to HTML
3. Update WordPress post by ID/URL/slug
4. Verify changes

## Troubleshooting Quick Fixes

### MCP Not Responding

```bash
# Restart Claude Desktop
# Check config:
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
```

### Auth Failed

```bash
# Test connection:
curl -u username:app_password https://site.com/wp-json/wp/v2/posts?per_page=1

# Regenerate Application Password in WordPress
```

### Post Not Appearing

1. Check status (draft vs publish)
2. Verify categories assigned
3. Check WordPress visibility settings
4. Clear WordPress cache

### HTML Not Rendering

1. Check theme compatibility
2. Disable conflicting plugins
3. Test with default theme
4. Verify inline CSS

## File Locations

```
PAI Structure:
${PAI_DIR}/Skills/WordPressPublisher/
  ├── SKILL.md
  ├── SETUP_GUIDE.md
  ├── QUICK_REFERENCE.md
  ├── workflows/
  │   └── PublishPost.md
  └── config/
      ├── wordpress-sites.json
      └── default-settings.json

Content Paths:
${PAI_DIR}/Scratchpad/blog/drafts/     - Active drafts
${PAI_DIR}/Scratchpad/blog/html/       - Generated HTML
${PAI_DIR}/History/blog/published/     - Published archive
${PAI_DIR}/History/blog/publishing-log.md - Publishing history
```

## Environment Variables

```bash
# Required
WORDPRESS_API_URL=https://your-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password

# Optional
WORDPRESS_SQL_ENDPOINT=/mcp/v1/query
```

## Common Category IDs

Configure in `config/default-settings.json`:

```json
{
  "categories": {
    "AI Strategy": "ai-strategy",
    "Digital Transformation": "digital-transformation",
    "Leadership": "leadership",
    "Business Process": "business-process",
    "Technology": "technology"
  }
}
```

Get actual IDs by listing categories in WordPress.

## Default Settings

Located: `config/default-settings.json`

Key settings:
- `default_status`: "draft" (safe default)
- `auto_publish`: false (requires approval)
- `archive_after_publish`: true (keeps history)
- `compress_images`: true (optimizes uploads)
- `strip_html_comments`: true (clean output)

## Error Codes

| Error | Cause | Fix |
|-------|-------|-----|
| 401 | Auth failed | Check Application Password |
| 403 | Insufficient permissions | Check user role |
| 404 | Content not found | Verify ID/slug/URL |
| 500 | WordPress error | Check WP error logs |
| Network error | Connection failed | Check site URL, internet |

## Rate Limits

WordPress REST API:
- Default: ~60 requests/minute
- Recommendation: 3 second delay between operations
- Batch operations: Process sequentially

## Best Practices

1. ✅ Always start with `draft` status
2. ✅ Review in WordPress before publishing
3. ✅ Use descriptive titles and excerpts
4. ✅ Assign relevant categories and tags
5. ✅ Add featured images
6. ✅ Test HTML rendering in theme
7. ✅ Archive source files after publishing
8. ✅ Monitor publishing log
9. ✅ Compress images before upload
10. ✅ Use HTTPS only

## Quick Links

- **Setup Guide:** `SETUP_GUIDE.md`
- **Workflow Details:** `workflows/PublishPost.md`
- **Config Template:** `config/wordpress-sites.json.example`
- **GitHub:** https://github.com/InstaWP/mcp-wp
- **InstaWP Guide:** https://instawp.com/wordpress-mcp/

---

**Remember:** Draft first, review second, publish third. Never skip the review step.
