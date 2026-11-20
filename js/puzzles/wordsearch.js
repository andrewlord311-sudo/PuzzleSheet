// ---- Word search ----
// Level 1: 8×8, across and down. Level 2: 9×9, adds diagonals.
// Level 3: 10×10, words can run backwards too. Drag a finger along a word.
'use strict';
PS.PUZZLES.wordsearch = {
  name: 'Word Search', icon: '🔍', colour: '#ff4fa3', host: 'evie',
  intro: 'Find all the hidden words! Slide your finger along each one.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const size = [8, 9, 10][level - 1], want = [6, 8, 9][level - 1];
    const dirs = [[0, 1], [1, 0]];
    if (level >= 2) dirs.push([1, 1], [-1, 1]);
    if (level >= 3) dirs.push([0, -1], [-1, 0], [-1, -1], [1, -1]);
    const favs = PS.THEMES.filter(t => t.fav);
    const theme = PS.pick(rng, rng() < 0.75 && favs.length ? favs : PS.THEMES);

    // place words, longest first; keep the best of a few attempts
    let best = null;
    for (let attempt = 0; attempt < 20; attempt++) {
      const words = PS.shuffle(rng, theme.words.filter(w => w.length <= size)).slice(0, want + 3)
        .sort((a, b) => b.length - a.length);
      const grid = Array.from({ length: size }, () => Array(size).fill(''));
      const placed = [];
      for (const w of words) {
        if (placed.length >= want) break;
        for (let t = 0; t < 150; t++) {
          const [dr, dc] = PS.pick(rng, dirs);
          const r0 = Math.floor(rng() * size), c0 = Math.floor(rng() * size);
          const r1 = r0 + dr * (w.length - 1), c1 = c0 + dc * (w.length - 1);
          if (r1 < 0 || r1 >= size || c1 < 0 || c1 >= size) continue;
          let ok = true;
          for (let i = 0; i < w.length; i++) { const ch = grid[r0 + dr * i][c0 + dc * i]; if (ch && ch !== w[i]) { ok = false; break; } }
          if (!ok) continue;
          const cells = [];
          for (let i = 0; i < w.length; i++) { grid[r0 + dr * i][c0 + dc * i] = w[i]; cells.push([r0 + dr * i, c0 + dc * i]); }
          placed.push({ w, cells, found: false });
          break;
        }
      }
      if (!best || placed.length > best.placed.length) best = { grid, placed };
      if (placed.length >= want) break;
    }
    const { grid, placed } = best;
    const ABC = 'ABCDEFGHIJKLMNOPRSTUWY';
    for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (!grid[r][c]) grid[r][c] = ABC[Math.floor(rng() * ABC.length)];
    placed.sort((a, b) => a.w.localeCompare(b.w));

    // ---- draw ----
    el.innerHTML = '';
    const wrap = PS.el('div', 'ws-wrap');
    const board = PS.el('div', 'ws-grid');
    board.style.setProperty('--n', size);
    const cellEls = [];
    for (let r = 0; r < size; r++) { cellEls.push([]); for (let c = 0; c < size; c++) {
      const d = PS.el('div', 'ws-cell', grid[r][c]); d.dataset.r = r; d.dataset.c = c;
      board.appendChild(d); cellEls[r].push(d);
    } }
    const side = PS.el('div', 'ws-side');
    side.appendChild(PS.el('div', 'ws-theme', `${theme.icon} ${theme.name}`));
    const list = PS.el('div', 'ws-list');
    placed.forEach(p => { p.li = PS.el('div', 'ws-word', p.w); list.appendChild(p.li); });
    side.appendChild(list);
    wrap.append(board, side);
    el.appendChild(wrap);

    // ---- dragging ----
    const COLOURS = ['#ff9ccf', '#ffc98f', '#ffe48a', '#9fe8bf', '#9cc9ff', '#c9b0ff', '#ffb0b0', '#a8f0ef', '#f5b8ff'];
    let start = null, line = [];
    const cellAt = (x, y) => { const e = document.elementFromPoint(x, y); return e && e.classList.contains('ws-cell') ? e : null; };
    const clearLine = () => { line.forEach(([r, c]) => cellEls[r][c].classList.remove('sel')); line = []; };
    const drawLine = (r1, c1) => {
      clearLine();
      let dr = r1 - start[0], dc = c1 - start[1];
      const len = Math.max(Math.abs(dr), Math.abs(dc));
      if (len > 0) {   // snap to the nearest of the 8 directions
        const ang = Math.round(Math.atan2(dr, dc) / (Math.PI / 4)) * (Math.PI / 4);
        dr = Math.round(Math.sin(ang)); dc = Math.round(Math.cos(ang));
      }
      for (let i = 0; i <= len; i++) {
        const r = start[0] + dr * i, c = start[1] + dc * i;
        if (r < 0 || r >= size || c < 0 || c >= size) break;
        line.push([r, c]); cellEls[r][c].classList.add('sel');
      }
    };
    board.addEventListener('pointerdown', e => {
      const t = cellAt(e.clientX, e.clientY); if (!t) return;
      e.preventDefault(); board.setPointerCapture(e.pointerId);
      start = [+t.dataset.r, +t.dataset.c]; drawLine(start[0], start[1]);
    });
    board.addEventListener('pointermove', e => {
      if (!start) return;
      const t = cellAt(e.clientX, e.clientY); if (t) drawLine(+t.dataset.r, +t.dataset.c);
    });
    const finish = () => {
      if (!start) return;
      const s = line.map(([r, c]) => grid[r][c]).join('');
      const hit = placed.find(p => !p.found && (p.w === s || p.w === [...s].reverse().join('')) &&
        p.cells.length === line.length);
      if (hit) {
        hit.found = true; PS.ding();
        const col = COLOURS[placed.indexOf(hit) % COLOURS.length];
        hit.cells.forEach(([r, c]) => { cellEls[r][c].classList.add('found'); cellEls[r][c].style.background = col; });
        hit.li.classList.add('done'); hit.li.style.background = col;
        if (placed.every(p => p.found)) ctx.solved();
        else ctx.say(PS.pick(Math.random, ['Well spotted!', 'Brilliant!', 'Found it!', 'Super!', 'Wheek wheek!']));
      } else if (line.length > 1) PS.oops();
      clearLine(); start = null;
    };
    board.addEventListener('pointerup', finish);
    board.addEventListener('pointercancel', finish);

    return {
      hint() {
        const p = placed.find(q => !q.found); if (!p) return false;
        const [r, c] = p.cells[0];
        cellEls[r][c].classList.remove('flash'); void cellEls[r][c].offsetWidth; cellEls[r][c].classList.add('flash');
        ctx.say(`${p.w} starts with the flashing letter.`);
        return true;
      },
    };
  },
};
