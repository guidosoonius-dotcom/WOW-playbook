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
  // Extra specialismen: gestippeld buiten de ring, ze horen alleen bij sommige teams.
  iso.fase = 4;
  [[118, -55], [128, -20], [100, 105]].forEach(([x, y]) => iso.mens(x, y, BLAUW, { spook: true }));
  iso.lijn([[105 * Math.cos(-0.45), 105 * Math.sin(-0.45)], [118, -55]], BLAUW, 1.6, { dash: '3 4', diepte: -1490 });
  iso.vonk(128, -20, 48, { r: 6 });
  return iso.klaar('Een productteam op een podium: zeven figuurtjes op een ringlijn rond hun product, een gebouw met een rood dak. Buiten de ring staan drie gestippelde figuurtjes: extra specialisten die sommige teams vast hebben. Een schoonmaakrobot rijdt zijn rondje, de schoonmaakkar staat klaar.');
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


// ---- Scènes voor de explainers: elke fase is een stap. iso.tot = n laat iets na stap n weer verdwijnen. ----

// "Van enkele rit naar ringlijn": project als rechte lijn, product als ringlijn.
function uitlegProduct() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW, achter: TAUPE });
  // Stap 1: een project is een enkele rit naar één eindhalte.
  iso.tot = 1;
  iso.lijn([[-130, -20], [118, -20]], INK, 5);
  for (const x of [-90, -30, 30, 80]) iso.halte(x, -20);
  iso.box(118, -32, 0, 10, 24, 16, RODE_BLOK, { diepte: 120 });
  iso.markering(123, -20, 44);
  iso.box(-120, -27, 0, 30, 14, 12, RODE_BLOK, { diepte: 300, cls: 'rijdt', stijl: '--dx: 190px; --dy: 110px' });
  iso.tot = 0;
  [[-110, 15, BLAUW], [-88, 20, WIT], [-100, 40, ROOD], [-76, 42, BLAUW]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  iso.ballon(-100, 15, 40, { inhoud: 'lijnen' });
  // Stap 2: bij de eindhalte stapt iedereen uit.
  iso.fase = 1;
  iso.tot = 1;
  [[95, 20, BLAUW], [135, 10, WIT], [100, 55, ROOD], [140, 45, BLAUW]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  iso.ballon(118, 30, 40, { inhoud: 'vraag', w: 44, h: 40, staart: 'rechts' });
  iso.spook(40, -110, 0, 40, 40, 50);
  // Stap 3: een product is een ringlijn met een vast team.
  iso.tot = null;
  iso.fase = 2;
  iso.ring(105, INK, 4);
  for (let i = 0; i < 4; i++) iso.halte(105 * Math.cos((i * Math.PI) / 2 + 0.4), 105 * Math.sin((i * Math.PI) / 2 + 0.4), INK, 6);
  iso.gebouw(-22, -22, 0, 44, 44, 56, { diepte: 0 });
  [[-60, 30, ROOD], [-40, 50, BLAUW], [40, -60, WIT], [60, -40, BLAUW], [50, 40, TAUPE3]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  // Stap 4: elke ronde is een iteratie, met feedback.
  iso.fase = 3;
  iso.rondrit(105, { dur: 7 });
  iso.ballon(60, -40, 34, { inhoud: 'vink', w: 60 });
  iso.ballon(-40, 50, 34, { inhoud: 'hart', w: 44, staart: 'rechts' });
  iso.vloerrobot(110, 80, { spoor: [[60, 110], [90, 95], [110, 80]], rijdt: [-30, 10] });
  // Stap 5: de waarde blijft groeien.
  iso.fase = 4;
  iso.box(-22, -22, 56, 44, 44, 16, RODE_BLOK, { diepte: 1 });
  iso.vonk(0, 0, 100, { r: 9 });
  iso.bord(-130, 75, { inhoud: 'groei' });
  iso.drone(-100, -100, 110);
  return iso.klaar('Een podium. Eerst een rechte lijn met een eindhalte waar het team uitstapt en de kennis verdwijnt. Daarna een ringlijn rond een product met een vast team: de trein rijdt rondjes, er komt feedback, en het product groeit elke ronde een verdieping.');
}

// "Drie ringen, één dienstregeling": dag, iteratie en kwartaal.
function uitlegRitme() {
  const iso = new Iso();
  iso.podium(R, { zij: BLAUW2, achter: TAUPE });
  // Stap 1: elke dag de daily.
  iso.ring(44, INK, 3);
  [[-14, -4, WIT], [10, 4, BLAUW], [-4, 22, ROOD]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  iso.ballon(-4, 0, 36, { w: 56, h: 34 });
  iso.rondrit(44, { dur: 3, kleur: INK });
  // Stap 2: elke twee weken een iteratie.
  iso.fase = 1;
  iso.ring(82, BLAUW, 3);
  for (let i = 0; i < 4; i++) iso.halte(82 * Math.cos((i * Math.PI) / 2 + 0.6), 82 * Math.sin((i * Math.PI) / 2 + 0.6), BLAUW, 5);
  iso.rondrit(82, { dur: 7, kleur: BLAUW });
  // Stap 3: elk kwartaal een planningsinterval van vijf iteraties.
  iso.fase = 2;
  iso.ring(120, ROOD, 3);
  for (let i = 0; i < 5; i++) iso.halte(120 * Math.cos((i * 2 * Math.PI) / 5 + 0.9), 120 * Math.sin((i * 2 * Math.PI) / 5 + 0.9), ROOD, 5);
  iso.markering(120 * Math.cos(0.9), 120 * Math.sin(0.9), 30);
  iso.bord(-125, -50, { inhoud: 'kalender', diepte: -150 });
  // Stap 4: de ringen grijpen in elkaar.
  iso.fase = 3;
  iso.rondrit(120, { dur: 14 });
  iso.lijn([[0, 0], [120 * Math.cos(0.9), 120 * Math.sin(0.9)]], INK, 1.6, { dash: '4 4', diepte: -1490 });
  iso.drone(70, -60, 130);
  // Stap 5: jouw plek in het ritme.
  iso.fase = 4;
  const [jx, jy] = [82 * Math.cos(Math.PI + 0.6), 82 * Math.sin(Math.PI + 0.6)];
  iso.mens(jx, jy, ROOD);
  iso.markering(jx, jy, 52);
  iso.ballon(jx, jy, 40, { inhoud: 'hart', w: 44, staart: 'rechts' });
  iso.vloerrobot(100, 95, { rijdt: [-24, 14] });
  return iso.klaar('Drie ringen op een podium. De binnenste ring is de daily, met drie figuurtjes. De blauwe ring is de iteratie van twee weken, de rode ring het kwartaal met vijf iteraties en de PI-planning. Treintjes rijden over alle ringen tegelijk. Jouw plek is gemarkeerd.');
}

// "Van idee naar epic": de portfoliokanban als lijn met haltes.
function uitlegEpic() {
  const iso = new Iso();
  iso.podium(165, { zij: ROOD2, achter: LROOD });
  iso.lijn([[-150, -40], [-40, -40], [-10, -10], [150, -10]], INK, 5);
  // Stap 1: elk idee begint in de trechter.
  iso.trechter(-125, -95, 0, 30, 42, { diepte: -200 });
  [[-130, -100, 70], [-118, -90, 92], [-128, -86, 112]].forEach(([x, y, z], i) =>
    iso.box(x, y, z, 10, 10, 10, { top: i % 2 ? LBLAUW : WIT }, { diepte: -190 + i, cls: 'valt' })
  );
  [[-120, 10, BLAUW], [-95, 25, WIT], [-130, 40, ROOD]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  iso.ballon(-95, 25, 36, { inhoud: 'lijnen', staart: 'rechts' });
  // Stap 2: eerste check, een deel stapt uit.
  iso.fase = 1;
  iso.poort(-62, -40);
  [[-80, 30], [-60, 45], [-45, 25]].forEach(([x, y], i) => iso.box(x, y, 0, 10, 10, 10, { top: TAUPE }, { diepte: x + y + i }));
  // Stap 3: analyseren met een lean business case.
  iso.fase = 2;
  iso.bord(-30, -100, { inhoud: 'grafiek' });
  iso.box(0, -20, 0, 20, 20, 20, RODE_BLOK);
  iso.mens(25, 30, BLAUW);
  iso.ballon(25, 30, 36, { inhoud: 'grafiek', w: 56 });
  // Stap 4: klaar voor uitvoering, wachten op ruimte.
  iso.fase = 3;
  [40, 62, 84].forEach((x, i) => iso.box(x, -17, 0, 16, 14, 14, RODE_BLOK, { diepte: 200 + i }));
  iso.halte(110, -10, ROOD, 8, { vul: ROOD });
  iso.poort(110, -10, { h: 26 });
  // Stap 5: bouwen, meten, beslissen.
  iso.fase = 4;
  iso.spook(95, -95, 0, 50, 50, 80);
  iso.gebouw(103, -87, 0, 34, 34, 34, { kol: 2, rijen: 1 });
  iso.vonk(120, -70, 100, { r: 8 });
  iso.drone(140, 60, 80);
  iso.schrobrobot(60, 60);
  return iso.klaar('De portfoliokanban als lijn op een podium. Ideeën vallen in een trechter; bij een slagboom valt een deel af. Een bord en een rood blok staan voor de business case. Goedgekeurde epics wachten in een rij bij een rode halte. Aan het eind wordt een klein gebouw gebouwd als MVP, binnen een gestippeld groter gebouw.');
}

// "Een PI-planning in twee dagen".
function uitlegPi() {
  const iso = new Iso();
  iso.podium(160, { zij: BLAUW, achter: LBLAUW });
  // Stap 1: dag 1, ochtend: iedereen hoort hetzelfde verhaal.
  iso.bord(-120, -100, { w: 100, h: 54, paal: 24, inhoud: 'scherm', diepte: -260 });
  iso.mens(-40, -70, ROOD);
  iso.mens(-15, -64, WIT);
  iso.tot = 0;
  for (let r = 0; r < 2; r++) for (let c = 0; c < 5; c++) iso.mens(-60 + c * 26, 10 + r * 28, [BLAUW, WIT, BLAUW, TAUPE3, ROOD][(c + r) % 5]);
  iso.tot = null;
  // Stap 2: dag 1, middag: teams plannen, het programmabord vult zich.
  iso.fase = 1;
  iso.bord(10, -110, { w: 120, h: 58, paal: 18, inhoud: 'stickers', diepte: -240 });
  for (const [tx, ty] of [[-80, 0], [20, 10]]) {
    iso.box(tx, ty, 0, 50, 30, 14);
    iso.koffie(tx + 14, ty + 12, 14, { diepte: tx + ty + 40.5 });
    iso.koffie(tx + 36, ty + 16, 14, { diepte: tx + ty + 40.6 });
    [[10, -10], [35, -10], [10, 44], [35, 44]].forEach(([dx, dy], k) => iso.mens(tx + dx, ty + dy, [BLAUW, WIT, ROOD, BLAUW][(k + (tx > 0 ? 1 : 0)) % 4]));
  }
  // Stap 3: managementreview.
  iso.fase = 2;
  iso.box(100, -35, 0, 34, 24, 12);
  [[105, 0, ROOD], [127, -2, WIT], [145, -25, BLAUW]].forEach(([x, y, kl]) => iso.mens(x, y, kl));
  iso.ballon(125, -15, 38, { inhoud: 'lijnen', staart: 'rechts' });
  // Stap 4: dag 2, bijstellen en risico's (ROAM).
  iso.fase = 3;
  iso.bord(-150, 55, { w: 60, h: 48, paal: 26, inhoud: 'roam' });
  iso.ballon(45, 10, 36, { inhoud: 'vink', w: 60 });
  // Stap 5: vertrouwensstem, en de trein vertrekt.
  iso.fase = 4;
  iso.ballon(-55, 0, 40, { inhoud: 'stem', w: 64, h: 44, staart: 'rechts' });
  iso.lijn([[-100, 105], [110, 105]], INK, 4);
  iso.halte(110, 105, ROOD, 7, { vul: ROOD });
  iso.box(-95, 98, 0, 34, 14, 12, RODE_BLOK, { diepte: 500, cls: 'rijdt', stijl: '--dx: 150px; --dy: 87px' });
  iso.vonk(110, 105, 40, { r: 8 });
  return iso.klaar('De PI-planning op een podium. Eerst een presentatie voor de hele zaal. Dan teamtafels met koffie en een programmabord vol stickers. Aan de zijkant de managementreview, links een bord voor de risico\'s. Tot slot de vertrouwensstem met vijf vingers, en de trein vertrekt.');
}

const TEKENINGEN = {
  model, waardestroom, productteam, backlog, productgroep, pi, ritme, portfolio,
  'uitleg-product': uitlegProduct, 'uitleg-ritme': uitlegRitme, 'uitleg-epic': uitlegEpic, 'uitleg-pi': uitlegPi
};
const cache = {};

export function tekening(naam) {
  if (!TEKENINGEN[naam]) return null;
  return (cache[naam] ??= TEKENINGEN[naam]());
}
