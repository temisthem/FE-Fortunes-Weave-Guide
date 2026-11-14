import charactersJson from '@/data/characters.json';
import giftsJson from '@/data/gifts.json';
import ravenJson from '@/data/raven.json';

export const ROUTES = ['Cai', 'Dietrich', 'Theodora', 'Leda'] as const;
export type Route = (typeof ROUTES)[number];

export type RecruitStatus = 'auto' | 'recruit' | 'guest' | 'unavailable';

export interface RouteInfo {
  status: RecruitStatus;
  support?: number;
  renown?: number;
  when?: string;
  conditions?: string[];
  guest?: string;
  notes?: string[];
}

export interface Character {
  name: string;
  slug: string;
  loved: string[];
  reallyLiked: string[];
  likes: string;
  interests: string;
  recruit: Record<Route, RouteInfo> | null;
  note?: string;
}

export interface Gift {
  name: string;
  category: string;
  sources: string[];
}

export interface RavenEntry {
  prompt: string;
  answer: string;
  alt?: string;
}

export type Preference = 'Loved' | 'Really Liked';

export const characters = charactersJson as Character[];
export const gifts = giftsJson as Gift[];
export const raven = ravenJson as Record<string, RavenEntry[]>;

export const characterByName = new Map(characters.map((c) => [c.name, c]));
export const giftByName = new Map(gifts.map((g) => [g.name, g]));

export const GIFT_CATEGORIES = [
  'Books',
  'Ghosh & Shosh',
  'Cervi & Milk',
  'Sweets',
  'Coffee & Tea',
  'Food & Cooking',
  'Training & Gear',
  'Fishing',
  'Horse Care',
  'Art & Décor',
  'Fashion',
  'Board Games',
  'Miscellaneous',
];

/** Characters who love / really like a gift. */
export const fansOf = (gift: string) =>
  characters.flatMap((c) => {
    if (c.loved.includes(gift)) return [{ character: c, preference: 'Loved' as Preference }];
    if (c.reallyLiked.includes(gift))
      return [{ character: c, preference: 'Really Liked' as Preference }];
    return [];
  });

export const fanCount = new Map(gifts.map((g) => [g.name, fansOf(g.name).length]));

export const portrait = (slug: string) => `${import.meta.env.BASE_URL}portraits/${slug}.webp`;

export const getRouteInfo = (c: Character, route: Route): RouteInfo | null =>
  c.recruit ? c.recruit[route] : null;

/** Short human label for a character's requirement on a route. */
export const describeStatus = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  if (!info) return c.note ?? 'Joins through the story';
  switch (info.status) {
    case 'auto':
      return `Joins automatically${info.when ? ` (${info.when})` : ''}`;
    case 'guest':
      return 'Guest / story only on this route';
    case 'unavailable':
      return 'Not recruitable on this route';
    default:
      return '';
  }
};

// ---- sorting -------------------------------------------------------------

export type SortKey = 'name' | 'renown' | 'support';

export const SORT_LABELS: Record<SortKey, string> = {
  name: 'Name',
  renown: 'Renown Lv',
  support: 'Support Lv',
};

/**
 * Rank used for requirement sorting. Characters that join automatically need
 * nothing (0); recruitables use their level; story-only and unavailable units
 * go to the end.
 */
const requirementRank = (c: Character, route: Route, key: 'renown' | 'support') => {
  const info = getRouteInfo(c, route);
  if (!info) return 900;
  if (info.status === 'auto') return 0;
  if (info.status === 'recruit') return info[key] ?? 500;
  if (info.status === 'guest') return 800;
  return 1000;
};

export const compareCharacters = (sort: SortKey, route: Route) => (a: Character, b: Character) => {
  if (sort === 'name') return a.name.localeCompare(b.name);
  const other = sort === 'renown' ? 'support' : 'renown';
  return (
    requirementRank(a, route, sort) - requirementRank(b, route, sort) ||
    requirementRank(a, route, other) - requirementRank(b, route, other) ||
    a.name.localeCompare(b.name)
  );
};
