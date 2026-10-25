<script>
  import content from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';

  // Elke rol is een lijn op de kaart; de kleur volgt het niveau waarop de rol werkt.
  const KLEUR = { Divisie: 'var(--value)', Productgroep: 'var(--line2)', Productteam: 'var(--line1)' };
</script>

<div class="rollen" role="radiogroup" aria-label="Kies je rol">
  {#each content.rollen as rol}
    <button
      class="rol"
      role="radio"
      aria-checked={prefs.rol === rol.id}
      onclick={() => (prefs.rol = prefs.rol === rol.id ? null : rol.id)}
      style="--lijn: {KLEUR[rol.niveau_label] ?? 'var(--line1)'}"
    >
      <svg class="lijn" viewBox="0 0 40 16" aria-hidden="true"><path d="M2 8 H38" /><circle cx="20" cy="8" r="5.5" /></svg>
      <span class="tekst">
        <strong>{rol.titel}</strong>
        <span>{rol.niveau_label}</span>
      </span>
    </button>
  {/each}
</div>

<style>
  .rollen {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(250px, 100%), 1fr));
    gap: 4px 16px;
  }
  .rol {
    display: flex;
    align-items: center;
    gap: 16px;
    min-height: 64px;
    padding: 10px 14px;
    border: 0;
    border-radius: 999px;
    background: transparent;
    text-align: left;
    transition: background-color 0.15s ease-out, transform 0.15s ease-out;
  }
  .rol:hover {
    background: var(--surface);
  }
  .rol:active {
    transform: scale(0.98);
  }
  .rol[aria-checked='true'] {
    background: var(--ink);
    color: var(--bg);
  }
  .lijn {
    flex-shrink: 0;
    width: 40px;
    height: 16px;
  }
  .lijn path {
    fill: none;
    stroke: var(--lijn);
    stroke-width: 4;
    stroke-linecap: round;
  }
  .lijn circle {
    fill: var(--bg);
    stroke: var(--lijn);
    stroke-width: 3.5;
    transition: fill 0.15s ease-out;
  }
  .rol[aria-checked='true'] .lijn circle {
    fill: var(--lijn);
  }
  .tekst {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }
  strong {
    font-size: 17px;
  }
  .tekst span {
    font-size: 15px;
    opacity: 0.8;
  }
</style>
