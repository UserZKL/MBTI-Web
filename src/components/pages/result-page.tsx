"use client"

import { useState, useRef, useEffect } from "react"
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
import { drawResultCard, downloadDataUrl } from "@/lib/export-card"
import {
  Share2, RefreshCw, Users, Briefcase, Heart, TrendingUp,
  Sparkles, Loader2, ImageDown
} from "lucide-react"

export function ResultPage() {
  const searchParams = useSearchParams()
  const dataParam = searchParams.get("data")

  let result: MbtiResult | null = null
  let rawAnswers: Answer[] = []
  if (dataParam) {
    try {
      rawAnswers = JSON.parse(atob(dataParam))
      result = calculateResult(rawAnswers)
    } catch {
      // invalid data
    }
  }

  const [saveState, setSaveState] = useState<"idle" | "loading" | "saved" | "error">("idle")
  const [reportState, setReportState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [reportText, setReportText] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)
  const autoSaved = useRef(false)
  const rawAnswersRef = useRef(rawAnswers)
  const resultRef = useRef(result)

  // Sync refs with latest derived values (re-evaluated on dataParam change)
  useEffect(() => {
    rawAnswersRef.current = rawAnswers
    resultRef.current = result
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataParam])

  const typeData = result ? getPersonalityTypeData(result.type) : null

  const doSave = async (report?: string) => {
    const r = resultRef.current
    if (!r || saveState === "loading") return
    setSaveState("loading")
    try {
      const body: Record<string, unknown> = {
        typeCode: r.type,
        scores: r.scores,
        answers: rawAnswersRef.current,
        isPublic: false,
      }
      if (report) body.report = report
      const res = await fetch("/api/result/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error("Save failed")
      setSaveState("saved")
    } catch {
      setSaveState("error")
    }
  }

  useEffect(() => {
    if (resultRef.current && !autoSaved.current) {
      autoSaved.current = true
      doSave()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGenerateReport = async () => {
    if (!result || reportState === "loading") return
    setReportState("loading")
    setShowReport(true)
    try {
      const res = await fetch("/api/report/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          typeCode: result.type,
          typeData: typeData ? {
            name: typeData.name,
            nickname: typeData.nickname,
            description: typeData.description,
            traits: typeData.traits,
            strengths: typeData.strengths,
            weaknesses: typeData.weaknesses,
            careers: typeData.careers,
            relationships: typeData.relationships,
            growth: typeData.growth,
          } : undefined,
          answers: rawAnswers.map((a) => ({ questionId: a.questionId, answer: a.answer })),
          percentages: result.percentages,
          confidence: result.confidence,
        }),
      })
      if (!res.ok) throw new Error("Generation failed")
      const data = await res.json()
      setReportText(data.report)
      setReportState("done")
      if (saveState === "saved") {
        doSave(data.report)
      }
    } catch {
      setReportState("error")
    }
  }

  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done" | "error">("idle")

  const handleDownloadImage = async () => {
    if (!result) return
    setDownloadState("loading")
    try {
      const url = await drawResultCard({
        typeCode: result.type,
        typeName: result.typeName,
        description: typeData?.description ?? "",
        strengths: typeData?.strengths ?? [],
        dimensions: result.dimensions.map((dim) => ({
          left: dim.left.dimension,
          right: dim.right.dimension,
          leftPct: dim.left.percentage,
          rightPct: dim.right.percentage,
        })),
        footer: "MBTI 人格测试 · 你也来测一测 →",
      })
      downloadDataUrl(url, `mbti-result-${result.type}.png`)
      setDownloadState("done")
    } catch {
      setDownloadState("error")
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

  const confidenceLabel =
    result.confidence >= 70 ? "高度确定" : result.confidence >= 40 ? "比较确定" : "边缘型"

  return (
    <div className="relative min-h-screen overflow-x-clip pb-24">
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
            {saveState === "saved" && <span className="ml-2 text-[var(--color-success)]">· 已保存</span>}
            {saveState === "error" && (
              <span className="ml-2 text-[var(--color-error)]">· 保存失败</span>
            )}
          </p>
          {saveState === "error" && (
            <p className="mt-2 text-xs text-[var(--color-error)]">
              结果保存失败，登录后可重试保存到个人中心
              <Link href="/login" className="ml-1 text-[var(--color-brand-cyan)] underline">
                去登录
              </Link>
            </p>
          )}
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

        {/* AI Report Section */}
        <section className="mb-10">
          <div className="mb-5 flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--color-brand-cyan)]" />
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">AI 深度分析</h2>
          </div>

          {!showReport ? (
            <GlassCard variant="subtle" className="p-8 text-center">
              <Sparkles className="mx-auto mb-3 size-8 text-[var(--color-brand-purple)]" />
              <p className="mb-4 text-sm text-[var(--color-text-secondary)]">
                基于你的测试结果，AI 将生成一份专属的深度分析报告
              </p>
              <GradientButton
                onClick={handleGenerateReport}
                disabled={reportState === "loading"}
                className="flex items-center gap-2"
                glow
              >
                <Sparkles className="size-4" />
                生成 AI 报告
              </GradientButton>
            </GlassCard>
          ) : reportState === "loading" ? (
            <GlassCard variant="subtle" className="flex flex-col items-center p-12 text-center">
              <Loader2 className="mb-3 size-8 animate-spin text-[var(--color-brand-purple)]" />
              <p className="text-sm text-[var(--color-text-secondary)]">AI 正在分析你的测试数据...</p>
              <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">这可能需要 10-20 秒</p>
            </GlassCard>
          ) : reportState === "error" ? (
            <GlassCard variant="subtle" className="p-8 text-center">
              <p className="mb-3 text-sm text-[var(--color-text-secondary)]">报告生成失败，请重试</p>
              <GradientButton
                variant="outline"
                onClick={handleGenerateReport}
                className="flex items-center gap-2"
              >
                <RefreshCw className="size-4" />
                重试
              </GradientButton>
            </GlassCard>
          ) : reportText ? (
            <GlassCard variant="subtle" className="prose-p:!my-0 p-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
              {reportText.split("\n").map((line, i) => (
                <p key={i} className="mb-3 last:mb-0">
                  {line || "\u00A0"}
                </p>
              ))}
            </GlassCard>
          ) : null}
        </section>

        {/* Action Buttons */}
        <section className="flex flex-col items-center gap-3 pb-10 sm:flex-row sm:justify-center sm:flex-wrap">
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
          <GradientButton
            variant="outline"
            onClick={handleDownloadImage}
            disabled={downloadState === "loading"}
            className="flex items-center gap-2"
          >
            {downloadState === "loading" ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <ImageDown className="size-4" aria-hidden="true" />
            )}
            {downloadState === "loading" ? "生成中..." : "下载图片"}
          </GradientButton>
          {downloadState === "error" && (
            <p className="w-full text-center text-xs text-[var(--color-error)]">
              图片生成失败，请重试
            </p>
          )}
        </section>
      </div>

    </div>
  )
}
