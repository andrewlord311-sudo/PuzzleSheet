// ---- Sun and Moon (fill the grid with ☀️ and 🌙) ----
// Rules: no more than two of the same next to each other; every row and column
// has the same number of suns and moons; a "=" between two squares means they
// match, a "×" means they are different. Level 1: 4×4, levels 2 and 3: 6×6.
// Every grid has exactly one answer.
'use strict';
PS.PUZZLES.tango = {
  name: 'Sun and Moon', icon: '🌗', colour: '#f5a300', host: 'melody',
  intro: 'Fill every square with a sun or a moon. Follow the rules on the right!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = ctx.size || (level === 1 ? 4 : 6), N = n * n;
    const pz = PS.tangoMake(rng, n, ctx.extra != null ? ctx.extra : (level === 2 ? 6 : 0), ctx.logic || false);
    const hist = [];   // for Undo: [cell, value it had before]
    const SYM = ctx.adult ? ['☀︎', '☾'] : ['☀️', '🌙'];

    el.innerHTML = '';
    const wrap = PS.el('div', 'tg-wrap');
    const holder = PS.el('div', 'tg-holder');
    const board = PS.el('div', 'tg-grid');
    board.style.setProperty('--n', n);
    const cells = [];
    for (let i = 0; i < N; i++) {
      const given = pz.fixed[i] >= 0;
      const d = PS.el('div', 'tg-cell' + (given ? ' given' : ''), given ? SYM[pz.fixed[i]] : '');
      d.dataset.v = given ? pz.fixed[i] : -1;
      const cell = { i, r: Math.floor(i / n), c: i % n, v: given ? pz.fixed[i] : -1, given, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); if (cell.given) return; PS.tap(); hist.push([cell, cell.v]); set(cell, cell.v === 1 ? -1 : cell.v + 1); check(); });
      board.appendChild(d); cells.push(cell);
    }
    pz.edges.forEach(e => {
      const a = cells[e.a], b = cells[e.b];
      const m = PS.el('div', 'tg-edge', e.same ? '=' : '×');
      m.style.left = ((a.c + b.c + 1) / 2 / n * 100) + '%'; m.style.top = ((a.r + b.r + 1) / 2 / n * 100) + '%';
      e.el = m; holder.appendChild(m);
    });
    holder.prepend(board);
    const rules = PS.el('div', 'tg-rules', ctx.adult ? `
      <h3>Rules</h3>
      <p>Fill every square with a sun (☀︎) or a moon (☾).</p>
      <p>No more than two of the same in a row or column.</p>
      <p>Each row and column has the same number of each.</p>
      <p><b class="tg-sign">=</b> the two squares match. <b class="tg-sign">×</b> they differ.</p>
      <p class="tg-tip">Tap to cycle: sun, moon, empty. Mistakes are marked only when the grid is full.</p>` : `
      <h3>How to play</h3>
      <p>☀️🌙 Fill every square with a sun or a moon</p>
      <p>🚫 No more than <b>two</b> the same in a row</p>
      <p>⚖️ Every row and column has the <b>same number</b> of suns and moons</p>
      <p><b class="tg-sign">=</b> means the two squares are the <b>same</b></p>
      <p><b class="tg-sign">×</b> means they are <b>different</b></p>
      <p class="tg-tip">Tap a square: ☀️, then 🌙, then empty.</p>`);
    const undo = PS.el('button', 'tg-undo', '↶ Undo');
    undo.addEventListener('pointerdown', e => { e.preventDefault(); const h = hist.pop(); if (!h) return; PS.tap(); set(h[0], h[1]); check(); });
    rules.appendChild(undo);
    wrap.append(holder, rules);
    el.appendChild(wrap);

    function set(cell, v) { cell.v = v; cell.el.textContent = v >= 0 ? SYM[v] : ''; cell.el.dataset.v = v; cell.el.classList.remove('hinted'); cell.el.classList.remove('pop'); void cell.el.offsetWidth; if (v >= 0) cell.el.classList.add('pop'); }
    function problems() {
      const bad = new Set(), badEdges = new Set(), v = i => cells[i].v;
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
        if (c + 2 < n) { const a = r * n + c; if (v(a) >= 0 && v(a) === v(a + 1) && v(a) === v(a + 2)) [a, a + 1, a + 2].forEach(x => bad.add(x)); }
        if (r + 2 < n) { const a = r * n + c; if (v(a) >= 0 && v(a) === v(a + n) && v(a) === v(a + 2 * n)) [a, a + n, a + 2 * n].forEach(x => bad.add(x)); }
      }
      for (let k = 0; k < n; k++) for (const val of [0, 1]) {
        const row = [...Array(n).keys()].map(c => k * n + c), col = [...Array(n).keys()].map(r => r * n + k);
        if (row.filter(i => v(i) === val).length > n / 2) row.filter(i => v(i) === val).forEach(x => bad.add(x));
        if (col.filter(i => v(i) === val).length > n / 2) col.filter(i => v(i) === val).forEach(x => bad.add(x));
      }
      pz.edges.forEach(e => { if (v(e.a) >= 0 && v(e.b) >= 0 && (v(e.a) === v(e.b)) !== e.same) { bad.add(e.a); bad.add(e.b); badEdges.add(e); } });
      return { bad, badEdges };
    }
    function check() {
      const { bad, badEdges } = problems();
      const full = cells.every(x => x.v >= 0);
      // grown-ups are not told off mid-way (a wrong square is often a step towards the right one): only a full grid is marked
      const show = !ctx.adult || (full && bad.size > 0);
      cells.forEach(x => x.el.classList.toggle('clash', show && bad.has(x.i) && !x.given));
      pz.edges.forEach(e => e.el.classList.toggle('bad', show && badEdges.has(e)));
      if (bad.size) { if (show) { PS.oops(); if (ctx.adult) ctx.say('Not quite: the red squares break a rule.'); } }
      else if (full) ctx.solved('Sun and moon, all in the right places!');
    }
    return {
      hint() {
        const NAME = ['sun', 'moon'];
        // a square that does not match the answer: say so and clear it
        const bad = cells.find(x => !x.given && x.v >= 0 && x.v !== pz.answer[x.i]);
        if (bad) {
          hist.push([bad, bad.v]); set(bad, -1); check(); bad.el.classList.add('hinted');
          ctx.say('One of your squares is not right, so I cleared it. Have another look around it!');
          return true;
        }
        const st = PS.tangoStep(n, cells.map(x => x.v), pz.edges);
        if (!st) {
          const t = cells.find(x => x.v < 0); if (!t) return false;
          hist.push([t, t.v]); set(t, pz.answer[t.i]); t.el.classList.add('hinted'); check(); return true;
        }
        const k = NAME[st.info.a === undefined ? 0 : st.info.a], o = NAME[st.val];
        const text = {
          pair: `Two ${k}s side by side: no more than two in a row, so the square beside them has to be a ${o}.`,
          gap: `Both neighbours are ${k}s. A ${k} here would make three in a row, so it must be a ${o}.`,
          full: `This row or column already has all of its ${k}s, so every empty square left in it is a ${o}.`,
          edge: st.info.same ? 'The = sign means this square is the same as its neighbour.' : 'The × sign means this square is different from its neighbour.',
          trial: `If this were a ${k}, a rule would be broken a few moves later, so it has to be a ${o}.`,
        }[st.why];
        const lit = st.hl.map(i => cells[i]);
        lit.forEach(x => x.el.classList.add('hl')); setTimeout(() => lit.forEach(x => x.el.classList.remove('hl')), 3500);
        const t = cells[st.cell];
        hist.push([t, t.v]); set(t, st.val); t.el.classList.add('hinted'); check();
        ctx.say(text);
        return true;
      },
    };
  },
};

