<script>
  // Keuzehulp bij "Manieren van werken": twee voorvragen en zes vragen die verschil maken tussen vast team en project.
  // De uitkomst is een eerste richting voor de Idee Project Kaart; het portfolio beslist na de intake.
  // Tekst en vragen staan in content/data/manieren.yaml; hier staat alleen de rekenregel.
  import content from '../lib/content.js';

  const k = content.manieren.keuzehulp;
  const SLEUTEL = 'samen-digitaal-keuzehulp';

  function lees() {
    try {
      return JSON.parse(localStorage.getItem(SLEUTEL) ?? '{}') ?? {};
    } catch {
      return {};
    }
  }
  let a = $state(lees());
  function zet(id, waarde) {
    a[id] = waarde;
    try {
      localStorage.setItem(SLEUTEL, JSON.stringify(a));
    } catch {
      /* zonder opslag werkt de keuzehulp gewoon door */
    }
  }
  function opnieuw() {
    a = {};
    try {
      localStorage.removeItem(SLEUTEL);
    } catch {
      /* niets te wissen */
    }
  }

  // De uitkomst. Minstens vier antwoorden anders dan "Weet ik niet", en een verschil van twee voor een richting.
  const uitkomst = $derived.by(() => {
    const u = k.uitkomsten;
    if (a.v1 === 'a') return { ...u.servicedesk, soort: 'run', voortgang: 'Uitkomst', signalen: [] };
    if (a.v2 === 'a') return { ...u.drempel, soort: 'run', voortgang: 'Uitkomst', signalen: [] };
    const gegeven = k.vragen.filter((q) => a[q.id]).length;
    const p = k.vragen.filter((q) => a[q.id] === 'a');
    const j = k.vragen.filter((q) => a[q.id] === 'b');
    const signalen = [
      ...p.map((q) => ({ soort: 'vast', tekst: `Vast team: ${q.la.toLowerCase()} (vraag ${q.nr})` })),
      ...j.map((q) => ({ soort: 'project', tekst: `Project: ${q.lb.toLowerCase()} (vraag ${q.nr})` }))
    ];
    const bekend = p.length + j.length;
    if (bekend < 4 && gegeven < k.vragen.length) return { ...u.leeg, soort: 'leeg', voortgang: `${gegeven} van ${k.vragen.length} vragen beantwoord`, signalen };
    if (bekend < 4) return { ...u.verduidelijken, soort: 'leeg', voortgang: 'Uitkomst', signalen };
    if (p.length - j.length >= 2) return { ...u.vast, soort: 'vast', voortgang: 'Eerste richting', signalen };
    if (j.length - p.length >= 2) return { ...u.project, soort: 'project', voortgang: 'Eerste richting', signalen };
    return { ...u.gemengd, soort: 'leeg', voortgang: 'Eerste richting', signalen };
  });
</script>

