<script>
  import content, { titelVoorRoute, explainerById } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import MetroHero from '../components/MetroHero.svelte';
  import RolKiezer from '../components/RolKiezer.svelte';

  const route = $derived(prefs.rol ? content.routes[prefs.rol] ?? [] : []);
  const rolTitel = $derived(prefs.rol ? content.rollen.find((r) => r.id === prefs.rol)?.titel : null);

  const EXPLAINERS = [
    { id: 'product', route: 'waarom' },
    { id: 'model', route: 'model' },
    { id: 'ritme', route: 'ritme' },
    { id: 'epic', route: 'sturen' },
    { id: 'pi-planning', route: 'ritme/pi-planning' }
  ].map((e) => ({ ...e, ...explainerById(e.id) }));

  // Geen ankerlink: de hash is voor de router.
  function naarRolkeuze() {
    const kop = document.getElementById('kies-rol');
    kop?.scrollIntoView({ block: 'start' });
    kop?.focus({ preventScroll: true });
  }
</script>

<div class="container">
  <section class="hero">
    <div class="intro">
      <span class="badge"><span class="stip" aria-hidden="true"></span>Ons digitale operating model</span>
      <h1>Samen digitaal werken aan een betere leefomgeving.</h1>
      <p class="lead">Van projecten naar producten. Volg de lijnen: zo stroomt waarde van strategie, via vaste teams, naar klant en collega.</p>
      <div class="knoppen">
        <a class="btn btn--primary" href={href('model')}>
          <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" /></svg>Bekijk het model in 1 minuut
        </a>
        <button class="btn" onclick={naarRolkeuze}>Kies je rol</button>
      </div>
    </div>
    <div class="beeld"><MetroHero /></div>
  </section>

  <section aria-labelledby="explainers-kop" class="blok">
    <h2 id="explainers-kop">Begrijp het in één minuut</h2>
    <ul class="explainers">
      {#each EXPLAINERS as e}
        <li>
          <a href={href(e.route)}>
            <strong>{e.titel}</strong>
            <span class="kern">{e.kern}</span>
            <span class="duur">▶ {e.stappen.length} stappen · {e.duur}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <section aria-labelledby="kies-rol" class="blok" id="kies-rol-blok">
    <div class="blokkop">
      <h2 id="kies-rol" tabindex="-1">Kies je lijn</h2>
      <span>Je rol bepaalt je route door het playbook. Je kunt hem altijd wijzigen.</span>
    </div>
    <RolKiezer />
  </section>

  <section aria-labelledby="doen-kop" class="blok">
    <h2 id="doen-kop">Aan de slag</h2>
    <ul class="explainers">
      <li><a href={href('beslissen')}><strong>Wie beslist wat?</strong><span class="kern">Per besluit één rol die beslist.</span><span class="duur">Beslismatrix →</span></a></li>
      <li><a href={href('doen/dilemmas')}><strong>Dilemma's</strong><span class="kern">Wat doe jij in deze situatie?</span><span class="duur">Oefenen →</span></a></li>
      <li><a href={href('doen/teamscan')}><strong>Teamscan</strong><span class="kern">Hoe staat jullie team ervoor?</span><span class="duur">10 minuten →</span></a></li>
      <li><a href={href('transitie')}><strong>De transitie</strong><span class="kern">Waar staan we, en wat komt er?</span><span class="duur">Fasen →</span></a></li>
    </ul>
  </section>

  {#if route.length}
    <section aria-labelledby="route-kop" class="blok">
      <div class="blokkop">
        <h2 id="route-kop">Jouw route als {rolTitel}</h2>
        <span>{route.filter((s) => prefs.gezien.includes(s.route)).length} van {route.length} bekeken</span>
      </div>
      <ol class="route">
        {#each route as stap, i}
          <li>
            <a href={href(stap.route)} class:gezien={prefs.gezien.includes(stap.route)}>
              <span class="halte" aria-hidden="true">{i + 1}</span>
              <strong>{titelVoorRoute(stap.route)}</strong>
              <span>{stap.waarom}</span>
              {#if prefs.gezien.includes(stap.route)}<span class="sr-only">(bekeken)</span>{/if}
            </a>
          </li>
        {/each}
      </ol>
    </section>
  {/if}
</div>

<style>
  .hero {
    display: grid;
    grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
    gap: 32px;
    align-items: center;
    padding-block: clamp(24px, 4vw, 48px);
  }
  .intro {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .badge {
    align-self: flex-start;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 12px;
    border-radius: 999px;
    background: var(--panel);
    font-size: 13px;
    font-weight: 600;
    color: var(--line1);
  }
  .stip {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--value);
  }
  h1 {
    font-size: clamp(36px, 4.6vw, 54px);
    font-weight: 700;
    letter-spacing: -0.025em;
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
  .beeld {
    border-radius: var(--radius-l);
    background: var(--panel);
    padding: 12px;
  }
  .blok {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding-block: 20px;
  }
  .blokkop {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 14px;
  }
  .blokkop span {
    color: var(--muted);
    font-size: 15px;
  }
  h2 {
    font-size: 22px;
  }
  .explainers,
  .route {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
    gap: 12px;
  }
  .explainers a,
  .route a {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 18px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .explainers a:hover,
  .route a:hover {
    background: var(--panel);
  }
  .kern,
  .route span:not(.halte) {
    font-size: 14px;
    color: var(--muted);
  }
  .duur {
    margin-top: auto;
    font-size: 13px;
    font-weight: 600;
    color: var(--line1);
  }
  .halte {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    border: 2.5px solid var(--line1);
    font-size: 13px;
    font-weight: 700;
    color: var(--line1);
  }
  .gezien .halte {
    background: var(--line1);
    color: var(--on-line1);
  }
  @media (max-width: 860px) {
    .hero {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
