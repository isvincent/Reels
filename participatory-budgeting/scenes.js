// scenes.js — 參與式預算 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
function pie(x, y, r, parts, k) {
  let a0 = -Math.PI / 2;
  parts.forEach(([v, c]) => { const a1 = a0 + v * Math.PI * 2 * clamp(k); ctx.beginPath(); ctx.moveTo(x, y); ctx.arc(x, y, r, a0, a1); ctx.closePath(); ctx.fillStyle = c; ctx.fill(); a0 = a1; });
  circle(x, y, r, null, PAL.ink, 5);
}
export const BOARDS = {
  hook(t) {
    pop(540, 300, A(t, cl('s1', 0)), () => { icon('cash', -90, 0, 200); icon('coin', 120, 30, 140); });
    chip('全班的預算', 540, 470, 40, ACC, PAL.white, A(t, cl('s1', 0) + 0.4));
    const ideas = [['飲水機', PAL.sky], ['球具', PAL.mint], ['閱讀角', PAL.lav], ['冷氣', PAL.pink]];
    ideas.forEach(([s, c], i) => sticky(180 + i * 240, 700 + (i % 2) * 60, 210, 150, A(t, cl('s1', 1) + 0.3 + i * 0.3), c, [s], 42, { color: PAL.white, rot: (i % 2 ? 0.05 : -0.05) }));
    pop(780, 980, A(t, cl('s1', 2)), () => icon('ballot', 0, 0, 150, ACC), 0.1);
  },
  def(t) {
    sticky(540, 190, 760, 260, A(t, cl('s2', 0)), PAL.sun, ['參與式預算', 'Participatory Budgeting'], 38, { firstSize: 86, rot: -0.02 });
    const k = E(t, cl('s2', 2), 1.0);
    pie(330, 690, 210, [[0.85, '#DDE3EE'], [0.15, ACC]], E(t, cl('s2', 1), 0.8));
    if (k > 0) { arrow(560, 600, 460, 640, k, ACC, 7, -20); chip('一部分 → 居民決定', 760, 580, 34, ACC, PAL.white, k); }
    for (let i = 0; i < 4; i++) person(620 + i * 70, 850, 0.55, { t, shirt: [PAL.sky, PAL.coral, PAL.mint, PAL.lav][i], armUp: E(t, cl('s2', 1) + 0.3 + i * 0.1, 0.3) > 0.5, flip: i % 2 === 1 });
  },
  origin(t) {
    pop(330, 420, A(t, cl('s3', 0)), () => {
      ctx.fillStyle = '#BDE7B0'; ctx.beginPath(); ctx.moveTo(-80, -250); ctx.quadraticCurveTo(120, -260, 200, -120); ctx.quadraticCurveTo(220, 20, 100, 120); ctx.quadraticCurveTo(20, 260, -40, 260); ctx.quadraticCurveTo(-60, 120, -150, 40); ctx.quadraticCurveTo(-240, -120, -80, -250); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7FC36F'; ctx.lineWidth = 5; ctx.stroke();
      circle(60, 180, 18, PAL.coral); txt('巴西', -20, -60, 48);
    });
    chip('阿雷格里港', 520, 600, 38, PAL.coral, PAL.white, A(t, cl('s3', 1)));
    stamp('1989', 760, 220, 70, PAL.coral, E(t, cl('s3', 0) + 0.2, 0.35), 0.08);
    // spreading dots to the world
    for (let i = 0; i < 9; i++) { const k = A(t, cl('s3', 2) + i * 0.12); pop(700 + (i % 3) * 110, 330 + Math.floor(i / 3) * 110, k, () => { circle(0, 0, 30, ACC); icon('city', 0, 0, 40, PAL.white); }); }
    chip('推廣到全世界', 810, 700, 38, PAL.ink, PAL.white, A(t, cl('s3', 2) + 0.9));
  },
  steps(t) {
    const S = [['提案', 'bulb', 1, 0], ['討論評估', 'gear', 1, 1.5], ['投票', 'ballot', 2, 0], ['執行公開', 'city', 2, 1.6]];
    S.forEach(([s, ic, ci, d], i) => {
      const x = 270 + (i % 2) * 520, y = 230 + Math.floor(i / 2) * 420, k = A(t, cl('s4', ci) + d);
      card(x, y, 400, 320, k, () => { rr(-200, -160, 400, 90, 28, ACC); txt(`${i + 1}  ${s}`, 0, -115, 42, PAL.white); icon(ic, 0, 30, 150, ACC, t); }, { rot: (i % 2 ? 0.02 : -0.02) });
    });
    arrow(480, 230, 560, 230, E(t, cl('s4', 1) + 1.3, 0.3), PAL.soft, 7);
    arrow(780, 400, 300, 470, E(t, cl('s4', 2) - 0.3, 0.4), PAL.soft, 7, -40);
    arrow(480, 650, 560, 650, E(t, cl('s4', 2) + 1.4, 0.3), PAL.soft, 7);
  },
  taiwan(t) {
    pop(340, 480, A(t, cl('s5', 0)), () => {
      ctx.fillStyle = '#BDE7B0'; ctx.beginPath(); ctx.moveTo(40, -300); ctx.quadraticCurveTo(150, -230, 120, -40); ctx.quadraticCurveTo(80, 160, -40, 300); ctx.quadraticCurveTo(-110, 120, -90, -60); ctx.quadraticCurveTo(-60, -240, 40, -300); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#7FC36F'; ctx.lineWidth = 5; ctx.stroke();
      circle(60, -240, 20, PAL.coral); txt('臺灣', -10, 0, 50);
    });
    chip('臺北市', 520, 240, 40, PAL.coral, PAL.white, A(t, cl('s5', 1)));
    ['市民提案', '市民投票'].forEach((s, i) => sticky(760, 420 + i * 230, 340, 170, A(t, cl('s5', 1) + 0.4 + i * 0.5), [PAL.sun, PAL.mint][i], [s], 46, { rot: (i ? 0.04 : -0.04) }));
  },
  scale(t) {
    // two pans: benefits vs challenges
    const tilt = lerp(0, 0.12, E(t, cl('s6', 0) + 0.3, 0.6)) - lerp(0, 0.2, E(t, cl('s7', 0) + 0.3, 0.6));
    pop(540, 480, A(t, cl('s6', 0)), () => {
      rr(-12, -40, 24, 400, 8, PAL.ink); rr(-120, 350, 240, 30, 10, PAL.ink);
      ctx.save(); ctx.rotate(-tilt); rr(-400, -50, 800, 18, 9, PAL.ink);
      for (const [sx, c, L, ci, sid] of [[-320, PAL.mint, ['貼近需求', '了解政府'], 0, 's6'], [320, PAL.coral, ['參與不夠多元', '需要專業評估'], 0, 's7']]) {
        ctx.save(); ctx.translate(sx, -40); ctx.rotate(tilt);
        line(-100, 0, -120, 180, PAL.ink, 4); line(100, 0, 120, 180, PAL.ink, 4); rr(-150, 180, 300, 30, 15, c);
        L.forEach((s, i) => { if (t > cl(sid, i) - 0.1) chip(s, 0, 140 - i * 80, 30, c, PAL.white, A(t, cl(sid, i))); });
        ctx.restore();
      }
      ctx.restore();
    });
    chip('好處', 220, 160, 40, PAL.mint, PAL.white, A(t, cl('s6', 0) + 0.3));
    chip('挑戰', 860, 160, 40, PAL.coral, PAL.white, A(t, cl('s7', 0)));
  },
  end(t) {
    const k = A(t, cl('s8', 0));
    pop(300, 340, k, () => { person(0, 0, 1.3, { t, shirt: PAL.faint }); chip('繳稅的人', 0, 200, 36, PAL.soft, PAL.white, 1); });
    arrow(470, 330, 610, 330, E(t, cl('s8', 1), 0.5), ACC, 9);
    pop(780, 340, A(t, cl('s8', 1) + 0.3), () => { person(0, 0, 1.3, { t, shirt: ACC, armUp: true }); icon('crown', 0, -170, 90); chip('決定的人', 0, 200, 36, ACC, PAL.white, 1); });
    if (t > cl('s9', 0) - 0.2) {
      bubble(420, 820, 600, 160, A(t, cl('s9', 0)), '我有一個想法！', 52, { tail: 0.3, tailUp: true });
      pop(140, 980, A(t, cl('s9', 1)), () => icon('megaphone', 0, 0, 150, PAL.coral));
    }
    bye(t);
  },
};
