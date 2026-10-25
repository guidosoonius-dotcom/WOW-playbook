<script>
  import content, { CADANS_LABEL } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';

  let { open = $bindable(false) } = $props();

  let dialog;
  let vraag = $state('');
  let actief = $state(0);

  const strip = (html) => (html ?? '').replace(/<[^>]+>/g, ' ');
  const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const index = [
    ...content.paginas.map((p) => ({ soort: 'Pagina', titel: p.titel, kern: p.kern, route: p.id, tekst: p.samenvatting + strip(p.html) })),
    ...content.lagen.map((l) => ({ soort: 'Laag in het model', titel: l.titel, kern: l.kern, route: 'model', tekst: l.samenvatting + strip(l.html) })),
    ...content.rollen.map((r) => ({ soort: 'Rol', titel: r.titel, kern: r.kern, route: `rollen/${r.id}`, tekst: [r.samenvatting, ...r.verantwoordelijkheden, strip(r.html)].join(' ') })),
    ...content.events.map((e) => ({ soort: CADANS_LABEL[e.cadans], titel: e.titel, kern: e.kern, route: `ritme/${e.id}`, tekst: [e.samenvatting, e.doel, strip(e.html)].join(' ') })),
    ...content.dilemmas.map((d) => ({ soort: 'Dilemma', titel: d.titel, kern: d.kern, route: 'doen/dilemmas', tekst: [d.situatie, d.leerpunt].join(' ') })),
    ...content.beslismatrix.map((b) => ({ soort: 'Wie beslist wat?', titel: b.besluit, kern: b.thema, route: 'beslissen', tekst: '' })),
    { soort: 'Aan de slag', titel: 'Teamscan', kern: 'Hoe staat jullie team ervoor?', route: 'doen/teamscan', tekst: 'scan volwassenheid retro' },
    { soort: 'Aan de slag', titel: 'De transitie', kern: 'Fasen van de kanteling', route: 'transitie', tekst: content.transitie.map((m) => m.titel + ' ' + m.wat).join(' ') },
    ...content.begrippen.map((b) => ({ soort: 'Begrip', titel: b.term, kern: b.uitleg, route: `woordenlijst/${b.id}`, tekst: [b.safe_term, ...(b.synoniemen ?? [])].join(' ') }))
  ].map((i) => ({ ...i, zoek: norm(`${i.titel} ${i.kern} ${i.tekst}`), titelNorm: norm(i.titel) }));

  const resultaten = $derived.by(() => {
    const woorden = norm(vraag).split(/\s+/).filter(Boolean);
    if (!woorden.length) return index.filter((i) => i.soort === 'Pagina' || i.soort === 'Rol').slice(0, 8);
    return index
      .filter((i) => woorden.every((w) => i.zoek.includes(w)))
      .map((i) => ({ ...i, score: woorden.reduce((s, w) => s + (i.titelNorm.includes(w) ? 10 : 1), 0) }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 12);
  });

  $effect(() => {
    if (open && !dialog.open) {
      vraag = '';
      actief = 0;
      dialog.showModal();
    } else if (!open && dialog.open) dialog.close();
  });

  $effect(() => {
    vraag;
    actief = 0;
  });

  function ga(r) {
    location.hash = href(r.route);
    open = false;
  }

  function onkeydown(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      actief = Math.min(actief + 1, resultaten.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      actief = Math.max(actief - 1, 0);
    } else if (e.key === 'Enter' && resultaten[actief]) {
      e.preventDefault();
      ga(resultaten[actief]);
    }
  }
</script>

<dialog bind:this={dialog} onclose={() => (open = false)} onclick={(e) => e.target === dialog && (open = false)} aria-label="Zoeken in het playbook">
  <div class="paneel">
    <label class="veld">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /></svg>
      <span class="sr-only">Zoekterm</span>
      <!-- svelte-ignore a11y_autofocus -->
      <input
        type="search"
        bind:value={vraag}
        {onkeydown}
        placeholder="Zoek een rol, event of begrip…"
        autofocus
        role="combobox"
        aria-expanded="true"
        aria-controls="zoekresultaten"
        aria-activedescendant={resultaten[actief] ? `zr-${actief}` : undefined}
      />
      <kbd>Esc</kbd>
    </label>
    <ul id="zoekresultaten" role="listbox" aria-label="Resultaten">
      {#each resultaten as r, i}
        <li id="zr-{i}" role="option" aria-selected={i === actief}>
          <a href={href(r.route)} onclick={() => (open = false)} class:actief={i === actief}>
            <span class="soort">{r.soort}</span>
            <strong>{r.titel}</strong>
            <span class="kern">{r.kern}</span>
          </a>
        </li>
      {:else}
        <li class="leeg">Niets gevonden voor “{vraag}”. Probeer een ander woord.</li>
      {/each}
    </ul>
  </div>
</dialog>

<style>
  dialog {
    width: min(640px, calc(100vw - 32px));
    max-height: min(640px, calc(100vh - 64px));
    margin: 10vh auto auto;
    padding: 0;
    border: 0;
    border-radius: 24px;
    background: var(--bg);
    color: var(--ink);
    box-shadow: 0 24px 64px rgba(10, 26, 51, 0.3);
  }
  dialog::backdrop {
    background: rgba(10, 26, 51, 0.45);
  }
  .paneel {
    display: flex;
    flex-direction: column;
    max-height: inherit;
  }
  .veld {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }
  input {
    flex: 1;
    min-width: 0;
    border: 0;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 17px;
    outline: none;
  }
  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--surface);
    color: var(--muted);
  }
  svg {
    width: 18px;
    height: 18px;
    fill: none;
    stroke: var(--muted);
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 8px;
    overflow-y: auto;
  }
  a {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    border-radius: 14px;
    color: var(--ink);
    text-decoration: none;
  }
  a.actief,
  a:hover {
    background: var(--surface);
  }
  .soort {
    font-size: 12px;
    font-weight: 600;
    color: var(--value-text);
  }
  .kern {
    font-size: 13.5px;
    color: var(--muted);
  }
  .leeg {
    padding: 16px;
    color: var(--muted);
  }
</style>
