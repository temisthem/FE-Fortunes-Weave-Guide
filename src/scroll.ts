import { tick } from 'svelte';

/**
 * Scrolls a results block into view after the user picks something. Waits
 * for the DOM to update first, so the new content is already there.
 */
export const revealAfterUpdate = async (el: HTMLElement | undefined) => {
  await tick();
  el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
