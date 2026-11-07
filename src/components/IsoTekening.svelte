<script>
  // Toont een isometrische tekening in de podiumstijl (zie src/lib/iso-tekeningen.js).
  // Zonder `stap` bouwt de tekening één keer op zodra hij in beeld komt; met `stap` (explainer) staat alles t/m die fase.
  // Drones zweven, robots rijden heen en weer, de waarde rijdt over de lijn. Bij "minder beweging" staat alles stil.
  import { tekening } from '../lib/iso-tekeningen.js';

  let { naam, stap = null, klein = false } = $props();

  const t = $derived(tekening(naam));
  let el = $state();
  let inBeeld = $state(false);

  $effect(() => {
    if (stap !== null || !el || typeof IntersectionObserver !== 'function') {
      inBeeld = true;
      return;
    }
    const io = new IntersectionObserver(
      (e) => {
        if (e.some((x) => x.isIntersecting)) {
          inBeeld = true;
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  });

  const tot = $derived(stap !== null ? stap : inBeeld ? Infinity : -1);
</script>

{#if t}
  <svg bind:this={el} class="iso" class:klein class:per-stap={stap !== null} viewBox={t.viewBox} role="img" aria-label={t.label}>
    {#each t.items as it}
      <g class="f" class:aan={it.f <= tot} style="--f: {it.f}">
        <g class={it.cls} style={it.stijl}>{@html it.svg}</g>
      </g>
    {/each}
  </svg>
{/if}

<style>
  .iso {
    display: block;
    width: 100%;
    height: auto;
    max-height: 560px;
    overflow: visible;
    font-family: var(--font);
  }
  .iso.klein {
    max-height: 380px;
  }
  /* Opbouw: elke fase zakt op zijn plek. */
  .f {
    opacity: 0;
    transform: translateY(-18px);
    transition:
      opacity 0.5s ease,
      transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
    transition-delay: calc(var(--f) * 260ms);
  }
  .per-stap .f {
    transition-delay: 0ms;
  }
  .f.aan {
    opacity: 1;
    transform: none;
  }
  .iso :global(.link) {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  .iso :global(a:hover .link),
  .iso :global(a:focus-visible .link) {
    fill: var(--value-text);
  }

  /* Beweging. */
  .aan :global(.zweef) {
    animation: zweef 3.2s ease-in-out infinite;
  }
  .aan :global(.robot) {
    animation: robot 7s ease-in-out infinite;
  }
  .aan :global(.rijdt) {
    animation: rijden 6s cubic-bezier(0.45, 0, 0.55, 1) 1.6s infinite;
  }
  .aan :global(.valt) {
    animation: vallen 3.2s cubic-bezier(0.5, 0, 0.75, 0) 1.4s infinite;
  }
  .aan :global(.twinkel) {
    transform-box: fill-box;
    transform-origin: center;
    animation: twinkel 2.4s ease-in-out infinite;
  }
  .aan :global(.knipper) {
    animation: knipper 1.6s steps(1) infinite;
  }
  .aan :global(.damp) {
    animation: damp 2.6s ease-in-out infinite;
  }
  @keyframes zweef {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
  @keyframes robot {
    0%, 100% { transform: none; }
    45%, 55% { transform: translate(var(--rx), var(--ry)); }
  }
  @keyframes rijden {
    0% { transform: none; opacity: 0; }
    10% { opacity: 1; }
    85% { opacity: 1; }
    100% { transform: translate(var(--dx), var(--dy)); opacity: 0; }
  }
  @keyframes vallen {
    0% { transform: translateY(-30px); opacity: 0; }
    20% { opacity: 1; }
    70% { transform: translateY(40px); opacity: 1; }
    80%, 100% { transform: translateY(40px); opacity: 0; }
  }
  @keyframes twinkel {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.6); }
  }
  @keyframes knipper {
    50% { opacity: 0.2; }
  }
  @keyframes damp {
    0%, 100% { opacity: 0.3; transform: translateY(0); }
    50% { opacity: 1; transform: translateY(-3px); }
  }
  @media (prefers-reduced-motion: reduce) {
    .f {
      transform: none;
      transition: opacity 0.2s;
      transition-delay: 0ms;
    }
    .aan :global(*) {
      animation: none !important;
    }
    .iso :global(.valt) {
      display: none;
    }
  }
</style>
