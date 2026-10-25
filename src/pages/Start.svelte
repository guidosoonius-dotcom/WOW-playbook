<script>
  import content, { titelVoorRoute, explainerById } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import MetroHero from '../components/MetroHero.svelte';
  import RolKiezer from '../components/RolKiezer.svelte';

  const route = $derived(prefs.rol ? content.routes[prefs.rol] ?? [] : []);
  const rolTitel = $derived(prefs.rol ? content.rollen.find((r) => r.id === prefs.rol)?.titel : null);
  const bekeken = $derived(route.filter((s) => prefs.gezien.includes(s.route)).length);

  // Het vertrekbord: elke explainer rijdt op een eigen lijn.
  const VERTREK = [
    { id: 'product', route: 'waarom', lijn: 'var(--value)' },
    { id: 'model', route: 'model', lijn: 'var(--line1)' },
    { id: 'ritme', route: 'ritme', lijn: 'var(--line2)' },
    { id: 'epic', route: 'sturen', lijn: 'var(--line1)' },
    { id: 'pi-planning', route: 'ritme/pi-planning', lijn: 'var(--line2)' }
  ].map((e) => ({ ...e, ...explainerById(e.id) }));

  const DOEN = [
    ['beslissen', 'Wie beslist wat?', 'Per besluit één rol die beslist. Filter op jouw rol.'],
    ['doen/dilemmas', "Dilemma's", 'Wat doe jij als het spoedverzoek binnenkomt?'],
    ['doen/teamscan', 'Teamscan', 'Hoe staat jullie team ervoor? Tien minuten, samen in de retro.'],
    ['transitie', 'De transitie', 'In welke fase zitten we, en wanneer raakt het jou?']
  ];

  // Geen ankerlink: de hash is voor de router.
  function naarRolkeuze() {
    const kop = document.getElementById('kies-rol');
    kop?.scrollIntoView({ block: 'start' });
    kop?.focus({ preventScroll: true });
  }
</script>

