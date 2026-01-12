import { useEffect } from 'react';

/**
 * Hook for keyboard shortcuts
 */
export function useKeyboard(
  key: string,
  callback: (event: KeyboardEvent) => void,
  options: { ctrl?: boolean; meta?: boolean; shift?: boolean } = {}
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = event.key.toLowerCase() === key.toLowerCase();
      const ctrlMatch = !options.ctrl || event.ctrlKey;
      const metaMatch = !options.meta || event.metaKey;
      const shiftMatch = !options.shift || event.shiftKey;

      if (keyMatch && ctrlMatch && metaMatch && shiftMatch) {
        event.preventDefault();
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}
