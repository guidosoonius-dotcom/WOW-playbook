// Verwerkt een wijzigingenbestand uit de redactiemodus van het playbook in de bronbestanden.
// Gebruik: npm run redactie -- pad/naar/playbook-wijzigingen-JJJJ-MM-DD.json [--proef]
//   --proef  laat alleen zien wat er zou veranderen, zonder bestanden aan te passen.
// Daarna altijd: npm run content:check
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = process.cwd();
const args = process.argv.slice(2);
const proef = args.includes('--proef');
const invoer = args.find((a) => !a.startsWith('--'));

if (!invoer || !existsSync(invoer)) {
  console.error('Gebruik: npm run redactie -- <wijzigingenbestand.json> [--proef]');
  process.exit(1);
}

const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();
const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
// Zoekpatroon dat ongevoelig is voor regelafbrekingen en extra spaties in het bronbestand.
const patroon = (tekst) => new RegExp(norm(tekst).split(' ').map(escRe).join('\\s+'));

// Een gewone YAML-waarde zonder aanhalingstekens kan niet alles bevatten. Dan zetten we hem tussen aanhalingstekens.
function yamlVeilig(bron, index, lengte, nieuw) {
  const regelStart = bron.lastIndexOf('\n', index - 1) + 1;
  const ervoor = bron.slice(regelStart, index);
  const regelEinde = bron.indexOf('\n', index + lengte);
  const erna = bron.slice(index + lengte, regelEinde === -1 ? undefined : regelEinde);
  const kaleWaarde = /^\s*(- )?[\w-]+:\s+$/.test(ervoor) && erna.trim() === '';
  const lastig = /: |\s#|^[\s\-?:,[\]{}#&*!|>'"%@`]/.test(nieuw);
  return kaleWaarde && lastig ? JSON.stringify(nieuw) : nieuw;
}

// Vervang oud door nieuw. Een veld wordt in zijn geheel vervangen; bij lopende tekst alleen het gewijzigde stuk,
// zodat regelafbrekingen en opmaak (vet, links) in de bron blijven staan.
function vervang(bron, oud, nieuw, isYaml, isBlok) {
  if (isBlok) return verschil(bron, oud, nieuw) ?? geheel(bron, oud, nieuw, false);
  return geheel(bron, oud, nieuw, isYaml) ?? verschil(bron, oud, nieuw);
}
function geheel(bron, oud, nieuw, isYaml) {
  const m = patroon(oud).exec(bron);
  if (!m) return null;
  const waarde = isYaml ? yamlVeilig(bron, m.index, m[0].length, nieuw) : nieuw;
  return bron.slice(0, m.index) + waarde + bron.slice(m.index + m[0].length);
}
function verschil(bron, oud, nieuw) {
  // Woorden aan het begin en eind die gelijk zijn, blijven staan; het stuk ertussen (met wat context) moet uniek zijn.
  const a = norm(oud).split(' ');
  const b = norm(nieuw).split(' ');
  let begin = 0;
  while (begin < a.length && begin < b.length && a[begin] === b[begin]) begin++;
  let eind = 0;
  while (eind < a.length - begin && eind < b.length - begin && a[a.length - 1 - eind] === b[b.length - 1 - eind]) eind++;
  for (const context of [3, 2, 1, 0]) {
    const van = Math.max(0, begin - context);
    const oudStuk = a.slice(van, a.length - Math.max(0, eind - context)).join(' ');
    const nieuwStuk = b.slice(van, b.length - Math.max(0, eind - context)).join(' ');
    if (!oudStuk) continue;
    const pp = new RegExp(patroon(oudStuk).source, 'g');
    const treffers = [...bron.matchAll(pp)];
    if (treffers.length === 1) {
      const t = treffers[0];
      return bron.slice(0, t.index) + nieuwStuk + bron.slice(t.index + t[0].length);
    }
  }
  return null;
}

const data = JSON.parse(readFileSync(invoer, 'utf8'));
const wijzigingen = data.wijzigingen ?? data;
const bestanden = new Map();
const gelukt = [];
const mislukt = [];

for (const w of wijzigingen) {
  const pad = resolve(root, w.bestand);
  if (!pad.startsWith(join(root, 'content')) || !existsSync(pad)) {
    mislukt.push({ w, reden: `bestand ${w.bestand} niet gevonden in content/` });
    continue;
  }
  if (!bestanden.has(pad)) bestanden.set(pad, readFileSync(pad, 'utf8'));
  const isYaml = pad.endsWith('.yaml');
  const stappen = w.blokken ?? [{ oud: w.oud, nieuw: w.nieuw }];
  for (const s of stappen) {
    if (norm(s.oud) === norm(s.nieuw)) continue;
    const nieuweBron = vervang(bestanden.get(pad), s.oud, norm(s.nieuw), isYaml || !w.blokken, Boolean(w.blokken));
    if (nieuweBron === null) mislukt.push({ w, s, reden: 'de oude tekst staat niet (meer) zo in het bestand' });
    else {
      bestanden.set(pad, nieuweBron);
      gelukt.push({ w, s });
    }
  }
}

if (!proef) for (const [pad, bron] of bestanden) writeFileSync(pad, bron);

const kort = (t) => (norm(t).length > 80 ? norm(t).slice(0, 79) + '…' : norm(t));
console.log(`\nRedactie verwerken${proef ? ' (proef, er is niets aangepast)' : ''}: ${invoer}`);
if (data.playbookVersie) console.log(`Gemaakt in playbook-versie ${data.playbookVersie}.`);
console.log(`\n✓ ${gelukt.length} ${gelukt.length === 1 ? 'wijziging' : 'wijzigingen'} verwerkt`);
for (const { w, s } of gelukt) console.log(`  ${w.bestand} · ${w.veld}\n    "${kort(s.oud)}"\n  → "${kort(s.nieuw)}"`);
if (mislukt.length) {
  console.log(`\n✗ ${mislukt.length} niet verwerkt. Pas deze met de hand aan:`);
  for (const { w, s, reden } of mislukt) console.log(`  ${w.bestand} · ${w.veld}: ${reden}${s ? `\n    oud:   "${norm(s.oud)}"\n    nieuw: "${norm(s.nieuw)}"` : ''}`);
}
console.log('\nControleer daarna de inhoud: npm run content:check\n');
process.exit(mislukt.length ? 2 : 0);
