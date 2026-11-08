<script>
  // Kenmerken als tegels met een icoon (content: kenmerken[].icoon).
  import Icoon from '../Icoon.svelte';
  let { titel, kenmerken = [], id = 'kenmerken' } = $props();
</script>

<section class="sectie" aria-labelledby={id}>
  <h2 {id}>{titel}</h2>
  <ul class="kenmerken">
    {#each kenmerken as k}
      <li>
        <Icoon naam={k.icoon} />
        <div>
          <strong>{k.titel}</strong>
          <span>{k.tekst}</span>
        </div>
      </li>
    {/each}
  </ul>
</section>

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
  li {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 18px 20px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  div {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  strong {
    font-size: 17px;
  }
  span {
    color: var(--muted);
    font-size: 15px;
  }
</style>
