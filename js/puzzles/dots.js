// ---- Dot to Dot (tap the numbers in order and a picture appears) ----
// Level 1: about 13 dots, level 2: about 17, level 3: about 21 (extra dots are added along the longest edges).
'use strict';
(function () {
  const star = n => Array.from({ length: n }, (_, k) => { const a = -Math.PI / 2 + k * Math.PI / (n / 2), r = k % 2 ? 22 : 46; return [50 + r * Math.cos(a), 52 + r * Math.sin(a)]; });
  const heart = n => Array.from({ length: n }, (_, k) => { const t = k / n * 2 * Math.PI; return [50 + 3.1 * 16 * Math.pow(Math.sin(t), 3) / 1.1, 46 - 2.5 * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t))]; });
  PS.DOT_PICTURES = [
    { name: 'a crown', fill: '#ffd21f', icon: '👑', pts: [[12, 80], [12, 34], [32, 56], [50, 20], [68, 56], [88, 34], [88, 80]] },
    { name: 'a house', fill: '#ff9a1f', icon: '🏠', pts: [[20, 90], [20, 50], [50, 20], [80, 50], [80, 90], [60, 90], [60, 65], [40, 65], [40, 90]] },
    { name: 'a star', fill: '#ffd21f', icon: '⭐', pts: star(10) },
    { name: 'a rocket', fill: '#ff5c5c', icon: '🚀', pts: [[50, 6], [66, 30], [66, 60], [86, 86], [66, 82], [62, 96], [38, 96], [34, 82], [14, 86], [34, 60], [34, 30]] },
    { name: 'a fish', fill: '#3fb8ff', icon: '🐟', pts: [[8, 50], [28, 30], [52, 24], [74, 34], [92, 20], [86, 50], [92, 80], [74, 66], [52, 76], [28, 70]] },
    { name: 'a car', fill: '#ff4d4d', icon: '🚗', pts: [[8, 70], [8, 50], [26, 46], [38, 24], [66, 24], [80, 46], [94, 52], [94, 70], [74, 70], [66, 86], [34, 86], [26, 70]] },
    { name: 'a heart', fill: '#ff5cc0', icon: '💖', pts: [[50, 30], [36, 16], [18, 16], [6, 34], [10, 56], [30, 78], [50, 94], [70, 78], [90, 56], [94, 34], [82, 16], [64, 16]] },
    { name: 'a big star', fill: '#a05cff', icon: '🌟', pts: star(16) },
    { name: 'a lightning bolt', fill: '#ffd21f', icon: '⚡', pts: [[60, 6], [30, 50], [48, 50], [36, 94], [76, 40], [56, 40]] },
  ];
})();
PS.PUZZLES.dots = {
  name: 'Dot to Dot', icon: '✏️', colour: '#ff5cc0', host: 'melody',
  intro: 'Tap the dots in order, 1, 2, 3… and see what picture appears!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const maxDots = [9, 12, 16][level - 1];
    const pic = PS.pick(rng, PS.DOT_PICTURES.filter(p => p.pts.length <= maxDots && p.pts.length >= maxDots - 5));
    const pts = pic.pts.map(q => q.slice());
    while (pts.length < pic.pts.length + [4, 5, 5][level - 1]) {   // split the longest edge
      let bi = 0, bl = -1;
      pts.forEach((q, i) => { const o = pts[(i + 1) % pts.length], l = Math.hypot(q[0] - o[0], q[1] - o[1]); if (l > bl) { bl = l; bi = i; } });
      const q = pts[bi], o = pts[(bi + 1) % pts.length];
      pts.splice(bi + 1, 0, [(q[0] + o[0]) / 2, (q[1] + o[1]) / 2]);
    }
    el.innerHTML = '';
    const wrap = PS.el('div', 'dt-wrap');
    const board = PS.el('div', 'dt-board');
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 100 100'); svg.setAttribute('class', 'dt-svg');
    board.appendChild(svg);
    const dots = pts.map((p, i) => {
      const d = PS.el('button', 'dt-dot', `<span>${i + 1}</span>`);
      d.style.left = p[0] + '%'; d.style.top = p[1] + '%';
      d.addEventListener('pointerdown', e => { e.preventDefault(); tap(i); });
      board.appendChild(d); return d;
    });
    wrap.appendChild(board); el.appendChild(wrap);
    let next = 0;
    const speakNum = () => PS.speak(next + 1);
    function draw(done) {
      let s = '';
      if (done) s += `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${pic.fill}" fill-opacity=".85" stroke="#2b2250" stroke-width="1.6" stroke-linejoin="round"/>`;
      else for (let k = 1; k < next; k++) s += `<line x1="${pts[k - 1][0]}" y1="${pts[k - 1][1]}" x2="${pts[k][0]}" y2="${pts[k][1]}" stroke="#2b2250" stroke-width="1.6" stroke-linecap="round"/>`;
      svg.innerHTML = s;
      dots.forEach((d, i) => { d.classList.toggle('done', i < next); d.classList.toggle('next', i === next && !done); });
    }
    function tap(i) {
      if (i === next) {
        next++; PS.tone(440 + next * 45, 0.12, 'sine', 0.13);
        if (next === pts.length) { draw(true); dots.forEach(d => d.classList.add('fin')); PS.speak(`It is ${pic.name}!`); setTimeout(() => ctx.solved(`It is ${pic.name}!`), 900); }
        else { draw(); speakNum(); }
      } else if (i > next) { PS.oops(); ctx.say(`Not yet! Find number ${next + 1} first.`); }
    }
    draw(); dots[0].classList.add('next');
    return { hint() { if (next >= pts.length) return false; dots[next].classList.remove('flash'); void dots[next].offsetWidth; dots[next].classList.add('flash'); ctx.say(`Look for number ${next + 1}!`); return true; } };
  },
};
