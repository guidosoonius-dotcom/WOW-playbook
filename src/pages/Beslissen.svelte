<script>
  import content, { rolById } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import BeslisCode from '../components/BeslisCode.svelte';
  import RolIcoon from '../components/RolIcoon.svelte';

  const themas = [...new Set(content.beslismatrix.map((b) => b.thema))];
  let thema = $state('alle');
  let rol = $state(prefs.rol ?? 'alle');
  let alleenInvloed = $state(false);

  const rijen = $derived(
    content.beslismatrix.filter(
      (b) =>
        (thema === 'alle' || b.thema === thema) &&
        (rol === 'alle' || !alleenInvloed || ['B', 'A'].includes(b.rollen[rol]))
    )
  );
  const rolNaam = $derived(rol === 'alle' ? null : rolById(rol)?.titel);
</script>

<div class="container">
  <PaginaKop
    eyebrow="3 · Rollen"
    titel="Wie beslist wat?"
    kern="Per besluit één rol die beslist. Zo weet iedereen bij wie hij moet zijn, en hoeft niemand op toestemming te wachten."
    status="concept"
  />

  <ul class="legenda" aria-label="Legenda">
    {#each Object.entries(content.beslisCodes) as [code, uitleg]}
      <li><BeslisCode {code} klein /> {uitleg}</li>
    {/each}
  </ul>

  <div class="filters">
    <label>
      <span>Thema</span>
      <select bind:value={thema}>
        <option value="alle">Alle thema's</option>
        {#each themas as t}<option value={t}>{t}</option>{/each}
      </select>
    </label>
    <label>
      <span>Bekijk als</span>
      <select bind:value={rol}>
        <option value="alle">Alle rollen</option>
        {#each content.rollen as r}<option value={r.id}>{r.titel}</option>{/each}
      </select>
    </label>
    {#if rol !== 'alle'}
      <label class="vink">
        <input type="checkbox" bind:checked={alleenInvloed} />
        Alleen waar ik beslis of adviseer
      </label>
    {/if}
  </div>

  <!-- Tabel op brede schermen. -->
  <div class="tabelbox">
    <table>
      <caption class="sr-only">Beslismatrix: per besluit de rol van elke functie</caption>
      <thead>
        <tr>
          <th scope="col" class="besluit">Besluit</th>
          {#each content.rollen as r}
            <th scope="col" class:gekozen={rol === r.id}>
              <a href={href('rollen/' + r.id)} title={r.titel}><RolIcoon rol={r.id} size={18} /><span>{r.titel}</span></a>
            </th>
          {/each}
        </tr>
      </thead>
      <tbody>
        {#each rijen as b}
          <tr>
            <th scope="row" class="besluit">{b.besluit}<small>{b.thema}</small></th>
            {#each content.rollen as r}
              <td class:gekozen={rol === r.id}><BeslisCode code={b.rollen[r.id]} /></td>
            {/each}
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Kaarten op smalle schermen. -->
  <ul class="kaarten">
    {#each rijen as b}
      {@const beslisser = Object.entries(b.rollen).find(([, c]) => c === 'B')[0]}
      <li class="card">
        <strong>{b.besluit}</strong>
        <span class="thema">{b.thema}</span>
        {#if rolNaam && b.rollen[rol]}
          <span class="jouw">Jij ({rolNaam}): <BeslisCode code={b.rollen[rol]} klein /> {content.beslisCodes[b.rollen[rol]]}</span>
        {/if}
        <span class="wie">
          <BeslisCode code="B" klein /> {rolById(beslisser).titel}
        </span>
        <span class="overig">
          {#each Object.entries(b.rollen).filter(([, c]) => c !== 'B') as [rid, c]}
            <span><BeslisCode code={c} klein /> {rolById(rid).titel}</span>
          {/each}
        </span>
      </li>
    {/each}
  </ul>

  {#if !rijen.length}<p>Geen besluiten voor deze selectie.</p>{/if}
</div>

<style>
  .legenda {
    list-style: none;
    margin: 8px 0 20px;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    font-size: 14px;
  }
  .legenda li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .filters {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    gap: 12px 20px;
    margin-bottom: 20px;
  }
  .filters label {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  select {
    height: 44px;
    padding: 0 14px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--bg);
    color: var(--ink);
    font: inherit;
    font-weight: 500;
  }
  .filters .vink {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    height: 44px;
    color: var(--ink);
    font-weight: 500;
  }
  .vink input {
    width: 18px;
    height: 18px;
    accent-color: var(--line1);
  }
  .tabelbox {
    overflow-x: auto;
    border-radius: var(--radius-m);
    border: 1px solid var(--border);
  }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14.5px;
  }
  th,
  td {
    padding: 10px 8px;
    border-bottom: 1px solid var(--border);
    text-align: center;
  }
  thead th {
    position: sticky;
    top: 0;
    background: var(--surface);
    font-size: 12.5px;
    vertical-align: bottom;
  }
  thead a {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    color: var(--ink);
    text-decoration: none;
    font-weight: 600;
  }
  .besluit {
    text-align: left;
    min-width: 260px;
    font-weight: 600;
  }
  .besluit small {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
  }
  .gekozen {
    background: color-mix(in srgb, var(--line1) 9%, transparent);
  }
  tbody tr:hover {
    background: var(--surface);
  }
  .kaarten {
    display: none;
    list-style: none;
    margin: 0;
    padding: 0;
    flex-direction: column;
    gap: 10px;
  }
  .kaarten li {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .thema {
    font-size: 13px;
    color: var(--muted);
    margin-top: -4px;
  }
  .wie,
  .jouw,
  .overig span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
  .jouw {
    font-weight: 600;
  }
  .overig {
    display: flex;
    flex-wrap: wrap;
    gap: 6px 14px;
  }
  @media (max-width: 860px) {
    .tabelbox {
      display: none;
    }
    .kaarten {
      display: flex;
    }
  }
</style>
