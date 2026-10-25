// Rooktest op het gebouwde bestand: opent elke pagina in Chromium (als file://, zoals op het
// intranet of lokaal) en faalt bij JavaScript-fouten, ontbrekende koppen of horizontaal scrollen.
// Gebruik: npm run build && npm run smoke [-- --screenshots <map>]
import { createRequire } from 'node:module';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

// Playwright is geen vaste dependency: gebruik een lokale of globale installatie.
const { chromium } = createRequire(import.meta.url)('playwright');

const file = pathToFileURL(resolve('dist/samen-digitaal-playbook.html')).href;
const shotsIdx = process.argv.indexOf('--screenshots');
const shots = shotsIdx > -1 ? process.argv[shotsIdx + 1] : null;
if (shots) mkdirSync(shots, { recursive: true });

const ROUTES = [
  '', 'waarom', 'model', 'rollen', 'rollen/digital-lead', 'rollen/product-owner', 'ritme',
  'ritme/pi-planning', 'ritme/daily', 'sturen', 'woordenlijst', 'woordenlijst/wsjf', 'over', 'bestaat-niet'
];

const browser = await chromium.launch();
const fouten = [];

for (const [naam, viewport] of [['desktop', { width: 1440, height: 900 }], ['mobiel', { width: 375, height: 800 }]]) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (e) => fouten.push(`[${naam}] pageerror: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && fouten.push(`[${naam}] console: ${m.text()}`));
  page.on('request', (r) => !r.url().startsWith('file:') && !r.url().startsWith('data:') && fouten.push(`[${naam}] externe request: ${r.url()}`));

  await page.goto(file);
  for (const r of ROUTES) {
    await page.evaluate((h) => (location.hash = h), `#/${r}`);
    await page.waitForTimeout(250);
    const h1 = await page.locator('main h1').first().textContent().catch(() => null);
    if (!h1) fouten.push(`[${naam}] #/${r}: geen h1`);
    const overloop = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overloop > 1) fouten.push(`[${naam}] #/${r}: ${overloop}px horizontaal scrollen`);
    if (shots && ['', 'model', 'rollen/digital-lead', 'ritme/pi-planning', 'waarom'].includes(r)) {
      await page.waitForTimeout(2200);
      await page.screenshot({ path: `${shots}/${naam}-${r.replace(/\//g, '_') || 'start'}.png`, fullPage: true });
    }
  }

  if (naam === 'desktop') {
    // Explainer: volgende stap en presentatiemodus.
    await page.evaluate(() => (location.hash = '#/model'));
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: 'Volgende stap' }).click();
    const bijschrift = await page.locator('.bijschrift').textContent();
    if (!bijschrift?.includes('Waardestromen')) fouten.push(`explainer: stap 2 verwacht, kreeg "${bijschrift}"`);
    await page.getByRole('button', { name: 'Presenteren' }).click();
    await page.waitForTimeout(400);
    const presenting = await page.locator('.explainer.presenting').count();
    if (!presenting) fouten.push('explainer: presentatiemodus gaat niet aan');
    if (shots) await page.screenshot({ path: `${shots}/desktop-presentatie.png` });
    await page.keyboard.press('Escape');
    await page.getByRole('button', { name: 'Stoppen' }).click().catch(() => {});

    // Rol kiezen en route tonen.
    await page.evaluate(() => (location.hash = '#/'));
    await page.waitForTimeout(200);
    await page.getByRole('radio', { name: /Product Owner/ }).click();
    const route = await page.getByRole('heading', { name: /Jouw route als Product Owner/ }).count();
    if (!route) fouten.push('rolkeuze: route verschijnt niet');

    // Zoeken.
    await page.keyboard.press('Control+k');
    await page.keyboard.type('wsjf');
    await page.waitForTimeout(150);
    const treffers = await page.locator('#zoekresultaten [role=option]').count();
    if (!treffers) fouten.push('zoeken: geen resultaten voor "wsjf"');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    if (!(await page.evaluate(() => location.hash)).startsWith('#/')) fouten.push('zoeken: Enter navigeert niet');

    // Donker thema.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate(() => (location.hash = '#/ritme'));
    await page.waitForTimeout(2500);
    if (shots) await page.screenshot({ path: `${shots}/desktop-ritme-donker.png`, fullPage: false });
  }
  await page.close();
}

await browser.close();

if (fouten.length) {
  console.error(`✗ ${fouten.length} probleem/problemen:\n  ${fouten.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Rooktest geslaagd (${ROUTES.length} routes × 2 schermformaten, explainer, rolkeuze, zoeken)`);
