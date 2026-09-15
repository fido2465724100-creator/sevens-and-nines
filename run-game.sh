#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# Check if unpacked binary exists
if [ -x "$DIR/release/linux-unpacked/sevens-and-nines" ]; then
    exec "$DIR/release/linux-unpacked/sevens-and-nines" --no-sandbox "$@"
fi

# Fallback to local electron
if [ -x "$DIR/node_modules/.bin/electron" ]; then
    exec "$DIR/node_modules/.bin/electron" --no-sandbox . "$@"
fi

# Fallback to browser
PORT=5173
npx vite preview --port $PORT --strictPort &
PID=$!
sleep 1
xdg-open "http://localhost:$PORT" 2>/dev/null || sensible-browser "http://localhost:$PORT" 2>/dev/null || true
wait $PID
