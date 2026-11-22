<script>
  // Portfoliokanban: epics van trechter tot klaar, met een maximum voor analyse en uitvoering.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';
  import { href } from '../../lib/router.svelte.js';

  let { w } = $props();

  const KOLOMMEN = [
    { id: 'trechter', naam: 'Trechter', uitleg: 'Ideeën, nog zonder uitwerking' },
    { id: 'beoordelen', naam: 'Beoordelen', uitleg: 'Past het bij de koers?' },
    { id: 'analyseren', naam: 'Analyseren', uitleg: 'Lean business case', max: true },
    { id: 'klaar-voor', naam: 'Klaar voor uitvoering', uitleg: 'Wacht op ruimte' },
    { id: 'uitvoering', naam: 'Uitvoering', uitleg: 'MVP en verder', max: true },
    { id: 'klaar', naam: 'Klaar', uitleg: 'Afgerond of gestopt' }
  ];
  const start = () => ({ epics: [], max: { analyseren: 3, uitvoering: 4 } });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  let nieuw = $state('');

  const inKolom = (k) => d.epics.filter((e) => e.kolom === k);
  const vol = (k) => KOLOMMEN.find((x) => x.id === k)?.max && inKolom(k).length > d.max[k];
  const idx = (k) => KOLOMMEN.findIndex((x) => x.id === k);

  function voegToe(e) {
    e.preventDefault();
    if (nieuw.trim()) d.epics.push({ naam: nieuw.trim(), owner: '', kolom: 'trechter', gestopt: false });
    nieuw = '';
  }
  function schuif(epic, richting) {
    const i = idx(epic.kolom) + richting;
    if (i >= 0 && i < KOLOMMEN.length) epic.kolom = KOLOMMEN[i].id;
  }

  export function inhoud() {
    return (
      KOLOMMEN.map((k) => {
        const lijst = inKolom(k.id);
        const kop = k.naam + (k.max ? ` (maximum ${d.max[k.id]})` : '');
        return doc.kop(kop) + (lijst.length ? doc.lijst(lijst.map((e) => e.naam + (e.owner ? ` · ${e.owner}` : '') + (e.gestopt ? ' · gestopt' : ''))) : doc.p('Leeg.'));
      }).join('') + (KOLOMMEN.some((k) => vol(k.id)) ? doc.p('Let op: in een kolom staan meer epics dan het afgesproken maximum.') : '')
    );
  }
</script>

<div class="pk">
  <div class="wv-kaart balk">
    <form class="wv-rij nieuw" onsubmit={voegToe}>
      <input class="wv-invoer" bind:value={nieuw} placeholder="Nieuwe epic in de trechter, bijvoorbeeld: Zelf diensten ruilen" aria-label="Nieuwe epic" />
      <button class="wv-knop wv-knop--vol" type="submit">Toevoegen</button>
    </form>
    <div class="maxima">
      <label>Maximum in analyse <input class="wv-invoer getal" type="number" min="1" max="20" bind:value={d.max.analyseren} /></label>
      <label>Maximum in uitvoering <input class="wv-invoer getal" type="number" min="1" max="20" bind:value={d.max.uitvoering} /></label>
    </div>
  </div>

  <div class="bord">
    {#each KOLOMMEN as k, ki}
      <section class="kolom" class:vol={vol(k.id)} aria-label={k.naam}>
        <h2>{k.naam} <span class="aantal">{inKolom(k.id).length}{k.max ? ` / ${d.max[k.id]}` : ''}</span></h2>
        <p class="uitleg">{k.uitleg}</p>
        {#if vol(k.id)}<p class="waarschuwing">Meer dan het maximum: eerst iets afmaken</p>{/if}
        {#each d.epics as e, i}
          {#if e.kolom === k.id}
            <div class="epic" class:gestopt={e.gestopt}>
              <input class="wv-invoer naam" bind:value={e.naam} aria-label="Naam van epic" />
              <input class="wv-invoer" bind:value={e.owner} placeholder="Epic Owner" aria-label="Epic Owner van {e.naam}" />
              {#if k.id === 'klaar'}<label class="stop"><input type="checkbox" bind:checked={e.gestopt} />Gestopt na de MVP</label>{/if}
              {#if k.id === 'analyseren'}<a class="lbc" href={href('doen/gereedschap/lean-business-case')}>Business case →</a>{/if}
              <div class="acties">
                <button class="wv-knop" onclick={() => schuif(e, -1)} disabled={ki === 0} aria-label="{e.naam} een kolom terug">←</button>
                <button class="wv-weg" onclick={() => d.epics.splice(i, 1)} aria-label="{e.naam} verwijderen">×</button>
                <button class="wv-knop wv-knop--vol" onclick={() => schuif(e, 1)} disabled={ki === KOLOMMEN.length - 1} aria-label="{e.naam} een kolom verder">→</button>
              </div>
            </div>
          {/if}
        {/each}
      </section>
    {/each}
  </div>
</div>

<style>
  .pk {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .balk {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 24px;
    align-items: center;
    justify-content: space-between;
  }
  .nieuw {
    flex: 1;
    min-width: 280px;
  }
  .maxima {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    font-size: 14px;
    font-weight: 600;
  }
  .maxima label {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .getal {
    width: 70px;
  }
  .bord {
    display: grid;
    grid-template-columns: repeat(6, minmax(170px, 1fr));
    gap: 10px;
    overflow-x: auto;
    padding-bottom: 6px;
  }
  .kolom {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: var(--radius-m);
    background: var(--surface);
    min-height: 220px;
  }
  .kolom.vol {
    box-shadow: inset 0 0 0 2px var(--value);
  }
  h2 {
    font-size: 15px;
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }
  .aantal {
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
  }
  .vol .aantal {
    color: var(--value-text);
  }
  .uitleg {
    margin: -4px 0 0;
    font-size: 12.5px;
    color: var(--muted);
  }
  .waarschuwing {
    margin: 0;
    padding: 6px 8px;
    border-radius: var(--radius-s);
    background: #fbeceb;
    color: #8e1a12;
    font-size: 12.5px;
    font-weight: 600;
  }
  .epic {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    border-radius: var(--radius-s);
    background: var(--bg);
    border-left: 4px solid var(--value);
  }
  .epic.gestopt {
    opacity: 0.65;
    border-left-color: var(--track);
  }
  .epic .wv-invoer {
    min-height: 34px;
    padding: 5px 8px;
    font-size: 14px;
  }
  .naam {
    font-weight: 700;
  }
  .stop {
    display: flex;
    gap: 6px;
    align-items: center;
    font-size: 13px;
  }
  .lbc {
    font-size: 12.5px;
    font-weight: 600;
  }
  .acties {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .acties .wv-knop {
    min-height: 32px;
    padding: 0 12px;
  }
  .acties .wv-knop:disabled {
    opacity: 0.35;
  }
</style>
