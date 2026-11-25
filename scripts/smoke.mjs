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
  '', 'waarom', 'uitgangspunten', 'spelregels', 'manieren', 'manieren/keuzehulp', 'teams', 'portfolio', 'hulpmiddelen', 'templates', 'implementatie', 'samenwerking', 'verbeteren', 'doen/gereedschap/idee-project-kaart', 'model', 'rollen', 'rollen/digital-lead', 'rollen/product-owner', 'ritme',
  'ritme/pi-planning', 'ritme/daily', 'sturen', 'woordenlijst', 'woordenlijst/wsjf', 'over', 'beslissen', 'doen',
  'doen/dilemmas', 'doen/teamscan', 'transitie', 'uitleg', 'uitleg/waardestroom', 'uitleg/productteam',
  'uitleg/epics-features-stories', 'doen/gereedschap', 'doen/gereedschap/wsjf', 'doen/gereedschap/teamcharter',
  'doen/gereedschap/retrospectives', 'doen/gereedschap/pi-planningskit', 'doen/gereedschap/waardestroom-in-kaart', 'doen/gereedschap/kaderscheck',
  'doen/gereedschap/portfoliokanban', 'doen/gereedschap/probleemoplossing', 'doen/gereedschap/okr-opsteller', 'bestaat-niet'
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
    if (shots && ['', 'model', 'rollen/digital-lead', 'ritme/pi-planning', 'waarom', 'beslissen', 'doen/dilemmas', 'doen/teamscan', 'transitie', 'uitleg/waardestroom', 'uitleg/productteam', 'uitleg/epics-features-stories'].includes(r)) {
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

    // De lijnen van de hero-animatie vallen niet over de knoppen (gangbare laptopformaten).
    for (const [w, h] of naam === 'desktop' ? [[1152, 720], [1366, 768], [1536, 864]] : []) {
      await page.setViewportSize({ width: w, height: h });
      await page.waitForTimeout(150);
      const overlap = await page.evaluate(() => {
        const knop = document.querySelector('.knoppen')?.getBoundingClientRect();
        const svg = document.querySelector('.hero-beeld svg');
        if (!knop || !svg) return null;
        const r = svg.getBoundingClientRect();
        const vb = svg.viewBox.baseVal;
        const lijnTop = r.top + (385 - vb.y) * (r.width / vb.width); // bovenkant van de lijnen in de tekening
        return Math.round(knop.bottom - lijnTop);
      });
      if (overlap === null) fouten.push(`hero ${w}×${h}: knoppen of tekening niet gevonden`);
      else if (overlap > -8) fouten.push(`hero ${w}×${h}: de lijnen komen ${overlap + 8}px te dicht bij of over de knoppen`);
    }
    await page.setViewportSize(viewport);

    // Gereedschapskist: invullen, rekenen en bewaren na herladen.
    await page.evaluate(() => (location.hash = '#/doen/gereedschap/wsjf'));
    await page.waitForTimeout(250);
    await page.locator('td.naam input').first().fill('Rooktest-item');
    await page.locator('tbody tr').first().locator('select').first().selectOption('8');
    await page.waitForTimeout(150);
    if (!(await page.locator('.volgorde li').first().innerText()).includes('10')) fouten.push('gereedschap: WSJF rekent niet (verwacht 10)');
    await page.reload();
    await page.waitForTimeout(300);
    if ((await page.locator('td.naam input').first().inputValue()) !== 'Rooktest-item') fouten.push('gereedschap: werk niet bewaard na herladen');
    page.once('dialog', (d) => d.accept());
    await page.getByRole('button', { name: 'Leegmaken' }).click();
    await page.evaluate(() => (location.hash = '#/'));
    await page.waitForTimeout(200);

    // Doorklikken begint bovenaan; terug brengt je naar waar je was.
    await page.evaluate(() => window.scrollTo({ top: 2000, behavior: 'instant' }));
    await page.waitForTimeout(150);
    const vertrek = await page.evaluate(() => Math.round(window.scrollY));
    await page.evaluate(() => (location.hash = '#/transitie'));
    await page.waitForTimeout(250);
    const nieuw = await page.evaluate(() => window.scrollY);
    if (nieuw > 5) fouten.push(`scroll: nieuwe pagina begint op ${Math.round(nieuw)} in plaats van bovenaan`);
    await page.goBack();
    await page.waitForTimeout(400);
    const terug = await page.evaluate(() => Math.round(window.scrollY));
    if (Math.abs(terug - vertrek) > 5) fouten.push(`scroll: terug komt op ${terug} in plaats van ${vertrek}`);

    // Zoeken.
    await page.keyboard.press('Control+k');
    await page.keyboard.type('wsjf');
    await page.waitForTimeout(150);
    const treffers = await page.locator('#zoekresultaten [role=option]').count();
    if (!treffers) fouten.push('zoeken: geen resultaten voor "wsjf"');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(200);
    if (!(await page.evaluate(() => location.hash)).startsWith('#/')) fouten.push('zoeken: Enter navigeert niet');

    // Dilemma beantwoorden.
    await page.evaluate(() => (location.hash = '#/doen/dilemmas'));
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: 'Alle', exact: true }).click();
    await page.locator('.optie').first().click();
    if (!(await page.locator('.leerpunt').count())) fouten.push('dilemma: leerpunt verschijnt niet na een keuze');

    // Teamscan: één stelling invullen geeft een score.
    await page.evaluate(() => (location.hash = '#/doen/teamscan'));
    await page.waitForTimeout(200);
    await page.locator('.punt').nth(3).click();
    const score = await page.locator('.duidingen li').count();
    if (!score) fouten.push('teamscan: geen duiding na het invullen van een stelling');
    if (shots) await page.screenshot({ path: `${shots}/desktop-teamscan-ingevuld.png`, fullPage: false });

    // Beslismatrix: filter op rol.
    await page.evaluate(() => (location.hash = '#/beslissen'));
    await page.waitForTimeout(200);
    if ((await page.locator('tbody tr').count()) < 5) fouten.push('beslismatrix: te weinig rijen');

    // Uitleg: voorbeeld wisselen, rol kiezen, feature openklappen.
    await page.evaluate(() => (location.hash = '#/uitleg/waardestroom'));
    await page.waitForTimeout(200);
    await page.getByRole('radio', { name: 'Van planning tot inzet' }).click();
    if (!(await page.getByText('Rooster maken').count())) fouten.push('uitleg waardestroom: voorbeeld wisselt niet');
    await page.evaluate(() => (location.hash = '#/uitleg/productteam'));
    await page.waitForTimeout(200);
    await page.getByRole('radio', { name: 'Tester' }).click();
    if (!(await page.getByRole('heading', { name: 'Tester' }).count())) fouten.push('uitleg productteam: rolkaart verschijnt niet');
    await page.evaluate(() => (location.hash = '#/uitleg/epics-features-stories'));
    await page.waitForTimeout(200);
    await page.getByRole('button', { name: /Kwaliteitsrapport voor de klant/ }).click();
    if (!(await page.getByText('Als klant wil ik per week zien').count())) fouten.push('uitleg epics: feature klapt niet open');

    // Donker thema.
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.evaluate(() => (location.hash = '#/ritme'));
    await page.waitForTimeout(2500);
    if (shots) await page.screenshot({ path: `${shots}/desktop-ritme-donker.png`, fullPage: false });
  }
  await page.close();
}

