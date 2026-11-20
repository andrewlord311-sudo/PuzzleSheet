// ---- Secret code ----
// A message where every letter is a picture. Use the code key to turn the
// pictures back into letters. Typing a letter fills every box with the same
// picture. Level 1: the full key. Level 2: two letters missing from the key.
// Level 3: four missing, so she works them out from the words.
'use strict';
PS.PUZZLES.code = {
  name: 'Secret Code', icon: '🔐', colour: '#2f8cff', host: 'melody',
  intro: 'Melody sent you a secret message! Use the key to crack the code.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const PICS = ['🐹', '🎵', '⭐', '🌈', '🍓', '🐻', '🐦', '🐰', '🌙', '🎈', '🍪', '🌻', '🦋', '🍩', '🎁', '🐟', '🍎', '🚀', '🎹', '🥕', '❄️', '🐞', '🍦', '🌵', '🦄', '🍄'];
    const msg = PS.pick(rng, PS.MESSAGES);
    const letters = [...new Set(msg.replace(/ /g, ''))];
    const pics = PS.shuffle(rng, PICS);
    const code = {}; letters.forEach((L, i) => { code[L] = pics[i]; });
    // hide some letters from the key: ones that appear more than once, so they can be worked out
    const counts = {}; [...msg].forEach(ch => { if (ch !== ' ') counts[ch] = (counts[ch] || 0) + 1; });
    const hideable = PS.shuffle(rng, letters.filter(L => counts[L] > 1));
    const hidden = new Set(hideable.slice(0, [0, 2, 4][level - 1]));

    el.innerHTML = '';
    const wrap = PS.el('div', 'cd-wrap');
    const keyBox = PS.el('div', 'cd-key');
    keyBox.appendChild(PS.el('div', 'cd-key-title', '🔑 Code key'));
    const keyGrid = PS.el('div', 'cd-key-grid');
    PS.shuffle(rng, letters).sort().forEach(L => {
      keyGrid.appendChild(PS.el('div', 'cd-pair' + (hidden.has(L) ? ' mystery' : ''),
        `<span class="cd-pic">${code[L]}</span><span class="cd-eq">=</span><span class="cd-let">${hidden.has(L) ? '?' : L}</span>`));
    });
    keyBox.appendChild(keyGrid);
    if (hidden.size) keyBox.appendChild(PS.el('div', 'cd-tip', `${hidden.size} letters are missing from the key. Can you work them out from the words?`));

    const msgBox = PS.el('div', 'cd-msg');
    const boxes = [];
    msg.split(' ').forEach(word => {
      const w = PS.el('div', 'cd-word');
      [...word].forEach(L => {
        const b = PS.el('div', 'cd-box', `<span class="cd-pic">${code[L]}</span><span class="cd-slot"></span>`);
        const box = { L, pic: code[L], el: b, slot: b.querySelector('.cd-slot'), val: '' };
        b.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); select(box); });
        boxes.push(box); w.appendChild(b);
      });
      msgBox.appendChild(w);
    });
    wrap.append(msgBox, keyBox);
    const kb = PS.keyboard(PS.QWERTY, key);
    el.append(wrap, kb);
    ctx.onLeave(() => document.removeEventListener('keydown', kb._keyHandler));

    let sel = null;
    function select(box) {
      sel = box;
      boxes.forEach(b => { b.el.classList.toggle('at', b === box); b.el.classList.toggle('same', b.pic === box.pic && b !== box); });
    }
    function setPic(pic, v) {
      boxes.forEach(b => { if (b.pic === pic) { b.val = v; b.slot.textContent = v; b.el.classList.remove('wrong'); } });
    }
    function key(k) {
      if (!sel) return;
      if (k === 'DEL') { setPic(sel.pic, ''); return; }
      setPic(sel.pic, k);
      // move on to the next box with a different picture that is still empty
      const i = boxes.indexOf(sel);
      const next = boxes.slice(i + 1).concat(boxes.slice(0, i)).find(b => !b.val);
      if (next) select(next);
      check();
    }
    function check() {
      if (boxes.some(b => !b.val)) return;
      if (boxes.every(b => b.val === b.L)) {
        boxes.forEach(b => b.el.classList.add('right'));
        kb.remove(); document.removeEventListener('keydown', kb._keyHandler);
        ctx.solved(`The message says: ${msg.charAt(0) + msg.slice(1).toLowerCase()}!`);
      } else {
        PS.oops();
        boxes.forEach(b => { if (b.val !== b.L) b.el.classList.add('wrong'); });
        ctx.say('Nearly! The red boxes need another look.');
      }
    }
    select(boxes[0]);
    return {
      hint() {
        const b = (sel && sel.val !== sel.L) ? sel : boxes.find(x => x.val !== x.L);
        if (!b) return false;
        setPic(b.pic, b.L); boxes.forEach(x => { if (x.pic === b.pic) x.el.classList.add('hinted'); });
        const next = boxes.find(x => !x.val); if (next) select(next);
        check();
        return true;
      },
    };
  },
};
