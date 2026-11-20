// Run: node tests/make-icon.mjs — draws the home-screen icon (a guinea pig on a rainbow) with headless Chromium.
import { chromium } from '/Users/andrewlord/Projects/Andrew_Game_Apps/video-pipeline/node_modules/playwright/index.mjs';
import fs from 'fs';
const pig = fs.readFileSync(new URL('../art/pigs.js', import.meta.url), 'utf8').match(/GUINEA_PIG_SVG = `([\s\S]*?)`;/)[1];
const html = `<html><body style="margin:0"><div id="i" style="width:512px;height:512px;display:grid;place-items:center;
  background:conic-gradient(from 200deg,#ff4fa3,#ff8a1f,#ffc21a,#2ec27e,#2f8cff,#8f5cff,#ff4fa3);">
  <div style="width:400px;height:400px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 10px 0 #0002">
  <div style="width:290px;height:290px">${pig.replace('<svg ', '<svg width="290" height="290" ')}</div></div>
  <div style="position:absolute;top:30px;right:40px;font-size:90px">🧩</div></div></body></html>`;
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 512, height: 512 } });
await p.setContent(html);
for (const s of [512, 180]) {
  await p.setViewportSize({ width: 512, height: 512 });
  const buf = await p.locator('#i').screenshot();
  fs.writeFileSync(new URL(`../art/icon-${s}.png`, import.meta.url), buf);
}
await b.close();
