<script>
  // Eén werkvorm: uitleg, werkbalk en de werkvorm zelf, met een presentatiestand voor het grote scherm.
  import content, { rolById, titelVoorRoute } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import Icoon from '../components/Icoon.svelte';
  import Werkbalk from '../components/gereedschap/Werkbalk.svelte';
  import Wsjf from '../components/gereedschap/Wsjf.svelte';
  import Teamcharter from '../components/gereedschap/Teamcharter.svelte';
  import Dod from '../components/gereedschap/Dod.svelte';
  import Story from '../components/gereedschap/Story.svelte';
  import Retro from '../components/gereedschap/Retro.svelte';
  import BusinessCase from '../components/gereedschap/BusinessCase.svelte';
  import PiKit from '../components/gereedschap/PiKit.svelte';
  import Capaciteit from '../components/gereedschap/Capaciteit.svelte';
  import Trieren from '../components/gereedschap/Trieren.svelte';
  import Waardestroom from '../components/gereedschap/Waardestroom.svelte';
  import Teamindeling from '../components/gereedschap/Teamindeling.svelte';
  import Productcanvas from '../components/gereedschap/Productcanvas.svelte';
  import Feature from '../components/gereedschap/Feature.svelte';
  import Portfoliokanban from '../components/gereedschap/Portfoliokanban.svelte';
  import Okr from '../components/gereedschap/Okr.svelte';
  import Budget from '../components/gereedschap/Budget.svelte';
  import Kaderscheck from '../components/gereedschap/Kaderscheck.svelte';
  import Probleemoplossing from '../components/gereedschap/Probleemoplossing.svelte';
  import Ipk from '../components/gereedschap/Ipk.svelte';
  import Pok from '../components/gereedschap/Pok.svelte';
  import Pva from '../components/gereedschap/Pva.svelte';

  let { id } = $props();

  const TOOLS = {
    wsjf: Wsjf,
    teamcharter: Teamcharter,
    'definition-of-done': Dod,
    'goede-story': Story,
    retrospectives: Retro,
    'lean-business-case': BusinessCase,
    'pi-planningskit': PiKit,
    'capaciteit-pi-doelen': Capaciteit,
    'lopende-projecten-trieren': Trieren,
    'waardestroom-in-kaart': Waardestroom,
    teamindeling: Teamindeling,
    productcanvas: Productcanvas,
    'feature-beschrijven': Feature,
    portfoliokanban: Portfoliokanban,
    'okr-opsteller': Okr,
    'budget-verdelen': Budget,
    kaderscheck: Kaderscheck,
    probleemoplossing: Probleemoplossing,
    'idee-project-kaart': Ipk,
    'project-opdracht-kaart': Pok,
    'plan-van-aanpak': Pva
  };
  const NIVEAU = { team: 'Team', productgroep: 'Productgroep', portfolio: 'Portfolio' };

  const w = $derived(content.werkvormen.find((x) => x.id === id));
  const Tool = $derived(w?.beschikbaar ? TOOLS[w.id] : null);
  const categorie = $derived(content.categorieen.find((c) => c.id === w?.categorie));

  let tool = $state();
  let presenteren = $state(false);
  let vlak = $state();

  // Presentatiestand: schermvullend; Esc of de knop stopt.
  $effect(() => {
    if (!presenteren || !vlak) return;
    vlak.requestFullscreen?.().catch(() => {});
    const opEsc = (e) => e.key === 'Escape' && (presenteren = false);
    const opWissel = () => !document.fullscreenElement && (presenteren = false);
    window.addEventListener('keydown', opEsc);
    document.addEventListener('fullscreenchange', opWissel);
    return () => {
      window.removeEventListener('keydown', opEsc);
      document.removeEventListener('fullscreenchange', opWissel);
      if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
    };
  });
</script>

