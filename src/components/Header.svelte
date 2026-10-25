<script>
  import Logo from './Logo.svelte';
  import { route, href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import { rolById } from '../lib/content.js';

  let { onzoek } = $props();

  const NAV = [
    ['waarom', 'Waarom'],
    ['model', 'Model'],
    ['rollen', 'Rollen'],
    ['ritme', 'Ritme'],
    ['sturen', 'Sturen'],
    ['woordenlijst', 'Woordenlijst']
  ];

  const systeemDonker = typeof matchMedia === 'function' && matchMedia('(prefers-color-scheme: dark)').matches;
  const donker = $derived(prefs.theme ? prefs.theme === 'dark' : systeemDonker);
  const rol = $derived(prefs.rol ? rolById(prefs.rol) : null);
</script>

<header class="header">
  <div class="container rij">
    <a class="merk" href={href('')}>
      <Logo />
      <span><strong>Samen Digitaal</strong><small>Playbook · Facilicom Groep</small></span>
    </a>

    <nav aria-label="Hoofdnavigatie">
      <ul>
        {#each NAV as [pad, label]}
          <li>
            <a href={href(pad)} aria-current={route.parts[0] === pad ? 'page' : undefined}>{label}</a>
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
    gap: 8px 24px;
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
  .merk span {
    display: flex;
    flex-direction: column;
  }
  .merk small {
    font-size: 11.5px;
    color: var(--muted);
  }
  nav {
    flex: 1;
    min-width: 0;
    order: 0;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    gap: 2px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  nav a {
    display: block;
    padding: 10px 14px;
    border-radius: 999px;
    color: var(--ink);
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;
    white-space: nowrap;
  }
  nav a:hover {
    background: var(--surface);
  }
  nav a[aria-current='page'] {
    background: var(--chip);
    font-weight: 700;
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
    border-radius: 999px;
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
    border-radius: 999px;
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
  svg {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: var(--ink);
    stroke-width: 1.6;
    stroke-linecap: round;
  }
  @media (max-width: 1020px) {
    nav {
      order: 3;
      flex-basis: 100%;
    }
    ul {
      justify-content: flex-start;
    }
    .acties {
      margin-left: auto;
    }
  }
  @media (max-width: 560px) {
    .zoek-label,
    kbd,
    .merk small {
      display: none;
    }
    .rolpil {
      display: none;
    }
  }
</style>
