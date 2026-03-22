# WordPress Publisher Setup Guide

Complete step-by-step guide to configure InstaWP MCP Server for automated WordPress publishing.

## Prerequisites Checklist

- [ ] WordPress site with admin access
- [ ] Node.js 18+ installed on your machine
- [ ] Claude Desktop application installed
- [ ] PAI system with BrandHTMLConverter skill

## Installation Steps

### Part 1: WordPress Configuration

#### Step 1: Enable REST API (Usually Already Enabled)

1. Log into WordPress admin dashboard
2. Navigate to: **Settings → Permalinks**
3. Ensure permalinks are NOT set to "Plain"
4. Click "Save Changes" if you made changes

**Verify REST API is working:**
```bash
curl https://your-wordpress-site.com/wp-json/
```

You should see JSON response with API information.

#### Step 2: Create Application Password

1. In WordPress admin, go to: **Users → Profile**
2. Scroll down to **"Application Passwords"** section
3. **Application Name:** Enter `Claude MCP Server`
4. Click **"Add New Application Password"**
5. **IMPORTANT:** Copy the generated password immediately (shown only once)
6. Store it securely - you'll need it for configuration

**What you'll copy looks like:**
```
xxxx xxxx xxxx xxxx xxxx xxxx
```

**Format for config (remove spaces):**
```
xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### Step 3: Note Your WordPress Details

You'll need:
```
WordPress URL: https://your-site.com
Username: your_wp_username
Application Password: xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Part 2: MCP Server Configuration

#### Option A: Quick Start with npx (Recommended)

**Easiest method - no installation required.**

1. Create a project directory:
   ```bash
   mkdir ~/wordpress-mcp
   cd ~/wordpress-mcp
   ```

2. Create `.env` file:
   ```bash
   cat > .env << 'EOF'
   WORDPRESS_API_URL=https://your-wordpress-site.com
   WORDPRESS_USERNAME=your_wp_username
   WORDPRESS_PASSWORD=your_application_password_here
   EOF
   ```

3. Test the connection:
   ```bash
   npx -y @instawp/mcp-wp
   ```

#### Option B: Full Installation

**For development or customization:**

1. Clone the repository:
   ```bash
   git clone https://github.com/InstaWP/mcp-wp.git
   cd mcp-wp
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (same as Option A)

4. Build the project:
   ```bash
   npm run build
   ```

5. Test:
   ```bash
   npm start
   ```

### Part 3: Claude Desktop Integration

#### Step 1: Locate Claude Desktop Config File

**macOS:**
```bash
~/Library/Application\ Support/Claude/claude_desktop_config.json
```

**Windows:**
```
%APPDATA%\Claude\claude_desktop_config.json
```

**Linux:**
```
~/.config/Claude/claude_desktop_config.json
```

#### Step 2: Edit Configuration

Open the file in a text editor and add the WordPress MCP server:

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "https://your-wordpress-site.com",
        "WORDPRESS_USERNAME": "your_username",
        "WORDPRESS_PASSWORD": "your_application_password"
      }
    }
  }
}
```

**If you have other MCP servers configured:**

```json
{
  "mcpServers": {
    "existing-server": {
      "command": "...",
      "args": ["..."]
    },
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "https://your-wordpress-site.com",
        "WORDPRESS_USERNAME": "your_username",
        "WORDPRESS_PASSWORD": "your_application_password"
      }
    }
  }
}
```

#### Step 3: Restart Claude Desktop

