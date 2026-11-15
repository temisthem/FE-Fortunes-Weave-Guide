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
  /** Meals lists only units recruited with Renown/Support on the chosen route. */
  mealsRecruitableOnly: stored('mealsRecruitableOnlyState', false),
};
