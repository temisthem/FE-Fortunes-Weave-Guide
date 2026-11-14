<!-- "Label: value" line used in detail headers. -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  let { label, children }: { label: string; children: Snippet } = $props();
</script>

<p><span class="font-bold">{label}:</span> {@render children()}</p>
