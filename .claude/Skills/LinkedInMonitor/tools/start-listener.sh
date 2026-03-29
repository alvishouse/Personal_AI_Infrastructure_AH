#!/bin/bash
# Start the Telegram bot listener in the background
SKILL_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PAI_DIR="$(cd "$SKILL_DIR/../../.." && pwd)"
LOG="$SKILL_DIR/logs/listener.log"
PID_FILE="$SKILL_DIR/logs/listener.pid"

if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
  echo "Listener already running (PID $(cat $PID_FILE))"
  exit 0
fi

mkdir -p "$SKILL_DIR/logs"
cd "$PAI_DIR"
nohup bun --env-file "$PAI_DIR/.claude/.env" "$SKILL_DIR/tools/telegram-listener.ts" >> "$LOG" 2>&1 &
echo $! > "$PID_FILE"
echo "Telegram listener started (PID $!)"
echo "Logs: $LOG"
