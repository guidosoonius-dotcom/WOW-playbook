<script>
  let { size = 34 } = $props();
</script>

<svg width={size} height={size} viewBox="0 0 34 34" aria-hidden="true">
  <path d="M3 10 H12 Q16 10 18 14 L22 24 Q24 28 29 28" style="fill: none; stroke: var(--line1); stroke-width: 2.4; stroke-linecap: round" />
  <path d="M3 26 H10 Q14 26 16 22 L20 12 Q22 7 29 7" style="fill: none; stroke: var(--line2); stroke-width: 2.4; stroke-linecap: round" />
  <circle cx="17" cy="17" r="4" style="fill: var(--value)" />
</svg>
