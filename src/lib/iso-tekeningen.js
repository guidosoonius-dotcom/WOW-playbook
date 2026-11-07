// De isometrische tekeningen van de playbook. Elke functie geeft { viewBox, items, fasen, label }.
// Een fase is een stap in de opbouw: iso.fase = n zet alles wat daarna komt in die stap.
import { Iso, K, ROOD, BLAUW } from './iso.js';
import { href } from './router.svelte.js';

// Het model in vier lagen, opengewerkt. Fasen volgen de explainer "Zo stroomt waarde door ons model".
function model() {
  const iso = new Iso();
  const W = 260, D = 200, G = 125;
  const lagen = [
    { naam: 'Productteams', route: 'uitleg/productteam' },
    { naam: 'Productgroepen', route: 'ritme/pi-planning' },
    { naam: 'Waardestromen', route: 'uitleg/waardestroom' },
    { naam: 'Portfolio', route: 'sturen' }
  ];
  const FASE = [2, 3, 1, 0];
  lagen.forEach((l, i) => {
    iso.fase = FASE[i];
    const z = i * G;
    iso.box(0, 0, z, W, D, 10, {}, { diepte: i * 1000 });
    iso.tekst(W, D / 2, z + 5, l.naam, { dx: 26, dy: 6, grootte: 18, href: href(l.route) });
    if (i < 3) {
      iso.lijn([[W, 0, z + 10], [W, 0, z + G]], K.stippel, 1.4, { diepte: i * 1000 + 990, dash: '4 4' });
      iso.lijn([[0, D, z + 10], [0, D, z + G]], K.stippel, 1.4, { diepte: i * 1000 + 990, dash: '4 4' });
    }
  });
  // Portfolio: epics en de stip.
  iso.fase = 0;
  [[60, 60], [130, 60], [200, 60]].forEach(([x, y], j) => iso.box(x - 14, y - 14, 3 * G + 10, 28, 28, 18, {}, { diepte: 3010 + j }));
  iso.box(118, 130, 3 * G + 10, 24, 24, 24, ROOD, { diepte: 3020 });
  // Waardestromen: twee lijnen.
  iso.fase = 1;
  iso.lijn([[10, 70, 2 * G + 10], [250, 70, 2 * G + 10]], K.lijn1, 4, { diepte: 2010 });
  iso.lijn([[10, 140, 2 * G + 10], [120, 140, 2 * G + 10], [160, 100, 2 * G + 10], [250, 100, 2 * G + 10]], K.lijn2, 4, { diepte: 2010 });
  iso.halte(250, 70, 2 * G + 10, K.lijn1, 7, { diepte: 2011 });
  iso.halte(250, 100, 2 * G + 10, K.lijn2, 7, { diepte: 2011 });
  // Productteams: figuurtjes in groepjes van vijf.
  iso.fase = 2;
  for (const [gx, gy] of [[40, 40], [140, 40], [40, 130], [140, 130]]) {
    [[0, 0], [22, 0], [0, 22], [22, 22], [11, 11]].forEach(([dx, dy], k) =>
      iso.pion(gx + dx + 10, gy + dy + 10, 10, k === 4 ? K.rood : K.lijn1, { diepte: 50 + gx + gy + dx + dy })
    );
  }
  // Productgroepen: teams op dezelfde lijn horen bij elkaar.
  iso.fase = 3;
  for (const [x, y, kl] of [[40, 30, K.lijn1], [40, 120, K.lijn2]]) {
    iso.lijn([[x - 10, y - 10, G + 10], [x + 190, y - 10, G + 10], [x + 190, y + 60, G + 10], [x - 10, y + 60, G + 10], [x - 10, y - 10, G + 10]], kl, 2, { diepte: 1005, dash: '6 5' });
    for (let k = 0; k < 3; k++) iso.box(x + k * 62, y, G + 10, 44, 44, 14, {}, { diepte: 1010 + k + y });
  }
  // Waarde: een rood blok rijdt over de lijn naar klant en collega.
  iso.fase = 4;
  iso.box(40, 62, 2 * G + 10, 30, 16, 10, ROOD, { diepte: 2012, rijdt: { dx: 155, dy: 90 } });
  return iso.klaar('Het model in vier lagen boven elkaar: bovenaan het portfolio met epics en de stip waar we naartoe werken, daaronder de waardestromen als lijnen, dan de productgroepen en onderaan de productteams.');
}

