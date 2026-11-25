<script>
  // Een gewone tekstpagina uit content/paginas/<id>.md, met een blokletter. Staat `volgt: true` in de kop,
  // dan toont de pagina een melding dat de uitwerking nog komt.
  import { paginaById } from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  let { id, blok } = $props();
  const p = $derived(paginaById(id));
</script>

<div class="container">
  <PaginaKop rood {blok} titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} status={p.status} />
  {#if p.volgt}
    <p class="volgt"><b>Volgt.</b> Deze pagina wordt nog uitgewerkt. Dit is wat er al vaststaat.</p>
  {/if}
  <section class="sectie prose">{@html p.html}</section>
</div>

<style>
  .volgt {
    margin: 24px 0 0;
    padding: 14px 18px;
    max-width: 72ch;
    border-radius: var(--radius-s);
    border: 2px dashed var(--muted);
    color: var(--muted);
  }
  .volgt b {
    color: var(--ink);
  }
</style>
