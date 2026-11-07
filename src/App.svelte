<script>
  import content from './lib/content.js';
  import { route, pad } from './lib/router.svelte.js';
  import { markeerGezien } from './lib/state.svelte.js';
  import { rolById, eventById, uitlegById } from './lib/content.js';
  import Uitleg from './pages/Uitleg.svelte';
  import Uitgelegd from './pages/Uitgelegd.svelte';
  import Header from './components/Header.svelte';
  import FacilicomLogo from './components/FacilicomLogo.svelte';
  import Zoeken from './components/Zoeken.svelte';
  import Start from './pages/Start.svelte';
  import Waarom from './pages/Waarom.svelte';
  import Model from './pages/Model.svelte';
  import Rollen from './pages/Rollen.svelte';
  import Rol from './pages/Rol.svelte';
  import Ritme from './pages/Ritme.svelte';
  import Event from './pages/Event.svelte';
  import Sturen from './pages/Sturen.svelte';
  import Woordenlijst from './pages/Woordenlijst.svelte';
  import Over from './pages/Over.svelte';
  import NietGevonden from './pages/NietGevonden.svelte';
  import Beslissen from './pages/Beslissen.svelte';
  import Doen from './pages/Doen.svelte';
  import Dilemmas from './pages/Dilemmas.svelte';
  import Teamscan from './pages/Teamscan.svelte';
  import Transitie from './pages/Transitie.svelte';
  import { href } from './lib/router.svelte.js';

  let zoekOpen = $state(false);

  const pagina = $derived.by(() => {
    const [a = '', b] = route.parts;
    if (a === '' && !b) return { comp: Start, titel: null };
    if (a === 'waarom' && !b) return { comp: Waarom, titel: 'Waarom we kantelen' };
    if (a === 'model' && !b) return { comp: Model, titel: 'Het model' };
    if (a === 'rollen' && !b) return { comp: Rollen, titel: 'Rollen' };
    if (a === 'rollen' && rolById(b)) return { comp: Rol, props: { id: b }, titel: rolById(b).titel };
    if (a === 'ritme' && !b) return { comp: Ritme, titel: 'Ritme' };
    if (a === 'ritme' && eventById(b)) return { comp: Event, props: { id: b }, titel: eventById(b).titel };
    if (a === 'sturen' && !b) return { comp: Sturen, titel: 'Sturen en financieren' };
    if (a === 'woordenlijst') return { comp: Woordenlijst, titel: 'Woordenlijst' };
    if (a === 'over' && !b) return { comp: Over, titel: 'Over dit playbook' };
    if (a === 'beslissen' && !b) return { comp: Beslissen, titel: 'Wie beslist wat?' };
    if (a === 'doen' && !b) return { comp: Doen, titel: 'Aan de slag' };
    if (a === 'doen' && b === 'dilemmas') return { comp: Dilemmas, titel: "Dilemma's" };
    if (a === 'doen' && b === 'teamscan') return { comp: Teamscan, titel: 'Teamscan' };
    if (a === 'transitie' && !b) return { comp: Transitie, titel: 'De transitie' };
    if (a === 'uitleg' && !b) return { comp: Uitgelegd, titel: 'Uitgelegd' };
    if (a === 'uitleg' && uitlegById(b)) return { comp: Uitleg, props: { id: b }, titel: uitlegById(b).titel };
    return { comp: NietGevonden, titel: 'Niet gevonden' };
  });

  $effect(() => {
    document.title = pagina.titel ? `${pagina.titel} · Samen Digitaal` : 'Samen Digitaal · Playbook';
    if (pagina.comp !== NietGevonden) markeerGezien(pad());
  });

  function onkeydown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      zoekOpen = true;
    }
  }
</script>

<svelte:window {onkeydown} />

<a class="skip" href="#inhoud" onclick={(e) => { e.preventDefault(); document.getElementById('inhoud')?.focus(); }}>Naar de inhoud</a>
<Header onzoek={() => (zoekOpen = true)} />

<main id="inhoud" tabindex="-1">
  {#key route.parts.join('/')}
    <pagina.comp {...pagina.props ?? {}} />
  {/key}
</main>

<footer>
  <div class="container voet">
    <span class="afzender"><FacilicomLogo hoogte={26} /><span>Samen Digitaal · Playbook v{content.changelog[0]?.versie ?? '0.1'}</span></span>
    <nav aria-label="Naslag">
      <a href={href('woordenlijst')}>Woordenlijst</a>
      <a href={href('over')}>Over dit playbook</a>
    </nav>
  </div>
</footer>

<Zoeken bind:open={zoekOpen} />

<style>
  .skip {
    position: absolute;
    left: 16px;
    top: -60px;
    z-index: 50;
    padding: 10px 16px;
    border-radius: 12px;
    background: var(--ink);
    color: var(--bg);
  }
  .skip:focus {
    top: 12px;
  }
  main {
    min-height: 70vh;
    outline: none;
    padding-bottom: 48px;
  }
  footer {
    padding-block: 0 32px;
    font-size: 14px;
    color: var(--ink);
  }
  /* Voet zoals in de template: een lijn in Blauw 08, logo linksonder. */
  .voet {
    border-top: 1.5px solid var(--ink);
    padding-top: 20px;
  }
  .afzender {
    display: inline-flex;
    align-items: center;
    gap: 16px;
  }
  .voet {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 12px;
  }
  .voet nav {
    display: flex;
    gap: 16px;
  }
  .voet a {
    color: var(--ink);
  }
</style>
