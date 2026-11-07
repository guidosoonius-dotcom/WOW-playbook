<script>
  // Het model als isometrische lagen; elke stap van de explainer voegt een laag toe.
  import IsoTekening from '../IsoTekening.svelte';
  let { step } = $props();
</script>

<div class="iso-scene"><IsoTekening naam="model" stap={step} /></div>

<style>
  .iso-scene {
    width: min(100%, 560px);
  }
</style>
