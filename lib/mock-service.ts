import {
  Workspace,
  Channel,
  Thread,
  Activity,
  Agent,
  ThreadStatus,
  ActivityType,
} from '@/types';

// Mock data generators
const generateWorkspaces = (): Workspace[] => [
  { id: 'ws-1', name: 'Marketing Campaign A', avatar: null },
  { id: 'ws-2', name: 'Product Launch Q1', avatar: null },
  { id: 'ws-3', name: 'Brand Awareness', avatar: null },
];

const generateChannels = (workspaceId: string): Channel[] => [
  {
    id: `ch-${workspaceId}-1`,
    workspaceId,
    name: 'general',
    type: 'text',
    unreadCount: 3,
  },
  {
    id: `ch-${workspaceId}-2`,
    workspaceId,
    name: 'social-media',
    type: 'workflow',
    unreadCount: 0,
  },
  {
    id: `ch-${workspaceId}-3`,
    workspaceId,
    name: 'email-campaigns',
    type: 'workflow',
    unreadCount: 12,
  },
];

const generateThreads = (channelId: string): Thread[] => [
  {
    id: `thread-${channelId}-1`,
    channelId,
    title: 'Generate Instagram captions',
    status: 'active',
    startTime: new Date(Date.now() - 3600000),
    agentIds: ['agent-1'],
  },
  {
    id: `thread-${channelId}-2`,
    channelId,
    title: 'Analyze competitor keywords',
    status: 'paused',
    startTime: new Date(Date.now() - 7200000),
    agentIds: ['agent-2', 'agent-3'],
  },
  {
    id: `thread-${channelId}-3`,
    channelId,
    title: 'Compile weekly report',
    status: 'stopped',
    startTime: new Date(Date.now() - 86400000),
    agentIds: ['agent-1'],
  },
];

const generateAgents = (): Agent[] => [
  {
    id: 'agent-1',
    name: 'CopyWriter',
    status: 'running',
    type: 'generator',
    lastActive: new Date(),
  },
  {
    id: 'agent-2',
    name: 'SEO Specialist',
    status: 'idle',
    type: 'analyzer',
    lastActive: new Date(),
  },
  {
    id: 'agent-3',
    name: 'Data Miner',
    status: 'error',
    type: 'fetcher',
    lastActive: new Date(),
  },
];

const generateActivities = (threadId: string): Activity[] => [
  {
    id: `act-${threadId}-1`,
    threadId,
    type: 'log',
    timestamp: new Date(Date.now() - 60000),
    content: 'Starting content generation workflow...',
    metadata: { step: 1, totalSteps: 5 },
  },
  {
    id: `act-${threadId}-2`,
    threadId,
    type: 'success',
    timestamp: new Date(Date.now() - 30000),
    content: 'Successfully fetched trending topics',
    metadata: { count: 24 },
  },
  {
    id: `act-${threadId}-3`,
    threadId,
    type: 'log',
    timestamp: new Date(Date.now() - 15000),
    content: 'Analyzing audience engagement patterns...',
    metadata: { progress: 45 },
  },
  {
    id: `act-${threadId}-4`,
    threadId,
    type: 'metric',
    timestamp: new Date(Date.now() - 5000),
    content: 'Engagement score: 8.7/10',
    metadata: { score: 8.7, previousScore: 7.2 },
  },
];

// Activity generation templates for real-time simulation
const ACTIVITY_TEMPLATES = [
  { type: 'log' as ActivityType, content: 'Processing batch data...' },
  { type: 'log' as ActivityType, content: 'Optimizing content structure...' },
  { type: 'log' as ActivityType, content: 'Validating output formats...' },
  { type: 'success' as ActivityType, content: 'Task completed successfully' },
  { type: 'metric' as ActivityType, content: 'Performance metric updated' },
  { type: 'error' as ActivityType, content: 'Warning: Rate limit approaching' },
];

