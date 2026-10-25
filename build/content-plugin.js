// Vite-plugin die de content/-map inleest, valideert en als `virtual:content` aanbiedt.
// Fouten in de content (ontbrekende velden, kapotte verwijzingen) laten de build falen,
// zodat er nooit een playbook met dode links of halve items wordt verspreid.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import yaml from 'js-yaml';
import { marked } from 'marked';

const VIRTUAL_ID = 'virtual:content';
const RESOLVED_ID = '\0' + VIRTUAL_ID;
const CONTENT_DIR = 'content';

const BASE_REQUIRED = ['id', 'type', 'titel', 'kern', 'status', 'eigenaar', 'bijgewerkt'];
const STATUS = ['concept', 'review', 'vastgesteld'];
const CADANS = ['dagelijks', 'iteratie', 'kwartaal', 'portfolio'];

const TYPE_REQUIRED = {
  pagina: ['samenvatting'],
  laag: ['samenvatting', 'niveau', 'doel', 'beslist_over'],
  rol: ['samenvatting', 'laag', 'niveau_label', 'in_een_zin', 'verantwoordelijkheden', 'niet_meer', 'werkt_samen_met', 'events'],
  event: ['samenvatting', 'cadans', 'wanneer', 'duur', 'doel', 'deelnemers', 'output', 'goed_als', 'valkuilen'],
  explainer: ['scene', 'duur', 'stappen']
};

// Routes die buiten de content om bestaan (pagina's in src/pages).
const STATIC_ROUTES = ['', 'waarom', 'model', 'rollen', 'ritme', 'sturen', 'woordenlijst', 'over'];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

function parseMarkdown(file) {
  const raw = readFileSync(file, 'utf8');
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) throw new Error(`${file}: frontmatter (--- … ---) ontbreekt`);
  const data = yaml.load(match[1]) ?? {};
  return { ...data, body: match[2].trim() };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Zet het eerste voorkomen van elk begrip in lopende tekst om naar een link met hover-uitleg.
function linkTerms(html, begrippen) {
  if (!html) return html;
  const used = new Set();
  const skipTags = /^(a|code|pre|h1|h2|h3|h4)$/i;
  const stack = [];
  const patterns = begrippen
    .flatMap((b) => [b.term, ...(b.synoniemen ?? [])].map((t) => ({ t, b })))
    .sort((x, y) => y.t.length - x.t.length);

  return html
    .split(/(<[^>]+>)/)
    .map((part) => {
      const tag = part.match(/^<(\/?)([a-z0-9]+)/i);
      if (tag) {
        if (!part.endsWith('/>')) {
          if (tag[1]) stack.pop();
          else if (!/^(br|hr|img|input)$/i.test(tag[2])) stack.push(tag[2]);
        }
        return part;
      }
      if (stack.some((t) => skipTags.test(t))) return part;
      // Verzamel eerst alle treffers in de originele tekst, zodat links elkaar niet overlappen.
      const hits = [];
      for (const { t, b } of patterns) {
        if (used.has(b.id)) continue;
        const re = new RegExp(`(^|[^\\p{L}\\p{N}-])(${escapeRegExp(t)})(?=$|[^\\p{L}\\p{N}-])`, 'giu');
        for (const m of part.matchAll(re)) {
          const start = m.index + m[1].length;
          const end = start + m[2].length;
          if (hits.some((h) => start < h.end && end > h.start)) continue;
          hits.push({ start, end, b });
          used.add(b.id);
          break;
        }
      }
      if (!hits.length) return part;
      hits.sort((x, y) => x.start - y.start);
      let out = '';
      let pos = 0;
      for (const h of hits) {
        const word = part.slice(h.start, h.end);
        out += part.slice(pos, h.start) + `<a class="term" href="#/woordenlijst/${h.b.id}" data-tip="${escapeHtml(h.b.uitleg)}">${word}</a>`;
        pos = h.end;
      }
      return out + part.slice(pos);
    })
    .join('');
}

