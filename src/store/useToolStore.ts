import { create } from 'zustand'

// This is your global app state.
// Think of it like a lightweight service container — similar to VContainer but for UI state.
// `create` takes a function that receives `set` (to update state) and `get` (to read current state).

interface ToolStore {
  activeToolId: string
  setActiveTool: (id: string) => void

  sidebarCollapsed: boolean
  toggleSidebar: () => void
}

export const useToolStore = create<ToolStore>((set) => ({
  // Initial state — like field initializers in C#
  activeToolId: 'hex-color',
  sidebarCollapsed: false,

  // Actions — pure functions that call `set` to produce new state
  // Notice: no `this`, no mutation — Zustand handles immutability
  setActiveTool: (id) => set({ activeToolId: id }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}))
