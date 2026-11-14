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
  describeStatus,
  fansOf,
  getRouteInfo,
  giftByName,
  gifts,
  portrait,
} from '@/data.ts';
import {
  Button,
  DetailHeader,
  EmptyState,
  Fact,
  Hint,
  Input,
  Panel,
  Section,
  Table,
  Td,
  Th,
  ToggleGroup,
  Toolbar,
  cx,
  rowHighlight,
  state,
  text,
} from '@/design.tsx';
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

/** Renown / Support / other-requirements cells for one route. */
const RequirementCells = ({ character, route }: { character: Character; route: Route }) => {
  const info = getRouteInfo(character, route);
  const recruitable = info?.status === 'recruit';
  const other = recruitable
    ? [
        info.when && (/^From /.test(info.when) ? info.when : `From ${info.when.replace(/ onward$/, '')}`),
        ...(info.conditions ?? []),
      ]
        .filter(Boolean)
        .join(' · ')
    : describeStatus(character, route);
  return (
    <>
      <Td tone={'center'}>{recruitable ? info.renown ?? '?' : '—'}</Td>
      <Td tone={'center'}>{recruitable ? info.support ?? '?' : '—'}</Td>
      <Td tone={'muted'}>{other}</Td>
    </>
  );
};

const Gifting = ({ showName }: { showName: boolean }) => {
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
      <DetailHeader image={portrait(c.slug)} title={c.name}>
        {c.likes && <Fact label={'Likes'}>{c.likes}</Fact>}
        {c.interests && <Fact label={'Interests'}>{c.interests}</Fact>}
      </DetailHeader>

      <Section title={'Recruitment requirements'}>
        {c.recruit ? (
          <Table>
            <thead>
              <tr>
                <Th width={'22%'}>Route</Th>
                <Th width={'14%'}>Renown Lv</Th>
                <Th width={'14%'}>Support Lv</Th>
                <Th>Other requirements</Th>
              </tr>
            </thead>
            <tbody>
              {ROUTES.map((r) => (
                <tr key={r} className={r === route ? rowHighlight : ''}>
                  <Td tone={'strong'}>{r}&rsquo;s Path</Td>
                  <RequirementCells character={c} route={r} />
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className={cx(text.body, 'text-center')}>{c.note ?? 'Joins through the story.'}</p>
        )}
      </Section>

      {c.loved.length + c.reallyLiked.length === 0 ? (
        <EmptyState>No known favourite gifts yet.</EmptyState>
      ) : (
        <>
          {c.loved.length > 0 && (
            <Section title={'♥ Loved gifts'}>
              <GiftGrid>
                {c.loved.map((g) => (
                  <GiftTile key={g} gift={giftByName.get(g)!} preference={'Loved'} onClick={() => selectGift(g, true)} />
                ))}
              </GiftGrid>
            </Section>
          )}
          {c.reallyLiked.length > 0 && (
            <Section title={'Really liked gifts'}>
              <GiftGrid>
                {c.reallyLiked.map((g) => (
                  <GiftTile
                    key={g}
                    gift={giftByName.get(g)!}
                    preference={'Really Liked'}
                    onClick={() => selectGift(g, true)}
                  />
                ))}
              </GiftGrid>
            </Section>
          )}
          <Hint>Tap a gift to see everyone else who likes it.</Hint>
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
          <EmptyState>Nobody is known to love or really like this gift.</EmptyState>
        ) : (
          <Section title={`Who likes it (${route}’s Path)`}>
            <Table>
              <thead>
                <tr>
                  <Th width={'26%'}>Character</Th>
                  <Th width={'14%'}>Preference</Th>
                  <Th width={'12%'}>Renown Lv</Th>
                  <Th width={'12%'}>Support Lv</Th>
                  <Th>Other requirements</Th>
                </tr>
              </thead>
              <tbody>
                {fans.map(({ character: c, preference }) => (
                  <tr key={c.name}>
                    <Td tone={'strong'}>
                      <button
                        type={'button'}
                        className={cx('flex items-center gap-2 text-left hover:underline', state.focus)}
                        onClick={() => selectCharacter(c.name)}
                      >
                        <img
                          className={'aspect-square w-8 shrink-0 rounded md:w-10'}
                          src={portrait(c.slug)}
                          alt={''}
                          loading={'lazy'}
                        />
                        <span className={'truncate'}>{c.name}</span>
                      </button>
                    </Td>
                    <Td tone={'center'}>
                      <PreferenceLabel preference={preference} />
                    </Td>
                    <RequirementCells character={c} route={route} />
                  </tr>
                ))}
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
              showName={showName}
              onClick={() => selectCharacter(c.name)}
              badge={sort !== 'name' ? requirementBadge(c, route) : undefined}
            />
          ))}
        </CharacterGrid>
      ) : (
        renderGiftPicker()
      )}

      <div ref={results.ref} className={'mt-6 scroll-mt-4'}>
        {mode === 'character'
          ? character
            ? renderCharacterDetails(character)
            : <EmptyState>Select a character to start!</EmptyState>
          : renderGiftResults()}
      </div>
    </>
  );
};

export default Gifting;
