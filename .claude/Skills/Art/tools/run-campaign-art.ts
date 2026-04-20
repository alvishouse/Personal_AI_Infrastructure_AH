#!/usr/bin/env bun
/**
 * run-campaign-art — Orchestrate full art pipeline for a LinkedIn content campaign
 *
 * Runs 4 phases for posts 1–8:
 *   Phase 1: Base images via pdf-to-post-images.ts (post-XX-pdf.jpg + post-XX-pdf-carousel.pdf)
 *   Phase 2: Art style variants — napkin + excalidraw (post-XX-napkin.png, post-XX-excalidraw.png)
 *   Phase 3: Alternating style carousels (odd→napkin, even→excalidraw) PDF output
 *   Phase 4: Push all new images to Notion Content Images DB
 *
 * Usage:
 *   bun run run-campaign-art.ts \
 *     --pdf /path/to/slideshow.pdf \
 *     --campaign 2026-04-04-agentic-process-improvement \
 *     [--posts 1,2,3,4,5,6,7,8] \
 *     [--phases 1,2,3,4]
 */

import { chromium } from "playwright";
import { readFile, writeFile, mkdir, readdir, unlink, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join, basename } from "node:path";
import { tmpdir } from "node:os";

// ============================================================================
// Constants
// ============================================================================

const PAI_ROOT = resolve(process.env.HOME!, "PAI");
const PDF_TO_POST_TOOL = resolve(PAI_ROOT, ".claude/Skills/Art/tools/pdf-to-post-images.ts");
const GENERATE_IMAGE_TOOL = resolve(PAI_ROOT, ".claude/Skills/Art/tools/generate-ulart-image.ts");
const PROFILE_PHOTO = resolve(PAI_ROOT, ".claude/assets/alvis-profile.png");
const PLAYWRIGHT_EXEC = "/home/alvis/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell";
const IMAGES_DB = "2733021756a1447d84a7143e2e9e97dd";
const CONTENT_DB = "3030760eb0cd81c5874be6f7e9637807";

// ============================================================================
// Art Prompts
// ============================================================================

const NAPKIN_PROMPT_BASE = `Spontaneous sketch on paper napkin in ballpoint pen style on textured napkin background (#F5F2E8).

Recreate this infographic in napkin sketch style. Preserve ALL content, layout, labels, numbers, statistics, and section structure from the reference image.

MEDIUM: Paper napkin texture (#F5F2E8), slight creases, CLEAN — no coffee stains.
LINE QUALITY: Quick confident ballpoint strokes (#2C5F8D) ONLY. Gestural, variable pressure. Circles as spiraling loops. Lines overshoot.
CORRECTIONS (MANDATORY): 1-2 elements scribbled out with XXX then redrawn. Shows real-time thinking.
TEXT: All-caps hurried handwriting (#2C5F8D). Key numbers underlined or circled.
COLOR (Single Tool Rule — CRITICAL): Ballpoint blue (#2C5F8D) for EVERYTHING. Napkin beige (#F5F2E8) background only. NO other colors.
TOP MARGIN (CRITICAL): Leave top 10% as clean napkin beige — no text, no title, no elements. The header must start BELOW the top 10% of the image. This prevents titles from being clipped at the edge.
FOOTER AREA: Leave bottom 8% as clean napkin beige — no footer, no CTA, no branding.
SPONTANEOUS ENERGY: Drawn in 2-4 minutes. Gestural confident lines. "Let me sketch this..." energy.

--no clean paper, --no perfect circles, --no typed fonts, --no digital polish, --no multiple tools, --no erased corrections, --no coffee stain, --no ring marks`;

const NAPKIN_PROMPT_CAROUSEL = `Spontaneous sketch on paper napkin in ballpoint pen style on textured napkin background (#F5F2E8).

Recreate this infographic in napkin sketch style. Preserve ALL content, layout, labels, numbers, statistics, and section structure from the reference image.

TOP MARGIN (CRITICAL): Leave top 10% as clean napkin beige — no text, no title, no elements. The header must start BELOW the top 10% of the image. This prevents titles from being clipped at the edge.
FOOTER RULE (CRITICAL): The reference image has a dark branded footer bar at the very bottom with a profile photo and text. IGNORE IT COMPLETELY. Do NOT recreate it. Do NOT include any footer, CTA, profile photo, name, or "subscribe" text. Leave the bottom 8% as clean napkin beige background only.

MEDIUM: Paper napkin texture (#F5F2E8), slight creases, CLEAN — no coffee stains.
LINE QUALITY: Quick confident ballpoint strokes (#2C5F8D) ONLY. Gestural, variable pressure. Circles as spiraling loops. Lines overshoot.
CORRECTIONS (MANDATORY): 1-2 elements scribbled out with XXX then redrawn. Shows real-time thinking.
TEXT: All-caps hurried handwriting (#2C5F8D). Key numbers underlined or circled.
COLOR (Single Tool Rule — CRITICAL): Ballpoint blue (#2C5F8D) for EVERYTHING. Napkin beige (#F5F2E8) background only. NO other colors.
SPONTANEOUS ENERGY: Drawn in 2-4 minutes. Gestural confident lines. "Let me sketch this..." energy.

--no clean paper, --no perfect circles, --no typed fonts, --no digital polish, --no multiple tools, --no erased corrections, --no coffee stain, --no ring marks, --no footer, --no CTA, --no profile photo, --no subscribe text`;

