"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProgressBar } from "@/components/shared/progress-bar"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { getQuestions, type Answer, type Question } from "@/lib/mbti-utils"
import { ChevronLeft } from "lucide-react"

export function TestPage() {
  const router = useRouter()
  const questions = getQuestions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Answer[]>([])
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentQuestion: Question = questions[currentIndex]

  function handleAnswer(answer: "agree" | "disagree") {
    setIsTransitioning(true)

    const newAnswers = [...answers, { questionId: currentQuestion.id, answer }]
    setAnswers(newAnswers)

    setTimeout(() => {
      if (currentIndex + 1 >= questions.length) {
        const encoded = btoa(JSON.stringify(newAnswers))
        router.push(`/result?data=${encoded}`)
      } else {
        setCurrentIndex((prev) => prev + 1)
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

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-x-clip px-4">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-brand-purple)]/4 blur-[100px]" />
      </div>

      {/* Header */}
      <div className="w-full max-w-xl pt-8">
        <div className="mb-2 flex items-center justify-between">
          <button
            onClick={handleGoBack}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white disabled:opacity-20"
          >
            <ChevronLeft className="size-3" />
            上一题
          </button>
          <span className="text-xs tabular-nums text-[var(--color-text-tertiary)]">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className="w-12" />
        </div>

        <ProgressBar
          value={currentIndex}
          max={questions.length - 1}
          showLabel={false}
          variant="primary"
        />
      </div>

      {/* Question Card */}
      <div className="mt-8 flex w-full max-w-xl flex-1 flex-col items-center">
        <div
          className="w-full transition-all duration-300"
          style={{
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? "translateY(8px)" : "translateY(0)",
          }}
        >
          <GlassCard variant="prominent" className="p-8 sm:p-12">
            {/* Question number badge */}
            <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-3 py-1 text-[10px] text-[var(--color-text-tertiary)]">
              第 {currentIndex + 1} 题
            </div>

            {/* Question text */}
            <h2 className="mb-10 text-xl font-medium leading-relaxed text-[var(--color-text-primary)] sm:text-2xl">
              {currentQuestion.text}
            </h2>

            {/* Answer buttons */}
            <div className="flex gap-3">
              <Button
                onClick={() => handleAnswer("agree")}
                className="gradient-primary flex-1 border-0 py-6 text-base font-medium text-white shadow-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] active:scale-[0.98]"
              >
                符合
              </Button>
              <Button
                onClick={() => handleAnswer("disagree")}
                variant="outline"
                className="flex-1 border-white/8 bg-white/[0.02] py-6 text-base font-medium text-[var(--color-text-secondary)] transition-all duration-200 hover:scale-[1.02] hover:border-white/15 hover:bg-white/[0.04] active:scale-[0.98]"
              >
                不符合
              </Button>
            </div>
          </GlassCard>
        </div>

        {/* Tips */}
        <p className="mt-6 text-center text-xs text-[var(--color-text-tertiary)]">
          凭第一反应作答，没有对错之分
        </p>
      </div>
    </div>
  )
}
