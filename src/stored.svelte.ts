/**
 * Namespace for every stored key. On GitHub Pages all of temisthem.github.io
 * shares one localStorage, so without a prefix this app would overwrite
 * other guides' settings (e.g. Volcano Princess's `screenState`).
 */
const PREFIX = 'feweave.';

/** A reactive value that persists to localStorage (JSON) under `feweave.<key>`. */
export type Stored<T> = { value: T };

export const stored = <T>(key: string, initial: T, isValid?: (v: unknown) => boolean): Stored<T> => {
  const storageKey = PREFIX + key;

  const load = (): T => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw === null) return initial;
      const parsed = JSON.parse(raw);
      return isValid && !isValid(parsed) ? initial : (parsed as T);
    } catch {
      return initial;
    }
  };

  let value = $state(load());

  return {
    get value() {
      return value;
    },
    set value(v: T) {
      value = v;
      localStorage.setItem(storageKey, JSON.stringify(v));
    },
  };
};
