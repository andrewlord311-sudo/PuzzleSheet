// ---- Greater or Less (Futoshiki): fill the grid with 1…n, no repeats in a row or column,
// and every < > ∧ ∨ sign must be true. Some squares start filled. Grown-ups' edition.
// Level 1: 5×5 with plenty of help, level 2: 6×6, level 3: 6×6 with little help. Always one answer.
'use strict';
// Count the answers (stops at `limit`). fixed: 0 empty or 1..n. rel: [{a, b}] meaning square a < square b.
PS.futoCount = function (n, fixed, rel, limit) {
  const g = fixed.slice(), lt = Array.from({ length: n * n }, () => []), gt = Array.from({ length: n * n }, () => []);
  rel.forEach(({ a, b }) => { lt[a].push(b); gt[b].push(a); });
  let count = 0, first = null;
  const ok = i => {
    const r = Math.floor(i / n), c = i % n, v = g[i];
    for (let k = 0; k < n; k++) { if (k !== c && g[r * n + k] === v) return false; if (k !== r && g[k * n + c] === v) return false; }
    for (const j of lt[i]) if (g[j] && !(v < g[j])) return false;
    for (const j of gt[i]) if (g[j] && !(g[j] < v)) return false;
    return true;
  };
  (function go(i) {
    if (count >= limit) return;
    if (i === n * n) { count++; if (!first) first = g.slice(); return; }
    if (fixed[i]) { go(i + 1); return; }
    for (let v = 1; v <= n; v++) { g[i] = v; if (ok(i)) go(i + 1); g[i] = 0; }
  })(0);
  return { count, first };
};
// extra: clues put back after the thinning, to make the grid easier.
PS.futoMake = function (rng, n, extra = 0) {
  const sym = PS.shuffle(rng, [...Array(n).keys()]), rr = PS.shuffle(rng, [...Array(n).keys()]), cc = PS.shuffle(rng, [...Array(n).keys()]);
  const sol = rr.flatMap(r => cc.map(c => sym[(r + c) % n] + 1));
  const rel = [];
  for (let i = 0; i < n * n; i++) {
    if (i % n < n - 1) rel.push(sol[i] < sol[i + 1] ? { a: i, b: i + 1 } : { a: i + 1, b: i });
    if (i < n * (n - 1)) rel.push(sol[i] < sol[i + n] ? { a: i, b: i + n } : { a: i + n, b: i });
  }
  const keepCell = Array(n * n).fill(true), keepRel = rel.map(() => true);
  const items = PS.shuffle(rng, [...Array(n * n).keys()].map(i => ['c', i]).concat(rel.map((e, i) => ['r', i])));
  const count = () => PS.futoCount(n, sol.map((v, i) => keepCell[i] ? v : 0), rel.filter((e, i) => keepRel[i]), 2).count;
  const removed = [];
  for (const [t, i] of items) {
    const arr = t === 'c' ? keepCell : keepRel;
    arr[i] = false;
    if (count() !== 1) arr[i] = true; else removed.push([t, i]);
  }
  PS.shuffle(rng, removed).slice(0, extra).forEach(([t, i]) => { (t === 'c' ? keepCell : keepRel)[i] = true; });
  return { n, sol, fixed: sol.map((v, i) => keepCell[i] ? v : 0), rel: rel.filter((e, i) => keepRel[i]) };
};
PS.PUZZLES.futoshiki = {
  name: 'Greater or Less', icon: '⚖️', colour: '#2f8cff', host: 'barnaby',
  intro: 'Fill the grid so no number repeats in a row or column. Every < > ∧ ∨ sign must be true: the sign opens towards the bigger number.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = [5, 6, 6][level - 1], pz = PS.futoMake(rng, n, [5, 4, 0][level - 1]);
    el.innerHTML = '';
    const wrap = PS.el('div', 'su-wrap');
    const board = PS.el('div', 'su-grid ft');
    const tr = `repeat(${n - 1}, 1fr .32fr) 1fr`;
    board.style.gridTemplateColumns = tr; board.style.gridTemplateRows = tr;
    const cells = [];
    for (let i = 0; i < n * n; i++) {
      const r = Math.floor(i / n), c = i % n, v = pz.fixed[i];
      const d = PS.el('div', 'su-cell ft-cell' + (v ? ' given' : ''), v || '');
      d.style.gridRow = 2 * r + 1; d.style.gridColumn = 2 * c + 1;
      const cell = { i, r, c, v, given: !!v, el: d };
      d.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); choose(cell); });
      board.appendChild(d); cells.push(cell);
    }
    pz.rel.forEach(e => {
      const horiz = Math.floor(e.a / n) === Math.floor(e.b / n);
      const lo = Math.min(e.a, e.b), r = Math.floor(lo / n), c = lo % n, smallerFirst = e.a === lo;
      const m = PS.el('div', 'ft-edge', horiz ? (smallerFirst ? '<' : '>') : (smallerFirst ? '∧' : '∨'));
      m.style.gridRow = horiz ? 2 * r + 1 : 2 * r + 2; m.style.gridColumn = horiz ? 2 * c + 2 : 2 * c + 1;
      e.el = m; board.appendChild(m);
    });
    const pal = PS.el('div', 'su-pal su9-pal');
    for (let v = 1; v <= n; v++) { const b = PS.el('button', 'su-pick', v); b.addEventListener('pointerdown', e => { e.preventDefault(); place(v); }); pal.appendChild(b); }
    const er = PS.el('button', 'su-pick su-erase', '🧽'); er.addEventListener('pointerdown', e => { e.preventDefault(); place(0); }); pal.appendChild(er);
    wrap.append(board, pal); el.appendChild(wrap);

    let sel = null;
    function choose(cell) { cells.forEach(x => x.el.classList.remove('sel')); sel = cell; cell.el.classList.add('sel'); }
    function place(v) {
      if (!sel || sel.given) { ctx.say('Tap an empty square first.'); return; }
      PS.tap(); sel.v = v; sel.el.textContent = v || '';
      sel.el.classList.remove('pop'); void sel.el.offsetWidth; if (v) sel.el.classList.add('pop');
      check();
    }
    // nothing is marked wrong until the grid is full: a wrong number is often a step towards the right one
    function check() {
      cells.forEach(x => x.el.classList.remove('clash')); pz.rel.forEach(e => e.el.classList.remove('bad'));
      if (!cells.every(x => x.v)) return;
      const bad = new Set(), badRel = [];
      cells.forEach(a => cells.forEach(b => { if (a !== b && a.v === b.v && (a.r === b.r || a.c === b.c)) { bad.add(a); bad.add(b); } }));
      pz.rel.forEach(e => { if (!(cells[e.a].v < cells[e.b].v)) { bad.add(cells[e.a]); bad.add(cells[e.b]); badRel.push(e); } });
      if (!bad.size) { cells.forEach(x => x.el.classList.remove('sel')); ctx.solved(); return; }
      PS.oops(); ctx.say('Not quite: the red squares break a rule.');
      bad.forEach(x => { if (!x.given) x.el.classList.add('clash'); }); badRel.forEach(e => e.el.classList.add('bad'));
    }
    const keyH = e => { if (e.key >= '1' && e.key <= String(n)) place(+e.key); else if (e.key === 'Backspace' || e.key === '0') place(0); };
    document.addEventListener('keydown', keyH); ctx.onLeave(() => document.removeEventListener('keydown', keyH));
    choose(cells.find(x => !x.given));
    return {
      hint() {
        const target = (sel && !sel.given && sel.v !== pz.sol[sel.i]) ? sel : cells.find(x => x.v !== pz.sol[x.i]);
        if (!target) return false;
        choose(target); place(pz.sol[target.i]); target.el.classList.add('hinted');
        return true;
      },
    };
  },
};
