// ---- Make Ten (number bonds to 10) and Ways to Make (every way to split a number) ----
'use strict';
// A ten-frame: two rows of five, `n` filled counters.
PS.tenFrame = function (n, colour) {
  const f = PS.el('div', 'tf-frame');
  for (let i = 0; i < 10; i++) { const c = PS.el('div', 'tf-cell'); if (i < n) { c.classList.add('on'); c.style.background = colour; } f.appendChild(c); }
  return f;
};
PS.PUZZLES.bonds = {
  name: 'Make Ten', icon: '🔟', colour: '#ff8a1f', host: 'harmony',
  intro: 'Which number goes with this one to make ten?',
  render(el, ctx) {
    const { rng, level } = ctx;
    const qs = [], seen = new Set();
    while (qs.length < 5) {
      const n = 1 + Math.floor(rng() * 9), ans = 10 - n;
      if (seen.has(n)) continue; seen.add(n);
      const frame = level === 1 || (level === 2 && qs.length % 2 === 0);
      const blank = level === 3 && rng() < 0.5;          // "? + 6 = 10"
      const say = frame ? `${n} counters. How many more make ten?` : blank ? `What plus ${n} makes ten?` : `${n} plus what makes ten?`;
      const build = st => {
        if (frame) st.append(PS.tenFrame(n, '#ff4d4d'), PS.el('div', 'bk-sign', '+'), PS.el('div', 'bk-q', '?'), PS.el('div', 'bk-sign', '='), PS.el('div', 'bk-num', 10));
        else st.append(...(blank
          ? [PS.el('div', 'bk-q', '?'), PS.el('div', 'bk-sign', '+'), PS.el('div', 'bk-num', n), PS.el('div', 'bk-sign', '='), PS.el('div', 'bk-num', 10)]
          : [PS.el('div', 'bk-num', n), PS.el('div', 'bk-sign', '+'), PS.el('div', 'bk-q', '?'), PS.el('div', 'bk-sign', '='), PS.el('div', 'bk-num', 10)]));
      };
      const wrong = new Set();
      while (wrong.size < (level === 1 ? 2 : 3)) { const w = ans + Math.floor(rng() * 5) - 2; if (w !== ans && w >= 0 && w <= 12) wrong.add(w); }
      qs.push({ say, build, options: PS.shuffle(rng, [ans, ...wrong]).map(v => ({ html: v, correct: v === ans })) });
    }
    return PS.quiz(el, ctx, qs);
  },
};

// Ways to Make: a row of counters. Tap one to split the row there (red | blue). Find every split.
PS.PUZZLES.splits = {
  name: 'Ways to Make', icon: '✂️', colour: '#35c46b', host: 'melody',
  intro: 'Tap the counters to split them in two. Can you find every way to make the number?',
  render(el, ctx) {
    const { rng, level } = ctx;
    const lo = [3, 5, 7][level - 1], hi = [6, 8, 10][level - 1];
    const targets = [];
    while (targets.length < 3) { const t = lo + Math.floor(rng() * (hi - lo + 1)); if (!targets.includes(t)) targets.push(t); }
    targets.sort((a, b) => a - b);
    el.innerHTML = '';
    const wrap = PS.el('div', 'qz-wrap'), dots = PS.el('div', 'sc-dots'), head = PS.el('div', 'sp-head'), row = PS.el('div', 'sp-row'), found = PS.el('div', 'sp-found');
    wrap.append(dots, head, row, found); el.appendChild(wrap);
    let idx = 0, N = 0, got = new Set(), locked = false, need = 0;
    const key = k => Math.min(k, N - k);
    function show() {
      N = targets[idx]; got = new Set(); locked = false; need = Math.floor(N / 2);
      dots.innerHTML = targets.map((_, k) => `<span class="${k < idx ? 'done' : k === idx ? 'now' : ''}"></span>`).join('');
      head.innerHTML = `Make <b>${N}</b> in different ways`;
      row.innerHTML = '';
      for (let i = 0; i < N; i++) { const c = PS.el('button', 'sp-c'); c.addEventListener('pointerdown', e => { e.preventDefault(); split(i + 1); }); row.appendChild(c); }
      paint(0); drawFound();
      ctx.say(`Make ${N} in different ways. Tap a counter to split the row. Find ${need} ways!`);
    }
    function paint(k) { [...row.children].forEach((c, i) => { c.classList.toggle('a', k > 0 && i < k); c.classList.toggle('b', k > 0 && i >= k); }); }
    function drawFound() {
      found.innerHTML = '';
      [...got].sort((a, b) => a - b).forEach(k => {
        const r = PS.el('div', 'sp-line', `<span class="sp-n a">${k}</span>` + '<i class="a"></i>'.repeat(k) + '<i class="b"></i>'.repeat(N - k) + `<span class="sp-n b">${N - k}</span>`);
        found.appendChild(r);
      });
      found.appendChild(PS.el('div', 'sp-more', got.size >= need ? '' : `${need - got.size} more to find`));
    }
    function split(k) {
      if (locked) return;
      if (k >= N) { paint(0); return; }
      paint(k);
      const kk = key(k);
      if (got.has(kk)) { PS.oops(); ctx.say('You found that one already. Try a different split!'); return; }
      got.add(kk); PS.ding(); drawFound();
      ctx.say(`${k} and ${N - k} make ${N}!`);
      if (got.size >= need) {
        locked = true;
        if (idx === targets.length - 1) { dots.innerHTML = targets.map(() => '<span class="done"></span>').join(''); setTimeout(() => ctx.solved(`You found every way to make ${N}!`), 900); }
        else setTimeout(() => { idx++; show(); }, 1300);
      }
    }
    show();
    return {
      hint() {
        if (locked) return false;
        for (let k = 1; k <= need; k++) if (!got.has(k)) {
          [...row.children].forEach(x => x.classList.remove('flash'));
          const c = row.children[k - 1]; void c.offsetWidth; c.classList.add('flash');
          ctx.say(`Try tapping this one. ${k} and ${N - k}!`); return true;
        }
        return false;
      },
    };
  },
};
