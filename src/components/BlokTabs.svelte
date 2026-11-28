<script>
  // Onder de kopbalk: het blok waarin je bent, met zijn pagina's als tabs. Een klik brengt je naar die pagina.
  // Bij blok A en B staat er ook een link om het hele blok als één verhaal te lezen.
  import { route, href } from '../lib/router.svelte.js';
  import { blokById, itemActief, VERHAAL } from '../lib/blokken.js';
  import BlokBadge from './BlokBadge.svelte';

  let { blok } = $props();
  const b = $derived(blokById(blok));
  const pad = $derived(route.parts.join('/'));
</script>

{#if b}
  <nav class="tabs" aria-label="Pagina's in blok {b.id}, {b.titel}">
    <div class="container rij">
      <span class="titel"><BlokBadge blok={b.id} /></span>
      <ul>
        {#each b.items as item}
          <li>
            <a href={href(item.pad)} aria-current={itemActief(item, pad) ? 'page' : undefined}>{item.titel}</a>
          </li>
        {/each}
      </ul>
      {#if VERHAAL.includes(b.id)}
        <a class="verhaal" href={href('blok/' + b.id)}>Lees als één verhaal</a>
      {/if}
    </div>
  </nav>
{/if}

<style>
  .tabs {
    border-bottom: 1px solid var(--border);
  }
  .rij {
    display: flex;
    align-items: center;
    gap: 6px 20px;
    min-height: 52px;
    padding-block: 6px;
  }
  .titel {
    flex: none;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    gap: 2px;
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
  }
  ul a {
    display: block;
    padding: 9px 14px;
    border-radius: var(--radius-tag);
    color: var(--ink);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    white-space: nowrap;
  }
  ul a:hover {
    background: var(--surface);
  }
  ul a[aria-current='page'] {
    background: var(--chip);
    font-weight: 700;
    box-shadow: inset 0 -3px 0 var(--line2);
  }
  .verhaal {
    flex: none;
    padding: 9px 14px;
    border-radius: 999px;
    border: 1.5px solid var(--ink);
    color: var(--ink);
    font-size: 13.5px;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
  }
  .verhaal:hover {
    background: var(--ink);
    color: var(--bg);
  }
  @media (max-width: 760px) {
    .rij {
      flex-wrap: wrap;
    }
    ul {
      order: 3;
      flex-basis: 100%;
    }
  }
  @media print {
    .tabs {
      display: none;
    }
  }
</style>
