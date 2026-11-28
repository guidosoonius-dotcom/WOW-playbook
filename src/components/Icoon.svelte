<script>
  // Een lijnicoon in een rond tegeltje (zie src/lib/iconen.js).
  import { ICONEN } from '../lib/iconen.js';
  let { naam, grootte = 44 } = $props();
</script>

{#if ICONEN[naam]}
  <span class="icoon" style="--g: {grootte}px" aria-hidden="true">
    <svg viewBox="0 0 24 24"><path d={ICONEN[naam]} /></svg>
  </span>
{/if}

<style>
  .icoon {
    flex-shrink: 0;
    display: inline-grid;
    place-items: center;
    width: var(--g);
    height: var(--g);
    border-radius: var(--radius-s);
    background: var(--chip);
    color: var(--line1);
  }
  svg {
    width: 55%;
    height: 55%;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.6;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
</style>
