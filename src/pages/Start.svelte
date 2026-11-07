<script>
  // Startpagina volgens waarom → hoe → wat (ontwerp F2 + G2).
  // De teksten staan in content/data/start.yaml.
  import content, { titelVoorRoute, explainerById, rolById } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import HorizonHero from '../components/HorizonHero.svelte';
  import MetroHero from '../components/MetroHero.svelte';
  import RolKiezer from '../components/RolKiezer.svelte';

  // Collega's op een kleurvlak, zoals op de welkomstslide van de huisstijl.
  const portretten = Object.values(import.meta.glob('../assets/fotos/portret-*.webp', { eager: true, import: 'default' }));
  import werkfoto from '../assets/fotos/werk-overleg.webp';

  const s = content.start;
  const rol = $derived(prefs.rol ? rolById(prefs.rol) : null);
  const route = $derived(prefs.rol ? content.routes[prefs.rol] ?? [] : []);

  const EXPLAINERS = [
    { id: 'product', route: 'waarom' },
    { id: 'model', route: 'model' },
    { id: 'ritme', route: 'ritme' },
    { id: 'epic', route: 'sturen' },
    { id: 'pi-planning', route: 'ritme/pi-planning' }
  ].map((e) => ({ ...e, ...explainerById(e.id) }));

  const DOEN = [
    { route: 'beslissen', titel: 'Wie beslist wat?', tekst: 'Per besluit één rol die beslist. Filter op jouw rol.' },
    { route: 'doen/dilemmas', titel: "Dilemma's", tekst: 'Wat doe jij als het spoedverzoek binnenkomt?' },
    { route: 'doen/teamscan', titel: 'Teamscan', tekst: 'Hoe staat jullie team ervoor? Tien minuten, samen in de retro.' },
    { route: 'transitie', titel: 'De transitie', tekst: 'In welke fase zitten we, en wanneer raakt het jou?' }
  ];

  // Geen ankerlinks: de hash is voor de router.
  function naar(id) {
    const kop = document.getElementById(id);
    kop?.scrollIntoView({ block: 'start' });
    kop?.focus({ preventScroll: true });
  }
</script>

