#!/usr/bin/env bun
/**
 * ReactRenderer — render a React/TSX component to a PNG screenshot
 *
 * Usage:
 *   bun render.ts --component <path/to/Component.tsx> --output <path/to/out.png> [--width 1080] [--height 1350] [--scale 2]
 *
 * The component file must export a default React component.
 * Dimensions default to 1080x1350 (LinkedIn 4:5 portrait) at 2x scale.
 */

import { execSync } from 'child_process'
import { copyFileSync, existsSync } from 'fs'
import { chromium } from 'playwright-core'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// --- Parse args ---
const args = process.argv.slice(2)
const getArg = (flag: string): string | null => {
  const idx = args.indexOf(flag)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : null
}

const componentArg = getArg('--component')
const outputArg = getArg('--output')
const width = parseInt(getArg('--width') ?? '1080')
const height = parseInt(getArg('--height') ?? '1350')
const scale = parseFloat(getArg('--scale') ?? '2')

if (!componentArg || !outputArg) {
  console.error('Usage: bun render.ts --component <path> --output <path> [--width 1080] [--height 1350] [--scale 2]')
  process.exit(1)
}

const componentPath = path.resolve(componentArg)
const outputPath = path.resolve(outputArg)

if (!existsSync(componentPath)) {
  console.error(`Component file not found: ${componentPath}`)
  process.exit(1)
}

// --- Step 1: Copy component into src/DynamicComponent.tsx ---
const dynamicTarget = path.join(__dirname, 'src/DynamicComponent.tsx')
console.log(`Loading component: ${componentPath}`)
copyFileSync(componentPath, dynamicTarget)

// --- Step 2: Vite build ---
console.log('Building with Vite...')
execSync('bun x vite build', {
  cwd: __dirname,
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'production' },
})

// --- Step 3: Serve dist via local HTTP (file:// blocks module scripts) ---
const distDir = path.join(__dirname, 'dist')

const server = Bun.serve({
  port: 0, // OS assigns a free port
  fetch(req) {
    const url = new URL(req.url)
    let filePath = url.pathname === '/' ? '/index.html' : url.pathname
    const fullPath = path.join(distDir, filePath)
    const file = Bun.file(fullPath)
    // Infer content-type from extension
    const ext = path.extname(fullPath)
    const mime: Record<string, string> = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
    }
    return new Response(file, {
      headers: { 'Content-Type': mime[ext] ?? 'application/octet-stream' },
    })
  },
})

const port = server.port
console.log(`Serving dist on http://localhost:${port}`)
console.log(`Launching browser at ${width}x${height} @${scale}x...`)

const browser = await chromium.launch({
  executablePath: '/home/alvis/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell',
})

const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
})

await page.goto(`http://localhost:${port}`)
await page.waitForLoadState('networkidle')
await page.waitForTimeout(2500) // allow Google Fonts to load

await page.screenshot({
  path: outputPath,
  type: 'png',
  clip: { x: 0, y: 0, width, height },
})

await browser.close()
server.stop()
console.log(`✓ Rendered → ${outputPath} (${width * scale}x${height * scale}px)`)
