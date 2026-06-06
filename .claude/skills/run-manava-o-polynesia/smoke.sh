#!/usr/bin/env bash
# Serves the site locally and takes screenshots of key pages.
# Usage: bash .claude/skills/run-manava-o-polynesia/smoke.sh [port]
# Screenshots land in /tmp/manava-*.png

set -e

PORT="${1:-9341}"
SITE_DIR="$(cd "$(dirname "$0")/../../.." && pwd)"
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
BASE="http://localhost:$PORT"

# Start server
python3 -m http.server "$PORT" --directory "$SITE_DIR" &>/dev/null &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null" EXIT

# Wait for server
for i in $(seq 1 10); do
  curl -s -o /dev/null -w "%{http_code}" "$BASE/" | grep -q 200 && break
  sleep 0.5
done

SS() {
  local label="$1" path="$2"
  "$CHROME" --headless=new \
    --screenshot="/tmp/manava-${label}.png" \
    --window-size=1280,800 \
    "$BASE$path" 2>/dev/null
  sleep 1.5
  echo "  /tmp/manava-${label}.png"
}

echo "Screenshots:"
SS home      /
SS about     /about.html
SS events    /events.html
SS gallery   /gallery.html
SS contact   /contact.html
SS team      /team.html

echo "Done. Server was on port $PORT."
