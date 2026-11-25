<!-- A class's map sprite and name, or a dash when no source names the class. -->
<script lang="ts">
  import { classIcon } from '@/data.ts';

  let { name }: { name: string | null } = $props();
</script>

{#if name}
  <span class="flex items-center gap-1.5">
    <span class="flex h-7 w-7 shrink-0 items-center justify-center md:h-8 md:w-8">
      <img class="max-h-full max-w-full [image-rendering:pixelated]" src={classIcon(name)} alt="" loading="lazy" />
    </span>
    <span class="min-w-0 truncate">{name}</span>
  </span>
{:else}
  <span class="text-amber-900/60">—</span>
{/if}
