<!-- Wrapping grid of portraits. -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();
</script>

<div class="mt-4 flex flex-wrap justify-center">{@render children()}</div>
