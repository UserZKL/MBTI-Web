import type { Metadata } from "next"
import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"

export const metadata: Metadata = {
  title: "隐私政策 — MBTI 人格测试",
  description: "MBTI 人格测试网站隐私政策",
}

const SECTIONS = [
  {
    title: "我们收集什么",
    content:
      "匿名使用时，我们仅在本地浏览器保存你的答题进度，不收集任何个人身份信息。登录后，我们保存你的邮箱地址（用于登录验证）及测试记录（类型、得分、答题数据）。",
  },
  {
    title: "数据如何使用",
    content:
      "测试记录仅用于你在个人中心回看历史结果；聚合统计数据（如各类型占比）不包含任何个人身份信息，仅用于展示全站分布。",
  },
  {
    title: "第三方服务",
    content:
      "邮箱验证码通过 Resend 发送，你的邮箱地址仅用于发送登录验证邮件。AI 深度报告通过 DeepSeek API 生成，答题数据会发送至该服务用于生成报告，不会存储在其侧。",
  },
  {
    title: "数据存储与删除",
    content:
      "数据存储于我们的数据库中。你可以随时在个人中心联系管理员删除全部数据，删除后不可恢复。",
  },
  {
    title: "Cookie 与登录状态",
    content:
      "登录状态通过安全的会话 Cookie 保持，有效期结束后自动过期。我们不使用任何第三方追踪型 Cookie。",
  },
  {
    title: "联系我们",
    content:
      "如对隐私政策有任何疑问，请通过站点页脚或首页留言渠道联系我们，我们会在 7 个工作日内回复。",
  },
]

export default function PrivacyPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.07)_0%,rgba(6,182,212,0)_70%)]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
        >
          ← 返回首页
        </Link>

        <GradientText as="h1" className="mb-6 text-2xl font-bold sm:text-3xl">
          隐私政策
        </GradientText>

        <p className="mb-8 text-sm text-[var(--color-text-tertiary)]">更新日期：2026 年 8 月 1 日</p>

        <div className="space-y-4">
          {SECTIONS.map((s) => (
            <GlassCard key={s.title} variant="subtle" className="p-6">
              <h2 className="mb-2 text-base font-semibold text-[var(--color-text-primary)]">
                {s.title}
              </h2>
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                {s.content}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </div>
  )
}
