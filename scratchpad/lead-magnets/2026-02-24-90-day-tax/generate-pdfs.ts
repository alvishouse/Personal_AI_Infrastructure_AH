#!/usr/bin/env bun
/**
 * Generate PDFs from the lead magnet HTML files using Playwright
 *   - guide-preview.html      → 90-day-tax-guide.pdf       (Letter, 5 pages)
 *   - infographic-preview.html → 90-day-tax-infographic.pdf (single page)
 */
import { chromium } from "playwright";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";

const BASE   = resolve(import.meta.dir, "05-output");
const ASSETS = resolve(import.meta.dir, "04-assets");

const FILES = [
  {
    html:   resolve(BASE, "guide-preview.html"),
    output: resolve(ASSETS, "90-day-tax-guide.pdf"),
    label:  "Guide (Letter, 5 pages)",
    pdf: {
      format:          "Letter" as const,
      printBackground: true,
      margin:          { top: "0", right: "0", bottom: "0", left: "0" },
    },
    viewport: { width: 816, height: 1056 },
  },
  {
    html:   resolve(BASE, "infographic-preview.html"),
    output: resolve(ASSETS, "90-day-tax-infographic.pdf"),
    label:  "Infographic (single page)",
    pdf: {
      width:           "540px",
      printBackground: true,
      margin:          { top: "0", right: "0", bottom: "0", left: "0" },
    },
    viewport: { width: 600, height: 900 },
  },
];

const browser = await chromium.launch();

for (const file of FILES) {
  console.log(`\nGenerating: ${file.label}`);

  const page = await browser.newPage();
  await page.setViewportSize(file.viewport);
  await page.goto(`file://${file.html}`);
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(600);

  await page.pdf({ path: file.output, ...file.pdf });
  await page.close();

  // Read PDF size for confirmation
  const bytes = readFileSync(file.output).length;
  const kb    = (bytes / 1024).toFixed(0);
  console.log(`  ✅ ${file.output}`);
  console.log(`     ${kb} KB`);
}

await browser.close();
console.log("\nDone.");
