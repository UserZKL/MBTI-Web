"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { History, Settings, LogOut, TrendingUp, TestTube, ChevronRight, Loader2 } from "lucide-react"
import { readLocalHistory, type LocalHistoryItem } from "@/lib/local-history"

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

interface ResultDetail {
  id: string
  typeCode: string
  scores: Record<string, number>
  report?: string | null
  createdAt: string
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
  const [error, setError] = useState<string | null>(null)
  const [total, setTotal] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [detail, setDetail] = useState<ResultDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [localHistory, setLocalHistory] = useState<LocalHistoryItem[]>([])

  useEffect(() => {
    if (user) {
      fetch("/api/profile/history?limit=20")
        .then(async (r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`)
          return r.json()
        })
        .then((data) => {
          setHistory(data.results ?? [])
          setTotal(data.total ?? 0)
        })
        .catch(() => setError("加载测试记录失败，请稍后重试"))
        .finally(() => setLoading(false))
    } else {
      const timer = setTimeout(() => {
        setLocalHistory(readLocalHistory())
        setLoading(false)
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [user])

  const displayHistory = user ? history : localHistory
  const displayTotal = user ? total : localHistory.length
  const uniqueTypes = new Set(displayHistory.map((h) => h.typeCode)).size
  const typeChanges = displayHistory.length > 1
    ? displayHistory.filter((h, i, arr) => i > 0 && h.typeCode !== arr[i - 1]?.typeCode).length
    : 0

  const handleOpenDetail = async (id: string) => {
    setSelectedId(id)
    setDetail(null)
    setDetailError(null)
    setDetailLoading(true)
    try {
      const res = await fetch(`/api/result/${id}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as ResultDetail
      setDetail(data)
    } catch {
      setDetailError("加载详情失败，请稍后重试")
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,rgba(124,58,237,0)_70%)]" />
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
        <section className="mb-8">
          <div className="mb-4 flex items-center gap-2">
            <History className="size-4 text-[var(--color-brand-cyan)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
              {user ? "测试记录" : "本地测试记录"}
            </h2>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-[var(--color-text-secondary)]" />
            </div>
          ) : error ? (
            <p className="py-8 text-center text-sm text-red-400">{error}</p>
          ) : displayHistory.length === 0 ? (
            <p className="py-8 text-center text-sm text-[var(--color-text-tertiary)]">
              {user ? "暂无测试记录" : "还没有测试记录，完成一次测试后会自动保存到这里"}
            </p>
          ) : user ? (
            <ul className="space-y-2">
              {history.map((entry) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => handleOpenDetail(entry.id)}
                    className="w-full text-left"
                    aria-label={`查看 ${TYPE_NAMES[entry.typeCode] ?? entry.typeCode} 测试详情`}
                  >
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
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="space-y-2">
              {localHistory.map((entry) => (
                <li key={entry.data}>
                  <Link
                    href={`/result?data=${encodeURIComponent(entry.data)}`}
                    className="block w-full"
                    aria-label={`查看 ${TYPE_NAMES[entry.typeCode] ?? entry.typeCode} 测试结果`}
                  >
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
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Stats */}
        <section className="mb-8 grid gap-4 sm:grid-cols-3">
          <GlassCard variant="subtle" className="flex flex-col items-center p-5 text-center">
            <TestTube className="mb-2 size-5 text-[var(--color-brand-purple)]" />
            <p className="text-lg font-bold text-[var(--color-text-primary)] tabular-nums">
              {displayTotal}
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

      {/* Result Detail Dialog */}
      <Dialog
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null)
        }}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>测试详情</DialogTitle>
            <DialogDescription>
              {detail
                ? `${TYPE_NAMES[detail.typeCode] ?? detail.typeCode} · ${new Date(detail.createdAt).toLocaleDateString("zh-CN")}`
                : "加载中"}
            </DialogDescription>
          </DialogHeader>

          {detailLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="size-5 animate-spin text-[var(--color-text-secondary)]" />
            </div>
          )}

          {detailError && (
            <p className="py-4 text-center text-sm text-red-400">{detailError}</p>
          )}

          {detail && !detailLoading && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <TypeBadge type={detail.typeCode} size="md" />
                <span className="text-base font-semibold text-[var(--color-text-primary)]">
                  {TYPE_NAMES[detail.typeCode] ?? detail.typeCode}
                </span>
              </div>

              <div className="space-y-2">
                {Object.entries(detail.scores ?? {}).map(([dim, score]) => (
                  <div key={dim} className="flex items-center justify-between rounded-lg bg-white/[0.03] px-4 py-2">
                    <span className="text-xs text-[var(--color-text-secondary)]">{dim}</span>
                    <span className="text-sm font-medium text-[var(--color-text-primary)] tabular-nums">
                      {score}
                    </span>
                  </div>
                ))}
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-[var(--color-text-primary)]">
                  AI 深度报告
                </p>
                {detail.report ? (
                  <div className="max-h-60 overflow-y-auto whitespace-pre-wrap rounded-lg bg-white/[0.03] p-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                    {detail.report}
                  </div>
                ) : (
                  <p className="text-xs text-[var(--color-text-tertiary)]">
                    暂无报告，可在结果页点击「生成 AI 报告」
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
