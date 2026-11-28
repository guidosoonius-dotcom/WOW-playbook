<script>
  // Kaderscheck: ja/nee per vraag; bij elke "ja" zie je wie je erbij haalt.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';
  import { href } from '../../lib/router.svelte.js';

  let { w } = $props();

  const onderwerpen = $derived(w.onderwerpen ?? []);
  const start = () => ({ initiatief: '', antwoorden: {} });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const sleutel = (oi, vi) => `${oi}-${vi}`;
  const totaalVragen = $derived(onderwerpen.reduce((s, o) => s + o.vragen.length, 0));
  const beantwoord = $derived(Object.values(d.antwoorden).filter((v) => v !== null && v !== undefined).length);
  const betrekken = $derived(
    onderwerpen
      .map((o, oi) => ({ ...o, redenen: o.vragen.filter((_, vi) => d.antwoorden[sleutel(oi, vi)] === true) }))
      .filter((o) => o.redenen.length)
  );
  function zet(oi, vi, waarde) {
    const k = sleutel(oi, vi);
    d.antwoorden[k] = d.antwoorden[k] === waarde ? null : waarde;
  }

  export function inhoud() {
    return (
      doc.veld('Initiatief', d.initiatief) +
      doc.p(`${beantwoord} van ${totaalVragen} vragen beantwoord.`) +
      doc.kop('Wie haal je erbij?') +
      (betrekken.length ? betrekken.map((o) => `<h3>${o.naam}: ${o.wie}</h3>` + doc.lijst(o.redenen)).join('') : doc.p('Op basis van de antwoorden hoeft er geen specialist bij.')) +
      doc.kop('Alle antwoorden') +
      doc.tabel(['Onderwerp', 'Vraag', 'Antwoord'], onderwerpen.flatMap((o, oi) => o.vragen.map((v, vi) => [o.naam, v, d.antwoorden[sleutel(oi, vi)] === true ? 'Ja' : d.antwoorden[sleutel(oi, vi)] === false ? 'Nee' : '–'])))
    );
  }
</script>

<div class="check">
  <div class="links">
    <div class="wv-kaart">
      <label class="wv-veld">Initiatief<small>Een epic, grote feature of nieuw product</small><input class="wv-invoer" bind:value={d.initiatief} placeholder="Bijvoorbeeld: Zelf diensten ruilen in de app" /></label>
    </div>
    {#each onderwerpen as o, oi}
      <section class="wv-kaart onderwerp">
        <h2>{o.naam}</h2>
        {#each o.vragen as v, vi}
          <div class="vraag">
            <span>{v}</span>
            <span class="wv-segment" role="group" aria-label={v}>
              <button aria-pressed={d.antwoorden[sleutel(oi, vi)] === true} onclick={() => zet(oi, vi, true)}>ja</button>
              <button aria-pressed={d.antwoorden[sleutel(oi, vi)] === false} onclick={() => zet(oi, vi, false)}>nee</button>
            </span>
          </div>
        {/each}
      </section>
    {/each}
  </div>

  <aside class="rechts">
    <div class="wv-kaart uitkomst">
      <p class="voortgang">{beantwoord} van {totaalVragen} vragen beantwoord</p>
      <h2>Wie haal je erbij?</h2>
      {#if betrekken.length}
        <ul>
          {#each betrekken as o}
            <li>
              <strong>{o.wie.replace(/^\w/, (c) => c.toUpperCase())}</strong>
              <span class="over">{o.naam}</span>
              <ul class="redenen">{#each o.redenen as r}<li>{r}</li>{/each}</ul>
            </li>
          {/each}
        </ul>
      {:else if beantwoord}
        <p class="geen">Op basis van je antwoorden hoeft er geen specialist bij. Het team beslist zelf, binnen de kaders.</p>
      {:else}
        <p class="geen">Beantwoord de vragen; hier verschijnt wie je erbij haalt.</p>
      {/if}
      <a class="meer" href={href('uitleg/kaders')}>Meer over de kaders voor teams →</a>
    </div>
  </aside>
</div>

<style>
  .check {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    gap: 16px;
    align-items: start;
  }
  .links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .onderwerp {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .onderwerp h2 {
    font-size: 18px;
    margin-bottom: 4px;
  }
  .vraag {
    display: flex;
    gap: 14px;
    align-items: center;
    justify-content: space-between;
    padding: 8px 10px;
    border-radius: var(--radius-s);
    background: var(--bg);
    font-size: 15px;
  }
  .rechts {
    position: sticky;
    top: 90px;
  }
  .uitkomst h2 {
    font-size: 19px;
    margin: 4px 0 12px;
  }
  .voortgang {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
  .uitkomst > ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .uitkomst > ul > li {
    padding: 10px 12px;
    border-radius: var(--radius-s);
    background: var(--bg);
    border-left: 4px solid var(--value);
  }
  .over {
    display: block;
    font-size: 13px;
    color: var(--muted);
  }
  .redenen {
    margin: 6px 0 0;
    padding-left: 18px;
    font-size: 13.5px;
  }
  .geen {
    margin: 0;
    color: var(--muted);
  }
  .meer {
    display: inline-block;
    margin-top: 14px;
    font-weight: 600;
    font-size: 14px;
  }
  @media (max-width: 900px) {
    .check {
      grid-template-columns: minmax(0, 1fr);
    }
    .rechts {
      position: static;
    }
  }
</style>
