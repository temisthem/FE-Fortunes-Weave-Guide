<!-- A titled block of content. Sections are spaced the same everywhere. -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, text } from './tokens.ts';

  let { title, children }: { title?: string; children: Snippet } = $props();
</script>

<section class="mt-6">
  {#if title}<h3 class={cx(text.section, 'mb-2 text-center')}>{title}</h3>{/if}
  {@render children()}
</section>
