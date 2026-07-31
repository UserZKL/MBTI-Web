import { Suspense } from "react"
import { ResultPage } from "@/components/pages/result-page"

export const dynamic = "force-dynamic"

export default function ResultRoute() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-sm text-[var(--color-text-secondary)]">加载中...</p></div>}>
      <ResultPage />
    </Suspense>
  )
}
