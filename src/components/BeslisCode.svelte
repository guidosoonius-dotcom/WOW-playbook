<script>
  import content from '../lib/content.js';
  let { code, klein = false } = $props();
</script>

{#if code}
  <span class="code code--{code}" class:klein title={content.beslisCodes[code]}>
    {code}<span class="sr-only"> ({content.beslisCodes[code]})</span>
  </span>
{:else}
  <span class="leeg" aria-label="geen rol">·</span>
{/if}

<style>
  .code {
    display: inline-grid;
    place-items: center;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
  }
  .klein {
    width: 24px;
    height: 24px;
    font-size: 11.5px;
  }
  .code--B {
    background: var(--line1);
    color: var(--on-line1);
  }
  .code--A {
    border: 2px solid var(--line2);
    color: var(--line2);
  }
  .code--U {
    background: var(--panel);
    color: var(--ink);
    border: 1.5px solid var(--border);
  }
  .code--I {
    border: 1.5px dashed var(--muted);
    color: var(--muted);
  }
  .leeg {
    color: var(--border);
  }
</style>
