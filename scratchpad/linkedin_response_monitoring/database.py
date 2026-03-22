"""
database.py — SQLite-backed deduplication store for seen post URLs.
"""
import sqlite3
import os
from pathlib import Path


def _get_conn(db_path: str) -> sqlite3.Connection:
    Path(db_path).parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS seen_posts (
            post_url    TEXT PRIMARY KEY,
            profile_url TEXT NOT NULL,
            seen_at     DATETIME DEFAULT (datetime('now'))
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS profile_activity (
            profile_url  TEXT PRIMARY KEY,
            last_post_at DATETIME,
            updated_at   DATETIME DEFAULT (datetime('now'))
        )
    """)
    conn.commit()
    return conn


def is_seen(db_path: str, post_url: str) -> bool:
    conn = _get_conn(db_path)
    row = conn.execute(
        "SELECT 1 FROM seen_posts WHERE post_url = ?", (post_url,)
    ).fetchone()
    conn.close()
    return row is not None


def mark_seen(db_path: str, post_url: str, profile_url: str) -> None:
    conn = _get_conn(db_path)
    conn.execute(
        "INSERT OR IGNORE INTO seen_posts (post_url, profile_url) VALUES (?, ?)",
        (post_url, profile_url),
    )
    conn.commit()
    conn.close()


def record_profile_post(db_path: str, profile_url: str) -> None:
    """Update the last known post timestamp for a profile to now."""
    conn = _get_conn(db_path)
    conn.execute("""
        INSERT INTO profile_activity (profile_url, last_post_at, updated_at)
        VALUES (?, datetime('now'), datetime('now'))
        ON CONFLICT(profile_url) DO UPDATE SET
            last_post_at = datetime('now'),
            updated_at   = datetime('now')
    """, (profile_url,))
    conn.commit()
    conn.close()


def record_profile_checked(db_path: str, profile_url: str) -> None:
    """Record that we checked a profile (even if no new posts were found)."""
    conn = _get_conn(db_path)
    conn.execute("""
        INSERT INTO profile_activity (profile_url, last_post_at, updated_at)
        VALUES (?, NULL, datetime('now'))
        ON CONFLICT(profile_url) DO UPDATE SET
            updated_at = datetime('now')
    """, (profile_url,))
    conn.commit()
    conn.close()


def days_since_last_post(db_path: str, profile_url: str) -> float | None:
    """
    Returns the number of days since this profile last posted a new item,
    or None if we have never seen a post from them (first run — always check).
    """
    conn = _get_conn(db_path)
    row = conn.execute("""
        SELECT julianday('now') - julianday(last_post_at)
        FROM profile_activity
        WHERE profile_url = ? AND last_post_at IS NOT NULL
    """, (profile_url,)).fetchone()
    conn.close()
    return row[0] if row else None
