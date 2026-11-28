<script>
  // PI-planningskit: agenda voor twee dagen, ROAM-bord voor risico's en de vertrouwensstem.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const TABS = ['Agenda', 'ROAM-bord', 'Vertrouwensstem'];
  const ROAM = [
    { id: 'nieuw', naam: 'Nieuw', uitleg: 'Nog niet besproken' },
    { id: 'R', naam: 'Resolved', uitleg: 'Opgelost' },
    { id: 'O', naam: 'Owned', uitleg: 'Iemand pakt het op' },
    { id: 'A', naam: 'Accepted', uitleg: 'We accepteren het' },
    { id: 'M', naam: 'Mitigated', uitleg: 'We verkleinen het' }
  ];
  const start = () => ({ tab: 0, gedaan: [], risicos: [], stemmen: [0, 0, 0, 0, 0] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const agenda = $derived(w.agenda ?? []);
  const dagen = $derived([...new Set(agenda.map((a) => a.dag))]);
  let nieuwRisico = $state('');

  const totaalStemmen = $derived(d.stemmen.reduce((s, n) => s + n, 0));
  const gemiddelde = $derived(totaalStemmen ? d.stemmen.reduce((s, n, i) => s + n * (i + 1), 0) / totaalStemmen : 0);
  const laag = $derived(d.stemmen[0] + d.stemmen[1]);

  function wisselGedaan(i) {
    const k = d.gedaan.indexOf(i);
    if (k > -1) d.gedaan.splice(k, 1);
    else d.gedaan.push(i);
  }
  function risico(e) {
    e.preventDefault();
    if (nieuwRisico.trim()) d.risicos.push({ tekst: nieuwRisico.trim(), eigenaar: '', status: 'nieuw' });
    nieuwRisico = '';
  }

  export function inhoud() {
    return (
      doc.kop('Agenda') +
      doc.tabel(['Dag', 'Tijd', 'Onderdeel', 'Wie', 'Gedaan'], agenda.map((a, i) => [a.dag, a.tijd, a.onderdeel, a.wie, d.gedaan.includes(i) ? '✓' : ''])) +
      doc.kop("Risico's (ROAM)") +
      (d.risicos.length ? doc.tabel(['Risico', 'Status', 'Eigenaar'], d.risicos.map((r) => [r.tekst, ROAM.find((x) => x.id === r.status)?.naam, r.eigenaar || '–'])) : doc.p("Nog geen risico's.")) +
      doc.kop('Vertrouwensstem') +
      (totaalStemmen ? doc.tabel(['1', '2', '3', '4', '5', 'Gemiddeld'], [[...d.stemmen, gemiddelde.toFixed(1).replace('.', ',')]]) : doc.p('Nog niet gestemd.'))
    );
  }
</script>

<div class="kit">
  <div class="tabs" role="tablist" aria-label="Onderdelen van de kit">
    {#each TABS as t, i}
      <button role="tab" aria-selected={d.tab === i} onclick={() => (d.tab = i)}>{t}{#if i === 1 && d.risicos.length} <span class="aantal">{d.risicos.length}</span>{/if}</button>
    {/each}
  </div>

  {#if d.tab === 0}
    <div class="dagen">
      {#each dagen as dag}
        <section class="wv-kaart">
          <h2>{dag}</h2>
          <ul class="agenda">
            {#each agenda as a, i}
              {#if a.dag === dag}
                <li class:gedaan={d.gedaan.includes(i)}>
                  <label>
                    <input type="checkbox" checked={d.gedaan.includes(i)} onchange={() => wisselGedaan(i)} />
                    <span class="tijd">{a.tijd}</span>
                    <span class="wat"><b>{a.onderdeel}</b><small>{a.wie}</small></span>
                  </label>
                </li>
              {/if}
            {/each}
          </ul>
        </section>
      {/each}
    </div>
  {:else if d.tab === 1}
    <form class="wv-rij nieuw" onsubmit={risico}>
      <input class="wv-invoer" bind:value={nieuwRisico} placeholder="Nieuw risico, bijvoorbeeld: de leverancier levert de koppeling pas in iteratie 3" aria-label="Nieuw risico" />
      <button class="wv-knop wv-knop--vol" type="submit">Toevoegen</button>
    </form>
    <div class="roam">
      {#each ROAM as kolom}
        <section class="kolom" class:nieuw={kolom.id === 'nieuw'}>
          <h2>{kolom.naam}<small>{kolom.uitleg}</small></h2>
          {#each d.risicos as r, i}
            {#if r.status === kolom.id}
              <div class="risico">
                <textarea class="wv-invoer" bind:value={r.tekst} aria-label="Risico {i + 1}"></textarea>
                <input class="wv-invoer" bind:value={r.eigenaar} placeholder="Eigenaar" aria-label="Eigenaar van risico {i + 1}" />
                <div class="wv-rij">
                  <select class="wv-invoer" bind:value={r.status} aria-label="Status van risico {i + 1}">
                    {#each ROAM as x}<option value={x.id}>{x.naam}</option>{/each}
                  </select>
                  <button class="wv-weg" onclick={() => d.risicos.splice(i, 1)} aria-label="Risico {i + 1} verwijderen">×</button>
                </div>
              </div>
            {/if}
          {/each}
        </section>
      {/each}
    </div>
  {:else}
    <div class="stem">
      <div class="wv-kaart tellers">
        <h2>Hoeveel vertrouwen heb je in dit plan?</h2>
        <p class="klein">Iedereen steekt tegelijk 1 tot 5 vingers op. Tel per aantal vingers.</p>
        <div class="rij">
          {#each d.stemmen as n, i}
            <div class="teller">
              <span class="vingers">{i + 1}</span>
              <span class="getal">{n}</span>
              <div class="plusmin">
                <button class="wv-knop" onclick={() => d.stemmen[i] > 0 && d.stemmen[i]--} aria-label="Eén stem minder voor {i + 1}">−</button>
                <button class="wv-knop wv-knop--vol" onclick={() => d.stemmen[i]++} aria-label="Eén stem meer voor {i + 1}">+</button>
              </div>
            </div>
          {/each}
        </div>
      </div>
      <div class="wv-kaart uitslag" class:goed={totaalStemmen && gemiddelde >= 3 && !laag} class:twijfel={totaalStemmen && gemiddelde >= 3 && laag} class:slecht={totaalStemmen && gemiddelde < 3}>
        {#if totaalStemmen}
          <span class="gem">{gemiddelde.toFixed(1).replace('.', ',')}</span>
          <p>gemiddeld, {totaalStemmen} stemmen</p>
          <strong>
            {#if gemiddelde < 3}Te weinig vertrouwen. Bespreek wat er nodig is en pas het plan aan.
            {:else if laag}Genoeg vertrouwen, maar hoor eerst de {laag} {laag === 1 ? 'persoon' : 'mensen'} met 1 of 2 vingers.
            {:else}Genoeg vertrouwen: de trein kan vertrekken.{/if}
          </strong>
        {:else}
          <p>Nog geen stemmen. De uitslag verschijnt hier.</p>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .kit {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .tabs button {
    min-height: 40px;
    padding: 0 16px;
    border: 0;
    border-radius: var(--radius-tag);
    background: var(--surface);
    color: var(--ink);
    font-weight: 600;
  }
  .tabs button[aria-selected='true'] {
    background: var(--line1);
    color: var(--on-line1);
  }
  .aantal {
    display: inline-grid;
    place-items: center;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    background: var(--value);
    color: #fff;
    font-size: 12px;
  }
  .dagen {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(380px, 100%), 1fr));
    gap: 14px;
  }
  h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  .agenda {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .agenda label {
    display: grid;
    grid-template-columns: 20px 52px minmax(0, 1fr);
    gap: 10px;
    align-items: start;
    padding: 8px 10px;
    border-radius: var(--radius-s);
    cursor: pointer;
  }
  .agenda li:hover label {
    background: var(--bg);
  }
  .agenda input {
    width: 18px;
    height: 18px;
    margin-top: 2px;
    accent-color: var(--line1);
  }
  .tijd {
    font-weight: 700;
    font-variant-numeric: tabular-nums;
  }
  .wat {
    display: flex;
    flex-direction: column;
  }
  .wat small {
    color: var(--muted);
    font-size: 13px;
  }
  .gedaan .wat b {
    text-decoration: line-through;
    opacity: 0.6;
  }
  .nieuw.wv-rij {
    max-width: 900px;
  }
  .roam {
    display: grid;
    grid-template-columns: repeat(5, minmax(180px, 1fr));
    gap: 10px;
    overflow-x: auto;
  }
  .kolom {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    border-radius: var(--radius-m);
    background: var(--surface);
    min-height: 160px;
  }
  .kolom.nieuw {
    background: transparent;
    border: 1.5px dashed var(--track);
  }
  .kolom h2 {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    margin: 0;
  }
  .kolom h2 small {
    font-size: 12.5px;
    font-weight: 400;
    color: var(--muted);
  }
  .risico {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 10px;
    border-radius: var(--radius-s);
    background: var(--bg);
    border-left: 4px solid var(--value);
  }
  .risico textarea {
    min-height: 60px;
  }
  .stem {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    gap: 14px;
    align-items: stretch;
  }
  .klein {
    margin: 0 0 14px;
    color: var(--muted);
  }
  .rij {
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    gap: 10px;
  }
  .teller {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 12px 6px;
    border-radius: var(--radius-s);
    background: var(--bg);
  }
  .vingers {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 800;
  }
  .getal {
    font-size: 30px;
    font-weight: 800;
  }
  .plusmin {
    display: flex;
    gap: 4px;
  }
  .plusmin .wv-knop {
    min-height: 34px;
    padding: 0 12px;
  }
  .uitslag {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
  }
  .uitslag p {
    margin: 0;
    color: var(--muted);
  }
  .gem {
    font-size: 56px;
    font-weight: 800;
    line-height: 1;
  }
  .goed {
    box-shadow: inset 0 0 0 3px #2e9e5b;
  }
  .twijfel {
    box-shadow: inset 0 0 0 3px #e0a100;
  }
  .slecht {
    box-shadow: inset 0 0 0 3px var(--value);
  }
  @media (max-width: 860px) {
    .stem {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
