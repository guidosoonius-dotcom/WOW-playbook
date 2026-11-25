<script>
  // Idee Project Kaart: een idee zo vastleggen dat de portfolio-intake het kan beoordelen.
  // De velden volgen de spelregels: eigenaar, probleem of kans, doel, doelgroep en verwacht resultaat,
  // plus de toets op strategische fit, waarde, synergie en IT- of data-impact.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';
  import { href } from '../../lib/router.svelte.js';

  let { w } = $props();

  const start = () => ({
    naam: '', eigenaar: '', probleem: '', doelgroep: '', doel: '', resultaat: '', meten: '',
    fit: '', synergie: '', impact: '', impactTekst: '', richting: '', runEigenaar: '', batenEigenaar: ''
  });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const IMPACT = [
    ['geen', 'Geen of beperkt'],
    ['middel', 'Gemiddeld'],
    ['groot', 'Groot'],
    ['onbekend', 'Weet ik niet']
  ];
  const RICHTING = [
    ['vast', 'Vast team'],
    ['project', 'Project'],
    ['onbekend', 'Nog niet duidelijk']
  ];

  const checks = $derived([
    { ok: !!d.eigenaar.trim(), tekst: 'Het initiatief heeft een eigenaar' },
    { ok: !!d.probleem.trim(), tekst: 'Het probleem of de kans is duidelijk' },
    { ok: !!d.doelgroep.trim() && !!d.doel.trim(), tekst: 'Doelgroep en doel staan erin' },
    { ok: !!d.resultaat.trim(), tekst: 'Het verwachte resultaat en de waarde staan erin' },
    { ok: !!d.fit.trim(), tekst: 'De aansluiting op de strategie is beschreven' }
  ]);
  const klaar = $derived(checks.every((c) => c.ok));
  const label = (lijst, v) => lijst.find(([k]) => k === v)?.[1] ?? '';

  export function inhoud() {
    const ingevuld = Object.entries(d).some(([, v]) => String(v).trim());
    if (!ingevuld) return doc.p('Nog niets ingevuld.');
    return (
      doc.kop(d.naam || 'Idee Project Kaart') +
      doc.veld('Eigenaar', d.eigenaar) +
      doc.veld('Probleem of kans', d.probleem) +
      doc.veld('Doelgroep', d.doelgroep) +
      doc.veld('Doel en gewenste uitkomst', d.doel) +
      doc.veld('Verwacht resultaat en waarde', d.resultaat) +
      doc.veld('Zo meten we het', d.meten) +
      doc.veld('Aansluiting op de strategie', d.fit) +
      doc.veld('Synergie met andere initiatieven', d.synergie) +
      doc.veld('IT- of data-impact', [label(IMPACT, d.impact), d.impactTekst].filter(Boolean).join('. ')) +
      doc.veld('Eerste richting', label(RICHTING, d.richting)) +
      doc.veld('Eigenaar van de run erna', d.runEigenaar) +
      doc.veld('Eigenaar van de baten', d.batenEigenaar)
    );
  }
</script>

<div class="ipk">
  <div class="links wv-kaart velden">
    <div class="twee">
      <label class="wv-veld">Naam van het initiatief<input class="wv-invoer" bind:value={d.naam} placeholder="Bijvoorbeeld: Roosterruil in een app" /></label>
      <label class="wv-veld">Eigenaar<small>Wie is eigenaar van dit vraagstuk?</small><input class="wv-invoer" bind:value={d.eigenaar} placeholder="Naam en functie" /></label>
    </div>
    <label class="wv-veld">Wat is het probleem, of de kans?<textarea class="wv-invoer" bind:value={d.probleem} placeholder="Planners krijgen elke dag telefoontjes om diensten te ruilen."></textarea></label>
    <div class="twee">
      <label class="wv-veld">Voor wie?<input class="wv-invoer" bind:value={d.doelgroep} placeholder="Medewerkers en planners op locatie" /></label>
      <label class="wv-veld">Wat is het doel?<input class="wv-invoer" bind:value={d.doel} placeholder="Ruilen kan zonder tussenkomst van de planner" /></label>
    </div>
    <label class="wv-veld">Verwacht resultaat en waarde<textarea class="wv-invoer" bind:value={d.resultaat} placeholder="Minder uren planning, minder ziekteverzuim door overbelasting, tevredener medewerkers."></textarea></label>
    <label class="wv-veld">Zo meten we het<input class="wv-invoer" bind:value={d.meten} placeholder="Aantal ruilverzoeken per week via de planner" /></label>
    <label class="wv-veld">Past het bij de strategie?<small>Welk strategisch thema of welke doelstelling?</small><textarea class="wv-invoer" bind:value={d.fit}></textarea></label>
    <label class="wv-veld">Synergie met andere initiatieven<small>Loopt er al iets dat hierop lijkt of ermee samenhangt?</small><textarea class="wv-invoer" bind:value={d.synergie}></textarea></label>
    <fieldset class="keuze">
      <legend class="wv-veld">Hoe groot is de IT- of data-impact?</legend>
      <div class="opties">
        {#each IMPACT as [k, t]}
          <button type="button" class="optie" class:aan={d.impact === k} aria-pressed={d.impact === k} onclick={() => (d.impact = k)}>{t}</button>
        {/each}
      </div>
      <input class="wv-invoer" bind:value={d.impactTekst} placeholder="Toelichting (optioneel)" aria-label="Toelichting op de impact" />
    </fieldset>
    <fieldset class="keuze">
      <legend class="wv-veld">Eerste richting <a href={href('manieren/keuzehulp')}>Doe de keuzehulp</a></legend>
      <div class="opties">
        {#each RICHTING as [k, t]}
          <button type="button" class="optie" class:aan={d.richting === k} aria-pressed={d.richting === k} onclick={() => (d.richting = k)}>{t}</button>
        {/each}
      </div>
      <small>Het portfolio bepaalt na de intake de route.</small>
    </fieldset>
    <div class="twee">
      <label class="wv-veld">Wie draait het erna?<small>Het team of de afdeling die het beheert.</small><input class="wv-invoer" bind:value={d.runEigenaar} /></label>
      <label class="wv-veld">Wie bewaakt de baten?<small>Meestal de Business Owner.</small><input class="wv-invoer" bind:value={d.batenEigenaar} /></label>
    </div>
  </div>

  <aside class="rechts">
    <div class="kaartje" class:klaar>
      <span class="label">{klaar ? 'Klaar voor de intake' : 'Nog niet klaar'}</span>
      <strong>{d.naam || 'Idee Project Kaart'}</strong>
      {#if d.eigenaar}<small>Eigenaar: {d.eigenaar}</small>{/if}
      <p>{d.probleem || 'Wat is het probleem, of de kans?'}</p>
    </div>
    <ul class="checks" aria-label="Checks">
      {#each checks as c}<li class:ok={c.ok}><span aria-hidden="true">{c.ok ? '✓' : '○'}</span>{c.tekst}</li>{/each}
    </ul>
  </aside>
</div>

<style>
  .ipk {
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
    .ipk,
    .twee {
      grid-template-columns: minmax(0, 1fr);
    }
    .rechts {
      position: static;
    }
  }
  .keuze {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .keuze legend {
    display: flex;
    gap: 14px;
    align-items: baseline;
  }
  .keuze legend a {
    font-size: 13px;
    font-weight: 600;
  }
  .opties {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .optie {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid var(--muted);
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .optie.aan {
    background: var(--line1);
    border-color: var(--line1);
    color: var(--on-line1);
  }
</style>
