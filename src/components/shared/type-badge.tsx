import { cn } from "@/lib/utils"

interface TypeBadgeProps {
  type: string
  size?: "sm" | "md" | "lg"
  clickable?: boolean
  className?: string
  onClick?: () => void
}

export function TypeBadge({
  type,
  size = "md",
  clickable = false,
  className,
  onClick,
}: TypeBadgeProps) {
  const sizes = {
    sm: "text-xs px-2.5 py-0.5 rounded-md tracking-widest",
    md: "text-sm px-3.5 py-1 rounded-lg tracking-[0.15em]",
    lg: "text-lg px-5 py-2 rounded-xl tracking-[0.2em] font-bold",
  }

  const Comp = clickable ? "button" : "span"

  return (
    <Comp
      className={cn(
        "inline-flex items-center font-mono font-semibold",
        "bg-[var(--color-accent)] text-[var(--accent-foreground)]",
        "ring-1 ring-white/5",
        sizes[size],
        clickable &&
          "cursor-pointer transition-all duration-200 hover:bg-[var(--color-brand-purple)]/25 hover:ring-white/10",
        className
      )}
      onClick={onClick}
      type={clickable ? "button" : undefined}
    >
      {type}
    </Comp>
  )
}
