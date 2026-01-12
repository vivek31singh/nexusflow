/**
 * StorageManager - Wrapper for localStorage with type safety
 */
class StorageManager {
  private prefix = 'nexusflow_';

  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    
    try {
      const item = window.localStorage.getItem(`${this.prefix}${key}`);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from localStorage: ${error}`);
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.setItem(`${this.prefix}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`);
    }
  }

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    
    try {
      window.localStorage.removeItem(`${this.prefix}${key}`);
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`);
    }
  }

  clear(): void {
    if (typeof window === 'undefined') return;
    
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith(this.prefix))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`);
    }
  }
}

export const storage = new StorageManager();
