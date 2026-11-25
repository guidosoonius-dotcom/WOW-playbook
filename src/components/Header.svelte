<script>
  import SamenDigitaalLogo from './SamenDigitaalLogo.svelte';
  import FacilicomLogo from './FacilicomLogo.svelte';
  import BlokBadge from './BlokBadge.svelte';
  import { route, href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import { rolById } from '../lib/content.js';
  import { BLOKKEN, blokVoorRoute } from '../lib/blokken.js';

  let { onzoek } = $props();

  const systeemDonker = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const donker = $derived(prefs.theme ? prefs.theme === 'dark' : systeemDonker);
  const rol = $derived(prefs.rol ? rolById(prefs.rol) : null);
  const actiefBlok = $derived(blokVoorRoute(route.parts));
  const pad = $derived(route.parts.join('/'));

  // Het geopende blok. Bij een nieuwe pagina, Esc of een klik ernaast klapt het weer dicht.
  let open = $state(null);
  let kop;
  $effect(() => {
    pad;
    open = null;
  });
  function toets(e) {
    if (e.key === 'Escape' && open) {
      const knop = kop?.querySelector(`[data-blok="${open}"]`);
      open = null;
      knop?.focus();
    }
  }
  function klik(e) {
    if (open && kop && !kop.contains(e.target)) open = null;
  }
  const isActief = (item) => pad === item.pad || (item.pad === 'uitleg' && pad.startsWith('uitleg') && pad !== 'uitleg/waardestroom') || (item.pad !== 'uitleg' && item.pad !== 'doen/gereedschap' && pad.startsWith(item.pad + '/'));
</script>

<svelte:window onkeydown={toets} onclick={klik} />

<header class="header" class:met-rol={rol} bind:this={kop}>
  <div class="container rij">
    <a class="merk" href={href('')} aria-label="Samen Digitaal, playbook van Facilicom Groep: naar de start">
      <FacilicomLogo hoogte={30} />
      <span class="streep" aria-hidden="true"></span>
      <SamenDigitaalLogo hoogte={30} />
    </a>

    <nav aria-label="Hoofdnavigatie">
      <ul>
        {#each BLOKKEN as blok}
          <li>
            <button
              class="blok"
              class:actief={actiefBlok === blok.id}
              class:open={open === blok.id}
              data-blok={blok.id}
              aria-expanded={open === blok.id}
              aria-controls="blok-{blok.id}"
              aria-current={actiefBlok === blok.id ? 'true' : undefined}
              onclick={() => (open = open === blok.id ? null : blok.id)}
            >
              <BlokBadge blok={blok.id} naam={false} />
              <span>{blok.titel}</span>
              <svg class="pijl" viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 4.5 L6 8 L9.5 4.5" /></svg>
            </button>
            {#if open === blok.id}
              <div class="paneel" id="blok-{blok.id}">
                <div class="paneel-kop">
                  <BlokBadge blok={blok.id} groot naam={false} />
                  <div>
                    <strong>{blok.titel}</strong>
                    <span>{blok.kern}</span>
                  </div>
                </div>
                <ul class="items">
                  {#each blok.items as item}
                    <li>
                      <a href={href(item.pad)} aria-current={isActief(item) ? 'page' : undefined}>
                        <b>{item.titel}{#if item.nieuw}<i class="nieuw">Nieuw</i>{:else if item.volgt}<i class="nieuw volgt">Volgt</i>{/if}</b>
                        <span>{item.kern}</span>
                      </a>
                    </li>
                  {/each}
                </ul>
                {#if blok.promo}
                  <a class="promo" href={href(blok.promo.pad)}>
                    <span class="promo-label">Probeer het</span>
                    <strong>{blok.promo.titel}</strong>
                    <span>{blok.promo.tekst}</span>
                    <span class="promo-knop">{blok.promo.knop}</span>
                  </a>
                {/if}
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </nav>

    <div class="acties">
      {#if rol}
        <a class="rolpil" href={href('rollen/' + rol.id)} title="Jouw rol">
          <span class="stip" aria-hidden="true"></span>{rol.titel}
        </a>
      {/if}
      <button class="zoek" onclick={onzoek} aria-label="Zoeken (Ctrl+K)">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M16 16 L21 21" /></svg>
        <span class="zoek-label">Zoeken</span>
        <kbd>⌘K</kbd>
      </button>
      <button
        class="thema"
        onclick={() => (prefs.theme = donker ? 'light' : 'dark')}
        aria-label={donker ? 'Lichte weergave' : 'Donkere weergave'}
        title={donker ? 'Lichte weergave' : 'Donkere weergave'}
      >
        {#if donker}
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2 M12 20v2 M2 12h2 M20 12h2 M4.9 4.9l1.4 1.4 M17.7 17.7l1.4 1.4 M4.9 19.1l1.4-1.4 M17.7 6.3l1.4-1.4" /></svg>
        {:else}
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5Z" /></svg>
        {/if}
      </button>
    </div>
  </div>
</header>

<style>
  .header {
    position: sticky;
    top: 0;
    z-index: 30;
    background: color-mix(in srgb, var(--bg) 88%, transparent);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid var(--border);
  }
  .rij {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 20px;
    min-height: 72px;
    padding-block: 10px;
  }
  .merk {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--ink);
    text-decoration: none;
    line-height: 1.15;
  }
  .streep {
    width: 2px;
    height: 28px;
    background: var(--border);
  }
  nav {
    flex: 1;
    min-width: 0;
  }
  nav > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 2px;
  }
  nav > ul > li {
    flex: none;
  }
  .blok {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    padding: 0 10px 0 6px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 14.5px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
  }
  .blok:hover,
  .blok.open {
    background: var(--surface);
  }
  .blok.actief {
    background: var(--chip);
    font-weight: 700;
  }
  .pijl {
    width: 12px;
    height: 12px;
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.8;
    stroke-linecap: round;
    stroke-linejoin: round;
    transition: transform 0.15s;
  }
  .blok.open .pijl {
    transform: rotate(180deg);
  }

  /* Het open blok: een paneel onder de kopbalk, over de breedte van de inhoud. */
  .paneel {
    position: absolute;
    left: var(--gutter);
    right: var(--gutter);
    top: calc(100% + 8px);
    max-width: var(--max);
    margin-inline: auto;
    max-height: calc(100vh - 110px);
    overflow-y: auto;
    padding: 22px;
    border-radius: 20px;
    background: var(--surface);
    box-shadow: 0 18px 50px rgb(0 43 82 / 0.22);
    display: grid;
    grid-template-columns: minmax(0, 1fr) 300px;
    gap: 6px 24px;
  }
  .paneel-kop {
    grid-column: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 12px 6px;
  }
  .paneel-kop strong {
    display: block;
    font-size: 20px;
    letter-spacing: -0.02em;
  }
  .paneel-kop span {
    font-size: 14px;
    color: var(--muted);
  }
  .items {
    grid-column: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 2px 12px;
  }
  .items a {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 12px 14px;
    border-radius: 12px;
    color: var(--ink);
    text-decoration: none;
  }
  .items a:hover {
    background: var(--chip);
  }
  .items a[aria-current='page'] {
    background: var(--chip);
    box-shadow: inset 3px 0 0 var(--line1);
  }
  .items b {
    font-size: 15px;
  }
  .items a span {
    font-size: 13px;
    line-height: 1.4;
    color: var(--muted);
  }
  .nieuw {
    margin-left: 8px;
    padding: 2px 8px;
    border-radius: 999px;
    background: var(--value);
    color: #fff;
    font-size: 11px;
    font-style: normal;
    font-weight: 700;
    vertical-align: 1px;
  }
  .nieuw.volgt {
    background: transparent;
    border: 1.5px dashed var(--muted);
    color: var(--muted);
    padding: 0 7px;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .nieuw {
      color: #00305f;
    }
  }
  :global([data-theme='dark']) .nieuw {
    color: #00305f;
  }
  .promo {
    grid-column: 2;
    grid-row: 1 / span 2;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;
    padding: 20px;
    border-radius: 16px;
    background: #004077;
    color: #fff;
    text-decoration: none;
  }
  .promo strong {
    font-size: 20px;
    line-height: 1.2;
    letter-spacing: -0.02em;
  }
  .promo span {
    font-size: 14px;
    line-height: 1.45;
    color: #c9d8ea;
  }
  .promo .promo-label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8cc2f2;
  }
  .promo .promo-knop {
    align-self: flex-start;
    margin-top: 4px;
    padding: 12px 18px;
    border-radius: 999px;
    background: #fff;
    color: #004077;
    font-weight: 700;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .promo {
      background: #002b52;
    }
  }
  :global([data-theme='dark']) .promo {
    background: #002b52;
  }

  .acties {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rolpil {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border-radius: var(--radius-tag);
    background: var(--surface);
    color: var(--ink);
    font-size: 13px;
    font-weight: 600;
    text-decoration: none;
    white-space: nowrap;
  }
  .stip {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--value);
  }
  .zoek,
  .thema {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    min-width: 40px;
    justify-content: center;
    padding: 0 12px;
    border: 0;
    border-radius: var(--radius-tag);
    background: var(--surface);
    color: var(--muted);
    font-size: 14px;
  }
  kbd {
    font-family: inherit;
    font-size: 11px;
    padding: 2px 6px;
    border-radius: 6px;
    background: var(--bg);
  }
  .zoek svg,
  .thema svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  /* De vier blokken passen naast logo en knoppen zolang de inhoud zijn volle breedte heeft. Met een gekozen rol
     (een brede pil bij de knoppen) of op een smaller scherm krijgt het menu een eigen rij. */
  .met-rol nav {
    order: 3;
    flex-basis: 100%;
  }
  .met-rol nav > ul {
    justify-content: flex-start;
  }
  .met-rol .acties {
    margin-left: auto;
  }
  @media (max-width: 1260px) {
    nav {
      order: 3;
      flex-basis: 100%;
    }
    nav > ul {
      justify-content: flex-start;
      overflow-x: auto;
      scrollbar-width: none;
    }
    .acties {
      margin-left: auto;
    }
  }
  @media (max-width: 860px) {
    .paneel {
      grid-template-columns: minmax(0, 1fr);
      padding: 16px;
    }
    .paneel-kop,
    .items,
    .promo {
      grid-column: 1;
      grid-row: auto;
    }
    .items {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (max-width: 560px) {
    .zoek-label,
    kbd {
      display: none;
    }
    .rij {
      column-gap: 12px;
    }
    .merk {
      gap: 8px;
    }
    .merk :global(.facilicom-logo) {
      height: 20px !important;
    }
    .merk :global(.sd-logo) {
      height: 22px !important;
    }
    .rolpil {
      display: none;
    }
    .blok {
      padding-right: 10px;
      gap: 8px;
    }
  }
</style>
