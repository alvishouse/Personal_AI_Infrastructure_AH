#!/usr/bin/env bun

/**
 * Substack Publisher Tool
 *
 * Publishes a content workflow's cornerstone post to Substack as a draft.
 * Converts markdown → Tiptap JSON (Substack's native editor format).
 *
 * Usage:
 *   PAI_DIR=/home/alvis/PAI bun run publish-to-substack.ts --workflow-id=2026-03-22-refinery-principle
 *   PAI_DIR=/home/alvis/PAI bun run publish-to-substack.ts --workflow-id=... --dry-run
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { chromium, type BrowserContext } from 'playwright';

const PAI_DIR = process.env.PAI_DIR || '/home/alvis/PAI';
const SCRATCHPAD = join(PAI_DIR, 'scratchpad/content-create');
const SKILL_DIR = join(PAI_DIR, '.claude/Skills/WordPressPublisher');
const CONFIG_PATH = join(SKILL_DIR, 'config/substack-config.json');
const WP_CONFIG_PATH = join(SKILL_DIR, 'config/wordpress-sites.json');

const SESSION_PATH = join(SKILL_DIR, 'config/substack-session.json');

// ─── Types ───────────────────────────────────────────────────────────────────

type Mark = { type: string; attrs?: Record<string, any> };
type TNode = {
  type: string;
  text?: string;
  attrs?: Record<string, any>;
  content?: TNode[];
  marks?: Mark[];
};

interface SubstackConfig { publication_url: string; email: string; password: string }
interface WordPressSite { url: string; username: string; password: string }
interface WorkflowMetadata {
  workflow_id: string; topic: string; status: string; updated_at: string;
  checkpoints: Record<string, any>;
  wordpress?: { post_id?: number; post_url?: string; status?: string; media_ids?: Record<string, number> };
  substack?: { draft_id?: number; draft_url?: string; status?: string; synced_at?: string };
}
interface ImagePlaceholder { type: string; alt: string }

// ─── Args ────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const workflowId = args.find(a => a.startsWith('--workflow-id='))?.split('=')[1];
const dryRun = args.includes('--dry-run');
if (!workflowId) { console.error('Usage: bun run publish-to-substack.ts --workflow-id=<id>'); process.exit(1); }

// ─── Tiptap Helpers ──────────────────────────────────────────────────────────

function mkText(str: string, marks: Mark[] = []): TNode {
  return marks.length ? { type: 'text', text: str, marks } : { type: 'text', text: str };
}

function parseInline(raw: string): TNode[] {
  if (!raw.trim()) return [];
  const nodes: TNode[] = [];
  // Order matters: bold+italic before bold before italic
  const regex = /\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*([^*\n]+?)\*|`([^`]+?)`|\[([^\]]+?)\]\(([^)]+?)\)/gs;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(raw)) !== null) {
    if (m.index > last) nodes.push(mkText(raw.slice(last, m.index)));
    if (m[1] != null) nodes.push(mkText(m[1], [{ type: 'strong' }, { type: 'em' }]));
    else if (m[2] != null) nodes.push(mkText(m[2], [{ type: 'strong' }]));
    else if (m[3] != null) nodes.push(mkText(m[3], [{ type: 'em' }]));
    else if (m[4] != null) nodes.push(mkText(m[4], [{ type: 'code' }]));
    else if (m[5] != null) nodes.push(mkText(m[5], [{ type: 'link', attrs: { href: m[6], target: '_blank', rel: 'noopener noreferrer nofollow', class: null } }]));
    last = regex.lastIndex;
  }
  if (last < raw.length) nodes.push(mkText(raw.slice(last)));
  return nodes.filter(n => n.text !== '');
}

function para(inlineContent: TNode[]): TNode {
  return { type: 'paragraph', content: inlineContent.length ? inlineContent : [] };
}

function heading(level: number, text: string): TNode {
  return { type: 'heading', attrs: { level }, content: parseInline(text) };
}

function listItem(text: string): TNode {
  return { type: 'listItem', content: [para(parseInline(text))] };
}

function image(src: string, alt: string): TNode {
  // Substack treats image as an inline node — must be wrapped in a paragraph
  return { type: 'paragraph', content: [{ type: 'image', attrs: { src, alt } }] };
}

// ─── Markdown → Tiptap ───────────────────────────────────────────────────────

const SUBSCRIBE_WIDGET: TNode = { type: 'subscribeWidget', attrs: {} };

function markdownToTiptap(
  md: string,
  imagePlaceholders: ImagePlaceholder[],
  imageUrls: (string | null)[]
): string {
  const lines = md.split('\n');
  const content: TNode[] = [];
  let i = 0;
  let imgIdx = 0;

  // Look ahead: check if next non-blank line matches pattern
  function peekLine(fromIdx: number): string {
    for (let j = fromIdx; j < lines.length; j++) {
      if (lines[j].trim() !== '') return lines[j].trim();
    }
    return '';
  }

  // Collect a bullet list starting at i (handles blank lines between items if next item starts with - or *)
  function collectBulletList(): TNode {
    const items: TNode[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '') { i++; continue; }
      // Stop if next non-blank is not a bullet
      if (!t.match(/^[-*] /)) break;
      const itemText = t.replace(/^[-*] (\[[ x]\] )?/, '');
      items.push(listItem(itemText));
      i++;
    }
    return { type: 'bulletList', content: items };
  }

  // Collect an ordered list starting at i (handles blank lines between items)
  function collectOrderedList(startNum: number, firstText: string): TNode {
    const items: TNode[] = [];
    items.push(listItem(firstText));
    let expected = startNum + 1;
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '') {
        // Look ahead to see if next item continues the list
        const next = peekLine(i + 1);
        if (next.match(new RegExp(`^${expected}\\.\\s+`))) {
          i++;
          continue; // skip blank, continue to next item
        }
        break; // blank line, no continuation
      }
      const m = t.match(/^(\d+)\.\s+(.+)$/);
      if (!m || parseInt(m[1]) !== expected) break;
      items.push(listItem(m[2]));
      expected++;
      i++;
    }
    return { type: 'orderedList', content: items };
  }

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line — skip
    if (trimmed === '') { i++; continue; }

    // Image placeholder
    if (trimmed === '__IMAGE_PLACEHOLDER__') {
      const placeholder = imagePlaceholders[imgIdx];
      const url = imageUrls[imgIdx];
      imgIdx++;
      if (url && placeholder) {
        content.push(image(url, placeholder.alt));
      }
      i++;
      continue;
    }

    // Horizontal rule — Substack doesn't support horizontalRule nodes; emit empty paragraph
    if (trimmed === '---') {
      content.push(para([]));
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      content.push(heading(headingMatch[1].length, headingMatch[2]));
      i++;
      continue;
    }

    // Code block — Substack doesn't support codeBlock nodes; render each line as a paragraph
    if (line.startsWith('```')) {
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      for (const codeLine of codeLines) {
        if (codeLine.trim()) content.push(para([mkText(codeLine)]));
      }
      continue;
    }

    // Bullet list
    if (trimmed.match(/^[-*] /)) {
      content.push(collectBulletList());
      continue;
    }

    // Ordered list
    const orderedMatch = trimmed.match(/^(\d+)\.\s+(.+)$/);
    if (orderedMatch) {
      content.push(collectOrderedList(parseInt(orderedMatch[1]), orderedMatch[2]));
      continue;
    }

    // Regular paragraph — collect lines until a block-level element or blank line
    const paraLines: string[] = [];
    while (i < lines.length) {
      const t = lines[i].trim();
      if (t === '') break;
      if (
        t === '---' || t === '__IMAGE_PLACEHOLDER__' ||
        t.match(/^#{1,6} /) || t.startsWith('```') ||
        t.match(/^[-*] /) || t.match(/^\d+\.\s/)
      ) break;
      paraLines.push(lines[i].trim());
      i++;
    }
    if (paraLines.length > 0) {
      const paraText = paraLines.join(' ');
      content.push(para(parseInline(paraText)));
    }
  }

  // TODO: Subscribe widget placement disabled until correct Substack node type is confirmed.
  // Add manually in editor via "/" → "Subscribe button"

  return JSON.stringify({ type: 'doc', content });
}

// ─── Content Processing ───────────────────────────────────────────────────────

function extractImagePlaceholders(content: string): ImagePlaceholder[] {
  const placeholders: ImagePlaceholder[] = [];
  const regex = /<!--\s*IMAGE\s*\n([\s\S]*?)-->/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const block = match[1];
    const getField = (name: string) => block.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'))?.[1]?.trim() || '';
    placeholders.push({ type: getField('Type').toLowerCase(), alt: getField('Alt Text') });
  }
  return placeholders;
}

function stripPAIMarkup(content: string): string {
  content = content.replace(/^---\n[\s\S]*?\n---\n/, '');
  content = content.replace(/<!--\s*IMAGE\s*\n[\s\S]*?-->/g, '__IMAGE_PLACEHOLDER__');
  content = content.replace(/\n---\n\n### Extraction Potential Notes[\s\S]*$/, '');
  content = content.replace(/\n\*Word count:.*\*\n/g, '\n');
  // Strip H1 title (Substack renders it from draft_title)
  content = content.replace(/^#\s+.+\n+/, '');
  // Strip subtitle italic line (Substack renders it from draft_subtitle)
  content = content.replace(/^\*[^*]+\*\n+/, '');
  // Replace em dashes with commas (em dashes are an AI writing tell)
  content = content.replace(/ — /g, ', ');
  return content.trim();
}

// ─── WordPress Media ─────────────────────────────────────────────────────────

async function getWpMediaUrl(wpSite: WordPressSite, mediaId: number): Promise<string | null> {
  try {
    const r = await fetch(`${wpSite.url}/wp-json/wp/v2/media/${mediaId}`);
    if (!r.ok) return null;
    return ((await r.json()) as { source_url: string }).source_url;
  } catch { return null; }
}

async function buildImageUrlList(
  metadata: WorkflowMetadata,
  wpSite: WordPressSite,
  placeholders: ImagePlaceholder[]
): Promise<(string | null)[]> {
  const wpMedia = metadata.checkpoints?.['step-12']?.wp_media || {};
  const typeToKey: Record<string, string[]> = {
    featured: ['featured'],
    diagram: ['inline_01', 'inline_02', 'inline_03'],
    inline: ['inline_01', 'inline_02', 'inline_03'],
  };
  const usedKeys = new Set<string>();
  const urls: (string | null)[] = [];
  for (const placeholder of placeholders) {
    const candidates = typeToKey[placeholder.type] || typeToKey['inline'];
    const key = candidates.find(k => wpMedia[k] && !usedKeys.has(k));
    if (!key) { console.warn(`  No WP media for placeholder type=${placeholder.type}`); urls.push(null); continue; }
    usedKeys.add(key);
    const url = await getWpMediaUrl(wpSite, wpMedia[key]);
    urls.push(url);
    console.log(`  ${placeholder.type} → WP media ${wpMedia[key]} → ${url}`);
  }
  return urls;
}

// ─── Playwright Session ───────────────────────────────────────────────────────

async function getAuthContext(config: SubstackConfig): Promise<BrowserContext> {
  const browser = await chromium.launch({ headless: true });

  // Try stored session first
  if (existsSync(SESSION_PATH)) {
    console.log('Loading stored Substack session...');
    const ctx = await browser.newContext({ storageState: SESSION_PATH });
    const page = await ctx.newPage();
    await page.goto(`${config.publication_url}/publish/posts/drafts`, { waitUntil: 'networkidle', timeout: 20000 });
    const isLoggedIn = page.url().includes('/publish/');
    await page.close();
    if (isLoggedIn) { console.log('Session valid ✓'); return ctx; }
    console.log('Session expired, re-authenticating...');
    await ctx.close();
  }

  // Login via Playwright (real browser — bypasses API captcha)
  console.log(`Logging in as ${config.email}...`);
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto('https://substack.com/sign-in', { waitUntil: 'networkidle', timeout: 30000 });
  await page.fill('input[type="email"]', config.email);
  await page.getByRole('button', { name: /sign in with password/i }).click();
  await page.waitForTimeout(1000);
  await page.fill('input[type="password"]', config.password);
  await page.getByRole('button', { name: /sign in/i }).last().click();
  await page.waitForURL('**/home**', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.close();

  // Save session for next time
  await ctx.storageState({ path: SESSION_PATH });
  console.log('Authenticated and session saved ✓');
  return ctx;
}

