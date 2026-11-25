<script>
  import content from './lib/content.js';
  import { route, pad, href } from './lib/router.svelte.js';
  import { markeerGezien } from './lib/state.svelte.js';
  import { resolvePagina } from './lib/pagina.js';
  import { blokVoorRoute } from './lib/blokken.js';
  import NietGevonden from './pages/NietGevonden.svelte';
  import BlokVerhaal from './pages/BlokVerhaal.svelte';
  import BlokTabs from './components/BlokTabs.svelte';
  import BlokVolgende from './components/BlokVolgende.svelte';
  import Header from './components/Header.svelte';
  import FacilicomLogo from './components/FacilicomLogo.svelte';
  import Zoeken from './components/Zoeken.svelte';
  import Redactie from './components/Redactie.svelte';
  import { redactie } from './lib/redactie.svelte.js';

  let zoekOpen = $state(false);
  // Na een wijziging in de redactiemodus wordt de pagina opnieuw opgebouwd met de nieuwe tekst.
  let versie = $state(0);

  // Een blok als één lange pagina (blok/A en blok/B), anders de pagina bij de route.
  const pagina = $derived.by(() => {
    const [a, b] = route.parts;
    if (a === 'blok' && ['A', 'B'].includes(b)) return { comp: BlokVerhaal, props: { blok: b, resolve: resolvePagina }, titel: `Blok ${b} als één verhaal`, verhaal: b };
    return resolvePagina(route.parts);
  });
  const blok = $derived(pagina.verhaal ?? blokVoorRoute(route.parts));
  const metNavigatie = $derived(blok && !pagina.verhaal && route.parts.length > 0);

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

{#if metNavigatie}<BlokTabs {blok} />{/if}

<main id="inhoud" tabindex="-1">
  {#key (route.parts[0] === 'manieren' ? 'manieren' : route.parts.join('/')) + '|' + versie}
    <pagina.comp {...pagina.props ?? {}} />
  {/key}
  {#if metNavigatie}<BlokVolgende {blok} />{/if}
</main>

<footer>
  <div class="container voet">
    <span class="afzender"><FacilicomLogo hoogte={26} /><span>Samen Digitaal · Playbook v{content.changelog[0]?.versie ?? '0.1'}</span></span>
    <nav aria-label="Naslag">
      <a href={href('woordenlijst')}>Woordenlijst</a>
      <a href={href('over')}>Over dit playbook</a>
      <button class="redigeer" onclick={() => (redactie.aan = !redactie.aan)}>{redactie.aan ? 'Stop met redigeren' : 'Teksten redigeren'}</button>
    </nav>
  </div>
</footer>

<Zoeken bind:open={zoekOpen} />
<Redactie onherteken={() => versie++} />

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
  .redigeer {
    padding: 0;
    border: 0;
    background: none;
    color: var(--ink);
    font: inherit;
    text-decoration: underline;
  }
  :global(body.redactie-aan) footer {
    padding-bottom: 96px;
  }
</style>
