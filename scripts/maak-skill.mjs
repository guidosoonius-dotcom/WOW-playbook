// Schrijft de Copilot Cowork-skill en de prompt voor Microsoft 365 Copilot vanuit de content:
//   npm run skill            → cowork/playbook-redacteur/SKILL.md en docs/m365-copilot-prompt.md
//   npm run skill -- --check → alleen controleren of ze actueel zijn
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { loadContent } from '../build/content-plugin.js';
import { maakSkill } from '../build/skill.js';

export const BESTANDEN = { skill: 'cowork/playbook-redacteur/SKILL.md', prompt: 'docs/m365-copilot-prompt.md' };

export function verouderd(c) {
  const nieuw = maakSkill(c);
  return Object.entries(BESTANDEN).filter(([k, pad]) => !existsSync(pad) || readFileSync(pad, 'utf8') !== nieuw[k]).map(([, pad]) => pad);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const c = loadContent();
  if (process.argv.includes('--check')) {
    const oud = verouderd(c);
    if (oud.length) {
      console.error(`✗ Niet actueel: ${oud.join(', ')}. Draai: npm run skill`);
      process.exit(1);
    }
    console.log('✓ Cowork-skill en prompt zijn actueel');
  } else {
    const nieuw = maakSkill(c);
    for (const [k, pad] of Object.entries(BESTANDEN)) writeFileSync(pad, nieuw[k]);
    console.log(`✓ Geschreven: ${Object.values(BESTANDEN).join(', ')} (${Math.round(nieuw.skill.length / 1000)}k tekens skill)`);
  }
}
