"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export function LoginPageClient() {
  const [googleLoading, setGoogleLoading] = useState(false)

  async function handleGoogleSignIn() {
    setGoogleLoading(true)
    await signIn("google", { callbackUrl: "/profile" })
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip p-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[80px]" />
      </div>

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
      >
        <ArrowLeft className="size-3" />
        返回首页
      </Link>

      <GlassCard variant="prominent" glow="purple" className="w-full max-w-sm p-8 sm:p-10">
        <div className="mb-8 text-center">
          <GradientText as="h1" className="mb-2 text-2xl font-bold">
            登录
          </GradientText>
          <p className="text-xs text-[var(--color-text-secondary)]">
            登录后保存你的测试记录和完整 AI 报告
          </p>
        </div>

        <Button
          variant="outline"
          onClick={handleGoogleSignIn}
          disabled={googleLoading}
          className="w-full border-white/8 bg-white/[0.02] text-[var(--color-text-secondary)] hover:bg-white/[0.05]"
        >
          {googleLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <svg className="size-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          )}
          使用 Google 登录
        </Button>

        <p className="mt-6 text-center text-[10px] text-[var(--color-text-tertiary)]">
          登录即表示同意服务条款和隐私政策
        </p>
      </GlassCard>

      <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
        无需注册也可完成测试和查看结果
      </p>
    </div>
  )
}
