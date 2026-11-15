<!--
  Pick up to three inn dishes; each gets a row of units who love it and a row
  of units who like it. The route picker is shared with Gifting and sets the
  R·S tags. With the Meals "Only show recruitable units" setting on, the rows
  keep only units recruited with Renown/Support on that route (the ones with
  an R·S tag) plus that route's lord.
-->
<script lang="ts">
  import {
    type SortKey,
    SORT_LABELS,
    characterByName,
    compareCharacters,
    hasRecruitTag,
    isRouteLord,
    meals,
    requirementBadge,
  } from '@/data.ts';
  import Button from '@/design/Button.svelte';
  import EmptyState from '@/design/EmptyState.svelte';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import { cx, interaction, text } from '@/design/tokens.ts';
  import Toolbar from '@/design/Toolbar.svelte';
  import { currentRoute } from '@/route.svelte.ts';
  import { settings } from '@/settings.svelte.ts';
  import { stored } from '@/stored.svelte.ts';
  import MiniPortrait from '@/ui/MiniPortrait.svelte';
  import RouteSelector from '@/ui/RouteSelector.svelte';
  import SortSelector from '@/ui/SortSelector.svelte';

  const MAX_SELECTED = 3;
  /** Dishes in alphabetical order, for both the buttons and the rows. */
  const MENU = [...meals].sort((a, b) => a.name.localeCompare(b.name));
  const DISHES = MENU.map((m) => m.name);

  const selected = stored<string[]>(
    'meals.selected',
    [],
    (v) => Array.isArray(v) && v.length <= MAX_SELECTED && v.every((d) => DISHES.includes(d)),
  );

  const sort = stored<SortKey>('meals.sort', 'name', (v) => Object.keys(SORT_LABELS).includes(v as string));

  const full = $derived(selected.value.length >= MAX_SELECTED);

  const toggle = (dish: string) => {
    const current = selected.value;
    if (current.includes(dish)) selected.value = current.filter((d) => d !== dish);
    else if (!full) selected.value = [...current, dish];
  };

  const recruitableOnly = $derived(settings.mealsRecruitableOnly.value);

  const byName = (names: string[]) =>
    names
      .map((n) => characterByName.get(n)!)
      // The recruitable filter keeps units with an R·S tag, plus the route's lord.
      .filter(
        (c) =>
          c &&
          (!recruitableOnly || hasRecruitTag(c, currentRoute.value) || isRouteLord(c, currentRoute.value)),
      )
      .sort(compareCharacters(sort.value, currentRoute.value));

  // Rows stay alphabetical, not in the order the dishes were picked.
  const rows = $derived(
    MENU
      .filter((m) => selected.value.includes(m.name))
      .map((m) => ({
        name: m.name,
        reactions: [
          { label: 'Loves', characters: byName(m.loved) },
          { label: 'Likes', characters: byName(m.liked) },
        ],
      })),
  );
</script>

<Toolbar>
  <RouteSelector bind:route={currentRoute.value} />
  <SortSelector bind:sort={sort.value} />
</Toolbar>

<div class="mt-4 flex flex-col items-center gap-2">
  <div class="flex items-center gap-3">
    <span class={text.label}>Dishes ({selected.value.length}/{MAX_SELECTED})</span>
    {#if selected.value.length > 0}
      <button
        type="button"
        class={cx(text.small, interaction.focus, 'rounded text-amber-900 underline underline-offset-2 hover:text-amber-950')}
        onclick={() => (selected.value = [])}
      >
        Clear
      </button>
    {/if}
  </div>
  <div class="flex max-w-4xl flex-wrap justify-center gap-1">
    {#each DISHES as dish (dish)}
      {@const active = selected.value.includes(dish)}
      <Button variant="toggle" size="sm" {active} disabled={full && !active} onclick={() => toggle(dish)}>
        {dish}
      </Button>
    {/each}
  </div>
</div>

{#if rows.length === 0}
  <EmptyState>Select up to {MAX_SELECTED} dishes to start!</EmptyState>
{:else}
  <div class="mt-6">
    <Table>
      <thead>
        <tr>
          <Th class="hidden w-[18%] sm:table-cell">Meal</Th>
          <Th>Who enjoys it</Th>
        </tr>
      </thead>
      <tbody>
        {#each rows as meal (meal.name)}
          <tr>
            <Td tone="strong" class="hidden sm:table-cell">{meal.name}</Td>
            <Td>
              <!-- On phones the Meal column is hidden, so the name heads the row instead. -->
              <p class="mb-1.5 font-bold sm:hidden">{meal.name}</p>
              <div class="space-y-2">
                {#each meal.reactions as reaction (reaction.label)}
                  <div class="flex items-start gap-2">
                    <span
                      class={cx(
                        text.label,
                        'w-10 shrink-0 pt-2 text-[10px] md:w-12 md:pt-3 md:text-xs',
                        reaction.label === 'Loves' && 'text-rose-800',
                      )}
                    >
                      {reaction.label}
                    </span>
                    {#if reaction.characters.length === 0}
                      <span class={cx(text.small, 'pt-2 text-amber-900/60 md:pt-3')}>—</span>
                    {:else}
                      <div class="flex flex-wrap gap-1">
                        {#each reaction.characters as c (c.name)}
                          <MiniPortrait
                            character={c}
                            badge={settings.badges.value ? requirementBadge(c, currentRoute.value) : null}
                          />
                        {/each}
                      </div>
                    {/if}
                  </div>
                {/each}
              </div>
            </Td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </div>
{/if}
