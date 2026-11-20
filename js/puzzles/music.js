// ---- Music: note words ----
// The missing word in each sentence is spelt in notes on the treble stave
// (note names are letters, so BAG, CAGE, FACE...). Tap a note to hear it.
// Level 1: notes inside the stave, Melody's note helper open.
// Level 2: Middle C and the low D below the stave join in, helper closed.
// Level 3: high G above the stave too, and five sentences.
'use strict';
PS.PUZZLES.music = {
  name: 'Note Words', icon: '🎼', colour: '#ffb000', host: 'melody',
  intro: 'The missing words are written in music! Read the notes to spell them.',
  render(el, ctx) {
    const { rng, level } = ctx;
    // steps up from E4 (bottom line = 0)
    const PLACES = level === 1
      ? { C: [5], D: [6], E: [0, 7], F: [1, 8], G: [2], A: [3], B: [4] }
      : level === 2
        ? { C: [-2, 5], D: [-1, 6], E: [0, 7], F: [1, 8], G: [2], A: [3], B: [4] }
        : { C: [-2, 5], D: [-1, 6], E: [0, 7], F: [1, 8], G: [2, 9], A: [3], B: [4] };
    const n = [3, 4, 5][level - 1];
    const items = PS.shuffle(rng, PS.NOTE_SENTENCES).slice(0, n).map(([s, w]) => ({
      s, w, steps: [...w].map(L => PS.pick(rng, PLACES[L])),
    }));

    el.innerHTML = '';
    const wrap = PS.el('div', 'mu-wrap');
    const helpBtn = PS.el('button', 'mu-help-btn', '🐦 Melody’s note helper');
    const helper = PS.el('div', 'mu-helper');
    helper.innerHTML = PS.staveHelper(level);
    helper.hidden = level > 1;
    helpBtn.onclick = () => { helper.hidden = !helper.hidden; PS.tap(); };
    wrap.append(helpBtn, helper);

    const boxes = [];
    const progress = PS.el('div', 'mu-progress');
    wrap.appendChild(progress);
    items.forEach(it => {
      const row = PS.el('div', 'mu-item');
      row.hidden = true;
      it.row = row;
      const [before, after] = it.s.includes('___') ? it.s.split('___') : [it.s + ' ', ''];
      row.appendChild(PS.el('div', 'mu-sentence', `${before}<span class="mu-blank">${'_ '.repeat(it.w.length).trim()}</span>${after}${after ? '' : '.'}`));
      it.blank = row.querySelector('.mu-blank');
      const stave = PS.el('div', 'mu-stave');
      stave.appendChild(PS.el('div', 'mu-col mu-clef-col', PS.staveSvg(null, true)));
      it.boxes = [];
      it.steps.forEach((st, i) => {
        const col = PS.el('div', 'mu-col');
        const noteSvg = PS.el('div', 'mu-note', PS.staveSvg(st, false));
        noteSvg.addEventListener('pointerdown', e => { e.preventDefault(); PS.playStep(st); noteSvg.classList.remove('boing'); void noteSvg.offsetWidth; noteSvg.classList.add('boing'); });
        const b = PS.el('div', 'mu-box', '');
        const box = { it, i, L: it.w[i], el: b, val: '' };
        b.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); select(box); });
        col.append(noteSvg, b);
        stave.appendChild(col);
        boxes.push(box); it.boxes.push(box);
      });
      stave.appendChild(PS.el('div', 'mu-col mu-end-col', PS.staveSvg(null, false, true)));
      row.appendChild(stave);
      row.appendChild(PS.el('div', 'mu-tap-tip', '👆 Tap a note to hear it'));
      wrap.appendChild(row);
    });
    const kb = PS.keyboard(['ABCDEFG'], key);
    el.append(wrap, kb);
    ctx.onLeave(() => document.removeEventListener('keydown', kb._keyHandler));

    // one sentence at a time
    let cur = 0, sel = null;
    function showItem(i) {
      cur = i;
      items.forEach((it, j) => { it.row.hidden = j !== i; });
      progress.innerHTML = items.map((it, j) => `<span class="${it.done ? 'done' : j === i ? 'now' : ''}">${it.done ? '✓' : j + 1}</span>`).join('');
      select(items[i].boxes.find(b => !b.val) || items[i].boxes[0]);
    }
    function select(box) { sel = box; boxes.forEach(b => b.el.classList.toggle('at', b === box)); }
    function key(k) {
      if (!sel || sel.it.done) return;
      const it = sel.it;
      if (k === 'DEL') {
        if (!sel.val && sel.i > 0) select(it.boxes[sel.i - 1]);
        sel.val = ''; sel.el.textContent = '';
        return;
      }
      sel.val = k; sel.el.textContent = k; sel.el.classList.remove('wrong');
      if (it.boxes.every(b => b.val)) { checkWord(it); return; }
      const next = it.boxes.slice(sel.i + 1).find(b => !b.val) || it.boxes.find(b => !b.val);
      if (next) select(next);
    }
    function checkWord(it) {
      if (it.boxes.every(b => b.val === b.L)) {
        it.done = true;
        it.boxes.forEach(b => b.el.classList.add('right'));
        it.blank.textContent = it.w.toLowerCase(); it.blank.classList.add('filled');
        it.steps.forEach((st, i) => PS.playStep(st, i * 0.28));   // play the word as a little tune
        const wait = it.w.length * 280 + 500;
        if (items.every(x => x.done)) {
          kb.remove(); document.removeEventListener('keydown', kb._keyHandler);
          setTimeout(() => ctx.solved(), wait);
        } else {
          ctx.say(PS.pick(Math.random, ['Lovely reading!', 'That’s it!', 'Beautiful!', 'You read music!']));
          setTimeout(() => showItem(items.findIndex(x => !x.done)), wait + 300);
        }
      } else {
        PS.oops();
        it.boxes.forEach(b => { if (b.val !== b.L) { b.el.classList.remove('wrong'); void b.el.offsetWidth; b.el.classList.add('wrong'); } });
        select(it.boxes.find(b => b.val !== b.L));
        ctx.say('Check those notes again. Is the note on a line or in a space?');
      }
    }
    showItem(0);
    return {
      hint() {
        const it = items[cur]; if (it.done) return false;
        const b = it.boxes.find(x => x.val !== x.L);
        if (!b) return false;
        select(b); b.el.classList.add('hinted');
        key(b.L);
        return true;
      },
    };
  },
};

