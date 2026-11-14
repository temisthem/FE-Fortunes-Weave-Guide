<script lang="ts">
  import type { Preference } from '@/data.ts';

  let { preference }: { preference: Preference } = $props();
</script>

{#if preference === 'Loved'}<span class="font-bold text-rose-800">Loved</span>{:else}Liked{/if}
