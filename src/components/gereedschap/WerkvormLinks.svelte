<script>
  // Werkvormen uit de gereedschapskist die horen bij deze pagina (veld "bij") of bij deze rol (veld "wie").
  import content from '../../lib/content.js';
  import { href } from '../../lib/router.svelte.js';
  import Icoon from '../Icoon.svelte';

  let { route = null, rol = null, titel = 'Werkvormen om mee aan de slag te gaan' } = $props();

  const lijst = $derived(content.werkvormen.filter((w) => w.beschikbaar && ((route && w.bij?.includes(route)) || (rol && w.wie.includes(rol)))));
</script>

{#if lijst.length}
  <section class="sectie werkvormen" aria-labelledby="werkvormen-kop">
    <h2 id="werkvormen-kop">{titel}</h2>
    <ul>
      {#each lijst as w}
        <li>
          <a href={href('doen/gereedschap/' + w.id)}>
            <Icoon naam={w.icoon} grootte={40} />
            <span><strong>{w.titel}</strong><small>{w.duur} · {w.kern}</small></span>
          </a>
        </li>
      {/each}
    </ul>
  </section>
{/if}

<style>
  h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(320px, 100%), 1fr));
    gap: 10px;
  }
  a {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 14px 16px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  a:hover strong {
    text-decoration: underline;
  }
  span {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  small {
    color: var(--muted);
    font-size: 13.5px;
    line-height: 1.4;
  }
</style>
