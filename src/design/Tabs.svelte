<!--
  Top-level navigation between the app's screens. Styled as underlined tabs so
  it reads differently from the in-screen toggle buttons. `aside` sits to the
  right, outside the underline (e.g. the settings menu).
-->
<script lang="ts" generics="T extends string">
  import type { Snippet } from 'svelte';
  import { cx, type Option } from './tokens.ts';

  type Props = { options: readonly Option<T>[]; value: T; aside?: Snippet };
  let { options, value = $bindable(), aside }: Props = $props();
</script>

<div class="flex items-center gap-2">
  <div class="flex flex-1 border-b-2 border-amber-900/25" role="tablist">
    {#each options as o (o.value)}
      {@const active = o.value === value}
      <button
        type="button"
        role="tab"
        aria-selected={active}
        onclick={() => (value = o.value)}
        class={cx(
          '-mb-0.5 flex-1 border-b-[3px] px-3 py-1 text-sm font-bold transition-colors md:py-1.5 md:text-base',
          'rounded-t-md focus-visible:bg-amber-200/60 focus-visible:outline-none',
          active
            ? 'border-amber-600 text-amber-950'
            : 'border-transparent text-amber-900/60 hover:border-amber-300 hover:text-amber-900',
        )}
      >
        {o.label}
      </button>
    {/each}
  </div>
  {#if aside}<div class="shrink-0">{@render aside()}</div>{/if}
</div>
