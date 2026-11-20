// ---- What Comes Next? (finish the pattern) ----
// Level 1: two things taking turns. Level 2: longer patterns (AAB, ABB, ABC).
// Level 3: adds number patterns (counting on, back, in twos, in tens). Five questions. Read aloud.
'use strict';
PS.PUZZLES.next = {
  name: 'What Comes Next?', icon: '🔮', colour: '#a05cff', host: 'melody',
  intro: 'Look at the pattern. What comes next?',
  render(el, ctx) {
    const { rng, level } = ctx;
    const pool = ['🦖', '🚗', '⚽', '🐛', '🧱', '🎹', '🛻', '🐞', '🏏', '🦕', '🏉', '🦋'];
    const shapes = level === 1 ? ['AB', 'AB', 'ABC'] : ['AAB', 'ABB', 'ABC', 'AB'];
    const qs = [];
    while (qs.length < 5) {
      if (level === 3 && qs.length % 2 === 1) {
        const step = PS.pick(rng, [1, 2, 2, 5, 10, -1]), len = 4;
        const start = step === 10 ? 10 : step === -1 ? 8 + Math.floor(rng() * 3) : Math.floor(rng() * 5) + 1;
        const seq = Array.from({ length: len }, (_, k) => start + step * k), ans = start + step * len;
        const wrong = new Set(); while (wrong.size < 2) { const w = ans + (Math.floor(rng() * 5) - 2) * (Math.abs(step) > 1 ? 1 : 1); if (w !== ans && w >= 0) wrong.add(w); }
        qs.push({
          say: `What number comes next? ${seq.join(', ')}, what?`,
          build: st => { const r = PS.el('div', 'nx-row'); seq.forEach(v => r.appendChild(PS.el('div', 'nx-num', v))); r.appendChild(PS.el('div', 'nx-q', '?')); st.appendChild(r); },
          options: PS.shuffle(rng, [ans, ...wrong]).map(v => ({ html: v, correct: v === ans })),
        });
        continue;
      }
      const shape = PS.pick(rng, shapes), picks = PS.shuffle(rng, pool).slice(0, 4);
      const map = { A: picks[0], B: picks[1], C: picks[2] };
      const unit = [...shape], reps = shape.length === 2 ? 3 : 2;
      const full = Array.from({ length: unit.length * reps + 1 }, (_, k) => map[unit[k % unit.length]]);
      const ans = full[full.length - 1], shown = full.slice(0, -1);
      const decoys = [picks[3], ...['A', 'B', 'C'].map(k => map[k]).filter(x => x !== ans && x)];
      const wrongs = [...new Set(decoys)].filter(x => x !== ans).slice(0, 2);
      qs.push({
        say: 'Look at the pattern. What comes next?',
        build: st => { const r = PS.el('div', 'nx-row'); shown.forEach(v => r.appendChild(PS.el('div', 'nx-pic', v))); r.appendChild(PS.el('div', 'nx-q', '?')); st.appendChild(r); },
        options: PS.shuffle(rng, [ans, ...wrongs]).map(v => ({ html: `<span class="nx-opt">${v}</span>`, correct: v === ans })),
      });
    }
    return PS.quiz(el, ctx, qs);
  },
};
