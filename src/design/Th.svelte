<!--
  Header cell. Labels wrap instead of overflowing narrow columns. Set the width
  with Tailwind classes via `class` so it can change by breakpoint.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cellBase, cx } from './tokens.ts';

  let { children, class: className }: { children: Snippet; class?: string } = $props();
</script>

<th
  class={cx(
    cellBase,
    'border-b-2 border-b-amber-900/40 bg-amber-200 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-amber-900 [overflow-wrap:anywhere] md:text-sm',
    className,
  )}
>
  {@render children()}
</th>
