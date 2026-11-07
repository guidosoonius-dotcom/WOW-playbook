// De isometrische tekeningen van de playbook, in de podiumstijl. Elke functie geeft { viewBox, items, fasen, label }.
// iso.fase = n zet alles wat daarna komt in die stap van de opbouw (bij in beeld komen, of per stap in een explainer).
import { Iso, INK, WIT, TAUPE, TAUPE3, BRUIN, ROOD, BLAUW, BLAUW2, ROOD2, LBLAUW, LROOD, RODE_BLOK } from './iso.js';
import { href } from './router.svelte.js';

const R = 150; // straal van een podium

// Het model als vier podia boven elkaar. De fasen volgen de explainer "Zo stroomt waarde door ons model".
function model() {
  const iso = new Iso();
  iso.k = 0.78;
  const G = 150;
  const r = 120;
  const lagen = [
    { naam: 'Productteams', route: 'uitleg/productteam', fase: 2, zij: BLAUW },
    { naam: 'Productgroepen', route: 'ritme/pi-planning', fase: 3, zij: BLAUW2 },
    { naam: 'Waardestromen', route: 'uitleg/waardestroom', fase: 1, zij: BLAUW },
    { naam: 'Portfolio', route: 'sturen', fase: 0, zij: ROOD2 }
  ];
  lagen.forEach((l, i) => {
    iso.fase = l.fase;
    iso.oz = i * G;
    iso.podium(r, { h: 12, zij: l.zij, cirkel: false });
    iso.tekst(r * 0.86, -r * 0.5, 0, l.naam, { dx: 24, dy: 0, href: href(l.route) });
  });
  // Portfolio: epics, de stip en een bord met de koers.
  iso.fase = 0;
  iso.oz = 3 * G;
  [[-50, -10], [-10, -40], [30, -70]].forEach(([x, y], j) => iso.box(x - 12, y - 12, 0, 24, 24, 18, {}, { diepte: 10 + j }));
  iso.box(10, 30, 0, 22, 22, 22, RODE_BLOK);
  iso.markering(21, 41, 44);
  iso.bord(-95, 40, { w: 56, h: 36, paal: 26, inhoud: 'grafiek' });
  iso.mens(55, 30, ROOD);
  iso.mens(75, 5, WIT);
  // Waardestromen: twee lijnen met haltes, een drone die meekijkt.
  iso.fase = 1;
  iso.oz = 2 * G;
  iso.lijn([[-100, -30], [100, -30]], INK, 4);
  iso.lijn([[-100, 40], [-20, 40], [10, 10], [100, 10]], BLAUW, 4);
  for (const x of [-60, 0, 60]) iso.halte(x, -30, INK, 5);
  for (const x of [-70, 50]) iso.halte(x, x < 0 ? 40 : 10, BLAUW, 5);
  iso.halte(100, -30, ROOD, 7, { vul: ROOD });
  iso.drone(-40, 70, 60);
  // Productteams: groepjes figuurtjes, een robot die schoonmaakt.
  iso.fase = 2;
  iso.oz = 0;
  for (const [gx, gy] of [[-60, -50], [30, -60], [-50, 40], [40, 30]]) {
    [[0, 0, BLAUW], [20, 0, WIT], [0, 20, ROOD], [20, 20, BLAUW]].forEach(([dx, dy, kl]) => iso.mens(gx + dx, gy + dy, kl));
  }
  iso.vloerrobot(90, 70, { spoor: [[20, 95], [60, 85], [90, 70]], rijdt: [-30, -10] });
  // Productgroepen: gebouwen in gestippelde clusters, de schoonmaakkar staat klaar.
  iso.fase = 3;
  iso.oz = G;
  for (const [x, y, kl] of [[-90, -60, INK], [-90, 20, BLAUW]]) {
    iso.lijn([[x - 8, y - 8], [x + 160, y - 8], [x + 160, y + 50], [x - 8, y + 50], [x - 8, y - 8]], kl, 2, { dash: '6 5', diepte: -1490 });
    for (let k = 0; k < 3; k++) iso.gebouw(x + k * 55, y, 0, 36, 36, 26 + ((k + (y > 0 ? 1 : 0)) % 2) * 10, { kol: 2, rijen: 1 });
  }
  iso.schoonmaakkar(80, 70);
  // Waarde rijdt over de lijn.
  iso.fase = 4;
  iso.oz = 2 * G;
  iso.box(-90, -36, 0, 26, 12, 10, RODE_BLOK, { diepte: 500, cls: 'rijdt', stijl: '--dx: 120px; --dy: 68px' });
  iso.oz = 0;
  return iso.klaar('Het model als vier podia boven elkaar: bovenaan het portfolio met epics en de stip, daaronder de waardestromen als lijnen met haltes, dan de productgroepen als clusters van gebouwen, en onderaan de productteams.');
}

