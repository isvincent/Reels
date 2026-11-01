// engine.js — shared "青春校園" (campus notebook) look for the five language/culture explainers.
// Pure, time-driven drawing: every function takes t (or a progress value) and draws; no state between frames,
// no Math.random, no timers. The page calls frame(t); boards come from each project's scenes.js.
import { spring, seg, lerp, clamp, ease, glide, whip, hash, noise1, TAU } from './motion.js';

export const PAL = {
  paper: '#FFFCF3', grid: '#DCEAF7', margin: '#F7B2B2', ink: '#25304D', soft: '#6B7591', faint: '#A9B1C6',
  sky: '#3AA8F5', sun: '#FFD43B', coral: '#FF6B6B', mint: '#1FC79A', lav: '#8C7BFF', orange: '#FF9F1C',
  pink: '#FF8FB8', white: '#FFFFFF', skin: '#FFE1C7', hair: '#3B2F4A', board: '#2F5D50', cream: '#FFF4D6',
};
export const FONT = '"Huninn", "WenQuanYi Zen Hei", sans-serif';
export const WD = 1080, HD = 1920;                  // design space (portrait)
export const STAGE = { x: 0, y: 270, w: 1080, h: 1150 };   // where boards live (y 270–1420)
export const CAP = { x: 40, y: 1452, w: 1000, h: 316 };    // burned-in narration caption card

export let ctx = null;
export let TL = null;        // timeline module (SEGS, BOARDS, ...)
export let ACC = PAL.sky;    // per-topic accent
export function init(c, timeline) { ctx = c; TL = timeline; ACC = timeline.ACCENT; }

// ── time helpers ────────────────────────────────────────────────────────────
export const segById = id => TL.SEGS.find(s => s.id === id);
/** start time of clause i of segment id (real, measured) */
export const cl = (id, i = 0) => segById(id).clauses[Math.min(i, segById(id).clauses.length - 1)].start;
export const clEnd = (id, i = 0) => segById(id).clauses[Math.min(i, segById(id).clauses.length - 1)].end;
/** playful spring appearance 0 → 1 (overshoots) */
export const A = (t, t0, o = {}) => spring(t - t0, { freq: o.freq ?? 2.4, damp: o.damp ?? 0.55 });
/** calm spring (no wobble) */
export const Ac = (t, t0, f = 2.2) => spring(t - t0, { freq: f, damp: 0.95 });
/** eased 0 → 1 over [t0, t0 + d] */
export const E = (t, t0, d = 0.5, e = glide) => e(seg(t, t0, t0 + d));
export function talking(t) {
  for (const s of TL.SEGS) for (const c of s.clauses) if (t >= c.start && t <= c.end) return true;
  return false;
}

