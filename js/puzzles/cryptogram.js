// ---- Cryptogram (grown-ups' edition) ----
// A famous saying has had every letter swapped for another. Work out the swap. Level 1: a short
// saying with 3 letters given, level 2: medium with 1 given, level 3: a longer one, no help.
'use strict';
PS.QUOTES = [
  ['A STITCH IN TIME SAVES NINE', 'Proverb'], ['ACTIONS SPEAK LOUDER THAN WORDS', 'Proverb'], ['BETTER LATE THAN NEVER', 'Proverb'],
  ['MANY HANDS MAKE LIGHT WORK', 'Proverb'], ['THE EARLY BIRD CATCHES THE WORM', 'Proverb'], ['EVERY CLOUD HAS A SILVER LINING', 'Proverb'],
  ['ROME WAS NOT BUILT IN A DAY', 'Proverb'], ['A ROLLING STONE GATHERS NO MOSS', 'Proverb'], ['WHERE THERE IS A WILL THERE IS A WAY', 'Proverb'],
  ['FORTUNE FAVOURS THE BOLD', 'Proverb'], ['HOME IS WHERE THE HEART IS', 'Proverb'], ['A FRIEND IN NEED IS A FRIEND INDEED', 'Proverb'],
  ['PRACTICE MAKES PERFECT', 'Proverb'], ['ABSENCE MAKES THE HEART GROW FONDER', 'Proverb'], ['LAUGHTER IS THE BEST MEDICINE', 'Proverb'],
  ['A JOURNEY OF A THOUSAND MILES BEGINS WITH A SINGLE STEP', 'Lao Tzu'], ['I THINK THEREFORE I AM', 'René Descartes'],
  ['TO THINE OWN SELF BE TRUE', 'William Shakespeare'], ['BREVITY IS THE SOUL OF WIT', 'William Shakespeare'],
  ['THE COURSE OF TRUE LOVE NEVER DID RUN SMOOTH', 'William Shakespeare'], ['ALL THE WORLD IS A STAGE', 'William Shakespeare'],
  ['WE ARE SUCH STUFF AS DREAMS ARE MADE ON', 'William Shakespeare'], ['I CAN RESIST EVERYTHING EXCEPT TEMPTATION', 'Oscar Wilde'],
  ['CURIOUSER AND CURIOUSER', 'Lewis Carroll'], ['WE ARE ALL MAD HERE', 'Lewis Carroll'],
  ['IT WAS THE BEST OF TIMES IT WAS THE WORST OF TIMES', 'Charles Dickens'], ['TO ERR IS HUMAN TO FORGIVE DIVINE', 'Alexander Pope'],
  ['HOPE SPRINGS ETERNAL IN THE HUMAN BREAST', 'Alexander Pope'], ['WELL DONE IS BETTER THAN WELL SAID', 'Benjamin Franklin'],
  ['THE UNEXAMINED LIFE IS NOT WORTH LIVING', 'Socrates'], ['KNOW THYSELF', 'Delphi'],
];
PS.PUZZLES.cryptogram = {
  name: 'Cryptogram', icon: '🔐', colour: '#8f5cff', host: 'melody',
  intro: 'Every letter has been swapped for another. Tap a letter, then type what you think it really is.',
  render(el, ctx) {
    const { rng, level } = ctx;
    const len = q => q[0].replace(/[^A-Z]/g, '').length;
    const [lo, hi] = [[0, 28], [24, 40], [34, 99]][level - 1];
    const pool = PS.QUOTES.filter(q => len(q) >= lo && len(q) <= hi), quote = PS.pick(rng, pool.length ? pool : PS.QUOTES);
    // a secret alphabet in which no letter stands for itself
    const A = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'];
    let sh; do { sh = PS.shuffle(rng, A); } while (sh.some((c, i) => c === A[i]));
    const enc = Object.fromEntries(A.map((c, i) => [c, sh[i]]));      // plain → cipher
    const dec = Object.fromEntries(A.map((c, i) => [sh[i], c]));      // cipher → plain
    const letters = [...new Set([...quote[0]].filter(c => /[A-Z]/.test(c)).map(c => enc[c]))];

    el.innerHTML = '';
    const wrap = PS.el('div', 'cg-wrap');
    const text = PS.el('div', 'cg-text');
    const cells = [];   // every letter cell
    quote[0].split(' ').forEach(word => {
      const w = PS.el('div', 'cg-word');
      [...word].forEach(ch => {
        const cell = { ch: enc[ch], el: PS.el('div', 'cg-cell') };
        cell.guess = PS.el('div', 'cg-guess', ''); cell.cipher = PS.el('div', 'cg-cipher', enc[ch]);
        cell.el.append(cell.guess, cell.cipher);
        cell.el.addEventListener('pointerdown', e => { e.preventDefault(); PS.tap(); selectLetter(cell.ch); });
        w.appendChild(cell.el); cells.push(cell);
      });
      text.appendChild(w);
    });
    const kb = PS.keyboard(PS.QWERTY, key);
    wrap.append(text, PS.el('div', 'cg-tip', 'Tap a letter, then type your guess. Tap ⌫ to rub it out.'), kb);
    el.appendChild(wrap);

    const guess = {};        // cipher letter → guessed plain letter
    let cur = null;
    const freq = c => cells.filter(x => x.ch === c).length;
    function paint() {
      const used = {}; Object.entries(guess).forEach(([c, g]) => { used[g] = (used[g] || 0) + 1; });
      cells.forEach(x => {
        const g = guess[x.ch] || '';
        x.guess.textContent = g;
        x.el.classList.toggle('on', x.ch === cur);
        x.el.classList.toggle('dup', !!g && used[g] > 1);
      });
    }
    function selectLetter(c) { cur = c; paint(); }
    function key(k) {
      if (!cur) return;
      if (k === 'DEL') { delete guess[cur]; paint(); return; }
      guess[cur] = k; paint();
      if (letters.every(c => guess[c] === dec[c])) { cur = null; paint(); kb.remove(); document.removeEventListener('keydown', kb._keyHandler); ctx.solved(`“${quote[0][0] + quote[0].slice(1).toLowerCase()}”: ${quote[1]}`); return; }
      const next = letters.find(c => guess[c] == null && c !== cur) ; if (guess[cur] === dec[cur] && next) selectLetter(next);
    }
    ctx.onLeave(() => document.removeEventListener('keydown', kb._keyHandler));
    // some letters given to start with
    PS.shuffle(rng, letters).sort((a, b) => freq(b) - freq(a)).slice(0, [3, 1, 0][level - 1]).forEach(c => { guess[c] = dec[c]; });
    selectLetter(letters.find(c => guess[c] == null) || letters[0]);

    return {
      hint() {
        const c = (cur && guess[cur] !== dec[cur]) ? cur : letters.filter(x => guess[x] !== dec[x]).sort((a, b) => freq(b) - freq(a))[0];
        if (!c) return false;
        cur = c; ctx.say(`${c} stands for ${dec[c]}.`); key(dec[c]);
        return true;
      },
    };
  },
};
