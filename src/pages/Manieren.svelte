<script>
  import { tick } from 'svelte';
  import content from '../lib/content.js';
  import { route } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Keuzehulp from '../components/Keuzehulp.svelte';

  const m = content.manieren;

  // manieren/keuzehulp: open de pagina bij de keuzehulp.
  $effect(() => {
    if (route.parts[1] !== 'keuzehulp') return;
    tick().then(() =>
      setTimeout(() => document.getElementById('keuzehulp')?.scrollIntoView({ block: 'start' }), 60)
    );
  });
</script>

<div class="container">
  <PaginaKop rood blok="B" titel="Manieren van werken" kern="Twee vormen voor verandering, en de run eronder." samenvatting={m.intro} status="concept" />

  <!-- Drie sporen: vast team, project, de run -->
  <figure class="sporen">
    <svg viewBox="0 0 1144 200" role="img" aria-label="Drie sporen onder elkaar. Bovenaan een doorlopend spoor voor vaste teams. Daaronder korte stukken met begin en eind voor projecten. Onderaan een gestippeld spoor voor de run, het werk van ITSM en operationele teams.">
      <path class="s-vast" d="M0 36 H1144" />
      {#each [250, 400, 560, 720, 880, 1040] as x}<circle class="p-vast" cx={x} cy="36" r="11" />{/each}
      <text class="t-kop" x="0" y="12">{m.sporen.vast}</text>
      <text class="t-sub" x="0" y="66">{m.sporen.vast_tekst}</text>

      <path class="s-project" d="M120 112 H330 M470 112 H690 M820 112 H1010" />
      {#each [120, 470, 820] as x}<circle class="begin" cx={x} cy="112" r="9" />{/each}
      {#each [325, 685, 1005] as x}<rect class="eind" {x} y="104" width="10" height="16" rx="2" />{/each}
      {#each [225, 580, 915] as x}<circle class="p-project" cx={x} cy="112" r="10" />{/each}
      <text class="t-kop" x="0" y="90">{m.sporen.project}</text>
      <text class="t-sub" x="0" y="140">{m.sporen.project_tekst}</text>

      <path class="s-run" d="M0 176 H1144" />
      {#each [250, 560, 880] as x}<circle class="p-run" cx={x} cy="176" r="10" />{/each}
      <text class="t-kop run" x="0" y="164">{m.sporen.run}</text>
      <text class="t-sub halo" x="68" y="164">{m.sporen.run_tekst}</text>
    </svg>
  </figure>

  <!-- De twee vormen -->
  <div class="vormen">
    {#each m.vormen as v, i}
      <section class="vorm">
        <div class="vlabel">
          <span class="streep" class:project={i === 1}></span>
          <span>{v.label}</span>
        </div>
        <h2>{v.titel}</h2>
        <p>{v.tekst}</p>
      </section>
    {/each}
  </div>

  <!-- Vergelijking -->
  <div class="tabelwrap">
    <table>
      <caption class="sr-only">{m.vergelijking.titel}</caption>
      <thead>
        <tr>
          <th scope="col">{m.vergelijking.titel}</th>
          <th scope="col" class="h-vast">{m.vormen[0].titel}</th>
          <th scope="col" class="h-project">{m.vormen[1].titel}</th>
        </tr>
      </thead>
      <tbody>
        {#each m.vergelijking.rijen as r}
          <tr>
            <th scope="row">{r.vraag}</th>
            <td>{r.vast}</td>
            <td>{r.project}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- De zes fasen van een project -->
  <section class="fasen">
    <h2>{m.fasen.titel}</h2>
    <p class="fasen-tekst">{m.fasen.tekst}</p>
    <ol>
      {#each m.fasen.stappen as f, i}
        <li>
          <span class="fnr" aria-hidden="true">{i + 1}</span>
          <div>
            <h3>{f.naam}</h3>
            <p>{f.wat}</p>
          </div>
        </li>
      {/each}
    </ol>
  </section>

  <!-- De run -->
  <section class="run">
    <div class="run-tekst">
      <span class="run-label">{m.run.label}</span>
      <h2>{m.run.titel}</h2>
      <p>{m.run.tekst}</p>
      <ul>
        {#each m.run.onderdelen as o}<li>{o}</li>{/each}
      </ul>
    </div>
    <div class="run-kaarten">
      <div class="wit">
        <b>{m.run.storing_titel}</b>
        <span>{m.run.storing_tekst}</span>
      </div>
      <div class="glas">
        <b>{m.run.bouwt_titel}</b>
        <span>{m.run.bouwt_tekst}</span>
      </div>
    </div>
  </section>

  <Keuzehulp />
</div>

<style>
  ul,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .sporen {
    --t-ops: #8cc2f2;
    margin: 28px 0 0;
    padding: 24px 28px 16px;
    border-radius: var(--radius-l);
    background: var(--surface);
  }
  @media (prefers-color-scheme: dark) {
    .sporen {
      --t-ops: #3f8fd8;
    }
  }
  :global([data-theme='dark']) .sporen {
    --t-ops: #3f8fd8;
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .s-vast {
    fill: none;
    stroke: var(--line2);
    stroke-width: 5;
    stroke-linecap: round;
  }
  .s-project {
    fill: none;
    stroke: var(--line1);
    stroke-width: 5;
  }
  .s-run {
    fill: none;
    stroke: var(--t-ops);
    stroke-width: 6;
    stroke-linecap: round;
    stroke-dasharray: 0 12;
  }
  .p-vast {
    fill: var(--line2);
    stroke: var(--surface);
    stroke-width: 3;
  }
  .p-project {
    fill: var(--line1);
    stroke: var(--surface);
    stroke-width: 3;
  }
  .p-run {
    fill: var(--t-ops);
    stroke: var(--ink);
    stroke-width: 1.5;
  }
  .begin {
    fill: var(--surface);
    stroke: var(--line1);
    stroke-width: 3.5;
  }
  .eind {
    fill: var(--line1);
  }
  .t-kop {
    font-size: 15px;
    font-weight: 800;
    fill: var(--ink);
  }
  .t-sub {
    font-size: 14px;
    fill: var(--muted);
  }
  .halo {
    paint-order: stroke;
    stroke: var(--surface);
    stroke-width: 6px;
  }

  .vormen {
    margin-top: 20px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 20px;
  }
  .vorm {
    padding: 28px;
    border-radius: 22px;
    background: var(--surface);
  }
  .vlabel {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .streep {
    width: 44px;
    height: 6px;
    border-radius: 3px;
    background: var(--line2);
  }
  .streep.project {
    height: 5px;
    border-radius: 0;
    background: var(--line1);
  }
  .vorm h2 {
    margin: 12px 0 10px;
    font-size: 26px;
    letter-spacing: -0.025em;
  }
  .vorm p {
    margin: 0;
    line-height: 1.55;
  }

  .tabelwrap {
    margin-top: 20px;
    overflow-x: auto;
    border-radius: 22px;
    background: var(--surface);
  }
  table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
  }
  thead th {
    padding: 14px 22px;
    text-align: left;
    font-size: 13px;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: #fff;
    background: var(--vlak-blauw);
  }
  thead th.h-vast {
    background: var(--line2);
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) thead th.h-vast { color: #00305f; }
  }
  :global([data-theme='dark']) thead th.h-vast {
    color: #00305f;
  }
  tbody th,
  tbody td {
    padding: 16px 22px;
    border-bottom: 1px solid var(--border);
    text-align: left;
    vertical-align: top;
    font-size: 14.5px;
    line-height: 1.5;
    color: var(--muted);
  }
  tbody th {
    width: 22%;
    font-weight: 700;
    color: var(--ink);
    background: var(--chip);
  }
  tbody tr:last-child th,
  tbody tr:last-child td {
    border-bottom: 0;
  }

  .fasen {
    margin-top: 40px;
  }
  .fasen h2 {
    margin: 0 0 8px;
    font-size: 26px;
    letter-spacing: -0.025em;
  }
  .fasen-tekst {
    margin: 0 0 16px;
    max-width: 72ch;
    color: var(--muted);
    line-height: 1.55;
  }
  .fasen ol {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }
  .fasen li {
    display: flex;
    gap: 12px;
    padding: 16px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .fnr {
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 4px;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 800;
    font-size: 13px;
  }
  .fasen h3 {
    margin: 0 0 4px;
    font-size: 16px;
  }
  .fasen li p {
    margin: 0;
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--muted);
  }

  .run {
    margin-top: 40px;
    padding: clamp(24px, 4vw, 40px);
    border-radius: 28px;
    background: var(--vlak-blauw);
    color: #fff;
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
    gap: 40px;
    align-items: start;
  }
  .run h2 {
    margin: 6px 0 12px;
    font-size: clamp(28px, 3.4vw, 36px);
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: #fff;
  }
  .run-label {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8cc2f2;
  }
  .run-tekst p {
    margin: 0;
    line-height: 1.55;
    color: #c9d8ea;
  }
  .run-tekst ul {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 16px;
  }
  .run-tekst li {
    padding: 5px 11px;
    border-radius: 999px;
    background: rgb(255 255 255 / 0.14);
    font-size: 12.5px;
    font-weight: 600;
  }
  .run-kaarten {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .run-kaarten div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 22px;
    border-radius: 18px;
  }
  .run-kaarten b {
    font-size: 18px;
  }
  .run-kaarten span {
    font-size: 15px;
    line-height: 1.5;
  }
  .wit {
    background: #fff;
    color: #004077;
  }
  .wit span {
    color: #3e5878;
  }
  .glas {
    background: rgb(255 255 255 / 0.1);
  }
  .glas span {
    color: #c9d8ea;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
  @media (max-width: 960px) {
    .vormen,
    .run {
      grid-template-columns: minmax(0, 1fr);
    }
    .fasen ol {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 600px) {
    .fasen ol {
      grid-template-columns: minmax(0, 1fr);
    }
    .sporen {
      padding-inline: 16px;
    }
  }
</style>
