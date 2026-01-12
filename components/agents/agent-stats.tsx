import React from 'react';
import { LucideIcon, Activity, Cpu, Clock, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusCount {
  status: 'idle' | 'running' | 'paused' | 'error';
  count: number;
}

interface AgentStatsProps {
  className?: string;
}

export const AgentStats: React.FC<AgentStatsProps> = ({ className }) => {
  // Simulated stats data
  const statusCounts: AgentStatusCount[] = [
    { status: 'running', count: 3 },
    { status: 'idle', count: 5 },
    { status: 'paused', count: 1 },
    { status: 'error', count: 0 },
  ];

  const metrics = [
    { label: 'Success Rate', value: '98.5%', icon: Zap, color: 'text-emerald-400' },
    { label: 'Avg Response', value: '245ms', icon: Clock, color: 'text-indigo-400' },
    { label: 'Tasks/min', value: '12.3', icon: Activity, color: 'text-amber-400' },
    { label: 'CPU Usage', value: '34%', icon: Cpu, color: 'text-slate-400' },
  ];

  const getStatusConfig = (status: AgentStatusCount['status']) => {
    switch (status) {
      case 'running':
        return { icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-400/10' };
      case 'idle':
        return { icon: Clock, color: 'text-slate-400', bg: 'bg-slate-400/10' };
      case 'paused':
        return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10' };
      case 'error':
        return { icon: Activity, color: 'text-rose-400', bg: 'bg-rose-400/10' };
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Status Counts */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Agent Status
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {statusCounts.map((item) => {
            const config = getStatusConfig(item.status);
            const StatusIcon = config.icon;
            return (
              <div
                key={item.status}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md',
                  'bg-slate-50 dark:bg-slate-900/50',
                  'border border-slate-200 dark:border-slate-800'
                )}
              >
                <div className={cn('p-1 rounded', config.bg)}>
                  <StatusIcon className={cn('w-3.5 h-3.5', config.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {item.count}
                  </p>
                  <p className="text-xs text-slate-500 capitalize">{item.status}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Health Metrics */}
      <section>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
          System Metrics
        </h3>
        <div className="space-y-2">
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="flex items-center justify-between px-3 py-2 rounded-md bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800"
              >
                <div className="flex items-center gap-2">
                  <Icon className={cn('w-4 h-4', metric.color)} />
                  <span className="text-sm text-slate-600 dark:text-slate-300">
                    {metric.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {metric.value}
                </span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
