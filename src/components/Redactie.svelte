<script>
  // Redactiemodus: klik op een tekst in het playbook en wijzig hem. Met een balk onderin voor opslaan en exporteren.
  import { redactie, alleWijzigingen, veldenVoorTekst, htmlVeldVoor, wijzigTekst, wijzigHtml, maakOngedaan, slaOpAlsHtml, downloadExport, exportAlsTekst } from '../lib/redactie.svelte.js';
  import { norm } from '../lib/redactie-data.js';
  import { kopieer } from '../lib/werkvorm.svelte.js';

  let { onherteken } = $props();

  let melding = $state('');
  let timer;
  let overzicht;
  let exportOpen = $state(false);
  function meld(t, duur = 3500) {
    melding = t;
    clearTimeout(timer);
    timer = setTimeout(() => (melding = ''), duur);
  }

  const aantal = $derived(redactie.inBestand.length + redactie.lokaal.length);
  const BLOK = 'h1,h2,h3,h4,p,li,dt,dd,td,th,figcaption,blockquote,strong,small,span,label,a,b,em,i';

  $effect(() => {
    document.body.classList.toggle('redactie-aan', redactie.aan);
    if (!redactie.aan) return;
    const main = document.getElementById('inhoud');
    const opKlik = (e) => klik(e);
    main?.addEventListener('click', opKlik, true);
    meld('Redactiemodus aan. Klik op een tekst om hem te wijzigen. Navigeren kan via het menu bovenin.', 6000);
    return () => main?.removeEventListener('click', opKlik, true);
  });

  function klik(e) {
    if (e.ctrlKey || e.metaKey) return; // Ctrl- of Cmd-klik: gewoon de link volgen
    const doel = e.target;
    if (!(doel instanceof Element)) return;
    if (doel.closest('[contenteditable], input, textarea, select, button, svg')) return;
    const prose = doel.closest('.prose');
    if (prose) {
      const blok = doel.closest('p,li,h2,h3,h4,td,th,blockquote');
      if (!blok || !prose.contains(blok)) return;
      const veld = htmlVeldVoor(prose);
      if (!veld) return meld('Deze tekst kan hier niet worden gewijzigd.');
      e.preventDefault();
      e.stopPropagation();
      bewerk(blok, 'true', (oud, nieuw) => {
        wijzigHtml(veld, prose.innerHTML, { oud, nieuw });
        onherteken?.();
        meld('Gewijzigd. Vergeet niet op te slaan als HTML-bestand.');
      });
      return;
    }
    // Losse teksten: zoek het kleinste element zonder kinderen waarvan de tekst precies een veld is.
    let el = doel.closest(BLOK);
    for (let i = 0; el && i < 4; i++, el = el.parentElement?.closest(BLOK)) {
      if (el.children.length) continue;
      const lijst = veldenVoorTekst(el.textContent);
      if (lijst.length) {
        e.preventDefault();
        e.stopPropagation();
        bewerk(el, 'plaintext-only', (oud, nieuw) => {
          wijzigTekst(lijst, nieuw);
          onherteken?.();
          meld(lijst.length > 1 ? `Gewijzigd op ${lijst.length} plekken waar deze tekst staat.` : 'Gewijzigd. Vergeet niet op te slaan als HTML-bestand.');
        });
        return;
      }
    }
    if (doel.closest('a')) return; // geen inhoudstekst: de link gewoon volgen
    meld('Deze tekst komt niet uit de inhoud (bijvoorbeeld een knop of vaste tekst) en kan hier niet worden gewijzigd.');
  }

  // Een element bewerkbaar maken. Enter of klikken buiten de tekst bewaart, Esc annuleert.
  function bewerk(el, soort, klaar) {
    const oud = el.textContent;
    const oudeHtml = el.innerHTML;
    try {
      el.contentEditable = soort;
    } catch {
      el.contentEditable = 'true'; // browsers zonder "plaintext-only"
    }
    el.spellcheck = true;
    el.focus();
    const sluit = (bewaar) => {
      el.removeEventListener('keydown', toets);
      el.removeEventListener('blur', weg);
      el.removeAttribute('contenteditable');
      el.removeAttribute('spellcheck');
      if (!bewaar) {
        el.innerHTML = oudeHtml;
        return;
      }
      const nieuw = el.textContent;
      if (norm(nieuw) === norm(oud)) return;
      if (!norm(nieuw)) {
        el.innerHTML = oudeHtml;
        return meld('Een lege tekst is niet bewaard.');
      }
      klaar(oud, norm(nieuw));
    };
    const toets = (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        el.blur();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        sluit(false);
      }
    };
    const weg = () => sluit(true);
    el.addEventListener('keydown', toets);
    el.addEventListener('blur', weg, { once: true });
  }

  function opslaan() {
    slaOpAlsHtml();
    meld('Het nieuwe HTML-bestand staat in je downloads. Zet het op SharePoint in plaats van het oude.', 7000);
  }
  async function kopieerExport() {
    exportOpen = false;
    meld((await kopieer(exportAlsTekst())) ? 'Gekopieerd. Plak het in Copilot met de skill Playbook-redacteur.' : 'Kopiëren lukte niet in deze browser.');
  }
  function ongedaan(w) {
    maakOngedaan(w);
    onherteken?.();
  }
  const kort = (s, n = 90) => (norm(s).length > n ? norm(s).slice(0, n - 1) + '…' : norm(s));
