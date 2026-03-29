import { chromium } from "playwright";
import { resolve } from "node:path";

const DIR = resolve(import.meta.dir);
const browser = await chromium.launch();
const context = await browser.newContext({ deviceScaleFactor: 2 });
const page = await context.newPage();

await page.setViewportSize({ width: 540, height: 1200 });

const htmlPath = resolve(DIR, "post-03-featured-frame.html");
await page.goto(`file://${htmlPath}`);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(1000);

const ig = page.locator(".ig");
await ig.screenshot({
  path: resolve(DIR, "post-03-featured-frame.png"),
  type: "png",
  scale: "device",
});

await context.close();
await browser.close();

const buf = require("fs").readFileSync(resolve(DIR, "post-03-featured-frame.png"));
const width = buf.readUInt32BE(16);
const height = buf.readUInt32BE(20);
console.log(`✅ Saved: post-03-featured-frame.png`);
console.log(`   Dimensions: ${width} × ${height}px`);
