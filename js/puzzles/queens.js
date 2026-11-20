// ---- Shy Guinea Pigs (one in every row, column and coloured garden; none touching) ----
// Level 1: 5×5, level 2: 6×6, level 3: 7×7. Every grid has exactly one answer.
'use strict';
PS.PUZZLES.queens = {
  name: 'Shy Guinea Pigs', icon: '🐹', colour: '#e8438f', host: 'butterscotch',
  intro: 'One guinea pig in every row, every column and every colour. They are shy: no two can touch!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = [5, 6, 7][level - 1];
    const { reg, sol } = PS.queensMake(rng, n);
    const COLS = PS.shuffle(rng, ['#ff9ec7', '#ffd36b', '#8fe3a5', '#8ec8ff', '#c3a6ff', '#ffab73', '#7fe0dc', '#e8f070']);

    el.innerHTML = '';
    const wrap = PS.el('div', 'qn-wrap');
    const board = PS.el('div', 'qn-grid');
    board.style.setProperty('--n', n);
    const cells = [];
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) {
      const g = reg[r][c];
      const edge = (rr, cc) => rr < 0 || cc < 0 || rr >= n || cc >= n || reg[rr][cc] !== g;
      const d = PS.el('div', 'qn-cell' + (edge(r - 1, c) ? ' bt' : '') + (edge(r + 1, c) ? ' bb' : '') + (edge(r, c - 1) ? ' bl' : '') + (edge(r, c + 1) ? ' br' : ''));
      d.style.background = COLS[g];
      const cell = { r, c, s: 0, el: d };       // s: 0 empty, 1 cross, 2 guinea pig
      d.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); set(cell, (cell.s + 1) % 3); check(); });
      board.appendChild(d); cells.push(cell);
    }
    const rules = PS.el('div', 'qn-rules', `
      <h3>How to play</h3>
      <p>🐹 One in <b>every row</b></p>
      <p>🐹 One in <b>every column</b></p>
      <p>🐹 One in <b>every colour</b></p>
      <p>🙈 No two touching, not even corners</p>
      <p class="qn-tip">Tap once for ✕ (“not here”), twice for a guinea pig.</p>`);
    wrap.append(board, rules);
    el.appendChild(wrap);

    function set(cell, s) { cell.s = s; cell.el.textContent = s === 1 ? '✕' : s === 2 ? '🐹' : ''; cell.el.classList.toggle('cross', s === 1); cell.el.classList.remove('hinted'); }
    function bad() {
      const pigs = cells.filter(x => x.s === 2), out = new Set();
      pigs.forEach(a => pigs.forEach(b => {
        if (a === b) return;
        if (a.r === b.r || a.c === b.c || reg[a.r][a.c] === reg[b.r][b.c] || (Math.abs(a.r - b.r) <= 1 && Math.abs(a.c - b.c) <= 1)) out.add(a);
      }));
      return { pigs, out };
    }
    function check() {
      const { pigs, out } = bad();
      cells.forEach(x => x.el.classList.toggle('clash', out.has(x)));
      if (out.size) PS.oops();
      else if (pigs.length === n) ctx.solved('Every guinea pig found a quiet spot!');
    }
    return {
      hint() {
        const wrong = cells.find(x => x.s === 2 && sol[x.r] !== x.c);
        if (wrong) { set(wrong, 0); ctx.say('That guinea pig is in the wrong place, so I moved it.'); check(); return true; }
        const missing = cells.find(x => sol[x.r] === x.c && x.s !== 2);
        if (!missing) return false;
        set(missing, 2); missing.el.classList.add('hinted'); check();
        ctx.say('There! One guinea pig in the right place.');
        return true;
      },
    };
  },
};

// A random answer: one per row and column, none touching.
PS.queensRandom = function (rng, n) {
  const pos = [], used = Array(n).fill(false);
  (function go(r) {
    if (r === n) return true;
    for (const c of PS.shuffle(rng, [...Array(n).keys()])) {
      if (used[c] || (r && Math.abs(c - pos[r - 1]) < 2)) continue;
      used[c] = true; pos[r] = c;
      if (go(r + 1)) return true;
      used[c] = false;
    }
    return false;
  })(0);
  return pos;
};
// Count the answers (stops at `limit`).
PS.queensCount = function (reg, n, limit = 2) {
  const cols = Array(n).fill(false), regs = Array(n).fill(false);
  let count = 0;
  (function go(r, prev) {
    if (count >= limit) return;
    if (r === n) { count++; return; }
    for (let c = 0; c < n; c++) {
      if (cols[c] || regs[reg[r][c]] || (prev >= 0 && Math.abs(c - prev) < 2)) continue;
      cols[c] = regs[reg[r][c]] = true;
      go(r + 1, c);
      cols[c] = regs[reg[r][c]] = false;
    }
  })(0, -1);
  return count;
};
// Grow n coloured gardens around a hidden answer until the grid has exactly one answer.
PS.queensMake = function (rng, n) {
  let last = null;
  for (let attempt = 0; attempt < 3000; attempt++) {
    const sol = PS.queensRandom(rng, n);
    const reg = Array.from({ length: n }, () => Array(n).fill(-1));
    sol.forEach((c, r) => { reg[r][c] = r; });
    for (let free = n * n - n; free > 0; free--) {
      const fr = [];
      for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (reg[r][c] < 0)
        for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && cc >= 0 && rr < n && cc < n && reg[rr][cc] >= 0) fr.push([r, c, reg[rr][cc]]);
        }
      const [r, c, g] = PS.pick(rng, fr);
      reg[r][c] = g;
    }
    last = { reg, sol };
    if (PS.queensCount(reg, n) === 1) return last;
  }
  return last;
};
