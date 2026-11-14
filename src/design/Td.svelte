<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cellBase, cx } from './tokens.ts';

  type Props = { children: Snippet; tone?: 'default' | 'center' | 'strong' | 'muted'; class?: string };
  let { children, tone = 'default', class: className }: Props = $props();

  const tones = {
    default: '',
    center: 'text-center font-semibold',
    strong: 'font-semibold',
    muted: 'text-amber-900',
  };
</script>

<td class={cx(cellBase, tones[tone], className)}>{@render children()}</td>
