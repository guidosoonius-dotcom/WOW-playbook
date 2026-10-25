// Eenvoudige hash-router: #/rollen/product-owner → ['rollen', 'product-owner'].
// Hash-routes werken ook als het bestand lokaal of vanaf het intranet wordt geopend.
function parse() {
  const hash = decodeURIComponent(location.hash.replace(/^#\/?/, ''));
  return hash.split('/').filter(Boolean);
}

export const route = $state({ parts: parse() });

window.addEventListener('hashchange', () => {
  route.parts = parse();
  const anchor = route.parts[0] === 'woordenlijst' && route.parts[1];
  if (anchor) requestAnimationFrame(() => document.getElementById(`begrip-${anchor}`)?.scrollIntoView());
  else window.scrollTo({ top: 0 });
});

export function href(path) {
  return `#/${path}`;
}

export function pad() {
  return route.parts.join('/');
}
