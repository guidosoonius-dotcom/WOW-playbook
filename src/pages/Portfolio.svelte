<script>
  import content from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const p = content.portfolio;
  const vast = p.routes[0];
  const project = p.routes[1];
</script>

<div class="container">
  <PaginaKop rood blok="C" titel={p.titel} kern={p.kern} samenvatting={p.lead} status="concept" />

  <!-- De trechter -->
  <ol class="trechter">
    {#each p.trechter as stap, i}
      <li class:donker={i === 2}>
        <span class="nr" aria-hidden="true">{i + 1}</span>
        <h2>{stap.titel}</h2>
        <p>{stap.tekst}</p>
        {#if stap.uitkomsten}
          <ul class="uitkomsten">
            {#each stap.uitkomsten as u}<li>{u}</li>{/each}
          </ul>
        {/if}
        {#if stap.knop}<a class="knop" href={href('manieren/keuzehulp')}>{stap.knop}</a>{/if}
      </li>
    {/each}
  </ol>

  <div class="routes">
    <!-- Route 1: vast team -->
    <section class="route">
      <div class="kop">
        <h2>{vast.titel}</h2>
        <span class="past vast">{vast.past}</span>
      </div>
      <p>{vast.tekst}</p>
      <ol class="lijn lijn-vast" style="--n: {vast.stations.length}">
        {#each vast.stations as s, i}
          <li><span class="dot" class:uit={i === vast.stations.length - 1}></span><span class="t">{s}</span></li>
        {/each}
      </ol>
    </section>

    <!-- Route 2: project -->
    <section class="route">
      <div class="kop">
        <h2>{project.titel}</h2>
        <span class="past">{project.past}</span>
      </div>
      <p>{project.tekst}</p>
      <ol class="lijn lijn-project" style="--n: {project.stations.length}">
        {#each project.stations as s, i}
          <li>
            <span class="dot" class:poort={s.poort} class:open={i === 0} class:uit={i === project.stations.length - 1}></span>
            <span class="t">{#if s.poort}<i>{s.poort}</i>{/if}{s.naam}</span>
          </li>
        {/each}
      </ol>
      <p class="terug"><b>{project.noot_label}:</b> {project.noot}</p>
    </section>

    <!-- De run, buiten de trechter -->
    <section class="route run">
      <div class="kop">
        <h2>{p.run.titel}</h2>
        <span class="past">{p.run.past}</span>
      </div>
      <p>{p.run.tekst}</p>
      <ol class="lijn lijn-run" style="--n: {p.run.stations.length}">
        {#each p.run.stations as s}
          <li><span class="dot"></span><span class="t">{s}</span></li>
        {/each}
      </ol>
      <p class="terug"><b>{p.run.terug_label}</b> {p.run.terug}</p>
    </section>
  </div>

  <section class="slot">
    <div>
      <h2>{p.slot.titel}</h2>
      <p>{p.slot.tekst}</p>
    </div>
    <div class="volgt">
      <span class="vl">{p.slot.volgt_label}</span>
      <h3>{p.slot.volgt_titel}</h3>
      <p>{p.slot.volgt_tekst}</p>
    </div>
  </section>
</div>

<style>
  ol,
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .trechter {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 20px;
  }
  .trechter > li {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border-radius: 20px;
    background: var(--surface);
  }
  .trechter > li.donker {
    background: var(--vlak-blauw);
    color: #fff;
  }
  .trechter h2 {
    margin: 0;
    font-size: 19px;
    letter-spacing: -0.02em;
  }
  .donker h2 {
    color: #fff;
  }
  .trechter p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
  }
  .donker p {
    color: #c9d8ea;
  }
  .nr {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 800;
    font-size: 14px;
  }
  .donker .nr {
    background: #fff;
    color: #004077;
  }
  .uitkomsten {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 4px;
  }
  .uitkomsten li {
    padding: 4px 10px;
    border-radius: 999px;
    background: var(--chip);
    font-size: 12px;
    font-weight: 700;
  }
  .knop {
    align-self: flex-start;
    margin-top: 6px;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    background: #fff;
    color: #004077;
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
  }

  .routes {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .route {
    padding: 24px 28px;
    border-radius: 20px;
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .route.run {
    background: transparent;
    border: 2px dashed var(--muted);
  }
  .kop {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 6px 14px;
  }
  .kop h2 {
    margin: 0;
    font-size: 24px;
    letter-spacing: -0.02em;
  }
  .past {
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
  }
  .past.vast {
    color: var(--line2);
  }
  .route > p {
    margin: 0;
    line-height: 1.55;
    color: var(--muted);
    max-width: 90ch;
  }

  /* De stations langs een lijn. */
  .lijn {
    --lijnkleur: var(--line2);
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--n), minmax(0, 1fr));
    gap: 4px;
    margin-top: 6px;
  }
  .lijn::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    top: 8px;
    border-top: 5px solid var(--lijnkleur);
    border-radius: 3px;
  }
  .lijn-project {
    --lijnkleur: var(--line1);
  }
  .lijn-project::before {
    border-top-style: dashed;
    border-top-width: 4px;
    border-radius: 0;
  }
  .lijn-run {
    --lijnkleur: #8cc2f2;
  }
  .lijn-run::before {
    border-top-style: dotted;
    border-top-width: 6px;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .lijn-run { --lijnkleur: #3f8fd8; }
  }
  :global([data-theme='dark']) .lijn-run {
    --lijnkleur: #3f8fd8;
  }
  .lijn li {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    text-align: center;
    min-width: 0;
  }
  .dot {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid var(--surface);
    box-sizing: border-box;
    background: var(--lijnkleur);
  }
  .route.run .dot {
    border-color: var(--bg);
    box-shadow: inset 0 0 0 1.5px var(--ink);
  }
  .dot.poort {
    border-radius: 4px;
  }
  .dot.open {
    background: var(--surface);
    border-color: var(--line1);
  }
  .dot.uit {
    background: var(--surface);
    border-color: var(--value);
  }
  .t {
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.3;
    padding-inline: 2px;
  }
  .t i {
    display: block;
    font-style: normal;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.04em;
    color: var(--muted);
  }
  .terug {
    margin: 0;
    padding: 12px 14px;
    border-radius: var(--radius-s);
    background: var(--chip);
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--muted);
  }
  .terug b {
    color: var(--ink);
  }

  .slot {
    margin-top: 24px;
    padding: clamp(24px, 4vw, 40px);
    border-radius: 28px;
    background: var(--surface);
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;
    align-items: center;
  }
  .slot h2 {
    margin: 0 0 12px;
    font-size: clamp(26px, 3vw, 34px);
    line-height: 1.1;
    letter-spacing: -0.03em;
  }
  .slot p {
    margin: 0;
    line-height: 1.6;
    color: var(--muted);
  }
  .volgt {
    padding: 24px;
    border-radius: 22px;
    border: 2px dashed var(--muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vl {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .volgt h3 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.02em;
  }
  .volgt p {
    font-size: 14.5px;
  }

  @media (max-width: 960px) {
    .trechter,
    .slot {
      grid-template-columns: minmax(0, 1fr);
    }
    /* Smal scherm: de stations onder elkaar, de lijn links. */
    .lijn {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
      padding-left: 4px;
    }
    .lijn::before {
      right: auto;
      left: 11px;
      top: 8px;
      bottom: 8px;
      border-top: 0;
      border-left: 5px solid var(--lijnkleur);
    }
    .lijn-project::before {
      border-left-style: dashed;
      border-left-width: 4px;
    }
    .lijn-run::before {
      border-left-style: dotted;
      border-left-width: 6px;
    }
    .lijn li {
      flex-direction: row;
      text-align: left;
      gap: 14px;
    }
    .t {
      font-size: 14px;
    }
  }
</style>