const EXCALIDRAW_PROMPT_BASE = `Digital whiteboard illustration in Excalidraw.com style on white background (#FFFFFF).

Recreate this infographic in Excalidraw digital whiteboard style. Preserve ALL content, layout, labels, numbers, statistics, and section structure from the reference image.

LINE QUALITY (CRITICAL): Wiggly imperfect lines throughout — NOT straight vectors. Lines overshoot at corners. Circles as overlapping spirals. Variable line thickness. Hand-drawn with mouse quality.
FILLS (CRITICAL): Hatched diagonal lines for ALL fills — NEVER solid colors, NEVER gradients.
COLOR: White background (#FFFFFF). Black (#1E1E1E) primary. Red (#DC2626) for problems/errors. Blue (#3B82F6) for solutions/improvements.
TEXT: All-caps architect font throughout.
TOP MARGIN (CRITICAL): Leave top 10% as clean white space — no text, no title, no elements. The header must start BELOW the top 10% of the image. This prevents titles from being clipped at the edge.
FOOTER AREA: Leave bottom 8% as clean white space — no footer, no CTA, no branding.

--no perfect lines, --no straight edges, --no solid fills, --no gradients, --no typed fonts, --no CAD precision, --no clean vectors`;

const EXCALIDRAW_PROMPT_CAROUSEL = `Digital whiteboard illustration in Excalidraw.com style on white background (#FFFFFF).

Recreate this infographic in Excalidraw digital whiteboard style. Preserve ALL content, layout, labels, numbers, statistics, and section structure from the reference image.

TOP MARGIN (CRITICAL): Leave top 10% as clean white space — no text, no title, no elements. The header must start BELOW the top 10% of the image. This prevents titles from being clipped at the edge.
FOOTER RULE (CRITICAL): The reference image has a dark branded footer bar at the very bottom with a profile photo and text. IGNORE IT COMPLETELY. Do NOT recreate it. Do NOT include any footer, CTA, profile photo, name, or "subscribe" text. Leave the bottom 8% as clean white background only.

LINE QUALITY (CRITICAL): Wiggly imperfect lines throughout — NOT straight vectors. Lines overshoot at corners. Circles as overlapping spirals. Variable line thickness. Hand-drawn with mouse quality.
FILLS (CRITICAL): Hatched diagonal lines for ALL fills — NEVER solid colors, NEVER gradients.
COLOR: White background (#FFFFFF). Black (#1E1E1E) primary. Red (#DC2626) for problems/errors. Blue (#3B82F6) for solutions/improvements.
TEXT: All-caps architect font throughout.

--no perfect lines, --no straight edges, --no solid fills, --no gradients, --no typed fonts, --no CAD precision, --no clean vectors, --no footer, --no CTA, --no profile photo, --no subscribe text`;

// ============================================================================
// Utilities
// ============================================================================

function sleep(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 3, initialDelay = 1000): Promise<T> {
  let lastError: any;
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const isRateLimit =
        error?.error?.code === 429 ||
        error?.error?.code === 503 ||
        error?.error?.status === "RESOURCE_EXHAUSTED" ||
        error?.error?.status === "UNAVAILABLE" ||
        error?.message?.includes("quota") ||
        error?.message?.includes("rate limit") ||
        error?.message?.includes("high demand") ||
        error?.message?.includes("UNAVAILABLE");
      if (!isRateLimit || attempt === maxRetries - 1) throw error;
      let retryDelay = initialDelay * Math.pow(2, attempt);
      if (error?.error?.code === 503 || error?.error?.status === "UNAVAILABLE" || error?.message?.includes("high demand")) {
        retryDelay = Math.max(retryDelay, 15000 * (attempt + 1));
      }
      if (error?.error?.details) {
        for (const detail of error.error.details) {
          if (detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo" && detail.retryDelay) {
            const m = detail.retryDelay.match(/^([\d.]+)s$/);
            if (m) retryDelay = Math.ceil(parseFloat(m[1]) * 1000);
          }
        }
      }
      console.log(`  ⚠️  Rate limit. Waiting ${Math.ceil(retryDelay / 1000)}s (attempt ${attempt + 1}/${maxRetries})...`);
      await sleep(retryDelay);
    }
  }
  throw lastError;
}

