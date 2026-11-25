import { type Route, ROUTES } from '@/data.ts';
import { stored } from '@/stored.svelte.ts';

type Favourites = Record<Route, string[]>;

const empty = (): Favourites => ({ Cai: [], Dietrich: [], Theodora: [], Leda: [] });

/** Characters each lord plans to recruit, set in Extras → Characters and listed in the Recruit Planner. */
const favourites = stored<Favourites>(
  'favourites',
  empty(),
  (v) =>
    typeof v === 'object' &&
    v !== null &&
    ROUTES.every((r) => Array.isArray((v as Record<string, unknown>)[r])),
);

export const isFavourite = (route: Route, name: string) => favourites.value[route].includes(name);

export const favouritesOf = (route: Route) => favourites.value[route];

export const toggleFavourite = (route: Route, name: string) => {
  const list = favourites.value[route];
  favourites.value = {
    ...favourites.value,
    [route]: list.includes(name) ? list.filter((n) => n !== name) : [...list, name],
  };
};
