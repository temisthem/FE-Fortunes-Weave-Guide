<!--
  The characters the selected lord has favourited, with what it takes to
  recruit each on that lord's route. Lowest Renown Lv first. Each row links to
  the character's gifts and can be removed from the plan.
-->
<script lang="ts">
  import { type Character, canFavourite, characterByName, getRouteInfo, requirementSummary } from '@/data.ts';
  import EmptyState from '@/design/EmptyState.svelte';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import { cx, interaction, radius, text } from '@/design/tokens.ts';
  import Toolbar from '@/design/Toolbar.svelte';
  import { favouritesOf, toggleFavourite } from '@/favourites.svelte.ts';
  import { openGiftsFor } from '@/Gifting/state.svelte.ts';
  import { currentRoute } from '@/route.svelte.ts';
  import CharacterLabel from '@/ui/CharacterLabel.svelte';
  import GiftIcon from '@/ui/GiftIcon.svelte';
  import RouteSelector from '@/ui/RouteSelector.svelte';

  const planned = $derived(
    favouritesOf(currentRoute.value)
      .map((n) => characterByName.get(n))
      .filter((c): c is Character => c !== undefined && canFavourite(c, currentRoute.value))
      .sort((a, b) => {
        const ra = getRouteInfo(a, currentRoute.value)!;
        const rb = getRouteInfo(b, currentRoute.value)!;
        // Renown Lv ascending, then Support Lv, then name.
        return (
          (ra.renown ?? 99) - (rb.renown ?? 99) || (ra.support ?? 99) - (rb.support ?? 99) || a.name.localeCompare(b.name)
        );
      }),
  );
</script>

<Toolbar>
  <RouteSelector bind:route={currentRoute.value} />
</Toolbar>

{#if planned.length === 0}
  <EmptyState>No one favourited for {currentRoute.value}'s Path yet.</EmptyState>
  <p class={cx(text.small, 'mx-auto mt-2 max-w-md text-center text-amber-900')}>
    In Characters, tap {currentRoute.value}'s portrait on a row to add that character here.
  </p>
{:else}
  <div class="mt-4">
    <Table>
      <thead>
        <tr>
          <Th>Character</Th>
          <Th class="w-[19%] !px-1 sm:w-[11%] sm:!px-3">Renown Lv</Th>
          <Th class="w-[19%] !px-1 sm:w-[11%] sm:!px-3">Support Lv</Th>
          <Th class="hidden w-[36%] sm:table-cell">Requirement</Th>
          <Th class="w-9 sm:w-12"><span class="sr-only">Gifts</span></Th>
          <Th class="w-9 sm:w-12"><span class="sr-only">Remove</span></Th>
        </tr>
      </thead>
      <tbody>
        {#each planned as c (c.name)}
          {@const req = requirementSummary(c, currentRoute.value)}
          <tr>
            <Td>
              <CharacterLabel character={c}>
                <!-- On phones the Requirement column is hidden, so show it here. -->
                <span class={cx(text.caption, 'block text-amber-900 sm:hidden')}>
                  {req.details || 'No other requirement'}
                </span>
              </CharacterLabel>
            </Td>
            <Td tone="center">{req.renown}</Td>
            <Td tone="center">{req.support}</Td>
            <Td tone="muted" class="hidden sm:table-cell">{req.details || 'None'}</Td>
            <!-- No side padding: the 28px buttons are wider than the padded cells on desktop. -->
            <Td tone="center" class="!px-0">
              <button
                type="button"
                aria-label={`View ${c.name}'s gifts`}
                title="View gifts"
                onclick={() => openGiftsFor(c.name)}
                class={cx(
                  radius,
                  interaction.focus,
                  'mx-auto flex h-7 w-7 items-center justify-center text-amber-900 hover:bg-amber-200/70',
                )}
              >
                <GiftIcon />
              </button>
            </Td>
            <Td tone="center" class="!px-0">
              <button
                type="button"
                aria-label={`Remove ${c.name} from ${currentRoute.value}'s plan`}
                title="Remove from plan"
                onclick={() => toggleFavourite(currentRoute.value, c.name)}
                class={cx(
                  radius,
                  interaction.focus,
                  'mx-auto flex h-7 w-7 items-center justify-center text-amber-900 hover:bg-amber-200/70',
                )}
              >
                <svg viewBox="0 0 24 24" class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                  <path stroke-linecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </Td>
          </tr>
        {/each}
      </tbody>
    </Table>
  </div>
{/if}
