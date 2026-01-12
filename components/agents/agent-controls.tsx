'use client';

import React, { useState } from 'react';
import { Play, Pause, Square, RefreshCw, Loader2 } from 'lucide-react';
import { MockService } from '@/lib/mock-service';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useToast } from '@/contexts/toast-context';
import { ThreadStatus } from '@/types';
import { cn } from '@/lib/utils';

interface AgentControlsProps {
  className?: string;
}

export const AgentControls: React.FC<AgentControlsProps> = ({ className }) => {
  const { activeThreadId, dispatch } = useWorkspaceContext();
  const { toast } = useToast();
  const [loadingAction, setLoadingAction] = useState<ThreadStatus | null>(null);

  const handleStatusChange = async (newStatus: ThreadStatus) => {
    if (!activeThreadId) {
      toast({
        message: 'No active thread selected. Please select a thread first.',
        severity: 'warning',
      });
      return;
    }

    setLoadingAction(newStatus);

    // Optimistic UI update - update local state immediately
    dispatch({
      type: 'UPDATE_THREAD_STATUS',
      payload: {
        threadId: activeThreadId,
        status: newStatus,
      },
    });

    try {
      const updatedThread = await MockService.updateThreadStatus(activeThreadId, newStatus);
      
      // Verify the update was successful
      dispatch({
        type: 'UPDATE_THREAD_STATUS',
        payload: {
          threadId: updatedThread.id,
          status: updatedThread.status,
        },
      });

      toast({
        message: `Thread ${newStatus === 'stopped' ? 'stopped' : newStatus} successfully`,
        severity: 'success',
      });
    } catch (error) {
      // Revert optimistic update on error
      dispatch({
        type: 'UPDATE_THREAD_STATUS',
        payload: {
          threadId: activeThreadId,
          status: 'paused' as ThreadStatus, // Default to paused on error
        },
      });

      toast({
        message: `Failed to ${newStatus} thread: ${error instanceof Error ? error.message : 'Unknown error'}`,
        severity: 'error',
      });
    } finally {
      setLoadingAction(null);
    }
  };

  const ControlButton: React.FC<{
    label: string;
    icon: React.ReactNode;
    status: ThreadStatus;
    variant: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
  }> = ({ label, icon, status, variant, disabled }) => {
    const isLoading = loadingAction === status;
    
    const baseStyles = 'flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
    const variantStyles = {
      primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
      secondary: 'bg-slate-200 text-slate-700 hover:bg-slate-300 focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600',
      danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-2 focus:ring-rose-500 focus:ring-offset-2',
    };

    return (
      <button
        onClick={() => handleStatusChange(status)}
        disabled={disabled || !!loadingAction}
        className={cn(baseStyles, variantStyles[variant])}
        aria-label={label}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
        ) : (
          icon
        )}
        <span>{isLoading ? `${label}ing...` : label}</span>
      </button>
    );
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
        Thread Controls
      </h3>
      
      <div className="flex flex-wrap gap-3">
        <ControlButton
          label="Start"
          icon={<Play className="w-4 h-4" aria-hidden="true" />}
          status="active"
          variant="primary"
        />
        
        <ControlButton
          label="Pause"
          icon={<Pause className="w-4 h-4" aria-hidden="true" />}
          status="paused"
          variant="secondary"
        />
        
        <ControlButton
          label="Resume"
          icon={<RefreshCw className="w-4 h-4" aria-hidden="true" />}
          status="active"
          variant="primary"
        />
        
        <ControlButton
          label="Stop"
          icon={<Square className="w-4 h-4" aria-hidden="true" />}
          status="stopped"
          variant="danger"
        />
      </div>

      {loadingAction && (
        <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <Loader2 className="w-3 h-3 animate-spin" aria-hidden="true" />
          <span>Simulating network latency (1-5s)...</span>
        </div>
      )}
    </div>
  );
};
