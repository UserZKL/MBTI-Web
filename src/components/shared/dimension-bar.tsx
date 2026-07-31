import { cn } from "@/lib/utils"

interface DimensionBarProps {
  left: {
    label: string
    value: number
    percentage: number
  }
  right: {
    label: string
    value: number
    percentage: number
  }
  className?: string
}

export function DimensionBar({ left, right, className }: DimensionBarProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-[var(--color-text-secondary)]">
          {left.label}
        </span>
        <span className="font-medium text-[var(--color-text-secondary)]">
          {right.label}
        </span>
      </div>
      <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]">
        <div
          className="h-full rounded-l-full gradient-primary-horizontal transition-all duration-700 ease-out"
          style={{ width: `${left.percentage}%` }}
        />
        <div className="mx-px h-full w-px bg-[var(--color-paper)]" />
        <div
          className="h-full flex-1 rounded-r-full bg-[var(--color-surface-3)] transition-all duration-700 ease-out"
        />
      </div>
      <div className="mt-1 flex items-center justify-between text-[10px] tabular-nums">
        <span className="text-[var(--color-text-tertiary)]">
          {left.value} 分 · {left.percentage}%
        </span>
        <span className="text-[var(--color-text-tertiary)]">
          {right.percentage}% · {right.value} 分
        </span>
      </div>
    </div>
  )
}
