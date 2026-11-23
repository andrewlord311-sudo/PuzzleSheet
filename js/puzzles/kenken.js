// ---- Calcudoku / KenKen-style (grown-ups' edition) ----
// Fill the grid with 1…n so no number repeats in a row or column. Each outlined group
// ("cage") must make its target using the sign shown: + − × ÷. Level 1: 4×4, level 2: 5×5,
// level 3: 6×6. Always exactly one answer.
'use strict';
PS.kenkenMake = function (rng, n) {
  // a full Latin square
  const base = (r, c) => (r + c) % n, sym = PS.shuffle(rng, [...Array(n).keys()]), rr = PS.shuffle(rng, [...Array(n).keys()]), cc = PS.shuffle(rng, [...Array(n).keys()]);
  const sol = rr.map(r => cc.map(c => sym[base(r, c)] + 1));
  for (let attempt = 0; attempt < 400; attempt++) {
    const maxSize = attempt < 150 ? 4 : attempt < 300 ? 3 : 2;
    const cage = Array(n * n).fill(-1), cages = [];
    for (const start of PS.shuffle(rng, [...Array(n * n).keys()])) {
      if (cage[start] >= 0) continue;
      const want = rng() < 0.12 && maxSize > 1 ? 1 : 2 + Math.floor(rng() * (maxSize - 1)), id = cages.length, cells = [start];
      cage[start] = id;
      while (cells.length < want) {
        const opts = [];
        cells.forEach(i => [[-n], [n], [-1], [1]].forEach(([d]) => {
          const j = i + d, ri = Math.floor(i / n), rj = Math.floor(j / n);
          if (j < 0 || j >= n * n || cage[j] >= 0 || (Math.abs(d) === 1 && ri !== rj)) return;
          opts.push(j);
        }));
        if (!opts.length) break;
        const j = PS.pick(rng, opts); cage[j] = id; cells.push(j);
      }
      cages.push({ id, cells });
    }
    cages.forEach(cg => {
      const vals = cg.cells.map(i => sol[Math.floor(i / n)][i % n]);
      if (vals.length === 1) { cg.op = ''; cg.target = vals[0]; return; }
      const ops = ['+', '×'];
      if (vals.length === 2) { const [a, b] = [Math.max(...vals), Math.min(...vals)]; ops.push('−'); if (a % b === 0) ops.push('÷'); }
      cg.op = PS.pick(rng, ops);
      cg.target = cg.op === '+' ? vals.reduce((a, b) => a + b, 0) : cg.op === '×' ? vals.reduce((a, b) => a * b, 1) : cg.op === '−' ? Math.max(...vals) - Math.min(...vals) : Math.max(...vals) / Math.min(...vals);
    });
    if (PS.kenkenCount(n, cage, cages, 2) === 1) return { n, sol, cage, cages };
  }
  return null;
};
PS.kenkenCage = (cg, vals) => {   // is a full set of values right for this cage?
  const v = vals;
  if (cg.op === '') return v[0] === cg.target;
  if (cg.op === '+') return v.reduce((a, b) => a + b, 0) === cg.target;
  if (cg.op === '×') return v.reduce((a, b) => a * b, 1) === cg.target;
  const a = Math.max(...v), b = Math.min(...v);
  return cg.op === '−' ? a - b === cg.target : a / b === cg.target;
};
PS.kenkenCount = function (n, cage, cages, limit) {
  const g = Array.from({ length: n }, () => Array(n).fill(0)); let count = 0;
  (function go(i) {
    if (count >= limit) return;
    if (i === n * n) { count++; return; }
    const r = Math.floor(i / n), c = i % n;
    for (let v = 1; v <= n; v++) {
      let ok = true;
      for (let k = 0; k < n && ok; k++) if (g[r][k] === v || g[k][c] === v) ok = false;
      if (!ok) continue;
      g[r][c] = v;
      const cg = cages[cage[i]], vals = cg.cells.map(x => g[Math.floor(x / n)][x % n]);
      if (vals.every(x => x > 0)) { if (PS.kenkenCage(cg, vals)) go(i + 1); }
      else if ((cg.op === '+' && vals.reduce((a, b) => a + b, 0) < cg.target) || (cg.op === '×' && vals.reduce((a, b) => a * (b || 1), 1) <= cg.target && cg.target % vals.reduce((a, b) => a * (b || 1), 1) === 0) || cg.op === '−' || cg.op === '÷') go(i + 1);
      g[r][c] = 0;
    }
  })(0);
  return count;
};
PS.PUZZLES.kenken = {
  name: 'Calcudoku', icon: '➕', colour: '#e8438f', host: 'barnaby',
  intro: 'Fill the grid so no number repeats in a row or column, and each outlined group makes its target.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = [4, 5, 6][level - 1];
    const pz = PS.kenkenMake(rng, n);
    el.innerHTML = '';
    const wrap = PS.el('div', 'su-wrap');
    const board = PS.el('div', 'su-grid kk'); board.style.setProperty('--n', n);
    const cells = [];
    for (let i = 0; i < n * n; i++) {
      const r = Math.floor(i / n), c = i % n, id = pz.cage[i], cg = pz.cages[id];
      const edge = j => j < 0 || j >= n * n || pz.cage[j] !== id;
      const d = PS.el('div', 'su-cell kk-cell' + (edge(i - n) ? ' bt' : '') + (edge(i + n) ? ' bb' : '') + (c === 0 || edge(i - 1) ? ' bl' : '') + (c === n - 1 || edge(i + 1) ? ' br' : ''));
      if (Math.min(...cg.cells) === i) d.appendChild(PS.el('span', 'kk-clue', `${cg.target}${cg.op}`));
      d.appendChild(PS.el('span', 'kk-val', ''));
      const cell = { i, r, c, v: 0, el: d, val: d.lastChild };
      d.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); choose(cell); });
      board.appendChild(d); cells.push(cell);
    }
    const pal = PS.el('div', 'su-pal su9-pal');
    for (let v = 1; v <= n; v++) { const b = PS.el('button', 'su-pick', v); b.addEventListener('pointerdown', e => { e.preventDefault(); place(v); }); pal.appendChild(b); }
    const er = PS.el('button', 'su-pick su-erase', '🧽'); er.addEventListener('pointerdown', e => { e.preventDefault(); place(0); }); pal.appendChild(er);
    const undo = PS.el('button', 'su-pick su-undo', '↶'); undo.title = 'Undo';
    undo.addEventListener('pointerdown', e => { e.preventDefault(); const h = hist.pop(); if (!h) return; PS.tap(); h[0].v = h[1]; h[0].val.textContent = h[1] || ''; choose(h[0]); check(); });
    pal.appendChild(undo);
    wrap.append(board, pal); el.appendChild(wrap);

    let sel = null; const hist = [];
    function choose(cell) { cells.forEach(x => x.el.classList.remove('sel')); sel = cell; cell.el.classList.add('sel'); }
    function place(v) {
      if (!sel) { ctx.say('Tap a square first.'); return; }
      hist.push([sel, sel.v]); PS.tap(); sel.v = v; sel.val.textContent = v || '';
      sel.el.classList.remove('pop'); void sel.el.offsetWidth; if (v) sel.el.classList.add('pop');
      check();
    }
    function check() {
      const bad = new Set();
      cells.forEach(a => { if (!a.v) return; cells.forEach(b => { if (a !== b && a.v === b.v && (a.r === b.r || a.c === b.c)) { bad.add(a); bad.add(b); } }); });
      pz.cages.forEach(cg => { const vals = cg.cells.map(i => cells[i].v); if (vals.every(Boolean) && !PS.kenkenCage(cg, vals)) cg.cells.forEach(i => bad.add(cells[i])); });
      const full = cells.every(x => x.v), show = full && bad.size > 0;   // marked only once the grid is full
      cells.forEach(x => x.el.classList.toggle('clash', show && bad.has(x)));
      if (show) PS.oops();
      if (!bad.size && full) { cells.forEach(x => x.el.classList.remove('sel')); ctx.solved(); }
    }
    const keyH = e => { if (e.key >= '1' && e.key <= String(n)) place(+e.key); else if (e.key === 'Backspace' || e.key === '0') place(0); };
    document.addEventListener('keydown', keyH); ctx.onLeave(() => document.removeEventListener('keydown', keyH));
    choose(cells[0]);
    return {
      hint() {
        const target = (sel && sel.v !== pz.sol[sel.r][sel.c]) ? sel : cells.find(x => x.v !== pz.sol[x.r][x.c]);
        if (!target) return false;
        choose(target); place(pz.sol[target.r][target.c]); target.el.classList.add('hinted');
        return true;
      },
    };
  },
};
