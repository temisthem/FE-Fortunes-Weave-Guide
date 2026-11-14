<!-- Gift card: dark tile with light text. Loved gifts get a gold border on a red tile. -->
<script lang="ts">
  import type { Gift, LikeCounts, Preference } from '@/data.ts';
  import { cx, radius, interaction } from '@/design/tokens.ts';

  type Props = {
    gift: Gift;
    preference?: Preference;
    selected?: boolean;
    onclick: () => void;
    /** In a picker: grey out the tiles that aren't selected. */
    selectable?: boolean;
    /** Picker only: how many recruitable units on the path love / like it. */
    likes?: LikeCounts;
  };
  let { gift, preference, selected = false, onclick, selectable = false, likes }: Props = $props();
</script>

<button
  type="button"
  {onclick}
  aria-pressed={selectable ? selected : undefined}
  class={cx(
    radius,
    interaction.focus,
    'flex w-full flex-col justify-center border-2 px-2.5 py-1.5 text-left transition',
    likes && 'min-h-[3.25rem]',
    preference === 'Loved' ? 'border-yellow-400 bg-rose-900' : 'border-amber-950 bg-amber-800',
    selected && interaction.selected,
    selectable && !selected && interaction.unselected,
    likes && likes.loved + likes.liked === 0 && 'opacity-60',
  )}
>
  <span class="text-xs font-semibold leading-tight text-amber-50 md:text-sm">{gift.name}</span>
  {#if likes}
    <span class="text-[10px] uppercase tracking-wide text-amber-200/80 md:text-[11px]">
      <span class={likes.loved > 0 ? 'text-yellow-300' : undefined}>{likes.loved} loved</span>
      · {likes.liked} liked
    </span>
  {/if}
</button>
