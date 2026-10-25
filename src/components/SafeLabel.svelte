<script>
  // Toont de SAFe-term achter een begrip, en hoe wij ervan afwijken.
  let { safe } = $props();
</script>

{#if safe?.term}
  {#if safe.afwijking}
    <details class="safe">
      <summary>SAFe: {safe.term}</summary>
      <p><strong>Hoe wij het doen:</strong> {safe.afwijking}</p>
    </details>
  {:else}
    <span class="safe"><span class="label">SAFe: {safe.term}</span></span>
  {/if}
{/if}

<style>
  .safe {
    display: inline-block;
    font-size: 13px;
    color: var(--muted);
  }
  summary,
  .label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border: 1px solid var(--border);
    border-radius: 999px;
    cursor: default;
  }
  summary {
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary::after {
    content: '+';
    font-weight: 700;
  }
  details[open] summary::after {
    content: '−';
  }
  details p {
    margin: 8px 0 0;
    max-width: 52ch;
    color: var(--ink);
  }
</style>
