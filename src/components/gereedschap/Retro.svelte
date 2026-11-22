<script>
  // Retrospectives: kies een retro, volg de stappen en noteer acties. In de presentatiestand groot, met een timer.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w, presenteren = false } = $props();

  const retros = $derived(w.retros ?? []);
  // svelte-ignore state_referenced_locally
  const start = () => ({ keuze: w.retros?.[0]?.id ?? '', notities: {}, acties: [], stap: 0 });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);
  const retro = $derived(retros.find((r) => r.id === d.keuze) ?? retros[0]);
  const stap = $derived(retro?.stappen[Math.min(d.stap, retro.stappen.length - 1)]);
  const totaal = $derived(retro?.stappen.reduce((s, st) => s + st.minuten, 0) ?? 0);
  let nieuweActie = $state('');

  // Timer per stap (niet bewaard).
  let resterend = $state(0);
  let loopt = $state(false);
  $effect(() => {
    resterend = (stap?.minuten ?? 0) * 60;
    loopt = false;
  });
  $effect(() => {
    if (!loopt) return;
    const t = setInterval(() => {
      if (resterend > 0) resterend--;
      else loopt = false;
    }, 1000);
    return () => clearInterval(t);
  });
  const mmss = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
  const sleutel = (i) => `${retro?.id}-${i}`;

  function kies(id) {
    d.keuze = id;
    d.stap = 0;
  }
  function naar(i) {
    d.stap = Math.max(0, Math.min(i, retro.stappen.length - 1));
  }
  function actie(e) {
    e.preventDefault();
    if (nieuweActie.trim()) d.acties.push({ wat: nieuweActie.trim(), wie: '' });
    nieuweActie = '';
  }

  export function inhoud() {
    if (!retro) return '';
    let html = doc.veld('Werkvorm', retro.naam);
    retro.stappen.forEach((st, i) => {
      const n = d.notities[sleutel(i)];
      if (n?.trim()) html += `<h3>${doc.p(st.titel).replace(/<\/?p>/g, '')}</h3>` + doc.lijst(n.split('\n'));
    });
    html += doc.kop('Acties') + (d.acties.length ? doc.tabel(['Actie', 'Wie'], d.acties.map((a) => [a.wat, a.wie || '–'])) : doc.p('Nog geen acties.'));
    return html;
  }
</script>

