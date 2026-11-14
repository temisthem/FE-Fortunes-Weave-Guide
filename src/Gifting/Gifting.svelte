<script lang="ts">
  import {
    type Route,
    type SortKey,
    GIFT_CATEGORIES,
    ROUTES,
    SORT_LABELS,
    characterByName,
    characters,
    compareCharacters,
    fansOf,
    giftByName,
    gifts,
    isRecruitable,
    likesOnRoute,
    portrait,
    requirementBadge,
    requirementSummary,
  } from '@/data.ts';
  import Button from '@/design/Button.svelte';
  import DetailHeader from '@/design/DetailHeader.svelte';
  import EmptyState from '@/design/EmptyState.svelte';
  import Fact from '@/design/Fact.svelte';
  import Input from '@/design/Input.svelte';
  import Panel from '@/design/Panel.svelte';
  import Section from '@/design/Section.svelte';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import ToggleGroup from '@/design/ToggleGroup.svelte';
  import Toolbar from '@/design/Toolbar.svelte';
  import { cx, interaction, text } from '@/design/tokens.ts';
  import { revealAfterUpdate } from '@/scroll.ts';
  import { settings } from '@/settings.svelte.ts';
  import { stored } from '@/stored.svelte.ts';
  import CharacterGrid from '@/ui/CharacterGrid.svelte';
  import CharacterIcon from '@/ui/CharacterIcon.svelte';
  import GiftGrid from '@/ui/GiftGrid.svelte';
  import GiftTile from '@/ui/GiftTile.svelte';
  import PreferenceLabel from '@/ui/PreferenceLabel.svelte';
  import RouteSelector from '@/ui/RouteSelector.svelte';
  import SortSelector from '@/ui/SortSelector.svelte';

  type GiftMode = 'character' | 'gift';

  const MODE_OPTIONS = [
    { value: 'character', label: 'By Character' },
    { value: 'gift', label: 'By Gift' },
  ] as const;

  const mode = stored<GiftMode>('gift.mode', 'character', (v) => ['character', 'gift'].includes(v as string));
  const route = stored<Route>('gift.route', 'Cai', (v) => ROUTES.includes(v as Route));
  const sort = stored<SortKey>('gift.sort', 'name', (v) => Object.keys(SORT_LABELS).includes(v as string));
  const selectedCharacter = stored<string | null>('gift.character', null);
  const selectedGift = stored<string | null>('gift.gift', null);
  const category = stored<string>('gift.category', 'All');
  const search = stored<string>('gift.search', '');

  let results: HTMLDivElement | undefined = $state();

  const sortedCharacters = $derived([...characters].sort(compareCharacters(sort.value, route.value)));
  const character = $derived(selectedCharacter.value ? characterByName.get(selectedCharacter.value) : undefined);
  const gift = $derived(selectedGift.value ? giftByName.get(selectedGift.value) : undefined);

  const selectCharacter = (name: string) => {
    selectedCharacter.value = name;
    mode.value = 'character';
    revealAfterUpdate(results);
  };

  const selectGift = (name: string, resetFilters = false) => {
    selectedGift.value = name;
    if (resetFilters) {
      category.value = 'All';
      search.value = '';
    }
    mode.value = 'gift';
    revealAfterUpdate(results);
  };

  // ---- gift mode -----------------------------------------------------------

  const filteredGifts = $derived.by(() => {
    const needle = search.value.trim().toLowerCase();
    return gifts.filter(
      (g) => (category.value === 'All' || g.category === category.value) && g.name.toLowerCase().includes(needle),
    );
  });

  const groups = $derived(
    (category.value === 'All' ? GIFT_CATEGORIES : [category.value])
      .map((cat) => [cat, filteredGifts.filter((g) => g.category === cat)] as const)
      .filter(([, list]) => list.length > 0),
  );

  const fans = $derived(
    gift ? fansOf(gift.name).sort((a, b) => compareCharacters(sort.value, route.value)(a.character, b.character)) : [],
  );
</script>

<Toolbar>
  <ToggleGroup label="View" options={MODE_OPTIONS} bind:value={mode.value} />
  <RouteSelector bind:route={route.value} />
  <SortSelector bind:sort={sort.value} />
</Toolbar>

