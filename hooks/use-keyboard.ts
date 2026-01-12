import { useEffect } from 'react';

interface UseKeyboardOptions {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  metaKey?: boolean;
  altKey?: boolean;
  onKeyDown: (event: KeyboardEvent) => void;
}

export function useKeyboard(options: UseKeyboardOptions) {
  const { key, ctrlKey = false, shiftKey = false, metaKey = false, altKey = false, onKeyDown } = options;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key === key &&
        event.ctrlKey === ctrlKey &&
        event.shiftKey === shiftKey &&
        event.metaKey === metaKey &&
        event.altKey === altKey
      ) {
        event.preventDefault();
        onKeyDown(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, ctrlKey, shiftKey, metaKey, altKey, onKeyDown]);
}