<script>
  import content, { paginaById } from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const p = paginaById('over');
  const datum = (d) => new Date(d).toLocaleDateString('nl-NL', { day: 'numeric', month: 'long', year: 'numeric' });
</script>

<div class="container">
  <PaginaKop titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} status={p.status} />
  <section class="sectie prose">{@html p.html}</section>
  <section class="sectie" aria-labelledby="nieuw">
    <h2 id="nieuw">Wat is er nieuw?</h2>
    {#each content.changelog as r}
      <div class="card">
        <strong>Versie {r.versie}</strong> · <span>{datum(r.datum)}</span>
        <ul class="lijst">{#each r.wijzigingen as w}<li>{w}</li>{/each}</ul>
      </div>
    {/each}
  </section>
</div>

<style>
  span {
    color: var(--muted);
  }
  ul {
    margin-top: 8px;
  }
</style>
