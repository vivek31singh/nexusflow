# Technical Specification

## Architecture Patterns
1.  **Provider Pattern:** Centralized state management using React Context API (`WorkspaceProvider`, `ToastProvider`) combined with `useReducer` for complex state transitions (Threads, Agents, Toasts).
2.  **Service Layer Pattern:** A `MockService` class isolates data fetching logic, simulating API endpoints with promises and random timeouts.
3.  **Container/Presenter Pattern:** Separation of "smart" components (Container) that fetch data and handle state from "dumb" components (Presenter) that purely render UI.
4.  **Composition Pattern:** Complex UIs (like the Activity Stream) are built by composing smaller, generic layout components (e.g., `Panel`, `Section`, `ListRow`).

## Component Hierarchy
App
└── RootLayout (Font & Theme Providers)
    ├── CommandPalette (Global Overlay)
    ├── ToastProvider (Global Overlay)
    │   └── ToastContainer
    └── MainLayout (Grid Container)
        ├── WorkspaceSidebar (Panel 1)
        │   └── WorkspaceList
        ├── ChannelSidebar (Panel 2)
        │   └── ChannelList
        ├── MainContent (Panel 3)
        │   ├── ThreadHeader
        │   ├── ThreadList
        │   └── ActivityStream (Container -> StreamList)
        └── AgentPanel (Panel 4, Collapsible)
            ├── AgentStats
            └── AgentControls

## Data Models
**Types:**
```typescript
type ThreadStatus = 'active' | 'paused' | 'stopped';
type ActivityType = 'log' | 'error' | 'success' | 'metric';
type Theme = 'dark' | 'light';
type ToastSeverity = 'info' | 'success' | 'warning' | 'error';
```

**Interfaces:**

**Agent:**
```typescript
interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'running' | 'paused' | 'error';
  type: string;
  lastActive: Date;
}
```
**Channel:**
```typescript
interface Channel {
  id: string;
  workspaceId: string;
  name: string;
  type: 'text' | 'workflow';
  unreadCount: number;
}
```
**Thread:**
```typescript
interface Thread {
  id: string;
  channelId: string;
  title: string;
  status: ThreadStatus;
  startTime: Date;
  agentIds: string[];
}
```
**Activity:**
```typescript
interface Activity {
  id: string;
  threadId: string;
  type: ActivityType;
  timestamp: Date;
  content: string;
  metadata?: Record<string, any>;
}
```
**Toast:**
```typescript
interface Toast {
  id: string;
  message: string;
  severity: ToastSeverity;
  duration?: number;
}
```
**WorkspaceState:**
```typescript
interface WorkspaceState {
  activeWorkspaceId: string;
  activeChannelId: string;
  activeThreadId: string | null;
  theme: Theme;
  isAgentPanelOpen: boolean;
}
```

## API Design
Since there is no real backend, the "API" is the MockService interface:
*   `getWorkspaces(): Promise<Workspace[]>`
*   `getChannels(workspaceId: string): Promise<Channel[]>`
*   `getThreads(channelId: string): Promise<Thread[]>`
*   `getActivities(threadId: string): Promise<Activity[]>`
*   `updateThreadStatus(threadId: string, status: ThreadStatus): Promise<Thread>`
*   `subscribeToActivity(threadId: string, callback: (activity: Activity) => void): UnsubscribeFunction`
*   *Error Handling:* Methods randomly reject with `new Error("Simulation failure")` (~15% probability).
