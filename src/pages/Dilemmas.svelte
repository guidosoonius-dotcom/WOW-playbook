<script>
  import content, { rolById, titelVoorRoute } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const LABEL = { beste: 'Sterke keuze', kan: 'Kan, maar…', valkuil: 'Valkuil' };
  let filter = $state(prefs.rol ? 'mijn' : 'alle');

  const lijst = $derived(
    content.dilemmas.filter((d) => filter === 'alle' || (filter === 'mijn' && (d.rollen ?? []).includes(prefs.rol)) || d.thema === filter)
  );
  const themas = [...new Set(content.dilemmas.map((d) => d.thema).filter(Boolean))];
  const gedaan = $derived(content.dilemmas.filter((d) => prefs.dilemmas[d.id] !== undefined).length);

  function kies(d, i) {
    prefs.dilemmas[d.id] = i;
  }

  function opnieuw(d) {
    delete prefs.dilemmas[d.id];
  }
</script>

<div class="container">
  <PaginaKop
    compact
   
    titel="Dilemma's: wat doe jij?"
    kern="Herkenbare situaties uit de praktijk. Kies wat jij zou doen en ontdek waarom."
    status="concept"
  />

  <div class="balk">
    <div class="filters" role="group" aria-label="Filter dilemma's">
      {#if prefs.rol}
        <button class="chip" aria-pressed={filter === 'mijn'} onclick={() => (filter = 'mijn')}>Voor {rolById(prefs.rol).titel}</button>
      {/if}
      <button class="chip" aria-pressed={filter === 'alle'} onclick={() => (filter = 'alle')}>Alle</button>
      {#each themas as t}
        <button class="chip" aria-pressed={filter === t} onclick={() => (filter = t)}>{t}</button>
      {/each}
    </div>
    <span class="teller">{gedaan} van {content.dilemmas.length} gedaan</span>
  </div>

  <ol class="dilemmas">
    {#each lijst as d, i (d.id)}
      {@const gekozen = prefs.dilemmas[d.id]}
      <li class="dilemma rij-in" style="--i: {i}">
        <article aria-labelledby="dil-{d.id}">
          <h2 id="dil-{d.id}">{d.titel}</h2>
          <span class="meta">{d.thema}</span>
          <p class="situatie">{d.situatie}</p>
          <p class="vraag">{d.vraag}</p>

          <div class="opties" role="group" aria-label="Kies een antwoord">
            {#each d.opties as o, i}
              {@const open = gekozen !== undefined}
              <button
                class="optie optie--{open ? o.kwaliteit : 'dicht'}"
                class:gekozen={gekozen === i}
                disabled={open}
                aria-pressed={gekozen === i}
                onclick={() => kies(d, i)}
              >
                <span class="letter" aria-hidden="true">{'ABCD'[i]}</span>
                <span class="inhoud">
                  <span>{o.tekst}</span>
                  {#if open}
                    <span class="oordeel">{LABEL[o.kwaliteit]}{gekozen === i ? ' · jouw keuze' : ''}</span>
                    <span class="feedback">{o.feedback}</span>
                  {/if}
                </span>
              </button>
            {/each}
          </div>

          {#if gekozen !== undefined}
            <div class="leerpunt" aria-live="polite">
              <strong>Leerpunt</strong>
              <p>{d.leerpunt}</p>
              <div class="verder">
                {#each d.verwijst_naar ?? [] as r}
                  <a class="chip" href={href(r)}>{titelVoorRoute(r)} →</a>
                {/each}
                <button class="opnieuw" onclick={() => opnieuw(d)}>Opnieuw</button>
              </div>
            </div>
          {/if}
        </article>
      </li>
    {:else}
      <li>Geen dilemma's voor deze selectie. <button class="opnieuw" onclick={() => (filter = 'alle')}>Toon alle</button></li>
    {/each}
  </ol>
</div>

<style>
  .balk {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 8px 0 24px;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .filters .chip {
    border: 0;
    min-height: 36px;
    cursor: pointer;
  }
  .filters .chip[aria-pressed='true'] {
    background: var(--line1);
    color: var(--on-line1);
  }
  .teller {
    font-size: 15px;
    color: var(--muted);
  }
  .dilemmas {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  article {
    padding: clamp(20px, 3vw, 32px);
    border-radius: var(--radius-l);
    background: var(--surface);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  h2 {
    font-size: 24px;
  }
  .situatie {
    margin: 0;
    max-width: 62ch;
  }
  .vraag {
    margin: 4px 0 0;
    font-weight: 700;
    font-size: 17px;
  }
  .opties {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .optie {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 16px;
    border-radius: 16px;
    border: 0;
    background: var(--bg);
    text-align: left;
    transition: background-color 0.15s ease-out, transform 0.15s ease-out;
    color: var(--ink);
  }
  .optie:not(:disabled):hover {
    background: var(--panel);
  }
  .optie:not(:disabled):active {
    transform: scale(0.99);
  }
  .optie:disabled {
    cursor: default;
  }
  .letter {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 700;
    border: 1.5px solid var(--muted);
    color: var(--muted);
  }
  .inhoud {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .oordeel {
    font-size: 13px;
    font-weight: 700;
  }
  .feedback {
    font-size: 15px;
    color: var(--muted);
  }
  .optie--beste {
    background: var(--panel);
  }
  .optie--beste .letter {
    background: var(--line1);
    border-color: var(--line1);
    color: var(--on-line1);
  }
  .optie--beste .oordeel {
    color: var(--line1);
  }
  .optie--kan .oordeel {
    color: var(--line2);
  }
  .optie--valkuil {
    background: color-mix(in srgb, var(--value) 10%, var(--bg));
  }
  .optie--valkuil .oordeel {
    color: var(--value-text);
  }
  .optie.gekozen {
    outline: 3px solid color-mix(in srgb, var(--value) 55%, transparent);
    outline-offset: 0;
  }
  .leerpunt {
    padding: 16px 18px;
    border-radius: 16px;
    background: var(--panel);
  }
  .leerpunt p {
    margin: 4px 0 12px;
  }
  .verder {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
  }
  .opnieuw {
    border: 0;
    background: none;
    color: var(--line1);
    font-weight: 600;
    text-decoration: underline;
    padding: 6px;
  }
</style>
