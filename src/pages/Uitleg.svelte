<script>
  import content, { uitlegById, titelVoorRoute } from '../lib/content.js';
  import { href } from '../lib/router.svelte.js';
  import PaginaKop from '../components/PaginaKop.svelte';
  import WaardestroomVerkenner from '../components/uitleg/WaardestroomVerkenner.svelte';
  import TeamPlaat from '../components/uitleg/TeamPlaat.svelte';
  import BacklogNiveaus from '../components/uitleg/BacklogNiveaus.svelte';

  let { id } = $props();
  const u = $derived(uitlegById(id));

  // Het interactieve deel per uitlegpagina.
  const ONDERDEEL = { waardestroom: WaardestroomVerkenner, productteam: TeamPlaat, 'epics-features-stories': BacklogNiveaus };
  // Waar je na het lezen verder kunt.
  const VERDER = {
    waardestroom: ['model', 'uitleg/productteam', 'ritme/pi-planning'],
    productteam: ['rollen/product-owner', 'rollen/team-coach', 'rollen/teamlid', 'ritme'],
    'epics-features-stories': ['sturen', 'ritme/pi-planning', 'ritme/refinement', 'rollen/product-manager'],
    'wat-is-een-product': ['uitleg/productteam', 'uitleg/bouwen-en-draaien', 'rollen/product-owner'],
    'bouwen-en-draaien': ['uitleg/wat-is-een-product', 'rollen/teamlid', 'doen/dilemmas'],
    'lopende-projecten': ['sturen', 'rollen/epic-owner', 'rollen/productgroep-coach', 'transitie'],
    meten: ['doen/teamscan', 'ritme/inspect-adapt', 'ritme/systeemdemo'],
    kaders: ['rollen/architect', 'beslissen', 'sturen'],
    'veelgestelde-vragen': ['rollen/leidinggevende', 'uitleg/lopende-projecten', 'waarom']
  };
  const Onderdeel = $derived(ONDERDEEL[id]);
  // De isometrische tekening naast de titel.
  const BEELD = { waardestroom: 'waardestroom', productteam: 'productteam', 'epics-features-stories': 'backlog' };
  const anderen = $derived(content.uitleg.filter((x) => x.id !== id && !(VERDER[id] ?? []).includes('uitleg/' + x.id)));
</script>

<div class="container">
  <PaginaKop eyebrow="Uitgelegd" beeld={BEELD[id]} titel={u.titel} kern={u.kern} samenvatting={u.samenvatting} safe={u.safe} status={u.status} />

  {#if Onderdeel}<Onderdeel uitleg={u} />{/if}

  {#if u.html}<section class="sectie prose">{@html u.html}</section>{/if}

  <section class="sectie verder" aria-labelledby="verder-kop">
    <h2 id="verder-kop">Verder lezen</h2>
    <ul>
      {#each VERDER[id] ?? [] as r}
        <li><a class="chip" href={href(r)}>{titelVoorRoute(r)} →</a></li>
      {/each}
      {#each anderen as x}
        <li><a class="chip" href={href('uitleg/' + x.id)}>{x.titel} →</a></li>
      {/each}
    </ul>
  </section>
</div>

<style>
  .verder h2 {
    font-size: 20px;
    margin-bottom: 12px;
  }
  .verder ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .verder .chip {
    min-height: 40px;
    padding: 0 16px;
    font-size: 15px;
  }
</style>
