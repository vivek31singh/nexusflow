'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { WorkspaceState } from '@/types';
import { StorageManager } from '@/lib/storage-manager';

// Types
interface WorkspaceContextType extends WorkspaceState {
  dispatch: React.Dispatch<WorkspaceAction>;
}

type WorkspaceAction =
  | { type: 'SET_ACTIVE_WORKSPACE'; payload: string }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string }
  | { type: 'SET_ACTIVE_THREAD'; payload: string | null }
  | { type: 'TOGGLE_AGENT_PANEL' }
  | { type: 'SET_THEME'; payload: 'dark' | 'light' };

// Initial State
const initialState: WorkspaceState = {
  activeWorkspaceId: StorageManager.get('activeWorkspaceId') || '',
  activeChannelId: StorageManager.get('activeChannelId') || '',
  activeThreadId: StorageManager.get('activeThreadId') || null,
  theme: (StorageManager.get('theme') as 'dark' | 'light') || 'dark',
  isAgentPanelOpen: StorageManager.get('isAgentPanelOpen') === 'true',
};

// Reducer
function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      StorageManager.set('activeWorkspaceId', action.payload);
      return { ...state, activeWorkspaceId: action.payload };
    case 'SET_ACTIVE_CHANNEL':
      StorageManager.set('activeChannelId', action.payload);
      return { ...state, activeChannelId: action.payload };
    case 'SET_ACTIVE_THREAD':
      StorageManager.set('activeThreadId', action.payload);
      return { ...state, activeThreadId: action.payload };
    case 'TOGGLE_AGENT_PANEL':
      const newValue = !state.isAgentPanelOpen;
      StorageManager.set('isAgentPanelOpen', String(newValue));
      return { ...state, isAgentPanelOpen: newValue };
    case 'SET_THEME':
      StorageManager.set('theme', action.payload);
      return { ...state, theme: action.payload };
    default:
      return state;
  }
}

// Create Context
export const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

// Provider Component
interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  return (
    <WorkspaceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Custom Hook
export function useWorkspaceContext(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
