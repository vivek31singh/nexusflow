// Domain Models and Type Interfaces for Nexusflow

/**
 * Represents the current status of an Agent.
 */
export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';

/**
 * Represents the type of a Channel.
 */
export type ChannelType = 'text' | 'workflow';

/**
 * Represents the status of a Thread.
 */
export type ThreadStatus = 'active' | 'paused' | 'stopped';

/**
 * Represents the type of an Activity entry.
 */
export type ActivityType = 'log' | 'error' | 'success' | 'metric';

/**
 * Represents the application theme.
 */
export type Theme = 'dark' | 'light';

/**
 * Agent interface representing an AI agent in the system.
 */
export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: string;
  lastActive: Date;
}

/**
 * Channel interface representing a communication channel within a workspace.
 */
export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  type: ChannelType;
  unreadCount: number;
}

/**
 * Thread interface representing a workflow or task thread.
 */
export interface Thread {
  id: string;
  channelId: string;
  title: string;
  status: ThreadStatus;
  startTime: Date;
  agentIds: string[];
}

/**
 * Activity interface representing a log entry or event in the activity stream.
 */
export interface Activity {
  id: string;
  threadId: string;
  type: ActivityType;
  timestamp: Date;
  content: string;
  metadata?: Record<string, any>;
}

/**
 * WorkspaceState interface representing the global application state.
 */
export interface WorkspaceState {
  activeWorkspaceId: string;
  activeChannelId: string;
  activeThreadId: string | null;
  theme: Theme;
  isAgentPanelOpen: boolean;
}

/**
 * Workspace interface (for future use).
 */
export interface Workspace {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}
