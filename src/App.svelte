<script lang="ts">
  import Extras from '@/Extras/Extras.svelte';
  import Gifting from '@/Gifting/Gifting.svelte';
  import Meals from '@/Meals/Meals.svelte';
  import PaleRaven from '@/PaleRaven/PaleRaven.svelte';
  import Button from '@/design/Button.svelte';
  import Link from '@/design/Link.svelte';
  import Modal from '@/design/Modal.svelte';
  import SettingsMenu from '@/design/SettingsMenu.svelte';
  import Tabs from '@/design/Tabs.svelte';
  import { text } from '@/design/tokens.ts';
  import { screen } from '@/nav.svelte.ts';
  import { settings } from '@/settings.svelte.ts';

  const SCREEN_OPTIONS = [
    { value: 'gifting', label: 'Gifting' },
    { value: 'meals', label: 'Meals' },
    { value: 'raven', label: 'Pale Raven' },
    { value: 'extras', label: 'Extras' },
  ] as const;

  let creditsOpen = $state(false);

  const SOURCES = {
    wiki: 'https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave',
    game8: 'https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690',
    raiderKing: 'https://raiderking.com/fire-emblem-fortunes-weave-feed-pale-raven-all-characters-perfect-bird-time/',
    keenGamer:
      'https://www.keengamer.com/articles/guides/fire-emblem-fortunes-weave-perfect-bird-time-answers-for-every-character/',
    gameRant: 'https://gamerant.com/fire-emblem-fortunes-weave-feed-the-pale-raven-correct-answers/',
    raiderKingGifts: 'https://raiderking.com/fire-emblem-fortunes-weave-all-loved-gifts-guide/',
    fortunesWeaveGuide: 'https://fortunesweave.co.uk/characters',
    developer: 'https://github.com/temisthem',
  };

  const CREDITS = [
    { what: 'Portraits and recruitment info', from: [{ name: 'Fire Emblem Wiki', href: SOURCES.wiki }] },
    { what: 'Gift data', from: [{ name: 'Game8', href: SOURCES.game8 }] },
    { what: 'Disliked gifts', from: [{ name: 'RaiderKing', href: SOURCES.raiderKingGifts }] },
    { what: 'Meal data', from: [{ name: 'fortunesweave.co.uk', href: SOURCES.fortunesWeaveGuide }] },
    {
      what: 'Pale Raven answers',
      from: [
        { name: 'RaiderKing', href: SOURCES.raiderKing },
        { name: 'KeenGamer', href: SOURCES.keenGamer },
        { name: 'Game Rant', href: SOURCES.gameRant },
      ],
    },
  ];

  // Grouped by the screen they affect. General ones apply across screens.
  const settingSections = [
    {
      title: 'General',
      items: [
        { label: 'Show names', setting: settings.names },
        { label: 'Show route names', setting: settings.routeNames },
        { label: 'Show Renown/Support tags', setting: settings.badges },
        { label: 'Hide recruits not in the Recruit Planner', setting: settings.plannedOnly },
      ],
    },
    {
      title: 'Gifting',
      items: [
        { label: 'Only show recruitable units', setting: settings.recruitableOnly },
        { label: 'Hide units who ever join automatically', setting: settings.neverAutoOnly },
      ],
    },
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
      {:else if screen.value === 'raven'}
        <PaleRaven />
      {:else}
        <Extras />
      {/if}
    </main>

    <footer class="mt-auto flex justify-end pt-10">
      <Button variant="tertiary" size="sm" onclick={() => (creditsOpen = true)}>Credits</Button>
    </footer>

    <Modal bind:open={creditsOpen} title="Credits">
      <dl class={text.small}>
        {#each CREDITS as credit (credit.what)}
          <div class="border-b border-amber-900/15 py-2 first:pt-0">
            <dt class="font-bold">{credit.what}</dt>
            <dd class="text-amber-900">
              {#each credit.from as source, i (source.name)}{#if i > 0}{i === credit.from.length - 1 ? ' and ' : ', '}{/if}<Link
                  href={source.href}>{source.name}</Link
                >{/each}
            </dd>
          </div>
        {/each}
      </dl>
      <p class={text.small + ' pt-3'}>Developed by <Link href={SOURCES.developer}>temisthem</Link>.</p>
    </Modal>
  </div>
</div>
