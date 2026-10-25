<script>
  import { rolById, eventById, laagById } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import RolIcoon from '../components/RolIcoon.svelte';

  let { id } = $props();
  const rol = $derived(rolById(id));
  const laag = $derived(laagById(rol.laag));
</script>

<div class="container">
  <PaginaKop eyebrow="{rol.niveau_label} · {laag.titel}" titel={rol.titel} kern={rol.kern} samenvatting={rol.samenvatting} safe={rol.safe} status={rol.status} />

  {#if prefs.rol !== rol.id}
    <button class="btn" onclick={() => (prefs.rol = rol.id)}>
      <RolIcoon rol={rol.id} size={18} />Dit is mijn rol
    </button>
  {/if}

  <div class="kolommen sectie">
    <section class="card">
      <h2>Wat je doet</h2>
      <ul class="lijst">{#each rol.verantwoordelijkheden as v}<li>{v}</li>{/each}</ul>
    </section>
    <section class="card niet">
      <h2>Wat je níet (meer) doet</h2>
      <ul class="lijst">{#each rol.niet_meer as v}<li>{v}</li>{/each}</ul>
    </section>
  </div>

  <div class="kolommen sectie">
    <section>
      <h2>Jouw events</h2>
      <ul class="rijen">
        {#each rol.events as e}
          {@const ev = eventById(e.event)}
          <li>
            <a href={href('ritme/' + ev.id)}>
              <strong>{ev.titel}</strong>
              <span>{e.rol_in_event}</span>
              <small>{ev.wanneer} · {ev.duur}</small>
            </a>
          </li>
        {/each}
      </ul>
    </section>
    <section>
      <h2>Werkt samen met</h2>
      <ul class="rijen">
        {#each rol.werkt_samen_met as w}
          {@const ander = rolById(w.rol)}
          <li>
            <a href={href('rollen/' + ander.id)}>
              <strong><RolIcoon rol={ander.id} size={18} />{ander.titel}</strong>
              <span>over {w.waarover}</span>
            </a>
          </li>
        {/each}
      </ul>
    </section>
  </div>

  {#if rol.tijdsbesteding}
    <section class="sectie" aria-labelledby="tijd">
      <h2 id="tijd">Waar gaat je tijd naartoe?</h2>
      <p class="toelichting">Een indicatie, geen norm.</p>
      <div class="tijdbalk" role="img" aria-label={rol.tijdsbesteding.map((t) => `${t.activiteit} ${t.procent}%`).join(', ')}>
        {#each rol.tijdsbesteding as t, i}
          <span style="flex: {t.procent}; background: {['var(--line1)', 'var(--line2)', 'var(--value)', 'var(--track)'][i % 4]}"></span>
        {/each}
      </div>
      <ul class="legenda">
        {#each rol.tijdsbesteding as t, i}
          <li><span class="blokje" style="background: {['var(--line1)', 'var(--line2)', 'var(--value)', 'var(--track)'][i % 4]}"></span>{t.activiteit} · {t.procent}%</li>
        {/each}
      </ul>
    </section>
  {/if}

  {#if rol.html}<section class="sectie prose">{@html rol.html}</section>{/if}
</div>

<style>
  .kolommen {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(320px, 100%), 1fr));
    gap: 16px;
  }
  h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  .niet {
    background: transparent;
    border: 1.5px dashed var(--border);
  }
  .rijen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .rijen a {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 14px 16px;
    border-radius: 16px;
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
  }
  .rijen a:hover {
    background: var(--panel);
  }
  .rijen strong {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .rijen span,
  .rijen small {
    color: var(--muted);
    font-size: 14px;
  }
  .toelichting {
    margin: -8px 0 12px;
    color: var(--muted);
    font-size: 14px;
  }
  .tijdbalk {
    display: flex;
    gap: 3px;
    height: 18px;
    border-radius: 999px;
    overflow: hidden;
  }
  .legenda {
    list-style: none;
    margin: 12px 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    font-size: 14px;
  }
  .legenda li {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .blokje {
    width: 12px;
    height: 12px;
    border-radius: 4px;
  }
  .btn {
    margin-top: 8px;
  }
</style>
