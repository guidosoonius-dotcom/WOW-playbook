// Isometrisch tekenen: zet 3D-coördinaten (x, y, z) om naar SVG en houdt de volgorde van tekenen bij.
// Kleuren zijn CSS-variabelen (zie global.css: --iso-*), zodat de tekeningen meekleuren met de donkere weergave.
// Elk onderdeel heeft een fase: daarmee bouwt een tekening op, bij het in beeld komen of per stap in een explainer.

const C = Math.cos(Math.PI / 6);

export const K = {
  top: 'var(--iso-top)',
  links: 'var(--iso-links)',
  rechts: 'var(--iso-rechts)',
  rand: 'var(--iso-rand)',
  stippel: 'var(--iso-stippel)',
  lijn1: 'var(--line1)',
  lijn2: 'var(--line2)',
  inkt: 'var(--ink)',
  zacht: 'var(--muted)',
  rood: 'var(--iso-rood)',
  roodL: 'var(--iso-rood-l)',
  roodR: 'var(--iso-rood-r)',
  blauw: 'var(--iso-blauw)',
  blauwL: 'var(--iso-blauw-l)',
  blauwR: 'var(--iso-blauw-r)'
};

export const ROOD = { top: K.rood, links: K.roodL, rechts: K.roodR };
export const BLAUW = { top: K.blauw, links: K.blauwL, rechts: K.blauwR };

const f1 = (n) => Math.round(n * 10) / 10;

export class Iso {
  constructor() {
    this.items = [];
    this.bx = [Infinity, Infinity, -Infinity, -Infinity];
    this.fase = 0;
  }
  grens(X, Y) {
    const b = this.bx;
    b[0] = Math.min(b[0], X);
    b[1] = Math.min(b[1], Y);
    b[2] = Math.max(b[2], X);
    b[3] = Math.max(b[3], Y);
  }
  p(x, y, z = 0) {
    const X = (x - y) * C;
    const Y = (x + y) * 0.5 - z;
    this.grens(X, Y);
    return [X, Y];
  }
  pts(...ps) {
    return ps.map((q) => this.p(...q).map(f1).join(',')).join(' ');
  }
  add(diepte, item) {
    this.items.push({ diepte, n: this.items.length, f: this.fase, ...item });
  }

