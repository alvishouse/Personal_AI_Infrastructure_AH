---
name: WordPressPublisher
description: |\
  Publish content to WordPress sites via InstaWP MCP Server integration.
  USE WHEN user wants to publish to WordPress OR user mentions "push to blog" OR user asks to "publish article" OR user wants to "post to WordPress" OR user mentions "send to site" OR user wants to "create content" OR user mentions "content workflow" OR user wants to "write a blog post" OR user mentions "cornerstone content" OR user says "continue workflow" OR user says "start content workflow" OR user says "resume workflow" OR user asks about "workflow status".
  Creates posts, pages, manages categories/tags, uploads media, and handles WordPress content operations.
  Includes full Content Creation Workflow for cornerstone content with research, big ideas, headlines, and multi-platform extraction.
  AUTO-ORCHESTRATES workflow steps using custom agents (content-researcher, content-writer, content-editor) without manual agent specification.

# Workflow Routing
workflows:
  - USE WHEN user wants to create new content from scratch: workflows/Content Create Flow/WORKFLOW.md
  - USE WHEN user wants to publish existing content: workflows/PublishPost.md
  - USE WHEN user asks about content creation process: workflows/Content Create Flow/00-quick-reference.md

# Workflow Automation Commands
automation:
  - "continue workflow" → Run orchestrator for current workflow
  - "start content workflow" → Begin new content creation workflow
  - "resume workflow [id]" → Resume specific workflow by ID
  - "workflow status" → Check current step and agent
---

# WordPress Publisher

Publish AI-generated content directly to WordPress using InstaWP's MCP Server.

## Core Workflow

```
Content Generation → HTML Conversion → WordPress Publishing
     (PAI)              (Brand HTML)        (MCP Server)
```

## Prerequisites

1. **WordPress site** with REST API enabled (default in modern WordPress)
2. **Application Password** for API authentication
3. **InstaWP MCP Server** configured in Claude Desktop
4. **Node.js 18+** installed

## Quick Setup

### Step 1: Generate WordPress Application Password

1. Log into WordPress admin
2. Navigate to: `Users → Your Profile`
3. Scroll to "Application Passwords"
4. Enter name: "Claude MCP Server"
5. Click "Add New Application Password"
6. **Copy the generated password** (shown only once)

### Step 2: Configure MCP Server

Create `.env` file in your project directory:

```bash
WORDPRESS_API_URL=https://your-site.com
WORDPRESS_USERNAME=your_wp_username
WORDPRESS_PASSWORD=your_app_password_here
```

### Step 3: Configure Claude Desktop

