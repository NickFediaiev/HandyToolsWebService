// Each tool in the registry
export interface Tool {
  id: string
  label: string
  description: string
  category: ToolCategory
  component: React.ComponentType
}

export type ToolCategory = 'color' | 'text' | 'unity' | 'math' | 'misc' | 'pico8' | 'mermaid'

export const CATEGORY_LABELS: Record<ToolCategory, string> = {
  color: 'Color',
  text: 'Text',
  unity: 'Unity',
  math: 'Math',
  misc: 'Misc',
  pico8: 'PICO-8',
  mermaid: 'Mermaid',
}
