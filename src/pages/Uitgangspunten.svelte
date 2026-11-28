<script>
  import content from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const u = content.uitgangspunten.uitgangspunten;
</script>

<div class="container">
  <PaginaKop rood blok="A" titel={u.titel} kern={u.kern} samenvatting={u.lead} status="concept" />

  <section class="sectie band" aria-label="Missie en gedragskompas">
    <div class="missie">
      <span class="label">{u.missie_label}</span>
      <p>{u.missie}</p>
    </div>
    <div class="kompas">
      <span class="label">{u.kompas_label}</span>
      <ul>
        {#each u.kompas as woord, i}
          <li class="k{i}">{woord}</li>
        {/each}
      </ul>
    </div>
  </section>

  <ol class="raster">
    {#each u.punten as punt, i}
      <li>
        <span class="nr" aria-hidden="true">{i + 1}</span>
        <div>
          <h2>{punt.titel}</h2>
          <p>{punt.tekst}</p>
        </div>
      </li>
    {/each}
  </ol>
</div>

<style>
  ul,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .band {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .missie,
  .kompas {
    border-radius: var(--radius-l);
    padding: 28px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    justify-content: center;
  }
  .missie {
    background: var(--vlak-blauw);
    color: #fff;
  }
  .missie p {
    margin: 0;
    font-size: clamp(22px, 2.6vw, 28px);
    line-height: 1.2;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  .kompas {
    background: var(--surface);
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .missie .label {
    color: #8cc2f2;
  }
  .kompas .label {
    color: var(--muted);
  }
  .kompas ul {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .kompas li {
    padding: 10px 20px;
    border-radius: 999px;
    font-size: 20px;
    font-weight: 800;
    color: #fff;
  }
  .k0 {
    background: #c8261b;
  }
  .k1 {
    background: #004077;
  }
  .k2 {
    background: #1473c3;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .k0 { background: #ff5a4c; color: #00305f; }
    :global(:root:not([data-theme='light'])) .k1 { background: #fff; color: #004077; }
    :global(:root:not([data-theme='light'])) .k2 { background: #8cc2f2; color: #00305f; }
  }
  :global([data-theme='dark']) .k0 { background: #ff5a4c; color: #00305f; }
  :global([data-theme='dark']) .k1 { background: #fff; color: #004077; }
  :global([data-theme='dark']) .k2 { background: #8cc2f2; color: #00305f; }

  .raster {
    margin-top: 16px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  .raster li {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    padding: 20px 22px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .nr {
    flex: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 800;
  }
  h2 {
    margin: 2px 0 4px;
    font-size: 18px;
    letter-spacing: -0.02em;
    line-height: 1.25;
  }
  p {
    margin: 0;
    color: var(--muted);
    line-height: 1.5;
  }
  @media (max-width: 760px) {
    .band,
    .raster {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