// Count the answers (stops at `limit`). fixed: -1 empty, 0 sun, 1 moon per square. edges: [{a, b, same}].
PS.tangoSolve = function (n, fixed, edges, limit, rng) {
  const g = fixed.slice(), half = n / 2, adj = Array.from({ length: n * n }, () => []);
  edges.forEach(e => { adj[e.a].push({ o: e.b, same: e.same }); adj[e.b].push({ o: e.a, same: e.same }); });
  let count = 0, first = null;
  const ok = i => {
    const r = Math.floor(i / n), c = i % n, v = g[i];
    let rc = 0, cc = 0;
    for (let k = 0; k < n; k++) { if (g[r * n + k] === v) rc++; if (g[k * n + c] === v) cc++; }
    if (rc > half || cc > half) return false;
    for (let s = c - 2; s <= c; s++) if (s >= 0 && s + 2 < n) { const a = g[r * n + s]; if (a >= 0 && a === g[r * n + s + 1] && a === g[r * n + s + 2]) return false; }
    for (let s = r - 2; s <= r; s++) if (s >= 0 && s + 2 < n) { const a = g[s * n + c]; if (a >= 0 && a === g[(s + 1) * n + c] && a === g[(s + 2) * n + c]) return false; }
    for (const { o, same } of adj[i]) if (g[o] >= 0 && (g[o] === v) !== same) return false;
    return true;
  };
  (function go(i) {
    if (count >= limit) return;
    if (i === n * n) { count++; if (!first) first = g.slice(); return; }
    if (fixed[i] >= 0) { go(i + 1); return; }
    for (const v of (rng && rng() < 0.5 ? [1, 0] : [0, 1])) { g[i] = v; if (ok(i)) go(i + 1); g[i] = -1; }
  })(0);
  return { count, first };
};
// Start from a full answer, then take clues away one at a time, putting back any that
// would allow a second answer. `extra` clues are put back to make the puzzle easier.
// basic: true = put clues back until the easy steps alone can solve it; 'trial' = until easy steps plus one "what if" at a time can.
PS.tangoMake = function (rng, n, extra = 0, basic = false) {
  const answer = PS.tangoSolve(n, Array(n * n).fill(-1), [], 1, rng).first;
  const edges = [];
  for (let i = 0; i < n * n; i++) {
    if (i % n < n - 1) edges.push({ a: i, b: i + 1, same: answer[i] === answer[i + 1] });
    if (i < n * (n - 1)) edges.push({ a: i, b: i + n, same: answer[i] === answer[i + n] });
  }
  const keepCell = Array(n * n).fill(true), keepEdge = edges.map(() => true);
  const items = PS.shuffle(rng, [...Array(n * n).keys()].map(i => ['c', i]).concat(edges.map((e, i) => ['e', i])));
  const state = () => PS.tangoSolve(n, answer.map((v, i) => keepCell[i] ? v : -1), edges.filter((e, i) => keepEdge[i]), 2).count;
  const removed = [];
  for (const [t, i] of items) {
    const arr = t === 'c' ? keepCell : keepEdge;
    arr[i] = false;
    if (state() !== 1) arr[i] = true; else removed.push([t, i]);
  }
  const back = PS.shuffle(rng, removed);
  if (basic) {
    const solvable = () => PS.tangoBasicSolvable(n, answer.map((v, i) => keepCell[i] ? v : -1), edges.filter((e, i) => keepEdge[i]), basic === 'trial');
    while (!solvable() && back.length) { const [t, i] = back.shift(); (t === 'c' ? keepCell : keepEdge)[i] = true; }
  }
  back.slice(0, extra).forEach(([t, i]) => { (t === 'c' ? keepCell : keepEdge)[i] = true; });
  return { answer, fixed: answer.map((v, i) => keepCell[i] ? v : -1), edges: edges.filter((e, i) => keepEdge[i]).map(e => ({ ...e })) };
};

