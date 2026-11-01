// scenes.js — 比較利益原理 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const SL = PAL.sky, RP = PAL.orange;   // 簡報 slides / 報告 reports
const slide = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-30, -22, 60, 44, 6, SL); rr(-20, -12, 26, 16, 3, PAL.white); ctx.restore(); };
const report = (x, y, s = 1) => { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); rr(-22, -30, 44, 60, 5, PAL.white, RP, 4); for (let i = 0; i < 3; i++) line(-12, -14 + i * 14, 12, -14 + i * 14, RP, 3); ctx.restore(); };
function row(x, y, n, fn, k, gap = 70) { for (let i = 0; i < n; i++) if (k * n > i) fn(x + i * gap, y, clamp(k * n - i, 0, 1)); }
export const BOARDS = {
  hook(t) {
    pop(300, 420, A(t, cl('s1', 0)), () => { person(0, 0, 1.4, { t, shirt: ACC }); });
    row(520, 260, 5, (x, y, s) => slide(x, y, s), E(t, cl('s1', 0) + 0.4, 1.2));
    row(520, 420, 5, (x, y, s) => report(x, y, s), E(t, cl('s1', 0) + 0.9, 1.2));
    chip('都比別人快！', 760, 560, 40, ACC, PAL.white, A(t, cl('s1', 0) + 1.6));
    bubble(420, 860, 620, 150, A(t, cl('s1', 1)), '全部自己做？', 54, { tail: -0.2, tailUp: true });
  },
  title(t) {
    pop(270, 380, A(t, cl('s2', 0)), () => { rr(-190, -200, 380, 400, 24, PAL.white, PAL.ink, 5); person(0, -10, 1, { t, shirt: '#5B6B8C', hair: '#BFBFBF' }); txt('李嘉圖', 0, 140, 40); txt('David Ricardo', 0, 180, 26, PAL.soft); });
    stamp('不一定！', 760, 260, 70, PAL.coral, E(t, cl('s2', 0) + 1.0, 0.35), 0.08);
    sticky(560, 800, 780, 260, A(t, cl('s2', 1)), PAL.sun, ['比較利益原理', 'Comparative Advantage'], 40, { firstSize: 84, rot: -0.02 });
  },
  concepts(t) {
    card(280, 380, 460, 500, A(t, cl('s3', 1)), () => {
      rr(-230, -250, 460, 100, 28, PAL.lav); txt('絕對利益', 0, -200, 46, PAL.white);
      icon('clock', 0, -30, 150, PAL.lav, t * 4); txt('誰做得', 0, 120, 38); txt('更快、更好', 0, 170, 38, PAL.lav);
    }, { rot: -0.02 });
    card(800, 380, 460, 500, A(t, cl('s3', 2)), () => {
      rr(-230, -250, 460, 100, 28, ACC); txt('比較利益', 0, -200, 46, PAL.white);
      // a seesaw: doing one thing means giving up another
      ctx.save(); ctx.translate(0, -30); ctx.rotate(Math.sin(t * 2) * 0.12); rr(-150, -8, 300, 16, 8, PAL.ink); slide(-110, -40); report(110, -45); ctx.restore();
      ctx.beginPath(); ctx.moveTo(0, -20); ctx.lineTo(-30, 30); ctx.lineTo(30, 30); ctx.closePath(); ctx.fillStyle = PAL.ink; ctx.fill();
      txt('誰的', 0, 120, 38); txt('機會成本較低', 0, 170, 38, ACC);
    }, { rot: 0.02 });
    chip('機會成本 = 為了做這件事，放棄的東西', 540, 760, 32, PAL.ink, PAL.white, A(t, cl('s3', 2) + 1.2));
  },
  example(t) {
    const people = [['小明', PAL.sky, 6, 3, 0], ['小華', PAL.coral, 2, 2, 1]];
    people.forEach(([n, c, s, r, i]) => {
      const y = 200 + i * 300, k = A(t, cl('s4', i));
      card(540, y, 960, 260, k, () => {
        person(-380, 30, 0.8, { t, shirt: c, bun: i === 1 }); txt(n, -380, -100, 36);
        txt('1 小時', -220, 0, 34, PAL.soft);
        row(-130, -50, s, (x, y2, q) => slide(x, y2, q), E(t, cl('s4', i) + 0.4, 0.8), 60);
        txt('或', 280, 0, 34, PAL.soft);
        row(-130, 60, r, (x, y2, q) => report(x, y2, q), E(t, cl('s4', i) + 0.9, 0.6), 60);
        txt(`${s} 簡報`, 380, -50, 32, SL); txt(`${r} 報告`, 380, 60, 32, RP);
      }, { rot: i ? 0.015 : -0.015 });
    });
    if (t > cl('s5', 0) - 0.2) {
      chip('小明兩樣都強（絕對利益）', 540, 660, 34, PAL.sky, PAL.white, A(t, cl('s5', 0)));
      const kA = A(t, cl('s5', 1)), kB = A(t, cl('s5', 2));
      card(280, 860, 460, 200, kA, () => { txt('小明 1 份報告', 0, -50, 34); txt('= 放棄 2 份簡報', 0, 10, 40, PAL.coral); });
      card(760, 860, 400, 200, kB, () => { txt('小華 1 份報告', 0, -50, 34); txt('= 放棄 1 份簡報', 0, 10, 40, PAL.mint); });
      if (t > cl('s5', 2) + 1) stamp('小華寫報告較划算', 520, 1040, 40, PAL.mint, E(t, cl('s5', 2) + 1, 0.35), -0.04);
    }
  },
  result(t) {
    chip('兩人各有 4 小時', 540, 60, 40, PAL.ink, PAL.white, A(t, cl('s6', 0)));
    const cols = [['各做各的', 16, 10, cl('s6', 0) + 0.3, PAL.faint], ['分工合作', 18, 11, cl('s6', 1), ACC]];
    cols.forEach(([n, s, r, t0, c], i) => {
      const x = 300 + i * 480, k = A(t, t0), g = E(t, t0 + 0.2, 0.8);
      card(x, 470, 420, 640, k, () => {
        rr(-210, -320, 420, 100, 28, c); txt(n, 0, -270, 44, PAL.white);
        rr(-130, 260 - 20 * s * g, 100, 20 * s * g, 10, SL); rr(30, 260 - 20 * r * g, 100, 20 * r * g, 10, RP);
        txt(`${s}`, -80, 220 - 20 * s * g, 44, SL); txt(`${r}`, 80, 220 - 20 * r * g, 44, RP);
        txt('簡報', -80, 290, 30); txt('報告', 80, 290, 30);
      }, { rot: i ? 0.02 : -0.02 });
    });
    chip('小明：3 小時簡報 + 1 小時報告 · 小華：4 小時報告', 540, 860, 26, PAL.soft, PAL.white, A(t, cl('s6', 1) + 0.4));
    stamp('總產量都變多！', 420, 1000, 50, PAL.coral, E(t, cl('s6', 1) + 1.2, 0.35), -0.05);
  },
  trade(t) {
    const kA = A(t, cl('s7', 0)), kB = A(t, cl('s7', 0) + 0.3);
    pop(220, 330, kA, () => { ctx.fillStyle = '#BDE7B0'; ctx.beginPath(); ctx.ellipse(0, 0, 170, 120, 0, 0, Math.PI * 2); ctx.fill(); icon('gear', -40, -10, 100, PAL.lav, t); txt('A 國', 60, 50, 40); });
    pop(860, 330, kB, () => { ctx.fillStyle = '#FFE7B3'; ctx.beginPath(); ctx.ellipse(0, 0, 170, 120, 0, 0, Math.PI * 2); ctx.fill(); icon('leaf', -40, -10, 100); txt('B 國', 60, 50, 40); });
    // goods cross the sea
    const u = ((t - cl('s7', 1)) * 0.5) % 1;
    if (t > cl('s7', 1)) { arrow(400, 280, 680, 280, E(t, cl('s7', 1), 0.5), PAL.lav, 7, -30); arrow(680, 400, 400, 400, E(t, cl('s7', 1) + 0.3, 0.5), PAL.mint, 7, -30); pop(lerp(400, 680, u), 230, 1, () => icon('gear', 0, 0, 50, PAL.lav, t)); pop(lerp(680, 400, u), 450, 1, () => icon('leaf', 0, 0, 50)); }
    chip('雙方都得到更多', 540, 600, 44, ACC, PAL.white, A(t, cl('s7', 2)));
    if (t > cl('s8', 0) - 0.2) {
      card(440, 860, 760, 260, A(t, cl('s8', 0)), () => {
        txt('國際貿易的理論基礎', 0, -70, 44, ACC);
        chip('產業轉型', -170, 40, 34, PAL.coral, PAL.white, A(t, cl('s8', 1) + 0.3)); chip('分配問題', 170, 40, 34, PAL.coral, PAL.white, A(t, cl('s8', 1) + 0.7));
      });
    }
  },
  end(t) {
    const tasks = [['畫海報', PAL.pink], ['上台報告', PAL.sky], ['查資料', PAL.mint], ['剪影片', PAL.orange]];
    for (let i = 0; i < 3; i++) person(220 + i * 300, 360, 1, { t, shirt: [PAL.sky, PAL.coral, PAL.mint][i], flip: i === 2 });
    tasks.forEach(([s, c], i) => {
      const u = E(t, cl('s9', 1) + i * 0.3, 0.6), tx = [220, 520, 820, 220][i], ty = [180, 180, 180, 120][i];
      chip(s, lerp(540, tx + (i === 3 ? 0 : 0), u), lerp(640, i === 3 ? 600 : ty, u), 36, c, PAL.white, A(t, cl('s9', 0) + i * 0.2));
    });
    sticky(420, 860, 600, 150, A(t, cl('s9', 1) + 1.2), PAL.sun, ['誰最適合做什麼？'], 48, { rot: -0.02 });
    bye(t);
  },
};
