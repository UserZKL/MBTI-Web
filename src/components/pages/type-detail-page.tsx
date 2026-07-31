import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientButton, GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getPersonalityTypeData, getAllPersonalityTypes } from "@/lib/mbti-utils"
import { TrendingUp, Briefcase, Heart, Users, ArrowLeft } from "lucide-react"

interface TypeDetailPageProps {
  code: string
}

export function TypeDetailPage({ code }: TypeDetailPageProps) {
  const typeData = getPersonalityTypeData(code)
  const allTypes = getAllPersonalityTypes()
  const t = allTypes.find((x) => x.code === code)

  if (!t || !typeData) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center px-4">
        <p className="text-sm text-[var(--color-text-secondary)]">未找到该人格类型</p>
        <Link href="/types" className="mt-4">
          <GradientButton variant="outline">返回列表</GradientButton>
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-20 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-gold)]/2 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-3xl px-4 pb-20">
        <Link
          href="/types"
          className="mb-8 mt-6 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3" />
          返回所有类型
        </Link>

        {/* Header */}
        <section className="mb-10 text-center">
          <TypeBadge type={t.code} size="lg" className="mb-4" />
          <GradientText as="h1" className="mb-2 text-3xl font-bold sm:text-4xl">
            {t.name}
          </GradientText>
          <p className="text-sm text-[var(--color-brand-gold)]">{t.nickname}</p>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {t.description}
          </p>
        </section>

        {/* Cognitive Functions */}
        {t.traits.cognitiveFunctions && t.traits.cognitiveFunctions.length > 0 && (
          <section className="mb-10">
            <GlassCard variant="subtle" className="p-6">
              <h2 className="mb-4 text-sm font-semibold text-[var(--color-text-primary)]">
                认知功能
              </h2>
              <div className="flex flex-wrap gap-2">
                {t.traits.cognitiveFunctions.map((cf: string) => (
                  <span
                    key={cf}
                    className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-[var(--color-brand-cyan)]"
                  >
                    {cf}
                  </span>
                ))}
              </div>
            </GlassCard>
          </section>
        )}

        {/* Strengths & Weaknesses */}
        <section className="mb-10 grid gap-5 sm:grid-cols-2">
          <GlassCard variant="subtle" className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <TrendingUp className="size-4 text-[var(--color-success)]" />
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">优势</h2>
            </div>
            <ul className="space-y-1.5">
              {typeData.strengths.map((s) => (
                <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-[var(--color-brand-cyan)]" />
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
          <GlassCard variant="subtle" className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-xs">⚠</span>
              <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">待成长</h2>
            </div>
            <ul className="space-y-1.5">
              {typeData.weaknesses.map((s) => (
                <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-[var(--color-brand-amber)]" />
                  {s}
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* Career */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Briefcase className="size-4 text-[var(--color-brand-purple)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">适合职业</h2>
          </div>
          <GlassCard variant="subtle" className="p-5">
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

        {/* Relationships */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Heart className="size-4 text-[var(--color-brand-rose)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">人际关系</h2>
          </div>
          <GlassCard variant="subtle" className="space-y-4 p-5">
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

        {/* Growth */}
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Users className="size-4 text-[var(--color-brand-cyan)]" />
            <h2 className="text-base font-semibold text-[var(--color-text-primary)]">成长建议</h2>
          </div>
          <GlassCard variant="subtle" className="p-5">
            <ul className="space-y-2">
              {typeData.growth.map((g) => (
                <li key={g} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                  <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-[var(--color-success)]" />
                  {g}
                </li>
              ))}
            </ul>
          </GlassCard>
        </section>

        {/* CTA */}
        <section className="text-center">
          <GradientLink href="/test" glow>
            开始你的测试
          </GradientLink>
        </section>
      </div>
    </div>
  )
}
