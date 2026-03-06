// Tool: Gamma ↔ Linear opacity converter
// Converts opacity/alpha values between gamma-encoded (sRGB) and linear light space
// Used when passing UI opacity values into shaders or physically-based rendering pipelines

import { useState, useCallback } from 'react'

type Scale = '0-1' | '0-255' | '%'

// sRGB transfer function: gamma-encoded → linear
function gammaToLinear(g: number): number {
  if (g <= 0.04045) return g / 12.92
  return Math.pow((g + 0.055) / 1.055, 2.4)
}

// Inverse sRGB transfer function: linear → gamma-encoded
function linearToGamma(l: number): number {
  if (l <= 0.0031308) return l * 12.92
  return 1.055 * Math.pow(l, 1 / 2.4) - 0.055
}

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v))
}

function fmt(v: number, decimals = 4): string {
  return v.toFixed(decimals)
}

// Parse raw string + scale → normalized 0-1 float (or NaN)
function parseInput(raw: string, scale: Scale): number {
  const n = Number(raw.replace('%', '').trim())
  if (isNaN(n)) return NaN
  if (scale === '0-255') return n / 255
  if (scale === '%') return n / 100
  return n
}

// Max value for a given scale (used for validation)
const SCALE_MAX: Record<Scale, number> = { '0-1': 1, '0-255': 255, '%': 100 }
const SCALE_PLACEHOLDER: Record<Scale, string> = { '0-1': '0.0 – 1.0', '0-255': '0 – 255', '%': '0 – 100' }

// Convert a 0-1 float back to a display string for a given scale
function float01ToString(v: number, scale: Scale): string {
  if (scale === '0-255') return String(Math.round(v * 255))
  if (scale === '%') return fmt(v * 100, 2)
  return fmt(v, 4)
}

function validate(raw: string, scale: Scale): string | null {
  const n = Number(raw.replace('%', '').trim())
  const max = SCALE_MAX[scale]
  if (raw.trim() === '' || isNaN(n) || n < 0 || n > max) {
    return `Enter a value between 0 and ${max}`
  }
  return null
}

