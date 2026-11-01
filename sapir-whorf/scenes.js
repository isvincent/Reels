// scenes.js — 薩丕爾－沃爾夫假說 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow } from './engine.js';

export const BOARDS = {
  hook(t) {
    // a head: words flow in through a speech bubble, the world seen through it changes colour
    const kh = A(t, cl('s1', 0));
    pop(330, 520, kh, () => {
      ctx.fillStyle = '#E9E4FF'; ctx.beginPath(); ctx.arc(0, -40, 210, Math.PI * 0.75, Math.PI * 2.25); ctx.lineTo(150, 260); ctx.lineTo(-150, 260); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 6; ctx.stroke();
      icon('brain', 0, -60, 220);
    });
    const words = ['你好', 'Hello', 'Hola', 'こんにちは'];
    words.forEach((w, i) => {
      const t0 = cl('s1', 0) + 0.2 + i * 0.35, p = ((t - t0) * 0.35) % 1;
      if (t < t0) return;
      const x = lerp(820, 380, ease.inOutCubic(p)), y = 250 + i * 70 + Math.sin(p * 6) * 20;
      ctx.save(); ctx.globalAlpha *= Math.sin(p * Math.PI); chip(w, x, y, 34, [PAL.coral, PAL.sky, PAL.mint, PAL.orange][i], PAL.white, 1); ctx.restore();
    });
    const ke = A(t, cl('s1', 1));
    pop(760, 700, ke, () => { icon('eye', 0, 0, 200, ACC); });
    pop(760, 900, A(t, cl('s1', 1) + 0.3), () => icon('globe', 0, 0, 170, ACC, t));
    arrow(760, 790, 760, 820, E(t, cl('s1', 1) + 0.5, 0.3), PAL.soft, 6);
    pop(540, 130, A(t, cl('s1', 1) + 0.9, { damp: 0.4 }), () => { circle(0, 0, 70, PAL.sun); txt('?', 0, 4, 110); });
  },

  title(t) {
    sticky(540, 230, 860, 300, A(t, cl('s2', 0) - 0.1, { damp: 0.5 }), '#D9D2FF', ['薩丕爾－沃爾夫假說', 'Sapir–Whorf Hypothesis'], 44, { firstSize: 74, rot: -0.02 });
    chip('又叫：語言相對論', 540, 450, 44, ACC, PAL.white, A(t, cl('s2', 1)));
    const k1 = A(t, cl('s3', 0)), k2 = A(t, cl('s3', 1));
    card(290, 760, 430, 330, k1, () => {
      person(0, -10, 0.9, { t, shirt: '#5B6B8C', hair: '#4A3A30' });
      txt('薩丕爾 Edward Sapir', 0, 110, 32); chip('老師', 0, -140, 30, PAL.ink, PAL.white, 1);
    }, { rot: -0.03 });
    card(760, 700, 400, 300, k2, () => {
      person(0, -10, 0.85, { t, shirt: PAL.sky, hair: '#2B2B2B' });
      txt('沃爾夫 B. L. Whorf', 0, 100, 30); chip('學生', 0, -126, 30, ACC, PAL.white, 1);
    }, { rot: 0.03 });
    arrow(500, 760, 560, 730, E(t, cl('s3', 1) + 0.3, 0.4), PAL.coral, 7, -10);
    chip('美國語言學家', 290, 990, 34, PAL.soft, PAL.white, A(t, cl('s3', 0) + 0.5));
  },

  versus(t) {
    const kS = A(t, cl('s4', 0)), focus = t >= cl('s6', 0) ? 1 : t >= cl('s5', 0) ? 0 : -1;
    const side = (i, x, title, sub, ic) => {
      const k = A(t, cl('s4', 0) + 0.2 + i * 0.35), on = focus === -1 || focus === i;
      ctx.save(); ctx.globalAlpha *= on ? 1 : 0.4;
      const sc = focus === i ? 1.04 : 1;
      card(x, 300, 470 * sc, 470 * sc, k, () => {
        rr(-235, -235, 470, 110, 28, i ? ACC : PAL.coral); txt(title, 0, -180, 50, PAL.white);
        icon(ic, 0, -10, 170, i ? PAL.mint : PAL.coral, t);
        txt(sub, 0, 150, 40, PAL.ink);
      }, { rot: i ? 0.02 : -0.02 });
      ctx.restore();
    };
    side(0, 280, '強版本', '語言「決定」思想', 'lock');
    side(1, 800, '弱版本', '語言「影響」思考', 'lens');
    pop(540, 300, kS, () => { circle(0, 0, 54, PAL.sun, PAL.ink, 5); txt('VS', 0, 2, 44); });
    // strong: no word → no concept
    if (t >= cl('s5', 1) - 0.2 && t < cl('s6', 0)) {
      const k = A(t, cl('s5', 1));
      card(330, 780, 560, 260, k, () => {
        rr(-200, -80, 150, 110, 18, '#EEE', PAL.faint, 4); txt('？？', -125, -25, 46, PAL.faint); cross(-125, -25, 110, E(t, cl('s5', 1) + 0.5, 0.4));
        arrow(-30, -25, 50, -25, E(t, cl('s5', 1) + 0.3, 0.4), PAL.ink, 6); icon('bulb', 140, -30, 120); cross(140, -30, 110, E(t, cl('s5', 1) + 0.8, 0.4));
        txt('沒有詞 → 沒有概念？', 0, 85, 38);
      });
      stamp('太極端！', 360, 1020, 60, PAL.coral, E(t, cl('s5', 2), 0.35));
    }
    if (t >= cl('s6', 0) - 0.2) {
      const items = ['注意力', '記憶', '分類'];
      items.forEach((s, i) => sticky(200 + i * 250, 790, 220, 170, A(t, cl('s6', 1) + i * 0.4), [PAL.sun, '#C9F3E4', '#FFD6E2'][i], [s], 46, { rot: (i - 1) * 0.05 }));
      chip('★ 很多研究支持', 360, 1010, 42, PAL.mint, PAL.white, A(t, cl('s6', 2)));
    }
  },

  blue(t) {
    const k1 = A(t, cl('s7', 0) + 0.3), k2 = A(t, cl('s7', 0) + 0.7);
    pop(290, 330, k1, () => { shadow(16, 10); rr(-200, -200, 400, 340, 30, '#8FD3FF'); noShadow(); txt('goluboy', 0, -40, 56, PAL.ink); txt('淺藍', 0, 40, 46, PAL.ink); });
    pop(790, 330, k2, () => { shadow(16, 10); rr(-200, -200, 400, 340, 30, '#1E4FA8'); noShadow(); txt('siniy', 0, -40, 56, PAL.white); txt('深藍', 0, 40, 46, PAL.white); });
    chip('俄語：兩個不同的「藍」', 540, 590, 42, PAL.ink, PAL.white, A(t, cl('s7', 0) + 1));
    // experiment: stopwatch race
    const kx = A(t, cl('s7', 1)), p = seg(t, cl('s7', 1) + 0.4, cl('s7', 1) + 2.2);
    card(400, 860, 680, 300, kx, () => {
      const lanes = [['俄語使用者', PAL.coral, 1], ['英語使用者', PAL.sky, 0.72]];
      lanes.forEach(([n, c, sp], i) => {
        const y = -70 + i * 120; txt(n, -220, y, 32, PAL.ink); rr(-110, y - 18, 400, 36, 18, '#EEF2F8');
        rr(-110, y - 18, 400 * clamp(ease.outCubic(p) * sp * 1.0), 36, 18, c);
      });
      icon('clock', 260, -140, 80, PAL.coral, t * 4);
    });
    stamp('更快！', 760, 1010, 52, PAL.coral, E(t, cl('s7', 1) + 2.0, 0.35), 0.08);
  },

  compass(t) {
    const k = A(t, cl('s8', 0)), spin = (1 - ease.outCubic(seg(t, cl('s8', 0), cl('s8', 0) + 1.6))) * 4;
    // left / right crossed out
    pop(230, 180, A(t, cl('s8', 0) + 0.3), () => { chip('左', -70, 0, 50, PAL.faint); chip('右', 70, 0, 50, PAL.faint); cross(0, 0, 160, E(t, cl('s8', 0) + 0.8, 0.5)); });
    pop(540, 520, k, () => {
      ctx.rotate(spin);
      circle(0, 0, 260, PAL.white, PAL.ink, 8); circle(0, 0, 230, null, PAL.faint, 3);
      ['北', '東', '南', '西'].forEach((s, i) => {
        const a = -Math.PI / 2 + i * Math.PI / 2, kk = A(t, cl('s8', 1) + i * 0.25);
        ctx.save(); ctx.translate(Math.cos(a) * 180, Math.sin(a) * 180); ctx.rotate(-spin); const sc = 0.6 + 0.4 * clamp(kk, 0, 1.3); ctx.scale(sc, sc);
        circle(0, 0, 46, kk > 0.5 ? [PAL.coral, PAL.sky, PAL.mint, PAL.orange][i] : '#EEF2F8'); txt(s, 0, 0, 46, kk > 0.5 ? PAL.white : PAL.faint); ctx.restore();
      });
      ctx.beginPath(); ctx.moveTo(0, -130); ctx.lineTo(24, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fillStyle = PAL.coral; ctx.fill();
      ctx.beginPath(); ctx.moveTo(0, 130); ctx.lineTo(24, 0); ctx.lineTo(-24, 0); ctx.closePath(); ctx.fillStyle = PAL.faint; ctx.fill(); circle(0, 0, 14, PAL.ink);
    });
    chip('澳洲・古古伊米希爾語', 540, 860, 40, ACC, PAL.white, A(t, cl('s8', 0) + 0.5));
    bubble(360, 1000, 520, 120, A(t, cl('s8', 2)), '方向感超強！', 46, { tail: 0.3, tailUp: true });
  },

  time(t) {
    // Chinese: vertical time line
    const k1 = A(t, cl('s9', 0));
    card(280, 450, 400, 700, k1, () => {
      chip('中文', 0, -300, 36, PAL.coral, PAL.white, 1);
      line(0, -200, 0, 220, PAL.faint, 8);
      arrow(0, 40, 0, -190, E(t, cl('s9', 0) + 0.6, 0.5), PAL.coral, 10); arrow(0, 60, 0, 210, E(t, cl('s9', 0) + 1.1, 0.5), PAL.coral, 10);
      chip('上個月', 90, -150, 34, PAL.white, PAL.ink, A(t, cl('s9', 0) + 0.8), { stroke: PAL.coral, lw: 4 });
      chip('下個月', 90, 160, 34, PAL.white, PAL.ink, A(t, cl('s9', 0) + 1.3), { stroke: PAL.coral, lw: 4 });
      circle(0, 50, 18, PAL.ink); txt('現在', -70, 50, 28, PAL.soft);
    }, { rot: -0.02 });
    // English: horizontal
    const k2 = A(t, cl('s9', 1));
    card(780, 360, 520, 420, k2, () => {
      chip('English', 0, -160, 36, PAL.sky, PAL.white, 1);
      line(-200, 20, 200, 20, PAL.faint, 8);
      arrow(0, 20, -200, 20, E(t, cl('s9', 1) + 0.4, 0.4), PAL.sky, 10); arrow(0, 20, 200, 20, E(t, cl('s9', 1) + 0.7, 0.4), PAL.sky, 10);
      circle(0, 20, 16, PAL.ink); txt('behind 後', -130, 90, 30); txt('ahead 前', 130, 90, 30);
    }, { rot: 0.02 });
    pop(700, 800, A(t, cl('s9', 2)), () => { icon('lens', 0, 0, 180); txt('研究中…', 40, 130, 40, PAL.soft); }, 0.1);
  },

  glasses(t) {
    // cage crossed out → coloured glasses tint the world
    const kc = A(t, cl('s10', 0));
    pop(280, 280, kc, () => {
      rr(-150, -150, 300, 300, 20, null, PAL.ink, 8); for (let i = 1; i < 5; i++) line(-150 + i * 60, -150, -150 + i * 60, 150, PAL.ink, 7);
      icon('brain', 0, 0, 140); cross(0, 0, 300, E(t, cl('s10', 0) + 1, 0.5), PAL.coral, 16);
    });
    chip('不是牢籠', 280, 490, 42, PAL.coral, PAL.white, A(t, cl('s10', 0) + 1.1));
    const kg = A(t, cl('s10', 1)), tint = E(t, cl('s10', 1) + 0.4, 0.8);
    // a little landscape
    pop(640, 820, A(t, cl('s10', 1) - 0.2), () => {
      rr(-380, -200, 760, 400, 30, '#CFEFFF'); circle(220, -100, 50, PAL.sun);
      ctx.fillStyle = '#9BE3B5'; ctx.beginPath(); ctx.ellipse(-150, 200, 300, 160, 0, Math.PI, 0); ctx.ellipse(200, 210, 280, 130, 0, Math.PI, 0); ctx.fill();
      icon('house', -60, 40, 140);
    });
    pop(640, 760 - (1 - clamp(kg)) * 300, kg, () => {
      for (const dx of [-160, 160]) { ctx.save(); ctx.globalAlpha = 0.45 * tint; circle(dx, 0, 130, dx < 0 ? ACC : PAL.pink); ctx.restore(); circle(dx, 0, 130, null, PAL.ink, 14); }
      path(curve(-30, -10, 0, -40, 30, -10), 1, PAL.ink, 12); line(-290, -20, -360, -60, PAL.ink, 12); line(290, -20, 360, -60, PAL.ink, 12);
    });
    chip('而是有色眼鏡', 640, 1050, 42, ACC, PAL.white, A(t, cl('s10', 1) + 0.6));
  },

  end(t) {
    pop(540, 420, A(t, cl('s11', 0)), () => icon('globe', 0, 0, 380, ACC, t));
    const ws = [['你好', PAL.coral], ['Hello', PAL.sky], ['Bonjour', PAL.mint], ['Hola', PAL.orange], ['こんにちは', ACC], ['Ciao', PAL.pink]];
    ws.forEach(([w, c], i) => {
      const a = i / ws.length * Math.PI * 2 + t * 0.4, k = A(t, cl('s11', 0) + 0.2 + i * 0.15);
      chip(w, 540 + Math.cos(a) * 330, 420 + Math.sin(a) * 260, 38, c, PAL.white, k);
    });
    sticky(420, 860, 600, 170, A(t, cl('s11', 1)), PAL.sun, ['多一個看世界的角度！'], 46, { rot: -0.02 });
    stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById('s11').end + 0.4, 0.4), -0.08);
  },
};
