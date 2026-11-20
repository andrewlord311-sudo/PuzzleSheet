// ---- Count Them! (tap each one to count, then pick the number) ----
// Level 1: up to 5, level 2: up to 10, level 3: up to 15. Five questions. Read aloud.
'use strict';
PS.FELIX_THEMES = [
  { name: 'dinosaurs', items: ['🦖', '🦕'] },
  { name: 'cars', items: ['🚗', '🚙', '🏎️', '🚓'] },
  { name: 'monster trucks', items: ['🛻', '🚜', '🚚', '🚒'] },
  { name: 'bugs', items: ['🐛', '🐞', '🐝', '🦋', '🐜'] },
  { name: 'footballs', items: ['⚽'] },
  { name: 'bricks', items: ['🧱'] },
  { name: 'wizard hats', items: ['🧙', '🦉', '🪄'] },
  { name: 'pianos', items: ['🎹', '🎵'] },
];
PS.PUZZLES.count = {
  name: 'Count Them!', icon: '🔢', colour: '#ff8a1f', host: 'barnaby',
  intro: 'Tap each one to count them. Then pick the number!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const max = [5, 10, 15][level - 1], min = [1, 3, 6][level - 1];
    const qs = [];
    const used = new Set();
    while (qs.length < 5) {
      const th = PS.pick(rng, PS.FELIX_THEMES), N = min + Math.floor(rng() * (max - min + 1));
      const key = th.name + N; if (used.has(key)) continue; used.add(key);
      // wrong answers: near the right one
      const wrong = new Set();
      while (wrong.size < (level === 1 ? 2 : 3)) { const w = N + Math.floor(rng() * 5) - 2; if (w !== N && w >= 1) wrong.add(w); }
      const options = PS.shuffle(rng, [N, ...wrong]).map(v => ({ html: v, correct: v === N }));
      qs.push({
        say: `How many ${th.name} can you see? Tap each one to count them!`,
        options,
        build(stage) {
          const field = PS.el('div', 'ct-field'); stage.appendChild(field);
          const slots = PS.shuffle(rng, [...Array(24).keys()]).slice(0, N);
          let counted = 0;
          slots.forEach(s => {
            const col = s % 6, row = Math.floor(s / 6);
            const it = PS.el('button', 'ct-item', PS.pick(rng, th.items));
            it.style.left = ((col + 0.1 + rng() * 0.3) / 6 * 100) + '%'; it.style.top = ((row + 0.05 + rng() * 0.3) / 4 * 100) + '%';
            it.addEventListener('pointerdown', e => {
              e.preventDefault(); if (it.dataset.n) return;
              counted++; it.dataset.n = counted; it.innerHTML += `<b class="ct-n">${counted}</b>`; it.classList.add('counted');
              PS.tone(400 + counted * 40, 0.12, 'sine', 0.12); PS.speak(counted);
            });
            field.appendChild(it);
          });
        },
      });
    }
    return PS.quiz(el, ctx, qs);
  },
};
