export class StorageManager {
  private static readonly STORAGE_KEY = 'nexusflow';

  private static getValue<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') {
      return defaultValue;
    }

    try {
      const stored = localStorage.getItem(`${this.STORAGE_KEY}_${key}`);
      if (stored === null) {
        return defaultValue;
      }
      return JSON.parse(stored) as T;
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return defaultValue;
    }
  }

  private static setValue<T>(key: string, value: T): void {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      localStorage.setItem(`${this.STORAGE_KEY}_${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  static getTheme(): 'dark' | 'light' {
    return this.getValue<'dark' | 'light'>('theme', 'dark');
  }

  static setTheme(theme: 'dark' | 'light'): void {
    this.setValue('theme', theme);
  }

  static getActiveWorkspaceId(): string | null {
    return this.getValue<string | null>('activeWorkspaceId', null);
  }

  static setActiveWorkspaceId(workspaceId: string | null): void {
    this.setValue('activeWorkspaceId', workspaceId);
  }

  static getActiveChannelId(): string | null {
    return this.getValue<string | null>('activeChannelId', null);
  }

  static setActiveChannelId(channelId: string | null): void {
    this.setValue('activeChannelId', channelId);
  }

  static isAgentPanelOpen(): boolean {
    return this.getValue<boolean>('isAgentPanelOpen', true);
  }

  static setAgentPanelOpen(isOpen: boolean): void {
    this.setValue('isAgentPanelOpen', isOpen);
  }

  static clearAll(): void {
    if (typeof window === 'undefined') {
      return;
    }

    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`${this.STORAGE_KEY}_`)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
}