// ── text ────────────────────────────────────────────────────────────────────
export function font(size, w = 400) { ctx.font = `${w} ${size}px ${FONT}`; }
export function txt(s, x, y, size, color = PAL.ink, align = 'center', o = {}) {
  font(size); ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (o.stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = o.stroke; ctx.strokeStyle = o.strokeColor || PAL.white; ctx.strokeText(s, x, y + size * 0.04); }
  ctx.fillStyle = color; ctx.fillText(s, x, y + size * 0.04);
}
export const tw = (s, size) => { font(size); return ctx.measureText(s).width; };
const NO_START = '，。、！？；：」』）》,.!?;:)…—';
/** wrap CJK + latin text to width; keeps latin words whole and keeps closing punctuation off line starts */
export function wrap(s, size, maxW) {
  font(size);
  const tokens = s.match(/[A-Za-zÀ-ÿāōū0-9'’\-]+ ?|./gu) || [];
  const lines = []; let cur = '';
  for (const tk of tokens) {
    if (ctx.measureText(cur + tk).width > maxW && cur) {
      if (NO_START.includes(tk[0])) { cur += tk; continue; }
      lines.push(cur.trimEnd()); cur = tk.trimStart();
    } else cur += tk;
  }
  if (cur) lines.push(cur.trimEnd());
  return lines;
}

// ── shapes ──────────────────────────────────────────────────────────────────
export function rr(x, y, w, h, r, fill, stroke, lw = 4) {
  ctx.beginPath(); ctx.roundRect(x, y, w, h, Math.min(r, Math.abs(h) / 2, Math.abs(w) / 2));
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function circle(x, y, r, fill, stroke, lw = 4) {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, TAU);
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); }
}
export function line(x1, y1, x2, y2, color = PAL.ink, lw = 5, dash = null) {
  ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round';
  if (dash) ctx.setLineDash(dash); ctx.stroke(); ctx.setLineDash([]);
}
/** draw-on polyline (k 0..1 of total length) */
export function path(pts, k, color = PAL.ink, lw = 6, o = {}) {
  if (k <= 0) return;
  let L = 0; const seglen = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seglen.push(d); L += d; }
  let rem = L * clamp(k);
  ctx.beginPath(); ctx.moveTo(...pts[0]);
  for (let i = 1; i < pts.length && rem > 0; i++) {
    const d = seglen[i - 1], f = Math.min(1, rem / d);
    ctx.lineTo(lerp(pts[i - 1][0], pts[i][0], f), lerp(pts[i - 1][1], pts[i][1], f)); rem -= d;
  }
  ctx.strokeStyle = color; ctx.lineWidth = lw; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  if (o.dash) ctx.setLineDash(o.dash);
  ctx.stroke(); ctx.setLineDash([]);
}
/** sample a quadratic curve as points */
export const curve = (x1, y1, cx, cy, x2, y2, n = 24) => Array.from({ length: n + 1 }, (_, i) => { const u = i / n; return [(1 - u) ** 2 * x1 + 2 * (1 - u) * u * cx + u * u * x2, (1 - u) ** 2 * y1 + 2 * (1 - u) * u * cy + u * u * y2]; });
/** hand-drawn arrow, draws on with k; bend = sideways bow in px */
export function arrow(x1, y1, x2, y2, k, color = PAL.ink, lw = 7, bend = 0) {
  if (k <= 0) return;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy) || 1;
  const pts = curve(x1, y1, mx - dy / L * bend, my + dx / L * bend, x2, y2);
  path(pts, k, color, lw);
  if (k > 0.85) {
    const a = clamp((k - 0.85) / 0.15), n = pts.length - 1, [px, py] = pts[n - 2], ang = Math.atan2(y2 - py, x2 - px), h = 26 * a;
    path([[x2 - Math.cos(ang - 0.5) * h, y2 - Math.sin(ang - 0.5) * h], [x2, y2], [x2 - Math.cos(ang + 0.5) * h, y2 - Math.sin(ang + 0.5) * h]], 1, color, lw);
  }
}
/** wobbly hand-drawn ellipse that draws on */
export function scribble(cx, cy, rx, ry, k, color = PAL.coral, lw = 6, seed = 3) {
  const n = 60, pts = [];
  for (let i = 0; i <= n * 1.12; i++) { const a = -1.9 + i / n * TAU, w = 1 + (noise1(i * 0.3, seed) - 0.5) * 0.08; pts.push([cx + Math.cos(a) * rx * w, cy + Math.sin(a) * ry * w]); }
  path(pts, k, color, lw);
}
/** highlighter swipe (left → right) */
export function marker(x, y, w, h, k, color = PAL.sun, alpha = 0.55) {
  if (k <= 0) return;
  ctx.save(); ctx.globalAlpha *= alpha; ctx.fillStyle = color;
  ctx.beginPath(); ctx.roundRect(x, y, w * clamp(k), h, h * 0.3); ctx.fill(); ctx.restore();
}
export function star(x, y, r, fill, rot = 0, n = 5, inner = 0.48) {
  ctx.beginPath();
  for (let i = 0; i < n * 2; i++) { const a = rot - Math.PI / 2 + i * Math.PI / n, rr2 = i % 2 ? r * inner : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
}
export function heart(x, y, s, fill) {
  ctx.beginPath(); ctx.moveTo(x, y + s * 0.35);
  ctx.bezierCurveTo(x - s * 1.1, y - s * 0.35, x - s * 0.45, y - s * 1.0, x, y - s * 0.42);
  ctx.bezierCurveTo(x + s * 0.45, y - s * 1.0, x + s * 1.1, y - s * 0.35, x, y + s * 0.35);
  ctx.fillStyle = fill; ctx.fill();
}
export function check(x, y, s, k, color = PAL.mint, lw = 12) { path([[x - s * 0.5, y], [x - s * 0.12, y + s * 0.38], [x + s * 0.55, y - s * 0.45]], k, color, lw); }
export function cross(x, y, s, k, color = PAL.coral, lw = 12) {
  path([[x - s / 2, y - s / 2], [x + s / 2, y + s / 2]], clamp(k * 2), color, lw);
  path([[x + s / 2, y - s / 2], [x - s / 2, y + s / 2]], clamp(k * 2 - 1), color, lw);
}
/** little 4-point sparkle */
export function sparkle(x, y, r, color = PAL.sun, k = 1) {
  if (k <= 0) return; star(x, y, r * clamp(k, 0, 1.3), color, 0, 4, 0.28);
}
export function shadow(blur = 0, y = 10, a = 0.16) { ctx.shadowColor = `rgba(37,48,77,${a})`; ctx.shadowBlur = blur; ctx.shadowOffsetY = y; ctx.shadowOffsetX = 0; }
export function noShadow() { ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }

/** run fn() in a popped-in transform around (x, y): scale from 0 with spring k, slight rotation */
export function pop(x, y, k, fn, rot = 0) {
  if (k <= 0.001) return;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot * (1.6 - 0.6 * clamp(k))); const s = Math.max(0, k); ctx.scale(s, s);
  ctx.globalAlpha *= clamp(k * 3); fn(); ctx.restore();
}
/** washi tape strip */
export function tape(x, y, w, h, rot, color) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.globalAlpha *= 0.78; ctx.fillStyle = color;
  ctx.beginPath(); const z = 6; ctx.moveTo(-w / 2, -h / 2);
  for (let i = 0; i <= 4; i++) ctx.lineTo(-w / 2 + i * w / 4, -h / 2 + (i % 2 ? z : 0));
  ctx.lineTo(w / 2, h / 2); for (let i = 4; i >= 0; i--) ctx.lineTo(-w / 2 + i * w / 4, h / 2 - (i % 2 ? z : 0));
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha *= 0.35; ctx.fillStyle = '#fff'; for (let i = -2; i <= 2; i++) ctx.fillRect(-w / 2 + w / 2 + i * w / 6 - 4, -h / 2, 8, h);
  ctx.restore();
}
/** sticky note centred at (x, y) with lines of text; pops with k */
export function sticky(x, y, w, h, k, color, lines = [], size = 56, o = {}) {
  pop(x, y, k, () => {
    shadow(18, 12, 0.18); rr(-w / 2, -h / 2, w, h, 10, color); noShadow();
    ctx.fillStyle = 'rgba(0,0,0,0.05)'; ctx.beginPath(); ctx.moveTo(w / 2 - 50, h / 2); ctx.lineTo(w / 2, h / 2 - 50); ctx.lineTo(w / 2, h / 2); ctx.fill();
    if (o.tape !== false) tape(0, -h / 2, w * 0.42, 40, -0.05, o.tapeColor || PAL.white);
    const sz = lines.map((_, i) => i === 0 && o.firstSize ? o.firstSize : size), tot = sz.reduce((a, v) => a + v * 1.22, 0);
    let yy = -tot / 2 + (o.dy || 0);
    lines.forEach((s, i) => { txt(s, 0, yy + sz[i] * 0.61, sz[i], o.color || PAL.ink); yy += sz[i] * 1.22; });
    if (o.draw) o.draw();
  }, o.rot ?? 0);
}
/** white card */
export function card(x, y, w, h, k, fn, o = {}) {
  pop(x, y, k, () => { shadow(22, 12, 0.15); rr(-w / 2, -h / 2, w, h, o.r ?? 28, o.fill || PAL.white, o.stroke, o.lw ?? 5); noShadow(); fn && fn(); }, o.rot ?? 0);
}
/** rounded label chip */
export function chip(s, x, y, size, bg, fg = PAL.white, k = 1, o = {}) {
  const w = tw(s, size) + size * 1.1, h = size * 1.6;
  pop(x, y, k, () => { rr(-w / 2, -h / 2, w, h, h / 2, bg, o.stroke, o.lw); txt(s, 0, 0, size, fg); }, o.rot ?? 0);
  return w;
}
/** rubber-stamp: slams down from 1.8× */
export function stamp(s, x, y, size, color, k, rot = -0.12) {
  if (k <= 0) return;
  const sc = lerp(1.9, 1, clamp(ease.outQuart(clamp(k)))), w = tw(s, size) + size * 0.9, h = size * 1.55;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(sc, sc); ctx.globalAlpha *= clamp(k * 2.5) * 0.92;
  rr(-w / 2, -h / 2, w, h, 14, null, color, 7); rr(-w / 2 + 9, -h / 2 + 9, w - 18, h - 18, 9, null, color, 2.5);
  txt(s, 0, 0, size, color); ctx.restore();
}
/** speech bubble centred at (x, y) */
export function bubble(x, y, w, h, k, s, size = 48, o = {}) {
  pop(x, y, k, () => {
    shadow(14, 8, 0.12);
    ctx.beginPath(); ctx.roundRect(-w / 2, -h / 2, w, h, 40);
    const tx = (o.tail ?? -0.25) * w, dir = o.tailUp ? -1 : 1, ty = dir * h / 2;
    ctx.moveTo(tx - 22, ty); ctx.lineTo(tx - 34, ty + dir * 46); ctx.lineTo(tx + 26, ty);
    ctx.fillStyle = o.fill || PAL.white; ctx.fill(); noShadow();
    ctx.strokeStyle = o.stroke || PAL.ink; ctx.lineWidth = 5; ctx.stroke();
    if (s) { const L = Array.isArray(s) ? s : [s]; L.forEach((q, i) => txt(q, 0, (i - (L.length - 1) / 2) * size * 1.25, size, o.color || PAL.ink)); }
  }, o.rot ?? 0);
}

