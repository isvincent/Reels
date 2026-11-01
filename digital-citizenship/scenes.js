// scenes.js — 數位公民權 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
function phoneFrame(x, y, s, fn) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); shadow(20, 12); rr(-200, -380, 400, 760, 50, PAL.ink); noShadow(); rr(-180, -340, 360, 680, 20, PAL.white); fn && fn(); ctx.restore(); }
export const BOARDS = {
  hook(t) {
    pop(330, 470, A(t, cl('s1', 0)), () => phoneFrame(0, 0, 1, () => { txt('今日螢幕時間', 0, -270, 32, PAL.soft); txt(`${Math.round(lerp(0, 6, E(t, cl('s1', 0) + 0.3, 1.2)))} 小時`, 0, -170, 80, PAL.coral); for (let i = 0; i < 4; i++) rr(-140, -60 + i * 90, 280, 66, 14, ['#E7F1FF', '#FFE9F1', '#E3FAF2', '#FFF4D6'][i]); }));
    pop(780, 300, A(t, cl('s1', 1)), () => { icon('shield', 0, 0, 200, ACC); });
    sticky(780, 640, 380, 200, A(t, cl('s1', 1) + 0.4), PAL.sun, ['數位公民？'], 52, { rot: 0.04 });
  },
  def(t) {
    sticky(540, 170, 760, 240, A(t, cl('s2', 0)), PAL.sun, ['數位公民權', 'Digital Citizenship'], 40, { firstSize: 90, rot: -0.02 });
    ['安全', '負責', '尊重'].forEach((s, i) => chip(s, 220 + i * 320, 430, 54, [PAL.sky, PAL.orange, PAL.pink][i], PAL.white, A(t, cl('s2', 1) + i * 0.4)));
    pop(540, 680, A(t, cl('s2', 1) + 1.4), () => icon('globe', 0, 0, 220, ACC, t));
    if (t > cl('s3', 0) - 0.2) ['①', '②', '③', '④'].forEach((s, i) => { const a = -Math.PI / 2 + i * Math.PI / 2, k = A(t, cl('s3', 0) + i * 0.2); pop(540 + Math.cos(a) * 200, 680 + Math.sin(a) * 160, k, () => { circle(0, 0, 40, ACC); txt(s, 0, 0, 40, PAL.white); }); });
  },
  literacy(t) {
    chip('① 數位素養', 200, 70, 44, PAL.sky, PAL.white, A(t, cl('s4', 0)));
    const news = [['驚！吃這個就能…', false], ['教育部公告：…', true], ['轉傳三次會…', false]];
    news.forEach(([s, ok], i) => {
      const y = 250 + i * 220, k = A(t, cl('s4', 1) + i * 0.4);
      card(440, y, 680, 170, k, () => { rr(-320, -60, 120, 120, 16, '#EEF2F8'); txt(s, 60, 0, 40, PAL.ink); });
      const v = E(t, cl('s4', 1) + 1.4 + i * 0.3, 0.35);
      pop(860, y, v, () => { if (ok) { circle(0, 0, 54, '#DFF8EE'); check(0, 0, 60, 1); } else { circle(0, 0, 54, '#FFE5E5'); cross(0, 0, 50, 1); } });
    });
    pop(200, 920, A(t, cl('s4', 1) + 0.3), () => icon('lens', 0, 0, 170), -0.2);
    chip('查證再分享', 520, 940, 44, PAL.sky, PAL.white, A(t, cl('s4', 1) + 1.0));
  },
  privacy(t) {
    chip('② 隱私與安全', 220, 70, 44, PAL.lav, PAL.white, A(t, cl('s5', 0)));
    pop(300, 420, A(t, cl('s5', 1)), () => { icon('shield', 0, 0, 300, PAL.lav); });
    // password strength meter
    const pw = ['1234', 'abcd1234', 'Tr!p-2-Sun#93'], step = Math.min(2, Math.floor(Math.max(0, t - cl('s5', 1) - 0.5) / 0.7));
    card(760, 330, 460, 260, A(t, cl('s5', 1) + 0.3), () => {
      txt('密碼', -150, -80, 32, PAL.soft); rr(-190, -40, 380, 70, 14, '#F3F6FB', PAL.ink, 3); txt(pw[step], 0, -5, 36, PAL.ink);
      rr(-190, 60, 380, 24, 12, '#EEF2F8'); rr(-190, 60, 380 * [0.2, 0.5, 1][step], 24, 12, [PAL.coral, PAL.orange, PAL.mint][step]);
      txt(['弱', '普通', '強！'][step], 0, 110, 30, [PAL.coral, PAL.orange, PAL.mint][step]);
    });
    card(440, 860, 720, 220, A(t, cl('s5', 2)), () => { icon('phone', -250, 0, 120); txt('「你中獎了！點連結」', 40, -36, 38); txt('小心詐騙！', 40, 40, 46, PAL.coral); });
  },
  etiquette(t) {
    chip('③ 數位禮儀', 200, 70, 44, PAL.pink, PAL.white, A(t, cl('s6', 0)));
    bubble(320, 320, 480, 150, A(t, cl('s6', 1)), '你好爛！', 52, { tail: -0.3, fill: '#FFE5E5' });
    cross(320, 320, 180, E(t, cl('s6', 1) + 0.6, 0.4));
    bubble(720, 560, 480, 150, A(t, cl('s6', 1) + 1.0), '我有不同看法～', 46, { tail: 0.3, fill: '#E3FAF2' });
    check(980, 560, 70, E(t, cl('s6', 1) + 1.4, 0.4));
    chip('不霸凌 · 不散播仇恨', 420, 840, 44, PAL.ink, PAL.white, A(t, cl('s6', 2)));
    for (let i = 0; i < 4; i++) { const ph = (t * 0.6 + i * 0.25) % 1; ctx.save(); ctx.globalAlpha *= (1 - ph) * E(t, cl('s6', 2), 0.4); heart(640 + i * 50, 720 - ph * 160, 22, PAL.pink); ctx.restore(); }
  },
  rights(t) {
    chip('④ 權利與責任', 220, 70, 44, PAL.orange, PAL.white, A(t, cl('s7', 0)));
    const tilt = Math.sin(t * 1.6) * 0.05;
    pop(540, 360, A(t, cl('s7', 0) + 0.2), () => {
      rr(-10, -20, 20, 330, 8, PAL.ink); ctx.save(); ctx.rotate(tilt); rr(-380, -30, 760, 16, 8, PAL.ink);
      for (const [sx, c, title, items, t0] of [[-280, PAL.mint, '權利', ['表達意見', '取得資訊'], cl('s7', 1)], [280, PAL.coral, '責任', ['尊重著作權', '尊重他人'], cl('s7', 2)]]) {
        ctx.save(); ctx.translate(sx, -22); ctx.rotate(-tilt); rr(-150, 30, 300, 260, 24, PAL.white, c, 5); txt(title, 0, 80, 44, c);
        items.forEach((s, i) => chip(s, 0, 160 + i * 70, 30, c, PAL.white, A(t, t0 + 0.3 + i * 0.4))); ctx.restore();
      }
      ctx.restore();
    });
    chip('兩者要平衡', 420, 900, 44, PAL.ink, PAL.white, A(t, cl('s7', 2) + 1.2));
  },
  divide(t) {
    chip('數位落差', 200, 70, 44, PAL.coral, PAL.white, A(t, cl('s8', 0)));
    pop(280, 420, A(t, cl('s8', 1)), () => { person(0, 0, 1.3, { t, shirt: PAL.sky }); icon('phone', 110, -10, 80); icon('wifi', 0, -230, 100, PAL.mint, t); });
    pop(780, 420, A(t, cl('s8', 1) + 0.5), () => { person(0, 0, 1.3, { t, shirt: PAL.faint, flip: true }); txt('?', 0, -230, 100, PAL.faint); });
    // a bridge that builds across
    const b = E(t, cl('s8', 2), 1.0);
    rr(330, 720, 400 * b, 30, 10, ACC);
    for (let i = 0; i < 5; i++) if (b > i / 5) line(350 + i * 80, 720, 350 + i * 80, 780, ACC, 6);
    chip('公平的數位機會', 520, 860, 44, ACC, PAL.white, A(t, cl('s8', 2) + 0.8));
  },
  end(t) {
    pop(540, 360, A(t, cl('s9', 0)), () => { icon('globe', 0, 0, 280, ACC, t); });
    chip('共同的公共空間', 540, 560, 40, ACC, PAL.white, A(t, cl('s9', 0) + 0.5));
    // footprints walking across
    for (let i = 0; i < 6; i++) { const k = E(t, cl('s9', 1) + i * 0.2, 0.3); ctx.save(); ctx.globalAlpha *= k; ctx.translate(140 + i * 140, 760 + (i % 2) * 50); ctx.rotate(0.2); ctx.fillStyle = PAL.lav; ctx.beginPath(); ctx.ellipse(0, 0, 24, 36, 0, 0, Math.PI * 2); ctx.fill(); for (let j = 0; j < 4; j++) circle(-15 + j * 10, -42, 6, PAL.lav); ctx.restore(); }
    chip('你的數位足跡', 420, 920, 44, PAL.lav, PAL.white, A(t, cl('s9', 1) + 1.2));
    bye(t);
  },
};
