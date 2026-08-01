import type { Metadata } from "next"
import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"

export const metadata: Metadata = {
  title: "服务条款 — MBTI 人格测试",
  description: "MBTI 人格测试网站服务条款",
}

const SECTIONS = [
  {
    title: "服务说明",
    content:
      "本网站提供免费的 MBTI 人格类型测试及相关内容，测试结果仅供个人参考与娱乐，不构成任何专业心理评估、诊断或建议。",
  },
  {
    title: "账号与数据",
    content:
      "测试无需注册即可完成。如选择登录，我们将保存你的测试记录以便随时回看；你也可以随时清除记录或注销账号。",
  },
  {
    title: "AI 报告说明",
    content:
      "AI 深度报告由人工智能模型基于你的答题数据生成，可能存在偏差或错误，请理性看待，不可替代专业人士的意见。",
  },
  {
    title: "内容版权",
    content:
      "本站全部原创内容（含题库、文章、设计）受版权保护，未经许可不得复制、转载或用于商业用途。",
  },
  {
    title: "免责声明",
    content:
      "我们尽力保证服务的稳定性与准确性，但不承担因使用本站内容或服务而产生的任何直接或间接损失。",
  },
]

export default function TermsPage() {
  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,rgba(124,58,237,0)_70%)]" />
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-[var(--color-text-tertiary)] transition-colors hover:text-white"
        >
          ← 返回首页
        </Link>

        <GradientText as="h1" className="mb-6 text-2xl font-bold sm:text-3xl">
          服务条款
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
