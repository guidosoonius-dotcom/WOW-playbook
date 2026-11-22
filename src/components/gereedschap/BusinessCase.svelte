<script>
  // Lean business case: hypothese, MVP, kosten en het besluit na de MVP.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const BESLUITEN = ['Nog niet', 'Doorgaan', 'Bijsturen', 'Stoppen'];
  const start = () => ({
    naam: '',
    owner: '',
    probleem: '',
    voorWie: '',
    als: '',
    dan: '',
    meten: '',
    mvp: '',
    buiten: '',
    kostenMvp: '',
    kostenTotaal: '',
    waardestroom: '',
    risicos: '',
    besluit: 'Nog niet',
    toelichting: ''
  });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const hypothese = $derived(`Als we ${d.als || '…'}, dan verwachten we ${d.dan || '…'}. We meten dat aan ${d.meten || '…'}.`);
  const SECTIES = [
    ['De epic', ['naam', 'owner', 'waardestroom']],
    ['Probleem en hypothese', ['probleem', 'voorWie', 'als', 'dan', 'meten']],
    ['MVP en kosten', ['mvp', 'buiten', 'kostenMvp', 'kostenTotaal', 'risicos']],
    ['Besluit na de MVP', ['besluit', 'toelichting']]
  ];
  const gevuld = (velden) => velden.filter((v) => d[v] && d[v] !== 'Nog niet').length;

  export function inhoud() {
    return (
      doc.veld('Epic', d.naam) +
      doc.veld('Epic Owner', d.owner) +
      doc.veld('Waardestroom', d.waardestroom) +
      doc.kop('Probleem') + (doc.p(d.probleem) || '<p class="leeg">Nog niet ingevuld.</p>') +
      doc.veld('Voor wie', d.voorWie) +
      doc.kop('Hypothese') + doc.p(hypothese) +
      doc.kop('MVP') + (doc.p(d.mvp) || '<p class="leeg">Nog niet ingevuld.</p>') +
      doc.veld('Buiten de MVP', d.buiten) +
      doc.kop('Kosten') + doc.veld('Kosten van de MVP', d.kostenMvp) + doc.veld('Verwachte kosten van de hele epic', d.kostenTotaal) +
      doc.kop("Risico's en afhankelijkheden") + (doc.p(d.risicos) || '<p class="leeg">Nog niet ingevuld.</p>') +
      doc.kop('Besluit na de MVP') + doc.veld('Besluit', d.besluit) + doc.p(d.toelichting)
    );
  }
</script>

