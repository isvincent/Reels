// scenes.js — 格林定律 boards. Local board space: 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, spring } from './motion.js';
import { PAL, ACC, ctx, A, Ac, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, wordMorph, person, icon, shadow, noShadow } from './engine.js';

const wordCard = (word, lang, x, y, k, hi, accent) => card(x, y, 420, 250, k, () => {
  chip(lang, 0, -78, 30, accent, PAL.white, 1);
  font(112); const w = ctx.measureText(word).width; let cx = -w / 2;
  [...word].forEach((ch, i) => { const cw = ctx.measureText(ch).width; txt(ch, cx + cw / 2, 30, 112, hi.includes(i) ? PAL.coral : PAL.ink); font(112); cx += cw; });
}, { rot: x < 540 ? -0.04 : 0.04 });
const letterX = (word, size, i, cx) => { font(size); const w = ctx.measureText(word).width; return cx - w / 2 + ctx.measureText(word.slice(0, i)).width + ctx.measureText(word[i]).width / 2; };

export const BOARDS = {
  hook(t) {
    const k1 = A(t, cl('s1', 0)), k2 = A(t, cl('s1', 1));
    wordCard('father', 'English 英文', 300, 300, k1, [0, 2, 3], PAL.sky);
    wordCard('pater', 'Latin 拉丁文', 760, 680, k2, [0, 2], PAL.coral);
    // dashed links: f ↔ p, th ↔ t
    const kl = E(t, cl('s1', 1) + 0.7, 0.8);
    if (kl > 0) {
      ctx.save(); ctx.setLineDash([14, 12]);
      path(curve(letterX('father', 112, 0, 300), 380, 330, 620, letterX('pater', 112, 0, 760) - 6, 690), kl, PAL.coral, 6);
      path(curve(letterX('father', 112, 2, 300) + 18, 380, 560, 520, letterX('pater', 112, 2, 760), 690), kl, PAL.coral, 6);
      ctx.restore();
    }
    // bouncing question mark
    const kq = A(t, cl('s1', 1) + 0.3, { freq: 2, damp: 0.4 });
    pop(250, 760, kq, () => { circle(0, 0, 110, PAL.sun); txt('?', 0, 6, 170, PAL.ink); }, -0.15);
    sparkle(400, 690, 26, ACC, kq); sparkle(140, 640, 18, PAL.coral, kq);
  },

  title(t) {
    const kS = A(t, cl('s2', 1) - 0.15, { freq: 2, damp: 0.5 });
    sticky(540, 250, 740, 300, kS, PAL.sun, ['格林定律', "Grimm's Law"], 54, { firstSize: 110, rot: -0.03, dy: 0 });
    const kr = A(t, cl('s2', 0));
    pop(150, 110, kr, () => icon('bulb', 0, 0, 120), 0.1);
    // s3: who
    const kn = A(t, cl('s3', 0));
    card(330, 640, 470, 330, kn, () => {
      person(-130, 30, 0.95, { shirt: '#5B6B8C', hair: '#8A6A4A', t });
      txt('雅各布‧格林', 70, -50, 48); txt('Jacob Grimm', 70, 10, 38, PAL.soft); txt('1785–1863 · 德國', 70, 64, 30, PAL.soft);
    }, { rot: -0.03 });
    stamp('1822 年整理', 790, 520, 54, PAL.coral, E(t, cl('s3', 1), 0.35));
    const kb = A(t, cl('s3', 2));
    pop(640, 900, kb, () => { icon('book', 0, 0, 220, PAL.coral); txt('《格林童話》', 0, 150, 46); });
    chip('就是他哥哥！', 370, 930, 38, ACC, PAL.white, A(t, cl('s3', 2) + 0.6), { rot: -0.06 });
    for (let i = 0; i < 4; i++) sparkle(520 + i * 80, 760 + (i % 2) * 40, 18, [PAL.sun, PAL.coral, ACC, PAL.mint][i], A(t, cl('s3', 2) + 0.3 + i * 0.1));
  },

  tree(t) {
    const k0 = A(t, cl('s4', 0)), kA = E(t, cl('s4', 0) + 0.5, 0.6), kL = A(t, cl('s4', 0) + 0.9), kR = A(t, cl('s4', 0) + 1.3), kE = A(t, cl('s4', 0) + 2.2);
    card(540, 110, 420, 120, k0, () => txt('原始印歐語', 0, 0, 52), { fill: PAL.cream, stroke: PAL.ink });
    arrow(470, 180, 280, 330, kA, PAL.soft, 6, 30); arrow(610, 180, 790, 330, kA, ACC, 8, -30);
    card(270, 410, 440, 140, kL, () => { txt('拉丁語・希臘語・梵語', 0, -18, 40); txt('子音大致保留', 0, 34, 30, PAL.soft); });
    card(790, 410, 400, 140, kR, () => { txt('日耳曼語', 0, -18, 50, ACC); txt('子音大變身！', 0, 34, 32, PAL.coral); }, { stroke: ACC });
    arrow(790, 485, 790, 570, E(t, cl('s4', 0) + 1.8, 0.4), ACC, 7);
    card(790, 630, 400, 100, kE, () => txt('英語・德語・荷蘭語', 0, 0, 38));
    // chain shift: three interlocking rings
    const kc = A(t, cl('s4', 1));
    pop(380, 880, kc, () => {
      for (let i = 0; i < 3; i++) {
        ctx.save(); ctx.translate((i - 1) * 110, 0); ctx.rotate(Math.sin(t * 3 + i) * 0.15 + (i % 2 ? 0.6 : -0.6));
        ctx.beginPath(); ctx.ellipse(0, 0, 80, 46, 0, 0, Math.PI * 2); ctx.strokeStyle = [PAL.sky, PAL.coral, PAL.mint][i]; ctx.lineWidth = 20; ctx.stroke(); ctx.restore();
      }
    });
    chip('連鎖推移 chain shift', 380, 1010, 38, PAL.ink, PAL.white, A(t, cl('s4', 1) + 0.5));
  },

  table(t) {
    const rows = [
      { seg: 's5', label: '① 清塞音 → 擦音', pairs: [['p', 'f'], ['t', 'th'], ['k', 'h']], c: PAL.sky },
      { seg: 's7', label: '② 濁塞音 → 清塞音', pairs: [['b', 'p'], ['d', 't'], ['g', 'k']], c: PAL.coral },
      { seg: 's8', label: '③ 送氣濁 → 濁塞音', pairs: [['bh', 'b'], ['dh', 'd'], ['gh', 'g']], c: PAL.mint },
    ];
    // which row is "current"
    const now = t >= cl('s8', 0) ? 2 : t >= cl('s7', 0) ? 1 : 0;
    rows.forEach((r, i) => {
      const y = 90 + i * 150, kr = A(t, cl(r.seg, 0) - 0.1, { freq: 2.2, damp: 0.7 });
      if (kr <= 0) return;
      const dim = i === now ? 1 : 0.45;
      ctx.save(); ctx.globalAlpha *= dim;
      pop(540, y, kr, () => {
        shadow(12, 8, 0.12); rr(-510, -62, 1020, 124, 26, PAL.white); noShadow();
        rr(-510, -62, 1020, 124, 26, null, i === now ? r.c : PAL.faint, i === now ? 6 : 3);
        rr(-510, -62, 330, 124, 26, r.c); txt(r.label, -345, 0, 30, PAL.white);
      });
      const span = clEnd(r.seg, 1) - cl(r.seg, 1);
      r.pairs.forEach((p, j) => {
        const kp = A(t, cl(r.seg, 1) + j * span / 3), x = 480 + j * 205;
        pop(x, y, kp, () => {
          txt(p[0], -58, 0, 58, PAL.soft); arrow(-20, 0, 22, 0, clamp(kp), r.c, 6); txt(p[1], 64, 0, 58, r.c);
        });
      });
      ctx.restore();
    });
    // examples area
    chip('例子 Examples', 170, 580, 30, PAL.ink, PAL.white, A(t, cl('s6', 0)));
    const groups = [
      { seg: 's6', items: [['pater', 'father', [0, 2], [0, 2, 3], 0], ['tres', 'three', [0], [0, 1], 1], ['cornu', 'horn', [0], [0], 2]], A: '拉丁文', B: '英文' },
      { seg: 's7', items: [['duo', 'two', [0], [0], 2]], A: '拉丁文', B: '英文' },
      { seg: 's8', items: [['bhrātar', 'brother', [0, 1], [0], 2]], A: '梵文', B: '英文' },
    ];
    groups.forEach((g, gi) => {
      const next = groups[gi + 1], tOut = next ? cl(next.seg, 0) - 0.2 : Infinity;
      const kout = E(t, tOut, 0.45, ease.inCubic);
      if (t < cl(g.seg, 0) - 0.2 || kout >= 1) return;
      ctx.save(); ctx.translate(-kout * 700, 0); ctx.globalAlpha *= 1 - kout;
      const n = g.items.length;
      g.items.forEach(([a, b, ha, hb, ci], j) => {
        const x = n === 1 ? 540 : 200 + j * 330, t0 = cl(g.seg, n === 1 ? 2 : ci) - (n === 1 ? 0.1 : 0.1);
        card(x, 800, n === 1 ? 560 : 300, 330, A(t, t0 - 0.05, { freq: 2.4, damp: 0.75 }), () => {
          txt(g.A, 0, -130, 26, PAL.soft); txt(g.B, 0, 140, 26, ACC);
        }, { rot: (j - 1) * 0.02 });
        wordMorph(a, b, x, 800, n === 1 ? 86 : 70, A(t, t0), seg(t, t0 + 0.35, t0 + 1.2), ha, hb);
      });
      ctx.restore();
    });
  },

  domino(t) {
    const t0 = cl('s9', 0) + 0.4, labels = ['bh', 'b', 'p', 'f'], cols = [PAL.mint, PAL.coral, PAL.sky, PAL.lav];
    const steps = ['③', '②', '①'];
    // finger push
    const kf = E(t, cl('s9', 0), 0.4);
    pop(90, 470, kf, () => { line(-60, 0, 10, 0, PAL.skin, 26); circle(18, 0, 18, PAL.skin, PAL.ink, 3); txt('推！', -10, -60, 40, PAL.coral); });
    labels.forEach((s, i) => {
      const x = 230 + i * 210, base = 640, h = 300, w = 90;
      const fall = i < 3 ? ease.inQuad(seg(t, t0 + i * 0.32, t0 + i * 0.32 + 0.36)) * 0.62 : 0;
      const last = i === 3 ? ease.inQuad(seg(t, t0 + 3 * 0.32, t0 + 3 * 0.32 + 0.5)) * 1.25 : 0;
      const ang = i < 3 ? fall : last;
      const k = A(t, cl('s9', 0) - 0.1 + i * 0.05, { freq: 2.4, damp: 0.7 });
      pop(x, base, k, () => {
        ctx.save(); ctx.translate(w / 2, 0); ctx.rotate(ang); ctx.translate(-w / 2, 0);
        shadow(10, 6, 0.15); rr(-w / 2, -h, w, h, 14, PAL.white); noShadow(); rr(-w / 2, -h, w, h, 14, null, PAL.ink, 5);
        line(-w / 2 + 12, -h / 2, w / 2 - 12, -h / 2, PAL.faint, 4);
        txt(s, 0, -h * 0.75, 52, cols[i]); circle(0, -h * 0.28, 10, cols[i]); circle(0, -h * 0.16, 10, cols[i]);
        ctx.restore();
      });
      if (i < 3) chip(steps[i], x + 105, base + 70, 34, cols[i + 1], PAL.white, A(t, t0 + i * 0.32 + 0.3));
    });
    line(110, 642, 960, 642, PAL.ink, 6);
    // result
    const kr = A(t, cl('s9', 1));
    card(540, 900, 640, 170, kr, () => {
      txt('father', -170, 0, 70, PAL.ink); txt('≠', 0, 0, 70, PAL.coral); txt('pater', 170, 0, 70, PAL.ink);
      txt('看起來不像…', 0, 64, 28, PAL.soft);
    }, { rot: -0.02 });
  },

  family(t) {
    const k0 = A(t, cl('s10', 0));
    // two cousins holding hands under a little family tree
    pop(540, 330, k0, () => {
      path([[-200, 120], [-200, 40], [200, 40], [200, 120]], 1, PAL.ink, 6); line(0, -40, 0, 40, PAL.ink, 6);
      rr(-170, -110, 340, 80, 40, PAL.cream, PAL.ink, 4); txt('原始印歐語', 0, -70, 40);
    });
    person(340, 600, 1.15, { t, shirt: PAL.sky, armUp: false });
    person(740, 600, 1.15, { t, shirt: PAL.coral, flip: true, bun: true });
    pop(540, 600, A(t, cl('s10', 0) + 0.4), () => heart(0, 0, 44, PAL.coral));
    chip('英文 father', 340, 790, 34, PAL.sky, PAL.white, A(t, cl('s10', 0) + 0.2));
    chip('拉丁文 pater', 740, 790, 34, PAL.coral, PAL.white, A(t, cl('s10', 0) + 0.3));
    stamp('遠房親戚', 540, 170, 50, PAL.coral, E(t, cl('s10', 0) + 0.7, 0.35), 0.06);
    // rule card
    const kr = A(t, cl('s10', 1));
    card(440, 960, 720, 150, kr, () => {
      check(-300, 0, 70, E(t, cl('s10', 1) + 0.4, 0.4), PAL.mint, 14);
      txt('語音改變有規律！', 20, -22, 50); txt('p→f · t→th · k→h …', 20, 36, 34, ACC);
    });
  },

  end(t) {
    const pairs = [['father', 'pater'], ['three', 'tres'], ['two', 'duo'], ['brother', 'bhrātar']];
    pairs.forEach(([a, b], i) => {
      const x = 290 + (i % 2) * 500, y = 160 + Math.floor(i / 2) * 270, k = A(t, cl('s11', 0) + i * 0.18);
      // card flips to show the Latin / Sanskrit cousin
      const flip = seg(t, cl('s11', 1) + i * 0.2, cl('s11', 1) + i * 0.2 + 0.4), sx = Math.abs(Math.cos(flip * Math.PI));
      pop(x, y, k, () => {
        ctx.save(); ctx.scale(Math.max(0.02, sx), 1);
        const back = flip > 0.5;
        shadow(14, 10, 0.15); rr(-210, -100, 420, 200, 24, back ? PAL.cream : PAL.white); noShadow(); rr(-210, -100, 420, 200, 24, null, back ? PAL.coral : ACC, 5);
        txt(back ? b : a, 0, -6, 76, back ? PAL.coral : PAL.ink); txt(back ? (i === 3 ? '梵文表親' : '拉丁表親') : '英文', 0, 62, 26, PAL.soft);
        ctx.restore();
      }, (i % 2 ? 0.03 : -0.03));
    });
    const km = A(t, cl('s11', 1) + 0.5);
    pop(240, 780, km, () => icon('lens', 0, 0, 200), -0.2);
    sticky(560, 780, 440, 190, A(t, cl('s11', 1) + 0.3), PAL.sun, ['找找拉丁「表親」！'], 44, { rot: 0.03 });
    stamp('下課囉！', 420, 1010, 70, PAL.coral, E(t, segById('s11').end + 0.4, 0.4), -0.08);
    for (let i = 0; i < 6; i++) sparkle(120 + i * 130, 960 + (i % 2) * 90, 22, [PAL.sun, ACC, PAL.coral][i % 3], A(t, segById('s11').end + 0.5 + i * 0.07));
  },
};
