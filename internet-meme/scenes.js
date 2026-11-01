// scenes.js — 網路迷因 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow } from './engine.js';

// a generic, made-up meme card (no real meme images): a doodle face + top/bottom caption bars
function memeCard(x, y, s, k, o = {}) {
  pop(x, y, k, () => {
    ctx.scale(s, s);
    shadow(12, 8, 0.15); rr(-110, -110, 220, 220, 16, o.bg || PAL.white); noShadow(); rr(-110, -110, 220, 220, 16, null, PAL.ink, 4);
    circle(0, 8, 54, o.face || PAL.sun); circle(-18, -4, 7, PAL.ink); circle(18, -4, 7, PAL.ink);
    if (o.mood === 'sad') { ctx.beginPath(); ctx.arc(0, 40, 18, Math.PI + 0.3, -0.3); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.stroke(); }
    else if (o.mood === 'wow') circle(0, 30, 11, PAL.ink);
    else { ctx.beginPath(); ctx.arc(0, 18, 20, 0.2, Math.PI - 0.2); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 5; ctx.stroke(); }
    if (o.top !== undefined) txt(o.top, 0, -80, 26, PAL.ink); else rr(-80, -92, 160, 18, 9, '#DDE3EE');
    if (o.bot !== undefined) txt(o.bot, 0, 86, 26, PAL.ink); else rr(-60, 76, 120, 18, 9, '#DDE3EE');
  }, o.rot || 0);
}

