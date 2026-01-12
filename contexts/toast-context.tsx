'use client';

import React, { createContext, useContext, useReducer, useCallback, useRef, ReactNode } from 'react';

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

const MAX_TOASTS = 3;

function toastReducer(state: ToastState, action: ToastAction): ToastState {
  switch (action.type) {
    case 'ADD_TOAST':
      return { toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { toasts: state.toasts.filter((toast) => toast.id !== action.payload) };
    default:
      return state;
  }
}

const ToastContext = createContext<{
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
} | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(toastReducer, { toasts: [] });
  const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());

  const removeToast = useCallback((id: string) => {
    // Clean up the timeout associated with this toast
    const timeoutId = timeoutRefs.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutRefs.current.delete(id);
    }
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = { ...toast, id, duration: toast.duration ?? 5000 };

    // If we've hit the maximum number of toasts, remove the oldest one first
    // This is done here instead of the reducer so we can access refs for cleanup
    if (state.toasts.length >= MAX_TOASTS) {
      const oldestToast = state.toasts[0];
      const oldestTimeoutId = timeoutRefs.current.get(oldestToast.id);
      if (oldestTimeoutId) {
        clearTimeout(oldestTimeoutId);
        timeoutRefs.current.delete(oldestToast.id);
      }
      dispatch({ type: 'REMOVE_TOAST', payload: oldestToast.id });
    }

    dispatch({ type: 'ADD_TOAST', payload: newToast });

    // Set auto-dismiss timeout if duration is not Infinity
    if (newToast.duration !== Infinity) {
      const timeoutId = setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
      timeoutRefs.current.set(id, timeoutId);
    }
  }, [state.toasts, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
