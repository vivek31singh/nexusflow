'use client';

import { useEffect, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import type { Channel } from '@/types';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';
import { Hash, Workflow } from 'lucide-react';

const SKELETON_COUNT = 6;

export function ChannelList() {
  const { state } = useWorkspaceContext();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!state.activeWorkspaceId) {
        setChannels([]);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await MockService.getChannels(state.activeWorkspaceId);
        setChannels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load channels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, [state.activeWorkspaceId]);

  const handleChannelClick = (channelId: string) => {
    // Dispatch action to set active channel - this would be handled by context
    // For now, we'll just let the parent handle it through prop if needed
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-rose-500">
        {error}
      </div>
    );
  }

  if (!state.activeWorkspaceId) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-slate-500 dark:text-slate-400">
        Select a workspace
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Channels
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="p-2 space-y-1">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-3 py-2 rounded-md"
              >
                <Skeleton className="h-4 w-4 rounded-sm" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-100 dark:divide-slate-800">
            {channels.map((channel) => (
              <li key={channel.id}>
                <button
                  onClick={() => handleChannelClick(channel.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                    'hover:bg-slate-100 dark:hover:bg-slate-800',
                    state.activeChannelId === channel.id
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  {channel.type === 'workflow' ? (
                    <Workflow className="h-4 w-4 flex-shrink-0" />
                  ) : (
                    <Hash className="h-4 w-4 flex-shrink-0" />
                  )}
                  <span className="flex-1 text-left truncate">{channel.name}</span>
                  {channel.unreadCount > 0 && (
                    <span className="flex-shrink-0 inline-flex items-center justify-center h-5 px-1.5 text-xs font-medium text-white bg-indigo-600 rounded-full">
                      {channel.unreadCount}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
