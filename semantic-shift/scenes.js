// scenes.js — 語意漂移 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow } from './engine.js';

export const BOARDS = {
  hook(t) {
    // portal → ancient person; "快走!" → he sprints away
    const kp = A(t, cl('s1', 0));
    pop(540, 330, kp, () => {
      ctx.save(); ctx.rotate(t * 1.5);
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(0, 0, 180 - i * 36, 0, Math.PI * 1.6); ctx.strokeStyle = [ACC, PAL.lav, PAL.sky, PAL.pink][i]; ctx.lineWidth = 14; ctx.stroke(); ctx.rotate(1.3); }
      ctx.restore(); txt('古代', 0, 0, 56);
    });
    chip('時光機', 540, 560, 34, PAL.ink, PAL.white, A(t, cl('s1', 0) + 0.4));
    person(240, 880, 1.2, { t, shirt: PAL.sky });
    bubble(330, 640, 300, 130, A(t, cl('s1', 1)), '快走！', 56, { tail: -0.3 });
    const run = seg(t, cl('s1', 2), cl('s1', 2) + 2.2), rx = lerp(640, 1250, ease.inQuad(run));
    person(rx, 880, 1.2, { t, shirt: '#C9A36A', hair: '#2B2B2B', bun: true, run: t > cl('s1', 2) ? 1 : 0, flip: false });
    if (t > cl('s1', 2)) for (let i = 0; i < 4; i++) line(rx - 90 - i * 10, 830 + i * 22, rx - 180 - i * 30, 830 + i * 22, PAL.faint, 6);
    chip('古人', 640, 1050, 34, '#C9A36A', PAL.white, A(t, cl('s1', 1) + 0.3) * (1 - run));
  },

  def(t) {
    const k = A(t, cl('s2', 0));
    card(540, 230, 760, 330, k, () => {
      txt('走', -250, 0, 180, PAL.ink); scribble(-250, 0, 120, 120, E(t, cl('s2', 0) + 0.4, 0.6), PAL.coral);
      txt('古漢語', 80, -90, 34, PAL.soft); txt('＝ 跑！', 150, 0, 96, PAL.coral);
    });
    // time arrow: meaning drifts
    const ka = E(t, cl('s2', 1), 1.0);
    path(curve(120, 600, 540, 470, 960, 600), ka, ACC, 10);
    chip('古代：跑', 160, 650, 36, '#C9A36A', PAL.white, A(t, cl('s2', 1) + 0.1));
    chip('現代：走路', 900, 650, 36, ACC, PAL.white, A(t, cl('s2', 1) + 0.8));
    // a drifting balloon with the word
    const bx = lerp(160, 900, ease.inOutCubic(ka)), by = 540 - Math.sin(ka * Math.PI) * 120 + Math.sin(t * 3) * 10;
    if (ka > 0) { line(bx, by + 50, bx, by + 120, PAL.soft, 3); circle(bx, by, 52, PAL.sun, PAL.ink, 4); txt('走', bx, by, 52); }
    sticky(420, 900, 640, 210, A(t, cl('s2', 2)), PAL.sun, ['語意漂移', 'Semantic Shift'], 40, { firstSize: 80, rot: -0.03 });
  },

  types(t) {
    const L = [['擴大', '⊕', PAL.sky], ['縮小', '−', PAL.coral], ['轉移', '↔', PAL.lav], ['褒貶', '±', PAL.orange]];
    L.forEach(([s, sym, c], i) => {
      const x = 290 + (i % 2) * 470, y = 270 + Math.floor(i / 2) * 400;
      sticky(x, y, 380, 320, A(t, cl('s3', 0) + 0.2 + i * 0.3), c, [sym, s], 64, { firstSize: 90, color: PAL.white, rot: (i % 2 ? 0.04 : -0.04) });
    });
    chip('4 種類型', 540, 1020, 44, PAL.ink, PAL.white, A(t, cl('s3', 0)));
  },

  broaden(t) {
    const r = lerp(120, 360, ease.inOutCubic(seg(t, cl('s4', 2), cl('s4', 2) + 1.2)));
    chip('① 擴大', 170, 70, 44, PAL.sky, PAL.white, A(t, cl('s4', 0)));
    pop(540, 520, A(t, cl('s4', 1)), () => {
      circle(0, 0, r, 'rgba(58,168,245,0.15)', PAL.sky, 6);
      // rivers inside
      const n = r > 200 ? 6 : 1;
      for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2 + 0.3, d = n > 1 ? r * 0.55 : 0; path(Array.from({ length: 9 }, (_, j) => [Math.cos(a) * d - 60 + j * 15, Math.sin(a) * d + Math.sin(j + t * 3 + i) * 10]), 1, '#3A8EE6', 7); }
      txt(n > 1 ? '所有河流' : '長江・黃河', 0, n > 1 ? -r + 50 : 60, 40, PAL.ink);
    });
    chip('「江」', 200, 900, 50, PAL.white, PAL.ink, A(t, cl('s4', 1) + 0.2), { stroke: PAL.sky, lw: 5 });
    chip('「河」', 400, 900, 50, PAL.white, PAL.ink, A(t, cl('s4', 1) + 0.4), { stroke: PAL.sky, lw: 5 });
    arrow(530, 900, 650, 900, E(t, cl('s4', 2), 0.4), PAL.sky, 8);
    stamp('範圍變大', 560, 1030, 46, PAL.coral, E(t, cl('s4', 2) + 0.8, 0.35));
  },

  narrow(t) {
    chip('② 縮小', 170, 70, 44, PAL.coral, PAL.white, A(t, cl('s5', 0)));
    const shrink = ease.inOutCubic(seg(t, cl('s5', 2), cl('s5', 2) + 1.0)), r = lerp(330, 130, shrink);
    pop(540, 500, A(t, cl('s5', 1)), () => {
      circle(0, 0, r, 'rgba(255,107,107,0.12)', PAL.coral, 6);
      const foods = [['bread', -150, -120], ['apple', 150, -110], ['rice', -170, 110], ['meat', 0, 0], ['fish', 160, 120]];
      foods.forEach(([f, x, y]) => {
        const out = f !== 'meat' ? shrink : 0; ctx.save(); ctx.globalAlpha *= 1 - out; ctx.translate(x * (1 + out * 0.8), y * (1 + out * 0.8));
        if (f === 'bread') { rr(-50, -30, 100, 60, 26, '#E8B66A'); } else if (f === 'apple') { circle(0, 0, 38, PAL.coral); line(0, -38, 6, -56, '#7A4E2D', 6); }
        else if (f === 'rice') icon('bowl', 0, 0, 100, PAL.white); else if (f === 'fish') { ctx.fillStyle = PAL.sky; ctx.beginPath(); ctx.ellipse(0, 0, 50, 26, 0, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.moveTo(44, 0); ctx.lineTo(70, -20); ctx.lineTo(70, 20); ctx.fill(); }
        else { ctx.fillStyle = '#D9534F'; ctx.beginPath(); ctx.ellipse(0, 0, 62, 44, 0.3, 0, Math.PI * 2); ctx.fill(); circle(26, -6, 14, PAL.white); }
        ctx.restore();
      });
    });
    card(540, 930, 640, 170, A(t, cl('s5', 1) + 0.2), () => {
      txt('meat', -200, 0, 70, PAL.coral); txt(shrink > 0.5 ? '＝ 肉' : '＝ 食物', 90, 0, 64, PAL.ink);
    });
    txt('古英語', 260, 820, 30, PAL.soft);
  },

  transfer(t) {
    chip('③ 轉移', 170, 70, 44, PAL.lav, PAL.white, A(t, cl('s6', 0)));
    // a leg diagram
    pop(400, 560, A(t, cl('s6', 0) + 0.3), () => {
      rr(-50, -380, 100, 260, 40, PAL.skin, PAL.ink, 5);      // thigh
      rr(-45, -130, 90, 280, 40, PAL.skin, PAL.ink, 5);        // calf
      ctx.beginPath(); ctx.moveTo(-45, 140); ctx.lineTo(120, 150); ctx.quadraticCurveTo(150, 200, 110, 210); ctx.lineTo(-50, 210); ctx.closePath(); ctx.fillStyle = PAL.skin; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.stroke();
    });
    const move = ease.inOutCubic(seg(t, cl('s6', 2), cl('s6', 2) + 0.9)), py = lerp(430, 740, move), px = lerp(470, 560, move);
    if (t > cl('s6', 1)) {
      const k = A(t, cl('s6', 1));
      arrow(px + 230, py - 40, px + 30, py, clamp(k), PAL.coral, 9, 20);
      chip('腳', px + 300, py - 50, 60, PAL.coral, PAL.white, k);
      chip(move > 0.5 ? '現在：腳掌' : '古代：小腿', px + 300, py + 50, 34, PAL.white, PAL.ink, k, { stroke: PAL.coral, lw: 4 });
    }
    txt('意思換到別的東西', 540, 1040, 40, PAL.soft);
  },

  seesaw(t) {
    chip('④ 褒貶改變', 200, 70, 44, PAL.orange, PAL.white, A(t, cl('s7', 0)));
    const rows = [['nice', '愚蠢', '好', 1, 1], ['silly', '有福氣', '傻', -1, 2]];
    rows.forEach(([w, from, to, dir, ci], i) => {
      const y = 330 + i * 380, k = A(t, cl('s7', ci)), m = ease.inOutCubic(seg(t, cl('s7', ci) + 0.9, cl('s7', ci) + 1.9));
      card(540, y, 900, 300, k, () => {
        txt(w, -300, 0, 80, ACC);
        chip(from, -40, -70, 38, PAL.faint, PAL.white, 1);
        arrow(40, -40, 140, 40 * dir * -1 + 0, clamp(m * 1.3), dir > 0 ? PAL.mint : PAL.coral, 8);
        chip(to, 240, 60 * -dir, 50, dir > 0 ? PAL.mint : PAL.coral, PAL.white, clamp(m * 2));
        // thumb
        pop(380, -90 * dir, clamp(m * 2), () => { circle(0, 0, 40, dir > 0 ? PAL.mint : PAL.coral); txt(dir > 0 ? '褒' : '貶', 0, 0, 40, PAL.white); });
      }, { rot: i ? 0.02 : -0.02 });
    });
  },

  why(t) {
    const causes = [['社會變遷', 'city', PAL.sky], ['新科技', 'gear', PAL.lav], ['比喻聯想', 'bulb', PAL.orange]];
    const s9 = t >= cl('s9', 0) - 0.2, up = ease.inOutCubic(seg(t, cl('s9', 0) - 0.3, cl('s9', 0) + 0.3));
    chip('為什麼會漂移？', 540, 70, 46, PAL.ink, PAL.white, A(t, cl('s8', 0)));
    causes.forEach(([s, ic, c], i) => {
      const x = 200 + i * 340, y = lerp(380, 230, up), sc = lerp(1, 0.7, up);
      pop(x, y, A(t, cl('s8', 1) + i * 0.5) * sc, () => { circle(0, 0, 130, PAL.white, c, 8); icon(ic, 0, -20, 120, c, t); txt(s, 0, 80, 36); });
    });
    if (!s9) { arrow(540, 600, 540, 720, E(t, cl('s8', 2), 0.4), ACC, 8); chip('詞義改變！', 540, 790, 50, ACC, PAL.white, A(t, cl('s8', 2) + 0.3)); }
    if (s9) {
      [['mouse', 'cmouse', '滑鼠', 0], ['germ', 'bug', '病毒', 1]].forEach(([a, b, name, i]) => {
        const y = 560 + i * 260, k = A(t, cl('s9', 0) + i * 0.6), m = E(t, cl('s9', 1) + i * 0.3, 0.5);
        card(470, y, 820, 220, k, () => {
          txt(name, -310, 0, 54); icon(a, -110, 0, 140, PAL.mint, t);
          arrow(-20, 0, 60, 0, m, ACC, 8); pop(170, 0, m, () => icon(b, 0, 0, 140, ACC, t)); chip('電腦', 320, 0, 32, ACC, PAL.white, m);
        });
      });
    }
  },

  dict(t) {
    const k = A(t, cl('s10', 0));
    pop(540, 440, k, () => {
      shadow(20, 12); rr(-330, -230, 660, 460, 24, ACC); noShadow();
      rr(-310, -210, 300, 420, 10, PAL.white); rr(10, -210, 300, 420, 10, PAL.white); line(0, -230, 0, 230, PAL.ink, 5);
      for (let i = 0; i < 6; i++) { line(-280, -160 + i * 60, -40, -160 + i * 60, PAL.grid, 6); }
      const p = E(t, cl('s10', 1), 2.4, ease.linear);
      ['走：跑', '走：走路', '腳：小腿', '腳：腳掌'].forEach((s, i) => { txt(s, 160, -140 + i * 90, 40, i % 2 ? ACC : PAL.faint, 'center'); if (i % 2 === 0) line(80, -140 + i * 90, 240, -140 + i * 90, PAL.coral, 4); });
      txt('字典', -160, -130, 50, PAL.ink); heart(-160, 20, 40, PAL.coral);
      // pencil writing
      ctx.save(); ctx.translate(250, -150 + p * 300); ctx.rotate(0.6); rr(-12, -110, 24, 110, 4, PAL.sun, PAL.ink, 3); ctx.restore();
    });
    chip('語言是活的！', 400, 850, 54, PAL.coral, PAL.white, A(t, cl('s10', 0) + 0.5), { rot: -0.04 });
    chip('每一代都在改寫', 400, 980, 40, ACC, PAL.white, A(t, cl('s10', 1) + 0.3));
  },

  end(t) {
    pop(400, 400, A(t, cl('s11', 0)), () => {
      icon('phone', 0, 0, 500);
      ['流行語 A', '流行語 B', '流行語 C'].forEach((s, i) => chip(s, 0, -120 + i * 110, 34, [ACC, PAL.coral, PAL.lav][i], PAL.white, A(t, cl('s11', 0) + 0.3 + i * 0.25)));
    });
    pop(800, 330, A(t, cl('s11', 1)), () => { icon('clock', 0, 0, 220, PAL.coral, t * 6); txt('10 年後', 0, 150, 46, PAL.coral); });
    pop(800, 620, A(t, cl('s11', 1) + 0.5, { damp: 0.4 }), () => { circle(0, 0, 80, PAL.sun); txt('?', 0, 4, 120); });
    stamp('下課囉！', 420, 1000, 66, PAL.coral, E(t, segById('s11').end + 0.4, 0.4), -0.08);
  },
};
