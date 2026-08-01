"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ProgressBar } from "@/components/shared/progress-bar"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { getQuestions, type Answer, type Question } from "@/lib/mbti-utils"
import { ChevronLeft, ChevronRight, Home } from "lucide-react"

const STORAGE_KEY = "mbti-test-state"

function saveState(currentIndex: number, answers: Answer[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, answers }))
  } catch {
    // sessionStorage unavailable
  }
}

function loadState(): { currentIndex: number; answers: Answer[] } | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [incompleteNotice, setIncompleteNotice] = useState(false)
  const [showResume, setShowResume] = useState(() => {
    const existing = loadState()
    return !!(existing && existing.answers.length > 0 && existing.answers.length < questions.length)
  })
  const [savedState] = useState<{ currentIndex: number; answers: Answer[] } | null>(() => {
    const existing = loadState()
    return (existing && existing.answers.length > 0 && existing.answers.length < questions.length) ? existing : null
  })

  function handleResume() {
    if (savedState) {
      setCurrentIndex(savedState.currentIndex)
      setAnswers(savedState.answers)
    }
    setShowResume(false)
  }

  function handleReset() {
    clearState()
    setShowResume(false)
  }

  const currentQuestion: Question = questions[currentIndex]

  const answeredIds = new Set(answers.map((a) => a.questionId))

  function handleAnswer(answer: "agree" | "disagree") {
    setIsTransitioning(true)
    setIncompleteNotice(false)

    const existing = answers.find((a) => a.questionId === currentQuestion.id)
    const newAnswers = existing
      ? answers.map((a) =>
          a.questionId === currentQuestion.id
            ? { questionId: currentQuestion.id, answer }
            : a
        )
      : [...answers, { questionId: currentQuestion.id, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const uniqueCount = new Set(newAnswers.map((a) => a.questionId)).size
        if (uniqueCount < questions.length) {
          const answeredSet = new Set(newAnswers.map((a) => a.questionId))
          const firstUnanswered = questions.findIndex((q) => !answeredSet.has(q.id))
          setIsTransitioning(false)
          setCurrentIndex(firstUnanswered >= 0 ? firstUnanswered : currentIndex)
          saveState(currentIndex, newAnswers)
          setIncompleteNotice(true)
          return
        }
        clearState()
        const encoded = btoa(JSON.stringify(newAnswers))
        router.push(`/result?data=${encoded}`)
      } else {
        const nextIndex = currentIndex + 1
        setCurrentIndex(nextIndex)
        saveState(nextIndex, newAnswers)
        setIsTransitioning(false)
      }
    }, 300)
  }

  function handleGoBack() {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setAnswers((prev) => prev.slice(0, -1))
    }
  }

  function handleGoNext() {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1)
    }
  }

  function handleJump(index: number) {
    const targetId = questions[index]?.id
    setCurrentIndex(index)
    let updated = answers
    if (targetId) {
      const filtered = answers.filter((a) => a.questionId !== targetId)
      setAnswers(filtered)
      updated = filtered
    }
    saveState(index, updated)
    setIsTransitioning(false)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-clip px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-brand-purple)]/4 blur-[100px]" />
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
      <div className="w-full max-w-2xl pt-8">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm tabular-nums text-[var(--color-text-tertiary)]">
            {currentIndex + 1} / {questions.length}
          </span>
          <Link
            href="/"
            aria-label="返回首页"
            className="flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
          >
            <Home className="size-4" aria-hidden="true" />
          </Link>
        </div>

        <ProgressBar
          value={currentIndex + 1}
          max={questions.length}
          showLabel={false}
          variant="primary"
        />
      </div>

      {/* Question Card */}
      <div className="mt-6 flex w-full max-w-2xl flex-1 flex-col items-center">
        <div
          className="w-full transition-all duration-300"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          }}
        >
          <GlassCard variant="prominent" className="p-8 sm:p-14">
            {/* Question number badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-4 py-1.5 text-sm text-[var(--color-text-tertiary)]">
              第 {currentIndex + 1} 题
            </div>

            {/* Question text */}
            <h2 className="mb-12 text-2xl font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-3xl">
              {currentQuestion.text}
            </h2>

            {/* Answer buttons */}
            <div className="flex gap-4">
              <Button
                onClick={() => handleAnswer("agree")}
                className="gradient-primary flex-1 border-0 py-8 text-lg font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-[0.98]"
              >
                符合
              </Button>
              <Button
                onClick={() => handleAnswer("disagree")}
                variant="outline"
                className="flex-1 border-white/8 bg-white/[0.02] py-8 text-lg font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:scale-[1.02] hover:border-white/15 hover:bg-white/[0.04] active:scale-[0.98]"
              >
                不符合
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Prev / Next navigation buttons */}
        <div className="mt-6 flex w-full gap-4">
          <Button
            onClick={handleGoBack}
            disabled={currentIndex === 0}
            variant="outline"
            className="flex-1 border-white/8 bg-white/[0.02] py-4 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] disabled:opacity-30"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
            上一题
          </Button>
          <Button
            onClick={handleGoNext}
            disabled={currentIndex + 1 >= questions.length}
            variant="outline"
            className="flex-1 border-white/8 bg-white/[0.02] py-4 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:border-white/15 hover:bg-white/[0.04] disabled:opacity-30"
          >
            下一题
            <ChevronRight className="size-5" aria-hidden="true" />
          </Button>
        </div>

        {/* 60-question grid navigator */}
        <GlassCard variant="subtle" className="mt-6 w-full p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-[var(--color-text-secondary)]">答题进度</span>
            <span className="text-sm tabular-nums text-[var(--color-brand-cyan)]">
              已答 {answers.length} / {questions.length}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-10">
            {questions.map((q, i) => {
              const isAnswered = answeredIds.has(q.id)
              const isCurrent = i === currentIndex
              return (
                <button
                  key={q.id}
                  onClick={() => handleJump(i)}
                  aria-label={`第 ${i + 1} 题${isAnswered ? "（已作答）" : ""}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={`flex h-9 items-center justify-center rounded-md text-sm font-medium tabular-nums transition-all duration-200 ${
                    isCurrent
                      ? "border-2 border-[var(--color-brand-gold)] bg-white/[0.06] text-[var(--color-brand-gold)]"
                      : isAnswered
                        ? "gradient-primary text-white shadow-md"
                        : "border border-white/8 bg-white/[0.02] text-[var(--color-text-tertiary)] hover:border-white/20 hover:text-white"
                  }`}
                >
                  {i + 1}
                </button>
              )
            })}
          </div>
        </GlassCard>

        {/* Tips */}
        <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          凭第一反应作答，没有对错之分
        </p>

        {incompleteNotice && (
          <div className="mt-3 w-full rounded-lg border border-[var(--color-brand-amber)]/30 bg-[var(--color-brand-amber)]/10 px-4 py-3 text-center text-sm text-[var(--color-brand-amber)]">
            还有 {questions.length - new Set(answers.map((a) => a.questionId)).size} 题未作答，已跳转到最近的未答题，请完成全部题目
          </div>
        )}
      </div>
    </div>
  )
}
