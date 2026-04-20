#!/usr/bin/env bun

/**
 * Newsletter Publisher: Scratchpad → WordPress newsletter CPT
 *
 * Converts newsletter-final.md → styled HTML, creates a WordPress draft
 * post in the `newsletter` custom post type, sets meta fields, and updates
 * metadata.json with the resulting post ID and URL.
 *
 * Usage:
 *   bun run publish-newsletter-to-wp.ts --workflow-id=2026-02-15-dumb-pipe-phenomenon
 *
 * Workflow doc: Skills/WordPressPublisher/workflows/PublishNewsletter.md
 *
 * Reads credentials from:
 *   ${PAI_DIR}/Skills/WordPressPublisher/config/wordpress-sites.json
 *
 * Reads newsletter content from:
 *   ${PAI_DIR}/../scratchpad/content-create/{workflow-id}/14-newsletter/newsletter-final.md
 *   ${PAI_DIR}/../scratchpad/content-create/{workflow-id}/14-newsletter/issue-meta-final.yaml
 *
 * Writes to:
 *   ${PAI_DIR}/../scratchpad/content-create/{workflow-id}/metadata.json
 *     → adds newsletter_post_id, newsletter_post_url, newsletter_published_at
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, resolve } from 'path';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface WordPressSite {
  url: string;
  username: string;
  password: string;
}

interface WordPressSitesConfig {
  sites: Record<string, WordPressSite>;
  active_site: string;
}

interface IssueMeta {
  issue_metadata?: {
    issue_number?: number;
    recommended_subject?: string;
    subject_line_options?: string[];
    preheader?: string;
  };
  // Allow flat structure too (some yamls use top-level keys)
  issue_number?: number;
  recommended_subject?: string;
  subject_line_options?: string[];
  preheader?: string;
}

interface WPPostResponse {
  id: number;
  link: string;
  slug: string;
  status: string;
  title: { rendered: string };
}

// ---------------------------------------------------------------------------
// Brand style constants — matches BrandHTMLConverter exactly
// ---------------------------------------------------------------------------

// ink: #3b546b  paper: #ece6d9  slate: #7a8c9b  rust: #cf5828  text: #2b2b2b
const B = {
  ink:       '#3b546b',
  paper:     '#ece6d9',
  rust:      '#cf5828',
  slate:     '#7a8c9b',
  text:      '#2b2b2b',
  rule:      'rgba(59,84,107,.22)',
  ruleMed:   'rgba(59,84,107,.5)',
  ctaBg:     'rgba(59,84,107,.92)',
  ctaText:   'rgba(255,255,255,.88)',
  ctaLabel:  'rgba(236,230,217,.85)',  // paper-tinted on dark bg
  labelClr:  'rgba(59,84,107,.85)',
  font:      "Montserrat,'Helvetica Neue',Arial,sans-serif",
  serif:     "Lora,Georgia,'Times New Roman',serif",
};

// ---------------------------------------------------------------------------
// Section icons — Lucide SVG paths, inline for WordPress compatibility
// ---------------------------------------------------------------------------

function icon(paths: string, color: string, size = 16): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;vertical-align:middle;">${paths}</svg>`;
}

const ICONS: Record<string, string> = {
  'tl;dr':          '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'quick win':      '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  'myth':           '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
  'metric':         '<line x1="18" x2="18" y1="20" y2="4"/><line x1="12" x2="12" y1="20" y2="14"/><line x1="6" x2="6" y1="20" y2="9"/>',
  'case study':     '<rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'forward':        '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  'tool spotlight': '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  'trend radar':    '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  'culture':        '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
};

function getIcon(sectionKey: string, color: string, size = 16): string {
  const paths = Object.entries(ICONS).find(([k]) => sectionKey.includes(k))?.[1] ?? '';
  return paths ? icon(paths, color, size) : '';
}

// ---------------------------------------------------------------------------
// Branded header + footer
// ---------------------------------------------------------------------------

/**
 * Header: newsletter title + optional formula image in navy block.
 * The "Formula for Acceleration" alchemy image lives here.
 * Issue-specific newsletter hero image is in the white intro section below.
 */
function buildNewsletterHeader(formulaImageUrl?: string): string {
  const imageHtml = formulaImageUrl
    ? `\n<img src="${formulaImageUrl}" alt="Formula for Acceleration" class="nl-formula-img" style="max-width:300px;width:55%;border-radius:8px;margin:18px auto 0;display:block;opacity:.9;">`
    : '';
  return `<div class="nl-header" style="background:${B.ink};border-radius:10px 10px 0 0;padding:32px 40px 28px;text-align:center;"><p class="nl-header-title" style="font-family:${B.font};font-size:1.9em;font-weight:800;color:#fff;letter-spacing:.04em;line-height:1.2;margin:0;text-transform:uppercase;">THE AI ACCELERATION<br>FLYWHEEL NEWSLETTER</p>${imageHtml}</div>
<div style="background:${B.rust};height:3px;margin:0;"></div>`;
}

