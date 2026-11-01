#!/usr/bin/env python3
"""Mix voice + music + sfx for one project → audio/final.wav (-14 LUFS, true-peak ≤ -1.5 dBTP).
Music is ducked under every measured clause (from audio/voice.json); the voice is never moved or stretched."""
import json, os, subprocess, sys
import numpy as np, soundfile as sf
proj = sys.argv[1]; a = lambda f: os.path.join(proj, 'audio', f)
v, sr = sf.read(a('voice.wav'), dtype='float32'); m, _ = sf.read(a('music.wav'), dtype='float32'); x, _ = sf.read(a('sfx.wav'), dtype='float32')
n = len(v); fit = lambda b: np.pad(b, ((0, max(0, n - len(b))), (0, 0)))[:n]
m, x = fit(m), fit(x)
meta = json.load(open(a('voice.json'), encoding='utf-8'))
duck = np.zeros(n, np.float32)
for s in meta['segments']:
    i0, i1 = int((s['start'] - 0.12) * sr), int((s['end'] + 0.25) * sr); duck[max(0, i0):min(n, i1)] = 1
k = int(0.12 * sr); ker = np.ones(k, np.float32) / k
duck = np.convolve(duck, ker, 'same')
g_music = 0.30 * (1 - duck * (1 - 10 ** (-9 / 20)))      # −9 dB extra under speech
g_sfx = 0.34 * (1 - duck * (1 - 10 ** (-4 / 20)))
out = v * 1.0 + m * g_music[:, None] + x * g_sfx[:, None]
tmp = a('premix.wav'); sf.write(tmp, out, sr, subtype='FLOAT')
tmp2 = a('norm.wav')
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-af', 'loudnorm=I=-14:TP=-1.5:LRA=11', '-ar', '48000', '-c:a', 'pcm_s16le', tmp2], check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp2, '-af', 'apad', '-c:a', 'pcm_s16le', '-t', f"{meta['duration']:.4f}", a('final.wav')], check=True)
os.remove(tmp); os.remove(tmp2); print('✓ mixed', a('final.wav'))
