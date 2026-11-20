// ---- Picture Sudoku 4×4 (four pictures, no repeats in a row, column or box) ----
// Level 1: 10 pictures given, level 2: 8, level 3: 6 (always one answer).
'use strict';
PS.sudoku4 = function (rng) {
  const base = (r, c) => (2 * (r % 2) + Math.floor(r / 2) + c) % 4;
  const sym = PS.shuffle(rng, [0, 1, 2, 3]);
  const rows = PS.shuffle(rng, [0, 1]).flatMap(b => PS.shuffle(rng, [0, 1]).map(i => b * 2 + i));
  const cols = PS.shuffle(rng, [0, 1]).flatMap(s => PS.shuffle(rng, [0, 1]).map(i => s * 2 + i));
  return rows.map(r => cols.map(c => sym[base(r, c)]));
};
PS.sudoku4Count = function (g) {
  let n = 0;
  const ok = (r, c, v) => {
    for (let i = 0; i < 4; i++) if (g[r][i] === v || g[i][c] === v) return false;
    const br = Math.floor(r / 2) * 2, bc = Math.floor(c / 2) * 2;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) if (g[br + i][bc + j] === v) return false;
    return true;
  };
  (function go() {
    if (n > 1) return;
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) if (g[r][c] < 0) {
      for (let v = 0; v < 4; v++) if (ok(r, c, v)) { g[r][c] = v; go(); g[r][c] = -1; }
      return;
    }
    n++;
  })();
  return n;
};
PS.sudoku4Holes = function (rng, sol, givens) {
  const g = sol.map(r => r.slice());
  let left = 16;
  for (const k of PS.shuffle(rng, [...Array(16).keys()])) {
    if (left <= givens) break;
    const r = Math.floor(k / 4), c = k % 4, keep = g[r][c];
    g[r][c] = -1;
    if (PS.sudoku4Count(g.map(x => x.slice())) !== 1) g[r][c] = keep; else left--;
  }
  return g;
};
PS.PUZZLES.sudoku4 = {
  name: 'Picture Squares', icon: '🟦', colour: '#2f8cff', host: 'harmony',
  intro: 'Every row, every column and every box needs all four pictures. No repeats!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const SETS = [['🦖', '🦕', '🥚', '🌴'], ['🚗', '🚌', '🚒', '🚓'], ['🐛', '🐞', '🐝', '🦋'], ['⚽', '🏏', '🏉', '🎾'], ['🧱', '🎹', '🥁', '🎺']];
    const SYM = PS.pick(rng, SETS);
    const sol = PS.sudoku4(rng), puz = PS.sudoku4Holes(rng, sol, [10, 8, 6][level - 1]);

    el.innerHTML = '';
    const wrap = PS.el('div', 'su-wrap');
    const board = PS.el('div', 'su-grid su4');
    const cells = [];
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) {
      const v = puz[r][c];
      const d = PS.el('div', 'su-cell' + (v >= 0 ? ' given' : '') + (c === 1 ? ' br' : '') + (r === 1 ? ' bb' : ''), v >= 0 ? SYM[v] : '');
      const cell = { r, c, v, given: v >= 0, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); if (!cell.given) { PS.tap(); choose(cell); } });
      board.appendChild(d); cells.push(cell);
    }
    const pal = PS.el('div', 'su-pal');
    SYM.forEach((s, i) => { const b = PS.el('button', 'su-pick', s); b.addEventListener('pointerdown', e => { e.preventDefault(); place(i); }); pal.appendChild(b); });
    const er = PS.el('button', 'su-pick su-erase', '🧽'); er.addEventListener('pointerdown', e => { e.preventDefault(); place(-1); }); pal.appendChild(er);
    wrap.append(board, pal); el.appendChild(wrap);

    let sel = null;
    function choose(cell) { cells.forEach(x => x.el.classList.remove('sel')); sel = cell; cell.el.classList.add('sel'); }
    function place(v) {
      if (!sel) { ctx.say('Tap an empty square first.'); return; }
      PS.tap(); sel.v = v; sel.el.textContent = v >= 0 ? SYM[v] : '';
      sel.el.classList.remove('pop'); void sel.el.offsetWidth; if (v >= 0) sel.el.classList.add('pop');
      check();
    }
    function check() {
      const bad = new Set();
      cells.forEach(a => { if (a.v < 0) return; cells.forEach(b => {
        if (a === b || a.v !== b.v) return;
        if (a.r === b.r || a.c === b.c || (Math.floor(a.r / 2) === Math.floor(b.r / 2) && Math.floor(a.c / 2) === Math.floor(b.c / 2))) { bad.add(a); bad.add(b); }
      }); });
      cells.forEach(x => x.el.classList.toggle('clash', bad.has(x) && !x.given));
      if (bad.size) PS.oops();
      if (!bad.size && cells.every(x => x.v >= 0)) { cells.forEach(x => x.el.classList.remove('sel')); ctx.solved(); }
    }
    choose(cells.find(x => !x.given));
    return {
      hint() {
        const target = (sel && sel.v !== sol[sel.r][sel.c]) ? sel : cells.find(x => x.v !== sol[x.r][x.c]);
        if (!target) return false;
        choose(target); place(sol[target.r][target.c]); target.el.classList.add('hinted');
        return true;
      },
    };
  },
};
