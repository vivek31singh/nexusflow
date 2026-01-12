'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Terminal, Palette, Moon, Sun, Layout } from 'lucide-react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { useKeyboard } from '@/hooks/use-keyboard';

interface Command {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette = () => {
  const { isOpen, closePalette, toggleTheme, theme } = useWorkspaceContext();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'toggle-theme',
      label: 'Toggle Theme',
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => {
        toggleTheme();
        closePalette();
      },
      shortcut: 'Ctrl+Shift+T',
    },
    {
      id: 'navigate-workspace',
      label: 'Navigate to Workspace...',
      icon: <Layout className="w-4 h-4" />,
      action: () => {
        closePalette();
      },
      shortcut: 'Ctrl+1',
    },
    {
      id: 'view-logs',
      label: 'View Agent Logs',
      icon: <Terminal className="w-4 h-4" />,
      action: () => {
        closePalette();
      },
      shortcut: 'Ctrl+L',
    },
  ];

  // Open on Ctrl+K
  useKeyboard({ key: 'k', ctrlKey: true, callback: () => setQuery('') });

  // Close on Escape
  useKeyboard({ key: 'Escape', callback: closePalette });

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  // Handle keyboard navigation
  useKeyboard({
    key: 'ArrowDown',
    callback: () => {
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    },
  });

  useKeyboard({
    key: 'ArrowUp',
    callback: () => {
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    },
  });

  useKeyboard({
    key: 'Enter',
    callback: () => {
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
      }
    },
  });

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={closePalette}
      />

      {/* Palette */}
      <div className="relative w-full max-w-xl bg-slate-900 dark:bg-slate-900 border border-slate-700 dark:border-slate-700 rounded-lg shadow-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-700 dark:border-slate-700">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-slate-100 placeholder-slate-500"
          />
          <kbd className="px-2 py-1 text-xs text-slate-500 bg-slate-800 rounded">ESC</kbd>
        </div>

        {/* Command List */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-slate-500">
              No commands found
            </div>
          ) : (
            filteredCommands.map((command, index) => (
              <button
                key={command.id}
                onClick={command.action}
                className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                  index === selectedIndex
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span className="text-slate-400">{command.icon}</span>
                <span className="flex-1 text-left">{command.label}</span>
                {command.shortcut && (
                  <kbd className="px-2 py-1 text-xs text-slate-500 bg-slate-800 rounded">
                    {command.shortcut}
                  </kbd>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-slate-700 dark:border-slate-700 flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↑↓</kbd> Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">↵</kbd> Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-slate-800 rounded">ESC</kbd> Close
          </span>
        </div>
      </div>
    </div>
  );
};
