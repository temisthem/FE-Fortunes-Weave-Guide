<!--
  Every character you can recruit with Renown/Support on at least one route,
  and which lords have favourited them. Tap a
  row to expand it into the recruitment requirements on each route, plus a
  shortcut to their gifts.
-->
<script lang="ts">
  import {
    ROUTES,
    characterByName,
    characters,
    getRouteInfo,
    hasRecruitTag,
    portrait,
    requirementSummary,
  } from '@/data.ts';
  import Button from '@/design/Button.svelte';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import { cx, interaction, radius, text } from '@/design/tokens.ts';
  import { openGiftsFor } from '@/Gifting/state.svelte.ts';
  import CharacterLabel from '@/ui/CharacterLabel.svelte';
  import FavouriteToggles from '@/ui/FavouriteToggles.svelte';
  import GiftIcon from '@/ui/GiftIcon.svelte';

  const sorted = characters
    .filter((c) => ROUTES.some((r) => hasRecruitTag(c, r)))
    .sort((a, b) => a.name.localeCompare(b.name));

  let expanded: string[] = $state([]);

  const toggle = (name: string) => {
    expanded = expanded.includes(name) ? expanded.filter((n) => n !== name) : [...expanded, name];
  };
</script>

<Table striped={false}>
  <thead>
    <tr>
      <Th>Character</Th>
      <Th class="w-[118px] sm:w-[150px]">Favourited</Th>
    </tr>
  </thead>
  <tbody>
    {#each sorted as c, i (c.name)}
      {@const open = expanded.includes(c.name)}
      {@const shade = i % 2 === 1 && 'bg-amber-100/60'}
      <tr class={cx('cursor-pointer', shade)} onclick={() => toggle(c.name)}>
        <Td>
          <button
            type="button"
            class={cx('flex w-full min-w-0 items-center gap-1 text-left', interaction.focus)}
            aria-expanded={open}
            onclick={(e) => {
              e.stopPropagation();
              toggle(c.name);
            }}
          >
            <svg
              viewBox="0 0 24 24"
              class={cx('h-4 w-4 shrink-0 text-amber-900 transition-transform', open && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              aria-hidden="true"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 6l6 6-6 6" />
            </svg>
            <CharacterLabel character={c} />
          </button>
        </Td>
        <Td><FavouriteToggles character={c} /></Td>
      </tr>
      {#if open}
        <tr class={cx(shade)}>
          <td colspan="2" class="border-b border-amber-900/20 px-2 pb-3 pt-1 sm:px-3">
            {#if c.recruit}
              <div class="grid grid-cols-2 gap-2 md:grid-cols-4">
                {#each ROUTES as r (r)}
                  {@const info = getRouteInfo(c, r)}
                  {@const req = requirementSummary(c, r)}
                  <div class={cx(radius, 'border border-amber-900/25 bg-amber-50 p-2')}>
                    <p class="mb-1 flex items-center gap-1.5">
                      <img class="h-6 w-6 rounded" src={portrait(characterByName.get(r)!.slug)} alt="" />
                      <span class={cx(text.label, 'text-[10px] md:text-xs')}>{r}'s Path</span>
                    </p>
                    {#if info?.status === 'recruit'}
                      <p class="font-bold">Renown {req.renown} · Support {req.support}</p>
                      <p class={cx(text.caption, 'mt-0.5 text-amber-900')}>{req.details || 'No other requirement'}</p>
                    {:else}
                      <p class={cx(text.caption, 'text-amber-900')}>{req.details}</p>
                    {/if}
                  </div>
                {/each}
              </div>
            {:else}
              <p class={cx(text.small, 'text-amber-900')}>{c.note ?? 'Joins through the story.'}</p>
            {/if}
            <div class="mt-2 flex justify-end">
              <Button size="sm" onclick={() => openGiftsFor(c.name)}><GiftIcon /> Gifts</Button>
            </div>
          </td>
        </tr>
      {/if}
    {/each}
  </tbody>
</Table>
