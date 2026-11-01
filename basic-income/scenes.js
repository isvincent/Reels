// scenes.js — 基本收入制度 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const MONTHS = ['1月', '2月', '3月', '4月', '5月', '6月'];
export const BOARDS = {
  hook(t) {
    // a calendar: every month a coin drops into the wallet
    pop(540, 330, A(t, cl('s1', 0)), () => {
      shadow(16, 10); rr(-420, -200, 840, 400, 28, PAL.white); noShadow(); rr(-420, -200, 840, 80, 28, ACC); txt('每個月', 0, -160, 40, PAL.white);
      MONTHS.forEach((m, i) => {
        const x = -280 + (i % 3) * 280, y = -40 + Math.floor(i / 3) * 140, k = A(t, cl('s1', 0) + 0.3 + i * 0.25);
        txt(m, x, y - 30, 30, PAL.soft); pop(x, y + 30, k, () => icon('coin', 0, 0, 70));
      });
    });
    const k = A(t, cl('s1', 1));
    pop(300, 760, k, () => { person(0, 0, 1, { t, shirt: PAL.sky }); chip('上班', 0, 150, 30, PAL.sky, PAL.white, 1); });
    pop(560, 760, A(t, cl('s1', 1) + 0.3), () => { person(0, 0, 1, { t, shirt: PAL.orange, bun: true }); chip('沒上班', 0, 150, 30, PAL.orange, PAL.white, 1); });
    pop(430, 600, A(t, cl('s1', 1) + 0.6), () => { txt('都有', 0, 0, 44, PAL.coral); });
    pop(780, 620, A(t, cl('s1', 2), { damp: 0.4 }), () => { circle(0, 0, 80, PAL.sun); txt('?', 0, 4, 110); });
  },
  def(t) {
    sticky(540, 170, 760, 240, A(t, cl('s2', 0)), PAL.sun, ['基本收入 UBI', 'Universal Basic Income'], 38, { firstSize: 84, rot: -0.02 });
    const F = [['人人都有', 'brain', PAL.sky, 1, 0], ['無條件', 'key', PAL.mint, 1, 0.9], ['定期現金', 'cash', PAL.orange, 2, 0]];
    F.forEach(([s, ic, c, ci, d], i) => card(200 + i * 340, 600, 300, 340, A(t, cl('s3', ci) + d + (i === 0 ? 0.1 : 0)), () => {
      rr(-150, -170, 300, 80, 28, c); txt(['①', '②', '③'][i], 0, -130, 40, PAL.white); icon(ic, 0, 0, 130, c, t); txt(s, 0, 120, 40);
    }, { rot: (i - 1) * 0.03 }));
    chip('不用證明貧窮、不用找工作', 440, 940, 34, PAL.ink, PAL.white, A(t, cl('s3', 1) + 1.4));
  },
  pros(t) {
    chip('支持者說', 540, 70, 44, PAL.mint, PAL.white, A(t, cl('s4', 0)));
    pop(540, 290, A(t, cl('s4', 0) + 0.2), () => { rr(-300, -100, 600, 200, 30, '#DFF8EE', PAL.mint, 5); txt('減少貧窮', 0, 0, 70, PAL.mint); });
    ['進修', '創業', '照顧家人'].forEach((s, i) => sticky(220 + i * 320, 590, 260, 170, A(t, cl('s4', 1) + i * 0.4), [PAL.sky, PAL.orange, PAL.pink][i], [s], 48, { color: PAL.white, rot: (i - 1) * 0.04 }));
    card(420, 900, 700, 190, A(t, cl('s4', 2)), () => { icon('robot', -230, 0, 130); txt('自動化 → 失業', 60, -30, 44); txt('提供安全墊', 60, 36, 40, PAL.mint); });
  },
  cons(t) {
    chip('反對者擔心', 540, 70, 44, PAL.coral, PAL.white, A(t, cl('s5', 0)));
    // a bag of money that keeps growing
    const g = lerp(0.6, 1.4, E(t, cl('s5', 0) + 0.2, 1.2));
    pop(300, 380, A(t, cl('s5', 0) + 0.1), () => {
      ctx.scale(g, g); ctx.fillStyle = '#C9A36A'; ctx.beginPath(); ctx.ellipse(0, 30, 130, 120, 0, 0, Math.PI * 2); ctx.fill(); rr(-50, -110, 100, 40, 14, '#B08A52'); txt('$$$', 0, 30, 60, PAL.white);
    });
    chip('龐大經費', 300, 600, 40, PAL.coral, PAL.white, A(t, cl('s5', 0) + 0.8));
    pop(780, 360, A(t, cl('s5', 1)), () => { rr(-170, -110, 340, 220, 24, PAL.white, PAL.ink, 5); txt('稅', -60, 0, 110, PAL.coral); txt('↑', 90, 0, 120, PAL.coral); });
    card(420, 880, 700, 200, A(t, cl('s5', 2)), () => { person(-240, 20, 0.8, { t, shirt: PAL.faint }); txt('工作意願', 60, -30, 46); txt('會下降嗎？', 60, 34, 46, PAL.coral); });
  },
  finland(t) {
    // Finland map-ish blob + experiment facts
    pop(260, 330, A(t, cl('s6', 0)), () => {
      ctx.fillStyle = '#BFE6FF'; ctx.beginPath(); ctx.moveTo(-40, -200); ctx.quadraticCurveTo(60, -230, 60, -120); ctx.quadraticCurveTo(110, -20, 70, 80); ctx.quadraticCurveTo(80, 180, -20, 200); ctx.quadraticCurveTo(-120, 190, -90, 80); ctx.quadraticCurveTo(-130, -40, -60, -100); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.stroke();
      rr(-80, -16, 160, 32, 4, PAL.white); rr(-80, -4, 160, 8, 2, '#2F5DA8'); rr(-30, -16, 10, 32, 2, '#2F5DA8');
      txt('芬蘭', 0, 250, 40);
    });
    const facts = [['2017–2018', PAL.sky, 0, 0], ['2000 位失業者', PAL.lav, 1, 0], ['每月 560 歐元', PAL.mint, 1, 1]];
    facts.forEach(([s, c, ci, d], i) => chip(s, 740, 180 + i * 140, 44, c, PAL.white, A(t, cl('s6', ci) + d * 1.4 + 0.3)));
    if (t > cl('s7', 0) - 0.2) {
      const k = A(t, cl('s7', 0));
      card(440, 860, 780, 300, k, () => {
        const bars = [['幸福感', 0.85, PAL.mint, cl('s7', 0) + 0.4], ['心理健康', 0.8, PAL.mint, cl('s7', 0) + 0.8], ['就業', 0.35, PAL.orange, cl('s7', 1) + 0.2]];
        bars.forEach(([n, v, c, t0], i) => { const y = -90 + i * 90; txt(n, -260, y, 34); rr(-160, y - 20, 480, 40, 20, '#EEF2F8'); rr(-160, y - 20, 480 * v * E(t, t0, 0.8), 40, 20, c); });
      });
      chip(t > cl('s7', 1) ? '就業：小幅改善' : '比較好！', 300, 1060, 34, t > cl('s7', 1) ? PAL.orange : PAL.mint, PAL.white, A(t, cl('s7', 0) + 1.2));
    }
  },
  net(t) {
    // safety net catches people
    pop(540, 560, A(t, cl('s8', 0)), () => {
      line(-420, -40, -420, 260, PAL.ink, 10); line(420, -40, 420, 260, PAL.ink, 10);
      const sag = 60 + Math.sin(t * 3) * 6;
      for (let i = 0; i < 6; i++) path(curve(-420, -40 + i * 40, 0, -40 + i * 40 + sag, 420, -40 + i * 40), 1, ACC, 4);
      for (let i = 0; i < 9; i++) line(-420 + i * 105, -40, -420 + i * 105, 160 + (i > 0 && i < 8 ? sag * 0.8 : 0), ACC, 4);
    });
    const drop = E(t, cl('s8', 0) + 0.3, 0.8, ease.outBounce || glideFallback);
    person(540, lerp(180, 460, clamp(drop)), 0.9, { t, shirt: PAL.coral, wave: true });
    chip('沒有標準答案', 300, 160, 40, PAL.ink, PAL.white, A(t, cl('s8', 0) + 0.6));
    sticky(420, 960, 680, 150, A(t, cl('s8', 1)), PAL.sun, ['想要什麼樣的社會安全網？'], 40, { rot: -0.02 });
  },
  end(t) {
    pop(540, 340, A(t, cl('s9', 0)), () => {
      rr(-360, -200, 720, 400, 28, PAL.white, PAL.ink, 5); txt('我的 UBI 設計圖', 0, -150, 44, ACC);
      [['發給誰？', 'brain'], ['發多少？', 'coin'], ['錢從哪來？', 'cash']].forEach(([s, ic], i) => { icon(ic, -240, -50 + i * 100, 70, ACC, t); txt(s, -150, -50 + i * 100, 40, PAL.ink, 'left'); line(80, -30 + i * 100, 300, -30 + i * 100, PAL.faint, 4); });
    });
    pop(780, 760, A(t, cl('s9', 1), { damp: 0.4 }), () => { circle(0, 0, 90, PAL.sun); txt('?', 0, 4, 120); });
    bye(t);
  },
};
const glideFallback = x => 1 - (1 - x) ** 3;
