"""
notifications.py — Send alerts via Telegram Bot API and SMTP email.
"""
import smtplib
import logging
import requests
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dataclasses import dataclass

logger = logging.getLogger(__name__)


@dataclass
class PostAlert:
    author_name: str
    author_linkedin_url: str
    post_url: str
    post_text: str
    post_date: str
    ai_summary: str
    num_likes: int
    num_comments: int


# ── Telegram ──────────────────────────────────────────────────────────────────

def send_telegram(bot_token: str, chat_id: str, alert: PostAlert) -> bool:
    """Send a formatted Telegram message for a new post."""
    msg = (
        f"🔔 *New LinkedIn Post*\n\n"
        f"👤 *{_escape_md(alert.author_name)}*\n"
        f"📅 {_escape_md(alert.post_date)}\n"
        f"👍 {alert.num_likes}  💬 {alert.num_comments}\n\n"
        f"📝 *AI Summary*\n{_escape_md(alert.ai_summary)}\n\n"
        f"[View Post]({alert.post_url})"
    )

    url = f"https://api.telegram.org/bot{bot_token}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": msg,
        "parse_mode": "MarkdownV2",
        "disable_web_page_preview": False,
    }

    try:
        resp = requests.post(url, json=payload, timeout=15)
        resp.raise_for_status()
        logger.info("Telegram sent for %s post %s", alert.author_name, alert.post_url)
        return True
    except requests.RequestException as exc:
        logger.error("Telegram send failed: %s", exc)
        return False


def _escape_md(text: str) -> str:
    """Escape special chars for Telegram MarkdownV2."""
    special = r"\_*[]()~`>#+-=|{}.!"
    return "".join(f"\\{c}" if c in special else c for c in str(text))


# ── Email ─────────────────────────────────────────────────────────────────────

EMAIL_HTML = """\
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
  <div style="background: #0077B5; padding: 20px; border-radius: 8px 8px 0 0;">
    <h2 style="color: white; margin: 0;">🔔 New LinkedIn Post</h2>
  </div>
  <div style="border: 1px solid #ddd; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">

    <table style="width:100%; margin-bottom: 16px;">
      <tr>
        <td><strong>Author</strong></td>
        <td><a href="{author_linkedin_url}">{author_name}</a></td>
      </tr>
      <tr>
        <td><strong>Posted</strong></td>
        <td>{post_date}</td>
      </tr>
      <tr>
        <td><strong>Engagement</strong></td>
        <td>👍 {num_likes} likes &nbsp; 💬 {num_comments} comments</td>
      </tr>
    </table>

    <div style="background: #f0f7ff; border-left: 4px solid #0077B5;
                padding: 16px; border-radius: 4px; margin-bottom: 20px;">
      <strong>🤖 AI Summary</strong><br><br>
      {ai_summary}
    </div>

    <div style="background: #fafafa; border: 1px solid #eee;
                padding: 16px; border-radius: 4px; margin-bottom: 20px;
                font-size: 14px; color: #555; max-height: 200px; overflow: hidden;">
      <strong>Original Post (excerpt)</strong><br><br>
      {post_excerpt}
    </div>

    <a href="{post_url}"
       style="display: inline-block; background: #0077B5; color: white;
              padding: 12px 24px; border-radius: 6px; text-decoration: none;
              font-weight: bold;">
      View Full Post on LinkedIn →
    </a>
  </div>
  <p style="color: #999; font-size: 12px; text-align: center; margin-top: 16px;">
    LinkedIn Monitor · <a href="{author_linkedin_url}" style="color:#999;">Unsubscribe from this profile</a>
  </p>
</body>
</html>
"""


def send_email(
    smtp_host: str,
    smtp_port: int,
    smtp_user: str,
    smtp_password: str,
    email_from: str,
    email_to: str,
    alert: PostAlert,
) -> bool:
    """Send an HTML email alert for a new post."""
    subject = f"[LinkedIn] New post from {alert.author_name}"
    post_excerpt = alert.post_text[:500].replace("\n", "<br>")
    if len(alert.post_text) > 500:
        post_excerpt += "..."

    html_body = EMAIL_HTML.format(
        author_name=alert.author_name,
        author_linkedin_url=alert.author_linkedin_url,
        post_date=alert.post_date,
        num_likes=alert.num_likes,
        num_comments=alert.num_comments,
        ai_summary=alert.ai_summary.replace("\n", "<br>"),
        post_excerpt=post_excerpt,
        post_url=alert.post_url,
    )

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = email_from
    msg["To"] = email_to
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP(smtp_host, smtp_port, timeout=30) as server:
            server.ehlo()
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(email_from, email_to, msg.as_string())
        logger.info("Email sent for %s post %s", alert.author_name, alert.post_url)
        return True
    except smtplib.SMTPException as exc:
        logger.error("Email send failed: %s", exc)
        return False
