<script>
  import { eventById, rolById, explainerById, CADANS_LABEL } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import { prefs } from '../lib/state.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import Explainer from '../components/Explainer.svelte';
  import RolIcoon from '../components/RolIcoon.svelte';

  let { id } = $props();
  const ev = $derived(eventById(id));
  const explainer = $derived(ev.explainer ? explainerById(ev.explainer) : null);
  const mijnDeelname = $derived(prefs.rol ? ev.deelnemers.find((d) => d.rol === prefs.rol) : null);
  const mijnRolInEvent = $derived(prefs.rol ? rolById(prefs.rol)?.events.find((e) => e.event === ev.id)?.rol_in_event : null);
</script>

<div class="container">
  <PaginaKop eyebrow="Ritme · {CADANS_LABEL[ev.cadans]}" titel={ev.titel} kern={ev.kern} samenvatting={ev.samenvatting} safe={ev.safe} status={ev.status} />

  <dl class="feiten">
    <div><dt>Wanneer</dt><dd>{ev.wanneer}</dd></div>
    <div><dt>Duur</dt><dd>{ev.duur}</dd></div>
    <div><dt>Doel</dt><dd>{ev.doel}</dd></div>
  </dl>

  {#if mijnDeelname || mijnRolInEvent}
    <p class="jij card">
      <strong>Jij als {rolById(prefs.rol).titel}:</strong>
      {mijnRolInEvent ?? (mijnDeelname.verplicht ? 'Je bent erbij.' : 'Je sluit aan als het nodig is.')}
    </p>
  {/if}

  {#if explainer}
    <section class="sectie"><Explainer {explainer} /></section>
  {/if}

  <section class="sectie" aria-labelledby="wie">
    <h2 id="wie">Wie is erbij?</h2>
    <ul class="deelnemers">
      {#each ev.deelnemers as d}
        {@const rol = rolById(d.rol)}
        <li>
          <a href={href('rollen/' + rol.id)} class:mijn={prefs.rol === rol.id}>
            <RolIcoon rol={rol.id} size={18} />{rol.titel}
            <span class="tag">{d.verplicht ? 'altijd' : 'als het nodig is'}</span>
          </a>
        </li>
      {/each}
    </ul>
  </section>

  <div class="kolommen sectie">
    {#if ev.input?.length}
      <section class="card"><h2>Je neemt mee</h2><ul class="lijst">{#each ev.input as x}<li>{x}</li>{/each}</ul></section>
    {/if}
    <section class="card"><h2>Het levert op</h2><ul class="lijst">{#each ev.output as x}<li>{x}</li>{/each}</ul></section>
    <section class="card"><h2>Goed als…</h2><ul class="lijst">{#each ev.goed_als as x}<li>{x}</li>{/each}</ul></section>
    <section class="card valkuil"><h2>Valkuilen</h2><ul class="lijst">{#each ev.valkuilen as x}<li>{x}</li>{/each}</ul></section>
  </div>

  {#if ev.facilitatietips?.length}
    <section class="sectie" aria-labelledby="tips">
      <h2 id="tips">Tips voor de facilitator</h2>
      <ul class="lijst">{#each ev.facilitatietips as x}<li>{x}</li>{/each}</ul>
    </section>
  {/if}

  {#if ev.html}<section class="sectie prose">{@html ev.html}</section>{/if}
</div>

<style>
  .feiten {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
    gap: 12px;
    margin: 16px 0 0;
  }
  .feiten div {
    padding: 14px 16px;
    border-radius: 16px;
    border: 1px solid var(--border);
  }
  dt {
    font-size: 12.5px;
    font-weight: 600;
    color: var(--muted);
  }
  dd {
    margin: 2px 0 0;
    font-weight: 600;
  }
  .jij {
    margin: 16px 0 0;
    border-left: 0;
    background: var(--panel);
  }
  .deelnemers {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .deelnemers a {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink);
    text-decoration: none;
    font-weight: 600;
    font-size: 14.5px;
  }
  .deelnemers a.mijn {
    outline: 2px solid var(--line1);
  }
  .tag {
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
  }
  .kolommen {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(240px, 100%), 1fr));
    gap: 14px;
  }
  .kolommen h2 {
    font-size: 17px;
    margin-bottom: 10px;
  }
  .valkuil {
    background: transparent;
    border: 1.5px dashed var(--border);
  }
</style>