/** word A → word B with changed letters in accent: letters of B flip in one by one */
export function wordMorph(from, to, x, y, size, kA, kB, hiFrom = [], hiTo = [], o = {}) {
  const gap = size * 1.25;
  // from word
  font(size); let wA = ctx.measureText(from).width;
  pop(x, y - gap / 2, kA, () => {
    let cx = -wA / 2;
    [...from].forEach((ch, i) => { const cw = ctx.measureText(ch).width; if (hiFrom.includes(i)) { marker(cx - 4, -size * 0.52, cw + 8, size * 1.0, 1, PAL.sun, 0.6); } txt(ch, cx + cw / 2, 0, size, hiFrom.includes(i) ? (o.hiColor || PAL.coral) : PAL.soft); font(size); cx += cw; });
    if (o.labelA) chip(o.labelA, -wA / 2 - 90, 0, 26, PAL.faint, PAL.white, 1);
  });
  if (kB <= 0) return;
  arrow(x, y - gap / 2 + size * 0.55, x, y + gap / 2 - size * 0.6, clamp(kB * 1.6), o.arrowColor || ACC, 6);
  font(size); const wB = ctx.measureText(to).width; let cx = x - wB / 2;
  [...to].forEach((ch, i) => {
    font(size); const cw = ctx.measureText(ch).width;
    const k = spring(kB * 1.2 - i * 0.07, { freq: 2.2, damp: 0.6 });
    if (k > 0) {
      ctx.save(); ctx.translate(cx + cw / 2, y + gap / 2); ctx.scale(1, clamp(k, 0, 1.25)); ctx.globalAlpha *= clamp(k * 3);
      if (hiTo.includes(i)) marker(-cw / 2 - 4, -size * 0.52, cw + 8, size, 1, ACC, 0.25);
      txt(ch, 0, 0, size, hiTo.includes(i) ? (o.hiColor2 || ACC) : PAL.ink); ctx.restore();
    }
    cx += cw;
  });
  if (o.labelB) chip(o.labelB, x - wB / 2 - 90, y + gap / 2, 26, ACC, PAL.white, clamp(kB * 2));
}

