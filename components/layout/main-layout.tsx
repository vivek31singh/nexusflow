'use client';

import { WorkspaceList } from '@/components/workspace/workspace-list';
import { ChannelList } from '@/components/channel/channel-list';
import { Panel } from '@/components/ui/panel';
import { WorkspaceProvider } from '@/contexts/workspace-context';

export const MainLayout = () => {
  return (
    <WorkspaceProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
        <div className="flex-1 grid grid-cols-[260px_260px_1fr_320px] overflow-hidden">
          {/* Panel 1: Workspace Sidebar */}
          <Panel className="border-r border-slate-200 dark:border-slate-800">
            <WorkspaceList />
          </Panel>

          {/* Panel 2: Channel Sidebar */}
          <Panel className="border-r border-slate-200 dark:border-slate-800">
            <ChannelList />
          </Panel>

          {/* Panel 3: Main Content Area */}
          <Panel className="border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="text-sm">Main Content - Thread List & Activity Stream</span>
            </div>
          </Panel>

          {/* Panel 4: Agent Panel (Collapsible) */}
          <Panel className="bg-slate-50 dark:bg-slate-950">
            <div className="flex items-center justify-center h-full text-slate-400">
              <span className="text-sm">Agent Panel</span>
            </div>
          </Panel>
        </div>

        {/* Mobile/Tablet Responsive Behavior - handled via CSS classes above */}
        {/* Tablets (<1024px): Hidden panels accessible via drawers */}
        {/* Mobile (<768px): All sidebars hidden, main content full width */}
      </div>
    </WorkspaceProvider>
  );
};
