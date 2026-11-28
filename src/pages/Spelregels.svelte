<script>
  import content from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const s = content.uitgangspunten.spelregels;
</script>

<div class="container">
  <PaginaKop rood blok="B" titel={s.titel} kern={s.kern} samenvatting={s.lead} status="concept" />

  <div class="kolommen">
    <ol class="regels">
      {#each s.regels as regel, i}
        <li>
          <span class="nr" aria-hidden="true">{i + 1}</span>
          <p>{regel}</p>
        </li>
      {/each}
    </ol>

    <aside>
      <section class="uitvoering">
        <span class="label">{s.uitvoering.label}</span>
        <h2>{s.uitvoering.titel}</h2>
        {#each s.uitvoering.punten as punt, i}
          <div class="punt">
            <span class="cirkel" aria-hidden="true">{i + 1}</span>
            <p><b>{punt.titel}</b> {punt.tekst}</p>
          </div>
        {/each}
      </section>

      <section class="verdringing card">
        <span class="label dun">{s.uitvoering.verdringing_label}</span>
        <div class="tegen">
          <span class="a">{s.uitvoering.verdringing_links}</span>
          <span class="x">{s.uitvoering.verdringing_tegen}</span>
          <span class="b">{s.uitvoering.verdringing_rechts}</span>
        </div>
        <svg viewBox="0 0 24 22" width="24" height="22" aria-hidden="true"><path d="M12 2 V18 M5 12 L12 19 L19 12" /></svg>
        <div class="uitkomst">{s.uitvoering.verdringing_uitkomst}</div>
      </section>

      <section class="volgt">
        <span class="label dun">{s.principes.label}</span>
        <h2>{s.principes.titel}</h2>
        <p>{s.principes.tekst}</p>
      </section>
    </aside>
  </div>
</div>

<style>
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .kolommen {
    margin-top: 16px;
    display: grid;
    grid-template-columns: minmax(0, 1.5fr) minmax(0, 1fr);
    gap: 32px;
    align-items: start;
  }
  .regels {
    background: var(--surface);
    border-radius: var(--radius-l);
    padding: 6px 26px;
  }
  .regels li {
    display: flex;
    gap: 14px;
    align-items: flex-start;
    padding: 16px 0;
    border-bottom: 1px solid var(--border);
  }
  .regels li:last-child {
    border-bottom: 0;
  }
  .nr {
    flex: none;
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
  .regels p {
    margin: 0;
    line-height: 1.55;
  }
  aside {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .uitvoering {
    border-radius: var(--radius-l);
    padding: 26px;
    background: var(--vlak-blauw);
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .uitvoering h2 {
    margin: 0;
    font-size: 22px;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #fff;
  }
  .uitvoering .label {
    color: #8cc2f2;
  }
  .punt {
    display: flex;
    gap: 12px;
  }
  .punt p {
    margin: 0;
    font-size: 15px;
    line-height: 1.5;
  }
  .cirkel {
    flex: none;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: #fff;
    color: #004077;
    font-weight: 800;
    font-size: 13px;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .dun {
    color: var(--muted);
  }
  .verdringing {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 22px;
  }
  .tegen {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .tegen .a,
  .tegen .b {
    flex: 1;
    padding: 12px 10px;
    border-radius: var(--radius-s);
    font-size: 13px;
    font-weight: 700;
    text-align: center;
  }
  .tegen .a {
    border: 3px dashed var(--line1);
  }
  .tegen .b {
    background: var(--line2);
    color: #fff;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .tegen .b { color: #00305f; }
  }
  :global([data-theme='dark']) .tegen .b {
    color: #00305f;
  }
  .tegen .x {
    font-size: 13px;
    font-weight: 800;
    color: var(--value-text);
  }
  svg {
    align-self: center;
    fill: none;
    stroke: var(--value);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .uitkomst {
    padding: 12px;
    border-radius: var(--radius-s);
    background: var(--chip);
    font-size: 14px;
    font-weight: 700;
    text-align: center;
  }
  .volgt {
    border-radius: var(--radius-l);
    padding: 24px;
    border: 2px dashed var(--muted);
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .volgt h2 {
    margin: 0;
    font-size: 18px;
    letter-spacing: -0.02em;
  }
  .volgt p {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: var(--muted);
  }
  @media (max-width: 960px) {
    .kolommen {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
