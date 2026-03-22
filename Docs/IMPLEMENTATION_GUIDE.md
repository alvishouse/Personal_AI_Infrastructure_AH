# Content Pipeline Implementation Guide

## Complete Step-by-Step Plan

This guide covers the full implementation of the PAI + Content Pipeline system on Windows with WSL.

---

## Prerequisites

| Requirement | Notes |
|-------------|-------|
| **WSL 2** | Ubuntu 22.04 or newer recommended |
| **Git** | For cloning PAI |
| **VS Code** | With Remote - WSL extension (optional but recommended) |
| **API Keys** | Anthropic API key (required), Notion token (later) |

---

## Phase 0: WSL + PAI Setup

### Step 1: Prepare WSL Environment

```bash
# Open Windows Terminal or PowerShell, then:
wsl

# Update packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl git unzip
```

### Step 2: Install Bun (PAI's runtime)

```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Reload shell
source ~/.bashrc

# Verify
bun --version
```

### Step 3: Install Claude Code CLI

```bash
# Install via npm (or follow Anthropic's official instructions)
# Check https://claude.ai/code for latest installation method
npm install -g @anthropic-ai/claude-code
```

### Step 4: Clone PAI

```bash
# Clone your forked repository
git clone https://github.com/alvishouse/Personal_AI_Infrastructure_AH.git ~/PAI

# Or clone upstream if starting fresh
# git clone https://github.com/danielmiessler/PAI.git ~/PAI
```

### Step 5: Create Symlink

```bash
# Backup existing .claude if present
[ -d ~/.claude ] && mv ~/.claude ~/.claude.backup

# Create symlink
ln -s ~/PAI/.claude ~/.claude
```

### Step 6: Run Setup Wizard

```bash
~/.claude/Tools/setup/bootstrap.sh
```

The wizard will configure:
- PAI directory path
- Your name/email (from git config)
- AI assistant name
- Color theme

### Step 7: Configure API Keys

```bash
# Copy template
cp ~/.claude/.env.example ~/.claude/.env

# Edit with your keys
nano ~/.claude/.env
```

Add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

### Step 8: Reload Shell & Test

```bash
# Reload environment
source ~/.bashrc

# Start Claude Code
claude

# Test PAI is loaded
"What skills are available?"
```

**Checkpoint:** PAI should load via SessionStart hook and show available skills.

---

## Phase 1: GitHub Foundation

### Step 1: Create Directory Structure

```bash
cd ~/PAI

# Create new directories for the content pipeline
mkdir -p schemas/directus/migrations
mkdir -p schemas/wordpress
mkdir -p scripts
mkdir -p templates
mkdir -p prompts
```

### Step 2: Create Directus Schema Definition

```bash
cat > schemas/directus/schema.yaml << 'EOF'
# Directus Schema Definition
# Apply with: npx directus schema apply ./schema.yaml

version: 1
collections:
  - collection: content
    meta:
      icon: article
      note: "Blog and social content"
    fields:
      - field: id
        type: uuid
        meta:
          interface: input
          readonly: true
        schema:
          is_primary_key: true

      - field: status
        type: string
        meta:
          interface: select-dropdown
          options:
            choices:
              - text: Ready
                value: ready
              - text: Published
                value: published

      - field: title
        type: string
        meta:
          interface: input
          required: true

      - field: slug
        type: string
        meta:
          interface: input

      - field: content_md
        type: text
        meta:
          interface: input-rich-text-md

      - field: content_html
        type: text
        meta:
          interface: input-code
          options:
            language: htmlmixed

      - field: excerpt
        type: text
        meta:
          interface: input-multiline

      - field: seo_title
        type: string
        meta:
          interface: input

      - field: seo_description
        type: text
        meta:
          interface: input-multiline

      - field: linkedin_content
        type: text
        meta:
          interface: input-multiline

      - field: notion_id
        type: string
        meta:
          interface: input
          note: "Links back to Notion source"

      - field: wordpress_id
        type: integer
        meta:
          interface: input

      - field: publish_date
        type: timestamp
        meta:
          interface: datetime

      - field: published_at
        type: timestamp
        meta:
          interface: datetime
          readonly: true

      - field: created_at
        type: timestamp
        meta:
          interface: datetime
          readonly: true
EOF
```

### Step 3: Create Content Templates

