import { characters, portrait, raven } from '@/data.ts';
import { DetailHeader, EmptyState, Input, Section, Table, Td, Th, cx, text } from '@/design.tsx';
import { useStoredState } from '@/useStoredState.ts';
import { useScrollOnSelect } from '@/useScrollOnSelect.ts';
import { CharacterGrid, CharacterIcon } from '@/ui.tsx';

const ravenCharacters = characters.filter((c) => raven[c.name]);

const PaleRaven = () => {
  const [selected, setSelected] = useStoredState<string | null>('raven.character', null);
  const [filter, setFilter] = useStoredState<string>('raven.filter', '');
  const results = useScrollOnSelect<HTMLDivElement>();

  const selectCharacter = (name: string) => {
    setSelected(name);
    results.requestScroll();
  };

  const entries = selected ? raven[selected] ?? [] : [];
  const needle = filter.trim().toLowerCase();
  const shown = needle ? entries.filter((e) => e.prompt.toLowerCase().includes(needle)) : entries;
  const character = ravenCharacters.find((c) => c.name === selected);

  return (
    <>
      <CharacterGrid>
        {ravenCharacters.map((c) => (
          <CharacterIcon
            key={c.name}
            character={c}
            selected={selected === c.name}
            onClick={() => selectCharacter(c.name)}
          />
        ))}
      </CharacterGrid>

      <div ref={results.ref} className={'mt-6 scroll-mt-4'}>
        {character ? (
          <>
            <DetailHeader
              image={portrait(character.slug)}
              title={character.name}
              aside={<Input value={filter} onChange={setFilter} placeholder={'Filter prompts…'} />}
            />

            <Section>
              {shown.length === 0 ? (
                <p className={cx(text.body, 'text-center')}>No prompts match &ldquo;{filter}&rdquo;.</p>
              ) : (
                <Table>
                  <thead>
                    <tr>
                      <Th className={'w-[62%] sm:w-[60%]'}>Prompt</Th>
                      <Th>Answer</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {shown.map((e) => (
                      <tr key={e.prompt}>
                        <Td>{e.prompt}</Td>
                        <Td tone={'strong'}>
                          {e.answer}
                          {e.alt && (
                            <span className={cx(text.caption, 'mt-0.5 block font-normal italic')}>
                              Guides disagree. It could also be: {e.alt}
                            </span>
                          )}
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Section>
          </>
        ) : (
          <EmptyState>Select a character to start!</EmptyState>
        )}
      </div>
    </>
  );
};

export default PaleRaven;
