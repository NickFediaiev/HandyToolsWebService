// Tool: JSON Formatter / Validator
// Paste raw JSON, get it pretty-printed and validated
// Useful for inspecting Firebase/Supabase/PlayFab API responses

import { useState, useCallback } from 'react'

type ParseResult =
  | { ok: true; formatted: string; size: string }
  | { ok: false; error: string }

function parseJson(input: string): ParseResult {
  if (!input.trim()) return { ok: false, error: 'Empty input' }

  try {
    const parsed = JSON.parse(input)
    const formatted = JSON.stringify(parsed, null, 2)
    const bytes = new Blob([formatted]).size
    const size = bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`
    return { ok: true, formatted, size }
  } catch (e) {
    return { ok: false, error: (e as SyntaxError).message }
  }
}

function minifyJson(input: string): string {
  try {
    return JSON.stringify(JSON.parse(input))
  } catch {
    return input
  }
}

export default function JsonFormatter() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [result, setResult] = useState<ParseResult | null>(null)

  const handleFormat = useCallback(() => {
    const r = parseJson(input)
    setResult(r)
    setOutput(r.ok ? r.formatted : '')
  }, [input])

  const handleMinify = useCallback(() => {
    const minified = minifyJson(input)
    setOutput(minified)
    setResult({ ok: true, formatted: minified, size: `${new Blob([minified]).size} B` })
  }, [input])

  const handleClear = () => {
    setInput('')
    setOutput('')
    setResult(null)
  }

  return (
    <div className="space-y-4">
      <div className="tool-section">
        <label className="tool-label">Input JSON</label>
        <textarea
          className="tool-input resize-none h-48"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder='{ "key": "value" }'
          spellCheck={false}
        />
      </div>

      <div className="flex gap-2">
        <button className="tool-btn-primary" onClick={handleFormat}>
          format
        </button>
        <button className="tool-btn-ghost" onClick={handleMinify}>
          minify
        </button>
        <button className="tool-btn-ghost" onClick={handleClear}>
          clear
        </button>
        {result?.ok && (
          <button
            className="tool-btn-ghost ml-auto"
            onClick={() => navigator.clipboard.writeText(output)}
          >
            copy output
          </button>
        )}
      </div>

      {result && !result.ok && (
        <div className="bg-red-950/30 border border-red-800/40 rounded-lg px-4 py-3 font-mono text-xs text-red-400">
          ✗ {result.error}
        </div>
      )}

      {result?.ok && (
        <div className="tool-section">
          <div className="flex justify-between items-center mb-2">
            <label className="tool-label mb-0">Output</label>
            <span className="text-xs font-mono text-muted">{result.size}</span>
          </div>
          <textarea
            className="tool-input resize-none h-64 text-accent"
            value={output}
            readOnly
            spellCheck={false}
          />
        </div>
      )}
    </div>
  )
}
