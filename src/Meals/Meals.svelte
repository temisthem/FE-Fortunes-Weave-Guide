<!-- Every inn dish, with a row of units who love it and a row of units who like it. -->
<script lang="ts">
  import { characterByName, meals } from '@/data.ts';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import { cx, text } from '@/design/tokens.ts';
  import MiniPortrait from '@/ui/MiniPortrait.svelte';

  const byName = (names: string[]) =>
    names
      .map((n) => characterByName.get(n)!)
      .filter(Boolean)
      .sort((a, b) => a.name.localeCompare(b.name));

  const rows = meals.map((m) => ({
    name: m.name,
    reactions: [
      { label: 'Loves', characters: byName(m.loved) },
      { label: 'Likes', characters: byName(m.liked) },
    ],
  }));
</script>

<div class="mt-2">
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
                        <MiniPortrait character={c} />
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
