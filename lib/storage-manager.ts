const STORAGE_KEY = 'nexusflow-state'

export interface StorageData {
  activeWorkspaceId?: string
  activeChannelId?: string
  activeThreadId?: string | null
  theme?: 'dark' | 'light'
  isAgentPanelOpen?: boolean
}

export class StorageManager {
  private static instance: StorageManager

  private constructor() {}

  static getInstance(): StorageManager {
    if (!StorageManager.instance) {
      StorageManager.instance = new StorageManager()
    }
    return StorageManager.instance
  }

  get<T = StorageData>(key: string = STORAGE_KEY): T | null {
    if (typeof window === 'undefined') return null
    
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return null
    }
  }

  set<T = StorageData>(key: string = STORAGE_KEY, value: T): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  }

  remove(key: string = STORAGE_KEY): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  clear(): boolean {
    if (typeof window === 'undefined') return false
    
    try {
      window.localStorage.clear()
      return true
    } catch (error) {
      console.error('Error clearing localStorage:', error)
      return false
    }
  }
}

export const storageManager = StorageManager.getInstance()