```bash
# Blog post template
cat > templates/blog-post.md << 'EOF'
---
title: "{{title}}"
slug: "{{slug}}"
excerpt: "{{excerpt}}"
seo_title: "{{seo_title}}"
seo_description: "{{seo_description}}"
publish_date: {{publish_date}}
---

# {{title}}

{{introduction}}

## {{section_1_heading}}

{{section_1_content}}

## {{section_2_heading}}

{{section_2_content}}

## Key Takeaways

{{takeaways}}

---

*{{call_to_action}}*
EOF

# LinkedIn post template
cat > templates/linkedin-post.md << 'EOF'
{{hook_line}}

{{main_insight}}

Here's what I learned:

{{bullet_points}}

{{call_to_action}}

{{hashtags}}
EOF
```

### Step 4: Create Prompt Catalog

```bash
cat > prompts/content-generation.yaml << 'EOF'
# Content Generation Prompts
# Referenced by PAI ContentFactory skill

blog_generation:
  system: |
    You are a technical content writer specializing in {{domain}}.
    Write in a clear, conversational tone that's accessible to {{audience}}.
    Use concrete examples and avoid jargon unless explained.

  user: |
    Create a blog post about: {{topic}}

    Sources to reference:
    {{sources}}

    Key points to cover:
    {{key_points}}

    Target length: {{word_count}} words
    Call to action: {{cta}}

linkedin_generation:
  system: |
    You are writing LinkedIn posts for a {{role}}.
    Posts should be engaging, professional, and drive discussion.
    Use line breaks for readability. Include 3-5 relevant hashtags.

  user: |
    Create a LinkedIn post summarizing this blog:

    {{blog_content}}

    Key hook: {{hook}}
    Target audience: {{audience}}

image_prompts:
  hero_image: |
    Professional blog header image for article about {{topic}}.
    Style: {{style}}
    Colors: {{brand_colors}}
    Mood: {{mood}}

  social_image: |
    Square social media image (1200x1200) for {{platform}}.
    Include text overlay: "{{headline}}"
    Style: Clean, modern, professional
EOF
```

### Step 5: Commit GitHub Foundation

```bash
git add schemas/ templates/ prompts/
git commit -m "Add GitHub foundation: schemas, templates, prompts

- Directus schema.yaml for content collection
- Blog and LinkedIn post templates
- Content generation prompt catalog"

git push origin claude/document-architecture-jyGJw
```

**Checkpoint:** GitHub now contains the system definitions.

---

## Phase 2: Notion Setup

### Step 1: Create Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Click "New integration"
3. Name: `PAI Content Pipeline`
4. Capabilities: Read content, Update content, Insert content
5. Copy the "Internal Integration Token"

### Step 2: Add Token to PAI Environment

```bash
echo 'NOTION_TOKEN=secret_...' >> ~/.claude/.env
```

### Step 3: Create Content Pipeline Database in Notion

Create a new database with these properties:

| Property | Type | Options |
|----------|------|---------|
| **Title** | Title | — |
| **Status** | Select | Backlog, Ready for AI, In AI, Review, Scheduled, Published |
| **Sources** | URL | Multi-value |
| **AI Brief** | Text | — |
| **Targets** | Multi-select | Blog, LinkedIn, Newsletter |
| **Publish Date** | Date | — |
| **Blog Draft** | Text | — |
| **LinkedIn Draft** | Text | — |
| **Directus ID** | Text | — |
| **WordPress ID** | Number | — |
| **Notes** | Text | — |

### Step 4: Share Database with Integration

1. Open the database in Notion
2. Click "..." menu → "Add connections"
3. Select your "PAI Content Pipeline" integration

### Step 5: Get Database ID

From the database URL:
```
https://notion.so/YOUR_WORKSPACE/DATABASE_ID?v=...
                                 ^^^^^^^^^^^
                                 Copy this part
```

### Step 6: Configure Notion MCP Server

```bash
# Edit MCP configuration
nano ~/.claude/.mcp.json
```

Add Notion server:
```json
{
  "mcpServers": {
    "notion": {
      "command": "npx",
      "args": ["-y", "@notionhq/notion-mcp-server"],
      "env": {
        "NOTION_TOKEN": "${NOTION_TOKEN}"
      }
    }
  }
}
```

### Step 7: Create Notion Views

In Notion, create these views for your database:

| View Name | Type | Filter/Group |
|-----------|------|--------------|
| Pipeline | Kanban | Group by Status |
| Calendar | Calendar | By Publish Date |
| Ready for AI | Table | Status = "Ready for AI" |
| My Reviews | Table | Status = "Review" |