function buildNewsletterFooter(): string {
  return `<div class="nl-footer" style="background:${B.ink};padding:28px 40px;text-align:center;margin-top:0;">
<p style="font-family:${B.font};font-size:.68em;font-weight:600;text-transform:uppercase;letter-spacing:.22em;color:#fff;margin:0 0 4px;text-align:center;">The Acceleration Flywheel</p>
<p style="font-family:${B.font};font-size:1em;font-weight:700;color:#fff;letter-spacing:.06em;margin:0 0 8px;text-align:center;">ALVIS HOUSE</p>
<p style="color:rgba(236,230,217,.65);font-size:.82em;font-style:italic;margin:0 0 18px;text-align:center;">High-signal intelligence. Zero hype.</p>
<div style="background:rgba(255,255,255,.1);height:1px;margin:0 0 18px;"></div>
<p style="font-family:${B.font};font-size:.7em;color:rgba(236,230,217,.5);margin:0;text-align:center;">
  <a href="https://alvishouse.io" style="color:rgba(236,230,217,.65);text-decoration:none;">alvishouse.io</a>
  &nbsp;&middot;&nbsp;
  <a href="{{unsubscribe_url}}" style="color:rgba(236,230,217,.5);text-decoration:none;">Unsubscribe</a>
</p>
</div>`;
}

// ---------------------------------------------------------------------------
// Markdown → HTML conversion
// ---------------------------------------------------------------------------

interface ConvertOptions {
  formulaImageUrl?:      string;   // "Formula for Acceleration" alchemy image in navy header
  heroImageUrl?:         string;   // Issue-specific alchemy hero image in white intro section
  mythInfographicUrl?:   string;   // Myth vs Reality comparison infographic (inside Myth card)
  metricInfographicUrl?: string;   // Metric That Matters infographic (inside Metric card)
  issueNumber?:          number | null;
  issueDate?:            string;
  webTitle?:             string;   // Overrides the H1 inside the newsletter body (outcome-focused headline for web readers)
}

/**
 * Converts newsletter markdown to WordPress-ready HTML using the brand system.
 *
 * Layout:
 *   [Branded header — ALVIS HOUSE / Acceleration Flywheel / issue #]
 *   [Rust accent bar]
 *   [WHITE intro section — H1 title (32px) + intro paragraphs]
 *   [TAN content section — hero image + section cards]
 *     [Section title (32px, ink/rust) ABOVE card]
 *     [White card — TL;DR, Myth vs Reality, Quick Win, Metric, Case Study, Forward CTA]
 *   [Branded footer — motto / alvishouse.io / unsubscribe]
 *
 * Section → card accent mapping (all cards white):
 *   TL;DR / Quick Win  → left border ink (callout treatment)
 *   Myth vs Reality    → full ink border (framework box)
 *   Metric That Matters → standard ink border + optional infographic
 *   Case Study         → standard ink border
 *   Forward CTA/This   → rust top border (title in rust)
 *   Tool Spotlight     → dashed ink border
 *   Trend / Culture    → standard ink border
 */