// Utility functions for simulation
const delay = (min: number, max: number): Promise<void> => {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const simulateError = (): void => {
  if (Math.random() < 0.15) {
    throw new Error('Simulation failure: Network request failed');
  }
};

// Type for unsubscribe function
type UnsubscribeFunction = () => void;

class MockService {
  private subscriptions: Map<string, Set<(activity: Activity) => void>>;
  private intervals: Map<string, NodeJS.Timeout>;
  private agents: Agent[];

  constructor() {
    this.subscriptions = new Map();
    this.intervals = new Map();
    this.agents = generateAgents();
  }

  /**
   * Fetch all workspaces
   * Latency: 1-2s, Error rate: 15%
   */
  async getWorkspaces(): Promise<Workspace[]> {
    await delay(1000, 2000);
    simulateError();
    return generateWorkspaces();
  }

  /**
   * Fetch channels for a specific workspace
   * Latency: 1-3s, Error rate: 15%
   */
  async getChannels(workspaceId: string): Promise<Channel[]> {
    await delay(1000, 3000);
    simulateError();
    return generateChannels(workspaceId);
  }

  /**
   * Fetch threads for a specific channel
   * Latency: 1-3s, Error rate: 15%
   */
  async getThreads(channelId: string): Promise<Thread[]> {
    await delay(1000, 3000);
    simulateError();
    return generateThreads(channelId);
  }

  /**
   * Fetch activities for a specific thread
   * Latency: 1-2s, Error rate: 15%
   */
  async getActivities(threadId: string): Promise<Activity[]> {
    await delay(1000, 2000);
    simulateError();
    return generateActivities(threadId);
  }

  /**
   * Update the status of a thread
   * Latency: 1-2s, Error rate: 15%
   */
  async updateThreadStatus(
    threadId: string,
    status: ThreadStatus
  ): Promise<Thread> {
    await delay(1000, 2000);
    simulateError();

    // Simulate returning an updated thread
    const updatedThread: Thread = {
      id: threadId,
      channelId: 'ch-dummy',
      title: 'Updated Thread',
      status,
      startTime: new Date(),
      agentIds: ['agent-1'],
    };

    return updatedThread;
  }

  /**
   * Subscribe to real-time activity updates for a thread
   * Returns an unsubscribe function
   */
  subscribeToActivity(
    threadId: string,
    callback: (activity: Activity) => void
  ): UnsubscribeFunction {
    // Initialize subscription set for this thread if not exists
    if (!this.subscriptions.has(threadId)) {
      this.subscriptions.set(threadId, new Set());
    }

    // Add callback to subscribers
    const subscribers = this.subscriptions.get(threadId)!;
    subscribers.add(callback);

    // Start generating activities if this is the first subscriber
    if (subscribers.size === 1) {
      this.startActivitySimulation(threadId);
    }

    // Return unsubscribe function
    return () => {
      const currentSubscribers = this.subscriptions.get(threadId);
      if (currentSubscribers) {
        currentSubscribers.delete(callback);

        // Stop simulation if no more subscribers
        if (currentSubscribers.size === 0) {
          this.stopActivitySimulation(threadId);
          this.subscriptions.delete(threadId);
        }
      }
    };
  }

  /**
   * Start generating simulated activities for a thread
   * Activities are generated every 2-5 seconds
   */
  private startActivitySimulation(threadId: string): void {
    const generateActivity = (): void => {
      const template =
        ACTIVITY_TEMPLATES[Math.floor(Math.random() * ACTIVITY_TEMPLATES.length)];

      const activity: Activity = {
        id: `act-${threadId}-${Date.now()}`,
        threadId,
        type: template.type,
        timestamp: new Date(),
        content: template.content,
        metadata: {
          generatedAt: Date.now(),
          threadId,
        },
      };

      // Notify all subscribers
      const subscribers = this.subscriptions.get(threadId);
      if (subscribers) {
        subscribers.forEach((callback) => {
          try {
            callback(activity);
          } catch (error) {
            console.error('Error in activity callback:', error);
          }
        });
      }
    };

    // Generate initial activity immediately
    generateActivity();

    // Set up interval for ongoing activity generation
    const interval = setInterval(() => {
      generateActivity();
    }, 2000 + Math.random() * 3000); // 2-5 seconds

    this.intervals.set(threadId, interval);
  }

  /**
   * Stop generating activities for a thread
   */
  private stopActivitySimulation(threadId: string): void {
    const interval = this.intervals.get(threadId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(threadId);
    }
  }

  /**
   * Get all agents (for Agent Panel)
   * Latency: 1-2s, Error rate: 15%
   */
  async getAgents(): Promise<Agent[]> {
    await delay(1000, 2000);
    simulateError();
    return [...this.agents];
  }

  /**
   * Clean up all subscriptions and intervals
   * Useful for testing or app shutdown
   */
  cleanup(): void {
    this.intervals.forEach((interval) => clearInterval(interval));
    this.intervals.clear();
    this.subscriptions.clear();
  }
}

// Export singleton instance
export const mockService = new MockService();
