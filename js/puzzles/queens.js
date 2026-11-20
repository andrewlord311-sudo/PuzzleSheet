// ---- Shy Guinea Pigs (one in every row, column and coloured garden; none touching) ----
// Every grid has exactly one answer, and each level needs a particular amount of thinking (see PS.queensLogic):
// level 1: 5×5, only "one square left" steps; level 2: 6×6, also a garden stuck inside one row or column;
// level 3: 7×7, also two gardens sharing two rows. When a guinea pig goes in, everything it rules out is crossed out for you.
'use strict';
PS.PUZZLES.queens = {
  name: 'Shy Guinea Pigs', icon: '🐹', colour: '#e8438f', host: 'butterscotch',
  intro: 'One guinea pig in every row, every column and every colour. They are shy: no two can touch!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = ctx.size || [5, 6, 7][level - 1], LOGIC = ctx.logic || [[0, 0], [1, 1], [1, 2]][level - 1], PIG = ctx.symbol || '🐹', WORD = ctx.word || 'guinea pig';
    const { reg, sol } = ctx.adult ? PS.queensMake(rng, n) : PS.queensMake(rng, n, LOGIC[0], LOGIC[1]);
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
      d.addEventListener('pointerdown', e => {
        e.preventDefault();
        if (cell.s !== 2 && blockedSet().has(cell)) { PS.oops(); ctx.say(`A ${WORD} next door says no! Tap that ${WORD} to take it away.`); return; }
        PS.tap(); set(cell, (cell.s + 1) % 3); check();
      });
      board.appendChild(d); cells.push(cell);
    }
    const rules = PS.el('div', 'qn-rules', `
      <h3>How to play</h3>
      <p>${PIG} One in <b>every row</b></p>
      <p>${PIG} One in <b>every column</b></p>
      <p>${PIG} One in <b>every colour</b></p>
      <p>🙈 No two touching, not even corners</p>
      <p class="qn-tip">Tap once for ✕ (“not here”), twice for a ${WORD}. When one goes in, the squares it rules out get a ✕ by themselves.</p>`);
    wrap.append(board, rules);
    el.appendChild(wrap);

    // every square a placed guinea pig rules out: its row, column, colour and the squares around it
    function blockedSet() {
      const b = new Set();
      cells.filter(x => x.s === 2).forEach(p => cells.forEach(x => {
        if (x !== p && (x.r === p.r || x.c === p.c || reg[x.r][x.c] === reg[p.r][p.c] || (Math.abs(x.r - p.r) <= 1 && Math.abs(x.c - p.c) <= 1))) b.add(x);
      }));
      return b;
    }
    function paint() {
      const b = blockedSet();
      cells.forEach(x => {
        const auto = x.s !== 2 && b.has(x);
        x.el.textContent = x.s === 2 ? PIG : (auto || x.s === 1) ? '✕' : '';
        x.el.classList.toggle('cross', x.s !== 2 && (auto || x.s === 1));
        x.el.classList.toggle('auto', auto);
      });
    }
    function set(cell, s) { cell.s = s; cell.el.classList.remove('hinted'); paint(); }
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
      else if (pigs.length === n) ctx.solved(ctx.adult ? 'Every crown in place!' : 'Every guinea pig found a quiet spot!');
    }
    return {
      hint() {
        const wrong = cells.find(x => x.s === 2 && sol[x.r] !== x.c);
        if (wrong) { set(wrong, 0); ctx.say(`That ${WORD} is in the wrong place, so I moved it.`); check(); return true; }
        const missing = cells.find(x => sol[x.r] === x.c && x.s !== 2);
        if (!missing) return false;
        set(missing, 2); missing.el.classList.add('hinted'); check();
        ctx.say(`There! One ${WORD} in the right place.`);
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
// lo..hi: how much thinking the grid should need (see PS.queensLogic); 0..3 means any grid.
PS.queensMake = function (rng, n, lo = 0, hi = 3) {
  let last = null, fallback = null;
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
    if (PS.queensCount(reg, n) !== 1) continue;
    if (lo === 0 && hi >= 3) return last;
    const L = PS.queensLogic(reg, n, hi), lv = L.solved ? L.level : 3;
    if (lv >= lo && lv <= hi) return last;
    if (L.solved && !fallback) fallback = last;
  }
  return fallback || last;
};

// ---- How much thinking a grid needs ----
// Solves the grid the way a person would and says which kind of step was needed, at most:
//   0  a row, column or garden with only ONE square left for its pig (the simplest: a one-square garden)
//   1  a garden stuck inside one row or column (so the rest of that row or column is crossed out), or a
//      row or column stuck inside one garden (so the rest of that garden is crossed out)
//   2  two gardens sharing just two rows or columns (or two rows or columns sharing just two gardens)
//   3  anything harder than that (needs guessing)
// Every time a pig goes in, its row, column, garden and neighbours are crossed out automatically.
PS.queensLogic = function (reg, n, maxLevel = 3) {
  const cand = Array.from({ length: n }, () => Array(n).fill(true)), pig = [];
  const cells = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) cells.push([r, c]);
  // units: rows 0..n-1, columns n..2n-1, gardens 2n..3n-1
  const inUnit = (u, r, c) => u < n ? r === u : u < 2 * n ? c === u - n : reg[r][c] === u - 2 * n;
  const kind = u => Math.floor(u / n);
  const done = Array(3 * n).fill(false);
  const cellsOf = u => cells.filter(([r, c]) => cand[r][c] && inUnit(u, r, c));
  let worst = 0;
  const place = (r, c) => {
    pig.push([r, c]);
    for (const [rr, cc] of cells) if (rr === r || cc === c || reg[rr][cc] === reg[r][c] || (Math.abs(rr - r) <= 1 && Math.abs(cc - c) <= 1)) cand[rr][cc] = false;
    done[r] = done[n + c] = done[2 * n + reg[r][c]] = true;
  };
  for (let guard = 0; guard < 200 && pig.length < n; guard++) {
    let moved = false;
    // level 0
    for (let u = 0; u < 3 * n && !moved; u++) if (!done[u]) { const cs = cellsOf(u); if (cs.length === 1) { place(...cs[0]); moved = true; } else if (!cs.length) return { solved: false, level: 3 }; }
    if (moved) continue;
    // level 1 and 2: a group of k units of one kind whose squares all lie in exactly k units of another kind
    for (let k = 1; k <= 3 && !moved; k++) {
      const lvl = k === 1 ? 1 : 2;
      if (lvl > maxLevel) break;
      if (k === 3) break;
      for (let ka = 0; ka < 3 && !moved; ka++) for (let kb = 0; kb < 3 && !moved; kb++) {
        if (ka === kb) continue;
        const A = [...Array(n).keys()].map(i => ka * n + i).filter(u => !done[u]);
        const combos = k === 1 ? A.map(a => [a]) : A.flatMap((a, i) => A.slice(i + 1).map(b => [a, b]));
        for (const grp of combos) {
          const sq = cells.filter(([r, c]) => cand[r][c] && grp.some(u => inUnit(u, r, c)));
          const Bs = [...Array(n).keys()].map(i => kb * n + i).filter(u => sq.every(([r, c]) => true) && sq.some(([r, c]) => inUnit(u, r, c)));
          if (Bs.length !== k) continue;
          // squares in those B units but not in the A group can go
          let changed = false;
          for (const [r, c] of cells) if (cand[r][c] && Bs.some(u => inUnit(u, r, c)) && !grp.some(u => inUnit(u, r, c))) { cand[r][c] = false; changed = true; }
          if (changed) { moved = true; worst = Math.max(worst, lvl); break; }
        }
      }
    }
    if (!moved) return { solved: false, level: 3 };
  }
  return { solved: pig.length === n, level: worst };
};
