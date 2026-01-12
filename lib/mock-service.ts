import { Workspace, Channel, Thread, Activity } from '@/types';

// Types
type UnsubscribeFunction = () => void;

// Constants
const DEFAULT_LATENCY_MIN = 1000;
const DEFAULT_LATENCY_MAX = 5000;
const ERROR_RATE = 0.15;

// Mock Data
const MOCK_WORKSPACES: Workspace[] = [
  { id: 'ws-1', name: 'Marketing Campaign', createdAt: new Date('2024-01-15') },
  { id: 'ws-2', name: 'Product Launch', createdAt: new Date('2024-02-01') },
  { id: 'ws-3', name: 'Customer Research', createdAt: new Date('2024-02-15') },
];

const MOCK_CHANNELS: Channel[] = [
  { id: 'ch-1', workspaceId: 'ws-1', name: 'Social Media', type: 'workflow', unreadCount: 3 },
  { id: 'ch-2', workspaceId: 'ws-1', name: 'Email Campaign', type: 'text', unreadCount: 0 },
  { id: 'ch-3', workspaceId: 'ws-2', name: 'Launch Prep', type: 'workflow', unreadCount: 7 },
  { id: 'ch-4', workspaceId: 'ws-3', name: 'User Interviews', type: 'text', unreadCount: 1 },
];

const MOCK_THREADS: Thread[] = [
  {
    id: 'th-1',
    channelId: 'ch-1',
    title: 'Q1 Social Media Blitz',
    status: 'active',
    startTime: new Date('2024-03-01T10:00:00'),
    agentIds: ['ag-1', 'ag-2'],
  },
  {
    id: 'th-2',
    channelId: 'ch-1',
    title: 'Instagram Stories Campaign',
    status: 'paused',
    startTime: new Date('2024-03-02T14:30:00'),
    agentIds: ['ag-3'],
  },
  {
    id: 'th-3',
    channelId: 'ch-3',
    title: 'Launch Day Execution',
    status: 'stopped',
    startTime: new Date('2024-03-05T09:00:00'),
    agentIds: ['ag-1', 'ag-2', 'ag-3'],
  },
];

const MOCK_ACTIVITIES: Record<string, Activity[]> = {
  'th-1': [
    {
      id: 'ac-1',
      threadId: 'th-1',
      type: 'log',
      timestamp: new Date('2024-03-01T10:00:01'),
      content: 'Initializing campaign workflow...',
    },
    {
      id: 'ac-2',
      threadId: 'th-1',
      type: 'success',
      timestamp: new Date('2024-03-01T10:00:02'),
      content: 'Connected to Twitter API',
    },
    {
      id: 'ac-3',
      threadId: 'th-1',
      type: 'metric',
      timestamp: new Date('2024-03-01T10:01:00'),
      content: 'Reach: 1,234 impressions',
      metadata: { value: 1234, unit: 'impressions' },
    },
  ],
};

// Mock Service Class
export class MockService {
  private activeSubscriptions: Map<string, Set<(activity: Activity) => void>> = new Map();

  private getRandomLatency(): number {
    return Math.floor(Math.random() * (DEFAULT_LATENCY_MAX - DEFAULT_LATENCY_MIN + 1)) + DEFAULT_LATENCY_MIN;
  }

  private shouldSimulateError(): boolean {
    return Math.random() < ERROR_RATE;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    await this.delay(this.getRandomLatency());
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch workspaces');
    }
    return MOCK_WORKSPACES;
  }

  async getChannels(workspaceId: string): Promise<Channel[]> {
    await this.delay(this.getRandomLatency());
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch channels');
    }
    return MOCK_CHANNELS.filter((ch) => ch.workspaceId === workspaceId);
  }

  async getThreads(channelId: string): Promise<Thread[]> {
    await this.delay(this.getRandomLatency());
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch threads');
    }
    return MOCK_THREADS.filter((th) => th.channelId === channelId);
  }

  async getActivities(threadId: string): Promise<Activity[]> {
    await this.delay(this.getRandomLatency());
    if (this.shouldSimulateError()) {
      throw new Error('Failed to fetch activities');
    }
    return MOCK_ACTIVITIES[threadId] || [];
  }

  async updateThreadStatus(threadId: string, status: 'active' | 'paused' | 'stopped'): Promise<Thread> {
    await this.delay(this.getRandomLatency());
    if (this.shouldSimulateError()) {
      throw new Error('Failed to update thread status');
    }
    const thread = MOCK_THREADS.find((th) => th.id === threadId);
    if (!thread) {
      throw new Error('Thread not found');
    }
    thread.status = status;
    return thread;
  }

  subscribeToActivity(threadId: string, callback: (activity: Activity) => void): UnsubscribeFunction {
    if (!this.activeSubscriptions.has(threadId)) {
      this.activeSubscriptions.set(threadId, new Set());
      this.startSimulation(threadId);
    }
    this.activeSubscriptions.get(threadId)!.add(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.activeSubscriptions.get(threadId);
      if (callbacks) {
        callbacks.delete(callback);
        if (callbacks.size === 0) {
          this.activeSubscriptions.delete(threadId);
        }
      }
    };
  }

  private startSimulation(threadId: string): void {
    const generateActivity = () => {
      const callbacks = this.activeSubscriptions.get(threadId);
      if (!callbacks || callbacks.size === 0) return;

      const activityTypes: Array<'log' | 'error' | 'success' | 'metric'> = ['log', 'log', 'log', 'success', 'metric'];
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      
      const activities: string[] = [
        'Processing workflow step...',
        'Analyzing user data...',
        'Generating content...',
        'Optimizing campaign settings...',
        'Syncing with external APIs...',
      ];
      
      const metrics: string[] = [
        'Engagement: +12%',
        'Conversions: 45',
        'Click-through rate: 3.2%',
        'Bounce rate: 42%',
      ];

      const newActivity: Activity = {
        id: `ac-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        threadId,
        type,
        timestamp: new Date(),
        content: type === 'metric' ? metrics[Math.floor(Math.random() * metrics.length)] : activities[Math.floor(Math.random() * activities.length)],
        metadata: type === 'metric' ? { generated: true } : undefined,
      };

      callbacks.forEach((cb) => cb(newActivity));
    };

    // Generate activities periodically
    const interval = setInterval(() => {
      if (this.activeSubscriptions.has(threadId)) {
        generateActivity();
      } else {
        clearInterval(interval);
      }
    }, 2000 + Math.random() * 3000);
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const mockService = new MockService();
