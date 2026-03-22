/**
 * database.ts — SQLite-backed deduplication store.
 * Ported from Python database.py using bun:sqlite (built-in, no deps).
 */

import { Database } from "bun:sqlite";
import { mkdirSync } from "fs";
import { dirname } from "path";

let _db: Database | null = null;

function getDb(dbPath: string): Database {
  if (_db) return _db;

  mkdirSync(dirname(dbPath), { recursive: true });
  _db = new Database(dbPath);

  _db.run(`
    CREATE TABLE IF NOT EXISTS seen_posts (
      post_url     TEXT PRIMARY KEY,
      profile_name TEXT,
      detected_at  TEXT DEFAULT (datetime('now'))
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS profile_activity (
      linkedin_url  TEXT PRIMARY KEY,
      last_post_date TEXT,
      updated_at    TEXT DEFAULT (datetime('now'))
    )
  `);

  _db.run(`
    CREATE TABLE IF NOT EXISTS seen_comments (
      comment_id     TEXT PRIMARY KEY,
      post_url       TEXT,
      commenter_name TEXT,
      detected_at    TEXT DEFAULT (datetime('now'))
    )
  `);

  return _db;
}

// ── Seen Posts ────────────────────────────────────────────────────────────────

export function isPostSeen(dbPath: string, postUrl: string): boolean {
  const db = getDb(dbPath);
  const row = db.query("SELECT 1 FROM seen_posts WHERE post_url = ?").get(postUrl);
  return row !== null;
}

export function markPostSeen(
  dbPath: string,
  postUrl: string,
  profileName: string
): void {
  const db = getDb(dbPath);
  db.run(
    "INSERT OR IGNORE INTO seen_posts (post_url, profile_name) VALUES (?, ?)",
    [postUrl, profileName]
  );
}

// ── Profile Activity ──────────────────────────────────────────────────────────

export function recordProfilePost(dbPath: string, linkedinUrl: string): void {
  const db = getDb(dbPath);
  db.run(
    `INSERT INTO profile_activity (linkedin_url, last_post_date, updated_at)
     VALUES (?, datetime('now'), datetime('now'))
     ON CONFLICT(linkedin_url) DO UPDATE SET
       last_post_date = datetime('now'),
       updated_at = datetime('now')`,
    [linkedinUrl]
  );
}

export function recordProfileChecked(dbPath: string, linkedinUrl: string): void {
  const db = getDb(dbPath);
  db.run(
    `INSERT INTO profile_activity (linkedin_url, last_post_date, updated_at)
     VALUES (?, NULL, datetime('now'))
     ON CONFLICT(linkedin_url) DO UPDATE SET
       updated_at = datetime('now')`,
    [linkedinUrl]
  );
}

export function daysSinceLastPost(
  dbPath: string,
  linkedinUrl: string
): number | null {
  const db = getDb(dbPath);
  const row = db
    .query<{ days: number }, string>(
      `SELECT julianday('now') - julianday(last_post_date) as days
       FROM profile_activity
       WHERE linkedin_url = ? AND last_post_date IS NOT NULL`
    )
    .get(linkedinUrl);
  return row ? row.days : null;
}

// ── Seen Comments ─────────────────────────────────────────────────────────────

export function isCommentSeen(dbPath: string, commentId: string): boolean {
  const db = getDb(dbPath);
  const row = db
    .query("SELECT 1 FROM seen_comments WHERE comment_id = ?")
    .get(commentId);
  return row !== null;
}

export function markCommentSeen(
  dbPath: string,
  commentId: string,
  postUrl: string,
  commenterName: string
): void {
  const db = getDb(dbPath);
  db.run(
    "INSERT OR IGNORE INTO seen_comments (comment_id, post_url, commenter_name) VALUES (?, ?, ?)",
    [commentId, postUrl, commenterName]
  );
}
