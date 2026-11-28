<script>
  // Een blok als één lang verhaal: alle pagina's van het blok onder elkaar, met een zijbalk die meeloopt
  // en een metrolijn langs de kant waar elke pagina een halte is. De losse pagina's blijven bestaan.
  import { setContext, onMount } from 'svelte';
  import { blokById } from '../lib/blokken.js';
  import { href } from '../lib/router.svelte.js';
  import BlokBadge from '../components/BlokBadge.svelte';

  let { blok, resolve } = $props();
  setContext('verhaal', true);

  const b = $derived(blokById(blok));
  const delen = $derived(b.items.map((item) => ({ item, pagina: resolve(item.pad.split('/')) })));

  let actief = $state(0);
  let vul = $state(0); // hoe ver de lijn gevuld is, in pixels
  let open = $state(false); // uitgeklapte inhoud op een telefoon
  let lijst;
  let secties = [];

  function meten() {
    if (!lijst) return;
    const midden = innerHeight * 0.4;
    let nu = 0;
    secties.forEach((s, i) => {
      if (s && s.getBoundingClientRect().top <= midden) nu = i;
    });
    actief = nu;
    const top = lijst.getBoundingClientRect().top;
    vul = Math.max(0, Math.min(lijst.offsetHeight, midden - top));
  }
  let wacht = false;
  function opScroll() {
    if (wacht) return;
    wacht = true;
    requestAnimationFrame(() => {
      wacht = false;
      meten();
    });
  }
  onMount(() => {
    meten();
    addEventListener('scroll', opScroll, { passive: true });
    addEventListener('resize', opScroll);
    return () => {
      removeEventListener('scroll', opScroll);
      removeEventListener('resize', opScroll);
    };
  });

  function spring(i) {
    open = false;
    secties[i]?.scrollIntoView({ block: 'start' });
  }
  const voortgang = $derived(((actief + 1) / delen.length) * 100);
</script>