function convertNewsletterToHTML(markdown: string, opts: ConvertOptions = {}): string {
  let content = markdown;

  // Strip YAML front matter (--- ... ---)
  content = content.replace(/^---[\s\S]*?---\n?/, '');

  const lines = content.split('\n');
  const outputParts: string[] = [];

  // Header includes formula image (if provided) + issue-specific hero in white section below
  const header = buildNewsletterHeader(opts.formulaImageUrl);
  const footer = buildNewsletterFooter();

  // Layout state: white intro section until first HR, then tan content section
  let inIntroSection = true;

  // Open white intro section
  outputParts.push(`<div class="nl-intro" style="background:#fff;padding:36px 40px 32px;">`);

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // --- Horizontal rules ---
    if (/^---+$/.test(line.trim())) {
      if (inIntroSection) {
        // Inject issue-specific newsletter hero image INSIDE white section (before closing)
        if (opts.heroImageUrl) {
          outputParts.push(
            `<img src="${opts.heroImageUrl}" alt="Newsletter hero" style="width:100%;border-radius:12px;margin:1.5em 0 0;display:block;">`
          );
        } else {
          outputParts.push(`<!-- NEWSLETTER_HERO_SLOT: Run Art skill (alchemy style) → upload to WP → re-run with --hero-image=<wp-url> -->`);
        }
        // Close white intro section; open tan content section
        outputParts.push(`</div>`);
        outputParts.push(`<div class="nl-content" style="background:${B.paper};padding:32px 40px 40px;">`);
        inIntroSection = false;
      }
      // HRs within the tan section are skipped — section cards provide spacing
      i++;
      continue;
    }

    // --- H1: Newsletter title — large centered heading in white intro section ---
    const h1Match = line.match(/^# (.+)$/);
    if (h1Match) {
      // If a webTitle override is provided, use it as the H1 and auto-generate the issue/date subtitle.
      // Otherwise fall back to parsing the markdown title for em-dash split.
      if (opts.webTitle) {
        const issuePart = [
          opts.issueNumber ? `Issue #${opts.issueNumber}` : '',
          opts.issueDate ? new Date(opts.issueDate + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '',
        ].filter(Boolean).join(' \u00b7 ');
        outputParts.push(
          `<h1 style="font-family:${B.font};font-size:32px;font-weight:700;color:${B.ink};text-align:center;margin:0 0 6px;line-height:1.2;letter-spacing:-.01em;">${inlineFormat(opts.webTitle)}</h1>` +
          (issuePart ? `<p style="font-family:${B.font};font-size:.75em;font-weight:700;color:#000000;text-align:center;text-transform:uppercase;letter-spacing:.1em;margin:0 0 22px;">${issuePart}</p>` : '')
        );
      } else {
        const fullTitle = h1Match[1];
        // Split at em-dash to separate newsletter name from issue/date info
        const dashIdx = fullTitle.indexOf('\u2014'); // em-dash
        if (dashIdx > 0) {
          const mainTitle = fullTitle.slice(0, dashIdx).trim();
          const issuePart = fullTitle.slice(dashIdx + 1).trim().replace(/\|/g, '\u00b7'); // | → ·
          outputParts.push(
            `<h1 style="font-family:${B.font};font-size:32px;font-weight:700;color:${B.ink};text-align:center;margin:0 0 6px;line-height:1.2;letter-spacing:-.01em;">${inlineFormat(mainTitle)}</h1>` +
            `<p style="font-family:${B.font};font-size:.75em;font-weight:700;color:#000000;text-align:center;text-transform:uppercase;letter-spacing:.1em;margin:0 0 22px;">${inlineFormat(issuePart)}</p>`
          );
        } else {
          outputParts.push(
            `<h1 style="font-family:${B.font};font-size:32px;font-weight:700;color:${B.ink};text-align:center;margin:0 0 22px;line-height:1.2;">${inlineFormat(fullTitle)}</h1>`
          );
        }
      }
      i++;
      continue;
    }

    // --- H2: Named section headings → title-above + white card ---
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      const sectionTitle = h2Match[1].trim();
      const sectionHTML = buildSectionWrapper(sectionTitle, lines, i, opts.metricInfographicUrl, opts.mythInfographicUrl);
      outputParts.push(sectionHTML.html);
      i = sectionHTML.nextIndex;
      continue;
    }

    // --- H3: subsection (ink, Montserrat) ---
    const h3Match = line.match(/^### (.+)$/);
    if (h3Match) {
      outputParts.push(
        `<h3 style="font-family:${B.font};font-size:1.25em;font-weight:700;margin:2em 0 .6em;color:${B.ink};">${inlineFormat(h3Match[1])}</h3>`
      );
      i++;
      continue;
    }

    // --- Unordered lists ---
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li style="margin:.5em 0;">${inlineFormat(lines[i].replace(/^[-*] /, ''))}</li>`);
        i++;
      }
      outputParts.push(`<ul style="padding-left:1.5em;margin:1em 0;font-size:20px;">${items.join('')}</ul>`);
      continue;
    }

    // --- Ordered lists ---
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li style="margin:.5em 0;">${inlineFormat(lines[i].replace(/^\d+\. /, ''))}</li>`);
        i++;
      }
      outputParts.push(`<ol style="padding-left:1.5em;margin:1em 0;font-size:20px;">${items.join('')}</ol>`);
      continue;
    }

    // --- Empty line ---
    if (line.trim() === '') {
      i++;
      continue;
    }

    // --- Regular paragraph ---
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,3} /.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      // Extra top margin for paragraphs in the tan section (trailing footer disclaimer text)
      const marginTop = inIntroSection ? '0' : '3em';
      outputParts.push(
        `<p class="nl-para" style="margin:${marginTop} 0 1.5em;line-height:1.8;color:${B.text};font-size:20px;">${inlineFormat(paraLines.join(' '))}</p>`
      );
    }
  }

  // Close the last open section div
  outputParts.push(`</div>`);

  // Three-tier responsive style block:
  //   Phone  : ≤480px  — full-width card, compact sizing
  //   Tablet : 481–900px — intermediate sizing, closer to desktop
  //   Desktop: >900px   — inline styles (no overrides needed)
  const mobileStyles = `<style>
@media(max-width:480px){
  .nl-outer{padding:0 !important;}
  .nl-card{border-radius:0 !important;}
  .nl-header{padding:22px 20px 18px !important;border-radius:0 !important;}
  .nl-header-title{font-size:1.35em !important;letter-spacing:.02em !important;}
  .nl-formula-img{width:72% !important;max-width:240px !important;margin-top:14px !important;}
  .nl-intro{padding:22px 20px 20px !important;}
  .nl-content{padding:16px 10px 28px !important;}
  .nl-section-title-row{margin:1.4em 0 .5em !important;}
  .nl-section-title{font-size:22px !important;}
  .nl-card-inner{padding:16px 14px !important;}
  .nl-infographic{width:100% !important;height:190px !important;object-fit:contain !important;background:#f6efd8 !important;border-radius:6px !important;}
  .nl-para{font-size:17px !important;}
  .nl-footer{padding:22px 20px !important;border-radius:0 !important;}
}
@media(min-width:481px) and (max-width:900px){
  /* Tablet: keep desktop font sizes — only reduce padding to reclaim width.
     The WP theme + admin chrome shrinks the effective content area to ~420-500px,
     so horizontal padding must be tight to avoid cramping content. */
  .nl-outer{padding:20px 6px !important;}
  .nl-card{border-radius:10px !important;}
  .nl-header{padding:28px 22px 22px !important;}
  .nl-header-title{font-size:1.75em !important;}
  .nl-formula-img{width:62% !important;max-width:290px !important;}
  .nl-intro{padding:28px 22px 24px !important;}
  .nl-content{padding:24px 14px 32px !important;}
  .nl-section-title-row{margin:1.8em 0 .7em !important;}
  .nl-section-title{font-size:30px !important;}
  .nl-card-inner{padding:20px 18px !important;}
  .nl-infographic{width:100% !important;height:280px !important;object-fit:contain !important;background:#f6efd8 !important;border-radius:7px !important;}
  .nl-para{font-size:19px !important;}
  .nl-footer{padding:24px 22px !important;}
}
</style>`;

  // Two-layer wrapper:
  // 1. Outer "page" div — full-width, own background color, padding top/bottom.
  //    Overrides WP theme's dark background so header/footer can't bleed into site chrome.
  // 2. Inner "card" div — max-width 680px, centered, rounded corners, shadow.
  return [
    mobileStyles,
    `<div class="nl-outer" style="background:#d8d2c6;padding:48px 20px;">`,
    `<div class="nl-card" style="max-width:680px;margin:0 auto;border-radius:12px;overflow:hidden;box-shadow:0 6px 40px rgba(0,0,0,.22);">`,
    header,
    outputParts.join('\n'),
    footer,
    `</div>`,
    `</div>`,
  ].join('\n');
}

