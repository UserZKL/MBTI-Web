import { cn } from "@/lib/utils"

type GlassVariant = "subtle" | "default" | "prominent"

const glassMap: Record<GlassVariant, string> = {
  subtle: "glass-subtle",
  default: "glass-default",
  prominent: "glass-prominent",
}

interface GlassCardProps extends React.ComponentProps<"div"> {
  variant?: GlassVariant
  hover?: boolean
  glow?: "purple" | "gold" | "cyan" | "none"
}

export function GlassCard({
  variant = "default",
  hover = false,
  glow = "none",
  className,
  children,
  ...props
}: GlassCardProps) {
  return (
    <div
      className={cn(
        glassMap[variant],
        "rounded-2xl",
        hover && "transition-all duration-300 hover:scale-[1.02] hover:border-white/15",
        glow === "purple" && "glow-purple",
        glow === "gold" && "glow-gold",
        glow === "cyan" && "glow-cyan",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
