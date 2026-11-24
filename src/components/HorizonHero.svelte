<script>
  // Hero van de startpagina (ontwerp F2, variant C): de stip op de horizon over de volle breedte.
  // Drie sporen onder elkaar laten de hybride situatie zien: product- en platformteams blijven doorlopen,
  // projectteams hebben een begin en een eind, operationele teams draaien de dienst.
  // Vaste momenten, zoals de PI-planning, lopen als lijn vanaf de stip dwars door alle sporen.
  let { horizon = 'Onze stip op de horizon', tekst = '' } = $props();

  const PRODUCT = 'M-20 440 H1300';
  // Projecten: [begin, eind] op het projectspoor.
  const PROJECTEN = [
    [250, 400],
    [480, 720],
    [940, 1240]
  ];
  // Teams per spoor: x-posities.
  const PRODUCT_TEAMS = [300, 430, 520, 700, 790, 1010, 1090, 1230];
  const PROJECT_TEAMS = [325, 560, 660, 1040, 1110];
  const OPS_TEAMS = [270, 420, 530, 720, 790, 1010, 1090, 1230];
  // Vaste momenten: x en of het de hoofdlijn vanaf de stip is.
  const SECUNDAIR = [600, 1160];
  const LEGENDA = [
    ['product', 'Product- en platformteams'],
    ['project', 'Projectteams'],
    ['ops', 'Operationele teams']
  ];
</script>

<svg class="horizon" viewBox="0 0 1280 560" preserveAspectRatio="xMaxYMax slice" role="img" aria-label="Boven de horizon komt de rode stip op: {horizon.toLowerCase()}, {tekst}. Eronder liggen drie sporen: product- en platformteams op een doorlopend spoor, projectteams op korte stukken die beginnen en eindigen, en operationele teams op een gestippeld spoor. Vaste momenten zoals de PI-planning lopen vanaf de stip dwars door alle sporen.">
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

  <!-- Legenda: dezelfde drie kleuren als de teams op de sporen -->
  <g class="op" style="animation-delay: 2.6s">
    {#each LEGENDA as [soort, naam], i}
      <circle class="team {soort}" cx="934" cy={286 + i * 26} r="8" />
      <text x="954" y={291 + i * 26} style="font-size: 14px; fill: var(--ink)">{naam}</text>
    {/each}
  </g>

  <!-- Vaste momenten die door alle sporen lopen -->
  <path class="teken" pathLength="1" d="M880 246 V548" style="stroke: var(--value); stroke-width: 1.6; animation-delay: 1.2s" />
  <g class="op" style="animation-delay: 1.5s">
    {#each SECUNDAIR as x}
      <path d="M{x} 405 V548" class="moment" />
      <text {x} y="398" class="moment-tekst">PI-planning</text>
    {/each}
  </g>

  <!-- Spoor 1: product en platform blijven doorlopen -->
  <path class="teken" pathLength="1" d={PRODUCT} style="stroke: var(--t-product); stroke-width: 5; stroke-linecap: round; animation-delay: .5s" />

  <!-- Spoor 2: projecten beginnen en eindigen -->
  {#each PROJECTEN as [van, tot], i}
    <path class="teken" pathLength="1" d="M{van} 488 H{tot}" style="stroke: var(--t-project); stroke-width: 5; animation-delay: {0.8 + i * 0.2}s" />
  {/each}

  <!-- Spoor 3: operationeel, de dienst draait -->
  <path class="op" d="M-20 534 H1300" style="fill: none; stroke: var(--t-ops); stroke-width: 6; stroke-linecap: round; stroke-dasharray: 0 12; animation-delay: 1.4s" />

  <g class="op" style="animation-delay: 2.4s">
    <path class="trein" pathLength="100" d={PRODUCT} style="stroke: var(--value); animation-delay: 2.4s" />
  </g>

  <g class="op" style="animation-delay: 1.9s">
    {#each PRODUCT_TEAMS as x}<circle class="team product" cx={x} cy="440" r="12" />{/each}
    {#each PROJECT_TEAMS as x}<circle class="team project" cx={x} cy="488" r="12" />{/each}
    {#each OPS_TEAMS as x}<circle class="team ops" cx={x} cy="534" r="11" />{/each}
  </g>

  <!-- Begin (open station) en eind (blokje) van een project -->
  <g class="op" style="animation-delay: 2.1s">
    {#each PROJECTEN as [van, tot]}
      <circle cx={van} cy="488" r="9" class="begin" />
      <rect x={tot - 5} y="480" width="10" height="16" rx="2" class="eind" />
    {/each}
  </g>

  <!-- Kruispunten met de vaste momenten, en de PI-planning waar de hoofdlijn doorheen gaat -->
  <g class="op" style="animation-delay: 2.4s">
    {#each SECUNDAIR as x}
      <circle class="kruis" cx={x} cy="440" r="9" />
      <circle class="kruis" cx={x} cy="488" r="9" />
      <circle class="kruis" cx={x} cy="534" r="9" />
    {/each}
    <circle class="kruis" cx="880" cy="534" r="9" />
    <circle class="kruis" cx="880" cy="440" r="21" style="stroke-width: 2.5" />
    <circle cx="880" cy="440" r="8" style="fill: var(--value)" />
    <text class="label" x="908" y="424" style="font-size: 14px; font-weight: 700; fill: var(--ink)">PI-planning</text>
  </g>
</svg>

<style>
  /* Kleuren van de drie soorten teams, in lichte en donkere weergave. */
  .horizon {
    --t-product: var(--line2);
    --t-project: var(--line1);
    --t-ops: #8cc2f2;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .horizon {
      --t-ops: #3f8fd8;
    }
  }
  :global([data-theme='dark']) .horizon {
    --t-ops: #3f8fd8;
  }
  .team {
    stroke: var(--bg);
    stroke-width: 3;
  }
  .team.product {
    fill: var(--t-product);
  }
  .team.project {
    fill: var(--t-project);
  }
  .team.ops {
    fill: var(--t-ops);
  }
  .begin,
  .kruis {
    fill: var(--bg);
    stroke: var(--ink);
    stroke-width: 3;
  }
  .begin {
    stroke: var(--t-project);
    stroke-width: 3.5;
  }
  .eind {
    fill: var(--t-project);
  }
  .moment {
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.4;
    stroke-dasharray: 4 5;
    opacity: 0.5;
  }
  .moment-tekst {
    text-anchor: middle;
    font-size: 12px;
    font-weight: 600;
    fill: var(--muted);
  }
  .label {
    paint-order: stroke;
    stroke: var(--bg);
    stroke-width: 5px;
    stroke-linejoin: round;
  }
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
