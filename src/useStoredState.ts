import { useEffect, useState } from 'react';

/** useState that persists to localStorage (JSON) under `key`. */
export const useStoredState = <T,>(key: string, initial: T, isValid?: (v: unknown) => boolean) => {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return initial;
      const parsed = JSON.parse(raw);
      return isValid && !isValid(parsed) ? initial : (parsed as T);
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
