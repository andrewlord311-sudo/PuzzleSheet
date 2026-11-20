// ---- Who is playing? ----
// Each player has their own sheet, votes, levels and mix of puzzles. The public site never
// uses the children's real names: Maya (7), Theo (5) and a grown-up edition.
'use strict';
PS.PLAYERS = {
  maya: {
    name: 'Maya', face: '🐹', colour: '#ff4fa3', host: 'melody', spoken: false, garden: true,
    blurb: 'Words, pictures and music',
    core: ['wordsearch', 'crossword', 'sudoku', 'nonogram', 'code', 'music'],
    pairs: [['queens', 'zip'], ['tango', 'scramble'], ['ladder', 'beats']],
  },
  grown: {
    name: 'Grown-ups', face: '☕', colour: '#8f5cff', host: 'harmony', spoken: false, garden: false, adult: true,
    blurb: 'Puzzles to linger over',
    core: ['sudoku9', 'crosswordA', 'futoshiki', 'tangoA'],
    pairs: [['queensA', 'zipA'], ['kenken', 'scrambleA']],
  },
  theo: {
    name: 'Theo', face: '🦖', colour: '#2f8cff', host: 'barnaby', spoken: true, garden: false,
    blurb: 'Numbers, pictures and mazes. Read aloud!',
    core: ['blocks', 'bonds', 'splits', 'phonics', 'jigsaw', 'sudoku4', 'dots', 'maze'],
    pairs: [],
  },
};
PS.cfg = () => PS.PLAYERS[PS.player] || PS.PLAYERS.maya;
PS.adult = () => !!PS.cfg().adult;   // the grown-ups' edition looks and sounds different: no mascots, rainbow or fanfares
// muted accents for the grown-ups' screens (one per puzzle, steady from sheet to sheet)
PS.ADULT_ACCENTS = ['#34506e', '#7a4f33', '#3f6b5a', '#6a4c7d', '#8a6a2f', '#4a5a66', '#7a3b4a', '#2f5d6e'];
PS.accent = g => { let h = 0; for (const ch of String(g)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return PS.ADULT_ACCENTS[h % PS.ADULT_ACCENTS.length]; };
PS.setPlayer = id => { if (PS.PLAYERS[id]) { PS.player = id; PS.save('ps_player', id); } };
// The saved player. Anyone who used the app before it had players is Maya, with all her stars and votes intact.
PS.savedPlayer = () => {
  const p = PS.load('ps_player', null);
  if (p && PS.PLAYERS[p]) return p;
  if (PS.load('ps_votes', null) || PS.load('ps_sheet', null)) return 'maya';
  return null;
};

// ---- Reading aloud (for players who cannot read yet): the iPad's own voice ----
PS.speakOn = () => !!PS.cfg().spoken;
PS.speak = text => {
  if (!PS.speakOn() || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(String(text).replace(/[🎉✨⭐❤️]/g, '').replace(/\s+/g, ' '));
    const v = speechSynthesis.getVoices().find(x => /en[-_]GB/i.test(x.lang));
    if (v) u.voice = v; u.lang = 'en-GB'; u.rate = 0.9; u.pitch = 1.1;
    speechSynthesis.speak(u);
  } catch {}
};

// ---- Stars: Maya's go to the Guinea Pig Garden; everyone else keeps their own count ----
PS.addStars = n => {
  if (PS.cfg().garden) { const r = PS.load(PS.REWARDS_KEY, { stars: 0 }); r.stars = (r.stars || 0) + n; PS.save(PS.REWARDS_KEY, r); }
  else PS.save('ps_stars_' + PS.player, PS.load('ps_stars_' + PS.player, 0) + n);
};
PS.starBalance = () => PS.cfg().garden ? (PS.load(PS.REWARDS_KEY, {}).stars || 0) - (PS.load('ttg_garden', {}).spent || 0) : PS.load('ps_stars_' + PS.player, 0);

// ---- A row of questions with big answer buttons (counting, sums, patterns) ----
// qs: [{ say, build(stage), options: [{ html, correct }] }]
PS.quiz = function (el, ctx, qs) {
  el.innerHTML = '';
  const wrap = PS.el('div', 'qz-wrap'), dots = PS.el('div', 'sc-dots'), stage = PS.el('div', 'qz-stage'), opts = PS.el('div', 'qz-opts');
  wrap.append(dots, stage, opts); el.appendChild(wrap);
  let i = 0, locked = false;
  function show() {
    const q = qs[i]; locked = false;
    dots.innerHTML = qs.map((_, k) => `<span class="${k < i ? 'done' : k === i ? 'now' : ''}"></span>`).join('');
    stage.innerHTML = ''; q.build(stage);
    opts.innerHTML = '';
    q.options.forEach(o => {
      const b = PS.el('button', 'qz-opt', o.html);
      b.addEventListener('pointerdown', e => { e.preventDefault(); choose(o, b); });
      o.btn = b; opts.appendChild(b);
    });
    ctx.say(q.say);
  }
  function choose(o, b) {
    if (locked || b.classList.contains('gone')) return;
    if (o.correct) {
      locked = true; PS.ding(); b.classList.add('right');
      if (i === qs.length - 1) { dots.innerHTML = qs.map(() => '<span class="done"></span>').join(''); setTimeout(() => ctx.solved('You got every one!'), 700); }
      else setTimeout(() => { i++; show(); }, 900);
    } else { PS.oops(); b.classList.remove('wrong'); void b.offsetWidth; b.classList.add('wrong'); ctx.say('Not that one. Try again!'); }
  }
  show();
  return {
    hint() {
      if (locked) return false;
      const q = qs[i], wrong = q.options.find(o => !o.correct && !o.btn.classList.contains('gone'));
      const right = q.options.find(o => o.correct);
      if (wrong && q.options.filter(o => !o.btn.classList.contains('gone')).length > 2) { wrong.btn.classList.add('gone'); ctx.say('I took one wrong answer away.'); }
      else { right.btn.classList.add('hinted'); ctx.say('Look at the one that is wiggling!'); }
      return true;
    },
  };
};
