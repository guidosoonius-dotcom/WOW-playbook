<script>
  // Teamcharter: in zes stappen invullen; het resultaat is een poster.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';
  import { href } from '../../lib/router.svelte.js';

  let { w } = $props();

  const STAPPEN = ['Team en product', 'Ons doel', 'Werkafspraken', 'Ons ritme', 'Hoe we beslissen', 'Poster'];
  const DAGEN = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag'];
  const start = () => ({
    stap: 0,
    team: '',
    product: '',
    gebruikers: '',
    leden: '',
    doel: '',
    meten: '',
    afspraken: [],
    daily: '09:15',
    iteratieStart: 'maandag',
    review: '',
    retro: '',
    beslissen: '',
    escalatie: ''
  });

  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  let nieuweAfspraak = $state('');

  const voorstellen = $derived((w.voorbeelden_afspraken ?? []).filter((a) => !d.afspraken.includes(a)));
  function voegToe(a) {
    const t = a.trim();
    if (t && !d.afspraken.includes(t)) d.afspraken.push(t);
  }
  const ingevuld = (i) =>
    [() => d.team && d.product, () => d.doel, () => d.afspraken.length, () => d.review || d.retro, () => d.beslissen, () => true][i]();

  export function inhoud() {
    const leden = d.leden.split('\n').map((s) => s.trim()).filter(Boolean);
    return (
      `<div class="poster">` +
      `<section>${doc.kop(d.team || 'Ons team')}${doc.veld('Ons product', d.product)}${doc.veld('Voor wie', d.gebruikers)}${leden.length ? '<h3>Wie zijn we</h3>' + doc.lijst(leden) : ''}</section>` +
      `<section>${doc.kop('Ons doel')}${doc.p(d.doel) || '<p class="leeg">Nog niet ingevuld.</p>'}${doc.veld('Zo meten we het', d.meten)}</section>` +
      `<section>${doc.kop('Werkafspraken')}${doc.lijst(d.afspraken)}</section>` +
      `<section>${doc.kop('Ons ritme')}${doc.veld('Daily stand-up', d.daily)}${doc.veld('Iteratie begint op', d.iteratieStart)}${doc.veld('Review', d.review)}${doc.veld('Retrospective', d.retro)}</section>` +
      `<section>${doc.kop('Hoe we beslissen')}${doc.p(d.beslissen) || '<p class="leeg">Nog niet ingevuld.</p>'}${doc.veld('Als we er niet uitkomen', d.escalatie)}</section>` +
      `</div>`
    );
  }
</script>

