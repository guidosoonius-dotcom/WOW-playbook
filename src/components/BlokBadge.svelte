<script>
  // De letter van een blok (A tot en met D) in zijn eigen kleur, met op verzoek de naam erachter.
  import { blokById } from '../lib/blokken.js';
  let { blok, groot = false, naam = true } = $props();
  const b = $derived(blokById(blok));
</script>

{#if b}
  <span class="badge-wrap">
    <span class="badge {blok.toLowerCase()}" class:groot aria-hidden="true">{blok}</span>
    {#if naam}<span class="naam"><span class="sr-only">Blok {blok}: </span>{b.titel}</span>{/if}
  </span>
{/if}

<style>
  .badge-wrap {
    display: inline-flex;
    align-items: center;
    gap: 10px;
  }
  .badge {
    --bg-b: #004077;
    --fg-b: #fff;
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: var(--bg-b);
    color: var(--fg-b);
    font-weight: 800;
    font-size: 13px;
    line-height: 1;
  }
  .badge.groot {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
  .a { --bg-b: #004077; --fg-b: #fff; }
  .b { --bg-b: #1473c3; --fg-b: #fff; }
  .c { --bg-b: #8cc2f2; --fg-b: #004077; }
  .d { --bg-b: #c8261b; --fg-b: #fff; }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .a { --bg-b: #fff; --fg-b: #004077; }
    :global(:root:not([data-theme='light'])) .b { --bg-b: #8cc2f2; --fg-b: #00305f; }
    :global(:root:not([data-theme='light'])) .c { --bg-b: #3f8fd8; --fg-b: #fff; }
    :global(:root:not([data-theme='light'])) .d { --bg-b: #ff5a4c; --fg-b: #00305f; }
  }
  :global([data-theme='dark']) .a { --bg-b: #fff; --fg-b: #004077; }
  :global([data-theme='dark']) .b { --bg-b: #8cc2f2; --fg-b: #00305f; }
  :global([data-theme='dark']) .c { --bg-b: #3f8fd8; --fg-b: #fff; }
  :global([data-theme='dark']) .d { --bg-b: #ff5a4c; --fg-b: #00305f; }
  .naam {
    font-size: 14px;
    font-weight: 700;
    color: var(--muted);
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }
</style>
