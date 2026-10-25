<script>
  let { step } = $props();

  const op = (aan) => `opacity: ${aan ? 1 : 0}`;
  const POS = [95, 220, 320, 525, 660];
  const dag1 = $derived([0.18, 0.58, 0.9, 1, 1][step]);
  const dag2 = $derived([0, 0, 0, 0.6, 1][step]);
  const verschoven = $derived(step >= 2);

  const haltes1 = [[60, 'Context'], [130, 'Visie'], [220, 'Breakouts'], [320, 'Review']];
  const haltes2 = [[400, 'Bijstellen'], [480, 'Breakouts'], [570, "Risico's"], [660, 'Stem']];
  const presentaties = [
    { x: 60, titel: 'Businesscontext', wie: 'Digital Lead', pad: 'M84 200 L110 182 L130 192 L160 160 L200 150', kleur: 'var(--line1)' },
    { x: 270, titel: 'Visie & top-features', wie: 'Product Manager', pad: 'M360 146 L367 162 L384 164 L371 175 L375 192 L360 183 L345 192 L349 175 L336 164 L353 162 Z', kleur: 'var(--value)' },
    { x: 480, titel: 'Architectuur', wie: 'Architect', pad: 'M570 144 L594 156 V182 L570 194 L546 182 V156 Z M546 156 L570 168 L594 156 M570 168 V194', kleur: 'var(--line2)' }
  ];
  // Kaartjes op het programmabord: [kolom (iteratie), rij (team)].
  const kaartjes = [[0, 0], [1, 0], [3, 0], [0, 1], [1, 1], [1, 2], [2, 2], [4, 2]];
  const kolomX = (k) => 148 + k * 108;
  const rijY = (r) => 150 + r * 60;
  const stemmen = [12, 24, 60, 152, 116];
  const roam = [
    ['R · Resolved', 'opgelost'],
    ['O · Owned', 'heeft een eigenaar'],
    ['A · Accepted', 'bewust geaccepteerd'],
    ['M · Mitigated', 'risico beperkt']
  ];
</script>

