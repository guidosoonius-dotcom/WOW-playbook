<script>
  // Het logo van Facilicom Groep, uit de PowerPoint-template. In de donkere weergave de witte versie.
  import positief from '../assets/logo-facilicom-groep.svg';
  import negatief from '../assets/logo-facilicom-groep-wit.svg';

  let { hoogte = 30 } = $props();
</script>

<span class="facilicom-logo" style="height: {hoogte}px">
  <img class="pos" src={positief} alt="Facilicom Groep" height={hoogte} />
  <img class="neg" src={negatief} alt="Facilicom Groep" height={hoogte} />
</span>

<style>
  .facilicom-logo {
    display: inline-flex;
    flex-shrink: 0;
  }
  img {
    height: 100%;
    width: auto;
  }
  .neg {
    display: none;
  }
  :global([data-theme='dark']) .pos {
    display: none;
  }
  :global([data-theme='dark']) .neg {
    display: block;
  }
  @media (prefers-color-scheme: dark) {
    :global(:root:not([data-theme='light'])) .pos {
      display: none;
    }
    :global(:root:not([data-theme='light'])) .neg {
      display: block;
    }
  }
</style>
