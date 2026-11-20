// ---- Puzzle Sheet: shared helpers ----
// Everything every puzzle uses: a seeded random generator (so a sheet's puzzles
// stay the same when she comes back to them), saving, stars for the Guinea Pig
// Garden, levels, votes, sounds, confetti and the on-screen keyboard.
'use strict';
const PS = { PUZZLES: {} };

// ---- Seeded random numbers (mulberry32) ----
PS.rng = function (seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
PS.pick = (r, arr) => arr[Math.floor(r() * arr.length)];
PS.shuffle = (r, arr) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
};
PS.newSeed = () => Math.floor(Math.random() * 2 ** 31);

// ---- Saving (every read and write survives a private window) ----
PS.load = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
PS.save = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

// ---- Stars for the Guinea Pig Garden ----
// The garden lives in Pip's Maths (TimesTables). Every andrewlord311-sudo.github.io
// site shares one origin, so one localStorage: adding to ttg_rewards here is
// exactly what the maths and paint games do, and the garden sees the stars.
PS.REWARDS_KEY = 'ttg_rewards';
PS.GARDEN_URL = 'https://andrewlord311-sudo.github.io/TimesTables/app/?game=garden';
PS.addStars = n => { const r = PS.load(PS.REWARDS_KEY, { stars: 0 }); r.stars = (r.stars || 0) + n; PS.save(PS.REWARDS_KEY, r); };
PS.starBalance = () => (PS.load(PS.REWARDS_KEY, {}).stars || 0) - (PS.load('ttg_garden', {}).spent || 0);

// ---- Levels (1 to 3 per puzzle), moved by her "how hard was it?" answer ----
PS.START_LEVEL = { wordsearch: 2, crossword: 2, code: 2, sudoku: 1, nonogram: 1, music: 1,
  queens: 1, zip: 1, tango: 1, scramble: 2, ladder: 2, beats: 1 };   // anything not listed starts at 1
// Each player keeps their own sheet, votes and levels. The first player (Maya) keeps the
// original key names, so nothing she has already done is lost.
PS.player = 'maya';
PS.K = k => PS.player === 'maya' ? k : k + '_' + PS.player;
PS.level = g => PS.load(PS.K('ps_levels'), {})[g] || PS.START_LEVEL[g] || 1;
PS.nudgeLevel = (g, by) => {
  const L = PS.load(PS.K('ps_levels'), {});
  L[g] = Math.max(1, Math.min(3, (L[g] || PS.START_LEVEL[g] || 1) + by));
  PS.save(PS.K('ps_levels'), L);
  return L[g];
};

// ---- Votes: hearts (0 = "not for me", 1 to 3 hearts) and how hard it felt ----
PS.votes = () => PS.load(PS.K('ps_votes'), []);
PS.addVote = v => { const all = PS.votes(); all.push(v); PS.save(PS.K('ps_votes'), all.slice(-500)); };
// How much a puzzle type is wanted on the next sheet: her average hearts over the last 8 votes.
PS.weight = g => {
  const vs = PS.votes().filter(v => v.g === g).slice(-8);
  if (!vs.length) return 2;                   // not tried yet: give it a fair chance
  const avg = vs.reduce((s, v) => s + v.h, 0) / vs.length;
  return Math.max(0.15, avg);                 // "not for me" every time: shows up only now and then
};

// ---- The sheet: six puzzles ----
// Two "spotlight" puzzles are on the sheet every time for 4 sheets running, then the next
// pair takes over (and the pair before joins the regular mix). The other four are picked by
// her votes, each kind once where there is enough choice. The spotlight pairs keep cycling for ever.
PS.SHEET_SIZE = 6;
PS.SPOTLIGHT_SHEETS = 4;
PS.rotation = () => PS.load(PS.K('ps_rot'), { pair: 0, n: 0, introduced: [] });
PS.makeSheet = () => {
  const old = PS.load(PS.K('ps_sheet'), { no: 0 });
  const rot = PS.rotation(), cfg = PS.cfg(), pairs = cfg.pairs || [];
  if (pairs.length && rot.n >= PS.SPOTLIGHT_SHEETS) {
    rot.introduced = [...new Set([...rot.introduced, ...pairs[rot.pair % pairs.length]])];
    rot.pair = (rot.pair + 1) % pairs.length; rot.n = 0;
  }
  rot.n++; PS.save(PS.K('ps_rot'), rot);
  const feat = pairs.length ? pairs[rot.pair % pairs.length].filter(g => PS.PUZZLES[g]) : [];
  const genres = [...cfg.core, ...rot.introduced].filter(g => PS.PUZZLES[g] && !feat.includes(g));
  const count = {};
  const items = feat.map(g => ({ g, seed: PS.newSeed(), done: false, hearts: null, feat: true }));
  while (items.length < PS.SHEET_SIZE) {
    const cap = Math.max(1, Math.ceil((PS.SHEET_SIZE - feat.length) / genres.length));
    const cands = genres.filter(g => (count[g] || 0) < cap);
    const ws = cands.map(g => PS.weight(g) * ((count[g] || 0) ? 0.35 : 1));
    let x = Math.random() * ws.reduce((a, b) => a + b, 0), i = 0;
    while (x > ws[i] && i < ws.length - 1) { x -= ws[i]; i++; }
    const g = cands[i];
    count[g] = (count[g] || 0) + 1;
    items.push({ g, seed: PS.newSeed(), done: false, hearts: null });
  }
  items.splice(0, items.length, ...PS.shuffle(Math.random, items));
  // keep the order friendly: the same kind never twice in a row if it can be helped
  for (let i = 1; i < items.length; i++) if (items[i].g === items[i - 1].g) {
    const j = items.findIndex((it, k) => k > i && it.g !== items[i].g);
    if (j > 0) [items[i], items[j]] = [items[j], items[i]];
  }
  const sheet = { no: (old.no || 0) + 1, made: new Date().toISOString(), items };
  PS.save(PS.K('ps_sheet'), sheet);
  return sheet;
};
PS.sheet = () => { const s = PS.load(PS.K('ps_sheet'), null); return s && s.items && s.items.length ? s : PS.makeSheet(); };
PS.saveSheet = s => PS.save(PS.K('ps_sheet'), s);

