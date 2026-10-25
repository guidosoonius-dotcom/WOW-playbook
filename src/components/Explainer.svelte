<script>
  import ModelScene from './explainers/ModelScene.svelte';
  import ProductScene from './explainers/ProductScene.svelte';
  import RitmeScene from './explainers/RitmeScene.svelte';
  import EpicScene from './explainers/EpicScene.svelte';
  import PIScene from './explainers/PIScene.svelte';

  let { explainer, kop = 'h2' } = $props();

  const SCENES = { model: ModelScene, product: ProductScene, ritme: RitmeScene, epic: EpicScene, pi: PIScene };
  const STAPDUUR = 6000;
  const minderBeweging = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;

  const Scene = $derived(SCENES[explainer.scene]);
  const aantal = $derived(explainer.stappen.length);

  // Bij "minder beweging" tonen we meteen het complete beeld (de laatste stap); stappen blijven bladerbaar.
  // De explainer wisselt niet binnen één component (de pagina wordt per route opnieuw opgebouwd).
  // svelte-ignore state_referenced_locally
  let step = $state(minderBeweging ? explainer.stappen.length - 1 : 0);
  let playing = $state(!minderBeweging);
  let presenting = $state(false);
  let inBeeld = $state(true);
  let root;

  // Automatisch doorspelen, alleen als de explainer in beeld is en het tabblad zichtbaar is.
  $effect(() => {
    if (!playing || !inBeeld) return;
    const timer = setInterval(() => {
      if (!document.hidden) step = (step + 1) % aantal;
    }, STAPDUUR);
    return () => clearInterval(timer);
  });

  $effect(() => {
    if (typeof IntersectionObserver !== 'function') return;
    const io = new IntersectionObserver(([e]) => (inBeeld = e.isIntersecting), { threshold: 0.35 });
    io.observe(root);
    return () => io.disconnect();
  });

  $effect(() => {
    if (!presenting) return;
    const onKey = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') naar(step + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') naar(step - 1);
      else if (e.key === ' ') {
        e.preventDefault();
        playing = !playing;
      } else if (e.key === 'Escape' && !document.fullscreenElement) presenting = false;
    };
    const onFs = () => {
      if (!document.fullscreenElement) presenting = false;
    };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  });

  function naar(i) {
    step = (i + aantal) % aantal;
    playing = false;
  }

  async function presenteer() {
    if (presenting) {
      if (document.fullscreenElement) await document.exitFullscreen();
      presenting = false;
      return;
    }
    presenting = true;
    step = 0;
    playing = !minderBeweging;
    try {
      await root.requestFullscreen?.();
    } catch {
      // Volledig scherm kan geblokkeerd zijn (bijv. in een iframe); de overlay werkt dan nog steeds.
    }
  }
</script>

<section
  class="explainer"
  class:presenting
  bind:this={root}
  data-theme={presenting ? 'dark' : undefined}
  aria-roledescription="explainer"
  aria-label={explainer.titel}
