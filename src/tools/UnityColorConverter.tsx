// Tool: Unity Color ↔ Hex ↔ Color32
// Converts between Unity's Color (0–1 float), Color32 (0–255 byte), and Hex
// You'll actually use this — it's one of those things you google every few months

import { useState } from 'react'

interface UnityColor {
  r: number  // 0.0 – 1.0
  g: number
  b: number
  a: number
}

interface Color32 {
  r: number  // 0 – 255
  g: number
  b: number
  a: number
}

function hexToUnityColor(hex: string): UnityColor | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6 && clean.length !== 8) return null
  const r = parseInt(clean.slice(0, 2), 16)
  const g = parseInt(clean.slice(2, 4), 16)
  const b = parseInt(clean.slice(4, 6), 16)
  const a = clean.length === 8 ? parseInt(clean.slice(6, 8), 16) : 255
  if ([r, g, b, a].some(isNaN)) return null
  return {
    r: parseFloat((r / 255).toFixed(4)),
    g: parseFloat((g / 255).toFixed(4)),
    b: parseFloat((b / 255).toFixed(4)),
    a: parseFloat((a / 255).toFixed(4)),
  }
}

function unityColorToHex(c: UnityColor): string {
  const toHex = (v: number) => Math.round(v * 255).toString(16).padStart(2, '0')
  return `#${toHex(c.r)}${toHex(c.g)}${toHex(c.b)}`
}

function unityColorToColor32(c: UnityColor): Color32 {
  return {
    r: Math.round(c.r * 255),
    g: Math.round(c.g * 255),
    b: Math.round(c.b * 255),
    a: Math.round(c.a * 255),
  }
}

export default function UnityColorConverter() {
  const [hex, setHex] = useState('#7fffb2')

  const color = hexToUnityColor(hex)
  const color32 = color ? unityColorToColor32(color) : null

  const copyToClipboard = (text: string) => navigator.clipboard.writeText(text)

  const colorSnippet = color
    ? `new Color(${color.r}f, ${color.g}f, ${color.b}f, ${color.a}f)`
    : ''

  const color32Snippet = color32
    ? `new Color32(${color32.r}, ${color32.g}, ${color32.b}, ${color32.a})`
    : ''

  const htmlColorSnippet = color32
    ? `ColorUtility.TryParseHtmlString("${hex}", out color)`
    : ''

  return (
    <div className="space-y-6">
      <div className="tool-section">
        <label className="tool-label">Hex Color</label>
        <div className="flex gap-3 items-center">
          <div
            className="w-12 h-12 rounded-lg border border-bg-border shrink-0"
            style={{ backgroundColor: color ? hex : '#1a1e27' }}
          />
          <input
            className="tool-input"
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="#rrggbb or #rrggbbaa"
            maxLength={9}
            spellCheck={false}
          />
        </div>
      </div>

      {color && color32 && (
        <>
          {/* Unity Color (float) */}
          <div className="tool-section">
            <label className="tool-label">Unity Color (float 0–1)</label>
            <div className="bg-bg-base rounded-lg border border-bg-border p-3 font-mono text-sm">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['r', 'g', 'b', 'a'] as const).map((ch) => (
                  <div key={ch} className="text-center">
                    <div className="text-muted text-xs mb-1">{ch}</div>
                    <div className="text-accent">{color[ch]}</div>
                  </div>
                ))}
              </div>
              <CopyRow value={colorSnippet} onCopy={copyToClipboard} />
            </div>
          </div>

          {/* Color32 (byte) */}
          <div className="tool-section">
            <label className="tool-label">Color32 (byte 0–255)</label>
            <div className="bg-bg-base rounded-lg border border-bg-border p-3 font-mono text-sm">
              <div className="grid grid-cols-4 gap-2 mb-3">
                {(['r', 'g', 'b', 'a'] as const).map((ch) => (
                  <div key={ch} className="text-center">
                    <div className="text-muted text-xs mb-1">{ch}</div>
                    <div className="text-accent">{color32[ch]}</div>
                  </div>
                ))}
              </div>
              <CopyRow value={color32Snippet} onCopy={copyToClipboard} />
            </div>
          </div>

          {/* ColorUtility snippet */}
          <div className="tool-section">
            <label className="tool-label">ColorUtility.TryParseHtmlString</label>
            <CopyRow value={htmlColorSnippet} onCopy={copyToClipboard} mono />
          </div>
        </>
      )}
    </div>
  )
}

interface CopyRowProps {
  value: string
  onCopy: (v: string) => void
  mono?: boolean
}

function CopyRow({ value, onCopy, mono = true }: CopyRowProps) {
  const [copied, setCopied] = useState(false)

  return (
    <div className="flex gap-2">
      <input
        className={`tool-input ${mono ? 'font-mono' : ''} text-xs`}
        value={value}
        readOnly
      />
      <button
        className="tool-btn-ghost shrink-0 text-xs"
        onClick={() => {
          onCopy(value)
          setCopied(true)
          setTimeout(() => setCopied(false), 1500)
        }}
      >
        {copied ? '✓' : 'copy'}
      </button>
    </div>
  )
}