/**
 * Render a newsletter section as: large title (ABOVE card) + white card below.
 *
 * All cards are white (#fff) — the tan page background creates contrast.
 * Cards are differentiated by border accent:
 *   TL;DR / Quick Win  → left accent border in ink
 *   Myth vs Reality    → full ink border (thicker)
 *   Metric That Matters → standard ink border + optional infographic
 *   Case Study         → standard ink border
 *   Forward CTA/This   → rust top border (title also in rust)
 *   Tool Spotlight     → dashed ink border
 *   Default            → standard ink border
 *
 * Title sits ABOVE the card at 32px Montserrat bold in ink (or rust for Forward).
 */
function buildSectionWrapper(
  sectionTitle: string,
  lines: string[],
  startIndex: number,
  metricInfographicUrl?: string,
  mythInfographicUrl?: string
): { html: string; nextIndex: number } {
  const t = sectionTitle.toLowerCase();

  // Accent color for title and card border
  const isForward = t.includes('forward');
  const titleColor = isForward ? B.rust : B.ink;

  // White card border — subtle differentiation by section type
  let cardBorder: string;
  if (isForward) {
    cardBorder = `border:1px solid rgba(207,88,40,.25);border-top:3px solid ${B.rust};`;
  } else if (t.includes('tl;dr') || t.includes('quick win')) {
    cardBorder = `border:1px solid rgba(59,84,107,.14);border-left:4px solid ${B.ink};`;
  } else if (t.includes('myth')) {
    cardBorder = `border:2px solid rgba(59,84,107,.22);`;
  } else if (t.includes('tool spotlight')) {
    cardBorder = `border:1.5px dashed rgba(59,84,107,.35);`;
  } else {
    cardBorder = `border:1px solid rgba(59,84,107,.14);`;
  }

  const cardStyle = `background:#fff;border-radius:12px;padding:24px 28px;${cardBorder}box-shadow:0 2px 8px rgba(59,84,107,.07);`;

  // Collect section body lines — stop at next ## heading, # heading, or section HR
  const bodyLines: string[] = [];
  let j = startIndex + 1;
  while (
    j < lines.length &&
    !/^## /.test(lines[j]) &&
    !/^# /.test(lines[j]) &&
    !/^---+$/.test(lines[j].trim())
  ) {
    bodyLines.push(lines[j]);
    j++;
  }

  const bodyHTML = convertBodyLines(bodyLines, false);

  // Infographic slots — Myth vs Reality comparison and Metric That Matters
  let infographicHTML = '';
  if (t.includes('myth')) {
    if (mythInfographicUrl) {
      infographicHTML = `<img src="${mythInfographicUrl}" alt="Myth vs Reality Infographic" class="nl-infographic" style="width:100%;border-radius:8px;margin:0 0 1.5em;display:block;">`;
    } else {
      infographicHTML = `<!-- MYTH_INFOGRAPHIC_SLOT: Run Infographic skill → upload to WP → re-run with --myth-infographic=<wp-url> -->`;
    }
  } else if (t.includes('metric')) {
    if (metricInfographicUrl) {
      infographicHTML = `<img src="${metricInfographicUrl}" alt="Metric That Matters Infographic" class="nl-infographic" style="width:100%;border-radius:8px;margin:0 0 1.5em;display:block;">`;
    } else {
      infographicHTML = `<!-- METRIC_INFOGRAPHIC_SLOT: Run Infographic skill → upload to WP → re-run with --metric-infographic=<wp-url> -->`;
    }
  }

  // Icon box: rounded square with white icon — blue for most, orange for Forward This
  const iconBoxBg = isForward ? B.rust : B.ink;
  const iconSvg   = getIcon(t, '#fff', 26);
  const iconBox   = iconSvg
    ? `<span style="background:${iconBoxBg};border-radius:10px;padding:9px;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">${iconSvg}</span>`
    : '';

  // Display title — strip semicolons (TL;DR → TL DR)
  const displayTitle = sectionTitle.replace(/;/g, ' ').replace(/\s+/g, ' ').trim();

  // Title row: icon box + section name (ABOVE the white card)
  const titleRow =
    `<div class="nl-section-title-row" style="display:flex;align-items:center;gap:12px;margin:2em 0 .75em;padding:0;">` +
    `${iconBox}` +
    `<span class="nl-section-title" style="font-family:${B.font};font-size:32px;font-weight:700;color:${titleColor};line-height:1;">${inlineFormat(displayTitle)}</span>` +
    `</div>`;

  // White card with content
  const card = `<div class="nl-card-inner" style="${cardStyle}">${infographicHTML}${bodyHTML}</div>`;

  return { html: titleRow + card, nextIndex: j };
}

