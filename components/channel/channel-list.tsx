'use client';

import { useContext, useEffect, useState } from 'react';
import { WorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import { Channel } from '@/types';
import { cn } from '@/lib/utils';
import { Hash } from 'lucide-react';

export const ChannelList = () => {
  const { state, dispatch } = useContext(WorkspaceContext);
  const { activeWorkspaceId, activeChannelId } = state;
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannels = async () => {
      if (!activeWorkspaceId) {
        setChannels([]);
        return;
      }

      setLoading(true);
      setError(null);
      try {
        const data = await MockService.getChannels(activeWorkspaceId);
        setChannels(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load channels');
        console.error('Failed to fetch channels:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchChannels();
  }, [activeWorkspaceId]);

  const handleChannelClick = (channelId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHANNEL', payload: channelId });
  };

  if (!activeWorkspaceId) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <span className="text-sm">Select a workspace first</span>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <span className="text-sm">Loading channels...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-rose-400">
        <span className="text-sm">Error: {error}</span>
      </div>
    );
  }

  if (channels.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400">
        <span className="text-sm">No channels found</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-700 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Channels
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => handleChannelClick(channel.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200",
              "hover:bg-slate-200 dark:hover:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-indigo-500",
              activeChannelId === channel.id
                ? "bg-indigo-50 dark:bg-slate-800 text-indigo-700 dark:text-white border-l-2 border-indigo-500"
                : "text-slate-700 dark:text-slate-300 border-l-2 border-transparent"
            )}
            aria-label={`Select channel ${channel.name}`}
          >
            <Hash
              className={cn(
                "w-4 h-4 flex-shrink-0",
                activeChannelId === channel.id
                  ? "text-indigo-500"
                  : "text-slate-400 dark:text-slate-500"
              )}
            />
            <span className="flex-1 text-left truncate">{channel.name}</span>
            {channel.unreadCount > 0 && (
              <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-500 text-white">
                {channel.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
