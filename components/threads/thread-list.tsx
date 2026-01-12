'use client';

import { useEffect, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import { Thread } from '@/types';
import { Activity, Pause, Square } from 'lucide-react';

const statusIcons = {
  active: <Activity className="w-4 h-4 text-emerald-500" />,
  paused: <Pause className="w-4 h-4 text-amber-500" />,
  stopped: <Square className="w-4 h-4 text-slate-400" />,
};

export const ThreadList = () => {
  const { activeChannelId, activeThreadId, dispatch } = useWorkspaceContext();
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activeChannelId) {
      setThreads([]);
      return;
    }

    const fetchThreads = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await MockService.getThreads(activeChannelId);
        setThreads(data);
      } catch (err) {
        setError('Failed to load threads');
        setThreads([]);
      } finally {
        setLoading(false);
      }
    };

    fetchThreads();
  }, [activeChannelId]);

  const handleSelectThread = (threadId: string) => {
    dispatch({ type: 'SET_ACTIVE_THREAD', payload: threadId });
  };

  if (loading) {
    return (
      <div className="p-4 space-y-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-rose-500">{error}</div>
    );
  }

  if (!activeChannelId) {
    return (
      <div className="p-4 text-sm text-slate-500">
        Select a channel to view threads
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="p-4 text-sm text-slate-500">
        No threads in this channel
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-200 dark:divide-slate-800">
      {threads.map((thread) => (
        <button
          key={thread.id}
          onClick={() => handleSelectThread(thread.id)}
          className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            activeThreadId === thread.id
              ? 'bg-indigo-50 dark:bg-indigo-950/30 border-l-2 border-indigo-500'
              : 'border-l-2 border-transparent'
          }`}
          aria-selected={activeThreadId === thread.id}
          role="option"
        >
          {statusIcons[thread.status]}
          <div className="flex-1 text-left">
            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
              {thread.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(thread.startTime).toLocaleTimeString()}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};