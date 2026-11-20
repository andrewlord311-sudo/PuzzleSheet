// Works offline once opened: serve from the cache, refresh it in the background.
// Bump VERSION when files are added.
const VERSION = 'ps-v9';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.webmanifest',
  'art/mascots.js', 'art/pigs.js', 'art/icon-180.png',
  'art/fonts/fredoka-one.woff2', 'art/fonts/quicksand.woff2', 'art/fonts/noto-music.woff2',
  'js/core.js', 'js/players.js', 'js/words.js', 'js/app.js',
  'js/puzzles/wordsearch.js', 'js/puzzles/crossword.js', 'js/puzzles/sudoku.js',
  'js/puzzles/nonogram.js', 'js/puzzles/code.js', 'js/puzzles/music.js',
  'js/puzzles/queens.js', 'js/puzzles/zip.js', 'js/puzzles/tango.js', 'js/puzzles/scramble.js', 'js/puzzles/ladder.js', 'js/puzzles/beats.js',
  'js/puzzles/blocks.js', 'js/puzzles/sudoku4.js', 'js/puzzles/dots.js', 'js/puzzles/maze.js', 'js/puzzles/bonds.js', 'js/puzzles/phonics.js', 'js/puzzles/jigsaw.js', 'js/puzzles/sudoku9.js', 'js/puzzles/kenken.js', 'js/puzzles/cryptogram.js', 'js/puzzles/adult.js',
];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async c => {
    const hit = await c.match(e.request);
    const fresh = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; }).catch(() => hit);
    return hit || fresh;
  }));
});
