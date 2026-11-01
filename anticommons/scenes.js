// scenes.js — 反公地悲劇 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
function locks(x, y, n, k, t, open = 0) {
  for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + t * 0.2, kk = clamp(k * n - i); pop(x + Math.cos(a) * 230, y + Math.sin(a) * 200, kk, () => { icon('lock', 0, 0, 90, i < open ? PAL.mint : PAL.coral); }); }
}
export const BOARDS = {
  hook(t) {
    // tragedy of the commons: grass eaten away
    const eat = E(t, cl('s1', 1), 1.6);
    card(280, 380, 460, 520, A(t, cl('s1', 0)), () => {
      rr(-230, -260, 460, 90, 28, PAL.mint); txt('公地悲劇', 0, -215, 42, PAL.white);
      for (let i = 0; i < 24; i++) { const x = -190 + (i % 6) * 76, y = -110 + Math.floor(i / 6) * 80; if (hash(i, 3) > eat) { line(x, y + 20, x - 10, y - 10, '#4CBF6E', 6); line(x, y + 20, x + 10, y - 14, '#4CBF6E', 6); } }
      txt('大家搶著用 → 用光', 0, 210, 32);
    }, { rot: -0.02 });
    pop(800, 380, A(t, cl('s1', 2)), () => { circle(0, 0, 120, PAL.sun); txt('反過來？', 0, 0, 48); });
    arrow(540, 380, 660, 380, E(t, cl('s1', 2), 0.4), PAL.soft, 7);
  },
  def(t) {
    sticky(540, 160, 760, 230, A(t, cl('s2', 0)), PAL.sun, ['反公地悲劇', 'Tragedy of the Anticommons'], 34, { firstSize: 84, rot: -0.02 });
    pop(540, 560, A(t, cl('s2', 1)), () => { rr(-130, -100, 260, 200, 20, PAL.cream, PAL.ink, 5); icon('house', 0, -10, 140); });
    locks(540, 560, 7, E(t, cl('s2', 1) + 0.3, 1.0), t);
    chip('太多否決權', 300, 820, 40, PAL.coral, PAL.white, A(t, cl('s2', 1) + 1.1));
    chip('資源被閒置', 660, 900, 40, PAL.soft, PAL.white, A(t, cl('s2', 2)));
    if (t > cl('s3', 0) - 0.2) card(300, 980, 480, 140, A(t, cl('s3', 0)), () => { txt('海勒 Michael Heller', 0, -20, 36); txt('1998 年提出', 0, 30, 30, PAL.soft); });
  },
  moscow(t) {
    chip('莫斯科的街道', 540, 60, 44, ACC, PAL.white, A(t, cl('s4', 0)));
    // empty storefronts with many locks, busy kiosks on the street
    for (let i = 0; i < 3; i++) {
      const x = 200 + i * 340, k = A(t, cl('s4', 1) + i * 0.2);
      pop(x, 330, k, () => {
        rr(-140, -150, 280, 300, 10, '#E9E4DA', PAL.ink, 4); rr(-110, -100, 220, 160, 6, '#C9D3E6'); txt('空', 0, -20, 60, PAL.soft);
        for (let j = 0; j < 4; j++) icon('lock', -90 + j * 60, 110, 44, PAL.coral);
      });
    }
    chip('要很多單位同意', 540, 560, 38, PAL.coral, PAL.white, A(t, cl('s4', 1) + 1.0));
    for (let i = 0; i < 4; i++) pop(170 + i * 200, 790, A(t, cl('s4', 2) + i * 0.2), () => { icon('shop', 0, 0, 140, [PAL.orange, PAL.mint, PAL.sky, PAL.pink][i]); person(0, 110, 0.45, { t, shirt: PAL.lav }); });
    chip('小攤販生意興隆', 420, 1000, 40, PAL.mint, PAL.white, A(t, cl('s4', 2) + 0.9));
  },
  patent(t) {
    chip('生物醫學', 540, 60, 44, ACC, PAL.white, A(t, cl('s5', 0)));
    pop(540, 470, A(t, cl('s5', 1)), () => { circle(0, 0, 120, PAL.white, ACC, 6); icon('pill', 0, 0, 150); });
    const n = 8, open = Math.round(lerp(0, 7, E(t, cl('s5', 1) + 0.5, 1.4)));
    for (let i = 0; i < n; i++) {
      const a = i / n * Math.PI * 2, x = 540 + Math.cos(a) * 320, y = 470 + Math.sin(a) * 280, k = A(t, cl('s5', 1) + i * 0.1);
      pop(x, y, k, () => { rr(-60, -40, 120, 80, 12, PAL.white, PAL.ink, 4); txt(`專利${i + 1}`, 0, -12, 24); i < open ? check(0, 22, 30, 1, PAL.mint, 6) : null; });
      if (i === 7 && t > cl('s5', 2)) stamp('不授權', x, y + 80, 34, PAL.coral, E(t, cl('s5', 2), 0.3), 0.1);
    }
    stamp('研究卡住！', 420, 940, 54, PAL.coral, E(t, cl('s5', 2) + 0.8, 0.35), -0.06);
  },
  renewal(t) {
    chip('都市更新', 540, 60, 44, ACC, PAL.white, A(t, cl('s6', 0)));
    // an old apartment, each window votes
    pop(540, 470, A(t, cl('s6', 1)), () => {
      rr(-260, -330, 520, 660, 10, '#E2D6C3', PAL.ink, 5);
      for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) {
        const i = r * 3 + c, x = -170 + c * 170, y = -260 + r * 125, v = E(t, cl('s6', 1) + 0.4 + i * 0.07, 0.25);
        rr(x - 55, y - 40, 110, 80, 8, '#C9D3E6');
        if (v > 0) { const no = i === 4 || i === 11; ctx.save(); ctx.globalAlpha *= v; no ? cross(x, y, 40, 1, PAL.coral, 8) : check(x, y, 46, 1, PAL.mint, 8); ctx.restore(); }
      }
    });
    stamp('計畫停擺', 540, 900, 60, PAL.coral, E(t, cl('s6', 2) + 0.4, 0.35), -0.05);
  },
  compare(t) {
    const kA = A(t, cl('s7', 1)), kB = A(t, cl('s7', 2));
    card(280, 330, 460, 420, kA, () => { rr(-230, -210, 460, 90, 28, PAL.mint); txt('公地悲劇', 0, -165, 42, PAL.white); txt('使用過度', 0, 0, 60, PAL.coral); txt('資源被耗盡', 0, 110, 34, PAL.soft); }, { rot: -0.02 });
    card(800, 330, 460, 420, kB, () => { rr(-230, -210, 460, 90, 28, ACC); txt('反公地悲劇', 0, -165, 42, PAL.white); txt('使用不足', 0, 0, 60, ACC); txt('資源閒置浪費', 0, 110, 34, PAL.soft); }, { rot: 0.02 });
    if (t > cl('s8', 0) - 0.2) {
      const S = [['整合產權', 'key', 0, 0.9], ['專利池', 'pill', 0, 2.0], ['合理同意門檻', 'ballot', 1, 0.2]];
      S.forEach(([s, ic, ci, d], i) => pop(200 + i * 310, 780, A(t, cl('s8', ci) + d), () => { circle(0, 0, 110, PAL.white, PAL.mint, 6); icon(ic, 0, -20, 90, PAL.mint, t); txt(s, 0, 60, 28); }));
      chip('解決方法', 540, 620, 40, PAL.mint, PAL.white, A(t, cl('s8', 0)));
    }
  },
  end(t) {
    for (let i = 0; i < 5; i++) { const k = A(t, cl('s9', 0) + i * 0.15), nod = i === 3 ? 0 : Math.abs(Math.sin(t * 4 + i)) * 0.15; ctx.save(); ctx.translate(160 + i * 190, 420); ctx.rotate(i === 3 ? Math.sin(t * 6) * 0.15 : 0); person(0, nod * 40, 0.9 * clamp(k), { t, shirt: [PAL.sky, PAL.mint, PAL.lav, PAL.coral, PAL.orange][i] }); ctx.restore(); }
    chip('搖頭', 730, 230, 32, PAL.coral, PAL.white, A(t, cl('s9', 0) + 0.8));
    sticky(420, 760, 680, 170, A(t, cl('s9', 1)), PAL.sun, ['「每個人都要點頭」？'], 46, { rot: -0.02 });
    bye(t);
  },
};
