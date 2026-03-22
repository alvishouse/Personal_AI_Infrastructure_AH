/**
 * notion-queue.ts — Create / update entries in the Notion Engagement Queue DB.
 */

const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";

function notionHeaders(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  };
}

export type EntryType = "Watched Post" | "Own Post Comment";

export interface QueueEntryInput {
  entryName: string;
  type: EntryType;
  account: string;
  linkedinUrl: string;
  excerpt: string;
  detectedAt: string; // ISO string
}

export async function createEngagementEntry(
  apiKey: string,
  databaseId: string,
  entry: QueueEntryInput
): Promise<string | null> {
  const body = {
    parent: { database_id: databaseId },
    properties: {
      "Entry Name": {
        title: [{ text: { content: entry.entryName } }],
      },
      Type: {
        select: { name: entry.type },
      },
      Account: {
        rich_text: [{ text: { content: entry.account } }],
      },
      "LinkedIn URL": {
        url: entry.linkedinUrl,
      },
      Excerpt: {
        rich_text: [{ text: { content: entry.excerpt.slice(0, 2000) } }],
      },
      "Detected At": {
        date: { start: entry.detectedAt },
      },
      Status: {
        status: { name: "To Engage" },
      },
    },
  };

  try {
    const resp = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: notionHeaders(apiKey),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[notion-queue] Failed to create entry: ${resp.status} ${err}`);
      return null;
    }

    const data = await resp.json() as { id: string };
    console.log(`[notion-queue] Created entry "${entry.entryName}" → ${data.id}`);
    return data.id;
  } catch (err) {
    console.error("[notion-queue] Request failed:", err);
    return null;
  }
}

export async function updateReplyOptions(
  apiKey: string,
  pageId: string,
  replyOptions: string
): Promise<boolean> {
  const body = {
    properties: {
      "Reply Options": {
        rich_text: [{ text: { content: replyOptions.slice(0, 2000) } }],
      },
    },
  };

  try {
    const resp = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
      method: "PATCH",
      headers: notionHeaders(apiKey),
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[notion-queue] Failed to update reply options: ${resp.status} ${err}`);
      return false;
    }

    console.log(`[notion-queue] Updated reply options for page ${pageId}`);
    return true;
  } catch (err) {
    console.error("[notion-queue] Request failed:", err);
    return false;
  }
}

export async function getPageById(
  apiKey: string,
  pageId: string
): Promise<Record<string, unknown> | null> {
  try {
    const resp = await fetch(`${NOTION_API_BASE}/pages/${pageId}`, {
      headers: notionHeaders(apiKey),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      console.error(`[notion-queue] Failed to fetch page ${pageId}: ${resp.status}`);
      return null;
    }

    return await resp.json() as Record<string, unknown>;
  } catch (err) {
    console.error("[notion-queue] Request failed:", err);
    return null;
  }
}
