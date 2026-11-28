// Snelle contentcontrole zonder volledige build: `npm run content:check`.
import { loadContent } from '../build/content-plugin.js';
import { verouderd } from './maak-skill.mjs';

try {
  const c = loadContent();
  console.log(
    `✓ Content in orde: ${c.rollen.length} rollen, ${c.events.length} events, ${c.lagen.length} lagen, ` +
      `${c.dilemmas.length} dilemma's, ${c.begrippen.length} begrippen, ${c.beslismatrix.length} besluiten, ${c.werkvormen.length} werkvormen`
  );
  // De Copilot-skill wordt uit de content gemaakt. Is die achtergebleven, dan een waarschuwing (geen fout):
  // de build en de GitHub-controle maken altijd een actuele versie.
  const oud = verouderd(c);
  if (oud.length) console.warn(`! Copilot-skill niet actueel (${oud.join(', ')}). Draai: npm run skill`);
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
