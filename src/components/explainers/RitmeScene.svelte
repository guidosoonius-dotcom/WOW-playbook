<script>
  import { opbouw } from '../../lib/scene.js';
  import { prefs } from '../../lib/state.svelte.js';
  import { rolById, eventById } from '../../lib/content.js';

  let { step } = $props();
  // Stap 4 ("de ringen grijpen in elkaar") toont alles; stap 5 licht de ringen van jouw rol uit.
  const s = $derived(opbouw(step, 3));

  const RINGEN = [
    'M310 200 A50 50 0 1 1 410 200 A50 50 0 1 1 310 200',
    'M250 200 A110 110 0 1 1 470 200 A110 110 0 1 1 250 200',
    'M190 200 A170 170 0 1 1 530 200 A170 170 0 1 1 190 200'
  ];
  const RING_VAN_CADANS = { dagelijks: 0, iteratie: 1, kwartaal: 2, portfolio: 2 };

  const rol = $derived(prefs.rol ? rolById(prefs.rol) : null);
  const mijnEvents = $derived(rol ? rol.events.map((e) => eventById(e.event)).filter(Boolean) : []);
  const mijnRingen = $derived(new Set(mijnEvents.map((e) => RING_VAN_CADANS[e.cadans])));
  const rolStap = $derived(step === 4);

  const ringStijl = (i, basis) => {
    if (!rolStap) return basis;
    const aan = !rol || mijnRingen.has(i);
    return `stroke-dashoffset: 0; opacity: ${aan ? 1 : 0.2}`;
  };
  const groepStijl = (i, basis) => (rolStap ? `opacity: ${!rol || mijnRingen.has(i) ? 1 : 0.2}` : basis);
  const eventNamen = $derived(mijnEvents.slice(0, 4).map((e) => e.titel));
</script>

