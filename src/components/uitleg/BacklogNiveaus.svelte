<script>
  // Epic → feature → story: drie maten werk naast elkaar, en een uitgewerkt voorbeeld om open te klappen.
  import { href } from '../../lib/router.svelte.js';
  import { laagById } from '../../lib/content.js';

  let { uitleg } = $props();

  const niveaus = $derived(uitleg.niveaus ?? []);
  const vb = $derived(uitleg.voorbeeld);
  // Blokgrootte en kleur per niveau: het werk wordt kleiner naarmate het dichter bij het team komt.
  const MAAT = [92, 62, 36];
  const KLEUR = ['var(--line1)', 'var(--line2)', 'var(--value)'];
  let open = $state(new Set([0]));
  const MEERVOUD = { epic: 'epics', feature: 'features', story: 'stories' };
  const meervoud = (naam) => MEERVOUD[naam.toLowerCase()] ?? naam.toLowerCase();

  function wissel(i) {
    const s = new Set(open);
    s.has(i) ? s.delete(i) : s.add(i);
    open = s;
  }
</script>

<section class="sectie" aria-labelledby="niveaus">
  <h2 id="niveaus">Drie maten werk</h2>
  <ol class="niveaus">
    {#each niveaus as n, i}
      <li style="--kleur: {KLEUR[i] ?? 'var(--line1)'}">
        <div class="blok-vak" aria-hidden="true">
          <span class="blok" style="width: {MAAT[i] ?? 36}px; height: {MAAT[i] ?? 36}px"></span>
        </div>
        <h3>{n.naam}</h3>
        <p class="wat">{n.wat}</p>
        <dl>
          <div><dt>Omvang</dt><dd>{n.horizon}</dd></div>
          <div><dt>Eigenaar</dt><dd>{n.eigenaar}</dd></div>
          <div>
            <dt>Staat op</dt>
            <dd>{n.backlog}{#if n.laag && laagById(n.laag)} · <a href={href('model')}>laag {laagById(n.laag).titel}</a>{/if}</dd>
          </div>
        </dl>
        {#if i < niveaus.length - 1}
          <span class="pijl">Wordt opgeknipt in {meervoud(niveaus[i + 1].naam)} →</span>
        {/if}
      </li>
    {/each}
  </ol>
</section>

{#if vb}
  <section class="sectie" aria-labelledby="voorbeeld">
    <h2 id="voorbeeld">Een voorbeeld, van groot naar klein</h2>
    <div class="boom">
      <div class="epic">
        <span class="soort">Epic</span>
        <strong>{vb.epic}</strong>
        {#if vb.epic_hypothese}<p><em>Hypothese:</em> {vb.epic_hypothese}</p>{/if}
      </div>
      <ul class="features">
        {#each vb.features as f, i}
          <li class:open={open.has(i)}>
            <button class="feature" aria-expanded={open.has(i)} onclick={() => wissel(i)}>
              <span class="soort">Feature</span>
              <strong>{f.naam}</strong>
              <span class="aantal">{f.stories.length} {f.stories.length === 1 ? 'story' : 'stories'} {open.has(i) ? '−' : '+'}</span>
            </button>
            {#if open.has(i)}
              <ul class="stories">
                {#each f.stories as s}
                  <li><span class="soort">Story</span>{s}</li>
                {/each}
              </ul>
            {/if}
          </li>
        {/each}
      </ul>
    </div>
  </section>
{/if}

<style>
  h2 {
    font-size: 24px;
    margin-bottom: 16px;
  }
  .niveaus {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 16px;
  }
  .niveaus li {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 24px;
    border-radius: var(--radius-m);
    background: var(--surface);
  }
  .blok-vak {
    height: 96px;
    display: flex;
    align-items: flex-end;
  }
  .blok {
    display: block;
    border-radius: 10px;
    background: var(--kleur);
    animation: groei 0.7s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    transform-origin: bottom left;
  }
  @keyframes groei {
    from {
      transform: scale(0.4);
      opacity: 0;
    }
  }
  h3 {
    font-size: 22px;
  }
  .wat {
    margin: 0;
    font-size: 16px;
  }
  dl {
    margin: 4px 0 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  dt {
    font-size: 13px;
    font-weight: 600;
    color: var(--muted);
  }
  dd {
    margin: 0;
    font-size: 15px;
  }
  .pijl {
    margin-top: auto;
    padding-top: 8px;
    font-size: 14px;
    font-weight: 600;
    color: var(--line1);
  }

  .boom {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .soort {
    display: block;
    font-size: 13px;
    font-weight: 700;
  }
  .epic {
    padding: 22px 24px;
    border-radius: var(--radius-m);
    background: var(--line1);
    color: var(--on-line1);
  }
  .epic strong {
    font-size: 21px;
  }
  .epic p {
    margin: 8px 0 0;
    max-width: 75ch;
  }
  .features {
    list-style: none;
    margin: 0;
    padding: 0 0 0 clamp(16px, 3vw, 40px);
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(260px, 100%), 1fr));
    gap: 12px;
    align-items: start;
    border-left: 4px solid var(--line1);
  }
  .feature {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 18px 20px;
    border: 0;
    border-radius: var(--radius-m);
    background: color-mix(in srgb, var(--line2) 14%, var(--bg));
    text-align: left;
  }
  .feature .soort {
    color: var(--line2);
  }
  .feature strong {
    font-size: 18px;
  }
  .aantal {
    font-size: 14px;
    color: var(--muted);
  }
  .stories {
    list-style: none;
    margin: 8px 0 0 16px;
    padding: 0 0 0 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    border-left: 3px solid var(--line2);
  }
  .stories li {
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--surface);
    font-size: 15px;
    animation: in 0.35s ease both;
  }
  .stories .soort {
    color: var(--value-text);
    margin-bottom: 2px;
  }
  @keyframes in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }
  @media (max-width: 860px) {
    .niveaus {
      grid-template-columns: minmax(0, 1fr);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .blok,
    .stories li {
      animation: none;
    }
  }
</style>
