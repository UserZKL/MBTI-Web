"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"
import { GlassCard } from "@/components/shared/glass-card"
import { ProgressBar } from "@/components/shared/progress-bar"
import { LastResultButton } from "@/components/shared/last-result-button"
import { getQuestions, type Answer } from "@/lib/mbti-utils"

const STORAGE_KEY = "mbti-test-state"
const PAGE_SIZE = 10
const PAGE_COUNT = 6

interface SavedState {
  currentPage: number
  answers: Answer[]
}

function saveState(currentPage: number, answers: Answer[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ currentPage, answers }))
  } catch {
    // sessionStorage unavailable
  }
}

function loadState(): SavedState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.currentPage !== undefined) {
      return { currentPage: parsed.currentPage, answers: parsed.answers }
    }
    if (parsed.currentIndex !== undefined) {
      return {
        currentPage: Math.min(Math.floor(parsed.currentIndex / PAGE_SIZE), PAGE_COUNT - 1),
        answers: parsed.answers,
      }
    }
    return null
  } catch {
    return null
  }
}

function clearState() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function TestPage() {
  const router = useRouter()
  const questions = getQuestions()
  const [currentPage, setCurrentPage] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [showResume, setShowResume] = useState(() => {
    const existing = loadState()
    return !!(existing && existing.answers.length > 0 && existing.answers.length < questions.length)
  })
  const [savedState] = useState<SavedState | null>(() => {
    const existing = loadState()
    return existing && existing.answers.length > 0 && existing.answers.length < questions.length
      ? existing
      : null
  })
  const [incompleteNotice, setIncompleteNotice] = useState(false)
  const questionRefs = useRef<Record<number, HTMLDivElement | null>>({})

  function handleResume() {
    if (savedState) {
      setCurrentPage(savedState.currentPage)
      setAnswers(savedState.answers)
    }
    setShowResume(false)
  }

  function handleReset() {
    clearState()
    setShowResume(false)
  }

  const pageStart = currentPage * PAGE_SIZE
  const pageQuestions = questions.slice(pageStart, pageStart + PAGE_SIZE)
  const answeredIds = new Set(answers.map((a) => a.questionId))
  const answeredCount = answeredIds.size

  function handleAnswer(questionId: number, answer: "agree" | "disagree") {
    setIncompleteNotice(false)
    const existing = answers.find((a) => a.questionId === questionId)
    const newAnswers = existing
      ? answers.map((a) => (a.questionId === questionId ? { questionId, answer } : a))
      : [...answers, { questionId, answer }]
    setAnswers(newAnswers)
  }

  function handleGoPrev() {
    if (currentPage > 0) {
      const nextPage = currentPage - 1
      setCurrentPage(nextPage)
      setIncompleteNotice(false)
      saveState(nextPage, answers)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  function handleGoNext() {
    const unanswered = pageQuestions.filter((q) => !answeredIds.has(q.id))
    if (unanswered.length > 0) {
      setIncompleteNotice(true)
      const firstId = unanswered[0]?.id
      if (firstId !== undefined) {
        questionRefs.current[firstId]?.scrollIntoView({ behavior: "smooth", block: "center" })
      }
      return
    }

    setIncompleteNotice(false)

    if (currentPage >= PAGE_COUNT - 1) {
      clearState()
      const encoded = btoa(JSON.stringify(answers))
      router.push(`/result?data=${encoded}`)
      return
    }

    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    saveState(nextPage, answers)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-clip px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.09)_0%,rgba(124,58,237,0)_70%)]" />
      </div>

      {/* Resume prompt */}
      {showResume && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-paper)]/80 backdrop-blur-sm">
          <GlassCard variant="prominent" glow="purple" className="mx-4 max-w-sm p-8 text-center">
            <h2 className="mb-3 text-lg font-semibold text-[var(--color-text-primary)]">
              发现未完成的测试
            </h2>
            <p className="mb-6 text-sm text-[var(--color-text-secondary)]">
              你上次回答了 {savedState?.answers.length ?? 0} / {questions.length} 题，要继续吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="flex-1 rounded-lg border border-white/8 bg-white/[0.02] px-4 py-2.5 text-sm text-[var(--color-text-secondary)] transition-colors hover:border-white/15 hover:text-white"
              >
                重新开始
              </button>
              <button
                onClick={handleResume}
                className="gradient-primary flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                继续答题
              </button>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Header */}
      <div className="w-full max-w-3xl pt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm tabular-nums text-[var(--color-text-tertiary)]">
            第 {currentPage + 1} / {PAGE_COUNT} 页 · 已答 {answeredCount} / {questions.length}
          </span>
          <div className="flex items-center gap-3">
            <LastResultButton />
            <Link
              href="/"
              aria-label="返回首页"
              className="flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
            >
              <Home className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <ProgressBar value={answeredCount} max={questions.length} showLabel={false} variant="primary" />
      </div>

      {/* Questions */}
      <div className="mt-6 w-full max-w-3xl flex-1">
        <div className="space-y-4">
          {pageQuestions.map((q, idx) => {
            const isAnswered = answeredIds.has(q.id)
            const globalIndex = pageStart + idx
            return (
              <div
                key={q.id}
                ref={(el) => {
                  questionRefs.current[q.id] = el
                }}
              >
                <GlassCard variant={isAnswered ? "subtle" : "prominent"} className="p-6 transition-all duration-200 sm:p-8">
                  {/* Question number badge */}
                  <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-3.5 py-1 text-sm text-[var(--color-text-tertiary)]">
                    第 {globalIndex + 1} 题
                  </div>

                  {/* Question text */}
                  <h2 className="mb-6 text-xl font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-2xl">
                    {q.text}
                  </h2>

                  {/* Answer buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswer(q.id, "agree")}
                      aria-label={`第 ${q.id} 题 符合`}
                      className={`flex-1 rounded-full border-0 py-5 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-[0.98] ${
                        isAnswered ? "bg-[var(--color-success)]/80" : "gradient-primary"
                      }`}
                    >
                      符合
                    </button>
                    <button
                      onClick={() => handleAnswer(q.id, "disagree")}
                      aria-label={`第 ${q.id} 题 不符合`}
                      className={`flex-1 rounded-full border py-5 text-lg font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:scale-[1.02] hover:border-white/15 hover:bg-white/[0.04] active:scale-[0.98] ${
                        isAnswered
                          ? "border-[var(--color-success)]/60 bg-[var(--color-success)]/15"
                          : "border-white/8 bg-white/[0.02]"
                      }`}
                    >
                      不符合
                    </button>
                  </div>
                </GlassCard>
              </div>
            )
          })}
        </div>

        {/* Prev / Next navigation buttons */}
        <div className="mt-6 flex w-full gap-4">
          <button
            onClick={handleGoPrev}
            disabled={currentPage === 0}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] py-4 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] disabled:opacity-30"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            上一页
          </button>
          <button
            onClick={handleGoNext}
            className="gradient-primary flex flex-1 items-center justify-center gap-1.5 rounded-full border-0 py-4 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-[0.98]"
          >
            {currentPage >= PAGE_COUNT - 1 ? "查看结果" : "下一页"}
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* Tips */}
        <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          凭第一反应作答，没有对错之分
        </p>

        {incompleteNotice && (
          <div
            role="alert"
            className="mt-3 w-full rounded-lg border border-[var(--color-brand-amber)]/30 bg-[var(--color-brand-amber)]/10 px-4 py-3 text-center text-sm text-[var(--color-brand-amber)]"
          >
            本页还有 {pageQuestions.length - pageQuestions.filter((q) => answeredIds.has(q.id)).length} 题未作答，请完成本页全部题目后再进入下一页
          </div>
        )}
      </div>
    </div>
  )
}
