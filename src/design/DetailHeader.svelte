<!-- Portrait + name header for whatever is selected (character or gift). -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { border, cx, radius, text } from './tokens.ts';

  type Props = { image?: string; title: string; children?: Snippet; aside?: Snippet };
  let { image, title, children, aside }: Props = $props();
</script>

<div class="mx-auto flex max-w-4xl flex-wrap items-center gap-3">
  {#if image}<img class={cx(radius, border, 'w-16 md:w-20')} src={image} alt="" />{/if}
  <div class="min-w-0 flex-1">
    <h2 class={text.heading}>{title}</h2>
    {#if children}<div class={cx(text.small, 'space-y-0.5')}>{@render children()}</div>{/if}
  </div>
  {@render aside?.()}
</div>
