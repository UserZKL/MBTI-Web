"use client"

import { cn } from "@/lib/utils"

interface AxisData {
  code: string
  left: { label: string; percentage: number }
  right: { label: string; percentage: number }
}

interface ResultChartProps {
  dimensions: AxisData[]
  className?: string
}

interface Axis {
  label: string
  angle: number
  pct: number
}

const AXES: Array<{ label: string; angle: number }> = [
  { label: "E", angle: 0 },
  { label: "T", angle: 45 },
  { label: "J", angle: 90 },
  { label: "N", angle: 135 },
  { label: "I", angle: 180 },
  { label: "F", angle: 225 },
  { label: "P", angle: 270 },
  { label: "S", angle: 315 },
]

const PAIR_MAP: Array<[number, boolean]> = [
  [0, true],
  [2, true],
  [3, true],
  [1, true],
  [0, false],
  [2, false],
  [3, false],
  [1, false],
]

function polarPoint(cx: number, cy: number, radius: number, angle: number) {
  const rad = (angle * Math.PI) / 180
  return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
}

export function ResultChart({ dimensions, className }: ResultChartProps) {
  const cx = 160
  const cy = 160
  const r = 118

  const axes: Axis[] = AXES.map((axis, i) => {
    const [dimIndex, isLeft] = PAIR_MAP[i]
    const dim = dimensions[dimIndex]
    const pct =
      dim && isLeft
        ? dim.left.percentage
        : dim
          ? dim.right.percentage
          : 50
    return { label: axis.label, angle: axis.angle, pct: Math.min(Math.max(pct, 0), 100) }
  })

  const polygonPoints = axes
    .map((a) => {
      const p = polarPoint(cx, cy, (a.pct / 100) * r, a.angle)
      return `${p.x},${p.y}`
    })
    .join(" ")

  const gridLevels = [0.25, 0.5, 0.75, 1]

  const ariaParts = axes.map((a) => `${a.label}=${a.pct}%`).join(" ")

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <svg
        viewBox="0 0 320 320"
        className="h-auto w-full max-w-[360px]"
        role="img"
        aria-label={`MBTI 结果雷达图：${ariaParts}`}
      >
        <defs>
          <linearGradient id="radar-fill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-purple)" stopOpacity="0.35" />
            <stop offset="50%" stopColor="var(--color-brand-cyan)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--color-brand-blue)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="radar-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--color-brand-purple)" />
            <stop offset="50%" stopColor="var(--color-brand-cyan)" />
            <stop offset="100%" stopColor="var(--color-brand-blue)" />
          </linearGradient>
        </defs>

        {gridLevels.map((level) => {
          const radius = r * level
          const gridPoints = axes
            .map((a) => {
              const p = polarPoint(cx, cy, radius, a.angle)
              return `${p.x},${p.y}`
            })
            .join(" ")
          return (
            <polygon
              key={level}
              points={gridPoints}
              fill="none"
              stroke="var(--color-surface-2)"
              strokeWidth="1"
              className="opacity-40"
            />
          )
        })}

        {axes.map((a) => {
          const end = polarPoint(cx, cy, r, a.angle)
          return (
            <line
              key={`axis-${a.label}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="var(--color-surface-3)"
              strokeWidth="1"
              className="opacity-60"
            />
          )
        })}

        <polygon
          points={polygonPoints}
          fill="url(#radar-fill)"
          stroke="url(#radar-stroke)"
          strokeWidth="2"
          className="transition-all duration-700"
        />

        {axes.map((a) => {
          const p = polarPoint(cx, cy, (a.pct / 100) * r, a.angle)
          return (
            <circle
              key={`dot-${a.label}`}
              cx={p.x}
              cy={p.y}
              r="4"
              fill="var(--color-paper-3)"
              stroke="url(#radar-stroke)"
              strokeWidth="2.5"
              className="transition-all duration-700"
            />
          )
        })}

        {axes.map((a) => {
          const p = polarPoint(cx, cy, (a.pct / 100) * r, a.angle)
          const lx = p.x + Math.cos((a.angle * Math.PI) / 180) * 14
          const ly = p.y + Math.sin((a.angle * Math.PI) / 180) * 14
          return (
            <text
              key={`pct-${a.label}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--color-text-secondary)] text-xs tabular-nums"
            >
              {a.pct}%
            </text>
          )
        })}

        {axes.map((a) => {
          const p = polarPoint(cx, cy, r + 26, a.angle)
          const isDominant = a.pct >= 50
          return (
            <text
              key={`label-${a.label}`}
              x={p.x}
              y={p.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={
                isDominant
                  ? "fill-[var(--color-text-primary)] text-sm font-semibold"
                  : "fill-[var(--color-text-tertiary)] text-sm font-medium"
              }
            >
              {a.label}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
