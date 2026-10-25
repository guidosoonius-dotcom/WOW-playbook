<script>
  import content, { paginaById, explainerById } from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';

  const p = paginaById('waarom');
  const STANDEN = ['van', 'overgang', 'naar'];
  const LABELS = ['Projectgericht', 'In overgang', 'Productgericht'];
  let stand = $state(2);
</script>

<div class="container">
  <PaginaKop titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} safe={p.safe} status={p.status} />

  <section class="sectie"><Explainer explainer={explainerById(p.explainer)} /></section>

  <section class="sectie" aria-labelledby="vannaar">
    <h2 id="vannaar">Wat verschuift er?</h2>
    <div class="schuif card">
      <label for="vannaar-slider">Schuif om te vergelijken: <strong>{LABELS[stand]}</strong></label>
      <input id="vannaar-slider" type="range" min="0" max="2" step="1" bind:value={stand} aria-valuetext={LABELS[stand]} />
      <div class="labels" aria-hidden="true"><span>Project</span><span>Overgang</span><span>Product</span></div>
    </div>
    <ul class="raster dimensies">
      {#each content.verschuivingen as d}
        <li class="card">
          <h3>{d.dimensie}</h3>
          {#key stand}<span class="waarde" class:naar={stand === 2}>{d[STANDEN[stand]]}</span>{/key}
          {#if stand > 0}<span class="was">was: {d.van}</span>{/if}
        </li>
      {/each}
    </ul>
  </section>

  <section class="sectie prose">{@html p.html}</section>
</div>

<style>
  .schuif {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 16px;
  }
  input[type='range'] {
    width: 100%;
    accent-color: var(--line1);
  }
  .labels {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    color: var(--muted);
  }
  .dimensies {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .dimensies li {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 120px;
  }
  h3 {
    font-size: 15px;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0;
  }
  .waarde {
    font-size: 19px;
    font-weight: 700;
    line-height: 1.35;
    animation: op 0.5s ease both;
  }
  .waarde.naar {
    color: var(--line1);
  }
  .was {
    font-size: 14px;
    color: var(--muted);
    text-decoration: line-through;
  }
  @keyframes op {
    from { opacity: 0; transform: translateY(6px); }
    to { opacity: 1; transform: none; }
  }
</style>
