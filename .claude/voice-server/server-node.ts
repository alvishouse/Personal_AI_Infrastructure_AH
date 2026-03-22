#!/usr/bin/env node
/**
 * PAIVoice - Personal AI Voice notification server using ElevenLabs TTS
 * Node.js version for WSL compatibility (fixes Bun spawn ECHILD issue)
 */

import * as http from 'http';
import { spawn, execSync } from 'child_process';
import { homedir } from 'os';
import { join } from 'path';
import { existsSync, readFileSync, writeFileSync } from 'fs';

// Load .env from user home directory
const envPath = join(homedir(), '.env');
if (existsSync(envPath)) {
  const envContent = readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value && !key.startsWith('#')) {
      process.env[key.trim()] = value.trim();
    }
  });
}

const PORT = parseInt(process.env.PORT || "8888");
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;

if (!ELEVENLABS_API_KEY) {
  console.error('⚠️  ELEVENLABS_API_KEY not found in ~/.env');
  console.error('Add: ELEVENLABS_API_KEY=your_key_here');
}

// Default voice ID
const DEFAULT_VOICE_ID = process.env.ELEVENLABS_VOICE_ID || "21m00Tcm4TlvDq8ikWAM";

// Default model
const DEFAULT_MODEL = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";

// Detect OS and set appropriate audio player
const isLinux = process.platform === 'linux';
const isMac = process.platform === 'darwin';

// Find available audio player on Linux
function findLinuxAudioPlayer(): string[] {
  const players = [
    ['mpv', ['--no-video', '--really-quiet']],
    ['paplay', []],
    ['ffplay', ['-nodisp', '-autoexit', '-loglevel', 'quiet']],
    ['aplay', []]
  ];

  for (const [player, args] of players) {
    try {
      execSync(`which ${player}`, { stdio: 'ignore' });
      return [player, ...(args as string[])];
    } catch {
      // Player not found, continue
    }
  }

  return ['paplay']; // Default fallback
}

const LINUX_AUDIO_PLAYER = isLinux ? findLinuxAudioPlayer() : [];