**Checkpoint:** Notion database ready with MCP integration.

---

## Phase 3: PAI ContentFactory Skill

### Step 1: Create Skill Structure

```bash
mkdir -p ~/.claude/Skills/ContentFactory/workflows
mkdir -p ~/.claude/Skills/ContentFactory/tools
```

### Step 2: Create Main Skill File

```bash
cat > ~/.claude/Skills/ContentFactory/SKILL.md << 'EOF'
# ContentFactory Skill

## Purpose
Content pipeline automation: Notion → PAI → Notion → Directus → WordPress/LinkedIn

## Activation
- "Create content from Notion"
- "Process ready ideas"
- "Publish approved content"
- "Generate blog post"

## Commands

| Command | Description |
|---------|-------------|
| `/content ingest` | Pull "Ready for AI" items from Notion |
| `/content generate` | Generate content and return to Notion |
| `/content export` | Export approved items to Directus |
| `/content publish` | Publish from Directus to WordPress |
| `/content distribute` | Post to LinkedIn |

## Workflows

### Ingest (Notion → PAI)
1. Query Notion for Status = "Ready for AI"
2. Extract: title, sources, AI brief, targets
3. Update Notion: Status = "In AI"

### Generate (PAI processing)
1. Scrape source URLs (BrightData skill)
2. Load prompts from `~/PAI/prompts/`
3. Generate blog draft (long-form)
4. Generate LinkedIn draft (short-form)
5. Generate image prompts

### Return to Notion
1. Push drafts back to Notion card
2. Update Status = "Review"
3. Add AI generation notes

### Export to Directus
1. Query Notion for Status = "Approved"
2. Transform to Directus schema
3. POST to Directus REST API
4. Update Notion with Directus ID

### Publish
1. Query Directus for Status = "ready"
2. Transform to WordPress format
3. POST to WordPress REST API
4. Update Directus with WordPress ID

## Dependencies
- Notion MCP server (for database operations)
- BrightData skill (for web scraping)
- Art skill (for image generation)

## Environment Variables
- `NOTION_TOKEN` - Notion API token
- `NOTION_DATABASE_ID` - Content pipeline database ID
- `DIRECTUS_URL` - Directus instance URL
- `DIRECTUS_TOKEN` - Directus API token
- `WORDPRESS_URL` - WordPress site URL
- `WORDPRESS_USER` - WordPress username
- `WORDPRESS_APP_PASSWORD` - WordPress application password
EOF
```

### Step 3: Create Ingest Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/Ingest.md << 'EOF'
# Ingest Workflow

## Purpose
Pull "Ready for AI" items from Notion for processing.

## Steps

1. **Query Notion Database**
   ```
   Use Notion MCP: mcp__notion__query_database
   Filter: Status = "Ready for AI"
   ```

2. **For Each Item:**
   - Extract: Title, Sources, AI Brief, Targets
   - Store in working memory

3. **Update Status in Notion**
   ```
   Use Notion MCP: mcp__notion__update_page
   Set: Status = "In AI"
   ```

4. **Return Summary**
   - Count of items ingested
   - List of titles being processed

## Output
Returns list of content items ready for generation.
EOF
```

### Step 4: Create Generate Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/Generate.md << 'EOF'
# Generate Workflow

## Purpose
Create content from ingested items.

## Steps

1. **For Each Ingested Item:**

2. **Scrape Sources**
   - Use BrightData skill for each source URL
   - Extract main content, key points
   - Summarize source material

3. **Load Prompts**
   - Read `~/PAI/prompts/content-generation.yaml`
   - Select appropriate prompt for content type

4. **Generate Blog Draft**
   - Apply blog_generation prompt
   - Include source insights
   - Follow AI Brief instructions
   - Target word count from brief

5. **Generate LinkedIn Draft**
   - Apply linkedin_generation prompt
   - Create engaging hook
   - Condense to 1300 chars max

6. **Generate Image Prompts**
   - Hero image for blog
   - Social image for LinkedIn
   - Use Art skill if immediate generation requested

## Output
- blog_draft.md
- linkedin_draft.md
- image_prompts.md
EOF
```

### Step 5: Create Return to Notion Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/ReturnToNotion.md << 'EOF'
# Return to Notion Workflow

## Purpose
Push generated content back to Notion for human review.

## Steps

1. **For Each Generated Item:**

