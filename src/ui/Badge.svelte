<!-- Small dark label overlaid on a portrait's bottom-right corner (e.g. "R8·S3"). The parent must be `relative`. -->
<script lang="ts">
  let { label }: { label: string } = $props();
</script>

<span
  class="absolute bottom-0.5 right-0.5 rounded bg-amber-900/85 px-0.5 text-[9px] font-bold leading-3 text-amber-50 md:text-[10px]"
>
  {label}
</span>
