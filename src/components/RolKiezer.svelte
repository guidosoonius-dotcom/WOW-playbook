<script>
  import content from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import RolIcoon from './RolIcoon.svelte';
</script>

<div class="rollen" role="radiogroup" aria-label="Kies je rol">
  {#each content.rollen as rol}
    <button
      class="rol"
      role="radio"
      aria-checked={prefs.rol === rol.id}
      onclick={() => (prefs.rol = prefs.rol === rol.id ? null : rol.id)}
    >
      <RolIcoon rol={rol.id} />
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
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 10px;
  }
  .rol {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 68px;
    padding: 14px;
    border: 0;
    border-radius: 18px;
    background: var(--surface);
    text-align: left;
  }
  .rol[aria-checked='true'] {
    background: var(--line1);
    color: var(--on-line1);
  }
  .tekst {
    display: flex;
    flex-direction: column;
    min-width: 0;
    line-height: 1.3;
  }
  strong {
    font-size: 14px;
  }
  .tekst span {
    font-size: 12px;
    opacity: 0.8;
  }
</style>
