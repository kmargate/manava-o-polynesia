---
name: run-manava-o-polynesia
description: Run, screenshot, and visually verify the Mānava O Polynesia static site locally. Use when asked to run the site, take a screenshot, check a page, verify a change, or confirm a fix works in the browser.
---

Static HTML site (no build step). Served via Python's built-in HTTP server and screenshotted with headless Chrome.

## Prerequisites

- Python 3 (system) — `python3 -m http.server`
- Google Chrome at `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome` (Chrome 148 confirmed working)

No npm, no build, no dependencies to install.

## Run (agent path)

Run the smoke script from the repo root. It starts the server, screenshots all six pages, and shuts down cleanly.

```bash
bash .claude/skills/run-manava-o-polynesia/smoke.sh
```

Screenshots land at:

```
/tmp/manava-home.png
/tmp/manava-about.png
/tmp/manava-events.png
/tmp/manava-gallery.png
/tmp/manava-contact.png
/tmp/manava-team.png
```

Use the `Read` tool to view any of them. The script exits cleanly — no leftover server process.

**Single page / custom port:**

```bash
bash .claude/skills/run-manava-o-polynesia/smoke.sh 9342
```

**Ad-hoc screenshot of one page** (server must already be running on 9341):

```bash
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
"$CHROME" --headless=new --screenshot=/tmp/snap.png --window-size=1280,800 http://localhost:9341/contact.html 2>/dev/null
sleep 1.5
```

**Wider viewport (desktop layout check):**

```bash
"$CHROME" --headless=new --screenshot=/tmp/snap-wide.png --window-size=1440,900 http://localhost:9341/ 2>/dev/null
sleep 1.5
```

## Run (human path)

```bash
python3 -m http.server 9341 --directory .
# Open http://localhost:9341 in a browser, Ctrl-C to stop
```

## Gotchas

- **`chromium-cli` is not installed** on this machine. Use the Chrome binary directly as shown above.
- **Port already in use:** the smoke script picks 9341 by default. Pass a different port as the first argument, or kill the old process: `kill $(lsof -ti:9341)`.
- **Screenshot timing:** Chrome needs ~1.5 s after writing to disk before the file is fully flushed. The `sleep 1.5` in ad-hoc commands is required.
- **All six pages are independent HTML files** — there is no router or SPA navigation. Each page loads fresh assets.
- **Donate modal** requires JS interaction to open; a static screenshot will not show it. To test modal appearance, use `--dump-dom` after injecting JS, or review it in the human browser path.