<div class="container">
  <section class="hero" aria-labelledby="titel">
    <h1 id="titel">Samen Digitaal</h1>
    <div class="intro">
      <p class="lead">Het playbook voor ons digitale operating model. Van projecten naar producten: volg de lijnen van strategie, via vaste teams, naar klant en collega.</p>
      <div class="knoppen">
        <a class="btn btn--primary" href={href('model')}>
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" /></svg>Bekijk het model in 1 minuut
        </a>
        <button class="btn" onclick={naarRolkeuze}>Kies je rol</button>
      </div>
    </div>
    <div class="kaart"><MetroHero /></div>
  </section>

  <section class="blok lijnkeuze" aria-labelledby="kies-rol">
    <div class="blokkop">
      <h2 id="kies-rol" tabindex="-1">Kies je lijn</h2>
      <p>Je rol bepaalt je route door het playbook, en wat de explainers voor jou uitlichten.</p>
    </div>
    <RolKiezer />

    {#if route.length}
      <div class="route" aria-labelledby="route-kop">
        <h3 id="route-kop">Jouw route als {rolTitel} <span class="meta">{bekeken} van {route.length} haltes bekeken</span></h3>
        <ol>
          {#each route as stap}
            {@const gezien = prefs.gezien.includes(stap.route)}
            <li class:gezien>
              <a href={href(stap.route)}>
                <span class="station" aria-hidden="true"></span>
                <strong>{titelVoorRoute(stap.route)}</strong>
                <span>{stap.waarom}</span>
                {#if gezien}<span class="sr-only">(bekeken)</span>{/if}
              </a>
            </li>
          {/each}
        </ol>
      </div>
    {/if}
  </section>

  <section class="blok" aria-labelledby="vertrek-kop">
    <div class="blokkop">
      <h2 id="vertrek-kop">Begrijp het in één minuut</h2>
      <p>Vijf explainers, elk in vijf stappen. Met Presenteren gebruik je ze in een sessie.</p>
    </div>
    <ul class="vertrekbord">
      {#each VERTREK as e}
        <li>
          <a href={href(e.route)}>
            <svg class="lijn" viewBox="0 0 48 20" aria-hidden="true" style="--lijn: {e.lijn}">
              <path d="M2 10 H46" /><circle cx="24" cy="10" r="6" />
            </svg>
            <span class="tekst">
              <strong>{e.titel}</strong>
              <span>{e.kern}</span>
            </span>
            <span class="duur">{e.stappen.length} stappen · {e.duur}</span>
            <svg class="pijl" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12 H19 M13 6 L19 12 L13 18" /></svg>
          </a>
        </li>
      {/each}
    </ul>
  </section>
</div>

<section class="veld" aria-labelledby="doen-kop">
  <div class="container">
    <div class="blokkop">
      <h2 id="doen-kop">Aan de slag</h2>
      <p>Van lezen naar doen: oefenen, samen reflecteren en weten waar je staat.</p>
    </div>
    <ul class="doen">
      {#each DOEN as [pad, titel, tekst]}
        <li>
          <a href={href(pad)}>
            <strong>{titel}</strong>
            <span>{tekst}</span>
          </a>
        </li>
      {/each}
    </ul>
  </div>
</section>

<style>
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    grid-template-areas:
      'titel titel'
      'intro kaart';
    gap: 32px 48px;
    align-items: start;
    padding-block: clamp(32px, 5vw, 64px) 0;
  }
  h1 {
    grid-area: titel;
    font-size: clamp(56px, 9vw, 136px);
    font-weight: 700;
    line-height: 0.92;
    letter-spacing: -0.045em;
  }
  .intro {
    grid-area: intro;
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-top: 8px;
  }
  /* Binnenkomst van de hero bij het laden: titel, tekst, kaart. */
  .hero > * {
    animation: hero-in 0.8s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .intro {
    animation-delay: 0.08s;
  }
  .kaart {
    animation-delay: 0.16s;
  }
  @keyframes hero-in {
    from {
      opacity: 0;
      transform: translateY(24px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .hero > * {
      animation: none;
    }
  }
  .lead {
    margin: 0;
  }
  .knoppen {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  .knoppen svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
  .kaart {
    grid-area: kaart;
    border-radius: var(--radius-l);
    background: var(--panel);
    padding: 16px;
  }
  .blok {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: clamp(72px, 9vw, 128px);
  }
  .blokkop {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .blokkop p {
    margin: 0;
    font-size: 17px;
    max-width: 60ch;
  }
  h2 {
    font-size: clamp(28px, 3.2vw, 40px);
    font-weight: 700;
  }

  /* Jouw route: een metrolijn met haltes. */
  .route {
    margin-top: 16px;
    padding: clamp(20px, 3vw, 32px);
    border-radius: var(--radius-l);
    background: var(--panel);
  }
  .route h3 {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 16px;
    font-size: 21px;
    margin-bottom: 24px;
  }
  .route ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(5, minmax(0, 1fr));
    position: relative;
  }
  .route ol::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 10%;
    right: 10%;
    height: 4px;
    border-radius: 2px;
    background: var(--line1);
  }
  .route a {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 0 8px 4px;
    text-align: center;
    color: var(--ink);
    text-decoration: none;
  }
  .station {
    width: 28px;
    height: 28px;
    margin-bottom: 8px;
    border-radius: 50%;
    border: 4px solid var(--line1);
    background: var(--panel);
    transition: transform 0.2s ease-out, background-color 0.2s ease-out;
  }
  .gezien .station {
    background: var(--line1);
  }
  .route a:hover .station {
    transform: scale(1.2);
    background: var(--value);
    border-color: var(--value);
  }
  .route strong {
    font-size: 17px;
  }
  .route a > span:not(.station) {
    font-size: 15px;
    color: var(--muted);
  }

  /* Vertrekbord: elke explainer als een rij met zijn eigen lijn. */
  .vertrekbord {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .vertrekbord a {
    display: grid;
    grid-template-columns: 48px minmax(0, 1fr) auto 24px;
    align-items: center;
    gap: 20px;
    padding: 18px 22px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
    transition: background-color 0.15s ease-out;
  }
  .vertrekbord a:hover {
    background: var(--panel);
  }
  .lijn path {
    fill: none;
    stroke: var(--lijn);
    stroke-width: 4;
    stroke-linecap: round;
  }
  .lijn circle {
    fill: var(--bg);
    stroke: var(--lijn);
    stroke-width: 3.5;
  }
  .tekst {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .tekst strong {
    font-size: 21px;
  }
  .tekst span {
    font-size: 17px;
  }
  .duur {
    font-size: 15px;
    color: var(--muted);
    white-space: nowrap;
  }
  .pijl {
    width: 22px;
    height: 22px;
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.2s ease-out;
  }
  .vertrekbord a:hover .pijl {
    transform: translateX(4px);
  }

  /* Aan de slag: een veld in de paneelkleur. */
  .veld {
    margin-top: clamp(72px, 9vw, 128px);
    padding-block: clamp(56px, 7vw, 96px);
    background: var(--panel);
  }
  .veld .blokkop {
    margin-bottom: 28px;
  }
  .doen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 48px;
  }
  .doen a {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 0;
    color: var(--ink);
    text-decoration: none;
  }
  .doen strong {
    font-size: 21px;
    letter-spacing: -0.02em;
    transition: color 0.15s ease-out;
  }
  .doen strong::after {
    content: ' →';
    color: var(--line1);
  }
  .doen a:hover strong {
    color: var(--line1);
  }
  .doen span {
    font-size: 17px;
  }

  @media (max-width: 860px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
      grid-template-areas: 'titel' 'intro' 'kaart';
    }
    .route ol {
      grid-template-columns: minmax(0, 1fr);
      gap: 12px;
    }
    .route ol::before {
      top: 14px;
      bottom: 14px;
      left: 12px;
      right: auto;
      width: 4px;
      height: auto;
    }
    .route a {
      display: grid;
      grid-template-columns: 28px minmax(0, 1fr);
      gap: 2px 16px;
      align-items: start;
      text-align: left;
      padding: 0;
    }
    .station {
      grid-row: span 2;
      margin: 0;
    }
    .vertrekbord a {
      grid-template-columns: 40px minmax(0, 1fr);
      gap: 4px 16px;
      padding: 16px;
    }
    .duur {
      grid-column: 2;
    }
    .pijl {
      display: none;
    }
    .doen {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
