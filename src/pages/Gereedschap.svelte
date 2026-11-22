<script>
  // De gereedschapskist: werkvormen om in te vullen, ingedeeld naar moment.
  import content, { rolById } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import { bewaardeWerkvormen, tijdTekst } from '../lib/werkvorm.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Icoon from '../components/Icoon.svelte';

  const NIVEAU = { team: 'Team', productgroep: 'Productgroep', portfolio: 'Portfolio' };

  let categorie = $state('alle');
  let niveau = $state('alle');
  let alleenMijnRol = $state(false);

  const bewaard = bewaardeWerkvormen();
  const verder = content.werkvormen.filter((w) => bewaard[w.id]).sort((a, b) => bewaard[b.id] - bewaard[a.id]);
  const rol = $derived(prefs.rol ? rolById(prefs.rol) : null);

  const zichtbaar = (w) =>
    (categorie === 'alle' || w.categorie === categorie) && (niveau === 'alle' || w.niveau === niveau) && (!alleenMijnRol || !rol || w.wie.includes(rol.id));
  const groepen = $derived(content.categorieen.map((c) => ({ ...c, werkvormen: content.werkvormen.filter((w) => w.categorie === c.id && zichtbaar(w)) })).filter((g) => g.werkvormen.length));
</script>

<div class="container">
  <PaginaKop rood eyebrow="Aan de slag" titel="Gereedschapskist" kern="Werkvormen om samen in te vullen, in een sessie of zelfstandig. Je werk blijft bewaard in deze browser; deel het als PDF, Word of tekst." />

  {#if verder.length}
    <section class="verder" aria-labelledby="verder-kop">
      <h2 id="verder-kop">Verder met je werk</h2>
      <ul>
        {#each verder as w}
          <li><a href={href('doen/gereedschap/' + w.id)}><Icoon naam={w.icoon} grootte={32} /><span>{w.titel}</span><small>{tijdTekst(bewaard[w.id])}</small></a></li>
        {/each}
      </ul>
    </section>
  {/if}

  <div class="filters">
    <div class="chips" role="radiogroup" aria-label="Kies een categorie">
      <button role="radio" aria-checked={categorie === 'alle'} onclick={() => (categorie = 'alle')}>Alles</button>
      {#each content.categorieen as c}
        <button role="radio" aria-checked={categorie === c.id} onclick={() => (categorie = c.id)}>{c.titel}</button>
      {/each}
    </div>
    <label class="niveau">
      <span class="sr-only">Niveau</span>
      <select bind:value={niveau}>
        <option value="alle">Alle niveaus</option>
        {#each Object.entries(NIVEAU) as [id, naam]}<option value={id}>{naam}</option>{/each}
      </select>
    </label>
    {#if rol}
      <button class="mijnrol" aria-pressed={alleenMijnRol} onclick={() => (alleenMijnRol = !alleenMijnRol)}>
        {alleenMijnRol ? `Voor ${rol.titel} ✕` : `Alleen voor ${rol.titel}`}
      </button>
    {/if}
  </div>

  {#each groepen as g (g.id)}
    <section class="categorie" aria-labelledby="cat-{g.id}">
      <div class="catkop">
        <h2 id="cat-{g.id}">{g.titel}</h2>
        <span>{g.kern}</span>
      </div>
      <ul class="tegels">
        {#each g.werkvormen as w (w.id)}
          <li>
            {#if w.beschikbaar}
              <a class="tegel" href={href('doen/gereedschap/' + w.id)}>
                <span class="boven"><Icoon naam={w.icoon} grootte={42} /><span class="niveau-label niveau--{w.niveau}">{NIVEAU[w.niveau]}</span></span>
                <strong>{w.titel}</strong>
                <span class="kern">{w.kern}</span>
                <span class="voet"><span class="actie">{bewaard[w.id] ? 'Verder invullen' : 'Invullen'} →</span><span>{w.duur}</span></span>
              </a>
            {:else}
              <div class="tegel tegel--volgt">
                <span class="boven"><Icoon naam={w.icoon} grootte={42} /><span class="niveau-label niveau--{w.niveau}">{NIVEAU[w.niveau]}</span></span>
                <strong>{w.titel}</strong>
                <span class="kern">{w.kern}</span>
                <span class="voet"><span class="volgt">Volgt binnenkort</span><span>{w.duur}</span></span>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {:else}
    <p class="geen">Geen werkvormen met deze filters. <button class="wv-knop--link wv-knop" onclick={() => { categorie = 'alle'; niveau = 'alle'; alleenMijnRol = false; }}>Toon alles</button></p>
  {/each}
</div>

<style>
  .verder {
    margin-top: 8px;
    padding: 16px 18px;
    border-radius: var(--radius-m);
    border: 1.5px dashed var(--track);
  }
  .verder h2 {
    font-size: 17px;
    margin-bottom: 10px;
  }
  .verder ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .verder a {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 6px 14px 6px 6px;
    border-radius: var(--radius-s);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
    font-weight: 600;
    font-size: 14px;
  }
  .verder small {
    color: var(--muted);
    font-weight: 400;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
    margin: 20px 0 4px;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    flex: 1;
  }
  .chips button,
  .mijnrol,
  .niveau select {
    min-height: 38px;
    padding: 0 14px;
    border-radius: var(--radius-tag);
    border: 0;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
  }
  .chips button[aria-checked='true'],
  .mijnrol[aria-pressed='true'] {
    background: var(--line1);
    color: var(--on-line1);
  }
  .categorie {
    padding-block: 18px 6px;
  }
  .catkop {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 14px;
    margin-bottom: 12px;
  }
  .catkop h2 {
    font-size: 24px;
  }
  .catkop span {
    color: var(--muted);
    font-size: 15px;
  }
  .tegels {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
    gap: 12px;
  }
  .tegel {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 18px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  a.tegel:hover strong {
    text-decoration: underline;
  }
  .tegel--volgt {
    background: transparent;
    border: 1.5px dashed var(--track);
  }
  .tegel--volgt :global(.icoon) {
    opacity: 0.6;
  }
  .boven {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .niveau-label {
    display: inline-flex;
    align-items: center;
    min-height: 26px;
    padding: 0 10px;
    border-radius: var(--radius-tag);
    font-size: 12.5px;
    font-weight: 700;
  }
  .niveau--team {
    background: #e8f1fa;
    color: #0a599e;
  }
  .niveau--productgroep {
    background: #f1ece9;
    color: #004077;
  }
  .niveau--portfolio {
    background: #f8e3e1;
    color: #ab2016;
  }
  strong {
    font-size: 17px;
  }
  .kern {
    color: var(--muted);
    font-size: 14px;
    line-height: 1.45;
  }
  .voet {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 9px;
    border-top: 1px solid var(--border);
    font-size: 13px;
    color: var(--muted);
  }
  .actie {
    font-weight: 700;
    color: var(--line2);
  }
  .volgt {
    font-weight: 700;
  }
  .geen {
    margin-top: 24px;
    color: var(--muted);
  }
</style>
