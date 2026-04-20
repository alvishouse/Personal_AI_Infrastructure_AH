#!/usr/bin/env bun
/**
 * pdf-to-post-images — Match NotebookLM PDF slides to LinkedIn posts
 *
 * Token-efficient pipeline:
 * - Renders PDF pages via pdftoppm (no canvas dependency)
 * - Caches slide analysis to slide-analysis.json — only uploads PDF once ever
 * - Passes actual page PNG + profile photo as reference images to nano-banana-pro
 * - Compiles LinkedIn carousel PDFs via Playwright
 *
 * Usage:
 *   bun run .claude/Skills/Art/tools/pdf-to-post-images.ts \
 *     --pdf scratchpad/content-create/CAMPAIGN/slideshow.pdf \
 *     --campaign CAMPAIGN_SLUG \
 *     --posts 1
 *     --mode both        (image | carousel | both)
 *     --refresh-cache    (force re-upload PDF even if cache exists)
 */

import { GoogleGenAI } from "@google/genai";
import { chromium } from "playwright";
import { readFile, writeFile, mkdir, readdir, unlink, mkdtemp } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve, join } from "node:path";
import { tmpdir } from "node:os";

const PROFILE_PHOTO = resolve(process.env.HOME!, "PAI/.claude/assets/alvis-profile.png");

// ============================================================================
// Environment
// ============================================================================

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

// ============================================================================
// Types
// ============================================================================

interface PageData {
  page: number;
  pngPath: string;
  title: string;
  themes: string[];
  key_stats: string[];
  summary: string;
}

interface SlideAnalysis {
  page: number;
  title: string;
  themes: string[];
  key_stats: string[];
  summary: string;
}

interface MatchResult {
  topImage: number;
  carouselPages: number[];
  reasoning: string;
}

// ============================================================================
// Retry (from generate-ulart-image.ts)
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
      if (error?.error?.details) {
        for (const detail of error.error.details) {
          if (detail["@type"] === "type.googleapis.com/google.rpc.RetryInfo" && detail.retryDelay) {
            const m = detail.retryDelay.match(/^([\d.]+)s$/);
            if (m) retryDelay = Math.ceil(parseFloat(m[1]) * 1000);
          }
        }
      }
      // Use longer backoff for 503 service unavailable
      if (error?.error?.code === 503 || error?.error?.status === "UNAVAILABLE" || error?.message?.includes("high demand")) {
        retryDelay = Math.max(retryDelay, 15000 * (attempt + 1));
      }
      console.log(`⚠️  Rate limit. Waiting ${Math.ceil(retryDelay / 1000)}s (attempt ${attempt + 1}/${maxRetries})...`);
      await sleep(retryDelay);
    }
  }
  throw lastError;
}

// ============================================================================
// Phase 1: Render PDF pages to PNGs via pdftoppm
// ============================================================================

async function extractPdfPages(pdfPath: string): Promise<{ tmpDir: string; pages: string[] }> {
  console.log(`\n📄 Rendering PDF pages via pdftoppm...`);

  const tmpDir = await mkdtemp(join(tmpdir(), "pdf-slides-"));
  const prefix = join(tmpDir, "slide");

  const proc = Bun.spawn(["pdftoppm", "-r", "150", "-png", pdfPath, prefix], { stderr: "pipe" });
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const errText = await new Response(proc.stderr).text();
    throw new Error(`pdftoppm failed (exit ${exitCode}): ${errText}`);
  }

  const files = (await readdir(tmpDir)).filter(f => f.endsWith(".png")).sort().map(f => join(tmpDir, f));
  console.log(`✅ Rendered ${files.length} pages`);
  return { tmpDir, pages: files };
}

// ============================================================================
// Phase 2: Slide analysis — cached to avoid re-uploading PDF
// ============================================================================

