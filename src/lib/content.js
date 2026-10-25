import content from 'virtual:content';

export default content;

export const rolById = (id) => content.rollen.find((r) => r.id === id);
export const eventById = (id) => content.events.find((e) => e.id === id);
export const laagById = (id) => content.lagen.find((l) => l.id === id);
export const paginaById = (id) => content.paginas.find((p) => p.id === id);
export const explainerById = (id) => content.explainers.find((e) => e.id === id);

// Omgekeerde relaties: welke rollen nemen deel aan een event, welke events horen bij een laag.
export const rollenVoorEvent = (eventId) =>
  content.rollen.filter((r) => r.events.some((e) => e.event === eventId));
export const eventsVoorLaag = (laagId) => content.events.filter((e) => e.laag === laagId);
export const rollenVoorLaag = (laagId) => content.rollen.filter((r) => r.laag === laagId);

export const CADANS_LABEL = {
  dagelijks: 'Dag',
  iteratie: 'Iteratie · 2 weken',
  kwartaal: 'Kwartaal',
  portfolio: 'Portfolio · maandelijks'
};

// Titel bij een route, voor de "top 5" en zoekresultaten.
export function titelVoorRoute(path) {
  const [a, b] = path.split('/');
  if (a === 'rollen' && b) return rolById(b)?.titel;
  if (a === 'ritme' && b) return eventById(b)?.titel;
  const vast = {
    '': 'Start',
    rollen: 'Rollen',
    woordenlijst: 'Woordenlijst',
    beslissen: 'Wie beslist wat?',
    doen: 'Aan de slag',
    'doen/dilemmas': "Dilemma's: wat doe jij?",
    'doen/teamscan': 'Teamscan',
    transitie: 'De transitie'
  };
  return paginaById(a)?.titel ?? vast[path] ?? vast[a] ?? path;
}

// Besluiten waarin een rol een code heeft, gesorteerd op invloed (B, A, U, I).
const CODE_VOLGORDE = ['B', 'A', 'U', 'I'];
export const besluitenVoorRol = (rolId) =>
  content.beslismatrix
    .filter((b) => b.rollen[rolId])
    .sort((x, y) => CODE_VOLGORDE.indexOf(x.rollen[rolId]) - CODE_VOLGORDE.indexOf(y.rollen[rolId]));
