'use client';

import { useEffect, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import type { Thread } from '@/types';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';
import { Play, Pause, Square } from 'lucide-react';

const SKELETON_COUNT = 4;

const statusIcons = {
  active: Play,
  paused: Pause,
  stopped: Square,
};

const statusColors = {
  active: 'text-emerald-500',
  paused: 'text-amber-500',
  stopped: 'text-slate-400',
};

export function ThreadList() {
  const { state } = useWorkspaceContext();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchThreads = async () => {
      if (!state.activeChannelId) {
        setThreads([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await MockService.getThreads(state.activeChannelId);
        setThreads(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load threads');
      } finally {
        setIsLoading(false);
      }
    };

    fetchThreads();
  }, [state.activeChannelId]);

  const handleThreadClick = (threadId: string) => {
    // Dispatch action to set active thread
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-rose-500">
        {error}
      </div>
    );
  }

  if (!state.activeChannelId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-500 dark:text-slate-400">
        Select a channel
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Threads
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-2">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex items-start gap-3 px-3 py-2 rounded-md"
              >
                <Skeleton className="h-4 w-4 rounded-sm mt-0.5" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-100 dark:divide-slate-800">
            {threads.map((thread) => {
              const StatusIcon = statusIcons[thread.status];
              return (
                <li key={thread.id}>
                  <button
                    onClick={() => handleThreadClick(thread.id)}
                    className={cn(
                      'w-full flex items-start gap-3 px-3 py-2 text-sm transition-colors',
                      'hover:bg-slate-100 dark:hover:bg-slate-800',
                      state.activeThreadId === thread.id
                        ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium'
                        : 'text-slate-700 dark:text-slate-300'
                    )}
                  >
                    <StatusIcon
                      className={cn(
                        'h-4 w-4 flex-shrink-0 mt-0.5',
                        statusColors[thread.status]
                      )}
                    />
                    <div className="flex-1 text-left">
                      <p className="font-medium truncate">{thread.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {new Date(thread.startTime).toLocaleTimeString()}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