async function loadEnv(): Promise<void> {
  const envPath = resolve(process.env.HOME!, ".claude/.env");
  try {
    const content = await readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {}
}

async function loadNotionKey(): Promise<string> {
  const mcpPath = resolve(process.env.HOME!, ".claude/mcpServers.json");
  const raw = JSON.parse(await readFile(mcpPath, "utf-8"));
  const key = raw?.mcpServers?.notion?.env?.NOTION_API_KEY;
  if (!key) throw new Error("NOTION_API_KEY not found in mcpServers.json");
  return key;
}

function postTag(n: number): string {
  return n.toString().padStart(2, "0");
}

// ============================================================================
// Footer compositing (shared across phases)
// ============================================================================

async function compositeFooter(browser: import("playwright").Browser, imagePath: string): Promise<void> {
  const FOOTER_HEIGHT = 50;
  const SLIDE_HEIGHT = 1350 - FOOTER_HEIGHT; // 1300px

  const [slideData, profileData] = await Promise.all([
    readFile(imagePath),
    readFile(PROFILE_PHOTO),
  ]);
  const slideB64 = slideData.toString("base64");
  const profileB64 = profileData.toString("base64");
  const slideMime = imagePath.endsWith(".jpg") ? "image/jpeg" : "image/png";

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 1080px; height: 1350px; overflow: hidden; background: #fff; }
.slide { width: 1080px; height: ${SLIDE_HEIGHT}px; overflow: hidden; }
.slide img { width: 1080px; height: ${SLIDE_HEIGHT}px; object-fit: cover; object-position: top; display: block; }
.footer {
  width: 1080px; height: ${FOOTER_HEIGHT}px;
  background: #3b546b;
  display: flex; align-items: center; gap: 10px;
  padding: 0 20px;
  white-space: nowrap;
}
.avatar { width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0; border: 1.5px solid rgba(255,255,255,0.4); }
.avatar img { width: 32px; height: 32px; object-fit: cover; }
.line { font-family: Arial, sans-serif; font-size: 13px; color: #ffffff; display: flex; align-items: center; gap: 8px; flex: 1; }
.name { font-weight: 700; }
.sep { color: rgba(255,255,255,0.5); font-size: 15px; }
.cta { color: rgba(255,255,255,0.88); }
.sub { font-weight: 600; color: rgba(255,255,255,0.95); }
</style>
</head>
<body>
<div class="slide"><img src="data:${slideMime};base64,${slideB64}" /></div>
<div class="footer">
  <div class="avatar"><img src="data:image/png;base64,${profileB64}" /></div>
  <div class="line">
    <span class="name">Alvis House</span>
    <span class="sep">•</span>
    <span class="cta">Follow for weekly AI operations insights</span>
    <span class="sep">•</span>
    <span class="sub">Subscribe → alvishouse.io</span>
  </div>
</div>
</body>
</html>`;

  const page = await browser.newPage();
  await page.setViewportSize({ width: 1080, height: 1350 });
  await page.setContent(html, { waitUntil: "load" });
  const screenshot = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();
  await writeFile(imagePath, screenshot);
}

// ============================================================================
// Carousel PDF compilation (shared across phases)
// ============================================================================

async function compileCarouselPdf(browser: import("playwright").Browser, pngPaths: string[], outputPath: string): Promise<void> {
  const imagesHtml = await Promise.all(
    pngPaths.map(async (p, i) => {
      const b64 = (await readFile(p)).toString("base64");
      return `<div class="page" style="${i > 0 ? "page-break-before: always;" : ""}">
  <img src="data:image/png;base64,${b64}" style="width:100%;height:100%;object-fit:contain;display:block;" />
</div>`;
    })
  );
  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1080px; }
  .page { width: 1080px; height: 1350px; overflow: hidden; }
  @page { size: 1080px 1350px; margin: 0; }
</style></head><body>${imagesHtml.join("\n")}</body></html>`;

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.pdf({ path: outputPath, width: "1080px", height: "1350px", printBackground: true });
  await page.close();
  console.log(`  ✅ PDF compiled: ${basename(outputPath)} (${pngPaths.length} slides)`);
}

// ============================================================================
// Phase 1: Base images via pdf-to-post-images.ts subprocess
// ============================================================================

async function runPhase1(pdfPath: string, campaign: string, posts: number[]): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Phase 1 — Base images (pdf-to-post-images.ts)`);
  console.log(`${"═".repeat(60)}`);

  const campaignDir = resolve(PAI_ROOT, "scratchpad/content-create", campaign);
  const imagesDir = join(campaignDir, "13-extracted-content/linkedin/images");
  const infographicsDir = join(campaignDir, "13-extracted-content/linkedin/infographics");

  for (const postNum of posts) {
    const tag = postTag(postNum);
    const baseImagePath = join(imagesDir, `post-${tag}-pdf.jpg`);
    const carouselPath = join(infographicsDir, `post-${tag}-pdf-carousel.pdf`);

    const needsImage = !existsSync(baseImagePath);
    const needsCarousel = !existsSync(carouselPath);

    if (!needsImage && !needsCarousel) {
      console.log(`  [${tag}] ✓ Skipping — post-${tag}-pdf.jpg + carousel PDF already exist`);
      continue;
    }

    const mode = needsImage && needsCarousel ? "both" : needsImage ? "image" : "carousel";
    console.log(`\n  [${tag}] Running pdf-to-post-images.ts --mode ${mode}...`);

    try {
      const proc = Bun.spawn(
        ["bun", "run", PDF_TO_POST_TOOL, "--pdf", pdfPath, "--campaign", campaign, "--posts", postNum.toString(), "--mode", mode],
        { stdout: "inherit", stderr: "inherit" }
      );
      const exitCode = await proc.exited;
      if (exitCode !== 0) {
        console.error(`  ❌ [${tag}] pdf-to-post-images.ts exited ${exitCode}`);
      } else {
        console.log(`  ✅ [${tag}] Phase 1 complete`);
      }
    } catch (err: any) {
      console.error(`  ❌ [${tag}] Phase 1 error: ${err.message}`);
    }
  }
}

// ============================================================================
// Phase 2: Art style variants (napkin + excalidraw) per post
// ============================================================================

async function generateStyleVariant(
  referenceImagePath: string,
  prompt: string,
  outputPath: string,
  style: string,
  postTag: string
): Promise<void> {
  console.log(`  [${postTag}] 🎨 Generating ${style} variant via generate-ulart-image.ts...`);

  // Write prompt to temp file to avoid shell escaping issues with long prompts
  const tmpPromptPath = join(tmpdir(), `prompt-${postTag}-${style}-${Date.now()}.txt`);
  await writeFile(tmpPromptPath, prompt);

  const proc = Bun.spawn(
    [
      "bun", "run", GENERATE_IMAGE_TOOL,
      "--model", "nano-banana-pro",
      "--size", "2K",
      "--aspect-ratio", "4:5",
      "--reference-image", referenceImagePath,
      "--prompt", prompt,
      "--output", outputPath,
    ],
    { stdout: "inherit", stderr: "inherit" }
  );

  const exitCode = await proc.exited;
  await unlink(tmpPromptPath).catch(() => {});

  if (exitCode !== 0) throw new Error(`generate-ulart-image.ts exited ${exitCode} for ${style} variant of post ${postTag}`);
  console.log(`  [${postTag}] ✅ Saved ${basename(outputPath)}`);
}

async function runPhase2(campaign: string, posts: number[]): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Phase 2 — Art style variants (napkin + excalidraw)`);
  console.log(`${"═".repeat(60)}`);

  const campaignDir = resolve(PAI_ROOT, "scratchpad/content-create", campaign);
  const imagesDir = join(campaignDir, "13-extracted-content/linkedin/images");

  const browser = await chromium.launch({ executablePath: PLAYWRIGHT_EXEC });

  for (const postNum of posts) {
    const tag = postTag(postNum);
    const referenceImage = join(imagesDir, `post-${tag}-pdf.jpg`);

    if (!existsSync(referenceImage)) {
      console.log(`  [${tag}] ⚠️  Skipping — post-${tag}-pdf.jpg not found (run Phase 1 first)`);
      continue;
    }

    const napkinPath = join(imagesDir, `post-${tag}-napkin.png`);
    const excalidrawPath = join(imagesDir, `post-${tag}-excalidraw.png`);

    const needsNapkin = !existsSync(napkinPath);
    const needsExcalidraw = !existsSync(excalidrawPath);

    if (!needsNapkin && !needsExcalidraw) {
      console.log(`  [${tag}] ✓ Skipping — napkin + excalidraw already exist`);
      continue;
    }

    console.log(`\n  [${tag}] Generating art variants (${[needsNapkin && "napkin", needsExcalidraw && "excalidraw"].filter(Boolean).join(" + ")})...`);

    try {
      // Run napkin and excalidraw in parallel for the same post
      const tasks: Promise<void>[] = [];

      if (needsNapkin) {
        tasks.push(
          generateStyleVariant(referenceImage, NAPKIN_PROMPT_BASE, napkinPath, "napkin", tag)
            .then(() => compositeFooter(browser, napkinPath))
        );
      }
      if (needsExcalidraw) {
        tasks.push(
          generateStyleVariant(referenceImage, EXCALIDRAW_PROMPT_BASE, excalidrawPath, "excalidraw", tag)
            .then(() => compositeFooter(browser, excalidrawPath))
        );
      }

      await Promise.all(tasks);
      console.log(`  [${tag}] ✅ Phase 2 complete`);
    } catch (err: any) {
      console.error(`  ❌ [${tag}] Phase 2 error: ${err.message}`);
    }

    // Rate limit buffer between posts
    if (postNum !== posts[posts.length - 1]) {
      console.log(`  ⏳ Waiting 2s before next post...`);
      await sleep(2000);
    }
  }

  await browser.close();
}

