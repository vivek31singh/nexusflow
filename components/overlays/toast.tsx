'use client';

import React, { useEffect } from 'react';
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

function ToastItem({ id, message, severity }: { id: string; message: string; severity: ToastSeverity }) {
  const { removeToast } = useToast();
  const config = severityConfig[severity];

  useEffect(() => {
    return () => {
      // Cleanup on unmount
    };
  }, [id]);

  return (
    <div
      role="alert"
      aria-live="polite"
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg min-w-[320px] max-w-md',
        'transition-all duration-300 ease-out',
        'animate-in slide-in-from-right-full fade-in',
        'animate-out slide-out-to-right-full fade-out',
        config.bgColor,
        config.borderColor,
        'border'
      )}
    >
      <span className={cn('flex-shrink-0 mt-0.5', config.iconColor)} aria-hidden="true">
        {config.icon}
      </span>
      <p className="flex-1 text-sm font-medium text-slate-100 font-sans">{message}</p>
      <button
        onClick={() => removeToast(id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-100 transition-colors p-1 rounded hover:bg-slate-700"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function Toast() {
  const { toasts } = useToast();

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none"
      aria-label="Toast notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem
            id={toast.id}
            message={toast.message}
            severity={toast.severity}
          />
        </div>
      ))}
    </div>
  );
}
