import Link from "next/link"
import type { ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface GradientButtonProps extends ComponentProps<typeof Button> {
  gradient?: "primary" | "accent" | "gold"
  glow?: boolean
}

function gradientClasses({
  gradient = "primary",
  glow = true,
  className,
}: {
  gradient?: GradientButtonProps["gradient"]
  glow?: boolean
  className?: string | ((state: unknown) => string | undefined)
}) {
  return cn(
    "relative overflow-hidden border-0 font-medium text-white shadow-lg transition-all duration-300 inline-flex items-center justify-center rounded-full",
    gradient === "primary" && "gradient-primary hover:shadow-purple-500/25",
    gradient === "accent" && "gradient-accent hover:shadow-rose-500/25",
    gradient === "gold" && "bg-[#d4a853] hover:bg-[#e0b963] text-[#0a0a12]",
    glow && gradient === "primary" && "hover:shadow-[0_0_30px_rgba(124,58,237,0.3)]",
    glow && gradient === "accent" && "hover:shadow-[0_0_30px_rgba(225,29,72,0.3)]",
    glow && gradient === "gold" && "hover:shadow-[0_0_20px_rgba(212,168,83,0.25)]",
    "hover:scale-[1.02] active:scale-[0.98]",
    className
  )
}

export function GradientButton({
  gradient = "primary",
  glow = true,
  className,
  children,
  ...props
}: GradientButtonProps) {
  return (
    <Button
      className={cn(
        gradientClasses({ gradient, glow }),
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}

export function GradientLink({
  gradient = "primary",
  glow = true,
  className,
  href,
  children,
}: {
  gradient?: "primary" | "accent" | "gold"
  glow?: boolean
  className?: string
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className={gradientClasses({ gradient, glow, className })}
    >
      {children}
    </Link>
  )
}
