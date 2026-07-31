import { cn } from "@/lib/utils"

interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  label?: string
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "accent"
  className?: string
}

export function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  label,
  size = "md",
  variant = "primary",
  className,
}: ProgressBarProps) {
  const percentage = Math.round((value / max) * 100)
  const labelText = label ?? `${percentage}%`

  const heights = { sm: "h-1.5", md: "h-2.5", lg: "h-4" }

  return (
    <div className={cn("w-full", className)}>
      {(showLabel || label) && (
        <div className="mb-1.5 flex items-center justify-between">
          {label && (
            <span className="text-xs text-[var(--color-text-secondary)]">
              {label}
            </span>
          )}
          <span className="text-xs font-medium text-[var(--color-text-secondary)] tabular-nums">
            {labelText}
          </span>
        </div>
      )}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-[var(--color-surface-2)]",
          heights[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            variant === "primary" ? "gradient-primary-horizontal" : "gradient-accent"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
