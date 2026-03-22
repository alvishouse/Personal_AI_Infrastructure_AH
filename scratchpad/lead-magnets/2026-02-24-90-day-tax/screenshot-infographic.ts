#!/usr/bin/env bun
/**
 * Screenshot the infographic HTML at 2× scale → 1080×1350 PNG for LinkedIn
 */
import { chromium } from "playwright";
import { resolve } from "node:path";

const HTML_FILE = resolve(import.meta.dir, "05-output/infographic-preview.html");
const OUTPUT    = resolve(import.meta.dir, "04-assets/linkedin-infographic.png");

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });
const page    = await context.newPage();

// Load the HTML file
await page.goto(`file://${HTML_FILE}`);

// Wait for fonts and Lucide icons to render
await page.waitForLoadState("networkidle");
await page.waitForTimeout(800);

// Get the .ig element and screenshot it at 2× device pixel ratio (540px × 2 = 1080px wide)
const ig = page.locator(".ig");
await ig.screenshot({
  path: OUTPUT,
  type: "png",
  scale: "device",
});

await context.close();
await browser.close();

const { width, height } = await import("node:fs").then(async (fs) => {
  // Quick sanity: read PNG dimensions from header
  const buf = fs.readFileSync(OUTPUT);
  return {
    width:  buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
});

console.log(`✅ Saved to ${OUTPUT}`);
console.log(`   Dimensions: ${width} × ${height}px`);
