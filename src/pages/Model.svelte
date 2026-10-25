<script>
  import content, { paginaById, explainerById, rollenVoorLaag, eventsVoorLaag } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';
  import SafeLabel from '../components/SafeLabel.svelte';

  const p = paginaById('model');
</script>

<div class="container">
  <PaginaKop titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} safe={p.safe} status={p.status} />

  <section class="sectie"><Explainer explainer={explainerById(p.explainer)} /></section>

  <section class="sectie" aria-labelledby="lagen">
    <h2 id="lagen">De vier lagen</h2>
    <ol class="lagen">
      {#each content.lagen as laag}
        <li class="laag card" style="--inspring: {(laag.niveau - 1) * 24}px">
          <div class="laagkop">
            <span class="niveau">{laag.niveau}</span>
            <div>
              <h3>{laag.titel}</h3>
              <p class="kern">{laag.kern}</p>
            </div>
          </div>
          <div class="details">
            <div>
              <h4>Hier wordt besloten over</h4>
              <ul class="lijst">{#each laag.beslist_over as b}<li>{b}</li>{/each}</ul>
            </div>
            {#if rollenVoorLaag(laag.id).length}
              <div>
                <h4>Rollen</h4>
                <div class="chips">{#each rollenVoorLaag(laag.id) as r}<a class="chip" href={href('rollen/' + r.id)}>{r.titel}</a>{/each}</div>
              </div>
            {/if}
            {#if eventsVoorLaag(laag.id).length}
              <div>
                <h4>Events</h4>
                <div class="chips">{#each eventsVoorLaag(laag.id) as e}<a class="chip" href={href('ritme/' + e.id)}>{e.titel}</a>{/each}</div>
              </div>
            {/if}
          </div>
          <SafeLabel safe={laag.safe} />
        </li>
      {/each}
    </ol>
  </section>
</div>

<style>
  .lagen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .laag {
    margin-left: var(--inspring);
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .laagkop {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .niveau {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: 2.5px solid var(--line1);
    color: var(--line1);
    font-weight: 700;
  }
  h3 {
    font-size: 20px;
  }
  .kern {
    margin: 4px 0 0;
    color: var(--muted);
  }
  .details {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: 16px;
  }
  h4 {
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  @media (max-width: 640px) {
    .laag {
      margin-left: 0;
    }
  }
</style>
