#!/usr/bin/env bun
/**
 * Build animated GIF: AI Maturity Ladder
 * Canvas: 540×540px (1:1 square LinkedIn format)
 * 8 frames — progressive rung reveal, bottom-to-top
 */

import { chromium } from "playwright";
import { createWriteStream, mkdirSync, writeFileSync, readFileSync, unlinkSync } from "node:fs";
import { resolve } from "node:path";
import { tmpdir } from "node:os";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const GIFEncoder = require("gifencoder");
const { createCanvas, loadImage } = require("canvas");

// ─── Paths ────────────────────────────────────────────────────────────────────
const OUT_DIR  = resolve(import.meta.dir, "03-output");
const GIF_PATH = resolve(OUT_DIR, "maturity-ladder-animated.gif");
const TMP_DIR  = resolve(tmpdir(), `maturity-ladder-${Date.now()}`);
mkdirSync(TMP_DIR, { recursive: true });

const W = 540, H = 540;

// ─── Rung data (display order: 6 at top → 1 at bottom) ───────────────────────
const RUNGS = [
  {
    num: 6, name: "Adaptive Enterprise", stat: "1%",
    color: "#64748B", bg: "#F1F5F9",
    blocker: "The destination — almost nobody is here",
    muted: true,
  },
  {
    num: 5, name: "Agentic Enablement", stat: "11%",
    color: "#9333EA", bg: "#FAF5FF",
    blocker: "Agent-level process definition needed",
  },
  {
    num: 4, name: "Operational Intelligence", stat: "",
    color: "#2563EB", bg: "#EFF6FF",
    blocker: "People Intelligence is the gap",
  },
  {
    num: 3, name: "Process Integration", stat: "",
    color: "#16A34A", bg: "#F0FDF4",
    blocker: "Handoffs & verification logic",
  },
  {
    num: 2, name: "Tool Adoption", stat: "39%",
    color: "#EA580C", bg: "#FFF7ED",
    blocker: "Process Intelligence missing",
    danger: true,
  },
  {
    num: 1, name: "Awareness", stat: "8%",
    color: "#94A3B8", bg: "#F8FAFC",
    blocker: "No definition of winning",
  },
];

// ─── Frame HTML generator ─────────────────────────────────────────────────────
function frameHTML(visibleCount: number, showCallout: boolean): string {
  // visibleCount: 0 = none, 1 = rung 1, 2 = rungs 1+2, etc.

  const rungRows = RUNGS.map((r) => {
    const visible = r.num <= visibleCount;
    const opacity = visible ? 1 : 0.06;

    const dangerBadge = r.danger && visible
      ? `<span style="display:inline-flex;align-items:center;gap:2px;background:#FEF2F2;border:1px solid #FECACA;border-radius:4px;padding:1px 5px;font-size:7px;font-weight:800;color:#DC2626;white-space:nowrap;">⚠ MOST ARE HERE</span>`
      : "";

    const statBadge = r.stat
      ? `<span style="display:inline-block;background:${r.color}22;color:${r.color};border:1px solid ${r.color}50;border-radius:8px;padding:0 6px;font-size:8px;font-weight:800;white-space:nowrap;">${r.stat}</span>`
      : "";

    const numBg = visible ? r.color : "#CBD5E1";
    const nameclr = visible ? (r.muted ? "#94A3B8" : "#0F172A") : "#CBD5E1";
    const blockerClr = visible ? (r.muted ? "#94A3B8" : "#64748B") : "#E2E8F0";
    const borderClr = visible ? r.color : "#E2E8F0";
    const boxShadow = r.danger && visible
      ? `box-shadow:0 0 0 1.5px ${r.color}50;`
      : "";

    return `<div style="
      flex:1;
      display:flex;
      align-items:center;
      gap:9px;
      padding:0 10px;
      background:${visible ? r.bg : "#FAFAFA"};
      border-left:4px solid ${borderClr};
      border-radius:7px;
      opacity:${opacity};
      ${boxShadow}
    ">
      <div style="
        width:30px;height:30px;border-radius:50%;
        background:${numBg};color:white;
        font-size:14px;font-weight:900;
        display:flex;align-items:center;justify-content:center;
        flex-shrink:0;
      ">${r.num}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px;">
          <span style="font-size:10.5px;font-weight:800;color:${nameclr};line-height:1.2;">${r.name}</span>
          ${statBadge}
          ${dangerBadge}
        </div>
        <div style="font-size:8px;color:${blockerClr};font-style:italic;">${r.blocker}</div>
      </div>
    </div>`;
  }).join('<div style="height:4px;flex-shrink:0;"></div>');

  const callout = showCallout
    ? `<div style="flex-shrink:0;margin-top:8px;background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:7px;padding:7px 12px;">
        <div style="font-size:9px;font-weight:800;color:#C2410C;line-height:1.4;">
          ⚠ The One-Rung Error
        </div>
        <div style="font-size:8px;color:#475569;font-weight:500;margin-top:2px;line-height:1.5;">
          Most at Rung 2 believe they're at Rung 3. That single error changes every AI investment decision you make.
        </div>
      </div>`
    : "";

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: white; padding: 0; }
  .frame {
    width: ${W}px;
    height: ${H}px;
    background: white;
    display: flex;
    flex-direction: column;
    font-family: 'Inter', sans-serif;
    overflow: hidden;
  }
