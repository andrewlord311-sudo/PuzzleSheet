// ---- Word Scramble (the letters are jumbled: put them in order) ----
// One word at a time, each with a written clue from the crossword banks.
// Level 1: 4 short words, level 2: 5 words, level 3: 6 longer words.
'use strict';
PS.PUZZLES.scramble = {
  name: 'Word Scramble', icon: '🔀', colour: '#8f5cff', host: 'barnaby',
  intro: 'The letters got jumbled! Read the clue and tap them in the right order.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const want = [4, 5, 6][level - 1], [lo, hi] = [[3, 5], [4, 7], [5, 9]][level - 1];
    const FAV = ['Guinea pigs', 'Music', 'Christmas', 'Wizard school', 'On stage', 'Pop star', 'Chocolate', 'Drawing and colouring'];
    // words from several themes (mostly her favourites), each a fair length
    const pool = [];
    PS.shuffle(rng, rng() < 0.8 ? FAV : Object.keys(PS.CLUES)).slice(0, 4).forEach(t => PS.CLUES[t].forEach(([w, clue]) => { if (w.length >= lo && w.length <= hi && !/[^A-Z]/.test(w)) pool.push({ w, clue }); }));
    const seen = new Set(), words = [];
    for (const x of PS.shuffle(rng, pool)) { if (!seen.has(x.w) && words.length < want) { seen.add(x.w); words.push(x); } }

    el.innerHTML = '';
    const wrap = PS.el('div', 'sc-wrap');
    const dots = PS.el('div', 'sc-dots');
    const clue = PS.el('div', 'sc-clue');
    const slotsEl = PS.el('div', 'sc-slots');
    const tilesEl = PS.el('div', 'sc-tiles');
    const clear = PS.el('button', 'sc-clear', '↺ Start this word again');
    wrap.append(dots, clue, slotsEl, tilesEl, clear);
    el.appendChild(wrap);

    let idx = 0, slots = [], tiles = [], locked = false;
    function show() {
      const { w, clue: cl } = words[idx];
      dots.innerHTML = words.map((_, i) => `<span class="${i < idx ? 'done' : i === idx ? 'now' : ''}"></span>`).join('');
      clue.innerHTML = `<small>Word ${idx + 1} of ${words.length}</small>${cl} <span class="cw-len">(${w.length} letters)</span>`;
      let letters;
      for (let tries = 0; tries < 20; tries++) { letters = PS.shuffle(rng, [...w]); if (letters.join('') !== w) break; }
      slots = [...w].map(() => ({ ch: '', from: -1 }));
      tiles = letters.map((ch, i) => ({ ch, used: false, i }));
      locked = false; draw();
    }
    function draw(state) {
      slotsEl.innerHTML = ''; tilesEl.innerHTML = '';
      slots.forEach((s, i) => {
        const b = PS.el('button', 'sc-slot' + (s.ch ? ' full' : '') + (state ? ' ' + state : ''), s.ch);
        b.addEventListener('pointerdown', e => { e.preventDefault(); if (locked || !s.ch) return; PS.tap(); tiles[s.from].used = false; s.ch = ''; s.from = -1; draw(); });
        slotsEl.appendChild(b);
      });
      tiles.forEach(t => {
        const b = PS.el('button', 'sc-tile' + (t.used ? ' used' : ''), t.ch);
        b.addEventListener('pointerdown', e => { e.preventDefault(); if (locked || t.used) return; place(t); });
        tilesEl.appendChild(b);
      });
    }
    function place(t) {
      const s = slots.find(x => !x.ch); if (!s) return;
      PS.tap(); s.ch = t.ch; s.from = t.i; t.used = true; draw();
      if (slots.every(x => x.ch)) setTimeout(check, 200);
    }
    function check() {
      const w = words[idx].w;
      if (slots.map(x => x.ch).join('') === w) {
        locked = true; PS.ding(); draw('right');
        if (idx === words.length - 1) { dots.innerHTML = words.map(() => '<span class="done"></span>').join(''); setTimeout(() => ctx.solved('Every word unscrambled!'), 700); }
        else setTimeout(() => { idx++; show(); }, 850);
      } else {
        PS.oops(); ctx.say('Not quite. Look at the clue again!');
        slotsEl.classList.remove('wrong'); void slotsEl.offsetWidth; slotsEl.classList.add('wrong');
        setTimeout(() => { slots.forEach(s => { s.ch = ''; s.from = -1; }); tiles.forEach(t => { t.used = false; }); draw(); }, 450);
      }
    }
    clear.addEventListener('pointerdown', e => { e.preventDefault(); if (locked) return; PS.tap(); slots.forEach(s => { s.ch = ''; s.from = -1; }); tiles.forEach(t => { t.used = false; }); draw(); });
    show();

    return {
      hint() {
        if (locked) return false;
        const w = words[idx].w;
        let i = slots.findIndex((s, k) => s.ch !== w[k]);
        if (i < 0) return false;
        for (let k = i; k < slots.length; k++) if (slots[k].ch) { tiles[slots[k].from].used = false; slots[k].ch = ''; slots[k].from = -1; }
        const t = tiles.find(x => !x.used && x.ch === w[i]);
        if (!t) return false;
        place(t); ctx.say(`The next letter is ${w[i]}.`);
        return true;
      },
    };
  },
};