// ============================================================================
// Phase 3: Alternating style carousel PDFs
// ============================================================================

async function generateCarouselSlide(
  slidePngPath: string,
  prompt: string,
  outputPath: string,
  slideLabel: string
): Promise<void> {
  const proc = Bun.spawn(
    [
      "bun", "run", GENERATE_IMAGE_TOOL,
      "--model", "nano-banana-pro",
      "--size", "2K",
      "--aspect-ratio", "4:5",
      "--reference-image", slidePngPath,
      "--prompt", prompt,
      "--output", outputPath,
    ],
    { stdout: "inherit", stderr: "inherit" }
  );

  const exitCode = await proc.exited;
  if (exitCode !== 0) throw new Error(`generate-ulart-image.ts exited ${exitCode} for carousel slide ${slideLabel}`);
}

async function runPhase3(campaign: string, posts: number[]): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Phase 3 — Alternating style carousel PDFs`);
  console.log(`${"═".repeat(60)}`);

  const campaignDir = resolve(PAI_ROOT, "scratchpad/content-create", campaign);
  const infographicsDir = join(campaignDir, "13-extracted-content/linkedin/infographics");

  const browser = await chromium.launch({ executablePath: PLAYWRIGHT_EXEC });

  for (const postNum of posts) {
    const tag = postTag(postNum);
    const isOdd = postNum % 2 === 1;
    const style = isOdd ? "napkin" : "excalidraw";
    const prompt = isOdd ? NAPKIN_PROMPT_CAROUSEL : EXCALIDRAW_PROMPT_CAROUSEL;
    const sourcePdf = join(infographicsDir, `post-${tag}-pdf-carousel.pdf`);
    const outputPdf = join(infographicsDir, `post-${tag}-${style}-carousel.pdf`);

    if (!existsSync(sourcePdf)) {
      console.log(`  [${tag}] ⚠️  Skipping — post-${tag}-pdf-carousel.pdf not found (run Phase 1 first)`);
      continue;
    }

    if (existsSync(outputPdf)) {
      console.log(`  [${tag}] ✓ Skipping — ${basename(outputPdf)} already exists`);
      continue;
    }

    console.log(`\n  [${tag}] Building ${style} carousel from ${basename(sourcePdf)}...`);

    const tmpDir = await mkdtemp(join(tmpdir(), `carousel-${tag}-`));
    const styledPngs: string[] = [];

    try {
      // Extract PDF pages to PNGs via pdftoppm
      const prefix = join(tmpDir, "slide");
      const pdftoppm = Bun.spawn(["pdftoppm", "-r", "150", "-png", sourcePdf, prefix], { stderr: "pipe" });
      const exitCode = await pdftoppm.exited;
      if (exitCode !== 0) {
        const errText = await new Response(pdftoppm.stderr).text();
        throw new Error(`pdftoppm failed for post-${tag}: ${errText}`);
      }

      const slideFiles = (await readdir(tmpDir)).filter(f => f.endsWith(".png")).sort().map(f => join(tmpDir, f));
      console.log(`  [${tag}] Extracted ${slideFiles.length} slides from PDF`);

      // Restyle each slide
      for (let i = 0; i < slideFiles.length; i++) {
        const slidePng = slideFiles[i];
        const styledPath = join(tmpDir, `styled-${i + 1}.png`);
        const slideLabel = `post-${tag}-slide-${i + 1}`;

        console.log(`  [${tag}] 🎨 Styling slide ${i + 1}/${slideFiles.length} (${style})...`);

        try {
          await generateCarouselSlide(slidePng, prompt, styledPath, slideLabel);
          await compositeFooter(browser, styledPath);
          styledPngs.push(styledPath);
        } catch (err: any) {
          console.error(`  ❌ [${tag}] Slide ${i + 1} failed: ${err.message?.slice(0, 80)}`);
        }

        // Rate limit buffer between slides (except last)
        if (i < slideFiles.length - 1) {
          await sleep(2000);
        }
      }

      if (styledPngs.length === 0) {
        throw new Error(`No slides styled successfully for post-${tag}`);
      }

      // Compile to PDF
      await compileCarouselPdf(browser, styledPngs, outputPdf);
      console.log(`  ✅ [${tag}] Phase 3 complete — ${basename(outputPdf)}`);
    } catch (err: any) {
      console.error(`  ❌ [${tag}] Phase 3 error: ${err.message}`);
    } finally {
      // Cleanup temp dir
      try {
        const allTmp = await readdir(tmpDir);
        for (const f of allTmp) await unlink(join(tmpDir, f)).catch(() => {});
        await import("node:fs/promises").then(fs => fs.rmdir(tmpDir)).catch(() => {});
      } catch {}
    }

    // Rate limit buffer between posts
    if (postNum !== posts[posts.length - 1]) {
      console.log(`  ⏳ Waiting 2s before next post...`);
      await sleep(2000);
    }
  }

  await browser.close();
}

// ============================================================================
// Phase 4: Notion push
// ============================================================================

interface NotionImageEntry {
  file: string;
  notion_id: string;
  notion_url: string;
  style: string;
  post_num: number;
}

async function notionRequest(
  notionKey: string,
  method: string,
  path: string,
  body?: object
): Promise<any> {
  const res = await fetch(`https://api.notion.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${notionKey}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Notion API ${method} ${path} → ${res.status}: ${errText.slice(0, 200)}`);
  }
  return res.json();
}

