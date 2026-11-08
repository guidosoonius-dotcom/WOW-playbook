// Isometrisch tekenen in de podiumstijl: scènes op een rond podium met een cirkel erachter,
// donkerblauwe omlijning, gebouwen met ramen, figuurtjes, ballonnen, borden en Facilicom-details
// (drones en camera's van Trigion, schoonmaakrobots en -kar van GOM, koffie van Prorest).
//
// Elk onderdeel wordt een stukje SVG met een diepte (tekenvolgorde) en een fase (opbouw).
// iso.fase = n zet alles wat daarna komt in die stap.

const C = Math.cos(Math.PI / 6);

export const INK = '#004077';
export const WIT = '#FFFFFF';
export const CREME = '#F7F4F2';
export const TAUPE = '#E3DCD9';
export const TAUPE2 = '#D7CCC8';
export const TAUPE3 = '#BCAAA3';
export const BRUIN = '#A1887F';
export const ROOD = '#C8261B';
export const ROOD2 = '#AB2016';
export const ROOD3 = '#8E1A12';
export const BLAUW = '#1473C3';
export const BLAUW2 = '#0A599E';
export const LBLAUW = '#CFE0F1';
export const LROOD = '#F2D7D4';
export const RODE_BLOK = { top: ROOD, links: ROOD2, rechts: ROOD3 };

const r1 = (n) => Math.round(n * 10) / 10;
const SW = 2;

export class Iso {
  constructor() {
    this.items = [];
    this.bx = [Infinity, Infinity, -Infinity, -Infinity];
    this.fase = 0;
    this.k = 1; // schaal van de wereld (x, y, z); figuurtjes en details houden hun formaat
    this.oz = 0; // verticale verschuiving in schermpixels, voor gestapelde podia
    this.tot = null; // zet een laatste stap: wat daarna komt verdwijnt na die stap weer
  }

  grens(X, Y) {
    const b = this.bx;
    b[0] = Math.min(b[0], X);
    b[1] = Math.min(b[1], Y);
    b[2] = Math.max(b[2], X);
    b[3] = Math.max(b[3], Y);
  }
  p(x, y, z = 0) {
    const k = this.k;
    const X = (x - y) * C * k;
    const Y = ((x + y) * 0.5 - z) * k - this.oz;
    this.grens(X, Y);
    return [X, Y];
  }
  pts(...ps) {
    return ps.map((q) => this.p(...q).map(r1).join(',')).join(' ');
  }
  pad(...ps) {
    return 'M' + ps.map((q) => this.p(...q).map(r1).join(' ')).join(' L');
  }
  add(diepte, svg, cls = '', stijl = '') {
    this.items.push({ diepte: diepte + this.oz * 10, n: this.items.length, f: this.fase, t: this.tot, svg, cls, stijl });
  }
  poly(pts, fill, sw = SW) {
    return `<polygon points="${pts}" fill="${fill}" stroke="${INK}" stroke-width="${sw}" stroke-linejoin="round"/>`;
  }

