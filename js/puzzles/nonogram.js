// ---- Nonogram (pixel picture) ----
// The numbers say how many squares in a row are coloured, in order. Colour
// the right squares and a picture appears. Every picture here can be solved
// by logic alone, one line at a time (checked by PS.nonoSolvable).
// Level 1: 5×5, level 2: 7×7 or 8×8, level 3: 10×10.
'use strict';
PS.PICTURES = [
  // level 1 (5×5)
  { lv: 1, name: 'a heart', colour: '#ff3d7f', rows: ['.#.#.', '#####', '#####', '.###.', '..#..'] },
  { lv: 1, name: 'a house', colour: '#ff8a1f', rows: ['..#..', '.###.', '#####', '.#.#.', '.###.'] },
  { lv: 1, name: 'a music note', colour: '#8f5cff', rows: ['..###', '..#.#', '..#..', '###..', '###..'] },
  { lv: 1, name: 'a cup', colour: '#2f8cff', rows: ['#####', '#####', '#####', '.###.', '#####'] },
  { lv: 1, name: 'a tree', colour: '#2ec27e', rows: ['..#..', '.###.', '#####', '..#..', '..#..'] },
  { lv: 1, name: 'a boat', colour: '#2f8cff', rows: ['...#.', '..##.', '.###.', '#####', '.###.'] },
  { lv: 1, name: 'a smiley face', colour: '#ffb000', rows: ['.###.', '#.#.#', '#####', '#...#', '.###.'] },
  // level 2 (7×7 and 8×8)
  { lv: 2, name: 'a guinea pig', colour: '#d9822b', rows: ['..#.....', '.####...', '######..', '#.######', '########', '########', '.######.', '.##..##.'] },
  { lv: 2, name: 'a rocket', colour: '#ff3d3d', rows: ['...#...', '..###..', '..#.#..', '..###..', '.#####.', '#.###.#', '..#.#..'] },
  { lv: 2, name: 'a cat', colour: '#8f5cff', rows: ['#.....#', '##...##', '#######', '#.#.#.#', '#######', '.#####.', '..###..'] },
  { lv: 2, name: 'a mushroom', colour: '#ff3d7f', rows: ['..####..', '.##..##.', '########', '#.####.#', '########', '...##...', '...##...', '..####..'] },
  { lv: 2, name: 'a Christmas tree', colour: '#2ec27e', rows: ['...#...', '..###..', '.#####.', '..###..', '.#####.', '#######', '...#...'] },
  { lv: 2, name: 'two quavers', colour: '#2f8cff', rows: ['..######', '..######', '..#....#', '..#....#', '..#....#', '###..###', '###..###', '........'] },
  // level 3 (10×10)
  { lv: 3, name: 'a big guinea pig', colour: '#d9822b', rows: ['..##......', '.####.....', '######....', '#.########', '##########', '##########', '.########.', '..######..', '..#....#..', '.##...##..'] },
  { lv: 3, name: 'an umbrella', colour: '#ff3d7f', rows: ['....##....', '..######..', '.########.', '##########', '#.#.##.#.#', '....##....', '....##....', '....##....', '.#..##....', '..###.....'] },
  { lv: 3, name: 'a snowman', colour: '#2f8cff', rows: ['...####...', '...####...', '..######..', '..#.##.#..', '..######..', '.########.', '##.####.##', '.########.', '.########.', '..######..'] },
  { lv: 3, name: 'a butterfly', colour: '#ff4fa3', rows: ['.#......#.', '..#....#..', '###.##.###', '####..####', '##########', '.########.', '..######..', '.########.', '####..####', '.##....##.'] },
  { lv: 3, name: 'a piano key and note', colour: '#8f5cff', rows: ['......####', '......#..#', '......#..#', '......#..#', '...####..#', '..#####..#', '..####.###', '......####', '##########', '#.#.#.#.##'] },
];

PS.nonoClues = line => { const out = []; let n = 0; for (const x of line) { if (x) n++; else if (n) { out.push(n); n = 0; } } if (n) out.push(n); return out.length ? out : [0]; };

