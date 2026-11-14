import { createContext, useContext } from 'react';

/** Display preferences, edited from the settings menu and saved in localStorage. */
export type Settings = {
  /** Names under portraits in the character grids. */
  names: boolean;
  /** "R8·S3" Renown/Support tags on Gifting portraits. */
  badges: boolean;
  /** Names under the lords in the route selector. */
  routeNames: boolean;
};

export const DEFAULT_SETTINGS: Settings = { names: true, badges: true, routeNames: true };

export const SettingsContext = createContext<Settings>(DEFAULT_SETTINGS);

export const useSettings = () => useContext(SettingsContext);
