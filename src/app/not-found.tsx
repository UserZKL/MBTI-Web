import Link from "next/link"
import { Globe } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-20 items-center justify-center rounded-full bg-[var(--color-surface-2)]">
        <Globe className="size-8 text-[var(--color-text-tertiary)]" />
      </div>
      <h1 className="mb-2 text-4xl font-bold text-[var(--color-text-primary)]">404</h1>
      <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
        页面未找到
      </p>
      <p className="mb-8 text-xs text-[var(--color-text-tertiary)]">
        你访问的页面不存在或已移除
      </p>
      <Link
        href="/"
        className="rounded-lg border border-white/8 bg-white/[0.02] px-5 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-white/15 hover:text-white"
      >
        返回首页
      </Link>
    </div>
  )
}
