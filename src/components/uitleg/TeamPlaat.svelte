<script>
  import Kenmerken from './Kenmerken.svelte';
  // Het productteam als ring rond het product: kies een rol en zie wat die doet.
  import { href } from '../../lib/router.svelte.js';

  let { uitleg } = $props();

  const rollen = $derived(uitleg.teamrollen ?? []);
  let gekozen = $state(0);
  const rol = $derived(rollen[gekozen] ?? rollen[0]);

  const C = 200;
  const R = 140;
  // Labels naast de halte: links van de ring rechts uitgelijnd, rechts links uitgelijnd, boven/onder gecentreerd.
  const label = (x, y) => {
    if (x < C - 20) return { x: x - 22, y: y + 5, anker: 'end' };
    if (x > C + 20) return { x: x + 22, y: y + 5, anker: 'start' };
    return { x, y: y + (y > C ? 36 : -24), anker: 'middle' };
  };
  const punt = (i, n) => {
    const hoek = -Math.PI / 2 + (i * 2 * Math.PI) / n;
    return [C + R * Math.cos(hoek), C + R * Math.sin(hoek)];
  };
</script>

<Kenmerken titel="Kenmerken van een productteam" kenmerken={uitleg.kenmerken ?? []} />

<section class="sectie" aria-labelledby="rollen">
  <h2 id="rollen">Wie zit er in het team?</h2>
  <div class="team">
    <svg viewBox="0 0 400 400" aria-hidden="true" class="ring">
      <circle cx={C} cy={C} r={R} class="baan" />
      <circle cx={C} cy={C} r={R} class="trein" pathLength="100" />
      {#each rollen as r, i}
        {@const [x, y] = punt(i, rollen.length)}
        <line x1={C} y1={C} x2={x} y2={y} class="spaak" class:actief={i === gekozen} />
      {/each}
      <circle cx={C} cy={C} r="58" class="product" />
      <text x={C} y={C - 8} text-anchor="middle" class="product-tekst">Product</text>
      <text x={C} y={C + 12} text-anchor="middle" class="product-sub">bouwen · beheren</text>
      <text x={C} y={C + 26} text-anchor="middle" class="product-sub">verbeteren</text>
      {#each rollen as r, i}
        {@const [x, y] = punt(i, rollen.length)}
        <circle cx={x} cy={y} r={i === gekozen ? 16 : 12} class="node node--{r.soort}" class:actief={i === gekozen} />
        {@const l = label(x, y)}
        <text x={l.x} y={l.y} text-anchor={l.anker} class="node-tekst" class:actief={i === gekozen}>{r.naam}</text>
      {/each}
    </svg>

    <div class="detail">
      <div class="keuze" role="radiogroup" aria-label="Kies een rol in het team">
        {#each rollen as r, i}
          <button role="radio" aria-checked={i === gekozen} onclick={() => (gekozen = i)}>
            <span class="stip stip--{r.soort}" aria-hidden="true"></span>{r.naam}
          </button>
        {/each}
      </div>

      {#if rol}
        {#key gekozen}
          <article class="kaart">
            <h3>{rol.naam}</h3>
            {#if rol.bij_ons && rol.bij_ons !== rol.naam}<p class="bij-ons">Bij ons: {rol.bij_ons}</p>{/if}
            <p class="kort">{rol.kort}</p>
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
      </p>
    </div>
  </div>
</section>

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