/**
 * Convert section body lines to HTML.
 */
function convertBodyLines(lines: string[], dark = false): string {
  const pColor = dark ? B.ctaText : B.text;
  const hrColor = dark ? 'rgba(255,255,255,.15)' : B.rule;
  const parts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^---+$/.test(line.trim())) {
      parts.push(`<hr style="border:none;border-top:1px solid ${hrColor};margin:1em 0;">`);
      i++;
      continue;
    }

    if (/^### /.test(line)) {
      parts.push(
        `<p style="font-family:${B.font};font-size:.9em;font-weight:600;text-transform:uppercase;letter-spacing:.08em;color:${dark ? B.ctaLabel : B.rust};margin:1.2em 0 .4em;">${inlineFormat(line.replace(/^### /, ''))}</p>`
      );
      i++;
      continue;
    }

    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li style="margin:.5em 0;">${inlineFormat(lines[i].replace(/^[-*] /, ''))}</li>`);
        i++;
      }
      parts.push(`<ul style="padding-left:1.5em;margin:.75em 0;color:${pColor};font-size:20px;">${items.join('')}</ul>`);
      continue;
    }

    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li style="margin:.5em 0;">${inlineFormat(lines[i].replace(/^\d+\. /, ''))}</li>`);
        i++;
      }
      parts.push(`<ol style="padding-left:1.5em;margin:.75em 0;color:${pColor};font-size:20px;">${items.join('')}</ol>`);
      continue;
    }

    if (line.trim() === '') {
      i++;
      continue;
    }

    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,3} /.test(lines[i]) &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      parts.push(
        `<p class="nl-para" style="margin:0 0 1em;line-height:1.8;color:${pColor};font-size:20px;">${inlineFormat(paraLines.join(' '))}</p>`
      );
    }
  }

  return parts.join('\n');
}

/**
 * Apply inline markdown formatting: **bold**, *italic*, `code`, [link](url)
 * Links use ink color (not blue) to match brand system.
 */
function inlineFormat(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${B.ink};">$1</strong>`)
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, `<code style="background:${B.paper};padding:.1em .4em;border-radius:3px;font-size:.9em;color:${B.ink};">$1</code>`)
    .replace(/\[(.+?)\]\((.+?)\)/g, `<a href="$2" style="color:${B.ink};text-decoration:underline;">$1</a>`);
}

/**
 * Build a 2-3 sentence plain-text excerpt from the newsletter body.
 * Strips all markdown syntax.
 */
