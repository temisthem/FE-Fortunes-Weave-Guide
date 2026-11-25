<!--
  The four lords' portraits for one character: a lord in colour has favourited
  them for the Recruit Planner, a grey one hasn't. Tap to toggle. A dashed gap
  marks a route where the character can't be recruited with Renown/Support.
-->
<script lang="ts">
  import { type Character, ROUTES, canFavourite, characterByName, portrait } from '@/data.ts';
  import { cx, interaction } from '@/design/tokens.ts';
  import { isFavourite, toggleFavourite } from '@/favourites.svelte.ts';

  let { character }: { character: Character } = $props();
</script>

<span class="flex justify-center gap-1">
  {#each ROUTES as r (r)}
    {#if canFavourite(character, r)}
      {@const on = isFavourite(r, character.name)}
      <button
        type="button"
        class={cx('w-6 shrink-0 rounded md:w-8', interaction.focus)}
        aria-pressed={on}
        aria-label={`Favourite ${character.name} for ${r}'s Path`}
        title={on ? `Favourited for ${r}'s Path` : `Favourite for ${r}'s Path`}
        onclick={(e) => {
          // The row expands on click; a favourite tap shouldn't.
          e.stopPropagation();
          toggleFavourite(r, character.name);
        }}
      >
        <img
          class={cx(
            'aspect-square w-full rounded transition',
            on ? 'ring-2 ring-amber-600' : 'opacity-50 grayscale hover:opacity-80',
          )}
          src={portrait(characterByName.get(r)!.slug)}
          alt=""
        />
      </button>
    {:else}
      <span
        class="aspect-square w-6 shrink-0 rounded border border-dashed border-amber-900/25 md:w-8"
        title={`Can't be recruited with Renown/Support on ${r}'s Path`}
      ></span>
    {/if}
  {/each}
</span>
