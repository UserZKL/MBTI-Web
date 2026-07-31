"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { Button } from "@/components/ui/button"
import { History, Settings, LogOut, TrendingUp, TestTube, ChevronRight, Loader2 } from "lucide-react"

interface UserInfo {
  id?: string
  name?: string | null
  email?: string | null
}

interface HistoryEntry {
  id: string
  typeCode: string
  createdAt: string
  isPublic: boolean
}

interface ProfileClientProps {
  user: UserInfo | null
}

const TYPE_NAMES: Record<string, string> = {
  INTJ: "建筑师", INTP: "逻辑学家", ENTJ: "指挥官", ENTP: "辩论家",
  INFJ: "提倡者", INFP: "调停者", ENFJ: "主人公", ENFP: "竞选者",
  ISTJ: "物流师", ISFJ: "守卫者", ESTJ: "总经理", ESFJ: "执政官",
  ISTP: "鉴赏家", ISFP: "探险家", ESTP: "企业家", ESFP: "表演者",
}

export function ProfileClient({ user }: ProfileClientProps) {
  const [history, setHistory] = useState<HistoryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    if (user) {
      fetch("/api/profile/history?limit=20")
        .then((r) => r.json())
        .then((data) => {
          setHistory(data.results ?? [])
          setTotal(data.total ?? 0)
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    }
  }, [user])

  const uniqueTypes = new Set(history.map((h) => h.typeCode)).size
  const typeChanges = history.length > 1
    ? history.filter((h, i, arr) => i > 0 && h.typeCode !== arr[i - 1]?.typeCode).length
    : 0

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 pb-20">
        <div className="flex items-center justify-between py-6">
          <Link
            href="/"
            className="text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
          >
            返回首页
          </Link>
          {user && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                aria-label="设置"
                className="border border-white/8 bg-white/[0.02] text-[var(--color-text-secondary)]"
              >
                <Settings className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="退出登录"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border border-white/8 bg-white/[0.02] text-[var(--color-text-tertiary)]"
              >
                <LogOut className="size-3.5" />
              </Button>
            </div>
          )}
        </div>

        {/* User Card */}
        <GlassCard variant="prominent" glow="purple" className="mb-8 p-8 text-center">
          {user ? (
            <>
              <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[var(--gradient-primary)] text-xl font-bold text-white shadow-lg">
                {user.name?.[0] ?? user.email?.[0] ?? "?"}
              </div>
              <h1 className="mb-1 text-xl font-semibold text-[var(--color-text-primary)]">
                {user.name ?? "用户"}
              </h1>
              {user.email && (
                <p className="mb-2 text-sm text-[var(--color-text-secondary)]">
                  {user.email}
                </p>
              )}
              <p className="mb-5 text-sm text-[var(--color-text-secondary)]">
                已完成 {total} 次测试
              </p>
            </>
          ) : (
            <>
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
            </>
          )}
        </GlassCard>

        {/* Test History */}
        {user && (
          <section className="mb-8">
            <div className="mb-4 flex items-center gap-2">
              <History className="size-4 text-[var(--color-brand-cyan)]" />
              <h2 className="text-base font-semibold text-[var(--color-text-primary)]">测试记录</h2>
            </div>

            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-5 animate-spin text-[var(--color-text-secondary)]" />
              </div>
            ) : history.length === 0 ? (
              <p className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
                暂无测试记录
              </p>
            ) : (
              <ul className="space-y-2">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <GlassCard variant="subtle" hover className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <TypeBadge type={entry.typeCode} size="sm" />
                        <div>
                          <p className="text-sm text-[var(--color-text-primary)]">
                            {TYPE_NAMES[entry.typeCode] ?? entry.typeCode}
                          </p>
                          <p className="text-xs text-[var(--color-text-tertiary)]">
                            {new Date(entry.createdAt).toLocaleDateString("zh-CN")}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-[var(--color-text-tertiary)]" />
                    </GlassCard>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <TestTube className="mb-2 size-5 text-[var(--color-brand-purple)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
              {total}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">已完成测试</p>
          </GlassCard>

          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <TrendingUp className="mb-2 size-5 text-[var(--color-brand-cyan)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
              {uniqueTypes}
            </p>
            <p className="text-xs text-[var(--color-text-tertiary)]">不同类型</p>
          </GlassCard>

          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <History className="mb-2 size-5 text-[var(--color-brand-gold)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
              {typeChanges}
            </p>
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
