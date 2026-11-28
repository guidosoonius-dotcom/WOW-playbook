<script>
  import Kenmerken from './Kenmerken.svelte';
  // Het productteam als ring rond het product: kies een rol en zie wat die doet.
  import { href } from '../../lib/router.svelte.js';

  let { uitleg } = $props();

  import Icoon from '../Icoon.svelte';

  const rollen = $derived(uitleg.teamrollen ?? []);
  const specialismen = $derived((uitleg.specialismen ?? []).map((sp) => ({ ...sp, soort: 'specialisme' })));
  let toonExtra = $state(false);
  const alle = $derived(toonExtra ? [...rollen, ...specialismen] : rollen);
  let gekozen = $state(0);
  const rol = $derived(alle[gekozen] ?? alle[0]);

  function wissel() {
    toonExtra = !toonExtra;
    if (!toonExtra && gekozen >= rollen.length) gekozen = 0;
    else if (toonExtra) gekozen = rollen.length;
  }

  const C = 200;
  const R = 140;
  const R2 = 196; // de buitenring met extra specialismen
  // Labels naast de halte: links van de ring rechts uitgelijnd, rechts links uitgelijnd, boven/onder gecentreerd.
  const label = (x, y) => {
    if (x < C - 20) return { x: x - 22, y: y + 5, anker: 'end' };
    if (x > C + 20) return { x: x + 22, y: y + 5, anker: 'start' };
    return { x, y: y + (y > C ? 36 : -24), anker: 'middle' };
  };
  // Met de buitenring erbij staan de labels van de vaste rollen binnen de ring, zodat ze niet botsen.
  const labelBinnen = (x, y) => {
    if (Math.abs(x - C) < 20) return { x, y: y + (y < C ? 30 : -22), anker: 'middle' };
    if (y > C + 20) return { x, y: y - 22, anker: 'middle' };
    return x < C ? { x: x + 20, y: y + 4, anker: 'start' } : { x: x - 20, y: y + 4, anker: 'end' };
  };
  const punt = (i, n, r = R, start = -Math.PI / 2) => {
    const hoek = start + (i * 2 * Math.PI) / n;
    return [C + r * Math.cos(hoek), C + r * Math.sin(hoek)];
  };
  // Positie op de ring: vaste rollen op de binnenring, specialismen op de buitenring (iets gedraaid).
  const plek = (i) => (i < rollen.length ? punt(i, rollen.length) : punt(i - rollen.length, specialismen.length, R2, -Math.PI / 2 + Math.PI / specialismen.length));
</script>

<Kenmerken titel="Kenmerken van een productteam" kenmerken={uitleg.kenmerken ?? []} />

