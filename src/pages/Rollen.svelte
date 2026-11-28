<script>
  import content, { rolById } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import { inBeeld } from '../lib/inbeeld.js';
  import RolIcoon from '../components/RolIcoon.svelte';

  const rg = content.rollengroepen;
  let groep = $state('alle');
  const zichtbaar = $derived(rg.groepen.filter((g) => groep === 'alle' || g.id === groep));
  const totaal = rg.groepen.reduce((n, g) => n + g.rollen.length, 0);
</script>

<div class="container">
  <PaginaKop rood blok="B" titel="Rollen" kern="Rollen in het team en eromheen." samenvatting={rg.intro} status="concept" />

  <div class="chips" role="group" aria-label="Filter op groep">
    <button type="button" class="chip" class:aan={groep === 'alle'} aria-pressed={groep === 'alle'} onclick={() => (groep = 'alle')}>{rg.alle} <span>{totaal}</span></button>
    {#each rg.groepen as g}
      <button type="button" class="chip" class:aan={groep === g.id} aria-pressed={groep === g.id} onclick={() => (groep = g.id)}>{g.titel} <span>{g.rollen.length}</span></button>
    {/each}
  </div>

  {#each zichtbaar as g}
    <section class="sectie" aria-labelledby="groep-{g.id}">
      <h2 id="groep-{g.id}">{g.titel}</h2>
      <ul class="raster anim" use:inBeeld>
        {#each g.rollen as r, i}
          {@const bestaand = r.rol ? rolById(r.rol) : null}
          <li style="--i: {i}">
            {#if bestaand}
              <a class="rolkaart" class:mijn={prefs.rol === bestaand.id} href={href('rollen/' + bestaand.id)}>
                <span class="icoon"><RolIcoon rol={bestaand.id} size={26} /></span>
                <strong>{bestaand.titel}{#if prefs.rol === bestaand.id}<span class="jij">jouw rol</span>{/if}</strong>
                <span>{bestaand.kern}</span>
              </a>
            {:else}
              <div class="rolkaart zonder">
                <span class="icoon klein" aria-hidden="true">{r.titel.slice(0, 1)}</span>
                <strong>{r.titel}</strong>
                <span>{r.tekst}</span>
                <small>Eigen rolpagina volgt</small>
              </div>
            {/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <section class="specialismen card">
    <h2>{rg.specialismen.titel}</h2>
    <p>{rg.specialismen.tekst}</p>
  </section>
</div>

<style>
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin: 24px 0 8px;
  }
  .chip {
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1.5px solid transparent;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .chip span {
    opacity: 0.65;
    margin-left: 4px;
  }
  .chip:hover {
    background: var(--panel);
  }
  .chip.aan {
    background: var(--line1);
    color: var(--on-line1);
  }
  .raster.anim li {
    opacity: 0;
  }
  .raster:global(.speelt) li {
    animation: an-kaart 0.5s cubic-bezier(0.2, 0.8, 0.3, 1) forwards;
    animation-delay: calc(var(--i) * 0.06s);
  }
  @media (prefers-reduced-motion: reduce) {
    .raster.anim li {
      opacity: 1;
    }
    .raster:global(.speelt) li {
      animation: none;
    }
  }
  .rolkaart.zonder {
    cursor: default;
  }
  .rolkaart.zonder:hover {
    background: var(--surface);
  }
  .icoon.klein {
    font-weight: 800;
    font-size: 18px;
  }
  small {
    margin-top: auto;
    font-size: 12px;
    font-weight: 600;
    color: var(--muted);
  }
  .specialismen {
    margin-top: 28px;
    padding: 22px 26px;
  }
  .specialismen h2 {
    margin: 0 0 8px;
    font-size: 20px;
    letter-spacing: -0.02em;
  }
  .specialismen p {
    margin: 0;
    line-height: 1.6;
    color: var(--muted);
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .rolkaart {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 20px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .rolkaart:hover {
    background: var(--panel);
  }
  .rolkaart.mijn {
    outline: 2px solid var(--line1);
  }
  .icoon {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--bg);
    color: var(--line1);
  }
  strong {
    font-size: 18px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .jij {
    font-size: 11px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: var(--radius-tag);
    background: var(--line1);
    color: var(--on-line1);
  }
  span:not(.icoon):not(.jij) {
    color: var(--muted);
    font-size: 14.5px;
  }
</style>
