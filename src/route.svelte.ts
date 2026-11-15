import { type Route, ROUTES } from '@/data.ts';
import { stored } from '@/stored.svelte.ts';

/**
 * The route being played. Shared by every screen that shows Renown/Support
 * requirements, so switching it on one screen carries over to the others.
 * (Stored under its original Gifting key so existing choices are kept.)
 */
export const currentRoute = stored<Route>('gift.route', 'Cai', (v) => ROUTES.includes(v as Route));
