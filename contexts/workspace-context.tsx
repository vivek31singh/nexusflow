'use client';

import { createContext, useContext, useReducer, ReactNode, Dispatch, useEffect } from 'react';
import { WorkspaceState, Theme } from '@/types';
import { StorageManager } from '@/lib/storage-manager';

type WorkspaceAction =
  | { type: 'SET_ACTIVE_WORKSPACE'; payload: string }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string }
  | { type: 'SET_ACTIVE_THREAD'; payload: string | null }
  | { type: 'TOGGLE_AGENT_PANEL' }
  | { type: 'SET_AGENT_PANEL_OPEN'; payload: boolean }
  | { type: 'SET_THEME'; payload: Theme };

interface WorkspaceContextValue {
  state: WorkspaceState;
  dispatch: Dispatch<WorkspaceAction>;
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined);

const initialState: WorkspaceState = {
  activeWorkspaceId: StorageManager.getActiveWorkspaceId() || '',
  activeChannelId: StorageManager.getActiveChannelId() || '',
  activeThreadId: null,
  theme: StorageManager.getTheme(),
  isAgentPanelOpen: StorageManager.isAgentPanelOpen(),
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      StorageManager.setActiveWorkspaceId(action.payload);
      return { ...state, activeWorkspaceId: action.payload };

    case 'SET_ACTIVE_CHANNEL':
      StorageManager.setActiveChannelId(action.payload);
      return { ...state, activeChannelId: action.payload };

    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThreadId: action.payload };

    case 'TOGGLE_AGENT_PANEL':
      const newPanelState = !state.isAgentPanelOpen;
      StorageManager.setAgentPanelOpen(newPanelState);
      return { ...state, isAgentPanelOpen: newPanelState };

    case 'SET_AGENT_PANEL_OPEN':
      StorageManager.setAgentPanelOpen(action.payload);
      return { ...state, isAgentPanelOpen: action.payload };

    case 'SET_THEME':
      StorageManager.setTheme(action.payload);
      return { ...state, theme: action.payload };

    default:
      return state;
  }
}

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  useEffect(() => {
    const root = document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [state.theme]);

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