<!-- WAAROM: het eerste scherm. -->
<section class="hero" aria-labelledby="start-titel">
  <div class="hero-beeld"><HorizonHero horizon={s.hero.horizon} tekst={s.hero.horizon_tekst} /></div>
  <div class="container hero-tekst">
    <h1 id="start-titel">{#each s.hero.titel.split(/(?<=\.)\s+/) as regel}<span>{regel}</span> {/each}</h1>
    <p class="lead">{s.hero.lead}</p>
    <div class="knoppen">
      <button class="btn btn--primary" onclick={() => naar('waarom-kop')}>Waarom we kantelen</button>
      <a class="btn" href={href('model')}>
        <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" /></svg>Bekijk het model in 1 minuut
      </a>
    </div>
  </div>
</section>

<div class="container">
  <ul class="portretten" aria-hidden="true">
    {#each portretten as src, i}
      <li style="--i: {i}"><img {src} alt="" /></li>
    {/each}
  </ul>
</div>

<!-- WAAROM NU: rood hoofdstukvlak, zoals de master "Rood". -->
<section class="vlak rood" aria-labelledby="waarom-kop">
  <div class="container">
    <div class="kop">
      <span class="tag tag--wit">Waarom</span>
      <h2 id="waarom-kop" tabindex="-1">{s.waarom.titel}</h2>
      <p class="lead">{s.waarom.lead}</p>
    </div>
    <div class="raster3">
      {#each s.waarom.punten as p}
        <article class="kaart">
          <h3>{p.titel}</h3>
          <p>{p.tekst}</p>
        </article>
      {/each}
    </div>
    {#if s.waarom.missie}<p class="missie">{s.waarom.missie}</p>{/if}
    <a class="verder" href={href('waarom')}>Lees het hele verhaal →</a>
  </div>
</section>

<!-- HOE: taupe met witte kaarten. -->
<section class="vlak" aria-labelledby="hoe-kop">
  <div class="container">
    <div class="kop">
      <span class="tag tag--blauw">Hoe</span>
      <h2 id="hoe-kop">{s.hoe.titel}</h2>
      <p class="lead">{s.hoe.lead}</p>
    </div>
    <ol class="principes">
      {#each s.hoe.principes as p}
        <li class="kaart">
          <span class="station" aria-hidden="true"></span>
          <strong>{p.titel}</strong>
          <span>{p.tekst}</span>
        </li>
      {/each}
    </ol>
    <div class="model">
      <figure class="kaart figuur"><MetroHero /></figure>
      <div class="explainers">
        <h3>Begrijp het in één minuut</h3>
        <ul>
          {#each EXPLAINERS as e, i}
            <li>
              <a class="kaart" href={href(e.route)}>
                <span class="tag" class:tag--rood={i === EXPLAINERS.length - 1} class:tag--blauw={i < EXPLAINERS.length - 1}>▶ {e.stappen.length} stappen</span>
                <span class="tekst"><strong>{e.titel}</strong><span>{e.kern}</span></span>
              </a>
            </li>
          {/each}
        </ul>
      </div>
    </div>
  </div>
</section>

<!-- WAT: blauw hoofdstukvlak, zoals de master "Blauw". -->
<section class="vlak blauw" aria-labelledby="kies-rol">
  <div class="container">
    <div class="kop">
      <span class="tag tag--rood">Wat</span>
      <h2 id="kies-rol" tabindex="-1">{s.wat.titel}</h2>
      <p class="lead">{s.wat.lead}</p>
    </div>
    <div class="wat">
      <div class="keuze"><RolKiezer /></div>
      <div class="kaart rolkaart" aria-live="polite">
        {#if rol}
          <h3>{rol.titel}: {rol.in_een_zin.replace(/\.$/, '').replace(/^\w/, (c) => c.toLowerCase())}</h3>
          <div class="twee">
            <div>
              <span class="tag tag--blauw">Wat je doet</span>
              <ul>{#each rol.verantwoordelijkheden.slice(0, 3) as v}<li>{v}</li>{/each}</ul>
            </div>
            <div>
              <span class="tag tag--rood">Wat je niet meer doet</span>
              <ul>{#each (rol.niet_meer ?? []).slice(0, 3) as v}<li>{v}</li>{/each}</ul>
            </div>
          </div>
          {#if route.length}
            <div>
              <h3 class="klein">Jouw route als {rol.titel}</h3>
              <ol class="route">
                {#each route as stap, i}
                  <li>
                    <a class="tag tag--licht" href={href(stap.route)} title={stap.waarom}>
                      <span class="nr" aria-hidden="true">{i + 1}</span>{titelVoorRoute(stap.route)}
                      {#if prefs.gezien.includes(stap.route)}<span class="vink" aria-label="bekeken">✓</span>{/if}
                    </a>
                  </li>
                {/each}
              </ol>
            </div>
          {/if}
          <a class="verder" href={href('rollen/' + rol.id)}>Naar jouw rolkaart →</a>
        {:else}
          <h3>Kies hiernaast je rol</h3>
          <p>Je ziet dan wat er voor jou verandert, wat je niet meer doet en welke vijf pagina's je het eerst leest. Je keuze blijft bewaard in deze browser.</p>
          <a class="verder" href={href('rollen')}>Of bekijk alle rollen →</a>
        {/if}
      </div>
    </div>
  </div>
</section>

<!-- AAN DE SLAG -->
<section class="vlak" aria-labelledby="doen-kop">
  <div class="container doen">
    <img class="werkfoto" src={werkfoto} alt="Twee collega's overleggen bij een scherm" />
    <div>
      <div class="kop">
        <h2 id="doen-kop">{s.doen.titel}</h2>
        <p class="lead">{s.doen.lead}</p>
      </div>
      <ul class="raster2">
        {#each DOEN as d}
          <li><a class="kaart" href={href(d.route)}><strong>{d.titel} →</strong><span>{d.tekst}</span></a></li>
        {/each}
      </ul>
    </div>
  </div>
</section>

<style>
  /* Hero: de horizon loopt over de volle breedte, de tekst staat links ervoor. */
  .hero {
    position: relative;
    min-height: clamp(520px, 44vw, 600px);
    overflow: hidden;
  }
  .hero-beeld {
    position: absolute;
    inset: 0;
  }
  .hero-tekst {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 22px;
    padding-top: clamp(32px, 5vw, 64px);
    padding-bottom: 200px;
  }
  .hero-tekst > * {
    max-width: 600px;
  }
  h1 span {
    display: block;
  }
  h1 {
    font-size: clamp(44px, 6vw, 84px);
    line-height: 1;
    font-weight: 800;
    letter-spacing: -0.035em;
    color: var(--titel);
    animation: op 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .hero .lead {
    margin: 0;
    font-size: clamp(17px, 1.5vw, 20px);
    animation: op 0.9s 0.1s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .knoppen {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    animation: op 0.9s 0.2s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .knoppen svg {
    width: 12px;
    height: 12px;
    fill: currentColor;
  }
  @keyframes op {
    from {
      opacity: 0;
      transform: translateY(18px);
    }
  }

  .portretten {
    list-style: none;
    margin: 0;
    padding: 0 0 clamp(40px, 6vw, 64px);
    display: grid;
    grid-template-columns: repeat(8, minmax(0, 1fr));
    gap: 10px;
  }
  .portretten img {
    display: block;
    width: 100%;
    aspect-ratio: 16 / 11;
    object-fit: cover;
    border-radius: var(--radius-s);
  }
  .portretten li {
    animation: op 0.6s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(0.3s + var(--i) * 70ms);
  }

  /* Hoofdstukvlakken uit de template. Ze houden hun kleur in beide weergaven. */
  .vlak {
    padding-block: clamp(56px, 8vw, 96px);
  }
  .vlak.rood {
    background: var(--vlak-rood);
    color: #ffffff;
  }
  .vlak.blauw {
    background: var(--vlak-blauw);
    color: #ffffff;
  }
  .vlak.rood .lead,
  .vlak.blauw .lead {
    color: #ffffff;
  }
  .kop {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    max-width: 760px;
    margin-bottom: 32px;
  }
  h2 {
    font-size: clamp(30px, 3.6vw, 46px);
    line-height: 1.08;
    letter-spacing: -0.02em;
  }
  .kop .lead {
    margin: 0;
    font-size: clamp(17px, 1.5vw, 20px);
  }
  .tag {
    display: inline-flex;
    align-items: center;
    height: 30px;
    padding: 0 12px;
    border-radius: var(--radius-tag);
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
  }
  .tag--wit {
    background: #ffffff;
    color: #ab2016;
  }
  .tag--blauw {
    background: #004077;
    color: #ffffff;
  }
  .tag--rood {
    background: #c8261b;
    color: #ffffff;
  }
  .tag--licht {
    background: #e3dcd9;
    color: #004077;
  }

  /* Kaarten zijn altijd wit met blauwe tekst, ook op de gekleurde vlakken. */
  .kaart {
    display: block;
    padding: 24px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .vlak.rood .kaart,
  .vlak.blauw .kaart {
    background: #ffffff;
    color: #004077;
  }
  .kaart h3 {
    font-size: 20px;
    margin: 0 0 8px;
  }
  .kaart p {
    margin: 0;
    line-height: 1.55;
  }
  .raster3 {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .missie {
    margin: 36px 0 0;
    max-width: 820px;
    font-size: clamp(20px, 2vw, 26px);
    font-weight: 700;
    line-height: 1.3;
  }
  .verder {
    display: inline-block;
    margin-top: 20px;
    font-weight: 600;
    color: inherit;
  }

  .principes {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 16px;
  }
  .principes li {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .principes strong {
    font-size: 20px;
  }
  .principes span:not(.station) {
    line-height: 1.55;
    color: var(--muted);
  }
  .station {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 4px solid var(--line2);
  }
  .model {
    margin-top: 16px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 16px;
    align-items: start;
  }
  .figuur {
    margin: 0;
    padding: 12px;
  }
  .explainers h3 {
    font-size: 22px;
    margin-bottom: 12px;
  }
  .explainers ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .explainers a {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 18px;
  }
  .explainers .tekst {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .explainers .tekst span {
    font-size: 15px;
    color: var(--muted);
  }
  .explainers a:hover strong,
  .raster2 a:hover strong {
    text-decoration: underline;
  }

  .wat {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
    gap: 24px;
    align-items: start;
  }
  /* De rolkiezer op het blauwe vlak: witte knoppen, de gekozen rol rood. */
  .keuze {
    --surface: #ffffff;
    --ink: #004077;
    --line1: #c8261b;
    --on-line1: #ffffff;
    color: #004077;
  }
  .keuze :global(.rollen) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
  .rolkaart {
    display: flex;
    flex-direction: column;
    gap: 18px;
    padding: clamp(20px, 3vw, 32px);
  }
  .rolkaart h3 {
    margin: 0;
    font-size: 22px;
  }
  .rolkaart h3.klein {
    font-size: 16px;
    margin-bottom: 12px;
  }
  .rolkaart .verder {
    margin-top: 0;
  }
  .twee {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .twee ul {
    margin: 10px 0 0;
    padding-left: 18px;
    line-height: 1.55;
  }
  .route {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .route a {
    gap: 8px;
    height: 34px;
    text-decoration: none;
  }
  .route a:hover {
    background: #d7ccc8;
  }
  .nr {
    font-weight: 700;
    color: #c8261b;
  }
  .vink {
    color: #1473c3;
  }

  .doen {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 32px;
    align-items: center;
  }
  .werkfoto {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-l);
  }
  .doen .kop {
    margin-bottom: 24px;
  }
  .raster2 {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .raster2 a {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 20px;
  }
  .raster2 strong {
    font-size: 18px;
  }
  .raster2 span {
    font-size: 15px;
    color: var(--muted);
  }

  @media (max-width: 1020px) {
    .principes {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .model,
    .wat {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 1100px) {
    /* Op een smaller scherm staat de horizon onder de tekst. */
    .hero {
      min-height: 0;
      display: flex;
      flex-direction: column-reverse;
    }
    .hero-beeld {
      position: static;
      height: 400px;
    }
    .hero-tekst {
      padding-bottom: 0;
    }
  }
  @media (max-width: 600px) {
    .hero-beeld {
      height: 340px;
    }
  }
  @media (max-width: 860px) {
    .raster3,
    .twee,
    .doen,
    .raster2 {
      grid-template-columns: minmax(0, 1fr);
    }
    .portretten {
      grid-template-columns: repeat(4, minmax(0, 1fr));
    }
    .portretten li:nth-child(n + 5) {
      display: none;
    }
  }
  @media (max-width: 560px) {
    .principes {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    h1,
    .hero .lead,
    .knoppen,
    .portretten li {
      animation: none;
    }
  }
</style>
