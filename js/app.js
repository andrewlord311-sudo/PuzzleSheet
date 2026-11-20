// ---- Puzzle Sheet: the screens ----
// Home (today's sheet of six) → a puzzle → "You did it!" with two questions
// (how much did you like it, how hard was it) → back to the sheet.
// Grown-ups page: what she likes, and the level each puzzle has reached.
'use strict';
(function () {
  const $ = id => document.getElementById(id);
  const show = id => { document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id)); window.scrollTo(0, 0); };
  let leaveFns = [];
  const leave = () => { leaveFns.forEach(f => { try { f(); } catch {} }); leaveFns = []; };

  // ---------------- Home ----------------
  function renderHome() {
    leave();
    const sheet = PS.sheet();
    const made = new Date(sheet.made);
    $('sheet-info').textContent = `Sheet ${sheet.no} · ${made.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}`;
    $('home-stars').textContent = '⭐ ' + PS.starBalance();
    const grid = $('cards'); grid.innerHTML = '';
    sheet.items.forEach((it, i) => {
      const P = PS.PUZZLES[it.g];
      const card = PS.el('button', 'card' + (it.done ? ' done' : ''));
      card.style.setProperty('--c', P.colour);
      card.style.animationDelay = (i * 0.06) + 's';
      const lv = PS.level(it.g);
      card.innerHTML = `
        <div class="card-num">${i + 1}</div>
        <div class="card-host">${PS.host(P.host)}</div>
        <div class="card-icon">${P.icon}</div>
        <div class="card-name">${P.name}</div>
        <div class="card-level">${'●'.repeat(lv)}${'○'.repeat(3 - lv)}</div>
        <div class="card-state">${it.done ? (it.hearts ? '❤️'.repeat(it.hearts) : '✔️') + ' Done!' : 'Play ▶'}</div>`;
      card.addEventListener('click', () => { PS.tap(); startPuzzle(i); });
      grid.appendChild(card);
    });
    const all = sheet.items.every(it => it.done);
    $('new-sheet').classList.toggle('pulse', all);
    $('sheet-done').hidden = !all;
    show('screen-home');
  }

  // ---------------- A puzzle ----------------
  let current = null;
  function startPuzzle(i) {
    leave();
    const sheet = PS.sheet(), it = sheet.items[i], P = PS.PUZZLES[it.g];
    const level = PS.level(it.g);
    current = { i, g: it.g, level, hints: 0, solved: false };
    const scr = $('screen-play');
    scr.style.setProperty('--c', P.colour);
    $('play-title').innerHTML = `${P.icon} ${P.name}`;
    $('play-level').textContent = ['Level 1', 'Level 2', 'Level 3'][level - 1];
    $('play-host').innerHTML = PS.host(P.host);
    say(P.intro);
    const body = $('play-body');
    body.innerHTML = '';
    const ctx = {
      rng: PS.rng(it.seed),
      level,
      say,
      onLeave: f => leaveFns.push(f),
      solved: msg => { if (!current.solved) { current.solved = true; setTimeout(() => celebrate(msg), 450); } },
    };
    current.api = P.render(body, ctx) || {};
    show('screen-play');
  }
  let sayTimer = null;
  function say(text) {
    const b = $('play-say');
    b.textContent = text;
    b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop');
    clearTimeout(sayTimer);
  }
  $('hint-btn').addEventListener('click', () => {
    if (!current || current.solved || !current.api.hint) return;
    PS.tap();
    if (current.api.hint()) { current.hints++; $('hint-btn').classList.add('used'); }
  });
  $('back-btn').addEventListener('click', () => { PS.tap(); renderHome(); });

  // ---------------- You did it! ----------------
  function celebrate(msg) {
    const P = PS.PUZZLES[current.g];
    const stars = current.hints === 0 ? 3 : current.hints <= 2 ? 2 : 1;
    PS.addStars(stars);
    PS.fanfare(); setTimeout(PS.wheek, 700); PS.confetti();
    const sheet = PS.sheet(); sheet.items[current.i].done = true; PS.saveSheet(sheet);

    const ov = $('celebrate');
    ov.style.setProperty('--c', P.colour);
    $('cel-host').innerHTML = PS.host(P.host, 'cheer');
    $('cel-title').textContent = PS.pick(Math.random, ['You did it!', 'Amazing!', 'Puzzle solved!', 'Brilliant work!', 'Hooray!']);
    $('cel-msg').textContent = msg || '';
    $('cel-stars').textContent = `+${stars} ⭐ for the Guinea Pig Garden`;
    let hearts = null, feel = null;
    const done = $('cel-done');
    done.disabled = true;
    ov.querySelectorAll('[data-h]').forEach(b => {
      b.classList.remove('on');
      b.onclick = () => { PS.tap(); hearts = +b.dataset.h; ov.querySelectorAll('[data-h]').forEach(x => x.classList.toggle('on', x === b)); ready(); };
    });
    ov.querySelectorAll('[data-f]').forEach(b => {
      b.classList.remove('on');
      b.onclick = () => { PS.tap(); feel = b.dataset.f; ov.querySelectorAll('[data-f]').forEach(x => x.classList.toggle('on', x === b)); ready(); };
    });
    function ready() { done.disabled = hearts == null || feel == null; if (!done.disabled) done.classList.add('pulse'); }
    done.onclick = () => {
      PS.tap();
      PS.addVote({ g: current.g, h: hearts, d: feel, lvl: current.level, hints: current.hints, t: Date.now() });
      // her "how hard" answer moves the level for next time
      PS.nudgeLevel(current.g, feel === 'easy' ? 1 : feel === 'hard' ? -1 : 0);
      const s = PS.sheet(); s.items[current.i].hearts = hearts; PS.saveSheet(s);
      done.classList.remove('pulse');
      ov.hidden = true;
      renderHome();
    };
    ov.hidden = false;
  }

  // ---------------- New sheet ----------------
  $('new-sheet').addEventListener('click', () => {
    const sheet = PS.sheet();
    const left = sheet.items.filter(it => !it.done).length;
    if (left && !confirm(`Make a new sheet? The ${left} puzzle${left > 1 ? 's' : ''} you haven't done will go.`)) return;
    PS.tap(); PS.makeSheet(); renderHome();
  });

  // ---------------- Grown-ups ----------------
  function renderGrownups() {
    const votes = PS.votes();
    const rows = Object.entries(PS.PUZZLES).map(([g, P]) => {
      const vs = votes.filter(v => v.g === g);
      const avg = vs.length ? vs.reduce((s, v) => s + v.h, 0) / vs.length : null;
      const f = k => vs.filter(v => v.d === k).length;
      return `<tr>
        <td>${P.icon} ${P.name}</td>
        <td>${vs.length}</td>
        <td><div class="gu-bar"><span style="width:${avg == null ? 0 : avg / 3 * 100}%;background:${P.colour}"></span></div>${avg == null ? '–' : avg.toFixed(1) + ' ❤️'}</td>
        <td>${vs.filter(v => v.h === 0).length}</td>
        <td>${f('easy')} / ${f('right')} / ${f('hard')}</td>
        <td>${PS.level(g)}</td>
      </tr>`;
    }).join('');
    const recent = votes.slice(-15).reverse().map(v => {
      const P = PS.PUZZLES[v.g] || { icon: '?', name: v.g };
      const when = new Date(v.t).toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
      return `<li>${when}: ${P.icon} ${P.name} (level ${v.lvl}) · ${v.h ? '❤️'.repeat(v.h) : '😕 not for me'} · ${{ easy: '😎 too easy', right: '🙂 just right', hard: '😅 tricky' }[v.d] || ''}${v.hints ? ` · ${v.hints} hint${v.hints > 1 ? 's' : ''}` : ''}</li>`;
    }).join('');
    $('gu-body').innerHTML = `
      <table class="gu-table"><thead><tr><th>Puzzle</th><th>Played</th><th>Average hearts</th><th>Not for me</th><th>Easy / right / tricky</th><th>Level now</th></tr></thead><tbody>${rows}</tbody></table>
      <p class="gu-note">Puzzles she gives more hearts to turn up more often on new sheets; “not for me” ones only now and then. “Too easy” moves that puzzle up a level, “tricky” moves it down.</p>
      <h3>Latest answers</h3><ul class="gu-recent">${recent || '<li>Nothing yet.</li>'}</ul>`;
    show('screen-grownups');
  }
  $('grownups-link').addEventListener('click', e => { e.preventDefault(); renderGrownups(); });
  $('gu-back').addEventListener('click', renderHome);
  $('garden-link').href = PS.GARDEN_URL;

  // the first touch anywhere unlocks sound
  document.addEventListener('pointerdown', () => PS.audio(), { once: true });
  // music font for the treble clef
  try { new FontFace('Noto Music', 'url(art/fonts/noto-music.woff2)').load().then(f => document.fonts.add(f)); } catch {}
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});

  renderHome();
  // ?play=<kind> opens a fresh puzzle of that kind (for testing)
  const q = new URLSearchParams(location.search);
  if (q.get('play') && PS.PUZZLES[q.get('play')]) {
    const s = PS.sheet(); s.items[0] = { g: q.get('play'), seed: q.get('seed') ? +q.get('seed') : PS.newSeed(), done: false, hearts: null };
    if (q.get('level')) { const L = PS.load('ps_levels', {}); L[q.get('play')] = +q.get('level'); PS.save('ps_levels', L); }
    PS.saveSheet(s); startPuzzle(0);
  }
})();
