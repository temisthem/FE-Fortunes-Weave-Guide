<script lang="ts">
  import { type SortKey, SORT_LABELS } from '@/data.ts';
  import ToggleGroup from '@/design/ToggleGroup.svelte';

  let { sort = $bindable() }: { sort: SortKey } = $props();

  const options = (Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({ value: k, label: SORT_LABELS[k] }));
</script>

<ToggleGroup label="Sort by" {options} bind:value={sort} />
