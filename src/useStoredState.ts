import { useEffect, useState } from 'react';

/**
 * Namespace for every stored key. On GitHub Pages all of temisthem.github.io
 * shares one localStorage, so without a prefix this app would overwrite
 * other guides' settings (e.g. Volcano Princess's `screenState`).
 */
const PREFIX = 'feweave.';

/** useState that persists to localStorage (JSON) under `feweave.<key>`. */
export const useStoredState = <T,>(key: string, initial: T, isValid?: (v: unknown) => boolean) => {
  const storageKey = PREFIX + key;

  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return initial;
      const parsed = JSON.parse(raw);
      return isValid && !isValid(parsed) ? initial : (parsed as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [storageKey, value]);

  return [value, setValue] as const;
};
