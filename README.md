# Puzzle Sheet

A sheet of six puzzles for Maya (7), made fresh whenever she asks, for the
iPad. Bright, big and touch-friendly, with Melody, Barnaby, Harmony and the
guinea pigs as hosts. Plain HTML, JavaScript and CSS: no build step, no
dependencies, no backend.

**On the iPad:** open the page in Safari, tap Share, then **Add to Home
Screen**. It then opens full screen like an app and works offline.

## The puzzles
| Puzzle | Host | Levels |
|---|---|---|
| Word Search | Evie | 8×8 across and down → 9×9 with diagonals → 10×10, backwards too |
| Crossword (written clues) | Barnaby | about 6 → 8 → 10 words |
| Veggie Sudoku (6×6, pictures) | Dreamy | 20 → 16 → 13 given, always one answer |
| Secret Picture (nonogram) | Harmony | 5×5 → 7×7/8×8 → 10×10, every picture solvable by logic |
| Secret Code | Melody | full key → 2 letters missing → 4 missing |
| Note Words (music) | Melody | notes in the stave → adds Middle C and low D → adds high G |

Themes lean on her favourites (guinea pigs, music, Christmas, wizards, pop
stars, building bricks, chocolate, the stage, drawing, a sneaky pink
detective) about three times in four.

## Voting and levels
After each puzzle she answers two questions with one tap each:
- **Did you like it?** 😕 / ❤️ / ❤️❤️ / ❤️❤️❤️. New sheets pick puzzle kinds by
  her average hearts (last 8 votes); "not for me" ones only turn up now and then.
- **How hard was it?** 😎 too easy (that puzzle goes up a level) / 🙂 just
  right / 😅 tricky (down a level).

The **Grown-ups** link at the bottom of the sheet shows the votes and levels.

Stars (3, or fewer with hints) go to the **Guinea Pig Garden** in Pip's Maths:
every andrewlord311-sudo.github.io site shares one origin, so adding to
`ttg_rewards` is what the other games do.

Saved in `localStorage`: `ps_sheet` (current sheet), `ps_votes`, `ps_levels`.

## Files
- `index.html`, `manifest.webmanifest`, `sw.js` (offline cache; bump `VERSION` when files are added)
- `css/style.css`
- `js/core.js` (random seeds, saving, stars, votes, sheet, sounds, keyboard), `js/words.js` (themes, clues, messages), `js/app.js` (screens)
- `js/puzzles/` one file per puzzle, each `PS.PUZZLES.<id> = { name, icon, colour, host, intro, render(el, ctx) }`
- `art/` characters (copied from Andrew_Game_Apps `music/mascots.js` and PipsPaintPots `pigs.js`), fonts, icons
- `tests/check-generators.js` (`node tests/check-generators.js`: pictures solve by logic, sudokus have one answer, crosswords lay out), `tests/make-icon.mjs`

**Testing:** `?play=<id>&level=1..3&seed=N` opens one puzzle directly.
Public repo: use Maya and Theo, never the children's real names.
