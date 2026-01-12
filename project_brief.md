# Project Brief: nexusflow

## Project Type
Single Page Application (SPA) / Frontend-Only Web App (Next.js 14)

## Project Goals (Golden Context)
To build a production-grade, "Calm & Dense" Agentic Marketing OS that simulates real-time AI orchestration. The system must provide a spatial memory via a rigid 4-panel layout, feel instant and responsive (simulating live data), and offer a desktop-like experience without external dependencies or a real backend. The goal is to create a trustworthy internal tool aesthetic inspired by Discord, Linear, and Raycast.

## Complexity
Moderate to High
Justification: While there is no real backend, the complexity arises from the strict UI/UX constraints (precise grid layouts, micro-interactions), the complex state management required to simulate "agentic" real-time behavior (latency, error handling, activity streams), and the need for a robust custom mock service layer. The requirement for high accessibility and keyboard navigation adds further complexity to the component logic.

## Tech Stack
Frontend Framework: Next.js 14 (App Router)
Language: TypeScript (Strict Mode)
Styling: Tailwind CSS (Inline styles only, no CSS files)
Icons: Lucide React
State Management: React Context API + useReducer
Fonts: Inter (UI), JetBrains Mono (Logs/Code)
Storage: localStorage (via StorageManager wrapper)
Testing: Jest + React Testing Library + Playwright
