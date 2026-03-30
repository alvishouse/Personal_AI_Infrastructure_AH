/**
 * linkdapi.ts — LinkdAPI wrapper for LinkedIn posts + comments.
 * Replaces proxycurl.ts after Proxycurl shutdown (July 2025).
 *
 * Auth: X-API-Key header (set LINKDAPI_API_KEY in .env)
 * Docs: https://linkdapi.com/docs
 * Sign up for 100 free credits at linkdapi.com
 *
 * NOTE: Field names below are best-effort based on LinkdAPI docs.
 * If responses differ, check actual API response and adjust mappings.
 */

const BASE_URL = "https://linkdapi.com";

// Kept compatible with Proxycurl interface for zero changes in monitor scripts
export interface LinkdApiPost {
  post_url: string;
  text: string;
  posted_on: { day?: number; month?: number; year?: number } | null;
  num_likes: number;
  num_comments: number;
  images?: string[];
  video?: string | null;
}

export interface LinkdApiComment {
  comment_id: string;
  commenter_name: string;
  commenter_url?: string;
  text: string;
  created_at?: string;
  num_likes?: number;
}

export function formatPostDate(
  postedOn: LinkdApiPost["posted_on"]
): string {
  if (!postedOn) return "Unknown date";
  const { day, month, year } = postedOn;
  if (!day || !month || !year) return "Unknown date";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function extractUsername(profileUrl: string): string {
  // https://www.linkedin.com/in/username/ → username
  const match = profileUrl.match(/linkedin\.com\/in\/([^/?#]+)/i);
  if (!match) throw new Error(`Cannot extract username from URL: ${profileUrl}`);
  return match[1].replace(/\/$/, "");
}

function extractPostUrn(postUrl: string): string {
  // feed/update URL:  .../feed/update/urn:li:activity:1234567890/
  const urnMatch = postUrl.match(/urn:li:activity:(\d+)/i);
  if (urnMatch) return urnMatch[1];
  // share URL:        .../posts/username_text-1234567890-XXXX
  const shareMatch = postUrl.match(/-(\d{10,})-[A-Za-z]+(?:[/?]|$)/);
  if (shareMatch) return shareMatch[1];
  // legacy activity URL: .../activity-1234567890-xxxx
  const activityMatch = postUrl.match(/activity-(\d+)/i);
  if (activityMatch) return activityMatch[1];
  throw new Error(`Cannot extract activity URN from post URL: ${postUrl}`);
}

function epochToPostedOn(epochMs: number | string | undefined): LinkdApiPost["posted_on"] {
  if (epochMs === undefined || epochMs === null) return null;
  const d = new Date(typeof epochMs === "string" ? parseInt(epochMs) : epochMs);
  if (isNaN(d.getTime())) return null;
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

async function fetchProfileUrn(apiKey: string, username: string): Promise<string> {
  const resp = await fetch(
    `${BASE_URL}/api/v1/profile/username-to-urn?username=${encodeURIComponent(username)}`,
    {
      headers: { "X-linkdapi-apikey": apiKey },
      signal: AbortSignal.timeout(15_000),
    }
  );
  if (!resp.ok) {
    throw new Error(`[linkdapi] Failed to get URN for ${username}: HTTP ${resp.status}`);
  }
  const data = await resp.json() as { data?: { urn?: string } };
  const urn = data.data?.urn;
  if (!urn) throw new Error(`[linkdapi] No URN in response for username: ${username}`);
  return urn;
}

export async function fetchRecentPosts(
  apiKey: string,
  linkedinProfileUrl: string,
  count = 5
): Promise<LinkdApiPost[]> {
  const posts: LinkdApiPost[] = [];

  try {
    const username = extractUsername(linkedinProfileUrl);
    const profileUrn = await fetchProfileUrn(apiKey, username);

    const params = new URLSearchParams({ urn: profileUrn });
    const resp = await fetch(`${BASE_URL}/api/v1/posts/all?${params}`, {
      headers: { "X-linkdapi-apikey": apiKey },
      signal: AbortSignal.timeout(30_000),
    });

    if (resp.status === 404) {
      console.warn(`[linkdapi] Profile not found: ${linkedinProfileUrl}`);
      return [];
    }
    if (resp.status === 429) {
      console.error(`[linkdapi] Rate limit hit for ${linkedinProfileUrl}`);
      return [];
    }
    if (!resp.ok) {
      console.error(`[linkdapi] HTTP ${resp.status} for ${linkedinProfileUrl}`);
      return [];
    }

    const data = await resp.json() as { data?: { posts?: any[]; cursor?: string } };
    const raw = data.data?.posts ?? [];

    for (const item of raw.slice(0, count)) {
      posts.push({
        post_url: item.url ?? "",
        text: item.text ?? "",
        posted_on: epochToPostedOn(item.postedAt?.timestamp),
        num_likes: item.engagements?.totalReactions ?? 0,
        num_comments: item.engagements?.commentsCount ?? 0,
        images: (item.mediaContent ?? [])
          .filter((m: any) => m.type === "image")
          .map((m: any) => m.url),
        video: (item.mediaContent ?? []).find((m: any) => m.type === "video")?.url ?? null,
      });
    }
  } catch (err) {
    console.error(`[linkdapi] fetchRecentPosts failed for ${linkedinProfileUrl}:`, err);
  }

  return posts;
}

export async function fetchPostComments(
  apiKey: string,
  postUrl: string
): Promise<LinkdApiComment[]> {
  const comments: LinkdApiComment[] = [];

  try {
    const postUrn = extractPostUrn(postUrl);
    let start = 0;
    const pageSize = 50;

    while (true) {
      const params = new URLSearchParams({
        urn: postUrn,
        start: String(start),
        count: String(pageSize),
      });

      const resp = await fetch(`${BASE_URL}/api/v1/posts/comments?${params}`, {
        headers: { "X-linkdapi-apikey": apiKey },
        signal: AbortSignal.timeout(30_000),
      });

      if (resp.status === 404) {
        console.warn(`[linkdapi] Post not found: ${postUrl}`);
        break;
      }
      if (resp.status === 429) {
        console.error(`[linkdapi] Rate limit hit for post ${postUrl}`);
        break;
      }
      if (!resp.ok) {
        console.error(`[linkdapi] HTTP ${resp.status} for post ${postUrl}`);
        break;
      }

      const data = await resp.json() as { data?: { comments?: any[] } };
      const batch = data.data?.comments ?? [];
      if (!batch.length) break;

      for (const item of batch) {
        comments.push({
          comment_id: item.permalink ?? item.urn ?? "",
          commenter_name: item.author?.name ?? "Unknown",
          commenter_url: item.author?.url,
          text: item.comment ?? "",
          created_at: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
          num_likes: item.engagements?.totalReactions ?? 0,
        });
      }

      if (batch.length < pageSize) break;
      start += pageSize;
    }
  } catch (err) {
    console.error(`[linkdapi] fetchPostComments failed for ${postUrl}:`, err);
  }

  return comments;
}
