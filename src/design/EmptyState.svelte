<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, text } from './tokens.ts';

  let { children }: { children: Snippet } = $props();
</script>

<p class={cx(text.heading, 'mx-auto mt-8 w-fit text-center')}>{@render children()}</p>
