// ---- Crossword (written clues) ----
// Level 1: about 6 words, level 2: 8, level 3: 10. Tap a square (tap again to
// switch across/down), or tap a clue, then type on the keyboard below.
'use strict';
PS.PUZZLES.crossword = {
  name: 'Crossword', icon: '✏️', colour: '#ff8a1f', host: 'barnaby',
  intro: 'Read each clue and fill in the word. Tap a square, then type!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const want = [6, 8, 10][level - 1];
    const FAV = ['Guinea pigs', 'Music', 'Christmas', 'Wizard school', 'On stage', 'Pop star', 'Chocolate', 'Drawing and colouring'];
    const themeName = PS.pick(rng, rng() < 0.75 ? FAV : Object.keys(PS.CLUES));
    const bank = PS.CLUES[themeName].filter(([w]) => level > 1 || w.length <= 7);

    const layout = PS.crosswordLayout(rng, bank, want);
    const { words, W, H } = layout;
    // cell map
    const cells = {};   // "r,c" -> { ch, words: [] , el, val }
    words.forEach(wd => {
      for (let i = 0; i < wd.w.length; i++) {
        const r = wd.r + (wd.dir === 'D' ? i : 0), c = wd.c + (wd.dir === 'A' ? i : 0), k = r + ',' + c;
        (cells[k] = cells[k] || { r, c, ch: wd.w[i], words: [], val: '' }).words.push(wd);
      }
    });
    // numbering, in reading order
    const starts = [...new Set(words.map(w => w.r + ',' + w.c))]
      .sort((a, b) => { const [ra, ca] = a.split(',').map(Number), [rb, cb] = b.split(',').map(Number); return ra - rb || ca - cb; });
    words.forEach(w => { w.num = starts.indexOf(w.r + ',' + w.c) + 1; });

    // ---- draw ----
    el.innerHTML = '';
    const wrap = PS.el('div', 'cw-wrap');
    const left = PS.el('div', 'cw-left');
    const banner = PS.el('div', 'cw-banner');
    const board = PS.el('div', 'cw-grid');
    board.style.setProperty('--w', W); board.style.setProperty('--h', H);
    for (let r = 0; r < H; r++) for (let c = 0; c < W; c++) {
      const k = r + ',' + c, cell = cells[k];
      const d = PS.el('div', cell ? 'cw-cell' : 'cw-block');
      if (cell) {
        const n = starts.indexOf(k);
        if (n >= 0) d.appendChild(PS.el('span', 'cw-num', n + 1));
        cell.letter = PS.el('span', 'cw-letter', '');
        d.appendChild(cell.letter);
        cell.el = d;
        d.addEventListener('pointerdown', e => { e.preventDefault(); tapCell(cell); });
      }
      board.appendChild(d);
    }
    left.append(banner, board);
    const clues = PS.el('div', 'cw-clues');
    ['A', 'D'].forEach(dir => {
      const ws = words.filter(w => w.dir === dir).sort((a, b) => a.num - b.num);
      if (!ws.length) return;
      clues.appendChild(PS.el('h3', '', dir === 'A' ? 'Across ➡️' : 'Down ⬇️'));
      ws.forEach(w => {
        w.clueEl = PS.el('div', 'cw-clue', `<b>${w.num}</b> ${w.clue} <span class="cw-len">(${w.w.length})</span>`);
        w.clueEl.addEventListener('pointerdown', e => { e.preventDefault(); select(w, firstEmpty(w)); });
        clues.appendChild(w.clueEl);
      });
    });
    const kb = PS.keyboard(PS.QWERTY, key);
    const right = PS.el('div', 'cw-right');
    right.append(clues, kb);
    wrap.append(left, right);
    el.append(wrap);

    // ---- selecting and typing ----
    let cur = null, pos = 0;
    const cellOf = (w, i) => cells[(w.r + (w.dir === 'D' ? i : 0)) + ',' + (w.c + (w.dir === 'A' ? i : 0))];
    const firstEmpty = w => { for (let i = 0; i < w.w.length; i++) if (!cellOf(w, i).val) return i; return 0; };
    function select(w, i) {
      cur = w; pos = i;
      Object.values(cells).forEach(c => c.el.classList.remove('in-word', 'at'));
      for (let j = 0; j < w.w.length; j++) cellOf(w, j).el.classList.add('in-word');
      cellOf(w, pos).el.classList.add('at');
      words.forEach(x => x.clueEl.classList.toggle('on', x === w));
      banner.innerHTML = `<b>${w.num} ${w.dir === 'A' ? 'across' : 'down'}:</b> ${w.clue} <span class="cw-len">(${w.w.length})</span>`;
    }
    function tapCell(cell) {
      PS.tap();
      let w;
      if (cur && cell.words.includes(cur)) {
        // tapping the square you are on again switches between across and down
        w = cellOf(cur, pos) === cell && cell.words.length > 1 ? cell.words.find(x => x !== cur) : cur;
      } else w = cell.words.find(x => x.dir === 'A' && !x.done) || cell.words.find(x => !x.done) || cell.words[0];
      const i = w.dir === 'A' ? cell.c - w.c : cell.r - w.r;
      select(w, i);
    }
    function key(k) {
      if (!cur) return;
      if (k === 'DEL') {
        const c = cellOf(cur, pos);
        if (c.val && !c.locked) setVal(c, '');
        else if (pos > 0) { pos--; const p = cellOf(cur, pos); if (!p.locked) setVal(p, ''); }
        select(cur, pos); return;
      }
      const c = cellOf(cur, pos);
      if (!c.locked) setVal(c, k);
      checkWords(c);
      if (pos < cur.w.length - 1) pos++;
      select(cur, pos);
    }
    function setVal(c, v) { c.val = v; c.letter.textContent = v; c.el.classList.remove('wrong'); }
    function checkWords(c) {
      c.words.forEach(w => {
        const letters = Array.from({ length: w.w.length }, (_, i) => cellOf(w, i));
        if (letters.some(x => !x.val)) return;
        if (letters.every(x => x.val === x.ch)) {
          if (!w.done) { w.done = true; PS.ding(); w.clueEl.classList.add('done'); }
          letters.forEach(x => { x.locked = true; x.el.classList.add('right'); });
        } else {
          PS.oops();
          letters.forEach(x => { if (!x.locked) { x.el.classList.remove('wrong'); void x.el.offsetWidth; x.el.classList.add('wrong'); } });
          ctx.say('Not quite: one of those letters is wrong.');
        }
      });
      if (words.every(w => w.done)) { kb.remove(); document.removeEventListener('keydown', kb._keyHandler); ctx.solved(); }
      else if (cur && cur.done) {   // jump to the next unfinished word
        const next = words.filter(w => !w.done).sort((a, b) => (a.dir + a.num).localeCompare(b.dir + b.num))[0];
        if (next) setTimeout(() => select(next, firstEmpty(next)), 350);
      }
    }
    select(words.filter(w => w.dir === 'A').sort((a, b) => a.num - b.num)[0] || words[0], 0);
    ctx.onLeave(() => document.removeEventListener('keydown', kb._keyHandler));

    return {
      hint() {
        if (!cur) return false;
        let i = firstEmpty(cur);
        let c = cellOf(cur, i);
        if (c.val === c.ch) { const j = [...Array(cur.w.length).keys()].find(j => cellOf(cur, j).val !== cellOf(cur, j).ch); if (j == null) return false; i = j; c = cellOf(cur, j); }
        setVal(c, c.ch); pos = i;
        checkWords(c); if (!cur.done) select(cur, Math.min(i + 1, cur.w.length - 1));
        return true;
      },
    };
  },
};