// Sanitize input for shell commands
function sanitizeForShell(input: string): string {
  return input.replace(/[^a-zA-Z0-9\s.,!?\-']/g, '').trim().substring(0, 500);
}

// Validate and sanitize user input
function validateInput(input: any): { valid: boolean; error?: string } {
  if (!input || typeof input !== 'string') {
    return { valid: false, error: 'Invalid input type' };
  }

  if (input.length > 500) {
    return { valid: false, error: 'Message too long (max 500 characters)' };
  }

  const dangerousPatterns = [
    /[;&|><`\$\(\)\{\}\[\]\\]/,
    /\.\.\//,
    /<script/i,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) {
      return { valid: false, error: 'Invalid characters in input' };
    }
  }

  return { valid: true };
}

// Generate speech using ElevenLabs API
async function generateSpeech(text: string, voiceId: string): Promise<ArrayBuffer> {
  if (!ELEVENLABS_API_KEY) {
    throw new Error('ElevenLabs API key not configured');
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': ELEVENLABS_API_KEY,
    },
    body: JSON.stringify({
      text: text,
      model_id: DEFAULT_MODEL,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    if (errorText.includes('model') || response.status === 422) {
      throw new Error(`ElevenLabs API error: Invalid model "${DEFAULT_MODEL}". Update ELEVENLABS_MODEL in ~/.env.`);
    }
    throw new Error(`ElevenLabs API error: ${response.status} - ${errorText}`);
  }

  return await response.arrayBuffer();
}

// Check if running under WSL
function isWSL(): boolean {
  try {
    const osRelease = readFileSync('/proc/version', 'utf-8');
    return osRelease.toLowerCase().includes('microsoft') || osRelease.toLowerCase().includes('wsl');
  } catch {
    return false;
  }
}

const IS_WSL = isWSL();

// Play audio - cross-platform (Node.js version with proper error handling)
async function playAudio(audioBuffer: ArrayBuffer): Promise<void> {
  const tempFile = `/tmp/voice-${Date.now()}.mp3`;

  // Write audio to temp file (Node.js way)
  writeFileSync(tempFile, Buffer.from(audioBuffer));

  return new Promise((resolve, reject) => {
    let proc;
    let resolved = false;

    if (isMac) {
      // macOS: use afplay
      proc = spawn('/usr/bin/afplay', [tempFile]);
    } else if (isLinux && IS_WSL) {
      // WSL: Use Windows PowerShell to play audio (bypasses PulseAudio issues)
      const windowsPath = execSync(`wslpath -w "${tempFile}"`, { encoding: 'utf-8' }).trim();
      console.log(`🔊 Playing via Windows PowerShell: ${windowsPath}`);

      // Use PowerShell with Windows Media Player COM object or .NET SoundPlayer
      const psScript = `Add-Type -AssemblyName presentationCore; $player = New-Object System.Windows.Media.MediaPlayer; $player.Open('${windowsPath.replace(/\\/g, '\\\\')}'); $player.Play(); Start-Sleep -Seconds 5`;

      proc = spawn('/mnt/c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe', ['-NoProfile', '-Command', psScript], {
        detached: false,
        stdio: 'ignore'
      });

      // Set a timeout for cleanup since PowerShell will handle playback
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('✅ Windows audio playback completed');
          try {
            execSync(`rm -f "${tempFile}"`, { stdio: 'ignore' });
          } catch {}
          resolve();
        }
      }, 6000); // 6 seconds - enough for 5 second playback + margin

      return; // Exit early for WSL
    } else if (isLinux) {
      // Regular Linux: use detected player
      const [player, ...args] = LINUX_AUDIO_PLAYER;
      console.log(`🔊 Playing with: ${player}`);
      proc = spawn(player, [...args, tempFile], {
        detached: false,
        stdio: 'ignore'
      });
    } else {
      reject(new Error('Unsupported platform'));
      return;
    }

    proc.on('error', (error) => {
      if (!resolved) {
        console.error('Error playing audio:', error);
        resolved = true;
        try {
          execSync(`rm -f "${tempFile}"`, { stdio: 'ignore' });
        } catch {}
        reject(error);
      }
    });

    proc.on('exit', (code, signal) => {
      if (!resolved) {
        resolved = true;
        try {
          execSync(`rm -f "${tempFile}"`, { stdio: 'ignore' });
        } catch {}

        if (isLinux) {
          resolve();
        } else if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Audio player exited with code ${code}`));
        }
      }
    });

    // Timeout fallback for Linux
    if (isLinux && !IS_WSL) {
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          console.log('🔊 Audio playback initiated (timeout fallback)');
          try {
            execSync(`rm -f "${tempFile}"`, { stdio: 'ignore' });
          } catch {}
          resolve();
        }
      }, 500);
    }
  });
}

// Spawn a process safely
function spawnSafe(command: string, args: string[]): Promise<void> {
  return new Promise((resolve) => {
    const proc = spawn(command, args, { stdio: 'ignore' });

    proc.on('error', (error) => {
      // Don't reject for notification errors, just log
      console.error(`Note: ${command} not available:`, error.message);
      resolve(); // Continue anyway
    });

    proc.on('exit', () => {
      resolve(); // Always resolve for notifications
    });
  });
}

