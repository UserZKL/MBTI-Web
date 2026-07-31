import Link from "next/link"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { Button } from "@/components/ui/button"
import { History, Settings, LogOut, TrendingUp, TestTube, ChevronRight } from "lucide-react"

const MOCK_HISTORY = [
  { date: "2026-07-29", type: "INTJ", typeName: "建筑师" },
  { date: "2026-07-15", type: "INTP", typeName: "逻辑学家" },
  { date: "2026-06-20", type: "INTJ", typeName: "建筑师" },
]

export function ProfilePage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-20">
        {/* Header */}
        <div className="flex items-center justify-between py-6">
          <Link
            href="/"
            className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
          >
            返回首页
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              aria-label="设置"
              className="border border-white/8 bg-white/[0.02] text-[var(--color-text-secondary)]"
            >
              <Settings className="size-3.5" aria-hidden="true" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="退出登录"
              className="border border-white/8 bg-white/[0.02] text-[var(--color-text-tertiary)]"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* User Card */}
        <GlassCard variant="prominent" glow="purple" className="mb-8 p-8 text-center">
          <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-xl font-bold text-white shadow-lg">
            ?
          </div>
          <h1 className="mb-1 text-xl font-semibold text-[var(--color-text-primary)]">
            未登录用户
          </h1>
          <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
            登录后可保存测试记录和完整报告
          </p>
          <GradientLink href="/login" glow>
            立即登录
          </GradientLink>
        </GlassCard>

        {/* Test History */}
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="size-4 text-[var(--color-brand-cyan)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">测试记录</h2>
          </div>

          <ul className="space-y-2">
            {MOCK_HISTORY.map((entry, i) => (
              <li key={i}>
                <GlassCard variant="subtle" hover className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <TypeBadge type={entry.type} size="sm" />
                    <div>
                      <p className="text-sm text-[var(--color-text-primary)]">{entry.typeName}</p>
                      <p className="text-xs text-[var(--color-text-tertiary)]">{entry.date}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-[var(--color-text-tertiary)]" aria-hidden="true" />
                </GlassCard>
              </li>
            ))}
          </ul>
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <TestTube className="mb-2 size-5 text-[var(--color-brand-purple)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">3</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">已完成测试</p>
          </GlassCard>

          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <TrendingUp className="mb-2 size-5 text-[var(--color-brand-cyan)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">1</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">主要类型</p>
          </GlassCard>

          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <History className="mb-2 size-5 text-[var(--color-brand-gold)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">2</p>
            <p className="text-xs text-[var(--color-text-tertiary)]">类型变化</p>
          </GlassCard>
        </section>

        {/* Quick Actions */}
        <section>
          <GradientLink href="/test" className="w-full" glow>
            再次测试
          </GradientLink>
        </section>
      </div>
    </div>
  )
}
