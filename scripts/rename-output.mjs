// Geeft het gebouwde bestand een herkenbare naam voor verspreiding via het intranet.
import { renameSync, statSync } from 'node:fs';

const target = 'dist/samen-digitaal-playbook.html';
renameSync('dist/index.html', target);
const kb = Math.round(statSync(target).size / 1024);
console.log(`✓ ${target} (${kb} kB)`);
