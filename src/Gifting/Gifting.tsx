import { useMemo } from 'react';
import {
  type Character,
  type Route,
  type SortKey,
  GIFT_CATEGORIES,
  ROUTES,
  SORT_LABELS,
  characterByName,
  characters,
  compareCharacters,
  fansOf,
  giftByName,
  gifts,
  isRecruitable,
  likesOnRoute,
  portrait,
  requirementSummary,
} from '@/data.ts';
import {
  Button,
  DetailHeader,
  EmptyState,
  Fact,
  Input,
  Panel,
  Section,
  Table,
  Td,
  Th,
  ToggleGroup,
  Toolbar,
  cx,
  state,
  text,
} from '@/design.tsx';
import { useSettings } from '@/settings.ts';
import { useStoredState } from '@/useStoredState.ts';
import { useScrollOnSelect } from '@/useScrollOnSelect.ts';
import {
  CharacterGrid,
  CharacterIcon,
  GiftGrid,
  GiftTile,
  PreferenceLabel,
  RouteSelector,
  SortSelector,
  requirementBadge,
} from '@/ui.tsx';

type GiftMode = 'character' | 'gift';

const MODE_OPTIONS = [
  { value: 'character', label: 'By Character' },
  { value: 'gift', label: 'By Gift' },
] as const;

/** Selected character's header: requirements on the selected path. */
const RecruitmentHeader = ({ character, route }: { character: Character; route: Route }) => {
  const r = requirementSummary(character, route);
  return (
    <DetailHeader image={portrait(character.slug)} title={character.name}>
      <Fact label={'Renown Lv'}>{r.renown ?? '—'}</Fact>
      <Fact label={'Support Lv'}>{r.support ?? '—'}</Fact>
      <Fact label={'Recruit condition'}>{r.details || '—'}</Fact>
    </DetailHeader>
  );
};