// Een waardestroom: van de vraag van een klant tot de waarde, langs de teams.
function waardestroom() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW, achter: LBLAUW });
  iso.lijn([[-130, 40], [-40, 40], [10, -10], [130, -10]], INK, 5);
  for (const [x, y] of [[-100, 40], [-50, 40], [60, -10]]) iso.halte(x, y);
  iso.halte(110, -10, ROOD, 8, { vul: ROOD });
  iso.gebouw(-110, -30, 0, 34, 34, 44, { diepte: -60 });
  iso.fase = 1;
  iso.gebouw(-20, -90, 0, 44, 40, 88, { diepte: -40 });
  iso.gebouw(40, -80, 0, 40, 36, 62, { diepte: 0 });
  iso.mens(40, 60);
  iso.mens(70, 40, ROOD);
  iso.boom(-60, 90);
  iso.boom(110, 90, BRUIN);
  iso.camera(-125, 0, 60);
  iso.fase = 2;
  iso.ballon(-93, -13, 54);
  iso.box(-120, 32, 0, 30, 14, 12, RODE_BLOK, { diepte: 40, cls: 'rijdt', stijl: '--dx: 200px; --dy: -30px' });
  iso.markering(110, -10, 40);
  iso.lijn([[110, -10, 0], [110, -10, 28]], ROOD, 2, { dash: '3 3', diepte: 9000 });
  iso.vloerrobot(20, 95, { spoor: [[-30, 110], [0, 95], [20, 95]], rijdt: [-30, 8] });
  iso.drone(0, 115, 70);
  return iso.klaar('Een waardestroom op een podium: een lijn met haltes loopt van het gebouw waar de klant iets vraagt, langs de teams, naar de rode halte waar de waarde aankomt. Een camera en een drone kijken mee, een schoonmaakrobot houdt de baan schoon.');
}

// Een productteam: het team op een ringlijn rond zijn product.
function productteam() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW2, achter: TAUPE });
  iso.fase = 1;
  iso.gebouw(-25, -25, 0, 50, 50, 70, { diepte: 0 });
  iso.box(-12, -12, 70, 24, 24, 16, RODE_BLOK, { diepte: 1 });
  iso.fase = 2;
  iso.ring(105, INK, 3);
  for (let i = 0; i < 7; i++) {
    const a = (i * 2 * Math.PI) / 7 + 0.4;
    iso.mens(105 * Math.cos(a), 105 * Math.sin(a), [ROOD, BLAUW, WIT, BLAUW, TAUPE3, BLAUW, WIT][i]);
  }
  iso.boom(-110, 30, BRUIN);
  iso.boom(60, -110);
  iso.fase = 3;
  iso.ballon(10, -30, 92, { inhoud: 'vink', w: 70 });
  iso.vloerrobot(40, 45, { spoor: [[-50, 60], [-10, 62], [20, 50], [40, 45]], rijdt: [-40, -12] });
  iso.schoonmaakkar(-120, 70);
  iso.drone(-90, -90, 120);
  return iso.klaar('Een productteam op een podium: zeven figuurtjes op een ringlijn rond hun product, een gebouw met een rood dak. Een schoonmaakrobot rijdt zijn rondje, de schoonmaakkar staat klaar.');
}

