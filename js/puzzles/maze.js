// ---- Maze (help the digger, truck or dinosaur get to the end) ----
// Drag a finger from the start to the finish. Level 1: 4×4, level 2: 5×5, level 3: 7×7.
'use strict';
// A maze with exactly one way through (depth-first carving). walls[i] = {n,e,s,w}: true when closed.
PS.mazeMake = function (rng, n) {
  const cells = Array.from({ length: n * n }, () => ({ n: true, e: true, s: true, w: true }));
  const seen = Array(n * n).fill(false), stack = [0]; seen[0] = true;
  const dirs = [['n', -n, 's', 0, -1], ['s', n, 'n', 0, 1], ['w', -1, 'e', -1, 0], ['e', 1, 'w', 1, 0]];
  while (stack.length) {
    const i = stack[stack.length - 1], r = Math.floor(i / n), c = i % n;
    const opts = dirs.filter(([, d, , dc, dr]) => { const rr = r + dr, cc = c + dc; return rr >= 0 && rr < n && cc >= 0 && cc < n && !seen[i + d]; });
    if (!opts.length) { stack.pop(); continue; }
    const [a, d, b] = PS.pick(rng, opts);
    cells[i][a] = false; cells[i + d][b] = false; seen[i + d] = true; stack.push(i + d);
  }
  return cells;
};
PS.mazePath = function (cells, n) {
  const prev = Array(n * n).fill(-1); prev[0] = 0; const q = [0];
  while (q.length) {
    const i = q.shift(); if (i === n * n - 1) break;
    for (const [a, d] of [['n', -n], ['s', n], ['w', -1], ['e', 1]]) if (!cells[i][a] && prev[i + d] < 0) { prev[i + d] = i; q.push(i + d); }
  }
  const path = []; for (let i = n * n - 1; ; i = prev[i]) { path.unshift(i); if (i === 0) break; }
  return path;
};
PS.PUZZLES.maze = {
  name: 'Maze', icon: '🌀', colour: '#14b8a6', host: 'evie',
  intro: 'Drag your finger along the path from the start to the finish!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const n = [4, 5, 7][level - 1];
    const cells = PS.mazeMake(rng, n);
    const solution = PS.mazePath(cells, n);
    const HERO = PS.pick(rng, [['🛻', '🏁'], ['🦖', '🥚'], ['🚗', '🏁'], ['🐛', '🍃'], ['⚽', '🥅'], ['🚜', '🌾']]);

    el.innerHTML = '';
    const wrap = PS.el('div', 'mz-wrap');
    const board = PS.el('div', 'mz-board'); board.style.setProperty('--n', n);
    const grid = PS.el('div', 'mz-grid');
    const els = cells.map((w, i) => {
      const d = PS.el('div', 'mz-cell' + (w.n ? ' wn' : '') + (w.e ? ' we' : '') + (w.s ? ' ws' : '') + (w.w ? ' ww' : ''));
      d.dataset.i = i; grid.appendChild(d); return d;
    });
    els[0].textContent = HERO[0]; els[n * n - 1].textContent = HERO[1];
    els[0].classList.add('start'); els[n * n - 1].classList.add('goal');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${n} ${n}`); svg.setAttribute('class', 'zp-line');
    board.append(svg, grid); wrap.appendChild(board); el.appendChild(wrap);

    let path = [0], dragging = false, finished = false;
    const open = (a, b) => { const d = b - a; return (d === 1 && !cells[a].e) || (d === -1 && !cells[a].w) || (d === n && !cells[a].s) || (d === -n && !cells[a].n); };
    function draw() {
      let s = '';
      for (let k = 1; k < path.length; k++) { const a = path[k - 1], b = path[k]; s += `<line x1="${a % n + .5}" y1="${Math.floor(a / n) + .5}" x2="${b % n + .5}" y2="${Math.floor(b / n) + .5}" stroke="#ff4fa3" stroke-width=".38" stroke-linecap="round"/>`; }
      const l = path[path.length - 1]; s += `<circle cx="${l % n + .5}" cy="${Math.floor(l / n) + .5}" r=".26" fill="#ffd21f" stroke="#2b2250" stroke-width=".07"/>`;
      svg.innerHTML = s;
    }
    function step(i) {
      const last = path[path.length - 1];
      if (i === last) return;
      if (path.length > 1 && i === path[path.length - 2]) { path.pop(); return; }
      if (!path.includes(i) && open(last, i)) { path.push(i); PS.tone(380 + path.length * 14, 0.06, 'sine', 0.06); }
    }
    const at = e => { const t = document.elementFromPoint(e.clientX, e.clientY), c = t && t.closest && t.closest('.mz-cell'); return c ? +c.dataset.i : -1; };
    board.addEventListener('pointerdown', e => { e.preventDefault(); const i = at(e); if (i < 0 || finished) return; const p = path.indexOf(i); if (p >= 0) { path.length = p + 1; dragging = true; draw(); } else { dragging = true; step(i); draw(); } });
    board.addEventListener('pointermove', e => {
      if (!dragging || finished) return; const i = at(e); if (i < 0) return;
      step(i); draw();
      if (path[path.length - 1] === n * n - 1) { finished = true; dragging = false; ctx.solved('You found the way!'); }
    });
    const up = () => { dragging = false; };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    ctx.onLeave(() => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); });
    draw();
    return {
      hint() {
        if (finished) return false;
        let m = 0; while (m < path.length && path[m] === solution[m]) m++;
        path = solution.slice(0, Math.min(solution.length, m + 3)); draw();
        if (path[path.length - 1] === n * n - 1) { finished = true; ctx.solved('You found the way!'); }
        else ctx.say('Here is a bit of the way. Keep going!');
        return true;
      },
    };
  },
};
