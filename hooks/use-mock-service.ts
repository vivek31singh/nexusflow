import { useState, useEffect, useCallback } from 'react'
import { mockService } from '@/lib/mock-service'
import { Workspace, Channel, Thread, Activity, Agent } from '@/types'

export function useMockService() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkspaces = useCallback(async (): Promise<Workspace[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.getWorkspaces()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchChannels = useCallback(async (workspaceId: string): Promise<Channel[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.getChannels(workspaceId)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchThreads = useCallback(async (channelId: string): Promise<Thread[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.getThreads(channelId)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchActivities = useCallback(async (threadId: string): Promise<Activity[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.getActivities(threadId)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateThreadStatus = useCallback(async (
    threadId: string,
    status: 'active' | 'paused' | 'stopped'
  ): Promise<Thread> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.updateThreadStatus(threadId, status)
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchAgents = useCallback(async (): Promise<Agent[]> => {
    setLoading(true)
    setError(null)
    try {
      const result = await mockService.getAgents()
      return result
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const subscribeToActivity = useCallback(
    (threadId: string, callback: (activity: Activity) => void) => {
    return mockService.subscribeToActivity(threadId, callback)
  },
  [])

  return {
    loading,
    error,
    fetchWorkspaces,
    fetchChannels,
    fetchThreads,
    fetchActivities,
    updateThreadStatus,
    fetchAgents,
    subscribeToActivity,
  }
}