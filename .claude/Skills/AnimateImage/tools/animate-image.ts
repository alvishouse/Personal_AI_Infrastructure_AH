#!/usr/bin/env bun
/**
 * AnimateImage — Static image → LinkedIn-optimized animated GIF via Replicate
 *
 * Flow:
 *   1. Submit image + motion prompt to Replicate (wan-720p)
 *   2. Poll until complete
 *   3. Download MP4
 *   4. Convert to LinkedIn-optimized GIF: 540x675px, 6fps, 64 colors, <5MB
 *
 * Claude (the orchestrator) analyzes the image and passes the motion prompt.
 * LinkedIn optimization is automatic — no manual steps needed.
 *
 * Usage:
 *   bun run animate-image.ts --image /path/to/image.png --prompt "water flowing, arms moving"
 *   bun run animate-image.ts --image /path/to/image.png --prompt "..." --model wan-480p
 *
 * Output:
 *   {dir}/{name}-animated-linkedin.gif  (LinkedIn-optimized, <5MB)
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, dirname, basename, extname } from "node:path";
import { execSync } from "node:child_process";
import { tmpdir } from "node:os";

// ─── Load env ─────────────────────────────────────────────────────────────────
const ENV_PATH = resolve(import.meta.dir, "../../../.env");
if (existsSync(ENV_PATH)) {
  for (const line of readFileSync(ENV_PATH, "utf-8").split("\n")) {
    const [k, ...rest] = line.split("=");
    if (k && rest.length) process.env[k.trim()] = rest.join("=").trim();
  }
}

const REPLICATE_API_KEY = process.env.REPLICATE_API_KEY;
if (!REPLICATE_API_KEY) {
  console.error("❌ REPLICATE_API_KEY not found in .env");
  process.exit(1);
}

// ─── Models ───────────────────────────────────────────────────────────────────
const MODELS: Record<string, string> = {
  "wan-480p": "wavespeedai/wan-2.1-i2v-480p",
  "wan-720p": "wavespeedai/wan-2.1-i2v-720p",
};

// ─── LinkedIn output spec (non-negotiable) ────────────────────────────────────
const LI_WIDTH   = 540;
const LI_HEIGHT  = 675;   // 4:5 portrait — LinkedIn standard
const LI_FPS     = 6;
const LI_COLORS  = 64;
const LI_MAX_MB  = 5;

// ─── Args ─────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const getArg = (flag: string) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : null;
};

const imagePath    = getArg("--image");
const modelKey     = getArg("--model") || "wan-720p";
const motionPrompt = getArg("--prompt");

if (!imagePath || !motionPrompt) {
  console.error("Usage: animate-image.ts --image /path/to/image.png --prompt \"motion description\" [--model wan-480p|wan-720p]");
  process.exit(1);
}

const absImagePath = resolve(imagePath);
if (!existsSync(absImagePath)) {
  console.error(`❌ Image not found: ${absImagePath}`);
  process.exit(1);
}

const modelId = MODELS[modelKey];
if (!modelId) {
  console.error(`❌ Unknown model: ${modelKey}. Use: ${Object.keys(MODELS).join(", ")}`);
  process.exit(1);
}

// ─── Output paths ─────────────────────────────────────────────────────────────
const ext      = extname(absImagePath);
const nameBase = basename(absImagePath, ext);
const outDir   = dirname(absImagePath);
const gifPath  = resolve(outDir, `${nameBase}-animated-linkedin.gif`);
const tmpMp4   = resolve(tmpdir(), `animate-${Date.now()}.mp4`);
const tmpPal   = resolve(tmpdir(), `palette-${Date.now()}.png`);

console.log(`\n🎬 AnimateImage`);
console.log(`   Source  : ${absImagePath}`);
console.log(`   Model   : ${modelId}`);
console.log(`   Output  : ${gifPath}`);
console.log(`   LinkedIn: ${LI_WIDTH}×${LI_HEIGHT}px @ ${LI_FPS}fps, ${LI_COLORS} colors, <${LI_MAX_MB}MB\n`);
console.log(`📝 Motion prompt: "${motionPrompt}"`);

// ─── Step 1: Submit to Replicate ──────────────────────────────────────────────
console.log("\n🚀 Submitting to Replicate...");

const mimeType = ext === ".jpg" || ext === ".jpeg" ? "image/jpeg" : "image/png";
const dataUri  = `data:${mimeType};base64,${readFileSync(absImagePath).toString("base64")}`;
const [owner, name] = modelId.split("/");

const createRes = await fetch(
  `https://api.replicate.com/v1/models/${owner}/${name}/predictions`,
  {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_API_KEY}`,
      "Content-Type": "application/json",
      Prefer: "wait",
    },
    body: JSON.stringify({
      input: {
        image: dataUri,
        prompt: motionPrompt,
        num_frames: 81,
        sample_steps: 30,
        frames_per_second: 16,
      },
    }),
  }
);

if (!createRes.ok) {
  console.error(`❌ Replicate submission failed: ${await createRes.text()}`);
  process.exit(1);
}

let prediction = await createRes.json() as {
  id: string; status: string; output?: string | string[];
  error?: string; urls?: { get: string };
};
console.log(`   Prediction ID: ${prediction.id}`);

// ─── Step 2: Poll until complete ──────────────────────────────────────────────
if (prediction.status !== "succeeded") {
  console.log("⏳ Waiting for video generation...");
  const pollUrl = prediction.urls?.get || `https://api.replicate.com/v1/predictions/${prediction.id}`;
  while (!["succeeded","failed","canceled"].includes(prediction.status)) {
    await new Promise(r => setTimeout(r, 3000));
    prediction = await (await fetch(pollUrl, { headers: { Authorization: `Bearer ${REPLICATE_API_KEY}` } })).json();
    process.stdout.write(`   Status: ${prediction.status}\r`);
  }
  console.log();
}

if (prediction.status !== "succeeded" || !prediction.output) {
  console.error(`❌ Generation failed: ${prediction.error || prediction.status}`);
  process.exit(1);
}

const videoUrl = Array.isArray(prediction.output) ? prediction.output[0] : prediction.output;
console.log(`✅ Video ready: ${videoUrl}`);

// ─── Step 3: Download MP4 ─────────────────────────────────────────────────────
console.log("\n⬇️  Downloading MP4...");
const videoData = Buffer.from(await (await fetch(videoUrl)).arrayBuffer());
writeFileSync(tmpMp4, videoData);
console.log(`   MP4: ${(videoData.length / 1024).toFixed(0)} KB`);

// ─── Step 4: Convert to LinkedIn-optimized GIF ───────────────────────────────
console.log("\n🎨 Converting to LinkedIn-optimized GIF...");
console.log(`   Target: ${LI_WIDTH}×${LI_HEIGHT}px, ${LI_FPS}fps, ${LI_COLORS} colors`);

execSync(
  `ffmpeg -i "${tmpMp4}" -vf "fps=${LI_FPS},scale=${LI_WIDTH}:${LI_HEIGHT}:flags=lanczos,palettegen=max_colors=${LI_COLORS}:stats_mode=diff" -y "${tmpPal}"`,
  { stdio: "pipe" }
);
execSync(
  `ffmpeg -i "${tmpMp4}" -i "${tmpPal}" -filter_complex "fps=${LI_FPS},scale=${LI_WIDTH}:${LI_HEIGHT}:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=5" -loop 0 -y "${gifPath}"`,
  { stdio: "pipe" }
);

try { execSync(`rm -f "${tmpMp4}" "${tmpPal}"`); } catch {}

// ─── Verify size ──────────────────────────────────────────────────────────────
const gifMb = readFileSync(gifPath).length / 1024 / 1024;
if (gifMb > LI_MAX_MB) {
  console.warn(`⚠️  GIF is ${gifMb.toFixed(1)}MB — over ${LI_MAX_MB}MB LinkedIn limit. Consider --model wan-480p.`);
} else {
  console.log(`✅ Size OK: ${gifMb.toFixed(1)}MB (LinkedIn limit: ${LI_MAX_MB}MB)`);
}

console.log(`\n✅ GIF ready: ${gifPath}`);
console.log(`   Dimensions: ${LI_WIDTH}×${LI_HEIGHT}px (4:5 portrait)`);
console.log(`   Size: ${gifMb.toFixed(1)} MB`);
console.log(`   Prompt: "${motionPrompt}"`);
