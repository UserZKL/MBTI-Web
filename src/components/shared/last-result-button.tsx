"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { History } from "lucide-react"

interface LocalHistoryItem {
  typeCode: string
  typeName: string
  createdAt: string
  data: string
}

export function LastResultButton() {
  const [last, setLast] = useState<LocalHistoryItem | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const raw = localStorage.getItem("mbti-history")
        if (!raw) return
        const list = JSON.parse(raw) as LocalHistoryItem[]
        if (list.length > 0) setLast(list[0])
      } catch {
        /* ignore */
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!last) return null

  return (
    <Link
      href={`/result?data=${encodeURIComponent(last.data)}`}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-6 py-3 text-sm text-[var(--color-text-secondary)] backdrop-blur transition-all duration-300 hover:border-[var(--color-brand-gold)]/40 hover:text-white"
    >
      <History className="size-4" />
      查看上次结果 · {last.typeName}
    </Link>
  )
}
