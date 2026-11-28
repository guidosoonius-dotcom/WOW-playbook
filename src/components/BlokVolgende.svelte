<script>
  // Onder een pagina: terug naar de vorige, door naar de volgende, en aan het eind van een blok naar het volgende blok.
  import { route, href } from '../lib/router.svelte.js';
  import { plekInBlok, VERHAAL } from '../lib/blokken.js';
  import BlokBadge from './BlokBadge.svelte';

  const plek = $derived(plekInBlok(route.parts.join('/')));
</script>

{#if plek}
  <nav class="onder container" aria-label="Verder in dit blok">
    <p class="stand"><BlokBadge blok={plek.blok.id} /> <span>Pagina {plek.nr + 1} van {plek.totaal}</span></p>
    <div class="kaarten">
      {#if plek.vorige}
        <a class="kaart terug" href={href(plek.vorige.pad)}>
          <span class="label">← Vorige</span>
          <strong>{plek.vorige.titel}</strong>
          <span class="kern">{plek.vorige.kern}</span>
        </a>
      {:else}
        <span></span>
      {/if}
      {#if plek.volgende}
        <a class="kaart door" href={href(plek.volgende.pad)}>
          <span class="label">Volgende →</span>
          <strong>{plek.volgende.titel}</strong>
          <span class="kern">{plek.volgende.kern}</span>
        </a>
      {:else if plek.volgendBlok}
        <a class="kaart door blok" href={href(plek.volgendBlok.items[0].pad)}>
          <span class="label">Verder in het playbook →</span>
          <strong>{plek.volgendBlok.id} · {plek.volgendBlok.titel}</strong>
          <span class="kern">{plek.volgendBlok.kern}</span>
        </a>
      {/if}
    </div>
    {#if VERHAAL.includes(plek.blok.id)}
      <p class="verhaal"><a href={href('blok/' + plek.blok.id)}>Lees blok {plek.blok.id} als één verhaal</a></p>
    {/if}
  </nav>
{/if}

<style>
  .onder {
    margin-top: 56px;
    padding-top: 28px;
    border-top: 1.5px solid var(--ink);
  }
  .stand {
    margin: 0 0 14px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 14px;
    font-weight: 600;
    color: var(--muted);
  }
  .kaarten {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 14px;
  }
  .kaart {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 20px 24px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .kaart:hover strong {
    text-decoration: underline;
  }
  .door {
    grid-column: 2;
    text-align: right;
  }
  .terug {
    grid-column: 1;
  }
  .kaart.blok {
    background: var(--vlak-blauw);
    color: #fff;
  }
  .kaart.blok .kern {
    color: #c9d8ea;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .blok .label {
    color: #8cc2f2;
  }
  strong {
    font-size: 20px;
    letter-spacing: -0.02em;
  }
  .kern {
    font-size: 14px;
    color: var(--muted);
  }
  .verhaal {
    margin: 16px 0 0;
    font-size: 14px;
  }
  @media (max-width: 700px) {
    .kaarten {
      grid-template-columns: minmax(0, 1fr);
    }
    .door,
    .terug {
      grid-column: 1;
      text-align: left;
    }
  }
  @media print {
    .onder {
      display: none;
    }
  }
</style>
