<script>
  import SafeLabel from './SafeLabel.svelte';
  let { eyebrow, titel, kern, samenvatting = '', safe = null, status = null } = $props();
</script>

<header class="kop">
  <div class="meta">
    {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    {#if status === 'concept'}<span class="status" title="Deze inhoud is nog niet vastgesteld">Concept</span>{/if}
  </div>
  <h1>{titel}</h1>
  {#if kern}<p class="lead">{kern}</p>{/if}
  {#if samenvatting}<p class="samenvatting">{samenvatting}</p>{/if}
  <SafeLabel {safe} />
</header>

<style>
  .kop {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding-block: clamp(28px, 5vw, 56px) 8px;
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status {
    font-size: 12px;
    font-weight: 600;
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px dashed var(--muted);
    color: var(--muted);
  }
  h1 {
    font-size: clamp(34px, 5vw, 52px);
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  .lead {
    margin: 0;
  }
  .samenvatting {
    margin: 0;
    max-width: 68ch;
  }
</style>
