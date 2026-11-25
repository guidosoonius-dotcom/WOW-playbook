// Redactiemodus, het datadeel: teksten in de content vinden, wijzigingen toepassen en ze terugleiden naar bestand en veld.
// Een wijziging is { pad, soort, oud, nieuw, bestand, veld, blokken? }:
// - pad: de plek in de content, bijv. ['rollen', { id: 'product-owner' }, 'kern'] of ['begrippen', { id: 'wsjf' }, 'uitleg'];
// - soort: 'tekst' (een veld) of 'html' (lopende tekst; blokken = [{ oud, nieuw }] per alinea, voor het bronbestand).

const ONDERDELEN = ['rollen', 'events', 'lagen', 'paginas', 'explainers', 'dilemmas', 'uitleg', 'werkvormen', 'begrippen', 'verschuivingen', 'routes', 'changelog', 'beslismatrix', 'teamscan', 'transitie', 'start', 'manieren', 'uitgangspunten', 'portfolio', 'teams', 'rollengroepen', 'mandaten', 'hulpmiddelen'];
// Velden die geen lopende tekst zijn (id's, codes, verwijzingen).
const OVERSLAAN = new Set(['id', 'type', 'status', 'eigenaar', 'bijgewerkt', 'icoon', 'scene', 'laag', 'cadans', 'categorie', 'niveau', 'rol', 'event', 'route', 'rol_id', 'explainer', 'soort', 'kwaliteit', 'groep', 'bron', 'volgorde', 'datum', 'versie', 'tijd', 'verwijst_naar', 'rollen', 'wie', 'bij', 'voor_wie', 'fase', 'beschikbaar', 'synoniemen', 'safe_term', 'nr', 'accent', 'streep', 'plek_id']);

export const norm = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

function bestandVan(onderdeel, item) {
  if (item && typeof item === 'object' && item.bron) return item.bron;
  return `content/data/${onderdeel}.yaml`;
}

function veldNaam(pad, isLijst) {
  return pad
    .slice(isLijst ? 2 : 1)
    .map((s) => (typeof s === 'number' ? `[${s}]` : typeof s === 'object' ? `[${s.id}]` : `.${s}`))
    .join('')
    .replace(/^\./, '');
}

// Alle tekstvelden in de content, met pad, bestand en veld.
export function velden(content) {
  const uit = [];
  const loop = (waarde, pad, onderdeel, item) => {
    if (typeof waarde === 'string') {
      const laatste = pad[pad.length - 1];
      if (typeof laatste === 'string' && OVERSLAAN.has(laatste)) return;
      if (!waarde.trim()) return;
      uit.push({ pad, waarde, soort: laatste === 'html' ? 'html' : 'tekst', bestand: bestandVan(onderdeel, item), veld: veldNaam(pad, Array.isArray(content[onderdeel])) || pad[pad.length - 1] });
    } else if (Array.isArray(waarde)) {
      waarde.forEach((w, i) => {
        const seg = w && typeof w === 'object' && !Array.isArray(w) && typeof w.id === 'string' ? { id: w.id } : i;
        loop(w, [...pad, seg], onderdeel, pad.length === 1 ? w : item);
      });
    } else if (waarde && typeof waarde === 'object') {
      for (const [k, v] of Object.entries(waarde)) {
        if (OVERSLAAN.has(k)) continue;
        loop(v, [...pad, k], onderdeel, pad.length === 1 && !Array.isArray(content[onderdeel]) ? null : item);
      }
    }
  };
  for (const o of ONDERDELEN) if (content[o] !== undefined) loop(content[o], [o], o, null);
  return uit;
}

function ouder(content, pad) {
  let p = content;
  for (const seg of pad.slice(0, -1)) {
    if (p == null) return [null];
    p = typeof seg === 'object' ? p.find?.((x) => x?.id === seg.id) : p[seg];
  }
  const laatste = pad[pad.length - 1];
  return [p, typeof laatste === 'object' ? p?.findIndex?.((x) => x?.id === laatste.id) : laatste];
}
export function lees(content, pad) {
  const [p, k] = ouder(content, pad);
  return p == null ? undefined : p[k];
}
export function zet(content, pad, waarde) {
  const [p, k] = ouder(content, pad);
  if (p == null || p[k] === undefined) return false;
  p[k] = waarde;
  return true;
}

// Pas wijzigingen toe. Staat er niet meer de oude tekst (de bron is intussen veranderd), dan wordt de wijziging overgeslagen.
export function pasToe(content, wijzigingen) {
  const resultaat = { toegepast: 0, overgeslagen: [] };
  for (const w of wijzigingen ?? []) {
    const nu = lees(content, w.pad);
    if (nu === w.nieuw) continue;
    if (nu !== undefined && norm(nu) === norm(w.oud) && zet(content, w.pad, w.nieuw)) resultaat.toegepast++;
    else resultaat.overgeslagen.push(w);
  }
  return resultaat;
}

export const padSleutel = (pad) => JSON.stringify(pad);
