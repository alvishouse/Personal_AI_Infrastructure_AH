#!/usr/bin/env bun

/**
 * Content Workflow Notion Sync Utility
 *
 * Manages bidirectional sync between PAI content workflow and Notion databases.
 * Implements DRY principle for images and supports graceful degradation.
 *
 * Database IDs (from setup):
 * - Content Workflows: collection://a359475b-326e-4ebe-9a4a-b9ea7115c5db
 * - Content Images: collection://e5168f8d-8d75-46b1-9d33-902a8d973651
 * - Content: collection://3030760e-b0cd-811b-8525-000b50abf80b
 */

import { existsSync, readFileSync, writeFileSync } from "fs";
import { join } from "path";

// Types for Notion sync operations
export interface WorkflowMetadata {
  workflow_id: string;
  topic: string;
  big_idea: string;
  magic_mechanism: string;
  status: "Research" | "Drafting" | "Review" | "Images" | "Publishing" | "Complete" | "Archived";
  current_step: string;
  wordpress_url?: string;
  wordpress_post_id?: number;
  campaign_start?: string;
  campaign_end?: string;
  local_directory: string;
}

export interface ImageMetadata {
  image_name: string;
  image_id: string;
  file_name: string;
  file_path: string;
  image_type: "Featured" | "Inline" | "Extraction" | "Social";
  model: "flux-pro" | "flux-1.1-pro" | "flux-dev" | "flux-schnell" | "ulart-v1";
  style: "Modern Alchemist" | "Da Vinci" | "Napkin" | "Photorealistic" | "Diagram";
  prompt: string;
  aspect_ratio: "16:9" | "1:1" | "4:3" | "9:16";
  resolution: string;
  wordpress_media_id?: number;
  wordpress_url?: string;
  alt_text?: string;
  tags?: string[];
  status: "Generated" | "Approved" | "Uploaded" | "Published";
  workflow_notion_id?: string;
}

export interface ContentMetadata {
  content_name: string;
  content_type: "Cornerstone Blog" | "LinkedIn Post" | "Newsletter" | "Email";
  platform: string;
  linkedin_format?: "Authority Post" | "Framework Article" | "Mythbuster" | "Story" | "Credibility" | "Proof" | "Listicle" | "Engagement";
  word_count?: number;
  engagement_score?: number;
  posting_priority?: number;
  hook_type?: "Bold Statement" | "Question" | "Statistic" | "Story" | "Contrarian";
  funnel_position?: "Awareness" | "Consideration" | "Decision";
  estimated_read_time?: number;
  local_file_path: string;
  metadata_yaml?: string;
  strategic_notes?: string;
  publish_date?: string;
  status: "Idea" | "In Progress" | "Scheduled" | "Published";
  workflow_notion_id: string;
  image_notion_ids?: string[];
  featured_image_notion_id?: string;
}

export interface FrontmatterMetadata {
  notion_id?: string;
  notion_url?: string;
  last_synced?: string;
  sync_status?: "synced" | "out_of_sync" | "error";
}

/**
 * Convert Linux/WSL path to Windows-compatible file:// URL for Notion
 *
 * Input:  /home/alvis/PAI/scratchpad/content-create/...
 * Output: file://wsl.localhost/Ubuntu/home/alvis/PAI/scratchpad/content-create/...
 */
