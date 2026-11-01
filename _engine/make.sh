#!/bin/sh
# Full rebuild of one film:  sh _engine/make.sh <project> [--skip-tts]
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd); P=${1:?project}; SKILL=${SKILL:?set SKILL to the motion-showreel skill dir}
cd "$ROOT"
[ "$2" = --skip-tts ] || python3 _engine/tts.py "$P"
sh _engine/sync.sh "$P"
cp _engine/score.music.mjs _engine/score.sfx.mjs "$P/"
node "$SKILL/scripts/audio.mjs" build "$P/score.music.mjs" --out "$P/audio/music.wav"
node "$SKILL/scripts/audio.mjs" build "$P/score.sfx.mjs" --out "$P/audio/sfx.wav"
python3 _engine/mix.py "$P"
cd "$P" && FPS=30 SIZE=1080x1920 AUDIO=file AUDIO_FILE=audio/final.wav sh build.sh
TITLE=$(node --input-type=module -e 'const m = await import(process.argv[1]); console.log(m.TITLE)' "$ROOT/$P/timeline.js")
cp out/final.mp4 "$ROOT/videos/$TITLE.mp4" && echo "✓ videos/$TITLE.mp4"
