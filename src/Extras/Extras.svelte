<!-- Extra tools, each on its own subtab. -->
<script lang="ts">
  import ToggleGroup from '@/design/ToggleGroup.svelte';
  import Toolbar from '@/design/Toolbar.svelte';
  import Characters from '@/Extras/Characters.svelte';
  import RecruitPlanner from '@/Extras/RecruitPlanner.svelte';
  import { stored } from '@/stored.svelte.ts';

  type Tab = 'characters' | 'planner';

  const TAB_OPTIONS = [
    { value: 'characters', label: 'Characters' },
    { value: 'planner', label: 'Recruit Planner' },
  ] as const;

  const tab = stored<Tab>('extras.tab', 'characters', (v) => ['characters', 'planner'].includes(v as string));
</script>

<Toolbar>
  <ToggleGroup options={TAB_OPTIONS} bind:value={tab.value} />
</Toolbar>

<div class="mt-4">
  {#if tab.value === 'characters'}
    <Characters />
  {:else}
    <RecruitPlanner onBrowse={() => (tab.value = 'characters')} />
  {/if}
</div>
