import charactersJson from '@/data/characters.json';
import giftsJson from '@/data/gifts.json';
import ravenJson from '@/data/raven.json';
import mealsJson from '@/data/meals.json';

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

export type Preference = 'Loved' | 'Liked';

export const characters = charactersJson as Character[];
export const gifts = giftsJson as Gift[];
export const raven = ravenJson as Record<string, RavenEntry[]>;

/** An inn dish and the units who love / like eating it. */
export interface Meal {
  name: string;
  loved: string[];
  liked: string[];
}

export const meals = mealsJson as Meal[];

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

/** Characters who love / like a gift. */
export const fansOf = (gift: string) =>
  characters.flatMap((c) => {
    if (c.loved.includes(gift)) return [{ character: c, preference: 'Loved' as Preference }];
    if (c.reallyLiked.includes(gift)) return [{ character: c, preference: 'Liked' as Preference }];
    return [];
  });

export const portrait = (slug: string) => `${import.meta.env.BASE_URL}portraits/${slug}.webp`;

export const getRouteInfo = (c: Character, route: Route): RouteInfo | null =>
  c.recruit ? c.recruit[route] : null;

/**
 * Whether a unit can join you on this path: they join automatically, can be
 * recruited, or join through the story on every path (no per-path data).
 * Guest-only and unavailable units are not recruitable.
 */
export const isRecruitable = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  return !info || info.status === 'auto' || info.status === 'recruit';
};

export type LikeCounts = { loved: number; liked: number };

/** Units recruited with Renown/Support on this path: the ones with an "R·S" tag. */
export const hasRecruitTag = (c: Character, route: Route) => getRouteInfo(c, route)?.status === 'recruit';

/**
 * Units listed in Gifting: never the route's lord (the player), and with
 * `recruitableOnly` only the units that have an R·S tag.
 */
export const showInGifting = (c: Character, route: Route, recruitableOnly: boolean) =>
  !isRouteLord(c, route) && (!recruitableOnly || hasRecruitTag(c, route));

/** How many of the units listed in Gifting love / like a gift (matches the "Who likes it" table). */
export const likesOnRoute = (gift: string, route: Route, recruitableOnly: boolean): LikeCounts => {
  const fans = fansOf(gift).filter((f) => showInGifting(f.character, route, recruitableOnly));
  const loved = fans.filter((f) => f.preference === 'Loved').length;
  return { loved, liked: fans.length - loved };
};

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

/**
 * Recruitment requirements on one route. `renown`/`support` are set only for
 * recruitable units. `details` holds extra conditions, or the
 * status text when the unit isn't recruitable.
 */
export const requirementSummary = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  if (info?.status !== 'recruit') return { details: describeStatus(c, route) };
  return {
    renown: info.renown ?? '?',
    support: info.support ?? '?',
    details: (info.conditions ?? []).join(' · '),
  };
};

// ---- sorting -------------------------------------------------------------

export type SortKey = 'name' | 'renown';

export const SORT_LABELS: Record<SortKey, string> = {
  name: 'Name',
  renown: 'Renown Lv',
};

/**
 * Matches a join point outside Part I: Part II or III (e.g. "Part II: War,
 * Chapter 2"), or the Prologue, whose units aren't playable in Part I.
 */
const LATE_PART = /\bPart (II|III)\b|\bPrologue\b/;

/**
 * Units that aren't playable in Part I on this path: they join automatically
 * in Part II or III, or through the story in the Prologue or those parts.
 * They sort to the end with the non-recruitable units.
 */
export const joinsLate = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  if (!info) return LATE_PART.test(c.note ?? '');
  return info.status === 'auto' && LATE_PART.test(info.when ?? '');
};

/** Units you can have in Part I on this path: they join then or can be recruited. */
const availableEarly = (c: Character, route: Route) => isRecruitable(c, route) && !joinsLate(c, route);

/** The selected route's lord is the player, so they never receive gifts. */
export const isRouteLord = (c: Character, route: Route) => c.name === route;

/**
 * Rank used for requirement sorting. Units that join automatically need
 * nothing (0); recruitables use their level; late joiners, story-only and
 * unavailable units go to the end.
 */
const requirementRank = (c: Character, route: Route, key: 'renown' | 'support') => {
  const info = getRouteInfo(c, route);
  if (joinsLate(c, route)) return 700;
  if (!info || info.status === 'auto') return 0;
  if (info.status === 'recruit') return info[key] ?? 500;
  if (info.status === 'guest') return 800;
  return 1000;
};

/**
 * Both sorts list the units you can have early first, then late joiners and
 * non-recruitable units at the end.
 */
export const compareCharacters = (sort: SortKey, route: Route) => (a: Character, b: Character) => {
  const group = Number(!availableEarly(a, route)) - Number(!availableEarly(b, route));
  if (sort === 'name') return group || a.name.localeCompare(b.name);
  // Ties on Renown Lv are broken by Support Lv, then name.
  return (
    requirementRank(a, route, 'renown') - requirementRank(b, route, 'renown') ||
    requirementRank(a, route, 'support') - requirementRank(b, route, 'support') ||
    a.name.localeCompare(b.name)
  );
};

/** Compact "R8·S3" tag for portraits of units recruited with Renown/Support. Nothing for auto-joiners. */
export const requirementBadge = (c: Character, route: Route) => {
  const info = getRouteInfo(c, route);
  if (info?.status !== 'recruit') return null;
  return `R${info.renown ?? '?'}·S${info.support ?? '?'}`;
};
