// ---- Word Ladder (change ONE letter at a time to climb from one word to another) ----
// The first and last words are given; every step in between has a written clue.
// Level 1: 3-letter words, 2 steps. Level 2: 3-letter words, 3 steps. Level 3: 4-letter words, 3 steps.
'use strict';
PS.LADDER = {
  3: [
    ['CAT', 'A pet that purrs'], ['COT', 'A small bed for a baby'], ['CUT', 'What you do to paper with scissors'], ['HAT', 'You wear it on your head'],
    ['HOT', 'The opposite of cold'], ['HIT', 'To bang something with a bat'], ['HUT', 'A tiny simple house'], ['HUG', 'A big squeeze to show love'],
    ['BAT', 'You hit a cricket ball with it'], ['BIT', 'A small piece of something'], ['FIT', 'Strong and healthy'], ['SIT', 'What you do on a chair'],
    ['SAT', 'What you did on a chair yesterday'], ['MAT', 'A small rug by the door'], ['MAP', 'It shows you where places are'], ['CAP', 'A soft hat with a peak'],
    ['CUP', 'You drink tea from it'], ['PUP', 'A baby dog'], ['POP', 'The sound a balloon makes when it bursts'], ['TOP', 'The opposite of bottom'],
    ['TIP', 'The pointy end of something'], ['TAP', 'Water comes out of it'], ['MAN', 'A grown-up boy'], ['CAN', 'Fizzy drinks come in one'],
    ['FAN', 'It blows cool air at you'], ['FUN', 'Having a great time'], ['SUN', 'The big star that warms the Earth'], ['BUN', 'A sweet roll to eat'],
    ['RUN', 'Going faster than walking'], ['RAN', 'What you did in yesterday’s race'], ['RAT', 'A bigger cousin of a mouse'], ['RAM', 'A boy sheep'],
    ['JAM', 'Strawberry ___ on toast'], ['JAR', 'A glass pot for jam'], ['CAR', 'It has four wheels and an engine'], ['BAR', 'A ___ of chocolate'],
    ['BAY', 'A curve of sea along the coast'], ['DAY', 'Between morning and night'], ['HAY', 'Dried grass for guinea pigs'], ['SAY', 'To speak words'],
    ['PAY', 'Give money to buy something'], ['PEN', 'You write with it using ink'], ['HEN', 'A mummy chicken'], ['TEN', 'One more than nine'],
    ['DEN', 'A wild animal’s home'], ['PAN', 'You fry an egg in it'], ['PIN', 'A tiny sharp thing for holding cloth'], ['BIG', 'The opposite of small'],
    ['DIG', 'What you do with a spade'], ['DOG', 'A pet that barks'], ['LOG', 'A thick piece of tree'], ['LEG', 'You walk on it'],
    ['PEG', 'It holds washing on the line'], ['BUG', 'A tiny creepy-crawly'], ['BAG', 'You carry shopping in it'], ['RUG', 'A carpet by the fire'],
    ['MUG', 'A big cup with a handle'], ['MUD', 'Wet, sticky soil'], ['BUD', 'A flower before it opens'], ['BED', 'You sleep in it'],
    ['RED', 'The colour of a ladybird'], ['NOD', 'Move your head up and down for yes'], ['NET', 'You catch butterflies with it'], ['NUT', 'Squirrels love to eat it'],
    ['WET', 'Soaked with water'], ['JET', 'A very fast plane'], ['PET', 'An animal you look after at home'], ['SAD', 'The opposite of happy'],
    ['MAD', 'Very, very cross'], ['DAD', 'Father'], ['HID', 'Went out of sight'], ['LID', 'The top of a box or pot'],
    ['KID', 'A baby goat'], ['KIT', 'Your football ___'], ['WIN', 'Come first in a race'], ['BIN', 'Where rubbish goes'],
    ['FIN', 'A fish uses it to swim'], ['FOX', 'A clever orange animal with a bushy tail'], ['BOX', 'A cardboard container'], ['SIX', 'The number after five'],
    ['MIX', 'Stir things together'], ['FIX', 'Mend something broken'], ['WIG', 'Pretend hair you wear'], ['WEB', 'A spider spins it'],
    ['GEM', 'A sparkly precious stone'], ['HUM', 'To sing with your lips closed'], ['GUM', 'Chewing ___'], ['SUM', 'A maths problem'],
    ['TUB', 'A pot of ice cream'], ['RUB', 'To wipe with your hand'], ['CUB', 'A baby bear or lion'], ['JOB', 'Work that you do'],
    ['JOG', 'Run slowly'], ['FOG', 'Thick cloud close to the ground'], ['HOP', 'A rabbit does this'], ['MOP', 'You clean the floor with it'],
    ['DOT', 'A tiny round spot'], ['POT', 'You cook soup in it'], ['COW', 'It gives us milk'], ['BEE', 'It buzzes and makes honey'],
    ['SEE', 'You use your eyes to ___'], ['SEA', 'Salty water with waves'], ['TEA', 'A hot drink, often with milk'], ['PEA', 'A tiny green round vegetable'],
    ['TOY', 'Something to play with'], ['BOY', 'A young man'], ['JOY', 'Great happiness'], ['CRY', 'Tears roll when you ___'],
    ['DRY', 'Not wet'], ['FRY', 'Cook in a pan with oil'], ['TRY', 'Have a go'], ['TUG', 'Pull hard'],
    ['JUG', 'You pour milk from it'], ['LAP', 'Where a cat sits on you'], ['LIP', 'Part of your mouth'], ['SIP', 'A tiny drink'],
    ['ZIP', 'It does up your coat'], ['NAP', 'A short sleep'], ['GAP', 'A space between two things'], ['DIP', 'A sauce for your chips'],
  ],
  4: [
    ['BAKE', 'Cook a cake in the oven'], ['CAKE', 'A sweet treat with candles on a birthday'], ['LAKE', 'A big pool of water with land all round'], ['MAKE', 'Build or create something'],
    ['TAKE', 'Grab something and carry it away'], ['TALE', 'A story'], ['TALL', 'Not short'], ['BALL', 'You kick it in football'],
    ['CALL', 'To shout or phone someone'], ['FALL', 'What leaves do in autumn'], ['HALL', 'A big entrance room in a house'], ['WALL', 'Bricks make this'],
    ['BELL', 'You ring it to make a ding-dong'], ['BELT', 'It holds up your trousers'], ['BOAT', 'A small ship'], ['COAT', 'You wear it when it is cold'],
    ['GOAT', 'A farm animal that eats almost anything'], ['MOAT', 'A ditch of water around a castle'], ['BEAT', 'The steady pulse in music'], ['BEAN', 'A baked ___ on toast'],
    ['BEAR', 'Barnaby is one'], ['FEAR', 'What you feel when you are scared'], ['HEAR', 'You do this with your ears'], ['SEAT', 'A chair or a bench'],
    ['HEAT', 'Warmth from a fire'], ['NEAT', 'Tidy'], ['MEAT', 'Chicken and beef are types of this'], ['HEAD', 'The top part of your body'],
    ['HAND', 'It has five fingers'], ['BAND', 'A group of musicians'], ['BANK', 'Where money is kept'], ['SAND', 'Yellow stuff on the beach'],
    ['RING', 'A circle of gold on your finger'], ['KING', 'A man who rules a country'], ['KIND', 'Being nice and caring'], ['FIND', 'To discover something lost'],
    ['NINE', 'One less than ten'], ['LINE', 'A straight mark'], ['LIME', 'A green sour fruit'], ['TIME', 'What a clock shows'],
    ['HOLE', 'A gap you dig in the ground'], ['HOLD', 'To grip something in your hands'], ['COLD', 'The opposite of hot'], ['GOLD', 'A shiny yellow metal'],
    ['FOLD', 'Bend paper in half'], ['POOL', 'A place to swim'], ['TOOL', 'A hammer is one'], ['COOL', 'Not too hot'],
    ['COOK', 'Someone who makes dinner'], ['BOOK', 'You read it'], ['LOOK', 'To use your eyes'], ['HOOK', 'You hang your coat on it'],
    ['HOOF', 'A horse’s foot'], ['ROOF', 'The top of a house'], ['ROOM', 'A part of a house with walls'], ['MOON', 'It glows in the night sky'],
    ['NOON', 'Twelve o’clock in the day'], ['SOON', 'Not long from now'], ['HILL', 'A small mountain'], ['FILL', 'Pour until it is full'],
    ['FISH', 'It swims in water'], ['DISH', 'A plate or bowl for food'], ['WISH', 'What you make on a star'], ['WASH', 'Clean with soap and water'],
    ['DUCK', 'A bird that quacks'], ['LUCK', 'Good fortune'], ['LOCK', 'You turn a key in it'], ['ROCK', 'A big stone'],
    ['SOCK', 'You wear it on your foot inside your shoe'], ['KICK', 'What you do to a football'], ['LICK', 'Using your tongue on an ice cream'], ['TICK', 'A correct mark'],
    ['RAIN', 'Water drops from the clouds'], ['NAIL', 'You bang it with a hammer'], ['TAIL', 'It wags on a dog'], ['PEAR', 'A green fruit shaped like a bell'],
  ],
};
// A chain of words, each one letter different from the last.
PS.ladderMake = function (rng, len, mids) {
  const list = PS.LADDER[len], total = mids + 2;
  const diff1 = (a, b) => { let d = 0; for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++; return d === 1; };
  for (let attempt = 0; attempt < 600; attempt++) {
    const path = [PS.pick(rng, list)];
    const go = () => {
      if (path.length === total) return true;
      const last = path[path.length - 1][0];
      for (const x of PS.shuffle(rng, list)) {
        if (path.some(p => p[0] === x[0]) || !diff1(last, x[0])) continue;
        // keep the ladder honest: the first word must not already be one step from the last
        if (path.length === total - 1 && diff1(path[0][0], x[0])) continue;
        path.push(x); if (go()) return true; path.pop();
      }
      return false;
    };
    if (go()) return path;
  }
  return null;
};

