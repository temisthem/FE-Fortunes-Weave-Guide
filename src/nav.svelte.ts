import { stored } from '@/stored.svelte.ts';

/** The app's top-level screens, in tab order. */
export type Screen = 'gifting' | 'meals' | 'raven' | 'extras';
export const SCREENS: readonly Screen[] = ['gifting', 'meals', 'raven', 'extras'];

/** The open screen, shared so one screen can send you to another. */
export const screen = stored<Screen>('screenState', 'gifting', (v) => SCREENS.includes(v as Screen));
