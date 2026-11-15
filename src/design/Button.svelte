<!--
  `solid` is for actions. `toggle` is for a choice in a group: it looks solid
  when active and muted when not.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, radius, interaction } from './tokens.ts';

  type Props = {
    onclick: () => void;
    variant?: 'solid' | 'toggle';
    size?: 'md' | 'sm';
    active?: boolean;
    disabled?: boolean;
    children: Snippet;
  };
  let { onclick, variant = 'solid', size = 'md', active = false, disabled = false, children }: Props = $props();

  const sizes = {
    md: 'px-3 py-1 text-sm md:text-base',
    sm: 'px-2 py-0.5 text-xs md:text-sm',
  };
  const filled = $derived(variant === 'solid' || active);
</script>

<button
  type="button"
  {onclick}
  {disabled}
  aria-pressed={variant === 'toggle' ? active : undefined}
  class={cx(
    radius,
    sizes[size],
    interaction.focus,
    'whitespace-nowrap font-semibold transition-colors',
    filled ? 'bg-amber-400 text-amber-950 hover:bg-amber-500' : 'bg-amber-200/70 text-amber-900 hover:bg-amber-300',
    disabled && 'cursor-not-allowed opacity-40 hover:bg-amber-200/70',
  )}
>
  {@render children()}
</button>
