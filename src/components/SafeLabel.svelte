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
    font-size: 15px;
    color: var(--muted);
  }
  summary,
  .label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 36px;
  }
  summary {
    text-decoration: underline dotted var(--muted);
    text-underline-offset: 4px;
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
    color: var(--ink);
  }
  details[open] summary::after {
    content: '−';
  }
  details p {
    margin: 10px 0 0;
    max-width: 52ch;
    color: var(--ink);
  }
</style>
