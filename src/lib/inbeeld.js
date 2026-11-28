// Svelte-actie: voegt de klasse "speelt" toe zodra het element in beeld komt. De animaties in src/styles/animaties.css
// beginnen dan. Wie minder beweging wil, of geen IntersectionObserver heeft, krijgt direct de eindstand.
export function inBeeld(node, opties = {}) {
  const speel = () => node.classList.add('speelt');
  if (typeof IntersectionObserver === 'undefined' || (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches)) {
    speel();
    return {};
  }
  const io = new IntersectionObserver(
    ([e]) => {
      if (e.isIntersecting) {
        speel();
        io.disconnect();
      }
    },
    { threshold: opties.drempel ?? 0.25 }
  );
  io.observe(node);
  return { destroy: () => io.disconnect() };
}
