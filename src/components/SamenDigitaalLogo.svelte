<script>
  // Het logo van Samen Digitaal: tags in Aptos (omgezet naar vormen) met lagen en een prompt. In de donkere weergave de negatieve versie.
  import positief from '../assets/logo-samen-digitaal.svg';
  import negatief from '../assets/logo-samen-digitaal-wit.svg';

  let { hoogte = 30 } = $props();
</script>

<span class="sd-logo" style="height: {hoogte}px">
  <img class="pos" src={positief} alt="Samen Digitaal" height={hoogte} />
  <img class="neg" src={negatief} alt="Samen Digitaal" height={hoogte} />
</span>

<style>
  .sd-logo {
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
