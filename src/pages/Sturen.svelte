<script>
  import { paginaById, explainerById } from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';

  const p = paginaById('sturen');
</script>

<div class="container">
  <PaginaKop titel={p.titel} kern={p.kern} samenvatting={p.samenvatting} safe={p.safe} status={p.status} />
  <section class="sectie"><Explainer explainer={explainerById(p.explainer)} /></section>
  <section class="sectie prose">{@html p.html}</section>
</div>