  // Een blok met drie zichtbare vlakken.
  box(x, y, z, w, d, h, kleur = {}, o = {}) {
    const { top = WIT, links = TAUPE, rechts = TAUPE3 } = kleur;
    const svg =
      this.poly(this.pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]), rechts) +
      this.poly(this.pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]), links) +
      this.poly(this.pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]), top);
    this.add(o.diepte ?? x + w / 2 + y + d / 2 + z / 4, svg, o.cls, o.stijl);
  }

  // Gestippeld draadmodel: iets dat er nog niet is.
  spook(x, y, z, w, d, h, o = {}) {
    const P = (i, j, k) => [x + i * w, y + j * d, z + k * h];
    const ribben = [
      [P(0, 0, 0), P(1, 0, 0)], [P(1, 0, 0), P(1, 1, 0)], [P(1, 1, 0), P(0, 1, 0)], [P(0, 1, 0), P(0, 0, 0)],
      [P(0, 0, 1), P(1, 0, 1)], [P(1, 0, 1), P(1, 1, 1)], [P(1, 1, 1), P(0, 1, 1)], [P(0, 1, 1), P(0, 0, 1)],
      [P(0, 0, 0), P(0, 0, 1)], [P(1, 0, 0), P(1, 0, 1)], [P(1, 1, 0), P(1, 1, 1)], [P(0, 1, 0), P(0, 1, 1)]
    ];
    const pad = ribben.map(([a, b]) => this.pad(a, b)).join(' ');
    this.add(o.diepte ?? x + y + w + d, `<path d="${pad}" stroke="${INK}" stroke-width="1.6" stroke-dasharray="5 4" fill="none"/>`);
  }

  // Gebouw met ramen op beide zichtbare gevels.
  gebouw(x, y, z, w, d, h, o = {}) {
    const dp = o.diepte ?? x + w / 2 + y + d / 2 + z / 4;
    this.box(x, y, z, w, d, h, { top: o.dak ?? TAUPE2, links: CREME, rechts: TAUPE }, { diepte: dp });
    const rijen = o.rijen ?? Math.max(1, Math.floor(h / 22));
    const kol = o.kol ?? 2;
    let g = '';
    for (let r = 0; r < rijen; r++) {
      const z0 = z + 8 + (r * (h - 12)) / rijen;
      const hh = ((h - 12) / rijen) * 0.55;
      for (let k = 0; k < kol; k++) {
        const x0 = x + ((k + 0.5) * w) / kol - 4;
        g += this.poly(this.pts([x0, y + d, z0], [x0 + 8, y + d, z0], [x0 + 8, y + d, z0 + hh], [x0, y + d, z0 + hh]), (r + k) % 3 ? BLAUW : WIT, 1.4);
        const y0 = y + ((k + 0.5) * d) / kol - 4;
        g += this.poly(this.pts([x + w, y0, z0], [x + w, y0 + 8, z0], [x + w, y0 + 8, z0 + hh], [x + w, y0, z0 + hh]), (r + k + 1) % 3 ? BLAUW : WIT, 1.4);
      }
    }
    this.add(dp + 0.01, g);
  }

  // Het podium: een platte cilinder met een grote cirkel erachter.
  podium(r, o = {}) {
    const { h = 16, top = CREME, zij = BLAUW, achter = LBLAUW, cirkel = true } = o;
    const [X, Y] = this.p(0, 0, 0);
    const rx = r * 1.2247 * this.k, ry = r * 0.7071 * this.k, R = r * 1.1 * this.k;
    this.grens(X - rx, Y + ry + h);
    this.grens(X + rx, Y + ry + h);
    if (cirkel) {
      this.grens(X, Y - R * 1.5);
      this.add(-3000, `<circle cx="${r1(X)}" cy="${r1(Y - R * 0.45)}" r="${r1(R)}" fill="${achter}"/>`);
    }
    this.add(
      -2000,
      `<path d="M${r1(X - rx)} ${r1(Y)} V${r1(Y + h)} A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(X + rx)} ${r1(Y + h)} V${r1(Y)} Z" fill="${zij}" stroke="${INK}" stroke-width="${SW}"/>` +
        `<ellipse cx="${r1(X)}" cy="${r1(Y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${top}" stroke="${INK}" stroke-width="${SW}"/>`
    );
  }

  ring(r, kleur = INK, sw = 3, o = {}) {
    const [X, Y] = this.p(o.cx ?? 0, o.cy ?? 0, 0);
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    this.add(o.diepte ?? -1500, `<ellipse cx="${r1(X)}" cy="${r1(Y)}" rx="${r1(r * 1.2247 * this.k)}" ry="${r1(r * 0.7071 * this.k)}" fill="none" stroke="${kleur}" stroke-width="${sw}"${dash}/>`);
  }

  lijn(punten, kleur = INK, sw = 3, o = {}) {
    const dash = o.dash ? ` stroke-dasharray="${o.dash}"` : '';
    this.add(o.diepte ?? -1500, `<path d="${this.pad(...punten)}" fill="none" stroke="${kleur}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"${dash}/>`);
  }

  halte(x, y, kleur = INK, r = 6, o = {}) {
    const [X, Y] = this.p(x, y, o.z ?? 0);
    this.add(o.diepte ?? -1400, `<ellipse cx="${r1(X)}" cy="${r1(Y)}" rx="${r1(r * 1.25)}" ry="${r1(r * 0.75)}" fill="${o.vul ?? WIT}" stroke="${kleur}" stroke-width="2.5"/>`);
  }

  // Een figuurtje: lijfje en hoofdje, geen herkenbaar beroep.
  mens(x, y, kleur = BLAUW, o = {}) {
    const [X, Y] = this.p(x, y, o.z ?? 0);
    this.grens(X - 9, Y - 34);
    if (o.spook) {
      // Gestippeld figuurtje: een specialist die erbij komt als het product erom vraagt.
      const lijn = `fill="${WIT}" fill-opacity=".6" stroke="${INK}" stroke-width="1.6" stroke-dasharray="3 2.5"`;
      this.add(
        o.diepte ?? x + y + 1,
        `<path d="M${r1(X - 8)} ${r1(Y)} V${r1(Y - 10)} Q${r1(X - 8)} ${r1(Y - 19)} ${r1(X)} ${r1(Y - 19)} Q${r1(X + 8)} ${r1(Y - 19)} ${r1(X + 8)} ${r1(Y - 10)} V${r1(Y)} Q${r1(X)} ${r1(Y + 4)} ${r1(X - 8)} ${r1(Y)} Z" ${lijn}/>` +
          `<circle cx="${r1(X)}" cy="${r1(Y - 26)}" r="6.5" ${lijn}/>`
      );
      return;
    }
    const svg =
      `<path d="M${r1(X - 8)} ${r1(Y)} V${r1(Y - 10)} Q${r1(X - 8)} ${r1(Y - 19)} ${r1(X)} ${r1(Y - 19)} Q${r1(X + 8)} ${r1(Y - 19)} ${r1(X + 8)} ${r1(Y - 10)} V${r1(Y)} Q${r1(X)} ${r1(Y + 4)} ${r1(X - 8)} ${r1(Y)} Z" fill="${kleur}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>` +
      `<circle cx="${r1(X)}" cy="${r1(Y - 26)}" r="6.5" fill="${TAUPE2}" stroke="${INK}" stroke-width="1.8"/>`;
    this.add(o.diepte ?? x + y + 1, svg);
  }

  boom(x, y, kleur = BLAUW, o = {}) {
    const [X, Y] = this.p(x, y, o.z ?? 0);
    this.grens(X - 10, Y - 34);
    const svg =
      `<path d="M${r1(X)} ${r1(Y)} V${r1(Y - 16)}" stroke="${INK}" stroke-width="2.2" stroke-linecap="round"/>` +
      `<circle cx="${r1(X)}" cy="${r1(Y - 23)}" r="9" fill="${kleur}" stroke="${INK}" stroke-width="1.8"/>` +
      `<path d="M${r1(X - 3)} ${r1(Y - 27)} q2 -3 5 -2" stroke="${WIT}" stroke-width="1.6" fill="none" stroke-linecap="round"/>`;
    this.add(o.diepte ?? x + y + 1, svg);
  }

  // Tekstballon in schermrichting, met een staartje naar het anker.
  ballon(x, y, z, o = {}) {
    const { w = 64, h = 40, inhoud = 'lijnen', staart = 'links', diepte = 9000 } = o;
    const [X, Y] = this.p(x, y, z);
    const bx = X - (staart === 'links' ? 12 : w - 12), by = Y - h - 12;
    this.grens(bx, by);
    this.grens(bx + w, Y);
    const f = r1;
    let g =
      `<path d="M${f(bx + 8)} ${f(by)} H${f(bx + w - 8)} Q${f(bx + w)} ${f(by)} ${f(bx + w)} ${f(by + 8)} V${f(by + h - 8)} Q${f(bx + w)} ${f(by + h)} ${f(bx + w - 8)} ${f(by + h)} ` +
      `H${f(X + 8)} L${f(X)} ${f(Y)} L${f(X - 2)} ${f(by + h)} H${f(bx + 8)} Q${f(bx)} ${f(by + h)} ${f(bx)} ${f(by + h - 8)} V${f(by + 8)} Q${f(bx)} ${f(by)} ${f(bx + 8)} ${f(by)} Z" fill="${WIT}" stroke="${INK}" stroke-width="1.8" stroke-linejoin="round"/>`;
    if (inhoud === 'lijnen') {
      for (let i = 0; i < 3; i++) g += `<path d="M${f(bx + 12)} ${f(by + 12 + i * 8)} H${f(bx + w - (i ? 14 : 24))}" stroke="${i ? TAUPE3 : INK}" stroke-width="3" stroke-linecap="round"/>`;
    } else if (inhoud === 'vink') {
      g += `<circle cx="${f(bx + 18)}" cy="${f(by + h / 2)}" r="8" fill="${BLAUW}" stroke="${INK}" stroke-width="1.4"/><path d="M${f(bx + 14)} ${f(by + h / 2)} l3 3 l5 -6" stroke="${WIT}" stroke-width="2" fill="none" stroke-linecap="round"/>`;
      for (let i = 0; i < 2; i++) g += `<path d="M${f(bx + 32)} ${f(by + h / 2 - 5 + i * 9)} H${f(bx + w - 10)}" stroke="${TAUPE3}" stroke-width="3" stroke-linecap="round"/>`;
    } else if (inhoud === 'hart') {
      g += `<path d="M${f(bx + w / 2)} ${f(by + h / 2 + 8)} l-9 -9 a5 5 0 0 1 9 -6 a5 5 0 0 1 9 6 z" fill="${ROOD}" stroke="${INK}" stroke-width="1.4"/>`;
    } else if (inhoud === 'vraag') {
      g += `<text x="${f(bx + w / 2)}" y="${f(by + h / 2 + 9)}" text-anchor="middle" font-size="26" font-weight="800" fill="${ROOD}">?</text>`;
    } else if (inhoud === 'stem') {
      // Vijf vingers: de vertrouwensstem.
      [14, 20, 22, 20, 12].forEach((hv, i) => {
        g += `<rect x="${f(bx + 10 + i * ((w - 20) / 5))}" y="${f(by + h - 8 - hv)}" width="${f((w - 20) / 5 - 3)}" height="${hv}" rx="3" fill="${i < 4 ? BLAUW : TAUPE}" stroke="${INK}" stroke-width="1.2"/>`;
      });
    } else if (inhoud === 'grafiek') {
      g += `<path d="M${f(bx + 10)} ${f(by + h - 10)} L${f(bx + 22)} ${f(by + h - 18)} L${f(bx + 32)} ${f(by + h - 14)} L${f(bx + w - 12)} ${f(by + 10)}" stroke="${ROOD}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${f(bx + w - 12)}" cy="${f(by + 10)}" r="3" fill="${ROOD}"/>`;
    }
    this.add(diepte, g, 'ballon');
  }

  // Een bord op een paal, met het vlak naar links-voor.
  bord(x, y, o = {}) {
    const { w = 70, h = 46, paal = 40, inhoud = 'grafiek' } = o;
    const z0 = paal;
    const [X0, Y0] = this.p(x + w / 2, y, 0);
    const [, Yp] = this.p(x + w / 2, y, z0);
    let g = `<path d="M${r1(X0)} ${r1(Y0)} V${r1(Yp)}" stroke="${INK}" stroke-width="2.4"/>`;
    g += this.poly(this.pts([x, y, z0], [x + w, y, z0], [x + w, y, z0 + h], [x, y, z0 + h]), WIT);
    const vakje = (xx, zz, bw, bh, kl) => this.poly(this.pts([xx, y, zz], [xx + bw, y, zz], [xx + bw, y, zz + bh], [xx, y, zz + bh]), kl, 1.2);
    if (inhoud === 'grafiek') {
      g += `<path d="${this.pad([x + 8, y, z0 + 10], [x + 24, y, z0 + 20], [x + 38, y, z0 + 16], [x + w - 10, y, z0 + h - 10])}" stroke="${ROOD}" stroke-width="2.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
    } else if (inhoud === 'kanban') {
      const kw = (w - 12) / 3;
      for (let c = 0; c < 3; c++)
        for (let r = 0; r < 3 - c; r++) g += vakje(x + 6 + c * kw, z0 + h - 12 - r * 11, kw - 4, 8, r === 0 ? [WIT, LBLAUW, ROOD][c] : TAUPE);
    } else if (inhoud === 'kalender') {
      for (let r = 0; r < 3; r++)
        for (let c = 0; c < 4; c++) g += vakje(x + 8 + (c * (w - 16)) / 4, z0 + 8 + r * 11, 9, 7, r === 1 && c === 2 ? ROOD : TAUPE);
    } else if (inhoud === 'groei') {
      const trap = [[x + 8, z0 + 8], [x + 20, z0 + 8], [x + 20, z0 + 16], [x + 32, z0 + 16], [x + 32, z0 + 25], [x + 44, z0 + 25], [x + 44, z0 + 34], [x + w - 8, z0 + 34]];
      g += `<path d="${this.pad(...trap.map(([a, b]) => [a, y, b]))}" stroke="${ROOD}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
      const [Xe, Ye] = this.p(x + w - 8, y, z0 + 34);
      g += `<circle cx="${r1(Xe)}" cy="${r1(Ye)}" r="3" fill="${ROOD}"/>`;
    } else if (inhoud === 'roam') {
      const kl = [ROOD, LBLAUW, TAUPE, WIT];
      const bw = (w - 18) / 2, bh = (h - 18) / 2;
      for (let i = 0; i < 4; i++) g += vakje(x + 6 + (i % 2) * (bw + 6), z0 + 6 + Math.floor(i / 2) * (bh + 6), bw, bh, kl[i]);
    } else if (inhoud === 'scherm') {
      g += vakje(x + 6, z0 + 6, w - 12, h - 12, LBLAUW);
      g += `<path d="${this.pad([x + 14, y, z0 + 14], [x + 30, y, z0 + 24], [x + 44, y, z0 + 18], [x + w - 14, y, z0 + h - 14])}" stroke="${ROOD}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>`;
    } else if (inhoud === 'stickers') {
      const kl = [WIT, LBLAUW, WIT, ROOD, WIT, LBLAUW, TAUPE, WIT];
      for (let r = 0; r < 2; r++) for (let c = 0; c < 6; c++) g += vakje(x + 8 + (c * (w - 16)) / 6, z0 + 10 + r * 20, (w - 16) / 6 - 4, 12, kl[(r * 6 + c) % 8]);
      g += `<path d="${this.pad([x + 8 + (w - 16) / 12, y, z0 + 36], [x + w / 2, y, z0 + 18], [x + w - 8 - (w - 16) / 12, y, z0 + 36])}" stroke="${ROOD}" stroke-width="2" fill="none"/>`;
    }
    this.add(o.diepte ?? x + w / 2 + y + 2, g);
  }

  // Rode stip met een wit sterretje.
  markering(x, y, z, o = {}) {
    const r = o.r ?? 11;
    const [X, Y] = this.p(x, y, z);
    this.add(o.diepte ?? 9500, `<circle cx="${r1(X)}" cy="${r1(Y)}" r="${r}" fill="${ROOD}" stroke="${INK}" stroke-width="1.8"/><path d="${ster(X, Y, r * 0.62)}" fill="${WIT}"/>`);
  }
  vonk(x, y, z, o = {}) {
    const [X, Y] = this.p(x, y, z);
    this.add(o.diepte ?? 9400, `<path d="${ster(X, Y, o.r ?? 7)}" fill="${ROOD}"/>`, 'twinkel');
  }

  cil(x, y, z, r, h, o = {}) {
    const { top = WIT, zij = TAUPE, sw = 1.8 } = o;
    const [X, Y] = this.p(x, y, z + h);
    const rx = r * 1.2247 * this.k, ry = r * 0.7071 * this.k;
    h *= this.k;
    this.grens(X - rx, Y - ry);
    this.grens(X + rx, Y + ry + h);
    const svg =
      `<path d="M${r1(X - rx)} ${r1(Y)} V${r1(Y + h)} A${r1(rx)} ${r1(ry)} 0 0 0 ${r1(X + rx)} ${r1(Y + h)} V${r1(Y)} Z" fill="${zij}" stroke="${INK}" stroke-width="${sw}"/>` +
      `<ellipse cx="${r1(X)}" cy="${r1(Y)}" rx="${r1(rx)}" ry="${r1(ry)}" fill="${top}" stroke="${INK}" stroke-width="${sw}"/>`;
    return [X, Y, svg];
  }

  // Trigion: drone met vier rotoren, rood lampje en een schaduw.
  drone(x, y, z, o = {}) {
    const [Xg, Yg] = this.p(x, y, 0);
    const [X, Y] = this.p(x, y, z);
    this.grens(X - 28, Y - 14);
    let g = `<ellipse cx="${r1(Xg)}" cy="${r1(Yg)}" rx="14" ry="7" fill="${INK}" opacity=".15"/>`;
    g += `<path d="M${r1(X)} ${r1(Y + 6)} V${r1(Yg - 4)}" stroke="${INK}" stroke-width="1.2" stroke-dasharray="2 4" opacity=".5"/>`;
    let lijf = '';
    const armen = [[-18, -6], [18, -6], [-14, 6], [14, 6]];
    for (const [dx, dy] of armen) lijf += `<path d="M${r1(X)} ${r1(Y)} L${r1(X + dx)} ${r1(Y + dy)}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    for (const [dx, dy] of armen) lijf += `<ellipse cx="${r1(X + dx)}" cy="${r1(Y + dy - 3)}" rx="9" ry="3.2" fill="${LBLAUW}" stroke="${INK}" stroke-width="1.6"/>`;
    lijf += `<rect x="${r1(X - 9)}" y="${r1(Y - 5)}" width="18" height="10" rx="4" fill="${WIT}" stroke="${INK}" stroke-width="1.8"/>`;
    lijf += `<circle cx="${r1(X)}" cy="${r1(Y + 7)}" r="3" fill="${INK}"/><circle cx="${r1(X + 5)}" cy="${r1(Y - 1)}" r="2" fill="${ROOD}"/>`;
    this.add(o.diepte ?? 9200, g + `<g class="zweef">${lijf}</g>`);
  }

  // Trigion: camera op een paal met een gestippelde kijkhoek.
  camera(x, y, hoogte = 56, o = {}) {
    const links = o.links ?? true;
    const [X0, Y0] = this.p(x, y, 0);
    const [X, Y] = this.p(x, y, hoogte);
    const r = links ? -1 : 1;
    const bx = X + r * 6;
    const lx = links ? bx - 22 : bx + 22;
    let g = `<path d="M${r1(X0)} ${r1(Y0)} V${r1(Y)}" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`;
    g += `<path d="M${r1(X)} ${r1(Y)} l${r * 6} -6" stroke="${INK}" stroke-width="2.4"/>`;
    g += `<path d="M${r1(lx - r * 2)} ${r1(Y - 6)} l${r * 40} 34 M${r1(lx)} ${r1(Y - 6)} l${r * 14} 44" stroke="${BLAUW}" stroke-width="1.2" stroke-dasharray="3 3" opacity=".7"/>`;
    g += `<g transform="rotate(${r * -18} ${r1(bx)} ${r1(Y - 10)})"><rect x="${r1(bx - (links ? 22 : 0))}" y="${r1(Y - 16)}" width="22" height="11" rx="2.5" fill="${WIT}" stroke="${INK}" stroke-width="1.8"/>`;
    g += `<rect x="${r1(lx - (links ? 4 : 0))}" y="${r1(Y - 14)}" width="4" height="7" fill="${INK}"/><circle class="knipper" cx="${r1(bx - r * 4)}" cy="${r1(Y - 13)}" r="1.6" fill="${ROOD}"/></g>`;
    this.grens(X - 50, Y - 20);
    this.grens(X + 50, Y0);
    this.add(o.diepte ?? x + y + 1, g);
  }

  // GOM: ronde schoonmaakrobot met een glanzend nat spoor; hij rijdt heen en weer langs het spoor.
  vloerrobot(x, y, o = {}) {
    if (o.spoor) {
      const d = this.pad(...o.spoor.map(([a, b]) => [a, b, 0]));
      this.add(-1450, `<path d="${d}" fill="none" stroke="${LBLAUW}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${WIT}" stroke-width="2" stroke-linecap="round" stroke-dasharray="1 9"/>`);
    }
    const [X, Y, cil] = this.cil(x, y, 0, 13, 7, { top: WIT, zij: BLAUW });
    const [dx, dy] = o.rijdt ?? [0, 0];
    this.add(
      o.diepte ?? x + y,
      cil + `<ellipse cx="${r1(X)}" cy="${r1(Y)}" rx="6" ry="3.4" fill="${TAUPE}" stroke="${INK}" stroke-width="1.4"/><circle cx="${r1(X + 9)}" cy="${r1(Y + 1)}" r="2" fill="${ROOD}"/>`,
      dx || dy ? 'robot' : '',
      dx || dy ? `--rx: ${r1(dx)}px; --ry: ${r1(dy)}px` : ''
    );
  }

  // GOM: staande schrobrobot met een schermpje.
  schrobrobot(x, y, o = {}) {
    const dp = o.diepte ?? x + y + 10;
    const [Xb, Yb] = this.p(x + 13, y + 30, 0);
    this.add(dp - 0.5, `<ellipse cx="${r1(Xb)}" cy="${r1(Yb + 2)}" rx="16" ry="5" fill="${LBLAUW}" stroke="${INK}" stroke-width="1.4"/>`);
    this.box(x, y, 0, 26, 30, 30, { top: WIT, links: WIT, rechts: TAUPE3 }, { diepte: dp });
    const [, , kop] = this.cil(x + 13, y + 15, 30, 11, 6, { top: TAUPE2, zij: BLAUW });
    const ogen = [this.p(x + 10, y + 30, 18), this.p(x + 16, y + 30, 18)].map(([a, b]) => `<circle cx="${r1(a)}" cy="${r1(b)}" r="1.8" fill="${INK}"/>`).join('');
    this.add(dp + 0.02, kop + this.poly(this.pts([x + 5, y + 30, 12], [x + 21, y + 30, 12], [x + 21, y + 30, 24], [x + 5, y + 30, 24]), LBLAUW, 1.4) + ogen);
  }

  // GOM: kar met emmer en mop.
  schoonmaakkar(x, y, o = {}) {
    const dp = o.diepte ?? x + y + 5;
    this.box(x, y, 6, 34, 18, 4, { top: TAUPE2 }, { diepte: dp });
    const wielen = [[x + 4, y + 18], [x + 30, y + 18]].map(([a, b]) => this.p(a, b, 3)).map(([X, Y]) => `<circle cx="${r1(X)}" cy="${r1(Y)}" r="3.2" fill="${INK}"/>`).join('');
    const [, , emmer] = this.cil(x + 10, y + 9, 10, 8, 12, { top: LBLAUW, zij: ROOD });
    const [X1, Y1] = this.p(x + 24, y + 9, 10);
    const [X2, Y2] = this.p(x + 30, y + 4, 52);
    this.add(dp + 0.1, wielen + emmer + `<path d="M${r1(X1)} ${r1(Y1)} L${r1(X2)} ${r1(Y2)}" stroke="${BRUIN}" stroke-width="3" stroke-linecap="round"/><path d="M${r1(X1 - 6)} ${r1(Y1 + 2)} q6 6 12 0" stroke="${INK}" stroke-width="2" fill="${WIT}"/>`);
  }

  // Prorest: kopje koffie met een wolkje.
  koffie(x, y, z, o = {}) {
    const [X, Y, kop] = this.cil(x, y, z, 4.5, 7, { top: '#6D4C41', zij: WIT, sw: 1.4 });
    this.add(o.diepte ?? x + y + z / 4, kop + `<path d="M${r1(X + 5.5)} ${r1(Y + 3)} q4 1 0 5" stroke="${INK}" stroke-width="1.4" fill="none"/><path class="damp" d="M${r1(X - 1)} ${r1(Y - 4)} q-3 -4 0 -7 q3 -3 0 -7" stroke="${TAUPE3}" stroke-width="1.4" fill="none" stroke-linecap="round"/>`);
  }


  // Een treintje dat rondjes rijdt over een ring (SVG-animatie, uit bij minder beweging).
  rondrit(r, o = {}) {
    const { cx = 0, cy = 0, dur = 8, begin = 0, kleur = ROOD, diepte = 9100 } = o;
    const [X, Y] = this.p(cx, cy, 0);
    const rx = r1(r * 1.2247 * this.k), ry = r1(r * 0.7071 * this.k);
    const pad = `M${r1(X)} ${r1(Y + ry)} A${rx} ${ry} 0 1 1 ${r1(X)} ${r1(Y - ry)} A${rx} ${ry} 0 1 1 ${r1(X)} ${r1(Y + ry)}`;
    this.add(
      diepte,
      `<g><rect x="-9" y="-6" width="18" height="11" rx="4" fill="${kleur}" stroke="${INK}" stroke-width="1.6"/><animateMotion class="smil" dur="${dur}s" begin="${begin}s" repeatCount="indefinite" path="${pad}"/></g>`
    );
  }

  // Een trechter: brede opening boven, smal onder.
  trechter(x, y, z, r, h, o = {}) {
    const [Xt, Yt] = this.p(x, y, z + h);
    const [Xb, Yb] = this.p(x, y, z);
    const rx = r * 1.2247 * this.k, ry = r * 0.7071 * this.k;
    const rxb = rx * 0.3, ryb = ry * 0.3;
    this.grens(Xt - rx, Yt - ry);
    this.grens(Xt + rx, Yb + ryb);
    const f = r1;
    const zij = `M${f(Xt - rx)} ${f(Yt)} L${f(Xb - rxb)} ${f(Yb)} A${f(rxb)} ${f(ryb)} 0 0 0 ${f(Xb + rxb)} ${f(Yb)} L${f(Xt + rx)} ${f(Yt)} A${f(rx)} ${f(ry)} 0 0 1 ${f(Xt - rx)} ${f(Yt)} Z`;
    this.add(
      o.diepte ?? x + y + z / 4,
      `<path d="${zij}" fill="${TAUPE}" stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round"/>` +
        `<ellipse cx="${f(Xt)}" cy="${f(Yt)}" rx="${f(rx)}" ry="${f(ry)}" fill="${LBLAUW}" stroke="${INK}" stroke-width="${SW}"/>` +
        `<ellipse cx="${f(Xt)}" cy="${f(Yt + ry * 0.25)}" rx="${f(rx * 0.55)}" ry="${f(ry * 0.45)}" fill="${BLAUW}" opacity=".35"/>`
    );
  }

  // Een slagboom: twee palen en een rood-witte boom.
  poort(x, y, o = {}) {
    const h = o.h ?? 34;
    const a = this.p(x, y - 18, 0), b = this.p(x, y - 18, h), c = this.p(x, y + 18, 0), d = this.p(x, y + 18, h);
    const f = r1;
    this.add(
      o.diepte ?? x + y + 3,
      `<path d="M${f(a[0])} ${f(a[1])} V${f(b[1])} M${f(c[0])} ${f(c[1])} V${f(d[1])}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>` +
        `<path d="M${f(b[0])} ${f(b[1])} L${f(d[0])} ${f(d[1])}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>` +
        `<path d="M${f(b[0])} ${f(b[1])} L${f(d[0])} ${f(d[1])}" stroke="${WIT}" stroke-width="4" stroke-linecap="round"/>` +
        `<path d="M${f(b[0])} ${f(b[1])} L${f(d[0])} ${f(d[1])}" stroke="${ROOD}" stroke-width="4" stroke-dasharray="5 5"/>`
    );
  }

  // Tekst rechtop (labels naast de tekening). Met href wordt het een link.
  tekst(x, y, z, tekst, o = {}) {
    const { dx = 0, dy = 0, anker = 'start', grootte = 17, gewicht = 700, href } = o;
    const [X, Y] = this.p(x, y, z);
    const bw = tekst.length * grootte * 0.56;
    const x0 = X + dx - (anker === 'end' ? bw : anker === 'middle' ? bw / 2 : 0);
    this.grens(x0, Y + dy - grootte);
    this.grens(x0 + bw, Y + dy + 4);
    const t = `<text x="${r1(X + dx)}" y="${r1(Y + dy)}" text-anchor="${anker}" font-size="${grootte}" font-weight="${gewicht}" fill="var(--ink)"${href ? ' class="link"' : ''}>${tekst}${href ? ' →' : ''}</text>`;
    this.add(20000 + this.items.length, href ? `<a href="${href}">${t}</a>` : t);
  }

  klaar(label, pad = 12) {
    const b = this.bx;
    const items = this.items.slice().sort((a, c) => a.diepte - c.diepte || a.n - c.n);
    const fasen = Math.max(0, ...items.map((i) => i.f)) + 1;
    return { viewBox: [b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad].map(Math.round).join(' '), items, fasen, label };
  }
}

function ster(X, Y, k) {
  const f = r1;
  return `M${f(X)} ${f(Y - k)} Q${f(X + k * 0.2)} ${f(Y - k * 0.2)} ${f(X + k)} ${f(Y)} Q${f(X + k * 0.2)} ${f(Y + k * 0.2)} ${f(X)} ${f(Y + k)} Q${f(X - k * 0.2)} ${f(Y + k * 0.2)} ${f(X - k)} ${f(Y)} Q${f(X - k * 0.2)} ${f(Y - k * 0.2)} ${f(X)} ${f(Y - k)} Z`;
}