async function getCookieFromContext(ctx: BrowserContext): Promise<string> {
  const cookies = await ctx.cookies('https://substack.com');
  const sid = cookies.find(c => c.name === 'substack.sid');
  if (!sid) throw new Error('substack.sid cookie not found after login');
  return `substack.sid=${sid.value}`;
}

async function createSubstackDraft(
  config: SubstackConfig,
  cookie: string,
  title: string,
  subtitle: string,
  tiptapJson: string
): Promise<{ id: number; draft_url: string }> {
  const pubDomain = config.publication_url.replace(/^https?:\/\//, '');
  const res = await fetch(`https://${pubDomain}/api/v1/drafts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({
      draft_title: title,
      draft_subtitle: subtitle,
      draft_body: tiptapJson,
      draft_bylines: [{ id: 321088446, is_guest: false }],
      type: 'newsletter',
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Draft creation failed: ${res.status} ${body.slice(0, 300)}`);
  }
  const json = await res.json() as { id: number };
  return { id: json.id, draft_url: `${config.publication_url}/publish/post/${json.id}` };
}

async function publishDraft(ctx: BrowserContext, draftUrl: string): Promise<void> {
  const page = await ctx.newPage();
  const dialogs: string[] = [];
  page.on('dialog', async d => { dialogs.push(d.message()); await d.accept(); });

  console.log('Opening draft in browser...');
  await page.goto(draftUrl, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  if (dialogs.length) throw new Error(`Editor error: ${dialogs[0]}`);

  console.log('Clicking Continue...');
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.waitForTimeout(2000);

  console.log('Sending to everyone...');
  await page.getByRole('button', { name: /send to everyone now/i }).click();
  await page.waitForTimeout(3000);

  // Handle subscribe button prompt if it appears
  const withoutBtn = page.getByRole('button', { name: /publish without buttons/i });
  if (await withoutBtn.count() > 0) {
    await withoutBtn.click();
    await page.waitForTimeout(4000);
  }

  const finalUrl = page.url();
  const bodyText = await page.locator('body').innerText().catch(() => '');
  await page.close();
  const success = finalUrl.includes('/share-center') || bodyText.includes('Your post is live');
  if (!success) throw new Error(`Publish step did not reach success page (URL: ${finalUrl}). Check Substack manually — post may still have published.`);
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8')) as SubstackConfig;
  const wpCfg = JSON.parse(readFileSync(WP_CONFIG_PATH, 'utf8'));
  const wpSite = wpCfg.sites[wpCfg.active_site] as WordPressSite;
  const workflowDir = join(SCRATCHPAD, workflowId!);

  if (!existsSync(workflowDir)) { console.error(`Workflow not found: ${workflowDir}`); process.exit(1); }
  const cornerstonePath = join(workflowDir, '08-cornerstone-final.md');
  if (!existsSync(cornerstonePath)) { console.error(`Cornerstone not found: ${cornerstonePath}`); process.exit(1); }

  const metaPath = join(workflowDir, 'metadata.json');
  const metadata: WorkflowMetadata = JSON.parse(readFileSync(metaPath, 'utf8'));

  console.log(`\nWorkflow:  ${workflowId}`);
  console.log(`Topic:     ${metadata.topic}`);
  if (dryRun) console.log('[DRY RUN]\n');

  // Parse content — extract title/subtitle BEFORE stripping (strip removes them from body)
  let raw = readFileSync(cornerstonePath, 'utf8');
  const imagePlaceholders = extractImagePlaceholders(raw);

  const titleMatch = raw.match(/^#\s+(.+)$/m);
  const title = titleMatch?.[1]?.trim() ?? metadata.topic;
  const subtitleMatch = raw.match(/^\*([^*\n]+)\*$/m);
  const subtitle = subtitleMatch?.[1]?.trim() ?? '';

  raw = stripPAIMarkup(raw);

  console.log(`Title:     ${title}`);
  console.log(`Subtitle:  ${subtitle}`);
  console.log(`Images:    ${imagePlaceholders.length} placeholder(s)\n`);

  // Resolve WP images
  console.log('Resolving images from WordPress...');
  const imageUrls = await buildImageUrlList(metadata, wpSite, imagePlaceholders);

  // Convert to Tiptap JSON
  console.log('\nConverting markdown → Tiptap JSON...');
  const tiptapJson = markdownToTiptap(raw, imagePlaceholders, imageUrls);
  const nodeCount = JSON.parse(tiptapJson).content.length;
  console.log(`  ${nodeCount} top-level nodes generated.`);

  if (dryRun) {
    console.log('\n[DRY RUN] Tiptap JSON preview (first 600 chars):');
    console.log(tiptapJson.slice(0, 600));
    console.log('\nDone (dry run).');
    return;
  }

  // Auth via Playwright (stored session or fresh login)
  const ctx = await getAuthContext(config);
  const cookie = await getCookieFromContext(ctx);

  // Create draft via API
  console.log('\nCreating Substack draft...');
  const draft = await createSubstackDraft(config, cookie, title, subtitle, tiptapJson);
  console.log(`✓ Draft created: ${draft.draft_url}`);

  // Save draft state to metadata
  metadata.substack = { draft_id: draft.id, draft_url: draft.draft_url, status: 'draft', synced_at: new Date().toISOString() };
  metadata.updated_at = new Date().toISOString();
  writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

  // Publish via Playwright
  console.log('\nPublishing...');
  await publishDraft(ctx, draft.draft_url);

  // Update metadata to published
  metadata.substack.status = 'published';
  metadata.updated_at = new Date().toISOString();
  writeFileSync(metaPath, JSON.stringify(metadata, null, 2));

  console.log('\n✓ Published to Substack!');
  console.log(`  ${draft.draft_url.replace('/publish/post/', '/p/')}`);
  await ctx.browser()?.close();
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
