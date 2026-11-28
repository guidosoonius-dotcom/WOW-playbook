<script>
  import { href } from '../lib/router.svelte.js';
</script>

<div class="container leeg">
  <h1>Deze halte bestaat niet</h1>
  <p class="lead">De pagina die je zoekt is er niet (meer). Misschien is hij verplaatst.</p>
  <a class="btn btn--primary" href={href('')}>Naar de start</a>
</div>

<style>
  .leeg {
    padding-block: 80px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
</style>
