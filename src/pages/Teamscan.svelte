<script>
  import content from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const scan = content.teamscan;
  const dims = scan.dimensies;
  const sleutel = (d, i) => `${d.id}.${i}`;

  const gemiddelden = $derived(
    dims.map((d) => {
      const scores = d.vragen.map((_, i) => prefs.scan[sleutel(d, i)]).filter((s) => s !== undefined);
      return scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : null;
    })
  );
  const totaalVragen = dims.reduce((n, d) => n + d.vragen.length, 0);
  const beantwoord = $derived(Object.keys(prefs.scan).filter((k) => dims.some((d) => k.startsWith(d.id + '.'))).length);
  const klaar = $derived(beantwoord === totaalVragen);

  // Radardiagram (hairline): assen gelijk verdeeld, schaal 0–5.
  const C = 180;
  const R = 130;
  const punt = (i, waarde) => {
    const hoek = -Math.PI / 2 + (i * 2 * Math.PI) / dims.length;
    const r = (R * waarde) / 5;
    return [C + r * Math.cos(hoek), C + r * Math.sin(hoek)];
  };
  const ring = (w) => dims.map((_, i) => punt(i, w).join(',')).join(' ');
  const vorm = $derived(gemiddelden.map((g, i) => punt(i, g ?? 0).join(',')).join(' '));
  const label = (i) => punt(i, 6.1);

  const duiding = (g, d) => (g === null ? null : g < 2.5 ? d.laag : g >= 3.5 ? d.hoog : 'Op weg: een deel gaat goed, een deel kan nog beter.');
  const fmt = (g) => (g === null ? '–' : g.toFixed(1).replace('.', ','));

  let melding = $state('');

  function alsMarkdown() {
    const datum = new Date().toLocaleDateString('nl-NL');
    return [
      `# Teamscan · ${datum}`,
      '',
      '| Dimensie | Score (1–5) | Duiding |',
      '|---|---|---|',
      ...dims.map((d, i) => `| ${d.naam} | ${fmt(gemiddelden[i])} | ${duiding(gemiddelden[i], d) ?? 'niet ingevuld'} |`),
      '',
      '## Tips voor de retro',
      ...dims.filter((_, i) => gemiddelden[i] !== null && gemiddelden[i] < 3.5).map((d) => `- **${d.naam}:** ${d.tip}`),
      ''
    ].join('\n');
  }

  async function kopieer() {
    try {
      await navigator.clipboard.writeText(alsMarkdown());
      melding = 'Gekopieerd. Plak het in je retro-notities of in Teams.';
    } catch {
      melding = 'Kopiëren lukt niet in deze browser. Gebruik "Download".';
    }
  }

  function download() {
    const url = URL.createObjectURL(new Blob([alsMarkdown()], { type: 'text/markdown' }));
    const a = Object.assign(document.createElement('a'), { href: url, download: `teamscan-${new Date().toISOString().slice(0, 10)}.md` });
    a.click();
    URL.revokeObjectURL(url);
  }

  function wis() {
    if (confirm('Alle antwoorden van de teamscan wissen?')) prefs.scan = {};
  }
</script>