export function loadContent(root = process.cwd()) {
  const dir = join(root, CONTENT_DIR);
  const errors = [];
  const items = [];
  const data = {};

  for (const file of walk(dir)) {
    const rel = relative(root, file).split(sep).join('/');
    try {
      if (file.endsWith('.md')) items.push({ ...parseMarkdown(file), _file: rel });
      else if (file.endsWith('.yaml') || file.endsWith('.yml')) {
        const key = rel.split('/').pop().replace(/\.ya?ml$/, '');
        data[key] = yaml.load(readFileSync(file, 'utf8'));
      }
    } catch (e) {
      errors.push(`${rel}: ${e.message}`);
    }
  }

  const byType = (type) => items.filter((i) => i.type === type);
  const ids = new Set();

  for (const item of items) {
    const where = item._file;
    for (const f of [...BASE_REQUIRED, ...(TYPE_REQUIRED[item.type] ?? [])]) {
      if (item[f] === undefined || item[f] === null || item[f] === '') errors.push(`${where}: verplicht veld "${f}" ontbreekt`);
    }
    if (!TYPE_REQUIRED[item.type]) errors.push(`${where}: onbekend type "${item.type}"`);
    if (item.status && !STATUS.includes(item.status)) errors.push(`${where}: status moet een van ${STATUS.join(', ')} zijn`);
    if (item.kern && item.kern.length > 140) errors.push(`${where}: "kern" is ${item.kern.length} tekens (max. 140)`);
    if (item.type === 'event' && !CADANS.includes(item.cadans)) errors.push(`${where}: cadans moet een van ${CADANS.join(', ')} zijn`);
    if (item.type === 'explainer' && (!Array.isArray(item.stappen) || item.stappen.length < 2)) errors.push(`${where}: een explainer heeft minimaal 2 stappen`);
    const key = `${item.type}:${item.id}`;
    if (ids.has(key)) errors.push(`${where}: id "${item.id}" komt dubbel voor`);
    ids.add(key);
    if (item.bijgewerkt instanceof Date) item.bijgewerkt = item.bijgewerkt.toISOString().slice(0, 10);
  }

  const rolIds = new Set(byType('rol').map((r) => r.id));
  const eventIds = new Set(byType('event').map((e) => e.id));
  const laagIds = new Set(byType('laag').map((l) => l.id));
  const explainerIds = new Set(byType('explainer').map((e) => e.id));
  const check = (cond, msg) => cond || errors.push(msg);

  for (const r of byType('rol')) {
    check(laagIds.has(r.laag), `${r._file}: laag "${r.laag}" bestaat niet`);
    for (const w of r.werkt_samen_met ?? []) check(rolIds.has(w.rol), `${r._file}: werkt_samen_met verwijst naar onbekende rol "${w.rol}"`);
    for (const e of r.events ?? []) check(eventIds.has(e.event), `${r._file}: events verwijst naar onbekend event "${e.event}"`);
  }
  for (const e of byType('event')) {
    for (const d of e.deelnemers ?? []) check(rolIds.has(d.rol), `${e._file}: deelnemer "${d.rol}" is geen bekende rol`);
    if (e.laag) check(laagIds.has(e.laag), `${e._file}: laag "${e.laag}" bestaat niet`);
    if (e.explainer) check(explainerIds.has(e.explainer), `${e._file}: explainer "${e.explainer}" bestaat niet`);
  }
  for (const p of byType('pagina')) {
    if (p.explainer) check(explainerIds.has(p.explainer), `${p._file}: explainer "${p.explainer}" bestaat niet`);
  }

  const routes = new Set([
    ...STATIC_ROUTES,
    ...[...rolIds].map((id) => `rollen/${id}`),
    ...[...eventIds].map((id) => `ritme/${id}`)
  ]);
  for (const [rol, stappen] of Object.entries(data.routes ?? {})) {
    check(rolIds.has(rol), `content/data/routes.yaml: onbekende rol "${rol}"`);
    for (const s of stappen) check(routes.has(s.route), `content/data/routes.yaml: route "${s.route}" bij ${rol} bestaat niet`);
  }
  for (const b of data.begrippen ?? []) {
    check(b.id && b.term && b.uitleg, `content/data/begrippen.yaml: begrip ${b.id ?? '?'} mist id, term of uitleg`);
    if (b.uitleg) check(b.uitleg.length <= 220, `content/data/begrippen.yaml: uitleg bij "${b.id}" is langer dan 220 tekens`);
  }

  if (errors.length) {
    throw new Error(`Contentfouten (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  }

  const begrippen = (data.begrippen ?? []).slice().sort((a, b) => a.term.localeCompare(b.term, 'nl'));
  const out = { rollen: [], events: [], lagen: [], paginas: [], explainers: [] };
  const plural = { rol: 'rollen', event: 'events', laag: 'lagen', pagina: 'paginas', explainer: 'explainers' };
  for (const item of items) {
    const { _file, body, ...rest } = item;
    out[plural[item.type]].push({ ...rest, html: body ? linkTerms(marked.parse(body), begrippen) : '' });
  }
  out.lagen.sort((a, b) => a.niveau - b.niveau);
  out.rollen.sort((a, b) => (a.volgorde ?? 99) - (b.volgorde ?? 99));
  out.events.sort((a, b) => CADANS.indexOf(a.cadans) - CADANS.indexOf(b.cadans) || (a.volgorde ?? 99) - (b.volgorde ?? 99));

  return {
    ...out,
    begrippen,
    verschuivingen: data.verschuivingen ?? [],
    routes: data.routes ?? {},
    changelog: data.changelog ?? []
  };
}

export function contentPlugin() {
  return {
    name: 'playbook-content',
    resolveId(id) {
      return id === VIRTUAL_ID ? RESOLVED_ID : null;
    },
    load(id) {
      if (id !== RESOLVED_ID) return null;
      for (const f of walk(join(process.cwd(), CONTENT_DIR))) this.addWatchFile(f);
      return `export default ${JSON.stringify(loadContent())};`;
    },
    handleHotUpdate({ file, server }) {
      if (file.includes(`${sep}${CONTENT_DIR}${sep}`)) {
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
        return [];
      }
    }
  };
}