2. **Update Notion Page**
   ```
   Use Notion MCP: mcp__notion__update_page

   Properties to update:
   - Blog Draft: [generated content]
   - LinkedIn Draft: [generated content]
   - Notes: "AI generated on [date]. Ready for review."
   - Status: "Review"
   ```

3. **Add Generation Metadata**
   - Sources scraped count
   - Word counts
   - Generation timestamp

## Output
- Count of items returned to Notion
- Links to review
EOF
```

### Step 6: Create Export Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/ExportToDirectus.md << 'EOF'
# Export to Directus Workflow

## Purpose
Push approved content from Notion to Directus canonical storage.

## Prerequisites
- `DIRECTUS_URL` environment variable set
- `DIRECTUS_TOKEN` environment variable set

## Steps

1. **Query Notion**
   ```
   Filter: Status = "Approved" AND Directus ID is empty
   ```

2. **For Each Approved Item:**

3. **Transform to Directus Schema**
   ```json
   {
     "status": "ready",
     "title": "[from Notion]",
     "slug": "[generate from title]",
     "content_md": "[Blog Draft from Notion]",
     "content_html": "[convert md to html]",
     "linkedin_content": "[LinkedIn Draft from Notion]",
     "notion_id": "[Notion page ID]",
     "publish_date": "[from Notion Publish Date]"
   }
   ```

4. **POST to Directus**
   ```bash
   curl -X POST "${DIRECTUS_URL}/items/content" \
     -H "Authorization: Bearer ${DIRECTUS_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '${payload}'
   ```

5. **Update Notion with Directus ID**
   ```
   Use Notion MCP: mcp__notion__update_page
   Set: Directus ID = [returned ID]
   Set: Status = "Scheduled"
   ```

## Output
- Count exported
- Directus IDs created
EOF
```

### Step 7: Commit ContentFactory Skill

```bash
git add ~/.claude/Skills/ContentFactory/
git commit -m "Add ContentFactory skill for content pipeline

- Ingest: Notion → PAI
- Generate: Blog + LinkedIn + image prompts
- ReturnToNotion: Push drafts for review
- ExportToDirectus: Approved content → Directus"

git push
```

**Checkpoint:** PAI ContentFactory skill ready.

---

## Phase 4: Directus + WordPress Setup

### Step 1: Set Up Directus

