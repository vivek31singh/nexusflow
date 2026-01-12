# Development Guidelines

## File Structure
```
/app
  /layout.tsx        # Root layout with providers
  /page.tsx          # Main entry redirecting to dashboard
  /globals.css       # Tailwind directives only
/components
  /ui                # Primitives (Button, Input, etc.)
    /button.tsx
    /panel.tsx       # Reusable panel wrapper
  /layout            # Layout structure
    /main-layout.tsx
    /sidebar.tsx
  /workspace         # Domain specific
    /workspace-list.tsx
    /channel-list.tsx
  /threads
    /thread-list.tsx
    /thread-header.tsx
  /activity
    /activity-stream.tsx
  /agents
    /agent-panel.tsx
    /agent-card.tsx
  /overlays
    /command-palette.tsx
    /toast.tsx
/contexts
  /workspace-context.tsx
/hooks
  /use-keyboard.ts
  /use-theme.ts
  /use-mock-service.ts
/lib
  /mock-service.ts   # The simulation engine
  /storage-manager.ts
  /utils.ts          # clsx/tailwind-merge
/types
  /index.ts          # All domain models
```

## Naming Conventions
*   **Files:** `kebab-case` (e.g., `agent-panel.tsx`, `mock-service.ts`)
*   **Folders:** `kebab-case` or `plural` (e.g., `components`, `contexts`)
*   **React Components:** `PascalCase` (e.g., `AgentPanel`, `ActivityStream`)
*   **Functions/Variables:** `camelCase` (e.g., `useMockService`, `activeThreadId`)
*   **Types/Interfaces:** `PascalCase` (e.g., `Agent`, `WorkspaceState`)
*   **Constants:** `SCREAMING_SNAKE_CASE` (e.g., `DEFAULT_LATENCY`)

## Coding Standards
1.  **TypeScript:** Strict mode enabled. Explicit return types on public functions. No implicit `any`.
2.  **Styling:** Use `cn()` utility (clsx + twMerge) for conditional classes. Hardcoded styles are forbidden; use Tailwind classes.
3.  **Components:** Functional components with Hooks. No class components.
4.  **Props:** Destructured props explicitly. Interfaces defined within the component file if private, or in `/types` if shared.
5.  **Accessibility:** All icons must have `aria-label` or be hidden from screen readers if decorative. Buttons must have focus states.
6.  **Imports:** Absolute imports using `@/` alias (e.g., `@/components/ui/button`).

## Testing Strategy
1.  **Unit Testing (Jest/RTL):** Test logic in Hooks (`useTheme`), Utility functions, and the `MockService` probability logic.
2.  **Component Testing:** Verify rendering of key components (`Sidebar`, `ThreadList`) with different states (loading, error, empty).
3.  **Integration Testing:** Test the `WorkspaceProvider` context updates when actions are dispatched.
4.  **E2E Testing (Playwright):**
    *   Simulate user clicking through Workspaces/Channels.
    *   Test Thread Start/Stop flow.
    *   Verify Command Palette opens on `Ctrl+K`.
    *   Test Theme Toggle and persistence.

## Error Handling
1.  **MockService Layer:** Wraps all promises in try/catch blocks. Randomly throws errors to simulate network issues.
2.  **Component Level:** Uses `error boundaries` for crashing components.
3.  **UI Feedback:**
    *   **Global:** Toast notifications for caught errors (e.g., "Failed to update thread status").
    *   **Local:** Inline error text for specific input failures.
    *   **Loading:** Skeleton screens during async operations (1-5s).

## Dependencies
```json
{
  "dependencies": {
    "next": "14.0.4",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.3.6",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "playwright": "^1.40.0"
  }
}
```

## Configuration
1.  **tsconfig.json:** Strict mode enabled, path aliases configured (`@/*` mapped to `./`).
2.  **tailwind.config.ts:** Custom color extensions (slate, indigo, emerald, amber, rose), font family configuration (Inter, JetBrains Mono).
3.  **next.config.js:** Standard config (no experimental features needed).
4.  **.eslintrc.json:** Next.js recommended rules + strict TypeScript rules.
