import { useEffect, useRef } from 'react';

/**
 * Scrolls a results block into view after the user picks something. Call
 * `requestScroll()` in the click handler and attach `ref` to the block. The
 * scroll waits for the next render, so the new content is already there.
 */
export const useScrollOnSelect = <T extends HTMLElement>() => {
  const ref = useRef<T>(null);
  const pending = useRef(false);

  useEffect(() => {
    if (!pending.current || !ref.current) return;
    pending.current = false;
    ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  return {
    ref,
    requestScroll: () => {
      pending.current = true;
    },
  };
};