<svg class="sc" viewBox="0 0 720 400" role="img" aria-label="Tijdlijn van twee dagen PI-planning met een markering die meeloopt. Eronder wisselen de scènes: drie presentaties, een programmabord met teams, iteraties en afhankelijkheden, een managementreview die werk verschuift, de vier ROAM-categorieën voor risico's, en een vertrouwensstem van 1 tot 5.">
  <g style="font-size: 12px; font-weight: 700">
    <text x="40" y="28" style="fill: var(--line1)">Dag 1</text>
    <text x="380" y="28" style="fill: var(--line2)">Dag 2</text>
  </g>
  <path d="M40 56 H350 M380 56 H680" style="fill: none; stroke: var(--track); stroke-width: 3; stroke-linecap: round" />
  <path class="dr" pathLength="1" d="M40 56 H350" style="stroke: var(--line1); stroke-width: 3; stroke-linecap: round; stroke-dashoffset: {1 - dag1}" />
  <path class="dr" pathLength="1" d="M380 56 H680" style="stroke: var(--line2); stroke-width: 3; stroke-linecap: round; stroke-dashoffset: {1 - dag2}" />
  {#each haltes1 as [x, label]}
    <circle cx={x} cy="56" r="6" style="fill: var(--panel); stroke: var(--line1); stroke-width: 2" />
    <text x={x} y="82" text-anchor="middle" style="font-size: 10.5px; font-weight: 500; fill: var(--muted)">{label}</text>
  {/each}
  {#each haltes2 as [x, label]}
    <circle cx={x} cy="56" r="6" style="fill: var(--panel); stroke: var(--line2); stroke-width: 2" />
    <text x={x} y="82" text-anchor="middle" style="font-size: 10.5px; font-weight: 500; fill: var(--muted)">{label}</text>
  {/each}
  <g class="mv" style="transform: translateX({POS[step]}px)">
    <circle class="halo" cx="0" cy="56" r="9" style="fill: none; stroke: var(--value); stroke-width: 1.5" />
    <circle cx="0" cy="56" r="9" style="fill: var(--value)" />
  </g>

  <!-- Stap 1: presentaties voor de hele productgroep. -->
  <g class="g" style={op(step === 0)}>
    {#each presentaties as p, i}
      <g class="card" style="{op(step === 0)}; transition-delay: {i * 0.4}s">
        <rect x={p.x} y="120" width="180" height="128" rx="16" style="fill: var(--bg); stroke: var(--ink); stroke-width: 1.2" />
        <path d={p.pad} style="fill: none; stroke: {p.kleur}; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round" />
        <text x={p.x + 18} y="228" style="font-size: 12px; font-weight: 700; fill: var(--ink)">{p.titel}</text>
        <text x={p.x + 18} y="242" style="font-size: 12px; fill: var(--muted)">{p.wie}</text>
      </g>
    {/each}
    <g style="fill: var(--muted)">
      {#each Array(17) as _, i}
        <circle class="pulse" cx={200 + i * 20} cy="300" r="4" style="animation-delay: {i * 0.2}s" />
      {/each}
    </g>
    <text x="360" y="332" text-anchor="middle" style="font-size: 12px; font-weight: 600; fill: var(--muted)">de hele productgroep in één ruimte · iedereen hoort hetzelfde verhaal</text>
  </g>

  <!-- Stap 2–4: het programmabord. -->
  <g class="g" style="opacity: {step === 1 || step === 2 ? 1 : step === 3 ? 0.35 : 0}">
    <g style="font-size: 11.5px; font-weight: 600; fill: var(--muted)" text-anchor="middle">
      {#each [1, 2, 3, 4, 5] as it, k}
        <text x={kolomX(k) + 42} y="128">it. {it}</text>
      {/each}
    </g>
    <g style="font-size: 12px; font-weight: 700; fill: var(--ink)">
      <text x="56" y="167">Team A</text><text x="56" y="227">Team B</text><text x="56" y="287">Team C</text>
    </g>
    <path d="M136 138 V320 M244 138 V320 M352 138 V320 M460 138 V320 M568 138 V320 M676 138 V320 M50 140 H676 M50 200 H676 M50 260 H676 M50 320 H676" style="fill: none; stroke: var(--track); stroke-width: 1" />
    {#each kaartjes as [k, r], i}
      <rect class="card" x={kolomX(k)} y={rijY(r)} width="84" height="30" rx="6" style="fill: var(--bg); stroke: var(--line1); stroke-width: 1.5; {op(step >= 1)}; transition-delay: {0.1 + i * 0.1}s" />
    {/each}
    <g class="card" style="{op(step >= 1)}; transform: translateX({verschoven ? 108 : 0}px)">
      <rect x={kolomX(2)} y={rijY(1)} width="84" height="30" rx="6" style="fill: var(--bg); stroke: var(--value); stroke-width: 1.5; stroke-dasharray: {verschoven ? 'none' : '4 3'}" />
      <text x={kolomX(2) + 8} y={rijY(1) + 20} style="font-size: 11px; font-weight: 700; fill: var(--value-text)">{verschoven ? 'verschoven' : 'te vol!'}</text>
    </g>
    <path class="dr" pathLength="1" d="M340 165 C352 165 352 225 364 225" style="stroke: var(--value); stroke-width: 1.5; stroke-dashoffset: {step === 1 ? 0 : 1}; opacity: {step === 1 ? 1 : 0}" />
    <path class="dr" pathLength="1" d="M232 225 C246 225 244 285 256 285" style="stroke: var(--value); stroke-width: 1.5; stroke-dashoffset: {step >= 1 ? 0 : 1}; opacity: {step >= 1 ? 1 : 0}" />
    <path class="dr" pathLength="1" d="M448 285 C462 285 458 165 472 165" style="stroke: var(--value); stroke-width: 1.5; stroke-dashoffset: {step >= 1 ? 0 : 1}; opacity: {step >= 1 ? 1 : 0}" />
    <g class="g" style={op(step === 2)}>
      <rect x="420" y="330" width="256" height="34" rx="17" style="fill: var(--ink)" />
      <text x="436" y="352" style="font-size: 12px; font-weight: 600; fill: var(--bg)">Managementreview: werk schuift door</text>
    </g>
  </g>

  <!-- Stap 4: risico's volgens ROAM. -->
  <g class="g" style={op(step === 3)}>
    {#each roam as [kop, uitleg], i}
      <rect x={56 + i * 158} y="336" width="146" height="44" rx="14" style="fill: var(--bg); stroke: var(--line1); stroke-width: 1.2" />
      <text x={70 + i * 158} y="354" style="font-size: 12px; font-weight: 700; fill: var(--line1)">{kop}</text>
      <text x={70 + i * 158} y="370" style="font-size: 12px; fill: var(--muted)">{uitleg}</text>
    {/each}
  </g>

  <!-- Stap 5: vertrouwensstem. -->
  <g class="g" style={op(step === 4)}>
    <text x="200" y="134" style="font-size: 13px; font-weight: 700; fill: var(--ink)">Vertrouwensstem</text>
    <text x="200" y="152" style="font-size: 11.5px; fill: var(--muted)">Hoeveel vertrouwen heb je in dit plan? 1 tot 5 vingers</text>
    <path d="M190 330 H500" style="fill: none; stroke: var(--muted); stroke-width: 1" />
    {#each stemmen as h, i}
      <rect class="bar" x={210 + i * 60} y={330 - h} width="40" height={h} rx="6"
        style="fill: {['var(--track)', 'var(--track)', 'var(--line2)', 'var(--line1)', 'var(--value)'][i]}; transform: scaleY({step === 4 ? 1 : 0}); transition-delay: {i * 0.15}s" />
      <text x={230 + i * 60} y="350" text-anchor="middle" style="font-size: 12px; font-weight: 600; fill: var(--muted)">{i + 1}</text>
    {/each}
    <text x="520" y="230" style="font-size: 13px; font-weight: 700; fill: var(--ink)">gemiddeld 4,0</text>
    <text x="520" y="248" style="font-size: 12px; fill: var(--muted)">we committeren ons</text>
    <text x="520" y="290" style="font-size: 12px; font-weight: 600; fill: var(--value-text)">daarna: korte retro</text>
    <text x="520" y="306" style="font-size: 12px; fill: var(--muted)">en de trein vertrekt</text>
    <text x="520" y="322" style="font-size: 12px; fill: var(--muted)">voor tien weken</text>
  </g>
</svg>