>
  <div class="zijbalk">
    <div class="kop">
      <svelte:element this={kop} class="titel">{explainer.titel}</svelte:element>
      <span class="meta">Explainer in {aantal} stappen · {explainer.duur}</span>
    </div>

    <ol class="stappen">
      {#each explainer.stappen as stap, i}
        <li>
          <button class="stap" class:actief={i === step} aria-current={i === step ? 'step' : undefined} onclick={() => naar(i)}>
            <span class="nr" class:gedaan={i < step}>{i + 1}</span>
            <span class="tekst">
              <strong>{stap.titel}</strong>
              {#if i === step}
                <span class="uitleg">{stap.tekst}</span>
                <span class="voortgang" aria-hidden="true">
                  {#key step}<span class="balk" class:loopt={playing && inBeeld} style="animation-duration: {STAPDUUR}ms"></span>{/key}
                </span>
              {/if}
            </span>
          </button>
        </li>
      {/each}
    </ol>

    <div class="bediening">
      <button class="rond" onclick={() => naar(step - 1)} aria-label="Vorige stap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5 L8 12 L15 19" /></svg>
      </button>
      <button class="btn btn--primary speel" onclick={() => (playing = !playing)}>
        {#if playing}
          <svg viewBox="0 0 14 14" aria-hidden="true" class="vol"><rect x="2" y="1" width="3.5" height="12" rx="1" /><rect x="8.5" y="1" width="3.5" height="12" rx="1" /></svg>Pauze
        {:else}
          <svg viewBox="0 0 14 14" aria-hidden="true" class="vol"><path d="M3 1 L13 7 L3 13 Z" /></svg>Afspelen
        {/if}
      </button>
      <button class="rond" onclick={() => naar(step + 1)} aria-label="Volgende stap">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5 L16 12 L9 19" /></svg>
      </button>
      <button class="btn presenteer" onclick={presenteer}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21 H16 M12 17 V21" /></svg>
        {presenting ? 'Stoppen' : 'Presenteren'}
      </button>
    </div>
  </div>

  <figure class="podium">
    <div class="scene"><Scene {step} /></div>
    <figcaption aria-live="polite">
      <span class="groot-nr">{step + 1}</span>
      {#key step}<span class="bijschrift">{explainer.stappen[step].titel}</span>{/key}
    </figcaption>
  </figure>
</section>

<style>
  .explainer {
    display: grid;
    grid-template-columns: minmax(0, 4fr) minmax(0, 8fr);
    gap: 32px;
    align-items: stretch;
    color: var(--ink);
  }

  .zijbalk {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .kop {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .titel {
    font-size: clamp(28px, 3.2vw, 40px);
    font-weight: 700;
  }

  .stappen {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .stap {
    width: 100%;
    display: flex;
    gap: 14px;
    align-items: flex-start;
    text-align: left;
    padding: 12px 14px;
    border: 0;
    border-radius: 18px;
    background: transparent;
  }

  .stap.actief {
    background: var(--panel);
  }

  .nr {
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    font-size: 13px;
    font-weight: 700;
    border: 1.5px solid var(--muted);
    color: var(--muted);
  }

  .nr.gedaan {
    background: var(--line1);
    border-color: var(--line1);
    color: var(--on-line1);
  }

  .actief .nr {
    background: var(--value);
    border-color: var(--value);
    color: #14213d;
  }

  .tekst {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  .tekst strong {
    font-size: 17px;
  }

  .uitleg {
    font-size: 15px;
    line-height: 1.5;
    color: var(--muted);
  }

  .voortgang {
    display: block;
    height: 3px;
    margin-top: 6px;
    border-radius: 2px;
    background: var(--track);
    overflow: hidden;
  }

  .balk {
    display: block;
    height: 100%;
    width: 100%;
    background: var(--value);
  }

  .balk.loopt {
    animation: vul linear forwards;
  }

  @keyframes vul {
    from { width: 0; }
    to { width: 100%; }
  }

  .bediening {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px;
    margin-top: auto;
  }

  .rond {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    border: 1.5px solid var(--ink);
    background: transparent;
    display: grid;
    place-items: center;
  }

  svg:not(.vol) {
    width: 16px;
    height: 16px;
    fill: none;
    stroke: currentColor;
    stroke-width: 1.8;
    stroke-linecap: round;
  }

  .vol {
    width: 14px;
    height: 14px;
    fill: currentColor;
  }

  .speel,
  .presenteer {
    min-height: 44px;
  }

  .podium {
    margin: 0;
    border-radius: var(--radius-l);
    background: var(--panel);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 420px;
  }

  .scene {
    flex: 1;
    display: grid;
    place-items: center;
    padding: 24px 24px 0;
  }

  figcaption {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: 8px 32px 28px;
  }

  .groot-nr {
    font-size: 40px;
    font-weight: 700;
    line-height: 1;
    color: var(--value);
  }

  .bijschrift {
    font-size: 21px;
    font-weight: 700;
    letter-spacing: -0.015em;
    line-height: 1.2;
    animation: op 0.7s ease both;
  }

  @keyframes op {
    from { opacity: 0; transform: translateY(8px); }
    to { opacity: 1; transform: none; }
  }

  /* Presentatiemodus: schermvullend, donker, grote typografie. */
  .presenting {
    position: fixed;
    inset: 0;
    z-index: 100;
    background: var(--bg);
    padding: clamp(20px, 4vw, 56px);
    grid-template-columns: minmax(0, 3fr) minmax(0, 9fr);
    overflow: auto;
  }

  .presenting .bijschrift {
    font-size: clamp(28px, 3.2vw, 40px);
  }

  @media (max-width: 860px) {
    .explainer,
    .presenting {
      grid-template-columns: minmax(0, 1fr);
    }
    .podium {
      order: -1;
      min-height: 0;
    }
    figcaption {
      padding: 4px 20px 20px;
    }
  }
</style>
