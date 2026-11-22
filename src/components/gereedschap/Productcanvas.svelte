<script>
  // Productcanvas: een product op één pagina.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const SOORTEN = ['Zelf gebouwd', 'Gekocht en ingericht', 'Gedeeld platform'];
  const VAKKEN = [
    { id: 'visie', titel: 'Productvisie', hulp: 'Voor wie, welk probleem, en waarom dit product?', breed: true },
    { id: 'gebruikers', titel: 'Gebruikers', hulp: 'Wie werken ermee, en hoeveel?' },
    { id: 'probleem', titel: 'Probleem', hulp: 'Wat lost het op voor die gebruikers?' },
    { id: 'waarde', titel: 'Waarde en meten', hulp: 'Waaraan zie je dat het werkt?' },
    { id: 'kern', titel: 'Wat het doet', hulp: 'De belangrijkste functies, in een paar woorden' },
    { id: 'koppelingen', titel: 'Koppelingen', hulp: 'Met welke systemen praat het?' },
    { id: 'leverancier', titel: 'Leverancier en contract', hulp: 'Wie levert het, en welke afspraken?' },
    { id: 'beheer', titel: 'Beheer', hulp: 'Wie lost storingen op, en hoe snel?' },
    { id: 'kosten', titel: 'Kosten', hulp: 'Licenties, team, hosting: ruwe schatting' }
  ];
  const start = () => ({ naam: '', soort: 'Zelf gebouwd', team: '', po: '', ...Object.fromEntries(VAKKEN.map((v) => [v.id, ''])) });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  const gevuld = $derived(VAKKEN.filter((v) => d[v.id].trim()).length);

  export function inhoud() {
    return (
      doc.veld('Product', d.naam) +
      doc.veld('Soort', d.soort) +
      doc.veld('Team', d.team) +
      doc.veld('Product Owner', d.po) +
      VAKKEN.map((v) => doc.kop(v.titel) + (doc.p(d[v.id]) || '<p class="leeg">Nog niet ingevuld.</p>')).join('')
    );
  }
</script>

<div class="canvas-wrap">
  <div class="wv-kaart kop">
    <label class="wv-veld">Product<input class="wv-invoer naam" bind:value={d.naam} placeholder="Naam van het product" /></label>
    <div class="wv-veld">
      Soort product
      <div class="wv-segment" role="radiogroup" aria-label="Soort product">
        {#each SOORTEN as s}<button role="radio" aria-checked={d.soort === s} onclick={() => (d.soort = s)}>{s}</button>{/each}
      </div>
    </div>
    <label class="wv-veld">Team<input class="wv-invoer" bind:value={d.team} placeholder="Naam van het team" /></label>
    <label class="wv-veld">Product Owner<input class="wv-invoer" bind:value={d.po} placeholder="Naam" /></label>
  </div>

  <p class="voortgang">{gevuld} van {VAKKEN.length} vakken ingevuld</p>

  <div class="canvas">
    {#each VAKKEN as v}
      <label class="vak" class:breed={v.breed} class:gevuld={d[v.id].trim()}>
        <span class="titel">{v.titel}</span>
        <span class="hulp">{v.hulp}</span>
        <textarea bind:value={d[v.id]} aria-label={v.titel}></textarea>
      </label>
    {/each}
  </div>
</div>

<style>
  .canvas-wrap {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .kop {
    display: grid;
    grid-template-columns: minmax(0, 1.2fr) auto minmax(0, 1fr) minmax(0, 1fr);
    gap: 14px;
    align-items: end;
  }
  .naam {
    font-weight: 700;
  }
  .voortgang {
    margin: 0;
    font-size: 14px;
    color: var(--muted);
  }
  .canvas {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 10px;
  }
  .vak {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 14px;
    border-radius: var(--radius-m);
    background: var(--surface);
    border: 1.5px dashed var(--track);
    min-height: 150px;
  }
  .vak.gevuld {
    border-style: solid;
    border-color: var(--border);
  }
  .vak.breed {
    grid-column: span 4;
    min-height: 0;
  }
  .titel {
    font-weight: 700;
    font-size: 15px;
  }
  .hulp {
    font-size: 12.5px;
    color: var(--muted);
  }
  textarea {
    flex: 1;
    min-height: 80px;
    margin-top: 4px;
    border: 0;
    border-radius: var(--radius-s);
    background: var(--bg);
    color: var(--ink);
    font: inherit;
    font-size: 14.5px;
    padding: 8px 10px;
    resize: vertical;
  }
  .breed textarea {
    min-height: 54px;
  }
  textarea:focus {
    outline: 2px solid var(--line2);
  }
  @media (max-width: 1000px) {
    .kop {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
    .canvas {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .vak.breed {
      grid-column: span 2;
    }
  }
  @media (max-width: 560px) {
    .kop,
    .canvas {
      grid-template-columns: minmax(0, 1fr);
    }
    .vak.breed {
      grid-column: auto;
    }
  }
</style>
