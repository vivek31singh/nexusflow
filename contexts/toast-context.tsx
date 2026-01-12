'use client';

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react';

type ToastSeverity = 'info' | 'success' | 'warning' | 'error';

export interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

type ToastAction =
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string };

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (message: string, severity: ToastSeverity, duration?: number) => void;
  removeToast: (id: string) => void;
} | null>(null);

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [...state.toasts, action.payload],
      };
    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload),
      };
    default:
      return state;
  }
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });

  const addToast = useCallback(
    (message: string, severity: ToastSeverity, duration = 5000) => {
      const id = crypto.randomUUID();
      dispatch({ type: 'ADD_TOAST', payload: { id, message, severity, duration } });

      if (duration > 0) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', payload: id });
        }, duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
