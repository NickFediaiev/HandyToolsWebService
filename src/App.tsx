// App.tsx — root layout component
// This is the equivalent of your main scene setup in Unity

import { Suspense } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { useToolStore } from '@/store/useToolStore'
import { TOOLS_BY_ID } from '@/tools'

export default function App() {
  // useToolStore is a custom hook — reading from the Zustand store
  // Every component that calls this re-renders when activeToolId changes
  const activeToolId = useToolStore((state) => state.activeToolId)

  const activeTool = TOOLS_BY_ID.get(activeToolId)

  return (
    <div className="flex h-full bg-bg-base">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        {activeTool ? (
          <div className="max-w-2xl mx-auto px-6 py-8">
            {/* Tool header */}
            <div className="mb-8">
              <h1 className="text-lg font-semibold text-text-primary mb-1">
                {activeTool.label}
              </h1>
              <p className="text-sm text-text-secondary font-mono">
                {activeTool.description}
              </p>
            </div>

            {/* Tool body */}
            {/* Suspense handles the lazy-loaded component — shows fallback while loading */}
            <Suspense fallback={<LoadingSpinner />}>
              <activeTool.component />
            </Suspense>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-muted font-mono text-sm">
            tool not found
          </div>
        )}
      </main>
    </div>
  )
}

function LoadingSpinner() {
  return (
    <div className="flex items-center gap-2 text-muted font-mono text-sm">
      <span className="animate-spin">◌</span>
      loading...
    </div>
  )
}
