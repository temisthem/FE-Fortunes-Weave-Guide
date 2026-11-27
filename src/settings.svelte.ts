import type { GiftingFilters, Route } from '@/data.ts';
import { favouritesOf } from '@/favourites.svelte.ts';
import { stored } from '@/stored.svelte.ts';

/** Display preferences, edited from the settings menu and saved in localStorage. */
export const settings = {
  /** Names under portraits in the character grids. */
  names: stored('nameState', true),
  /** "R8·S3" Renown/Support tags on portraits (Gifting and Meals). */
  badges: stored('badgeState', true),
  /** Names under the lords in the route selectors. */
  routeNames: stored('routeNameState', true),
  /** Gifting lists only units recruited with Renown/Support (the ones with an R·S tag). */
  recruitableOnly: stored('recruitableOnlyState', false),
  /** Gifting hides units that join automatically on any route, or can't be recruited at all. */
  neverAutoOnly: stored('neverAutoOnlyState', false),
  /** Meals lists only units recruited with Renown/Support on the chosen route, plus its lord. */
  mealsRecruitableOnly: stored('mealsRecruitableOnlyState', false),
  /** Gifting, Meals and Pale Raven hide Renown/Support recruits the lord hasn't added to the Recruit Planner. */
  plannedOnly: stored('plannedOnlyState', false),
};

/** The lord's Recruit Planner list when "Hide unplanned recruits" is on; null when off. */
export const plannedFilter = (route: Route) => (settings.plannedOnly.value ? favouritesOf(route) : null);

/** The current Gifting filters, read reactively from the settings. */
export const giftingFilters = (route: Route): GiftingFilters => ({
  recruitableOnly: settings.recruitableOnly.value,
  neverAutoOnly: settings.neverAutoOnly.value,
  planned: plannedFilter(route),
});
