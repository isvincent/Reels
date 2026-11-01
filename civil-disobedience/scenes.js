// scenes.js — 公民不服從 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const law = (x, y, k, rot = 0, broken = 0) => pop(x, y, k, () => {
  rr(-140, -180, 280, 360, 18, PAL.cream, PAL.ink, 5); txt('法律', 0, -120, 46);
  for (let i = 0; i < 5; i++) line(-100, -50 + i * 45, 100, -50 + i * 45, PAL.faint, 5);
  if (broken > 0) path([[0, -180], [-30, -60], [20, 20], [-20, 100], [10, 180]], broken, PAL.coral, 8);
}, rot);
export const BOARDS = {
  hook(t) {
    law(540, 330, A(t, cl('s1', 0)), -0.03);
    stamp('不公平？', 760, 160, 46, PAL.coral, E(t, cl('s1', 0) + 0.8, 0.35), 0.1);
    pop(280, 780, A(t, cl('s1', 1)), () => { rr(-170, -80, 340, 160, 30, PAL.mint); txt('遵守', 0, 0, 60, PAL.white); });
    pop(780, 780, A(t, cl('s1', 1) + 0.6), () => { rr(-170, -80, 340, 160, 30, PAL.coral); txt('公開違反', 0, 0, 56, PAL.white); });
    pop(530, 780, A(t, cl('s1', 1) + 0.3), () => txt('還是', 0, 0, 40, PAL.soft));
  },
  def(t) {
    sticky(540, 160, 760, 230, A(t, cl('s2', 0)), PAL.sun, ['公民不服從', 'Civil Disobedience'], 40, { firstSize: 88, rot: -0.02 });
    law(260, 560, A(t, cl('s2', 1)), -0.04, E(t, cl('s2', 1) + 0.8, 0.8));
    chip('為了改變不公正', 260, 820, 34, PAL.coral, PAL.white, A(t, cl('s2', 1) + 0.6));
    ['公開', '和平', '故意違法'].forEach((s, i) => chip(s, 760, 420 + i * 140, 50, [PAL.sky, PAL.mint, PAL.orange][i], PAL.white, A(t, cl('s2', 2) + i * 0.4)));
  },
  thoreau(t) {
    pop(280, 380, A(t, cl('s3', 0)), () => { rr(-200, -230, 400, 460, 24, PAL.white, PAL.ink, 5); person(0, -30, 1.1, { t, shirt: '#6B5B4B', hair: '#5A4632' }); txt('梭羅', 0, 140, 44); txt('H. D. Thoreau', 0, 190, 28, PAL.soft); });
    pop(780, 300, A(t, cl('s3', 0) + 0.6), () => { icon('book', 0, -20, 200, PAL.orange); txt('〈論公民不服從〉', 0, 110, 32); });
    stamp('1849', 780, 520, 60, PAL.coral, E(t, cl('s3', 0) + 1.0, 0.35), 0.08);
    card(440, 860, 760, 210, A(t, cl('s3', 1)), () => { icon('coin', -270, 0, 110); cross(-270, 0, 110, E(t, cl('s3', 1) + 0.6, 0.4)); txt('拒絕繳稅', 40, -40, 50); txt('反對奴隸制與戰爭', 40, 30, 34, PAL.soft); });
  },
  history(t) {
    // a relay of nonviolence across time
    path([[100, 520], [980, 520]], E(t, cl('s4', 0), 1.2), PAL.faint, 10);
    const P = [['梭羅', 1849, 160, PAL.orange, cl('s4', 0)], ['甘地', '印度', 540, PAL.mint, cl('s4', 0) + 0.8], ['馬丁·路德·金恩', '美國', 900, PAL.sky, cl('s4', 0) + 1.6]];
    P.forEach(([n, s, x, c, t0], i) => {
      const k = A(t, t0);
      pop(x, 400, k, () => { person(0, 0, 0.9, { t, shirt: c, flip: i === 2 }); });
      chip(n, x, 620, 30, c, PAL.white, k); txt(String(s), x, 680, 26, PAL.soft);
    });
    pop(540, 880, A(t, cl('s4', 1)), () => { heart(-140, 10, 50, PAL.coral); txt('非暴力', 40, 0, 70, PAL.ink); });
  },
  bus(t) {
    // a bus with a seat that one person refuses to give up
    pop(540, 420, A(t, cl('s5', 0)), () => {
      rr(-440, -200, 880, 360, 50, '#FFC94D', PAL.ink, 6); rr(-440, 120, 880, 40, 20, '#E0A82E');
      for (let i = 0; i < 5; i++) rr(-400 + i * 170, -150, 140, 120, 14, '#CFEFFF', PAL.ink, 4);
      circle(-300, 180, 50, PAL.ink); circle(300, 180, 50, PAL.ink); circle(-300, 180, 20, PAL.faint); circle(300, 180, 20, PAL.faint);
      person(-160, 0, 0.7, { t, shirt: '#6B8E5A', hair: '#2B2B2B', bun: true });
    });
    stamp('1955', 220, 160, 56, PAL.coral, E(t, cl('s5', 0) + 0.3, 0.35), -0.08);
    chip('羅莎·帕克斯：不讓座', 380, 680, 38, PAL.coral, PAL.white, A(t, cl('s5', 0) + 1.2));
    // boycott: people walking instead of riding
    for (let i = 0; i < 6; i++) { const k = A(t, cl('s5', 1) + i * 0.15), x = ((t - cl('s5', 1)) * 60 + i * 150) % 900 + 60; person(x, 900, 0.55 * clamp(k), { t: t + i, shirt: [PAL.sky, PAL.lav, PAL.mint][i % 3], run: 0.4 }); }
    chip('公車抵制運動', 760, 760, 36, PAL.ink, PAL.white, A(t, cl('s5', 1) + 0.5));
  },
  features(t) {
    const F = [['公開進行', 'megaphone', PAL.sky, 1, 0], ['非暴力', 'heartIcon', PAL.pink, 1, 0.8], ['為公共利益', 'globe', PAL.mint, 1, 1.6], ['承擔後果', 'shield', PAL.orange, 2, 0]];
    chip('四個特徵', 540, 60, 44, PAL.ink, PAL.white, A(t, cl('s6', 0)));
    F.forEach(([s, ic, c, ci, d], i) => {
      const x = 280 + (i % 2) * 500, y = 300 + Math.floor(i / 2) * 400;
      card(x, y, 420, 330, A(t, cl('s6', ci) + d), () => { rr(-210, -165, 420, 90, 28, c); txt(s, 0, -120, 42, PAL.white); icon(ic, 0, 40, 150, c, t); }, { rot: (i % 2 ? 0.02 : -0.02) });
    });
  },
  debate(t) {
    chip('爭議', 540, 60, 46, PAL.coral, PAL.white, A(t, cl('s7', 0)));
    bubble(320, 320, 520, 170, A(t, cl('s7', 1)), ['誰來判斷', '法律不正義？'], 44, { tail: -0.2 });
    bubble(720, 640, 520, 170, A(t, cl('s7', 2)), ['會不會', '破壞法治？'], 44, { tail: 0.25 });
    pop(250, 760, A(t, cl('s7', 2) + 0.4), () => { circle(0, 0, 90, PAL.sun); txt('?', 0, 4, 120); });
  },
  end(t) {
    // law vs justice on a balance
    const tilt = Math.sin(t * 1.5) * 0.12;
    pop(540, 400, A(t, cl('s8', 0)), () => {
      rr(-10, -10, 20, 330, 8, PAL.ink); ctx.save(); ctx.rotate(tilt); rr(-360, -20, 720, 16, 8, PAL.ink);
      for (const [sx, s, c] of [[-280, '法律', PAL.sky], [280, '正義', PAL.orange]]) { ctx.save(); ctx.translate(sx, -12); ctx.rotate(-tilt); line(-80, 0, -100, 140, PAL.ink, 4); line(80, 0, 100, 140, PAL.ink, 4); rr(-130, 140, 260, 90, 30, c); txt(s, 0, 185, 46, PAL.white); ctx.restore(); }
      ctx.restore();
    });
    if (t > cl('s9', 0) - 0.2) sticky(420, 880, 680, 160, A(t, cl('s9', 0)), PAL.sun, ['違法什麼時候算合理？'], 44, { rot: -0.02 });
    bye(t);
  },
};
