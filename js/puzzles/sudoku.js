// ---- 6×6 picture sudoku ----
// Six foods instead of numbers. Every row, every column and every box of
// 2 rows × 3 columns has each food once. Always exactly one answer.
// Level 1: 20 foods given, level 2: 16, level 3: 13 (still one answer).
'use strict';
PS.PUZZLES.sudoku = {
  name: 'Veggie Sudoku', icon: '🥕', colour: '#2ec27e', host: 'dreamy',
  intro: 'Every row, column and box needs one of each food. No repeats!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const SETS = [
      ['🥕', '🍓', '🥒', '🍎', '🌽', '🍇'],
      ['🥬', '🍌', '🍐', '🫐', '🍉', '🥕'],
      ['🍓', '🍊', '🥦', '🍒', '🍋', '🥒'],
      ['🍫', '🍬', '🍭', '🧁', '🍩', '🍪'],
      ['🎹', '🎤', '🎸', '🥁', '🎻', '🎺'],
    ];
    const SYM = PS.pick(rng, SETS);
    const sol = PS.sudoku6(rng);
    const givens = [20, 16, 13][level - 1];
    const puz = PS.sudoku6Holes(rng, sol, givens);

    el.innerHTML = '';
    const wrap = PS.el('div', 'su-wrap');
    const board = PS.el('div', 'su-grid');
    const cells = [];
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) {
      const v = puz[r][c];
      const d = PS.el('div', 'su-cell' + (v >= 0 ? ' given' : '') + (c === 2 ? ' br' : '') + (r % 2 === 1 && r < 5 ? ' bb' : ''), v >= 0 ? SYM[v] : '');
      const cell = { r, c, v, given: v >= 0, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); if (!cell.given) { PS.tap(); choose(cell); } });
      board.appendChild(d); cells.push(cell);
    }
    const pal = PS.el('div', 'su-pal');
    SYM.forEach((s, i) => {
      const b = PS.el('button', 'su-pick', s);
      b.addEventListener('pointerdown', e => { e.preventDefault(); place(i); });
      pal.appendChild(b);
    });
    const er = PS.el('button', 'su-pick su-erase', '🧽');
    er.addEventListener('pointerdown', e => { e.preventDefault(); place(-1); });
    pal.appendChild(er);
    wrap.append(board, pal);
    el.appendChild(wrap);

    let sel = null;
    function choose(cell) { cells.forEach(x => x.el.classList.remove('sel')); sel = cell; cell.el.classList.add('sel'); }
    function place(v) {
      if (!sel) { ctx.say('Tap an empty square first.'); return; }
      PS.tap();
      sel.v = v; sel.el.textContent = v >= 0 ? SYM[v] : '';
      sel.el.classList.remove('pop'); void sel.el.offsetWidth; if (v >= 0) sel.el.classList.add('pop');
      check();
    }
    function check() {
      const bad = new Set();
      cells.forEach(a => { if (a.v < 0) return; cells.forEach(b => {
        if (a === b || a.v !== b.v) return;
        if (a.r === b.r || a.c === b.c || (Math.floor(a.r / 2) === Math.floor(b.r / 2) && Math.floor(a.c / 3) === Math.floor(b.c / 3))) { bad.add(a); bad.add(b); }
      }); });
      cells.forEach(x => x.el.classList.toggle('clash', bad.has(x) && !x.given));
      if (bad.size) PS.oops();
      if (!bad.size && cells.every(x => x.v >= 0)) { cells.forEach(x => x.el.classList.remove('sel')); ctx.solved(); }
    }
    // start with the first empty square chosen
    choose(cells.find(x => !x.given));

    return {
      hint() {
        const target = (sel && sel.v !== sol[sel.r][sel.c]) ? sel : cells.find(x => x.v !== sol[x.r][x.c]);
        if (!target) return false;
        choose(target); place(sol[target.r][target.c]);
        target.el.classList.add('hinted');
        return true;
      },
    };
  },
};

// A random full 6×6 solution: a base pattern, then shuffles that keep it valid.
PS.sudoku6 = function (rng) {
  const base = (r, c) => (3 * (r % 2) + Math.floor(r / 2) + c) % 6;
  const sym = PS.shuffle(rng, [0, 1, 2, 3, 4, 5]);
  const bands = PS.shuffle(rng, [0, 1, 2]);
  const rows = bands.flatMap(b => PS.shuffle(rng, [0, 1]).map(i => b * 2 + i));
  const stacks = PS.shuffle(rng, [0, 1]);
  const cols = stacks.flatMap(s => PS.shuffle(rng, [0, 1, 2]).map(i => s * 3 + i));
  return rows.map(r => cols.map(c => sym[base(r, c)]));
};
// How many answers (stops counting at 2).
PS.sudoku6Count = function (g) {
  let n = 0;
  const ok = (r, c, v) => {
    for (let i = 0; i < 6; i++) if (g[r][i] === v || g[i][c] === v) return false;
    const br = Math.floor(r / 2) * 2, bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 2; i++) for (let j = 0; j < 3; j++) if (g[br + i][bc + j] === v) return false;
    return true;
  };
  (function go() {
    if (n > 1) return;
    for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) if (g[r][c] < 0) {
      for (let v = 0; v < 6; v++) if (ok(r, c, v)) { g[r][c] = v; go(); g[r][c] = -1; }
      return;
    }
    n++;
  })();
  return n;
};
// Take foods away one at a time, putting back any that would allow two answers.
PS.sudoku6Holes = function (rng, sol, givens) {
  const g = sol.map(r => r.slice());
  let left = 36;
  for (const k of PS.shuffle(rng, [...Array(36).keys()])) {
    if (left <= givens) break;
    const r = Math.floor(k / 6), c = k % 6, keep = g[r][c];
    g[r][c] = -1;
    if (PS.sudoku6Count(g.map(x => x.slice())) !== 1) g[r][c] = keep; else left--;
  }
  return g;
};