{#if retro}
  {#if presenteren}
    <div class="podium">
      <div class="voortgang" aria-hidden="true">
        {#each retro.stappen as _, i}<span class:gedaan={i < d.stap} class:nu={i === d.stap}></span>{/each}
      </div>
      <p class="metainfo">{retro.naam} · stap {d.stap + 1} van {retro.stappen.length}</p>
      <h2>{stap.titel}</h2>
      <p class="opdracht">{stap.tekst}</p>
      {#if stap.tip}<p class="tip"><b>Tip voor de coach:</b> {stap.tip}</p>{/if}
      <label class="wv-veld notitie">Notities bij deze stap<textarea class="wv-invoer" bind:value={d.notities[sleutel(d.stap)]} placeholder="Wat komt er uit? Eén punt per regel."></textarea></label>
      <div class="bediening">
        <div class="timer" aria-live="off">
          <span>Timer</span>
          <b class:op={resterend === 0}>{mmss(resterend)}</b>
        </div>
        <div class="knoppen">
          <button class="wv-knop" onclick={() => naar(d.stap - 1)} disabled={d.stap === 0}>← Vorige</button>
          <button class="wv-knop" onclick={() => (loopt = !loopt)}>{loopt ? 'Pauze' : resterend === 0 ? 'Opnieuw' : 'Start timer'}</button>
          {#if resterend === 0 && !loopt}<button class="wv-knop" onclick={() => (resterend = stap.minuten * 60)}>Reset</button>{/if}
          <button class="wv-knop wv-knop--vol" onclick={() => naar(d.stap + 1)} disabled={d.stap === retro.stappen.length - 1}>Volgende →</button>
        </div>
      </div>
    </div>
  {:else}
    <div class="keuze" role="radiogroup" aria-label="Kies een retro">
      {#each retros as r}
        <button class="optie" role="radio" aria-checked={r.id === retro.id} onclick={() => kies(r.id)}>
          <strong>{r.naam}</strong>
          <span>{r.kern}</span>
          <small>{r.stappen.length} stappen · {r.stappen.reduce((s, st) => s + st.minuten, 0)} min</small>
        </button>
      {/each}
    </div>

    <div class="retro">
      <ol class="stappen">
        {#each retro.stappen as st, i}
          <li class="wv-kaart" class:nu={i === d.stap}>
            <button class="stapkop" onclick={() => naar(i)} aria-expanded={i === d.stap}>
              <span class="nr">{i + 1}</span><strong>{st.titel}</strong><span class="min">{st.minuten} min</span>
            </button>
            {#if i === d.stap}
              <p>{st.tekst}</p>
              {#if st.tip}<p class="tip"><b>Tip:</b> {st.tip}</p>{/if}
              <label class="wv-veld">Notities<textarea class="wv-invoer" bind:value={d.notities[sleutel(i)]} placeholder="Eén punt per regel"></textarea></label>
              {#if i < retro.stappen.length - 1}<button class="wv-knop" onclick={() => naar(i + 1)}>Volgende stap →</button>{/if}
            {/if}
          </li>
        {/each}
      </ol>
      <aside class="wv-kaart acties">
        <h2>Acties</h2>
        <p class="klein">Liever één actie die echt gebeurt dan vijf die blijven liggen. Totale tijd: {totaal} minuten.</p>
        {#each d.acties as a, i}
          <div class="actie">
            <input class="wv-invoer" bind:value={a.wat} aria-label="Actie {i + 1}" />
            <div class="wv-rij"><input class="wv-invoer" bind:value={a.wie} placeholder="Wie?" aria-label="Wie pakt actie {i + 1} op" /><button class="wv-weg" onclick={() => d.acties.splice(i, 1)} aria-label="Actie {i + 1} verwijderen">×</button></div>
          </div>
        {/each}
        <form class="wv-rij" onsubmit={actie}>
          <input class="wv-invoer" bind:value={nieuweActie} placeholder="Nieuwe actie…" aria-label="Nieuwe actie" />
          <button class="wv-knop" type="submit">+</button>
        </form>
      </aside>
    </div>
  {/if}
{/if}

<style>
  .keuze {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
    gap: 10px;
    margin-bottom: 14px;
  }
  .optie {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 16px;
    border: 2px solid transparent;
    border-radius: var(--radius-m);
    background: var(--surface);
    color: var(--ink);
    text-align: left;
  }
  .optie[aria-checked='true'] {
    border-color: var(--line1);
  }
  .optie span {
    font-size: 14px;
    color: var(--muted);
  }
  .optie small {
    font-weight: 700;
    font-size: 12.5px;
  }
  .retro {
    display: grid;
    grid-template-columns: minmax(0, 7fr) minmax(0, 4fr);
    gap: 16px;
    align-items: start;
  }
  .stappen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .stappen li {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 16px;
  }
  .stappen li.nu {
    outline: 2px solid var(--line1);
  }
  .stappen p {
    margin: 0;
  }
  .stapkop {
    display: flex;
    align-items: center;
    gap: 12px;
    border: 0;
    background: transparent;
    color: var(--ink);
    padding: 0;
    text-align: left;
    font-size: 16px;
  }
  .nr {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--chip);
    font-weight: 700;
    font-size: 13px;
    flex-shrink: 0;
  }
  .nu .nr {
    background: var(--value);
    color: #fff;
  }
  .min {
    margin-left: auto;
    font-size: 13px;
    color: var(--muted);
  }
  .tip {
    font-size: 14px;
    color: var(--muted);
  }
  .acties {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .acties h2 {
    font-size: 18px;
  }
  .klein {
    margin: 0;
    font-size: 13.5px;
    color: var(--muted);
  }
  .actie {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border);
  }

  /* Presentatiestand */
  .podium {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(20px, 3vw, 36px);
    border-radius: var(--radius-l);
    background: #004077;
    color: #fff;
    min-height: 70vh;
  }
  .voortgang {
    display: flex;
    gap: 6px;
  }
  .voortgang span {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: #2a659f;
  }
  .voortgang .gedaan {
    background: #fff;
  }
  .voortgang .nu {
    background: #ff5a4c;
  }
  .metainfo {
    margin: 0;
    opacity: 0.85;
  }
  .podium h2 {
    font-size: clamp(36px, 5vw, 60px);
    line-height: 1.05;
    color: #fff;
  }
  .opdracht {
    margin: 0;
    font-size: clamp(19px, 2vw, 24px);
    line-height: 1.5;
    max-width: 50ch;
  }
  .podium .tip {
    color: #c9d8ea;
    font-size: 16px;
    margin: 0;
  }
  .notitie {
    color: #fff;
  }
  .notitie textarea {
    background: #0a4c88;
    color: #fff;
    border-color: #2a659f;
  }
  .bediening {
    margin-top: auto;
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: flex-end;
    justify-content: space-between;
  }
  .timer {
    display: flex;
    flex-direction: column;
  }
  .timer span {
    font-size: 14px;
    opacity: 0.85;
  }
  .timer b {
    font-size: clamp(48px, 7vw, 84px);
    line-height: 1;
    font-variant-numeric: tabular-nums;
  }
  .timer b.op {
    color: #ff5a4c;
  }
  .knoppen {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .podium .wv-knop {
    background: #fff;
    color: #004077;
  }
  .podium .wv-knop--vol {
    background: #ff5a4c;
    color: #fff;
  }
  .podium .wv-knop:disabled {
    opacity: 0.4;
  }
  @media (max-width: 860px) {
    .retro {
      grid-template-columns: minmax(0, 1fr);
    }
  }
</style>
