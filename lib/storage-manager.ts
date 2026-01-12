export class StorageManager {
  /**
   * Retrieves a value from localStorage by key
   * @param key - The localStorage key
   * @returns The parsed value or null if not found
   */
  static get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return null;
    }
  }

  /**
   * Stores a value in localStorage
   * @param key - The localStorage key
   * @param value - The value to store (will be JSON stringified)
   */
  static set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
    }
  }

  /**
   * Removes a value from localStorage
   * @param key - The localStorage key to remove
   */
  static remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from localStorage for key "${key}":`, error);
    }
  }
}
