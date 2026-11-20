// Run: node tests/check-generators.js — checks every nonogram picture solves by logic,
// sudokus have one answer, and crosswords lay out enough words.
const fs = require('fs'), vm = require('vm'), path = require('path');
const root = path.join(__dirname, '..');
const ctx = { window: {}, document: {}, console, localStorage: { getItem: () => null, setItem() {} } };
vm.createContext(ctx);
for (const f of ['js/core.js', 'js/words.js', 'js/puzzles/sudoku.js', 'js/puzzles/nonogram.js', 'js/puzzles/crossword.js', 'js/puzzles/queens.js', 'js/puzzles/zip.js', 'js/puzzles/tango.js', 'js/puzzles/ladder.js', 'js/puzzles/beats.js', 'js/puzzles/sudoku4.js', 'js/puzzles/maze.js', 'js/puzzles/dots.js'])
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
// ---- the newer puzzles ----
const t0 = Date.now();
for (const [n, lo, hi] of [[5, 0, 0], [6, 1, 1], [7, 1, 2]]) { const T = Date.now(); let ok = 0; for (let i = 0; i < 15; i++) { const { reg } = PS.queensMake(PS.rng(i + 77), n, lo, hi), L = PS.queensLogic(reg, n); if (PS.queensCount(reg, n) === 1 && L.solved && L.level >= lo && L.level <= hi) ok++; else { bad++; console.log('QUEENS level', n, lo, hi, 'got', JSON.stringify(L)); } } console.log('queens by logic', n, ok, '/15', Date.now() - T, 'ms'); }
for (const n of [5, 6, 7]) { let uniq = 0; for (let i = 0; i < 20; i++) { const { reg, sol } = PS.queensMake(PS.rng(i + n * 100), n); if (PS.queensCount(reg, n) === 1 && PS.queensCount(reg, n, 9) === 1) uniq++; else bad++; } console.log('queens', n, 'unique', uniq, '/20'); }
for (const n of [4, 5, 6]) for (let i = 0; i < 20; i++) {
  const p = PS.zipPath(PS.rng(i), n), N = n * n;
  const okPath = p.length === N && new Set(p).size === N && p.every((x, k) => !k || Math.abs(Math.floor(x / n) - Math.floor(p[k - 1] / n)) + Math.abs(x % n - p[k - 1] % n) === 1);
  const m = PS.zipMarks(PS.rng(i), N, n === 6 ? 7 : 6);
  if (!okPath || m.some((x, k) => k && x <= m[k - 1]) || m[m.length - 1] !== N - 1) { bad++; console.log('ZIP bad', n, i); }
}
for (const [n, extra] of [[4, 0], [6, 6], [6, 0]]) { let clues = []; for (let i = 0; i < 10; i++) { const t = PS.tangoMake(PS.rng(i + 5), n, extra); const c = PS.tangoSolve(n, t.fixed, t.edges, 2).count; if (c !== 1) { bad++; console.log('TANGO not unique'); } clues.push(t.fixed.filter(v => v >= 0).length + t.edges.length); } console.log('tango', n, 'extra', extra, 'clues', Math.min(...clues), '-', Math.max(...clues)); }
for (const [len, mids] of [[3, 2], [3, 3], [4, 3]]) { let fail = 0; for (let i = 0; i < 50; i++) if (!PS.ladderMake(PS.rng(i), len, mids)) fail++; if (fail) { bad++; console.log('LADDER fails', len, mids, fail); } }
for (const lv of [1, 2, 3]) for (let i = 0; i < 30; i++) { const { bars } = PS.beatsMake(PS.rng(i), lv); if (bars.length !== [4, 5, 6][lv - 1] || bars.some(b => b.sol.reduce((s, k) => s + PS.NOTES[k].beats, 0) !== b.T)) { bad++; console.log('BEATS bad'); } }
for (let i = 0; i < 40; i++) { const r = PS.rng(i), sol = PS.sudoku4(r); for (const g of [10, 8, 6]) { const h = PS.sudoku4Holes(r, sol, g); if (PS.sudoku4Count(h.map(x => x.slice())) !== 1) { bad++; console.log('SUDOKU4 not unique'); } } }
for (const n of [4, 5, 7]) for (let i = 0; i < 30; i++) { const c = PS.mazeMake(PS.rng(i), n), p = PS.mazePath(c, n); if (p[0] !== 0 || p[p.length - 1] !== n * n - 1) { bad++; console.log('MAZE bad'); } }
for (const p of PS.DOT_PICTURES) if (p.pts.some(q => q[0] < 0 || q[0] > 100 || q[1] < 0 || q[1] > 100 || isNaN(q[0]))) { bad++; console.log('DOTS out of range', p.name); }
console.log('dots per picture:', PS.DOT_PICTURES.map(p => p.pts.length).join(' '));
console.log('new puzzles checked in', Date.now() - t0, 'ms');
console.log(bad ? `${bad} problems` : 'all good');
