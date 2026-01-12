import { useState, useEffect } from 'react';
import { mockService } from '@/lib/mock-service';
import { type Workspace, type Channel, type Thread, type Activity } from '@/types';

/**
 * Hook for interacting with MockService
 */
export function useMockService() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchWorkspaces = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockService.getWorkspaces();
      setWorkspaces(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchChannels = async (workspaceId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockService.getChannels(workspaceId);
      setChannels(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchThreads = async (channelId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockService.getThreads(channelId);
      setThreads(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivities = async (threadId: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await mockService.getActivities(threadId);
      setActivities(data);
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  };

  return {
    workspaces,
    channels,
    threads,
    activities,
    loading,
    error,
    fetchWorkspaces,
    fetchChannels,
    fetchThreads,
    fetchActivities,
    mockService,
  };
}
