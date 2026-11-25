<script>
  // Plan van Aanpak (tolpoort T2, fase Definitie): het project concreet voorbereiden met scope, planning, governance,
  // capaciteit, risico's en verantwoordelijkheden. De Business Case staat apart.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const start = () => ({
    naam: '', doel: '', scope: '', buiten: '', aanpak: '',
    mijlpalen: [{ naam: '', periode: '' }],
    opdrachtgever: '', stuurgroep: '', projectmanager: '',
    capaciteit: [{ rol: '', aantal: '', periode: '' }],
    risicos: [{ risico: '', maatregel: '', eigenaar: '' }],
    afhankelijkheden: '', baten: '', meten: '', runEigenaar: '', overdracht: ''
  });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const checks = $derived([
    { ok: !!d.doel.trim() && !!d.scope.trim(), tekst: 'Doel en scope staan erin' },
    { ok: !!d.buiten.trim(), tekst: 'Wat buiten de scope valt is benoemd' },
    { ok: d.mijlpalen.filter((m) => m.naam.trim()).length >= 2, tekst: 'Er zijn minstens twee mijlpalen' },
    { ok: !!d.opdrachtgever.trim() && !!d.stuurgroep.trim() && !!d.projectmanager.trim(), tekst: 'De governance is ingevuld' },
    { ok: d.capaciteit.some((c) => c.rol.trim() && c.aantal.trim()), tekst: 'De benodigde capaciteit staat erin' },
    { ok: d.risicos.some((r) => r.risico.trim() && r.maatregel.trim()), tekst: "Minstens één risico heeft een maatregel" },
    { ok: !!d.runEigenaar.trim() && !!d.baten.trim(), tekst: 'De overdracht en de baten hebben een eigenaar' }
  ]);
  const klaar = $derived(checks.every((c) => c.ok));

  export function inhoud() {
    const leeg = !Object.entries(d).some(([, v]) => (Array.isArray(v) ? v.some((x) => (typeof x === 'object' ? Object.values(x).some(Boolean) : x)) : String(v).trim()));
    if (leeg) return doc.p('Nog niets ingevuld.');
    return (
      doc.kop(d.naam || 'Plan van Aanpak') +
      doc.veld('Doel', d.doel) +
      doc.veld('Binnen de scope', d.scope) +
      doc.veld('Buiten de scope', d.buiten) +
      doc.veld('Aanpak', d.aanpak) +
      '<h3>Planning</h3>' + doc.tabel(['Mijlpaal', 'Periode'], d.mijlpalen.filter((m) => m.naam || m.periode).map((m) => [m.naam, m.periode])) +
      '<h3>Governance</h3>' +
      doc.veld('Opdrachtgever', d.opdrachtgever) +
      doc.veld('Stuurgroep', d.stuurgroep) +
      doc.veld('Projectmanager', d.projectmanager) +
      '<h3>Capaciteit</h3>' + doc.tabel(['Rol of team', 'Aantal', 'Periode'], d.capaciteit.filter((c) => c.rol || c.aantal).map((c) => [c.rol, c.aantal, c.periode])) +
      "<h3>Risico's</h3>" + doc.tabel(['Risico', 'Maatregel', 'Eigenaar'], d.risicos.filter((r) => r.risico || r.maatregel).map((r) => [r.risico, r.maatregel, r.eigenaar])) +
      doc.veld('Afhankelijkheden', d.afhankelijkheden) +
      doc.veld('Baten', d.baten) +
      doc.veld('Zo meten we de baten', d.meten) +
      doc.veld('Eigenaar van de run erna', d.runEigenaar) +
      doc.veld('Overdracht', d.overdracht)
    );
  }
</script>

