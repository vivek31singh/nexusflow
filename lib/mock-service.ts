import {
  Workspace,
  Channel,
  Thread,
  Activity,
  ThreadStatus,
  Agent,
  ActivityType,
} from '@/types';

// Workspace interface (not explicitly in types but needed)
interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
}

type UnsubscribeFunction = () => void;

// Constants for simulation
const MIN_LATENCY = 1000;
const MAX_LATENCY = 5000;
const ERROR_RATE = 0.15;

// Activity simulation interval (in ms)
const ACTIVITY_INTERVAL_MIN = 2000;
const ACTIVITY_INTERVAL_MAX = 6000;

// Mock data generators
const generateId = (): string => {
  return `${Math.random().toString(36).substring(2, 9)}-${Date.now().toString(36)}`;
};

const generateWorkspaces = (): Workspace[] => [
  {
    id: 'workspace-1',
    name: 'Marketing Campaign Alpha',
    description: 'Q1 2024 Product Launch',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'workspace-2',
    name: 'Content Strategy Team',
    description: 'Blog and Social Media Operations',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'workspace-3',
    name: 'Analytics & Insights',
    description: 'Data-driven Decision Making',
    createdAt: new Date('2024-02-01'),
  },
];

const generateChannels = (workspaceId: string): Channel[] => [
  {
    id: `channel-${workspaceId}-1`,
    workspaceId,
    name: 'general',
    type: 'text',
    unreadCount: Math.floor(Math.random() * 10),
  },
  {
    id: `channel-${workspaceId}-2`,
    workspaceId,
    name: 'workflows',
    type: 'workflow',
    unreadCount: Math.floor(Math.random() * 5),
  },
  {
    id: `channel-${workspaceId}-3`,
    workspaceId,
    name: 'announcements',
    type: 'text',
    unreadCount: 0,
  },
];

const generateAgents = (): Agent[] => [
  {
    id: 'agent-1',
    name: 'Content Writer',
    status: 'idle',
    type: 'generator',
    lastActive: new Date(),
  },
  {
    id: 'agent-2',
    name: 'SEO Optimizer',
    status: 'running',
    type: 'optimizer',
    lastActive: new Date(Date.now() - 300000),
  },
  {
    id: 'agent-3',
    name: 'Data Analyst',
    status: 'paused',
    type: 'analyzer',
    lastActive: new Date(Date.now() - 600000),
  },
];

const generateThreads = (channelId: string): Thread[] => {
  const agents = generateAgents();
  return [
    {
      id: `thread-${channelId}-1`,
      channelId,
      title: 'Email Campaign Draft',
      status: 'active',
      startTime: new Date(Date.now() - 3600000),
      agentIds: [agents[0].id, agents[1].id],
    },
    {
      id: `thread-${channelId}-2`,
      channelId,
      title: 'Blog Post Analysis',
      status: 'paused',
      startTime: new Date(Date.now() - 7200000),
      agentIds: [agents[2].id],
    },
    {
      id: `thread-${channelId}-3`,
      channelId,
      title: 'Social Media Queue',
      status: 'stopped',
      startTime: new Date(Date.now() - 86400000),
      agentIds: [agents[0].id],
    },
  ];
};

const generateActivities = (threadId: string): Activity[] => {
  const types: ActivityType[] = ['log', 'error', 'success', 'metric'];
  const activities: Activity[] = [];
  
  for (let i = 0; i < 5; i++) {
    activities.push({
      id: `activity-${generateId()}`,
      threadId,
      type: types[Math.floor(Math.random() * types.length)],
      timestamp: new Date(Date.now() - (i * 60000)),
      content: `Activity entry ${i + 1} - ${ getRandomLogMessage() }`,
      metadata: i % 2 === 0 ? { iteration: i } : undefined,
    });
  }
  
  return activities;
};

const getRandomLogMessage = (): string => {
  const messages = [
    'Processing batch of items...',
    'Validating input parameters',
    'Generating content draft',
    'Analyzing SEO metrics',
    'Fetching external data',
    'Optimizing performance',
    'Checking compliance rules',
    'Updating database records',
    'Rendering preview',
    'Sending notifications',
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

class MockService {
  private subscriptions: Map<string, NodeJS.Timeout> = new Map();

  /**
   * Simulates network latency between MIN_LATENCY and MAX_LATENCY ms
   */
  private async delay(): Promise<void> {
    const latency =
      Math.random() * (MAX_LATENCY - MIN_LATENCY) + MIN_LATENCY;
    await new Promise((resolve) => setTimeout(resolve, latency));
  }

  /**
   * Simulates random errors with ERROR_RATE probability
   */
  private maybeThrowError(): void {
    if (Math.random() < ERROR_RATE) {
      throw new Error('Simulation failure: Random network error occurred');
    }
  }

  /**
   * Fetches all workspaces
   */
  async getWorkspaces(): Promise<Workspace[]> {
    await this.delay();
    this.maybeThrowError();
    return generateWorkspaces();
  }

  /**
   * Fetches channels for a specific workspace
   */
  async getChannels(workspaceId: string): Promise<Channel[]> {
    await this.delay();
    this.maybeThrowError();
    return generateChannels(workspaceId);
  }

  /**
   * Fetches threads for a specific channel
   */
  async getThreads(channelId: string): Promise<Thread[]> {
    await this.delay();
    this.maybeThrowError();
    return generateThreads(channelId);
  }

  /**
   * Fetches activities for a specific thread
   */
  async getActivities(threadId: string): Promise<Activity[]> {
    await this.delay();
    this.maybeThrowError();
    return generateActivities(threadId);
  }

  /**
   * Updates the status of a thread
   */
  async updateThreadStatus(
    threadId: string,
    status: ThreadStatus
  ): Promise<Thread> {
    await this.delay();
    this.maybeThrowError();

    // Return a mock thread with updated status
    return {
      id: threadId,
      channelId: 'mock-channel-id',
      title: 'Updated Thread',
      status,
      startTime: new Date(),
      agentIds: ['agent-1'],
    };
  }

  /**
   * Subscribes to real-time activity updates for a thread
   * Returns an unsubscribe function
   */
  subscribeToActivity(
    threadId: string,
    callback: (activity: Activity) => void
  ): UnsubscribeFunction {
    const types: ActivityType[] = ['log', 'error', 'success', 'metric'];

    const scheduleNextActivity = () => {
      const interval =
        Math.random() * (ACTIVITY_INTERVAL_MAX - ACTIVITY_INTERVAL_MIN) +
        ACTIVITY_INTERVAL_MIN;

      const timeoutId = setTimeout(() => {
        const activity: Activity = {
          id: `activity-${generateId()}`,
          threadId,
          type: types[Math.floor(Math.random() * types.length)],
          timestamp: new Date(),
          content: getRandomLogMessage(),
          metadata: {
            simulated: true,
            iteration: Math.floor(Math.random() * 100),
          },
        };

        callback(activity);
        scheduleNextActivity(); // Schedule next activity
      }, interval);

      this.subscriptions.set(`${threadId}-${Date.now()}`, timeoutId);
    };

    scheduleNextActivity();

    // Return unsubscribe function
    return () => {
      this.subscriptions.forEach((timeoutId, key) => {
        if (key.startsWith(threadId)) {
          clearTimeout(timeoutId);
          this.subscriptions.delete(key);
        }
      });
    };
  }

  /**
   * Cleans up all active subscriptions
   */
  cleanup(): void {
    this.subscriptions.forEach((timeoutId) => clearTimeout(timeoutId));
    this.subscriptions.clear();
  }
}

// Export singleton instance
export const mockService = new MockService();

// Export class for testing
export default MockService;