// ---- drawing the stave ----
// One SVG column per note, so the five lines run on unbroken from column to column.
PS.STAVE = { gap: 14, top: 34, h: 128 };
PS.stepY = st => PS.STAVE.top + 4 * PS.STAVE.gap - st * (PS.STAVE.gap / 2);
PS.staveSvg = function (step, clef, end) {
  const { gap, top, h } = PS.STAVE, w = clef ? 62 : end ? 14 : 56;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">`;
  for (let i = 0; i < 5; i++) s += `<line x1="0" x2="${end ? 4 : w}" y1="${top + i * gap}" y2="${top + i * gap}" stroke="#2b2250" stroke-width="2"/>`;
  if (end) s += `<line x1="3" x2="3" y1="${top}" y2="${top + 4 * gap}" stroke="#2b2250" stroke-width="3"/>`;
  if (clef) s += `<text x="4" y="${top + 3 * gap + 2}" font-family="Noto Music" font-size="${gap * 5.6}" fill="#2b2250">𝄞</text>`;
  if (step != null) {
    const x = w / 2, y = PS.stepY(step);
    // ledger lines below or above the stave
    for (let L = -2; L >= step; L -= 2) s += `<line x1="${x - 15}" x2="${x + 15}" y1="${PS.stepY(L)}" y2="${PS.stepY(L)}" stroke="#2b2250" stroke-width="2"/>`;
    for (let L = 10; L <= step; L += 2) s += `<line x1="${x - 15}" x2="${x + 15}" y1="${PS.stepY(L)}" y2="${PS.stepY(L)}" stroke="#2b2250" stroke-width="2"/>`;
    const up = step < 4;
    s += up ? `<line x1="${x + 8.5}" x2="${x + 8.5}" y1="${y - 1}" y2="${y - 3.4 * gap}" stroke="#2b2250" stroke-width="2.4"/>`
            : `<line x1="${x - 8.5}" x2="${x - 8.5}" y1="${y + 1}" y2="${y + 3.4 * gap}" stroke="#2b2250" stroke-width="2.4"/>`;
    s += `<ellipse cx="${x}" cy="${y}" rx="9.5" ry="6.8" transform="rotate(-20 ${x} ${y})" fill="#2b2250"/>`;
    s += `<rect x="0" y="0" width="${w}" height="${h}" fill="transparent"/>`;
  }
  return s + '</svg>';
};
PS.LETTERS_FROM_E = 'EFGABCD';
PS.stepLetter = st => PS.LETTERS_FROM_E[((st % 7) + 7) % 7];
PS.playStep = function (st, when = 0) {
  // E4 is MIDI 64; white-key steps
  const semis = [0, 1, 3, 5, 7, 8, 10];   // E F G A B C D, from E
  const oct = Math.floor(st / 7), midi = 64 + oct * 12 + semis[((st % 7) + 7) % 7];
  PS.tone(440 * Math.pow(2, (midi - 69) / 12), 0.55, 'triangle', 0.2, when);
};
PS.staveHelper = function (level) {
  const steps = level === 1 ? [0, 1, 2, 3, 4, 5, 6, 7, 8] : level === 2 ? [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8] : [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return `<div class="mu-helper-row">${PS.staveSvg(null, true).replace('<svg', '<svg class="mu-h-clef"')}${steps.map(st =>
    `<div class="mu-h-col">${PS.staveSvg(st, false)}<b>${PS.stepLetter(st)}</b></div>`).join('')}</div>
    <div class="mu-h-tip">Spaces spell <b>F A C E</b> from the bottom. Lines are <b>E G B D F</b>: Every Good Bear Deserves Fruit!</div>`;
};