<div class="kaart-form">
  <div class="links wv-kaart velden">
    <label class="wv-veld">Naam van het project<input class="wv-invoer" bind:value={d.naam} /></label>
    <label class="wv-veld">Doel<small>Welk resultaat levert het project op, en voor wie?</small><textarea class="wv-invoer" bind:value={d.doel}></textarea></label>
    <div class="twee">
      <label class="wv-veld">Binnen de scope<textarea class="wv-invoer" bind:value={d.scope}></textarea></label>
      <label class="wv-veld">Buiten de scope<textarea class="wv-invoer" bind:value={d.buiten}></textarea></label>
    </div>
    <label class="wv-veld">Aanpak<small>Hoe pak je het aan, en in welke stappen?</small><textarea class="wv-invoer" bind:value={d.aanpak}></textarea></label>

    <fieldset class="lijst">
      <legend class="wv-veld">Planning</legend>
      {#each d.mijlpalen as m, i}
        <div class="wv-rij"><input class="wv-invoer" bind:value={m.naam} placeholder="Mijlpaal {i + 1}" aria-label="Mijlpaal {i + 1}" /><input class="wv-invoer" bind:value={m.periode} placeholder="Periode" aria-label="Periode van mijlpaal {i + 1}" /><button class="wv-weg" onclick={() => d.mijlpalen.splice(i, 1)} aria-label="Mijlpaal {i + 1} verwijderen">×</button></div>
      {/each}
      <button class="wv-knop wv-knop--link" onclick={() => d.mijlpalen.push({ naam: '', periode: '' })}>+ Mijlpaal toevoegen</button>
    </fieldset>

    <div class="drie">
      <label class="wv-veld">Opdrachtgever<input class="wv-invoer" bind:value={d.opdrachtgever} /></label>
      <label class="wv-veld">Stuurgroep<input class="wv-invoer" bind:value={d.stuurgroep} /></label>
      <label class="wv-veld">Projectmanager<input class="wv-invoer" bind:value={d.projectmanager} /></label>
    </div>

    <fieldset class="lijst">
      <legend class="wv-veld">Capaciteit</legend>
      {#each d.capaciteit as c, i}
        <div class="wv-rij"><input class="wv-invoer" bind:value={c.rol} placeholder="Rol of team" aria-label="Rol of team {i + 1}" /><input class="wv-invoer" bind:value={c.aantal} placeholder="Aantal of fte" aria-label="Aantal bij regel {i + 1}" /><input class="wv-invoer" bind:value={c.periode} placeholder="Periode" aria-label="Periode bij regel {i + 1}" /><button class="wv-weg" onclick={() => d.capaciteit.splice(i, 1)} aria-label="Regel {i + 1} verwijderen">×</button></div>
      {/each}
      <button class="wv-knop wv-knop--link" onclick={() => d.capaciteit.push({ rol: '', aantal: '', periode: '' })}>+ Regel toevoegen</button>
    </fieldset>

    <fieldset class="lijst">
      <legend class="wv-veld">Risico's</legend>
      {#each d.risicos as r, i}
        <div class="wv-rij"><input class="wv-invoer" bind:value={r.risico} placeholder="Risico" aria-label="Risico {i + 1}" /><input class="wv-invoer" bind:value={r.maatregel} placeholder="Maatregel" aria-label="Maatregel bij risico {i + 1}" /><input class="wv-invoer" bind:value={r.eigenaar} placeholder="Eigenaar" aria-label="Eigenaar van risico {i + 1}" /><button class="wv-weg" onclick={() => d.risicos.splice(i, 1)} aria-label="Risico {i + 1} verwijderen">×</button></div>
      {/each}
      <button class="wv-knop wv-knop--link" onclick={() => d.risicos.push({ risico: '', maatregel: '', eigenaar: '' })}>+ Risico toevoegen</button>
    </fieldset>

    <label class="wv-veld">Afhankelijkheden<small>Welke vaste teams leveren werk? Dat staat als epic of feature in hun backlog.</small><textarea class="wv-invoer" bind:value={d.afhankelijkheden}></textarea></label>
    <div class="twee">
      <label class="wv-veld">Baten<textarea class="wv-invoer" bind:value={d.baten}></textarea></label>
      <label class="wv-veld">Zo meten we de baten<textarea class="wv-invoer" bind:value={d.meten}></textarea></label>
    </div>
    <div class="twee">
      <label class="wv-veld">Wie draait het erna?<input class="wv-invoer" bind:value={d.runEigenaar} /></label>
      <label class="wv-veld">Hoe verloopt de overdracht?<small>Bij tolpoort T4.</small><input class="wv-invoer" bind:value={d.overdracht} /></label>
    </div>
  </div>

  <aside class="rechts">
    <div class="kaartje" class:klaar>
      <span class="label">{klaar ? 'Klaar voor tolpoort T2' : 'Nog niet klaar'}</span>
      <strong>{d.naam || 'Plan van Aanpak'}</strong>
      {#if d.projectmanager}<small>Projectmanager: {d.projectmanager}</small>{/if}
      <p>{d.doel || 'Wat is het doel van het project?'}</p>
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
  .drie {
    display: grid;
    grid-template-columns: 1.4fr 1fr 1fr;
    gap: 8px;
    align-items: center;
  }
  .lijst {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  @media (max-width: 900px) {
    .drie {
      grid-template-columns: minmax(0, 1fr);
      padding-bottom: 8px;
      border-bottom: 1px solid var(--border);
    }
  }
</style>
