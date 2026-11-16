<script lang="ts">
  import Gifting from '@/Gifting/Gifting.svelte';
  import Meals from '@/Meals/Meals.svelte';
  import PaleRaven from '@/PaleRaven/PaleRaven.svelte';
  import Link from '@/design/Link.svelte';
  import SettingsMenu from '@/design/SettingsMenu.svelte';
  import Tabs from '@/design/Tabs.svelte';
  import { cx, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';
  import { stored } from '@/stored.svelte.ts';

  type Screen = 'gifting' | 'meals' | 'raven';

  const SCREEN_OPTIONS = [
    { value: 'gifting', label: 'Gifting' },
    { value: 'meals', label: 'Meals' },
    { value: 'raven', label: 'Pale Raven' },
  ] as const;

  const screen = stored<Screen>('screenState', 'gifting', (v) => ['gifting', 'meals', 'raven'].includes(v as string));

  const SOURCES = {
    wiki: 'https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave',
    game8: 'https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690',
    raiderKing: 'https://raiderking.com/fire-emblem-fortunes-weave-feed-pale-raven-all-characters-perfect-bird-time/',
    keenGamer:
      'https://www.keengamer.com/articles/guides/fire-emblem-fortunes-weave-perfect-bird-time-answers-for-every-character/',
    gameRant: 'https://gamerant.com/fire-emblem-fortunes-weave-feed-the-pale-raven-correct-answers/',
    raiderKingGifts: 'https://raiderking.com/fire-emblem-fortunes-weave-all-loved-gifts-guide/',
    fortunesWeaveGuide: 'https://fortunesweave.co.uk/characters',
  };

  // Grouped by the screen they affect. Pale Raven has no settings of its own.
  const settingSections = [
    {
      title: 'General',
      items: [
        { label: 'Show names', setting: settings.names },
        { label: 'Show route names', setting: settings.routeNames },
        { label: 'Show Renown/Support tags', setting: settings.badges },
      ],
    },
    { title: 'Gifting', items: [{ label: 'Only show recruitable units', setting: settings.recruitableOnly }] },
    { title: 'Meals', items: [{ label: 'Only show recruitable units', setting: settings.mealsRecruitableOnly }] },
  ];
</script>

<div class="app-bg">
  <div class="mx-auto flex h-full min-h-screen max-w-[1280px] flex-col bg-amber-50 bg-opacity-85 p-4 md:p-5">
    <header class="mb-3 md:mb-4">
      <Tabs options={SCREEN_OPTIONS} bind:value={screen.value}>
        {#snippet aside()}
          <SettingsMenu sections={settingSections} />
        {/snippet}
      </Tabs>
    </header>

    <main>
      {#if screen.value === 'gifting'}
        <Gifting />
      {:else if screen.value === 'meals'}
        <Meals />
      {:else}
        <PaleRaven />
      {/if}
    </main>

    <footer class={cx(text.small, 'ml-auto mt-auto pt-10 text-right text-amber-900')}>
      Portraits &amp; recruitment info courtesy of <Link href={SOURCES.wiki}>Fire Emblem Wiki</Link>. Gift data from
      <Link href={SOURCES.game8}>Game8</Link>, disliked gifts from <Link href={SOURCES.raiderKingGifts}>RaiderKing</Link>. Meal data from
      <Link href={SOURCES.fortunesWeaveGuide}>fortunesweave.co.uk</Link>. Pale Raven answers compiled from
      <Link href={SOURCES.raiderKing}>RaiderKing</Link>, <Link href={SOURCES.keenGamer}>KeenGamer</Link> &amp;
      <Link href={SOURCES.gameRant}>Game Rant</Link>.
    </footer>
  </div>
</div>
