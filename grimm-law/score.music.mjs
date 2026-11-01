// score.music.mjs — campus-pop bed from the shared timeline (key / tempo / lead per topic in script.json → MUSIC).
// Bright ukulele-like strum + soft drums under the voice; fuller jingle at the intro and the end card.
import { DUR, MUSIC, LEAD, END } from './timeline.js';
export { DUR };
export default function score(S) {
  S.tempo(MUSIC.bpm); S.space({ room: 0.5, damp: 0.35 });
  const drums = S.bus('drums', { gain: 0.55 });
  const bass = S.bus('bass', { gain: 0.55, highpass: 45 });
  const strum = S.bus('strum', { gain: 0.42, reverb: 0.18, highpass: 200 });
  const pad = S.bus('pad', { gain: 0.16, reverb: 0.3, highpass: 220 });
  const lead = S.bus('lead', { gain: 0.38, reverb: 0.25, delay: 0.12 });
  const bar = S.bar(1), bars = Math.ceil(DUR / bar);
  const scale = S.scale(MUSIC.prog[0][0], 'major');
  let seed = MUSIC.seed; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const motif = Array.from({ length: 8 }, () => [0, 1, 2, 4, 5, 7, 9][Math.floor(rnd() * 7)]);
  const endT = END + 0.3;
  for (let b = 0; b < bars; b++) {
    const t = b * bar; if (t > DUR - 0.05) break;
    const [root, q] = MUSIC.prog[b % MUSIC.prog.length];
    const notes = S.chord(S.midi(root) + 12, q), finale = t >= endT - 0.01, intro = t < LEAD;
    if (t > endT + bar) continue;                       // after the final chord: silence + ring-out
    if (finale) {                                       // final chord rings out
      strum.add(S.pad(S.chord(S.midi(MUSIC.prog[0][0]) + 12, 'add9'), Math.min(3.5, DUR - t - 0.2), { cutoff: 2600, attack: 0.02, release: 1.6 }), endT, { gain: 0.8 });
      bass.add(S.bass(MUSIC.prog[0][0], 1.6, { cutoff: 500, sub: 0.4 }), endT);
      continue;
    }
    pad.add(S.pad(notes, bar * 0.98, { cutoff: 1500, attack: 0.3 }), t);
    for (let e = 0; e < 8; e++) {                        // strum on 8ths, ukulele-ish (down-up)
      const bt = t + S.beat(e / 2); if (bt >= endT) break;
      const accent = e % 2 === 0 ? 1 : 0.6;
      notes.forEach((n, i) => strum.add(S.pluck(n, 0.35, { bright: 0.62, seed: e * 7 + i }), bt + i * 0.012 * (e % 2 ? -1 : 1) + 0.02, { gain: 0.32 * accent, pan: (i - 1) * 0.25 }));
    }
    for (let k = 0; k < 4; k++) {
      const bt = t + S.beat(k); if (bt >= endT) break;
      if (k % 2 === 0) drums.add(S.kick({ decay: 0.22, tone: 52, drive: 0.1 }), bt, { gain: 0.55 });
      if (k % 2 === 1) drums.add(S.clap({ decay: 0.16 }), bt, { gain: 0.32 });
      drums.add(S.shaker(), bt + S.beat(0.5), { gain: 0.28, pan: 0.3 });
      if (k === 0 || k === 2) bass.add(S.bass(root, S.beat(0.9), { cutoff: 420, sub: 0.45, drive: 0.2 }), bt);
    }
    // lead: full motif in the intro, one gentle note per bar under the voice
    if (intro) motif.forEach((d, i) => lead.add(S.mallet(scale(d + 7), 0.6, { material: MUSIC.lead }), t + S.beat(i / 2), { gain: 0.7 }));
    else lead.add(S.mallet(scale(motif[b % 8] + 7), 1.2, { material: MUSIC.lead }), t, { gain: 0.35 });
  }
  // end jingle
  motif.slice(0, 5).forEach((d, i) => lead.add(S.mallet(scale(d + 7 + (i === 4 ? 0 : 0)), 0.9, { material: MUSIC.lead }), endT + 0.2 + i * 0.16, { gain: 0.8 }));
  lead.add(S.mallet(scale(14), 2.2, { material: MUSIC.lead }), endT + 1.05, { gain: 0.9 });
}