1. **Quit Claude Desktop completely** (don't just close the window)
   - macOS: Cmd+Q or right-click icon → Quit
   - Windows: Right-click taskbar icon → Exit
   - Linux: Quit from system tray

2. **Reopen Claude Desktop**

3. **Verify MCP Server is Connected:**
   - Look for a small indicator or tool icon
   - Try asking: "List my WordPress posts"
   - If working, you'll see your posts

### Part 4: Test the Integration

#### Test 1: List Content

In Claude Desktop:
```
List my recent WordPress posts
```

**Expected response:**
```
Here are your recent posts:
1. "Post Title" (ID: 123, Status: published)
2. "Another Post" (ID: 124, Status: draft)
...
```

#### Test 2: Get Categories

```
What WordPress categories do I have?
```

**Expected response:**
```
Your WordPress categories:
- AI Strategy (ID: 1)
- Digital Transformation (ID: 2)
- Leadership (ID: 3)
...
```

#### Test 3: Create Draft Post

```
Create a draft WordPress post with title "Test Post" and content "This is a test."
```

**Expected response:**
```
Draft post created successfully!
- Title: Test Post
- ID: 125
- Status: draft
- Edit URL: https://your-site.com/wp-admin/post.php?post=125&action=edit
```

#### Test 4: Verify in WordPress

1. Log into WordPress admin
2. Go to **Posts → All Posts**
3. You should see "Test Post" in draft status
4. Click to edit and verify content
5. Delete the test post when done

## Troubleshooting

### MCP Server Not Appearing in Claude

**Check 1: Config File Syntax**
```bash
# Validate JSON syntax
cat ~/Library/Application\ Support/Claude/claude_desktop_config.json | jq .
```

If you see an error, fix the JSON syntax (missing commas, quotes, brackets).

**Check 2: Node.js Version**
```bash
node --version
# Should be v18.0.0 or higher
```

If lower, update Node.js from https://nodejs.org/

**Check 3: MCP Server Logs**

Look for errors in:
```
~/Library/Logs/Claude/mcp*.log
```

### Authentication Errors

**Error: "REST API authentication failed"**

1. Verify Application Password is correct
2. Test REST API manually:
   ```bash
   curl -u username:application_password \
     https://your-site.com/wp-json/wp/v2/posts?per_page=1
   ```
3. If this fails, regenerate Application Password
4. Check WordPress user has sufficient permissions

**Error: "Invalid username or password"**

1. Double-check username (not email address)
2. Verify you're using Application Password (not regular password)
3. Remove any spaces from Application Password

### Connection Errors

**Error: "Cannot connect to WordPress site"**

1. Verify site URL is correct (include https://)
2. Check site is accessible: `curl https://your-site.com`
3. Verify REST API endpoint: `curl https://your-site.com/wp-json/`
4. Check firewall/security plugins blocking REST API
5. Ensure site has valid SSL certificate (for https)

### Content Publishing Issues

**Posts not appearing:**

1. Check post status (draft vs published)
2. Verify categories are assigned
3. Check WordPress visibility settings
4. Review WordPress error logs

**HTML rendering incorrectly:**

1. Verify theme CSS compatibility
2. Check for conflicting plugins
3. Test with default WordPress theme
4. Review inline styles in generated HTML

## Configuration for PAI

### Update Skill Configuration

Edit `config/wordpress-sites.json`:

```json
{
  "sites": {
    "production": {
      "url": "https://your-actual-site.com",
      "username": "your_actual_username",
      "password": "your_actual_app_password",
      "description": "Main production website",
      "default_author": 1,
      "default_status": "draft"
    }
  },
  "active_site": "production"
}
```

### Test Publishing Workflow

1. **Create test markdown file:**
   ```bash
   cat > ${PAI_DIR}/Scratchpad/blog/drafts/test_post.md << 'EOF'
   # Test Publishing Workflow

   This is a test post to verify the WordPress publishing workflow.

   ## Key Features

   - Markdown to HTML conversion
   - Brand styling applied
   - Automated WordPress publishing

   > **Key Insight:** This workflow connects PAI content generation to WordPress publishing.
   EOF
   ```

2. **In Claude Code, run:**
   ```
   Publish test_post.md to WordPress as draft
   ```

3. **Verify in WordPress:**
   - Check draft posts
   - Review formatting
   - Verify styles applied correctly

4. **If successful, delete test post**

## Security Recommendations

### 1. Protect Credentials

**Never commit credentials to git:**

Add to `.gitignore`:
```
.env
config/wordpress-sites.json
*.log
```

**Use environment variables:**

Instead of hardcoding in config files, reference env vars:
```json
{
  "url": "${WORDPRESS_URL}",
  "username": "${WORDPRESS_USER}",
  "password": "${WORDPRESS_PASSWORD}"
}
```

### 2. Limit WordPress User Permissions

Create a dedicated WordPress user for API publishing:

1. **Users → Add New**
2. **Username:** `api_publisher`
3. **Role:** Editor or Author (not Administrator)
4. **Capabilities needed:**
   - `publish_posts`
   - `edit_posts`
   - `upload_files`
   - `manage_categories`

This limits blast radius if credentials are compromised.

### 3. Use HTTPS Only

**Never use http:// for WordPress API connections.**

Ensures encrypted transmission of credentials and content.

### 4. Rotate Application Passwords

Periodically regenerate Application Passwords:

1. Revoke old password in WordPress
2. Generate new password
3. Update configurations
4. Test connections

### 5. Monitor API Usage

Check WordPress logs for:
- Unusual API activity
- Failed authentication attempts
- Suspicious content changes

## Performance Optimization

### 1. Batch Operations

For multiple posts, use sequential processing:

```javascript
// Good
for (const post of posts) {
  await publishPost(post);
  await delay(2000); // 2 second delay
}

// Bad
await Promise.all(posts.map(publishPost)); // May hit rate limits
```

### 2. Image Optimization

Before uploading to WordPress:

1. Compress images (target < 500KB)
2. Use appropriate dimensions (max 2000px width)
3. Convert to WebP if possible
4. Add descriptive alt text

### 3. HTML Optimization

Generated HTML should be:

1. Minified (remove unnecessary whitespace)
2. Inline CSS only for critical styles
3. External references for fonts, libraries
4. Semantic markup (proper heading hierarchy)

## Advanced Configuration

### Custom Post Types

Publishing to custom post types:

```json
{
  "content_type": "product",
  "title": "Product Name",
  "content": "...",
  "meta": {
    "price": "99.99",
    "sku": "PROD-123"
  }
}
```

### Multiple Sites

Managing multiple WordPress sites:

```json
{
  "sites": {
    "main_blog": { ... },
    "client_site": { ... },
    "personal_site": { ... }
  }
}
```

Switch active site before publishing:

```
Switch WordPress site to client_site
Publish article to WordPress
```

### Scheduled Publishing

Set future publish date:

```json
{
  "status": "future",
  "date": "2026-02-01T10:00:00"
}
```

WordPress will automatically publish at specified time.

## Next Steps

Now that setup is complete:

1. ✅ WordPress MCP Server configured
2. ✅ Claude Desktop integration working
3. ✅ Test post created successfully
4. → Configure BrandHTMLConverter for your brand
5. → Set up category/tag mappings
6. → Create first real blog post
7. → Establish publishing cadence

## Resources

**Official Documentation:**
- [InstaWP WordPress MCP Guide](https://instawp.com/wordpress-mcp/)
- [InstaWP Production Guide](https://instawp.com/how-to-use-mcp-for-wordpress-in-production/)
- [GitHub Repository](https://github.com/InstaWP/mcp-wp)
- [WordPress REST API](https://developer.wordpress.org/rest-api/)

**PAI Skills:**
- BrandHTMLConverter - Markdown to styled HTML
- BlogEditor - Editorial review and quality control
- Art - Featured image generation

**Support:**
- InstaWP Community
- WordPress.org Forums
- GitHub Issues

---

**You're ready to publish!** Start with draft posts, review in WordPress, then publish when satisfied.
