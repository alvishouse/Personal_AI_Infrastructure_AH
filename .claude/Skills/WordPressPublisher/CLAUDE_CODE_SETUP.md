# WordPress MCP Server Setup for Claude Code (CLI)

**Good news:** You can use the WordPress MCP Server directly in Claude Code without needing Claude Desktop!

## Quick Setup for Claude Code

### Step 1: Add WordPress MCP Server

```bash
# Add the WordPress MCP server (stdio transport)
claude mcp add --transport stdio wordpress -- \
  npx -y @instawp/mcp-wp
```

This command:
- Adds a server named "wordpress"
- Uses stdio transport (for local Node.js processes)
- Runs the InstaWP MCP server via npx

### Step 2: Configure Environment Variables

The WordPress MCP server needs your WordPress credentials. You have two options:

#### Option A: Project-Level Configuration (Recommended)

Create `.mcp.json` in your project root:

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

**Security note:** Add `.mcp.json` to `.gitignore` if it contains credentials!

#### Option B: Environment Variables

Set environment variables in your shell:

```bash
# Add to ~/.bashrc or ~/.zshrc
export WORDPRESS_API_URL="https://your-wordpress-site.com"
export WORDPRESS_USERNAME="your_username"
export WORDPRESS_PASSWORD="your_application_password"

# Reload shell
source ~/.bashrc  # or source ~/.zshrc
```

Then add the server without credentials in the command:

```bash
claude mcp add --transport stdio wordpress -- npx -y @instawp/mcp-wp
```

### Step 3: Verify Installation

```bash
# List configured MCP servers
claude mcp list

# Should show:
# wordpress (stdio)
```

### Step 4: Test the Connection

In Claude Code, test the WordPress connection:

```
List my WordPress posts
```

If working, you'll see your posts listed.

## Configuration File Locations

Claude Code uses different configuration files than Claude Desktop:

| Scope | Location | Use Case |
|-------|----------|----------|
| **Project** | `.mcp.json` in project root | Team-shared config (can commit) |
| **Local** | `~/.claude.json` (under project path) | Private project config |
| **User** | `~/.claude.json` (global) | Available across all projects |

## Complete Configuration Format

### Project Configuration (.mcp.json)

```json
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "${WORDPRESS_API_URL}",
        "WORDPRESS_USERNAME": "${WORDPRESS_USERNAME}",
        "WORDPRESS_PASSWORD": "${WORDPRESS_PASSWORD}"
      }
    }
  }
}
```

**Benefits:**
- Uses environment variable expansion
- Keeps credentials out of the config file
- Can safely commit to version control

### User Configuration (~/.claude.json)

For user-level config (available in all projects):

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

**Note:** This makes WordPress tools available in ANY Claude Code project.

## Managing MCP Servers

### List All Servers

```bash
claude mcp list
```

### Get Server Details

```bash
claude mcp get wordpress
```

### Remove Server

```bash
claude mcp remove wordpress
```

### Update Server Configuration

Edit the appropriate config file directly, or remove and re-add:

```bash
claude mcp remove wordpress
claude mcp add --transport stdio wordpress -- npx -y @instawp/mcp-wp
```

## Using WordPress Tools in Claude Code

Once configured, use natural language commands:

```
# List posts
"Show my WordPress posts"

# Create draft
"Create a draft WordPress post titled 'Test Post' with content 'Hello World'"

# List categories
"What WordPress categories do I have?"

# Upload image
"Upload featured-image.png to WordPress"

# Publish content
"Publish blog-post.md to WordPress as draft"
```

All WordPress MCP tools are available as documented in the main skill.

## Troubleshooting

### MCP Server Not Found

**Check 1:** Verify installation
```bash
claude mcp list
```

If "wordpress" doesn't appear, re-add it:
```bash
claude mcp add --transport stdio wordpress -- npx -y @instawp/mcp-wp
```

**Check 2:** Verify Node.js version
```bash
node --version
# Should be v18.0.0 or higher
```

### Authentication Errors

**Check 1:** Test credentials manually
```bash
curl -u username:app_password \
  https://your-site.com/wp-json/wp/v2/posts?per_page=1
```

**Check 2:** Verify environment variables are set
```bash
echo $WORDPRESS_API_URL
echo $WORDPRESS_USERNAME
echo $WORDPRESS_PASSWORD
```

**Check 3:** Verify Application Password format
- Remove spaces from Application Password
- Use the password, not your regular WordPress password

### MCP Tools Not Responding

**Option 1:** Restart Claude Code session

**Option 2:** Check MCP server status
```bash
# In Claude Code
/mcp

# Should show wordpress server as connected
```

**Option 3:** Check logs
```bash
# Claude Code logs location
~/.claude/logs/

# Look for MCP-related errors
cat ~/.claude/logs/mcp-wordpress.log
```

### Environment Variables Not Expanding

