<!--
  Centred dialog over a dimmed page. Built on <dialog>, so Escape closes it and
  focus stays inside while it's open. Clicking the dimmed area also closes it.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, radius, interaction, text } from './tokens.ts';

  type Props = { open: boolean; title: string; children: Snippet };
  let { open = $bindable(), title, children }: Props = $props();

  let dialog: HTMLDialogElement | undefined = $state();

  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  });
</script>

<dialog
  bind:this={dialog}
  onclose={() => (open = false)}
  onclick={(e) => {
    // The panel fills the dialog, so a click on the dialog itself is on the backdrop.
    if (e.target === dialog) open = false;
  }}
  aria-labelledby="modal-title"
  class={cx(
    radius,
    'w-[min(28rem,calc(100vw-2rem))] border-2 border-amber-900/60 bg-amber-50 p-0 text-amber-950 shadow-xl',
    'backdrop:bg-amber-950/40',
  )}
>
  <div class="p-4 md:p-5">
    <div class="mb-3 flex items-center justify-between gap-3">
      <h2 id="modal-title" class={text.heading}>{title}</h2>
      <button
        type="button"
        aria-label="Close"
        title="Close"
        onclick={() => (open = false)}
        class={cx(radius, interaction.focus, 'flex h-8 w-8 items-center justify-center hover:bg-amber-200/70')}
      >
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>
    </div>
    {@render children()}
  </div>
</dialog>
