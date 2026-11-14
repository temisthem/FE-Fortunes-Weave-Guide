<script lang="ts">
  import { characters, portrait, raven } from '@/data.ts';
  import DetailHeader from '@/design/DetailHeader.svelte';
  import EmptyState from '@/design/EmptyState.svelte';
  import Input from '@/design/Input.svelte';
  import Section from '@/design/Section.svelte';
  import Table from '@/design/Table.svelte';
  import Td from '@/design/Td.svelte';
  import Th from '@/design/Th.svelte';
  import { cx, text } from '@/design/tokens.ts';
  import { revealAfterUpdate } from '@/scroll.ts';
  import { stored } from '@/stored.svelte.ts';
  import CharacterGrid from '@/ui/CharacterGrid.svelte';
  import CharacterIcon from '@/ui/CharacterIcon.svelte';

  const ravenCharacters = characters.filter((c) => raven[c.name]);

  const selected = stored<string | null>('raven.character', null);
  const filter = stored<string>('raven.filter', '');

  let results: HTMLDivElement | undefined = $state();

  const selectCharacter = (name: string) => {
    selected.value = name;
    revealAfterUpdate(results);
  };

  const character = $derived(ravenCharacters.find((c) => c.name === selected.value));
  const shown = $derived.by(() => {
    const entries = selected.value ? (raven[selected.value] ?? []) : [];
    const needle = filter.value.trim().toLowerCase();
    return needle ? entries.filter((e) => e.prompt.toLowerCase().includes(needle)) : entries;
  });
</script>

<CharacterGrid>
  {#each ravenCharacters as c (c.name)}
    <CharacterIcon character={c} selected={selected.value === c.name} onclick={() => selectCharacter(c.name)} />
  {/each}
</CharacterGrid>

<div bind:this={results} class="mt-6 scroll-mt-4">
  {#if character}
    <DetailHeader image={portrait(character.slug)} title={character.name}>
      {#snippet aside()}
        <Input bind:value={filter.value} placeholder="Filter prompts…" />
      {/snippet}
    </DetailHeader>

    <Section>
      {#if shown.length === 0}
        <p class={cx(text.body, 'text-center')}>No prompts match &ldquo;{filter.value}&rdquo;.</p>
      {:else}
        <Table>
          <thead>
            <tr>
              <Th class="w-[62%] sm:w-[60%]">Prompt</Th>
              <Th>Answer</Th>
            </tr>
          </thead>
          <tbody>
            {#each shown as e (e.prompt)}
              <tr>
                <Td>{e.prompt}</Td>
                <Td tone="strong">
                  {e.answer}
                  {#if e.alt}
                    <span class={cx(text.caption, 'mt-0.5 block font-normal italic')}>
                      Guides disagree. It could also be: {e.alt}
                    </span>
                  {/if}
                </Td>
              </tr>
            {/each}
          </tbody>
        </Table>
      {/if}
    </Section>
  {:else}
    <EmptyState>Select a character to start!</EmptyState>
  {/if}
</div>