{#if w}
  <div class="container">
    <nav class="kruimel" aria-label="Kruimelpad">
      <a href={href('doen')}>Aan de slag</a><span aria-hidden="true">›</span>
      <a href={href('doen/gereedschap')}>Gereedschapskist</a><span aria-hidden="true">›</span>
      <span aria-current="page">{w.titel}</span>
    </nav>

    <header class="kop">
      <div class="titel">
        <Icoon naam={w.icoon} grootte={56} />
        <div>
          <h1>{w.titel}</h1>
          <p class="lead">{w.kern}</p>
          <div class="labels">
            <span class="wv-label label--vol">{w.duur}</span>
            <span class="wv-label label--zacht">{categorie?.titel}</span>
            <span class="wv-label label--zacht">{NIVEAU[w.niveau]}</span>
          </div>
        </div>
      </div>
      <aside class="wv-kaart uitleg">
        <h2>Zo werkt het</h2>
        <p class="meta"><b>Wanneer:</b> {w.wanneer}</p>
        <p class="meta"><b>Wie:</b> {#each w.wie as r, i}<a href={href('rollen/' + r)}>{rolById(r)?.titel}</a>{i < w.wie.length - 1 ? ', ' : ''}{/each}</p>
        {#if w.html}<div class="prose klein">{@html w.html}</div>{/if}
      </aside>
    </header>

    {#if Tool}
      <Werkbalk titel={w.titel} {tool} bind:presenteren />
      <div bind:this={vlak} class="vlak" class:wv-presentatie={presenteren}>
        {#if presenteren}
          <div class="presentatiekop">
            <Icoon naam={w.icoon} grootte={40} />
            <strong>{w.titel}</strong>
            <span class="ruimte"></span>
            <button class="wv-knop" onclick={() => (presenteren = false)}>Stoppen (Esc)</button>
          </div>
        {/if}
        <Tool bind:this={tool} {w} {presenteren} />
      </div>
    {:else}
      <div class="wv-kaart volgt">
        <h2>Deze werkvorm volgt binnenkort</h2>
        <p>{w.titel} komt in de volgende release van de gereedschapskist. Bekijk intussen de andere werkvormen.</p>
        <a class="wv-knop wv-knop--vol" href={href('doen/gereedschap')}>Naar de gereedschapskist</a>
      </div>
    {/if}

    {#if w.bij?.length}
      <section class="sectie bij" aria-labelledby="bij-kop">
        <h2 id="bij-kop">Hoort bij</h2>
        <ul>{#each w.bij as r}<li><a class="chip" href={href(r)}>{titelVoorRoute(r) ?? r} →</a></li>{/each}</ul>
      </section>
    {/if}
  </div>
{/if}

<style>
  .kruimel {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: clamp(20px, 3vw, 32px);
    font-size: 14px;
    color: var(--muted);
  }
  .kruimel a {
    color: var(--ink);
  }
  .kop {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
    gap: 24px;
    align-items: start;
    padding-block: 16px 20px;
  }
  .titel {
    display: flex;
    gap: 18px;
    align-items: flex-start;
  }
  h1 {
    font-size: clamp(30px, 4vw, 44px);
    letter-spacing: -0.02em;
  }
  .lead {
    margin: 8px 0 12px;
  }
  .labels {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .label--vol {
    background: var(--line1);
    color: var(--on-line1);
  }
  .label--zacht {
    background: var(--chip);
    color: var(--ink);
  }
  .uitleg h2 {
    font-size: 17px;
    margin-bottom: 8px;
  }
  .meta {
    margin: 0 0 6px;
    font-size: 14px;
  }
  .prose.klein {
    font-size: 14.5px;
    margin-top: 10px;
  }
  .vlak {
    margin-top: 14px;
  }
  .presentatiekop {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 18px;
    font-size: 22px;
  }
  .ruimte {
    flex: 1;
  }
  .volgt {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .volgt h2 {
    font-size: 20px;
  }
  .volgt p {
    margin: 0;
  }
  .bij h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  .bij ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .bij .chip {
    min-height: 40px;
    padding: 0 16px;
    font-size: 15px;
  }
  @media (max-width: 860px) {
    .kop {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
