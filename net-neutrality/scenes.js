// scenes.js — 網路中立性 boards. Local board space 1080 × 1150 (keep x>820, y>950 free for the mascot).
import { clamp, lerp, seg, ease, hash, spring } from './motion.js';
import { PAL, ACC, ctx, A, E, cl, clEnd, segById, txt, tw, font, rr, circle, line, path, curve, arrow, scribble, marker, star, heart, check, cross,
  sparkle, pop, tape, sticky, card, chip, stamp, bubble, person, icon, shadow, noShadow, wordMorph } from './engine.js';
const bye = (t, last = 's9') => stamp('下課囉！', 420, 1050, 64, PAL.coral, E(t, segById(last).end + 0.4, 0.4), -0.08);
// a "pipe" of data with packets moving at a speed
function lane(y, speed, color, label, t, k, o = {}) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= clamp(k);
  rr(140, y - 40, 800, 80, 40, '#EEF2F8', PAL.ink, 4);
  for (let i = 0; i < 6; i++) { const x = 160 + (((t * speed * 120 + i * 140) % 840) + 840) % 840; if (x < 900) rr(x, y - 18, 50, 36, 8, color); }
  if (o.block) { rr(500, y - 50, 40, 100, 8, PAL.coral); cross(520, y, 60, 1, PAL.white, 8); }
  ctx.restore();
  chip(label, 140, y - 70, 28, color, PAL.white, k);
}
export const BOARDS = {
  hook(t) {
    lane(240, 3, PAL.sun, '有付錢的網站', t, A(t, cl('s1', 0)));
    lane(480, 0.25, PAL.faint, '沒付錢的網站', t, A(t, cl('s1', 1)));
    pop(560, 650, A(t, cl('s1', 1) + 0.4), () => { circle(0, 0, 50, null, PAL.faint, 10); ctx.beginPath(); ctx.arc(0, 0, 50, t * 6, t * 6 + 1.5); ctx.strokeStyle = PAL.coral; ctx.lineWidth = 10; ctx.stroke(); txt('載入中…', 0, 90, 30, PAL.soft); });
    pop(400, 900, A(t, cl('s1', 2), { damp: 0.4 }), () => { circle(0, 0, 90, PAL.sun); txt('公平？', 0, 0, 52); });
  },
  def(t) {
    sticky(540, 170, 700, 240, A(t, cl('s2', 0)), PAL.sun, ['網路中立性', 'Net Neutrality'], 44, { firstSize: 90, rot: -0.02 });
    if (t > cl('s3', 0) - 0.2) {
      const k = A(t, cl('s3', 0));
      pop(540, 480, k, () => { rr(-130, -60, 260, 120, 30, ACC); txt('網路業者', 0, 0, 44, PAL.white); });
      const items = [['影片', 'phone'], ['新聞', 'book'], ['遊戲', 'gear'], ['小網站', 'house']];
      items.forEach(([s, ic], i) => {
        const x = 180 + i * 240, kk = A(t, cl('s3', 0) + 0.4 + i * 0.15);
        arrow(540, 550, x, 700, E(t, cl('s3', 0) + 0.4 + i * 0.15, 0.4), ACC, 6);
        pop(x, 780, kk, () => { circle(0, 0, 80, PAL.white, ACC, 6); icon(ic, 0, -10, 70, ACC, t); txt(s, 0, 50, 28); });
      });
      chip('平等對待所有資料', 400, 980, 42, PAL.ink, PAL.white, A(t, cl('s3', 1)));
    }
  },
  three(t) {
    chip('反對三件事', 540, 60, 44, PAL.coral, PAL.white, A(t, cl('s4', 0)));
    lane(220, 1.5, PAL.sky, '① 封鎖', t, A(t, cl('s4', 1)), { block: true });
    lane(460, 0.25, PAL.lav, '② 刻意降速', t, A(t, cl('s4', 1) + 1.0));
    lane(700, 3.5, PAL.sun, '③ 付費快車道', t, A(t, cl('s4', 2)));
    pop(880, 620, A(t, cl('s4', 2) + 0.5), () => icon('coin', 0, 0, 80));
    for (let i = 0; i < 3; i++) cross(80, 220 + i * 240, 50, E(t, [cl('s4', 1) + 0.3, cl('s4', 1) + 1.3, cl('s4', 2) + 0.8][i], 0.35), PAL.coral, 10);
  },
  debate(t) {
    const kP = A(t, cl('s5', 0)), kC = A(t, cl('s6', 0));
    card(280, 380, 460, 560, kP, () => {
      rr(-230, -280, 460, 100, 28, PAL.mint); txt('支持中立', 0, -230, 44, PAL.white);
      icon('megaphone', 0, -60, 150, PAL.mint); chip('言論自由', 0, 80, 34, PAL.mint, PAL.white, A(t, cl('s5', 0) + 0.5)); chip('新創公平競爭', 0, 170, 34, PAL.mint, PAL.white, A(t, cl('s5', 1)));
    }, { rot: -0.02 });
    card(800, 380, 460, 560, kC, () => {
      rr(-230, -280, 460, 100, 28, PAL.coral); txt('反對管制', 0, -230, 44, PAL.white);
      icon('gear', 0, -60, 150, PAL.coral, t); chip('彈性管理', 0, 80, 34, PAL.coral, PAL.white, A(t, cl('s6', 0) + 0.5)); chip('投資基礎建設', 0, 170, 34, PAL.coral, PAL.white, A(t, cl('s6', 1)));
    }, { rot: 0.02 });
    pop(540, 380, A(t, cl('s5', 0) + 0.3), () => { circle(0, 0, 54, PAL.sun, PAL.ink, 5); txt('VS', 0, 2, 44); });
  },
  usa(t) {
    // a pendulum swinging between "有規範" and "取消"
    const sw = Math.sin((t - cl('s7', 0)) * 2.4) * 0.7 * E(t, cl('s7', 0), 0.5);
    pop(540, 160, A(t, cl('s7', 0)), () => {
      ctx.rotate(sw); line(0, 0, 0, 400, PAL.ink, 8); circle(0, 420, 70, ACC); txt('政策', 0, 420, 36, PAL.white);
    });
    chip('有規範', 200, 720, 44, PAL.mint, PAL.white, A(t, cl('s7', 0) + 0.3));
    chip('取消', 880, 720, 44, PAL.coral, PAL.white, A(t, cl('s7', 0) + 0.5));
    chip('美國：隨政府更替來回改變', 440, 900, 38, PAL.ink, PAL.white, A(t, cl('s7', 1)));
  },
  zero(t) {
    pop(320, 470, A(t, cl('s8', 0)), () => {
      rr(-200, -380, 400, 760, 50, PAL.ink); rr(-180, -340, 360, 680, 20, PAL.white);
      txt('本月流量', 0, -280, 34, PAL.soft);
      const used = E(t, cl('s8', 1), 1.5);
      rr(-140, -230, 280, 40, 20, '#EEF2F8'); rr(-140, -230, 280 * used * 0.7, 40, 20, PAL.coral);
      [['A 程式', '免費！', PAL.mint], ['B 程式', '算流量', PAL.coral], ['C 程式', '算流量', PAL.coral]].forEach(([n, s, c], i) => { rr(-150, -130 + i * 150, 300, 120, 18, '#F3F6FB'); txt(n, -60, -70 + i * 150, 34); chip(s, 80, -70 + i * 150, 26, c, PAL.white, A(t, cl('s8', 1) + i * 0.2)); });
    });
    chip('零費率', 760, 220, 52, ACC, PAL.white, A(t, cl('s8', 0)));
    card(760, 540, 420, 220, A(t, cl('s8', 2)), () => { txt('看似優惠', 0, -40, 40, PAL.mint); txt('但大家都會選 A', 0, 30, 34, PAL.coral); });
  },
  end(t) {
    // the internet as a highway with an optional fast lane
    pop(540, 420, A(t, cl('s9', 0)), () => {
      ctx.fillStyle = '#5B6478'; ctx.beginPath(); ctx.moveTo(-60, -300); ctx.lineTo(60, -300); ctx.lineTo(420, 300); ctx.lineTo(-420, 300); ctx.closePath(); ctx.fill();
      for (let i = 0; i < 6; i++) { const u = ((i / 6 + t * 0.4) % 1), y = -300 + u * 600, w = 6 + u * 14; rr(-w / 2, y, w, 20 + u * 30, 4, PAL.white); }
      ctx.save(); ctx.globalAlpha *= E(t, cl('s9', 1), 0.5); ctx.fillStyle = 'rgba(255,212,59,0.55)'; ctx.beginPath(); ctx.moveTo(30, -300); ctx.lineTo(60, -300); ctx.lineTo(420, 300); ctx.lineTo(210, 300); ctx.closePath(); ctx.fill(); ctx.restore();
    });
    chip('人人同路？', 240, 820, 44, PAL.sky, PAL.white, A(t, cl('s9', 1)));
    chip('買快車道？', 640, 820, 44, PAL.orange, PAL.white, A(t, cl('s9', 1) + 0.4));
    bye(t);
  },
};
