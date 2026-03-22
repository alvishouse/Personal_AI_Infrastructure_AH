"""
linkedin.py — Fetch recent posts for a LinkedIn profile via Proxycurl.
"""
import requests
import logging
from typing import Optional

logger = logging.getLogger(__name__)

PROXYCURL_POSTS_URL = "https://nubela.co/proxycurl/api/v2/linkedin/person/posts"


def fetch_recent_posts(
    api_key: str,
    linkedin_profile_url: str,
    count: int = 5,
) -> list[dict]:
    """
    Returns a list of post dicts. Each dict contains at minimum:
      - post_url (str)
      - text (str)
      - posted_on (dict with day/month/year)
      - num_likes (int)
      - num_comments (int)
    Returns [] on any error (with logging).
    """
    headers = {"Authorization": f"Bearer {api_key}"}
    params = {
        "linkedin_profile_url": linkedin_profile_url,
        "type": "posts",
    }

    posts: list[dict] = []
    pagination_token: Optional[str] = None

    try:
        while len(posts) < count:
            if pagination_token:
                params["pagination_token"] = pagination_token

            resp = requests.get(
                PROXYCURL_POSTS_URL, headers=headers, params=params, timeout=30
            )

            if resp.status_code == 404:
                logger.warning("Profile not found: %s", linkedin_profile_url)
                break
            if resp.status_code == 429:
                logger.error("Proxycurl rate limit hit for %s", linkedin_profile_url)
                break
            resp.raise_for_status()

            data = resp.json()
            batch = data.get("posts", [])
            posts.extend(batch)

            pagination_token = data.get("next_page")
            if not pagination_token or not batch:
                break

    except requests.RequestException as exc:
        logger.error("Proxycurl request failed for %s: %s", linkedin_profile_url, exc)

    return posts[:count]


def format_post_date(posted_on: dict) -> str:
    """Convert Proxycurl's posted_on dict to a readable string."""
    if not posted_on:
        return "Unknown date"
    day = posted_on.get("day", "")
    month = posted_on.get("month", "")
    year = posted_on.get("year", "")
    return f"{year}-{month:02d}-{day:02d}" if all([day, month, year]) else "Unknown date"
