/**
 * proxycurl.ts — Proxycurl API wrapper for LinkedIn posts + comments.
 * Ported from Python linkedin.py with TypeScript idioms.
 */

const POSTS_URL = "https://nubela.co/proxycurl/api/v2/linkedin/person/posts";
const COMMENTS_URL = "https://nubela.co/proxycurl/api/linkedin/post/comment";

export interface ProxycurlPost {
  post_url: string;
  text: string;
  posted_on: { day?: number; month?: number; year?: number } | null;
  num_likes: number;
  num_comments: number;
  images?: string[];
  video?: string | null;
}

export interface ProxycurlComment {
  comment_id: string;
  commenter_name: string;
  commenter_url?: string;
  text: string;
  created_at?: string;
  num_likes?: number;
}

export function formatPostDate(
  postedOn: ProxycurlPost["posted_on"]
): string {
  if (!postedOn) return "Unknown date";
  const { day, month, year } = postedOn;
  if (!day || !month || !year) return "Unknown date";
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export async function fetchRecentPosts(
  apiKey: string,
  linkedinProfileUrl: string,
  count = 5
): Promise<ProxycurlPost[]> {
  const headers = { Authorization: `Bearer ${apiKey}` };
  const posts: ProxycurlPost[] = [];
  let paginationToken: string | undefined;

  try {
    while (posts.length < count) {
      const params = new URLSearchParams({
        linkedin_profile_url: linkedinProfileUrl,
        type: "posts",
      });
      if (paginationToken) params.set("pagination_token", paginationToken);

      const resp = await fetch(`${POSTS_URL}?${params}`, {
        headers,
        signal: AbortSignal.timeout(30_000),
      });

      if (resp.status === 404) {
        console.warn(`[proxycurl] Profile not found: ${linkedinProfileUrl}`);
        break;
      }
      if (resp.status === 429) {
        console.error(`[proxycurl] Rate limit hit for ${linkedinProfileUrl}`);
        break;
      }
      if (!resp.ok) {
        console.error(`[proxycurl] HTTP ${resp.status} for ${linkedinProfileUrl}`);
        break;
      }

      const data = await resp.json() as {
        posts?: ProxycurlPost[];
        next_page?: string;
      };
      const batch = data.posts ?? [];
      posts.push(...batch);

      paginationToken = data.next_page;
      if (!paginationToken || !batch.length) break;
    }
  } catch (err) {
    console.error(`[proxycurl] Request failed for ${linkedinProfileUrl}:`, err);
  }

  return posts.slice(0, count);
}

export async function fetchPostComments(
  apiKey: string,
  postUrl: string
): Promise<ProxycurlComment[]> {
  const headers = { Authorization: `Bearer ${apiKey}` };
  const comments: ProxycurlComment[] = [];
  let paginationToken: string | undefined;

  try {
    while (true) {
      const params = new URLSearchParams({ linkedin_post_url: postUrl });
      if (paginationToken) params.set("pagination_token", paginationToken);

      const resp = await fetch(`${COMMENTS_URL}?${params}`, {
        headers,
        signal: AbortSignal.timeout(30_000),
      });

      if (resp.status === 404) {
        console.warn(`[proxycurl] Post not found: ${postUrl}`);
        break;
      }
      if (resp.status === 429) {
        console.error(`[proxycurl] Rate limit hit for post ${postUrl}`);
        break;
      }
      if (!resp.ok) {
        console.error(`[proxycurl] HTTP ${resp.status} for post ${postUrl}`);
        break;
      }

      const data = await resp.json() as {
        comments?: ProxycurlComment[];
        next_page?: string;
      };
      const batch = data.comments ?? [];
      comments.push(...batch);

      paginationToken = data.next_page;
      if (!paginationToken || !batch.length) break;
    }
  } catch (err) {
    console.error(`[proxycurl] Comments request failed for ${postUrl}:`, err);
  }

  return comments;
}