const Gifting = () => {
  const { badges } = useSettings();
  const [mode, setMode] = useStoredState<GiftMode>('gift.mode', 'character', (v) =>
    ['character', 'gift'].includes(v as string),
  );
  const [route, setRoute] = useStoredState<Route>('gift.route', 'Cai', (v) => ROUTES.includes(v as Route));
  const [sort, setSort] = useStoredState<SortKey>('gift.sort', 'name', (v) =>
    Object.keys(SORT_LABELS).includes(v as string),
  );
  const [selectedCharacter, setSelectedCharacter] = useStoredState<string | null>('gift.character', null);
  const [selectedGift, setSelectedGift] = useStoredState<string | null>('gift.gift', null);
  const [category, setCategory] = useStoredState<string>('gift.category', 'All');
  const [search, setSearch] = useStoredState<string>('gift.search', '');
  const results = useScrollOnSelect<HTMLDivElement>();

  const sortedCharacters = useMemo(() => [...characters].sort(compareCharacters(sort, route)), [sort, route]);

  const character = selectedCharacter ? characterByName.get(selectedCharacter) : undefined;
  const gift = selectedGift ? giftByName.get(selectedGift) : undefined;

  const selectCharacter = (name: string) => {
    setSelectedCharacter(name);
    setMode('character');
    results.requestScroll();
  };

  const selectGift = (name: string, resetFilters = false) => {
    setSelectedGift(name);
    if (resetFilters) {
      setCategory('All');
      setSearch('');
    }
    setMode('gift');
    results.requestScroll();
  };

  // ---- character mode ------------------------------------------------------

  const renderCharacterDetails = (c: Character) => (
    <>
      <RecruitmentHeader character={c} route={route} />

      {c.loved.length + c.reallyLiked.length === 0 ? (
        <EmptyState>No known favourite gifts yet.</EmptyState>
      ) : (
        <>
          {c.loved.length > 0 && (
            <Section title={'Loved gifts'}>
              <GiftGrid>
                {c.loved.map((g) => (
                  <GiftTile
                    key={g}
                    gift={giftByName.get(g)!}
                    preference={'Loved'}
                    onClick={() => selectGift(g, true)}
                  />
                ))}
              </GiftGrid>
            </Section>
          )}
          {c.reallyLiked.length > 0 && (
            <Section title={'Liked gifts'}>
              <GiftGrid>
                {c.reallyLiked.map((g) => (
                  <GiftTile
                    key={g}
                    gift={giftByName.get(g)!}
                    preference={'Liked'}
                    onClick={() => selectGift(g, true)}
                  />
                ))}
              </GiftGrid>
            </Section>
          )}
        </>
      )}
    </>
  );

  // ---- gift mode -----------------------------------------------------------

  const needle = search.trim().toLowerCase();
  const filteredGifts = gifts.filter(
    (g) => (category === 'All' || g.category === category) && g.name.toLowerCase().includes(needle),
  );

  const renderGiftPicker = () => {
    const groups = (category === 'All' ? GIFT_CATEGORIES : [category])
      .map((cat) => [cat, filteredGifts.filter((g) => g.category === cat)] as const)
      .filter(([, list]) => list.length > 0);

    return (
      <>
        <div className={'mt-4 flex flex-wrap items-center justify-center gap-1'}>
          <span className={'mr-1'}>
            <Input value={search} onChange={setSearch} placeholder={'Search gifts…'} />
          </span>
          {['All', ...GIFT_CATEGORIES].map((cat) => (
            <Button key={cat} variant={'toggle'} size={'sm'} active={category === cat} onClick={() => setCategory(cat)}>
              {cat}
            </Button>
          ))}
        </div>
        <Panel>
          {groups.length === 0 && <p className={cx(text.body, 'text-center')}>No gifts match.</p>}
          {groups.map(([cat, list]) => (
            <div key={cat} className={'mb-3 last:mb-0'}>
              {category === 'All' && <p className={cx(text.label, 'mb-1')}>{cat}</p>}
              <GiftGrid>
                {list.map((g) => (
                  <GiftTile
                    key={g.name}
                    gift={g}
                    selectable
                    likes={likesOnRoute(g.name, route)}
                    selected={selectedGift === g.name}
                    onClick={() => selectGift(g.name)}
                  />
                ))}
              </GiftGrid>
            </div>
          ))}
        </Panel>
      </>
    );
  };

  const renderGiftResults = () => {
    if (!gift) return <EmptyState>Select a gift to start!</EmptyState>;
    const fans = fansOf(gift.name).sort((a, b) => compareCharacters(sort, route)(a.character, b.character));
    return (
      <>
        <DetailHeader title={gift.name}>
          <Fact label={'Category'}>{gift.category}</Fact>
          {gift.sources.length > 0 && <Fact label={'Found at'}>{gift.sources.join(', ')}</Fact>}
        </DetailHeader>
        {fans.length === 0 ? (
          <EmptyState>Nobody is known to love or like this gift.</EmptyState>
        ) : (
          <Section title={'Who likes it'}>
            <Table>
              <thead>
                <tr>
                  <Th>Character</Th>
                  <Th className={'hidden w-[16%] sm:table-cell'}>Preference</Th>
                  <Th className={'w-[19%] sm:w-[12%]'}>Renown Lv</Th>
                  <Th className={'w-[19%] sm:w-[12%]'}>Support Lv</Th>
                  <Th className={'hidden w-[34%] sm:table-cell'}>Other requirements</Th>
                </tr>
              </thead>
              <tbody>
                {fans.map(({ character: c, preference }) => {
                  const req = requirementSummary(c, route);
                  return (
                    <tr key={c.name}>
                      <Td>
                        <button
                          type={'button'}
                          className={cx('flex w-full items-center gap-2 text-left', state.focus)}
                          onClick={() => selectCharacter(c.name)}
                        >
                          <img
                            className={cx('aspect-square w-8 shrink-0 rounded md:w-10', !isRecruitable(c, route) && state.dimmed)}
                            src={portrait(c.slug)}
                            alt={''}
                            loading={'lazy'}
                          />
                          <span className={'min-w-0'}>
                            <span className={'block truncate font-semibold hover:underline'}>{c.name}</span>
                            {/* On phones the Preference and Other columns are hidden, so show them here. */}
                            <span className={cx(text.caption, 'block sm:hidden')}>
                              <PreferenceLabel preference={preference} />
                              {req.details && <span className={'text-amber-900'}> · {req.details}</span>}
                            </span>
                          </span>
                        </button>
                      </Td>
                      <Td tone={'center'} className={'hidden sm:table-cell'}>
                        <PreferenceLabel preference={preference} />
                      </Td>
                      <Td tone={'center'}>{req.renown ?? '—'}</Td>
                      <Td tone={'center'}>{req.support ?? '—'}</Td>
                      <Td tone={'muted'} className={'hidden sm:table-cell'}>
                        {req.details}
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Section>
        )}
      </>
    );
  };

  return (
    <>
      <Toolbar>
        <ToggleGroup label={'View'} options={MODE_OPTIONS} value={mode} onChange={setMode} />
        <RouteSelector route={route} setRoute={setRoute} />
        <SortSelector sort={sort} setSort={setSort} />
      </Toolbar>

      {mode === 'character' ? (
        <CharacterGrid>
          {sortedCharacters.map((c) => (
            <CharacterIcon
              key={c.name}
              character={c}
              selected={selectedCharacter === c.name}
              onClick={() => selectCharacter(c.name)}
              badge={badges && requirementBadge(c, route)}
              dimmed={!isRecruitable(c, route)}
            />
          ))}
        </CharacterGrid>
      ) : (
        renderGiftPicker()
      )}

      <div ref={results.ref} className={'mt-6 scroll-mt-4'}>
        {mode === 'character' ? (
          character ? (
            renderCharacterDetails(character)
          ) : (
            <EmptyState>Select a character to start!</EmptyState>
          )
        ) : (
          renderGiftResults()
        )}
      </div>
    </>
  );
};

export default Gifting;
