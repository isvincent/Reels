#!/usr/bin/env python3
"""Offline narration for one project.

  python3 _engine/tts.py <project-dir>

Reads <project>/script.json, synthesises every clause separately with the offline
MeloTTS zh_en model (sherpa-onnx), measures each clause's REAL duration, and writes:
  audio/voice.wav   48 kHz stereo, already placed on the film timeline (lead-in + pauses + tail)
  audio/voice.json  real clause / segment start-end times (seconds)
  timeline.js       DUR, SEGS, BOARDS, SHOTS, CUES, HOLDS used by the page AND the score

Traditional characters are kept for the burned-in captions; only the text sent to the TTS
is converted to Simplified (same pronunciation, the model's lexicon is Simplified).
Env: MELO_DIR = folder of vits-melo-tts-zh_en (default: ../.models/vits-melo-tts-zh_en).
"""
import json, os, re, subprocess, sys, hashlib
import numpy as np
import sherpa_onnx
import soundfile as sf
from opencc import OpenCC

proj = os.path.abspath(sys.argv[1])
here = os.path.dirname(os.path.abspath(__file__))
MELO = os.environ.get('MELO_DIR', os.path.join(here, '..', '.models', 'vits-melo-tts-zh_en'))
SPEED = float(os.environ.get('TTS_SPEED', '1.0'))   # 1.0 = the model's normal (medium) pace

LEAD = 2.6          # title intro before the first sentence
GAP_CLAUSE = 0.16   # pause after a comma clause
GAP_SEG = 0.45      # pause between sentences on the same board
GAP_BOARD = 0.75    # pause when the board changes (room for the page turn)
TAIL = 4.0          # end card hold after the last sentence

script = json.load(open(os.path.join(proj, 'script.json'), encoding='utf-8'))
cc = OpenCC('t2s')
d = MELO + '/'
cfg = sherpa_onnx.OfflineTtsConfig(
    model=sherpa_onnx.OfflineTtsModelConfig(
        vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=d + 'model.onnx', lexicon=d + 'lexicon.txt', tokens=d + 'tokens.txt', dict_dir=d + 'dict'),
        num_threads=4),
    rule_fsts=f'{d}date.fst,{d}phone.fst,{d}number.fst,{d}new_heteronym.fst')
tts = sherpa_onnx.OfflineTts(cfg)
lex = set()
for line in open(d + 'lexicon.txt', encoding='utf-8'):
    w = line.split(' ', 1)[0]
    if len(w) == 1: lex.add(w)

cache = os.path.join(proj, 'audio', 'tts-cache'); os.makedirs(cache, exist_ok=True)

def synth(text):
    simp = cc.convert(text.replace('：', '，').replace('；', '，').replace('「', '').replace('」', '').replace('《', '').replace('》', ''))
    missing = [ch for ch in simp if '一' <= ch <= '鿿' and ch not in lex]
    if missing: print('  ! not in lexicon:', ''.join(missing), 'in', text)
    key = hashlib.sha1(f'{simp}|{SPEED}'.encode()).hexdigest()[:16]
    f = os.path.join(cache, key + '.npy')
    if os.path.exists(f): return np.load(f), simp
    a = tts.generate(simp, sid=0, speed=SPEED)
    x = np.asarray(a.samples, dtype=np.float32)
    if a.sample_rate != 44100: raise SystemExit(f'unexpected sample rate {a.sample_rate}')
    # trim the model's own leading / trailing silence so the pauses are ours
    nz = np.where(np.abs(x) > 0.012)[0]
    if len(nz): x = x[max(0, nz[0] - 900): min(len(x), nz[-1] + 1800)]
    np.save(f, x)
    return x, simp

SR = 44100
parts, t = [], LEAD
parts.append(np.zeros(int(LEAD * SR), np.float32))
segs = []
prev_board = None
for si, seg in enumerate(script['segments']):
    if si > 0:
        gap = GAP_BOARD if seg['board'] != prev_board else GAP_SEG
        parts.append(np.zeros(int(gap * SR), np.float32)); t += gap
    clauses = []
    for ci, c in enumerate(seg['clauses']):
        show = c['show'] if isinstance(c, dict) else c
        say = c['say'] if isinstance(c, dict) else c
        x, simp = synth(say)
        dur = len(x) / SR
        clauses.append({'text': show, 'start': round(t, 3), 'end': round(t + dur, 3)})
        parts.append(x); t += dur
        if ci < len(seg['clauses']) - 1:
            parts.append(np.zeros(int(GAP_CLAUSE * SR), np.float32)); t += GAP_CLAUSE
    segs.append({'id': seg['id'], 'board': seg['board'], 'text': ''.join(c['text'] for c in clauses),
                 'start': clauses[0]['start'], 'end': clauses[-1]['end'], 'clauses': clauses})
    prev_board = seg['board']
    print(f"  {seg['id']:>4} {segs[-1]['start']:6.2f}–{segs[-1]['end']:6.2f}  {segs[-1]['text']}")

