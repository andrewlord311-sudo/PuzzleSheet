// ---- Letter Sounds (first letters, missing letters, matching words to pictures) ----
// Level 1: what letter does it start with? Level 2: the missing first or last letter.
// Level 3: pick the right written word, or the missing middle vowel. Read aloud.
'use strict';
PS.PHONICS_WORDS = [
  ['cat', '🐱'], ['dog', '🐶'], ['sun', '☀️'], ['bug', '🐛'], ['bus', '🚌'], ['hat', '🎩'], ['pig', '🐷'], ['hen', '🐔'], ['fox', '🦊'],
  ['bat', '🦇'], ['bed', '🛏️'], ['web', '🕸️'], ['van', '🚐'], ['log', '🪵'], ['nut', '🥜'], ['bag', '👜'], ['lip', '👄'], ['leg', '🦵'],
  ['cap', '🧢'], ['map', '🗺️'], ['egg', '🥚'], ['ant', '🐜'], ['cow', '🐄'], ['car', '🚗'], ['jet', '✈️'], ['key', '🔑'],
];
PS.PUZZLES.phonics = {
  name: 'Letter Sounds', icon: '🔤', colour: '#a05cff', host: 'barnaby',
  intro: 'Look at the picture and listen to the word. Which letter do you hear?',
  render(el, ctx) {
    const { rng, level } = ctx;
    const ALPHA = 'bcdfghjklmnprstw'.split(''), VOW = 'aeiou'.split('');
    const letters = (ans, pool) => { const s = new Set([ans]); while (s.size < 3) s.add(PS.pick(rng, pool)); return PS.shuffle(rng, [...s]); };
    const qs = [], used = new Set();
    while (qs.length < 5) {
      const [w, pic] = PS.pick(rng, PS.PHONICS_WORDS);
      if (used.has(w)) continue; used.add(w);
      const kind = level === 1 ? 'first' : level === 2 ? (rng() < 0.5 ? 'first' : 'last') : (rng() < 0.5 ? 'word' : 'mid');
      const big = PS.el('div', 'ph-pic', pic);
      if (kind === 'first' || kind === 'last' || kind === 'mid') {
        const at = kind === 'first' ? 0 : kind === 'last' ? 2 : 1, ans = w[at];
        const shown = [...w].map((ch, i) => i === at ? '<span class="ph-gap">_</span>' : ch).join(' ');
        const opts = letters(ans, kind === 'mid' ? VOW : ALPHA);
        qs.push({
          say: level === 1 ? `What letter does ${w} start with?` : `Which letter is missing from ${w}?`,
          build: st => { st.append(big, PS.el('div', 'ph-word', shown)); },
          options: opts.map(l => ({ html: `<span class="ph-l">${l}</span>`, correct: l === ans })),
        });
      } else {
        const pool = PS.PHONICS_WORDS.map(x => x[0]).filter(x => x !== w);
        const same = pool.filter(x => x[0] === w[0] || x[2] === w[2]);
        const wrong = PS.shuffle(rng, same.length >= 2 ? same : pool).slice(0, 2);
        qs.push({
          say: `Which word says ${w}?`,
          build: st => st.append(big),
          options: PS.shuffle(rng, [w, ...wrong]).map(x => ({ html: `<span class="ph-w">${x}</span>`, correct: x === w })),
        });
      }
    }
    return PS.quiz(el, ctx, qs);
  },
};
