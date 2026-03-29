#!/usr/bin/env bun
/**
 * Screenshot all infographic and animated HTML files to PNG
 * - Static infographics: captured immediately
 * - Animated HTMLs: captured after animations complete
 *
 * Output: same directory, .png extension replacing .html
 * Final size: 1080×1350px (2× deviceScaleFactor on 540×675 canvas)
 */
import { chromium } from "playwright";
import { resolve, dirname } from "node:path";
import { readdirSync, statSync } from "node:fs";

const DIR = resolve(import.meta.dir);

// Files to screenshot: [htmlFile, waitMs, outputFile]
const FILES: [string, number, string][] = [
  ["post-02-infographic.html",    500,  "post-02-infographic.png"],
  ["post-03-featured-frame.html", 500,  "post-03-featured-frame.png"],
  ["post-05-infographic.html",    500,  "post-05-infographic.png"],
  ["post-07-infographic.html",    500,  "post-07-infographic.png"],
  ["post-01-animated.html",      4500,  "post-01-animated.png"],
  ["post-04-animated.html",      5000,  "post-04-animated.png"],
  ["post-06-animated.html",      3500,  "post-06-animated.png"],
];

const browser = await chromium.launch();

for (const [htmlFile, waitMs, outputFile] of FILES) {
  const htmlPath = resolve(DIR, htmlFile);
  const outputPath = resolve(DIR, outputFile);

  console.log(`\n📸 ${htmlFile} → ${outputFile}`);

  const context = await browser.newContext({ deviceScaleFactor: 2 });
  const page = await context.newPage();

  await page.setViewportSize({ width: 540, height: 675 });
  await page.goto(`file://${htmlPath}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(waitMs);

  const ig = page.locator(".ig");
  await ig.screenshot({
    path: outputPath,
    type: "png",
    scale: "device",
  });

  await context.close();

  // Verify dimensions
  const buf = require("fs").readFileSync(outputPath);
  const width  = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  console.log(`   ✅ Saved: ${outputPath}`);
  console.log(`   Dimensions: ${width} × ${height}px`);
}

await browser.close();
console.log("\n✅ All screenshots complete.");