<div class="charter">
  <ol class="stappen" aria-label="Stappen">
    {#each STAPPEN as s, i}
      <li>
        <button class:actief={d.stap === i} aria-current={d.stap === i ? 'step' : undefined} onclick={() => (d.stap = i)}>
          <span class="nr" class:klaar={i < STAPPEN.length - 1 && ingevuld(i)}>{i < STAPPEN.length - 1 && ingevuld(i) && d.stap !== i ? '✓' : i + 1}</span>{s}
        </button>
      </li>
    {/each}
  </ol>

  <div class="wv-kaart inhoud">
    <h2>{STAPPEN[d.stap]}</h2>
    {#if d.stap === 0}
      <div class="wv-raster">
        <label class="wv-veld">Naam van het team<input class="wv-invoer" bind:value={d.team} placeholder="Bijvoorbeeld: Team Planning op locatie" /></label>
        <label class="wv-veld">Ons product<input class="wv-invoer" bind:value={d.product} placeholder="Waar is het team eigenaar van?" /></label>
      </div>
      <label class="wv-veld">Voor wie<small>Wie zijn de gebruikers van het product?</small><input class="wv-invoer" bind:value={d.gebruikers} placeholder="Bijvoorbeeld: collega's op locatie en planners" /></label>
      <label class="wv-veld">Wie zijn we<small>Eén naam en rol per regel.</small><textarea class="wv-invoer" bind:value={d.leden} placeholder="Sanne · Product Owner&#10;Ahmed · ontwikkelaar"></textarea></label>
    {:else if d.stap === 1}
      <label class="wv-veld">Waar werken we dit jaar naartoe?<small>Een uitkomst voor gebruikers, niet een lijst met functies.</small><textarea class="wv-invoer" bind:value={d.doel} placeholder="Bijvoorbeeld: collega's regelen hun rooster zelf, zonder te bellen"></textarea></label>
      <label class="wv-veld">Zo meten we het<input class="wv-invoer" bind:value={d.meten} placeholder="Bijvoorbeeld: 90% van de ruilen gaat via de app" /></label>
    {:else if d.stap === 2}
      <p class="hulp">Welke afspraken maken jullie samen werk makkelijker? Houd het bij vijf tot acht.</p>
      <ul class="afspraken">
        {#each d.afspraken as a, i}
          <li class="wv-rij"><input class="wv-invoer" bind:value={d.afspraken[i]} aria-label="Afspraak {i + 1}" /><button class="wv-weg" onclick={() => d.afspraken.splice(i, 1)} aria-label="Afspraak {i + 1} verwijderen">×</button></li>
        {/each}
      </ul>
      <form class="wv-rij" onsubmit={(e) => { e.preventDefault(); voegToe(nieuweAfspraak); nieuweAfspraak = ''; }}>
        <input class="wv-invoer" bind:value={nieuweAfspraak} placeholder="Nieuwe afspraak…" aria-label="Nieuwe afspraak" />
        <button class="wv-knop" type="submit">Toevoegen</button>
      </form>
      {#if voorstellen.length}
        <div class="wv-tags"><b class="klein">Voorbeelden:</b>{#each voorstellen as v}<button class="wv-voorstel" onclick={() => voegToe(v)}>+ {v}</button>{/each}</div>
      {/if}
    {:else if d.stap === 3}
      <div class="wv-raster">
        <label class="wv-veld">Daily stand-up om<input class="wv-invoer" type="time" bind:value={d.daily} /></label>
        <label class="wv-veld">Iteratie begint op<select class="wv-invoer" bind:value={d.iteratieStart}>{#each DAGEN as dag}<option>{dag}</option>{/each}</select></label>
        <label class="wv-veld">Review<input class="wv-invoer" bind:value={d.review} placeholder="Bijvoorbeeld: laatste vrijdag, 14.00 uur" /></label>
        <label class="wv-veld">Retrospective<input class="wv-invoer" bind:value={d.retro} placeholder="Bijvoorbeeld: laatste vrijdag, 15.00 uur" /></label>
      </div>
      <p class="hulp">Meer over de events staat bij <a href={href('ritme')}>Ons ritme</a>.</p>
    {:else if d.stap === 4}
      <label class="wv-veld">Hoe nemen we besluiten in het team?<small>Bijvoorbeeld: wie beslist over wat we bouwen, en hoe we kiezen hoe we het bouwen.</small><textarea class="wv-invoer" bind:value={d.beslissen} placeholder="De Product Owner bepaalt de volgorde. Over het hoe beslist het team samen; lukt dat niet, dan kiest de meerderheid."></textarea></label>
      <label class="wv-veld">Als we er niet uitkomen<input class="wv-invoer" bind:value={d.escalatie} placeholder="Bijvoorbeeld: de Team Coach helpt; daarna de Product Manager" /></label>
      <p class="hulp">Zie ook <a href={href('beslissen')}>Wie beslist wat?</a> voor de besluiten op productgroep- en portfolioniveau.</p>
    {:else}
      <p class="hulp">Zo ziet jullie charter eruit. Print hem als poster of deel hem via Word.</p>
      <div class="poster">{@html inhoud().replace(/^<div class="poster">|<\/div>$/g, '')}</div>
    {/if}

    <div class="navigatie">
      <button class="wv-knop" disabled={d.stap === 0} onclick={() => d.stap--}>← Vorige</button>
      {#if d.stap < STAPPEN.length - 1}
        <button class="wv-knop wv-knop--vol" onclick={() => d.stap++}>Volgende: {STAPPEN[d.stap + 1].toLowerCase()} →</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .charter {
    display: grid;
    grid-template-columns: 220px minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }
  .stappen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .stappen button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 10px;
    border: 0;
    border-radius: var(--radius-s);
    background: transparent;
    color: var(--ink);
    font-size: 14px;
    text-align: left;
  }
  .stappen button.actief {
    background: var(--surface);
    font-weight: 700;
  }
  .nr {
    flex-shrink: 0;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 12px;
    font-weight: 700;
    box-shadow: inset 0 0 0 2px var(--track);
  }
  .actief .nr {
    background: var(--value);
    color: #fff;
    box-shadow: none;
  }
  .nr.klaar {
    background: var(--line1);
    color: var(--on-line1);
    box-shadow: none;
  }
  .inhoud {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .inhoud h2 {
    font-size: 21px;
  }
  .hulp {
    margin: 0;
    color: var(--muted);
    font-size: 14.5px;
  }
  .afspraken {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .klein {
    font-size: 13px;
  }
  .navigatie {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 4px;
  }
  .navigatie button:disabled {
    opacity: 0.4;
  }
  .poster {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: 12px;
  }
  .poster :global(section) {
    padding: 14px;
    border-radius: var(--radius-s);
    border: 1.5px solid var(--border);
    background: var(--bg);
    font-size: 14.5px;
  }
  .poster :global(h2) {
    font-size: 17px;
    margin: 0 0 6px;
  }
  .poster :global(section:first-child h2) {
    color: var(--titel);
  }
  .poster :global(h3) {
    font-size: 14px;
    margin: 8px 0 4px;
  }
  .poster :global(p),
  .poster :global(ul) {
    margin: 0 0 6px;
  }
  .poster :global(ul) {
    padding-left: 18px;
  }
  .poster :global(.leeg) {
    color: var(--muted);
    font-style: italic;
  }
  @media (max-width: 760px) {
    .charter {
      grid-template-columns: minmax(0, 1fr);
    }
    .stappen {
      flex-direction: row;
      overflow-x: auto;
    }
    .stappen button {
      white-space: nowrap;
    }
  }
</style>