</style>
</head><body>
<div class="frame">

  <!-- TITLE BLOCK -->
  <div style="background:#0F172A;padding:12px 14px 10px;flex-shrink:0;">
    <div style="font-size:19px;font-weight:900;color:#F8FAFC;letter-spacing:-0.4px;line-height:1.1;">
      The AI <span style="color:#FBBF24;">Maturity Ladder</span>
    </div>
    <div style="font-size:9px;font-weight:500;color:#94A3B8;margin-top:3px;">
      99% of organizations are below Rung 4 · Most think they're at Rung 3
    </div>
  </div>

  <!-- RUNGS AREA -->
  <div style="flex:1;display:flex;flex-direction:column;padding:8px 10px 6px;min-height:0;">
    ${rungRows}
    ${callout}
  </div>

  <!-- FOOTER -->
  <div style="flex-shrink:0;display:flex;align-items:center;gap:8px;padding:0 12px;height:36px;border-top:1px solid #E2E8F0;background:#F8FAFC;">
    <img src="https://alvishouse.io/wp-content/uploads/2026/02/alvis-profile.png"
         style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1.5px solid #CBD5E1;flex-shrink:0;" />
    <div style="font-size:8px;font-weight:600;color:#475569;">
      <strong style="color:#1E293B;">Alvis House</strong> · linkedin.com/in/alvishouse · alvishouse.io
    </div>
  </div>

</div>
</body></html>`;
}

// ─── Frame sequence ───────────────────────────────────────────────────────────
// [visibleCount, showCallout, delayMs]
const FRAMES: [number, boolean, number][] = [
  [0, false, 1000],   // Title + empty
  [1, false, 700],    // Rung 1
  [2, false, 700],    // Rung 2 — DANGER
  [3, false, 700],    // Rung 3
  [4, false, 700],    // Rung 4
  [5, false, 700],    // Rung 5
  [6, false, 700],    // Rung 6
  [6, true,  2800],   // All + callout (long hold)
];

// ─── Write frame HTML files ───────────────────────────────────────────────────
const framePaths: string[] = [];
for (let i = 0; i < FRAMES.length; i++) {
  const [vc, sc] = FRAMES[i];
  const html = frameHTML(vc, sc);
  const p = resolve(TMP_DIR, `frame-${i}.html`);
  writeFileSync(p, html);
  framePaths.push(p);
}

console.log(`📄 Written ${framePaths.length} frame HTML files to ${TMP_DIR}`);

// ─── Screenshot each frame ────────────────────────────────────────────────────
const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page    = await context.newPage();
await page.setViewportSize({ width: W + 20, height: H + 20 });

const pngPaths: string[] = [];
for (let i = 0; i < framePaths.length; i++) {
  const pngPath = resolve(TMP_DIR, `frame-${i}.png`);
  await page.goto(`file://${framePaths[i]}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(800);

  const el = page.locator(".frame");
  await el.screenshot({ path: pngPath, type: "png", scale: "device" });
  pngPaths.push(pngPath);
  console.log(`📸 Frame ${i} screenshotted`);
}

await browser.close();

// ─── Encode GIF ───────────────────────────────────────────────────────────────
console.log("🎬 Encoding GIF...");

const encoder = new GIFEncoder(W, H);
const gifStream = encoder.createReadStream();
const writeStream = createWriteStream(GIF_PATH);
gifStream.pipe(writeStream);

encoder.start();
encoder.setRepeat(0);   // loop forever
encoder.setQuality(8);  // 1=best, 20=worst

const canvas = createCanvas(W, H);
const ctx = canvas.getContext("2d");

for (let i = 0; i < pngPaths.length; i++) {
  const [, , delayMs] = FRAMES[i];
  const imgData = readFileSync(pngPaths[i]);
  const img = await loadImage(imgData);

  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);

  encoder.setDelay(delayMs);
  encoder.addFrame(ctx);
  console.log(`  Frame ${i} encoded (delay: ${delayMs}ms)`);
}

encoder.finish();

await new Promise<void>((res) => writeStream.on("finish", res));

// ─── Verify output ────────────────────────────────────────────────────────────
const gifBuf = readFileSync(GIF_PATH);
const gifSize = (gifBuf.length / 1024).toFixed(0);

// Clean up temp files
for (const p of [...framePaths, ...pngPaths]) {
  try { unlinkSync(p); } catch {}
}
try { require("node:fs").rmdirSync(TMP_DIR); } catch {}

console.log(`\n✅ GIF created: ${GIF_PATH}`);
console.log(`   Size: ${gifSize} KB`);
console.log(`   Frames: ${FRAMES.length}`);
console.log(`   Canvas: ${W}×${H}px`);