// Line-by-line logic solver: true if the picture comes out with no guessing.
PS.nonoSolvable = function (rows) {
  const H = rows.length, W = rows[0].length;
  const R = rows.map(r => PS.nonoClues([...r].map(ch => ch === '#')));
  const C = [...Array(W).keys()].map(c => PS.nonoClues(rows.map(r => r[c] === '#')));
  const g = Array.from({ length: H }, () => Array(W).fill(-1));   // -1 unknown, 0 empty, 1 filled
  const solveLine = (line, clue) => {
    const n = line.length, cl = clue[0] === 0 ? [] : clue;
    const can = [Array(n).fill(false), Array(n).fill(false)];
    let any = false;
    const place = (i, k, cur) => {
      if (k === cl.length) {
        for (let j = i; j < n; j++) { if (line[j] === 1) return; cur[j] = 0; }
        any = true; cur.forEach((v, j) => { can[v][j] = true; }); return;
      }
      for (let s = i; s + cl[k] <= n; s++) {
        let ok = true;
        for (let j = i; j < s; j++) if (line[j] === 1) { ok = false; break; }
        if (!ok) break;
        for (let j = s; j < s + cl[k]; j++) if (line[j] === 0) { ok = false; break; }
        if (!ok) continue;
        if (s + cl[k] < n && line[s + cl[k]] === 1) continue;
        for (let j = i; j < s; j++) cur[j] = 0;
        for (let j = s; j < s + cl[k]; j++) cur[j] = 1;
        if (s + cl[k] < n) cur[s + cl[k]] = 0;
        place(s + cl[k] + 1, k + 1, cur);
      }
    };
    place(0, 0, Array(n).fill(0));
    if (!any) return null;
    return line.map((v, j) => v !== -1 ? v : can[1][j] && !can[0][j] ? 1 : can[0][j] && !can[1][j] ? 0 : -1);
  };
  for (let changed = true; changed;) {
    changed = false;
    for (let r = 0; r < H; r++) { const out = solveLine(g[r], R[r]); if (!out) return false; out.forEach((v, c) => { if (v !== g[r][c]) { g[r][c] = v; changed = true; } }); }
    for (let c = 0; c < W; c++) { const col = g.map(r => r[c]); const out = solveLine(col, C[c]); if (!out) return false; out.forEach((v, r) => { if (v !== g[r][c]) { g[r][c] = v; changed = true; } }); }
  }
  return g.every((row, r) => row.every((v, c) => v === (rows[r][c] === '#' ? 1 : 0)));
};

