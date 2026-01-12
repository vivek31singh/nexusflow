import React from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentControlsProps {
  className?: string;
}

interface ControlButton {
  id: string;
  label: string;
  icon: LucideIcon;
  variant: 'primary' | 'secondary' | 'danger';
  onClick: () => void;
}

export const AgentControls: React.FC<AgentControlsProps> = ({ className }) => {
  const handleStartAll = () => {
    console.log('Start all agents');
    // This would dispatch an action to the workspace context in a real implementation
  };

  const handlePauseAll = () => {
    console.log('Pause all agents');
    // This would dispatch an action to the workspace context in a real implementation
  };

  const handleResumeAll = () => {
    console.log('Resume all agents');
    // This would dispatch an action to the workspace context in a real implementation
  };

  const handleStopAll = () => {
    console.log('Stop all agents');
    // This would dispatch an action to the workspace context in a real implementation
  };

  const controls: ControlButton[] = [
    { id: 'start', label: 'Start All', icon: Play, variant: 'primary', onClick: handleStartAll },
    { id: 'pause', label: 'Pause All', icon: Pause, variant: 'secondary', onClick: handlePauseAll },
    { id: 'resume', label: 'Resume', icon: RotateCcw, variant: 'secondary', onClick: handleResumeAll },
    { id: 'stop', label: 'Stop All', icon: Square, variant: 'danger', onClick: handleStopAll },
  ];

  const getButtonStyles = (variant: ControlButton['variant']) => {
    const baseStyles = 'flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200';
    
    switch (variant) {
      case 'primary':
        return cn(
          baseStyles,
          'bg-indigo-600 text-white hover:bg-indigo-700',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
        );
      case 'secondary':
        return cn(
          baseStyles,
          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200',
          'hover:bg-slate-200 dark:hover:bg-slate-700',
          'focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2'
        );
      case 'danger':
        return cn(
          baseStyles,
          'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400',
          'hover:bg-rose-200 dark:hover:bg-rose-900/50',
          'focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2'
        );
    }
  };

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Agent Controls
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <button
              key={control.id}
              onClick={control.onClick}
              className={getButtonStyles(control.variant)}
              aria-label={control.label}
            >
              <Icon className="w-4 h-4" />
              <span>{control.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
