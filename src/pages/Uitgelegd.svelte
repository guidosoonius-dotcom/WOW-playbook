<script>
  import content from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import IsoTekening from '../components/IsoTekening.svelte';
  const BEELD = { waardestroom: 'waardestroom', productteam: 'productteam', 'epics-features-stories': 'backlog' };
  const GROEPEN = [
    { id: 'bouwstenen', titel: 'De bouwstenen', kern: 'De begrippen waar het nieuwe model op rust, met kenmerken en voorbeelden.' },
    { id: 'praktijk', titel: 'In de praktijk', kern: 'Wat het betekent voor je dagelijkse werk: producten, beheer, lopend werk, meten en kaders.' }
  ];
</script>

<div class="container">
  <PaginaKop rood eyebrow="Uitgelegd" titel="Uitgelegd" kern="De bouwstenen van het model, en wat ze betekenen in de praktijk." />
  {#each GROEPEN as g}
  <section class="groep" aria-labelledby="groep-{g.id}">
  <h2 id="groep-{g.id}">{g.titel}</h2>
  <p class="groepkern">{g.kern}</p>
  <ul class="tegels">
    {#each content.uitleg.filter((u) => (u.groep ?? 'bouwstenen') === g.id) as u}
      <li>
        <a href={href('uitleg/' + u.id)}>
          {#if BEELD[u.id]}<span class="beeld" aria-hidden="true"><IsoTekening naam={BEELD[u.id]} klein /></span>{/if}
          <strong>{u.titel}</strong>
          <span>{u.kern}</span>
          <small>Lees de uitleg →</small>
        </a>
      </li>
    {/each}
  </ul>
  </section>
  {/each}
</div>

<style>
  .beeld {
    display: block;
    padding: 12px;
    margin-bottom: 8px;
    border-radius: var(--radius-s);
    background: var(--bg);
  }
  .beeld :global(svg) {
    height: 200px;
  }
  .groep {
    padding-block: 20px;
  }
  .groep h2 {
    font-size: 26px;
  }
  .groepkern {
    margin: 6px 0 0;
    color: var(--muted);
  }
  .tegels {
    list-style: none;
    margin: 16px 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
    gap: 14px;
  }
  a {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 24px;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  a:hover {
    background: var(--panel);
  }
  strong {
    font-size: 20px;
  }
  span {
    color: var(--muted);
  }
  small {
    margin-top: auto;
    font-size: 14px;
    font-weight: 600;
    color: var(--line1);
  }
</style>
