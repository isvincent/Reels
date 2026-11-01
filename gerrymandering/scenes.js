// scenes.js — 傑利蠑螈選區 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const RED = '#F05A5A', BLUE = '#3A86F5';
// 25 voters: columns 0–1 red (10), columns 2–4 blue (15)
const voter = (r, c) => (c < 2 ? 'R' : 'B');
// plan A: each row is a district → every district 2R + 3B → blue wins all 5
const PLAN_A = (r, c) => r;
// plan B: three snake districts with a red majority, two all-blue columns → red wins 3
const PLAN_B_MAP = [
  [0, 0, 0, 3, 4],
  [1, 0, 0, 3, 4],
  [1, 1, 1, 3, 4],
  [2, 2, 1, 3, 4],
  [2, 2, 2, 3, 4],
];
const PLAN_B = (r, c) => PLAN_B_MAP[r][c];
function grid(x0, y0, cell, plan, k, t, o = {}) {
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const v = voter(r, c), x = x0 + c * cell + cell / 2, y = y0 + r * cell + cell / 2;
    const kk = A(t, (o.t0 ?? 0) + (r * 5 + c) * 0.02);
    pop(x, y, kk * clamp(k * 5), () => { circle(0, 0, cell * 0.32, v === 'R' ? RED : BLUE); circle(-cell * 0.08, -cell * 0.05, cell * 0.04, PAL.white); circle(cell * 0.08, -cell * 0.05, cell * 0.04, PAL.white); });
  }
  if (!plan || k <= 0) return;
  // district borders: thick lines between cells of different districts
  ctx.save(); ctx.globalAlpha *= clamp(k);
  ctx.strokeStyle = PAL.ink; ctx.lineWidth = 8; ctx.lineCap = 'round';
  for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
    const x = x0 + c * cell, y = y0 + r * cell, d = plan(r, c);
    if (c === 4 || plan(r, c + 1) !== d) { ctx.beginPath(); ctx.moveTo(x + cell, y); ctx.lineTo(x + cell, y + cell); ctx.stroke(); }
    if (r === 4 || plan(r + 1, c) !== d) { ctx.beginPath(); ctx.moveTo(x, y + cell); ctx.lineTo(x + cell, y + cell); ctx.stroke(); }
    if (c === 0) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + cell); ctx.stroke(); }
    if (r === 0) { ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + cell, y); ctx.stroke(); }
  }
  ctx.restore();
}
function winners(plan) {
  const cnt = {}; for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) { const d = plan(r, c); cnt[d] = cnt[d] || { R: 0, B: 0 }; cnt[d][voter(r, c)]++; }
  const w = Object.values(cnt).map(o => (o.R > o.B ? 'R' : 'B'));
  return { R: w.filter(x => x === 'R').length, B: w.filter(x => x === 'B').length };
}
function seats(x, y, res, k) {
  pop(x, y, k, () => {
    rr(-170, -50, 340, 100, 50, PAL.white, PAL.ink, 4);
    for (let i = 0; i < 5; i++) circle(-120 + i * 60, 0, 22, i < res.B ? BLUE : RED);
  });
}
export const BOARDS = {
  hook(t) {
    grid(290, 90, 100, null, 1, t, { t0: cl('s1', 0) - 0.2 });
    // the border pencil redraws itself between plans
    const flip = Math.floor(Math.max(0, t - cl('s1', 0) - 0.8) / 1.0) % 2;
    grid(290, 90, 100, flip ? PLAN_B : PLAN_A, E(t, cl('s1', 0) + 0.6, 0.4), t, { t0: -9 });
    seats(540, 690, winners(flip ? PLAN_B : PLAN_A), A(t, cl('s1', 0) + 0.8));
    stamp('翻盤！', 400, 900, 66, PAL.coral, E(t, cl('s1', 1), 0.35), -0.1);
  },
  title(t) {
    sticky(540, 190, 740, 260, A(t, cl('s2', 1) - 0.1), PAL.sun, ['傑利蠑螈', 'Gerrymandering'], 44, { firstSize: 96, rot: -0.02 });
    pop(260, 620, A(t, cl('s3', 0)), () => { rr(-190, -170, 380, 340, 24, PAL.white, PAL.ink, 5); person(0, 0, 1, { t, shirt: '#5B6B8C', hair: '#5A4A3A' }); txt('傑利 Elbridge Gerry', 0, 140, 26); });
    stamp('1812 · 麻州', 260, 380, 40, PAL.coral, E(t, cl('s3', 0) + 0.4, 0.35), -0.05);
    // a wiggly district that grows a salamander head & tail
    const k = E(t, cl('s3', 1), 1.1);
    const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([620 + u * 320, 640 + Math.sin(u * 9) * 60 - u * 80]); }
    path(pts, k, '#8A5CF5', 40);
    if (k > 0.95) { circle(950, 560, 34, '#8A5CF5'); circle(962, 552, 7, PAL.white); line(640, 690, 600, 740, '#8A5CF5', 14); line(780, 600, 800, 540, '#8A5CF5', 14); line(860, 640, 880, 700, '#8A5CF5', 14); }
    chip('像一隻蠑螈！', 780, 800, 40, '#8A5CF5', PAL.white, A(t, cl('s3', 1) + 1.1));
  },
  tactics(t) {
    // packing: the opposing voters squeezed into one box; cracking: spread thin
    const kP = A(t, cl('s4', 1)), kC = A(t, cl('s4', 2));
    card(280, 450, 460, 560, kP, () => {
      rr(-230, -280, 460, 100, 28, RED); txt('打包 Packing', 0, -230, 42, PAL.white);
      rr(-150, -130, 300, 200, 20, '#FFE5E5', PAL.ink, 5); for (let i = 0; i < 9; i++) circle(-90 + (i % 3) * 90, -80 + Math.floor(i / 3) * 60, 22, RED);
      txt('全塞進一區', 0, 160, 36); txt('（多的票浪費掉）', 0, 210, 28, PAL.soft);
    }, { rot: -0.02 });
    card(800, 450, 460, 560, kC, () => {
      rr(-230, -280, 460, 100, 28, BLUE); txt('拆散 Cracking', 0, -230, 42, PAL.white);
      for (let d = 0; d < 3; d++) { rr(-200 + d * 140, -130, 120, 200, 16, '#EAF2FF', PAL.ink, 4); circle(-140 + d * 140, -70, 20, RED); for (let i = 0; i < 2; i++) circle(-140 + d * 140, -10 + i * 50, 20, BLUE); }
      txt('分散到各區', 0, 160, 36); txt('（處處都是少數）', 0, 210, 28, PAL.soft);
    }, { rot: 0.02 });
    chip('兩種常見手法', 540, 900, 42, PAL.ink, PAL.white, A(t, cl('s4', 0)));
  },
  grid(t) {
    const kv = A(t, cl('s5', 0));
    grid(90, 80, 110, null, 1, t, { t0: cl('s5', 0) - 0.1 });
    chip('藍 15 · 紅 10', 860, 140, 38, PAL.ink, PAL.white, kv);
    const useB = t >= cl('s5', 2) - 0.1;
    const kA = E(t, cl('s5', 1), 0.5), kB = E(t, cl('s5', 2), 0.5);
    grid(90, 80, 110, useB ? PLAN_B : PLAN_A, useB ? kB : kA, t, { t0: -9 });
    // plan A result
    if (!useB && kA > 0) { seats(860, 340, winners(PLAN_A), A(t, cl('s5', 1) + 0.4)); chip('藍 5 : 紅 0', 860, 450, 38, BLUE, PAL.white, A(t, cl('s5', 1) + 0.7)); }
    if (useB) { seats(860, 340, winners(PLAN_B), A(t, cl('s5', 2) + 0.4)); chip('藍 2 : 紅 3', 860, 450, 38, RED, PAL.white, A(t, cl('s5', 2) + 0.7)); stamp('同樣的票！', 400, 820, 56, PAL.coral, E(t, cl('s5', 2) + 1.2, 0.35), -0.06); }
  },
  fix(t) {
    pop(280, 330, A(t, cl('s6', 1)), () => { for (let i = 0; i < 3; i++) person(-110 + i * 110, 0, 0.75, { t, shirt: [PAL.lav, PAL.mint, PAL.sky][i] }); chip('獨立委員會', 0, 150, 36, PAL.lav, PAL.white, 1); });
    pop(780, 320, A(t, cl('s6', 2)), () => { icon('book', 0, -10, 180, PAL.mint); chip('公開透明標準', 0, 130, 36, PAL.mint, PAL.white, 1); });
    if (t > cl('s7', 0) - 0.2) {
      card(440, 820, 780, 290, A(t, cl('s7', 0)), () => {
        chip('臺灣', -280, -90, 36, PAL.coral, PAL.white, 1);
        txt('中選會', -170, 20, 52); arrow(-60, 20, 60, 20, E(t, cl('s7', 0) + 0.8, 0.4), ACC, 8); txt('研擬', 0, -30, 30, PAL.soft);
        txt('立法院', 190, 20, 52); txt('同意', 190, 80, 32, ACC);
      });
    }
  },
  end(t) {
    pop(540, 320, A(t, cl('s8', 0)), () => { icon('ballot', 0, 0, 240, ACC); });
    chip('每一票的份量', 540, 520, 46, PAL.coral, PAL.white, A(t, cl('s8', 0) + 0.6));
    sticky(420, 720, 640, 150, A(t, cl('s8', 1)), PAL.sun, ['民主不只在投票日'], 46, { rot: -0.02 });
    if (t > cl('s9', 0) - 0.2) pop(720, 900, A(t, cl('s9', 0), { damp: 0.4 }), () => { circle(0, 0, 80, PAL.sun); txt('?', 0, 4, 110); });
    bye(t);
  },
};
