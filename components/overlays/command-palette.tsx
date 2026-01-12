'use client';

import { useEffect, useRef, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useKeyboard } from '@/hooks/use-keyboard';
import { Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  action: () => void;
}

const MOCK_COMMANDS: Command[] = [
  {
    id: 'navigate-workspace',
    label: 'Navigate to Workspace...',
    shortcut: 'G W',
    action: () => console.log('Navigate to Workspace'),
  },
  {
    id: 'toggle-theme',
    label: 'Toggle Theme',
    shortcut: 'T',
    action: () => console.log('Toggle Theme'),
  },
  {
    id: 'new-thread',
    label: 'New Thread',
    shortcut: 'N',
    action: () => console.log('New Thread'),
  },
  {
    id: 'agent-panel',
    label: 'Toggle Agent Panel',
    shortcut: 'D',
    action: () => console.log('Toggle Agent Panel'),
  },
  {
    id: 'settings',
    label: 'Open Settings',
    shortcut: '⌘ ,',
    action: () => console.log('Open Settings'),
  },
];

export function CommandPalette() {
  const { isCommandPaletteOpen, dispatch } = useWorkspaceContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter commands based on search
  const filteredCommands = MOCK_COMMANDS.filter((cmd) =>
    cmd.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Reset selected index when filtered commands change
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Focus input when palette opens
  useEffect(() => {
    if (isCommandPaletteOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isCommandPaletteOpen]);

  // Keyboard navigation within the palette
  useEffect(() => {
    if (!isCommandPaletteOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex((prev) =>
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Enter':
          event.preventDefault();
          const selectedCommand = filteredCommands[selectedIndex];
          if (selectedCommand) {
            selectedCommand.action();
            dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
            setSearchQuery('');
          }
          break;
        case 'Escape':
          event.preventDefault();
          dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
          setSearchQuery('');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, filteredCommands, selectedIndex, dispatch]);

  if (!isCommandPaletteOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' })}
      />

      {/* Palette Container */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-white placeholder-slate-400 outline-none text-sm"
          />
          <kbd className="px-2 py-1 text-xs text-slate-400 bg-slate-800 rounded border border-slate-700">
            ESC
          </kbd>
        </div>

        {/* Command List */}
        {filteredCommands.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={() => {
                  command.action();
                  dispatch({ type: 'TOGGLE_COMMAND_PALETTE' });
                  setSearchQuery('');
                }}
                onMouseEnter={() => setSelectedIndex(index)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-3 text-left transition-colors',
                  index === selectedIndex
                    ? 'bg-indigo-600 text-white'
                    : 'bg-transparent text-slate-200 hover:bg-slate-800'
                )}
              >
                <span className="text-sm">{command.label}</span>
                {command.shortcut && (
                  <kbd className="px-2 py-1 text-xs bg-slate-800 rounded border border-slate-700">
                    {command.shortcut}
                  </kbd>
                )}
              </button>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 text-sm">
            No commands found
          </div>
        )}

        {/* Footer with keyboard hints */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-slate-700 bg-slate-800/50">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">↑↓</kbd>
              to navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-slate-700 rounded text-slate-300">↵</kbd>
              to select
            </span>
          </div>
          <span className="text-xs text-slate-400">
            <Command className="w-3 h-3 inline mr-1" />
            K to open
          </span>
        </div>
      </div>
    </div>
  );
}