Edit `~/Library/Application\ Support/Claude/claude_desktop_config.json` (Mac) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "https://your-site.com",
        "WORDPRESS_USERNAME": "your_username",
        "WORDPRESS_PASSWORD": "your_app_password"
      }
    }
  }
}
```

### Step 4: Restart Claude Desktop

The WordPress tools will now be available.

## Available WordPress Tools

### Content Operations
- `create_content` - Create posts, pages, custom post types
- `update_content` - Modify existing content
- `list_content` - Browse content with filters
- `get_content` - Retrieve specific item by ID
- `delete_content` - Remove content
- `find_content_by_url` - Find content from URL
- `get_content_by_slug` - Search by slug

### Taxonomy Management
- `list_terms` - View categories, tags, custom taxonomies
- `create_term` - Add new taxonomy terms
- `assign_terms_to_content` - Link terms to content
- `get_content_terms` - Get assigned terms

### Media Operations
- `create_media` - Upload images, files
- `list_media` - Browse media library
- `update_media` - Modify media metadata

### User Management
- `list_users` - View WordPress users
- `create_user` - Add new users
- `update_user` - Modify user details

### Plugin Management
- `list_plugins` - View installed plugins
- `activate_plugin` - Enable plugins
- `deactivate_plugin` - Disable plugins
- `search_plugins` - Query WordPress.org repository

## Workflow Integration

### Publish Blog Post Workflow

See: `workflows/PublishPost.md`

1. Generate content (using existing PAI skills)
2. Convert to HTML (using BrandHTMLConverter)
3. Extract metadata (title, excerpt, categories, tags)
4. Upload featured image (if provided)
5. Create WordPress post via MCP
6. Assign categories and tags
7. Set post status (draft or publish)

### Content Types

- **Posts** - Blog articles (default)
- **Pages** - Static pages
- **Products** - WooCommerce products (if plugin active)
- **Custom Post Types** - Any registered CPT

## Publishing Strategies

### Strategy 1: Direct HTML (Recommended)

Generate complete HTML with inline styles → Post as WordPress content.

**Pros:**
- Bypasses Elementor complexity
- Full control over styling
- Faster page load
- Version control friendly

**Cons:**
- Requires theme CSS coordination
- Less visual editing in WordPress

### Strategy 2: Elementor Integration

Generate structured content → Use Elementor shortcodes/widgets.

**Pros:**
- Visual editing in WordPress
- Theme integration

**Cons:**
- More complex
- Elementor dependency
- Slower page load

### Strategy 3: Gutenberg Blocks

Generate block-structured HTML → WordPress Gutenberg editor.

**Pros:**
- Native WordPress editor
- Block reusability

**Cons:**
- Requires block HTML format
- Limited styling control

## Content Metadata

### Post Structure

```javascript
{
  title: "Article Title",
  content: "<html>...</html>",  // Your generated HTML
  excerpt: "Brief description",
  status: "draft" | "publish" | "private",
  categories: [1, 5, 12],        // Category IDs
  tags: [3, 7, 9],               // Tag IDs
  featured_media: 123,           // Media ID
  meta: {
    custom_field: "value"
  }
}
```

### Status Options

- `draft` - Save without publishing (recommended for review)
- `publish` - Immediately live
- `private` - Visible only to admins
- `pending` - Awaiting review

## Security Best Practices

1. **Never commit credentials** - Use environment variables
2. **Application Passwords only** - Don't use main WordPress password
3. **HTTPS required** - Ensure site uses SSL
4. **Review before publishing** - Use `draft` status initially
5. **Backup regularly** - Before bulk operations
6. **Limit permissions** - Use accounts with appropriate capabilities

## Troubleshooting

### MCP Server Not Appearing

1. Verify Node.js 18+ installed: `node --version`
2. Check Claude Desktop config file syntax (valid JSON)
3. Ensure `.env` file exists with correct credentials
4. Restart Claude Desktop completely
5. Check MCP server logs

### Authentication Errors

1. Verify Application Password is correct
2. Check WordPress REST API is enabled: `https://your-site.com/wp-json/`
3. Ensure WordPress user has sufficient permissions
4. Try regenerating Application Password

### Content Not Publishing

1. Check post status (draft vs publish)
2. Verify user has `publish_posts` capability
3. Review WordPress error logs
4. Test with minimal content first

## Configuration Files

Configuration stored in:
- `config/wordpress-sites.json` - Multiple site configurations
- `config/default-settings.json` - Publishing defaults

## Logs

MCP operations logged to:
- `~/.claude/logs/wordpress-mcp.log`
- `logs/wordpress-api.log` (in MCP server directory)

## Resources

