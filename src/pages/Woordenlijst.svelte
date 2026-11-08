<script>
  import content from '../lib/content.js';
  import { route } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  let filter = $state('');
  const norm = (s) => (s ?? '').toLowerCase();
  const zichtbaar = $derived(
    content.begrippen.filter((b) =>
      [b.term, b.safe_term, b.uitleg, ...(b.synoniemen ?? [])].some((t) => norm(t).includes(norm(filter.trim())))
    )
  );
  const gekozen = $derived(route.parts[1]);

  $effect(() => {
    if (gekozen) requestAnimationFrame(() => document.getElementById(`begrip-${gekozen}`)?.scrollIntoView({ block: 'center' }));
  });
</script>

<div class="container">
  <PaginaKop eyebrow="Naslag" titel="Woordenlijst" kern="Alle begrippen uit het playbook, met de SAFe-term erbij. In de tekst herken je ze aan de stippellijn." />

  <label class="filter">
    <span class="sr-only">Filter begrippen</span>
    <input type="search" bind:value={filter} placeholder="Filter op begrip…" />
  </label>

  <dl class="begrippen">
    {#each zichtbaar as b (b.id)}
      <div id="begrip-{b.id}" class:gekozen={gekozen === b.id}>
        <dt>
          <strong>{b.term}</strong>
          {#if b.safe_term && b.safe_term.toLowerCase() !== b.term.toLowerCase()}<span class="safe">SAFe: {b.safe_term}</span>{/if}
        </dt>
        <dd>{b.uitleg}</dd>
      </div>
    {:else}
      <p>Geen begrippen gevonden.</p>
    {/each}
  </dl>
</div>

<style>
  .filter input {
    width: min(420px, 100%);
    height: 48px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    background: var(--bg);
    color: var(--ink);
    font: inherit;
    margin: 12px 0 24px;
  }
  .begrippen {
    margin: 0 0 48px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(340px, 100%), 1fr));
    gap: 12px;
  }
  .begrippen div {
    padding: 16px 18px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .begrippen div.gekozen {
    outline: 2px solid var(--value);
  }
  dt {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
  }
  dt strong {
    font-size: 17px;
  }
  .safe {
    font-size: 12.5px;
    color: var(--muted);
  }
  dd {
    margin: 6px 0 0;
    color: var(--muted);
    font-size: 15px;
  }
</style>
