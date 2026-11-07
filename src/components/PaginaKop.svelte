<script>
  import SafeLabel from './SafeLabel.svelte';
  import IsoTekening from './IsoTekening.svelte';
  // rood: alleen voor de hoofdstukpagina's; titels elders blijven blauw (Blauw 08).
  let { eyebrow, titel, kern, samenvatting = '', safe = null, status = null, rood = false, beeld = null } = $props();
</script>

<header class="kop" class:met-beeld={beeld}>
  <div class="tekst">
  <div class="meta">
    {#if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    {#if status === 'concept'}<span class="status" title="Deze inhoud is nog niet vastgesteld">Concept</span>{/if}
  </div>
  <h1 class:rood>{titel}</h1>
  {#if kern}<p class="lead">{kern}</p>{/if}
  {#if samenvatting}<p class="samenvatting">{samenvatting}</p>{/if}
  <SafeLabel {safe} />
  </div>
  {#if beeld}<div class="beeld"><IsoTekening naam={beeld} klein /></div>{/if}
</header>

<style>
  .kop {
    padding-block: clamp(28px, 5vw, 56px) 8px;
  }
  .tekst {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  /* Met een isometrische tekening ernaast. */
  .met-beeld {
    display: grid;
    grid-template-columns: minmax(0, 6fr) minmax(0, 6fr);
    gap: 32px;
    align-items: center;
  }
  .beeld {
    padding: 8px;
  }
  @media (max-width: 860px) {
    .met-beeld {
      grid-template-columns: minmax(0, 1fr);
    }
    .beeld {
      max-width: 460px;
    }
  }
  .meta {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .status {
    font-size: 13px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: var(--radius-tag);
    background: var(--value);
    color: #ffffff;
  }
  .rood {
    color: var(--titel);
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
