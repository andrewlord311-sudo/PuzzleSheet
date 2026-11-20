// ---- Rainbow Trail (join 1, 2, 3… in order with one path that visits every square) ----
// Level 1: 4×4, level 2: 5×5, level 3: 6×6. Drag a finger from 1. Any path that
// visits every square and passes the numbers in order is a right answer.
'use strict';
PS.PUZZLES.zip = {
  name: 'Rainbow Trail', icon: '🌈', colour: '#2f8cff', host: 'dreamy',
  intro: 'Start at 1 and draw one path through the numbers in order. Cover every square!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = ctx.size || [4, 5, 6][level - 1], N = n * n;
    const sol = PS.zipPath(rng, n);
    const marks = PS.zipMarks(rng, N, ctx.marks || [6, 6, 7][level - 1]);
    const num = Array(N).fill(0);                         // number printed on each square (0 = none)
    marks.forEach((idx, k) => { num[sol[idx]] = k + 1; });
    const K = marks.length;

    el.innerHTML = '';
    const wrap = PS.el('div', 'zp-wrap');
    const board = PS.el('div', 'zp-board');
    board.style.setProperty('--n', n);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${n} ${n}`); svg.setAttribute('class', 'zp-line');
    const grid = PS.el('div', 'zp-grid');
    const cells = [];
    for (let i = 0; i < N; i++) {
      const d = PS.el('div', 'zp-cell', num[i] ? `<span class="zp-num">${num[i]}</span>` : '');
      d.dataset.i = i; grid.appendChild(d); cells.push(d);
    }
    board.append(svg, grid);
    const side = PS.el('div', 'zp-side', ctx.adult ? `
      <h3>Rules</h3>
      <p>Start at <b>1</b> and draw one continuous path.</p>
      <p>Pass through the numbers in order.</p>
      <p>Visit <b>every</b> square exactly once.</p>
      <p class="zp-tip">Drag back, or touch an earlier square, to undo.</p>` : `
      <h3>How to play</h3>
      <p>🌈 Start at <b>1</b></p>
      <p>🌈 Drag your finger to the next square</p>
      <p>🌈 Visit the numbers in order</p>
      <p>🌈 Fill <b>every</b> square</p>
      <p class="zp-tip">Went wrong? Drag back, or touch an earlier square to go back there.</p>`);
    wrap.append(board, side);
    el.appendChild(wrap);

    let path = [], dragging = false;
    const adj = (a, b) => Math.abs(Math.floor(a / n) - Math.floor(b / n)) + Math.abs(a % n - b % n) === 1;
    const reached = () => path.filter(i => num[i]).length;
    const hue = k => ctx.adult ? 215 + Math.round(k / Math.max(1, N - 1) * 40) : Math.round(k / Math.max(1, N - 1) * 300);
    function draw() {
      let s = '';
      for (let k = 1; k < path.length; k++) {
        const a = path[k - 1], b = path[k];
        s += `<line x1="${a % n + .5}" y1="${Math.floor(a / n) + .5}" x2="${b % n + .5}" y2="${Math.floor(b / n) + .5}" stroke="hsl(${hue(k)} ${ctx.adult ? 45 : 90}% ${ctx.adult ? 42 : 55}%)" stroke-width=".5" stroke-linecap="round"/>`;
      }
      if (path.length) { const a = path[path.length - 1]; s += `<circle cx="${a % n + .5}" cy="${Math.floor(a / n) + .5}" r=".3" fill="#fff" stroke="hsl(${hue(path.length)} 90% 45%)" stroke-width=".08"/>`; }
      svg.innerHTML = s;
      cells.forEach((c, i) => c.classList.toggle('on', path.includes(i)));
    }
    function step(i) {
      const last = path[path.length - 1];
      if (path.length >= 2 && i === path[path.length - 2]) { path.pop(); return true; }
      if (path.includes(i) || !adj(last, i)) return false;
      if (num[i]) {
        if (num[i] !== reached() + 1) { ctx.say(`Not yet! Find number ${reached() + 1} first.`); return false; }
        if (num[i] === K && path.length !== N - 1) { ctx.say('Save the last number for the very end, after every square is covered.'); return false; }
      }
      path.push(i); PS.tone(500 + path.length * 18, 0.07, 'sine', 0.07);
      return true;
    }
    function finish() {
      draw();
      if (path.length === N && num[path[N - 1]] === K) { dragging = false; ctx.solved('A whole rainbow trail!'); }
    }
    const at = e => { const t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest && t.closest('.zp-cell'); return c ? +c.dataset.i : -1; };
    board.addEventListener('pointerdown', e => {
      e.preventDefault();
      const i = at(e); if (i < 0) return;
      if (!path.length) { if (num[i] === 1) { path = [i]; dragging = true; draw(); } else ctx.say('Begin at the number 1!'); return; }
      const p = path.indexOf(i);
      if (p >= 0) { path.length = p + 1; dragging = true; draw(); }
      else if (adj(path[path.length - 1], i)) { dragging = true; step(i); finish(); }
    });
    board.addEventListener('pointermove', e => {
      if (!dragging) return;
      const i = at(e); if (i < 0) return;
      let last = path[path.length - 1]; if (i === last) return;
      // a quick finger can skip a square along a straight line: walk through it
      const dr = Math.floor(i / n) - Math.floor(last / n), dc = i % n - last % n;
      if ((dr === 0 || dc === 0) && Math.abs(dr + dc) > 1 && Math.abs(dr + dc) <= 3) {
        const sr = Math.sign(dr), sc = Math.sign(dc);
        while (last !== i) { const nx = last + sr * n + sc; if (!step(nx)) break; last = nx; }
      } else step(i);
      finish();
    });
    const up = () => { dragging = false; };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    ctx.onLeave(() => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); });

    return {
      hint() {
        let m = 0; while (m < path.length && path[m] === sol[m]) m++;
        if (m >= N) return false;
        path = sol.slice(0, Math.min(N, Math.max(m, 1) + 3));
        // never run into the last number early: sol obeys the rules, so this is safe
        draw(); ctx.say('Here is a bit of the way. Carry on from the end!');
        if (path.length === N) finish();
        return true;
      },
    };
  },
};

// A path that visits every square of an n×n grid exactly once (random start, prefers squares with few exits).
PS.zipPath = function (rng, n) {
  const N = n * n;
  const nb = i => { const r = Math.floor(i / n), c = i % n, o = []; if (r > 0) o.push(i - n); if (r < n - 1) o.push(i + n); if (c > 0) o.push(i - 1); if (c < n - 1) o.push(i + 1); return o; };
  for (let attempt = 0; attempt < 300; attempt++) {
    const start = Math.floor(rng() * N), seen = Array(N).fill(false), path = [start];
    seen[start] = true;
    let steps = 0;
    const exits = j => nb(j).filter(k => !seen[k]).length;
    const go = () => {
      if (path.length === N) return true;
      if (++steps > 4000) return false;
      const opts = nb(path[path.length - 1]).filter(j => !seen[j]).map(j => [exits(j) + rng() * 1.6, j]).sort((a, b) => a[0] - b[0]);
      for (const [, j] of opts) { seen[j] = true; path.push(j); if (go()) return true; path.pop(); seen[j] = false; }
      return false;
    };
    if (go()) return path;
  }
  const snake = [];
  for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) snake.push(r * n + (r % 2 ? n - 1 - c : c));
  return snake;
};
// Which steps along the path get a number: the first, the last and k-2 spread between.
PS.zipMarks = function (rng, N, k) {
  const m = [];
  for (let i = 0; i < k; i++) {
    let idx = Math.round(i * (N - 1) / (k - 1));
    if (i > 0 && i < k - 1) idx += Math.floor(rng() * 3) - 1;
    m.push(idx);
  }
  for (let i = 1; i < k; i++) if (m[i] <= m[i - 1]) m[i] = m[i - 1] + 1;
  return m;
};