function linuxPathToWindowsFileUrl(linuxPath: string): string {
  // Remove leading slash and convert to Windows WSL format
  const pathWithoutLeadingSlash = linuxPath.replace(/^\//, "");

  // Construct Windows WSL URL
  // Using wsl.localhost format (works on Windows 11 and modern Windows 10)
  return `file://wsl.localhost/Ubuntu/${pathWithoutLeadingSlash}`;
}

/**
 * Core Notion sync class
 */
export class ContentWorkflowNotionSync {
  private notionApiKey: string;
  private notionApiUrl = "https://api.notion.com/v1";
  private notionVersion = "2022-06-28";

  // Database IDs (from Notion URLs)
  private readonly WORKFLOWS_DB = "48790378c5aa4cae96510439f0a5f5e8";
  private readonly IMAGES_DB = "2733021756a1447d84a7143e2e9e97dd";
  private readonly CONTENT_DB = "3030760eb0cd81c5874be6f7e9637807";

  constructor(apiKey?: string) {
    // Try to get API key from environment or credentials file
    this.notionApiKey = apiKey || this.loadNotionApiKey();
  }

  /**
   * Load Notion API key from credentials file or MCP config
   */
  private loadNotionApiKey(): string {
    // Try environment variable first
    if (process.env.NOTION_API_KEY) {
      return process.env.NOTION_API_KEY;
    }

    // Try MCP config
    const mcpPath = join(process.env.HOME!, ".claude", "mcpServers.json");
    if (existsSync(mcpPath)) {
      try {
        const mcpConfig = JSON.parse(readFileSync(mcpPath, "utf-8"));
        if (mcpConfig.mcpServers?.notion?.env?.NOTION_API_KEY) {
          return mcpConfig.mcpServers.notion.env.NOTION_API_KEY;
        }
      } catch (error) {
        // Fall through to credentials file
      }
    }

    // Try credentials file
    const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
    if (existsSync(credPath)) {
      try {
        const creds = JSON.parse(readFileSync(credPath, "utf-8"));
        if (creds.notion?.api_key) {
          return creds.notion.api_key;
        }
      } catch (error) {
        // Fall through
      }
    }

    throw new Error("Notion API key not found. Please set NOTION_API_KEY env var, add to ~/.claude/mcpServers.json, or ~/.claude/.credentials.json");
  }

  /**
   * Make Notion API request with error handling and retry logic
   */
  private async notionRequest(
    endpoint: string,
    options: RequestInit = {},
    retries = 3
  ): Promise<any> {
    const url = `${this.notionApiUrl}${endpoint}`;

    const headers = {
      "Authorization": `Bearer ${this.notionApiKey}`,
      "Notion-Version": this.notionVersion,
      "Content-Type": "application/json",
      ...options.headers,
    };

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(url, { ...options, headers });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`Notion API error: ${error.message || response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        if (attempt === retries - 1) throw error;

        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
      }
    }
  }

  /**
   * Create workflow entry in Notion
   */
  async createWorkflow(metadata: WorkflowMetadata): Promise<string> {
    console.log(`📝 Creating Notion workflow: ${metadata.workflow_id}`);

    try {
      const response = await this.notionRequest("/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { type: "database_id", database_id: this.WORKFLOWS_DB },
          properties: {
            "Workflow ID": {
              title: [{ text: { content: metadata.workflow_id } }]
            },
            "Topic": {
              rich_text: [{ text: { content: metadata.topic || "" } }]
            },
            "Big Idea": {
              rich_text: [{ text: { content: metadata.big_idea || "" } }]
            },
            "Magic Mechanism": {
              rich_text: [{ text: { content: metadata.magic_mechanism || "" } }]
            },
            "Status": {
              select: { name: metadata.status }
            },
            "Current Step": {
              select: { name: metadata.current_step }
            },
            "WordPress URL": metadata.wordpress_url ? {
              url: metadata.wordpress_url
            } : undefined,
            "WordPress Post ID": metadata.wordpress_post_id ? {
              number: metadata.wordpress_post_id
            } : undefined,
            "Local Directory": {
              url: linuxPathToWindowsFileUrl(metadata.local_directory)
            },
            ...(metadata.campaign_start && {
              "Campaign Start": {
                date: { start: metadata.campaign_start }
              }
            }),
            ...(metadata.campaign_end && {
              "Campaign End": {
                date: { start: metadata.campaign_end }
              }
            })
          }
        })
      });

      console.log(`✅ Workflow created: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error(`❌ Failed to create workflow: ${error}`);
      throw error;
    }
  }

  /**
   * Create image entry in Notion
   */
  async createImage(metadata: ImageMetadata): Promise<string> {
    console.log(`🖼️  Creating Notion image: ${metadata.image_name}`);

    try {
      const response = await this.notionRequest("/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { type: "database_id", database_id: this.IMAGES_DB },
          properties: {
            "Image Name": {
              title: [{ text: { content: metadata.image_name } }]
            },
            "Image ID": {
              rich_text: [{ text: { content: metadata.image_id } }]
            },
            "File Name": {
              rich_text: [{ text: { content: metadata.file_name } }]
            },
            "File Path": {
              url: linuxPathToWindowsFileUrl(metadata.file_path)
            },
            "Image Type": {
              select: { name: metadata.image_type }
            },
            "Model": {
              select: { name: metadata.model }
            },
            "Style": {
              select: { name: metadata.style }
            },
            "Prompt": {
              rich_text: [{ text: { content: metadata.prompt.substring(0, 2000) } }]
            },
            "Aspect Ratio": {
              select: { name: metadata.aspect_ratio }
            },
            "Resolution": {
              rich_text: [{ text: { content: metadata.resolution } }]
            },
            "Status": {
              select: { name: metadata.status }
            },
            ...(metadata.wordpress_media_id && {
              "WordPress Media ID": { number: metadata.wordpress_media_id }
            }),
            ...(metadata.wordpress_url && {
              "WordPress URL": { url: metadata.wordpress_url }
            }),
            ...(metadata.alt_text && {
              "Alt Text": {
                rich_text: [{ text: { content: metadata.alt_text } }]
              }
            }),
            ...(metadata.tags && {
              "Tags": {
                multi_select: metadata.tags.map(tag => ({ name: tag }))
              }
            }),
            ...(metadata.workflow_notion_id && {
              "Workflow": {
                relation: [{ id: metadata.workflow_notion_id }]
              }
            })
          }
        })
      });

      console.log(`✅ Image created: ${response.id}`);
      return response.id;
    } catch (error) {
      console.error(`❌ Failed to create image: ${error}`);
      throw error;
    }
  }

  /**
   * Create content entry in Notion
   */
  async createContent(metadata: ContentMetadata): Promise<{ id: string; url: string }> {
    console.log(`📄 Creating Notion content: ${metadata.content_name}`);

    try {
      const response = await this.notionRequest("/pages", {
        method: "POST",
        body: JSON.stringify({
          parent: { type: "database_id", database_id: this.CONTENT_DB },
          properties: {
            "Content Name": {
              title: [{ text: { content: metadata.content_name } }]
            },
            "Content Type": {
              select: { name: metadata.content_type }
            },
            "Platform": {
              select: { name: metadata.platform }
            },
            "Status": {
              status: { name: metadata.status }
            },
            "Local File Path": {
              url: linuxPathToWindowsFileUrl(metadata.local_file_path)
            },
            "Workflow": {
              relation: [{ id: metadata.workflow_notion_id }]
            },
            ...(metadata.linkedin_format && {
              "LinkedIn Format": { select: { name: metadata.linkedin_format } }
            }),
            ...(metadata.word_count && {
              "Word Count": { number: metadata.word_count }
            }),
            ...(metadata.engagement_score && {
              "Engagement Score": { number: metadata.engagement_score }
            }),
            ...(metadata.posting_priority && {
              "Posting Priority": { number: metadata.posting_priority }
            }),
            ...(metadata.hook_type && {
              "Hook Type": { select: { name: metadata.hook_type } }
            }),
            ...(metadata.funnel_position && {
              "Funnel Position": { select: { name: metadata.funnel_position } }
            }),
            ...(metadata.estimated_read_time && {
              "Estimated Read Time": { number: metadata.estimated_read_time }
            }),
            ...(metadata.metadata_yaml && {
              "Metadata YAML": {
                rich_text: [{ text: { content: metadata.metadata_yaml.substring(0, 2000) } }]
              }
            }),
            ...(metadata.strategic_notes && {
              "Strategic Notes": {
                rich_text: [{ text: { content: metadata.strategic_notes.substring(0, 2000) } }]
              }
            }),
            ...(metadata.publish_date && {
              "Publish Date": {
                date: { start: metadata.publish_date }
              }
            }),
            ...(metadata.image_notion_ids && {
              "Images": {
                relation: metadata.image_notion_ids.map(id => ({ id }))
              }
            })
          }
        })
      });

      console.log(`✅ Content created: ${response.id}`);

      // Update source file frontmatter
      await this.updateFileFrontmatter(metadata.local_file_path, {
        notion_id: response.id,
        notion_url: response.url,
        last_synced: new Date().toISOString(),
        sync_status: "synced"
      });

      return { id: response.id, url: response.url };
    } catch (error) {
      console.error(`❌ Failed to create content: ${error}`);
      throw error;
    }
  }

  /**
   * Update workflow status
   */
  async updateWorkflowStatus(workflowNotionId: string, step: string, status?: string): Promise<void> {
    console.log(`🔄 Updating workflow status: ${step}`);

    try {
      await this.notionRequest(`/pages/${workflowNotionId}`, {
        method: "PATCH",
        body: JSON.stringify({
          properties: {
            "Current Step": {
              select: { name: step }
            },
            ...(status && {
              "Status": { select: { name: status } }
            })
          }
        })
      });

      console.log(`✅ Workflow status updated`);
    } catch (error) {
      console.error(`❌ Failed to update workflow status: ${error}`);
      // Non-critical error - don't throw
    }
  }

  /**
   * Link image to content (bi-directional relation)
   */
  async linkImageToContent(imageNotionId: string, contentNotionId: string): Promise<void> {
    console.log(`🔗 Linking image to content`);

    try {
      // Get current content relations
      const contentPage = await this.notionRequest(`/pages/${contentNotionId}`);
      const currentImages = contentPage.properties.Images?.relation || [];

      // Add image to content's Images relation
      await this.notionRequest(`/pages/${contentNotionId}`, {
        method: "PATCH",
        body: JSON.stringify({
          properties: {
            "Images": {
              relation: [...currentImages, { id: imageNotionId }]
            }
          }
        })
      });

      console.log(`✅ Image linked to content`);
    } catch (error) {
      console.error(`❌ Failed to link image to content: ${error}`);
      // Non-critical error - don't throw
    }
  }

  /**
   * Update file frontmatter with Notion metadata
   */
  async updateFileFrontmatter(filePath: string, metadata: FrontmatterMetadata): Promise<void> {
    if (!existsSync(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      return;
    }

    try {
      const content = readFileSync(filePath, "utf-8");

      // Parse existing frontmatter
      const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

      let frontmatter: Record<string, any> = {};
      let body = content;

      if (frontmatterMatch) {
        // Parse existing YAML frontmatter
        const yamlLines = frontmatterMatch[1].split("\n");
        yamlLines.forEach(line => {
          const match = line.match(/^(\w+):\s*(.+)$/);
          if (match) {
            frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, "");
          }
        });
        body = frontmatterMatch[2];
      }

      // Update frontmatter
      frontmatter = { ...frontmatter, ...metadata };

      // Regenerate YAML
      const yamlLines = Object.entries(frontmatter).map(
        ([key, value]) => `${key}: "${value}"`
      );

      const newContent = `---\n${yamlLines.join("\n")}\n---\n${body}`;

      writeFileSync(filePath, newContent, "utf-8");
      console.log(`✅ Updated frontmatter: ${filePath}`);
    } catch (error) {
      console.error(`❌ Failed to update frontmatter: ${error}`);
    }
  }

  /**
   * Check if workflow exists in Notion
   */
  async workflowExists(workflowId: string): Promise<string | null> {
    try {
      const response = await this.notionRequest(`/databases/${this.WORKFLOWS_DB}/query`, {
        method: "POST",
        body: JSON.stringify({
          filter: {
            property: "Workflow ID",
            title: {
              equals: workflowId
            }
          }
        })
      });

      if (response.results && response.results.length > 0) {
        return response.results[0].id;
      }

      return null;
    } catch (error) {
      console.error(`❌ Failed to check workflow existence: ${error}`);
      return null;
    }
  }

  /**
   * Parse markdown file into frontmatter and body
   */
  private parseMarkdownFile(filePath: string): { frontmatter: Record<string, any>; body: string; strategicNotes: string } {
    if (!existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const content = readFileSync(filePath, "utf-8");

    // Parse frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      throw new Error(`No frontmatter found in ${filePath}`);
    }

    const frontmatter: Record<string, any> = {};
    const yamlLines = frontmatterMatch[1].split("\n");
    yamlLines.forEach(line => {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        frontmatter[match[1]] = match[2].replace(/^["']|["']$/g, "");
      }
    });

    const bodyContent = frontmatterMatch[2].trim();

    // Split strategic notes from body
    const strategicNotesMatch = bodyContent.match(/---\nSTRATEGIC NOTES:\n([\s\S]+)$/);
    const strategicNotes = strategicNotesMatch ? strategicNotesMatch[1].trim() : "";
    const body = strategicNotesMatch ? bodyContent.replace(/---\nSTRATEGIC NOTES:\n[\s\S]+$/, "").trim() : bodyContent;

    return { frontmatter, body, strategicNotes };
  }

  /**
   * Generate Notion-formatted content body from PAI markdown file
   */
  private generateLinkedInBody(data: {
    body: string;
    strategicNotes: string;
    frontmatter: Record<string, any>;
    filePath: string;
  }): string {
    const { body, strategicNotes, frontmatter, filePath } = data;

    // Build metadata section
    const metadataLines = [
      frontmatter.format_type ? `**Format:** ${frontmatter.format_type}` : null,
      frontmatter.funnel_position ? `**Funnel Position:** ${frontmatter.funnel_position}` : null,
      frontmatter.hook_type ? `**Hook Type:** ${frontmatter.hook_type}` : null,
      frontmatter.word_count ? `**Word Count:** ${frontmatter.word_count} words` : null,
      frontmatter.estimated_read_time ? `**Read Time:** ${frontmatter.estimated_read_time}` : null,
      frontmatter.engagement_potential ? `**Engagement Potential:** ${frontmatter.engagement_potential}` : null,
      frontmatter.posting_order ? `**Posting Order:** #${frontmatter.posting_order}` : null,
    ].filter(Boolean);

    // Convert Linux path to Windows WSL path
    const wslPath = filePath.replace(/^\/home\/([^/]+)\//, "\\\\wsl$\\Ubuntu\\home\\$1\\");
    const relPath = filePath.replace(/^\/home\/[^/]+\/PAI\//, "");

    // Construct full body
    return `# 📝 Post Content

${body}

---

## 📊 Metadata

${metadataLines.join("\n")}

---

## 🎯 Strategic Notes

${strategicNotes || "No strategic notes"}

---

## 🔗 Source

**PAI File (Relative):** \`${relPath}\`
**Windows Path:** \`${wslPath}\`
**Linux Path:** \`${filePath}\`

**Last Synced:** ${new Date().toISOString().split("T")[0]}
**Sync Status:** ✅ Synced from PAI

**💡 To Open in Windows Explorer:**
Copy the Windows Path above and paste into Explorer address bar`;
  }

  /**
   * Update Notion page body with content from PAI markdown file
   */
  async syncContentBody(filePath: string): Promise<void> {
    console.log(`📤 Syncing content body: ${filePath}`);

    try {
      // Parse markdown file
      const { frontmatter, body, strategicNotes } = this.parseMarkdownFile(filePath);

      // Check if notion_id exists
      if (!frontmatter.notion_id) {
        throw new Error(`No notion_id in frontmatter for ${filePath}. Run initial sync first.`);
      }

      const notionId = frontmatter.notion_id;

      // Generate Notion body content
      const notionBody = this.generateLinkedInBody({
        body,
        strategicNotes,
        frontmatter,
        filePath
      });

      // Update Notion page with blocks API
      // First, we need to clear existing content
      const page = await this.notionRequest(`/pages/${notionId}`);

      // Get all existing blocks
      const blocksResponse = await this.notionRequest(`/blocks/${notionId}/children`);
      const existingBlocks = blocksResponse.results || [];

      // Delete existing blocks (in batches)
      for (const block of existingBlocks) {
        try {
          await this.notionRequest(`/blocks/${block.id}`, {
            method: "DELETE"
          });
        } catch (error) {
          console.warn(`⚠️  Could not delete block ${block.id}: ${error}`);
        }
      }

      // Convert markdown to Notion blocks
      const blocks = this.markdownToNotionBlocks(notionBody);

      // Notion API limits: 100 blocks per request, so batch them
      const BLOCKS_PER_BATCH = 100;
      for (let i = 0; i < blocks.length; i += BLOCKS_PER_BATCH) {
        const batch = blocks.slice(i, i + BLOCKS_PER_BATCH);

        await this.notionRequest(`/blocks/${notionId}/children`, {
          method: "PATCH",
          body: JSON.stringify({
            children: batch
          })
        });

        // Small delay between batches to avoid rate limits
        if (i + BLOCKS_PER_BATCH < blocks.length) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }

      // Update frontmatter
      await this.updateFileFrontmatter(filePath, {
        last_synced: new Date().toISOString(),
        sync_status: "synced"
      });

      console.log(`✅ Body synced successfully`);
    } catch (error) {
      console.error(`❌ Failed to sync content body: ${error}`);
      throw error;
    }
  }

  /**
   * Convert markdown to Notion blocks (simplified)
   */
  private markdownToNotionBlocks(markdown: string): any[] {
    const blocks: any[] = [];
    const lines = markdown.split("\n");

    let i = 0;
    while (i < lines.length) {
      const line = lines[i];

      // Heading 1
      if (line.startsWith("# ")) {
        blocks.push({
          object: "block",
          type: "heading_1",
          heading_1: {
            rich_text: [{ type: "text", text: { content: line.replace(/^# /, "") } }]
          }
        });
        i++;
        continue;
      }

      // Heading 2
      if (line.startsWith("## ")) {
        blocks.push({
          object: "block",
          type: "heading_2",
          heading_2: {
            rich_text: [{ type: "text", text: { content: line.replace(/^## /, "") } }]
          }
        });
        i++;
        continue;
      }

      // Divider
      if (line === "---") {
        blocks.push({
          object: "block",
          type: "divider",
          divider: {}
        });
        i++;
        continue;
      }

      // Bullet point
      if (line.startsWith("→ ") || line.startsWith("- ")) {
        blocks.push({
          object: "block",
          type: "bulleted_list_item",
          bulleted_list_item: {
            rich_text: [{ type: "text", text: { content: line.replace(/^[→-] /, "") } }]
          }
        });
        i++;
        continue;
      }

      // Code block (inline code with backticks)
      if (line.startsWith("`") && line.endsWith("`")) {
        blocks.push({
          object: "block",
          type: "code",
          code: {
            rich_text: [{ type: "text", text: { content: line.replace(/^`|`$/g, "") } }],
            language: "plain text"
          }
        });
        i++;
        continue;
      }

      // Paragraph (collect multi-line paragraphs)
      if (line.trim() !== "") {
        let paragraph = line;
        while (i + 1 < lines.length && lines[i + 1].trim() !== "" && !lines[i + 1].match(/^(#|##|---|→|-|`)/)) {
          i++;
          paragraph += "\n" + lines[i];
        }

        // Parse bold and italic
        const richText = this.parseMarkdownFormatting(paragraph);

        blocks.push({
          object: "block",
          type: "paragraph",
          paragraph: {
            rich_text: richText
          }
        });
      }

      i++;
    }

    return blocks;
  }

  /**
   * Parse markdown formatting (bold, italic) into Notion rich text
   */
  private parseMarkdownFormatting(text: string): any[] {
    const richText: any[] = [];

    // Simple regex-based parsing (not perfect but works for most cases)
    const segments = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/);

    segments.forEach(segment => {
      if (segment.startsWith("**") && segment.endsWith("**")) {
        // Bold
        richText.push({
          type: "text",
          text: { content: segment.replace(/\*\*/g, "") },
          annotations: { bold: true }
        });
      } else if (segment.startsWith("*") && segment.endsWith("*")) {
        // Italic
        richText.push({
          type: "text",
          text: { content: segment.replace(/\*/g, "") },
          annotations: { italic: true }
        });
      } else if (segment.trim() !== "") {
        // Plain text
        richText.push({
          type: "text",
          text: { content: segment }
        });
      }
    });

    return richText.length > 0 ? richText : [{ type: "text", text: { content: text } }];
  }

  /**
   * Batch sync all LinkedIn posts in a directory
   */
  async batchSyncLinkedInBodies(directory: string): Promise<void> {
    console.log(`\n🚀 Starting batch sync for LinkedIn posts in: ${directory}\n`);

    const postsDir = join(directory, "posts");

    if (!existsSync(postsDir)) {
      throw new Error(`Posts directory not found: ${postsDir}`);
    }

    // Get all markdown files
    const fs = await import("fs/promises");
    const files = (await fs.readdir(postsDir)).filter(f => f.endsWith(".md"));

    console.log(`Found ${files.length} LinkedIn posts to sync\n`);

    let success = 0;
    let failed = 0;

    for (const file of files) {
      const filePath = join(postsDir, file);

      try {
        await this.syncContentBody(filePath);
        success++;
      } catch (error) {
        console.error(`❌ Failed to sync ${file}: ${error}`);
        failed++;
      }
    }

    console.log(`\n✅ Batch sync complete: ${success} succeeded, ${failed} failed\n`);
  }
}

// Export singleton instance
export const notionSync = new ContentWorkflowNotionSync();
