#!/usr/bin/env bun
/**
 * Build animated GIF v2: AI Maturity Ladder
 * - All 6 rungs visible from frame 0 (ghost state)
 * - Colored dot travels upward along connector line
 * - Each rung lights up when dot arrives
 * - Previously lit rungs stay bright
 * Canvas: 540×540px (1:1 LinkedIn square)
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
const GIF_PATH = resolve(OUT_DIR, "maturity-ladder-v2.gif");
const TMP_DIR  = resolve(tmpdir(), `ml-gif2-${Date.now()}`);
mkdirSync(TMP_DIR, { recursive: true });

const W = 540, H = 540;

// ─── Rung definitions (display order top→bottom = 6→1) ───────────────────────
const RUNGS = [
  { num: 6, name: "Adaptive Enterprise", stat: "1%",  color: "#64748B", bg: "#F1F5F9", blocker: "Destination — almost nobody is here", muted: true },
  { num: 5, name: "Agentic Enablement",  stat: "11%", color: "#9333EA", bg: "#FAF5FF", blocker: "Agent-level process definition needed" },
  { num: 4, name: "Operational Intelligence", stat: "", color: "#2563EB", bg: "#EFF6FF", blocker: "People Intelligence is the gap" },
  { num: 3, name: "Process Integration", stat: "",    color: "#16A34A", bg: "#F0FDF4", blocker: "Handoffs & verification logic" },
  { num: 2, name: "Tool Adoption",       stat: "39%", color: "#EA580C", bg: "#FFF7ED", blocker: "Process Intelligence missing", danger: true },
  { num: 1, name: "Awareness",           stat: "8%",  color: "#94A3B8", bg: "#F8FAFC", blocker: "No definition of winning" },
] as const;

// ─── Rung Y positions (% of rungs flex container height) ─────────────────────
// 6 equal rows → each occupies 100/6=16.67% → center at i*16.67 - 8.33
// Row 6 = index 0 (top), Row 1 = index 5 (bottom)
const RUNG_Y: Record<number, number> = {
  6: 8.33,
  5: 25.0,
  4: 41.67,
  3: 58.33,
  2: 75.0,
  1: 91.67,
};

// ─── Dot color = next rung to activate ───────────────────────────────────────
const RUNG_COLOR: Record<number, string> = {
  1: "#94A3B8",
  2: "#EA580C",
  3: "#16A34A",
  4: "#2563EB",
  5: "#9333EA",
  6: "#64748B",
};

// ─── Travel interpolation ─────────────────────────────────────────────────────
function lerp(from: number, to: number, steps: number): number[] {
  return Array.from({ length: steps }, (_, i) =>
    from + (to - from) * ((i + 1) / (steps + 1))
  );
}

// ─── Frame definitions ────────────────────────────────────────────────────────
type FrameDef = {
  activeRungs: number[];
  focusRung: number | null;   // the rung currently being highlighted (just activated)
  dotY: number | null;        // dot Y as % of rungs container, null = hidden
  dotColor: string;
  showCallout: boolean;
  delayMs: number;
};

const FRAMES: FrameDef[] = [];

// Dot starts at rung 1, all rungs ghosted
FRAMES.push({ activeRungs: [], focusRung: null, dotY: 91.67, dotColor: "#94A3B8", showCallout: false, delayMs: 800 });

// Activate each rung in turn
for (let rung = 1; rung <= 6; rung++) {
  const prevRung = rung - 1;
  const activeAfter = Array.from({ length: rung }, (_, i) => i + 1);

  // Activate current rung
  FRAMES.push({
    activeRungs: activeAfter,
    focusRung: rung,
    dotY: RUNG_Y[rung],
    dotColor: RUNG_COLOR[rung],
    showCallout: false,
    delayMs: rung === 2 ? 700 : 550, // linger on DANGER rung
  });

  // Travel to next rung (skip after rung 6)
  if (rung < 6) {
    const nextRung = rung + 1;
    const dotPositions = lerp(RUNG_Y[rung], RUNG_Y[nextRung], 3);
    for (const dotY of dotPositions) {
      FRAMES.push({
        activeRungs: activeAfter,
        focusRung: null,
        dotY,
        dotColor: RUNG_COLOR[nextRung],
        showCallout: false,
        delayMs: 90,
      });
    }
  }
}

// Final frame: all active + callout, dot hidden
FRAMES.push({
  activeRungs: [1, 2, 3, 4, 5, 6],
  focusRung: null,
  dotY: null,
  dotColor: "#64748B",
  showCallout: true,
  delayMs: 3000,
});

// ─── HTML generator ───────────────────────────────────────────────────────────
function makeHTML(f: FrameDef): string {
  const dotStyle = f.dotY !== null
    ? `position:absolute;left:3px;top:${f.dotY}%;transform:translateY(-50%);
       width:14px;height:14px;border-radius:50%;
       background:${f.dotColor};
       box-shadow:0 0 0 3px ${f.dotColor}40, 0 0 8px 2px ${f.dotColor}60;
       z-index:3;`
    : `display:none;`;

  // Progress line: solid colored line from bottom (100%) to current dot position
  const progressTop = f.dotY !== null ? f.dotY : (f.activeRungs.length > 0 ? RUNG_Y[Math.max(...f.activeRungs)] : 100);
  const progressStyle = `position:absolute;left:9px;top:${progressTop}%;bottom:0;width:2px;background:${f.dotColor};z-index:1;`;

  const rungRows = RUNGS.map((r) => {
    const active = f.activeRungs.includes(r.num);
    const isFocus = f.focusRung === r.num;

    const borderColor = active ? r.color : "#E2E8F0";
    const bgColor     = active ? r.bg    : "#FAFAFA";
    const numBg       = active ? r.color : "#CBD5E1";
    const nameclr     = active ? (r.muted ? "#94A3B8" : "#0F172A") : "#C8D3DF";
    const blockerClr  = active ? (r.muted ? "#94A3B8" : "#64748B") : "#D1D9E0";

    const dangerBadge = (r as any).danger && active
      ? `<span style="display:inline-flex;align-items:center;background:#FEF2F2;border:1px solid #FECACA;border-radius:4px;padding:1px 5px;font-size:7px;font-weight:800;color:#DC2626;white-space:nowrap;">⚠ MOST ARE HERE</span>`
      : "";

    const statBadge = r.stat
      ? `<span style="display:inline-block;background:${active ? r.color + "22" : "#F1F5F9"};color:${active ? r.color : "#B0BEC5"};border:1px solid ${active ? r.color + "50" : "#E2E8F0"};border-radius:8px;padding:0 6px;font-size:8px;font-weight:800;white-space:nowrap;">${r.stat}</span>`
      : "";

    const focusGlow = isFocus ? `box-shadow:0 0 0 1.5px ${r.color}70, 0 2px 8px ${r.color}30;` : "";

    return `<div style="
      flex:1;display:flex;align-items:center;gap:8px;padding:0 10px;
      background:${bgColor};border-left:3px solid ${borderColor};border-radius:6px;
      ${focusGlow}
    ">
      <div style="width:28px;height:28px;border-radius:50%;background:${numBg};
        color:white;font-size:13px;font-weight:900;
        display:flex;align-items:center;justify-content:center;flex-shrink:0;">${r.num}</div>
      <div style="flex:1;min-width:0;">
        <div style="display:flex;align-items:center;gap:5px;flex-wrap:wrap;margin-bottom:2px;">
          <span style="font-size:10px;font-weight:800;color:${nameclr};line-height:1.2;">${r.name}</span>
          ${statBadge}
          ${dangerBadge}
        </div>
        <div style="font-size:7.5px;color:${blockerClr};font-style:italic;">${r.blocker}</div>
      </div>
    </div>`;
  }).join('<div style="height:4px;flex-shrink:0;"></div>');

  // Callout — always reserve space (visibility toggle keeps layout stable)
  const calloutVis = f.showCallout ? "visible" : "hidden";

  return `<!DOCTYPE html>
<html><head>
<meta charset="UTF-8">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: white; }
  .frame { width:${W}px; height:${H}px; background:white; display:flex; flex-direction:column; font-family:'Inter',sans-serif; overflow:hidden; }
</style>
</head><body>
<div class="frame">

  <!-- TITLE -->
  <div style="background:#0F172A;padding:11px 14px 9px;flex-shrink:0;">
    <div style="font-size:18px;font-weight:900;color:#F8FAFC;letter-spacing:-0.3px;line-height:1.15;">
      The AI <span style="color:#FBBF24;">Maturity Ladder</span>
    </div>
    <div style="font-size:8.5px;font-weight:500;color:#94A3B8;margin-top:3px;">
      99% of organizations are below Rung 4 &nbsp;·&nbsp; Most think they're at Rung 3
    </div>
  </div>

  <!-- BODY: connector + rungs -->
  <div style="flex:1;display:flex;gap:0;padding:8px 10px 6px;min-height:0;">

    <!-- Connector column (20px) -->
    <div style="width:20px;flex-shrink:0;position:relative;">
      <!-- Full height base line (gray) -->
      <div style="position:absolute;left:9px;top:6px;bottom:6px;width:2px;background:#E8EDF2;z-index:0;"></div>
      <!-- Progress line (colored, from bottom to dot) -->
      <div style="${progressStyle}"></div>
      <!-- Animated dot -->
      <div style="${dotStyle}"></div>
    </div>

    <!-- Rungs list -->
    <div style="flex:1;display:flex;flex-direction:column;gap:4px;min-height:0;">
      ${rungRows}

      <!-- Callout (space always reserved) -->
      <div style="flex-shrink:0;margin-top:6px;visibility:${calloutVis};background:#FFF7ED;border:1.5px solid #FED7AA;border-radius:7px;padding:6px 10px;">
        <div style="font-size:9px;font-weight:800;color:#C2410C;margin-bottom:2px;">⚠ The One-Rung Error</div>
        <div style="font-size:8px;color:#475569;line-height:1.5;">Most at Rung 2 believe they're at Rung 3. That single error changes every AI investment decision you make.</div>
      </div>
    </div>
  </div>

  <!-- FOOTER -->
  <div style="flex-shrink:0;display:flex;align-items:center;gap:8px;padding:0 12px;height:34px;border-top:1px solid #E2E8F0;background:#F8FAFC;">
    <img src="https://alvishouse.io/wp-content/uploads/2026/02/alvis-profile.png"
         style="width:22px;height:22px;border-radius:50%;object-fit:cover;border:1.5px solid #CBD5E1;flex-shrink:0;" />
    <div style="font-size:8px;font-weight:600;color:#475569;">
      <strong style="color:#1E293B;">Alvis House</strong> · linkedin.com/in/alvishouse · alvishouse.io
    </div>
  </div>

</div>
</body></html>`;
}

// ─── Write + Screenshot all frames ───────────────────────────────────────────
console.log(`📐 Building ${FRAMES.length} frames...`);

const pngPaths: string[] = [];
const browser = await chromium.launch();
const context  = await browser.newContext({ deviceScaleFactor: 1 });
const page     = await context.newPage();
await page.setViewportSize({ width: W + 20, height: H + 20 });

for (let i = 0; i < FRAMES.length; i++) {
  const htmlPath = resolve(TMP_DIR, `f${i}.html`);
  const pngPath  = resolve(TMP_DIR, `f${i}.png`);
  writeFileSync(htmlPath, makeHTML(FRAMES[i]));

  await page.goto(`file://${htmlPath}`);
  await page.waitForLoadState("networkidle");
  if (i === 0) await page.waitForTimeout(1200); // fonts
  else         await page.waitForTimeout(150);

  await page.locator(".frame").screenshot({ path: pngPath, type: "png", scale: "device" });
  pngPaths.push(pngPath);

  if (i % 5 === 0) process.stdout.write(`  ${i}/${FRAMES.length} frames done\n`);
}
await browser.close();
console.log(`✅ All ${FRAMES.length} frames screenshotted`);

// ─── Encode GIF ───────────────────────────────────────────────────────────────
console.log("🎬 Encoding GIF...");

const encoder = new GIFEncoder(W, H);
encoder.createReadStream().pipe(createWriteStream(GIF_PATH));
encoder.start();
encoder.setRepeat(0);
encoder.setQuality(6);

const canvas = createCanvas(W, H);
const ctx    = canvas.getContext("2d");

for (let i = 0; i < pngPaths.length; i++) {
  const img = await loadImage(readFileSync(pngPaths[i]));
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(img, 0, 0, W, H);
  encoder.setDelay(FRAMES[i].delayMs);
  encoder.addFrame(ctx);
}

encoder.finish();

// Wait for file flush
await new Promise<void>((res) => setTimeout(res, 500));

// ─── Cleanup + stats ──────────────────────────────────────────────────────────
for (const p of [...FRAMES.map((_, i) => resolve(TMP_DIR, `f${i}.html`)), ...pngPaths])
  try { unlinkSync(p); } catch {}

const gifBuf = readFileSync(GIF_PATH);
console.log(`\n✅ GIF → ${GIF_PATH}`);
console.log(`   Frames: ${FRAMES.length} | Size: ${(gifBuf.length / 1024).toFixed(0)} KB | Canvas: ${W}×${H}px`);
