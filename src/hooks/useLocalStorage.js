'use client';

import { useState, useEffect, useCallback } from 'react';

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        setValue(parsed);
        console.log(`[useLocalStorage] Loaded key="${key}":`, parsed);
      } else {
        console.log(`[useLocalStorage] No stored value for key="${key}", using initial`);
      }
    } catch (err) {
      console.error(`[useLocalStorage] Error reading key="${key}":`, err);
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (newValue) => {
      setValue((prev) => {
        const next = typeof newValue === 'function' ? newValue(prev) : newValue;
        try {
          localStorage.setItem(key, JSON.stringify(next));
          console.log(`[useLocalStorage] Saved key="${key}":`, next);
        } catch (err) {
          console.error(`[useLocalStorage] Error saving key="${key}":`, err);
        }
        return next;
      });
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
    console.log(`[useLocalStorage] Removed key="${key}"`);
  }, [key, initialValue]);

  return { value, set, remove, hydrated };
}
