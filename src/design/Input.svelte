<script lang="ts">
  import { border, cx, radius, interaction, text } from './tokens.ts';

  let { value = $bindable(), placeholder }: { value: string; placeholder: string } = $props();
</script>

<input
  class={cx(radius, border, text.small, 'w-44 bg-amber-50 px-2 py-1 placeholder:text-amber-900/50 sm:w-56', interaction.focus)}
  {placeholder}
  bind:value
/>