- [InstaWP WordPress MCP Guide](https://instawp.com/wordpress-mcp/)
- [GitHub Repository](https://github.com/InstaWP/mcp-wp)
- [WordPress REST API Docs](https://developer.wordpress.org/rest-api/)
- [Application Passwords Guide](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/)

## Content Creation Workflow (AUTO-ORCHESTRATED)

For creating new cornerstone content from scratch, use the Content Creation Workflow with **automatic agent orchestration**.

**Location:** `workflows/Content Create Flow/WORKFLOW.md`
**Orchestrator:** `tools/workflow-orchestrator.ts`

### 13-Step Process with Custom Agents

| Phase | Steps | Agent | Model | Color | Auto |
|-------|-------|-------|-------|-------|------|
| **Ideation & Research** | 1 | Human | - | - | ❌ |
|  | 2 | content-researcher | sonnet | CYAN | ✅ |
|  | 3 | content-writer | opus | GREEN | ✅ |
| **Selection & Headlines** | 4 | Human | - | - | ❌ |
|  | 5 | content-writer | opus | GREEN | ✅ |
|  | 6 | Human | - | - | ❌ |
| **Creation & Review** | 7 | content-writer | opus | GREEN | ✅ |
|  | 8 | content-editor | sonnet | ORANGE | ✅ |
|  | 9 | Human | - | - | ❌ |
| **Images & Preview** | 10-11 | Human + Art | - | - | ❌ |
| **Publish & Extract** | 12 | WordPress MCP | - | - | ✅ |
|  | 13 | content-researcher | sonnet | CYAN | ❌ |

### Automated Workflow Commands

**The workflow orchestrator automatically:**
- Detects current step from metadata.json
- Invokes the correct custom agent (researcher/writer/editor)
- Uses the right model (sonnet/opus/haiku)
- Loads appropriate context files
- Updates workflow state after completion
- Transitions to next step or pauses for human input

**User Commands:**

| Command | Action |
|---------|--------|
| `continue workflow` | Auto-run next step for active workflow |
| `start content workflow` | Begin new workflow from Step 1 |
| `resume workflow [id]` | Resume specific workflow by ID |
| `workflow status` | Display current step and agent |

**Example Usage:**
```
User: "continue workflow"
→ Orchestrator reads metadata.json
→ Sees status: "step-2"
→ Launches content-researcher (CYAN, sonnet) automatically
→ Agent conducts deep research
→ Saves to 01-research.md
→ Updates status to "step-3"
→ Ready for next "continue workflow" command
```

### How Orchestration Works

1. **User triggers workflow** (e.g., "continue workflow")
2. **Claude Code invokes orchestrator:**
   ```bash
   bun run ${PAI_DIR}/.claude/Skills/WordPressPublisher/tools/workflow-orchestrator.ts \
     --workflow-id=2026-02-15-dumb-pipe-phenomenon
   ```
3. **Orchestrator:**
   - Reads `metadata.json` for current step
   - Loads step configuration (agent, model, context files)
   - Builds agent-specific prompt
   - Returns Task tool configuration
4. **Claude Code executes Task:**
   - Launches general-purpose agent with correct model
   - Agent follows custom agent methodology (researcher/writer/editor)
   - Agent outputs to workflow directory
5. **Orchestrator updates state:**
   - Marks step complete
   - Advances to next step or pauses
   - User says "continue workflow" to proceed

### Related Files

| File | Purpose |
|------|---------|
| `tools/workflow-orchestrator.ts` | **AUTO-ORCHESTRATION ENGINE** |
| `WORKFLOW.md` | Full 13-step documentation |
| `00-quick-reference.md` | System overview and templates |
| `01-cornerstone-creation-system-prompt.md` | 7-Element Blueprint |
| `02-content-extraction-system-prompt.md` | Platform extraction templates |
| `inner-album-of-greatest-hits.md` | Evergreen topics (Tracks 1-10) |
| `other-topics.md` | Non-evergreen topic queue |
| `content-image-references.md` | Image sizes, styles, manifest template |
| `icp-mid-market-squeezed.md` | Target audience profile |
| `business-offer-profile.md` | Offer context |
| `alvis-house-voice-style-guide.md` | Voice and tone guide |

### Custom Agent Definitions

The orchestrator uses three custom agents defined in `${PAI_DIR}/.claude/Agents/`:

| Agent | File | Color | Model | Purpose |
|-------|------|-------|-------|---------|
| **content-researcher** | ContentResearcher.md | CYAN | sonnet | Deep research (100+ points), case studies, statistics |
| **content-writer** | ContentWriter.md | GREEN | opus | Big ideas, headlines, cornerstone posts |
| **content-editor** | ContentEditor.md | ORANGE | sonnet | Review against checklist, voice, ICP alignment |

**No manual agent specification needed** - orchestrator handles everything automatically!

---

## Next Steps

1. Complete MCP Server setup (see above)
2. Test with simple post creation
3. Configure publishing workflow (see `workflows/PublishPost.md`)
4. Integrate with BrandHTMLConverter
5. Set up automated publishing pipeline

---

**Remember:** Always review content before publishing. Use `draft` status for initial posts, then publish after verification.
