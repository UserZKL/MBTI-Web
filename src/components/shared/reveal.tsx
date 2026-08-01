"use client"

import { useInView } from "@/hooks/use-in-view"
import { cn } from "@/lib/utils"

interface RevealProps {
  children: React.ReactNode
  direction?: "up" | "left" | "right"
  delay?: number
  className?: string
  as?: "div" | "section" | "li" | "h2" | "h3" | "p"
}

export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>()
  const Tag = as as "div"

  return (
    <Tag
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(
        "transition-all duration-700 ease-out will-change-transform motion-reduce:transition-none",
        inView
          ? "translate-x-0 translate-y-0 opacity-100"
          : direction === "left"
            ? "translate-x-10 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
            : direction === "right"
              ? "-translate-x-10 opacity-0 motion-reduce:translate-x-0 motion-reduce:opacity-100"
              : "translate-y-10 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className
      )}
    >
      {children}
    </Tag>
  )
}
