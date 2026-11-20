// ---- Classic Sudoku 9×9 (grown-ups' edition) ----
// Level 1: 40 numbers given (gentle), level 2: 33, level 3: 28. Always exactly one answer.
'use strict';
PS.sudoku9 = function (rng) {
  const base = (r, c) => (3 * (r % 3) + Math.floor(r / 3) + c) % 9;
  const sym = PS.shuffle(rng, [...Array(9).keys()]);
  const rows = PS.shuffle(rng, [0, 1, 2]).flatMap(b => PS.shuffle(rng, [0, 1, 2]).map(i => b * 3 + i));
  const cols = PS.shuffle(rng, [0, 1, 2]).flatMap(s => PS.shuffle(rng, [0, 1, 2]).map(i => s * 3 + i));
  return rows.map(r => cols.map(c => sym[base(r, c)]));
};
// Count the answers (stops at 2), always filling the square with the fewest choices first.
PS.sudoku9Count = function (g) {
  let n = 0;
  const cands = (r, c) => {
    const used = new Set();
    for (let i = 0; i < 9; i++) { used.add(g[r][i]); used.add(g[i][c]); }
    const br = Math.floor(r / 3) * 3, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) used.add(g[br + i][bc + j]);
    return [0, 1, 2, 3, 4, 5, 6, 7, 8].filter(v => !used.has(v));
  };
  (function go() {
    if (n > 1) return;
    let best = null;
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (g[r][c] < 0) {
      const cs = cands(r, c);
      if (!best || cs.length < best.cs.length) best = { r, c, cs };
      if (cs.length === 0) return;
    }
    if (!best) { n++; return; }
    for (const v of best.cs) { g[best.r][best.c] = v; go(); g[best.r][best.c] = -1; }
  })();
  return n;
};
PS.sudoku9Holes = function (rng, sol, givens) {
  const g = sol.map(r => r.slice());
  let left = 81;
  for (const k of PS.shuffle(rng, [...Array(81).keys()])) {
    if (left <= givens) break;
    const r = Math.floor(k / 9), c = k % 9, keep = g[r][c];
    g[r][c] = -1;
    if (PS.sudoku9Count(g.map(x => x.slice())) !== 1) g[r][c] = keep; else left--;
  }
  return g;
};
PS.PUZZLES.sudoku9 = {
  name: 'Sudoku', icon: '🔢', colour: '#2f8cff', host: 'harmony',
  intro: 'Every row, column and 3×3 box needs the numbers 1 to 9, once each.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const sol = PS.sudoku9(rng), puz = PS.sudoku9Holes(rng, sol, [40, 33, 28][level - 1]);
    el.innerHTML = '';
    const wrap = PS.el('div', 'su-wrap');
    const board = PS.el('div', 'su-grid su9');
    const cells = [];
    for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const v = puz[r][c];
      const d = PS.el('div', 'su-cell' + (v >= 0 ? ' given' : '') + (c % 3 === 2 && c < 8 ? ' br' : '') + (r % 3 === 2 && r < 8 ? ' bb' : ''), v >= 0 ? v + 1 : '');
      const cell = { r, c, v, given: v >= 0, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); choose(cell); });
      board.appendChild(d); cells.push(cell);
    }
    const pal = PS.el('div', 'su-pal su9-pal');
    for (let i = 0; i < 9; i++) { const b = PS.el('button', 'su-pick', i + 1); b.addEventListener('pointerdown', e => { e.preventDefault(); place(i); }); pal.appendChild(b); }
    const er = PS.el('button', 'su-pick su-erase', '🧽'); er.addEventListener('pointerdown', e => { e.preventDefault(); place(-1); }); pal.appendChild(er);
    wrap.append(board, pal); el.appendChild(wrap);

    let sel = null;
    function choose(cell) { cells.forEach(x => x.el.classList.remove('sel', 'same')); sel = cell; cell.el.classList.add('sel'); if (cell.v >= 0) cells.forEach(x => { if (x !== cell && x.v === cell.v) x.el.classList.add('same'); }); }
    function place(v) {
      if (!sel || sel.given) { ctx.say('Tap an empty square first.'); return; }
      PS.tap(); sel.v = v; sel.el.textContent = v >= 0 ? v + 1 : '';
      sel.el.classList.remove('pop'); void sel.el.offsetWidth; if (v >= 0) sel.el.classList.add('pop');
      choose(sel); check();
    }
    function check() {
      const bad = new Set();
      cells.forEach(a => { if (a.v < 0) return; cells.forEach(b => {
        if (a === b || a.v !== b.v) return;
        if (a.r === b.r || a.c === b.c || (Math.floor(a.r / 3) === Math.floor(b.r / 3) && Math.floor(a.c / 3) === Math.floor(b.c / 3))) { bad.add(a); bad.add(b); }
      }); });
      // not marked until the grid is full: a wrong number is often a step towards the right one
      const full = cells.every(x => x.v >= 0), show = full && bad.size > 0;
      cells.forEach(x => x.el.classList.toggle('clash', show && bad.has(x) && !x.given));
      if (show) PS.oops();
      if (!bad.size && full) { cells.forEach(x => x.el.classList.remove('sel', 'same')); ctx.solved(); }
    }
    const keyH = e => { if (e.key >= '1' && e.key <= '9') place(+e.key - 1); else if (e.key === 'Backspace' || e.key === '0') place(-1); };
    document.addEventListener('keydown', keyH); ctx.onLeave(() => document.removeEventListener('keydown', keyH));
    choose(cells.find(x => !x.given));
    return {
      hint() {
        const target = (sel && !sel.given && sel.v !== sol[sel.r][sel.c]) ? sel : cells.find(x => x.v !== sol[x.r][x.c]);
        if (!target) return false;
        choose(target); place(sol[target.r][target.c]); target.el.classList.add('hinted');
        return true;
      },
    };
  },
};
