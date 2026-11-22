<script>
  // Budget verdelen: het digitale budget over de waardestromen, omgerekend naar aantallen teams.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const stroom = (naam = '') => ({ naam, bedrag: 0, toelichting: '' });
  const start = () => ({ totaal: 6000, perTeam: 900, reserve: 10, stromen: [stroom('Klant en contract'), stroom('Planning en inzet'), stroom('Mensen en organisatie')] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const reserveBedrag = $derived(Math.round((d.totaal * d.reserve) / 100));
  const teVerdelen = $derived(d.totaal - reserveBedrag);
  const verdeeld = $derived(d.stromen.reduce((s, x) => s + Number(x.bedrag || 0), 0));
  const over = $derived(teVerdelen - verdeeld);
  const teams = (b) => (d.perTeam > 0 ? Math.round((Number(b || 0) / d.perTeam) * 10) / 10 : 0);
  const pct = (b) => (teVerdelen > 0 ? Math.round((Number(b || 0) / teVerdelen) * 100) : 0);
  const euro = (k) => `€ ${Number(k || 0).toLocaleString('nl-NL')}k`;
  const KLEUREN = ['#004077', '#1473c3', '#c8261b', '#a1887f', '#0a599e', '#8e1a12'];

  function gelijk() {
    const n = d.stromen.length;
    if (!n) return;
    const deel = Math.floor(teVerdelen / n);
    d.stromen.forEach((x, i) => (x.bedrag = i === n - 1 ? teVerdelen - deel * (n - 1) : deel));
  }

  export function inhoud() {
    return (
      doc.p(`Totaal budget: ${euro(d.totaal)} per jaar. Reserve ${d.reserve}%: ${euro(reserveBedrag)}. Te verdelen: ${euro(teVerdelen)}. Kosten per team: ${euro(d.perTeam)} per jaar.`) +
      doc.tabel(['Waardestroom', 'Budget', 'Aandeel', 'Teams', 'Toelichting'], d.stromen.map((x) => [x.naam, euro(x.bedrag), `${pct(x.bedrag)}%`, String(teams(x.bedrag)).replace('.', ','), x.toelichting || '–'])) +
      doc.p(over === 0 ? 'Het budget is volledig verdeeld.' : over > 0 ? `Nog te verdelen: ${euro(over)}.` : `Te veel verdeeld: ${euro(-over)}.`)
    );
  }
</script>

<div class="budget">
  <div class="wv-kaart instellingen">
    <label class="wv-veld">Totaal digitaal budget<small>per jaar, in duizenden euro's</small><input class="wv-invoer" type="number" min="0" step="100" bind:value={d.totaal} /></label>
    <label class="wv-veld">Kosten per team<small>per jaar, in duizenden euro's</small><input class="wv-invoer" type="number" min="1" step="50" bind:value={d.perTeam} /></label>
    <label class="wv-veld">Reserve<small>percentage voor onvoorzien en nieuwe epics</small><input class="wv-invoer" type="number" min="0" max="50" bind:value={d.reserve} /></label>
    <div class="samen">
      <span>Te verdelen <b>{euro(teVerdelen)}</b></span>
      <span class:rood={over < 0} class:groen={over === 0}>{over === 0 ? 'Volledig verdeeld' : over > 0 ? `Nog ${euro(over)}` : `${euro(-over)} te veel`}</span>
    </div>
  </div>

  <div class="verdeling" aria-hidden="true">
    {#each d.stromen as x, i}
      {#if Number(x.bedrag) > 0}<span style="flex: {Number(x.bedrag)}; background: {KLEUREN[i % KLEUREN.length]}" title="{x.naam}: {pct(x.bedrag)}%">{pct(x.bedrag) >= 8 ? `${pct(x.bedrag)}%` : ''}</span>{/if}
    {/each}
    {#if over > 0}<span class="rest" style="flex: {over}">{over > teVerdelen * 0.08 ? 'niet verdeeld' : ''}</span>{/if}
  </div>

  <div class="stromen">
    {#each d.stromen as x, i}
      <section class="wv-kaart stroom" style="--k: {KLEUREN[i % KLEUREN.length]}">
        <div class="wv-rij">
          <input class="wv-invoer naam" bind:value={x.naam} aria-label="Naam van waardestroom {i + 1}" />
          <button class="wv-weg" onclick={() => d.stromen.splice(i, 1)} aria-label="Waardestroom {i + 1} verwijderen">×</button>
        </div>
        <label class="wv-veld">Budget (k€)<input class="wv-invoer" type="number" min="0" step="50" bind:value={x.bedrag} /></label>
        <input class="schuif" type="range" min="0" max={Math.max(teVerdelen, 1)} step="50" bind:value={x.bedrag} aria-label="Budget voor {x.naam}" />
        <div class="cijfers"><span><b>{pct(x.bedrag)}%</b> van het budget</span><span><b>{String(teams(x.bedrag)).replace('.', ',')}</b> teams</span></div>
        <input class="wv-invoer" bind:value={x.toelichting} placeholder="Waarom dit bedrag? Welke epics?" aria-label="Toelichting bij {x.naam}" />
      </section>
    {/each}
  </div>
  <div class="onder">
    <button class="wv-knop" onclick={() => d.stromen.push(stroom(`Waardestroom ${d.stromen.length + 1}`))}>+ Waardestroom</button>
    <button class="wv-knop wv-knop--link" onclick={gelijk}>Gelijk verdelen</button>
  </div>
</div>

<style>
  .budget {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .instellingen {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.2fr);
    gap: 14px;
    align-items: end;
  }
  .samen {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    border-radius: var(--radius-s);
    background: var(--chip);
    font-size: 14px;
  }
  .samen b {
    font-size: 19px;
  }
  .rood {
    color: var(--value-text);
    font-weight: 700;
  }
  .groen {
    color: #2e9e5b;
    font-weight: 700;
  }
  .verdeling {
    display: flex;
    height: 34px;
    border-radius: var(--radius-s);
    overflow: hidden;
    background: var(--chip);
  }
  .verdeling span {
    display: grid;
    place-items: center;
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    min-width: 2px;
  }
  .verdeling .rest {
    background: repeating-linear-gradient(45deg, var(--chip), var(--chip) 6px, var(--bg) 6px, var(--bg) 12px);
    color: var(--muted);
  }
  .stromen {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
    gap: 12px;
  }
  .stroom {
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-top: 5px solid var(--k);
  }
  .naam {
    font-weight: 700;
  }
  .schuif {
    width: 100%;
    accent-color: var(--k);
  }
  .cijfers {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
  }
  .cijfers b {
    font-size: 18px;
  }
  .onder {
    display: flex;
    gap: 16px;
    align-items: center;
  }
  @media (max-width: 860px) {
    .instellingen {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }
</style>
