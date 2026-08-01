"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Home } from "lucide-react"

interface PageNavProps {
  className?: string
}

export function PageNav({ className }: PageNavProps) {
  const router = useRouter()
  const [canGoBack, setCanGoBack] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanGoBack(window.history.length > 1)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  return (
    <nav
      className={`flex flex-wrap items-center gap-4 text-sm text-[var(--color-text-tertiary)] ${className ?? ""}`}
      aria-label="页面导航"
    >
      {canGoBack && (
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          返回
        </button>
      )}
      <Link href="/" className="inline-flex items-center gap-1.5 transition-colors hover:text-white">
        <Home className="size-3.5" aria-hidden="true" />
        首页
      </Link>
    </nav>
  )
}
