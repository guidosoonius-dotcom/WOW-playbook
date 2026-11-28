<script>
  // Probleemoplossing: probleem, visgraat met oorzaken, vijf keer waarom en verbeteracties.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const STAPPEN = ['Probleem', 'Oorzaken', 'Vijf keer waarom', 'Verbeteracties'];
  const categorieen = $derived(w.categorieen ?? []);
  const start = () => ({ stap: 0, wat: '', waar: '', kost: '', oorzaken: {}, hoofd: '', waarom: ['', '', '', '', ''], acties: [] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  let invoer = $state({});
  let nieuweActie = $state({ wat: '', wie: '', wanneer: '' });

  const lijst = (c) => d.oorzaken[c] ?? [];
  const alle = $derived(categorieen.flatMap((c) => lijst(c).map((o) => ({ c, o }))));
  function voegOorzaak(c) {
    const t = (invoer[c] ?? '').trim();
    if (!t) return;
    d.oorzaken[c] = [...lijst(c), t];
    invoer[c] = '';
  }
  function verwijderOorzaak(c, i) {
    d.oorzaken[c] = lijst(c).filter((_, k) => k !== i);
  }
  function actie(e) {
    e.preventDefault();
    if (nieuweActie.wat.trim()) d.acties.push({ ...nieuweActie, wat: nieuweActie.wat.trim() });
    nieuweActie = { wat: '', wie: '', wanneer: '' };
  }

  // Visgraat: de graten wisselen boven en onder de ruggengraat.
  const B = 760;
  const H = 300;
  const graat = (i, n) => {
    const kolommen = Math.ceil(n / 2);
    const x = 90 + ((i >> 1) + 0.5) * ((B - 230) / kolommen);
    return { x, boven: i % 2 === 0 };
  };

  export function inhoud() {
    return (
      doc.kop('Probleem') +
      doc.veld('Wat gaat er mis', d.wat) +
      doc.veld('Waar en wanneer', d.waar) +
      doc.veld('Wat kost het', d.kost) +
      doc.kop('Oorzaken') +
      (alle.length ? categorieen.filter((c) => lijst(c).length).map((c) => `<h3>${c}</h3>` + doc.lijst(lijst(c))).join('') : doc.p('Nog geen oorzaken.')) +
      doc.kop('Vijf keer waarom') +
      doc.veld('Belangrijkste oorzaak', d.hoofd) +
      doc.lijst(d.waarom.map((x, i) => (x ? `Waarom ${i + 1}: ${x}` : ''))) +
      doc.kop('Verbeteracties') +
      (d.acties.length ? doc.tabel(['Actie', 'Wie', 'Wanneer'], d.acties.map((a) => [a.wat, a.wie || '–', a.wanneer || '–'])) : doc.p('Nog geen acties.'))
    );
  }
</script>

<div class="po">
  <div class="tabs" role="tablist" aria-label="Stappen">
    {#each STAPPEN as s, i}
      <button role="tab" aria-selected={d.stap === i} onclick={() => (d.stap = i)}><span class="nr">{i + 1}</span>{s}</button>
    {/each}
  </div>

  {#if d.stap === 0}
    <div class="wv-kaart velden">
      <label class="wv-veld">Wat gaat er mis?<small>Concreet en zonder schuldige: wat zie je gebeuren?</small><textarea class="wv-invoer" bind:value={d.wat} placeholder="Features zijn aan het eind van het kwartaal vaak niet af"></textarea></label>
      <div class="wv-raster">
        <label class="wv-veld">Waar en wanneer?<input class="wv-invoer" bind:value={d.waar} placeholder="Bij twee van de vier teams, de laatste drie kwartalen" /></label>
        <label class="wv-veld">Wat kost het?<input class="wv-invoer" bind:value={d.kost} placeholder="Voorspelbaarheid 55%, klanten wachten langer" /></label>
      </div>
      <button class="wv-knop wv-knop--vol volgende" onclick={() => (d.stap = 1)}>Volgende: oorzaken →</button>
    </div>
  {:else if d.stap === 1}
    <div class="wv-kaart graat-kaart">
      <svg viewBox="0 0 {B} {H}" role="img" aria-label="Visgraat met {alle.length} oorzaken in {categorieen.length} categorieën">
        <path d="M30 {H / 2} H{B - 150}" class="rug" />
        <path d="M{B - 150} {H / 2 - 22} L{B - 120} {H / 2} L{B - 150} {H / 2 + 22} Z" class="kop" />
        <foreignObject x={B - 116} y={H / 2 - 45} width="112" height="90">
          <div class="probleem-tekst">{d.wat || 'Het probleem'}</div>
        </foreignObject>
        {#each categorieen as c, i}
          {@const g = graat(i, categorieen.length)}
          {@const y = g.boven ? 40 : H - 40}
          <path d="M{g.x - 50} {y} L{g.x} {H / 2}" class="graat" />
          <text x={g.x - 50} y={g.boven ? y - 12 : y + 22} text-anchor="middle" class="cat">{c}</text>
          <circle cx={g.x - 25} cy={(y + H / 2) / 2} r="13" class="teller" class:leeg={!lijst(c).length} />
          <text x={g.x - 25} y={(y + H / 2) / 2 + 4.5} text-anchor="middle" class="telgetal" class:leeg={!lijst(c).length}>{lijst(c).length}</text>
        {/each}
      </svg>
    </div>
    <div class="categorieen">
      {#each categorieen as c}
        <section class="wv-kaart cat-kaart">
          <h2>{c}</h2>
          <ul>
            {#each lijst(c) as o, i}
              <li><span>{o}</span><button class="wv-weg" onclick={() => verwijderOorzaak(c, i)} aria-label="Oorzaak verwijderen">×</button></li>
            {/each}
          </ul>
          <form class="wv-rij" onsubmit={(e) => { e.preventDefault(); voegOorzaak(c); }}>
            <input class="wv-invoer" bind:value={invoer[c]} placeholder="Oorzaak…" aria-label="Nieuwe oorzaak bij {c}" />
            <button class="wv-knop" type="submit">+</button>
          </form>
        </section>
      {/each}
    </div>
  {:else if d.stap === 2}
    <div class="wv-kaart velden">
      <label class="wv-veld">Belangrijkste oorzaak<small>Kies uit de visgraat, of schrijf hem op.</small>
        <select class="wv-invoer" bind:value={d.hoofd}>
          <option value="">Kies een oorzaak…</option>
          {#each alle as x}<option value={x.o}>{x.c}: {x.o}</option>{/each}
        </select>
      </label>
      <ol class="waarom">
        {#each d.waarom as _, i}
          <li>
            <label class="wv-veld">Waarom {i === 0 ? (d.hoofd ? `"${d.hoofd}"?` : 'gebeurt dit?') : `is dat zo?`}
              <input class="wv-invoer" bind:value={d.waarom[i]} placeholder={i === 4 ? 'Hier zit vaak de kern' : 'Omdat…'} />
            </label>
          </li>
        {/each}
      </ol>
      <button class="wv-knop wv-knop--vol volgende" onclick={() => (d.stap = 3)}>Volgende: verbeteracties →</button>
    </div>
  {:else}
    <div class="wv-kaart velden">
      {#if d.waarom.filter(Boolean).length}<p class="kern"><b>De kern:</b> {d.waarom.filter(Boolean).at(-1)}</p>{/if}
      {#each d.acties as a, i}
        <div class="actie">
          <input class="wv-invoer" bind:value={a.wat} aria-label="Actie {i + 1}" />
          <input class="wv-invoer" bind:value={a.wie} placeholder="Wie" aria-label="Wie bij actie {i + 1}" />
          <input class="wv-invoer" bind:value={a.wanneer} placeholder="Wanneer" aria-label="Wanneer bij actie {i + 1}" />
          <button class="wv-weg" onclick={() => d.acties.splice(i, 1)} aria-label="Actie {i + 1} verwijderen">×</button>
        </div>
      {/each}
      <form class="actie" onsubmit={actie}>
        <input class="wv-invoer" bind:value={nieuweActie.wat} placeholder="Nieuwe verbeteractie" aria-label="Nieuwe verbeteractie" />
        <input class="wv-invoer" bind:value={nieuweActie.wie} placeholder="Wie" aria-label="Wie" />
        <input class="wv-invoer" bind:value={nieuweActie.wanneer} placeholder="Wanneer" aria-label="Wanneer" />
        <button class="wv-knop" type="submit">+</button>
      </form>
      <p class="hulp">De acties komen op de backlog en worden gepland in de volgende PI-planning.</p>
    </div>
  {/if}
</div>

<style>
  .po {
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
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 14px 0 8px;
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
  .nr {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--chip);
    color: var(--ink);
    font-size: 12px;
    font-weight: 700;
  }
  [aria-selected='true'] .nr {
    background: var(--value);
    color: #fff;
  }
  .velden {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .volgende {
    align-self: flex-end;
  }
  .graat-kaart svg {
    display: block;
    width: 100%;
    height: auto;
    font-family: var(--font);
  }
  .rug {
    stroke: var(--line1);
    stroke-width: 5;
    stroke-linecap: round;
  }
  .kop {
    fill: var(--value);
  }
  .graat {
    stroke: var(--line2);
    stroke-width: 3;
    stroke-linecap: round;
  }
  .cat {
    font-size: 13px;
    font-weight: 700;
    fill: var(--ink);
  }
  .teller {
    fill: var(--line2);
  }
  .teller.leeg {
    fill: var(--chip);
  }
  .telgetal {
    font-size: 12.5px;
    font-weight: 800;
    fill: #fff;
  }
  .telgetal.leeg {
    fill: var(--muted);
  }
  .probleem-tekst {
    height: 90px;
    display: flex;
    align-items: center;
    font-size: 12px;
    font-weight: 700;
    line-height: 1.25;
    color: var(--ink);
    overflow: hidden;
  }
  .categorieen {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
    gap: 12px;
  }
  .cat-kaart {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .cat-kaart h2 {
    font-size: 16px;
  }
  .cat-kaart ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .cat-kaart li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 6px;
    padding: 4px 4px 4px 10px;
    border-radius: var(--radius-s);
    background: var(--bg);
    font-size: 14px;
  }
  .waarom {
    margin: 0;
    padding-left: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .waarom li {
    padding-left: 14px;
    border-left: 4px solid var(--line2);
  }
  .waarom li:last-child {
    border-left-color: var(--value);
  }
  .kern {
    margin: 0;
    padding: 12px;
    border-radius: var(--radius-s);
    background: var(--chip);
  }
  .actie {
    display: grid;
    grid-template-columns: minmax(0, 3fr) minmax(0, 1fr) minmax(0, 1fr) 40px;
    gap: 8px;
    align-items: center;
  }
  .hulp {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  @media (max-width: 700px) {
    .actie {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 40px;
    }
    .actie > :first-child {
      grid-column: 1 / -1;
    }
  }
</style>
