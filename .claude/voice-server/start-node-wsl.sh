#!/usr/bin/env bash
# Start PAI Voice Server for WSL/Linux using Node.js (fixes Bun spawn issues)

cd "$(dirname "$0")"

# Check if already running
if lsof -ti:8888 > /dev/null 2>&1; then
    echo "✓ Voice server already running on port 8888"
    exit 0
fi

# Create logs directory if it doesn't exist
mkdir -p logs

# Start server in background using tsx (TypeScript runtime)
echo "🚀 Starting Node.js voice server..."
nohup npx -y tsx server-node.ts > logs/voice.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Verify it's running
if curl -s http://localhost:8888/health > /dev/null 2>&1; then
    echo "✓ Voice server started successfully (PID: $SERVER_PID)"
    echo "🎙️ Using ElevenLabs voice: Rachel (free tier)"
    echo "⚡ Runtime: Node.js (WSL-compatible)"
    echo "Test it: curl -X POST http://localhost:8888/notify -H 'Content-Type: application/json' -d '{\"message\":\"Test from Node.js\"}'"
else
    echo "✗ Failed to start voice server"
    echo "Check logs at: logs/voice.log"
    exit 1
fi