If using `${VARIABLE}` syntax in `.mcp.json` and it's not working:

1. Ensure variables are exported in your shell
2. Restart your terminal
3. Verify with: `printenv | grep WORDPRESS`

## Multiple WordPress Sites

Configure multiple sites with different names:

```json
{
  "mcpServers": {
    "wordpress-production": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "https://production-site.com",
        "WORDPRESS_USERNAME": "prod_user",
        "WORDPRESS_PASSWORD": "prod_app_password"
      }
    },
    "wordpress-staging": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "https://staging-site.com",
        "WORDPRESS_USERNAME": "staging_user",
        "WORDPRESS_PASSWORD": "staging_app_password"
      }
    }
  }
}
```

Claude Code will use the appropriate server based on context or you can specify:
```
"List posts from wordpress-staging"
```

## Security Best Practices for Claude Code

### 1. Use Environment Variables

Instead of hardcoding credentials in `.mcp.json`:

```bash
# .env file (add to .gitignore)
WORDPRESS_API_URL=https://your-site.com
WORDPRESS_USERNAME=your_username
WORDPRESS_PASSWORD=your_app_password
```

Load before using Claude Code:
```bash
# Load environment
source .env

# Or use direnv for automatic loading
echo "dotenv" > .envrc
direnv allow
```

### 2. Project vs User Scope

**Use project scope (.mcp.json) for:**
- Team-shared servers
- Non-sensitive configurations
- When using environment variable expansion

**Use user scope (~/.claude.json) for:**
- Personal credentials
- Servers you don't want to share
- Cross-project WordPress access

### 3. Gitignore Configuration

Add to `.gitignore`:
```
.mcp.json
.env
.claude.json
```

### 4. Application Passwords Only

- Never use your main WordPress password
- Create separate Application Passwords for:
  - Production site
  - Staging site
  - Each team member

## Advantages of Claude Code over Claude Desktop

**For this workflow:**

1. **Already in CLI** - You're already using Claude Code
2. **Script integration** - Easier to automate workflows
3. **Version control** - Can commit project config (without credentials)
4. **Programmatic access** - Can call Claude Code from other tools
5. **No GUI required** - Works on headless servers

## Complete Example Workflow

### 1. Setup (One-time)

```bash
# Create project config
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "wordpress": {
      "command": "npx",
      "args": ["-y", "@instawp/mcp-wp"],
      "env": {
        "WORDPRESS_API_URL": "${WORDPRESS_API_URL}",
        "WORDPRESS_USERNAME": "${WORDPRESS_USERNAME}",
        "WORDPRESS_PASSWORD": "${WORDPRESS_PASSWORD}"
      }
    }
  }
}
EOF

# Set environment variables
export WORDPRESS_API_URL="https://your-site.com"
export WORDPRESS_USERNAME="your_user"
export WORDPRESS_PASSWORD="your_app_pass"

# Add to .gitignore
echo ".mcp.json" >> .gitignore
```

### 2. Test Connection

```bash
# In Claude Code
"List my WordPress posts"
```

### 3. Publish Content

```bash
# In Claude Code
"Publish blog-post.md to WordPress as draft"
```

## Integration with PAI Workflows

The WordPressPublisher skill works identically in Claude Code:

1. Generate markdown content
2. Convert to HTML (BrandHTMLConverter)
3. Publish to WordPress (using MCP tools)
4. Review and publish
5. Archive

All commands work the same:
```
"Publish amplify-humans blog post to WordPress"
```

## Comparison: Claude Desktop vs Claude Code

| Feature | Claude Desktop | Claude Code (CLI) |
|---------|----------------|-------------------|
| Config file | `claude_desktop_config.json` | `.mcp.json` or `~/.claude.json` |
| Config location | `~/Library/Application Support/Claude/` | Project root or home dir |
| Environment | GUI app | Command line |
| Best for | Visual work, drafting | Automation, scripting |
| MCP support | Yes | Yes |
| WordPress MCP | ✅ Supported | ✅ Supported |

**Both work equally well for WordPress publishing!**

## Quick Start Commands

```bash
# Add WordPress MCP server
claude mcp add --transport stdio wordpress -- npx -y @instawp/mcp-wp

# Set credentials (in shell)
export WORDPRESS_API_URL="https://your-site.com"
export WORDPRESS_USERNAME="your_user"
export WORDPRESS_PASSWORD="your_app_password"

# Test in Claude Code
echo "List my WordPress posts"

# Verify server
claude mcp list
```

## Next Steps

1. ✅ Add WordPress MCP server to Claude Code
2. ✅ Configure credentials (environment variables)
3. ✅ Test connection
4. → Follow PublishPost workflow
5. → Integrate with BrandHTMLConverter
6. → Start publishing content

---

**You're ready!** The WordPress MCP Server works in Claude Code just like it does in Claude Desktop. Use the same commands and workflows documented in the main skill.