export default function GammaLinearConverter() {
  const [gammaRaw, setGammaRaw] = useState('180')
  const [gammaScale, setGammaScale] = useState<Scale>('0-255')
  const [gammaError, setGammaError] = useState<string | null>(null)

  const [linearRaw, setLinearRaw] = useState('0.4')
  const [linearScale, setLinearScale] = useState<Scale>('0-1')
  const [linearError, setLinearError] = useState<string | null>(null)

  const copy = (text: string) => navigator.clipboard.writeText(text)

  const handleGammaInput = useCallback((raw: string) => {
    setGammaRaw(raw)
    setGammaError(validate(raw, gammaScale))
  }, [gammaScale])

  const handleGammaScale = useCallback((next: Scale) => {
    const v01 = parseInput(gammaRaw, gammaScale)
    if (!isNaN(v01)) {
      const converted = float01ToString(clamp01(v01), next)
      setGammaRaw(converted)
      setGammaError(validate(converted, next))
    } else {
      setGammaError(validate(gammaRaw, next))
    }
    setGammaScale(next)
  }, [gammaRaw, gammaScale])

  const handleLinearInput = useCallback((raw: string) => {
    setLinearRaw(raw)
    setLinearError(validate(raw, linearScale))
  }, [linearScale])

  const handleLinearScale = useCallback((next: Scale) => {
    const v01 = parseInput(linearRaw, linearScale)
    if (!isNaN(v01)) {
      const converted = float01ToString(clamp01(v01), next)
      setLinearRaw(converted)
      setLinearError(validate(converted, next))
    } else {
      setLinearError(validate(linearRaw, next))
    }
    setLinearScale(next)
  }, [linearRaw, linearScale])

  // Gamma → Linear
  const gammaFloat01 = clamp01(parseInput(gammaRaw, gammaScale))
  const linearResult = gammaToLinear(gammaFloat01)
  const gammaValid = !gammaError && gammaRaw.trim() !== ''

  // Linear → Gamma
  const linearFloat01 = clamp01(parseInput(linearRaw, linearScale))
  const gammaResult = linearToGamma(linearFloat01)
  const linearValid = !linearError && linearRaw.trim() !== ''

  return (
    <div className="space-y-8">

      {/* Gamma → Linear */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-accent uppercase tracking-widest">Gamma → Linear</h2>

        <div className="tool-section">
          <div className="flex items-center justify-between mb-1">
            <label className="tool-label !mb-0">Gamma Opacity</label>
            <ScalePicker value={gammaScale} onChange={handleGammaScale} />
          </div>
          <input
            className="tool-input"
            value={gammaRaw}
            onChange={(e) => handleGammaInput(e.target.value)}
            placeholder={SCALE_PLACEHOLDER[gammaScale]}
            inputMode="decimal"
          />
          {gammaError && <p className="text-red-400 text-xs font-mono mt-1">{gammaError}</p>}
        </div>

        {gammaValid && (
          <>
            <OpacityBar value={gammaFloat01} label="Gamma" />
            <OpacityBar value={linearResult} label="Linear" />
            <div className="grid grid-cols-2 gap-3">
              <CopyField label="Linear (float 0–1)" value={fmt(linearResult)} onCopy={copy} />
              <CopyField label="Linear (byte 0–255)" value={String(Math.round(linearResult * 255))} onCopy={copy} />
              <CopyField label="Linear (%)" value={fmt(linearResult * 100, 2) + '%'} onCopy={copy} />
              <CopyField label="Gamma (float 0–1)" value={fmt(gammaFloat01)} onCopy={copy} />
            </div>
          </>
        )}
      </section>

      <div className="border-t border-bg-border" />

      {/* Linear → Gamma */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-accent uppercase tracking-widest">Linear → Gamma</h2>

        <div className="tool-section">
          <div className="flex items-center justify-between mb-1">
            <label className="tool-label !mb-0">Linear Opacity</label>
            <ScalePicker value={linearScale} onChange={handleLinearScale} />
          </div>
          <input
            className="tool-input"
            value={linearRaw}
            onChange={(e) => handleLinearInput(e.target.value)}
            placeholder={SCALE_PLACEHOLDER[linearScale]}
            inputMode="decimal"
          />
          {linearError && <p className="text-red-400 text-xs font-mono mt-1">{linearError}</p>}
        </div>

        {linearValid && (
          <>
            <OpacityBar value={linearFloat01} label="Linear" />
            <OpacityBar value={gammaResult} label="Gamma" />
            <div className="grid grid-cols-2 gap-3">
              <CopyField label="Gamma (float 0–1)" value={fmt(gammaResult)} onCopy={copy} />
              <CopyField label="Gamma (byte 0–255)" value={String(Math.round(gammaResult * 255))} onCopy={copy} />
              <CopyField label="Gamma (%)" value={fmt(gammaResult * 100, 2) + '%'} onCopy={copy} />
              <CopyField label="Linear (float 0–1)" value={fmt(linearFloat01)} onCopy={copy} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}

const SCALES: Scale[] = ['0-1', '0-255', '%']

function ScalePicker({ value, onChange }: { value: Scale; onChange: (s: Scale) => void }) {
  return (
    <div className="flex gap-1">
      {SCALES.map((s) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className={`px-2 py-0.5 rounded text-xs font-mono border transition-colors ${
            s === value
              ? 'bg-accent text-bg-base border-accent'
              : 'border-bg-border text-muted hover:text-fg hover:border-fg'
          }`}
        >
          {s}
        </button>
      ))}
    </div>
  )
}

function OpacityBar({ value, label }: { value: number; label: string }) {
  return (
    <div className="tool-section">
      <label className="tool-label">{label}</label>
      <div className="h-6 rounded border border-bg-border overflow-hidden bg-bg-base">
        <div
          className="h-full bg-accent transition-all duration-150"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  )
}

interface CopyFieldProps {
  label: string
  value: string
  onCopy: (v: string) => void
}

function CopyField({ label, value, onCopy }: CopyFieldProps) {
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
        <input className="tool-input font-mono text-sm" value={value} readOnly />
        <button className="tool-btn-ghost shrink-0" onClick={handleCopy}>
          {copied ? '✓' : 'copy'}
        </button>
      </div>
    </div>
  )
}
