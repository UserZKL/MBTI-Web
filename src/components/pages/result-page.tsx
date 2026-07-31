"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientButton, GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { DimensionBar } from "@/components/shared/dimension-bar"
import { ResultChart } from "@/components/shared/result-chart"
import { TypeBadge } from "@/components/shared/type-badge"
import { calculateResult, getPersonalityTypeData, type Answer } from "@/lib/mbti-utils"
import { type MbtiResult } from "@/lib/mbti-utils"
import { Share2, RefreshCw, Users, Briefcase, Heart, TrendingUp } from "lucide-react"

export function ResultPage() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")

  let result: MbtiResult | null = null
  if (dataParam) {
    try {
      const answers: Answer[] = JSON.parse(atob(dataParam))
      result = calculateResult(answers)
    } catch {
      // invalid data
    }
  }

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-sm text-[var(--color-text-secondary)]">无效的结果数据，请重新测试</p>
        <Link href="/test" className="mt-4">
          <GradientButton>重新测试</GradientButton>
        </Link>
      </div>
    )
  }

  const typeData = getPersonalityTypeData(result.type)
  const confidenceLabel =
    result.confidence >= 70 ? "高度确定" : result.confidence >= 40 ? "比较确定" : "边缘型"

  return (
    <div className="relative min-h-screen overflow-x-clip pb-24">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 right-0 h-[500px] w-[500px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-10">
        {/* Type Header */}
        <section className="mb-10 text-center">
          <TypeBadge type={result.type} size="lg" className="mb-4" />
          <GradientText as="h1" className="mb-3 text-3xl font-bold sm:text-4xl">
            {result.typeName}
          </GradientText>
          <p className="mx-auto max-w-md text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {typeData?.description ?? "你是一个独特而复杂的人，拥有自己的思维方式和行为模式。"}
          </p>
          <p className="mt-3 text-xs text-[var(--color-text-tertiary)]">
            置信度：{result.confidence}% · {confidenceLabel}
          </p>
        </section>

        {/* Dimension Scores */}
        <section className="mb-10">
          <h2 className="mb-5 text-lg font-semibold text-[var(--color-text-primary)]">
            维度得分
          </h2>
          <GlassCard variant="default" className="p-6">
            <ResultChart
              dimensions={result.dimensions.map((dim) => ({
                code: dim.code,
                left: { label: dim.left.dimension, percentage: dim.left.percentage },
                right: { label: dim.right.dimension, percentage: dim.right.percentage },
              }))}
              className="mb-6"
            />
            <div className="space-y-4 border-t border-white/[0.06] pt-5">
              {result.dimensions.map((dim) => (
                <DimensionBar
                  key={dim.code}
                  left={{
                    label: dim.left.dimension,
                    value: dim.left.score,
                    percentage: dim.left.percentage,
                  }}
                  right={{
                    label: dim.right.dimension,
                    value: dim.right.score,
                    percentage: dim.right.percentage,
                  }}
                />
              ))}
            </div>
          </GlassCard>
        </section>

        {/* Strengths & Weaknesses */}
        {typeData && (
          <section className="mb-10 grid gap-5 sm:grid-cols-2">
            <GlassCard variant="subtle" className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="size-4 text-[var(--color-success)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">你的优势</h3>
              </div>
              <ul className="space-y-2">
                {typeData.strengths.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-brand-cyan)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard variant="subtle" className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <RefreshCw className="size-4 text-[var(--color-brand-amber)]" />
                <h3 className="text-sm font-semibold text-[var(--color-text-primary)]">成长空间</h3>
              </div>
              <ul className="space-y-2">
                {typeData.weaknesses.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-brand-amber)]" />
                    {s}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>
        )}

        {/* Career */}
        {typeData && (
          <section className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <Briefcase className="size-4 text-[var(--color-brand-purple)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">职业方向</h2>
            </div>
            <GlassCard variant="subtle" className="p-6">
              <div className="flex flex-wrap gap-2">
                {typeData.careers.map((c) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-xs text-[var(--color-text-secondary)]"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* Relationships */}
        {typeData && (
          <section className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <Heart className="size-4 text-[var(--color-brand-rose)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">人际关系</h2>
            </div>
            <GlassCard variant="subtle" className="space-y-4 p-6">
              {Object.entries(typeData.relationships).map(([key, val]) => (
                <div key={key}>
                  <h3 className="mb-1 text-xs font-medium text-[var(--color-brand-gold)]">
                    {key === "romantic" ? "亲密关系" : key === "friendship" ? "朋友相处" : "职场互动"}
                  </h3>
                  <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{val}</p>
                </div>
              ))}
            </GlassCard>
          </section>
        )}

        {/* Growth */}
        {typeData && (
          <section className="mb-10">
            <div className="mb-5 flex items-center gap-2">
              <Users className="size-4 text-[var(--color-brand-cyan)]" />
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">成长建议</h2>
            </div>
            <GlassCard variant="subtle" className="p-6">
              <ul className="space-y-2">
                {typeData.growth.map((g) => (
                  <li key={g} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                    <span className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-success)]" />
                    {g}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </section>
        )}

        {/* Action Buttons */}
        <section className="flex flex-col items-center gap-3 pb-10 sm:flex-row sm:justify-center">
          <GradientLink
            href="/types"
            className="bg-white/[0.02] text-[var(--color-text-secondary)]"
          >
            查看所有类型
          </GradientLink>
          <GradientLink href="/test" glow>
            再测一次
          </GradientLink>
          <GradientLink
            href={`/share/${result.type}`}
            gradient="gold"
            glow
            className="flex items-center gap-2"
          >
            <Share2 className="size-4" />
            分享结果
          </GradientLink>
        </section>
      </div>
    </div>
  )
}