// Menu met vier blokken en de nieuwe pagina's, op een laptop en op een telefoon.
for (const [naam, viewport] of [['laptop', { width: 1280, height: 720 }], ['telefoon', { width: 390, height: 800 }]]) {
  const page = await browser.newPage({ viewport });
  page.on('pageerror', (e) => fouten.push(`[${naam}] pageerror: ${e.message}`));
  await page.goto(file);
  await page.waitForTimeout(300);
  const knoppen = await page.locator('header nav button.blok').count();
  if (knoppen !== 4) fouten.push(`[${naam}] menu: ${knoppen} blokken in plaats van 4`);
  if (naam === 'laptop') {
    const afgekapt = await page.evaluate(() => {
      const ul = document.querySelector('header nav > ul');
      return ul.scrollWidth > ul.clientWidth + 1;
    });
    if (afgekapt) fouten.push('[laptop] menu: de blokken passen niet naast het logo');
  }
  await page.locator('header nav button.blok[data-blok="B"]').click();
  const items = await page.locator('#blok-B .items a').count();
  if (items !== 5) fouten.push(`[${naam}] menu: blok B heeft ${items} pagina's in plaats van 5`);
  const buiten = await page.evaluate(() => {
    const r = document.querySelector('#blok-B').getBoundingClientRect();
    return r.left < -1 || r.right > innerWidth + 1;
  });
  if (buiten) fouten.push(`[${naam}] menu: het paneel valt buiten het scherm`);
  await page.keyboard.press('Escape');
  if (await page.locator('#blok-B').count()) fouten.push(`[${naam}] menu: Esc sluit het paneel niet`);
  await page.locator('header nav button.blok[data-blok="B"]').click();
  await page.locator('#blok-B .items a', { hasText: 'Manieren van werken' }).click();
  await page.waitForTimeout(250);
  if (!(await page.evaluate(() => location.hash)).endsWith('/manieren')) fouten.push(`[${naam}] menu: klik op Manieren van werken navigeert niet`);
  if (await page.locator('#blok-B').count()) fouten.push(`[${naam}] menu: paneel blijft open na navigeren`);

  // Keuzehulp: vast team, project, servicedesk en "Weet ik niet".
  const kies = async (id, w) => page.locator('#keuzehulp fieldset', { hasText: id }).locator('.opties button').nth(w).click();
  const uitkomst = async () => (await page.locator('#keuzehulp .uitkomst h3').textContent())?.trim();
  if ((await uitkomst()) !== 'Nog niet bekend') fouten.push(`[${naam}] keuzehulp: begint niet leeg`);
  for (const [q, w] of [['Blijft de waarde bestaan', 0], ['Is er al een team', 0], ['Weet je vooraf', 0], ['harde einddatum', 0], ['bestaand team dat er capaciteit', 0], ['formele besluitmomenten', 0]]) await kies(q, w);
  if ((await uitkomst()) !== 'Vast team') fouten.push(`[${naam}] keuzehulp: allemaal blijvend geeft "${await uitkomst()}" in plaats van Vast team`);
  for (const [q, w] of [['Blijft de waarde bestaan', 1], ['Is er al een team', 1], ['Weet je vooraf', 1], ['harde einddatum', 1], ['bestaand team dat er capaciteit', 1], ['formele besluitmomenten', 1]]) await kies(q, w);
  if ((await uitkomst()) !== 'Project') fouten.push(`[${naam}] keuzehulp: allemaal tijdelijk geeft "${await uitkomst()}" in plaats van Project`);
  for (const [q, w] of [['Blijft de waarde bestaan', 2], ['Is er al een team', 2], ['Weet je vooraf', 2]]) await kies(q, w);
  if ((await uitkomst()) !== 'Gemengd beeld' && (await uitkomst()) !== 'Eerst verduidelijken') fouten.push(`[${naam}] keuzehulp: drie keer "weet ik niet" geeft "${await uitkomst()}"`);
  await page.locator('#keuzehulp fieldset', { hasText: 'storing of een serviceverzoek' }).locator('.opties button').first().click();
  if ((await uitkomst()) !== 'Servicedesk') fouten.push(`[${naam}] keuzehulp: storing geeft "${await uitkomst()}" in plaats van Servicedesk`);
  await page.getByRole('button', { name: 'Opnieuw beginnen' }).click();
  if ((await uitkomst()) !== 'Nog niet bekend') fouten.push(`[${naam}] keuzehulp: opnieuw beginnen wist niet`);

  // Idee Project Kaart: invullen tot "klaar voor de intake".
  await page.evaluate(() => (location.hash = '#/doen/gereedschap/idee-project-kaart'));
  await page.waitForTimeout(250);
  if (!(await page.getByText('Nog niet klaar').count())) fouten.push(`[${naam}] IPK: begint niet als "Nog niet klaar"`);
  const velden = [['Eigenaar', 'Teamleider Planning'], ['Wat is het probleem', 'Ruilen kost veel telefoontjes'], ['Voor wie', 'Planners'], ['Wat is het doel', 'Ruilen zonder planner'], ['Verwacht resultaat', 'Minder uren planning'], ['Past het bij de strategie', 'Thema digitale dienstverlening']];
  for (const [label, tekst] of velden) await page.getByLabel(label, { exact: false }).first().fill(tekst);
  if (!(await page.getByText('Klaar voor de intake').count())) fouten.push(`[${naam}] IPK: wordt niet "Klaar voor de intake" na invullen`);

  // Rollen filteren op groep.
  await page.evaluate(() => (location.hash = '#/rollen'));
  await page.waitForTimeout(250);
  const alle = await page.locator('main .rolkaart').count();
  await page.getByRole('button', { name: /^Project en programma/ }).click();
  const twee = await page.locator('main .rolkaart').count();
  if (alle < 20 || twee !== 2) fouten.push(`[${naam}] rollen: ${alle} kaarten in totaal en ${twee} bij Project en programma (verwacht 2)`);
  const overloop = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  if (overloop > 1) fouten.push(`[${naam}] rollen: ${overloop}px horizontaal scrollen`);
  await page.close();
}

await browser.close();

if (fouten.length) {
  console.error(`✗ ${fouten.length} probleem/problemen:\n  ${fouten.join('\n  ')}`);
  process.exit(1);
}
console.log(`✓ Rooktest geslaagd (${ROUTES.length} routes × 2 schermformaten, explainer, rolkeuze, zoeken, dilemma, teamscan, beslismatrix, uitleg, gereedschap, menu met vier blokken, keuzehulp, rollen)`);
