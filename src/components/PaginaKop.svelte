<script>
  import SafeLabel from './SafeLabel.svelte';
  // compact: voor werkschermen (beslismatrix, teamscan, dilemma's), waar de inhoud vroeg in beeld moet staan.
  let { titel, kern, samenvatting = '', safe = null, status = null, context = '', compact = false } = $props();
</script>

<header class="kop" class:compact>
  <h1>{titel}</h1>
  {#if kern}<p class="lead">{kern}</p>{/if}
  {#if context || status === 'concept' || safe?.term}
    <div class="meta-rij">
      {#if context}<span class="meta">{context}</span>{/if}
      {#if status === 'concept'}<span class="meta concept" title="Deze inhoud is nog niet vastgesteld">Concept, nog niet vastgesteld</span>{/if}
      <SafeLabel {safe} />
    </div>
  {/if}
  {#if samenvatting}<p class="samenvatting">{samenvatting}</p>{/if}
</header>

<style>
  .kop {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-block: clamp(32px, 6vw, 72px) 40px;
  }
  h1 {
    font-size: clamp(40px, 6vw, 84px);
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.035em;
    max-width: 16ch;
  }
  .compact {
    gap: 10px;
    padding-block: clamp(24px, 4vw, 40px) 24px;
  }
  .compact h1 {
    font-size: clamp(30px, 3.4vw, 44px);
    letter-spacing: -0.03em;
    max-width: none;
  }
  .lead,
  .samenvatting {
    margin: 0;
  }
  .samenvatting {
    max-width: 60ch;
  }
  /* Binnenkomst bij het openen van een pagina: titel, inleiding, details. */
  .kop > * {
    animation: kop-in 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
  }
  .kop > :nth-child(2) {
    animation-delay: 0.07s;
  }
  .kop > :nth-child(3) {
    animation-delay: 0.14s;
  }
  .kop > :nth-child(4) {
    animation-delay: 0.21s;
  }
  @keyframes kop-in {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .kop > * {
      animation: none;
    }
  }
  .meta-rij {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 20px;
  }
  .concept::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    margin-right: 8px;
    border-radius: 50%;
    background: var(--value);
    vertical-align: 1px;
  }
</style>
