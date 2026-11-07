<script>
  // Toont een isometrische tekening (zie src/lib/iso-tekeningen.js).
  // Zonder `stap` bouwt de tekening één keer op zodra hij in beeld komt; met `stap` (explainer) staat alles t/m die fase.
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
        {#if it.t === 'box'}
          <g class:rijdt={it.rijdt} class:valt={it.valt} style={it.rijdt ? `--dx: ${it.rijdt.dx}px; --dy: ${it.rijdt.dy}px` : ''}>
            {#each it.vlakken as v}
              <polygon points={v.pts} fill={v.fill} stroke={it.rand} stroke-width="1.4" stroke-linejoin="round" />
            {/each}
          </g>
        {:else if it.t === 'schijf'}
          <path d={it.zijkant} fill={it.links} stroke="var(--iso-rand)" stroke-width="1.4" />
          <ellipse cx={it.X} cy={it.Y} rx={it.rx} ry={it.ry} fill={it.top} stroke="var(--iso-rand)" stroke-width="1.4" />
        {:else if it.t === 'ring'}
          <ellipse cx={it.X} cy={it.Y} rx={it.rx} ry={it.ry} fill="none" stroke={it.kleur} stroke-width={it.sw} stroke-dasharray={it.dash} />
        {:else if it.t === 'lijn'}
          <path d={it.d} fill="none" stroke={it.kleur} stroke-width={it.sw} stroke-linecap="round" stroke-linejoin="round" stroke-dasharray={it.dash} />
        {:else if it.t === 'halte'}
          <ellipse cx={it.X} cy={it.Y} rx={it.rx} ry={it.ry} fill={it.vul} stroke={it.kleur} stroke-width="3" />
        {:else if it.t === 'pion'}
          <path d="M{it.X - 7} {it.Y} V{it.Y - 16} A7 4 0 0 1 {it.X + 7} {it.Y - 16} V{it.Y} A7 4 0 0 1 {it.X - 7} {it.Y} Z" fill={it.kleur} />
          <circle cx={it.X} cy={it.Y - 24} r="5.5" fill={it.kleur} />
        {:else if it.t === 'vlak'}
          <polygon points={it.pts} fill={it.fill} stroke="var(--iso-rand)" stroke-width="1.2" stroke-linejoin="round" />
        {:else if it.t === 'vlaktekst'}
          <text transform={it.m} font-size={it.grootte} font-weight="700" fill="var(--ink)">{it.tekst}</text>
        {:else if it.t === 'tekst'}
          {#if it.href}
            <a href={it.href}><text class="link" x={it.X} y={it.Y} text-anchor={it.anker} font-size={it.grootte} font-weight={it.gewicht} fill={it.kleur}>{it.tekst} →</text></a>
          {:else}
            <text x={it.X} y={it.Y} text-anchor={it.anker} font-size={it.grootte} font-weight={it.gewicht} fill={it.kleur}>{it.tekst}</text>
          {/if}
        {/if}
      </g>
    {/each}
  </svg>
{/if}

<style>
  .iso {
    display: block;
    width: 100%;
    height: auto;
    max-height: 520px;
    overflow: visible;
    font-family: var(--font);
  }
  .iso.klein {
    max-height: 360px;
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
  .link {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  a:hover .link,
  a:focus-visible .link {
    fill: var(--value-text);
  }
  /* De waarde rijdt over de lijn; budget valt in de bak. */
  .aan .rijdt {
    animation: rijden 6s cubic-bezier(0.45, 0, 0.55, 1) 1.6s infinite;
  }
  .aan .valt {
    animation: vallen 3.2s cubic-bezier(0.5, 0, 0.75, 0) 1.4s infinite;
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
    70% { transform: translateY(60px); opacity: 1; }
    80%, 100% { transform: translateY(60px); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .f {
      transform: none;
      transition: opacity 0.2s;
      transition-delay: 0ms;
    }
    .aan .rijdt,
    .aan .valt {
      animation: none;
    }
    .valt {
      display: none;
    }
  }
</style>