  // Een blok met drie zichtbare vlakken.
  box(x, y, z, w, d, h, kleur = {}, opties = {}) {
    const { top = K.top, links = K.links, rechts = K.rechts } = kleur;
    const vlakken = [
      { pts: this.pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]), fill: rechts },
      { pts: this.pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]), fill: links },
      { pts: this.pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]), fill: top }
    ];
    this.add(opties.diepte ?? x + w / 2 + y + d / 2 + z, { t: 'box', vlakken, rand: opties.rand ?? K.rand, rijdt: opties.rijdt, valt: opties.valt });
  }

  // Een open bak: buitenkant plus een verdiepte binnenkant.
  bak(x, y, z, w, d, h, opties = {}) {
    const r = 6;
    const vlakken = [
      { pts: this.pts([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h]), fill: K.rechts },
      { pts: this.pts([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h]), fill: K.links },
      { pts: this.pts([x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]), fill: K.top },
      { pts: this.pts([x + r, y + r, z + h], [x + w - r, y + r, z + h], [x + w - r, y + d - r, z + h], [x + r, y + d - r, z + h]), fill: K.links }
    ];
    this.add(opties.diepte ?? x + w / 2 + y + d / 2 + z, { t: 'box', vlakken, rand: K.rand });
  }

  // Een schijf (platte cilinder) met middelpunt (cx, cy) op hoogte z.
  schijf(cx, cy, z, r, h, opties = {}) {
    const [X, Y] = this.p(cx, cy, z + h);
    const rx = r * 1.2247;
    const ry = r * 0.7071;
    this.grens(X - rx, Y - ry);
    this.grens(X + rx, Y + ry + h);
    const zijkant = `M${f1(X - rx)} ${f1(Y)} V${f1(Y + h)} A${f1(rx)} ${f1(ry)} 0 0 0 ${f1(X + rx)} ${f1(Y + h)} V${f1(Y)} Z`;
    this.add(opties.diepte ?? cx + cy + z, { t: 'schijf', zijkant, X: f1(X), Y: f1(Y), rx: f1(rx), ry: f1(ry), top: opties.top ?? K.top, links: opties.links ?? K.links });
  }

  // Een cirkel op een horizontaal vlak (wordt een ellips).
  ring(cx, cy, z, r, kleur = K.lijn1, sw = 4, opties = {}) {
    const [X, Y] = this.p(cx, cy, z);
    this.add(opties.diepte ?? 0, { t: 'ring', X: f1(X), Y: f1(Y), rx: f1(r * 1.2247), ry: f1(r * 0.7071), kleur, sw, dash: opties.dash });
  }

  lijn(punten, kleur = K.lijn1, sw = 4, opties = {}) {
    const d = 'M' + punten.map((q) => this.p(...q).map(f1).join(' ')).join(' L');
    this.add(opties.diepte ?? 0, { t: 'lijn', d, kleur, sw, dash: opties.dash });
  }

  halte(x, y, z, kleur = K.lijn1, r = 7, opties = {}) {
    const [X, Y] = this.p(x, y, z);
    this.add(opties.diepte ?? x + y + z + 1, { t: 'halte', X: f1(X), Y: f1(Y), rx: f1(r * 1.25), ry: f1(r * 0.75), kleur, vul: opties.vul ?? K.top });
  }

  // Een abstract figuurtje: geen herkenbaar beroep.
  pion(x, y, z, kleur = K.lijn1, opties = {}) {
    const [X, Y] = this.p(x, y, z);
    this.grens(X, Y - 30);
    this.add(opties.diepte ?? x + y + z + 0.5, { t: 'pion', X: f1(X), Y: f1(Y), kleur });
  }

  // Tekst rechtop, in schermrichting. Met href wordt het een link.
  tekst(x, y, z, tekst, opties = {}) {
    const { dx = 0, dy = 0, anker = 'start', grootte = 17, gewicht = 700, kleur = K.inkt, href } = opties;
    const [X, Y] = this.p(x, y, z);
    const bw = tekst.length * grootte * 0.56;
    const x0 = X + dx - (anker === 'end' ? bw : anker === 'middle' ? bw / 2 : 0);
    this.grens(x0, Y + dy - grootte);
    this.grens(x0 + bw, Y + dy + 4);
    this.add(10000 + this.items.length, { t: 'tekst', X: f1(X + dx), Y: f1(Y + dy), tekst, anker, grootte, gewicht, kleur, href });
  }

  // Tekst die plat op een bovenvlak ligt, langs de x-as.
  vlaktekst(x, y, z, tekst, opties = {}) {
    const [X, Y] = this.p(x, y, z);
    this.add(opties.diepte ?? 9000 + this.items.length, { t: 'vlaktekst', m: `matrix(${C.toFixed(4)} 0.5 ${(-C).toFixed(4)} 0.5 ${f1(X)} ${f1(Y)})`, tekst, grootte: opties.grootte ?? 13 });
  }

  // Een rechthoek op het vlak y = vast (de linker, naar voren gerichte zijde), bijvoorbeeld een sticker op een bord.
  plakker(x, y, z, w, h, fill, opties = {}) {
    this.add(opties.diepte ?? x + y + z + 2, { t: 'vlak', pts: this.pts([x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]), fill });
  }

  klaar(label, pad = 18) {
    const b = this.bx;
    const items = this.items.slice().sort((a, b) => a.diepte - b.diepte || a.n - b.n);
    const fasen = Math.max(0, ...items.map((i) => i.f)) + 1;
    return { viewBox: [b[0] - pad, b[1] - pad, b[2] - b[0] + 2 * pad, b[3] - b[1] + 2 * pad].map(Math.round).join(' '), items, fasen, label };
  }
}
