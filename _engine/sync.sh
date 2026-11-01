#!/bin/sh
# Copy the shared engine into each project (render.mjs serves one project folder as web root).
HERE=$(cd "$(dirname "$0")" && pwd)
for p in "$@"; do cp "$HERE/engine.js" "$HERE/index.html" "$p/"; done
