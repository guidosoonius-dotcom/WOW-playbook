<script>
  // Teamindeling: welke teams horen bij welke producten, met rollen en vaste specialismen. Met signalen.
  import { Bewaard, doc, leesWerkvorm } from '../../lib/werkvorm.svelte.js';
  import { uitlegById } from '../../lib/content.js';

  let { w } = $props();

  const SPECIALISMEN = (uitlegById('productteam')?.specialismen ?? []).map((s) => s.label ?? s.naam);
  const team = (naam = '') => ({ naam, producten: '', po: '', coach: '', mensen: 7, specialismen: [] });
  const start = () => ({ productgroep: '', waardestroom: '', teams: [team('Team 1'), team('Team 2')] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const lijst = (t) => t.producten.split(',').map((p) => p.trim()).filter(Boolean);
  const alleProducten = $derived(d.teams.flatMap((t) => lijst(t).map((p) => ({ p, team: t.naam }))));
  const dubbel = $derived([...new Set(alleProducten.map((x) => x.p.toLowerCase()).filter((p, i, a) => a.indexOf(p) !== i))]);
  const mensenTotaal = $derived(d.teams.reduce((s, t) => s + Number(t.mensen || 0), 0));

  function signalen(t) {
    const s = [];
    if (t.mensen < 5) s.push('Klein team: minder dan 5 mensen');
    if (t.mensen > 9) s.push('Groot team: meer dan 9 mensen; overweeg te splitsen');
    if (!t.po.trim()) s.push('Nog geen Product Owner');
    if (!t.coach.trim()) s.push('Nog geen Scrum Master');
    if (!lijst(t).length) s.push('Nog geen product');
    for (const p of lijst(t)) if (dubbel.includes(p.toLowerCase())) s.push(`"${p}" staat ook bij een ander team`);
    return s;
  }

  // Producten overnemen uit "Waardestroom in kaart" (als die al is ingevuld).
  const uitWaardestroom = leesWerkvorm('waardestroom-in-kaart');
  const kandidaten = [...new Set((uitWaardestroom?.stappen ?? []).map((s) => s.systeem?.trim()).filter(Boolean))];
  const nogNiet = $derived(kandidaten.filter((k) => !alleProducten.some((x) => x.p.toLowerCase() === k.toLowerCase())));
  function neemOver() {
    if (uitWaardestroom?.naam && !d.waardestroom) d.waardestroom = uitWaardestroom.naam;
    const t = d.teams[d.teams.length - 1];
    t.producten = [...lijst(t), ...nogNiet].join(', ');
  }
  function wisselSpec(t, s) {
    const i = t.specialismen.indexOf(s);
    if (i > -1) t.specialismen.splice(i, 1);
    else t.specialismen.push(s);
  }

  export function inhoud() {
    return (
      doc.veld('Productgroep', d.productgroep) +
      doc.veld('Waardestroom', d.waardestroom) +
      doc.p(`${d.teams.length} teams, ${mensenTotaal} mensen.`) +
      doc.tabel(
        ['Team', 'Producten', 'Product Owner', 'Scrum Master', 'Mensen', 'Vaste specialismen'],
        d.teams.map((t) => [t.naam, lijst(t).join(', ') || '–', t.po || '–', t.coach || '–', t.mensen, t.specialismen.join(', ') || '–'])
      ) +
      (d.teams.some((t) => signalen(t).length) ? doc.kop('Aandachtspunten') + doc.lijst(d.teams.flatMap((t) => signalen(t).map((s) => `${t.naam}: ${s}`))) : '')
    );
  }
</script>

<div class="indeling">
  <div class="wv-kaart kop">
    <label class="wv-veld">Productgroep<input class="wv-invoer" bind:value={d.productgroep} placeholder="Naam van de productgroep" /></label>
    <label class="wv-veld">Waardestroom<input class="wv-invoer" bind:value={d.waardestroom} placeholder="Bijvoorbeeld: Van contract tot factuur" /></label>
    <div class="totaal"><b>{d.teams.length}</b> teams · <b>{mensenTotaal}</b> mensen</div>
  </div>

  {#if nogNiet.length}
    <div class="wv-kaart overnemen">
      <span>Uit <b>Waardestroom in kaart</b>: {nogNiet.join(', ')}</span>
      <button class="wv-knop" onclick={neemOver}>Producten overnemen</button>
    </div>
  {/if}

  <div class="teams">
    {#each d.teams as t, i}
      {@const s = signalen(t)}
      <section class="wv-kaart team">
        <div class="teamkop">
          <input class="wv-invoer naam" bind:value={t.naam} aria-label="Naam van team {i + 1}" />
          <button class="wv-weg" onclick={() => d.teams.splice(i, 1)} aria-label="Team {i + 1} verwijderen">×</button>
        </div>
        <label class="wv-veld">Producten<small>Gescheiden door komma's</small><input class="wv-invoer" bind:value={t.producten} placeholder="Planningsapp, Roosterkoppeling" /></label>
        <div class="twee">
          <label class="wv-veld">Product Owner<input class="wv-invoer" bind:value={t.po} placeholder="Naam" /></label>
          <label class="wv-veld">Scrum Master<input class="wv-invoer" bind:value={t.coach} placeholder="Naam" /></label>
        </div>
        <label class="wv-veld mensen">Aantal mensen<input class="wv-invoer" type="number" min="1" max="20" bind:value={t.mensen} /></label>
        {#if SPECIALISMEN.length}
          <div class="specs">
            <span class="wv-veld">Vaste specialismen</span>
            <div class="wv-tags">
              {#each SPECIALISMEN as sp}
                <button class="wv-voorstel" class:aan={t.specialismen.includes(sp)} aria-pressed={t.specialismen.includes(sp)} onclick={() => wisselSpec(t, sp)}>{sp}</button>
              {/each}
            </div>
          </div>
        {/if}
        {#if s.length}
          <ul class="signalen">{#each s as x}<li>{x}</li>{/each}</ul>
        {:else}
          <p class="goed">✓ Team staat</p>
        {/if}
      </section>
    {/each}
  </div>
  <button class="wv-knop" onclick={() => d.teams.push(team(`Team ${d.teams.length + 1}`))}>+ Team toevoegen</button>
</div>

<style>
  .indeling {
    display: flex;
    flex-direction: column;
    gap: 14px;
    align-items: flex-start;
  }
  .indeling > * {
    align-self: stretch;
  }
  .indeling > .wv-knop {
    align-self: flex-start;
  }
  .kop {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    gap: 14px;
    align-items: end;
  }
  .totaal {
    font-size: 15px;
    padding-bottom: 10px;
  }
  .totaal b {
    font-size: 22px;
  }
  .overnemen {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    border: 1.5px dashed var(--line2);
    font-size: 14.5px;
  }
  .teams {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
    gap: 14px;
  }
  .team {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .teamkop {
    display: flex;
    gap: 8px;
  }
  .naam {
    font-weight: 700;
    font-size: 17px;
  }
  .twee {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }
  .mensen {
    max-width: 160px;
  }
  .specs {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .wv-voorstel.aan {
    background: var(--line2);
    color: #fff;
  }
  .signalen {
    margin: 0;
    padding: 10px 12px 10px 28px;
    border-radius: var(--radius-s);
    background: #fbeceb;
    color: #8e1a12;
    font-size: 13.5px;
  }
  .goed {
    margin: 0;
    color: #2e9e5b;
    font-weight: 700;
    font-size: 14px;
  }
  @media (max-width: 700px) {
    .kop {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
