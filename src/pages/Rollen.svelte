<script>
  import content from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import RolIcoon from '../components/RolIcoon.svelte';
</script>

<div class="container">
  <PaginaKop eyebrow="3 · Rollen" titel="Wie doet wat?" kern="Zeven rollen, van divisie tot productteam. Per rol zie je wat je doet, wat je niet meer doet en met wie je samenwerkt." />

  {#each content.lagen as laag}
    {@const rollen = content.rollen.filter((r) => r.laag === laag.id)}
    {#if rollen.length}
      <section class="sectie" aria-labelledby="laag-{laag.id}">
        <h2 id="laag-{laag.id}">{laag.titel}</h2>
        <ul class="raster">
          {#each rollen as rol}
            <li>
              <a class="rolkaart" class:mijn={prefs.rol === rol.id} href={href('rollen/' + rol.id)}>
                <span class="icoon"><RolIcoon rol={rol.id} size={26} /></span>
                <strong>{rol.titel}{#if prefs.rol === rol.id}<span class="jij">jouw rol</span>{/if}</strong>
                <span>{rol.kern}</span>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/if}
  {/each}
</div>

<style>
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
    border-radius: 999px;
    background: var(--line1);
    color: var(--on-line1);
  }
  span:not(.icoon):not(.jij) {
    color: var(--muted);
    font-size: 14.5px;
  }
</style>
