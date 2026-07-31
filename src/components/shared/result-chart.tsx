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

interface Point {
  x: number
  y: number
  pct: number
  label: string
}

type Direction = "right" | "down" | "left" | "up"

const DIRECTION_CONFIG: Record<
  Direction,
  { labelAngle: number; pctLabelDx: number; pctLabelDy: number; anchor: "start" | "middle" | "end" }
> = {
  right: { labelAngle: 0, pctLabelDx: 18, pctLabelDy: 4, anchor: "start" },
  down: { labelAngle: 90, pctLabelDx: 0, pctLabelDy: 20, anchor: "middle" },
  left: { labelAngle: 0, pctLabelDx: -18, pctLabelDy: 4, anchor: "end" },
  up: { labelAngle: 90, pctLabelDx: 0, pctLabelDy: -10, anchor: "middle" },
}

const order: Direction[] = ["right", "down", "left", "up"]

export function ResultChart({ dimensions, className }: ResultChartProps) {
  const cx = 140
  const cy = 140
  const r = 110

  const points: Record<Direction, Point> = {
    right: {
      x: cx + (dimensions[0]?.left.percentage / 100) * r,
      y: cy,
      pct: dimensions[0]?.left.percentage ?? 50,
      label: dimensions[0]?.left.label ?? "E",
    },
    down: {
      x: cx,
      y: cy + (dimensions[1]?.left.percentage / 100) * r,
      pct: dimensions[1]?.left.percentage ?? 50,
      label: dimensions[1]?.left.label ?? "S",
    },
    left: {
      x: cx - (dimensions[2]?.left.percentage / 100) * r,
      y: cy,
      pct: dimensions[2]?.left.percentage ?? 50,
      label: dimensions[2]?.left.label ?? "T",
    },
    up: {
      x: cx,
      y: cy - (dimensions[3]?.left.percentage / 100) * r,
      pct: dimensions[3]?.left.percentage ?? 50,
      label: dimensions[3]?.left.label ?? "J",
    },
  }

  const polygonPoints = order
    .map((d) => `${points[d].x},${points[d].y}`)
    .join(" ")

  const gridLevels = [0.25, 0.5, 0.75, 1]

  return (
    <div className={cn("flex w-full justify-center", className)}>
      <svg
        viewBox="0 0 280 280"
        className="h-auto w-full max-w-[340px]"
        role="img"
        aria-label={`MBTI 结果雷达图：E=${points.right.pct}% S=${points.down.pct}% T=${points.left.pct}% J=${points.up.pct}%`}
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

        {/* Grid diamonds */}
        {gridLevels.map((level) => {
          const radius = r * level
          const gridPoints = order
            .map((d) => {
              if (d === "right") return `${cx + radius},${cy}`
              if (d === "down") return `${cx},${cy + radius}`
              if (d === "left") return `${cx - radius},${cy}`
              return `${cx},${cy - radius}`
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

        {/* Axis lines */}
        {order.map((d) => {
          const ex = d === "right" ? cx + r : d === "left" ? cx - r : cx
          const ey = d === "down" ? cy + r : d === "up" ? cy - r : cy
          return (
            <line
              key={`axis-${d}`}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="var(--color-surface-3)"
              strokeWidth="1"
              className="opacity-60"
            />
          )
        })}

        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="url(#radar-fill)"
          stroke="url(#radar-stroke)"
          strokeWidth="2"
          className="transition-all duration-700"
        />

        {/* Data points */}
        {order.map((d) => (
          <circle
            key={`dot-${d}`}
            cx={points[d].x}
            cy={points[d].y}
            r="4"
            fill="var(--color-paper-3)"
            stroke="url(#radar-stroke)"
            strokeWidth="2.5"
            className="transition-all duration-700"
          />
        ))}

        {/* Percentage labels near points */}
        {order.map((d) => {
          const p = points[d]
          const cfg = DIRECTION_CONFIG[d]
          return (
            <text
              key={`pct-${d}`}
              x={p.x + cfg.pctLabelDx}
              y={p.y + cfg.pctLabelDy}
              textAnchor={cfg.anchor}
              className="fill-[var(--color-text-secondary)] text-xs tabular-nums"
              dominantBaseline="middle"
            >
              {p.pct}%
            </text>
          )
        })}

        {/* Axis end labels */}
        {order.map((d) => {
          const labelRadius = r + 22
          let lx = cx
          let ly = cy
          if (d === "right") lx = cx + labelRadius
          if (d === "down") ly = cy + labelRadius
          if (d === "left") lx = cx - labelRadius
          if (d === "up") ly = cy - labelRadius
          const leftLabel = dimensions[order.indexOf(d)]?.left.label ?? ""
          const rightLabel = dimensions[order.indexOf(d)]?.right.label ?? ""

          return (
            <text
              key={`label-${d}`}
              x={lx}
              y={ly}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-[var(--color-text-primary)] text-xs font-medium"
            >
              {leftLabel} / {rightLabel}
            </text>
          )
        })}
      </svg>
    </div>
  )
}
