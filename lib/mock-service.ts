import {
  type Workspace,
  type Channel,
  type Thread,
  type Activity,
  type UnsubscribeFunction,
  type ThreadStatus,
} from '@/types';

const DEFAULT_LATENCY = { min: 1000, max: 5000 };
const ERROR_RATE = 0.15;

/**
 * MockService - Simulates API endpoints with latency and random errors
 */
class MockService {
  private subscribers: Map<string, Set<(activity: Activity) => void>> = new Map();

  private randomDelay(): Promise<void> {
    const delay = Math.random() * (DEFAULT_LATENCY.max - DEFAULT_LATENCY.min) + DEFAULT_LATENCY.min;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private randomError(): never | undefined {
    if (Math.random() < ERROR_RATE) {
      throw new Error('Simulation failure: Random network error');
    }
    return undefined;
  }

  async getWorkspaces(): Promise<Workspace[]> {
    await this.randomDelay();
    this.randomError();
    return [
      { id: 'ws-1', name: 'Marketing Campaign', icon: 'M' },
      { id: 'ws-2', name: 'Social Media', icon: 'S' },
      { id: 'ws-3', name: 'Email Outreach', icon: 'E' },
    ];
  }

  async getChannels(workspaceId: string): Promise<Channel[]> {
    await this.randomDelay();
    this.randomError();
    return [
      { id: 'ch-1', workspaceId, name: 'Campaign Flow', type: 'workflow', unreadCount: 3 },
      { id: 'ch-2', workspaceId, name: 'General', type: 'text', unreadCount: 0 },
      { id: 'ch-3', workspaceId, name: 'Analytics', type: 'text', unreadCount: 12 },
    ];
  }

  async getThreads(channelId: string): Promise<Thread[]> {
    await this.randomDelay();
    this.randomError();
    return [
      {
        id: 'th-1',
        channelId,
        title: 'Q4 Campaign Launch',
        status: 'active',
        startTime: new Date(Date.now() - 3600000),
        agentIds: ['agent-1', 'agent-2'],
      },
      {
        id: 'th-2',
        channelId,
        title: 'Email Sequence Test',
        status: 'paused',
        startTime: new Date(Date.now() - 7200000),
        agentIds: ['agent-1'],
      },
    ];
  }

  async getActivities(threadId: string): Promise<Activity[]> {
    await this.randomDelay();
    this.randomError();
    return [
      {
        id: 'act-1',
        threadId,
        type: 'log',
        timestamp: new Date(Date.now() - 60000),
        content: 'Initializing workflow...',
      },
      {
        id: 'act-2',
        threadId,
        type: 'success',
        timestamp: new Date(Date.now() - 30000),
        content: 'Campaign assets loaded successfully',
      },
      {
        id: 'act-3',
        threadId,
        type: 'metric',
        timestamp: new Date(),
        content: 'Reach: 1,234 users',
        metadata: { reach: 1234 },
      },
    ];
  }

  async updateThreadStatus(threadId: string, status: ThreadStatus): Promise<Thread> {
    await this.randomDelay();
    this.randomError();
    return {
      id: threadId,
      channelId: 'ch-1',
      title: 'Updated Thread',
      status,
      startTime: new Date(),
      agentIds: ['agent-1'],
    };
  }

  subscribeToActivity(threadId: string, callback: (activity: Activity) => void): UnsubscribeFunction {
    if (!this.subscribers.has(threadId)) {
      this.subscribers.set(threadId, new Set());
    }
    this.subscribers.get(threadId)!.add(callback);

    // Simulate real-time updates
    const interval = setInterval(() => {
      const activity: Activity = {
        id: `act-${Date.now()}`,
        threadId,
        type: Math.random() > 0.8 ? 'error' : 'log',
        timestamp: new Date(),
        content: `Simulated activity at ${new Date().toLocaleTimeString()}`,
      };
      this.subscribers.get(threadId)?.forEach((cb) => cb(activity));
    }, 2000);

    return () => {
      clearInterval(interval);
      this.subscribers.get(threadId)?.delete(callback);
    };
  }
}

export const mockService = new MockService();
