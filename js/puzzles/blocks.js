// ---- Block Sums (add and take away with towers of blocks) ----
// Level 1: adding up to 5. Level 2: adding up to 10. Level 3: adding, taking away and
// "what is missing?" up to 10. Five questions. Read aloud.
'use strict';
PS.BLOCK_COLOURS = ['#ff4d4d', '#ff9a1f', '#ffd21f', '#35c46b', '#3fb8ff', '#5a5bff', '#a05cff', '#ff5cc0', '#9aa3b2', '#ffffff'];
// A tower of n blocks, two columns of five when it is tall (like a ten-frame).
PS.tower = function (n, label) {
  const cols = Math.ceil(n / 5), t = PS.el('div', 'bk-tower');
  const frame = PS.el('div', 'bk-frame'); frame.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  for (let c = 0; c < cols; c++) {
    const col = PS.el('div', 'bk-col');
    const inCol = Math.min(5, n - c * 5);
    for (let k = 0; k < inCol; k++) { const b = PS.el('div', 'bk-block'); b.style.background = PS.BLOCK_COLOURS[(n - 1) % 10]; col.appendChild(b); }
    frame.appendChild(col);
  }
  t.append(frame, PS.el('div', 'bk-num', label == null ? n : label));
  return t;
};
PS.PUZZLES.blocks = {
  name: 'Block Sums', icon: '🧱', colour: '#35c46b', host: 'harmony',
  intro: 'Look at the towers. Count the blocks and pick the answer!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const top = level === 1 ? 5 : 10, qs = [], seen = new Set();
    while (qs.length < 5) {
      let kind = 'add';
      if (level === 3) kind = PS.pick(rng, ['add', 'sub', 'missing']);
      let a, b, c, answer, say, build;
      if (kind === 'add') {
        c = 2 + Math.floor(rng() * (top - 1)); a = 1 + Math.floor(rng() * (c - 1)); b = c - a; answer = c;
        say = `What is ${a} plus ${b}?`;
        build = st => st.append(PS.tower(a), PS.el('div', 'bk-sign', '+'), PS.tower(b), PS.el('div', 'bk-sign', '='), PS.el('div', 'bk-q', '?'));
      } else if (kind === 'sub') {
        a = 3 + Math.floor(rng() * (top - 2)); b = 1 + Math.floor(rng() * (a - 1)); answer = a - b;
        say = `What is ${a} take away ${b}?`;
        build = st => st.append(PS.tower(a), PS.el('div', 'bk-sign', '−'), PS.tower(b), PS.el('div', 'bk-sign', '='), PS.el('div', 'bk-q', '?'));
      } else {
        c = 3 + Math.floor(rng() * (top - 2)); a = 1 + Math.floor(rng() * (c - 1)); answer = c - a;
        say = `${a} plus what makes ${c}?`;
        build = st => st.append(PS.tower(a), PS.el('div', 'bk-sign', '+'), PS.el('div', 'bk-q', '?'), PS.el('div', 'bk-sign', '='), PS.tower(c));
      }
      const key = say; if (seen.has(key)) continue; seen.add(key);
      const wrong = new Set();
      while (wrong.size < (level === 1 ? 2 : 3)) { const w = answer + Math.floor(rng() * 5) - 2; if (w !== answer && w >= 0 && w <= 10) wrong.add(w); }
      qs.push({ say, build, options: PS.shuffle(rng, [answer, ...wrong]).map(v => ({ html: v, correct: v === answer })) });
    }
    return PS.quiz(el, ctx, qs);
  },
};
