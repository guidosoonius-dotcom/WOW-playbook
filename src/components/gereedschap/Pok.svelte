<script>
  // Project Opdracht Kaart (tolpoort T1, fase Analyse): het goedgekeurde idee uitwerken met haalbaarheid, oplossing,
  // impact, prioriteit en een eerste investeringsinschatting.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const start = () => ({
    naam: '', opdrachtgever: '', uitgangspunt: '', haalbaar: '', haalbaarTekst: '', oplossing: '',
    impactMensen: '', impactIT: '', prioriteit: '', investering: '', investeringTekst: '', risicos: [''],
    besluit: '', runEigenaar: '', batenEigenaar: ''
  });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const HAALBAAR = [['ja', 'Haalbaar'], ['deels', 'Deels haalbaar'], ['nee', 'Niet haalbaar'], ['onbekend', 'Nog onbekend']];
  const BESLUIT = [['door', 'Door naar definitie'], ['bij', 'Bijstellen'], ['stop', 'Stoppen']];
  const label = (lijst, v) => lijst.find(([k]) => k === v)?.[1] ?? '';

  const checks = $derived([
    { ok: !!d.uitgangspunt.trim(), tekst: 'Het goedgekeurde idee is samengevat' },
    { ok: !!d.haalbaar && d.haalbaar !== 'onbekend', tekst: 'De haalbaarheid is beoordeeld' },
    { ok: !!d.oplossing.trim(), tekst: 'De oplossingsrichting is beschreven' },
    { ok: !!d.impactMensen.trim() || !!d.impactIT.trim(), tekst: 'De impact is beschreven' },
    { ok: !!d.prioriteit.trim(), tekst: 'De prioriteit is onderbouwd' },
    { ok: !!d.investering.trim(), tekst: 'Er is een eerste investeringsinschatting' },
    { ok: !!d.runEigenaar.trim() && !!d.batenEigenaar.trim(), tekst: 'De eigenaar van de run en van de baten staan erin' }
  ]);
  const klaar = $derived(checks.every((c) => c.ok));

  export function inhoud() {
    if (!Object.entries(d).some(([, v]) => (Array.isArray(v) ? v.some(Boolean) : String(v).trim()))) return doc.p('Nog niets ingevuld.');
    return (
      doc.kop(d.naam || 'Project Opdracht Kaart') +
      doc.veld('Opdrachtgever', d.opdrachtgever) +
      doc.veld('Het goedgekeurde idee', d.uitgangspunt) +
      doc.veld('Haalbaarheid', [label(HAALBAAR, d.haalbaar), d.haalbaarTekst].filter(Boolean).join('. ')) +
      doc.veld('Oplossingsrichting', d.oplossing) +
      doc.veld('Impact op gebruikers en organisatie', d.impactMensen) +
      doc.veld('Impact op IT en data', d.impactIT) +
      doc.veld('Prioriteit', d.prioriteit) +
      doc.veld('Eerste investeringsinschatting', [d.investering, d.investeringTekst].filter(Boolean).join('. ')) +
      '<h3>Risico\'s</h3>' + doc.lijst(d.risicos) +
      doc.veld('Eigenaar van de run erna', d.runEigenaar) +
      doc.veld('Eigenaar van de baten', d.batenEigenaar) +
      doc.veld('Gevraagd besluit (T1)', label(BESLUIT, d.besluit))
    );
  }
</script>

<div class="kaart-form">
  <div class="links wv-kaart velden">
    <div class="twee">
      <label class="wv-veld">Naam van het project<input class="wv-invoer" bind:value={d.naam} /></label>
      <label class="wv-veld">Opdrachtgever<small>Meestal de Business Owner.</small><input class="wv-invoer" bind:value={d.opdrachtgever} /></label>
    </div>
    <label class="wv-veld">Het goedgekeurde idee<small>Kort: probleem of kans, doelgroep en doel uit de Idee Project Kaart.</small><textarea class="wv-invoer" bind:value={d.uitgangspunt}></textarea></label>
    <fieldset class="keuze">
      <legend class="wv-veld">Is het haalbaar?</legend>
      <div class="opties">
        {#each HAALBAAR as [k, t]}<button type="button" class="optie" class:aan={d.haalbaar === k} aria-pressed={d.haalbaar === k} onclick={() => (d.haalbaar = k)}>{t}</button>{/each}
      </div>
      <input class="wv-invoer" bind:value={d.haalbaarTekst} placeholder="Toelichting (optioneel)" aria-label="Toelichting op de haalbaarheid" />
    </fieldset>
    <label class="wv-veld">Oplossingsrichting<textarea class="wv-invoer" bind:value={d.oplossing}></textarea></label>
    <div class="twee">
      <label class="wv-veld">Impact op gebruikers en organisatie<textarea class="wv-invoer" bind:value={d.impactMensen}></textarea></label>
      <label class="wv-veld">Impact op IT en data<textarea class="wv-invoer" bind:value={d.impactIT}></textarea></label>
    </div>
    <label class="wv-veld">Prioriteit<small>Waarom nu, en tegenover welk ander werk?</small><textarea class="wv-invoer" bind:value={d.prioriteit}></textarea></label>
    <div class="twee">
      <label class="wv-veld">Eerste investeringsinschatting<small>Een bedrag of een bandbreedte.</small><input class="wv-invoer" bind:value={d.investering} /></label>
      <label class="wv-veld">Waar is dat op gebaseerd?<input class="wv-invoer" bind:value={d.investeringTekst} /></label>
    </div>
    <fieldset class="lijst">
      <legend class="wv-veld">Risico's</legend>
      {#each d.risicos as r, i}
        <div class="wv-rij"><input class="wv-invoer" bind:value={d.risicos[i]} placeholder="Risico {i + 1}" aria-label="Risico {i + 1}" /><button class="wv-weg" onclick={() => d.risicos.splice(i, 1)} aria-label="Risico {i + 1} verwijderen">×</button></div>
      {/each}
      <button class="wv-knop wv-knop--link" onclick={() => d.risicos.push('')}>+ Risico toevoegen</button>
    </fieldset>
    <div class="twee">
      <label class="wv-veld">Wie draait het erna?<input class="wv-invoer" bind:value={d.runEigenaar} /></label>
      <label class="wv-veld">Wie bewaakt de baten?<input class="wv-invoer" bind:value={d.batenEigenaar} /></label>
    </div>
    <fieldset class="keuze">
      <legend class="wv-veld">Gevraagd besluit bij tolpoort T1</legend>
      <div class="opties">
        {#each BESLUIT as [k, t]}<button type="button" class="optie" class:aan={d.besluit === k} aria-pressed={d.besluit === k} onclick={() => (d.besluit = k)}>{t}</button>{/each}
      </div>
    </fieldset>
  </div>

  <aside class="rechts">
    <div class="kaartje" class:klaar>
      <span class="label">{klaar ? 'Klaar voor tolpoort T1' : 'Nog niet klaar'}</span>
      <strong>{d.naam || 'Project Opdracht Kaart'}</strong>
      {#if d.opdrachtgever}<small>Opdrachtgever: {d.opdrachtgever}</small>{/if}
      <p>{d.oplossing || 'Wat is de oplossingsrichting?'}</p>
    </div>
    <ul class="checks" aria-label="Checks">
      {#each checks as c}<li class:ok={c.ok}><span aria-hidden="true">{c.ok ? '✓' : '○'}</span>{c.tekst}</li>{/each}
    </ul>
  </aside>
</div>

<style>
  .kaart-form {
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
    .kaart-form,
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
  .lijst {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
</style>
