<script>
  import content from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const h = content.hulpmiddelen.hulpmiddelen;
</script>

<div class="container">
  <PaginaKop rood blok="D" titel={h.titel} kern={h.kern} samenvatting={h.lead} status="concept" />

  <ul class="systemen">
    {#each h.systemen as s, i}
      <li class="systeem">
        <span class="spoor s{i}">{s.spoor}</span>
        <h2>{s.titel}</h2>
        <p>{s.voor}</p>
        <p class="primair">{s.primair}</p>
      </li>
    {/each}
  </ul>

  <section class="daarnaast" aria-labelledby="daarnaast-kop">
    <h2 id="daarnaast-kop">{h.daarnaast.titel}</h2>
    <p class="dlead">{h.daarnaast.tekst}</p>
    {#each h.daarnaast.tools as t}
      <article class="tool">
        <div class="tekst">
          <h3>{t.naam}</h3>
          <p>{t.wat}</p>
          <p>{t.gebruik}</p>
        </div>
        <ol class="keten">
          {#each t.rollen as r, i}
            <li>
              <span class="nr" aria-hidden="true">{i + 1}</span>
              <div><b>{r.rol}</b><span>{r.taak}</span></div>
            </li>
          {/each}
        </ol>
      </article>
    {/each}
  </section>

  <p class="volgt">{h.visual_volgt}</p>
  <p class="door">Zoek je een document om in te vullen? Kijk bij <a href={href('templates')}>Templates</a>.</p>
</div>

<style>
  ul,
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .systemen {
    margin-top: 28px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .systeem {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border-radius: var(--radius-l);
    background: var(--surface);
  }
  .systeem h2 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .systeem p {
    margin: 0;
    line-height: 1.55;
    color: var(--muted);
  }
  .systeem .primair {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--border);
    font-weight: 600;
    color: var(--ink);
  }
  .spoor {
    align-self: flex-start;
    padding: 4px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    background: var(--line2);
  }
  .spoor.s0 {
    background: #3f8fd8;
  }
  .spoor.s1 {
    background: var(--line1);
    color: var(--on-line1);
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .spoor { color: #00305f; }
  }
  :global([data-theme='dark']) .spoor {
    color: #00305f;
  }
  .daarnaast {
    margin-top: 40px;
  }
  .daarnaast h2 {
    margin: 0 0 6px;
    font-size: 26px;
    letter-spacing: -0.025em;
  }
  .dlead {
    margin: 0 0 16px;
    color: var(--muted);
    max-width: 72ch;
    line-height: 1.55;
  }
  .tool {
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 32px;
    padding: 28px;
    border-radius: var(--radius-l);
    background: var(--surface);
    align-items: start;
  }
  .tool h3 {
    margin: 0 0 10px;
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  .tool p {
    margin: 0 0 10px;
    line-height: 1.55;
    color: var(--muted);
  }
  .keten {
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
  }
  .keten::before {
    content: '';
    position: absolute;
    left: 15px;
    top: 16px;
    bottom: 16px;
    border-left: 4px solid var(--line2);
  }
  .keten li {
    position: relative;
    display: flex;
    gap: 14px;
    align-items: flex-start;
  }
  .nr {
    flex: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--line1);
    color: var(--on-line1);
    font-weight: 800;
    font-size: 13px;
    border: 3px solid var(--surface);
    box-sizing: border-box;
  }
  .keten b {
    display: block;
    font-size: 15px;
  }
  .keten span:not(.nr) {
    font-size: 14px;
    line-height: 1.45;
    color: var(--muted);
  }
  .volgt {
    margin: 24px 0 0;
    font-size: 13.5px;
    color: var(--muted);
  }
  .door {
    margin: 8px 0 0;
  }
  @media (max-width: 960px) {
    .systemen,
    .tool {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
