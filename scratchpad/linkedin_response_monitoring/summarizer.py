"""
summarizer.py — Generate AI summaries of LinkedIn posts using Claude.
"""
import anthropic
import logging

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """You are an expert analyst summarizing LinkedIn posts for busy professionals.
Given a LinkedIn post, return a tight 2-3 sentence summary that captures:
1. The core insight or announcement
2. Why it matters or who it's relevant to
3. The author's apparent intent (thought leadership, promotion, personal update, etc.)

Be direct and informative. No filler phrases like "In this post..." or "The author discusses..."."""


def summarize_post(api_key: str, post_text: str, author_name: str) -> str:
    """
    Returns a 2-3 sentence AI summary of the post.
    Falls back to a truncated excerpt on error.
    """
    if not post_text or not post_text.strip():
        return "No text content in this post."

    try:
        client = anthropic.Anthropic(api_key=api_key)
        message = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=300,
            system=SYSTEM_PROMPT,
            messages=[
                {
                    "role": "user",
                    "content": f"Author: {author_name}\n\nPost:\n{post_text[:3000]}",
                }
            ],
        )
        return message.content[0].text.strip()

    except Exception as exc:
        logger.error("Claude summarization failed: %s", exc)
        # Graceful fallback — truncate the raw text
        truncated = post_text[:300].strip()
        return f"{truncated}{'...' if len(post_text) > 300 else ''}"
