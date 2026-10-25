<script>
  import { opbouw } from '../../lib/scene.js';

  let { step } = $props();
  const s = $derived(opbouw(step, 4));

  const RING = 'M400 140 A140 88 0 1 1 680 140 A140 88 0 1 1 400 140';
  const persoon = (x, y) => `M${x - 10} ${y + 26} Q${x} ${y + 4} ${x + 10} ${y + 26}`;
</script>

<svg class="sc" viewBox="0 0 720 400" role="img" aria-label="Links een project als enkele rit van start naar oplevering: daarna stapt het team uit en zakt de waarde weg. Rechts een product als ringlijn met de stations bouwen, leveren, leren en verbeteren: een vast team blijft rondrijden en de waarde groeit elke ronde.">
  <text x="24" y="28" class="g" style="font-size: 13px; font-weight: 700; fill: var(--muted); {s.g(0)}">PROJECT</text>
  <path class="dr" pathLength="1" d="M40 130 H310" style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; {s.dr(0)}" />
  <g class="g" style={s.g(0)}>
    <g style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5">
      <circle cx="40" cy="130" r="7" /><circle cx="130" cy="130" r="7" /><circle cx="220" cy="130" r="7" />
    </g>
    <path d="M310 130 V76 H344 L334 86 L344 96 H310" style="fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-linejoin: round" />
    <rect x="302" y="122" width="16" height="16" rx="3" style="fill: var(--ink)" />
    <g style="font-size: 11.5px; font-weight: 500; fill: var(--muted)">
      <text x="26" y="156">Start</text><text x="108" y="156">Ontwerp</text><text x="206" y="156">Bouw</text>
    </g>
    <text x="272" y="160" style="font-size: 12px; font-weight: 700; fill: var(--ink)">Oplevering</text>
  </g>
  <path class="g ride" pathLength="100" d="M40 130 H310" style="stroke: var(--value); stroke-width: 12; {s.op(step === 0)}" />

  <g class="g" style={s.g(1)}>
    <g style="fill: var(--value)">
      <circle class="scatter" cx="318" cy="130" r="4" style="--dx: 26px; --dy: -34px" />
      <circle class="scatter" cx="318" cy="130" r="4" style="--dx: 34px; --dy: 22px; animation-delay: .25s" />
      <circle class="scatter" cx="318" cy="130" r="4" style="--dx: -6px; --dy: 40px; animation-delay: .5s" />
    </g>
    <text x="200" y="210" style="font-size: 12px; font-weight: 600; fill: var(--ink)">team stapt uit · kennis weg</text>
  </g>
  <g class="g" style={s.op(step >= 1)}>
    <path d="M30 352 H330 M390 352 H700" style="fill: none; stroke: var(--muted); stroke-width: 1; opacity: .5" />
    <text x="30" y="374" style="font-size: 11.5px; fill: var(--muted)">waarde project</text>
    <text x="390" y="374" style="font-size: 11.5px; fill: var(--muted)">waarde product</text>
  </g>
  <path class="dr" pathLength="1" d="M30 346 H140 C200 344 240 326 300 290 C312 304 322 318 330 328" style="stroke: var(--ink); stroke-width: 2; {s.dr(1)}" />

  <path d="M360 40 V350" style="fill: none; stroke: var(--muted); stroke-width: 1; stroke-dasharray: 3 6; opacity: .45" />

  <text x="392" y="28" class="g" style="font-size: 13px; font-weight: 700; fill: var(--value-text); {s.g(2)}">PRODUCT</text>
  <path class="dr" pathLength="1" d={RING} style="stroke: var(--line2); stroke-width: 3; {s.dr(2)}" />
  <g class="g" style={s.g(2)}>
    <path class="train" pathLength="100" d={RING} style="stroke: var(--value); stroke-width: 12; animation-duration: 6s" />
    <g style="fill: var(--panel); stroke: var(--line2); stroke-width: 2.5">
      <circle cx="540" cy="52" r="7" /><circle cx="680" cy="140" r="7" /><circle cx="540" cy="228" r="7" /><circle cx="400" cy="140" r="7" />
    </g>
    <g style="font-size: 12px; font-weight: 600; fill: var(--ink)">
      <text x="518" y="40">Bouwen</text>
      <text x="636" y="168">Leveren</text>
      <text x="524" y="252">Leren</text>
      <text x="370" y="118">Verbeteren</text>
    </g>
    <g style="fill: var(--line2)">
      {#each [[530, 134], [550, 134], [540, 122], [532, 148], [548, 148]] as [x, y], i}
        <circle class="pulse" cx={x} cy={y} r="4" style="animation-delay: {i * 0.4}s" />
      {/each}
    </g>
    <text x="514" y="174" style="font-size: 11.5px; font-weight: 600; fill: var(--muted)">vast team</text>
  </g>

  <g class="g" style={s.g(3)}>
    <path d="M530 222 C480 210 430 188 410 154" style="fill: none; stroke: var(--value); stroke-width: 1.5; stroke-dasharray: 4 5" />
    <path d="M406 166 L410 154 L420 162" style="fill: none; stroke: var(--value); stroke-width: 1.5" />
    <text x="420" y="214" style="font-size: 11.5px; font-weight: 600; fill: var(--value-text)">feedback</text>
    <text x="604" y="40" style="font-size: 11.5px; font-weight: 600; fill: var(--muted)">rondes</text>
    <g style="fill: var(--value)">
      {#each [610, 624, 638, 652, 666] as x, i}
        <circle class="pop" cx={x} cy="56" r="4" style="animation-delay: {i * 0.8}s" />
      {/each}
    </g>
  </g>
  <path class="dr" pathLength="1" d="M390 346 H420 V336 H460 V324 H500 V312 H540 V298 H580 V286 H620 V272 H660 V260 H700 V246" style="stroke: var(--value); stroke-width: 2.5; stroke-linejoin: round; {s.dr(4)}" />
  <text x="560" y="240" class="g" style="font-size: 12px; font-weight: 700; fill: var(--ink); {s.g(4)}">groeit elke ronde ↗</text>

  <!-- Mensen bij de projectlijn: lopen mee in stap 1. -->
  <g class="g" style="fill: none; stroke: var(--muted); stroke-width: 1.2; stroke-linecap: round; {s.op(step === 0)}">
    {#each [60, 82, 104] as x}
      <circle cx={x} cy="88" r="6" />
      <path d={persoon(x, 88)} />
    {/each}
  </g>
</svg>
