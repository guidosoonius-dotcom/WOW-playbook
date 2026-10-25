<script>
  import { route, pad } from './lib/router.svelte.js';
  import { markeerGezien } from './lib/state.svelte.js';
  import { rolById, eventById } from './lib/content.js';
  import Header from './components/Header.svelte';
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
    return { comp: NietGevonden, titel: 'Niet gevonden' };
  });

  // Binnenkomst per sectie (zie .wacht in global.css): alleen voor wat bij het laden onder de vouw staat.
  $effect(() => {
    route.parts.join('/');
    if (typeof IntersectionObserver !== 'function' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let io;
    const t = setTimeout(() => {
      io = new IntersectionObserver(
        (items) => items.forEach((e) => e.isIntersecting && (e.target.classList.add('in'), io.unobserve(e.target))),
        { rootMargin: '0px 0px -10% 0px' }
      );
      for (const el of document.querySelectorAll('main section')) {
        if (el.getBoundingClientRect().top < innerHeight * 0.9 || el.querySelector('section')) continue;
        [...el.children].forEach((c, i) => c.style.setProperty('--i', String(i)));
        el.classList.add('wacht');
        io.observe(el);
      }
    }, 30);
    return () => {
      clearTimeout(t);
      io?.disconnect();
    };
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
  <div class="container">
    <p class="naam" aria-hidden="true">Samen Digitaal</p>
    <div class="voet">
      <span>Playbook v0.1 · een initiatief van Facilicom Groep</span>
      <nav aria-label="Naslag">
        <a href={href('woordenlijst')}>Woordenlijst</a>
        <a href={href('over')}>Over dit playbook</a>
        <a href={href('doen')}>Aan de slag</a>
      </nav>
    </div>
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
  }
  main > :global(.container:last-child) {
    padding-bottom: clamp(72px, 9vw, 128px);
  }
  footer {
    background: var(--surface);
    padding-block: clamp(40px, 6vw, 72px) 28px;
    font-size: 15px;
    color: var(--muted);
  }
  .naam {
    margin: 0 0 24px;
    font-size: clamp(56px, 9vw, 136px);
    font-weight: 700;
    line-height: 0.9;
    letter-spacing: -0.05em;
    color: var(--ink);
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
    color: var(--muted);
  }
</style>
