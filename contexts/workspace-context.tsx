'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { StorageManager } from '@/lib/storage-manager';
import type { WorkspaceState, Workspace } from '@/types';

interface WorkspaceAction {
  type:
    | 'SET_ACTIVE_WORKSPACE'
    | 'SET_ACTIVE_CHANNEL'
    | 'SET_ACTIVE_THREAD'
    | 'TOGGLE_AGENT_PANEL'
    | 'SET_THEME'
    | 'OPEN_COMMAND_PALETTE'
    | 'CLOSE_COMMAND_PALETTE';
  payload?: any;
}

interface WorkspaceContextType {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
  setActiveWorkspace: (id: string) => void;
  setActiveChannel: (id: string) => void;
  setActiveThread: (id: string | null) => void;
  toggleAgentPanel: () => void;
  toggleTheme: () => void;
  openPalette: () => void;
  closePalette: () => void;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

const initialState: WorkspaceState = {
  activeWorkspaceId: StorageManager.get('activeWorkspaceId') || '',
  activeChannelId: StorageManager.get('activeChannelId') || '',
  activeThreadId: StorageManager.get('activeThreadId') || null,
  theme: (StorageManager.get('theme') as 'dark' | 'light') || 'dark',
  isAgentPanelOpen: StorageManager.get('isAgentPanelOpen') === 'true',
  isCommandPaletteOpen: false,
};

const workspaceReducer = (state: WorkspaceState, action: WorkspaceAction): WorkspaceState => {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      StorageManager.set('activeWorkspaceId', action.payload);
      return { ...state, activeWorkspaceId: action.payload, activeChannelId: '', activeThreadId: null };
    case 'SET_ACTIVE_CHANNEL':
      StorageManager.set('activeChannelId', action.payload);
      return { ...state, activeChannelId: action.payload, activeThreadId: null };
    case 'SET_ACTIVE_THREAD':
      StorageManager.set('activeThreadId', action.payload);
      return { ...state, activeThreadId: action.payload };
    case 'TOGGLE_AGENT_PANEL':
      const newState = !state.isAgentPanelOpen;
      StorageManager.set('isAgentPanelOpen', String(newState));
      return { ...state, isAgentPanelOpen: newState };
    case 'SET_THEME':
      StorageManager.set('theme', action.payload);
      return { ...state, theme: action.payload };
    case 'OPEN_COMMAND_PALETTE':
      return { ...state, isCommandPaletteOpen: true };
    case 'CLOSE_COMMAND_PALETTE':
      return { ...state, isCommandPaletteOpen: false };
    default:
      return state;
  }
};

export const WorkspaceProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  const setActiveWorkspace = (id: string) => dispatch({ type: 'SET_ACTIVE_WORKSPACE', payload: id });
  const setActiveChannel = (id: string) => dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: id });
  const setActiveThread = (id: string | null) => dispatch({ type: 'SET_ACTIVE_THREAD', payload: id });
  const toggleAgentPanel = () => dispatch({ type: 'TOGGLE_AGENT_PANEL' });
  const toggleTheme = () => dispatch({ type: 'SET_THEME', payload: state.theme === 'dark' ? 'light' : 'dark' });
  const openPalette = () => dispatch({ type: 'OPEN_COMMAND_PALETTE' });
  const closePalette = () => dispatch({ type: 'CLOSE_COMMAND_PALETTE' });

  return (
    <WorkspaceContext.Provider
      value={{
        state,
        dispatch,
        setActiveWorkspace,
        setActiveChannel,
        setActiveThread,
        toggleAgentPanel,
        toggleTheme,
        openPalette,
        closePalette,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspaceContext = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
};

export { WorkspaceContext };
