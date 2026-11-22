<script>
  // Lopende projecten triëren: drie vragen per project; de uitkomst volgt vanzelf.
  import { Bewaard, doc } from '../../lib/werkvorm.svelte.js';
  import { href } from '../../lib/router.svelte.js';

  let { w } = $props();

  const VRAGEN = [
    { id: 'af', vraag: 'Bijna af?', uitleg: 'Minder dan een kwartaal werk, scope duidelijk' },
    { id: 'groot', vraag: 'Groot of onzeker?', uitleg: 'Langer dan een kwartaal, of waarde onzeker' },
    { id: 'bestaand', vraag: 'Bestaand product?', uitleg: 'Doorlopend verbeteren van iets wat er al is' }
  ];
  const UITKOMST = {
    afmaken: { naam: 'Afmaken', kleur: '#004077', stap: 'Afmaken zoals gepland; spreek af welk productteam het daarna overneemt.' },
    epic: { naam: 'Omzetten naar epic', kleur: '#c8261b', stap: 'Werk een lean business case uit en zet de epic in de portfoliokanban.' },
    team: { naam: 'Naar productteam', kleur: '#1473c3', stap: 'Zet het werk op de backlog van het productteam.' },
    bespreken: { naam: 'Bespreken', kleur: '#8e7f78', stap: 'Past in geen van de drie: bespreek het in het portfolio-overleg.' },
    open: { naam: 'Nog kiezen', kleur: '#bcaaa3', stap: '' }
  };
  const nieuw = () => ({ naam: '', af: null, groot: null, bestaand: null, afspraak: '' });
  const start = () => ({ divisie: '', projecten: [nieuw(), nieuw(), nieuw()] });
  // svelte-ignore state_referenced_locally
  export const opslag = new Bewaard(w.id, start);
  const d = $derived(opslag.data);

  // De vragen in volgorde: de eerste "ja" bepaalt de uitkomst.
  function uitkomst(p) {
    if (p.af === true) return 'afmaken';
    if (p.af === null) return 'open';
    if (p.groot === true) return 'epic';
    if (p.groot === null) return 'open';
    if (p.bestaand === true) return 'team';
    if (p.bestaand === null) return 'open';
    return 'bespreken';
  }
  // Een vraag is pas aan de beurt als de vorige "nee" is.
  const actief = (p, i) => i === 0 || VRAGEN.slice(0, i).every((v) => p[v.id] === false);
  const metNaam = $derived(d.projecten.filter((p) => p.naam.trim()));
  const telling = $derived(Object.keys(UITKOMST).map((k) => ({ k, n: metNaam.filter((p) => uitkomst(p) === k).length })).filter((t) => t.n || t.k !== 'bespreken'));

  function zet(p, vraag, waarde) {
    p[vraag] = p[vraag] === waarde ? null : waarde;
    // Latere vragen doen er niet meer toe na een "ja".
    const i = VRAGEN.findIndex((v) => v.id === vraag);
    if (p[vraag] !== false) for (const v of VRAGEN.slice(i + 1)) p[v.id] = null;
  }

  export function inhoud() {
    return (
      doc.veld('Divisie', d.divisie) +
      doc.kop('Overzicht') +
      doc.p(telling.map((t) => `${UITKOMST[t.k].naam}: ${t.n}`).join(' · ')) +
      doc.kop('Per project') +
      (metNaam.length
        ? doc.tabel(['Project', 'Uitkomst', 'Volgende stap en wie'], metNaam.map((p) => [p.naam, UITKOMST[uitkomst(p)].naam, p.afspraak || UITKOMST[uitkomst(p)].stap || '–']))
        : doc.p('Nog geen projecten ingevuld.'))
    );
  }
</script>

<div class="trieren">
  <div class="wv-kaart kop">
    <label class="wv-veld">Divisie<input class="wv-invoer" bind:value={d.divisie} placeholder="Bijvoorbeeld: divisie Facilitair" /></label>
    <div class="telling">
      {#each telling as t}
        <div class="tel" style="--k: {UITKOMST[t.k].kleur}"><b>{t.n}</b><span>{UITKOMST[t.k].naam}</span></div>
      {/each}
    </div>
  </div>

  <div class="wv-tabel-wrap">
    <table class="wv-tabel">
      <thead>
        <tr>
          <th>Project</th>
          {#each VRAGEN as v}<th title={v.uitleg}>{v.vraag}</th>{/each}
          <th>Uitkomst</th>
          <th>Volgende stap en wie</th>
          <th><span class="sr-only">Verwijderen</span></th>
        </tr>
      </thead>
      <tbody>
        {#each d.projecten as p, i}
          {@const u = uitkomst(p)}
          <tr>
            <td class="naam"><input class="wv-invoer" bind:value={p.naam} placeholder="Naam van het project" aria-label="Project {i + 1}" /></td>
            {#each VRAGEN as v, vi}
              <td>
                {#if actief(p, vi)}
                  <span class="wv-segment" role="group" aria-label="{v.vraag} {p.naam || `project ${i + 1}`}">
                    <button aria-pressed={p[v.id] === true} onclick={() => zet(p, v.id, true)}>ja</button>
                    <button aria-pressed={p[v.id] === false} onclick={() => zet(p, v.id, false)}>nee</button>
                  </span>
                {:else}
                  <span class="nvt" aria-label="Niet van toepassing">–</span>
                {/if}
              </td>
            {/each}
            <td>
              <span class="wv-label" style="background: {UITKOMST[u].kleur}; color: #fff">{UITKOMST[u].naam}</span>
              {#if u === 'epic'}<a class="lbc" href={href('doen/gereedschap/lean-business-case')}>Business case →</a>{/if}
            </td>
            <td class="afspraak"><input class="wv-invoer" bind:value={p.afspraak} placeholder={UITKOMST[u].stap || 'Eerst de vragen beantwoorden'} aria-label="Volgende stap voor project {i + 1}" /></td>
            <td><button class="wv-weg" onclick={() => d.projecten.splice(i, 1)} aria-label="Project {i + 1} verwijderen">×</button></td>
          </tr>
        {/each}
      </tbody>
    </table>
    <div class="toevoegen"><button class="wv-knop wv-knop--link" onclick={() => d.projecten.push(nieuw())}>+ Project toevoegen</button></div>
  </div>
</div>

<style>
  .trieren {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .kop {
    display: flex;
    flex-wrap: wrap;
    gap: 16px 24px;
    align-items: flex-end;
    justify-content: space-between;
  }
  .kop .wv-veld {
    flex: 1;
    min-width: 240px;
  }
  .telling {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .tel {
    display: flex;
    flex-direction: column;
    min-width: 110px;
    padding: 8px 12px;
    border-radius: var(--radius-s);
    background: var(--bg);
    border-top: 4px solid var(--k);
  }
  .tel b {
    font-size: 24px;
    line-height: 1.1;
  }
  .tel span {
    font-size: 12.5px;
    font-weight: 700;
  }
  .naam {
    min-width: 220px;
  }
  .afspraak {
    min-width: 240px;
  }
  .nvt {
    color: var(--muted);
    padding-left: 12px;
  }
  .lbc {
    display: block;
    margin-top: 4px;
    font-size: 12.5px;
    font-weight: 600;
  }
  .toevoegen {
    padding: 6px 12px 10px;
  }
</style>
