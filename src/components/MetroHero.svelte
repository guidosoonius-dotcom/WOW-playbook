<script>
  // Sfeerbeeld voor de startpagina: de metrokaart van het model.
  // Strategie is de stip op de horizon; het portfolio zijn de epics die daarop gericht zijn
  // en die (deels) afdalen naar de lijnen. Daarna rijdt de waarde naar klant en collega.
  const LIJN1 = 'M30 112 H220 Q260 112 280 152 L340 272 Q360 312 400 312 H650 Q680 312 680 282 V250';
  const LIJN2 = 'M30 360 H180 Q220 360 240 320 L300 212 Q320 172 360 172 H650 Q680 172 680 202 V230';
  const NAAR_PI = 'M560 136 Q470 170 318 210';
  const NAAR_STATION = 'M470 136 L440 164';
  const EPICS = [470, 560, 650].map((x) => `M${x} 116 l10 10 l-10 10 l-10 -10 z`).join(' ');
</script>

<svg class="sc hero" viewBox="0 0 720 400" role="img" aria-label="Metrokaart van het model. Boven de horizon staat de stip waar we naartoe werken; daaronder het portfolio met drie epics. Twee epics dalen af naar de lijnen, één blijft in de trechter. Twee waardestroomlijnen met productteams als stations kruisen bij de PI-planning en eindigen bij klant en collega.">
  <defs>
    <clipPath id="metrohero-horizon"><rect x="0" y="0" width="720" height="60" /></clipPath>
  </defs>

  <!-- Strategie: de stip op de horizon. -->
  <path class="teken" pathLength="1" d="M360 60 H710" style="stroke: var(--ink); stroke-width: 1.2; opacity: .5" />
  <g clip-path="url(#metrohero-horizon)">
    <circle class="zon" cx="600" cy="60" r="16" style="fill: var(--value)" />
  </g>
  <g class="op" style="animation-delay: 1s">
    <text x="360" y="36" style="font-size: 13px; font-weight: 700; fill: var(--ink)">Onze stip op de horizon</text>
    <text x="360" y="52" style="font-size: 12px; fill: var(--muted)">strategie: waar we naartoe werken</text>
  </g>

  <!-- Portfolio: epics die op de stip gericht zijn. -->
  <path class="teken" pathLength="1" d="M600 76 L470 118 M600 76 L560 118 M600 76 L650 118" style="stroke: var(--value); stroke-width: 1.2; animation-delay: 1.3s" />
  <g class="op" style="animation-delay: 1.7s">
    <path d={EPICS} style="fill: var(--bg); stroke: var(--ink); stroke-width: 2; stroke-linejoin: round" />
    <text x="360" y="104" style="font-size: 12px; font-weight: 600; fill: var(--muted)">portfolio</text>
    <text x="676" y="131" style="font-size: 12px; font-weight: 600; fill: var(--muted)">epics</text>
  </g>

  <!-- De lijnen. -->
  <path class="teken" pathLength="1" d={LIJN1} style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; animation-delay: 1.9s" />
  <path class="teken" pathLength="1" d={LIJN2} style="stroke: var(--line2); stroke-width: 3; stroke-linecap: round; animation-delay: 2.2s" />

  <!-- Epics dalen af naar de lijnen; één blijft in de trechter. -->
  <path class="teken" pathLength="1" d={NAAR_STATION} style="stroke: var(--line2); stroke-width: 1.5; animation-delay: 3.4s" />
  <path class="teken" pathLength="1" d={NAAR_PI} style="stroke: var(--line1); stroke-width: 1.5; animation-delay: 3.6s" />
  <!-- Bewegende stippen pas tonen als hun lijn er ligt (anders staan ze al klaar op het startpunt). -->
  <g class="op" style="animation-delay: 4.2s">
    <path class="druppel" pathLength="100" d={NAAR_PI} style="stroke: var(--value); stroke-width: 8; animation-delay: 4.2s" />
    <path class="druppel" pathLength="100" d={NAAR_STATION} style="stroke: var(--value); stroke-width: 8; animation-delay: 4.6s" />
  </g>
  <text class="op" x="650" y="156" text-anchor="middle" style="font-size: 12px; fill: var(--muted); animation-delay: 4s">nog in de trechter</text>

  <!-- Waarde rijdt naar klant en collega. -->
  <g class="op" style="animation-delay: 3.7s">
    <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10; animation-delay: 3.7s" />
    <path class="train" pathLength="100" d={LIJN2} style="stroke: var(--value); stroke-width: 10; animation-delay: 5.7s" />
  </g>
  <g class="op" style="animation-delay: 8.2s">
    <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10; animation-delay: 8.2s" />
  </g>

  <g class="op" style="animation-delay: 3.1s">
    {#each [[100, 112], [180, 112], [470, 312], [560, 312]] as [x, y]}
      <circle cx={x} cy={y} r="8" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
    {/each}
    {#each [[90, 360], [150, 360], [440, 172], [540, 172]] as [x, y]}
      <circle cx={x} cy={y} r="8" style="fill: var(--panel); stroke: var(--line2); stroke-width: 2.5" />
    {/each}
    <circle cx="306" cy="220" r="18" style="fill: var(--bg); stroke: var(--ink); stroke-width: 2" />
    <circle cx="306" cy="220" r="6" style="fill: var(--value)" />
    <rect x="666" y="196" width="28" height="88" rx="14" style="fill: var(--bg); stroke: var(--ink); stroke-width: 2" />
    <circle class="twinkle" cx="680" cy="240" r="6" style="fill: var(--value)" />
    <g style="font-size: 12px; font-weight: 600">
      <text x="30" y="98" style="fill: var(--line1)">Klant &amp; contract</text>
      <text x="30" y="388" style="fill: var(--line2)">Planning &amp; inzet</text>
      <text x="332" y="246" style="fill: var(--ink)">PI-planning</text>
      <text x="572" y="246" style="fill: var(--ink)">Klant &amp; collega</text>
    </g>
  </g>
</svg>

<style>
  .teken {
    fill: none;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: teken 1.6s cubic-bezier(0.6, 0.1, 0.2, 1) forwards;
  }
  .op {
    opacity: 0;
    animation: op 0.8s ease forwards;
  }
  .zon {
    transform-box: fill-box;
    animation: zon 1.4s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s both;
  }
  /* Een epic die langs de verbindingslijn naar beneden "druppelt". */
  .druppel {
    fill: none;
    stroke-linecap: round;
    stroke-dasharray: 0.8 99.2;
    stroke-dashoffset: 100;
    animation: druppel 4s cubic-bezier(0.5, 0, 0.4, 1) infinite;
  }
  /* Treintjes starten pas als de lijnen er liggen. */
  .train {
    stroke-dashoffset: 100;
  }
  @keyframes teken {
    to { stroke-dashoffset: 0; }
  }
  @keyframes op {
    to { opacity: 1; }
  }
  @keyframes zon {
    from { transform: translateY(34px); }
    to { transform: none; }
  }
  @keyframes druppel {
    0% { stroke-dashoffset: 100; opacity: 1; }
    70% { stroke-dashoffset: 0; opacity: 1; }
    85%, 100% { stroke-dashoffset: 0; opacity: 0; }
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
    .druppel {
      animation: none;
    }
    .druppel {
      opacity: 0;
    }
  }
</style>
