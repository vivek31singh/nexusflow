import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import { CommandPalette } from '@/components/overlays/command-palette';
import { useKeyboard } from '@/hooks/use-keyboard';
import { useWorkspaceContext } from '@/contexts/workspace-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'nexusflow - Agentic Marketing OS',
  description: 'Production-grade agentic marketing operating system',
};

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { dispatch } = useWorkspaceContext();

  // Global keyboard shortcut to open command palette (Ctrl+K or Cmd+K)
  useKeyboard({
    key: 'k',
    ctrlKey: true,
    onKeyDown: () => dispatch({ type: 'TOGGLE_COMMAND_PALETTE' }),
  });

  return (
    <>
      {children}
      <CommandPalette />
    </>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <WorkspaceProvider>
          <LayoutContent>{children}</LayoutContent>
        </WorkspaceProvider>
      </body>
    </html>
  );
}