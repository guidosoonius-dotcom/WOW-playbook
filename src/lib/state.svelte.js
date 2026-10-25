import { load, save } from './storage.js';

const saved = load();

export const prefs = $state({
  rol: typeof saved.rol === 'string' ? saved.rol : null,
  theme: saved.theme === 'light' || saved.theme === 'dark' ? saved.theme : null,
  gezien: Array.isArray(saved.gezien) ? saved.gezien : [],
  // Gekozen optie per dilemma: { [dilemmaId]: optie-index }.
  dilemmas: saved.dilemmas && typeof saved.dilemmas === 'object' ? saved.dilemmas : {},
  // Antwoorden in de teamscan: { ['dimensie.vraagIndex']: 1..5 }.
  scan: saved.scan && typeof saved.scan === 'object' ? saved.scan : {}
});

$effect.root(() => {
  $effect(() => {
    save({ rol: prefs.rol, theme: prefs.theme, gezien: [...prefs.gezien], dilemmas: { ...prefs.dilemmas }, scan: { ...prefs.scan } });
  });
  $effect(() => {
    if (prefs.theme) document.documentElement.dataset.theme = prefs.theme;
    else delete document.documentElement.dataset.theme;
  });
});

export function markeerGezien(route) {
  if (!prefs.gezien.includes(route)) prefs.gezien.push(route);
}