// ── small figure for scenes (chibi student / person) ───────────────────────
export function person(x, y, s, o = {}) {
  const t = o.t ?? 0, skin = o.skin || PAL.skin, shirt = o.shirt || ACC, hair = o.hair || PAL.hair;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (o.flip) ctx.scale(-1, 1);
  const run = o.run ?? 0, sw = Math.sin(t * 18) * run;
  // legs
  line(-12, 60, -12 - sw * 26, 118, PAL.ink, 12); line(12, 60, 12 + sw * 26, 118, PAL.ink, 12);
  // body
  rr(-34, -10, 68, 80, 26, shirt);
  // arms
  line(-30, 8, -52 - sw * 10, 48 + (o.wave ? -70 : 0), skin, 12); line(30, 8, 52 + sw * 10, 48 - (o.armUp ? 80 : 0), skin, 12);
  // head
  circle(0, -52, 46, skin);
  ctx.beginPath(); ctx.arc(0, -58, 48, Math.PI * 1.02, Math.PI * 1.98); ctx.fillStyle = hair; ctx.fill();
  if (o.bun) circle(0, -108, 18, hair);
  circle(-15, -48, 5, PAL.ink); circle(15, -48, 5, PAL.ink);
  circle(-26, -34, 7, 'rgba(255,120,140,0.45)'); circle(26, -34, 7, 'rgba(255,120,140,0.45)');
  ctx.beginPath(); ctx.arc(0, -32, o.mouthOpen ? 9 : 10, 0.1, Math.PI - 0.1, false);
  if (o.mouthOpen) { ctx.fillStyle = PAL.coral; ctx.fill(); } else { ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.stroke(); }
  ctx.restore();
}

