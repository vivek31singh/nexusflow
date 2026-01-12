'use client';

import { useEffect, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import type { Workspace } from '@/types';
import { Skeleton } from '@/ui/skeleton';
import { cn } from '@/lib/utils';

const SKELETON_COUNT = 5;

export function WorkspaceList() {
  const { state, dispatch } = useWorkspaceContext();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkspaces = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await MockService.getWorkspaces();
        setWorkspaces(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load workspaces');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkspaces();
  }, []);

  const handleWorkspaceClick = (workspaceId: string) => {
    dispatch({ type: 'SET_ACTIVE_WORKSPACE', payload: workspaceId });
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-rose-500">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Workspaces
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
                <Skeleton className="h-5 w-5 rounded-sm" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        ) : (
          <ul role="list" className="divide-y divide-slate-100 dark:divide-slate-800">
            {workspaces.map((workspace) => (
              <li key={workspace.id}>
                <button
                  onClick={() => handleWorkspaceClick(workspace.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors',
                    'hover:bg-slate-100 dark:hover:bg-slate-800',
                    state.activeWorkspaceId === workspace.id
                      ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-medium'
                      : 'text-slate-700 dark:text-slate-300'
                  )}
                >
                  <div className="flex-shrink-0 w-5 h-5 rounded-sm bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                      {workspace.name[0]}
                    </span>
                  </div>
                  <span className="truncate">{workspace.name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