<div class="lbc">
  <div class="secties">
    <section class="wv-kaart">
      <h2>De epic <small>{gevuld(SECTIES[0][1])}/3</small></h2>
      <div class="wv-raster">
        <label class="wv-veld">Naam van de epic<input class="wv-invoer" bind:value={d.naam} placeholder="Bijvoorbeeld: Zelf diensten ruilen" /></label>
        <label class="wv-veld">Epic Owner<input class="wv-invoer" bind:value={d.owner} placeholder="Naam" /></label>
      </div>
      <label class="wv-veld">Waardestroom<input class="wv-invoer" bind:value={d.waardestroom} placeholder="Bij welke waardestroom hoort de epic?" /></label>
    </section>

    <section class="wv-kaart">
      <h2>Probleem en hypothese <small>{gevuld(SECTIES[1][1])}/5</small></h2>
      <label class="wv-veld">Welk probleem lossen we op?<textarea class="wv-invoer" bind:value={d.probleem} placeholder="Wat gaat er nu mis, en wat kost dat?"></textarea></label>
      <label class="wv-veld">Voor wie?<input class="wv-invoer" bind:value={d.voorWie} placeholder="Welke gebruikers of klanten merken het?" /></label>
      <div class="hypothese">
        <label class="wv-veld">Als we …<input class="wv-invoer" bind:value={d.als} placeholder="medewerkers zelf hun diensten laten ruilen in de app" /></label>
        <label class="wv-veld">dan verwachten we …<input class="wv-invoer" bind:value={d.dan} placeholder="dat planners veel minder tijd kwijt zijn aan bellen" /></label>
        <label class="wv-veld">We meten dat aan …<input class="wv-invoer" bind:value={d.meten} placeholder="het aantal telefoontjes per week (nu circa 400)" /></label>
      </div>
    </section>

    <section class="wv-kaart">
      <h2>MVP en kosten <small>{gevuld(SECTIES[2][1])}/5</small></h2>
      <label class="wv-veld">De MVP<small>Het kleinste dat we kunnen bouwen om de hypothese te toetsen.</small><textarea class="wv-invoer" bind:value={d.mvp} placeholder="Ruilen binnen één locatie, alleen voor schoonmaakdiensten"></textarea></label>
      <label class="wv-veld">Bewust niet in de MVP<input class="wv-invoer" bind:value={d.buiten} placeholder="Ruilen tussen locaties, goedkeuring door de leidinggevende" /></label>
      <div class="wv-raster">
        <label class="wv-veld">Kosten van de MVP<input class="wv-invoer" bind:value={d.kostenMvp} placeholder="Bijvoorbeeld: 1 team, 2 iteraties" /></label>
        <label class="wv-veld">Verwachte kosten van de hele epic<input class="wv-invoer" bind:value={d.kostenTotaal} placeholder="Bijvoorbeeld: 1 team, 2 kwartalen" /></label>
      </div>
      <label class="wv-veld">Risico's en afhankelijkheden<textarea class="wv-invoer" bind:value={d.risicos} placeholder="Bijvoorbeeld: koppeling met het planningspakket van de leverancier"></textarea></label>
    </section>

    <section class="wv-kaart">
      <h2>Besluit na de MVP</h2>
      <div class="wv-segment" role="radiogroup" aria-label="Besluit">
        {#each BESLUITEN as b}<button role="radio" aria-checked={d.besluit === b} onclick={() => (d.besluit = b)}>{b}</button>{/each}
      </div>
      <label class="wv-veld">Toelichting<textarea class="wv-invoer" bind:value={d.toelichting} placeholder="Wat hebben we gemeten, en wat besluiten we daarom?"></textarea></label>
    </section>
  </div>

  <aside class="samenvatting">
    <div class="wv-kaart">
      <span class="wv-label besluit besluit--{d.besluit.replace(' ', '-').toLowerCase()}">{d.besluit === 'Nog niet' ? 'Nog geen besluit' : d.besluit}</span>
      <h2>{d.naam || 'Nieuwe epic'}</h2>
      <p class="klein">{d.owner ? `Epic Owner: ${d.owner}` : 'Nog geen Epic Owner'}</p>
      <h3>Hypothese</h3>
      <p class="hyp">{hypothese}</p>
      {#if d.mvp}<h3>MVP</h3><p class="klein">{d.mvp}</p>{/if}
    </div>
  </aside>
</div>

<style>
  .lbc {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    gap: 16px;
    align-items: start;
  }
  .secties {
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
    font-size: 19px;
  }
  h2 small {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
    margin-left: 6px;
  }
  .hypothese {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 14px;
    border-radius: var(--radius-s);
    background: var(--chip);
  }
  .samenvatting {
    position: sticky;
    top: 90px;
  }
  .samenvatting h2 {
    margin: 10px 0 2px;
  }
  .samenvatting h3 {
    font-size: 14px;
    margin: 14px 0 4px;
  }
  .klein {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  .hyp {
    margin: 0;
    font-size: 15.5px;
    padding: 12px;
    border-left: 4px solid var(--value);
    background: var(--bg);
    border-radius: 0 var(--radius-s) var(--radius-s) 0;
  }
  .besluit {
    background: var(--chip);
    color: var(--ink);
  }
  .besluit--doorgaan {
    background: #2e9e5b;
    color: #fff;
  }
  .besluit--bijsturen {
    background: #1473c3;
    color: #fff;
  }
  .besluit--stoppen {
    background: #c8261b;
    color: #fff;
  }
  @media (max-width: 900px) {
    .lbc {
      grid-template-columns: minmax(0, 1fr);
    }
    .samenvatting {
      position: static;
    }
  }
</style>
