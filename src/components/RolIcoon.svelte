<script>
  import { rolIcon } from '../lib/rolIcons.js';
  let { rol, size = 22 } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style="flex-shrink: 0; fill: none; stroke: currentColor; stroke-width: 1.3; stroke-linecap: round; stroke-linejoin: round">
  <path d={rolIcon[rol] ?? ''} />
</svg>
