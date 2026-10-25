<script>
  import content from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const dilemmasGedaan = $derived(content.dilemmas.filter((d) => prefs.dilemmas[d.id] !== undefined).length);
  const scanIngevuld = $derived(Object.keys(prefs.scan).length);
  const huidigeFase = content.transitie.find((m) => m.status === 'bezig');

  const tegels = $derived([
    { route: 'doen/dilemmas', titel: "Dilemma's: wat doe jij?", tekst: 'Oefen met herkenbare situaties en ontdek waarom de ene keuze beter werkt dan de andere.', meta: `${dilemmasGedaan} van ${content.dilemmas.length} gedaan`, icoon: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18 M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14 M12 17h.01' },
    { route: 'doen/teamscan', titel: 'Teamscan', tekst: 'Breng samen in kaart hoe jullie team ervoor staat, en kies een verbetering voor de retro.', meta: scanIngevuld ? `${scanIngevuld} stellingen ingevuld` : '15 stellingen · 10 min', icoon: 'M12 3 L20.5 9.2 L17.3 19 H6.7 L3.5 9.2 Z M12 8 L16 11 L14.5 16 H9.5 L8 11 Z' },
    { route: 'beslissen', titel: 'Wie beslist wat?', tekst: 'Per besluit één rol die beslist. Filter op jouw rol en zie waar jij over gaat.', meta: `${content.beslismatrix.length} besluiten`, icoon: 'M4 5 H20 M4 12 H20 M4 19 H20 M9 3 V21 M15 3 V21' },
    { route: 'transitie', titel: 'De transitie', tekst: 'In welke fase zitten we, wat komt er, en wanneer raakt het jou?', meta: huidigeFase ? `Nu: ${huidigeFase.titel}` : `${content.transitie.length} fasen`, icoon: 'M5 4 V20 M5 6 H17 L14 9.5 L17 13 H5' }
  ]);
</script>

<div class="container">
  <PaginaKop titel="Aan de slag" kern="Van lezen naar doen: oefenen, samen reflecteren en weten waar je staat." />

  <ul class="tegels">
    {#each tegels as t}
      <li>
        <a href={href(t.route)}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.icoon} /></svg>
          <strong>{t.titel}</strong>
          <span>{t.tekst}</span>
          <small>{t.meta}</small>
        </a>
      </li>
    {/each}
  </ul>

  <section class="sectie card tip">
    <h2>Tip: gebruik het playbook in een sessie</h2>
    <p>Elke explainer heeft een knop <strong>Presenteren</strong>. Daarmee toon je hem schermvullend, met de pijltjestoetsen om door de stappen te gaan. Ideaal voor een teamsessie, een townhall of de start van een PI-planning.</p>
  </section>
</div>

<style>
  .tegels {
    list-style: none;
    margin: 16px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(260px, 100%), 1fr));
    gap: 14px;
  }
  a {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  a:hover {
    background: var(--panel);
  }
  svg {
    width: 34px;
    height: 34px;
    fill: none;
    stroke: var(--line1);
    stroke-width: 1.3;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  strong {
    font-size: 18px;
  }
  span {
    color: var(--muted);
    font-size: 14.5px;
  }
  small {
    margin-top: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--line1);
  }
  .tip {
    margin-top: 28px;
  }
  .tip h2 {
    font-size: 18px;
    margin-bottom: 6px;
  }
  .tip p {
    margin: 0;
  }
</style>
