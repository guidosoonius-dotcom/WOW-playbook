<script>
  import content from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const t = content.hulpmiddelen.templates;
</script>

<div class="container">
  <PaginaKop rood blok="D" titel={t.titel} kern={t.kern} samenvatting={t.lead} status="concept" />

  <ol class="raster">
    {#each t.lijst as x, i}
      <li class="kaart" class:invul={x.werkvorm}>
        <span class="nr" aria-hidden="true">{i + 1}</span>
        <h2>{x.naam}</h2>
        <span class="wanneer">{x.wanneer}</span>
        <p>{x.tekst}</p>
        {#if x.werkvorm}
          <a class="knop" href={href('doen/gereedschap/' + x.werkvorm)}>{t.invullen}</a>
        {:else}
          <span class="volgt">{t.volgt}</span>
        {/if}
      </li>
    {/each}
  </ol>
</div>

<style>
  ol {
    list-style: none;
    margin: 28px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .kaart {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 22px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .kaart.invul {
    outline: 2px solid var(--line2);
    outline-offset: -2px;
  }
  .nr {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    display: grid;
    place-items: center;
    background: var(--chip);
    color: var(--ink);
    font-weight: 800;
    font-size: 13px;
  }
  h2 {
    margin: 4px 0 0;
    font-size: 20px;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .wanneer {
    font-size: 13px;
    font-weight: 600;
    color: var(--line2);
  }
  p {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--muted);
  }
  .knop {
    align-self: flex-start;
    margin-top: auto;
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 700;
    font-size: 14px;
    text-decoration: none;
  }
  .volgt {
    margin-top: auto;
    padding-top: 10px;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  @media (max-width: 960px) {
    ol {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 600px) {
    ol {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
