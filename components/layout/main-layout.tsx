import { type ReactNode } from "react";
import { Panel } from "@/components/ui/panel";

export interface MainLayoutProps {
  /**
   * Panel 1: Workspace Sidebar - Left navigation panel for workspace selection
   */
  workspacePanel: ReactNode;
  /**
   * Panel 2: Channel Sidebar - Mid-left panel for channel navigation within workspace
   */
  channelPanel: ReactNode;
  /**
   * Panel 3: Main Content - Center panel containing threads and activity stream
   */
  mainPanel: ReactNode;
  /**
   * Panel 4: Agent Panel - Right panel showing agent status and metrics (collapsible)
   */
  agentPanel: ReactNode;
  /**
   * Whether the Agent Panel is currently visible/expanded
   * @default true
   */
  isAgentPanelOpen?: boolean;
}

/**
 * MainLayout - The core 4-panel grid system establishing the spatial memory architecture.
 * 
 * Layout Structure (Desktop):
 * | Workspace (Panel 1) | Channel (Panel 2) | Main Content (Panel 3) | Agent Panel (Panel 4) |
 * 
 * Responsive Behavior:
 * - Desktop (>=1024px): All 4 panels visible in grid
 * - Tablet (768px-1023px): Agent Panel collapses, 3 panels visible
 * - Mobile (<768px): Single panel visible with drawer navigation (to be implemented)
 * 
 * Uses CSS Grid with explicit column definitions for precise control over panel widths.
 */
export const MainLayout = ({
  workspacePanel,
  channelPanel,
  mainPanel,
  agentPanel,
  isAgentPanelOpen = true,
}: MainLayoutProps) => {
  return (
    <div className="flex h-screen w-full bg-white dark:bg-slate-950">
      {/* 
        Grid System:
        - Desktop (>=1024px): 4 columns with specific widths
          - Workspace: w-64 (16rem)
          - Channel: w-72 (18rem)
          - Main: flex-1 (remaining space)
          - Agent: w-80 (20rem) when open
        - Tablet (768px-1023px): Agent panel hidden, 3 columns
        - Mobile (<768px): Stack layout, single panel visible (drawers for navigation)
      */
      <div className="flex h-full w-full">
        {/* Panel 1: Workspace Sidebar */}
        <aside className="hidden h-full w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 md:flex">
          <Panel bordered={false} className="h-full rounded-none">
            {workspacePanel}
          </Panel>
        </aside>

        {/* Panel 2: Channel Sidebar */}
        <aside className="hidden h-full w-72 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 lg:flex">
          <Panel bordered={false} className="h-full rounded-none">
            {channelPanel}
          </Panel>
        </aside>

        {/* Panel 3: Main Content Area */}
        <main className="flex-1 overflow-hidden">
          <Panel bordered={false} variant="subtle" className="h-full rounded-none p-0">
            {mainPanel}
          </Panel>
        </main>

        {/* Panel 4: Agent Panel (Collapsible) */}
        {isAgentPanelOpen && (
          <aside className="hidden h-full w-80 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 xl:flex">
            <Panel bordered={false} className="h-full rounded-none">
              {agentPanel}
            </Panel>
          </aside>
        )}
      </div>
    </div>
  );
};