// ---- Sound (Web Audio; the first touch unlocks it) ----
PS.actx = null;
PS.audio = () => {
  if (!PS.actx) { try { PS.actx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (PS.actx.state === 'suspended') PS.actx.resume();
  return PS.actx;
};
PS.tone = (freq, dur = 0.25, type = 'triangle', vol = 0.18, when = 0) => {
  const ac = PS.audio(); if (!ac) return;
  const t = ac.currentTime + when;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
  o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
};
PS.tap = () => PS.tone(660, 0.07, 'sine', 0.08);
PS.ding = () => { PS.tone(880, 0.18, 'sine', 0.15); PS.tone(1320, 0.3, 'sine', 0.12, 0.09); };
PS.oops = () => { PS.tone(300, 0.15, 'triangle', 0.12); PS.tone(240, 0.22, 'triangle', 0.12, 0.12); };
PS.fanfare = () => [523, 659, 784, 1047].forEach((f, i) => PS.tone(f, i === 3 ? 0.6 : 0.2, 'triangle', 0.16, i * 0.13));
// a guinea pig "wheek": quick rising whistles
PS.wheek = () => {
  const ac = PS.audio(); if (!ac) return;
  for (let i = 0; i < 3; i++) {
    const t = ac.currentTime + i * 0.16, o = ac.createOscillator(), g = ac.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(900, t); o.frequency.exponentialRampToValueAtTime(1900, t + 0.11);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.09, t + 0.02); g.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
    o.connect(g); g.connect(ac.destination); o.start(t); o.stop(t + 0.15);
  }
};

// ---- Confetti ----
PS.confetti = () => {
  const c = document.createElement('canvas'); c.className = 'confetti';
  document.body.appendChild(c);
  const dpr = window.devicePixelRatio || 1;
  c.width = innerWidth * dpr; c.height = innerHeight * dpr;
  const x = c.getContext('2d'); x.scale(dpr, dpr);
  const cols = ['#ff4fa3', '#ff8a1f', '#ffc21a', '#2ec27e', '#2f8cff', '#8f5cff'];
  const bits = Array.from({ length: 140 }, () => ({
    x: innerWidth / 2 + (Math.random() - 0.5) * 200, y: innerHeight * 0.35,
    vx: (Math.random() - 0.5) * 14, vy: -Math.random() * 14 - 4,
    s: 6 + Math.random() * 8, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
    c: cols[Math.floor(Math.random() * cols.length)],
  }));
  let frame = 0;
  (function step() {
    x.clearRect(0, 0, innerWidth, innerHeight);
    bits.forEach(b => {
      b.vy += 0.35; b.x += b.vx; b.y += b.vy; b.r += b.vr;
      x.save(); x.translate(b.x, b.y); x.rotate(b.r); x.fillStyle = b.c; x.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2); x.restore();
    });
    if (++frame < 150) requestAnimationFrame(step); else c.remove();
  })();
};

// ---- Little DOM helpers ----
PS.el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };

// ---- The on-screen keyboard (the iPad's own keyboard covers half the puzzle) ----
// rows: array of strings; each character is a key. onKey(letter) or onKey('DEL').
PS.keyboard = (rows, onKey) => {
  const kb = PS.el('div', 'kb');
  rows.forEach((row, i) => {
    const r = PS.el('div', 'kb-row');
    [...row].forEach(ch => {
      const b = PS.el('button', 'kb-key', ch);
      b.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); onKey(ch); });
      r.appendChild(b);
    });
    if (i === rows.length - 1) {
      const d = PS.el('button', 'kb-key kb-del', '⌫');
      d.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); onKey('DEL'); });
      r.appendChild(d);
    }
    kb.appendChild(r);
  });
  // a Mac or a real keyboard works too
  kb._keyHandler = e => {
    if (e.key === 'Backspace') { onKey('DEL'); e.preventDefault(); return; }
    const k = e.key.toUpperCase();
    if (k.length === 1 && rows.join('').includes(k)) onKey(k);
  };
  document.addEventListener('keydown', kb._keyHandler);
  return kb;
};
PS.QWERTY = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

// ---- Characters ----
// Hosts are drawn from the same art as the Nuggets games (mascots.js) and Pip's
// games (pigs.js). Dreamy and Evie are Maya's guinea pigs.
PS.host = (name, pose = 'wave') => {
  if (name === 'melody' || name === 'barnaby' || name === 'harmony') return MASCOTS.html(name, 'host-svg', { pose });
  const pig = FARM_PIGS.find(p => p.name.toLowerCase() === name) || FARM_PIGS[2];
  return guineaPigSvg(pig);
};
PS.HOST_NAMES = { melody: 'Melody', barnaby: 'Barnaby', harmony: 'Harmony', dreamy: 'Dreamy', evie: 'Evie', butterscotch: 'Butterscotch' };
