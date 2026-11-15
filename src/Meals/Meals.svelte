<!--
  Pick up to three inn dishes; each gets a row of units who love it and a row
  of units who like it.
-->
<script lang="ts">
  import { characterByName, meals, requirementBadge } from '@/data.ts';
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

  const MAX_SELECTED = 3;
  const DISHES = meals.map((m) => m.name);

  const selected = stored<string[]>(
    'meals.selected',
    [],
    (v) => Array.isArray(v) && v.length <= MAX_SELECTED && v.every((d) => DISHES.includes(d)),
  );

  const full = $derived(selected.value.length >= MAX_SELECTED);

  const toggle = (dish: string) => {
    const current = selected.value;
    if (current.includes(dish)) selected.value = current.filter((d) => d !== dish);
    else if (!full) selected.value = [...current, dish];
  };

  const byName = (names: string[]) =>
    names
      .map((n) => characterByName.get(n)!)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

  // Rows follow the menu order, not the order the dishes were picked.
  const rows = $derived(
    meals
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
