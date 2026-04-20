/**
 * fetch-youtube-transcript.ts — Fetch transcript from a YouTube video using yt-dlp.
 *
 * Uses the locally installed yt-dlp CLI (no API key required, no npm package).
 * Downloads auto-generated VTT subtitles to a temp file, parses to plain text.
 *
 * Usage (standalone):
 *   bun run fetch-youtube-transcript.ts <youtube-url>
 *
 * Usage (import):
 *   import { fetchTranscript } from "./fetch-youtube-transcript.ts"
 */

import { join } from "path";
import { randomBytes } from "crypto";
import { unlink } from "fs/promises";

const TMP_DIR = "/tmp";

export function extractVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];
  for (const pat of patterns) {
    const m = url.match(pat);
    if (m) return m[1];
  }
  return null;
}

/** Parse a VTT subtitle file into plain text, deduplicating overlapping cues. */
function parseVtt(vttContent: string): string {
  const lines = vttContent.split("\n");
  const seen = new Set<string>();
  const texts: string[] = [];

  let inCue = false;
  for (const line of lines) {
    const trimmed = line.trim();

    // Skip header, timestamps, and empty lines
    if (!trimmed || trimmed.startsWith("WEBVTT") || trimmed.startsWith("Kind:") ||
        trimmed.startsWith("Language:") || trimmed.includes("-->") || /^\d+$/.test(trimmed)) {
      if (trimmed.includes("-->")) inCue = true;
      continue;
    }

    if (inCue && trimmed) {
      // Strip HTML tags (e.g., <c>, </c>, <00:00:01.000>)
      const clean = trimmed
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .trim();

      if (clean && !seen.has(clean)) {
        seen.add(clean);
        texts.push(clean);
      }
    }

    if (!trimmed) inCue = false;
  }

  return texts.join(" ").replace(/\s+/g, " ").trim();
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

  const sessionId = randomBytes(8).toString("hex");
  const outputTemplate = join(TMP_DIR, `yt_${sessionId}_%(id)s`);
  const expectedVtt = join(TMP_DIR, `yt_${sessionId}_${videoId}.en.vtt`);

  // Run yt-dlp to fetch English auto-generated subtitles only
  const proc = Bun.spawn(
    [
      "yt-dlp",
      "--write-auto-subs",
      "--skip-download",
      "--sub-lang", "en",
      "--sub-format", "vtt",
      "--output", outputTemplate,
      "--quiet",
      "--no-warnings",
      url,
    ],
    { stderr: "pipe", stdout: "pipe" }
  );

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const errText = await new Response(proc.stderr).text();
    throw new Error(`yt-dlp failed (exit ${exitCode}): ${errText.slice(0, 500)}`);
  }

  // Check if the VTT file was created
  const vttFile = Bun.file(expectedVtt);
  const exists = await vttFile.exists();

  if (!exists) {
    // Try to find any .vtt file created by yt-dlp (language may differ)
    const globProc = Bun.spawn(
      ["find", TMP_DIR, "-name", `yt_${sessionId}_*.vtt`, "-maxdepth", "1"],
      { stdout: "pipe", stderr: "pipe" }
    );
    await globProc.exited;
    const found = (await new Response(globProc.stdout).text()).trim().split("\n").filter(Boolean);

    if (!found.length) {
      throw new Error(
        `No transcript available for video: ${videoId}. The video may have no auto-generated captions.`
      );
    }

    // Use the first found file
    const altFile = Bun.file(found[0]);
    const vttContent = await altFile.text();
    const fullText = parseVtt(vttContent);

    // Clean up
    for (const f of found) await unlink(f).catch(() => {});

    return { videoId, url, fullText, wordCount: fullText.split(" ").length };
  }

  const vttContent = await vttFile.text();
  const fullText = parseVtt(vttContent);

  // Clean up temp file
  await unlink(expectedVtt).catch(() => {});

  if (!fullText) {
    throw new Error(`Transcript for ${videoId} was empty after parsing.`);
  }

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
    console.log(`\n--- TRANSCRIPT ---\n`);
    console.log(result.fullText.slice(0, 2000) + (result.wordCount > 400 ? "\n... [truncated]" : ""));
  } catch (err) {
    console.error("Error:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
}
