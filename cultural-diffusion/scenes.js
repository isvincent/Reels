// scenes.js — 文化擴散 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow } from './engine.js';

const island = (x, y, w, h, c = '#BDE7B0') => { ctx.fillStyle = c; ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, 0, Math.PI * 2); ctx.fill(); ctx.strokeStyle = '#7FC36F'; ctx.lineWidth = 4; ctx.stroke(); };
const sea = (x, y, w, h) => { rr(x, y, w, h, 40, '#D6F0FF'); for (let i = 0; i < 8; i++) path(curve(x + 40 + i * (w - 80) / 8, y + 40 + (i % 3) * (h - 80) / 3, x + 60 + i * (w - 80) / 8, y + 25 + (i % 3) * (h - 80) / 3, x + 80 + i * (w - 80) / 8, y + 40 + (i % 3) * (h - 80) / 3), 1, '#A9DCF7', 4); };

export const BOARDS = {
  hook(t) {
    pop(540, 520, A(t, cl('s1', 0) - 0.2), () => icon('globe', 0, 0, 520, ACC, t * 0.6));
    // travellers orbit the globe with passport stamps
    const items = [['tea', '珍珠奶茶', cl('s1', 0) + 0.2, PAL.coral], ['jeans', '牛仔褲', cl('s1', 0) + 1.5, PAL.sky]];
    items.forEach(([ic, name, t0, c], i) => {
      const k = A(t, t0), a = -Math.PI * 0.8 + i * Math.PI + Math.max(0, t - cl('s1', 1)) * 0.9;
      const x = 540 + Math.cos(a) * 330, y = 520 + Math.sin(a) * 300;
      pop(x, y, k, () => { circle(0, 0, 100, PAL.white, c, 6); icon(ic, 0, -8, 120, c, t); chip(name, 0, 110, 30, c, PAL.white, 1); });
    });
    const kd = E(t, cl('s1', 1), 1.2);
    ctx.save(); ctx.setLineDash([16, 14]); ctx.beginPath(); ctx.ellipse(540, 520, 330, 300, 0, -Math.PI, -Math.PI + kd * Math.PI * 2); ctx.strokeStyle = PAL.orange; ctx.lineWidth = 6; ctx.stroke(); ctx.restore();
    stamp('環遊世界！', 300, 940, 54, PAL.coral, E(t, cl('s1', 1) + 0.6, 0.35), -0.1);
  },

  def(t) {
    pop(540, 400, A(t, cl('s2', 0)), () => sea(-460, -260, 920, 520));
    pop(250, 300, A(t, cl('s2', 0) + 0.2), () => { island(0, 0, 150, 90); chip('A 地', 0, 0, 40, PAL.ink, PAL.white, 1); });
    pop(830, 520, A(t, cl('s2', 0) + 0.4), () => { island(0, 0, 150, 90); chip('B 地', 0, 0, 40, PAL.ink, PAL.white, 1); });
    const p = curve(330, 330, 560, 120, 760, 470);
    path(p, E(t, cl('s2', 0) + 0.6, 1.2), PAL.orange, 7, { dash: [14, 12] });
    // culture icons travel along the route
    ['bowl', 'tea', 'heartIcon'].forEach((ic, i) => {
      const u = clamp((t - cl('s2', 0) - 0.8 - i * 0.5) / 1.6); if (u <= 0) return;
      const q = p[Math.min(p.length - 1, Math.round(u * (p.length - 1)))];
      pop(q[0], q[1] - 40, 1, () => { circle(0, 0, 44, PAL.white, PAL.orange, 4); icon(ic, 0, 0, 60, PAL.coral, t); });
    });
    sticky(420, 900, 640, 210, A(t, cl('s2', 1)), PAL.sun, ['文化擴散', 'Cultural Diffusion'], 40, { firstSize: 80, rot: -0.03 });
  },

  two(t) {
    chip('兩大類', 540, 70, 48, PAL.ink, PAL.white, A(t, cl('s3', 0)));
    card(280, 450, 460, 560, A(t, cl('s3', 1)), () => {
      rr(-230, -280, 460, 110, 28, PAL.coral); txt('遷移擴散', 0, -225, 50, PAL.white);
      person(-40, 60, 1.2, { t, shirt: PAL.coral }); icon('suitcase', 90, 140, 120, PAL.sun);
      txt('人搬家，文化跟著走', 0, 230, 32);
    }, { rot: -0.02 });
    card(800, 450, 460, 560, A(t, cl('s3', 1) + 0.9), () => {
      rr(-230, -280, 460, 110, 28, ACC); txt('擴展擴散', 0, -225, 50, PAL.white);
      for (let i = 0; i < 4; i++) { const r = ((t * 0.6 + i / 4) % 1) * 170; ctx.save(); ctx.globalAlpha *= 1 - r / 170; circle(0, 40, r, null, ACC, 8); ctx.restore(); }
      circle(0, 40, 26, ACC); txt('文化向外擴大', 0, 230, 32);
    }, { rot: 0.02 });
  },

  relocate(t) {
    chip('① 遷移擴散', 200, 70, 44, PAL.coral, PAL.white, A(t, cl('s4', 0)));
    pop(540, 470, A(t, cl('s4', 0)), () => sea(-500, -300, 1000, 600));
    island(180, 470, 130, 200); island(870, 400, 160, 130); island(780, 680, 130, 80);
    const m = ease.inOutCubic(seg(t, cl('s4', 0) + 0.6, cl('s4', 0) + 2.4)), x = lerp(180, 860, m), y = lerp(470, 390, m) - Math.sin(m * Math.PI) * 120;
    person(x, y - 40, 0.75, { t, shirt: PAL.coral, run: m > 0 && m < 1 ? 0.6 : 0 });
    pop(x + 70, y + 20, 1, () => icon('suitcase', 0, 0, 80, PAL.sun));
    // dishes pop up in many places
    const spots = [[870, 300], [780, 650], [420, 220], [520, 720], [300, 640]];
    spots.forEach(([sx, sy], i) => pop(sx, sy, A(t, cl('s4', 1) + 0.3 + i * 0.25), () => { circle(0, 0, 54, PAL.white, PAL.coral, 4); icon('bowl', 0, 6, 80, PAL.coral); }));
    chip('中華料理到世界各地', 430, 960, 42, PAL.ink, PAL.white, A(t, cl('s4', 1) + 0.5));
  },

  ripple(t) {
    chip('② 擴展擴散', 200, 70, 44, ACC, PAL.white, A(t, cl('s5', 0)));
    const cx = 540, cy = 480, R = (t - cl('s5', 0)) * 260;
    for (let i = 0; i < 4; i++) { const r = R - i * 90; if (r > 0 && r < 520) { ctx.save(); ctx.globalAlpha = 1 - r / 520; circle(cx, cy, r, null, ACC, 10); ctx.restore(); } }
    // dots light up as the wave reaches them
    for (let i = 0; i < 42; i++) {
      const x = 120 + hash(i, 1) * 840, y = 160 + hash(i, 2) * 620, d = Math.hypot(x - cx, y - cy), on = R > d;
      circle(x, y, 16, on ? [PAL.orange, PAL.coral, PAL.sun][i % 3] : '#DDE3EE');
    }
    pop(cx, cy, A(t, cl('s5', 0)), () => { circle(0, 0, 48, ACC); icon('bulb', 0, 0, 60, PAL.sun); });
    ['傳染', '階層', '刺激'].forEach((s, i) => chip(s, 220 + i * 280, 960, 46, [PAL.coral, PAL.lav, PAL.mint][i], PAL.white, A(t, cl('s5', 1) + i * 0.3)));
  },

  contagious(t) {
    chip('傳染擴散', 200, 70, 44, PAL.coral, PAL.white, A(t, cl('s6', 0)));
    // a classroom grid: each student "catches" the new slang from a neighbour
    const t0 = cl('s6', 0) + 0.6, cols = 7, rows = 6;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = 150 + c * 130, y = 220 + r * 120, d = Math.abs(c - 3) + Math.abs(r - 2) + hash(r * 9 + c, 4) * 0.6;
      const on = t > t0 + d * 0.45, k = A(t, t0 + d * 0.45);
      circle(x, y, 44, on ? PAL.skin : '#E6EAF2', on ? PAL.coral : null, 5);
      circle(x - 12, y - 4, 4, PAL.ink); circle(x + 12, y - 4, 4, PAL.ink);
      if (on) { ctx.beginPath(); ctx.arc(x, y + 8, 12, 0.2, Math.PI - 0.2); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.stroke(); pop(x + 30, y - 40, clamp(k) * (1 - seg(t, t0 + d * 0.45 + 0.6, t0 + d * 0.45 + 1)), () => { rr(-34, -20, 68, 40, 16, PAL.coral); txt('XD', 0, 0, 22, PAL.white); }); }
    }
    chip('一傳十、十傳百', 300, 960, 44, PAL.ink, PAL.white, A(t, cl('s6', 0) + 1.2));
    chip('流行語爆紅！', 640, 1050, 40, PAL.coral, PAL.white, A(t, cl('s6', 1) + 0.3), { rot: -0.04 });
  },

  hier(t) {
    chip('階層擴散', 200, 70, 44, PAL.lav, PAL.white, A(t, cl('s7', 0)));
    const lv = [{ y: 240, n: 1, ic: 'crown', name: '名人・大城市' }, { y: 520, n: 3, ic: 'city', name: '中型城市' }, { y: 800, n: 5, ic: 'house', name: '小鎮' }];
    lv.forEach((L, li) => {
      const t0 = cl('s7', li === 0 ? 0 : 1) + (li === 2 ? 0.6 : 0) + 0.2;
      for (let i = 0; i < L.n; i++) {
        const x = 540 + (i - (L.n - 1) / 2) * 190, k = A(t, t0 + i * 0.1);
        pop(x, L.y, k, () => { circle(0, 0, 76, PAL.white, li === 0 ? PAL.sun : PAL.lav, 6); icon(L.ic, 0, 0, 100, PAL.lav, t); });
        if (li > 0) { const px = 540 + (Math.round(i * (lv[li - 1].n - 1) / Math.max(1, L.n - 1)) - (lv[li - 1].n - 1) / 2) * 190; arrow(px, lv[li - 1].y + 80, x, L.y - 82, E(t, t0 - 0.2, 0.4), PAL.lav, 6); }
      }
      chip(L.name, 170, L.y - 100, 30, PAL.ink, PAL.white, A(t, t0 + 0.2));
    });
    pop(820, 960, A(t, cl('s7', 2)), () => { icon('jeans', -60, 0, 120); chip('時尚潮流', 60, 0, 34, PAL.lav, PAL.white, 1); }, 0.05);
  },

  stimulus(t) {
    chip('刺激擴散', 200, 70, 44, PAL.mint, PAL.white, A(t, cl('s8', 0)));
    // only the idea travels across, then it is remade locally
    const u = ease.inOutCubic(seg(t, cl('s8', 0) + 0.5, cl('s8', 0) + 2.0));
    island(200, 360, 160, 110); island(860, 360, 160, 110);
    chip('原產地', 200, 480, 30, PAL.soft, PAL.white, 1); chip('印度', 860, 480, 34, PAL.orange, PAL.white, A(t, cl('s8', 0) + 0.3));
    pop(200, 330, A(t, cl('s8', 0)), () => icon('burger', 0, 0, 130, PAL.mint));
    path(curve(270, 300, 530, 140, 790, 300), E(t, cl('s8', 0) + 0.4, 0.8), PAL.mint, 6, { dash: [12, 12] });
    const q = curve(270, 300, 530, 140, 790, 300)[Math.round(u * 24)];
    if (u > 0 && u < 1) pop(q[0], q[1] - 30, 1, () => icon('bulb', 0, 0, 90));
    chip('只有「概念」', 530, 110, 34, PAL.ink, PAL.white, A(t, cl('s8', 0) + 0.7));
    // local remake
    const k2 = A(t, cl('s8', 1));
    pop(860, 330, k2, () => { circle(0, 0, 90, PAL.white, PAL.mint, 6); icon('bulb', 0, 0, 90); }, 0);
    const k3 = A(t, cl('s8', 2));
    card(470, 820, 760, 300, k3, () => {
      icon('burger', -230, -10, 170, '#7BC96F'); icon('leaf', -150, -80, 70);
      icon('cow', 60, -10, 110); cross(60, -10, 120, E(t, cl('s8', 2) + 0.6, 0.4));
      txt('不含牛肉', 250, -10, 50, PAL.coral); txt('在地改造版', 0, 110, 34, PAL.soft);
    });
  },

  blend(t) {
    const m = ease.inOutCubic(seg(t, cl('s9', 1), cl('s9', 1) + 1.2));
    // two colour blobs drift together and become a new colour
    const x1 = lerp(280, 470, m), x2 = lerp(800, 610, m);
    ctx.save(); ctx.globalAlpha = 0.85; circle(x1, 420, 200, PAL.sky); ctx.globalCompositeOperation = 'multiply'; circle(x2, 420, 200, PAL.sun); ctx.restore();
    chip('A 文化', 280, 160, 36, PAL.sky, PAL.white, A(t, cl('s9', 0)));
    chip('B 文化', 800, 160, 36, PAL.orange, PAL.white, A(t, cl('s9', 0) + 0.3));
    cross(540, 760, 60, 0);
    card(400, 860, 600, 200, A(t, cl('s9', 0) + 0.2), () => {
      txt('不只是複製', -120, -40, 44, PAL.soft); line(-250, -40, 10, -40, PAL.coral, 6);
      txt('混合出新樣子！', 0, 40, 56, PAL.mint);
    });
    for (let i = 0; i < 5; i++) sparkle(420 + i * 50, 420 + Math.sin(i * 2) * 80, 22, PAL.white, A(t, cl('s9', 1) + 1 + i * 0.1));
  },

  speed(t) {
    const p = ease.inOutCubic(seg(t, cl('s10', 0), cl('s10', 1) + 1.0));
    // a road from silk road to internet
    rr(80, 360, 920, 30, 15, '#EADBC2');
    pop(200, 300, A(t, cl('s10', 0)), () => { icon('camel', 0, 0, 160, PAL.orange, t); chip('絲路', 0, 120, 34, PAL.orange, PAL.white, 1); });
    pop(880, 290, A(t, cl('s10', 0) + 0.8), () => { icon('wifi', 0, 0, 160, ACC, t); chip('網路', 0, 130, 34, ACC, PAL.white, 1); });
    arrow(320, 375, lerp(320, 760, p), 375, clamp(p * 1.2), PAL.coral, 10);
    // speedometer
    pop(420, 790, A(t, cl('s10', 1)), () => {
      ctx.beginPath(); ctx.arc(0, 0, 210, Math.PI, 0); ctx.strokeStyle = '#E6EAF2'; ctx.lineWidth = 40; ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 210, Math.PI, Math.PI + Math.PI * p); ctx.strokeStyle = PAL.coral; ctx.lineWidth = 40; ctx.stroke();
      const a = Math.PI + Math.PI * p; line(0, 0, Math.cos(a) * 170, Math.sin(a) * 170, PAL.ink, 10); circle(0, 0, 20, PAL.ink);
      txt('越來越快！', 0, 80, 46, PAL.coral);
    });
  },

  end(t) {
    pop(540, 430, A(t, cl('s11', 0)), () => icon('globe', 0, 0, 360, ACC, t));
    const ics = [['tea', PAL.coral], ['jeans', PAL.sky], ['bowl', PAL.orange], ['burger', PAL.mint], ['book', PAL.lav]];
    ics.forEach(([ic, c], i) => {
      const a = i / ics.length * Math.PI * 2 + t * 0.5, k = A(t, cl('s11', 0) + 0.2 + i * 0.15);
      pop(540 + Math.cos(a) * 320, 430 + Math.sin(a) * 270, k, () => { circle(0, 0, 66, PAL.white, c, 5); icon(ic, 0, 0, 80, c, t); });
    });
    sticky(420, 860, 620, 170, A(t, cl('s11', 1)), PAL.sun, ['身邊的「旅人」在哪？'], 44, { rot: -0.02 });
    stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById('s11').end + 0.4, 0.4), -0.08);
  },
};
