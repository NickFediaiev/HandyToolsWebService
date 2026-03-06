// Each tool in the registry
export interface Tool {
  id: string
  label: string
  description: string
  category: ToolCategory
  component: React.ComponentType
}

export type ToolCategory = 'color' | 'text' | 'unity' | 'math' | 'misc'

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  color: 'Color',
  text: 'Text',
  unity: 'Unity',
  math: 'Math',
  misc: 'Misc',
}