async function loadOrAnalyzeSlides(
  ai: GoogleGenAI,
  pdfPath: string,
  cacheFile: string,
  pageCount: number,
  forceRefresh: boolean
): Promise<SlideAnalysis[]> {
  // Load from cache if available
  if (!forceRefresh && existsSync(cacheFile)) {
    const cached = JSON.parse(await readFile(cacheFile, "utf-8"));
    console.log(`\n📋 Loaded slide analysis from cache (${cached.length} slides)`);
    return cached;
  }

  console.log(`\n🔍 Uploading PDF to Gemini for visual analysis (one-time)...`);

  const uploadedFile = await ai.files.upload({
    file: pdfPath,
    config: { mimeType: "application/pdf", displayName: "slideshow.pdf" }
  });
  console.log(`   Uploaded: ${uploadedFile.name}`);

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{
        parts: [
          { fileData: { mimeType: "application/pdf", fileUri: uploadedFile.uri! } },
          {
            text: `Analyze every slide in this PDF. Return ONLY a JSON array, no markdown:
[
  {
    "page": 1,
    "title": "exact title text from slide",
    "themes": ["2-4 topic keywords"],
    "key_stats": ["numbers/data points, empty array if none"],
    "summary": "one sentence describing what this slide covers"
  }
]
Include ALL ${pageCount} slides using actual visible content.`
          }
        ]
      }],
      config: { temperature: 0.1 }
    })
  );

  try { await ai.files.delete({ name: uploadedFile.name! }); } catch {}

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
  const clean = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  let slides: SlideAnalysis[] = [];
  try {
    slides = JSON.parse(clean);
  } catch {
    const m = clean.match(/\[[\s\S]*\]/);
    if (m) slides = JSON.parse(m[0]);
  }

  // Save to cache
  await writeFile(cacheFile, JSON.stringify(slides, null, 2));
  console.log(`✅ Analyzed ${slides.length} slides — cached to ${cacheFile}`);
  return slides;
}

// ============================================================================
// Phase 3: Match post to slides
// ============================================================================

async function matchPostToSlides(
  ai: GoogleGenAI,
  postContent: string,
  pages: PageData[],
  slideUsageCounts?: Map<number, number>
): Promise<MatchResult> {
  const slideSummaries = pages.map(p =>
    `Slide ${p.page}: "${p.title}" — themes: ${p.themes.join(", ")}${p.key_stats.length ? ` — data: ${p.key_stats.join(", ")}` : ""} — ${p.summary}`
  ).join("\n");

  // Build avoidance guidance for over-used slides (used >= 2 times)
  const overUsed = slideUsageCounts
    ? [...slideUsageCounts.entries()].filter(([, count]) => count >= 2).map(([s]) => s)
    : [];
  const diversityNote = overUsed.length > 0
    ? `\n\nDIVERSITY CONSTRAINT: Slides ${overUsed.join(", ")} have already been selected for multiple other posts. AVOID these slides unless there is absolutely no suitable alternative. Pick from slides not on this list to maximize variety across the campaign.`
    : "";

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: [{
        parts: [{
          text: `Match a LinkedIn post to the most relevant slides from a presentation.

POST:
${postContent}

SLIDES:
${slideSummaries}

Return ONLY valid JSON (no markdown):
{
  "topImage": <slide number of single best matching slide>,
  "carouselPages": [<3 slide numbers ordered by relevance, topImage first>],
  "reasoning": "one sentence explaining the match"
}

Choose slides that best support or visualize the post's narrative and key claims.${diversityNote}`
        }]
      }],
      config: { temperature: 0.2 }
    })
  );

  const raw = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "{}";
  const clean = raw.replace(/```json?\n?/g, "").replace(/```/g, "").trim();

  try {
    const parsed = JSON.parse(clean);
    return {
      topImage: parsed.topImage ?? 1,
      carouselPages: (parsed.carouselPages ?? [1, 2, 3]).slice(0, 3),
      reasoning: parsed.reasoning ?? ""
    };
  } catch {
    return { topImage: 1, carouselPages: [1, 2, 3], reasoning: "fallback" };
  }
}

// ============================================================================
// Phase 4a: Reformat slide to 4:5 via nano-banana-pro
// (single-shot, no QA loop — footer composited separately)
// ============================================================================

async function reformatSlide(ai: GoogleGenAI, page: PageData, outputPath: string): Promise<void> {
  console.log(`   🍌 Reformatting slide ${page.page}: "${page.title}"...`);

  const slidePng = await readFile(page.pngPath);

  const prompt = `Recreate this presentation slide as a vertical portrait infographic for LinkedIn.

LAYOUT RULES (follow precisely):
- All content stacked top-to-bottom — nothing side-by-side
- BEFORE/AFTER comparisons: BEFORE block first (full width), then AFTER block below it (full width)
- Callout boxes and stat annotations go DIRECTLY BELOW the element they describe — never beside it
- Any text that appears to the right of an image must move BELOW that image in portrait layout
- Diagrams and charts redrawn to fit full portrait width

CONTENT RULES:
- Preserve ALL text exactly — no paraphrasing, no omissions
- Maintain the original color palette, typography, and visual style
- Remove any NotebookLM, Google, or third-party logos entirely

FOOTER AREA:
- Leave the bottom 8% of the image as clean empty space (white or matching background color)
- Do NOT add any footer, CTA, attribution, profile photo, or branding at the bottom
- A branded footer will be composited separately`;

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: [{
        parts: [
          { inlineData: { mimeType: "image/png", data: slidePng.toString("base64") } },
          { text: prompt }
        ]
      }],
      config: {
        responseModalities: ["TEXT", "IMAGE"],
        imageConfig: { aspectRatio: "4:5", imageSize: "2K" }
      }
    })
  );

  let imageData: string | undefined;
  if (response.candidates?.[0]?.content?.parts) {
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) { imageData = part.inlineData.data; break; }
    }
  }

  if (!imageData) throw new Error(`No image returned for slide ${page.page}`);

  await writeFile(outputPath, Buffer.from(imageData, "base64"));
  console.log(`   ✅ Saved ${outputPath}`);
}

