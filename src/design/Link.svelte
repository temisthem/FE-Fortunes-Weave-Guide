<script lang="ts">
  import type { Snippet } from 'svelte';

  let { href, children }: { href: string; children: Snippet } = $props();
</script>

<a class="text-blue-700 underline-offset-2 hover:underline" {href} target="_blank" rel="noreferrer">{@render children()}</a>
