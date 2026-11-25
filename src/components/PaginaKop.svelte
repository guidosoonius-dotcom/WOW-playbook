<script>
  import { getContext } from 'svelte';
  import SafeLabel from './SafeLabel.svelte';
  import IsoTekening from './IsoTekening.svelte';
  import BlokBadge from './BlokBadge.svelte';
  // rood: alleen voor de hoofdstukpagina's; titels elders blijven blauw (Blauw 08).
  // In een blokverhaal staat de koptitel van het blok bovenaan, en zijn de pagina's eronder een niveau lager.
  const verhaal = getContext('verhaal') ?? false;
  let { eyebrow, blok = null, titel, kern, samenvatting = '', safe = null, status = null, rood = false, beeld = null } = $props();
</script>

<header class="kop" class:met-beeld={beeld}>
  <div class="tekst">
  <div class="meta">
    {#if blok && !verhaal}<BlokBadge {blok} />{:else if eyebrow}<span class="eyebrow">{eyebrow}</span>{/if}
    {#if status === 'concept'}<span class="status" title="Deze inhoud is nog niet vastgesteld">Concept</span>{/if}
  </div>
  <svelte:element this={verhaal ? 'h2' : 'h1'} class="titel" class:rood>{titel}</svelte:element>
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
  .titel {
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
