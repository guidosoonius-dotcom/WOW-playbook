<script>
  // Waardestroom in kaart: begin, stappen, systemen en wachttijd; de metrolijn tekent mee.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const stap = (naam = '', systeem = '') => ({ naam, systeem, wacht: 0 });
  const start = () => ({ naam: '', begint: '', waarde: '', klant: '', stappen: [stap(), stap(), stap()] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const gevuld = $derived(d.stappen.filter((s) => s.naam.trim()));
  const wachtTotaal = $derived(gevuld.reduce((t, s) => t + Number(s.wacht || 0), 0));
  const langste = $derived(gevuld.reduce((m, s) => Math.max(m, Number(s.wacht || 0)), 0));
  const producten = $derived.by(() => {
    const m = new Map();
    for (const s of gevuld) if (s.systeem.trim()) m.set(s.systeem.trim(), [...(m.get(s.systeem.trim()) ?? []), s.naam]);
    return [...m.entries()];
  });

  // Metrolijn: maximaal 6 haltes per rij, rijen eronder.
  const PER_RIJ = 6;
  const B = 640;
  const rijen = $derived.by(() => {
    const r = [];
    for (let i = 0; i < gevuld.length; i += PER_RIJ) r.push(gevuld.slice(i, i + PER_RIJ));
    return r;
  });
  const RIJ_H = 150;
  const xVan = (i, n) => 70 + (n === 1 ? (B - 140) / 2 : (i * (B - 140)) / Math.max(n - 1, 1));

  export function inhoud() {
    return (
      doc.veld('Waardestroom', d.naam) +
      doc.veld('Begint bij', d.begint) +
      doc.veld('Waarde als', d.waarde) +
      doc.veld('Voor wie', d.klant) +
      doc.kop('Stappen') +
      (gevuld.length ? doc.tabel(['#', 'Stap', 'Systeem', 'Wacht daarna (dagen)'], gevuld.map((s, i) => [i + 1, s.naam, s.systeem || '–', s.wacht || 0])) : doc.p('Nog geen stappen.')) +
      doc.p(`Totale wachttijd: ${wachtTotaal} dagen.`) +
      doc.kop('Kandidaat-producten') +
      (producten.length ? doc.lijst(producten.map(([p, st]) => `${p} (bij: ${st.join(', ')})`)) : doc.p('Vul systemen in bij de stappen.'))
    );
  }
</script>

<div class="ws">
  <div class="links">
    <section class="wv-kaart">
      <label class="wv-veld">Naam van de waardestroom<input class="wv-invoer" bind:value={d.naam} placeholder="Bijvoorbeeld: Van contract tot factuur" /></label>
      <div class="wv-raster">
        <label class="wv-veld">Begint bij<input class="wv-invoer" bind:value={d.begint} placeholder="Een klant tekent een contract" /></label>
        <label class="wv-veld">Waarde als<input class="wv-invoer" bind:value={d.waarde} placeholder="De factuur is betaald" /></label>
      </div>
      <label class="wv-veld">Voor wie<input class="wv-invoer" bind:value={d.klant} placeholder="De klant of de collega die er iets aan heeft" /></label>
    </section>

    <section class="wv-kaart">
      <h2>Stappen</h2>
      <p class="hulp">Per stap het systeem dat wordt gebruikt, en hoe lang het werk daarna wacht.</p>
      <div class="stappen">
        <div class="kopregel" aria-hidden="true"><span>#</span><span>Stap</span><span>Systeem</span><span>Wacht (dagen)</span><span></span></div>
        {#each d.stappen as s, i}
          <div class="stap">
            <span class="nr">{i + 1}</span>
            <input class="wv-invoer" bind:value={s.naam} placeholder="Stap" aria-label="Stap {i + 1}" />
            <input class="wv-invoer" bind:value={s.systeem} placeholder="Systeem of app" aria-label="Systeem bij stap {i + 1}" />
            <input class="wv-invoer" type="number" min="0" bind:value={s.wacht} aria-label="Wachttijd na stap {i + 1} in dagen" />
            <button class="wv-weg" onclick={() => d.stappen.splice(i, 1)} aria-label="Stap {i + 1} verwijderen">×</button>
          </div>
        {/each}
      </div>
      <button class="wv-knop wv-knop--link" onclick={() => d.stappen.push(stap())}>+ Stap toevoegen</button>
    </section>
  </div>

  <aside class="rechts">
    <div class="wv-kaart lijnkaart">
      <div class="lijnkop">
        <strong>{d.naam || 'Jouw waardestroom'}</strong>
        <span class="wv-label">{gevuld.length} stappen · {wachtTotaal} dagen wachten</span>
      </div>
      {#if gevuld.length}
        <svg viewBox="0 0 {B} {rijen.length * RIJ_H + 20}" role="img" aria-label="Metrolijn van de waardestroom met {gevuld.length} stappen">
          {#each rijen as rij, r}
            {@const y = 60 + r * RIJ_H}
            <path d="M{xVan(0, rij.length) - 40} {y} H{xVan(rij.length - 1, rij.length) + 40}" class="lijn" />
            {#if r === 0}<rect x="4" y={y - 18} width="36" height="36" rx="8" class="eind begin" /><text x="22" y={y + 5} text-anchor="middle" class="eindtekst">▶</text>{/if}
            {#if r === rijen.length - 1}<rect x={xVan(rij.length - 1, rij.length) + 44} y={y - 18} width="36" height="36" rx="8" class="eind waarde" /><text x={xVan(rij.length - 1, rij.length) + 62} y={y + 5} text-anchor="middle" class="eindtekst wit">€</text>{/if}
            {#each rij as s, i}
              {@const x = xVan(i, rij.length)}
              <circle cx={x} cy={y} r="11" class="halte" />
              <text x={x} y={y - (i % 2 ? 36 : 22)} text-anchor="middle" class="stapnaam">{s.naam.length > 18 ? s.naam.slice(0, 17) + '…' : s.naam}</text>
              {#if s.systeem}<text x={x} y={y + 32} text-anchor="middle" class="systeem">{s.systeem.length > 20 ? s.systeem.slice(0, 19) + '…' : s.systeem}</text>{/if}
              {#if Number(s.wacht) > 0 && !(r === rijen.length - 1 && i === rij.length - 1)}
                <g class:langste={Number(s.wacht) === langste}>
                  <rect x={x + (B - 140) / Math.max(rij.length - 1, 1) / 2 - 22} y={y + 44} width="44" height="22" rx="6" class="wacht" />
                  <text x={x + (B - 140) / Math.max(rij.length - 1, 1) / 2} y={y + 59} text-anchor="middle" class="wachttekst">{s.wacht} dg</text>
                </g>
              {/if}
            {/each}
          {/each}
        </svg>
      {:else}
        <p class="hulp">Vul stappen in; de metrolijn verschijnt hier.</p>
      {/if}
    </div>
    {#if producten.length}
      <div class="wv-kaart">
        <h2>Kandidaat-producten</h2>
        <p class="hulp">Elk systeem kan een product worden met een eigen team. Zie <a href="#/uitleg/wat-is-een-product">Wat is een product bij ons?</a></p>
        <ul class="producten">{#each producten as [p, st]}<li><b>{p}</b><span>{st.join(' · ')}</span></li>{/each}</ul>
      </div>
    {/if}
  </aside>
</div>

<style>
  .ws {
    display: grid;
    grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
    gap: 16px;
    align-items: start;
  }
  .links,
  .rechts {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  h2 {
    font-size: 18px;
  }
  .hulp {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  .stappen {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .kopregel,
  .stap {
    display: grid;
    grid-template-columns: 22px minmax(0, 1.3fr) minmax(0, 1fr) 84px 36px;
    gap: 6px;
    align-items: center;
  }
  .kopregel {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--muted);
  }
  .nr {
    font-weight: 700;
    font-size: 13px;
    text-align: center;
  }
  .rechts {
    position: sticky;
    top: 90px;
  }
  .lijnkop {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    align-items: center;
    margin-bottom: 8px;
  }
  .lijnkop .wv-label {
    background: var(--chip);
  }
  svg {
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--font);
  }
  .lijn {
    stroke: var(--line1);
    stroke-width: 5;
    stroke-linecap: round;
    fill: none;
  }
  .halte {
    fill: var(--surface);
    stroke: var(--line1);
    stroke-width: 4;
  }
  .stapnaam {
    font-size: 12.5px;
    font-weight: 700;
    fill: var(--ink);
  }
  .systeem {
    font-size: 11px;
    fill: var(--muted);
  }
  .eind.begin {
    fill: var(--chip);
  }
  .eind.waarde {
    fill: var(--value);
  }
  .eindtekst {
    font-size: 15px;
    fill: var(--ink);
    font-weight: 700;
  }
  .eindtekst.wit {
    fill: #fff;
  }
  .wacht {
    fill: var(--chip);
  }
  .wachttekst {
    font-size: 11.5px;
    font-weight: 700;
    fill: var(--ink);
  }
  .langste .wacht {
    fill: var(--value);
  }
  .langste .wachttekst {
    fill: #fff;
  }
  .producten {
    list-style: none;
    margin: 6px 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .producten li {
    display: flex;
    flex-direction: column;
    padding: 8px 12px;
    border-radius: var(--radius-s);
    background: var(--bg);
  }
  .producten span {
    font-size: 13px;
    color: var(--muted);
  }
  @media (max-width: 960px) {
    .ws {
      grid-template-columns: minmax(0, 1fr);
    }
    .rechts {
      position: static;
    }
  }
</style>
