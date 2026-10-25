<script>
  import content, { paginaById, explainerById, CADANS_LABEL } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';

  const p = paginaById('ritme');
  const cadansen = ['dagelijks', 'iteratie', 'kwartaal', 'portfolio'];
</script>

<div class="container">
  <PaginaKop titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} status={p.status} />

  <section class="sectie"><Explainer explainer={explainerById(p.explainer)} /></section>

  {#each cadansen as c}
    {@const events = content.events.filter((e) => e.cadans === c)}
    <section class="sectie" aria-labelledby="cadans-{c}">
      <h2 id="cadans-{c}">{CADANS_LABEL[c]}</h2>
      <ul class="raster">
        {#each events as e}
          <li>
            <a class="event" href={href('ritme/' + e.id)}>
              <strong>{e.titel}</strong>
              <span>{e.kern}</span>
              <small>{e.wanneer} · {e.duur}</small>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  {/each}
</div>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .event {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .event:hover {
    background: var(--panel);
  }
  span {
    color: var(--muted);
    font-size: 14.5px;
  }
  small {
    margin-top: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--line1);
  }
</style>
