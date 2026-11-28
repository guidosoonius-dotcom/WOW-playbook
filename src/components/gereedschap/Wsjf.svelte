<script>
  // WSJF-rekenhulp: waarde, tijdkritiek en risico gedeeld door omvang. De volgorde rekent mee.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const SCHAAL = [1, 2, 3, 5, 8, 13, 20];
  const KOLOMMEN = [
    { id: 'waarde', naam: 'Waarde' },
    { id: 'tijd', naam: 'Tijdkritiek' },
    { id: 'risico', naam: 'Risico en kansen' },
    { id: 'omvang', naam: 'Omvang' }
  ];
  const nieuw = () => ({ naam: '', waarde: 1, tijd: 1, risico: 1, omvang: 1 });
  const start = () => ({ items: [nieuw(), nieuw(), nieuw()] });

  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const score = (i) => Math.round(((i.waarde + i.tijd + i.risico) / i.omvang) * 10) / 10;
  const volgorde = $derived(d.items.filter((i) => i.naam.trim()).map((i) => ({ ...i, score: score(i) })).sort((a, b) => b.score - a.score));
  const hoogste = $derived(volgorde[0]?.score ?? 1);

  export function inhoud() {
    return (
      doc.kop('Volgorde') +
      (volgorde.length
        ? doc.tabel(['#', 'Epic of feature', 'Waarde', 'Tijdkritiek', 'Risico en kansen', 'Omvang', 'WSJF'], volgorde.map((i, k) => [k + 1, i.naam, i.waarde, i.tijd, i.risico, i.omvang, String(i.score).replace('.', ',')]))
        : doc.p('Nog geen items gescoord.')) +
      doc.p('WSJF = (waarde + tijdkritiek + risico en kansen) / omvang. Het hoogste getal gaat voor.')
    );
  }
</script>

<div class="wsjf">
  <div class="wv-tabel-wrap">
    <table class="wv-tabel">
      <thead>
        <tr>
          <th>Epic of feature</th>
          {#each KOLOMMEN as k}<th>{k.naam}</th>{/each}
          <th>WSJF</th>
          <th><span class="sr-only">Verwijderen</span></th>
        </tr>
      </thead>
      <tbody>
        {#each d.items as item, i}
          <tr>
            <td class="naam"><input class="wv-invoer" bind:value={item.naam} placeholder="Naam van de epic of feature" aria-label="Naam van item {i + 1}" /></td>
            {#each KOLOMMEN as k}
              <td>
                <select class="wv-invoer" bind:value={item[k.id]} aria-label="{k.naam} van item {i + 1}">
                  {#each SCHAAL as s}<option value={s}>{s}</option>{/each}
                </select>
              </td>
            {/each}
            <td class="score" class:top={item.naam.trim() && score(item) === hoogste}>{item.naam.trim() ? String(score(item)).replace('.', ',') : '–'}</td>
            <td><button class="wv-weg" onclick={() => d.items.splice(i, 1)} aria-label="Item {i + 1} verwijderen">×</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="toevoegen"><button class="wv-knop wv-knop--link" onclick={() => d.items.push(nieuw())}>+ Item toevoegen</button></div>
  </div>

  <aside class="wv-kaart volgorde" aria-labelledby="volgorde-kop">
    <h2 id="volgorde-kop">Volgorde</h2>
    {#if volgorde.length}
      <ol>
        {#each volgorde as item, k}
          <li>
            <span class="nr" class:eerste={k === 0}>{k + 1}</span>
            <span class="balk-tekst">
              <b>{item.naam}</b>
              <span class="balk"><span style="width: {(item.score / hoogste) * 100}%" class:eerste={k === 0}></span></span>
            </span>
            <b class="getal">{String(item.score).replace('.', ',')}</b>
          </li>
        {/each}
      </ol>
      <p class="noot">Gelijke scores? Kies samen. De rekenhulp ondersteunt het gesprek; hij beslist niet.</p>
    {:else}
      <p class="noot">Geef een item een naam, dan verschijnt hier de volgorde.</p>
    {/if}
  </aside>
</div>

<style>
  .wsjf {
    display: grid;
    grid-template-columns: minmax(0, 8fr) minmax(0, 4fr);
    gap: 16px;
    align-items: start;
  }
  .naam {
    min-width: 220px;
  }
  td select {
    min-width: 70px;
  }
  .score {
    font-weight: 800;
    font-size: 17px;
    text-align: center;
  }
  .score.top {
    color: var(--value-text);
  }
  .toevoegen {
    padding: 6px 12px 10px;
  }
  .volgorde h2 {
    font-size: 18px;
    margin-bottom: 12px;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  li {
    display: grid;
    grid-template-columns: 24px minmax(0, 1fr) auto;
    gap: 10px;
    align-items: center;
    font-size: 14px;
  }
  .nr {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 700;
    font-size: 12px;
  }
  .nr.eerste {
    background: var(--value);
    color: #fff;
  }
  .balk-tekst {
    display: flex;
    flex-direction: column;
    gap: 5px;
    min-width: 0;
  }
  .balk {
    height: 8px;
    border-radius: 4px;
    background: var(--chip);
  }
  .balk span {
    display: block;
    height: 100%;
    border-radius: 4px;
    background: var(--line2);
    transition: width 0.3s ease;
  }
  .balk span.eerste {
    background: var(--value);
  }
  .noot {
    margin: 12px 0 0;
    font-size: 13px;
    color: var(--muted);
  }
  @media (max-width: 960px) {
    .wsjf {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