<section class="keuzehulp" id="keuzehulp" aria-labelledby="keuzehulp-kop">
  <div class="vragen">
    <span class="eyebrow">Keuzehulp</span>
    <h2 id="keuzehulp-kop">{k.titel}</h2>
    <p class="intro">{k.intro}</p>

    <h3 class="kop">{k.voor_kop}</h3>
    {#each k.voor as q}
      <fieldset class="vraag">
        <legend><span class="nr">{q.nr}</span><span>{q.tekst}</span></legend>
        <p class="why">{q.why}</p>
        <div class="opties">
          <button type="button" class:aan={a[q.id] === 'a'} aria-pressed={a[q.id] === 'a'} onclick={() => zet(q.id, 'a')}>{q.la}</button>
          <button type="button" class:aan={a[q.id] === 'b'} aria-pressed={a[q.id] === 'b'} onclick={() => zet(q.id, 'b')}>{q.lb}</button>
        </div>
      </fieldset>
    {/each}

    <h3 class="kop">{k.kern_kop}</h3>
    {#each k.vragen as q}
      <fieldset class="vraag">
        <legend><span class="nr">{q.nr}</span><span>{q.tekst}</span></legend>
        <p class="why">{q.why}</p>
        <div class="opties">
          <button type="button" class:aan={a[q.id] === 'a'} aria-pressed={a[q.id] === 'a'} onclick={() => zet(q.id, 'a')}>{q.la}</button>
          <button type="button" class:aan={a[q.id] === 'b'} aria-pressed={a[q.id] === 'b'} onclick={() => zet(q.id, 'b')}>{q.lb}</button>
          <button type="button" class:aan={a[q.id] === 'c'} aria-pressed={a[q.id] === 'c'} onclick={() => zet(q.id, 'c')}>{k.weet_niet}</button>
        </div>
      </fieldset>
    {/each}
  </div>

  <div class="uitkomst" aria-live="polite">
    <span class="voortgang">{uitkomst.voortgang}</span>
    <div class="titelrij">
      <svg viewBox="0 0 64 40" width="64" height="40" aria-hidden="true">
        <path class="spoor {uitkomst.soort}" d="M2 20 H62" />
        <circle class="stat {uitkomst.soort}" cx="32" cy="20" r="10" />
      </svg>
      <h3>{uitkomst.titel}</h3>
    </div>
    <p>{uitkomst.tekst}</p>
    {#if uitkomst.signalen.length}
      <ul class="signalen">
        {#each uitkomst.signalen as s}
          <li><span class="stip {s.soort}" aria-hidden="true"></span>{s.tekst}</li>
        {/each}
      </ul>
    {/if}
    {#if uitkomst.vervolg}<p class="vervolg">{uitkomst.vervolg}</p>{/if}
    <button type="button" class="opnieuw" onclick={opnieuw}>Opnieuw beginnen</button>
  </div>
</section>

<style>
  .keuzehulp {
    margin-top: 48px;
    padding: clamp(24px, 4vw, 44px);
    border-radius: 28px;
    background: var(--surface);
    display: grid;
    grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr);
    gap: 48px;
    align-items: start;
  }
  .eyebrow {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--muted);
  }
  h2 {
    margin: 6px 0 0;
    font-size: clamp(28px, 3.4vw, 36px);
    line-height: 1.1;
    letter-spacing: -0.03em;
  }
  .intro {
    margin: 10px 0 8px;
    color: var(--muted);
    line-height: 1.55;
  }
  .kop {
    margin: 22px 0 0;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--line2);
  }
  .vraag {
    margin: 0;
    padding: 18px 0;
    border: 0;
    border-bottom: 1px solid var(--border);
    min-width: 0;
  }
  legend {
    display: flex;
    gap: 14px;
    align-items: baseline;
    padding: 0;
    font-size: 17px;
    font-weight: 600;
    line-height: 1.4;
    float: left;
    width: 100%;
  }
  legend + .why {
    clear: both;
  }
  .nr {
    min-width: 16px;
    font-size: 13px;
    font-weight: 800;
    color: var(--line2);
  }
  .why {
    margin: 8px 0 0 30px;
    font-size: 13.5px;
    line-height: 1.45;
    color: var(--muted);
  }
  .opties {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin: 10px 0 0 30px;
  }
  .opties button {
    min-height: 44px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid var(--muted);
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .opties button:hover {
    background: var(--chip);
  }
  .opties button.aan {
    background: var(--line1);
    border-color: var(--line1);
    color: var(--on-line1);
  }

  .uitkomst {
    position: sticky;
    top: 96px;
    padding: 30px;
    border-radius: 22px;
    background: var(--vlak-blauw);
    color: #fff;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .voortgang {
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #8cc2f2;
  }
  .titelrij {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  h3 {
    margin: 0;
    font-size: 30px;
    line-height: 1.1;
    letter-spacing: -0.03em;
  }
  .uitkomst h3 {
    color: #fff;
  }
  .uitkomst p {
    margin: 0;
    line-height: 1.55;
    color: #e3ecf6;
  }
  .spoor {
    fill: none;
    stroke-width: 6;
    stroke-linecap: round;
  }
  .stat {
    stroke: var(--vlak-blauw);
    stroke-width: 3;
  }
  .vast { stroke: #8cc2f2; fill: #8cc2f2; background: #8cc2f2; }
  .project { stroke: #fff; fill: #fff; background: #fff; }
  .run { stroke: #3f8fd8; fill: #3f8fd8; background: #3f8fd8; }
  .leeg { stroke: #a39a96; fill: #a39a96; background: #a39a96; }
  .spoor { fill: none !important; }
  .stat { stroke: var(--vlak-blauw) !important; }
  .signalen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .signalen li {
    display: flex;
    gap: 10px;
    align-items: flex-start;
    font-size: 14px;
    line-height: 1.45;
  }
  .stip {
    flex: none;
    width: 10px;
    height: 10px;
    margin-top: 5px;
    border-radius: 50%;
    stroke: none;
    fill: none;
  }
  .stip.project {
    border-radius: 2px;
  }
  .vervolg {
    padding-top: 14px;
    border-top: 1px solid rgb(255 255 255 / 0.2);
    font-size: 14.5px;
    color: #c9d8ea !important;
  }
  .opnieuw {
    align-self: flex-start;
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    border: 1.5px solid rgb(255 255 255 / 0.6);
    background: transparent;
    color: #fff;
    font: inherit;
    font-weight: 600;
    cursor: pointer;
  }
  .opnieuw:hover {
    background: rgb(255 255 255 / 0.12);
  }
  @media (max-width: 960px) {
    .keuzehulp {
      grid-template-columns: minmax(0, 1fr);
      gap: 28px;
    }
    .uitkomst {
      position: static;
    }
  }
  @media (max-width: 560px) {
    .why,
    .opties {
      margin-left: 0;
    }
  }
</style>
