// Bouwt elke presentatie in presentaties/<naam>/bron.html tot één losse HTML in dist/,
// met het lettertype Inter erin, zodat het bestand ook zonder internet werkt.
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const wortel = new URL('..', import.meta.url).pathname;
const map = join(wortel, 'presentaties');
const font = readFileSync(join(wortel, 'node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2')).toString('base64');
const fontCss = `@font-face { font-family: 'Inter Variable'; font-style: normal; font-display: swap; font-weight: 100 900; src: url(data:font/woff2;base64,${font}) format('woff2'); }`;

mkdirSync(join(wortel, 'dist'), { recursive: true });
for (const naam of readdirSync(map)) {
  const bron = join(map, naam, 'bron.html');
  if (!existsSync(bron)) continue;
  const html = readFileSync(bron, 'utf8');
  if (!html.includes('/*FONT*/')) throw new Error(`${bron}: de plek /*FONT*/ voor het lettertype ontbreekt`);
  const uit = join(wortel, 'dist', `presentatie-${naam}.html`);
  writeFileSync(uit, html.replace('/*FONT*/', fontCss));
  console.log(`✓ ${uit.replace(wortel, '')} (${Math.round(Buffer.byteLength(readFileSync(uit)) / 1024)} kB)`);
}
