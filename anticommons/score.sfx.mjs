// score.sfx.mjs — sound effects read from the same CUES the page animates on (timeline.js).
import { DUR, CUES } from './timeline.js';
export { DUR };
export default function score(S) {
  const sfx = S.bus('sfx', { gain: 0.8, reverb: 0.15 });
  const notes = ['E6', 'G6', 'A6', 'C7', 'D6'];
  let n = 0;
  for (const c of CUES) {
    if (c.sfx === 'intro') { sfx.add(S.shimmer(1.4, { root: 'E6' }), c.t, { gain: 0.6 }); sfx.add(S.pop('C6'), c.t + 0.2, { gain: 0.8 }); }
    if (c.sfx === 'swoop') sfx.add(S.whoosh(0.6, { from: 500, to: 3500 }), c.t - 0.42, { gain: 0.45 });
    if (c.sfx === 'page') { sfx.add(S.swipe(0.3), c.t - 0.3, { gain: 0.55 }); sfx.add(S.whoosh(0.5, { from: 400, to: 2800 }), c.t - 0.35, { gain: 0.3 }); }
    if (c.sfx === 'pop') sfx.add(S.pop(notes[n++ % notes.length]), c.t - 0.03, { gain: 0.5 });
    if (c.sfx === 'tick') sfx.add(S.mallet('C7', 0.25, { material: 'glock' }), c.t - 0.02, { gain: 0.16 });
    if (c.sfx === 'bell') { sfx.add(S.bell('G5', 2.4), c.t, { gain: 0.5 }); sfx.add(S.shimmer(1.8), c.t + 0.1, { gain: 0.45 }); }
  }
}