// ============================================================================
// Phase 4b: Composite branded footer onto generated slide
// (uses shared browser instance to avoid repeated cold starts)
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
.slide img { width: 1080px; height: ${SLIDE_HEIGHT}px; object-fit: cover; display: block; }
.footer {
  width: 1080px; height: ${FOOTER_HEIGHT}px;
  background: #3b546b;
  display: flex; align-items: center; gap: 10px;
  padding: 0 20px;
  white-space: nowrap;
}
.avatar {
  width: 32px; height: 32px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
  border: 1.5px solid rgba(255,255,255,0.4);
}
.avatar img { width: 32px; height: 32px; object-fit: cover; }
.line {
  font-family: Arial, sans-serif; font-size: 13px; color: #ffffff;
  display: flex; align-items: center; gap: 8px; flex: 1;
}
.name { font-weight: 700; }
.sep { color: rgba(255,255,255,0.5); font-size: 15px; }
.cta { color: rgba(255,255,255,0.88); }
.sub { font-weight: 600; color: rgba(255,255,255,0.95); }
</style>
</head>
<body>
<div class="slide">
  <img src="data:${slideMime};base64,${slideB64}" />
</div>
<div class="footer">
  <div class="avatar">
    <img src="data:image/png;base64,${profileB64}" />
  </div>
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
  const screenshotBuffer = await page.screenshot({ type: "png", clip: { x: 0, y: 0, width: 1080, height: 1350 } });
  await page.close();

  // Overwrite the original file with the composited version
  await writeFile(imagePath, screenshotBuffer);
  console.log(`   🖼️  Footer composited onto ${imagePath.split("/").pop()}`);
}

// ============================================================================
// Phase 5: Compile carousel PDF
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

  console.log(`   ✅ Carousel: ${outputPath} (${pngPaths.length} slides)`);
}

// ============================================================================
// Main
// ============================================================================

