<!-- Row of control groups at the top of a screen. -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">{@render children()}</div>
