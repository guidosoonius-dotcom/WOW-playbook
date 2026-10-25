<script>
  import { opbouw } from '../../lib/scene.js';

  let { step } = $props();
  // Hier dimmen we eerdere stappen ook in de laatste stap: het verhaal is een reis langs haltes.
  const s = $derived(opbouw(step));
  const zichtbaarVanaf = (k) => `opacity: ${step < k ? 0 : 1}`;
  const lijn = (k) => `stroke-dashoffset: ${step < k ? 1 : 0}; opacity: ${step < k ? 0 : 1}`;
  const HALTES = [80, 210, 340, 470, 590];

  const ideeen = [
    [44, 70, 36, 122], [70, 58, 10, 134], [100, 66, -20, 126],
    [120, 76, -40, 116], [58, 80, 22, 112], [86, 50, -6, 142]
  ];
</script>

<svg class="sc" viewBox="0 0 720 400" role="img" aria-label="De portfoliokanban als metrolijn. Ideeën vallen in een trechter, een deel stapt uit bij Beoordelen, bij Analyseren komt een lean business case, bij Klaar voor uitvoering wachten epics op capaciteit, en na de MVP splitst de lijn in doorgaan of bijsturen en stoppen.">
  <g class="g" style={s.g(0)}>
    <path d="M28 96 L72 176 M132 96 L88 176" style="fill: none; stroke: var(--ink); stroke-width: 1.5; stroke-linecap: round" />
    <g style="fill: var(--value)">
      {#each ideeen as [x, y, dx, dy], i}
        <circle class="fall" cx={x} cy={y} r="4" style="--dx: {dx}px; --dy: {dy}px; animation-delay: {i * 0.6}s" />
      {/each}
    </g>
    <text x="40" y="36" style="font-size: 11.5px; font-weight: 600; fill: var(--muted)">ideeën van iedereen</text>
  </g>

  {#each HALTES.slice(0, -1) as x, i}
    <path class="dr" pathLength="1" d="M{x} 200 H{HALTES[i + 1]}" style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; {lijn(i + 1)}" />
  {/each}
  <path class="dr" pathLength="1" d="M590 200 Q630 200 650 160 L680 110" style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; {lijn(4)}" />
  <path class="dr" pathLength="1" d="M590 200 Q630 200 650 240 L680 290" style="stroke: var(--muted); stroke-width: 3; stroke-linecap: round; {lijn(4)}" />

  <g style="font-size: 12px; font-weight: 600">
    <g class="g" style={zichtbaarVanaf(0)}>
      <circle cx="80" cy="200" r="9" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x="58" y="232" style="fill: var(--ink)">Trechter</text>
    </g>
    <g class="g" style={zichtbaarVanaf(1)}>
      <circle cx="210" cy="200" r="9" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x="180" y="180" style="fill: var(--ink)">Beoordelen</text>
    </g>
    <g class="g" style={zichtbaarVanaf(2)}>
      <circle cx="340" cy="200" r="9" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x="306" y="232" style="fill: var(--ink)">Analyseren</text>
    </g>
    <g class="g" style={zichtbaarVanaf(3)}>
      <circle cx="470" cy="200" r="9" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x="428" y="232" style="fill: var(--ink)">Klaar voor</text>
      <text x="428" y="247" style="fill: var(--ink)">uitvoering</text>
    </g>
    <g class="g" style={zichtbaarVanaf(4)}>
      <circle cx="590" cy="200" r="9" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5" />
      <text x="562" y="232" style="fill: var(--ink)">MVP</text>
      <circle cx="680" cy="110" r="9" style="fill: var(--value)" />
      <text x="620" y="92" style="fill: var(--ink)">Doorgaan</text>
      <circle cx="680" cy="290" r="9" style="fill: var(--panel); stroke: var(--muted); stroke-width: 2.5" />
      <text x="572" y="322" style="fill: var(--muted)">Bijsturen of stoppen</text>
    </g>
  </g>

  <g class="g" style={s.g(1)}>
    <g style="fill: var(--muted)">
      {#each [-10, 12, 0] as dx, i}
        <circle class="drop" cx="210" cy="212" r="4" style="--dx: {dx}px; animation-delay: {i * 1.1}s" />
      {/each}
    </g>
    <text x="150" y="312" style="font-size: 11.5px; font-weight: 600; fill: var(--muted)">past niet bij de koers</text>
    <text x="150" y="128" style="font-size: 11.5px; font-weight: 600; fill: var(--line1)">Digital Leads toetsen</text>
  </g>

  <g class="g" style={s.g(2)}>
    <path d="M340 190 V146" style="fill: none; stroke: var(--ink); stroke-width: 1; stroke-dasharray: 3 4" />
    <rect x="268" y="40" width="160" height="106" rx="16" style="fill: var(--bg); stroke: var(--ink); stroke-width: 1.2" />
    <text x="284" y="64" style="font-size: 11.5px; font-weight: 700; fill: var(--value-text)">Lean business case</text>
    <g style="font-size: 12px; fill: var(--ink)">
      <text x="284" y="86">Hypothese</text><text x="284" y="106">MVP</text><text x="284" y="126">WSJF-score</text>
    </g>
    <g style="fill: none; stroke: var(--line1); stroke-width: 1.5; stroke-linecap: round">
      <path d="M372 82 L376 86 L384 78" /><path d="M372 102 L376 106 L384 98" />
    </g>
    <text x="372" y="127" style="font-size: 12px; font-weight: 700; fill: var(--line1)">8,4</text>
  </g>

  <g class="g" style={s.g(3)}>
    <g style="fill: var(--value); opacity: .55"><circle cx="420" cy="200" r="7" /><circle cx="440" cy="200" r="7" /></g>
    <rect x="398" y="150" width="112" height="28" rx="14" style="fill: var(--bg)" />
    <text x="412" y="169" style="font-size: 11.5px; font-weight: 600; fill: var(--ink)">wacht op ruimte</text>
    <text x="430" y="276" style="font-size: 11.5px; fill: var(--muted)">WIP-limiet: max. 3</text>
  </g>

  <g class="mv" style="transform: translateX({HALTES[step] - HALTES[0]}px)">
    <circle class="halo" cx="80" cy="200" r="10" style="fill: none; stroke: var(--value); stroke-width: 1.5" />
    <circle cx="80" cy="200" r="10" style="fill: var(--value)" />
  </g>

  <g class="g" style={s.g(4)}>
    <path class="train" pathLength="100" d="M590 200 Q630 200 650 160 L680 110" style="stroke: var(--value); stroke-width: 10; stroke-dasharray: .6 99.4; animation-duration: 5s" />
    <text x="476" y="356" style="font-size: 12px; font-weight: 600; fill: var(--ink)">Stoppen na een MVP is ook succes:</text>
    <text x="476" y="373" style="font-size: 12px; fill: var(--muted)">je leert snel en goedkoop.</text>
  </g>
</svg>