parts.append(np.zeros(int(TAIL * SR), np.float32)); t += TAIL
voice = np.concatenate(parts)
# round the film to whole frames at 30 fps
DUR = round(np.ceil(len(voice) / SR * 30) / 30, 4)
voice = np.pad(voice, (0, int(round(DUR * SR)) - len(voice)))
peak = np.max(np.abs(voice)); voice *= 0.89 / peak
os.makedirs(os.path.join(proj, 'audio'), exist_ok=True)
raw = os.path.join(proj, 'audio', 'voice.raw.wav'); sf.write(raw, voice, SR, subtype='PCM_16')
out = os.path.join(proj, 'audio', 'voice.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', raw, '-ar', '48000', '-ac', '2', '-c:a', 'pcm_s16le', '-t', f'{DUR:.4f}', out], check=True)
os.remove(raw)

meta = {'version': 1,
        'source': {'type': 'ai-written-script', 'provenance': 'written by Claude at the user\'s explicit request (teaching explanation per topic)', 'file': 'script.json'},
        'voice': {'engine': 'sherpa-onnx offline TTS', 'model': 'vits-melo-tts-zh_en (MeloTTS, MIT)', 'speaker': 0, 'speed': SPEED,
                  'note': 'Chromium on this machine only exposes espeak-ng voices, which cannot read Chinese; an offline neural voice was used instead.'},
        'alignment': 'tts-clauses (each clause synthesised separately; times are measured, not estimated)',
        'duration': DUR, 'lead': LEAD, 'tail': TAIL, 'file': 'audio/voice.wav', 'segments': segs}
json.dump(meta, open(os.path.join(proj, 'audio', 'voice.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)

# timeline.js: the single clock for page + score
boards, shots = [], []
for s in segs:
    if not boards or boards[-1]['id'] != s['board']:
        boards.append({'id': s['board'], 't0': s['start'], 'segs': [s['id']]})
    else: boards[-1]['segs'].append(s['id'])
for i, b in enumerate(boards):
    t0 = 0 if i == 0 else b['t0'] - 0.35
    t1 = DUR if i == len(boards) - 1 else boards[i + 1]['t0'] - 0.35
    shots.append({'id': b['id'], 't0': round(t0, 3), 't1': round(t1, 3)})
shots[0]['t0'] = 0
cues = [{'t': 0.15, 'sfx': 'intro'}, {'t': LEAD - 0.5, 'sfx': 'swoop'}]
for i, b in enumerate(boards):
    if i > 0: cues.append({'t': round(b['t0'] - 0.1, 3), 'sfx': 'page'})
for s in segs:
    for ci, c in enumerate(s['clauses']):
        cues.append({'t': c['start'], 'sfx': 'pop' if ci == 0 else 'tick'})
cues.append({'t': round(segs[-1]['end'] + 0.35, 3), 'sfx': 'bell'})
cues.sort(key=lambda c: c['t'])
m = script['music']
js = f"""// timeline.js — GENERATED by _engine/tts.py from script.json + measured TTS durations. Do not hand-edit times.
export const SERIES = {json.dumps(script.get('series', '語言與文化小教室'), ensure_ascii=False)};
export const TITLE = {json.dumps(script['title'], ensure_ascii=False)};
export const EN = {json.dumps(script['en'], ensure_ascii=False)};
export const EP = {script['ep']};
export const ACCENT = {json.dumps(script['accent'])};
export const MUSIC = {json.dumps(m, ensure_ascii=False)};
export const BPM = {m['bpm']};
export const DUR = {DUR};
export const LEAD = {LEAD};
export const END = {segs[-1]['end']};
export const SEGS = {json.dumps(segs, ensure_ascii=False)};
export const BOARDS = {json.dumps(boards, ensure_ascii=False)};
export const SHOTS = {json.dumps(shots)};
export const CUES = {json.dumps(cues)};
export const HOLDS = [[{round(segs[-1]['end'] + 0.9, 3)}, DUR]];
export const DROPS = [];
"""
open(os.path.join(proj, 'timeline.js'), 'w', encoding='utf-8').write(js)
print(f'✓ {os.path.basename(proj)}: DUR {DUR:.2f}s, {len(segs)} sentences, {len(boards)} boards')
