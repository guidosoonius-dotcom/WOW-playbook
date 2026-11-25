<script>
  import content from '../lib/content.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const t = content.teams;
</script>

<div class="container">
  <PaginaKop rood blok="B" titel={t.titel} kern={t.kern} samenvatting={t.lead} status="concept" />

  <section class="inleiding card">
    <div>
      <h2>{t.heeft.titel}</h2>
      <ul class="punten">
        {#each t.heeft.punten as p}<li>{p}</li>{/each}
      </ul>
    </div>
    <div>
      <h2>{t.lezen.titel}</h2>
      <p><b>{t.lezen.blijvend_label}</b> {t.lezen.blijvend}</p>
      <p><b>{t.lezen.functie_label}</b> {t.lezen.functie}</p>
    </div>
  </section>

  {#each [['blijvend', t.blijvend], ['tijdelijk', t.tijdelijk]] as [soort, groep]}
    <section class="groep" aria-labelledby="g-{soort}">
      <div class="groepkop">
        <span class="lijn {soort}" aria-hidden="true"></span>
        <h2 id="g-{soort}">{groep.titel}</h2>
        <span class="groepkern">{groep.kern}</span>
      </div>
      <ul class="teams">
        {#each groep.teams as team}
          <li class="team" class:accent={team.accent} class:streep={team.streep}>
            <span class="plek {soort}">{team.plek}</span>
            <h3>{team.titel}</h3>
            <p>{team.tekst}</p>
            {#if team.label}<span class="label">{team.label}</span>{/if}
            {#if team.volgt}<p class="volgt"><b>Volgt:</b> {team.volgt}</p>{/if}
          </li>
        {/each}
      </ul>
    </section>
  {/each}

  <section class="rollen">
    <h2>{t.rollen.titel}</h2>
    <p>{t.rollen.tekst}</p>
  </section>
</div>

<style>
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .inleiding {
    margin-top: 24px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 40px;
    padding: 28px 32px;
  }
  .inleiding h2 {
    margin: 0 0 10px;
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  .inleiding p {
    margin: 0 0 10px;
    line-height: 1.6;
    color: var(--muted);
  }
  .inleiding b {
    color: var(--ink);
  }
  .punten {
    list-style: disc;
    padding-left: 20px;
    line-height: 1.7;
  }
  .groep {
    margin-top: 36px;
  }
  .groepkop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 14px;
    margin-bottom: 14px;
  }
  .groepkop h2 {
    margin: 0;
    font-size: 22px;
    letter-spacing: -0.02em;
  }
  .groepkern {
    font-size: 14px;
    color: var(--muted);
  }
  .lijn {
    width: 56px;
    height: 0;
    border-top: 6px solid var(--line2);
    border-radius: 3px;
  }
  .lijn.tijdelijk {
    border-top: 5px solid var(--line1);
    border-radius: 0;
  }
  .teams {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .team {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 22px;
    border-radius: 20px;
    background: var(--surface);
  }
  .team.accent {
    outline: 2px solid var(--value);
    outline-offset: -2px;
  }
  .team.streep {
    background: transparent;
    border: 2px dashed var(--muted);
  }
  .team h3 {
    margin: 0;
    font-size: 20px;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }
  .team p {
    margin: 0;
    font-size: 14.5px;
    line-height: 1.55;
    color: var(--muted);
  }
  .plek,
  .label {
    align-self: flex-start;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 11.5px;
    font-weight: 700;
    line-height: 1.3;
  }
  .plek {
    background: var(--line2);
    color: #fff;
  }
  .plek.tijdelijk {
    background: var(--line1);
    color: var(--on-line1);
  }
  .label {
    background: var(--chip);
    color: var(--ink);
  }
  .accent .label {
    background: var(--value);
    color: #fff;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .plek,
    :global(:root:not([data-theme='light'])) .accent .label { color: #00305f; }
  }
  :global([data-theme='dark']) .plek,
  :global([data-theme='dark']) .accent .label {
    color: #00305f;
  }
  .volgt {
    padding-top: 10px;
    border-top: 1px dashed var(--muted);
    font-size: 13.5px !important;
  }
  .volgt b {
    color: var(--ink);
  }
  .rollen {
    margin-top: 36px;
    padding: 28px 32px;
    border-radius: var(--radius-l);
    background: var(--vlak-blauw);
    color: #fff;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.3fr);
    gap: 40px;
    align-items: center;
  }
  .rollen h2 {
    margin: 0;
    font-size: 26px;
    line-height: 1.2;
    letter-spacing: -0.02em;
    color: #fff;
  }
  .rollen p {
    margin: 0;
    line-height: 1.6;
    color: #e3ecf6;
  }
  @media (max-width: 960px) {
    .teams {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
  @media (max-width: 700px) {
    .inleiding,
    .rollen,
    .teams {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