// ── icons (drawn at centre x, y, size s) ───────────────────────────────────
export function icon(name, x, y, s, color = ACC, t = 0) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s / 100, s / 100); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  const I = PAL.ink;
  switch (name) {
    case 'book': rr(-46, -38, 92, 76, 8, color); rr(-40, -32, 38, 64, 4, PAL.white); rr(2, -32, 38, 64, 4, PAL.white); line(0, -38, 0, 38, I, 4); for (let i = 0; i < 3; i++) { line(-34, -18 + i * 14, -10, -18 + i * 14, PAL.faint, 4); line(8, -18 + i * 14, 32, -18 + i * 14, PAL.faint, 4); } break;
    case 'globe': circle(0, 0, 46, '#BFE6FF', I, 5); ctx.save(); ctx.beginPath(); ctx.arc(0, 0, 44, 0, TAU); ctx.clip(); ctx.fillStyle = PAL.mint; const o = (t * 18) % 120;
      for (const [dx, dy, r] of [[-20, -14, 18], [16, 10, 20], [-6, 26, 12], [30, -24, 12]]) for (const off of [-120, 0]) { ctx.beginPath(); ctx.ellipse(dx + o + off, dy, r, r * 0.7, 0.3, 0, TAU); ctx.fill(); } ctx.restore(); circle(0, 0, 46, null, I, 5); break;
    case 'brain': ctx.fillStyle = '#FFB3C8'; ctx.beginPath(); ctx.ellipse(-18, 0, 32, 38, 0, 0, TAU); ctx.ellipse(18, 0, 32, 38, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#E2789A'; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, 34); ctx.moveTo(-34, -6); ctx.quadraticCurveTo(-18, -18, -8, -4); ctx.moveTo(8, 6); ctx.quadraticCurveTo(22, -12, 36, 4); ctx.moveTo(-30, 18); ctx.quadraticCurveTo(-16, 10, -8, 22); ctx.stroke(); break;
    case 'bulb': circle(0, -12, 34, PAL.sun, I, 5); rr(-16, 20, 32, 22, 6, PAL.faint, I, 4); for (let i = 0; i < 6; i++) { const a = -Math.PI / 2 + (i - 2.5) * 0.45; line(Math.cos(a) * 46, -12 + Math.sin(a) * 46, Math.cos(a) * 58, -12 + Math.sin(a) * 58, PAL.sun, 5); } break;
    case 'phone': rr(-34, -58, 68, 116, 14, I); rr(-28, -48, 56, 92, 6, PAL.white); circle(0, 50, 4, PAL.faint); break;
    case 'lock': ctx.beginPath(); ctx.arc(0, -14, 24, Math.PI, 0); ctx.strokeStyle = I; ctx.lineWidth = 9; ctx.stroke(); rr(-34, -14, 68, 54, 10, color); circle(0, 8, 7, I); line(0, 8, 0, 22, I, 6); break;
    case 'lens': circle(-6, -6, 30, 'rgba(255,255,255,0.6)', I, 8); line(16, 16, 42, 42, I, 12); break;
    case 'clock': circle(0, 0, 44, PAL.white, I, 6); line(0, 0, 0, -28, I, 6); line(0, 0, 20 * Math.cos(t), 20 * Math.sin(t), color, 6); break;
    case 'gear': ctx.fillStyle = color; ctx.save(); ctx.rotate(t); for (let i = 0; i < 8; i++) { ctx.rotate(TAU / 8); ctx.fillRect(-9, -46, 18, 20); } ctx.restore(); circle(0, 0, 32, color); circle(0, 0, 12, PAL.white); break;
    case 'suitcase': rr(-44, -26, 88, 64, 10, color, I, 4); rr(-16, -42, 32, 18, 6, null, I, 6); line(-24, -26, -24, 38, 'rgba(0,0,0,0.2)', 6); line(24, -26, 24, 38, 'rgba(0,0,0,0.2)', 6); break;
    case 'bowl': ctx.beginPath(); ctx.arc(0, -4, 44, 0, Math.PI); ctx.fillStyle = color; ctx.fill(); ctx.strokeStyle = I; ctx.lineWidth = 4; ctx.stroke(); line(-48, -4, 48, -4, I, 5);
      for (let i = 0; i < 3; i++) path(curve(-20 + i * 16, -14, -26 + i * 16, -34, -18 + i * 16, -50), 1, PAL.faint, 4); line(14, -10, 46, -54, '#B5835A', 5); line(24, -10, 52, -50, '#B5835A', 5); break;
    case 'tea': ctx.beginPath(); ctx.moveTo(-32, -36); ctx.lineTo(32, -36); ctx.lineTo(24, 52); ctx.lineTo(-24, 52); ctx.closePath(); ctx.fillStyle = '#E8C9A0'; ctx.fill(); ctx.strokeStyle = I; ctx.lineWidth = 5; ctx.stroke();
      for (const [dx, dy] of [[-12, 40], [4, 42], [16, 34], [-4, 30], [10, 22]]) circle(dx, dy, 6, '#4A3428'); rr(-36, -46, 72, 12, 6, PAL.white, I, 4); line(8, -46, 18, -76, PAL.coral, 8); break;
    case 'jeans': ctx.fillStyle = '#4F7FD1'; ctx.beginPath(); ctx.moveTo(-34, -46); ctx.lineTo(34, -46); ctx.lineTo(38, 50); ctx.lineTo(10, 50); ctx.lineTo(0, -4); ctx.lineTo(-10, 50); ctx.lineTo(-38, 50); ctx.closePath(); ctx.fill(); ctx.strokeStyle = I; ctx.lineWidth = 4; ctx.stroke(); line(-34, -34, 34, -34, '#355EA8', 5); circle(0, -40, 3, PAL.sun); break;
    case 'burger': ctx.beginPath(); ctx.arc(0, -8, 44, Math.PI, 0); ctx.fillStyle = '#F2B25C'; ctx.fill(); rr(-48, -6, 96, 12, 6, color); rr(-46, 6, 92, 12, 6, '#F45B5B'); rr(-44, 18, 88, 18, 8, '#F2B25C');
      for (const [dx, dy] of [[-18, -30], [0, -38], [18, -28]]) ctx.fillRect(dx - 3, dy - 1.5, 6, 3); break;
    case 'camel': ctx.fillStyle = '#D9A066'; ctx.beginPath(); ctx.ellipse(0, 0, 40, 22, 0, 0, TAU); ctx.fill(); circle(-12, -16, 16, '#D9A066'); circle(14, -14, 14, '#D9A066'); line(32, -4, 46, -36, '#D9A066', 12); circle(50, -38, 10, '#D9A066');
      for (const lx of [-28, -12, 14, 28]) line(lx, 14, lx + Math.sin(t * 8 + lx) * 6, 46, '#B97F45', 8); break;
    case 'wifi': for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(0, 30, 20 + i * 20, -Math.PI * 0.78, -Math.PI * 0.22); ctx.strokeStyle = color; ctx.lineWidth = 10; ctx.globalAlpha = 0.5 + 0.5 * ((Math.floor(t * 3) % 4) > i ? 1 : 0); ctx.stroke(); ctx.globalAlpha = 1; } circle(0, 30, 8, color); break;
    case 'share': circle(26, -30, 16, color); circle(-26, 0, 16, color); circle(26, 30, 16, color); line(-26, 0, 26, -30, color, 8); line(-26, 0, 26, 30, color, 8); break;
    case 'dna': for (let i = 0; i < 12; i++) { const yy = -54 + i * 10, a = i * 0.55 + t * 3, x1 = Math.sin(a) * 28, x2 = -x1; line(x1, yy, x2, yy, PAL.faint, 4); circle(x1, yy, 6, color); circle(x2, yy, 6, PAL.coral); } break;
    case 'mouse': ctx.fillStyle = '#B7BDCB'; ctx.beginPath(); ctx.ellipse(0, 6, 40, 28, 0, 0, TAU); ctx.fill(); circle(-26, -18, 14, '#B7BDCB'); circle(-6, -24, 14, '#B7BDCB'); circle(-34, 4, 4, I); circle(-44, 8, 4, PAL.pink); path(curve(40, 10, 70, 30, 60, -10), 1, '#B7BDCB', 5); break;
    case 'cmouse': rr(-28, -44, 56, 88, 28, PAL.white, I, 5); line(0, -44, 0, -10, I, 4); line(-28, -10, 28, -10, I, 4); path(curve(0, -44, 0, -70, 30, -80), 1, I, 4); break;
    case 'germ': circle(0, 0, 30, PAL.mint); for (let i = 0; i < 8; i++) { const a = i * TAU / 8 + t; line(Math.cos(a) * 30, Math.sin(a) * 30, Math.cos(a) * 46, Math.sin(a) * 46, PAL.mint, 6); circle(Math.cos(a) * 48, Math.sin(a) * 48, 6, PAL.mint); } circle(-10, -6, 5, I); circle(10, -6, 5, I); break;
    case 'bug': rr(-38, -30, 76, 60, 10, I); rr(-32, -24, 64, 40, 4, '#9CF0C9'); circle(0, -4, 12, PAL.coral); line(-6, -10, 6, 2, PAL.white, 3); line(6, -10, -6, 2, PAL.white, 3); rr(-20, 30, 40, 8, 4, I); break;
    case 'heartIcon': heart(0, 10, 50, PAL.coral); break;
    case 'eye': ctx.beginPath(); ctx.moveTo(-48, 0); ctx.quadraticCurveTo(0, -42, 48, 0); ctx.quadraticCurveTo(0, 42, -48, 0); ctx.fillStyle = PAL.white; ctx.fill(); ctx.strokeStyle = I; ctx.lineWidth = 5; ctx.stroke(); circle(0, 0, 18, color); circle(0, 0, 8, I); circle(5, -5, 4, PAL.white); break;
    case 'city': for (const [bx, bh, c] of [[-40, 70, PAL.lav], [-14, 96, ACC], [12, 60, PAL.coral], [36, 82, PAL.mint]]) { rr(bx - 12, 40 - bh, 24, bh, 3, c); for (let wy = 46 - bh; wy < 30; wy += 14) { ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fillRect(bx - 6, wy, 5, 7); ctx.fillRect(bx + 2, wy, 5, 7); } } break;
    case 'house': ctx.beginPath(); ctx.moveTo(-36, -4); ctx.lineTo(0, -38); ctx.lineTo(36, -4); ctx.closePath(); ctx.fillStyle = PAL.coral; ctx.fill(); rr(-28, -6, 56, 44, 4, PAL.cream, I, 3); rr(-8, 14, 16, 24, 3, color); break;
    case 'crown': ctx.beginPath(); ctx.moveTo(-40, 24); ctx.lineTo(-44, -20); ctx.lineTo(-20, 2); ctx.lineTo(0, -32); ctx.lineTo(20, 2); ctx.lineTo(44, -20); ctx.lineTo(40, 24); ctx.closePath(); ctx.fillStyle = PAL.sun; ctx.fill(); ctx.strokeStyle = I; ctx.lineWidth = 4; ctx.stroke(); break;
    case 'leaf': ctx.beginPath(); ctx.moveTo(-30, 30); ctx.quadraticCurveTo(-36, -30, 34, -34); ctx.quadraticCurveTo(30, 30, -30, 30); ctx.fillStyle = PAL.mint; ctx.fill(); line(-30, 30, 20, -20, '#15936F', 4); break;
    case 'cow': circle(0, 0, 36, PAL.white, I, 4); circle(-12, -8, 6, I); circle(12, -8, 6, I); rr(-22, 8, 44, 22, 11, PAL.pink); circle(-26, -26, 9, PAL.white, I, 3); circle(26, -26, 9, PAL.white, I, 3); break;
    default: circle(0, 0, 40, color);
  }
  ctx.restore();
}

