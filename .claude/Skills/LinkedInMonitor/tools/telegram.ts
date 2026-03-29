/**
 * telegram.ts — Send LinkedIn monitoring alerts via Telegram Bot API.
 * Ported from Python notifications.py (Telegram portion only — no email).
 */

function escapeMd(text: string): string {
  // Escape special chars for Telegram MarkdownV2
  return String(text).replace(/[_*[\]()~`>#+=|{}.!\\-]/g, "\\$&");
}

async function sendMessage(
  botToken: string,
  chatId: string,
  text: string,
  extraBody?: Record<string, unknown>
): Promise<{ ok: boolean; message_id?: number }> {
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "MarkdownV2",
        disable_web_page_preview: false,
        ...extraBody,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[telegram] Send failed: ${resp.status} ${body}`);
      return { ok: false };
    }
    const data = await resp.json() as { ok: boolean; result?: { message_id?: number } };
    return { ok: true, message_id: data.result?.message_id };
  } catch (err) {
    console.error("[telegram] Request failed:", err);
    return { ok: false };
  }
}

export async function editMessage(
  botToken: string,
  chatId: string,
  messageId: number,
  newText: string
): Promise<boolean> {
  const url = `https://api.telegram.org/bot${botToken}/editMessageText`;
  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: newText,
        disable_web_page_preview: true,
      }),
      signal: AbortSignal.timeout(15_000),
    });
    if (!resp.ok) {
      const body = await resp.text();
      console.error(`[telegram] editMessageText failed: ${resp.status} ${body}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[telegram] editMessage request failed:", err);
    return false;
  }
}

export async function sendWatchedPostAlert(
  botToken: string,
  chatId: string,
  opts: {
    authorName: string;
    postDate: string;
    numLikes: number;
    numComments: number;
    postText: string;
    postUrl: string;
  },
  notionPageId?: string
): Promise<boolean> {
  const excerpt = opts.postText.slice(0, 200) + (opts.postText.length > 200 ? "..." : "");
  const msg = [
    `🔔 *New post from ${escapeMd(opts.authorName)}*`,
    `📅 ${escapeMd(opts.postDate)} · 👍 ${opts.numLikes} · 💬 ${opts.numComments}`,
    ``,
    escapeMd(excerpt),
    ``,
    `🔗 [View Post](${opts.postUrl})`,
  ].join("\n");

  const extraBody: Record<string, unknown> = {};
  if (notionPageId) {
    extraBody.reply_markup = {
      inline_keyboard: [[{ text: "✍️ Generate Replies", callback_data: `reply:${notionPageId}` }]],
    };
  }

  console.log(`[telegram] Sending watched-post alert for ${opts.authorName}`);
  const result = await sendMessage(botToken, chatId, msg, extraBody);
  return result.ok;
}

export async function sendCommentAlert(
  botToken: string,
  chatId: string,
  opts: {
    commenterName: string;
    postTitle: string;
    commentText: string;
    commentDate: string;
    postUrl: string;
  },
  notionPageId?: string
): Promise<boolean> {
  const excerpt = opts.commentText.slice(0, 200) + (opts.commentText.length > 200 ? "..." : "");
  const msg = [
    `💬 *${escapeMd(opts.commenterName)} commented on your post*`,
    `📝 ${escapeMd(opts.postTitle)}`,
    `📅 ${escapeMd(opts.commentDate)}`,
    ``,
    `"${escapeMd(excerpt)}"`,
    ``,
    `🔗 [View Post](${opts.postUrl})`,
  ].join("\n");

  const extraBody: Record<string, unknown> = {};
  if (notionPageId) {
    extraBody.reply_markup = {
      inline_keyboard: [[{ text: "✍️ Generate Replies", callback_data: `reply:${notionPageId}` }]],
    };
  }

  console.log(`[telegram] Sending comment alert from ${opts.commenterName}`);
  const result = await sendMessage(botToken, chatId, msg, extraBody);
  return result.ok;
}