// Een waardestroom als lange baan, van vraag naar waarde.
function waardestroom() {
  const iso = new Iso();
  const L = 540;
  iso.box(0, 0, 0, L, 110, 12, {}, { diepte: 0 });
  iso.fase = 1;
  [70, 250, 420].forEach((x, i) => iso.box(x, 10, 12, 64, 30, 18 + (i % 2) * 12, {}, { diepte: 100 + x }));
  iso.tekst(250, 10, 42, 'digitale producten', { dx: 30, dy: -50, grootte: 16, gewicht: 600, kleur: K.lijn2 });
  iso.fase = 0;
  iso.lijn([[20, 64, 12], [L - 20, 64, 12]], K.lijn1, 5, { diepte: 50 });
  ['Aanvraag', 'Plannen', 'Inzetten', 'Uitvoeren', 'Factuur'].forEach((t, i) => {
    const x = 40 + i * 112;
    iso.halte(x, 64, 12, K.lijn1, 8, { diepte: 60 + i });
    iso.vlaktekst(x - 18, 86, 12, t, { grootte: 14 });
  });
  iso.box(-70, 40, 0, 44, 44, 44, {}, { diepte: -1 });
  iso.tekst(-48, 62, 44, 'Klant vraagt iets', { dy: -40, anker: 'middle' });
  iso.fase = 2;
  iso.box(L + 26, 40, 0, 44, 44, 60, ROOD, { diepte: 900 });
  iso.tekst(L + 48, 62, 60, 'Waarde', { dy: -40, anker: 'middle' });
  iso.box(40, 56, 12, 36, 16, 12, ROOD, { diepte: 400, rijdt: { dx: 400, dy: 230 } });
  return iso.klaar('Een waardestroom als lange baan: de klant vraagt iets, en langs vijf stappen (aanvraag, plannen, inzetten, uitvoeren, factuur) rijdt de waarde naar het rode blok. Achter de lijn staan de digitale producten die de stroom dragen.');
}

// Een productteam: een eiland met het product in het midden en het team op de ringlijn eromheen.
function productteam() {
  const iso = new Iso();
  iso.box(0, 0, 0, 230, 230, 14, {}, { diepte: 0 });
  iso.fase = 1;
  iso.box(85, 85, 14, 60, 60, 46, {}, { diepte: 300 });
  iso.box(97, 97, 60, 36, 36, 24, ROOD, { diepte: 310 });
  iso.tekst(145, 85, 84, 'Het product', { dx: 22, dy: -6 });
  iso.fase = 2;
  iso.ring(115, 115, 14, 96, K.lijn1, 4, { diepte: 5 });
  for (let i = 0; i < 7; i++) {
    const a = (i * 2 * Math.PI) / 7 + 0.3;
    const x = 115 + 96 * Math.cos(a), y = 115 + 96 * Math.sin(a);
    iso.pion(x, y, 14, i === 0 ? K.rood : i === 1 ? K.lijn2 : K.lijn1, { diepte: x + y + 14 });
  }
  iso.fase = 3;
  iso.tekst(230, 230, 0, '5 tot 9 mensen, één vast team', { dy: 40, anker: 'middle', grootte: 16, gewicht: 600 });
  iso.tekst(230, 230, 0, 'Bouwen · beheren · verbeteren', { dy: 62, anker: 'middle', grootte: 16, gewicht: 600, kleur: K.zacht });
  return iso.klaar('Een productteam als eiland: in het midden het product, op een ringlijn eromheen zeven figuurtjes. Eén vast team van 5 tot 9 mensen dat het product bouwt, beheert en verbetert.');
}