</script>

{#if redactie.aan}
  <div class="balk" role="region" aria-label="Redactiemodus">
    <span class="titel"><span class="stip" aria-hidden="true"></span>Redactiemodus</span>
    <span class="hint">Klik op een tekst om te wijzigen · Enter bewaart · Esc annuleert</span>
    <span class="ruimte"></span>
    <button class="knop" onclick={() => overzicht.showModal()}>Wijzigingen <b>{aantal}</b>{#if redactie.lokaal.length} · {redactie.lokaal.length} niet opgeslagen{/if}</button>
    <button class="knop vol" onclick={opslaan} disabled={!aantal}>Opslaan als HTML-bestand</button>
    <span class="menu">
      <button class="knop" onclick={() => (exportOpen = !exportOpen)} aria-expanded={exportOpen} disabled={!aantal}>Exporteren ▾</button>
      {#if exportOpen}
        <span class="keuzes">
          <button onclick={() => { exportOpen = false; downloadExport(); meld('Het wijzigingenbestand (JSON) staat in je downloads.'); }}>Wijzigingenbestand (voor de repository)</button>
          <button onclick={kopieerExport}>Kopieer als tekst (voor Copilot)</button>
        </span>
      {/if}
    </span>
    <button class="knop zacht" onclick={() => (redactie.aan = false)}>Stoppen</button>
  </div>
{/if}

{#if melding}<div class="melding" role="status">{melding}</div>{/if}

<dialog bind:this={overzicht} class="overzicht" aria-labelledby="overzicht-kop">
  <div class="kop">
    <h2 id="overzicht-kop">Wijzigingen</h2>
    <button class="knop zacht" onclick={() => overzicht.close()}>Sluiten</button>
  </div>
  {#if redactie.overgeslagen.length}
    <p class="let-op">{redactie.overgeslagen.length} {redactie.overgeslagen.length === 1 ? 'wijziging' : 'wijzigingen'} uit dit bestand {redactie.overgeslagen.length === 1 ? 'is' : 'zijn'} niet toegepast, omdat de tekst in deze versie van het playbook al anders is.</p>
  {/if}
  {#if !aantal}
    <p>Nog geen wijzigingen. Klik op een tekst in het playbook om hem te wijzigen.</p>
  {:else}
    <ul>
      {#each [...alleWijzigingen()].reverse() as w}
        <li>
          <div class="meta">
            <span class="bestand">{w.bestand} · {w.veld}</span>
            <span class="label" class:nieuw={redactie.lokaal.includes(w)}>{redactie.lokaal.includes(w) ? 'Nog niet opgeslagen' : 'In dit bestand'}</span>
          </div>
          {#if w.soort === 'html'}
            {#each w.blokken ?? [] as b}
              <p class="oud">{kort(b.oud)}</p>
              <p class="nieuw">{kort(b.nieuw)}</p>
            {/each}
          {:else}
            <p class="oud">{kort(w.oud)}</p>
            <p class="nieuw">{kort(w.nieuw)}</p>
          {/if}
          <button class="link" onclick={() => ongedaan(w)}>Ongedaan maken</button>
        </li>
      {/each}
    </ul>
  {/if}
</dialog>

<style>
  .balk {
    position: fixed;
    left: 12px;
    right: 12px;
    bottom: 12px;
    z-index: 50;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 10px;
    padding: 10px 12px;
    border-radius: var(--radius-m);
    background: #004077;
    color: #fff;
    box-shadow: 0 6px 24px rgb(0 0 0 / 0.25);
  }
  .titel {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-weight: 700;
  }
  .stip {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #ff5a4c;
  }
  .hint {
    font-size: 13px;
    opacity: 0.85;
  }
  .ruimte {
    flex: 1;
  }
  .knop {
    min-height: 38px;
    padding: 0 14px;
    border-radius: 999px;
    border: 1.5px solid #fff;
    background: transparent;
    color: #fff;
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }
  .knop.vol {
    background: #fff;
    color: #004077;
  }
  .knop.zacht {
    border-color: rgb(255 255 255 / 0.45);
  }
  .knop:disabled {
    opacity: 0.45;
  }
  .menu {
    position: relative;
  }
  .keuzes {
    position: absolute;
    right: 0;
    bottom: calc(100% + 8px);
    display: flex;
    flex-direction: column;
    min-width: 280px;
    padding: 6px;
    border-radius: var(--radius-s);
    background: var(--surface);
    box-shadow: 0 6px 24px rgb(0 0 0 / 0.2);
  }
  .keuzes button {
    padding: 10px 12px;
    border: 0;
    border-radius: var(--radius-tag);
    background: transparent;
    color: var(--ink);
    text-align: left;
    font-size: 14px;
  }
  .keuzes button:hover {
    background: var(--chip);
  }
  .melding {
    position: fixed;
    left: 50%;
    bottom: 88px;
    z-index: 55;
    transform: translateX(-50%);
    max-width: min(560px, calc(100vw - 32px));
    padding: 10px 16px;
    border-radius: var(--radius-s);
    background: var(--ink);
    color: var(--bg);
    font-size: 14px;
    box-shadow: 0 6px 20px rgb(0 0 0 / 0.2);
  }
  .overzicht {
    width: min(760px, calc(100vw - 32px));
    max-height: 80vh;
    padding: 20px;
    border: 0;
    border-radius: var(--radius-l);
    background: var(--surface);
    color: var(--ink);
  }
  .overzicht::backdrop {
    background: rgb(0 0 0 / 0.35);
  }
  .kop {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
  }
  .kop h2 {
    font-size: 21px;
  }
  .kop .knop {
    color: var(--ink);
    border-color: var(--border);
  }
  .let-op {
    padding: 10px 12px;
    border-radius: var(--radius-s);
    background: #fff6e0;
    color: #6b4f00;
    font-size: 14px;
  }
  .overzicht ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .overzicht li {
    padding: 12px 14px;
    border-radius: var(--radius-s);
    background: var(--bg);
  }
  .meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 6px;
    margin-bottom: 6px;
  }
  .bestand {
    font-size: 12.5px;
    color: var(--muted);
    font-family: ui-monospace, monospace;
  }
  .label {
    font-size: 12px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: var(--radius-tag);
    background: var(--chip);
  }
  .label.nieuw {
    background: #c8261b;
    color: #fff;
  }
  .oud,
  .nieuw {
    margin: 2px 0;
    font-size: 14.5px;
    padding-left: 10px;
  }
  .oud {
    color: var(--muted);
    text-decoration: line-through;
    border-left: 3px solid var(--track);
  }
  .nieuw {
    border-left: 3px solid #2e9e5b;
  }
  .link {
    margin-top: 6px;
    border: 0;
    background: none;
    color: var(--line2);
    font-weight: 600;
    padding: 0;
  }
  /* Teksten die je kunt aanklikken lichten op; de tekst die je bewerkt krijgt een kader. */
  :global(body.redactie-aan #inhoud :is(h1, h2, h3, h4, p, li, dt, dd, td, th, figcaption, blockquote, small):hover) {
    outline: 2px dashed rgb(0 116 204 / 0.45);
    outline-offset: 3px;
    border-radius: 2px;
    cursor: text;
  }
  :global(#inhoud [contenteditable]) {
    outline: 2px solid #0074cc !important;
    outline-offset: 3px;
    background: rgb(0 116 204 / 0.06);
    cursor: text;
  }
  @media (max-width: 760px) {
    .hint {
      display: none;
    }
    .melding {
      top: 76px;
      bottom: auto;
    }
  }
  @media print {
    .balk,
    .melding {
      display: none;
    }
  }
</style>
