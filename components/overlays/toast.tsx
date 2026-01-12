'use client';

import React from 'react';
import { X, Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useToast, ToastSeverity } from '@/contexts/toast-context';
import { cn } from '@/lib/utils';

const severityConfig: Record<
  ToastSeverity,
  { icon: React.ReactNode; bgColor: string; borderColor: string; iconColor: string }
> = {
  info: {
    icon: <Info className="w-5 h-5" />,
    bgColor: 'bg-slate-800',
    borderColor: 'border-slate-700',
    iconColor: 'text-blue-400',
  },
  success: {
    icon: <CheckCircle className="w-5 h-5" />,
    bgColor: 'bg-slate-800',
    borderColor: 'border-emerald-700',
    iconColor: 'text-emerald-400',
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: 'bg-slate-800',
    borderColor: 'border-amber-700',
    iconColor: 'text-amber-400',
  },
  error: {
    icon: <XCircle className="w-5 h-5" />,
    bgColor: 'bg-slate-800',
    borderColor: 'border-rose-700',
    iconColor: 'text-rose-400',
  },
};

interface ToastItemProps {
  id: string;
  message: string;
  severity: ToastSeverity;
  onRemove: (id: string) => void;
}

function ToastItem({ id, message, severity, onRemove }: ToastItemProps) {
  const config = severityConfig[severity];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-center gap-3 p-4 rounded-lg border shadow-lg',
        'transform transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-5 fade-in-20',
        config.bgColor,
        config.borderColor
      )}
    >
      <div className={cn('flex-shrink-0', config.iconColor)}>{config.icon}</div>
      <p className="flex-1 text-sm text-slate-200 font-medium">{message}</p>
      <button
        onClick={() => onRemove(id)}
        className={cn(
          'flex-shrink-0 p-1 rounded-md transition-colors',
          'hover:bg-slate-700 text-slate-400 hover:text-slate-200',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500'
        )}
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-label="Toast notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            severity={toast.severity}
            onRemove={removeToast}
          />
        </div>
      ))}
    </div>
  );
}
