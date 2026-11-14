<!-- Inset, scrollable surface (for long pickers). -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, radius } from './tokens.ts';

  let { children }: { children: Snippet } = $props();
</script>

<div class={cx(radius, 'mt-3 max-h-[45vh] overflow-y-auto border-2 border-amber-900/40 bg-amber-100/40 p-2')}>
  {@render children()}
</div>
