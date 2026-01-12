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
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'TOGGLE_COMMAND_PALETTE' };

// Reducer
const initialState: WorkspaceState = {
  activeWorkspaceId: StorageManager.get('activeWorkspaceId') || '',
  activeChannelId: StorageManager.get('activeChannelId') || '',
  activeThreadId: StorageManager.get('activeThreadId') || null,
  theme: (StorageManager.get('theme') as 'light' | 'dark') || 'dark',
  isAgentPanelOpen: StorageManager.get('isAgentPanelOpen') === 'true',
  isCommandPaletteOpen: false,
};

function workspaceReducer(
  state: WorkspaceState,
  action: WorkspaceAction
): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      StorageManager.set('activeWorkspaceId', action.payload);
      return {
        ...state,
        activeWorkspaceId: action.payload,
        activeChannelId: '',
        activeThreadId: null,
      };
    case 'SET_ACTIVE_CHANNEL':
      StorageManager.set('activeChannelId', action.payload);
      return {
        ...state,
        activeChannelId: action.payload,
        activeThreadId: null,
      };
    case 'SET_ACTIVE_THREAD':
      StorageManager.set('activeThreadId', action.payload);
      return {
        ...state,
        activeThreadId: action.payload,
      };
    case 'TOGGLE_AGENT_PANEL':
      const newPanelState = !state.isAgentPanelOpen;
      StorageManager.set('isAgentPanelOpen', String(newPanelState));
      return {
        ...state,
        isAgentPanelOpen: newPanelState,
      };
    case 'SET_THEME':
      StorageManager.set('theme', action.payload);
      return {
        ...state,
        theme: action.payload,
      };
    case 'TOGGLE_COMMAND_PALETTE':
      return {
        ...state,
        isCommandPaletteOpen: !state.isCommandPaletteOpen,
      };
    default:
      return state;
  }
}

// Context
const WorkspaceContext = createContext<WorkspaceContextType | undefined>(
  undefined
);

// Provider
export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  return (
    <WorkspaceContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  );
}

// Hook
export function useWorkspaceContext(): WorkspaceContextType {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}