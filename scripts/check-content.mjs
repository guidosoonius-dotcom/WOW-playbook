// Snelle contentcontrole zonder volledige build: `npm run content:check`.
import { loadContent } from '../build/content-plugin.js';

try {
  const c = loadContent();
  console.log(
    `✓ Content in orde: ${c.rollen.length} rollen, ${c.events.length} events, ${c.lagen.length} lagen, ` +
      `${c.dilemmas.length} dilemma's, ${c.begrippen.length} begrippen, ${c.beslismatrix.length} besluiten`
  );
} catch (e) {
  console.error(`✗ ${e.message}`);
  process.exit(1);
}