// Epics, features en stories: steeds kleiner opgeknipt, met een bord dat laat zien wat klaar is.
function backlog() {
  const iso = new Iso();
  iso.podium(R, { zij: ROOD2, achter: LROOD });
  iso.box(-80, -50, 0, 120, 80, 16, RODE_BLOK);
  iso.fase = 1;
  for (let i = 0; i < 3; i++) iso.box(-78 + i * 40, -48, 16, 36, 76, 12, {}, { diepte: 10 + i });
  iso.fase = 2;
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) if (!(i === 2 && j === 1)) iso.box(-74 + i * 40, -42 + j * 36, 28, 28, 28, 10, { top: (i + j) % 2 ? LBLAUW : WIT }, { diepte: 20 + i + j });
  iso.spook(6, -6, 28, 28, 28, 10, { diepte: 30 });
  iso.fase = 3;
  iso.bord(-125, 75, { inhoud: 'kanban', diepte: 120 });
  iso.mens(60, 70, BLAUW);
  iso.mens(90, 40, WIT);
  iso.boom(80, -100);
  iso.vonk(-20, -50, 80, { r: 8 });
  iso.schrobrobot(20, 85);
  return iso.klaar('Een stapel blokken op een podium: onderaan een rode epic, daarop drie features en daarop kleine stories. Eén story is nog gestippeld. Op een kanbanbord staat wat klaar is.');
}

// Een productgroep: een station met een perron per team; alle sporen komen samen bij de PI-planning.
function productgroep() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW, achter: LBLAUW });
  const sporen = [-90, -45, 0, 45];
  iso.fase = 1;
  sporen.forEach((y, i) => iso.lijn([[-120, y], [10, y], [60, 10], [130, 10]], i % 2 ? BLAUW : INK, 4));
  iso.fase = 2;
  sporen.forEach((y, i) => {
    iso.box(-100, y - 22, 0, 70, 12, 6, {}, { diepte: y - 100 });
    [0, 1, 2].forEach((k) => iso.mens(-88 + k * 22, y - 16, i === 0 && k === 0 ? ROOD : [BLAUW, WIT, BLAUW][k], { z: 6, diepte: y - 99 + k }));
  });
  iso.fase = 3;
  iso.halte(60, 10, INK, 14, { diepte: -1300 });
  iso.halte(60, 10, ROOD, 5, { vul: ROOD, diepte: -1299 });
  iso.ballon(60, 10, 18, { inhoud: 'vink', w: 60 });
  iso.camera(110, -60, 56);
  iso.koffie(-10, 70, 0);
  iso.koffie(4, 78, 0);
  iso.boom(90, 80, BRUIN);
  return iso.klaar('Een productgroep als station op een podium: vier teams hebben elk een eigen perron en spoor. Alle sporen komen samen bij de PI-planning en lopen verder als één waardestroom.');
}

// De PI-planning: teamtafels met koffie en het programmabord met afhankelijkheden.
function pi() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW, achter: LBLAUW });
  iso.fase = 1;
  iso.bord(-60, -70, { w: 130, h: 60, paal: 20, inhoud: 'stickers', diepte: -200 });
  iso.fase = 2;
  for (const [tx, ty] of [[-70, 10], [30, 10]]) {
    iso.box(tx, ty, 0, 50, 30, 14);
    iso.koffie(tx + 14, ty + 12, 14, { diepte: tx + ty + 40.5 });
    iso.koffie(tx + 36, ty + 16, 14, { diepte: tx + ty + 40.6 });
    [[10, -10], [35, -10], [10, 44], [35, 44]].forEach(([dx, dy], k) => iso.mens(tx + dx, ty + dy, [BLAUW, WIT, ROOD, BLAUW][(k + (tx > 0 ? 1 : 0)) % 4]));
  }
  iso.fase = 3;
  iso.ballon(-60, 0, 40, { staart: 'rechts' });
  iso.ballon(60, 10, 40, { inhoud: 'vink', w: 60 });
  iso.boom(-120, 40, BRUIN);
  iso.boom(110, -60);
  iso.schoonmaakkar(110, 20);
  iso.camera(100, -110, 70);
  return iso.klaar('De PI-planning op een podium: achterin het programmabord met stickers en een rode draad voor een afhankelijkheid, ervoor twee teamtafels met koffie en figuurtjes. Alle teams plannen samen.');
}

