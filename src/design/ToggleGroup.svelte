<!-- Single-choice group of toggle buttons. -->
<script lang="ts" generics="T extends string">
  import Button from './Button.svelte';
  import ControlGroup from './ControlGroup.svelte';
  import type { Option } from './tokens.ts';

  type Props = { label?: string; options: readonly Option<T>[]; value: T; size?: 'md' | 'sm' };
  let { label, options, value = $bindable(), size = 'md' }: Props = $props();
</script>

<ControlGroup {label}>
  {#each options as o (o.value)}
    <Button variant="toggle" {size} active={o.value === value} onclick={() => (value = o.value)}>{o.label}</Button>
  {/each}
</ControlGroup>
