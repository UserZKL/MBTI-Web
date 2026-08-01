"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"

export function HomeButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanGoBack(window.history.length > 1)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (pathname === "/") return null

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      {canGoBack && (
        <button
          onClick={() => router.back()}
          aria-label="返回上一页"
          className="flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-[var(--color-paper-3)]/80 px-4 text-sm text-[var(--color-text-secondary)] shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--color-brand-cyan)]/40 hover:text-[var(--color-brand-cyan)] active:scale-95"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          返回
        </button>
      )}
      <Link
        href="/"
        aria-label="返回首页"
        className="flex h-11 items-center gap-1.5 rounded-full border border-white/10 bg-[var(--color-paper-3)]/80 px-4 text-sm text-[var(--color-text-secondary)] shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-105 hover:border-[var(--color-brand-gold)]/40 hover:text-[var(--color-brand-gold)] active:scale-95"
      >
        <Home className="size-4" aria-hidden="true" />
        首页
      </Link>
    </div>
  )
}
