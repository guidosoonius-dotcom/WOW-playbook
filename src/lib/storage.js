// Lokale opslag is alleen een gemak (rol, thema, voortgang). Het playbook moet ook werken
// als opslag geblokkeerd is, bijvoorbeeld in een privévenster of bij een file://-bestand.
const KEY = 'samen-digitaal-playbook';

export function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}') ?? {};
  } catch {
    return {};
  }
}

export function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Geen opslag beschikbaar: de keuze geldt dan alleen voor deze sessie.
  }
}
