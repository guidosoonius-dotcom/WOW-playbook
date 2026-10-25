<script>
  import { opbouw } from '../../lib/scene.js';

  let { step } = $props();
  const s = $derived(opbouw(step, 4));

  const LIJN1 = 'M20 112 H220 Q260 112 280 152 L340 272 Q360 312 400 312 H660 Q690 312 690 282 V250';
  const LIJN2 = 'M20 372 H180 Q220 372 240 332 L300 212 Q320 172 360 172 H660 Q690 172 690 202 V230';
  const teams1 = [[90, 112], [170, 112], [470, 312], [560, 312]];
  const teams2 = [[90, 372], [150, 372], [440, 172], [540, 172]];
</script>

<svg class="sc" viewBox="0 0 720 430" role="img" aria-label="Metrokaart van het model. Het portfolio staat bovenaan als sterrenbeeld. Twee waardestromen zijn metrolijnen, productteams zijn stations, de teams op één lijn vormen een productgroep en kruisen bij de PI-planning. Waarde rijdt naar klant en collega.">
  <g class="g" style={s.g(0)}>
    <g style="fill: var(--ink)">
      <circle class="twinkle" cx="430" cy="28" r="2.5" />
      <circle class="twinkle" cx="490" cy="54" r="2.5" style="animation-delay: .6s" />
      <circle class="twinkle" cx="560" cy="34" r="3" style="animation-delay: 1.2s" />
      <circle class="twinkle" cx="620" cy="64" r="2.5" style="animation-delay: 1.8s" />
      <circle class="twinkle" cx="660" cy="22" r="2" style="animation-delay: 2.4s" />
    </g>
    <path d="M430 28 L490 54 L560 34 L620 64 L660 22" style="fill: none; stroke: var(--ink); stroke-width: .8; opacity: .5" />
    <path d="M490 60 L330 196 M620 70 L520 162" style="fill: none; stroke: var(--muted); stroke-width: .8; stroke-dasharray: 3 5" />
    <text x="436" y="92" style="font-size: 14px; font-weight: 700; fill: var(--ink)">Portfolio</text>
    <text x="436" y="108" style="font-size: 11.5px; fill: var(--muted)">strategie · budget · kaders</text>
  </g>

  <path class="g" d={LIJN1} style="fill: none; stroke: var(--line1); stroke-width: 26; stroke-linecap: round; opacity: {step === 3 ? 0.16 : step > 3 ? 0.08 : 0}" />
  <path class="g" d={LIJN2} style="fill: none; stroke: var(--line2); stroke-width: 26; stroke-linecap: round; opacity: {step === 3 ? 0.16 : step > 3 ? 0.08 : 0}" />

  <path class="dr" pathLength="1" d={LIJN1} style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; {s.dr(1)}" />
  <path class="dr" pathLength="1" d={LIJN2} style="stroke: var(--line2); stroke-width: 3; stroke-linecap: round; {s.dr(1)}" />
  <g class="g" style="font-size: 12px; font-weight: 600; {s.g(1)}">
    <text x="20" y="98" style="fill: var(--line1)">Waardestroom · Klant &amp; contract</text>
    <text x="20" y="400" style="fill: var(--line2)">Waardestroom · Planning &amp; inzet</text>
  </g>

  <g class="g" style={s.g(2)}>
    {#each teams1 as [x, y]}
      <circle cx={x} cy={y} r="8" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x={x - 18} y={y + 26} style="font-size: 11.5px; font-weight: 500; fill: var(--muted)">Team</text>
    {/each}
    {#each teams2 as [x, y]}
      <circle cx={x} cy={y} r="8" style="fill: var(--panel); stroke: var(--line2); stroke-width: 2.5" />
      <text x={x - 18} y={y - 16} style="font-size: 11.5px; font-weight: 500; fill: var(--muted)">Team</text>
    {/each}
  </g>

  <g class="g" style={s.g(3)}>
    <circle class="halo" cx="306" cy="218" r="20" style="fill: none; stroke: var(--value); stroke-width: 1.5" />
    <circle cx="306" cy="218" r="20" style="fill: var(--panel); stroke: var(--ink); stroke-width: 2" />
    <circle cx="306" cy="218" r="7" style="fill: var(--value)" />
    <text x="336" y="244" style="font-size: 13px; font-weight: 700; fill: var(--ink)">PI-planning</text>
    <text x="336" y="260" style="font-size: 11.5px; fill: var(--muted)">elk kwartaal stemmen de lijnen af</text>
    <text x="232" y="96" style="font-size: 12px; font-weight: 700; fill: var(--line1)">Productgroep 1</text>
    <text x="410" y="200" style="font-size: 12px; font-weight: 700; fill: var(--line2)">Productgroep 2</text>
  </g>

  <g class="g" style={s.g(4)}>
    <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10" />
    <path class="train" pathLength="100" d={LIJN1} style="stroke: var(--value); stroke-width: 10; animation-delay: -4.5s" />
    <path class="train" pathLength="100" d={LIJN2} style="stroke: var(--value); stroke-width: 10; animation-delay: -2.2s" />
    <path class="train" pathLength="100" d={LIJN2} style="stroke: var(--value); stroke-width: 10; animation-delay: -6.7s" />
    <rect x="676" y="196" width="28" height="88" rx="14" style="fill: var(--panel); stroke: var(--ink); stroke-width: 2" />
    <circle class="twinkle" cx="690" cy="240" r="6" style="fill: var(--value)" />
    <text x="572" y="246" style="font-size: 13px; font-weight: 700; fill: var(--ink)">Klant &amp;</text>
    <text x="572" y="262" style="font-size: 13px; font-weight: 700; fill: var(--ink)">collega</text>
  </g>
</svg>
