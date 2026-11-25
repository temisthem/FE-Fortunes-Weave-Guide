<!--
  Rounded card around a table. Uses separate borders so the corners can be
  rounded, alternates row shading, and drops the divider under the last row.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { cx, radius, text } from './tokens.ts';

  /** `striped: false` leaves row shading to the caller (e.g. rows that expand into a second row). */
  let { children, striped = true }: { children: Snippet; striped?: boolean } = $props();
</script>

<div class={cx(radius, 'mx-auto w-full max-w-4xl overflow-hidden border-2 border-amber-900/70 bg-amber-50/80 shadow-sm')}>
  <table
    class={cx(
      text.small,
      'w-full table-fixed border-separate border-spacing-0',
      '[&_tbody_tr:last-child_td]:border-b-0',
      striped && '[&_tbody_tr:nth-child(even)]:bg-amber-100/60',
      '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-amber-200/50',
    )}
  >
    {@render children()}
  </table>
</div>