// ── background, header, caption, mascot, progress ───────────────────────────
const DOODLES = Array.from({ length: 18 }, (_, i) => ({ x: hash(i, 3) * 1080, y: hash(i, 5) * 2600, k: Math.floor(hash(i, 7) * 4), r: 14 + hash(i, 9) * 18, c: [PAL.sky, PAL.coral, PAL.sun, PAL.mint, PAL.lav][i % 5], rot: hash(i, 11) * 6 }));
export function background(t, scroll) {
  ctx.fillStyle = PAL.paper; ctx.fillRect(0, 0, WD, HD);
  const g = 54, off = ((scroll % g) + g) % g;
  ctx.strokeStyle = PAL.grid; ctx.lineWidth = 2;
  ctx.beginPath();
  for (let y = -off; y < HD + g; y += g) { ctx.moveTo(0, y); ctx.lineTo(WD, y); }
  for (let x = 27; x < WD; x += g) { ctx.moveTo(x, 0); ctx.lineTo(x, HD); }
  ctx.stroke();
  line(96, 0, 96, HD, PAL.margin, 3);
  // drifting doodles (parallax)
  for (const d of DOODLES) {
    const y = ((d.y - scroll * 0.6 + Math.sin(t * 0.8 + d.rot) * 10) % 2600 + 2600) % 2600 - 300, x = d.x + Math.sin(t * 0.5 + d.rot) * 8;
    ctx.save(); ctx.globalAlpha = 0.2; ctx.translate(x, y); ctx.rotate(d.rot + t * 0.15);
    if (d.k === 0) star(0, 0, d.r, d.c); else if (d.k === 1) heart(0, 0, d.r * 0.9, d.c);
    else if (d.k === 2) circle(0, 0, d.r * 0.7, null, d.c, 5);
    else { path([[-d.r, 0], [-d.r / 2, -d.r / 2], [0, 0], [d.r / 2, -d.r / 2], [d.r, 0]], 1, d.c, 5); }
    ctx.restore();
  }
}

export function header(t) {
  const L = TL.LEAD, k = E(t, L - 0.75, 0.85, ease.inOutCubic);   // intro (big, centre) → header (small, top-left)
  const kIn = A(t, 0.05, { freq: 1.8, damp: 0.6 });
  const size = lerp(132, 82, k), enSize = lerp(54, 34, k);
  font(size); const w = ctx.measureText(TL.TITLE).width; font(enSize); const we = ctx.measureText(TL.EN).width;
  const fitS = Math.min(1, (WD - 120) / w);                       // long titles shrink in the centre view
  const sz = size * lerp(fitS, 1, k);
  font(sz); const w2 = ctx.measureText(TL.TITLE).width;
  const inline = k > 0.5 && (w2 + we + 30 < WD - 120);
  const x = lerp(WD / 2 - w2 / 2, 60, k), y = lerp(860, 172, k);
  // EP chip
  const chipK = A(t, 0.35);
  const chipTxt = `語言與文化小教室 · EP.${String(TL.EP).padStart(2, '0')}`, chipS = lerp(34, 28, k), chipW = tw(chipTxt, chipS) + chipS * 1.1;
  chip(chipTxt, lerp(WD / 2, 60 + chipW / 2, k), lerp(700, 76, k), chipS, ACC, PAL.white, chipK, { rot: lerp(-0.04, 0, k) });
  ctx.save(); ctx.translate(x + w2 / 2, y); const s = clamp(kIn, 0, 1.3); ctx.scale(s, s); ctx.translate(-(x + w2 / 2), -y);
  marker(x - 8, y + sz * 0.05, w2 + 16, sz * 0.42, E(t, 0.5, 0.6), PAL.sun, 0.75);
  txt(TL.TITLE, x, y, sz, PAL.ink, 'left');
  const ex = inline ? x + w2 + 26 : lerp(WD / 2 - we / 2, x + 4, k), ey = inline ? y + sz * 0.1 : lerp(y + sz * 0.95, y + sz * 0.88, k);
  txt(TL.EN, ex, ey, enSize, ACC, 'left');
  ctx.restore();
  // intro confetti burst
  if (t < L + 0.5) {
    const kb = E(t, 0.1, 1.6);
    for (let i = 0; i < 14; i++) {
      const a = i / 14 * TAU + 0.3, r = lerp(40, 420 + hash(i, 2) * 160, kb), c = [PAL.sun, PAL.coral, ACC, PAL.mint, PAL.lav][i % 5];
      ctx.save(); ctx.globalAlpha = (1 - k) * (1 - kb * 0.4); star(WD / 2 + Math.cos(a) * r, 840 + Math.sin(a) * r * 0.9, 16 + hash(i, 4) * 12, c, a + t * 2); ctx.restore();
    }
  }
}

