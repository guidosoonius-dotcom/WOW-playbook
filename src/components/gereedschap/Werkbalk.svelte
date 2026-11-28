<script>
  // De vaste werkbalk van elke werkvorm: bewaarstatus, presenteren, kopiëren, Word, Print of PDF en leegmaken.
  import { tijdTekst, downloadWord, printen, alsTekst, kopieer } from '../../lib/werkvorm.svelte.js';

  let { titel, tool, presenteren = $bindable(false) } = $props();

  let melding = $state('');
  let timer;
  function meld(t) {
    melding = t;
    clearTimeout(timer);
    timer = setTimeout(() => (melding = ''), 2500);
  }

  const tijd = $derived(tool?.opslag?.tijd ? tijdTekst(tool.opslag.tijd) : null);

  async function kopieerTekst() {
    const ok = await kopieer(alsTekst(titel, tool.inhoud()));
    meld(ok ? 'Gekopieerd. Plak het in Teams of een e-mail.' : 'Kopiëren lukte niet in deze browser.');
  }
  function word() {
    downloadWord(titel, tool.inhoud());
    meld('Het Word-bestand staat in je downloads.');
  }
  function leeg() {
    if (confirm(`Alles wat je bij "${titel}" hebt ingevuld wissen? Dit kan niet ongedaan worden gemaakt.`)) {
      tool.opslag.leegmaken();
      tool.naLeegmaken?.();
      meld('Leeggemaakt.');
    }
  }
</script>

<div class="werkbalk" role="toolbar" aria-label="Werkbalk voor {titel}">
  <span class="status" aria-live="polite">
    {#if melding}
      <span class="stip ok" aria-hidden="true"></span>{melding}
    {:else if tijd}
      <span class="stip ok" aria-hidden="true"></span>Bewaard in deze browser · {tijd}
    {:else}
      <span class="stip" aria-hidden="true"></span>Wordt bewaard in deze browser zodra je begint
    {/if}
  </span>
  <span class="ruimte"></span>
  <button class="knop" onclick={() => (presenteren = true)}>
    <svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2 1 L11 6 L2 11 Z" /></svg>Presenteren
  </button>
  <button class="knop" onclick={kopieerTekst}>Kopieer als tekst</button>
  <button class="knop" onclick={word}>Download Word</button>
  <button class="knop knop--vol" onclick={() => printen(titel, tool.inhoud())}>Print of PDF</button>
  <button class="knop knop--zacht" onclick={leeg}>Leegmaken</button>
</div>

<style>
  .werkbalk {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .status {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--muted);
    min-width: 0;
  }
  .stip {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--track);
    flex-shrink: 0;
  }
  .stip.ok {
    background: #2e9e5b;
  }
  .ruimte {
    flex: 1;
  }
  .knop {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid var(--line1);
    background: transparent;
    color: var(--ink);
    font-weight: 600;
    font-size: 14px;
    white-space: nowrap;
  }
  .knop svg {
    width: 10px;
    height: 10px;
    fill: currentColor;
  }
  .knop--vol {
    background: var(--line1);
    color: var(--on-line1);
  }
  .knop--zacht {
    border-color: var(--border);
    color: var(--muted);
  }
  @media (max-width: 700px) {
    .ruimte {
      display: none;
    }
    .status {
      flex-basis: 100%;
    }
  }
</style>
