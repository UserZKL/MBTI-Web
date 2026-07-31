import { cn } from "@/lib/utils"

interface GradientTextProps {
  children: React.ReactNode
  variant?: "primary" | "accent"
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "span" | "p"
  className?: string
}

export function GradientText({
  children,
  variant = "primary",
  as: Tag = "span",
  className,
}: GradientTextProps) {
  return (
    <Tag
      className={cn(
        variant === "primary" ? "gradient-text" : "gradient-text-accent",
        className
      )}
    >
      {children}
    </Tag>
  )
}