<div class="container verhaalpagina">
  <aside class="zij" aria-label="In dit blok">
    <div class="zijkop">
      <BlokBadge blok={b.id} groot naam={false} />
      <div>
        <strong>{b.titel}</strong>
        <span>Pagina {actief + 1} van {delen.length}</span>
      </div>
      <button type="button" class="inhoud" aria-expanded={open} aria-controls="verhaal-inhoud" onclick={() => (open = !open)}>Inhoud</button>
    </div>
    <div class="balk" aria-hidden="true"><span style="width: {voortgang}%"></span></div>
    <ol id="verhaal-inhoud" class:open>
      {#each delen as d, i}
        <li>
          <button type="button" class:nu={i === actief} aria-current={i === actief ? 'step' : undefined} onclick={() => spring(i)}>
            <span class="n">{i + 1}</span>{d.item.titel}
          </button>
        </li>
      {/each}
    </ol>
    <a class="volgend" href={href(b.id === 'A' ? 'manieren' : 'portfolio')}>
      Naar blok {b.id === 'A' ? 'B' : 'C'} <span aria-hidden="true">→</span>
    </a>
  </aside>

  <div class="verhaal">
    <header class="intro">
      <BlokBadge blok={b.id} />
      <h1>{b.id === 'A' ? 'Waarom we het doen en waar we ons aan houden' : 'Hoe we werk en teams inrichten'}</h1>
      <p>{b.id === 'A'
        ? 'Vier pagina\'s over de richting: het verhaal, de afspraken waar alles op rust, het model en de weg ernaartoe. Scroll door, of spring met de zijbalk.'
        : 'Vijf pagina\'s die op elkaar voortbouwen: eerst de vormen van werken, dan de teams, de stromen, de rollen en de spelregels. Scroll door, of spring met de zijbalk.'}</p>
    </header>

    <div class="lijst" bind:this={lijst}>
      <div class="rail" aria-hidden="true"><span style="height: {vul}px"></span></div>
      {#each delen as d, i}
        <section class="deel" bind:this={secties[i]} aria-labelledby="deel-{i}">
          <span class="halte" class:bereikt={i <= actief} class:nu={i === actief} aria-hidden="true"></span>
          <p class="telling" id="deel-{i}">{i + 1} van {delen.length}</p>
          <d.pagina.comp {...d.pagina.props ?? {}} />
          {#if i < delen.length - 1}
            <p class="verder"><span aria-hidden="true">↓</span> Verder: {delen[i + 1].item.titel}</p>
          {/if}
        </section>
      {/each}
    </div>
  </div>
</div>

<style>
  .verhaalpagina {
    display: grid;
    grid-template-columns: 260px minmax(0, 1fr);
    gap: 56px;
    align-items: start;
  }

  /* Zijbalk */
  .zij {
    position: sticky;
    top: calc(var(--kop-h, 73px) + 16px);
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .zijkop {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 8px 4px;
  }
  .zijkop strong {
    display: block;
    font-size: 18px;
    letter-spacing: -0.02em;
  }
  .zijkop span {
    font-size: 12.5px;
    color: var(--muted);
  }
  .inhoud {
    display: none;
    margin-left: auto;
    min-height: 44px;
    padding: 0 16px;
    border: 0;
    border-radius: 999px;
    background: var(--surface);
    color: var(--ink);
    font: inherit;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }
  .balk {
    height: 5px;
    margin: 6px 8px 10px;
    border-radius: 3px;
    background: var(--track);
  }
  .balk span {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--line2);
    transition: width 0.3s ease;
  }
  ol {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  ol button {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: var(--ink);
    font: inherit;
    font-size: 14.5px;
    font-weight: 600;
    line-height: 1.3;
    text-align: left;
    cursor: pointer;
  }
  ol button:hover {
    background: var(--chip);
  }
  ol button.nu {
    background: var(--surface);
    font-weight: 800;
    box-shadow: inset 3px 0 0 var(--line2);
  }
  .n {
    flex: none;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    display: grid;
    place-items: center;
    background: var(--chip);
    font-size: 11.5px;
    font-weight: 800;
  }
  button.nu .n {
    background: var(--line2);
    color: #fff;
  }
  .volgend {
    margin-top: 14px;
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--vlak-blauw);
    color: #fff;
    font-weight: 700;
    font-size: 14.5px;
    text-decoration: none;
  }

  /* Het verhaal */
  .intro {
    padding-top: 40px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-width: 62ch;
    margin-bottom: 48px;
    padding-left: 56px;
  }
  .intro h1 {
    margin: 0;
    font-size: clamp(34px, 5vw, 56px);
    line-height: 1.02;
    letter-spacing: -0.035em;
    color: var(--titel);
  }
  .intro p {
    margin: 0;
    font-size: 18px;
    line-height: 1.55;
  }
  .lijst {
    position: relative;
  }
  .rail {
    position: absolute;
    left: 11px;
    top: 14px;
    bottom: 14px;
    border-left: 5px solid var(--track);
    border-radius: 3px;
  }
  .rail span {
    position: absolute;
    left: -5px;
    top: 0;
    width: 5px;
    border-radius: 3px;
    background: var(--line2);
    transition: height 0.15s linear;
  }
  .deel {
    position: relative;
    padding-left: 56px;
    margin-bottom: 72px;
    scroll-margin-top: calc(var(--kop-h, 73px) + 12px);
  }
  .deel :global(.container) {
    max-width: none;
    padding-inline: 0;
    margin: 0;
  }
  .halte {
    position: absolute;
    left: 0;
    top: 8px;
    width: 26px;
    height: 26px;
    box-sizing: border-box;
    border-radius: 50%;
    border: 4px solid var(--track);
    background: var(--bg);
    transition: border-color 0.3s, background 0.3s, box-shadow 0.3s;
  }
  .halte.bereikt {
    border-color: var(--line2);
  }
  .halte.nu {
    background: var(--line2);
    box-shadow: 0 0 0 6px color-mix(in srgb, var(--line2) 22%, transparent);
  }
  .telling {
    margin: 0;
    padding-top: 8px;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--line2);
  }
  .deel :global(.kop) {
    padding-top: 8px;
  }
  .verder {
    margin: 40px 0 0;
    font-size: 14px;
    font-weight: 700;
    color: var(--line2);
  }

  /* Telefoon en tablet: de zijbalk wordt een balk bovenin die blijft staan. */
  @media (max-width: 960px) {
    .verhaalpagina {
      grid-template-columns: minmax(0, 1fr);
      gap: 0;
    }
    .zij {
      top: var(--kop-h, 73px);
      z-index: 5;
      margin: 0 calc(var(--gutter) * -1);
      padding: 10px var(--gutter) 8px;
      background: color-mix(in srgb, var(--bg) 94%, transparent);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid var(--border);
    }
    .inhoud {
      display: inline-flex;
      align-items: center;
    }
    .zij ol {
      display: none;
      position: absolute;
      left: var(--gutter);
      right: var(--gutter);
      top: 100%;
      margin-top: 6px;
      padding: 8px;
      border-radius: 18px;
      background: var(--surface);
      box-shadow: 0 18px 40px rgb(0 43 82 / 0.22);
    }
    .zij ol.open {
      display: flex;
    }
    .zij .volgend {
      display: none;
    }
    .balk {
      margin-inline: 0;
    }
    .intro {
      padding-left: 40px;
    }
    .deel {
      padding-left: 40px;
    }
    .rail {
      left: 8px;
    }
    .halte {
      width: 20px;
      height: 20px;
      border-width: 3px;
    }
  }
  @media print {
    .zij {
      display: none;
    }
  }
</style>
