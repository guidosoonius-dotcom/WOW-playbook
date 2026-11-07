<script>
  // Kies een voorbeeld en zie de waardestroom als metrolijn: van trigger, via de stappen, naar waarde.
  let { uitleg } = $props();

  const voorbeelden = $derived(uitleg.voorbeelden ?? []);
  // svelte-ignore state_referenced_locally
  let gekozen = $state(uitleg.voorbeelden?.[0]?.id);
  const vb = $derived(voorbeelden.find((v) => v.id === gekozen) ?? voorbeelden[0]);
</script>

<section class="sectie" aria-labelledby="kenmerken">
  <h2 id="kenmerken">Kenmerken van een waardestroom</h2>
  <ul class="kenmerken">
    {#each uitleg.kenmerken ?? [] as k}
      <li>
        <span class="station" aria-hidden="true"></span>
        <strong>{k.titel}</strong>
        <span>{k.tekst}</span>
      </li>
    {/each}
  </ul>
</section>

{#if vb}
  <section class="sectie" aria-labelledby="voorbeelden">
    <h2 id="voorbeelden">Voorbeelden</h2>
    <div class="keuze" role="radiogroup" aria-label="Kies een voorbeeld">
      {#each voorbeelden as v}
        <button role="radio" aria-checked={v.id === gekozen} onclick={() => (gekozen = v.id)}>{v.naam}</button>
      {/each}
    </div>

    {#key vb.id}
      <div class="stroom">
        <div class="eind begin">
          <span class="label">Begint bij</span>
          <p>{vb.trigger}</p>
        </div>

        <ol class="lijn" style="--n: {vb.stappen.length}" aria-label="Stappen in de waardestroom">
          {#each vb.stappen as stap, i}
            <li style="--i: {i}">
              <span class="halte" aria-hidden="true"></span>
              <span class="naam">{stap}</span>
            </li>
          {/each}
          <span class="trein" aria-hidden="true"></span>
        </ol>

        <div class="eind waarde">
          <span class="label">Waarde</span>
          <p>{vb.uitkomst}</p>
        </div>
      </div>

      {#if vb.producten?.length}
        <div class="producten">
          <h3>Digitale producten in deze stroom</h3>
          <ul>
            {#each vb.producten as p}
              <li>
                <svg viewBox="0 0 32 14" aria-hidden="true"><path d="M2 7 H30" /><circle cx="16" cy="7" r="4.5" /></svg>
                {p}
              </li>
            {/each}
          </ul>
          <p class="toelichting">Elk product krijgt een vast productteam. Alle teams in deze stroom vormen samen één productgroep en plannen samen in de PI-planning.</p>
        </div>
      {/if}
    {/key}
  </section>
{/if}

<style>
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  .kenmerken {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(300px, 100%), 1fr));
    gap: 12px;
  }
  .kenmerken li {
    display: grid;
    grid-template-columns: 22px minmax(0, 1fr);
    align-content: start;
    gap: 4px 14px;
    padding: 18px 20px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .kenmerken .station {
    grid-row: span 2;
    width: 18px;
    height: 18px;
    margin-top: 2px;
    border-radius: 50%;
    border: 3.5px solid var(--line1);
    background: var(--bg);
  }
  .kenmerken strong {
    font-size: 17px;
  }
  .kenmerken span:not(.station) {
    color: var(--muted);
    font-size: 15px;
  }

  .keuze {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
  }
  .keuze button {
    min-height: 44px;
    padding: 0 18px;
    border-radius: 999px;
    border: 0;
    background: var(--surface);
    font-weight: 600;
  }
  .keuze button[aria-checked='true'] {
    background: var(--line1);
    color: var(--on-line1);
  }

  .stroom {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 7fr) minmax(0, 2fr);
    gap: 20px;
    align-items: center;
    padding: clamp(20px, 3vw, 32px);
    border-radius: var(--radius-l);
    background: var(--panel);
  }
  .eind {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 16px;
    border-radius: 16px;
    background: var(--bg);
  }
  .eind p {
    margin: 0;
    font-size: 15px;
  }
  .label {
    font-size: 13px;
    font-weight: 700;
    color: var(--line1);
  }
  .waarde .label {
    color: var(--value-text);
  }

  .lijn {
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    display: grid;
    grid-template-columns: repeat(var(--n), minmax(0, 1fr));
  }
  .lijn::before {
    content: '';
    position: absolute;
    top: 12px;
    left: calc(50% / var(--n));
    right: calc(50% / var(--n));
    height: 4px;
    border-radius: 2px;
    background: var(--line1);
  }
  .lijn li {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    text-align: center;
    animation: in 0.5s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i) * 80ms);
  }
  .halte {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 4px solid var(--line1);
    background: var(--panel);
  }
  .naam {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.3;
  }
  /* Een "trein" die over de lijn rijdt: de waarde die door de stroom gaat. */
  .trein {
    position: absolute;
    top: 6px;
    left: calc(50% / var(--n));
    width: 16px;
    height: 16px;
    margin-left: -8px;
    border-radius: 50%;
    background: var(--value);
    animation: rijden 6s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  }
  @keyframes rijden {
    0% {
      left: calc(50% / var(--n));
      opacity: 0;
    }
    8% {
      opacity: 1;
    }
    85% {
      opacity: 1;
    }
    100% {
      left: calc(100% - 50% / var(--n));
      opacity: 0;
    }
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
  }

  .producten {
    margin-top: 20px;
  }
  .producten h3 {
    font-size: 18px;
    margin-bottom: 12px;
  }
  .producten ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
  }
  .producten li {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    font-weight: 600;
  }
  .producten svg {
    width: 32px;
    height: 14px;
  }
  .producten path {
    fill: none;
    stroke: var(--line1);
    stroke-width: 3.5;
    stroke-linecap: round;
  }
  .producten circle {
    fill: var(--bg);
    stroke: var(--line1);
    stroke-width: 3;
  }
  .toelichting {
    margin: 12px 0 0;
    color: var(--muted);
    font-size: 15px;
    max-width: 70ch;
  }

  @media (max-width: 860px) {
    .stroom {
      grid-template-columns: minmax(0, 1fr);
    }
    .lijn {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .lijn::before {
      top: 14px;
      bottom: 14px;
      left: 12px;
      right: auto;
      width: 4px;
      height: auto;
    }
    .lijn li {
      flex-direction: row;
      text-align: left;
    }
    .trein {
      display: none;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .trein {
      display: none;
    }
    .lijn li {
      animation: none;
    }
  }
</style>
