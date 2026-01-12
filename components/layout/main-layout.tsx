'use client';

import { WorkspaceList } from '@/components/workspace/workspace-list';
import { ChannelList } from '@/components/channel/channel-list';
import { ThreadList } from '@/components/threads/thread-list';
import { Panel } from '@/components/ui/panel';
import { WorkspaceProvider } from '@/contexts/workspace-context';

export const MainLayout = () => {
  return (
    <WorkspaceProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex-1 grid grid-cols-[240px_240px_1fr_280px] hidden md:grid">
          {/* Panel 1: Workspace Sidebar */}
          <Panel className="border-r border-slate-200 dark:border-slate-800">
            <WorkspaceList />
          </Panel>

          {/* Panel 2: Channel Sidebar */}
          <Panel className="border-r border-slate-200 dark:border-slate-800">
            <ChannelList />
          </Panel>

          {/* Panel 3: Main Content (Thread List) */}
          <Panel className="border-r border-slate-200 dark:border-slate-800">
            <div className="flex flex-col h-full">
              <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Threads
                </h2>
              </div>
              <ThreadList />
            </div>
          </Panel>

          {/* Panel 4: Agent Panel (Collapsible) */}
          <Panel className="border-l border-slate-200 dark:border-slate-800">
            <div className="p-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                Agent Panel
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Agent monitoring and controls will be displayed here.
              </p>
            </div>
          </Panel>
        </div>

        {/* Responsive Layout: Mobile/Tablet */}
        <div className="md:hidden flex-1 overflow-hidden">
          <div className="h-full flex flex-col">
            <Panel className="flex-1 overflow-y-auto">
              <div className="p-4">
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
                  Mobile view - Sidebars accessible via drawers
                </p>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </WorkspaceProvider>
  );
};