<!-- Small portrait for lists of characters inside a row (e.g. who loves a meal). -->
<script lang="ts">
  import { type Character, portrait } from '@/data.ts';
  import { cx, radius, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';
  import Badge from '@/ui/Badge.svelte';

  let { character, badge }: { character: Character; badge?: string | null } = $props();
</script>

<div class="w-11 md:w-14" title={character.name}>
  <div class="relative">
    <img class={cx('aspect-square w-full', radius)} src={portrait(character.slug)} alt={character.name} loading="lazy" />
    {#if badge}<Badge label={badge} />{/if}
  </div>
  {#if settings.names.value}
    <p class={cx(text.caption, 'truncate text-center text-[9px] md:text-[11px]')}>{character.name}</p>
  {/if}
</div>
