"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home } from "lucide-react"

export function HomeButton() {
  const pathname = usePathname()

  if (pathname === "/") return null

  return (
    <Link
      href="/"
      aria-label="返回首页"
      className="fixed bottom-6 left-6 z-50 flex size-12 items-center justify-center rounded-full border border-white/10 bg-[var(--color-paper-3)]/80 text-[var(--color-text-secondary)] shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--color-brand-gold)]/40 hover:text-[var(--color-brand-gold)] active:scale-95"
    >
      <Home className="size-5" aria-hidden="true" />
    </Link>
  )
}