// Het ritme: dag, iteratie en kwartaal als ringen in elkaar.
function ritme() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW2, achter: TAUPE });
  iso.ring(120, ROOD, 3);
  for (let i = 0; i < 6; i++) iso.halte(120 * Math.cos((i * Math.PI) / 3), 120 * Math.sin((i * Math.PI) / 3), ROOD, 5);
  iso.fase = 1;
  iso.ring(82, BLAUW, 3);
  for (let i = 0; i < 5; i++) iso.halte(82 * Math.cos((i * 2 * Math.PI) / 5), 82 * Math.sin((i * 2 * Math.PI) / 5), BLAUW, 5);
  iso.fase = 2;
  iso.ring(44, INK, 3);
  iso.mens(-20, 0, WIT);
  iso.mens(10, 10, BLAUW);
  iso.mens(-5, 25, ROOD);
  iso.fase = 3;
  iso.box(84, -18, 0, 26, 14, 10, RODE_BLOK, { diepte: 80 });
  iso.bord(-125, -50, { inhoud: 'kalender', diepte: -150 });
  iso.ballon(5, 15, 36, { w: 56, h: 34 });
  iso.vloerrobot(57, -59, { diepte: 60, rijdt: [-24, 30] });
  iso.drone(70, -50, 130);
  return iso.klaar('Het ritme op een podium: drie ringen in elkaar. De buitenste rode ring is het kwartaal, de blauwe de iteratie van twee weken, de binnenste de dag. Op de kalender staat de volgende PI-planning.');
}

// Portfolio en budget: budget valt elk kwartaal in de waardestromen; een epic staat nog gestippeld in de trechter.
function portfolio() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW, achter: LBLAUW });
  iso.fase = 1;
  [[-90, 40], [-30, 72], [30, 54]].forEach(([x, h]) => iso.gebouw(x, -40, 0, 44, 44, h, { diepte: x }));
  iso.spook(80, -60, 0, 40, 40, 80);
  iso.vonk(100, -40, 100, { r: 8 });
  iso.fase = 2;
  [[-68, 70], [-8, 104], [52, 86]].forEach(([x, z], i) => {
    iso.box(x - 7, -25, z, 14, 14, 8, RODE_BLOK, { diepte: 500 + i, cls: 'valt' });
    iso.lijn([[x, -18, z + 8], [x, -18, z + 30]], ROOD, 1.6, { dash: '3 3', diepte: 499 });
  });
  iso.fase = 3;
  iso.bord(-130, 70, { inhoud: 'grafiek', diepte: 140 });
  iso.mens(40, 80, ROOD);
  iso.mens(75, 60, WIT);
  iso.boom(-110, -60, BRUIN);
  iso.schrobrobot(-20, 70);
  return iso.klaar('Portfolio en budget op een podium: drie gebouwen voor drie waardestromen, met rode blokken budget die erin vallen. Een gestippeld gebouw is een epic die nog in de trechter zit.');
}

const TEKENINGEN = { model, waardestroom, productteam, backlog, productgroep, pi, ritme, portfolio };
const cache = {};

export function tekening(naam) {
  if (!TEKENINGEN[naam]) return null;
  return (cache[naam] ??= TEKENINGEN[naam]());
}
