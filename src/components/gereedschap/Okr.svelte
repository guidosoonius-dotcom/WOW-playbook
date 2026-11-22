<script>
  // OKR-opsteller: doelen met meetbare resultaten, met een check op getal en uitkomst, en de voortgang.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';

  let { w } = $props();

  const NIVEAUS = ['Portfolio', 'Productgroep', 'Team'];
  const kr = () => ({ tekst: '', start: '', doel: '', nu: '' });
  const okr = () => ({ doel: '', krs: [kr(), kr()] });
  const start = () => ({ niveau: 'Productgroep', wie: '', kwartaal: '', okrs: [okr()] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  const outputWoorden = $derived((w.output_woorden ?? []).map((x) => x.toLowerCase()));
  function hints(r) {
    const t = r.tekst.toLowerCase();
    if (!t.trim()) return [];
    const h = [];
    if (!/\d/.test(t) && r.doel === '') h.push('Geen getal: hoe weet je dat het gehaald is?');
    const woord = outputWoorden.find((x) => t.includes(x));
    if (woord) h.push(`"${woord}" klinkt als output. Wat merkt de gebruiker ervan?`);
    return h;
  }
  function voortgang(r) {
    const s = Number(r.start), g = Number(r.doel), n = Number(r.nu);
    if (r.start === '' || r.doel === '' || r.nu === '' || g === s) return null;
    return Math.max(0, Math.min(100, Math.round(((n - s) / (g - s)) * 100)));
  }

  export function inhoud() {
    return (
      doc.veld('Niveau', d.niveau) +
      doc.veld('Voor', d.wie) +
      doc.veld('Periode', d.kwartaal) +
      d.okrs
        .filter((o) => o.doel.trim())
        .map(
          (o, i) =>
            doc.kop(`Doel ${i + 1}: ${o.doel}`) +
            doc.tabel(
              ['Meetbaar resultaat', 'Start', 'Doel', 'Nu', 'Voortgang'],
              o.krs.filter((r) => r.tekst.trim()).map((r) => [r.tekst, r.start || '–', r.doel || '–', r.nu || '–', voortgang(r) === null ? '–' : `${voortgang(r)}%`])
            )
        )
        .join('') || doc.p('Nog geen doelen ingevuld.')
    );
  }
</script>

<div class="okr">
  <div class="wv-kaart kop">
    <div class="wv-veld">
      Niveau
      <div class="wv-segment" role="radiogroup" aria-label="Niveau">
        {#each NIVEAUS as n}<button role="radio" aria-checked={d.niveau === n} onclick={() => (d.niveau = n)}>{n}</button>{/each}
      </div>
    </div>
    <label class="wv-veld">Voor<input class="wv-invoer" bind:value={d.wie} placeholder="Naam van de divisie, productgroep of het team" /></label>
    <label class="wv-veld">Periode<input class="wv-invoer" bind:value={d.kwartaal} placeholder="Bijvoorbeeld: Q1 2027" /></label>
  </div>

  {#each d.okrs as o, oi}
    <section class="wv-kaart doel">
      <div class="doelkop">
        <span class="nr">{oi + 1}</span>
        <label class="wv-veld groei">Doel<small>Waar willen we naartoe? Inspirerend en kwalitatief.</small><input class="wv-invoer" bind:value={o.doel} placeholder="Collega's regelen hun rooster zelf" /></label>
        {#if d.okrs.length > 1}<button class="wv-weg" onclick={() => d.okrs.splice(oi, 1)} aria-label="Doel {oi + 1} verwijderen">×</button>{/if}
      </div>
      <div class="krs">
        <div class="krkop" aria-hidden="true"><span>Meetbaar resultaat</span><span>Start</span><span>Doel</span><span>Nu</span><span>Voortgang</span><span></span></div>
        {#each o.krs as r, ri}
          {@const h = hints(r)}
          {@const v = voortgang(r)}
          <div class="kr">
            <input class="wv-invoer" bind:value={r.tekst} placeholder="Bijvoorbeeld: aandeel ruilen via de app" aria-label="Resultaat {ri + 1} bij doel {oi + 1}" />
            <input class="wv-invoer getal" bind:value={r.start} inputmode="decimal" placeholder="20" aria-label="Startwaarde" />
            <input class="wv-invoer getal" bind:value={r.doel} inputmode="decimal" placeholder="80" aria-label="Doelwaarde" />
            <input class="wv-invoer getal" bind:value={r.nu} inputmode="decimal" placeholder="–" aria-label="Huidige waarde" />
            <span class="balk" title={v === null ? 'Vul start, doel en nu in' : `${v}%`}><span style="width: {v ?? 0}%"></span><b>{v === null ? '–' : v + '%'}</b></span>
            <button class="wv-weg" onclick={() => o.krs.splice(ri, 1)} aria-label="Resultaat {ri + 1} verwijderen">×</button>
          </div>
          {#if h.length}<ul class="hints">{#each h as x}<li>{x}</li>{/each}</ul>{/if}
        {/each}
        {#if o.krs.length < 5}<button class="wv-knop wv-knop--link" onclick={() => o.krs.push(kr())}>+ Meetbaar resultaat</button>{/if}
      </div>
    </section>
  {/each}
  {#if d.okrs.length < 5}<button class="wv-knop nieuw" onclick={() => d.okrs.push(okr())}>+ Doel toevoegen</button>{/if}
</div>

<style>
  .okr {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .nieuw {
    align-self: flex-start;
  }
  .kop {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) minmax(0, 0.6fr);
    gap: 14px;
    align-items: end;
  }
  .doel {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .doelkop {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }
  .groei {
    flex: 1;
  }
  .nr {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--value);
    color: #fff;
    font-weight: 800;
    margin-bottom: 4px;
  }
  .krs {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .krkop,
  .kr {
    display: grid;
    grid-template-columns: minmax(0, 3fr) 72px 72px 72px minmax(110px, 1fr) 36px;
    gap: 8px;
    align-items: center;
  }
  .krkop {
    font-size: 12.5px;
    font-weight: 700;
    color: var(--muted);
  }
  .getal {
    text-align: center;
  }
  .balk {
    position: relative;
    height: 28px;
    border-radius: var(--radius-tag);
    background: var(--chip);
    overflow: hidden;
  }
  .balk span {
    position: absolute;
    inset: 0 auto 0 0;
    background: var(--line2);
    opacity: 0.35;
  }
  .balk b {
    position: relative;
    display: grid;
    place-items: center;
    height: 100%;
    font-size: 13px;
  }
  .hints {
    margin: -2px 0 4px;
    padding: 6px 10px 6px 26px;
    border-radius: var(--radius-s);
    background: #fff6e0;
    color: #6b4f00;
    font-size: 13px;
  }
  @media (max-width: 860px) {
    .kop {
      grid-template-columns: minmax(0, 1fr);
    }
    .krkop {
      display: none;
    }
    .kr {
      grid-template-columns: repeat(3, minmax(0, 1fr)) 36px;
    }
    .kr > :first-child,
    .kr .balk {
      grid-column: 1 / -1;
    }
  }
</style>
