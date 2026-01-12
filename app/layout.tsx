import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { WorkspaceProvider } from '@/contexts/workspace-context';
import { MainLayout } from '@/components/layout/main-layout';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'nexusflow - Agentic Marketing OS',
  description: 'A calm and dense agentic marketing operating system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <WorkspaceProvider>
          <MainLayout>
            {children}
          </MainLayout>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
