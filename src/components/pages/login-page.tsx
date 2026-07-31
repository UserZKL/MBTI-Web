"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientButton } from "@/components/shared/gradient-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, Mail, ShieldCheck } from "lucide-react"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function LoginPageClient() {
  const [step, setStep] = useState<"email" | "code">("email")
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const cooldownActive = cooldown > 0

  useEffect(() => {
    if (!cooldownActive) return
    const timer = setInterval(() => {
      setCooldown((c) => (c > 0 ? c - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldownActive])

  async function handleSendCode() {
    const trimmed = email.trim()
    if (!EMAIL_RE.test(trimmed)) {
      setError("请输入有效的邮箱地址")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const res = await signIn("resend", { email: trimmed, redirect: false })
      if (res?.ok) {
        setStep("code")
        setCooldown(60)
      } else {
        setError(
          res?.error === "Configuration"
            ? "登录服务未配置完成（缺少 RESEND_API_KEY），请联系管理员"
            : "验证码发送失败，请稍后重试"
        )
      }
    } catch {
      setError("网络错误，请稍后重试")
    } finally {
      setLoading(false)
    }
  }

  async function handleVerifyCode() {
    const trimmed = code.trim()
    if (!/^\d{6}$/.test(trimmed)) {
      setError("请输入 6 位数字验证码")
      return
    }
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        token: trimmed,
        email: email.trim(),
        callbackUrl: "/profile",
      })
      window.location.href = `/api/auth/callback/resend?${params.toString()}`
    } catch {
      setError("登录失败，请重试")
      setLoading(false)
    }
  }

  function handleBackToEmail() {
    setStep("email")
    setCode("")
    setError(null)
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip p-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[80px]" />
      </div>

      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
      >
        <ArrowLeft className="size-3.5" />
        返回首页
      </Link>

      <GlassCard variant="prominent" glow="purple" className="w-full max-w-sm p-8 sm:p-10">
        <div className="mb-8 text-center">
          <GradientText as="h1" className="mb-2 text-2xl font-bold">
            {step === "email" ? "登录" : "输入验证码"}
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {step === "email"
              ? "登录后保存你的测试记录和完整 AI 报告"
              : `验证码已发送至 ${email}`}
          </p>
        </div>

        {step === "email" ? (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleSendCode()
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm text-[var(--color-text-secondary)]">
                邮箱地址
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                className="border-white/8 bg-white/[0.03] py-5 placeholder:text-[var(--color-text-tertiary)]"
              />
            </div>

            <GradientButton type="submit" className="w-full py-5" disabled={loading} glow>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Mail className="size-4" />
              )}
              {cooldown > 0 ? `重新发送 (${cooldown}s)` : "发送验证码"}
            </GradientButton>
          </form>
        ) : (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              handleVerifyCode()
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="code" className="text-sm text-[var(--color-text-secondary)]">
                6 位验证码
              </Label>
              <Input
                id="code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="border-white/8 bg-white/[0.03] py-5 text-center text-2xl font-semibold tracking-[0.4em] placeholder:text-[var(--color-text-tertiary)]"
              />
            </div>

            <GradientButton type="submit" className="w-full py-5" disabled={loading} glow>
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              登录
            </GradientButton>

            <button
              type="button"
              onClick={handleBackToEmail}
              className="w-full text-center text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
            >
              换个邮箱
            </button>
          </form>
        )}

        {error && (
          <p className="mt-4 text-center text-sm text-[var(--color-error)]">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-[var(--color-text-tertiary)]">
          登录即表示同意服务条款和隐私政策
        </p>
      </GlassCard>

      <p className="mt-4 text-sm text-[var(--color-text-tertiary)]">
        无需注册也可完成测试和查看结果
      </p>
    </div>
  )
}
