import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { ToastProvider } from "@/contexts/toast-context";
import { CommandPalette } from "@/components/overlays/command-palette";
import { Toast } from "@/components/overlays/toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "nexusflow - Agentic Marketing OS",
  description: "A calm & dense agentic marketing OS built with Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WorkspaceProvider>
          <ToastProvider>
            {children}
            <CommandPalette />
            <Toast />
          </ToastProvider>
        </WorkspaceProvider>
      </body>
    </html>
  );
}
