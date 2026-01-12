'use client';

import React from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { Panel } from '@/components/ui/panel';
import { AgentStats } from './agent-stats';
import { AgentControls } from './agent-controls';
import { Activity, Clock, PauseCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Agent } from '@/types';

interface AgentPanelProps {
  className?: string;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({ className }) => {
  const { isAgentPanelOpen, activeThreadId } = useWorkspaceContext();

  // Simulated agent data - in a real implementation, this would come from MockService
  const agents: Agent[] = React.useMemo(
    () => [
      {
        id: 'agent-1',
        name: 'Content Generator',
        status: 'running',
        type: 'Generator',
        lastActive: new Date(),
      },
      {
        id: 'agent-2',
        name: 'SEO Optimizer',
        status: 'running',
        type: 'Optimizer',
        lastActive: new Date(Date.now() - 60000),
      },
      {
        id: 'agent-3',
        name: 'Data Scraper',
        status: 'running',
        type: 'Scraper',
        lastActive: new Date(Date.now() - 120000),
      },
      {
        id: 'agent-4',
        name: 'Email Campaigner',
        status: 'idle',
        type: 'Campaigner',
        lastActive: new Date(Date.now() - 300000),
      },
      {
        id: 'agent-5',
        name: 'Social Poster',
        status: 'paused',
        type: 'Poster',
        lastActive: new Date(Date.now() - 600000),
      },
      {
        id: 'agent-6',
        name: 'Analytics Engine',
        status: 'idle',
        type: 'Analyzer',
        lastActive: new Date(Date.now() - 900000),
      },
      {
        id: 'agent-7',
        name: 'A/B Tester',
        status: 'idle',
        type: 'Tester',
        lastActive: new Date(Date.now() - 1200000),
      },
      {
        id: 'agent-8',
        name: 'Lead Qualifier',
        status: 'idle',
        type: 'Qualifier',
        lastActive: new Date(Date.now() - 1800000),
      },
      {
        id: 'agent-9',
        name: 'Report Generator',
        status: 'idle',
        type: 'Generator',
        lastActive: new Date(Date.now() - 3600000),
      },
    ],
    []
  );

  const getStatusIcon = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return Activity;
      case 'idle':
        return Clock;
      case 'paused':
        return PauseCircle;
      case 'error':
        return AlertCircle;
    }
  };

  const getStatusColor = (status: Agent['status']) => {
    switch (status) {
      case 'running':
        return 'text-emerald-400 bg-emerald-400/10';
      case 'idle':
        return 'text-slate-400 bg-slate-400/10';
      case 'paused':
        return 'text-amber-400 bg-amber-400/10';
      case 'error':
        return 'text-rose-400 bg-rose-400/10';
    }
  };

  const formatLastActive = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    return `${Math.floor(seconds / 3600)}h ago`;
  };

  if (!isAgentPanelOpen) {
    return null;
  }

  return (
    <Panel className={cn('flex flex-col h-full overflow-hidden', className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
          Agent Panel
        </h2>
        {activeThreadId && (
          <p className="text-xs text-slate-500 mt-0.5">
            Monitoring Thread: {activeThreadId.slice(0, 8)}...
          </p>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Stats Section */}
          <AgentStats />

          {/* Controls Section */}
          <AgentControls />

          {/* Active Agents List */}
          <section>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Active Agents
            </h3>
            <div className="space-y-1">
              {agents.map((agent) => {
                const StatusIcon = getStatusIcon(agent.status);
                const statusClasses = getStatusColor(agent.status);
                return (
                  <div
                    key={agent.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer group"
                  >
                    <div className={cn('p-1.5 rounded', statusClasses)}>
                      <StatusIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        {agent.name}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{agent.type}</p>
                    </div>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                      {formatLastActive(agent.lastActive)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </Panel>
  );
};