// Lay words out crossing each other, best of many tries.
// Returns { words: [{w, clue, r, c, dir}], W, H }.
PS.crosswordLayout = function (rng, bank, want) {
  let best = null;
  for (let attempt = 0; attempt < 150; attempt++) {
    const pool = PS.shuffle(rng, bank).slice(0, want + 4).sort((a, b) => b[0].length - a[0].length + (rng() - 0.5) * 3);
    const grid = new Map();   // "r,c" -> { ch, A: bool, D: bool }
    const placed = [];
    const at = (r, c) => grid.get(r + ',' + c);
    const fits = (w, r, c, dir) => {
      const dr = dir === 'D' ? 1 : 0, dc = dir === 'A' ? 1 : 0;
      if (at(r - dr, c - dc) || at(r + dr * w.length, c + dc * w.length)) return -1;
      let cross = 0;
      for (let i = 0; i < w.length; i++) {
        const rr = r + dr * i, cc = c + dc * i, g = at(rr, cc);
        if (g) {
          if (g.ch !== w[i] || g[dir]) return -1;
          cross++;
        } else if (at(rr + dc, cc + dr) || at(rr - dc, cc - dr)) return -1;   // touching side by side
      }
      return cross;
    };
    const put = (w, clue, r, c, dir) => {
      const dr = dir === 'D' ? 1 : 0, dc = dir === 'A' ? 1 : 0;
      for (let i = 0; i < w.length; i++) {
        const k = (r + dr * i) + ',' + (c + dc * i);
        const g = grid.get(k) || { ch: w[i] }; g[dir] = true; grid.set(k, g);
      }
      placed.push({ w, clue, r, c, dir });
    };
    const [w0, c0] = pool[0];
    put(w0, c0, 0, 0, 'A');
    for (const [w, clue] of pool.slice(1)) {
      if (placed.length >= want) break;
      const opts = [];
      for (const [k, g] of grid) {
        const [gr, gc] = k.split(',').map(Number);
        for (let i = 0; i < w.length; i++) {
          if (w[i] !== g.ch) continue;
          for (const dir of ['A', 'D']) {
            if (g[dir]) continue;
            const r = dir === 'D' ? gr - i : gr, c = dir === 'A' ? gc - i : gc;
            const x = fits(w, r, c, dir);
            if (x > 0) opts.push({ r, c, dir, x });
          }
        }
      }
      if (!opts.length) continue;
      const top = Math.max(...opts.map(o => o.x));
      const o = PS.pick(rng, opts.filter(p => p.x === top));
      put(w, clue, o.r, o.c, o.dir);
    }
    const rs = [...grid.keys()].map(k => +k.split(',')[0]), cs = [...grid.keys()].map(k => +k.split(',')[1]);
    const r0 = Math.min(...rs), c0m = Math.min(...cs);
    const W = Math.max(...cs) - c0m + 1, H = Math.max(...rs) - r0 + 1;
    if (W > 12 || H > 9) continue;
    const score = placed.length * 100 - W * H * 2 - Math.abs(W - H * 1.3) * 4;
    if (!best || score > best.score) best = { score, W, H, words: placed.map(p => ({ ...p, r: p.r - r0, c: p.c - c0m })) };
  }
  // nothing fitted the size limit: try again with fewer words
  return best || (want > 3 ? PS.crosswordLayout(rng, bank, want - 2) : null);
};
