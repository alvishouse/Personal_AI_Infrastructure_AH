#!/bin/bash
# Stop the Telegram bot listener
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PID_FILE="$SKILL_DIR/logs/listener.pid"

if [ ! -f "$PID_FILE" ]; then
  echo "No PID file found at $PID_FILE — listener may not be running"
  exit 0
fi

PID="$(cat "$PID_FILE")"

if ! kill -0 "$PID" 2>/dev/null; then
  echo "Process $PID is not running — cleaning up stale PID file"
  rm -f "$PID_FILE"
  exit 0
fi

kill "$PID"
rm -f "$PID_FILE"
echo "Telegram listener stopped (PID $PID)"
