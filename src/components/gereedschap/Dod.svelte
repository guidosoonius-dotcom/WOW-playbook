<script>
  // Definition of Done: kies uit voorstellen per groep en vul aan met eigen criteria.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const start = () => ({ team: '', gekozen: [], eigen: [] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  let nieuw = $state('');

  const groepen = $derived(w.groepen ?? []);
  const aantal = $derived(d.gekozen.length + d.eigen.filter((e) => e.trim()).length);

  function wissel(c) {
    const i = d.gekozen.indexOf(c);
    if (i > -1) d.gekozen.splice(i, 1);
    else d.gekozen.push(c);
  }

  export function inhoud() {
    let html = doc.veld('Team', d.team);
    for (const g of groepen) {
      const gekozen = g.criteria.filter((c) => d.gekozen.includes(c));
      if (gekozen.length) html += doc.kop(g.naam) + doc.lijst(gekozen);
    }
    const eigen = d.eigen.filter((e) => e.trim());
    if (eigen.length) html += doc.kop('Eigen criteria') + doc.lijst(eigen);
    if (!aantal) html += doc.p('Nog geen criteria gekozen.');
    return html;
  }
</script>

<div class="dod">
  <div class="wv-kaart kop">
    <label class="wv-veld">Team<input class="wv-invoer" bind:value={d.team} placeholder="Naam van het team" /></label>
    <p class="teller"><b>{aantal}</b> criteria in jullie Definition of Done</p>
  </div>

  <div class="groepen">
    {#each groepen as g}
      <fieldset class="wv-kaart">
        <legend>{g.naam}</legend>
        {#each g.criteria as c}
          <label class="vink">
            <input type="checkbox" checked={d.gekozen.includes(c)} onchange={() => wissel(c)} />
            <span>{c}</span>
          </label>
        {/each}
      </fieldset>
    {/each}

    <fieldset class="wv-kaart">
      <legend>Eigen criteria</legend>
      {#each d.eigen as e, i}
        <div class="wv-rij"><input class="wv-invoer" bind:value={d.eigen[i]} aria-label="Eigen criterium {i + 1}" /><button class="wv-weg" onclick={() => d.eigen.splice(i, 1)} aria-label="Criterium {i + 1} verwijderen">×</button></div>
      {/each}
      <form class="wv-rij" onsubmit={(e) => { e.preventDefault(); if (nieuw.trim()) d.eigen.push(nieuw.trim()); nieuw = ''; }}>
        <input class="wv-invoer" bind:value={nieuw} placeholder="Bijvoorbeeld: de servicedesk weet wat er verandert" aria-label="Nieuw criterium" />
        <button class="wv-knop" type="submit">Toevoegen</button>
      </form>
    </fieldset>
  </div>
</div>

<style>
  .dod {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .kop {
    display: flex;
    flex-wrap: wrap;
    gap: 14px 24px;
    align-items: flex-end;
    justify-content: space-between;
  }
  .kop .wv-veld {
    flex: 1;
    min-width: 240px;
  }
  .teller {
    margin: 0;
    font-size: 15px;
  }
  .teller b {
    font-size: 26px;
    color: var(--value-text);
  }
  .groepen {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 14px;
  }
  fieldset {
    margin: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  legend {
    float: left;
    width: 100%;
    font-weight: 700;
    font-size: 17px;
    margin-bottom: 6px;
  }
  .vink {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    padding: 8px 10px;
    border-radius: var(--radius-s);
    background: var(--bg);
    font-size: 15px;
    cursor: pointer;
  }
  .vink input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: var(--line1);
    flex-shrink: 0;
  }
</style>
