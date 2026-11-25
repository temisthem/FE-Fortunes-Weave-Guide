import { screen } from '@/nav.svelte.ts';
import { stored } from '@/stored.svelte.ts';

export type GiftMode = 'character' | 'gift';

/** Gifting's view and selection live here so other screens can open a character in it. */
export const mode = stored<GiftMode>('gift.mode', 'character', (v) => ['character', 'gift'].includes(v as string));
export const selectedCharacter = stored<string | null>('gift.character', null);

/** Set when another screen sends you here, so Gifting scrolls to the character once it opens. */
export const pending = { reveal: false };

/** Opens Gifting on a character's gift list. */
export const openGiftsFor = (name: string) => {
  selectedCharacter.value = name;
  mode.value = 'character';
  pending.reveal = true;
  screen.value = 'gifting';
};