async function findPostPageIds(notionKey: string, workflowId: string): Promise<Map<number, string>> {
  console.log(`\n  Querying Notion Content DB for workflow ${workflowId}...`);

  const result = await notionRequest(notionKey, "POST", `/databases/${CONTENT_DB}/query`, {
    filter: {
      property: "Workflow",
      relation: { contains: workflowId }
    },
    page_size: 50
  });

  const mapping = new Map<number, string>();

  for (const page of result.results ?? []) {
    // Primary: use "Posting Priority" number field (1–8 maps directly to post number)
    const priority = page.properties?.["Posting Priority"]?.number;
    if (priority && Number.isInteger(priority) && priority >= 1 && priority <= 8) {
      mapping.set(priority, page.id);
      console.log(`    → Post ${priority.toString().padStart(2, "0")}: ${page.id}`);
      continue;
    }

    // Fallback: try title regex for "post 01" / "post-01" patterns
    const titleParts = page.properties?.Name?.title ?? page.properties?.Title?.title ?? page.properties?.["Content Name"]?.rich_text ?? [];
    const titleText = titleParts.map((t: any) => t.plain_text).join("").toLowerCase();
    const m = titleText.match(/(?:post[-\s]?)(\d{1,2})/i) ?? titleText.match(/^(\d{1,2})\s/);
    if (m) {
      const num = parseInt(m[1]);
      mapping.set(num, page.id);
      console.log(`    → Post ${num.toString().padStart(2, "0")}: ${page.id} (title fallback)`);
    }
  }

  console.log(`  Found ${mapping.size} post pages in Notion`);
  return mapping;
}