// ---- What a person could work out next ----
// cur: -1 empty, 0 sun, 1 moon per square. Returns { cell, val, why, hl: [squares to light up], info } or null.
//   pair   two the same side by side, so the squares at both ends must be the other kind
//   gap    the same kind on both sides of a gap, so the gap must be the other kind
//   full   a row or column already has its half of one kind, so the rest are the other kind
//   edge   a = or × sign next to a filled square
//   trial  one kind in this square would break a rule soon after, so it must be the other kind
PS.tangoViolates = function (n, g, edges) {
  const half = n / 2;
  for (let k = 0; k < n; k++) for (const val of [0, 1]) {
    let rc = 0, cc = 0;
    for (let j = 0; j < n; j++) { if (g[k * n + j] === val) rc++; if (g[j * n + k] === val) cc++; }
    if (rc > half || cc > half) return true;
  }
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
    const a = g[r * n + c]; if (a < 0) continue;
    if (c + 2 < n && a === g[r * n + c + 1] && a === g[r * n + c + 2]) return true;
    if (r + 2 < n && a === g[(r + 1) * n + c] && a === g[(r + 2) * n + c]) return true;
  }
  return edges.some(e => g[e.a] >= 0 && g[e.b] >= 0 && (g[e.a] === g[e.b]) !== e.same);
};
PS.tangoStep = function (n, cur, edges, allowTrial = true) {
  const g = cur.slice(), half = n / 2;
  const line = (kind, k) => [...Array(n).keys()].map(j => kind === 'r' ? k * n + j : j * n + k);
  const lines = [];
  for (let k = 0; k < n; k++) { lines.push(line('r', k)); lines.push(line('c', k)); }
  // basic steps, in the order a person would look for them
  const basic = (grid) => {
    for (const L of lines) for (let j = 0; j + 1 < n; j++) {          // pair
      const a = grid[L[j]];
      if (a >= 0 && a === grid[L[j + 1]]) {
        if (j - 1 >= 0 && grid[L[j - 1]] < 0) return { cell: L[j - 1], val: 1 - a, why: 'pair', hl: [L[j], L[j + 1]], info: { a } };
        if (j + 2 < n && grid[L[j + 2]] < 0) return { cell: L[j + 2], val: 1 - a, why: 'pair', hl: [L[j], L[j + 1]], info: { a } };
      }
    }
    for (const L of lines) for (let j = 0; j + 2 < n; j++) {          // gap
      const a = grid[L[j]];
      if (a >= 0 && a === grid[L[j + 2]] && grid[L[j + 1]] < 0) return { cell: L[j + 1], val: 1 - a, why: 'gap', hl: [L[j], L[j + 2]], info: { a } };
    }
    for (const L of lines) for (const val of [0, 1]) {                // full
      const have = L.filter(i => grid[i] === val).length;
      if (have === half && L.some(i => grid[i] < 0)) { const i = L.find(x => grid[x] < 0); return { cell: i, val: 1 - val, why: 'full', hl: L.filter(x => grid[x] === val), info: { a: val, line: L === lines[0] } }; }
    }
    for (const e of edges) {                                           // sign
      if (grid[e.a] >= 0 && grid[e.b] < 0) return { cell: e.b, val: e.same ? grid[e.a] : 1 - grid[e.a], why: 'edge', hl: [e.a], info: { same: e.same } };
      if (grid[e.b] >= 0 && grid[e.a] < 0) return { cell: e.a, val: e.same ? grid[e.b] : 1 - grid[e.b], why: 'edge', hl: [e.b], info: { same: e.same } };
    }
    return null;
  };
  const b = basic(g);
  if (b || !allowTrial) return b;
  // trial: suppose one kind here, follow the easy steps, and see whether a rule breaks
  for (let i = 0; i < n * n; i++) if (g[i] < 0) for (const v of [0, 1]) {
    const t = g.slice(); t[i] = v;
    let bad = PS.tangoViolates(n, t, edges);
    for (let guard = 0; guard < 60 && !bad; guard++) { const s = basic(t); if (!s) break; t[s.cell] = s.val; bad = PS.tangoViolates(n, t, edges); }
    if (bad) return { cell: i, val: 1 - v, why: 'trial', hl: [], info: { a: v } };
  }
  return null;
};
// Can the easy steps alone finish this grid (no guessing)?
PS.tangoBasicSolvable = function (n, fixed, edges, allowTrial = false) {
  const g = fixed.slice();
  for (let guard = 0; guard < n * n + 5; guard++) {
    if (g.every(v => v >= 0)) return true;
    const s = PS.tangoStep(n, g, edges, allowTrial);
    if (!s) return false;
    g[s.cell] = s.val;
  }
  return false;
};