export function currentSeg(t) {
  let cur = null;
  for (const s of TL.SEGS) if (t >= s.start - 0.12) cur = s;
  return cur;
}

export function caption(t) {
  const L = TL.LEAD, kc = A(t, L - 0.45, { freq: 2, damp: 0.75 });
  if (kc <= 0.001) return;
  const yOff = (1 - clamp(kc, 0, 1.2)) * 400;
  ctx.save(); ctx.translate(0, yOff);
  const { x, y, w, h } = CAP;
  shadow(24, 12, 0.16); rr(x, y, w, h, 30, PAL.white); noShadow();
  rr(x, y, w, h, 30, null, PAL.ink, 5);
  // ruled lines like a notebook card
  ctx.strokeStyle = '#EEF3FA'; ctx.lineWidth = 2; ctx.beginPath(); for (let ly = y + 98; ly < y + h - 20; ly += 76) { ctx.moveTo(x + 30, ly + 30); ctx.lineTo(x + w - 30, ly + 30); } ctx.stroke();
  tape(x + 90, y + 2, 150, 42, -0.08, ACC); tape(x + w - 90, y + 2, 150, 42, 0.07, PAL.sun);
  const s = currentSeg(t);
  if (s) {
    const kIn = E(t, s.start - 0.12, 0.3), size0 = 54;
    let size = size0, lines = wrap(s.text, size, w - 90);
    while (lines.length > 3 && size > 40) { size -= 2; lines = wrap(s.text, size, w - 90); }
    const lh = size * 1.42, y0 = y + h / 2 - (lines.length - 1) * lh / 2 + 6;
    // which clause is speaking: map char ranges
    const ranges = []; let pos = 0; for (const c of s.clauses) { ranges.push([pos, pos + c.text.length, c]); pos += c.text.length; }
    let ci = -1; ranges.forEach(([a, b, c], i) => { if (t >= c.start - 0.08) ci = i; });
    ctx.save(); ctx.globalAlpha *= clamp(kIn * 1.5); ctx.translate(0, (1 - kIn) * 24);
    let gi = 0;
    lines.forEach((ln, li) => {
      font(size); const lw = ctx.measureText(ln).width; let cx = WD / 2 - lw / 2; const cy = y0 + li * lh;
      // highlight the chars of the active clause
      const chars = [...ln];
      chars.forEach(ch => {
        const cw = ctx.measureText(ch).width, idx = s.text.indexOf(ln) >= 0 ? gi : gi;
        const r = ranges.findIndex(([a, b]) => idx >= a && idx < b);
        if (r === ci && ci >= 0) { const kk = E(t, ranges[ci][2].start - 0.08, 0.35); if (kk > 0) { ctx.save(); ctx.globalAlpha *= 0.55 * kk; ctx.fillStyle = PAL.sun; ctx.fillRect(cx - 1, cy - size * 0.05, cw + 2, size * 0.5); ctx.restore(); } }
        cx += cw; gi++;
      });
      // skip the whitespace consumed by wrap()
      while (s.text[gi] === ' ') gi++;
      txt(ln, WD / 2, cy, size, PAL.ink);
    });
    ctx.restore();
  }
  ctx.restore();
}