async function uploadImageToNotion(
  notionKey: string,
  imagePath: string,
  postNum: number,
  style: string,
  campaign: string,
  workflowId: string,
  postPageId: string | undefined
): Promise<{ notion_id: string; notion_url: string }> {
  const fileName = basename(imagePath);
  const isPdf = imagePath.endsWith(".pdf");
  const styleName = style === "napkin" ? "Napkin" : style === "excalidraw" ? "Excalidraw" : "PDF";
  const tag = postTag(postNum);
  const imageName = `Post ${tag} — ${styleName} Sketch — ${campaign}`;
  const NOTION_API_URL = "https://api.notion.com/v1";
  const NOTION_VERSION = "2022-06-28";

  const properties: Record<string, any> = {
    "Image Name": { title: [{ text: { content: imageName } }] },
    "Style": { select: { name: styleName } },
    "Model": { select: { name: "nano-banana-pro" } },
    "Image Type": { select: { name: "Social" } },
    "Aspect Ratio": { select: { name: "4:5" } },
    "Resolution": { rich_text: [{ text: { content: "1080×1350" } }] },
    "Status": { select: { name: "Generated" } },
    "Campaign": { select: { name: campaign } },
    "Tags": {
      multi_select: [
        { name: "LinkedIn" },
        { name: styleName },
        { name: `Post-${tag}` },
        { name: "Carousel" },
      ]
    },
  };

  if (workflowId) properties["Workflow"] = { relation: [{ id: workflowId }] };
  if (postPageId) properties["Used In Content"] = { relation: [{ id: postPageId }] };

  // Create the page first
  const page = await notionRequest(notionKey, "POST", "/pages", {
    parent: { database_id: IMAGES_DB },
    properties,
  });

  // Upload file and attach as block (image block for PNGs/JPEGs, file block for PDFs)
  {
    const buffer = await readFile(imagePath);
    const contentType = isPdf ? "application/pdf" : fileName.endsWith(".png") ? "image/png" : "image/jpeg";

    // Step 1: Request upload intent
    const intent = await fetch(`${NOTION_API_URL}/file_uploads`, {
      method: "POST",
      headers: { Authorization: `Bearer ${notionKey}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
      body: JSON.stringify({ filename: fileName, content_type: contentType }),
    }).then(r => r.json());

    if (!intent.upload_url) throw new Error(`Notion upload intent failed: ${JSON.stringify(intent)}`);

    // Step 2: Upload binary
    const form = new FormData();
    form.append("file", new File([buffer], fileName, { type: contentType }));
    const sent = await fetch(intent.upload_url, {
      method: "POST",
      headers: { Authorization: `Bearer ${notionKey}`, "Notion-Version": NOTION_VERSION },
      body: form,
    }).then(r => r.json());

    if (sent.status !== "uploaded") throw new Error(`Notion file upload failed: ${JSON.stringify(sent)}`);

    // Step 3: Attach to page — pdf block for PDFs (renders inline), image block for images
    const block = isPdf
      ? { object: "block", type: "pdf", pdf: { type: "file_upload", file_upload: { id: intent.id } } }
      : { object: "block", type: "image", image: { type: "file_upload", file_upload: { id: intent.id }, caption: [{ type: "text", text: { content: imageName } }] } };

    await fetch(`${NOTION_API_URL}/blocks/${page.id}/children`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${notionKey}`, "Notion-Version": NOTION_VERSION, "Content-Type": "application/json" },
      body: JSON.stringify({ children: [block] }),
    });
  }

  return {
    notion_id: page.id,
    notion_url: page.url ?? `https://www.notion.so/${page.id.replace(/-/g, "")}`
  };
}

