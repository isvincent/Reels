// scenes.js — 路徑依賴 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
const KEYS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
function keyboard(x, y, s, t, t0, hi = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  shadow(16, 10); rr(-470, -170, 940, 340, 30, '#2E3550'); noShadow();
  KEYS.forEach((row, r) => [...row].forEach((ch, i) => {
    const kx = -430 + r * 40 + i * 88, ky = -110 + r * 100, k = A(t, t0 + (r * 10 + i) * 0.03, { freq: 3, damp: 0.6 });
    const lit = r === 0 && i < 6 && hi > 0;
    pop(kx + 36, ky + 36, k, () => { rr(-36, -36, 72, 72, 12, lit ? PAL.sun : PAL.white); txt(ch, 0, 2, 38, PAL.ink); });
  }));
  ctx.restore();
}
export const BOARDS = {
  hook(t) {
    keyboard(540, 380, 1, t, cl('s1', 0) - 0.2, E(t, cl('s1', 0) + 1, 0.3));
    marker(115, 210, 470, 100, E(t, cl('s1', 0) + 1.2, 0.5), PAL.coral, 0.35);
    pop(540, 800, A(t, cl('s1', 1)), () => { circle(0, 0, 110, PAL.sun); txt('?', 0, 6, 160); }, -0.1);
    chip('最有效率嗎？', 300, 980, 44, PAL.ink, PAL.white, A(t, cl('s1', 1) + 0.4), { rot: -0.04 });
  },
  def(t) {
    sticky(540, 200, 700, 260, A(t, cl('s2', 0)), PAL.sun, ['路徑依賴', 'Path Dependence'], 44, { firstSize: 96, rot: -0.03 });
    // a road that forks: once you take a path, the other options fade
    const p = E(t, cl('s2', 1), 1.6, ease.inOutCubic);
    path([[540, 1080], [540, 760]], E(t, cl('s2', 1) - 0.2, 0.5), PAL.ink, 22);
    const forks = [[220, 470], [540, 430], [860, 470]];
    forks.forEach(([fx, fy], i) => {
      const chosen = i === 1;
      ctx.save(); ctx.globalAlpha *= chosen ? 1 : 1 - 0.75 * clamp(p * 2 - 0.6);
      path(curve(540, 760, 540, 620, fx, fy), E(t, cl('s2', 1) + 0.2, 0.6), chosen ? ACC : PAL.faint, 22);
      pop(fx, fy - 50, A(t, cl('s2', 1) + 0.6 + i * 0.1), () => chip(['選項 A', '已選的路', '選項 C'][i], 0, 0, 34, chosen ? ACC : PAL.faint, PAL.white, 1));
      ctx.restore();
    });
    const wy = lerp(1040, 640, p);
    person(540, wy - 60, 0.6, { t, shirt: PAL.coral, run: p > 0 && p < 1 ? 0.5 : 0 });
    chip('過去的選擇 → 限制現在', 300, 1000, 34, PAL.coral, PAL.white, A(t, cl('s2', 1) + 1.4));
  },
  typewriter(t) {
    pop(540, 420, A(t, cl('s3', 0)), () => {
      rr(-360, -60, 720, 280, 40, '#4B5675'); rr(-300, -230, 600, 190, 16, PAL.white, PAL.ink, 4);
      for (let i = 0; i < 4; i++) line(-260, -190 + i * 40, 160, -190 + i * 40, PAL.grid, 6);
      // type bars swing up and jam
      const jam = seg(t, cl('s3', 0) + 0.8, cl('s3', 0) + 1.4);
      for (let i = 0; i < 5; i++) {
        const a = -Math.PI / 2 + (i - 2) * 0.25 + (i === 1 || i === 2 ? jam * (i === 1 ? 0.55 : -0.5) : 0);
        line(0 + (i - 2) * 40, 160, (i - 2) * 40 + Math.cos(a) * 150, 160 + Math.sin(a) * 150, '#C0C7D6', 10);
      }
      for (let r = 0; r < 3; r++) for (let i = 0; i < 8; i++) circle(-260 + i * 74 + r * 20, 40 + r * 60, 24, PAL.white, PAL.ink, 3);
    });
    stamp('卡住了！', 780, 200, 54, PAL.coral, E(t, cl('s3', 0) + 1.4, 0.35), 0.1);
    card(420, 900, 720, 200, A(t, cl('s3', 1)), () => { txt('QWERTY', -170, -10, 70, ACC); txt('把常用字母', 170, -30, 36); txt('分開放？', 170, 22, 36); txt('（常見說法）', 0, 70, 26, PAL.soft); });
  },
  lockin(t) {
    // feedback loop: users → products → teaching → more users
    const nodes = [['使用者', 'brain', PAL.sky], ['工廠生產', 'gear', PAL.coral], ['學校教學', 'book', PAL.mint]];
    const cx = 540, cy = 440, R = 270, spin = Math.max(0, t - cl('s4', 1)) * 0.6;
    nodes.forEach(([s, ic, c], i) => {
      const a = -Math.PI / 2 + i * Math.PI * 2 / 3, x = cx + Math.cos(a) * R, y = cy + Math.sin(a) * R, k = A(t, cl('s4', i === 0 ? 0 : 1) + (i === 2 ? 0.8 : 0));
      pop(x, y, k, () => { circle(0, 0, 100, PAL.white, c, 8); icon(ic, 0, -14, 90, c, t); txt(s, 0, 60, 30); });
      const a2 = a + Math.PI * 2 / 3;
      const pts = Array.from({ length: 20 }, (_, j) => { const u = a + 0.42 + (a2 - a - 0.84) * j / 19; return [cx + Math.cos(u) * R, cy + Math.sin(u) * R]; });
      path(pts, E(t, cl('s4', 1) + 0.4 + i * 0.3, 0.5), PAL.soft, 6);
    });
    // a spinning badge in the middle: the loop gets stronger
    pop(cx, cy - 40, A(t, cl('s5', 0)), () => { ctx.rotate(spin); icon('lock', 0, 0, 140, PAL.coral); }, 0);
    chip('鎖定效應 lock-in', cx, cy + 70, 30, PAL.coral, PAL.white, A(t, cl('s5', 0) + 0.3));
    if (t > cl('s4', 2) - 0.2 && t < cl('s5', 0)) bubble(380, 900, 520, 130, A(t, cl('s4', 2)), '新排法？換不掉…', 44, { tail: 0.3, tailUp: true });
    if (t >= cl('s5', 1)) {
      const k1 = A(t, cl('s5', 1)), k2 = A(t, cl('s5', 2));
      card(250, 900, 360, 170, k1, () => { txt('好處', 0, -40, 36, PAL.soft); txt('↑ 越多', 0, 25, 56, PAL.mint); });
      card(640, 900, 360, 170, k2, () => { txt('轉換成本', 0, -40, 36, PAL.soft); txt('↑ 越高', 0, 25, 56, PAL.coral); });
    }
  },
  rail(t) {
    const p = Math.max(0, t - cl('s6', 0)) * 220;
    // perspective rails
    pop(540, 520, A(t, cl('s6', 0)), () => {
      ctx.fillStyle = '#E8DCC8'; ctx.beginPath(); ctx.moveTo(-60, -320); ctx.lineTo(60, -320); ctx.lineTo(360, 300); ctx.lineTo(-360, 300); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 12; i++) { const u = ((i / 12 + p / 2000) % 1) ** 1.6, y = -320 + u * 620, w = 70 + u * 330; rr(-w, y - 3 - u * 6, w * 2, 6 + u * 12, 3, '#9C7A55'); }
      line(-40, -320, -250, 300, '#6B7280', 14); line(40, -320, 250, 300, '#6B7280', 14);
      icon('train', 0, -250, 120, PAL.coral);
    });
    const kd = E(t, cl('s6', 1), 0.6);
    arrow(330, 760, 750, 760, kd, PAL.coral, 7); arrow(750, 760, 330, 760, kd, PAL.coral, 7);
    chip('1435 mm', 540, 700, 52, PAL.coral, PAL.white, A(t, cl('s6', 1) + 0.3));
    stamp('很難全部改', 420, 960, 52, PAL.ink, E(t, cl('s6', 2), 0.35), -0.06);
  },
  fields(t) {
    const L = [['城市規劃', 'city', PAL.sky, 0, 0], ['法律制度', 'book', PAL.lav, 1, 0], ['科技標準', 'phone', PAL.mint, 1, 1]];
    L.forEach(([s, ic, c, ci, j], i) => sticky(220 + i * 320, 380 + (i % 2) * 120, 270, 300, A(t, cl('s7', ci) + j * 0.9 + (i === 0 ? 0.6 : 0)), c, ['', '', s], 42, { color: PAL.white, rot: (i - 1) * 0.05, draw: () => icon(ic, 0, -40, 120, PAL.white, t) }));
    chip('到處都有路徑依賴', 540, 820, 46, PAL.ink, PAL.white, A(t, cl('s7', 1) + 0.8));
  },
  lesson(t) {
    pop(540, 360, A(t, cl('s8', 0)), () => {
      // stepping stones: the first step decides the direction
      for (let i = 0; i < 5; i++) { const k = E(t, cl('s8', 1) + i * 0.2, 0.4); ctx.save(); ctx.globalAlpha *= 0.3 + 0.7 * k; circle(-320 + i * 160, 60 - i * 40, 50, i === 0 ? ACC : '#DDE3EE'); ctx.restore(); }
      chip('第一步', -320, 160, 34, ACC, PAL.white, 1);
    });
    card(440, 820, 760, 220, A(t, cl('s8', 1)), () => { txt('重要決定', -150, -30, 54); txt('一開始就想清楚', 90, 40, 46, ACC); icon('bulb', 270, -40, 100); });
    chip('回頭很難！', 300, 1030, 40, PAL.coral, PAL.white, A(t, cl('s8', 2)));
  },
  end(t) {
    pop(540, 360, A(t, cl('s9', 0)), () => { icon('clock', 0, 0, 260, PAL.coral, t * 3); });
    ['每天的路線', '讀書的方式', '用的 App'].forEach((s, i) => chip(s, 220 + i * 320, 640, 38, [PAL.sky, PAL.mint, PAL.lav][i], PAL.white, A(t, cl('s9', 0) + 0.4 + i * 0.3)));
    sticky(420, 850, 640, 170, A(t, cl('s9', 1)), PAL.sun, ['「一直都這樣」？'], 50, { rot: -0.02 });
    bye(t);
  },
};