PS.PUZZLES.nonogram = {
  name: 'Secret Picture', icon: '🖼️', colour: '#8f5cff', host: 'harmony',
  intro: 'The numbers tell you how many squares to colour in a row. What picture is hiding?',
  render(el, ctx) {
    const { rng, level } = ctx;
    const pics = PS.PICTURES.filter(p => p.lv === level && PS.nonoSolvable(p.rows));
    const pic = PS.pick(rng, pics.length ? pics : PS.PICTURES.filter(p => p.lv === 1));
    const H = pic.rows.length, W = pic.rows[0].length;
    const ans = pic.rows.map(r => [...r].map(ch => ch === '#'));
    const R = ans.map(PS.nonoClues), C = [...Array(W).keys()].map(c => PS.nonoClues(ans.map(r => r[c])));
    const state = Array.from({ length: H }, () => Array(W).fill(0));   // 0 empty, 1 filled, 2 crossed

    el.innerHTML = '';
    const wrap = PS.el('div', 'ng-wrap');
    const table = PS.el('div', 'ng-table');
    table.style.setProperty('--w', W); table.style.setProperty('--h', H);
    table.appendChild(PS.el('div', 'ng-corner'));
    const colClue = [], rowClue = [], cellEls = [];
    for (let c = 0; c < W; c++) { const d = PS.el('div', 'ng-cclue', C[c].map(n => `<span>${n}</span>`).join('')); table.appendChild(d); colClue.push(d); }
    for (let r = 0; r < H; r++) {
      const d = PS.el('div', 'ng-rclue', R[r].map(n => `<span>${n}</span>`).join('')); table.appendChild(d); rowClue.push(d);
      cellEls.push([]);
      for (let c = 0; c < W; c++) {
        const x = PS.el('div', 'ng-cell'); x.dataset.r = r; x.dataset.c = c;
        if (c % 5 === 4 && c < W - 1) x.classList.add('br5');
        if (r % 5 === 4 && r < H - 1) x.classList.add('bb5');
        table.appendChild(x); cellEls[r].push(x);
      }
    }
    const tools = PS.el('div', 'ng-tools');
    let mode = 1;
    const bFill = PS.el('button', 'ng-tool on', '🖌️ Colour'), bCross = PS.el('button', 'ng-tool', '✖️ Cross');
    bFill.style.setProperty('--c', pic.colour);
    bFill.onclick = () => { mode = 1; bFill.classList.add('on'); bCross.classList.remove('on'); };
    bCross.onclick = () => { mode = 2; bCross.classList.add('on'); bFill.classList.remove('on'); };
    tools.append(bFill, bCross);
    tools.appendChild(PS.el('div', 'ng-tip', 'Cross out squares you know are empty.'));
    wrap.append(table, tools);
    el.appendChild(wrap);
    table.style.setProperty('--fill', pic.colour);

    // tap or drag: the first square decides whether you are colouring or rubbing out
    let painting = null, done = false, from = null, axis = null;
    const cellAt = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.classList.contains('ng-cell') ? e : null; };
    const set = (r, c, v) => {
      state[r][c] = v;
      cellEls[r][c].classList.toggle('fill', v === 1); cellEls[r][c].classList.toggle('cross', v === 2);
    };
    table.addEventListener('pointerdown', e => {
      const t = cellAt(e.clientX, e.clientY); if (!t || done) return;
      e.preventDefault(); table.setPointerCapture(e.pointerId);
      const r = +t.dataset.r, c = +t.dataset.c;
      painting = state[r][c] === mode ? 0 : mode;
      from = [r, c]; axis = null;
      PS.tap(); set(r, c, painting);
    });
    // a drag stays in the row or column it started in, and fills every square on the way
    table.addEventListener('pointermove', e => {
      if (painting == null) return;
      const t = cellAt(e.clientX, e.clientY); if (!t) return;
      let r = +t.dataset.r, c = +t.dataset.c;
      if (!axis && (r !== from[0] || c !== from[1])) axis = Math.abs(r - from[0]) > Math.abs(c - from[1]) ? 'col' : 'row';
      if (axis === 'row') r = from[0]; else if (axis === 'col') c = from[1];
      const n = Math.max(Math.abs(r - from[0]), Math.abs(c - from[1]));
      for (let i = 0; i <= n; i++) {
        const rr = from[0] + Math.sign(r - from[0]) * i, cc = from[1] + Math.sign(c - from[1]) * i;
        if (state[rr][cc] !== painting) set(rr, cc, painting);
      }
    });
    const up = () => { if (painting == null) return; painting = null; check(); };
    table.addEventListener('pointerup', up); table.addEventListener('pointercancel', up);

    function check() {
      const same = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);
      let all = true;
      for (let r = 0; r < H; r++) { const ok = same(PS.nonoClues(state[r].map(v => v === 1)), R[r]); rowClue[r].classList.toggle('ok', ok); all = all && ok; }
      for (let c = 0; c < W; c++) { const ok = same(PS.nonoClues(state.map(row => row[c] === 1)), C[c]); colClue[c].classList.toggle('ok', ok); all = all && ok; }
      if (all) {
        done = true;
        table.classList.add('solved');
        ctx.say(`It's ${pic.name}!`);
        ctx.solved(`It's ${pic.name}!`);
      }
    }
    return {
      hint() {
        for (const [r, c] of PS.shuffle(Math.random, [...Array(H * W).keys()].map(k => [Math.floor(k / W), k % W]))) {
          const want = ans[r][c] ? 1 : 2;
          if ((state[r][c] === 1) !== ans[r][c]) { set(r, c, want); cellEls[r][c].classList.add('hinted'); check(); return true; }
        }
        return false;
      },
    };
  },
};
