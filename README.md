# devkit — personal tools

A fast, extensible personal toolbox built with TypeScript + React + Vite + Tailwind + Zustand.

## Quick start

```bash
npm install
npm run dev
```

## Deploy to Vercel

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Select the repo — Vercel auto-detects Vite
4. Hit Deploy

Every `git push main` auto-deploys. Done.

---

## Adding a new tool

This is the only workflow you need:

### 1. Create the component

```tsx
// src/tools/MyTool.tsx
export default function MyTool() {
  return <div>your tool UI here</div>
}
```

### 2. Register it

Open `src/tools/index.ts` and add:

```ts
const MyTool = lazy(() => import('./MyTool'))

export const TOOLS: Tool[] = [
  // ... existing tools
  {
    id: 'my-tool',           // unique, kebab-case
    label: 'My Tool',        // sidebar label
    description: 'Does X',  // subtitle in header
    category: 'misc',        // color | text | unity | math | misc
    component: MyTool,
  },
]
```

That's it. It appears in the sidebar automatically.

---

## Project structure

```
src/
├── store/
│   └── useToolStore.ts     ← global state (Zustand)
├── tools/
│   ├── index.ts            ← tool registry (edit this to add tools)
│   ├── HexColorConverter.tsx
│   ├── UnityColorConverter.tsx
│   └── JsonFormatter.tsx
├── components/
│   └── Sidebar.tsx
├── types/
│   └── index.ts            ← shared TypeScript interfaces
├── App.tsx
├── main.tsx
└── index.css               ← Tailwind + component classes
```

## Tech stack

| Package | Purpose | Unity analog |
|---|---|---|
| React | UI component system | MonoBehaviour / UI Toolkit |
| TypeScript | Typed JavaScript | C# |
| Vite | Dev server + bundler | Build pipeline |
| Tailwind | Utility CSS | USS (Unity Style Sheets) |
| Zustand | Global state store | VContainer singleton service |
| clsx | Conditional class strings | String interpolation for class logic |