<svg class="sc" viewBox="0 0 720 400" role="img" aria-label="Drie concentrische ringen. Binnen de dagelijkse daily, in het midden de iteratie van twee weken met planning, refinement, review en retro, buiten het kwartaal met vijf iteraties en de PI-planning bovenaan.">
  <path class="dr" pathLength="1" d={RINGEN[0]} style="stroke: var(--value); stroke-width: 2.5; {ringStijl(0, s.dr(0))}" />
  <g class="g" style={groepStijl(0, s.g(0))}>
    <path class="train" pathLength="100" d={RINGEN[0]} style="stroke: var(--value); stroke-width: 10; stroke-dasharray: 1 99; animation-duration: 2.5s" />
    <text x="360" y="196" text-anchor="middle" style="font-size: 13px; font-weight: 700; fill: var(--ink)">Daily</text>
    <text x="360" y="212" text-anchor="middle" style="font-size: 11px; fill: var(--muted)">15 min</text>
  </g>

  <path class="dr" pathLength="1" d={RINGEN[1]} style="stroke: var(--line2); stroke-width: 2.5; {ringStijl(1, s.dr(1))}" />
  <g class="g" style={groepStijl(1, s.g(1))}>
    <path class="train" pathLength="100" d={RINGEN[1]} style="stroke: var(--line2); stroke-width: 10; stroke-dasharray: .6 99.4; animation-duration: 8s" />
    <g style="fill: var(--panel); stroke: var(--line2); stroke-width: 2.5">
      <circle cx="360" cy="90" r="7" /><circle cx="470" cy="200" r="7" /><circle cx="360" cy="310" r="7" /><circle cx="250" cy="200" r="7" />
    </g>
    <g style="font-size: 11.5px; font-weight: 600; fill: var(--ink)">
      <text x="372" y="112">Planning</text>
      <text x="404" y="226">Refinement</text>
      <text x="372" y="298">Review</text>
      <text x="262" y="226">Retro</text>
    </g>
  </g>

  <path class="dr" pathLength="1" d={RINGEN[2]} style="stroke: var(--line1); stroke-width: 2.5; {ringStijl(2, s.dr(2))}" />
  <g class="g" style={groepStijl(2, s.g(2))}>
    <path class="train" pathLength="100" d={RINGEN[2]} style="stroke: var(--line1); stroke-width: 10; stroke-dasharray: .4 99.6; animation-duration: 24s" />
    <g style="fill: var(--panel); stroke: var(--line1); stroke-width: 2.5">
      <circle cx="522" cy="148" r="6" /><circle cx="460" cy="338" r="6" /><circle cx="260" cy="338" r="6" /><circle cx="198" cy="148" r="6" />
    </g>
    <g style="font-size: 11px; font-weight: 600; fill: var(--muted)" text-anchor="middle">
      <text x="478" y="56">it. 1</text><text x="552" y="268">it. 2</text><text x="360" y="394">it. 3</text><text x="168" y="268">it. 4</text><text x="242" y="56">it. 5</text>
    </g>
  </g>
  <g class="g" style={groepStijl(2, `opacity: ${step >= 2 ? 1 : 0}`)}>
    <circle class="halo" cx="360" cy="30" r="12" style="fill: none; stroke: var(--value); stroke-width: 1.5; opacity: {step === 2 || rolStap ? 1 : 0}" />
    <circle cx="360" cy="30" r="12" style="fill: var(--panel); stroke: var(--ink); stroke-width: 2.5" />
    <circle cx="360" cy="30" r="5" style="fill: var(--value)" />
  </g>

  <g class="g" style={s.op(step === 3)}>
    <path d="M360 200 V44" style="fill: none; stroke: var(--value); stroke-width: 1.5; stroke-dasharray: 4 5" />
    <g style="fill: var(--value)"><circle cx="360" cy="150" r="4" /><circle cx="360" cy="90" r="4" /></g>
    <text x="368" y="168" style="font-size: 12px; font-weight: 700; fill: var(--value-text)">nu</text>
  </g>

  <g style="font-size: 12.5px">
    <g class="g" style={s.op(step >= 0)}>
      <circle cx="584" cy="70" r="5" style="fill: var(--value)" />
      <text x="598" y="74" style="font-weight: 700; fill: var(--ink)">Dag</text>
      <text x="598" y="90" style="font-size: 11.5px; fill: var(--muted)">daily stand-up</text>
    </g>
    <g class="g" style={s.op(step >= 1)}>
      <circle cx="584" cy="120" r="5" style="fill: var(--line2)" />
      <text x="598" y="124" style="font-weight: 700; fill: var(--ink)">2 weken</text>
      <text x="598" y="140" style="font-size: 11.5px; fill: var(--muted)">iteratie · systeemdemo</text>
    </g>
    <g class="g" style={s.op(step >= 2)}>
      <circle cx="584" cy="170" r="5" style="fill: var(--line1)" />
      <text x="598" y="174" style="font-weight: 700; fill: var(--ink)">Kwartaal</text>
      <text x="598" y="190" style="font-size: 11.5px; fill: var(--muted)">PI-planning · I&amp;A</text>
    </g>
    <g class="g" style={s.op(rolStap)}>
      <rect x="566" y="222" width="152" height={rol ? 56 + eventNamen.length * 16 : 70} rx="16" style="fill: var(--bg)" />
      <text x="580" y="246" style="font-size: 11.5px; font-weight: 600; fill: var(--value-text)">Jouw rol</text>
      {#if rol}
        <text x="580" y="264" style="font-weight: 700; fill: var(--ink)">{rol.titel}</text>
        {#each eventNamen as naam, i}
          <text x="580" y={282 + i * 16} style="font-size: 11.5px; fill: var(--muted)">· {naam}</text>
        {/each}
      {:else}
        <text x="580" y="266" style="font-size: 11.5px; fill: var(--muted)">Kies je rol op de</text>
        <text x="580" y="280" style="font-size: 11.5px; fill: var(--muted)">startpagina</text>
      {/if}
    </g>
  </g>
</svg>
