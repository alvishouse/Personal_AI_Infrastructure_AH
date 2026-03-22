#!/usr/bin/env bun
/**
 * Screenshot infographic-v5.html at 1× scale → 1080px wide PNG for LinkedIn
 * Canvas is natively 1080px wide, so no deviceScaleFactor needed.
 */
import { chromium } from "playwright";
import { resolve } from "node:path";

const HTML_FILE = resolve(import.meta.dir, "03-output/infographic-v5.html");
const OUTPUT    = resolve(import.meta.dir, "03-output/infographic-v5.png");

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 1 });
const page    = await context.newPage();

await page.setViewportSize({ width: 1200, height: 2000 });
await page.goto(`file://${HTML_FILE}`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1500);

const ig = page.locator(".ig");
await ig.screenshot({
  path: OUTPUT,
  type: "png",
  scale: "device",
});

await context.close();
await browser.close();

const fs = await import("node:fs");
const buf = fs.readFileSync(OUTPUT);
const width  = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);

console.log(`✅ Saved: ${OUTPUT}`);
console.log(`   Dimensions: ${width} × ${height}px`);
console.log(`   Aspect ratio: ${(width/height).toFixed(3)} (target 4:5 = 0.800)`);
