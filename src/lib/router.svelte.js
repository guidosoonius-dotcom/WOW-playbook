// Eenvoudige hash-router: #/rollen/product-owner → ['rollen', 'product-owner'].
// Hash-routes werken ook als het bestand lokaal of vanaf het intranet wordt geopend.
//
// Scrollen bij wisselen van pagina:
// - Een nieuwe pagina begint altijd bovenaan, direct (zonder vloeiende animatie die halverwege kan stoppen),
//   en pas nadat de nieuwe pagina is opgebouwd.
// - Met terug en vooruit kom je terug op de plek waar je was.
// Elke stap in de geschiedenis krijgt daarvoor een nummer in history.state.
import { tick } from 'svelte';

function parse() {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  return hash.split('/').filter(Boolean);
}

export const route = $state({ parts: parse() });

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

const posities = new Map(); // nummer van de geschiedenisstap → scrollpositie
let volgnummer = Date.now();
let huidig = history.state?.stap;
if (huidig === undefined) {
  huidig = volgnummer++;
  history.replaceState({ ...(history.state ?? {}), stap: huidig }, '');
}
let laatsteY = window.scrollY;
window.addEventListener('scroll', () => (laatsteY = window.scrollY), { passive: true });

// Direct springen, ook als de stylesheet vloeiend scrollen aanzet (scroll-behavior: smooth).
function naar(y) {
  const html = document.documentElement;
  const oud = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  void getComputedStyle(html).scrollBehavior; // de stijl echt laten doorwerken vóór het scrollen
  try {
    window.scrollTo({ top: y, left: 0, behavior: 'instant' });
  } catch {
    window.scrollTo(0, y);
  }
  html.style.scrollBehavior = oud;
}

window.addEventListener('hashchange', async () => {
  // Bewaar waar je was op de vorige pagina.
  posities.set(huidig, laatsteY);

  const bekend = history.state?.stap;
  const terug = bekend !== undefined && posities.has(bekend);
  if (bekend === undefined) history.replaceState({ ...(history.state ?? {}), stap: volgnummer }, '');
  huidig = bekend ?? volgnummer++;

  route.parts = parse();
  await tick();

  const anker = route.parts[0] === 'woordenlijst' && route.parts[1];
  if (anker) {
    requestAnimationFrame(() => document.getElementById(`begrip-${anker}`)?.scrollIntoView());
    return;
  }
  // Meteen na het opbouwen (vóór de browser tekent), en nog één keer na de eerste frame,
  // voor het geval de pagina toen nog groeide (bijvoorbeeld bij terugkeren naar een lange pagina).
  const doel = terug ? posities.get(huidig) : 0;
  naar(doel);
  requestAnimationFrame(() => {
    if (Math.abs(window.scrollY - doel) > 2) naar(doel);
  });
});

export function href(path) {
  return `#/${path}`;
}

export function pad() {
  return route.parts.join('/');
}
