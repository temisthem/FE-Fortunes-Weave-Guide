<script lang="ts">
  import Gifting from '@/Gifting/Gifting.svelte';
  import PaleRaven from '@/PaleRaven/PaleRaven.svelte';
  import Link from '@/design/Link.svelte';
  import SettingsMenu from '@/design/SettingsMenu.svelte';
  import Tabs from '@/design/Tabs.svelte';
  import { cx, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';
  import { stored } from '@/stored.svelte.ts';

  type Screen = 'gifting' | 'raven';

  const SCREEN_OPTIONS = [
    { value: 'gifting', label: 'Gifting' },
    { value: 'raven', label: 'Pale Raven' },
  ] as const;

  const screen = stored<Screen>('screenState', 'gifting', (v) => ['gifting', 'raven'].includes(v as string));

  const SOURCES = {
    wiki: 'https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave',
    game8: 'https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690',
    raiderKing: 'https://raiderking.com/fire-emblem-fortunes-weave-feed-pale-raven-all-characters-perfect-bird-time/',
    keenGamer:
      'https://www.keengamer.com/articles/guides/fire-emblem-fortunes-weave-perfect-bird-time-answers-for-every-character/',
    gameRant: 'https://gamerant.com/fire-emblem-fortunes-weave-feed-the-pale-raven-correct-answers/',
  };

  const settingItems = [
    { label: 'Show names', setting: settings.names },
    { label: 'Show Renown/Support tags', setting: settings.badges },
    { label: 'Show route names', setting: settings.routeNames },
  ];
</script>

<div class="app-bg">
  <div class="mx-auto flex h-full min-h-screen max-w-[1280px] flex-col bg-amber-50 bg-opacity-85 p-4 md:p-5">
    <header class="mb-3 md:mb-4">
      <Tabs options={SCREEN_OPTIONS} bind:value={screen.value}>
        {#snippet aside()}
          <SettingsMenu items={settingItems} />
        {/snippet}
      </Tabs>
    </header>

    <main>
      {#if screen.value === 'gifting'}
        <Gifting />
      {:else}
        <PaleRaven />
      {/if}
    </main>

    <footer class={cx(text.small, 'ml-auto mt-auto pt-10 text-right text-amber-900')}>
      Portraits &amp; recruitment info courtesy of <Link href={SOURCES.wiki}>Fire Emblem Wiki</Link>. Gift data from
      <Link href={SOURCES.game8}>Game8</Link>. Pale Raven answers compiled from
      <Link href={SOURCES.raiderKing}>RaiderKing</Link>, <Link href={SOURCES.keenGamer}>KeenGamer</Link> &amp;
      <Link href={SOURCES.gameRant}>Game Rant</Link>.
    </footer>
  </div>
</div>
