"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { Home, ArrowLeft } from "lucide-react"
import { useTestNav } from "@/components/shared/test-nav-context"

const EXCLUDED_PATHS = ["/blog", "/compare", "/stats"]

function isExcluded(pathname: string) {
  if (pathname === "/blog" || pathname === "/compare" || pathname === "/stats") return true
  return pathname.startsWith("/blog/")
}

export function HomeButton() {
  const pathname = usePathname()
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)
  const { backHandler, backLabel } = useTestNav()

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanGoBack(window.history.length > 1)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (pathname === "/" || isExcluded(pathname) || EXCLUDED_PATHS.includes(pathname)) return null

  const isTestPage = pathname === "/test"
  const isResultPage = pathname === "/result"
  const showBack = isResultPage ? false : isTestPage ? true : canGoBack
  const backAriaLabel = isTestPage && backLabel ? backLabel : "返回上一页"

  return (
    <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
      {showBack && (
        <button
          onClick={() => {
            if (backHandler) backHandler()
            else router.back()
          }}
          aria-label={backAriaLabel}
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