PS.PUZZLES.ladder = {
  name: 'Word Ladder', icon: '🪜', colour: '#ff6a3d', host: 'evie',
  intro: 'Climb from the top word to the bottom word. Change just ONE letter each step!',
  render(el, ctx) {
    const { rng, level } = ctx;
    const len = level === 3 ? 4 : 3, mids = level === 1 ? 2 : 3;
    const path = PS.ladderMake(rng, len, mids);
    const changed = k => { for (let i = 0; i < len; i++) if (path[k][0][i] !== path[k - 1][0][i]) return i; return -1; };

    el.innerHTML = '';
    const wrap = PS.el('div', 'ld-wrap');
    const ladder = PS.el('div', 'ld-ladder');
    const rows = path.map((p, k) => {
      const end = k === 0 || k === path.length - 1;
      const row = PS.el('div', 'ld-row' + (end ? ' fixed' : ''));
      const boxes = [...p[0]].map((ch, i) => PS.el('div', 'ld-box', end ? ch : ''));
      const word = PS.el('div', 'ld-word'); boxes.forEach(b => word.appendChild(b));
      row.appendChild(PS.el('div', 'ld-step', end ? (k === 0 ? '⬆️' : '🏁') : k));
      row.appendChild(word);
      row.appendChild(PS.el('div', 'ld-clue', end ? (k === 0 ? 'Start here' : 'Finish here') : p[1]));
      ladder.appendChild(row);
      const r = { k, w: p[0], boxes, el: row, typed: '', done: end, fixed: end };
      if (!end) row.addEventListener('pointerdown', e => { e.preventDefault(); if (!r.done) select(r); });
      return r;
    });
    const kb = PS.keyboard(PS.QWERTY, key);
    const right = PS.el('div', 'ld-right', '<p class="ld-tip">Each word is the one above it with <b>one letter changed</b>. Tap a step, then type its word!</p>');
    right.appendChild(kb);
    wrap.append(ladder, right);
    el.appendChild(wrap);

    let cur = null;
    function select(r) { cur = r; rows.forEach(x => x.el.classList.toggle('on', x === r)); }
    function paint(r) { r.boxes.forEach((b, i) => { b.textContent = r.typed[i] || ''; }); }
    function key(k) {
      if (!cur || cur.done) return;
      if (k === 'DEL') { cur.typed = cur.typed.slice(0, -1); paint(cur); return; }
      if (cur.typed.length >= len) return;
      cur.typed += k; paint(cur);
      if (cur.typed.length === len) {
        if (cur.typed === cur.w) {
          cur.done = true; PS.ding(); cur.el.classList.add('right'); cur.el.classList.remove('on');
          if (level < 3) { const c = changed(cur.k); if (c >= 0) cur.boxes[c].classList.add('chg'); }
          const next = rows.find(x => !x.done);
          if (!next) { kb.remove(); document.removeEventListener('keydown', kb._keyHandler); ctx.solved('You climbed the whole ladder!'); } else select(next);
        } else {
          PS.oops(); ctx.say('Not quite. Re-read the clue, and remember only one letter changes!');
          const r = cur; r.el.classList.remove('wrong'); void r.el.offsetWidth; r.el.classList.add('wrong');
          setTimeout(() => { r.typed = ''; paint(r); r.el.classList.remove('wrong'); }, 450);
        }
      }
    }
    select(rows.find(x => !x.done));
    ctx.onLeave(() => document.removeEventListener('keydown', kb._keyHandler));

    return {
      hint() {
        const r = cur && !cur.done ? cur : rows.find(x => !x.done);
        if (!r) return false;
        select(r);
        const i = [...r.w].findIndex((ch, k) => r.typed[k] !== ch);
        r.typed = r.w.slice(0, Math.min(len, i + 1) ) ; paint(r);
        if (r.typed.length === len) { r.typed = r.w.slice(0, len - 1); paint(r); key(r.w[len - 1]); } else ctx.say(`It starts with ${r.w.slice(0, r.typed.length)}…`);
        return true;
      },
    };
  },
};
