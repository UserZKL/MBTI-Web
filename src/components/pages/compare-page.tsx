"use client"

import { useState } from "react"
import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getAllPersonalityTypes, type PersonalityTypeData } from "@/lib/mbti-utils"
import { ArrowLeft, ArrowRightLeft, Check } from "lucide-react"

const allTypes = getAllPersonalityTypes()

interface CompareRow {
  label: string
  getValue: (t: PersonalityTypeData) => string
  highlight?: boolean
}

const COMPARE_ROWS: CompareRow[] = [
  { label: "类型代码", getValue: (t) => t.code, highlight: true },
  { label: "昵称", getValue: (t) => t.nickname },
  { label: "核心描述", getValue: (t) => t.description },
  { label: "沟通风格", getValue: (t) => (t.traits.communicationStyle as string) || "" },
  { label: "压力反应", getValue: (t) => (t.traits.stressResponse as string) || "" },
  { label: "学习风格", getValue: (t) => (t.traits.learningStyle as string) || "" },
]

export function ComparePage() {
  const [selectedA, setSelectedA] = useState<string>("")
  const [selectedB, setSelectedB] = useState<string>("")
  const [showResult, setShowResult] = useState(false)

  const typeA = allTypes.find((t) => t.code === selectedA)
  const typeB = allTypes.find((t) => t.code === selectedB)

  const canCompare = selectedA && selectedB && selectedA !== selectedB

  function handleCompare() {
    if (canCompare) setShowResult(true)
  }

  function getStrengthsOverlap(ta: PersonalityTypeData, tb: PersonalityTypeData) {
    const setA = new Set(ta.strengths)
    return tb.strengths.filter((s) => setA.has(s))
  }

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[80px]" />
      </div>

      <div className="mx-auto max-w-4xl px-4 pb-20">
        <Link
          href="/types"
          className="mb-8 mt-6 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3" />
          返回类型列表
        </Link>

        <div className="mb-10 text-center">
          <GradientText as="h1" className="mb-3 text-3xl font-bold sm:text-4xl">
            类型对比
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            选择两种 MBTI 人格类型，并排查看它们的异同
          </p>
        </div>

        {/* Selectors */}
        <div className="mb-8 grid items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
          <div>
            <label htmlFor="typeA" className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
              类型 A
            </label>
            <select
              id="typeA"
              value={selectedA}
              onChange={(e) => { setSelectedA(e.target.value); setShowResult(false) }}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand-purple)] focus:outline-none"
            >
              <option value="" disabled>选择人格类型...</option>
              {allTypes.map((t) => (
                <option key={t.code} value={t.code}>{t.code} · {t.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-center">
            <ArrowRightLeft className="size-5 text-[var(--color-text-tertiary)]" />
          </div>

          <div>
            <label htmlFor="typeB" className="mb-2 block text-xs font-medium text-[var(--color-text-secondary)]">
              类型 B
            </label>
            <select
              id="typeB"
              value={selectedB}
              onChange={(e) => { setSelectedB(e.target.value); setShowResult(false) }}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-[var(--color-text-primary)] focus:border-[var(--color-brand-cyan)] focus:outline-none"
            >
              <option value="" disabled>选择人格类型...</option>
              {allTypes.map((t) => (
                <option key={t.code} value={t.code}>{t.code} · {t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Compare Button */}
        <div className="mb-10 text-center">
          <button
            onClick={handleCompare}
            disabled={!canCompare}
            className="inline-flex items-center gap-2 rounded-lg bg-white/[0.04] px-6 py-3 text-sm font-medium text-[var(--color-text-primary)] transition-all hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowRightLeft className="size-4" />
            开始对比
          </button>
        </div>

        {/* Results */}
        {showResult && typeA && typeB && (
          <div className="space-y-6">
            {/* Header cards */}
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard variant="prominent" glow="purple" className="p-6 text-center">
                <TypeBadge type={typeA.code} size="lg" className="mb-3" />
                <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">{typeA.name}</h2>
                <p className="text-xs text-[var(--color-brand-gold)]">{typeA.nickname}</p>
              </GlassCard>
              <GlassCard variant="prominent" glow="cyan" className="p-6 text-center">
                <TypeBadge type={typeB.code} size="lg" className="mb-3" />
                <h2 className="mb-1 text-lg font-semibold text-[var(--color-text-primary)]">{typeB.name}</h2>
                <p className="text-xs text-[var(--color-brand-gold)]">{typeB.nickname}</p>
              </GlassCard>
            </div>

            {/* Trait comparison table */}
            <GlassCard variant="subtle" className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-tertiary)]">维度</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)]">
                        {typeA.code} · {typeA.name}
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)]">
                        {typeB.code} · {typeB.name}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row) => (
                      <tr key={row.label} className="border-b border-white/[0.03] last:border-0">
                        <td className={`px-5 py-3 text-xs ${row.highlight ? "font-semibold text-[var(--color-text-primary)]" : "text-[var(--color-text-tertiary)]"}`}>
                          {row.label}
                        </td>
                        <td className={`px-5 py-3 text-xs leading-relaxed ${row.highlight ? "font-semibold text-[var(--color-brand-purple)]" : "text-[var(--color-text-secondary)]"}`}>
                          {row.getValue(typeA)}
                        </td>
                        <td className={`px-5 py-3 text-xs leading-relaxed ${row.highlight ? "font-semibold text-[var(--color-brand-cyan)]" : "text-[var(--color-text-secondary)]"}`}>
                          {row.getValue(typeB)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            {/* Strengths comparison */}
            <div className="grid gap-4 sm:grid-cols-2">
              <GlassCard variant="subtle" className="p-5">
                <h3 className="mb-3 text-xs font-semibold text-[var(--color-text-primary)]">
                  {typeA.code} 独有优势
                </h3>
                <ul className="space-y-1.5">
                  {typeA.strengths.filter((s) => !getStrengthsOverlap(typeA, typeB).includes(s)).map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-brand-purple)]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard variant="subtle" className="p-5">
                <h3 className="mb-3 text-xs font-semibold text-[var(--color-text-primary)]">
                  {typeB.code} 独有优势
                </h3>
                <ul className="space-y-1.5">
                  {typeB.strengths.filter((s) => !getStrengthsOverlap(typeA, typeB).includes(s)).map((s) => (
                    <li key={s} className="flex items-start gap-2 text-xs text-[var(--color-text-secondary)]">
                      <span className="mt-1 block size-1 shrink-0 rounded-full bg-[var(--color-brand-cyan)]" />
                      {s}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>

            {/* Shared strengths */}
            {(() => {
              const shared = getStrengthsOverlap(typeA, typeB)
              if (shared.length === 0) return null
              return (
                <GlassCard variant="subtle" className="rounded-lg border border-[var(--color-brand-gold)]/20 bg-[var(--color-brand-gold)]/[0.02] p-5">
                  <h3 className="mb-3 text-xs font-semibold text-[var(--color-brand-gold)]">
                    <Check className="mr-1.5 inline size-3.5" />
                    共同优势 ({shared.length})
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {shared.map((s) => (
                      <span key={s} className="rounded-full border border-[var(--color-brand-gold)]/20 px-2.5 py-1 text-xs text-[var(--color-brand-gold)]">
                        {s}
                      </span>
                    ))}
                  </div>
                </GlassCard>
              )
            })()}

            {/* CTA */}
            <section className="pt-6 text-center">
              <GradientLink href="/test" glow>
                开始你的测试
              </GradientLink>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
