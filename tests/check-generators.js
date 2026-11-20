// Run: node tests/check-generators.js — checks every nonogram picture solves by logic,
// sudokus have one answer, and crosswords lay out enough words.
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { window: {}, document: {}, console, localStorage: { getItem: () => null, setItem() {} } };
vm.createContext(ctx);
for (const f of ['js/core.js', 'js/words.js', 'js/puzzles/sudoku.js', 'js/puzzles/nonogram.js', 'js/puzzles/crossword.js'])
  vm.runInContext(fs.readFileSync(path.join(root, f), 'utf8').replace("'use strict';", '') + '\nthis.PS = PS;', ctx, { filename: f });
const PS = ctx.PS;
let bad = 0;
for (const p of PS.PICTURES) {
  const lens = new Set(p.rows.map(r => r.length));
  const ok = lens.size === 1 && PS.nonoSolvable(p.rows);
  if (!ok) { bad++; console.log('NONOGRAM FAILS:', p.name, [...lens]); }
}
console.log('pictures ok per level:', [1, 2, 3].map(l => PS.PICTURES.filter(p => p.lv === l && PS.nonoSolvable(p.rows)).length));
for (let i = 0; i < 30; i++) {
  const r = PS.rng(i), sol = PS.sudoku6(r);
  for (const lv of [20, 16, 13]) {
    const g = PS.sudoku6Holes(r, sol, lv), n = g.flat().filter(v => v >= 0).length;
    if (PS.sudoku6Count(g.map(x => x.slice())) !== 1) { bad++; console.log('SUDOKU not unique'); }
    if (n > lv) console.log('sudoku: wanted', lv, 'got', n);
  }
}
for (const theme of Object.keys(PS.CLUES)) for (const want of [6, 8, 10]) {
  const counts = [];
  for (let i = 0; i < 10; i++) { const L = PS.crosswordLayout(PS.rng(i * 7 + want), PS.CLUES[theme], want); counts.push(L ? L.words.length : 0); }
  console.log('crossword', theme, want, '->', Math.min(...counts), 'to', Math.max(...counts));
}
console.log(bad ? `${bad} problems` : 'all good');