// Send notification with voice - cross-platform
async function sendNotification(
  title: string,
  message: string,
  voiceEnabled = true,
  voiceId: string | null = null
) {
  // Validate inputs
  const titleValidation = validateInput(title);
  const messageValidation = validateInput(message);

  if (!titleValidation.valid) {
    throw new Error(`Invalid title: ${titleValidation.error}`);
  }

  if (!messageValidation.valid) {
    throw new Error(`Invalid message: ${messageValidation.error}`);
  }

  // Sanitize inputs
  const safeTitle = sanitizeForShell(title);
  const safeMessage = sanitizeForShell(message);

  // Generate and play voice using ElevenLabs
  if (voiceEnabled && ELEVENLABS_API_KEY) {
    try {
      const voice = voiceId || DEFAULT_VOICE_ID;
      console.log(`🎙️  Generating speech with ElevenLabs (voice: ${voice})`);

      const audioBuffer = await generateSpeech(safeMessage, voice);
      await playAudio(audioBuffer);
      console.log('✅ Audio playback completed successfully');
    } catch (error) {
      console.error("Failed to generate/play speech:", error);
    }
  }

  // Display desktop notification
  try {
    if (isMac) {
      // macOS notification
      const script = `display notification "${safeMessage}" with title "${safeTitle}" sound name ""`;
      await spawnSafe('/usr/bin/osascript', ['-e', script]);
    } else if (isLinux) {
      // Linux notification (notify-send)
      await spawnSafe('notify-send', [safeTitle, safeMessage]);
    }
  } catch (error) {
    console.error("Notification display error:", error);
  }
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW = 60000;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// Helper to read request body
function getRequestBody(req: http.IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

// Start HTTP server (Node.js version)
const server = http.createServer(async (req, res) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  const clientIp = req.headers['x-forwarded-for'] as string || 'localhost';

  if (!checkRateLimit(clientIp)) {
    res.writeHead(429, corsHeaders);
    res.end(JSON.stringify({ status: "error", message: "Rate limit exceeded" }));
    return;
  }

  const url = new URL(req.url || '/', `http://localhost:${PORT}`);

  if (url.pathname === "/notify" && req.method === "POST") {
    try {
      const data = await getRequestBody(req);
      const title = data.title || "PAI Notification";
      const message = data.message || "Task completed";
      const voiceEnabled = data.voice_enabled !== false;
      const voiceId = data.voice_id || data.voice_name || null;

      if (voiceId && typeof voiceId !== 'string') {
        throw new Error('Invalid voice_id');
      }

      console.log(`📨 Notification: "${title}" - "${message}" (voice: ${voiceEnabled}, voiceId: ${voiceId || DEFAULT_VOICE_ID})`);

      await sendNotification(title, message, voiceEnabled, voiceId);

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({ status: "success", message: "Notification sent" }));
    } catch (error: any) {
      console.error("Notification error:", error);
      res.writeHead(error.message?.includes('Invalid') ? 400 : 500, corsHeaders);
      res.end(JSON.stringify({ status: "error", message: error.message || "Internal server error" }));
    }
    return;
  }

  if (url.pathname === "/pai" && req.method === "POST") {
    try {
      const data = await getRequestBody(req);
      const title = data.title || "PAI Assistant";
      const message = data.message || "Task completed";

      console.log(`🤖 PAI notification: "${title}" - "${message}"`);

      await sendNotification(title, message, true, null);

      res.writeHead(200, corsHeaders);
      res.end(JSON.stringify({ status: "success", message: "PAI notification sent" }));
    } catch (error: any) {
      console.error("PAI notification error:", error);
      res.writeHead(error.message?.includes('Invalid') ? 400 : 500, corsHeaders);
      res.end(JSON.stringify({ status: "error", message: error.message || "Internal server error" }));
    }
    return;
  }

  if (url.pathname === "/health") {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      status: "healthy",
      port: PORT,
      platform: process.platform,
      voice_system: "ElevenLabs",
      model: DEFAULT_MODEL,
      default_voice_id: DEFAULT_VOICE_ID,
      audio_player: isLinux ? LINUX_AUDIO_PLAYER[0] : 'afplay',
      api_key_configured: !!ELEVENLABS_API_KEY,
      runtime: "Node.js"
    }));
    return;
  }

  res.writeHead(200, corsHeaders);
  res.end(JSON.stringify({ message: "PAIVoice Server (Node.js/WSL) - POST to /notify or /pai" }));
});

server.listen(PORT, () => {
  console.log(`🚀 PAIVoice Server running on port ${PORT}`);
  console.log(`🖥️  Platform: ${process.platform} ${isLinux ? '(Linux/WSL)' : isMac ? '(macOS)' : ''}`);
  if (isLinux) {
    console.log(`🔊 Audio player: ${LINUX_AUDIO_PLAYER[0]}`);
  }
  console.log(`🎙️  Using ElevenLabs TTS (model: ${DEFAULT_MODEL}, voice: ${DEFAULT_VOICE_ID})`);
  console.log(`📡 POST to http://localhost:${PORT}/notify`);
  console.log(`🔒 Security: CORS restricted to localhost, rate limiting enabled`);
  console.log(`🔑 API Key: ${ELEVENLABS_API_KEY ? '✅ Configured' : '❌ Missing'}`);
  console.log(`⚡ Runtime: Node.js (WSL-compatible spawn)`);
});
