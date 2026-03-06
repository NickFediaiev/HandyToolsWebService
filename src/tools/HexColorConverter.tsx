// Tool: Hex ↔ RGB ↔ HSL color converter
// Notice how TypeScript interfaces act exactly like C# structs for data shapes

import { useState, useCallback } from 'react'

interface RgbColor {
  r: number
  g: number
  b: number
}

interface HslColor {
  h: number
  s: number
  l: number
}

// Pure utility functions — same concept as static helper methods in C#
function hexToRgb(hex: string): RgbColor | null {
  const clean = hex.replace('#', '')
  if (clean.length !== 6) return null
  const num = parseInt(clean, 16)
  if (isNaN(num)) return null
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

function rgbToHsl({ r, g, b }: RgbColor): HslColor {
  const rn = r / 255, gn = g / 255, bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const l = (max + min) / 2
  let h = 0, s = 0

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case rn: h = ((gn - bn) / d + (gn < bn ? 6 : 0)) / 6; break
      case gn: h = ((bn - rn) / d + 2) / 6; break
      case bn: h = ((rn - gn) / d + 4) / 6; break
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  }
}

function rgbToHex({ r, g, b }: RgbColor): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')
}

export default function HexColorConverter() {
  const [hex, setHex] = useState('#7fffb2')
  const [error, setError] = useState<string | null>(null)

  // useCallback = memoized function, similar to caching a delegate in C#
  const handleHexChange = useCallback((value: string) => {
    setHex(value)
    setError(null)
    if (value.replace('#', '').length === 6 && !hexToRgb(value)) {
      setError('Invalid hex value')
    }
  }, [])

  const rgb = hexToRgb(hex)
  const hsl = rgb ? rgbToHsl(rgb) : null

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="tool-section">
        <label className="tool-label">Hex Input</label>
        <div className="flex gap-3 items-center">
          {/* Color preview swatch */}
          <div
            className="w-12 h-12 rounded-lg border border-bg-border shrink-0 transition-colors"
            style={{ backgroundColor: rgb ? hex : '#1a1e27' }}
          />
          <input
            className="tool-input"
            value={hex}
            onChange={(e) => handleHexChange(e.target.value)}
            placeholder="#rrggbb"
            maxLength={7}
            spellCheck={false}
          />
        </div>
        {error && <p className="text-red-400 text-xs font-mono mt-1">{error}</p>}
      </div>

      {rgb && hsl && (
        <>
          <OutputRow label="RGB" value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`} onCopy={copyToClipboard} />
          <OutputRow label="HSL" value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`} onCopy={copyToClipboard} />
          <OutputRow label="CSS Var" value={`--color: ${hex};`} onCopy={copyToClipboard} />

          {/* Shade strip */}
          <div className="tool-section">
            <label className="tool-label">Shade Preview</label>
            <div className="flex rounded-lg overflow-hidden h-10 border border-bg-border">
              {[10, 20, 30, 40, 50, 60, 70, 80, 90].map((l) => (
                <div
                  key={l}
                  className="flex-1 cursor-pointer hover:scale-y-110 transition-transform origin-bottom"
                  style={{ backgroundColor: `hsl(${hsl.h}, ${hsl.s}%, ${l}%)` }}
                  title={`hsl(${hsl.h}, ${hsl.s}%, ${l}%)`}
                  onClick={() => {
                    const r2 = hslToRgb(hsl.h, hsl.s, l)
                    setHex(rgbToHex(r2))
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function hslToRgb(h: number, s: number, l: number): RgbColor {
  const sn = s / 100, ln = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sn * Math.min(ln, 1 - ln)
  const f = (n: number) => ln - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))
  return {
    r: Math.round(f(0) * 255),
    g: Math.round(f(8) * 255),
    b: Math.round(f(4) * 255),
  }
}

// Small reusable sub-component — same idea as a prefab sub-object
interface OutputRowProps {
  label: string
  value: string
  onCopy: (v: string) => void
}

function OutputRow({ label, value, onCopy }: OutputRowProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    onCopy(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="tool-section">
      <label className="tool-label">{label}</label>
      <div className="flex gap-2">
        <input className="tool-input" value={value} readOnly />
        <button className="tool-btn-ghost shrink-0" onClick={handleCopy}>
          {copied ? '✓' : 'copy'}
        </button>
      </div>
    </div>
  )
}
