<script>
  // Capaciteit en PI-doelen: capaciteit per team, PI-doelen met businesswaarde en voorspelbaarheid achteraf.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const doel = () => ({ wat: '', waarde: 5, stretch: false, gehaald: '' });
  const team = (naam = '') => ({ naam, mensen: 6, dagen: 40, beheer: 20, doelen: [doel(), doel()] });
  const start = () => ({ teams: [team('Team 1')] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const beschikbaar = (t) => Math.round(t.mensen * t.dagen * (1 - t.beheer / 100));
  const planbaar = (t) => Math.round(beschikbaar(t) * 0.8);
  const toegezegd = (t) => t.doelen.filter((x) => x.wat.trim() && !x.stretch);
  const gepland = (t) => toegezegd(t).reduce((s, x) => s + Number(x.waarde || 0), 0);
  const gehaald = (t) => t.doelen.filter((x) => x.wat.trim()).reduce((s, x) => s + Number(x.gehaald || 0), 0);
  const ingevuldGehaald = (t) => t.doelen.some((x) => x.gehaald !== '' && x.gehaald !== null);
  const voorspelbaar = (t) => (gepland(t) ? Math.round((gehaald(t) / gepland(t)) * 100) : null);
  const totaal = $derived.by(() => {
    const g = d.teams.reduce((s, t) => s + gepland(t), 0);
    const h = d.teams.reduce((s, t) => s + gehaald(t), 0);
    return g && d.teams.some(ingevuldGehaald) ? Math.round((h / g) * 100) : null;
  });
  const oordeel = (p) => (p === null ? '' : p >= 80 && p <= 100 ? 'gezond' : p > 100 ? 'boven verwachting' : 'onder 80%');

  export function inhoud() {
    let html = '';
    for (const t of d.teams) {
      html +=
        doc.kop(t.naam || 'Team') +
        doc.p(`${t.mensen} mensen × ${t.dagen} dagen, ${t.beheer}% voor beheer: ${beschikbaar(t)} dagen beschikbaar, waarvan ${planbaar(t)} dagen planbaar (80%).`) +
        doc.tabel(['PI-doel', 'Soort', 'Businesswaarde gepland', 'Gehaald'], t.doelen.filter((x) => x.wat.trim()).map((x) => [x.wat, x.stretch ? 'Stretch' : 'Toegezegd', x.waarde, x.gehaald || '–'])) +
        (voorspelbaar(t) !== null && ingevuldGehaald(t) ? doc.p(`Voorspelbaarheid: ${voorspelbaar(t)}% (${oordeel(voorspelbaar(t))}).`) : '');
    }
    if (totaal !== null) html += doc.kop('Productgroep') + doc.p(`Voorspelbaarheid van de productgroep: ${totaal}%.`);
    return html;
  }
</script>

<div class="cap">
  {#each d.teams as t, ti}
    <section class="wv-kaart team">
      <div class="teamkop">
        <input class="wv-invoer naam" bind:value={t.naam} aria-label="Naam van team {ti + 1}" />
        {#if d.teams.length > 1}<button class="wv-knop wv-knop--link" onclick={() => d.teams.splice(ti, 1)}>Team verwijderen</button>{/if}
      </div>

      <div class="capaciteit">
        <label class="wv-veld">Mensen<input class="wv-invoer" type="number" min="1" bind:value={t.mensen} /></label>
        <label class="wv-veld">Dagen per persoon<small>in het kwartaal, na vakantie</small><input class="wv-invoer" type="number" min="0" bind:value={t.dagen} /></label>
        <label class="wv-veld">Beheer en storingen<small>percentage</small><input class="wv-invoer" type="number" min="0" max="80" bind:value={t.beheer} /></label>
        <div class="uitkomst">
          <span><b>{beschikbaar(t)}</b> dagen beschikbaar</span>
          <span class="plan"><b>{planbaar(t)}</b> dagen planbaar (80%)</span>
        </div>
      </div>

      <div class="wv-tabel-wrap">
        <table class="wv-tabel">
          <thead><tr><th>PI-doel</th><th>Stretch</th><th>Businesswaarde (1-10)</th><th>Gehaald (na het kwartaal)</th><th><span class="sr-only">Verwijderen</span></th></tr></thead>
          <tbody>
            {#each t.doelen as x, i}
              <tr>
                <td class="wat"><input class="wv-invoer" bind:value={x.wat} placeholder="Wat levert het team op, in woorden van de business?" aria-label="PI-doel {i + 1}" /></td>
                <td class="midden"><input type="checkbox" bind:checked={x.stretch} aria-label="PI-doel {i + 1} is een stretchdoel" /></td>
                <td><input class="wv-invoer getal" type="number" min="1" max="10" bind:value={x.waarde} aria-label="Businesswaarde van doel {i + 1}" /></td>
                <td><input class="wv-invoer getal" type="number" min="0" max="10" bind:value={x.gehaald} placeholder="–" aria-label="Gehaalde waarde van doel {i + 1}" /></td>
                <td><button class="wv-weg" onclick={() => t.doelen.splice(i, 1)} aria-label="Doel {i + 1} verwijderen">×</button></td>
              </tr>
            {/each}
          </tbody>
        </table>
        <div class="voet">
          <button class="wv-knop wv-knop--link" onclick={() => t.doelen.push(doel())}>+ PI-doel toevoegen</button>
          <span>Gepland (toegezegd): <b>{gepland(t)}</b>{#if ingevuldGehaald(t)} · gehaald: <b>{gehaald(t)}</b> · voorspelbaarheid <b class="pct pct--{oordeel(voorspelbaar(t)).replace(/[^a-z]/g, '')}">{voorspelbaar(t)}%</b>{/if}</span>
        </div>
      </div>
    </section>
  {/each}

  <div class="onder">
    <button class="wv-knop" onclick={() => d.teams.push(team(`Team ${d.teams.length + 1}`))}>+ Team toevoegen</button>
    {#if totaal !== null}<p class="totaal">Voorspelbaarheid van de productgroep: <b>{totaal}%</b> ({oordeel(totaal)})</p>{/if}
  </div>
</div>

<style>
  .cap {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .team {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .teamkop {
    display: flex;
    gap: 12px;
    align-items: center;
  }
  .naam {
    max-width: 360px;
    font-weight: 700;
    font-size: 18px;
  }
  .capaciteit {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr)) minmax(0, 1.4fr);
    gap: 12px;
    align-items: end;
  }
  .uitkomst {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 10px 14px;
    border-radius: var(--radius-s);
    background: var(--chip);
    font-size: 14px;
  }
  .uitkomst b {
    font-size: 20px;
  }
  .plan b {
    color: var(--value-text);
  }
  .wat {
    min-width: 280px;
  }
  .midden {
    text-align: center;
  }
  .midden input {
    width: 18px;
    height: 18px;
    accent-color: var(--line1);
  }
  .getal {
    max-width: 90px;
  }
  .voet {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 12px 10px;
    font-size: 14px;
  }
  .pct--gezond {
    color: #2e9e5b;
  }
  .pct--onder {
    color: var(--value-text);
  }
  .onder {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }
  .totaal {
    margin: 0;
    font-size: 16px;
  }
  @media (max-width: 760px) {
    .capaciteit {
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    }
  }
</style>
