"""
main.py — LinkedIn post monitor orchestrator.
Polls Proxycurl for new posts, generates AI summaries, and sends
Telegram + email notifications for each new post.

Run manually:      python main.py
Run via cron/Docker: see Dockerfile + docker-compose.yml
"""

import json
import logging
import os
import sys
from pathlib import Path

from dotenv import load_dotenv

from database import is_seen, mark_seen, record_profile_post, record_profile_checked, days_since_last_post
from linkedin import fetch_recent_posts, format_post_date
from notifications import PostAlert, send_email, send_telegram
from summarizer import summarize_post

# ── Logging ───────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger(__name__)


# ── Config ────────────────────────────────────────────────────────────────────
def load_config() -> dict:
    load_dotenv()

    required = [
        "PROXYCURL_API_KEY",
        "ANTHROPIC_API_KEY",
        "TELEGRAM_BOT_TOKEN",
        "TELEGRAM_CHAT_ID",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASSWORD",
        "EMAIL_FROM",
        "EMAIL_TO",
    ]
    missing = [k for k in required if not os.getenv(k)]
    if missing:
        logger.error("Missing required environment variables: %s", ", ".join(missing))
        sys.exit(1)

    return {
        "proxycurl_api_key": os.environ["PROXYCURL_API_KEY"],
        "anthropic_api_key": os.environ["ANTHROPIC_API_KEY"],
        "telegram_bot_token": os.environ["TELEGRAM_BOT_TOKEN"],
        "telegram_chat_id": os.environ["TELEGRAM_CHAT_ID"],
        "smtp_host": os.environ["SMTP_HOST"],
        "smtp_port": int(os.environ.get("SMTP_PORT", 587)),
        "smtp_user": os.environ["SMTP_USER"],
        "smtp_password": os.environ["SMTP_PASSWORD"],
        "email_from": os.environ["EMAIL_FROM"],
        "email_to": os.environ["EMAIL_TO"],
        "posts_per_profile": int(os.environ.get("POSTS_PER_PROFILE", 5)),
        "profiles_file": os.environ.get("PROFILES_FILE", "profiles.json"),
        "db_path": os.environ.get("DB_PATH", "data/seen_posts.db"),
        # Skip profiles that haven't posted in this many days (0 = never skip)
        "inactive_skip_days": int(os.environ.get("INACTIVE_SKIP_DAYS", 7)),
    }


def load_profiles(profiles_file: str) -> list[dict]:
    path = Path(profiles_file)
    if not path.exists():
        logger.error("Profiles file not found: %s", profiles_file)
        sys.exit(1)
    with open(path) as f:
        profiles = json.load(f)
    logger.info("Loaded %d profile(s) to monitor", len(profiles))
    return profiles


# ── Core loop ─────────────────────────────────────────────────────────────────
def process_profile(profile: dict, cfg: dict) -> None:
    name = profile["name"]
    url = profile["linkedin_url"]
    notify_telegram = profile.get("notify_telegram", True)
    notify_email = profile.get("notify_email", True)

    logger.info("Checking posts for %s (%s)", name, url)

    # Skip-inactive optimization: if this profile hasn't posted in N days,
    # skip the Proxycurl API call entirely to save credits.
    skip_days = cfg["inactive_skip_days"]
    if skip_days > 0:
        since = days_since_last_post(cfg["db_path"], url)
        if since is not None and since > skip_days:
            logger.info(
                "  Skipping %s — no post seen in %.0f days (threshold: %d)",
                name, since, skip_days,
            )
            return

    posts = fetch_recent_posts(
        api_key=cfg["proxycurl_api_key"],
        linkedin_profile_url=url,
        count=cfg["posts_per_profile"],
    )

    if not posts:
        logger.info("  No posts returned for %s", name)
        record_profile_checked(cfg["db_path"], url)
        return

    new_count = 0
    for post in posts:
        post_url = post.get("post_url", "")
        if not post_url:
            continue

        if is_seen(cfg["db_path"], post_url):
            continue

        # New post — process it
        new_count += 1
        post_text = post.get("text", "")
        post_date = format_post_date(post.get("posted_on", {}))
        num_likes = post.get("num_likes", 0) or 0
        num_comments = post.get("num_comments", 0) or 0

        logger.info("  NEW post found: %s", post_url)

        # Generate AI summary
        logger.info("  Generating AI summary...")
        ai_summary = summarize_post(
            api_key=cfg["anthropic_api_key"],
            post_text=post_text,
            author_name=name,
        )

        alert = PostAlert(
            author_name=name,
            author_linkedin_url=url,
            post_url=post_url,
            post_text=post_text,
            post_date=post_date,
            ai_summary=ai_summary,
            num_likes=num_likes,
            num_comments=num_comments,
        )

        # Send notifications
        if notify_telegram:
            send_telegram(
                bot_token=cfg["telegram_bot_token"],
                chat_id=cfg["telegram_chat_id"],
                alert=alert,
            )

        if notify_email:
            send_email(
                smtp_host=cfg["smtp_host"],
                smtp_port=cfg["smtp_port"],
                smtp_user=cfg["smtp_user"],
                smtp_password=cfg["smtp_password"],
                email_from=cfg["email_from"],
                email_to=cfg["email_to"],
                alert=alert,
            )

        # Mark as seen AFTER successful notification
        mark_seen(cfg["db_path"], post_url, url)
        record_profile_post(cfg["db_path"], url)

    if new_count == 0:
        logger.info("  No new posts for %s", name)
    else:
        logger.info("  Processed %d new post(s) for %s", new_count, name)


def main() -> None:
    logger.info("═" * 60)
    logger.info("LinkedIn Monitor starting...")
    cfg = load_config()
    profiles = load_profiles(cfg["profiles_file"])

    for profile in profiles:
        try:
            process_profile(profile, cfg)
        except Exception as exc:
            logger.exception("Unexpected error processing %s: %s", profile.get("name"), exc)

    logger.info("LinkedIn Monitor run complete.")
    logger.info("═" * 60)


if __name__ == "__main__":
    main()
