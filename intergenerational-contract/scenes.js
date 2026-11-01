// scenes.js — 代際契約 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const elder = (x, y, s, t, o = {}) => person(x, y, s, { t, shirt: o.shirt || PAL.lav, hair: '#D8D8D8', bun: o.bun, ...o });
export const BOARDS = {
  hook(t) {
    pop(250, 420, A(t, cl('s1', 0)), () => { person(0, 0, 1.3, { t, shirt: ACC }); chip('年輕人', 0, 210, 34, ACC, PAL.white, 1); });
    pop(830, 420, A(t, cl('s1', 1)), () => { elder(-50, 0, 1.1, t, { shirt: PAL.orange, bun: true }); elder(70, 10, 1.1, t, { shirt: PAL.sky }); chip('爺爺奶奶', 10, 210, 34, PAL.orange, PAL.white, 1); });
    // coins flow from young to old
    for (let i = 0; i < 5; i++) { const u = ((t - cl('s1', 0) - 0.6) * 0.6 + i / 5) % 1; if (t > cl('s1', 0) + 0.6) pop(lerp(370, 700, u), 360 - Math.sin(u * Math.PI) * 160, 1, () => icon('coin', 0, 0, 60)); }
    chip('保險費 → 退休金', 540, 760, 44, PAL.ink, PAL.white, A(t, cl('s1', 1) + 0.5));
  },
  title(t) {
    sticky(540, 200, 760, 260, A(t, cl('s2', 1) - 0.1), PAL.sun, ['代際契約', 'Intergenerational Contract'], 38, { firstSize: 96, rot: -0.02 });
    pop(540, 640, A(t, cl('s2', 0)), () => {
      // hands of three generations stacked
      const cols = ['#F2C9A0', PAL.skin, '#FFE9D6'];
      for (let i = 0; i < 3; i++) { ctx.save(); ctx.rotate((i - 1) * 0.35); rr(-40, -260 + i * 20, 80, 240, 40, cols[i], PAL.ink, 4); ctx.restore(); }
      heart(0, 40, 60, PAL.coral);
    });
    chip('世代互相扶持', 540, 940, 42, ACC, PAL.white, A(t, cl('s2', 0) + 0.8));
  },
  relay(t) {
    path([[80, 560], [1000, 560]], E(t, cl('s3', 0), 0.8), PAL.faint, 12);
    const G = [['上一代', 180, PAL.orange, true], ['工作世代', 540, ACC, false], ['下一代', 900, PAL.mint, false]];
    G.forEach(([n, x, c, old], i) => {
      const k = A(t, cl('s3', 0) + i * 0.3);
      pop(x, 440, k, () => (old ? elder(0, 0, 1, t, { shirt: c }) : person(0, 0, i === 2 ? 0.75 : 1, { t, shirt: c, run: i === 1 ? 0.3 : 0 })));
      chip(n, x, 660, 32, c, PAL.white, k);
    });
    arrow(470, 300, 250, 300, E(t, cl('s3', 1), 0.5), ACC, 8, 30); chip('照顧', 360, 220, 30, ACC, PAL.white, A(t, cl('s3', 1) + 0.3));
    arrow(830, 300, 610, 300, E(t, cl('s3', 2), 0.5), PAL.mint, 8, 30); chip('將來照顧我', 720, 220, 30, PAL.mint, PAL.white, A(t, cl('s3', 2) + 0.3));
    pop(540, 860, A(t, cl('s3', 0) + 0.5), () => { rr(-60, -14, 120, 28, 14, PAL.coral); txt('接力棒', 0, 50, 30); });
  },
  payg(t) {
    chip('隨收隨付', 540, 60, 50, ACC, PAL.white, A(t, cl('s4', 0)));
    // workers pour coins into a pot, the pot pays retirees in the same moment
    for (let i = 0; i < 4; i++) pop(140 + i * 120, 360, A(t, cl('s4', 1) + i * 0.1), () => person(0, 0, 0.7, { t, shirt: [PAL.sky, PAL.mint, PAL.lav, PAL.coral][i] }));
    chip('現在的工作者', 320, 520, 32, PAL.sky, PAL.white, A(t, cl('s4', 1) + 0.4));
    pop(540, 720, A(t, cl('s4', 1) + 0.2), () => { ctx.fillStyle = '#C9A36A'; ctx.beginPath(); ctx.ellipse(0, 0, 150, 110, 0, 0, Math.PI * 2); ctx.fill(); txt('年金', 0, 0, 50, PAL.white); });
    for (let i = 0; i < 2; i++) pop(800 + i * 140, 360, A(t, cl('s4', 2) + i * 0.15), () => elder(0, 0, 0.75, t, { shirt: PAL.orange, bun: i === 0 }));
    chip('現在的退休者', 870, 520, 32, PAL.orange, PAL.white, A(t, cl('s4', 2) + 0.3));
    const u1 = ((t - cl('s4', 1)) * 0.8) % 1, u2 = ((t - cl('s4', 2)) * 0.8) % 1;
    if (t > cl('s4', 1) + 0.4) pop(lerp(320, 500, u1), lerp(420, 650, u1), 1, () => icon('coin', 0, 0, 50));
    if (t > cl('s4', 2) + 0.4) pop(lerp(600, 860, u2), lerp(650, 420, u2), 1, () => icon('coin', 0, 0, 50));
  },
  balance(t) {
    // a see-saw: fewer workers on one side, more retirees on the other
    const tip = E(t, cl('s5', 1), 1.6, ease.inOutCubic), ang = lerp(0, 0.28, tip);
    const nW = Math.round(lerp(5, 2, tip)), nR = Math.round(lerp(2, 5, tip));
    pop(540, 520, A(t, cl('s5', 0)), () => {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-50, 110); ctx.lineTo(50, 110); ctx.closePath(); ctx.fillStyle = PAL.ink; ctx.fill();
      ctx.save(); ctx.rotate(ang); rr(-440, -14, 880, 20, 10, '#B9895A');
      for (let i = 0; i < nW; i++) person(-400 + i * 70, -110, 0.5, { t, shirt: PAL.sky });
      for (let i = 0; i < nR; i++) elder(400 - i * 70, -110, 0.5, t, { shirt: PAL.orange });
      ctx.restore();
    });
    chip('繳錢的人 ↓', 230, 760, 36, PAL.sky, PAL.white, A(t, cl('s5', 1)));
    chip('領錢的人 ↑', 850, 760, 36, PAL.orange, PAL.white, A(t, cl('s5', 2)));
    chip('少子化 + 高齡化', 540, 120, 40, PAL.coral, PAL.white, A(t, cl('s5', 0) + 0.4));
    if (t > cl('s6', 0) - 0.2) {
      card(440, 950, 760, 190, A(t, cl('s6', 0)), () => {
        txt('臺灣 · 超高齡社會（國發會推估 2025）', 0, -50, 32, PAL.soft);
        rr(-320, 0, 640, 44, 22, '#EEF2F8'); rr(-320, 0, 640 * 0.2 * E(t, cl('s6', 1), 1.0), 44, 22, PAL.coral); txt('65 歲以上 > 20%', 0, 22, 30, PAL.ink);
      });
    }
  },
  beyond(t) {
    chip('不只有錢', 540, 60, 46, PAL.ink, PAL.white, A(t, cl('s7', 0)));
    const L = [['環境', 'leaf', PAL.mint], ['債務', 'cash', PAL.coral], ['資源', 'globe', PAL.sky]];
    L.forEach(([s, ic, c], i) => pop(220 + i * 320, 300, A(t, cl('s7', 1) + i * 0.4), () => { circle(0, 0, 120, PAL.white, c, 7); icon(ic, 0, -20, 110, c, t); txt(s, 0, 70, 36); }));
    chip('留給下一代什麼，也是責任', 540, 500, 36, ACC, PAL.white, A(t, cl('s7', 2)));
    if (t > cl('s8', 0) - 0.2) {
      const S = [['年金改革', PAL.lav, 0, 0], ['支持育兒', PAL.pink, 0, 1.0], ['世代對話', PAL.orange, 1, 0]];
      S.forEach(([s, c, ci, d], i) => sticky(220 + i * 320, 780, 270, 180, A(t, cl('s8', ci) + d + 0.2), c, [s], 44, { color: PAL.white, rot: (i - 1) * 0.04 }));
    }
  },
  end(t) {
    pop(540, 330, A(t, cl('s9', 0)), () => {
      // a gift box handed from one generation to the next
      rr(-110, -90, 220, 180, 16, ACC); rr(-130, -120, 260, 50, 12, PAL.lav); rr(-16, -120, 32, 210, 6, PAL.sun); heart(0, -140, 30, PAL.coral);
    });
    person(240, 520, 1, { t, shirt: ACC, armUp: true }); person(820, 540, 0.75, { t, shirt: PAL.mint, flip: true, armUp: true });
    arrow(360, 420, 700, 420, E(t, cl('s9', 1), 0.6), PAL.coral, 8, 30);
    sticky(420, 800, 680, 160, A(t, cl('s9', 1) + 0.5), PAL.sun, ['你想傳下去什麼？'], 48, { rot: -0.02 });
    bye(t);
  },
};