async function runPhase4(campaign: string, posts: number[], phasesRun: Set<number>): Promise<void> {
  console.log(`\n${"═".repeat(60)}`);
  console.log(`Phase 4 — Push to Notion`);
  console.log(`${"═".repeat(60)}`);

  const notionKey = await loadNotionKey();

  const campaignDir = resolve(PAI_ROOT, "scratchpad/content-create", campaign);
  const imagesDir = join(campaignDir, "13-extracted-content/linkedin/images");
  const infographicsDir = join(campaignDir, "13-extracted-content/linkedin/infographics");
  const metadataPath = join(campaignDir, "metadata.json");

  // Load metadata to get workflow_id and existing notion IDs
  let metadata: any = {};
  try {
    metadata = JSON.parse(await readFile(metadataPath, "utf-8"));
  } catch {
    console.log("  ⚠️  metadata.json not found — will create minimal checkpoint");
  }

  const workflowId = metadata?.notion?.workflow_id ?? "";
  if (!workflowId) {
    console.log("  ⚠️  No notion.workflow_id in metadata.json — skipping workflow relation");
  }

  // Find post page IDs in Notion
  const postPageMap = workflowId
    ? await findPostPageIds(notionKey, workflowId)
    : new Map<number, string>();

  const newEntries: NotionImageEntry[] = [];

  for (const postNum of posts) {
    const tag = postTag(postNum);
    const isOdd = postNum % 2 === 1;
    const carouselStyle = isOdd ? "napkin" : "excalidraw";

    const filesToUpload: Array<{ path: string; style: string }> = [
      { path: join(imagesDir, `post-${tag}-napkin.png`), style: "napkin" },
      { path: join(imagesDir, `post-${tag}-excalidraw.png`), style: "excalidraw" },
      { path: join(infographicsDir, `post-${tag}-${carouselStyle}-carousel.pdf`), style: `${carouselStyle}-carousel` },
    ];

    const postPageId = postPageMap.get(postNum);
    if (!postPageId) {
      console.log(`  [${tag}] ⚠️  No Notion post page found — will upload without post relation`);
    }

    for (const { path: filePath, style } of filesToUpload) {
      if (!existsSync(filePath)) {
        console.log(`  [${tag}] ⚠️  Skipping ${basename(filePath)} — file not found`);
        continue;
      }

      console.log(`\n  [${tag}] Uploading ${basename(filePath)} (${style})...`);

      try {
        const { notion_id, notion_url } = await uploadImageToNotion(
          notionKey,
          filePath,
          postNum,
          style,
          campaign,
          workflowId,
          postPageId
        );
        console.log(`  [${tag}] ✅ Created Notion page: ${notion_id}`);
        newEntries.push({ file: basename(filePath), notion_id, notion_url, style, post_num: postNum });
        await sleep(500); // brief pause between Notion API calls
      } catch (err: any) {
        console.error(`  ❌ [${tag}] Notion upload failed for ${basename(filePath)}: ${err.message?.slice(0, 100)}`);
      }
    }
  }

  // Update metadata.json with step-13b-art checkpoint (PDF carousel art variants — napkin/excalidraw)
  // Note: step-13c is reserved for Opening Wound gpt-image-1 art (already complete)
  if (newEntries.length > 0) {
    if (!metadata.checkpoints) metadata.checkpoints = {};
    metadata.checkpoints["step-13b-art"] = {
      completed: true,
      timestamp: new Date().toISOString(),
      art_style_variants: newEntries.map(e => ({
        file: e.file,
        style: e.style,
        post_num: e.post_num,
        notion_id: e.notion_id,
        notion_url: e.notion_url,
      }))
    };
    metadata.updated_at = new Date().toISOString();

    await writeFile(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`\n  ✅ metadata.json updated with step-13b-art (${newEntries.length} entries)`);
  } else {
    console.log("\n  ⚠️  No new images uploaded — metadata not updated");
  }
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  await loadEnv();

  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };

  const pdfArg = get("--pdf");
  const campaign = get("--campaign");
  const postsArg = get("--posts");
  const phasesArg = get("--phases");

  if (!campaign) {
    console.error("Usage: bun run run-campaign-art.ts --pdf PATH --campaign SLUG [--posts 1,2,...] [--phases 1,2,3,4]");
    process.exit(1);
  }

  const campaignDir = resolve(PAI_ROOT, "scratchpad/content-create", campaign);
  if (!existsSync(campaignDir)) {
    console.error(`❌ Campaign directory not found: ${campaignDir}`);
    process.exit(1);
  }

  const pdfPath = pdfArg
    ? (pdfArg.startsWith("/") ? pdfArg : resolve(PAI_ROOT, pdfArg))
    : (() => {
        // Auto-detect PDF in campaign root
        const found = (require("fs").readdirSync(campaignDir) as string[]).find(f => f.endsWith(".pdf"));
        return found ? join(campaignDir, found) : "";
      })();

  const posts = postsArg
    ? postsArg.split(",").map(n => parseInt(n.trim())).filter(n => n >= 1 && n <= 8)
    : [1, 2, 3, 4, 5, 6, 7, 8];

  const phases = phasesArg
    ? new Set(phasesArg.split(",").map(n => parseInt(n.trim())))
    : new Set([1, 2, 3, 4]);

  console.log(`\n${"═".repeat(60)}`);
  console.log(`run-campaign-art`);
  console.log(`${"═".repeat(60)}`);
  console.log(`Campaign: ${campaign}`);
  console.log(`Posts:    ${posts.join(", ")}`);
  console.log(`Phases:   ${[...phases].sort().join(", ")}`);
  if (pdfPath) console.log(`PDF:      ${pdfPath}`);

  const startTime = Date.now();

  // Phase 1
  if (phases.has(1)) {
    if (!pdfPath || !existsSync(pdfPath)) {
      console.error(`\n❌ Phase 1 requires --pdf. Provide path to slideshow PDF.`);
      if (phases.size === 1) process.exit(1);
    } else {
      try {
        await runPhase1(pdfPath, campaign, posts);
      } catch (err: any) {
        console.error(`\n❌ Phase 1 failed: ${err.message}`);
      }
    }
  }

  // Phase 2
  if (phases.has(2)) {
    try {
      await runPhase2(campaign, posts);
    } catch (err: any) {
      console.error(`\n❌ Phase 2 failed: ${err.message}`);
    }
  }

  // Phase 3
  if (phases.has(3)) {
    try {
      await runPhase3(campaign, posts);
    } catch (err: any) {
      console.error(`\n❌ Phase 3 failed: ${err.message}`);
    }
  }

  // Phase 4
  if (phases.has(4)) {
    try {
      await runPhase4(campaign, posts, phases);
    } catch (err: any) {
      console.error(`\n❌ Phase 4 failed: ${err.message}`);
    }
  }

  const elapsed = Math.round((Date.now() - startTime) / 1000);
  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;

  console.log(`\n${"═".repeat(60)}`);
  console.log(`✅ run-campaign-art complete — ${minutes}m ${seconds}s`);
  console.log(`${"═".repeat(60)}`);
}

main().catch(err => {
  console.error("❌", err.message ?? err);
  process.exit(1);
});
