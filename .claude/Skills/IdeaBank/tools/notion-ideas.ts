/**
 * notion-ideas.ts — Notion Idea Bank database operations.
 *
 * Creates entries in the Idea Bank database with full scoring data.
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

export type IdeaSource = "Manual" | "YouTube" | "Podcast" | "Article" | "Observation";
export type IdeaStatus = "Captured" | "In Progress" | "Used" | "Archived";
export type IdeaTier = "🔥 Hot" | "♨️ Warm" | "❄️ Cold";

export interface IdeaBankEntry {
  name: string;
  rawInput: string;
  source: IdeaSource;
  youtubeUrl?: string;
  transcriptSummary?: string;
  addendum?: string;
  scores: {
    icpAngle?: string;
    audienceRelevance: number;
    businessAlignment: number;
    timeliness: number;
    differentiation: number;
    extractionPotential: number;
    totalScore: number;
    tier: IdeaTier;
    scoringNotes: string;
    trackAlignment: string;
  };
}

export async function createIdeaEntry(
  apiKey: string,
  databaseId: string,
  entry: IdeaBankEntry
): Promise<string | null> {
  const properties: Record<string, unknown> = {
    Name: {
      title: [{ text: { content: entry.name } }],
    },
    Source: {
      select: { name: entry.source },
    },
    "Raw Input": {
      rich_text: [{ text: { content: entry.rawInput.slice(0, 2000) } }],
    },
    "Audience Relevance": { number: entry.scores.audienceRelevance },
    "Business Alignment": { number: entry.scores.businessAlignment },
    Timeliness: { number: entry.scores.timeliness },
    Differentiation: { number: entry.scores.differentiation },
    "Extraction Potential": { number: entry.scores.extractionPotential },
    Tier: {
      select: { name: entry.scores.tier },
    },
    "ICP Angle": {
      rich_text: [{ text: { content: (entry.scores.icpAngle ?? "").slice(0, 2000) } }],
    },
    "Scoring Notes": {
      rich_text: [{ text: { content: entry.scores.scoringNotes.slice(0, 2000) } }],
    },
    "Track Alignment": {
      rich_text: [{ text: { content: entry.scores.trackAlignment } }],
    },
    Status: {
      select: { name: "Captured" },
    },
    "Created Date": {
      date: { start: new Date().toISOString() },
    },
  };

  if (entry.youtubeUrl) {
    properties["YouTube URL"] = { url: entry.youtubeUrl };
  }

  if (entry.transcriptSummary) {
    properties["Transcript Summary"] = {
      rich_text: [{ text: { content: entry.transcriptSummary.slice(0, 2000) } }],
    };
  }

  if (entry.addendum) {
    properties["Addendum"] = {
      rich_text: [{ text: { content: entry.addendum.slice(0, 2000) } }],
    };
  }

  try {
    const resp = await fetch(`${NOTION_API_BASE}/pages`, {
      method: "POST",
      headers: notionHeaders(apiKey),
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties,
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!resp.ok) {
      const err = await resp.text();
      console.error(`[notion-ideas] Failed to create entry: ${resp.status} ${err}`);
      return null;
    }

    const data = await resp.json() as { id: string; url: string };
    console.log(`[notion-ideas] Created idea "${entry.name}" → ${data.id}`);
    return data.id;
  } catch (err) {
    console.error("[notion-ideas] Request failed:", err);
    return null;
  }
}
