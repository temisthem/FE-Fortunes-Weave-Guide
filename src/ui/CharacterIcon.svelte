<!-- Portrait button in a selection grid. The selected one gets a ring; others stay in full colour. -->
<script lang="ts">
  import { type Character, portrait } from '@/data.ts';
  import { cx, radius, interaction, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';

  type Props = {
    character: Character;
    selected: boolean;
    onclick: () => void;
    /** Small label in the corner, e.g. "R8·S3". */
    badge?: string | null;
    /** Grayscale a unit that is guest-only or can't be recruited on the selected path. */
    dimmed?: boolean;
  };
  let { character, selected, onclick, badge, dimmed = false }: Props = $props();
</script>

<div class="mx-[0.3%] mb-[0.6%] w-[15%] sm:w-[10%] md:w-[7.5%] lg:w-[6%] xl:w-[5.5%]">
  <button
    type="button"
    class={cx('relative block w-full', radius, interaction.focus)}
    {onclick}
    title={character.name}
    aria-pressed={selected}
  >
    <img
      class={cx('aspect-square w-full transition', radius, selected && interaction.selected, dimmed && interaction.dimmed)}
      src={portrait(character.slug)}
      alt={character.name}
      loading="lazy"
    />
    {#if badge}
      <span
        class="absolute bottom-0.5 right-0.5 rounded bg-amber-900/85 px-0.5 text-[9px] font-bold leading-3 text-amber-50 md:text-[10px]"
      >
        {badge}
      </span>
    {/if}
  </button>
  {#if settings.names.value}
    <p class={cx(text.caption, 'mt-0.5 truncate text-center')}>{character.name}</p>
  {/if}
</div>
