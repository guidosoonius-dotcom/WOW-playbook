// Redactiemodus: teksten direct in het playbook wijzigen.
// - Wijzigingen werken meteen door in de content (en dus op elke plek waar die tekst staat).
// - Ze worden bewaard in deze browser tot je opslaat als HTML-bestand: dan zitten ze in dat bestand (script#playbook-redactie).
// - Ze zijn te exporteren voor de bronbestanden (scripts/verwerk-redactie.mjs of Copilot met de skill).
import content, { redactieStart, REDACTIE_SLEUTEL } from './content.js';
import { velden, lees, zet, norm, padSleutel } from './redactie-data.js';

export const redactie = $state({
  aan: false,
  inBestand: redactieStart.inBestand,
  lokaal: redactieStart.lokaal,
  overgeslagen: redactieStart.resultaat.overgeslagen
});

function bewaarLokaal() {
  try {
    localStorage.setItem(REDACTIE_SLEUTEL, JSON.stringify(redactie.lokaal));
  } catch {
    /* geen opslag: de wijzigingen gelden alleen in deze sessie */
  }
}

export const alleWijzigingen = () => [...redactie.inBestand, ...redactie.lokaal];

// Welke velden horen bij deze tekst? Exacte overeenkomst, na het gelijkmaken van spaties.
export function veldenVoorTekst(tekst) {
  const t = norm(tekst);
  if (!t) return [];
  return velden(content).filter((v) => v.soort === 'tekst' && norm(v.waarde) === t);
}

// Welk html-veld hoort bij dit blok lopende tekst? Vergelijk de html zoals de browser hem toont.
export function htmlVeldVoor(container) {
  const nu = container.innerHTML;
  const t = document.createElement('template');
  return velden(content).find((v) => {
    if (v.soort !== 'html') return false;
    t.innerHTML = v.waarde;
    return t.innerHTML === nu;
  });
}

// Een wijziging vastleggen. Dezelfde plek al eerder gewijzigd? Dan wordt die wijziging bijgewerkt.
function leg(veld, nieuw, extra = {}) {
  const sleutel = padSleutel(veld.pad);
  const bestaand = redactie.lokaal.find((w) => padSleutel(w.pad) === sleutel) ?? redactie.inBestand.find((w) => padSleutel(w.pad) === sleutel);
  zet(content, veld.pad, nieuw);
  if (bestaand) {
    bestaand.nieuw = nieuw;
    if (extra.blok) bestaand.blokken = [...(bestaand.blokken ?? []), extra.blok];
    bestaand.tijd = Date.now();
    if (redactie.inBestand.includes(bestaand) && !redactie.lokaal.includes(bestaand)) redactie.lokaal.push(bestaand);
    redactie.inBestand = redactie.inBestand.filter((w) => w !== bestaand);
  } else {
    redactie.lokaal.push({ pad: veld.pad, soort: veld.soort, oud: veld.waarde, nieuw, bestand: veld.bestand, veld: veld.veld, ...(extra.blok ? { blokken: [extra.blok] } : {}), tijd: Date.now() });
  }
  bewaarLokaal();
}

export function wijzigTekst(veldenLijst, nieuw) {
  for (const v of veldenLijst) leg(v, nieuw);
}

export function wijzigHtml(veld, nieuweHtml, blok) {
  leg(veld, nieuweHtml, { blok });
}

// Een wijziging terugdraaien: de oorspronkelijke tekst komt terug.
export function maakOngedaan(w) {
  zet(content, w.pad, w.oud);
  redactie.lokaal = redactie.lokaal.filter((x) => x !== w);
  redactie.inBestand = redactie.inBestand.filter((x) => x !== w);
  bewaarLokaal();
}

// Opslaan als nieuw HTML-bestand, met alle wijzigingen erin. Het bestand werkt zelfstandig, net als het origineel.
export function slaOpAlsHtml() {
  const alle = alleWijzigingen().filter((w) => lees(content, w.pad) === w.nieuw);
  const kloon = document.documentElement.cloneNode(true);
  const app = kloon.querySelector('#app');
  if (app) app.innerHTML = '';
  kloon.removeAttribute('data-theme');
  kloon.querySelector('body')?.removeAttribute('class');
  kloon.querySelector('#playbook-redactie')?.remove();
  const s = document.createElement('script');
  s.type = 'application/json';
  s.id = 'playbook-redactie';
  s.textContent = JSON.stringify(alle).replace(/</g, '\\u003c');
  kloon.querySelector('head').prepend(s);
  const html = '<!doctype html>\n' + kloon.outerHTML;
  download(new Blob([html], { type: 'text/html' }), `samen-digitaal-playbook-${datum()}.html`);
  // De wijzigingen zitten nu in het bestand; in deze browser hoeven ze niet meer apart bewaard te worden.
  redactie.inBestand = alle;
  redactie.lokaal = [];
  bewaarLokaal();
}

// Exporteren voor de bronbestanden in de repository.
export function exportWijzigingen() {
  return alleWijzigingen().map((w) =>
    w.soort === 'html'
      ? { bestand: w.bestand, veld: 'tekst', blokken: (w.blokken ?? []).filter((b) => norm(b.oud) !== norm(b.nieuw)) }
      : { bestand: w.bestand, veld: w.veld, oud: norm(w.oud), nieuw: norm(w.nieuw) }
  );
}
export function downloadExport() {
  const versie = content.changelog?.[0]?.versie ?? '';
  const data = { playbookVersie: versie, gemaakt: new Date().toISOString(), wijzigingen: exportWijzigingen() };
  download(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), `playbook-wijzigingen-${datum()}.json`);
}
export function exportAlsTekst() {
  return (
    'Wijzigingen uit de redactiemodus van het playbook. Verwerk ze in de bronbestanden:\n\n' +
    exportWijzigingen()
      .map((w) =>
        w.blokken
          ? `Bestand ${w.bestand}, lopende tekst:\n` + w.blokken.map((b) => `- oud: "${norm(b.oud)}"\n  nieuw: "${norm(b.nieuw)}"`).join('\n')
          : `Bestand ${w.bestand}, veld ${w.veld}:\n- oud: "${w.oud}"\n  nieuw: "${w.nieuw}"`
      )
      .join('\n\n')
  );
}

function datum() {
  return new Date().toISOString().slice(0, 10);
}
function download(blob, naam) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = naam;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
