"use client";

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { WorkspaceState, WorkspaceAction } from '@/types';
import { storage } from '@/lib/storage-manager';

const STORAGE_KEY = 'workspace_state';

const initialState: WorkspaceState = {
  activeWorkspaceId: 'ws-1',
  activeChannelId: 'ch-1',
  activeThreadId: null,
  theme: 'dark',
  isAgentPanelOpen: true,
};

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      return { ...state, activeWorkspaceId: action.payload };
    case 'SET_ACTIVE_CHANNEL':
      return { ...state, activeChannelId: action.payload };
    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThreadId: action.payload };
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' };
    case 'TOGGLE_AGENT_PANEL':
      return { ...state, isAgentPanelOpen: !state.isAgentPanelOpen };
    default:
      return state;
  }
}

interface WorkspaceContextType {
  state: WorkspaceState;
  dispatch: React.Dispatch<WorkspaceAction>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = storage.get<WorkspaceState>(STORAGE_KEY);
    if (savedState) {
      Object.entries(savedState).forEach(([key, value]) => {
        if (key in initialState) {
          // @ts-ignore - dynamic key assignment
          dispatch({ type: `SET_${key.toUpperCase()}`, payload: value });
        }
      });
    }
  }, []);

  // Save state to localStorage on change
  useEffect(() => {
    storage.set(STORAGE_KEY, state);
    
    // Apply theme to document
    if (state.theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [state]);

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
