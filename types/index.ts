// Domain Models for nexusflow

export type AgentStatus = 'idle' | 'running' | 'paused' | 'error';
export type ChannelType = 'text' | 'workflow';
export type ThreadStatus = 'active' | 'paused' | 'stopped';
export type ActivityType = 'log' | 'error' | 'success' | 'metric';
export type ThemeMode = 'dark' | 'light';

export interface Agent {
  id: string;
  name: string;
  status: AgentStatus;
  type: string;
  lastActive: Date;
}

export interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  type: ChannelType;
  unreadCount: number;
}

export interface Thread {
  id: string;
  channelId: string;
  title: string;
  status: ThreadStatus;
  startTime: Date;
  agentIds: string[];
}

export interface Activity {
  id: string;
  threadId: string;
  type: ActivityType;
  timestamp: Date;
  content: string;
  metadata?: Record<string, unknown>;
}

export interface Workspace {
  id: string;
  name: string;
  icon?: string;
}

export interface WorkspaceState {
  activeWorkspaceId: string;
  activeChannelId: string;
  activeThreadId: string | null;
  theme: ThemeMode;
  isAgentPanelOpen: boolean;
}

export type WorkspaceAction =
  | { type: 'SET_ACTIVE_WORKSPACE'; payload: string }
  | { type: 'SET_ACTIVE_CHANNEL'; payload: string }
  | { type: 'SET_ACTIVE_THREAD'; payload: string | null }
  | { type: 'TOGGLE_THEME' }
  | { type: 'TOGGLE_AGENT_PANEL' };

export type UnsubscribeFunction = () => void;
