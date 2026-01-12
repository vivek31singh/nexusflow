import {
  Workspace,
  Channel,
  Thread,
  Activity,
  Agent,
  UnsubscribeFunction,
} from '@/types'
import { generateId } from './utils'

const DEFAULT_LATENCY = { min: 1000, max: 5000 }
const ERROR_PROBABILITY = 0.15

// Mock Data
const mockWorkspaces: Workspace[] = [
  { id: 'ws-1', name: 'Marketing Campaign Q1', description: 'Q1 Marketing Initiatives' },
  { id: 'ws-2', name: 'Product Launch', description: 'New Product Release' },
  { id: 'ws-3', name: 'Social Media', description: 'Social Content Management' },
]

const mockChannels: Record<string, Channel[]> = {
  'ws-1': [
    { id: 'ch-1', workspaceId: 'ws-1', name: 'Campaign Strategy', type: 'workflow', unreadCount: 0 },
    { id: 'ch-2', workspaceId: 'ws-1', name: 'Content Review', type: 'text', unreadCount: 3 },
  ],
  'ws-2': [
    { id: 'ch-3', workspaceId: 'ws-2', name: 'Launch Timeline', type: 'workflow', unreadCount: 0 },
    { id: 'ch-4', workspaceId: 'ws-2', name: 'Beta Feedback', type: 'text', unreadCount: 7 },
  ],
  'ws-3': [
    { id: 'ch-5', workspaceId: 'ws-3', name: 'Twitter Queue', type: 'workflow', unreadCount: 0 },
  ],
}

const mockAgents: Agent[] = [
  { id: 'ag-1', name: 'CopyWriter', status: 'idle', type: 'Content', lastActive: new Date() },
  { id: 'ag-2', name: 'SEO Specialist', status: 'idle', type: 'Optimization', lastActive: new Date() },
  { id: 'ag-3', name: 'Analyst', status: 'idle', type: 'Data', lastActive: new Date() },
]

const mockThreads: Record<string, Thread[]> = {}

// In-memory activity storage for simulation
const activityStore: Map<string, Activity[]> = new Map()
const subscribers: Map<string, Set<(activity: Activity) => void>> = new Map()

function randomDelay(min: number, max: number): Promise<void> {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min
  return new Promise(resolve => setTimeout(resolve, delay))

function shouldFail(): boolean {
  return Math.random() < ERROR_PROBABILITY
}

export class MockService {
  private static instance: MockService

  private constructor() {
    // Initialize some mock threads
    this.initializeMockThreads()
  }

  static getInstance(): MockService {
    if (!MockService.instance) {
      MockService.instance = new MockService()
    }
    return MockService.instance
  }

  private initializeMockThreads() {
    Object.values(mockChannels).flat().forEach(channel => {
      mockThreads[channel.id] = [
        {
          id: generateId(),
          channelId: channel.id,
          title: `Thread in ${channel.name}`,
          status: 'stopped',
          startTime: new Date(),
          agentIds: [mockAgents[0].id],
        },
      ]
    })
  }

  async getWorkspaces(): Promise<Workspace[]> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to fetch workspaces')
    return [...mockWorkspaces]
  }

  async getChannels(workspaceId: string): Promise<Channel[]> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to fetch channels')
    return mockChannels[workspaceId] || []
  }

  async getThreads(channelId: string): Promise<Thread[]> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to fetch threads')
    return mockThreads[channelId] || []
  }

  async getActivities(threadId: string): Promise<Activity[]> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to fetch activities')
    return activityStore.get(threadId) || []
  }

  async updateThreadStatus(threadId: string, status: 'active' | 'paused' | 'stopped'): Promise<Thread> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to update thread status')

    const thread = Object.values(mockThreads).flat().find(t => t.id === threadId)
    if (thread) {
      thread.status = status
      
      if (status === 'active') {
        this.simulateActivity(threadId)
      }
    }
    return thread!
  }

  async getAgents(): Promise<Agent[]> {
    await randomDelay(DEFAULT_LATENCY.min, DEFAULT_LATENCY.max)
    if (shouldFail()) throw new Error('Failed to fetch agents')
    return [...mockAgents]
  }

  subscribeToActivity(threadId: string, callback: (activity: Activity) => void): UnsubscribeFunction {
    if (!subscribers.has(threadId)) {
      subscribers.set(threadId, new Set())
    }
    subscribers.get(threadId)!.add(callback)

    return () => {
      subscribers.get(threadId)?.delete(callback)
    }
  }

  private async simulateActivity(threadId: string) {
    const activities = [
      { type: 'log' as const, content: 'Processing request...' },
      { type: 'log' as const, content: 'Analyzing data patterns...' },
      { type: 'metric' as const, content: 'Efficiency: 94%', metadata: { efficiency: 94 } },
      { type: 'success' as const, content: 'Task completed successfully' },
      { type: 'error' as const, content: 'Connection timeout - retrying...' },
    ]

    let iterations = 0
    const maxIterations = 10

    const simulate = async () => {
      if (iterations >= maxIterations) return

      const thread = Object.values(mockThreads).flat().find(t => t.id === threadId)
      if (!thread || thread.status !== 'active') return

      await randomDelay(2000, 4000)

      const activityTemplate = activities[Math.floor(Math.random() * activities.length)]
      const activity: Activity = {
        id: generateId(),
        threadId,
        ...activityTemplate,
        timestamp: new Date(),
      }

      if (!activityStore.has(threadId)) {
        activityStore.set(threadId, [])
      }
      activityStore.get(threadId)!.push(activity)

      // Notify subscribers
      subscribers.get(threadId)?.forEach(callback => callback(activity))

      // Update agent status
      const agentId = thread.agentIds[0]
      const agent = mockAgents.find(a => a.id === agentId)
      if (agent) {
        agent.status = activity.type === 'error' ? 'error' : 'running'
        agent.lastActive = new Date()
      }

      iterations++
      simulate()
    }

    simulate()
  }
}

export const mockService = MockService.getInstance()