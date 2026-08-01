import { Suspense } from "react"
import { LoginPageClient } from "@/components/pages/login-page"

export default function LoginRoute() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><p className="text-sm text-[var(--color-text-secondary)]">加载中...</p></div>}>
      <LoginPageClient />
    </Suspense>
  )
}
