// Domain Models for nexusflow - Agentic Marketing OS

// Type aliases for union types used across interfaces
export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';
export type ChannelType = 'text' | 'workflow';
export type ThreadStatus = 'active' | 'paused' | 'stopped';
export type ActivityType = 'log' | 'error' | 'success' | 'metric';
export type Theme = 'dark' | 'light';

// Agent represents an AI agent with its current state
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: string;
  lastActive: Date;
}

// Channel represents a communication channel within a workspace
export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  type: ChannelType;
  unreadCount: number;
}

// Thread represents a workflow thread containing activities
export interface Thread {
  id: string;
  channelId: string;
  title: string;
  status: ThreadStatus;
  startTime: Date;
  agentIds: string[];
}

// Activity represents a single event or log entry in a thread
export interface Activity {
  id: string;
  threadId: string;
  type: ActivityType;
  timestamp: Date;
  content: string;
  metadata?: Record<string, any>;
}

// Workspace represents a high-level workspace container
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

// WorkspaceState represents the global application state
export interface WorkspaceState {
  activeWorkspaceId: string;
  activeChannelId: string;
  activeThreadId: string | null;
  theme: Theme;
  isAgentPanelOpen: boolean;
}

// Type for unsubscribe function returned by subscriptions
export type UnsubscribeFunction = () => void;
