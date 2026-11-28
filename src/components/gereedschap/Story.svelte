<script>
  // Een goede story: als … wil ik … zodat …, met acceptatiecriteria en checks.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const nieuw = () => ({ titel: '', als: '', wil: '', zodat: '', criteria: [''], klein: false, toetsbaar: false });
  const start = () => ({ stories: [nieuw()], actief: 0 });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  const s = $derived(d.stories[d.actief] ?? d.stories[0]);

  const checks = $derived([
    { ok: !!s.als.trim(), tekst: 'Er staat voor wie het is' },
    { ok: !!s.zodat.trim(), tekst: 'Er staat waarom: de waarde voor de gebruiker' },
    { ok: s.criteria.filter((c) => c.trim()).length >= 2, tekst: 'Er zijn minstens twee acceptatiecriteria' },
    { ok: s.klein, tekst: 'Past in één iteratie (anders: opknippen)' },
    { ok: s.toetsbaar, tekst: 'Elk criterium is te testen' }
  ]);
  const klaar = $derived(checks.every((c) => c.ok));
  const zin = (st) => `Als ${st.als || '…'}, wil ik ${st.wil || '…'}, zodat ${st.zodat || '…'}.`;

  function toevoegen() {
    d.stories.push(nieuw());
    d.actief = d.stories.length - 1;
  }
  function verwijder(i) {
    d.stories.splice(i, 1);
    if (!d.stories.length) d.stories.push(nieuw());
    d.actief = Math.min(d.actief, d.stories.length - 1);
  }
  export function inhoud() {
    return d.stories
      .filter((st) => st.als || st.wil || st.zodat || st.titel)
      .map((st, i) => doc.kop(st.titel || `Story ${i + 1}`) + doc.p(zin(st)) + '<h3>Acceptatiecriteria</h3>' + doc.lijst(st.criteria))
      .join('') || doc.p('Nog geen story ingevuld.');
  }
</script>

<div class="story">
  <div class="links">
    {#if d.stories.length > 1 || s.titel}
      <div class="wv-tags lijst" role="tablist" aria-label="Stories">
        {#each d.stories as st, i}
          <button class="wv-voorstel" class:actief={i === d.actief} role="tab" aria-selected={i === d.actief} onclick={() => (d.actief = i)}>{st.titel || `Story ${i + 1}`}</button>
        {/each}
      </div>
    {/if}
    <div class="wv-kaart velden">
      <label class="wv-veld">Korte titel<input class="wv-invoer" bind:value={s.titel} placeholder="Bijvoorbeeld: Dienst ruilen met een collega" /></label>
      <label class="wv-veld">Als …<small>Voor wie is het? Een rol, geen naam.</small><input class="wv-invoer" bind:value={s.als} placeholder="medewerker op locatie" /></label>
      <label class="wv-veld">wil ik …<small>Wat wil de gebruiker kunnen?</small><input class="wv-invoer" bind:value={s.wil} placeholder="mijn dienst ruilen met een collega in de app" /></label>
      <label class="wv-veld">zodat …<small>Waarom? Welke waarde levert het op?</small><input class="wv-invoer" bind:value={s.zodat} placeholder="ik niet hoef te bellen met de planner" /></label>
      <fieldset class="criteria">
        <legend class="wv-veld">Acceptatiecriteria<small>Wanneer is het goed? Eén criterium per regel.</small></legend>
        {#each s.criteria as c, i}
          <div class="wv-rij"><input class="wv-invoer" bind:value={s.criteria[i]} placeholder={i === 0 ? 'Ik zie alleen collega\'s met dezelfde functie' : 'Volgend criterium'} aria-label="Criterium {i + 1}" /><button class="wv-weg" onclick={() => s.criteria.splice(i, 1)} aria-label="Criterium {i + 1} verwijderen">×</button></div>
        {/each}
        <button class="wv-knop wv-knop--link" onclick={() => s.criteria.push('')}>+ Criterium toevoegen</button>
      </fieldset>
      <label class="vink"><input type="checkbox" bind:checked={s.klein} />Past in één iteratie</label>
      <label class="vink"><input type="checkbox" bind:checked={s.toetsbaar} />Elk criterium is te testen</label>
      <div class="acties">
        <button class="wv-knop" onclick={toevoegen}>+ Nieuwe story</button>
        {#if d.stories.length > 1}<button class="wv-knop wv-knop--link" onclick={() => verwijder(d.actief)}>Deze story verwijderen</button>{/if}
      </div>
    </div>
  </div>

  <aside class="rechts">
    <div class="kaartje" class:klaar>
      <span class="label">{klaar ? 'Klaar voor de iteratie' : 'Nog niet klaar'}</span>
      <strong>{s.titel || 'Story'}</strong>
      <p>{zin(s)}</p>
      {#if s.criteria.some((c) => c.trim())}
        <ul>{#each s.criteria.filter((c) => c.trim()) as c}<li>{c}</li>{/each}</ul>
      {/if}
    </div>
    <ul class="checks" aria-label="Checks">
      {#each checks as c}
        <li class:ok={c.ok}><span aria-hidden="true">{c.ok ? '✓' : '○'}</span>{c.tekst}</li>
      {/each}
    </ul>
  </aside>
</div>

<style>
  .story {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 16px;
    align-items: start;
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .lijst .actief {
    background: var(--line1);
    color: var(--on-line1);
  }
  .velden {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .criteria {
    margin: 0;
    padding: 0;
    border: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .criteria legend {
    margin-bottom: 6px;
  }
  .vink {
    display: flex;
    gap: 10px;
    align-items: center;
    font-size: 15px;
  }
  .vink input {
    width: 18px;
    height: 18px;
    accent-color: var(--line1);
  }
  .acties {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    align-items: center;
  }
  .rechts {
    position: sticky;
    top: 90px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .kaartje {
    padding: 20px;
    border-radius: var(--radius-m);
    background: #fffdf3;
    color: #004077;
    border: 1.5px solid #e6dcc0;
    box-shadow: 4px 4px 0 var(--border);
    transform: rotate(-0.6deg);
  }
  .kaartje.klaar {
    border-color: #2e9e5b;
  }
  .label {
    display: inline-block;
    font-size: 12px;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: var(--radius-tag);
    background: #f1ece9;
    margin-bottom: 8px;
  }
  .klaar .label {
    background: #2e9e5b;
    color: #fff;
  }
  .kaartje strong {
    display: block;
    font-size: 18px;
  }
  .kaartje p {
    margin: 6px 0;
    font-size: 15.5px;
  }
  .kaartje ul {
    margin: 6px 0 0;
    padding-left: 18px;
    font-size: 14px;
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
    .story {
      grid-template-columns: minmax(0, 1fr);
    }
    .rechts {
      position: static;
    }
  }
</style>
