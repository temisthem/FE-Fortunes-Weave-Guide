<!-- Small portrait for lists of characters inside a row (e.g. who loves a meal). -->
<script lang="ts">
  import { type Character, portrait } from '@/data.ts';
  import { cx, radius, text } from '@/design/tokens.ts';
  import { settings } from '@/settings.svelte.ts';

  let { character }: { character: Character } = $props();
</script>

<div class="w-9 md:w-11" title={character.name}>
  <img class={cx('aspect-square w-full', radius)} src={portrait(character.slug)} alt={character.name} loading="lazy" />
  {#if settings.names.value}
    <p class={cx(text.caption, 'truncate text-center text-[9px] md:text-[10px]')}>{character.name}</p>
  {/if}
</div>