// Epics, features en stories: steeds kleiner opgeknipt.
function backlog() {
  const iso = new Iso();
  const G = 78;
  iso.box(0, 0, 0, 240, 120, 22, ROOD, { diepte: 0 });
  iso.tekst(240, 60, 11, 'Epic', { dx: 24, dy: 8, grootte: 18 });
  iso.tekst(0, 120, 0, 'Kwartalen', { dx: -20, dy: 22, anker: 'end', grootte: 14, gewicht: 600, kleur: K.zacht });
  iso.fase = 1;
  for (let i = 0; i < 3; i++) iso.box(i * 82, 0, G, 76, 120, 16, {}, { diepte: 1000 + i });
  iso.tekst(240, 60, G + 8, 'Features', { dx: 24, dy: 8, grootte: 18 });
  iso.tekst(0, 120, G, 'Weken', { dx: -20, dy: 18, anker: 'end', grootte: 14, gewicht: 600, kleur: K.zacht });
  iso.lijn([[240, 0, 22], [240, 0, G]], K.stippel, 1.4, { diepte: 990, dash: '4 4' });
  iso.lijn([[0, 120, 22], [0, 120, G]], K.stippel, 1.4, { diepte: 990, dash: '4 4' });
  iso.fase = 2;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i === 2 && j === 2) continue;
      iso.box(i * 82 + 4, j * 40 + 4, 2 * G, 32, 32, 12, (i + j) % 3 ? {} : BLAUW, { diepte: 2000 + i * 3 + j });
      iso.box(i * 82 + 40, j * 40 + 4, 2 * G, 32, 32, 12, {}, { diepte: 2000.5 + i * 3 + j });
    }
  }
  iso.tekst(240, 60, 2 * G + 6, 'Stories', { dx: 24, dy: 8, grootte: 18 });
  iso.tekst(0, 120, 2 * G, 'Dagen', { dx: -20, dy: 14, anker: 'end', grootte: 14, gewicht: 600, kleur: K.zacht });
  iso.lijn([[240, 0, G + 16], [240, 0, 2 * G]], K.stippel, 1.4, { diepte: 1990, dash: '4 4' });
  iso.lijn([[0, 120, G + 16], [0, 120, 2 * G]], K.stippel, 1.4, { diepte: 1990, dash: '4 4' });
  return iso.klaar('Een opengewerkte stapel: onderaan een rode epic, daarboven drie features en bovenaan kleine stories. Links de tijdschaal: kwartalen, weken, dagen.');
}

// Een productgroep: een station met een perron per team. Alle sporen komen samen in één lijn.
function productgroep() {
  const iso = new Iso();
  iso.box(0, 0, 0, 470, 220, 12, {}, { diepte: 0 });
  const sporen = [30, 80, 130, 180];
  iso.fase = 1;
  sporen.forEach((y, i) => {
    iso.lijn([[20, y, 12], [260, y, 12], [330, 105, 12], [450, 105, 12]], i % 2 ? K.lijn2 : K.lijn1, 4, { diepte: 20 + i });
  });
  iso.fase = 2;
  sporen.forEach((y, i) => {
    iso.box(60, y - 18, 12, 90, 12, 8, {}, { diepte: 60 + y });
    [0, 1, 2].forEach((k) => iso.pion(80 + k * 24, y - 12, 20, k === 0 && i === 0 ? K.rood : K.lijn1, { diepte: 100 + y + k }));
    iso.vlaktekst(170, y + 16, 12, `Team ${i + 1}`, { grootte: 14 });
  });
  iso.fase = 3;
  iso.halte(330, 105, 12, K.inkt, 14, { diepte: 600, vul: K.top });
  iso.halte(330, 105, 12, K.rood, 5, { diepte: 601, vul: K.rood });
  iso.tekst(330, 105, 12, 'PI-planning', { dx: 24, dy: 30 });
  iso.tekst(450, 105, 12, 'één waardestroom', { dx: 16, dy: -6, grootte: 15, gewicht: 600, kleur: K.lijn1 });
  return iso.klaar('Een productgroep als station: vier teams hebben elk een eigen perron en spoor. Alle sporen komen samen bij de PI-planning en lopen verder als één waardestroom.');
}

// De PI-planning: een zaal met teamtafels en het programmabord.
function pi() {
  const iso = new Iso();
  iso.box(0, 0, 0, 380, 300, 10, {}, { diepte: 0 });
  iso.fase = 1;
  iso.box(20, 0, 10, 340, 10, 110, {}, { diepte: 5 });
  iso.tekst(360, 0, 120, 'Programmabord', { dx: 12, dy: -6 });
  iso.fase = 2;
  const tafels = [[50, 90], [210, 90], [50, 200], [210, 200]];
  tafels.forEach(([x, y], t) => {
    iso.box(x, y, 10, 110, 50, 16, {}, { diepte: x + y + 60 });
    [[20, -14], [55, -14], [90, -14], [20, 64], [55, 64], [90, 64]].forEach(([dx, dy], k) =>
      iso.pion(x + dx, y + dy, 10, k === 0 && t === 0 ? K.rood : k === 1 ? K.lijn2 : K.lijn1, { diepte: x + dx + y + dy + 10 })
    );
  });
  iso.tekst(380, 150, 10, 'Alle teams plannen samen', { dx: 20, dy: 30, grootte: 15, gewicht: 600 });
  // Stickers en afhankelijkheden op het bord.
  iso.fase = 3;
  const kleuren = [K.top, K.blauw, K.top, K.top, K.rood, K.top, K.blauw, K.top];
  for (let r = 0; r < 2; r++) {
    for (let k = 0; k < 6; k++) iso.plakker(40 + k * 52, 10.5, 30 + r * 40, 30, 26, kleuren[(r * 6 + k) % 8], { diepte: 50 });
  }
  iso.fase = 4;
  iso.lijn([[107, 10.5, 83], [160, 10.5, 50], [263, 10.5, 83]], K.rood, 2, { diepte: 51 });
  iso.tekst(20, 0, 120, 'Afhankelijkheden', { dx: -12, dy: -6, anker: 'end', grootte: 15, gewicht: 600, kleur: K.rood });
  return iso.klaar('De PI-planning als zaal: achterin het programmabord met stickers en rode draden voor afhankelijkheden, ervoor vier teamtafels met figuurtjes. Alle teams plannen samen.');
}

