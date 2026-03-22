#!/usr/bin/env bun

/**
 * Add image blocks to Notion Images database entry bodies
 * Since we can't use local file:// URLs, we'll add callouts with instructions
 */

import { readFileSync } from "fs";
import { join } from "path";

function loadNotionApiKey(): string {
  const credPath = join(process.env.HOME!, ".claude", ".credentials.json");
  const creds = JSON.parse(readFileSync(credPath, "utf-8"));
  return creds.notion.api_key;
}

async function notionRequest(apiKey: string, endpoint: string, options: RequestInit = {}): Promise<any> {
  const url = `https://api.notion.com/v1${endpoint}`;

  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Notion API error: ${error.message || response.statusText}`);
  }

  return await response.json();
}

async function addImagesToEntries() {
  console.log("🖼️  Adding image blocks to database entries...\n");

  const apiKey = loadNotionApiKey();

  const images = [
    {
      name: "Napkin Sketch",
      id: "3030760e-b0cd-8148-aeac-eaa6246b199c",
      path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-napkin-sketch.png",
      windowsPath: "\\\\wsl.localhost\\Ubuntu\\home\\alvis\\PAI\\scratchpad\\content-create\\2026-01-31-playing-it-safe-illusion\\13-extracted-content\\linkedin\\images\\singapore-napkin-sketch.png"
    },
    {
      name: "Modern Alchemist",
      id: "3030760e-b0cd-810e-8f0d-c5248d6b97d1",
      path: "/home/alvis/PAI/scratchpad/content-create/2026-01-31-playing-it-safe-illusion/13-extracted-content/linkedin/images/singapore-modern-alchemist-paradox.png",
      windowsPath: "\\\\wsl.localhost\\Ubuntu\\home\\alvis\\PAI\\scratchpad\\content-create\\2026-01-31-playing-it-safe-illusion\\13-extracted-content\\linkedin\\images\\singapore-modern-alchemist-paradox.png"
    }
  ];

  for (const image of images) {
    console.log(`📸 Adding to ${image.name}...`);

    const blocks = [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "📎 Image File" } }]
        }
      },
      {
        object: "block",
        type: "callout",
        callout: {
          rich_text: [
            {
              type: "text",
              text: { content: "To add the actual image to this entry, click the \"+\" button below and select \"Image\" → \"Upload\", then browse to the path shown below." }
            }
          ],
          icon: { emoji: "💡" },
          color: "blue_background"
        }
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: "Linux/WSL Path:" } }]
        }
      },
      {
        object: "block",
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: image.path } }],
          language: "plain text"
        }
      },
      {
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: [{ type: "text", text: { content: "Windows File Explorer Path:" } }]
        }
      },
      {
        object: "block",
        type: "code",
        code: {
          rich_text: [{ type: "text", text: { content: image.windowsPath } }],
          language: "plain text"
        }
      },
      {
        object: "block",
        type: "divider",
        divider: {}
      },
      {
        object: "block",
        type: "callout",
        callout: {
          rich_text: [
            {
              type: "text",
              text: { content: "⬇️ Add image here using the \"+\" button or type /image" },
              annotations: { bold: true }
            }
          ],
          icon: { emoji: "⬇️" },
          color: "yellow_background"
        }
      }
    ];

    try {
      await notionRequest(apiKey, `/blocks/${image.id}/children`, {
        method: "PATCH",
        body: JSON.stringify({
          children: blocks
        })
      });

      console.log(`✅ Added blocks to ${image.name}`);
      console.log(`   View: https://www.notion.so/${image.id.replace(/-/g, '')}\n`);

    } catch (error) {
      console.error(`❌ Failed: ${error}\n`);
    }
  }

  console.log("\n🎉 Instructions added to both database entries!");
  console.log("\n📝 Next steps:");
  console.log("   1. Open each database entry in Notion");
  console.log("   2. Scroll to the yellow callout box");
  console.log("   3. Click \"+\" or type /image");
  console.log("   4. Select \"Upload\"");
  console.log("   5. Browse to the Windows path shown above");
  console.log("   6. Upload the image");
}

addImagesToEntries();
