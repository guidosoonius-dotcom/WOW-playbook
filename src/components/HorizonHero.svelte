<script>
  // Hero van de startpagina (ontwerp F2): de stip op de horizon over de volle breedte.
  // Vanaf de stip lopen lijnen naar de stations: strategie geeft richting aan de teams.
  // Twee waardestroomlijnen kruisen bij de PI-planning; de waarde rijdt eroverheen.
  let { horizon = 'Onze stip op de horizon', tekst = '' } = $props();

  const L1 = 'M-20 400 H420 Q470 400 500 430 L560 490 Q580 510 620 510 H1300';
  const L2 = 'M-20 530 H360 Q400 530 430 500 L500 430 Q530 400 580 400 H1300';
  const STRALEN = 'M880 246 L720 400 M880 246 L1010 400 M880 246 L1180 400';
</script>

<svg class="horizon" viewBox="0 0 1280 560" preserveAspectRatio="xMaxYMax slice" role="img" aria-label="Boven de horizon komt de rode stip op: {horizon.toLowerCase()}, {tekst}. Lijnen vanaf de stip geven richting aan twee waardestroomlijnen met productteams als stations. De lijnen kruisen bij de PI-planning.">
  <defs>
    <clipPath id="horizon-hero-clip"><rect x="0" y="0" width="1280" height="230" /></clipPath>
  </defs>

  <path class="teken" pathLength="1" d="M790 230 H1250" style="stroke: var(--ink); stroke-width: 1.4; opacity: .45" />
  <g clip-path="url(#horizon-hero-clip)">
    <circle class="zon" cx="880" cy="230" r="60" style="fill: var(--value)" />
  </g>
  <g class="op" style="animation-delay: 1s">
    <text x="956" y="192" style="font-size: 17px; font-weight: 700; fill: var(--ink)">{horizon}</text>
    <text x="956" y="214" style="font-size: 15px; fill: var(--muted)">{tekst}</text>
  </g>

  <path class="teken" pathLength="1" d={STRALEN} style="stroke: var(--value); stroke-width: 1.4; animation-delay: 1.3s" />

  <path class="teken" pathLength="1" d={L1} style="stroke: var(--line1); stroke-width: 4; stroke-linecap: round; animation-delay: .6s" />
  <path class="teken" pathLength="1" d={L2} style="stroke: var(--line2); stroke-width: 4; stroke-linecap: round; animation-delay: .9s" />

  <g class="op" style="animation-delay: 2.4s">
    <path class="trein" pathLength="100" d={L1} style="stroke: var(--value); animation-delay: 2.4s" />
    <path class="trein" pathLength="100" d={L2} style="stroke: var(--value); animation-delay: 5.4s" />
  </g>

  <g class="op" style="animation-delay: 1.9s">
    {#each [[120, 400], [300, 400], [820, 510], [1080, 510]] as [x, y]}
      <circle cx={x} cy={y} r="10" style="fill: var(--bg); stroke: var(--line1); stroke-width: 3" />
    {/each}
    {#each [[200, 530], [720, 400], [1010, 400], [1180, 400]] as [x, y]}
      <circle cx={x} cy={y} r="10" style="fill: var(--bg); stroke: var(--line2); stroke-width: 3" />
    {/each}
    <circle cx="500" cy="430" r="22" style="fill: var(--bg); stroke: var(--ink); stroke-width: 2.5" />
    <circle cx="500" cy="430" r="8" style="fill: var(--value)" />
    <g style="font-size: 14px; font-weight: 600">
      <text x="536" y="436" style="fill: var(--ink)">PI-planning</text>
      <text x="1040" y="544" style="fill: var(--line1)">Klant &amp; contract</text>
      <text x="1040" y="432" style="fill: var(--line2)">Planning &amp; inzet</text>
    </g>
  </g>
</svg>

<style>
  .horizon {
    display: block;
    width: 100%;
    height: 100%;
  }
  .teken {
    fill: none;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: teken 2s cubic-bezier(0.6, 0.1, 0.2, 1) forwards;
  }
  .op {
    opacity: 0;
    animation: op 0.9s ease forwards;
  }
  .zon {
    transform-box: fill-box;
    animation: zon 1.8s cubic-bezier(0.2, 0.7, 0.2, 1) 0.2s both;
  }
  .trein {
    fill: none;
    stroke-width: 12;
    stroke-linecap: round;
    stroke-dasharray: 0.3 99.7;
    stroke-dashoffset: 100;
    animation: rijden 12s linear infinite;
  }
  @keyframes teken {
    to { stroke-dashoffset: 0; }
  }
  @keyframes op {
    to { opacity: 1; }
  }
  @keyframes zon {
    from { transform: translateY(70px); }
    to { transform: none; }
  }
  @keyframes rijden {
    from { stroke-dashoffset: 100; }
    to { stroke-dashoffset: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .teken {
      animation: none;
      stroke-dashoffset: 0;
    }
    .op {
      animation: none;
      opacity: 1;
    }
    .zon,
    .trein {
      animation: none;
    }
    .trein {
      opacity: 0;
    }
  }
</style>
