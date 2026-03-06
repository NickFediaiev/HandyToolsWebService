// Sidebar component — reads the tool registry and renders nav items
// Props are typed interfaces — same mental model as method signatures in C#

import { TOOLS, type Tool } from '@/tools'
import { useToolStore } from '@/store/useToolStore'
import { CATEGORY_LABELS, type ToolCategory } from '@/types'
import clsx from 'clsx'

export function Sidebar() {
  const { activeToolId, setActiveTool, sidebarCollapsed, toggleSidebar } = useToolStore()

  // Group tools by category — similar to LINQ GroupBy in C#
  // Object.entries returns [key, value] pairs, which we iterate
  const grouped = TOOLS.reduce<Partial<Record<ToolCategory, Tool[]>>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = []
    acc[tool.category]!.push(tool)
    return acc
  }, {})

  return (
    <aside
      className={clsx(
        'flex flex-col border-r border-bg-border bg-bg-surface transition-all duration-200 shrink-0',
        sidebarCollapsed ? 'w-14' : 'w-56'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-bg-border">
        {!sidebarCollapsed && (
          <span className="font-mono text-sm font-medium text-accent tracking-wider">
            devkit
          </span>
        )}
        <button
          onClick={toggleSidebar}
          className="text-muted hover:text-text-primary transition-colors ml-auto"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      {/* Tool list */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {(Object.entries(grouped) as [ToolCategory, Tool[]][]).map(([category, tools]) => (
          <div key={category}>
            {!sidebarCollapsed && (
              <p className="text-xs font-mono text-muted uppercase tracking-widest px-2 mb-1">
                {CATEGORY_LABELS[category]}
              </p>
            )}
            {tools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                title={sidebarCollapsed ? tool.label : undefined}
                className={clsx(
                  'w-full text-left rounded-md px-2 py-2 text-sm transition-all duration-100',
                  'flex items-center gap-2',
                  activeToolId === tool.id
                    ? 'bg-accent-glow text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                )}
              >
                <span className="text-xs font-mono opacity-50 shrink-0">
                  {getCategoryIcon(tool.category)}
                </span>
                {!sidebarCollapsed && (
                  <span className="truncate">{tool.label}</span>
                )}
              </button>
            ))}
          </div>
        ))}
      </nav>

      {/* Footer */}
      {!sidebarCollapsed && (
        <div className="px-4 py-3 border-t border-bg-border">
          <p className="text-xs font-mono text-muted">
            {TOOLS.length} tool{TOOLS.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </aside>
  )
}

function getCategoryIcon(category: ToolCategory): string {
  const icons: Record<ToolCategory, string> = {
    color: '◈',
    text: '≡',
    unity: '◆',
    math: '∑',
    misc: '·',
  }
  return icons[category]
}