<section class="sectie" aria-labelledby="rollen">
  <h2 id="rollen">Wie zit er in het team?</h2>
  <div class="team">
    <svg viewBox={toonExtra ? '-96 -36 592 472' : '0 0 400 400'} aria-hidden="true" class="ring" class:breed={toonExtra}>
      {#if toonExtra}
        <circle cx={C} cy={C} r={R2} class="buitenbaan" />
      {/if}
      <circle cx={C} cy={C} r={R} class="baan" />
      <circle cx={C} cy={C} r={R} class="trein" pathLength="100" />
      {#each alle as r, i}
        {@const [x, y] = plek(i)}
        <line x1={C} y1={C} x2={x} y2={y} class="spaak" class:actief={i === gekozen} />
      {/each}
      {#if toonExtra}
        <circle cx={C} cy={C} r="40" class="product" />
        <text x={C} y={C + 6} text-anchor="middle" class="product-tekst">Product</text>
      {:else}
        <circle cx={C} cy={C} r="58" class="product" />
        <text x={C} y={C - 8} text-anchor="middle" class="product-tekst">Product</text>
        <text x={C} y={C + 12} text-anchor="middle" class="product-sub">bouwen · beheren</text>
        <text x={C} y={C + 26} text-anchor="middle" class="product-sub">verbeteren</text>
      {/if}
      {#each alle as r, i}
        {@const [x, y] = plek(i)}
        <circle cx={x} cy={y} r={i === gekozen ? 16 : 12} class="node node--{r.soort}" class:actief={i === gekozen} />
        {@const l = toonExtra && i < rollen.length ? labelBinnen(x, y) : label(x, y)}
        <text x={l.x} y={l.y} text-anchor={l.anker} class="node-tekst" class:klein={toonExtra && i < rollen.length} class:actief={i === gekozen}>{r.label ?? r.naam}</text>
      {/each}
    </svg>

    <div class="detail">
      {#if specialismen.length}
        <button class="extra" aria-pressed={toonExtra} onclick={wissel}>
          <span class="stip stip--specialisme" aria-hidden="true"></span>
          {toonExtra ? 'Verberg extra specialismen' : `Toon extra specialismen (${specialismen.length})`}
        </button>
      {/if}
      <div class="keuze" role="radiogroup" aria-label="Kies een rol in het team">
        {#each alle as r, i}
          <button role="radio" aria-checked={i === gekozen} onclick={() => (gekozen = i)}>
            <span class="stip stip--{r.soort}" aria-hidden="true"></span>{r.label ?? r.naam}
          </button>
        {/each}
      </div>

      {#if rol}
        {#key gekozen}
          <article class="kaart">
            <h3>{rol.naam}</h3>
            {#if rol.bij_ons && rol.bij_ons !== rol.naam}<p class="bij-ons">Bij ons: {rol.bij_ons}</p>{/if}
            <p class="kort">{rol.kort}</p>
            {#if rol.vast_als}<p class="vast-als"><strong>Vast in het team als</strong> {rol.vast_als.replace(/^\w/, (c) => c.toLowerCase())}</p>{/if}
            {#if rol.doet?.length}
              <ul class="lijst">{#each rol.doet as d}<li>{d}</li>{/each}</ul>
            {/if}
            {#if rol.rol_id}
              <a class="meer" href={href('rollen/' + rol.rol_id)}>{rol.soort === 'rol' ? 'Bekijk de rolkaart' : 'Bekijk de rolkaart Teamlid'} →</a>
            {/if}
          </article>
        {/key}
      {/if}
      <p class="legenda">
        <span><span class="stip stip--rol" aria-hidden="true"></span>Rol met een eigen verantwoordelijkheid</span>
        <span><span class="stip stip--vak" aria-hidden="true"></span>Vakmanschap binnen het team</span>
        {#if toonExtra}<span><span class="stip stip--specialisme" aria-hidden="true"></span>Extra specialisme, vast in sommige teams</span>{/if}
      </p>
    </div>
  </div>
</section>

{#if specialismen.length}
  <section class="sectie" aria-labelledby="specialismen">
    <h2 id="specialismen">Extra specialismen</h2>
    <p class="intro">Naast de vaste rollen hebben sommige teams een specialist vast in het team. Dat hangt af van het product. Bij elk specialisme staat wanneer het erbij hoort.</p>
    <ul class="specialismen">
      {#each specialismen as sp}
        <li>
          <Icoon naam={sp.icoon} />
          <div>
            <strong>{sp.naam}</strong>
            <span>{sp.kort}</span>
            <small><b>Vast in het team als</b> {sp.vast_als.replace(/^\w/, (c) => c.toLowerCase())}</small>
          </div>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }

  .team {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 6fr);
    gap: 32px;
    align-items: start;
  }
  .ring {
    width: 100%;
    height: auto;
    border-radius: var(--radius-l);
    background: var(--panel);
    overflow: visible;
    padding: 8px 72px;
    box-sizing: border-box;
  }
  .ring.breed {
    padding: 8px 24px;
  }
  .buitenbaan {
    fill: none;
    stroke: var(--line2);
    stroke-width: 2;
    stroke-dasharray: 6 6;
    animation: in 0.5s ease both;
  }
  .baan {
    fill: none;
    stroke: var(--line1);
    stroke-width: 3;
  }
  .trein {
    fill: none;
    stroke: var(--value);
    stroke-width: 10;
    stroke-linecap: round;
    stroke-dasharray: 0.5 99.5;
    animation: rond 9s linear infinite;
  }
  @keyframes rond {
    from {
      stroke-dashoffset: 100;
    }
    to {
      stroke-dashoffset: 0;
    }
  }
  .spaak {
    stroke: var(--track);
    stroke-width: 1.5;
    stroke-dasharray: 4 5;
    transition: stroke 0.3s ease;
  }
  .spaak.actief {
    stroke: var(--value);
  }
  .product {
    fill: var(--bg);
    stroke: var(--ink);
    stroke-width: 2;
  }
  .product-tekst {
    font-family: var(--font);
    font-size: 17px;
    font-weight: 700;
    fill: var(--ink);
  }
  .product-sub {
    font-family: var(--font);
    font-size: 11px;
    fill: var(--muted);
  }
  .node {
    fill: var(--bg);
    stroke-width: 3.5;
    transition: r 0.3s ease, fill 0.3s ease;
  }
  .node--rol {
    stroke: var(--line1);
  }
  .node--vak {
    stroke: var(--line2);
  }
  .node--specialisme {
    stroke: var(--line2);
    stroke-dasharray: 4 3;
    stroke-width: 3;
  }
  .node.actief {
    fill: var(--value);
    stroke: var(--value);
  }
  .node-tekst {
    font-family: var(--font);
    font-size: 13px;
    font-weight: 600;
    fill: var(--muted);
  }
  .node-tekst.klein {
    font-size: 11.5px;
  }
  .node-tekst.actief {
    fill: var(--ink);
    font-weight: 700;
  }

  .detail {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .keuze {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .keuze button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 16px;
    border-radius: var(--radius-tag);
    border: 0;
    background: var(--surface);
    font-weight: 600;
  }
  .keuze button[aria-checked='true'] {
    background: var(--ink);
    color: var(--bg);
  }
  .stip {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 3px solid;
  }
  .stip--rol {
    border-color: var(--line1);
  }
  .stip--vak {
    border-color: var(--line2);
  }
  .stip--specialisme {
    border-color: var(--line2);
    border-style: dashed;
  }
  .extra {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 10px;
    min-height: 44px;
    padding: 0 18px;
    border-radius: var(--radius-tag);
    border: 1.5px dashed var(--line2);
    background: transparent;
    color: var(--ink);
    font-weight: 700;
  }
  .extra[aria-pressed='true'] {
    border-style: solid;
    background: var(--surface);
  }
  .vast-als {
    margin: -4px 0 12px;
    padding: 10px 14px;
    border-radius: var(--radius-s);
    background: var(--chip);
    font-size: 15px;
  }
  .intro {
    margin: -6px 0 16px;
    max-width: 70ch;
    color: var(--muted);
  }
  .specialismen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
    gap: 12px;
  }
  .specialismen li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    border-radius: var(--radius-m);
    background: var(--surface);
    border: 1.5px dashed var(--border);
  }
  .specialismen div {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
  }
  .specialismen strong {
    font-size: 17px;
  }
  .specialismen span {
    color: var(--muted);
    font-size: 15px;
  }
  .specialismen small {
    margin-top: 4px;
    font-size: 14px;
  }
  .kaart {
    padding: 24px;
    border-radius: var(--radius-m);
    background: var(--surface);
    animation: in 0.4s ease both;
  }
  .kaart h3 {
    font-size: 22px;
  }
  .bij-ons {
    margin: 4px 0 0;
    font-size: 14px;
    font-weight: 600;
    color: var(--line1);
  }
  .kort {
    margin: 10px 0 12px;
    font-size: 17px;
  }
  .meer {
    display: inline-block;
    margin-top: 12px;
    font-weight: 600;
  }
  .legenda {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 20px;
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  .legenda > span {
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @media (max-width: 860px) {
    .team {
      grid-template-columns: minmax(0, 1fr);
    }
    .ring {
      max-width: 420px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .trein {
      display: none;
    }
  }
</style>
