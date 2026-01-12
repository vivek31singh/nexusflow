'use client';

import { useEffect, useRef, useState } from 'react';
import { useWorkspaceContext } from '@/contexts/workspace-context';
import { MockService } from '@/lib/mock-service';
import { Activity, ActivityType } from '@/types';
import { cn } from '@/lib/utils';

const activityConfig = {
  log: {
    containerClass: 'font-mono text-xs text-slate-600 dark:text-slate-400',
    icon: '›',
    iconClass: 'text-slate-400 dark:text-slate-500',
  },
  error: {
    containerClass: 'font-mono text-xs text-rose-600 dark:text-rose-400',
    icon: '✕',
    iconClass: 'text-rose-500',
  },
  success: {
    containerClass: 'font-mono text-xs text-emerald-600 dark:text-emerald-400',
    icon: '✓',
    iconClass: 'text-emerald-500',
  },
  metric: {
    containerClass: 'font-mono text-xs text-amber-600 dark:text-amber-400',
    icon: '◆',
    iconClass: 'text-amber-500',
  },
};

const formatTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date(date));
};

export const ActivityStream = () => {
  const { state } = useWorkspaceContext();
  const { activeThreadId } = state;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const subscriptionRef = useRef<(() => void) | null>(null);
  const isUserScrolledRef = useRef(false);

  // Fetch historical activities when activeThreadId changes
  useEffect(() => {
    if (!activeThreadId) {
      setActivities([]);
      return;
    }

    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await MockService.getActivities(activeThreadId);
        setActivities(data);
        // Auto-scroll after loading
        setTimeout(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
          }
        }, 0);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();

    // Cleanup subscription on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current();
        subscriptionRef.current = null;
      }
    };
  }, [activeThreadId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!activeThreadId) {
      return;
    }

    const unsubscribe = MockService.subscribeToActivity(
      activeThreadId,
      (newActivity: Activity) => {
        setActivities((prev) => [...prev, newActivity]);
        // Auto-scroll only if user hasn't manually scrolled up
        if (!isUserScrolledRef.current && scrollRef.current) {
          requestAnimationFrame(() => {
            if (scrollRef.current) {
              scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
            }
          });
        }
      }
    );

    subscriptionRef.current = unsubscribe;

    return () => {
      unsubscribe();
    };
  }, [activeThreadId]);

  // Handle scroll events to detect if user has scrolled up
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      // Consider user scrolled up if they're more than 50px from bottom
      isUserScrolledRef.current = scrollHeight - scrollTop - clientHeight > 50;
    }
  };

  if (!activeThreadId) {
    return (
      <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500 text-sm">
        Select a thread to view activity stream
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Activity List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-2 font-mono text-xs"
      >
        {isLoading && activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
            Loading activities...
          </div>
        ) : activities.length === 0 ? (
          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
            No activities yet
          </div>
        ) : (
          activities.map((activity) => {
            const config = activityConfig[activity.type as ActivityType];
            return (
              <div
                key={activity.id}
                className={cn(
                  'flex items-start gap-2 py-1 px-2 rounded-sm hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors',
                  config.containerClass
                )}
              >
                {/* Icon */}
                <span className={cn('flex-shrink-0 mt-0.5', config.iconClass)}>
                  {config.icon}
                </span>

                {/* Timestamp */}
                <span className="flex-shrink-0 text-slate-400 dark:text-slate-500 opacity-70">
                  {formatTime(activity.timestamp)}
                </span>

                {/* Content */}
                <span className="flex-1 break-all">
                  {activity.content}
                </span>

                {/* Metadata if present */}
                {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                  <span className="flex-shrink-0 text-slate-500 dark:text-slate-600 opacity-60">
                    [{Object.keys(activity.metadata).join(', ')}]
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
