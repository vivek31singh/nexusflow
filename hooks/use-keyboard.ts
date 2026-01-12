'use client';

import { useEffect, RefObject } from 'react';

interface UseKeyboardOptions {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  callback: () => void;
  enabled?: boolean;
}

export const useKeyboard = (
  options: UseKeyboardOptions,
  ref?: RefObject<HTMLElement>
) => {
  const { key, ctrlKey = false, metaKey = false, shiftKey = false, altKey = false, callback, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if the key matches
      const keyMatches = event.key.toLowerCase() === key.toLowerCase();
      
      // Check modifiers
      const ctrlMatches = ctrlKey ? event.ctrlKey : !event.ctrlKey;
      const metaMatches = metaKey ? event.metaKey : !event.metaKey;
      const shiftMatches = shiftKey ? event.shiftKey : !event.shiftKey;
      const altMatches = altKey ? event.altKey : !event.altKey;

      if (keyMatches && ctrlMatches && metaMatches && shiftMatches && altMatches) {
        event.preventDefault();
        callback();
      }
    };

    const targetElement = ref?.current || window;
    targetElement.addEventListener('keydown', handleKeyDown);

    return () => {
      targetElement.removeEventListener('keydown', handleKeyDown);
    };
  }, [key, ctrlKey, metaKey, shiftKey, altKey, callback, enabled, ref]);
};
