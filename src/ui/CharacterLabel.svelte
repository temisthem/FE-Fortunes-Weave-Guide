<!-- Portrait and name for a table cell. Anything passed as children goes under the name. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { type Character, portrait } from '@/data.ts';

  let { character, children }: { character: Character; children?: Snippet } = $props();
</script>

<span class="flex min-w-0 items-center gap-2">
  <img class="aspect-square w-8 shrink-0 rounded md:w-10" src={portrait(character.slug)} alt="" loading="lazy" />
  <span class="min-w-0">
    <span class="block truncate font-semibold">{character.name}</span>
    {#if children}{@render children()}{/if}
  </span>
</span>
