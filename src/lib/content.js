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
  return paginaById(a)?.titel ?? { '': 'Start', rollen: 'Rollen', woordenlijst: 'Woordenlijst' }[a] ?? path;
}
