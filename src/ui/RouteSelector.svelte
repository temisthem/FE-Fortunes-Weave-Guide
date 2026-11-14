<!-- Route picker: the four lords' portraits. -->
<script lang="ts">
  import { type Route, ROUTES, characterByName, portrait } from '@/data.ts';
  import ControlGroup from '@/design/ControlGroup.svelte';
  import { cx, radius, interaction, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';

  let { route = $bindable() }: { route: Route } = $props();
</script>

<ControlGroup label="Route">
  <div class="flex gap-2">
    {#each ROUTES as r (r)}
      <button
        type="button"
        onclick={() => (route = r)}
        class={cx('flex w-11 flex-col items-center sm:w-12', radius, interaction.focus)}
        title={`${r}'s Path`}
        aria-pressed={route === r}
      >
        <img
          class={cx('aspect-square w-full transition', radius, route === r && interaction.selected)}
          src={portrait(characterByName.get(r)!.slug)}
          alt={r}
        />
        {#if settings.routeNames.value}
          <span class={cx(text.caption, 'mt-1', route === r && 'font-bold')}>{r}</span>
        {/if}
      </button>
    {/each}
  </div>
</ControlGroup>
