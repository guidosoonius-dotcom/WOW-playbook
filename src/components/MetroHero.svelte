<script>
  // Sfeerbeeld voor de startpagina: de metrokaart van het model, met rijdende waarde.
  const LIJN1 = 'M30 112 H220 Q260 112 280 152 L340 272 Q360 312 400 312 H650 Q680 312 680 282 V250';
  const LIJN2 = 'M30 360 H180 Q220 360 240 320 L300 212 Q320 172 360 172 H650 Q680 172 680 202 V230';
</script>

<svg class="sc hero" viewBox="0 0 720 400" role="img" aria-label="Metrokaart van het model: twee waardestroomlijnen met productteams als stations, een overstappunt voor de PI-planning en een eindstation voor klant en collega.">
  <g style="fill: var(--ink)">
    <circle class="twinkle" cx="440" cy="34" r="2.5" /><circle class="twinkle" cx="500" cy="58" r="2.5" style="animation-delay: .6s" /><circle class="twinkle" cx="570" cy="38" r="3" style="animation-delay: 1.2s" /><circle class="twinkle" cx="630" cy="66" r="2.5" style="animation-delay: 1.8s" />
  </g>
  <path class="teken" pathLength="1" d="M440 34 L500 58 L570 38 L630 66" style="stroke: var(--ink); stroke-width: .8; opacity: .5" />
  <text x="446" y="94" style="font-size: 12px; font-weight: 700; fill: var(--muted)">Portfolio</text>
  <path class="teken" pathLength="1" d={LIJN1} style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; animation-delay: .3s" />
  <path class="teken" pathLength="1" d={LIJN2} style="stroke: var(--line2); stroke-width: 3; stroke-linecap: round; animation-delay: .6s" />
  <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10" />
  <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10; animation-delay: -4.5s" />
  <path class="train" pathLength="100" d={LIJN2} style="stroke: var(--value); stroke-width: 10; animation-delay: -2.2s" />
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
</svg>

<style>
  .teken {
    fill: none;
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    animation: teken 2.8s cubic-bezier(0.6, 0.1, 0.2, 1) forwards;
  }
  @keyframes teken {
    to { stroke-dashoffset: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .teken {
      animation: none;
      stroke-dashoffset: 0;
    }
  }
</style>