function buildExcerpt(markdown: string): string {
  // Strip YAML front matter
  let content = markdown.replace(/^---[\s\S]*?---\n?/, '');

  // Find the first real paragraph after the title and any HR
  const lines = content.split('\n').filter(l => l.trim() !== '');
  const textLines: string[] = [];

  for (const line of lines) {
    if (/^#/.test(line)) continue;         // skip headings
    if (/^---+$/.test(line.trim())) continue; // skip HRs
    if (/^[-*] /.test(line)) continue;     // skip list starters
    if (/^\d+\. /.test(line)) continue;    // skip numbered list starters

    // Strip inline markdown
    const clean = line
      .replace(/\*\*(.+?)\*\*/g, '$1')
      .replace(/\*(.+?)\*/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .trim();

    if (clean.length > 20) {
      textLines.push(clean);
      if (textLines.length >= 3) break;
    }
  }

  return textLines.slice(0, 2).join(' ');
}

// ---------------------------------------------------------------------------
// YAML parser (minimal — for issue-meta-final.yaml)
// ---------------------------------------------------------------------------

/**
 * Very lightweight YAML reader. Handles the flat key: value pairs and
 * simple nested objects we need. Not a full YAML parser.
 */
function parseSimpleYaml(yamlText: string): Record<string, any> {
  const result: Record<string, any> = {};
  const lines = yamlText.split('\n');
  let currentKey: string | null = null;
  let currentObj: Record<string, any> | null = null;

  for (const rawLine of lines) {
    const line = rawLine;
    if (line.trim() === '' || line.trim().startsWith('#')) continue;

    // Detect nesting level by indentation
    const indent = line.search(/\S/);

    if (indent === 0) {
      // Top-level key
      const match = line.match(/^(\w[\w_]*)\s*:\s*(.*)$/);
      if (match) {
        const key = match[1];
        const val = match[2].trim();
        if (val === '' || val === '{}') {
          currentKey = key;
          currentObj = {};
          result[key] = currentObj;
        } else if (val.startsWith('[')) {
          // Inline array — strip brackets, split by comma
          result[key] = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
          currentKey = null;
          currentObj = null;
        } else {
          result[key] = val.replace(/^["']|["']$/g, '');
          currentKey = null;
          currentObj = null;
        }
      }
    } else if (indent > 0 && currentObj !== null) {
      // Nested key under currentKey
      const match = line.match(/^\s+(\w[\w_]*)\s*:\s*(.*)$/);
      if (match) {
        const key = match[1];
        const val = match[2].trim();
        if (val === '') {
          // nested array follows — handled below
        } else if (val.startsWith('[')) {
          currentObj[key] = val.replace(/^\[|\]$/g, '').split(',').map(s => s.trim().replace(/^["']|["']$/g, ''));
        } else {
          currentObj[key] = val.replace(/^["']|["']$/g, '');
        }
      }
      // Array item under nested key
      const listMatch = line.match(/^\s+- (.+)$/);
      if (listMatch && currentKey) {
        // Find or create array key named after parent nesting
        // (simplified — attaches to last string-type key in currentObj)
        const lastKey = Object.keys(currentObj).pop();
        if (lastKey && currentObj[lastKey] === '') {
          currentObj[lastKey] = [];
        }
        const lastKey2 = Object.keys(currentObj).pop();
        if (lastKey2 && Array.isArray(currentObj[lastKey2])) {
          currentObj[lastKey2].push(listMatch[1].replace(/^["']|["']$/g, ''));
        }
      }
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// WordPress REST API helpers
// ---------------------------------------------------------------------------

async function wpPost(
  site: WordPressSite,
  endpoint: string,
  body: Record<string, any>,
  method: 'POST' | 'PUT' | 'PATCH' = 'POST'
): Promise<any> {
  const credentials = Buffer.from(`${site.username}:${site.password}`).toString('base64');
  const url = `${site.url}/wp-json/wp/v2/${endpoint}`;

  const response = await fetch(url, {
    method,
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();

  if (!response.ok) {
    throw new Error(`WP API error ${response.status} on ${method} ${url}:\n${text}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const workflowIdArg = args.find(arg => arg.startsWith('--workflow-id=') || arg.startsWith('--workflow-id'));

  if (!workflowIdArg) {
    console.error('Usage: publish-newsletter-to-wp.ts --workflow-id=<workflow-id> [options]');
    console.error('');
    console.error('Options:');
    console.error('  --workflow-id=<id>             Required. Workflow directory slug.');
    console.error('  --formula-image=<url>          Optional. "Formula for Acceleration" image in header.');
    console.error('  --hero-image=<url>             Optional. Campaign LinkedIn image (napkin/excalidraw/opening-wound).');
    console.error('  --myth-infographic=<url>       Optional. Myth vs Reality infographic URL.');
    console.error('  --metric-infographic=<url>     Optional. Metric That Matters infographic URL.');
    console.error('  --web-title=<headline>         Optional. Outcome-focused headline for web/search readers.');
    console.error('                                   Issue # + date are prepended automatically.');
    console.error('                                   Replaces H1 in body and WP post title.');
    console.error('                                   Default: falls back to email subject line.');
    console.error('  --preview                      Write HTML preview to scratchpad, skip WP post.');
    console.error('  --force                        Re-publish even if already published.');
    console.error('');
    console.error('Example:');
    console.error('  publish-newsletter-to-wp.ts --workflow-id=2026-02-15-dumb-pipe-phenomenon \\');
    console.error('    --formula-image=formula-acceleration.jpg --hero-image=newsletter-hero.png \\');
    console.error('    --myth-infographic=myth-vs-reality.png --metric-infographic=metric-that-matters.png \\');
    console.error('    --preview');
    process.exit(1);
  }

  const workflowId = workflowIdArg.includes('=') ? workflowIdArg.split('=')[1] : args[args.indexOf(workflowIdArg) + 1];

  // Optional image URLs and flags
  const previewMode            = args.includes('--preview');
  const formulaImageArg        = args.find(a => a.startsWith('--formula-image='));
  const heroImageArg           = args.find(a => a.startsWith('--hero-image='));
  const mythInfographicArg     = args.find(a => a.startsWith('--myth-infographic='));
  const metricInfographicArg   = args.find(a => a.startsWith('--metric-infographic='));
  const webTitleArg            = args.find(a => a.startsWith('--web-title='));
  const formulaImageUrl        = formulaImageArg        ? formulaImageArg.split('=').slice(1).join('=')        : undefined;
  const heroImageUrl           = heroImageArg           ? heroImageArg.split('=').slice(1).join('=')           : undefined;
  const mythInfographicUrl     = mythInfographicArg     ? mythInfographicArg.split('=').slice(1).join('=')     : undefined;
  const metricInfographicUrl   = metricInfographicArg   ? metricInfographicArg.split('=').slice(1).join('=')   : undefined;
  const webTitleOverride       = webTitleArg            ? webTitleArg.split('=').slice(1).join('=')            : undefined;

  if (previewMode)            console.log('Mode:               PREVIEW (no WP post)');
  if (formulaImageUrl)        console.log(`Formula image:      ${formulaImageUrl}`);
  if (heroImageUrl)           console.log(`Hero image:         ${heroImageUrl}`);
  if (mythInfographicUrl)     console.log(`Myth infographic:   ${mythInfographicUrl}`);
  if (metricInfographicUrl)   console.log(`Metric infographic: ${metricInfographicUrl}`);
  // Resolve to the .claude directory (where Skills/, config/, etc live).
  // The tool lives at .claude/Skills/WordPressPublisher/tools/ → 3 levels up = .claude/
  const paiDir = resolve(import.meta.dir, '../../..');

  const workflowDir = join(paiDir, '..', 'scratchpad', 'content-create', workflowId);
  const newsletterDir = join(workflowDir, '14-newsletter');
  const newsletterMdPath = join(newsletterDir, 'newsletter-final.md');
  const issueMetaPath = join(newsletterDir, 'issue-meta-final.yaml');
  const metadataPath = join(workflowDir, 'metadata.json');
  const sitesConfigPath = join(paiDir, 'Skills', 'WordPressPublisher', 'config', 'wordpress-sites.json');

  // --- Validate required files ---
  const checks: [string, string][] = [
    [workflowDir, 'Workflow directory'],
    [newsletterDir, '14-newsletter/ directory'],
    [newsletterMdPath, 'newsletter-final.md'],
    [issueMetaPath, 'issue-meta-final.yaml'],
    [metadataPath, 'metadata.json'],
    [sitesConfigPath, 'wordpress-sites.json'],
  ];

  for (const [path, label] of checks) {
    if (!existsSync(path)) {
      console.error(`ERROR: ${label} not found at: ${path}`);
      process.exit(1);
    }
  }

  // --- Load config ---
  const sitesConfig: WordPressSitesConfig = JSON.parse(readFileSync(sitesConfigPath, 'utf-8'));
  const site = sitesConfig.sites[sitesConfig.active_site];
  if (!site) {
    console.error(`ERROR: Active site "${sitesConfig.active_site}" not found in wordpress-sites.json`);
    process.exit(1);
  }

  // --- Load newsletter content ---
  const newsletterMd = readFileSync(newsletterMdPath, 'utf-8');
  const issueMetaRaw = readFileSync(issueMetaPath, 'utf-8');
  const metadata = JSON.parse(readFileSync(metadataPath, 'utf-8'));

  // --- Check not already published (skip in preview mode) ---
  if (!previewMode && metadata['newsletter_post_id'] && !args.includes('--force')) {
    console.log(`\nNewsletter already published for this workflow.`);
    console.log(`  Post ID: ${metadata['newsletter_post_id']}`);
    console.log(`  URL: ${metadata['newsletter_post_url']}`);
    console.log(`\nRe-run with --force to overwrite (not recommended).`);
    process.exit(0);
  }

  // --- Parse issue metadata ---
  // Use regex extraction — handles both flat YAML and deeply-nested issue_final structure.
  function yamlField(text: string, key: string): string {
    const m = text.match(new RegExp(`(?:^|\\n)\\s*${key}:\\s*["']?([^"'\\n#]+)["']?`));
    return m ? m[1].trim() : '';
  }

  // Subject: try issue_final.subject_line.selected, then flat keys, then md front matter
  const subjectLine =
    yamlField(issueMetaRaw, 'selected') ||
    yamlField(issueMetaRaw, 'recommended_subject') ||
    yamlField(newsletterMd, 'subject') ||
    'Newsletter Issue';

  // Preheader: try issue_final.preheader.text, then flat preheader, then md front matter
  const preheader =
    yamlField(issueMetaRaw, 'text') ||
    yamlField(issueMetaRaw, 'preheader') ||
    yamlField(newsletterMd, 'preheader') ||
    '';

  // Issue number: try issue_final.issue_number, then flat, then md front matter
  const issueNumStr =
    yamlField(issueMetaRaw, 'issue_number') ||
    yamlField(newsletterMd, 'issue_number') ||
    '';
  const issueNumber = issueNumStr ? parseInt(issueNumStr, 10) : null;

  // --- Build newsletter title ---
  // --web-title overrides the default pattern. Pass the compelling outcome-focused headline
  // (e.g. "What Caused the Six-Hour Amazon Outage That Wiped Out 6.3 Million Orders").
  // The issue label and date are always prepended automatically.
  const issueLabel = issueNumber ? `Issue #${issueNumber}` : 'Latest Issue';
  const issueDateStr = yamlField(issueMetaRaw, 'issue_date') || '';
  const issueDateFormatted = issueDateStr
    ? new Date(issueDateStr + 'T12:00:00Z').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : '';
  const issuePrefix = issueDateFormatted ? `${issueLabel} — ${issueDateFormatted}` : issueLabel;
  const webHeadline = webTitleOverride || subjectLine;
  const postTitle = `${issuePrefix}: ${webHeadline}`;

  // --- Convert markdown to HTML ---
  console.log('\nConverting newsletter markdown to HTML...');
  const htmlContent = convertNewsletterToHTML(newsletterMd, {
    formulaImageUrl,
    heroImageUrl,
    mythInfographicUrl,
    metricInfographicUrl,
    issueNumber,
    issueDate: issueDateStr,
    webTitle: webTitleOverride,
  });
  const excerpt = buildExcerpt(newsletterMd);

  // --- Preview mode: write HTML to scratchpad and exit ---
  if (previewMode) {
    const previewPath = join(paiDir, '..', 'scratchpad', 'newsletter-preview-v5.html');
    // htmlContent already includes the outer card wrapper (max-width:680px, border-radius, shadow)
    // htmlContent carries its own outer page background (#d8d2c6) and card wrapper —
    // the body here just provides a reset and font stack.
    const previewHtml = `<!DOCTYPE html>
<html><head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Lora:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet">
  <style>
    * { margin:0;padding:0;box-sizing:border-box; }
    body { margin:0;font-family:Montserrat,'Helvetica Neue',Arial,sans-serif; }
  </style>
</head><body>${htmlContent}</body></html>`;
    writeFileSync(previewPath, previewHtml);
    console.log(`\nPreview written to: ${previewPath}`);
    console.log('\nTo open in Windows: copy to /mnt/c/Users/alvis/Documents/ and open with browser.');
    process.exit(0);
  }

  // --- Build slug ---
  const slugBase = workflowId.replace(/^\d{4}-\d{2}-\d{2}-/, ''); // strip date prefix
  const issueSlug = issueNumber ? `newsletter-issue-${issueNumber}-${slugBase}` : `newsletter-${slugBase}`;

  // --- Create WordPress newsletter draft ---
  console.log(`\nCreating WordPress newsletter draft at ${site.url}...`);
  console.log(`  Title: ${postTitle}`);
  console.log(`  Slug: ${issueSlug}`);

  let wpPost_result: WPPostResponse;
  try {
    wpPost_result = await wpPost(site, 'newsletter', {
      title: postTitle,
      content: htmlContent,
      excerpt: excerpt,
      status: 'draft',
      slug: issueSlug,
    });
  } catch (err) {
    console.error('\nERROR creating WordPress newsletter post:');
    console.error(err instanceof Error ? err.message : err);
    process.exit(1);
  }

  const postId = wpPost_result.id;
  const postUrl = wpPost_result.link;

  console.log(`  Created: ID ${postId}, URL: ${postUrl}`);

  // --- Set newsletter meta fields ---
  console.log('\nSetting newsletter meta fields (subject, preheader, issue #)...');

  const metaPayload: Record<string, any> = {};
  if (subjectLine) metaPayload['newsletter_subject'] = subjectLine;
  if (preheader) metaPayload['newsletter_preheader'] = preheader;
  if (issueNumber) metaPayload['newsletter_issue_number'] = issueNumber;

  if (Object.keys(metaPayload).length > 0) {
    try {
      await wpPost(site, `newsletter/${postId}`, { meta: metaPayload }, 'POST');
      console.log('  Meta fields set successfully.');
    } catch (err) {
      // Non-fatal — meta fields can be set manually in WP admin
      console.warn('  WARNING: Could not set meta fields automatically. Set them manually in WP admin.');
      console.warn(`  Error: ${err instanceof Error ? err.message : err}`);
    }
  }

  // --- Update metadata.json ---
  metadata['newsletter_post_id'] = postId;
  metadata['newsletter_post_url'] = postUrl;
  metadata['newsletter_published_at'] = new Date().toISOString();
  if (!metadata['step-14']) metadata['step-14'] = {};
  metadata['step-14']['newsletter_post_id'] = postId;
  metadata['step-14']['newsletter_post_url'] = postUrl;

  writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
  console.log('\nmetadata.json updated with newsletter_post_id and newsletter_post_url.');

  // --- Print next steps ---
  console.log('\n' + '='.repeat(60));
  console.log('NEWSLETTER DRAFT CREATED SUCCESSFULLY');
  console.log('='.repeat(60));
  console.log(`\n  Post ID:    ${postId}`);
  console.log(`  Draft URL:  ${postUrl}`);
  console.log(`  Subject:    ${subjectLine}`);
  if (preheader) console.log(`  Preheader:  ${preheader}`);
  if (issueNumber) console.log(`  Issue #:    ${issueNumber}`);
  console.log('\nNEXT STEPS:');
  console.log('  1. Review draft in WordPress admin (optional)');
  console.log('     Admin: ' + site.url + '/wp-admin/');
  console.log('  2. When ready to publish + send to Brevo:');
  console.log('     Change status to "publish" in WP admin');
  console.log('     — OR run:');
  console.log(`     PAI: "publish newsletter ${postId}"`);
  console.log('  3. Brevo campaign draft will be auto-created on publish');
  console.log('  4. Click "Send to Subscribers" in WP admin metabox when ready');
  console.log('');
}

main().catch(err => {
  console.error('Fatal error:', err instanceof Error ? err.message : err);
  process.exit(1);
});
