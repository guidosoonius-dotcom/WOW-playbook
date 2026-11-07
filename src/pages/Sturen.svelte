<script>
  import { paginaById, explainerById } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';

  const p = paginaById('sturen');
</script>

<div class="container">
  <PaginaKop eyebrow="5 · Sturen & financieren" titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} safe={p.safe} status={p.status} />
  <section class="sectie"><Explainer explainer={explainerById(p.explainer)} /></section>
  <p class="verwijzing card">Hoe verhouden epics, features en stories zich tot elkaar? <a href={href('uitleg/epics-features-stories')}>Lees de uitleg met een voorbeeld →</a></p>
  <section class="sectie prose">{@html p.html}</section>
</div>

<style>
  .verwijzing {
    margin: 0;
    font-size: 17px;
  }
  .verwijzing a {
    font-weight: 600;
  }
</style>