async function main() {
  await loadEnv();

  const args = process.argv.slice(2);
  const get = (flag: string) => { const i = args.indexOf(flag); return i !== -1 ? args[i + 1] : undefined; };
  const has = (flag: string) => args.includes(flag);

  const pdfArg = get("--pdf");
  const campaign = get("--campaign");
  const mode = get("--mode") ?? "both";
  const postsArg = get("--posts");
  const refreshCache = has("--refresh-cache");

  if (!pdfArg || !campaign) {
    console.error("Usage: bun run pdf-to-post-images.ts --pdf PATH --campaign SLUG [--posts 1,2,3] [--mode image|carousel|both] [--refresh-cache]");
    process.exit(1);
  }

  const paiRoot = resolve(process.env.HOME!, "PAI");
  const pdfPath = pdfArg.startsWith("/") ? pdfArg : resolve(paiRoot, pdfArg);

  if (!existsSync(pdfPath)) { console.error(`❌ PDF not found: ${pdfPath}`); process.exit(1); }
  if (!existsSync(PROFILE_PHOTO)) { console.error(`❌ Profile photo not found: ${PROFILE_PHOTO}`); process.exit(1); }

  const campaignDir = resolve(paiRoot, "scratchpad/content-create", campaign);
  const postsDir = join(campaignDir, "13-extracted-content/linkedin/posts");
  const imagesDir = join(campaignDir, "13-extracted-content/linkedin/images");
  const infographicsDir = join(campaignDir, "13-extracted-content/linkedin/infographics");
  const cacheFile = join(infographicsDir, "slide-analysis.json");

  await mkdir(imagesDir, { recursive: true });
  await mkdir(infographicsDir, { recursive: true });

  const allPostFiles = (await readdir(postsDir)).filter(f => f.endsWith(".md")).sort();
  const requestedNums = postsArg ? postsArg.split(",").map(n => parseInt(n.trim())) : allPostFiles.map((_, i) => i + 1);
  const postFiles = allPostFiles.filter((_, i) => requestedNums.includes(i + 1));

  console.log(`\n🚀 pdf-to-post-images`);
  console.log(`   PDF:      ${pdfPath}`);
  console.log(`   Campaign: ${campaign}`);
  console.log(`   Posts:    ${postFiles.join(", ")}`);
  console.log(`   Mode:     ${mode}`);
  console.log(`   Cache:    ${existsSync(cacheFile) && !refreshCache ? "HIT (skip upload)" : "MISS (uploading PDF)"}`);

  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) { console.error("❌ Missing GOOGLE_API_KEY"); process.exit(1); }
  const ai = new GoogleGenAI({ apiKey });

  // Launch shared Playwright browser (used for footer compositing + carousel PDF)
  const EXEC = "/home/alvis/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell";
  const browser = await chromium.launch({ executablePath: EXEC });

  // Phase 1: Render PDF pages
  const { tmpDir, pages: pngPaths } = await extractPdfPages(pdfPath);

  // Phase 2: Analyze slides (cached)
  const slideAnalysis = await loadOrAnalyzeSlides(ai, pdfPath, cacheFile, pngPaths.length, refreshCache);

  // Merge PNG paths with analysis
  const pageData: PageData[] = slideAnalysis.map(s => ({
    ...s,
    pngPath: pngPaths[s.page - 1] ?? pngPaths[0],
  }));
  for (let i = 0; i < pngPaths.length; i++) {
    if (!pageData.find(p => p.page === i + 1)) {
      pageData.push({ page: i + 1, pngPath: pngPaths[i], title: `Slide ${i + 1}`, themes: [], key_stats: [], summary: "" });
    }
  }
  pageData.sort((a, b) => a.page - b.page);

  console.log("\n📑 Slide index:");
  for (const p of pageData) console.log(`   [${p.page}] "${p.title}"`);

  // Global slide usage tracker — limits repetition across posts
  const slideUsageCounts = new Map<number, number>();

  // Process each post
  for (const postFile of postFiles) {
    const postNum = postFile.match(/^(\d+)/)?.[1] ?? "00";
    const postContent = await readFile(join(postsDir, postFile), "utf-8");

    console.log(`\n${"━".repeat(50)}`);
    console.log(`📝 Post ${postNum}: ${postFile}`);

    // Phase 3: Match (with diversity constraint)
    console.log("   Matching to slides...");
    const match = await matchPostToSlides(ai, postContent, pageData, slideUsageCounts);

    // Update usage counts for all selected slides
    for (const slideNum of [match.topImage, ...match.carouselPages]) {
      slideUsageCounts.set(slideNum, (slideUsageCounts.get(slideNum) ?? 0) + 1);
    }
    console.log(`   → Best slide:  ${match.topImage} ("${pageData.find(p => p.page === match.topImage)?.title ?? "?"}")`);
    console.log(`   → Carousel:    slides ${match.carouselPages.join(", ")}`);
    console.log(`   → Reason:      ${match.reasoning}`);

    const tempPngs: string[] = [];

    // Phase 4: Generate images
    if (mode === "image" || mode === "both") {
      const topPage = pageData.find(p => p.page === match.topImage);
      if (topPage) {
        const outPath = join(imagesDir, `post-${postNum}-pdf.jpg`);
        await reformatSlide(ai, topPage, outPath);
        await compositeFooter(browser, outPath);
      }
    }

    if (mode === "carousel" || mode === "both") {
      for (const slideNum of match.carouselPages) {
        const pd = pageData.find(p => p.page === slideNum);
        if (!pd) continue;
        const tmpPath = join(infographicsDir, `_tmp_post-${postNum}-s${slideNum}.png`);
        try {
          await reformatSlide(ai, pd, tmpPath);
          await compositeFooter(browser, tmpPath);
          tempPngs.push(tmpPath);
        } catch (err: any) {
          console.log(`   ⚠️  Slide ${slideNum} failed (${err.message?.slice(0, 60)}), skipping`);
        }
        await sleep(2000); // brief pause between nano-banana-pro calls
      }

      if (tempPngs.length > 0) {
        await compileCarouselPdf(browser, tempPngs, join(infographicsDir, `post-${postNum}-pdf-carousel.pdf`));
        for (const tmp of tempPngs) { try { await unlink(tmp); } catch {} }
      }
    }
  }

  await browser.close();

  // Cleanup temp dir
  try {
    const tmpFiles = await readdir(tmpDir);
    for (const f of tmpFiles) await unlink(join(tmpDir, f));
    await import("node:fs/promises").then(fs => fs.rmdir(tmpDir));
  } catch {}

  console.log(`\n${"━".repeat(50)}`);
  console.log("✅ Done!");
  if (mode === "image" || mode === "both") console.log(`   Images:    ${imagesDir}/post-XX-pdf.jpg`);
  if (mode === "carousel" || mode === "both") console.log(`   Carousels: ${infographicsDir}/post-XX-pdf-carousel.pdf`);
}

main().catch(err => {
  console.error("❌", err.message ?? err);
  process.exit(1);
});
