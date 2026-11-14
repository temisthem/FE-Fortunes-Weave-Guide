/**
 * Design system tokens. Every component in design/ and ui/ builds on these,
 * so spacing, type, colour and interaction states stay consistent. Change a
 * token here and it updates everywhere.
 */

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

/** Type scale: the only text styles the app uses. */
export const text = {
  title: 'text-lg font-bold text-amber-950 md:text-2xl',
  heading: 'text-lg font-bold text-amber-950 md:text-xl',
  section: 'text-sm font-bold uppercase tracking-wide text-amber-900 md:text-base',
  label: 'text-xs font-bold uppercase tracking-wide text-amber-900 md:text-sm',
  body: 'text-sm text-amber-950 md:text-base',
  small: 'text-xs text-amber-950 md:text-sm',
  caption: 'text-[10px] leading-tight text-amber-950 md:text-xs',
};

/** Shared interaction states for anything selectable (portraits, tiles). */
export const interaction = {
  selected: 'ring-2 ring-amber-600 ring-offset-2 ring-offset-amber-50',
  unselected: 'filter grayscale-[50%] opacity-90 hover:grayscale-0 hover:opacity-100',
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600',
};

export const radius = 'rounded-md';
export const border = 'border-2 border-amber-900';

/** Soft inner dividers for table cells; the rounded outer border comes from Table. Tighter on phones. */
export const cellBase = 'border-b border-r border-amber-900/20 px-1.5 py-1.5 align-middle last:border-r-0 sm:px-3 sm:py-2';

export type Option<T extends string> = { value: T; label: string };