/** mascot: student with a big ribbon, peeks over the caption card; talks while a clause plays */
export function mascot(t) {
  const L = TL.LEAD, k = A(t, L - 0.2, { freq: 1.8, damp: 0.55 });
  if (k <= 0.001) return;
  // hop on every board change
  let hop = 0; for (const b of TL.BOARDS.slice(1)) { const d = t - (b.t0 - 0.3); if (d > 0 && d < 0.6) hop = Math.max(hop, Math.sin(d / 0.6 * Math.PI)); }
  const x = 930, y = CAP.y - 24 + (1 - clamp(k, 0, 1.2)) * 260 - hop * 46 + Math.sin(t * 2.2) * 4;
  const talk = talking(t), mo = talk ? 0.35 + 0.65 * Math.abs(Math.sin(t * 13.5 + Math.sin(t * 5.1) * 2)) : 0;
  const blink = (t % 3.7) > 3.55;
  ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(t * 1.6) * 0.04 - hop * 0.08);
  // body / sailor collar
  rr(-62, 2, 124, 70, 30, PAL.white, PAL.ink, 4);
  ctx.beginPath(); ctx.moveTo(-62, 14); ctx.lineTo(0, 54); ctx.lineTo(62, 14); ctx.lineTo(62, 2); ctx.lineTo(-62, 2); ctx.closePath(); ctx.fillStyle = '#2F4C8A'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(-12, 30); ctx.lineTo(0, 62); ctx.lineTo(12, 30); ctx.closePath(); ctx.fillStyle = PAL.coral; ctx.fill();
  // head
  circle(0, -66, 72, PAL.skin, PAL.ink, 4);
  ctx.beginPath(); ctx.arc(0, -74, 76, Math.PI * 1.0, Math.PI * 2.0); ctx.lineTo(76, -40); ctx.quadraticCurveTo(50, -110, 0, -100); ctx.quadraticCurveTo(-50, -110, -76, -40); ctx.closePath(); ctx.fillStyle = PAL.hair; ctx.fill();
  // ribbon
  ctx.save(); ctx.translate(48, -132); ctx.rotate(0.3); ctx.fillStyle = ACC; ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-30, -18); ctx.lineTo(-30, 18); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(30, -18); ctx.lineTo(30, 18); ctx.closePath(); ctx.fill(); circle(0, 0, 9, ACC); ctx.restore();
  // face
  if (blink) { line(-30, -58, -14, -58, PAL.ink, 5); line(14, -58, 30, -58, PAL.ink, 5); }
  else { circle(-22, -58, 9, PAL.ink); circle(22, -58, 9, PAL.ink); circle(-19, -61, 3, PAL.white); circle(25, -61, 3, PAL.white); }
  circle(-40, -36, 11, 'rgba(255,120,140,0.45)'); circle(40, -36, 11, 'rgba(255,120,140,0.45)');
  if (mo > 0.05) { ctx.beginPath(); ctx.ellipse(0, -30, 11, 4 + 10 * mo, 0, 0, TAU); ctx.fillStyle = '#C94E64'; ctx.fill(); }
  else { ctx.beginPath(); ctx.arc(0, -36, 12, 0.2, Math.PI - 0.2); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 4; ctx.stroke(); }
  // waving hand at the end
  const wave = A(t, TL.END + 0.3, { freq: 1.6, damp: 0.6 });
  if (wave > 0.01) { ctx.save(); ctx.translate(-78, -10); ctx.rotate(-0.6 + Math.sin(t * 9) * 0.35 * clamp(wave)); ctx.scale(clamp(wave), clamp(wave)); line(0, 0, 0, -56, PAL.skin, 16); circle(0, -60, 15, PAL.skin, PAL.ink, 3); ctx.restore(); }
  ctx.restore();
}

export function progress(t) {
  const y = 1834, x0 = 70, x1 = 1010, k = clamp(t / TL.DUR);
  rr(x0, y - 7, x1 - x0, 14, 7, '#E8EDF5');
  rr(x0, y - 7, (x1 - x0) * k, 14, 7, ACC);
  for (let i = 0; i <= 20; i++) line(x0 + (x1 - x0) * i / 20, y + 14, x0 + (x1 - x0) * i / 20, y + (i % 5 ? 22 : 30), PAL.faint, 3);
  // pencil
  const px = x0 + (x1 - x0) * k;
  ctx.save(); ctx.translate(px, y - 26); ctx.rotate(0.7);
  rr(-10, -60, 20, 60, 3, PAL.sun, PAL.ink, 3); rr(-10, -72, 20, 14, 4, PAL.pink, PAL.ink, 3);
  ctx.beginPath(); ctx.moveTo(-10, 0); ctx.lineTo(0, 20); ctx.lineTo(10, 0); ctx.closePath(); ctx.fillStyle = PAL.cream; ctx.fill(); ctx.strokeStyle = PAL.ink; ctx.lineWidth = 3; ctx.stroke(); circle(0, 16, 4, PAL.ink);
  ctx.restore();
}

// ── board runner: page-turn slide between boards, boards keep their own time ──
const SLIDE = 0.62;
export function boards(t, BOARD_FNS) {
  const B = TL.BOARDS;
  let scroll = 0;
  for (let i = 1; i < B.length; i++) scroll += whip(seg(t, B[i].t0 - 0.45, B[i].t0 - 0.45 + SLIDE)) * 900;
  ctx.save(); ctx.beginPath(); ctx.rect(STAGE.x, STAGE.y, STAGE.w, STAGE.h); ctx.clip();
  for (let i = 0; i < B.length; i++) {
    const tIn = i === 0 ? TL.LEAD - 0.55 : B[i].t0 - 0.45, tOut = i < B.length - 1 ? B[i + 1].t0 - 0.45 : Infinity;
    if (t < tIn - 0.01 || t > tOut + SLIDE + 0.01) continue;
    const kin = i === 0 ? glide(seg(t, tIn, tIn + 0.7)) : whip(seg(t, tIn, tIn + SLIDE));
    const kout = whip(seg(t, tOut, tOut + SLIDE));
    const dy = (1 - kin) * 1250 - kout * 1250, rot = (1 - kin) * 0.05 - kout * 0.04;
    ctx.save(); ctx.translate(WD / 2, STAGE.y + dy + STAGE.h / 2); ctx.rotate(rot); ctx.translate(-WD / 2, -STAGE.h / 2);
    const fn = BOARD_FNS[B[i].id];
    if (fn) fn(t, { x: 0, y: 0, w: WD, h: STAGE.h, cx: WD / 2, cy: STAGE.h / 2, t0: B[i].t0, segs: B[i].segs });
    ctx.restore();
  }
  ctx.restore();
  return scroll;
}

export function frame(t, BOARD_FNS) {
  ctx.save();
  const sc = ctx.canvas.width / (window.devicePixelRatio || 1) / WD;
  ctx.scale(sc, sc);
  // scroll = how many page turns so far (drives the paper grid + doodle parallax)
  const B = TL.BOARDS; let scroll = 0;
  for (let i = 1; i < B.length; i++) scroll += whip(seg(t, B[i].t0 - 0.45, B[i].t0 - 0.45 + SLIDE)) * 900;
  background(t, scroll + t * 6);
  boards(t, BOARD_FNS);
  header(t);
  caption(t);
  mascot(t);
  progress(t);
  ctx.restore();
}