Option A: **Directus Cloud** (easiest)
1. Sign up at [directus.cloud](https://directus.cloud)
2. Create a project
3. Apply schema from `schemas/directus/schema.yaml`

Option B: **Self-hosted Docker**
```bash
# docker-compose.yml
version: '3'
services:
  directus:
    image: directus/directus:latest
    ports:
      - 8055:8055
    environment:
      KEY: 'your-random-key'
      SECRET: 'your-random-secret'
      DB_CLIENT: 'sqlite3'
      DB_FILENAME: '/directus/database/data.db'
    volumes:
      - ./database:/directus/database
      - ./uploads:/directus/uploads
```

### Step 2: Apply Directus Schema

```bash
# From Directus admin or CLI
npx directus schema apply ~/PAI/schemas/directus/schema.yaml
```

### Step 3: Create Directus API Token

1. Directus Admin → Settings → Access Tokens
2. Create new token with `content` collection access
3. Add to environment:

```bash
echo 'DIRECTUS_URL=https://your-project.directus.cloud' >> ~/.claude/.env
echo 'DIRECTUS_TOKEN=your-token' >> ~/.claude/.env
```

### Step 4: Configure WordPress

1. Install **Application Passwords** plugin (built-in on WP 5.6+)
2. Users → Your Profile → Application Passwords
3. Create new password for "PAI Integration"
4. Add to environment:

```bash
echo 'WORDPRESS_URL=https://yourblog.com' >> ~/.claude/.env
echo 'WORDPRESS_USER=your-username' >> ~/.claude/.env
echo 'WORDPRESS_APP_PASSWORD=xxxx xxxx xxxx xxxx' >> ~/.claude/.env
```

### Step 5: Create Publish Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/Publish.md << 'EOF'
# Publish Workflow

## Purpose
Publish content from Directus to WordPress.

## Prerequisites
- `WORDPRESS_URL`, `WORDPRESS_USER`, `WORDPRESS_APP_PASSWORD`

## Steps

1. **Query Directus**
   ```
   GET ${DIRECTUS_URL}/items/content?filter[status][_eq]=ready
   ```

2. **For Each Ready Item:**

3. **Create WordPress Post**
   ```bash
   curl -X POST "${WORDPRESS_URL}/wp-json/wp/v2/posts" \
     -u "${WORDPRESS_USER}:${WORDPRESS_APP_PASSWORD}" \
     -H "Content-Type: application/json" \
     -d '{
       "title": "[title]",
       "slug": "[slug]",
       "content": "[content_html]",
       "excerpt": "[excerpt]",
       "status": "publish",
       "meta": {
         "_yoast_wpseo_title": "[seo_title]",
         "_yoast_wpseo_metadesc": "[seo_description]"
       }
     }'
   ```

4. **Update Directus**
   ```
   PATCH ${DIRECTUS_URL}/items/content/${id}
   {
     "status": "published",
     "wordpress_id": [returned ID],
     "published_at": "[now]"
   }
   ```

5. **Update Notion** (optional)
   - Set Status = "Published"
   - Add WordPress URL

## Output
- Published URLs
- WordPress post IDs
EOF
```

**Checkpoint:** End-to-end pipeline functional.

---

## Phase 5: LinkedIn Distribution

### Step 1: LinkedIn API Setup

1. Create LinkedIn Developer App at [linkedin.com/developers](https://www.linkedin.com/developers/)
2. Request `w_member_social` permission
3. Generate OAuth 2.0 token

### Step 2: Create Distribute Workflow

```bash
cat > ~/.claude/Skills/ContentFactory/workflows/Distribute.md << 'EOF'
# Distribute Workflow

## Purpose
Post to LinkedIn from published content.

## Steps

1. **Query Directus**
   ```
   Filter: status = "published" AND linkedin_posted is null
   ```

2. **For Each Item:**

3. **Post to LinkedIn**
   ```bash
   curl -X POST "https://api.linkedin.com/v2/ugcPosts" \
     -H "Authorization: Bearer ${LINKEDIN_TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{
       "author": "urn:li:person:${LINKEDIN_PERSON_ID}",
       "lifecycleState": "PUBLISHED",
       "specificContent": {
         "com.linkedin.ugc.ShareContent": {
           "shareCommentary": {
             "text": "[linkedin_content]"
           },
           "shareMediaCategory": "ARTICLE",
           "media": [{
             "status": "READY",
             "originalUrl": "[wordpress_url]"
           }]
         }
       },
       "visibility": {
         "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
       }
     }'
   ```

4. **Update Directus**
   ```
   Set: linkedin_posted = true
   Set: linkedin_post_id = [returned ID]
   ```

## Alternative: Manual Distribution
If API access is limited:
1. Query Directus for linkedin_content
2. Display formatted post for copy/paste
3. Provide link to LinkedIn composer
EOF
```

**Checkpoint:** Full pipeline complete.

---

## Quick Reference: Pipeline Commands

```bash
# Start Claude Code
claude

# Process content pipeline
/content ingest      # Pull from Notion
/content generate    # Create drafts
/content export      # Push to Directus
/content publish     # Push to WordPress
/content distribute  # Post to LinkedIn

# Or run full pipeline
"Process all ready content through the pipeline"
```

---

## Environment Variables Summary

```bash
# ~/.claude/.env
ANTHROPIC_API_KEY=sk-ant-...

# Notion
NOTION_TOKEN=secret_...
NOTION_DATABASE_ID=...

# Directus
DIRECTUS_URL=https://...
DIRECTUS_TOKEN=...

# WordPress
WORDPRESS_URL=https://...
WORDPRESS_USER=...
WORDPRESS_APP_PASSWORD=...

# LinkedIn (optional)
LINKEDIN_TOKEN=...
LINKEDIN_PERSON_ID=...
```

---

## Troubleshooting

### PAI Not Loading in WSL
```bash
# Check symlink
ls -la ~/.claude

# Should show:
# ~/.claude -> ~/PAI/.claude

# If broken, recreate:
rm ~/.claude
ln -s ~/PAI/.claude ~/.claude
```

### Hooks Not Running
```bash
# Verify Bun is installed
which bun

# Verify PAI_DIR is set
cat ~/.claude/settings.json | grep PAI_DIR
```

### Notion MCP Not Working
```bash
# Test Notion token
curl -X GET "https://api.notion.com/v1/databases/${NOTION_DATABASE_ID}" \
  -H "Authorization: Bearer ${NOTION_TOKEN}" \
  -H "Notion-Version: 2022-06-28"
```

---

*This implementation guide follows the architecture defined in `Docs/CONTENT_PIPELINE_ARCHITECTURE.md`.*