export const BOARDS = {
  hook(t) {
    // one card multiplies until it floods the phone screen
    const k = A(t, cl('s1', 0));
    pop(540, 520, k, () => { shadow(30, 18, 0.2); rr(-260, -440, 520, 880, 50, PAL.ink); noShadow(); rr(-236, -400, 472, 800, 20, PAL.white); });
    const n = Math.floor(clamp(seg(t, cl('s1', 1), clEnd('s1', 1)) * 1.2) * 16);
    memeCard(540, 520, 1.5, A(t, cl('s1', 0) + 0.4) * (n > 0 ? 0 : 1));
    for (let i = 0; i < n; i++) {
      const c = i % 4, r = Math.floor(i / 4);
      memeCard(540 - 177 + c * 118, 160 + r * 190, 0.5, A(t, cl('s1', 1) + i * 0.12), { face: [PAL.sun, PAL.pink, '#9CF0C9', '#BFE6FF'][(i * 7) % 4], mood: ['', 'wow', 'sad'][i % 3], rot: (hash(i) - 0.5) * 0.2 });
    }
    stamp('洗版！', 820, 220, 60, PAL.coral, E(t, clEnd('s1', 1) - 0.4, 0.35), 0.12);
  },

  origin(t) {
    const kb = A(t, cl('s2', 1));
    chip('答案是：迷因 meme', 540, 70, 50, ACC, PAL.white, A(t, cl('s2', 0)));
    pop(300, 380, kb, () => {
      shadow(20, 12); rr(-160, -210, 320, 420, 14, '#E94F4F'); noShadow(); rr(-160, -210, 30, 420, 6, '#C23B3B');
      txt('The Selfish', 15, -110, 36, PAL.white); txt('Gene', 15, -60, 50, PAL.white); txt('《自私的基因》', 15, 40, 30, PAL.white);
      icon('dna', 15, 130, 110, PAL.sun, t);
    }, -0.04);
    card(760, 300, 420, 200, A(t, cl('s2', 1) + 0.3), () => { txt('道金斯', 0, -40, 50); txt('Richard Dawkins', 0, 16, 32, PAL.soft); txt('英國生物學家', 0, 62, 28, PAL.soft); });
    stamp('1976', 760, 520, 64, PAL.coral, E(t, cl('s2', 2), 0.35), 0.08);
    // s3: gene ⟶ culture gene
    if (t > cl('s3', 0) - 0.3) {
      const k3 = A(t, cl('s3', 0));
      card(540, 800, 960, 300, k3, () => {
        ['模仿', '複製', '流傳'].forEach((s, i) => chip(s, -330 + i * 170, -80, 36, [PAL.sky, PAL.mint, PAL.orange][i], PAL.white, A(t, cl('s3', 0) + 0.3 + i * 0.4)));
        icon('dna', -330 + 170 * 3.2, -70, 120, ACC, t);
        arrow(-60, 30, 60, 30, E(t, cl('s3', 1), 0.4), ACC, 8);
        txt('文化的基因', -260, 50, 52, PAL.ink);
        pop(280, 50, A(t, cl('s3', 2)), () => { rr(-140, -60, 280, 120, 30, ACC); txt('meme', 0, 0, 70, PAL.white); });
      });
    }
  },

  feed(t) {
    pop(330, 560, A(t, cl('s4', 0)), () => { rr(-220, -470, 440, 940, 46, PAL.ink); rr(-198, -430, 396, 860, 18, '#F3F6FB'); });
    // scrolling feed of remixed cards
    const scroll = Math.max(0, t - cl('s4', 1)) * 150;
    ctx.save(); ctx.beginPath(); ctx.rect(132, 130, 396, 860); ctx.clip();
    for (let i = 0; i < 8; i++) {
      const y = 260 + i * 250 - scroll % 250 - Math.floor(scroll / 250) * 0;
      memeCard(330, y, 0.95, A(t, cl('s4', 0) + 0.2 + i * 0.1), { face: [PAL.sun, PAL.pink, '#9CF0C9', '#BFE6FF'][i % 4], top: ['我：', '週一的我', '考完試', '老師說'][i % 4], bot: ['…', '好累', '耶！', '下課'][i % 4], mood: ['', 'sad', 'wow', ''][i % 4] });
      heart(470, y + 90, 16, PAL.coral);
    }
    ctx.restore();
    const items = [['圖片', PAL.sky], ['影片', PAL.coral], ['句子', PAL.mint]];
    items.forEach(([s, c], i) => sticky(780, 260 + i * 220, 280, 170, A(t, cl('s4', 2) + i * 0.35), c, [s], 52, { color: PAL.white, rot: (i - 1) * 0.04 }));
    chip('快速流傳・不斷改編', 760, 920, 34, PAL.ink, PAL.white, A(t, cl('s4', 1) + 0.3));
  },

  traits(t) {
    const L = [['①', '簡單好懂', 's6', 0, PAL.sky], ['②', '容易改編', 's6', 1, PAL.mint], ['③', '引起共鳴', 's7', 0, PAL.coral]];
    const active = t >= cl('s7', 0) ? 2 : t >= cl('s6', 1) ? 1 : t >= cl('s6', 0) ? 0 : -1;
    chip('爆紅三特點', 540, 60, 46, PAL.ink, PAL.white, A(t, cl('s5', 0)));
    L.forEach(([n, s, sid, ci, c], i) => {
      const k = A(t, cl('s5', 0) + 0.3 + i * 0.3), on = active === -1 || active === i;
      ctx.save(); ctx.globalAlpha *= on ? 1 : 0.4;
      sticky(200 + i * 340, 250, 290, 230, k * (active === i ? 1.08 : 1), c, [n, s], 46, { firstSize: 60, color: PAL.white, rot: (i - 1) * 0.04 });
      ctx.restore();
    });
    // detail area changes with the active trait
    const ty = 720;
    if (active === 0) { memeCard(400, ty, 1.5, A(t, cl('s6', 0)), {}); chip('一眼就懂', 760, ty, 46, PAL.sky, PAL.white, A(t, cl('s6', 0) + 0.4)); check(760, ty + 110, 80, E(t, cl('s6', 0) + 0.6, 0.4)); }
    if (active === 1) {
      ['數學課', '社團', '午餐'].forEach((s, i) => memeCard(210 + i * 300, ty, 1.15, A(t, cl('s6', 1) + 0.2 + i * 0.3), { top: '當我遇到', bot: s, face: [PAL.sun, PAL.pink, '#9CF0C9'][i], rot: (i - 1) * 0.05 }));
      chip('留空格：填入新梗', 440, ty + 220, 40, PAL.mint, PAL.white, A(t, cl('s6', 1) + 0.6));
    }
    if (active === 2) {
      memeCard(330, ty, 1.5, A(t, cl('s7', 0)), { mood: 'wow', top: '期末考前', bot: '的我' });
      bubble(700, ty - 60, 420, 150, A(t, cl('s7', 1)), '這根本就是我！', 46, { tail: -0.3 });
      for (let i = 0; i < 5; i++) { const k = A(t, cl('s7', 1) + 0.3 + i * 0.12), ph = (t * 0.8 + i * 0.2) % 1; ctx.save(); ctx.globalAlpha *= clamp(k) * (1 - ph); heart(600 + i * 50, ty + 140 - ph * 160, 24, PAL.coral); ctx.restore(); }
    }
  },

  evolve(t) {
    const st = [['複製', cl('s8', 1)], ['變異', cl('s8', 1) + 0.9], ['選擇', cl('s8', 1) + 1.8]];
    st.forEach(([s, t0], i) => chip(s, 200 + i * 340, 90, 46, [PAL.sky, PAL.lav, PAL.coral][i], PAL.white, A(t, t0)));
    for (let i = 0; i < 2; i++) arrow(300 + i * 340, 90, 440 + i * 340, 90, E(t, st[i + 1][1] - 0.3, 0.3), PAL.soft, 6);
    pop(540, 330, A(t, cl('s8', 0)), () => { icon('dna', -100, 0, 160, ACC, t); txt('迷因 ≈ 基因', 90, 0, 54); });
    // copies with mutations, then selection
    const sel = t >= cl('s8', 2);
    for (let i = 0; i < 6; i++) {
      const x = 170 + (i % 3) * 300, y = 620 + Math.floor(i / 3) * 280, fun = i % 2 === 0;
      const k = A(t, cl('s8', 1) + 0.2 + i * 0.12), out = sel && !fun ? E(t, cl('s8', 2) + 0.9, 0.6) : 0;
      ctx.save(); ctx.globalAlpha *= 1 - out;
      memeCard(x, y + out * 80, 1.05, k, { face: E(t, st[1][1], 0.3) > 0.5 ? [PAL.sun, '#DDE3EE', PAL.pink, '#DDE3EE', '#9CF0C9', '#DDE3EE'][i] : PAL.sun, mood: fun ? '' : 'sad' });
      ctx.restore();
      if (sel && fun) { const kk = A(t, cl('s8', 2) + 0.2 + i * 0.1); pop(x + 90, y - 90, kk, () => { circle(0, 0, 36, PAL.mint); icon('share', 0, 0, 44, PAL.white); }); }
    }
  },

  caution(t) {
    chip('轉傳前注意！', 540, 70, 48, PAL.coral, PAL.white, A(t, cl('s9', 0)));
    const items = [['查證來源', cl('s9', 1)], ['尊重著作權與肖像', cl('s9', 1) + 1.1], ['不霸凌', cl('s9', 2)], ['不散播假訊息', cl('s9', 2) + 1.0]];
    items.forEach(([s, t0], i) => {
      const y = 230 + i * 190;
      card(500, y, 820, 150, A(t, t0 - 0.1), () => {
        rr(-370, -40, 80, 80, 14, PAL.white, PAL.ink, 5);
        if (i < 2) check(-330, 0, 70, E(t, t0 + 0.3, 0.35)); else cross(-330, 0, 56, E(t, t0 + 0.3, 0.4));
        txt(s, 40, 0, 52, PAL.ink);
      }, { rot: (i % 2 ? 0.015 : -0.015) });
    });
    pop(160, 990, A(t, cl('s9', 1)), () => icon('lens', 0, 0, 150), -0.2);
  },

  window(t) {
    const k = A(t, cl('s10', 0));
    chip('數位民俗', 540, 70, 50, ACC, PAL.white, k);
    // a window with shutters opening onto society's moods
    const open = ease.inOutCubic(seg(t, cl('s10', 1), cl('s10', 1) + 0.9));
    pop(500, 560, A(t, cl('s10', 0) + 0.2), () => {
      rr(-340, -340, 680, 680, 20, '#CFEFFF', PAL.ink, 10);
      const faces = [[-170, -160, PAL.sun, ''], [170, -160, PAL.pink, 'wow'], [-170, 160, '#BFE6FF', 'sad'], [170, 160, '#9CF0C9', '']];
      faces.forEach(([x, y, c, m]) => memeCard(x, y, 0.95, open * 1.0, { face: c, mood: m }));
      line(0, -340, 0, 340, PAL.ink, 8); line(-340, 0, 340, 0, PAL.ink, 8);
      for (const s of [-1, 1]) { ctx.save(); ctx.translate(s * 340, 0); ctx.scale(1 - open * 0.92, 1); rr(s > 0 ? -340 : 0, -340, 340, 680, 10, '#F4C27A', PAL.ink, 6); ctx.restore(); }
    });
    chip('觀察社會情緒的窗', 500, 1010, 42, PAL.ink, PAL.white, A(t, cl('s10', 1) + 0.6));
  },

  end(t) {
    const k = A(t, cl('s11', 0)), press = seg(t, cl('s11', 0) + 0.8, cl('s11', 0) + 1.2);
    pop(540, 380, k, () => {
      const sc = 1 - Math.sin(press * Math.PI) * 0.08; ctx.scale(sc, sc);
      shadow(24, 14, 0.2); rr(-260, -110, 520, 220, 110, ACC); noShadow(); icon('share', -140, 0, 110, PAL.white); txt('分享', 60, 0, 80, PAL.white);
    });
    const hand = lerp(260, 120, ease.inOutCubic(seg(t, cl('s11', 0) + 0.3, cl('s11', 0) + 0.8)));
    pop(640, 380 + hand, k, () => { line(0, 0, 0, 120, PAL.skin, 40); circle(0, 0, 22, PAL.skin, PAL.ink, 3); });
    // pause: think first
    pop(400, 800, A(t, cl('s11', 1)), () => { circle(0, 0, 150, PAL.sun); icon('brain', 0, -10, 170); });
    bubble(690, 720, 330, 150, A(t, cl('s11', 1) + 0.4), ['我在傳遞', '什麼？'], 40, { tail: -0.35 });
    stamp('下課囉！', 420, 1040, 64, PAL.coral, E(t, segById('s11').end + 0.4, 0.4), -0.08);
  },
};
