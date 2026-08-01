"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { PageNav } from "@/components/shared/page-nav"
import { BarChart3, Users, PieChart, Loader2 } from "lucide-react"

interface StatsData {
  totalCount: number
  typeDistribution: { typeCode: string; count: number }[]
  dimensionDistribution: {
    EI: Record<string, number>
    SN: Record<string, number>
    TF: Record<string, number>
    JP: Record<string, number>
  }
  recentTests: { id: string; typeCode: string; createdAt: string }[]
}

export function StatsPage() {
  const [stats, setStats] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => {
        if (!res.ok) throw new Error("Failed")
        return res.json()
      })
      .then((data) => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[80px]" />
      </div>

      <div className="container-page pb-20">
        <PageNav className="mb-8 mt-6" />

        <div className="mb-10 text-center">
          <GradientText as="h1" className="mb-3 text-3xl font-bold sm:text-4xl">
            数据统计
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            社区测试结果分布一览
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="mb-3 size-8 animate-spin text-[var(--color-brand-purple)]" />
            <p className="text-sm text-[var(--color-text-secondary)]">加载数据...</p>
          </div>
        ) : error || !stats ? (
          <div className="py-20 text-center">
            <p className="mb-4 text-sm text-[var(--color-text-secondary)]">数据加载失败</p>
            <button
              onClick={() => window.location.reload()}
              className="text-xs text-[var(--color-brand-cyan)] hover:underline"
            >
              点击重试
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Total */}
            <GlassCard variant="prominent" glow="purple" className="p-8 text-center">
              <Users className="mx-auto mb-3 size-8 text-[var(--color-brand-purple)]" />
              <p className="text-3xl font-bold text-white tabular-nums">{stats.totalCount.toLocaleString()}</p>
              <p className="mt-1 text-sm text-[var(--color-text-tertiary)]">累计测试次数</p>
            </GlassCard>

            {/* Type Distribution */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <PieChart className="size-4 text-[var(--color-brand-cyan)]" />
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">人格类型分布</h2>
              </div>
              <GlassCard variant="subtle" className="p-6">
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {stats.typeDistribution
                    .sort((a, b) => b.count - a.count)
                    .map((item) => {
                      const maxCount = stats.typeDistribution[0]?.count || 1
                      const barWidth = Math.max(1, (item.count / maxCount) * 100)
                      return (
                        <div key={item.typeCode} className="flex items-center gap-2">
                          <TypeBadge type={item.typeCode} size="sm" />
                          <div className="flex-1">
                            <div className="h-3 overflow-hidden rounded-full bg-white/[0.04]">
                              <div
                                className="h-full rounded-full bg-[var(--color-brand-purple)]/60 transition-all"
                                style={{ width: `${barWidth}%` }}
                              />
                            </div>
                          </div>
                          <span className="text-xs tabular-nums text-[var(--color-text-tertiary)]">{item.count}</span>
                        </div>
                      )
                    })}
                </div>
              </GlassCard>
            </section>

            {/* Dimension Distribution */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 className="size-4 text-[var(--color-brand-purple)]" />
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">维度占比</h2>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {(Object.entries(stats.dimensionDistribution) as [string, Record<string, number>][]).map(([pair, data]) => {
                  const entries = Object.entries(data)
                  const labels = { EI: ["外向 E", "内向 I"], SN: ["感觉 S", "直觉 N"], TF: ["思考 T", "情感 F"], JP: ["判断 J", "感知 P"] }
                  const [leftLabel, rightLabel] = labels[pair as keyof typeof labels] || [entries[0]?.[0] || "", entries[1]?.[0] || ""]
                  const leftVal = entries[0]?.[1] || 0
                  const rightVal = entries[1]?.[1] || 0
                  return (
                    <GlassCard key={pair} variant="subtle" className="p-5">
                      <h3 className="mb-3 text-xs font-semibold text-[var(--color-text-tertiary)]">
                        {pair === "EI" ? "精力来源" : pair === "SN" ? "认知方式" : pair === "TF" ? "决策方式" : "生活态度"}
                      </h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--color-text-secondary)]">{leftLabel}</span>
                          <span className="tabular-nums text-[var(--color-brand-purple)]">{leftVal}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full bg-[var(--gradient-primary)] transition-all" style={{ width: `${leftVal}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-[var(--color-text-secondary)]">{rightLabel}</span>
                          <span className="tabular-nums text-[var(--color-brand-cyan)]">{rightVal}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
                          <div className="h-full rounded-full bg-[var(--gradient-accent)] transition-all" style={{ width: `${rightVal}%` }} />
                        </div>
                      </div>
                    </GlassCard>
                  )
                })}
              </div>
            </section>

            {/* Recent Tests */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Users className="size-4 text-[var(--color-brand-gold)]" />
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">最近公开测试</h2>
              </div>
              <GlassCard variant="subtle" className="p-4">
                {stats.recentTests.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[var(--color-text-tertiary)]">暂无公开测试记录</p>
                ) : (
                  <div className="grid gap-2 sm:grid-cols-2">
                    {stats.recentTests.map((t) => (
                      <Link
                        key={t.id}
                        href={`/types/${t.typeCode}`}
                        className="flex items-center justify-between rounded-lg p-3 text-xs transition-colors hover:bg-white/[0.02]"
                      >
                        <TypeBadge type={t.typeCode} size="sm" />
                        <span className="tabular-nums text-[var(--color-text-tertiary)]">
                          {new Date(t.createdAt).toLocaleDateString("zh-CN")}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </GlassCard>
            </section>

            <section className="pt-4 text-center">
              <GradientLink href="/test" glow className="px-10 py-5 text-lg">
                开始你的测试
              </GradientLink>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
