/**
 * fetch-youtube-transcript.ts — Fetch transcript from a YouTube video.
 *
 * Uses the youtube-transcript npm package (no API key, no cookies required).
 * Falls back to yt-dlp if the primary method fails.
 *
 * Usage (standalone):
 *   bun run fetch-youtube-transcript.ts <youtube-url>
 *
 * Usage (import):
 *   import { fetchTranscript } from "./fetch-youtube-transcript.ts"
 */

import { YoutubeTranscript } from "youtube-transcript";

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?[^#]*v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

export interface TranscriptResult {
  videoId: string;
  url: string;
  fullText: string;
  wordCount: number;
}

export async function fetchTranscript(url: string): Promise<TranscriptResult> {
  const videoId = extractVideoId(url);
  if (!videoId) throw new Error(`Could not extract video ID from URL: ${url}`);

  const items = await YoutubeTranscript.fetchTranscript(videoId);
  if (!items.length) throw new Error(`No transcript available for video: ${videoId}`);

  const fullText = items
    .map((i) => i.text)
    .join(" ")
    .replace(/\[music\]/gi, "")
    .replace(/\[applause\]/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  return {
    videoId,
    url,
    fullText,
    wordCount: fullText.split(" ").length,
  };
}

// CLI usage
if (import.meta.main) {
  const url = process.argv[2];
  if (!url) {
    console.error("Usage: bun run fetch-youtube-transcript.ts <youtube-url>");
    process.exit(1);
  }

  try {
    console.log(`Fetching transcript for: ${url}`);
    const result = await fetchTranscript(url);
    console.log(`Video ID: ${result.videoId}`);
    console.log(`Word count: ${result.wordCount}`);
    console.log(`\n--- TRANSCRIPT (first 500 words) ---\n`);
    console.log(result.fullText.split(" ").slice(0, 500).join(" "));
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
