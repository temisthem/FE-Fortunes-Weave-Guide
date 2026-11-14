/** Game-specific components, built from the design system in design.tsx. */
import type { ReactNode } from 'react';
import {
  type Character,
  type Gift,
  type LikeCounts,
  type Preference,
  type Route,
  type SortKey,
  ROUTES,
  SORT_LABELS,
  characterByName,
  getRouteInfo,
  portrait,
} from '@/data.ts';
import { Button, ControlGroup, ToggleGroup, cx, radius, state, text } from '@/design.tsx';

/** Portrait button in a selection grid. The selected one gets a ring; others stay in full colour. */
export const CharacterIcon = ({
  character,
  selected,
  showName,
  onClick,
  badge,
  dimmed,
}: {
  character: Character;
  selected: boolean;
  showName: boolean;
  onClick: () => void;
  badge?: ReactNode;
  /** Grayscale a unit that is guest-only or can't be recruited on the selected path. */
  dimmed?: boolean;
}) => (
  <div className={'mx-[0.3%] mb-[0.6%] w-[15%] sm:w-[10%] md:w-[7.5%] lg:w-[6%] xl:w-[5.5%]'}>
    <button
      type={'button'}
      className={cx('relative block w-full', radius, state.focus)}
      onClick={onClick}
      title={character.name}
      aria-pressed={selected}
    >
      <img
        className={cx('aspect-square w-full transition', radius, selected && state.selected, dimmed && state.dimmed)}
        src={portrait(character.slug)}
        alt={character.name}
        loading={'lazy'}
      />
      {badge && <Badge>{badge}</Badge>}
    </button>
    {showName && <p className={cx(text.caption, 'mt-0.5 truncate text-center')}>{character.name}</p>}
  </div>
);

/** Small dark label overlaid on a portrait corner. */
export const Badge = ({ children }: { children: ReactNode }) => (
  <span
    className={
      'absolute bottom-0.5 right-0.5 rounded bg-amber-900/85 px-0.5 text-[9px] font-bold leading-3 text-amber-50 md:text-[10px]'
    }
  >
    {children}
  </span>
);

/** Wrapping grid of portraits. */
export const CharacterGrid = ({ children }: { children: ReactNode }) => (
  <div className={'mt-4 flex flex-wrap justify-center'}>{children}</div>
);

/** Route picker: the four lords' portraits. */
export const RouteSelector = ({ route, setRoute }: { route: Route; setRoute: (r: Route) => void }) => (
  <ControlGroup label={'Route'}>
    <div className={'flex gap-2'}>
      {ROUTES.map((r) => (
        <button
          key={r}
          type={'button'}
          onClick={() => setRoute(r)}
          className={cx('flex w-11 flex-col items-center sm:w-12', radius, state.focus)}
          title={`${r}'s Path`}
          aria-pressed={route === r}
        >
          <img
            className={cx('aspect-square w-full transition', radius, route === r && state.selected)}
            src={portrait(characterByName.get(r)!.slug)}
            alt={r}
          />
          <span className={cx(text.caption, 'mt-1', route === r && 'font-bold')}>{r}</span>
        </button>
      ))}
    </div>
  </ControlGroup>
);

/** Display setting for portrait grids. Shared by every screen with a grid. */
export const NamesToggle = ({ showName, setShowName }: { showName: boolean; setShowName: (v: boolean) => void }) => (
  <ControlGroup>
    <Button variant={'toggle'} active={showName} onClick={() => setShowName(!showName)}>
      Show Names
    </Button>
  </ControlGroup>
);

const SORT_OPTIONS = (Object.keys(SORT_LABELS) as SortKey[]).map((k) => ({ value: k, label: SORT_LABELS[k] }));

export const SortSelector = ({ sort, setSort }: { sort: SortKey; setSort: (s: SortKey) => void }) => (
  <ToggleGroup label={'Sort by'} options={SORT_OPTIONS} value={sort} onChange={setSort} />
);

/** Compact "R8·S3" badge on portraits of units recruited with Renown/Support. Nothing for auto-joiners. */
export const requirementBadge = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  if (info?.status !== 'recruit') return null;
  return `R${info.renown ?? '?'}·S${info.support ?? '?'}`;
};

/** Grid used for every list of gift tiles. */
export const GiftGrid = ({ children }: { children: ReactNode }) => (
  <div className={'grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'}>{children}</div>
);

/** Gift card: dark tile with light text. Loved gifts get a gold border and a heart. */
export const GiftTile = ({
  gift,
  preference,
  selected,
  onClick,
  selectable,
  likes,
}: {
  gift: Gift;
  preference?: Preference;
  selected?: boolean;
  onClick?: () => void;
  /** In a picker: show like counts and grey out the tiles that aren't selected. */
  selectable?: boolean;
  /** Picker only: how many recruitable units on the path love / like it. */
  likes?: LikeCounts;
}) => {
  return (
    <button
      type={'button'}
      onClick={onClick}
      aria-pressed={selectable ? !!selected : undefined}
      className={cx(
        radius,
        state.focus,
        'flex w-full flex-col justify-center border-2 px-2.5 py-1.5 text-left transition',
        likes !== undefined && 'min-h-[3.25rem]',
        preference === 'Loved' ? 'border-yellow-400 bg-rose-900' : 'border-amber-950 bg-amber-800',
        selected && state.selected,
        selectable && !selected && state.unselected,
        likes && likes.loved + likes.liked === 0 && 'opacity-60',
      )}
    >
      <span className={'text-xs font-semibold leading-tight text-amber-50 md:text-sm'}>
        {preference === 'Loved' && <span className={'mr-1 text-yellow-300'}>♥</span>}
        {gift.name}
      </span>
      {likes !== undefined && (
        <span className={'text-[10px] uppercase tracking-wide text-amber-200/80 md:text-[11px]'}>
          <span className={likes.loved > 0 ? 'text-yellow-300' : undefined}>♥ {likes.loved} loved</span>
          {' · '}
          {likes.liked} liked
        </span>
      )}
    </button>
  );
};

export const PreferenceLabel = ({ preference }: { preference: Preference }) =>
  preference === 'Loved' ? <span className={'font-bold text-rose-800'}>♥ Loved</span> : <>Liked</>;
