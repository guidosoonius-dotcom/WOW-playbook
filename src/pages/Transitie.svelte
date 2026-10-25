<script>
  import content, { rolById } from '../lib/content.js';
  import { prefs } from '../lib/state.svelte.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';

  const STATUS = { afgerond: 'Afgerond', bezig: 'Nu bezig', gepland: 'Gepland' };
</script>

<div class="container">
  <PaginaKop
    eyebrow="Aan de slag · Transitie"
    titel="De transitie"
    kern="We kantelen in fasen. Zo zie je waar we staan, wat er komt en wanneer het jou raakt."
    status="concept"
  />

  <ol class="lijn">
    {#each content.transitie as m}
      {@const raakt = prefs.rol && (m.voor_wie ?? []).includes(prefs.rol)}
      <li class="halte halte--{m.status}">
        <span class="station" aria-hidden="true"></span>
        <div class="kaart" class:raakt>
          <div class="kop">
            <span class="fase">Fase {m.fase}</span>
            <span class="status">{STATUS[m.status]}</span>
            {#if m.periode}<span class="periode">{m.periode}</span>{/if}
          </div>
          <h2>{m.titel}</h2>
          <p>{m.wat}</p>
          {#if m.voor_wie?.length}
            <div class="wie">
              <span>Raakt vooral:</span>
              {#each m.voor_wie as r}
                <a class="chip" class:mijn={prefs.rol === r} href={href('rollen/' + r)}>{rolById(r).titel}</a>
              {/each}
            </div>
          {/if}
          {#if raakt}<p class="jij">Dit raakt jou als {rolById(prefs.rol).titel}.</p>{/if}
        </div>
      </li>
    {/each}
  </ol>
</div>

<style>
  .lijn {
    list-style: none;
    margin: 16px 0 0;
    padding: 0 0 0 8px;
    position: relative;
  }
  .lijn::before {
    content: '';
    position: absolute;
    left: 21px;
    top: 16px;
    bottom: 16px;
    width: 3px;
    border-radius: 2px;
    background: linear-gradient(var(--line1), var(--line2));
  }
  .halte {
    position: relative;
    display: grid;
    grid-template-columns: 30px minmax(0, 1fr);
    gap: 20px;
    padding-bottom: 20px;
  }
  .station {
    position: relative;
    z-index: 1;
    margin-top: 22px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 3px solid var(--line1);
    background: var(--bg);
  }
  .halte--afgerond .station {
    background: var(--line1);
  }
  .halte--bezig .station {
    border-color: var(--value);
    background: var(--value);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--value) 60%, transparent);
    animation: puls 2.2s ease-out infinite;
  }
  @keyframes puls {
    to {
      box-shadow: 0 0 0 16px transparent;
    }
  }
  .kaart {
    padding: 20px 22px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .halte--bezig .kaart {
    background: var(--panel);
  }
  .kaart.raakt {
    outline: 2px solid var(--line1);
  }
  .kop {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 12px;
    font-size: 13px;
  }
  .fase {
    font-weight: 700;
    color: var(--line1);
  }
  .status {
    padding: 2px 10px;
    border-radius: 999px;
    border: 1px solid var(--border);
    font-weight: 600;
  }
  .halte--bezig .status {
    background: var(--value);
    border-color: var(--value);
    color: #14213d;
  }
  .periode {
    color: var(--muted);
  }
  h2 {
    font-size: 21px;
    margin: 8px 0 6px;
  }
  p {
    margin: 0;
  }
  .wie {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin-top: 12px;
    font-size: 13px;
    color: var(--muted);
  }
  .chip.mijn {
    background: var(--line1);
    color: var(--on-line1);
  }
  .jij {
    margin-top: 10px;
    font-weight: 600;
    color: var(--line1);
  }
</style>
