// Gedeelde basis voor de werkvormen in de gereedschapskist.
// - Bewaard: de ingevulde gegevens van één werkvorm, automatisch bewaard in deze browser.
// - Exporteren: één document per werkvorm, voor Print of PDF, Word en "Kopieer als tekst".
// Er is geen server of account: wat je invult, blijft op je eigen computer.

const PREFIX = 'samen-digitaal-werkvorm:';

function lees(id) {
  try {
    const ruw = localStorage.getItem(PREFIX + id);
    return ruw ? JSON.parse(ruw) : null;
  } catch {
    return null;
  }
}

export class Bewaard {
  data = $state();
  tijd = $state(null);
  #id;
  #start;
  #laatst;

  constructor(id, start) {
    this.#id = id;
    this.#start = start;
    const opgeslagen = lees(id);
    this.data = opgeslagen?.data ? { ...start(), ...opgeslagen.data } : start();
    this.tijd = opgeslagen?.tijd ?? null;
    this.#laatst = JSON.stringify(this.data);
    // Elke wijziging direct bewaren (alleen als er echt iets veranderd is).
    $effect(() => {
      const json = JSON.stringify(this.data);
      if (json === this.#laatst) return;
      this.#laatst = json;
      this.tijd = Date.now();
      try {
        localStorage.setItem(PREFIX + this.#id, JSON.stringify({ data: this.data, tijd: this.tijd }));
      } catch {
        // Geen opslag beschikbaar (privévenster, geblokkeerd): het werk geldt dan alleen voor deze sessie.
      }
    });
  }

  leegmaken() {
    try {
      localStorage.removeItem(PREFIX + this.#id);
    } catch {
      /* niets te doen */
    }
    this.data = this.#start();
    this.#laatst = JSON.stringify(this.data);
    this.tijd = null;
  }
}

// Welke werkvormen hebben al ingevuld werk? Voor "Verder met je werk".
export function bewaardeWerkvormen() {
  const uit = {};
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const sleutel = localStorage.key(i);
      if (!sleutel?.startsWith(PREFIX)) continue;
      const w = JSON.parse(localStorage.getItem(sleutel));
      if (w?.tijd) uit[sleutel.slice(PREFIX.length)] = w.tijd;
    }
  } catch {
    /* geen opslag */
  }
  return uit;
}

export function tijdTekst(t) {
  if (!t) return null;
  const d = new Date(t);
  const vandaag = new Date().toDateString() === d.toDateString();
  const uur = d.toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit' });
  return vandaag ? uur : `${d.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short' })} ${uur}`;
}

// HTML veilig maken voor in een exportdocument.
export function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Kleine bouwstenen voor de exportdocumenten.
export const doc = {
  kop: (t) => `<h2>${esc(t)}</h2>`,
  p: (t) => (t ? `<p>${esc(t)}</p>` : ''),
  veld: (label, waarde) => `<p><b>${esc(label)}:</b> ${waarde ? esc(waarde) : '<span class="leeg">nog niet ingevuld</span>'}</p>`,
  lijst: (items) => (items?.filter(Boolean).length ? `<ul>${items.filter(Boolean).map((i) => `<li>${esc(i)}</li>`).join('')}</ul>` : '<p class="leeg">Nog niets ingevuld.</p>'),
  tabel: (koppen, rijen) =>
    `<table><thead><tr>${koppen.map((k) => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rijen
      .map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`)
      .join('')}</tbody></table>`
};

const STIJL = `
  body { font-family: Aptos, Calibri, 'Segoe UI', Arial, sans-serif; color: #004077; font-size: 11pt; line-height: 1.45; margin: 0; }
  .blad { max-width: 760px; margin: 0 auto; padding: 24px; }
  .afzender { font-size: 9pt; color: #3e5878; border-bottom: 1.5pt solid #004077; padding-bottom: 6px; margin-bottom: 14px; }
  h1 { color: #ab2016; font-size: 22pt; margin: 0 0 4px; }
  .datum { color: #3e5878; font-size: 9.5pt; margin: 0 0 16px; }
  h2 { font-size: 13pt; margin: 18px 0 6px; color: #004077; }
  h3 { font-size: 11.5pt; margin: 12px 0 4px; }
  p { margin: 0 0 6px; }
  ul { margin: 0 0 8px; padding-left: 18px; }
  table { border-collapse: collapse; width: 100%; margin: 4px 0 10px; }
  th, td { border: 0.75pt solid #d7ccc8; padding: 5px 7px; text-align: left; vertical-align: top; font-size: 10pt; }
  th { background: #f1ece9; }
  .leeg { color: #8e7f78; font-style: italic; }
  .poster { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
  .poster section { border: 1pt solid #d7ccc8; border-radius: 8px; padding: 10px; }
  .poster h2 { margin-top: 0; }
  @page { margin: 14mm; }
`;

export function documentHtml(titel, body) {
  const datum = new Date().toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
  return `<!doctype html><html lang="nl"><head><meta charset="utf-8"><title>${esc(titel)}</title><style>${STIJL}</style></head><body><div class="blad"><div class="afzender">Samen Digitaal · Playbook · Facilicom Groep</div><h1>${esc(titel)}</h1><p class="datum">${datum}</p>${body}</div></body></html>`;
}

function bestandsnaam(titel, ext) {
  const datum = new Date().toISOString().slice(0, 10);
  return `${titel.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-${datum}.${ext}`;
}

// Word opent HTML-documenten met deze kop als .doc; zo is geen extra bibliotheek nodig.
export function downloadWord(titel, body) {
  const html = documentHtml(titel, body).replace('<html lang="nl">', '<html lang="nl" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">');
  const blob = new Blob(['﻿', html], { type: 'application/msword' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = bestandsnaam(titel, 'doc');
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Afdrukken via een verborgen frame: alleen het document, niet de hele pagina.
export function printen(titel, body) {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0';
  document.body.appendChild(frame);
  const d = frame.contentDocument;
  d.open();
  d.write(documentHtml(titel, body));
  d.close();
  const klaar = () => {
    frame.contentWindow.focus();
    frame.contentWindow.print();
    setTimeout(() => frame.remove(), 1000);
  };
  if (frame.contentDocument.readyState === 'complete') setTimeout(klaar, 50);
  else frame.onload = klaar;
}

// Platte tekst van het document, voor Teams of een e-mail.
export function alsTekst(titel, body) {
  const el = document.createElement('div');
  el.style.cssText = 'position:fixed;left:-9999px;top:0;white-space:normal';
  el.innerHTML = `<h1>${esc(titel)}</h1>` + body.replace(/<li>/g, '<li>• ');
  document.body.appendChild(el);
  const tekst = el.innerText.replace(/\n{3,}/g, '\n\n').trim();
  el.remove();
  return tekst;
}

export async function kopieer(tekst) {
  try {
    await navigator.clipboard.writeText(tekst);
    return true;
  } catch {
    // Terugval voor omgevingen zonder klembord-API.
    const t = document.createElement('textarea');
    t.value = tekst;
    t.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(t);
    t.select();
    const ok = document.execCommand?.('copy') ?? false;
    t.remove();
    return ok;
  }
}
