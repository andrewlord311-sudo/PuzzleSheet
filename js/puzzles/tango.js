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
    const pz = PS.tangoMake(rng, n, ctx.extra != null ? ctx.extra : (level === 2 ? 6 : 0));
    const SYM = ['☀️', '🌙'];

    el.innerHTML = '';
    const wrap = PS.el('div', 'tg-wrap');
    const holder = PS.el('div', 'tg-holder');
    const board = PS.el('div', 'tg-grid');
    board.style.setProperty('--n', n);
    const cells = [];
    for (let i = 0; i < N; i++) {
      const given = pz.fixed[i] >= 0;
      const d = PS.el('div', 'tg-cell' + (given ? ' given' : ''), given ? SYM[pz.fixed[i]] : '');
      const cell = { i, r: Math.floor(i / n), c: i % n, v: given ? pz.fixed[i] : -1, given, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); if (cell.given) return; PS.tap(); set(cell, cell.v === 1 ? -1 : cell.v + 1); check(); });
      board.appendChild(d); cells.push(cell);
    }
    pz.edges.forEach(e => {
      const a = cells[e.a], b = cells[e.b];
      const m = PS.el('div', 'tg-edge', e.same ? '=' : '×');
      m.style.left = ((a.c + b.c + 1) / 2 / n * 100) + '%'; m.style.top = ((a.r + b.r + 1) / 2 / n * 100) + '%';
      e.el = m; holder.appendChild(m);
    });
    holder.prepend(board);
    const rules = PS.el('div', 'tg-rules', `
      <h3>How to play</h3>
      <p>☀️🌙 Fill every square with a sun or a moon</p>
      <p>🚫 No more than <b>two</b> the same in a row</p>
      <p>⚖️ Every row and column has the <b>same number</b> of suns and moons</p>
      <p><b class="tg-sign">=</b> means the two squares are the <b>same</b></p>
      <p><b class="tg-sign">×</b> means they are <b>different</b></p>
      <p class="tg-tip">Tap a square: ☀️, then 🌙, then empty.</p>`);
    wrap.append(holder, rules);
    el.appendChild(wrap);

    function set(cell, v) { cell.v = v; cell.el.textContent = v >= 0 ? SYM[v] : ''; cell.el.classList.remove('hinted'); cell.el.classList.remove('pop'); void cell.el.offsetWidth; if (v >= 0) cell.el.classList.add('pop'); }
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
      cells.forEach(x => x.el.classList.toggle('clash', bad.has(x.i) && !x.given));
      pz.edges.forEach(e => e.el.classList.toggle('bad', badEdges.has(e)));
      if (bad.size) PS.oops();
      else if (cells.every(x => x.v >= 0)) ctx.solved('Sun and moon, all in the right places!');
    }
    return {
      hint() {
        const target = cells.find(x => !x.given && x.v >= 0 && x.v !== pz.answer[x.i]) || cells.find(x => x.v < 0);
        if (!target) return false;
        set(target, pz.answer[target.i]); target.el.classList.add('hinted'); check();
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
PS.tangoMake = function (rng, n, extra = 0) {
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
  PS.shuffle(rng, removed).slice(0, extra).forEach(([t, i]) => { (t === 'c' ? keepCell : keepEdge)[i] = true; });
  return { answer, fixed: answer.map((v, i) => keepCell[i] ? v : -1), edges: edges.filter((e, i) => keepEdge[i]).map(e => ({ ...e })) };
};
