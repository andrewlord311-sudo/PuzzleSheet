// ---- Jigsaw (drag a piece onto another to swap them; rebuild the picture) ----
// Level 1: 4 pieces, level 2: 6, level 3: 9. The finished picture is shown as a guide.
'use strict';
PS.JIGSAW_THEMES = [
  { name: 'dinosaurs', sky: '#8fd3ff', ground: '#7ccf55', items: ['🦖', '🦕', '🌴', '🌋', '🥚', '🌿'] },
  { name: 'cars', sky: '#a8d8ff', ground: '#8a94a6', items: ['🚒', '🚕', '🚜', '🚙', '🚓', '🛻'] },
  { name: 'bugs', sky: '#c5ecff', ground: '#6cc24a', items: ['🐞', '🐝', '🦋', '🐛', '🌻', '🍄'] },
  { name: 'football', sky: '#9fe0ff', ground: '#3fae4a', items: ['⚽', '🥅', '🏆', '👟', '🧤', '🏟️'] },
  { name: 'music', sky: '#e3d4ff', ground: '#ffb0d6', items: ['🎹', '🎵', '🎶', '🥁', '🎺', '🎻'] },
];
// A picture as SVG markup in a 360×240 space, so every piece can show its own window onto it.
PS.jigsawScene = function (rng, th) {
  let s = `<rect width="360" height="240" fill="${th.sky}"/><rect y="150" width="360" height="90" fill="${th.ground}"/>`;
  const cols = ['#ff4d4d', '#ffd21f', '#3fb8ff', '#a05cff', '#ff9a1f', '#ff5cc0', '#35c46b'];
  for (let i = 0; i < 14; i++) s += `<circle cx="${Math.round(rng() * 360)}" cy="${Math.round(rng() * 240)}" r="${6 + Math.round(rng() * 12)}" fill="${PS.pick(rng, cols)}" opacity=".55"/>`;
  const spots = PS.shuffle(rng, [[60, 70], [180, 60], [300, 70], [60, 170], [180, 175], [300, 170]]);
  th.items.forEach((e, i) => { const [x, y] = spots[i]; s += `<text x="${x + Math.round(rng() * 16 - 8)}" y="${y}" font-size="84" text-anchor="middle" dominant-baseline="central">${e}</text>`; });
  return s;
};
PS.PUZZLES.jigsaw = {
  name: 'Jigsaw', icon: '🧩', colour: '#2f8cff', host: 'dreamy',
  intro: 'The pieces are all mixed up! Drag a piece onto another to swap them and make the picture.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const [cols, rows] = [[2, 2], [3, 2], [3, 3]][level - 1], n = cols * rows, W = 360, H = 240, pw = W / cols, ph = H / rows;
    const th = PS.pick(rng, PS.JIGSAW_THEMES), scene = PS.jigsawScene(rng, th);
    const svgFor = (vb) => `<svg viewBox="${vb}" preserveAspectRatio="none" class="jg-svg">${scene}</svg>`;
    let order = [...Array(n).keys()];
    for (let t = 0; t < 60; t++) { order = PS.shuffle(rng, order); if (order.filter((p, i) => p === i).length <= Math.floor(n / 3)) break; }

    el.innerHTML = '';
    const wrap = PS.el('div', 'jg-wrap');
    const board = PS.el('div', 'jg-board'); board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`; board.style.setProperty('--ar', `${W} / ${H}`);
    const guide = PS.el('div', 'jg-guide', `<small>The picture</small>${svgFor(`0 0 ${W} ${H}`)}`);
    wrap.append(board, guide); el.appendChild(wrap);
    let sel = -1, drag = null, done = false;
    function draw() {
      board.innerHTML = '';
      order.forEach((p, s) => {
        const c = PS.el('div', 'jg-slot' + (p === s ? ' ok' : '') + (s === sel ? ' sel' : ''), svgFor(`${(p % cols) * pw} ${Math.floor(p / cols) * ph} ${pw} ${ph}`));
        c.dataset.s = s; c.style.aspectRatio = `${pw} / ${ph}`;
        c.addEventListener('pointerdown', e => { if (done) return; e.preventDefault(); drag = { s, x: e.clientX, y: e.clientY, moved: false, el: c }; c.classList.add('lift'); });
        board.appendChild(c);
      });
    }
    function swap(a, b) {
      if (a === b) return;
      [order[a], order[b]] = [order[b], order[a]]; sel = -1; PS.tap(); draw();
      if (order.every((p, i) => p === i)) { done = true; board.classList.add('whole'); PS.speak(`You made the ${th.name} picture!`); setTimeout(() => ctx.solved(`You made the ${th.name} picture!`), 900); }
    }
    const move = e => {
      if (!drag) return;
      const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
      if (Math.hypot(dx, dy) > 8) drag.moved = true;
      if (drag.moved) drag.el.style.transform = `translate(${dx}px, ${dy}px) scale(1.06)`;
    };
    const up = e => {
      if (!drag) return; const d = drag; drag = null;
      d.el.style.transform = ''; d.el.classList.remove('lift');
      if (d.moved && e.type === 'pointerup') {
        d.el.style.pointerEvents = 'none';
        const t = document.elementFromPoint(e.clientX, e.clientY), slot = t && t.closest && t.closest('.jg-slot');
        d.el.style.pointerEvents = '';
        if (slot) swap(d.s, +slot.dataset.s); else draw();
      } else if (!d.moved) { if (sel < 0) { sel = d.s; draw(); } else if (sel === d.s) { sel = -1; draw(); } else swap(sel, d.s); }
    };
    window.addEventListener('pointermove', move); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
    ctx.onLeave(() => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); });
    draw();
    return {
      hint() {
        if (done) return false;
        const s = order.findIndex((p, i) => p !== i); if (s < 0) return false;
        const from = order.indexOf(s);
        ctx.say('I put one piece in the right place!'); swap(s, from);
        return true;
      },
    };
  },
};
