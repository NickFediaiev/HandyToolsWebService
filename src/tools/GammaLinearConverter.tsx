// Tool: Gamma ↔ Linear opacity converter
// Converts opacity/alpha values between gamma-encoded (sRGB) and linear light space
// Used when passing UI opacity values into shaders or physically-based rendering pipelines

import { useState, useCallback } from 'react'

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

export default function GammaLinearConverter() {
  // Gamma → Linear panel state (input as 0–255 byte)
  const [gammaByte, setGammaByte] = useState('180')
  const [gammaByteError, setGammaByteError] = useState<string | null>(null)

  // Linear → Gamma panel state (input as 0–1 float)
  const [linearFloat, setLinearFloat] = useState('0.4')
  const [linearFloatError, setLinearFloatError] = useState<string | null>(null)

  const handleGammaByteChange = useCallback((raw: string) => {
    setGammaByte(raw)
    const n = Number(raw)
    if (raw.trim() === '' || isNaN(n) || n < 0 || n > 255) {
      setGammaByteError('Enter a value between 0 and 255')
    } else {
      setGammaByteError(null)
    }
  }, [])

  const handleLinearFloatChange = useCallback((raw: string) => {
    setLinearFloat(raw)
    const n = Number(raw)
    if (raw.trim() === '' || isNaN(n) || n < 0 || n > 1) {
      setLinearFloatError('Enter a value between 0 and 1')
    } else {
      setLinearFloatError(null)
    }
  }, [])

  // Gamma → Linear derived values
  const gammaByteNum = Number(gammaByte)
  const gammaFloat01 = clamp01(gammaByteNum / 255)
  const linearResult = gammaToLinear(gammaFloat01)

  // Linear → Gamma derived values
  const linearFloatNum = clamp01(Number(linearFloat))
  const gammaResult = linearToGamma(linearFloatNum)

  const copy = (text: string) => navigator.clipboard.writeText(text)

  const gammaValid = !gammaByteError && gammaByte.trim() !== ''
  const linearValid = !linearFloatError && linearFloat.trim() !== ''

  return (
    <div className="space-y-8">

      {/* Gamma → Linear */}
      <section className="space-y-4">
        <h2 className="text-sm font-semibold text-accent uppercase tracking-widest">Gamma → Linear</h2>

        <div className="tool-section">
          <label className="tool-label">Gamma Opacity (0 – 255)</label>
          <input
            className="tool-input"
            value={gammaByte}
            onChange={(e) => handleGammaByteChange(e.target.value)}
            placeholder="0 – 255"
            inputMode="decimal"
          />
          {gammaByteError && <p className="text-red-400 text-xs font-mono mt-1">{gammaByteError}</p>}
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
          <label className="tool-label">Linear Opacity (0 – 1)</label>
          <input
            className="tool-input"
            value={linearFloat}
            onChange={(e) => handleLinearFloatChange(e.target.value)}
            placeholder="0.0 – 1.0"
            inputMode="decimal"
          />
          {linearFloatError && <p className="text-red-400 text-xs font-mono mt-1">{linearFloatError}</p>}
        </div>

        {linearValid && (
          <>
            <OpacityBar value={linearFloatNum} label="Linear" />
            <OpacityBar value={gammaResult} label="Gamma" />

            <div className="grid grid-cols-2 gap-3">
              <CopyField label="Gamma (float 0–1)" value={fmt(gammaResult)} onCopy={copy} />
              <CopyField label="Gamma (byte 0–255)" value={String(Math.round(gammaResult * 255))} onCopy={copy} />
              <CopyField label="Gamma (%)" value={fmt(gammaResult * 100, 2) + '%'} onCopy={copy} />
              <CopyField label="Linear (float 0–1)" value={fmt(linearFloatNum)} onCopy={copy} />
            </div>
          </>
        )}
      </section>
    </div>
  )
}

// Visual opacity bar showing the value as a filled strip
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
