import { useWorkspaceContext } from '@/contexts/workspace-context';
import { cn } from '@/lib/utils';
import { Panel } from '@/components/ui/panel';
import { WorkspaceList } from '@/components/workspace/workspace-list';
import { ChannelList } from '@/components/channel/channel-list';
import { ThreadList } from '@/components/threads/thread-list';
import { ActivityStream } from '@/components/activity/activity-stream';
import { AgentPanel } from '@/components/agents/agent-panel';

export const MainLayout = () => {
  const { isAgentPanelOpen } = useWorkspaceContext();

  return (
    <div className="flex h-screen w-screen bg-slate-50 dark:bg-slate-950">
      {/* Panel 1: Workspace Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800">
        <Panel className="flex-1 h-full rounded-none border-0">
          <WorkspaceList />
        </Panel>
      </aside>

      {/* Panel 2: Channel Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800">
        <Panel className="flex-1 h-full rounded-none border-0">
          <ChannelList />
        </Panel>
      </aside>

      {/* Panel 3: Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <Panel className="flex-1 h-full rounded-none border-0 flex flex-col">
          {/* Thread List Header */}
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 px-4 flex items-center">
            <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Threads
            </h2>
          </div>
          
          {/* Thread List */}
          <div className="flex-1 overflow-auto">
            <ThreadList />
          </div>
          
          {/* Activity Stream */}
          <div className="h-1/2 border-t border-slate-200 dark:border-slate-800">
            <ActivityStream />
          </div>
        </Panel>
      </main>

      {/* Panel 4: Agent Panel (Collapsible) */}
      {isAgentPanelOpen && (
        <aside className="hidden xl:flex w-80 flex-col border-l border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out">
          <Panel className="flex-1 h-full rounded-none border-0">
            <AgentPanel />
          </Panel>
        </aside>
      )}
    </div>
  );
};
