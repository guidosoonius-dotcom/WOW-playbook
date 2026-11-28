<script>
  // Feature beschrijven: wat het oplevert, de verwachte waarde, acceptatiecriteria en checks.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const nieuw = () => ({ naam: '', epic: '', wat: '', hypothese: '', meten: '', criteria: [''], teams: '', enabler: false, kwartaal: false });
  const start = () => ({ features: [nieuw()], actief: 0 });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  const f = $derived(d.features[d.actief] ?? d.features[0]);

  const checks = $derived([
    { ok: !!f.wat.trim(), tekst: 'Er staat wat de feature oplevert' },
    { ok: !!f.hypothese.trim() && !!f.meten.trim(), tekst: 'De verwachte waarde is toetsbaar' },
    { ok: f.criteria.filter((c) => c.trim()).length >= 2, tekst: 'Er zijn minstens twee acceptatiecriteria' },
    { ok: f.kwartaal, tekst: 'Past binnen één kwartaal (anders: opknippen)' }
  ]);
  const klaar = $derived(checks.every((c) => c.ok));

  function toevoegen() {
    d.features.push(nieuw());
    d.actief = d.features.length - 1;
  }
  function verwijder() {
    d.features.splice(d.actief, 1);
    if (!d.features.length) d.features.push(nieuw());
    d.actief = Math.min(d.actief, d.features.length - 1);
  }

  export function inhoud() {
    return (
      d.features
        .filter((x) => x.naam || x.wat)
        .map(
          (x, i) =>
            doc.kop((x.naam || `Feature ${i + 1}`) + (x.enabler ? ' (enabler)' : '')) +
            doc.veld('Hoort bij epic', x.epic) +
            doc.veld('Wat het oplevert', x.wat) +
            doc.veld('Verwachte waarde', x.hypothese) +
            doc.veld('Zo meten we het', x.meten) +
            doc.veld('Teams', x.teams) +
            '<h3>Acceptatiecriteria</h3>' +
            doc.lijst(x.criteria)
        )
        .join('') || doc.p('Nog geen feature ingevuld.')
    );
  }
</script>

<div class="feature">
  <div class="links">
    <div class="wv-tags" role="tablist" aria-label="Features">
      {#each d.features as x, i}
        <button class="wv-voorstel" class:actief={i === d.actief} role="tab" aria-selected={i === d.actief} onclick={() => (d.actief = i)}>{x.naam || `Feature ${i + 1}`}</button>
      {/each}
      <button class="wv-knop wv-knop--link" onclick={toevoegen}>+ Nieuwe feature</button>
    </div>
    <div class="wv-kaart velden">
      <div class="twee">
        <label class="wv-veld">Naam<input class="wv-invoer" bind:value={f.naam} placeholder="Bijvoorbeeld: Diensten ruilen binnen een locatie" /></label>
        <label class="wv-veld">Hoort bij epic<input class="wv-invoer" bind:value={f.epic} placeholder="Naam van de epic" /></label>
      </div>
      <label class="wv-veld">Wat levert het op?<small>Voor de gebruiker, in een paar zinnen.</small><textarea class="wv-invoer" bind:value={f.wat} placeholder="Medewerkers kunnen een dienst aanbieden en ruilen met een collega op dezelfde locatie."></textarea></label>
      <div class="twee">
        <label class="wv-veld">We verwachten dat …<input class="wv-invoer" bind:value={f.hypothese} placeholder="planners minder ruilverzoeken per telefoon krijgen" /></label>
        <label class="wv-veld">Zo meten we het<input class="wv-invoer" bind:value={f.meten} placeholder="aantal telefoontjes per week" /></label>
      </div>
      <fieldset class="criteria">
        <legend class="wv-veld">Acceptatiecriteria</legend>
        {#each f.criteria as c, i}
          <div class="wv-rij"><input class="wv-invoer" bind:value={f.criteria[i]} placeholder="Criterium {i + 1}" aria-label="Criterium {i + 1}" /><button class="wv-weg" onclick={() => f.criteria.splice(i, 1)} aria-label="Criterium {i + 1} verwijderen">×</button></div>
        {/each}
        <button class="wv-knop wv-knop--link" onclick={() => f.criteria.push('')}>+ Criterium toevoegen</button>
      </fieldset>
      <label class="wv-veld">Welke teams werken eraan?<input class="wv-invoer" bind:value={f.teams} placeholder="Team Planning, Team Koppelingen" /></label>
      <label class="vink"><input type="checkbox" bind:checked={f.enabler} />Dit is een enabler (geen directe waarde voor gebruikers, wel nodig)</label>
      <label class="vink"><input type="checkbox" bind:checked={f.kwartaal} />Past binnen één kwartaal</label>
      {#if d.features.length > 1}<button class="wv-knop wv-knop--link verwijder" onclick={verwijder}>Deze feature verwijderen</button>{/if}
    </div>
  </div>

  <aside class="rechts">
    <div class="kaartje" class:klaar>
      <span class="label">{klaar ? 'Klaar voor de PI-planning' : 'Nog niet klaar'}</span>
      {#if f.enabler}<span class="label enabler">Enabler</span>{/if}
      <strong>{f.naam || 'Feature'}</strong>
      {#if f.epic}<small>Epic: {f.epic}</small>{/if}
      <p>{f.wat || 'Wat levert het op?'}</p>
    </div>
    <ul class="checks" aria-label="Checks">
      {#each checks as c}<li class:ok={c.ok}><span aria-hidden="true">{c.ok ? '✓' : '○'}</span>{c.tekst}</li>{/each}
    </ul>
  </aside>
</div>

<style>
  .feature {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    gap: 16px;
    align-items: start;
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .actief {
    background: var(--line1);
    color: var(--on-line1);
  }
  .velden {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .twee {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .criteria {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vink {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 15px;
  }
  .vink input {
    width: 18px;
    height: 18px;
    accent-color: var(--line1);
  }
  .verwijder {
    align-self: flex-start;
  }
  .rechts {
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .kaartje {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
    padding: 20px;
    border-radius: var(--radius-m);
    background: #eef5fc;
    color: #004077;
    border: 1.5px solid #c7dcf0;
    box-shadow: 4px 4px 0 var(--border);
  }
  .kaartje.klaar {
    border-color: #2e9e5b;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--radius-tag);
    background: #fff;
  }
  .klaar .label:first-child {
    background: #2e9e5b;
    color: #fff;
  }
  .label.enabler {
    background: #1473c3;
    color: #fff;
  }
  .kaartje strong {
    font-size: 18px;
  }
  .kaartje p {
    margin: 0;
    font-size: 15px;
  }
  .checks {
    list-style: none;
    margin: 0;
    padding: 14px 16px;
    border-radius: var(--radius-m);
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 14.5px;
    color: var(--muted);
  }
  .checks li {
    display: flex;
    gap: 8px;
  }
  .checks li.ok {
    color: var(--ink);
  }
  .checks li.ok span {
    color: #2e9e5b;
    font-weight: 800;
  }
  @media (max-width: 900px) {
    .feature,
    .twee {
      grid-template-columns: minmax(0, 1fr);
    }
    .rechts {
      position: static;
    }
  }
</style>
