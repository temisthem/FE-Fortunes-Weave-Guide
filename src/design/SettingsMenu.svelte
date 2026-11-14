<!-- Gear button that opens a small dropdown of on/off settings. Closes on outside click or Escape. -->
<script lang="ts">
  import type { Stored } from '@/stored.svelte.ts';
  import { cx, radius, interaction, text } from './tokens.ts';

  let { items }: { items: { label: string; setting: Stored<boolean> }[] } = $props();

  let open = $state(false);
  let root: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root?.contains(e.target as Node)) open = false;
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') open = false;
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  });
</script>

<div bind:this={root} class="relative">
  <button
    type="button"
    aria-label="Settings"
    title="Settings"
    aria-expanded={open}
    aria-haspopup="true"
    onclick={() => (open = !open)}
    class={cx(
      radius,
      interaction.focus,
      'flex h-8 w-8 items-center justify-center text-amber-900 transition-colors hover:bg-amber-200/70',
      open && 'bg-amber-200/70',
    )}
  >
    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M10.3 4.3c.4-1.7 2.9-1.7 3.4 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.3.8 2.4 2.4a1.7 1.7 0 0 0 1 2.5c1.8.5 1.8 3 0 3.4a1.7 1.7 0 0 0-1 2.6c.9 1.5-.9 3.3-2.4 2.4a1.7 1.7 0 0 0-2.6 1c-.4 1.8-3 1.8-3.4 0a1.7 1.7 0 0 0-2.5-1c-1.6.9-3.3-.9-2.4-2.4a1.7 1.7 0 0 0-1.1-2.6c-1.7-.4-1.7-2.9 0-3.4a1.7 1.7 0 0 0 1.1-2.5c-.9-1.6.8-3.3 2.4-2.4a1.7 1.7 0 0 0 2.5-1.1z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  </button>
  {#if open}
    <div
      class={cx(radius, 'absolute right-0 top-full z-20 mt-1 w-60 border-2 border-amber-900/40 bg-amber-50 p-1.5 shadow-lg')}
    >
      {#each items as item (item.label)}
        <label
          class={cx(text.small, 'flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-1.5 hover:bg-amber-100')}
        >
          {item.label}
          <input type="checkbox" class="h-4 w-4 cursor-pointer accent-amber-600" bind:checked={item.setting.value} />
        </label>
      {/each}
    </div>
  {/if}
</div>
