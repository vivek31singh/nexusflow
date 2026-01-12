'use client'

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { WorkspaceState, WorkspaceAction } from '@/types'
import { storageManager } from '@/lib/storage-manager'

type WorkspaceContextType = {
  state: WorkspaceState
  dispatch: React.Dispatch<WorkspaceAction>
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined)

const initialState: WorkspaceState = {
  activeWorkspaceId: '',
  activeChannelId: '',
  activeThreadId: null,
  theme: 'dark',
  isAgentPanelOpen: true,
}

function workspaceReducer(state: WorkspaceState, action: WorkspaceAction): WorkspaceState {
  switch (action.type) {
    case 'SET_ACTIVE_WORKSPACE':
      return { ...state, activeWorkspaceId: action.payload }
    case 'SET_ACTIVE_CHANNEL':
      return { ...state, activeChannelId: action.payload, activeThreadId: null }
    case 'SET_ACTIVE_THREAD':
      return { ...state, activeThreadId: action.payload }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'dark' ? 'light' : 'dark' }
    case 'TOGGLE_AGENT_PANEL':
      return { ...state, isAgentPanelOpen: !state.isAgentPanelOpen }
    default:
      return state
  }
}

interface WorkspaceProviderProps {
  children: ReactNode
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, dispatch] = useReducer(workspaceReducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = storageManager.get<Partial<WorkspaceState>>()
    if (savedState) {
      Object.entries(savedState).forEach(([key, value]) => {
        if (value !== undefined) {
          switch (key) {
            case 'activeWorkspaceId':
              dispatch({ type: 'SET_ACTIVE_WORKSPACE', payload: value })
              break
            case 'activeChannelId':
              dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: value })
              break
            case 'activeThreadId':
              dispatch({ type: 'SET_ACTIVE_THREAD', payload: value })
              break
            case 'theme':
              if (value === 'dark' || value === 'light') {
                dispatch({ type: 'TOGGLE_THEME' }) // Will toggle if default differs
                if (state.theme !== value) {
                  dispatch({ type: 'TOGGLE_THEME' })
                }
              }
              break
            case 'isAgentPanelOpen':
              if (state.isAgentPanelOpen !== value) {
                dispatch({ type: 'TOGGLE_AGENT_PANEL' })
              }
              break
          }
        }
      })
    }
  }, [])

  // Save state to localStorage on change
  useEffect(() => {
    storageManager.set(state)
  }, [state])

  // Apply theme to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [state.theme])

  return (
    <WorkspaceContext.Provider value={{ state, dispatch }}>
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider')
  }
  return context
}