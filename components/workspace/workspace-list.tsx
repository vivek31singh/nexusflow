import { useWorkspace } from '@/contexts/workspace-context';
import { mockService } from '@/lib/mock-service';
import { useEffect, useState } from 'react';
import { Workspace } from '@/types';
import { Building2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export const WorkspaceList = () => {
  const { state, dispatch } = useWorkspace();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    mockService.getWorkspaces()
      .then(setWorkspaces)
      .catch((err) => {
        console.error('Failed to fetch workspaces:', err);
        setError('Failed to load workspaces');
      })
      .finally(() => setLoading(false));
  }, []);

  const handleWorkspaceClick = (workspaceId: string) => {
    dispatch({ type: 'SET_ACTIVE_WORKSPACE', payload: workspaceId });
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-1 p-2">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-full animate-pulse rounded bg-slate-800/50"
            role="status"
            aria-label="Loading workspace"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-400" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 p-2">
      {workspaces.map((workspace) => (
        <button
          key={workspace.id}
          onClick={() => handleWorkspaceClick(workspace.id)}
          className={cn(
            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900",
            state.activeWorkspaceId === workspace.id
              ? "bg-indigo-600/10 text-indigo-400"
              : "text-slate-300 hover:bg-slate-800 hover:text-slate-100"
          )}
          aria-current={state.activeWorkspaceId === workspace.id ? 'page' : undefined}
        >
          <Building2
            className={cn(
              "h-5 w-5 flex-shrink-0 transition-colors",
              state.activeWorkspaceId === workspace.id
                ? "text-indigo-400"
                : "text-slate-500 group-hover:text-slate-400"
            )}
            aria-hidden="true"
          />
          <span className="truncate font-medium">{workspace.name}</span>
        </button>
      ))}
    </div>
  );
};
