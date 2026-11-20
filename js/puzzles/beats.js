// ---- Rhythm Sums (fill each bar so the beats add up) ----
// Every bar must add up to its number of beats. Notes: semibreve 4, dotted minim 3,
// minim 2, crotchet 1, a pair of quavers 1. Tap ▶ to hear a bar. Level 1: 4 bars with
// minims and crotchets; level 2: 5 bars, adds quavers; level 3: 6 bars, adds 3-beat bars
// and the longer notes. Any filling that adds up is a right answer.
'use strict';
PS.NOTES = {
  whole: { beats: 4, name: 'semibreve' },
  dotmin: { beats: 3, name: 'dotted minim' },
  min: { beats: 2, name: 'minim' },
  crot: { beats: 1, name: 'crotchet' },
  quav: { beats: 1, name: '2 quavers' },
};
// Notes are drawn with shapes, so no music font is needed.
PS.noteSvg = function (k, h = 64) {
  const ink = '#2b2250', head = (cx, cy, filled) => `<ellipse cx="${cx}" cy="${cy}" rx="11" ry="7.5" transform="rotate(-20 ${cx} ${cy})" fill="${filled ? ink : '#fff'}" stroke="${ink}" stroke-width="3"/>`;
  let body = '', w = 44;
  if (k === 'whole') body = `<ellipse cx="22" cy="48" rx="14" ry="9" fill="#fff" stroke="${ink}" stroke-width="3.5"/><ellipse cx="22" cy="48" rx="5" ry="8" transform="rotate(40 22 48)" fill="${ink}"/>`;
  if (k === 'min') body = head(17, 50, false) + `<line x1="27" y1="47" x2="27" y2="8" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (k === 'dotmin') { w = 54; body = head(17, 50, false) + `<line x1="27" y1="47" x2="27" y2="8" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/><circle cx="42" cy="50" r="3.5" fill="${ink}"/>`; }
  if (k === 'crot') body = head(17, 50, true) + `<line x1="27" y1="47" x2="27" y2="8" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/>`;
  if (k === 'quav') { w = 78; body = head(17, 50, true) + head(55, 50, true) + `<line x1="27" y1="47" x2="27" y2="10" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/><line x1="65" y1="47" x2="65" y2="10" stroke="${ink}" stroke-width="3.5" stroke-linecap="round"/><polygon points="25,8 67,8 67,18 25,18" fill="${ink}"/>`; }
  return `<svg class="note-svg" viewBox="0 0 ${w} 64" height="${h}" width="${h * w / 64}">${body}</svg>`;
};
// Build the bars: each a list of parts adding to its beats, some left blank.
PS.beatsMake = function (rng, level) {
  const allowed = [['min', 'crot'], ['min', 'crot', 'quav'], ['whole', 'dotmin', 'min', 'crot', 'quav']][level - 1];
  const bars = [], count = [4, 5, 6][level - 1];
  while (bars.length < count) {
    const T = level === 3 && rng() < 0.4 ? 3 : 4;
    const parts = [];
    let left = T;
    while (left > 0) { const opts = allowed.filter(k => PS.NOTES[k].beats <= left); parts.push(PS.pick(rng, opts)); left -= PS.NOTES[parts[parts.length - 1]].beats; }
    const blanks = level === 1 ? 1 : level === 2 ? 1 + (rng() < 0.5 ? 1 : 0) : 2;
    if (parts.length < blanks + 1 || parts.length > 4) continue;
    if (bars.length && JSON.stringify(parts) === JSON.stringify(bars[bars.length - 1].sol)) continue;
    const blankAt = new Set(PS.shuffle(rng, [...parts.keys()]).slice(0, blanks));
    bars.push({ T, sol: parts, parts: parts.map((k, i) => ({ sol: k, val: blankAt.has(i) ? null : k, blank: blankAt.has(i) })) });
  }
  return { bars, palette: allowed };
};

PS.PUZZLES.beats = {
  name: 'Rhythm Sums', icon: '🥁', colour: '#14b8a6', host: 'barnaby',
  intro: 'Every bar must add up to the right number of beats. Pick a ❓ and choose a note!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const { bars, palette } = PS.beatsMake(rng, level);

    el.innerHTML = '';
    const wrap = PS.el('div', 'bt-wrap');
    const grid = PS.el('div', 'bt-bars');
    const pal = PS.el('div', 'bt-palette');
    wrap.append(grid, pal);
    el.appendChild(wrap);

    const sum = b => b.parts.reduce((s, p) => s + (p.val ? PS.NOTES[p.val].beats : 0), 0);
    let sel = null;
    bars.forEach((b, bi) => {
      b.el = PS.el('div', 'bt-bar');
      b.head = PS.el('div', 'bt-head');
      b.row = PS.el('div', 'bt-row');
      const play = PS.el('button', 'bt-play', '▶');
      play.addEventListener('pointerdown', e => { e.preventDefault(); playBar(b); });
      b.el.append(b.head, b.row, play);
      grid.appendChild(b.el);
      b.parts.forEach(p => {
        p.el = PS.el('button', 'bt-part');
        p.el.addEventListener('pointerdown', e => { e.preventDefault(); if (p.blank) { PS.tap(); select(p); } });
        b.row.appendChild(p.el);
      });
      refresh(b);
    });
    palette.forEach(k => {
      const btn = PS.el('button', 'bt-pick', `${PS.noteSvg(k, 54)}<span>${PS.NOTES[k].name}</span><b>${PS.NOTES[k].beats} beat${PS.NOTES[k].beats > 1 ? 's' : ''}</b>`);
      btn.addEventListener('pointerdown', e => { e.preventDefault(); put(k); });
      pal.appendChild(btn);
    });
    const er = PS.el('button', 'bt-pick bt-erase', '<span style="font-size:34px">🧽</span><span>rub out</span>');
    er.addEventListener('pointerdown', e => { e.preventDefault(); put(null); });
    pal.appendChild(er);

    function refresh(b) {
      b.parts.forEach(p => {
        p.el.innerHTML = p.val ? PS.noteSvg(p.val, 60) : '<span class="bt-q">❓</span>';
        p.el.classList.toggle('blank', p.blank); p.el.classList.toggle('sel', p === sel);
      });
      const s = sum(b), full = b.parts.every(p => p.val);
      b.state = full && s === b.T ? 'ok' : full && s > b.T ? 'over' : full ? 'under' : 'open';
      b.el.classList.toggle('ok', b.state === 'ok'); b.el.classList.toggle('over', b.state === 'over');
      b.head.innerHTML = `<b>${b.T} beats</b> <span class="bt-count">you have ${s}</span> ${b.state === 'ok' ? '✅' : ''}`;
    }
    function select(p) { sel = p; bars.forEach(refresh); }
    function put(k) {
      if (!sel) { ctx.say('Tap a ❓ first.'); return; }
      PS.tap();
      sel.val = k;
      const b = bars.find(x => x.parts.includes(sel));
      refresh(b);
      if (k) { const nxt = b.parts.find(p => p.blank && !p.val) || bars.flatMap(x => x.parts).find(p => p.blank && !p.val); if (nxt) sel = nxt; }
      bars.forEach(refresh);
      if (k && b.state === 'ok') PS.ding();
      else if (k && (b.state === 'over' || b.state === 'under')) { PS.oops(); ctx.say(b.state === 'over' ? 'That is too many beats for this bar.' : 'Not enough beats yet. Try a longer note.'); }
      if (bars.every(x => x.state === 'ok')) { sel = null; bars.forEach(refresh); ctx.solved('Every bar adds up!'); }
    }
    function playBar(b) {
      let t = 0;
      const pitch = [523, 587, 659, 784];
      b.parts.forEach((p, i) => {
        if (!p.val) return;
        if (p.val === 'quav') { PS.tone(pitch[i % 4], 0.22, 'triangle', 0.16, t); PS.tone(pitch[(i + 1) % 4], 0.22, 'triangle', 0.16, t + 0.22); t += 0.44; }
        else { const bt = PS.NOTES[p.val].beats * 0.44; PS.tone(pitch[i % 4], Math.min(0.9, bt * 0.92), 'triangle', 0.16, t); t += bt; }
      });
    }
    select(bars.flatMap(b => b.parts).find(p => p.blank));

    return {
      hint() {
        const target = (sel && sel.val !== sel.sol && sel) || bars.flatMap(b => b.parts).find(p => p.blank && !p.val) || bars.find(b => b.state !== 'ok')?.parts.find(p => p.blank);
        if (!target) return false;
        sel = target; put(target.sol);
        return true;
      },
    };
  },
};
