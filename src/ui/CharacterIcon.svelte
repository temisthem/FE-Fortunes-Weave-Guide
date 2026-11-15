<!-- Portrait button in a selection grid. The selected one gets a ring; others stay in full colour. -->
<script lang="ts">
  import { type Character, portrait } from '@/data.ts';
  import { cx, radius, interaction, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';
  import Badge from '@/ui/Badge.svelte';

  type Props = {
    character: Character;
    selected: boolean;
    onclick: () => void;
    /** Small label in the corner, e.g. "R8·S3". */
    badge?: string | null;
  };
  let { character, selected, onclick, badge }: Props = $props();
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
      class={cx('aspect-square w-full transition', radius, selected && interaction.selected)}
      src={portrait(character.slug)}
      alt={character.name}
      loading="lazy"
    />
    {#if badge}<Badge label={badge} />{/if}
  </button>
  {#if settings.names.value}
    <p class={cx(text.caption, 'mt-0.5 truncate text-center')}>{character.name}</p>
  {/if}
</div>
