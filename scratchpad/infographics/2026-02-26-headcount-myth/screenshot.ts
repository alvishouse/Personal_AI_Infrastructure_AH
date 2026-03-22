#!/usr/bin/env bun
/**
 * Screenshot the infographic HTML at 2× scale → 1080px wide PNG for LinkedIn
 */
import { chromium } from "playwright";
import { resolve } from "node:path";

const HTML_FILE = resolve(import.meta.dir, "03-output/infographic.html");
const OUTPUT    = resolve(import.meta.dir, "03-output/infographic.png");

const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });
const page    = await context.newPage();

await page.goto(`http://localhost:7777/infographic.html`);
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
