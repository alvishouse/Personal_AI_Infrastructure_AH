#!/usr/bin/env bash
# Start PAI Voice Server for WSL/Linux

cd "$(dirname "$0")"

# Check if already running
if lsof -ti:8888 > /dev/null 2>&1; then
    echo "✓ Voice server already running on port 8888"
    exit 0
fi

# Start server in background
nohup bun run server-linux.ts > logs/voice.log 2>&1 &
SERVER_PID=$!

# Wait for server to start
sleep 2

# Verify it's running
if curl -s http://localhost:8888/health > /dev/null 2>&1; then
    echo "✓ Voice server started successfully (PID: $SERVER_PID)"
    echo "🎙️ Using free-tier voice: Rachel"
    echo "Test it: curl -X POST http://localhost:8888/notify -H 'Content-Type: application/json' -d '{\"message\":\"Test\"}'"
else
    echo "✗ Failed to start voice server"
    exit 1
fi