// Het ritme: drie ringen boven elkaar (dag, iteratie, kwartaal).
function ritme() {
  const iso = new Iso();
  const ringen = [
    { r: 150, z: 0, naam: 'Kwartaal · PI-planning', kleur: K.rood },
    { r: 105, z: 110, naam: 'Iteratie · 2 weken', kleur: K.lijn2 },
    { r: 60, z: 210, naam: 'Dag · daily stand-up', kleur: K.lijn1 }
  ];
  ringen.forEach((g, i) => {
    iso.fase = i;
    iso.schijf(0, 0, g.z, g.r + 22, 10, { diepte: i * 1000 });
    iso.ring(0, 0, g.z + 10, g.r, g.kleur, 4, { diepte: i * 1000 + 1 });
    const haltes = i === 0 ? 5 : i === 1 ? 5 : 1;
    for (let h = 0; h < haltes; h++) {
      const a = Math.PI / 4 + (h * 2 * Math.PI) / haltes;
      iso.halte(g.r * Math.cos(a), g.r * Math.sin(a), g.z + 10, g.kleur, 7, { diepte: i * 1000 + 2 });
    }
    iso.tekst(g.r + 22, -(g.r + 22), g.z + 10, g.naam, { dx: 22, dy: 6, grootte: 18 });
  });
  iso.fase = 3;
  iso.lijn([[0, 0, 10], [0, 0, 110]], K.stippel, 1.4, { diepte: 999, dash: '4 4' });
  iso.lijn([[0, 0, 120], [0, 0, 210]], K.stippel, 1.4, { diepte: 1999, dash: '4 4' });
  return iso.klaar('Het ritme als drie ringen boven elkaar: onderaan het kwartaal met de PI-planning, daarboven de iteratie van twee weken, bovenaan de dag met de daily stand-up.');
}

// Portfolio en budget: een bak per waardestroom, elk kwartaal opnieuw gevuld.
function portfolio() {
  const iso = new Iso();
  iso.box(0, 0, 0, 420, 150, 10, {}, { diepte: 0 });
  const bakken = [
    { x: 20, naam: 'Klant & contract', vulling: 3 },
    { x: 155, naam: 'Planning & inzet', vulling: 2 },
    { x: 290, naam: 'Mensen & organisatie', vulling: 1 }
  ];
  iso.fase = 1;
  bakken.forEach((b) => {
    iso.bak(b.x, 30, 10, 110, 90, 54, { diepte: b.x + 100 });
    iso.vlaktekst(b.x + 4, 136, 10, b.naam, { grootte: 13 });
  });
  iso.fase = 2;
  bakken.forEach((b) => {
    for (let k = 0; k < b.vulling; k++) {
      const x = b.x + 22 + (k % 2) * 36, y = 52 + Math.floor(k / 2) * 30;
      iso.box(x, y, 10 + 54 - 22, 30, 30, 22, ROOD, { diepte: b.x + 101 + k });
    }
  });
  iso.fase = 3;
  bakken.forEach((b, i) => {
    iso.box(b.x + 40, 60, 140 + i * 18, 28, 28, 20, ROOD, { diepte: 5000 + i, valt: true });
  });
  iso.tekst(420, 75, 10, 'Budget per waardestroom,', { dx: 22, dy: 10, grootte: 15, gewicht: 600 });
  iso.tekst(420, 75, 10, 'elk kwartaal opnieuw verdeeld', { dx: 22, dy: 28, grootte: 15, gewicht: 600 });
  return iso.klaar('Portfolio en budget: drie bakken, één per waardestroom. Rode blokken budget vallen elk kwartaal in de bakken; niet per project, maar per waardestroom.');
}

const TEKENINGEN = { model, waardestroom, productteam, backlog, productgroep, pi, ritme, portfolio };
const cache = {};

export function tekening(naam) {
  if (!TEKENINGEN[naam]) return null;
  return (cache[naam] ??= TEKENINGEN[naam]());
}