<div class="container">
  <PaginaKop
    compact
   
    titel="Hoe staat jullie team ervoor?"
    kern="Vul de scan samen in, bijvoorbeeld in een retro. Het resultaat blijft in deze browser en is niet zichtbaar voor anderen."
    status="concept"
  />

  <div class="indeling">
    <form class="vragen" onsubmit={(e) => e.preventDefault()}>
      {#each dims as d, di}
        <fieldset class="rij-in" style="--i: {di}">
          <legend><span class="nr">{di + 1}</span>{d.naam}</legend>
          {#each d.vragen as vraag, vi}
            {@const k = sleutel(d, vi)}
            <div class="vraag" role="radiogroup" aria-labelledby="v-{k}">
              <p id="v-{k}">{vraag}</p>
              <div class="schaal">
                {#each scan.schaal as label, s}
                  <label class="punt" title={label}>
                    <input type="radio" name={k} value={s + 1} checked={prefs.scan[k] === s + 1} onchange={() => (prefs.scan[k] = s + 1)} />
                    <span aria-hidden="true">{s + 1}</span>
                    <span class="sr-only">{label}</span>
                  </label>
                {/each}
              </div>
              <div class="ankers" aria-hidden="true"><span>{scan.schaal[0]}</span><span>{scan.schaal[scan.schaal.length - 1]}</span></div>
            </div>
          {/each}
        </fieldset>
      {/each}
    </form>

    <aside class="resultaat" aria-labelledby="resultaat-kop">
      <div class="plakker">
        <h2 id="resultaat-kop">Jullie profiel</h2>
        <p class="voortgang">{beantwoord} van {totaalVragen} stellingen ingevuld</p>
        <svg viewBox="-80 -10 520 390" role="img" aria-label={dims.map((d, i) => `${d.naam}: ${fmt(gemiddelden[i])}`).join(', ')}>
          {#each [1, 2, 3, 4, 5] as w}
            <polygon points={ring(w)} class="ring" class:buiten={w === 5} />
          {/each}
          {#each dims as _, i}
            <line x1={C} y1={C} x2={punt(i, 5)[0]} y2={punt(i, 5)[1]} class="as" />
          {/each}
          <polygon points={vorm} class="vorm" />
          {#each gemiddelden as g, i}
            {#if g !== null}<circle cx={punt(i, g)[0]} cy={punt(i, g)[1]} r="4.5" class="stip" />{/if}
          {/each}
          {#each dims as d, i}
            {@const [x, y] = label(i)}
            <text {x} {y} text-anchor={x < C - 10 ? 'end' : x > C + 10 ? 'start' : 'middle'} dominant-baseline="middle">
              <tspan class="naam">{d.naam}</tspan>
              <tspan x={x} dy="16" class="score">{fmt(gemiddelden[i])}</tspan>
            </text>
          {/each}
        </svg>

        <ul class="duidingen">
          {#each dims as d, i}
            {#if gemiddelden[i] !== null}
              <li>
                <strong>{d.naam} · {fmt(gemiddelden[i])}</strong>
                <span>{duiding(gemiddelden[i], d)}</span>
                {#if gemiddelden[i] < 3.5}<span class="tip">Tip: {d.tip}</span>{/if}
              </li>
            {/if}
          {/each}
        </ul>

        <div class="acties">
          <button class="btn btn--primary" onclick={kopieer} disabled={!beantwoord}>Kopieer voor de retro</button>
          <button class="btn" onclick={download} disabled={!beantwoord}>Download</button>
          <button class="btn" onclick={() => window.print()} disabled={!beantwoord}>Print</button>
          <button class="wis" onclick={wis} disabled={!beantwoord}>Wis antwoorden</button>
        </div>
        <p class="melding" aria-live="polite">{melding}{#if klaar && !melding} Klaar! Bespreek het profiel samen in de retro.{/if}</p>
      </div>
    </aside>
  </div>
</div>

<style>
  .indeling {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 32px;
    align-items: start;
    padding-top: 12px;
  }
  .vragen {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  fieldset {
    margin: 0;
    padding: 20px;
    border: 0;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  legend {
    float: left;
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 19px;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .nr {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: 2.5px solid var(--line1);
    color: var(--line1);
    font-size: 14px;
  }
  .vraag {
    clear: both;
    padding: 14px 0 6px;
  }
  .vraag p {
    margin: 0 0 10px;
  }
  .schaal {
    display: flex;
    gap: 8px;
  }
  .punt {
    position: relative;
  }
  .punt input {
    position: absolute;
    opacity: 0;
    inset: 0;
    margin: 0;
    cursor: pointer;
  }
  .punt span[aria-hidden] {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--border);
    background: var(--bg);
    font-weight: 700;
    color: var(--muted);
  }
  .punt input:checked + span {
    background: var(--line1);
    border-color: var(--line1);
    color: var(--on-line1);
  }
  .punt input:focus-visible + span {
    outline: 2px solid var(--value);
    outline-offset: 2px;
  }
  .ankers {
    display: flex;
    justify-content: space-between;
    max-width: 252px;
    margin-top: 4px;
    font-size: 13px;
    color: var(--muted);
  }
  .plakker {
    position: sticky;
    top: 96px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border-radius: var(--radius-l);
    background: var(--panel);
  }
  h2 {
    font-size: 22px;
  }
  .voortgang {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  svg {
    width: 100%;
    height: auto;
    overflow: visible;
  }
  .ring {
    fill: none;
    stroke: var(--track);
    stroke-width: 1;
  }
  .ring.buiten {
    stroke: var(--muted);
    stroke-opacity: 0.5;
  }
  .as {
    stroke: var(--track);
    stroke-width: 1;
  }
  .vorm {
    fill: color-mix(in srgb, var(--line1) 16%, transparent);
    stroke: var(--line1);
    stroke-width: 2;
    stroke-linejoin: round;
    transition: opacity 0.6s ease-out;
  }
  .stip {
    fill: var(--value);
  }
  text {
    font-family: var(--font);
  }
  .naam {
    font-size: 13px;
    font-weight: 700;
    fill: var(--ink);
  }
  .score {
    font-size: 12px;
    fill: var(--muted);
  }
  .duidingen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    font-size: 14px;
  }
  .duidingen li {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .duidingen span {
    color: var(--muted);
  }
  .tip {
    color: var(--ink) !important;
  }
  .acties {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
  }
  .acties .btn {
    min-height: 44px;
  }
  .acties button:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  .wis {
    border: 0;
    background: none;
    color: var(--muted);
    text-decoration: underline;
  }
  .melding {
    margin: 0;
    font-size: 14px;
    min-height: 1.4em;
  }
  @media (max-width: 960px) {
    .indeling {
      grid-template-columns: minmax(0, 1fr);
    }
    .plakker {
      position: static;
    }
  }
  @media print {
    .vragen,
    .acties,
    .melding {
      display: none;
    }
    .indeling {
      grid-template-columns: 1fr;
    }
  }
</style>
