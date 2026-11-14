<!-- A labelled group of controls. Every toolbar item uses this. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { text } from './tokens.ts';

  let { label, children }: { label?: string; children: Snippet } = $props();
</script>

<div class="flex flex-wrap items-center gap-2">
  {#if label}<span class={text.label}>{label}</span>{/if}
  <div class="flex flex-wrap items-center gap-1">{@render children()}</div>
</div>