{#if mode.value === 'character'}
  <CharacterGrid>
    {#each sortedCharacters as c (c.name)}
      <CharacterIcon
        character={c}
        selected={selectedCharacter.value === c.name}
        onclick={() => selectCharacter(c.name)}
        badge={settings.badges.value ? requirementBadge(c, route.value) : null}
        dimmed={!isRecruitable(c, route.value)}
      />
    {/each}
  </CharacterGrid>
{:else}
  <div class="mt-4 flex flex-wrap items-center justify-center gap-1">
    <span class="mr-1"><Input bind:value={search.value} placeholder="Search gifts…" /></span>
    {#each ['All', ...GIFT_CATEGORIES] as cat (cat)}
      <Button variant="toggle" size="sm" active={category.value === cat} onclick={() => (category.value = cat)}>
        {cat}
      </Button>
    {/each}
  </div>
  <Panel>
    {#if groups.length === 0}<p class={cx(text.body, 'text-center')}>No gifts match.</p>{/if}
    {#each groups as [cat, list] (cat)}
      <div class="mb-3 last:mb-0">
        {#if category.value === 'All'}<p class={cx(text.label, 'mb-1')}>{cat}</p>{/if}
        <GiftGrid>
          {#each list as g (g.name)}
            <GiftTile
              gift={g}
              selectable
              likes={likesOnRoute(g.name, route.value)}
              selected={selectedGift.value === g.name}
              onclick={() => selectGift(g.name)}
            />
          {/each}
        </GiftGrid>
      </div>
    {/each}
  </Panel>
{/if}

<div bind:this={results} class="mt-6 scroll-mt-4">
  {#if mode.value === 'character'}
    {#if character}
      {@const r = requirementSummary(character, route.value)}
      <DetailHeader image={portrait(character.slug)} title={character.name}>
        <Fact label="Renown Lv">{r.renown ?? '—'}</Fact>
        <Fact label="Support Lv">{r.support ?? '—'}</Fact>
        <Fact label="Recruit condition">{r.details || '—'}</Fact>
      </DetailHeader>

      {#if character.loved.length + character.reallyLiked.length === 0}
        <EmptyState>No known favourite gifts yet.</EmptyState>
      {:else}
        {#if character.loved.length > 0}
          <Section title="Loved gifts">
            <GiftGrid>
              {#each character.loved as g (g)}
                <GiftTile gift={giftByName.get(g)!} preference="Loved" onclick={() => selectGift(g, true)} />
              {/each}
            </GiftGrid>
          </Section>
        {/if}
        {#if character.reallyLiked.length > 0}
          <Section title="Liked gifts">
            <GiftGrid>
              {#each character.reallyLiked as g (g)}
                <GiftTile gift={giftByName.get(g)!} preference="Liked" onclick={() => selectGift(g, true)} />
              {/each}
            </GiftGrid>
          </Section>
        {/if}
      {/if}
    {:else}
      <EmptyState>Select a character to start!</EmptyState>
    {/if}
  {:else if !gift}
    <EmptyState>Select a gift to start!</EmptyState>
  {:else}
    <DetailHeader title={gift.name}>
      <Fact label="Category">{gift.category}</Fact>
      {#if gift.sources.length > 0}<Fact label="Found at">{gift.sources.join(', ')}</Fact>{/if}
    </DetailHeader>
    {#if fans.length === 0}
      <EmptyState>Nobody is known to love or like this gift.</EmptyState>
    {:else}
      <Section title="Who likes it">
        <Table>
          <thead>
            <tr>
              <Th>Character</Th>
              <Th class="hidden w-[16%] sm:table-cell">Preference</Th>
              <Th class="w-[19%] sm:w-[12%]">Renown Lv</Th>
              <Th class="w-[19%] sm:w-[12%]">Support Lv</Th>
              <Th class="hidden w-[34%] sm:table-cell">Other requirements</Th>
            </tr>
          </thead>
          <tbody>
            {#each fans as { character: c, preference } (c.name)}
              {@const req = requirementSummary(c, route.value)}
              <tr>
                <Td>
                  <button
                    type="button"
                    class={cx('flex w-full items-center gap-2 text-left', interaction.focus)}
                    onclick={() => selectCharacter(c.name)}
                  >
                    <img
                      class={cx('aspect-square w-8 shrink-0 rounded md:w-10', !isRecruitable(c, route.value) && interaction.dimmed)}
                      src={portrait(c.slug)}
                      alt=""
                      loading="lazy"
                    />
                    <span class="min-w-0">
                      <span class="block truncate font-semibold hover:underline">{c.name}</span>
                      <!-- On phones the Preference and Other columns are hidden, so show them here. -->
                      <span class={cx(text.caption, 'block sm:hidden')}>
                        <PreferenceLabel {preference} />
                        {#if req.details}<span class="text-amber-900"> · {req.details}</span>{/if}
                      </span>
                    </span>
                  </button>
                </Td>
                <Td tone="center" class="hidden sm:table-cell"><PreferenceLabel {preference} /></Td>
                <Td tone="center">{req.renown ?? '—'}</Td>
                <Td tone="center">{req.support ?? '—'}</Td>
                <Td tone="muted" class="hidden sm:table-cell">{req.details}</Td>
              </tr>
            {/each}
          </tbody>
        </Table>
      </Section>
    {/if}
  {/if}
</div>
