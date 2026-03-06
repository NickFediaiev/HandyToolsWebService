// Tool Registry — this is the ONLY place you add new tools.
// Everything else (sidebar, routing) reads from here automatically.
// Think of it like a ScriptableObject registry — data-driven configuration.

import { lazy } from 'react'
import type { Tool } from '@/types'

// React.lazy = component is only loaded when it's first rendered
// (code splitting — same concept as addressables in Unity)
const HexColorConverter = lazy(() => import('./HexColorConverter'))
const UnityColorConverter = lazy(() => import('./UnityColorConverter'))
const JsonFormatter = lazy(() => import('./JsonFormatter'))
const GammaLinearConverter = lazy(() => import('./GammaLinearConverter'))
const UnitySnippets = lazy(() => import('./UnitySnippets'))

export const TOOLS: Tool[] = [
  {
    id: 'hex-color',
    label: 'Hex → RGB / HSL',
    description: 'Convert hex colors to RGB, HSL and shade variants',
    category: 'color',
    component: HexColorConverter,
  },
  {
    id: 'unity-color',
    label: 'Unity Color',
    description: 'Hex → Unity Color / Color32 struct snippets',
    category: 'unity',
    component: UnityColorConverter,
  },
  {
    id: 'json-format',
    label: 'JSON Formatter',
    description: 'Format, validate, and minify JSON',
    category: 'text',
    component: JsonFormatter,
  },
  {
    id: 'gamma-linear',
    label: 'Gamma ↔ Linear Opacity',
    description: 'Convert opacity values between sRGB gamma and linear light space',
    category: 'color',
    component: GammaLinearConverter,
  },
  {
    id: 'unity-snippets',
    label: 'Unity Snippets',
    description: 'Searchable C# snippets for common Unity patterns',
    category: 'unity',
    component: UnitySnippets,
  },
]

// Lookup map for O(1) access by id — same as Dictionary<string, Tool> in C#
export const TOOLS_BY_ID = new Map<string, Tool>(
  TOOLS.map((tool) => [tool.id, tool])
)
