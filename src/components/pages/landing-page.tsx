import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getAllPersonalityTypes } from "@/lib/mbti-utils"
import { Hash, TrendingUp, Brain, Lightbulb } from "lucide-react"

const DIMENSIONS = [
  {
    pair: "E / I",
    label: "精力来源",
    left: "外向 (E)",
    right: "内向 (I)",
    desc: "你从哪里获得能量？社交让你充电，还是独处让你恢复？",
    icon: TrendingUp,
  },
  {
    pair: "S / N",
    label: "认知方式",
    left: "感觉 (S)",
    right: "直觉 (N)",
    desc: "你如何接收信息？关注眼前的事实细节，还是背后的模式和可能？",
    icon: Hash,
  },
  {
    pair: "T / F",
    label: "决策方式",
    left: "思考 (T)",
    right: "情感 (F)",
    desc: "你如何做决定？依赖逻辑和客观标准，还是看重价值观和人的感受？",
    icon: Brain,
  },
  {
    pair: "J / P",
    label: "生活态度",
    left: "判断 (J)",
    right: "感知 (P)",
    desc: "你如何应对外部世界？喜欢计划和确定性，还是享受灵活和随性？",
    icon: Lightbulb,
  },
]

export function LandingPage() {
  const types = getAllPersonalityTypes()

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Background ambient glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[var(--color-brand-purple)]/5 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full bg-[var(--color-brand-cyan)]/4 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center px-4 pb-16 pt-24 text-center sm:pt-32">
        <div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-4 py-1.5 text-xs text-[var(--color-text-secondary)]">
          <span className="inline-block size-1.5 rounded-full bg-[var(--color-brand-cyan)]" />
          免费 · 60 题 · 约 10 分钟
        </div>

        <GradientText as="h1" className="mb-6 max-w-3xl text-4xl font-bold !leading-tight sm:text-5xl lg:text-6xl">
          发现你的真实人格
        </GradientText>

        <p className="mb-10 max-w-xl text-base text-[var(--color-text-secondary)] sm:text-lg">
          基于荣格心理学理论的专业 MBTI 测试。
          深入了解你的性格特质、优势劣势，找到属于你的方向和可能性。
        </p>

        <GradientLink href="/test" glow className="px-8 py-4 text-base">
          开始测试 — 免费
        </GradientLink>

        <p className="mt-4 text-xs text-[var(--color-text-tertiary)]">
          无需注册，即刻开始
        </p>
      </section>

      {/* Dimensions Section */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center">
          <GradientText as="h2" className="mb-3 text-2xl font-bold sm:text-3xl">
            四个维度，十六种可能
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            MBTI 用四个维度描绘你的性格画像
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSIONS.map((dim) => (
            <GlassCard key={dim.pair} variant="subtle" hover className="p-5">
              <div className="mb-3 flex size-9 items-center justify-center rounded-lg bg-white/[0.04]">
                <dim.icon className="size-4 text-[var(--color-brand-purple)]" />
              </div>
              <h3 className="mb-1 text-sm font-semibold text-[var(--color-text-primary)]">
                {dim.label}
              </h3>
              <p className="mb-2 text-xs font-mono text-[var(--color-brand-gold)]">
                {dim.pair}
              </p>
              <p className="text-xs leading-relaxed text-[var(--color-text-tertiary)]">
                {dim.desc}
              </p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Types Grid Section */}
      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="mb-12 text-center">
          <GradientText as="h2" className="mb-3 text-2xl font-bold sm:text-3xl">
            十六种人格类型
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            每一种都是独特的风景
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <Link key={t.code} href={`/types/${t.code}`}>
              <GlassCard variant="subtle" hover className="group p-4">
                <TypeBadge type={t.code} size="sm" className="mb-2" />
                <h3 className="mb-1 text-sm font-medium text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                  {t.name}
                </h3>
                <p className="line-clamp-2 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
                  {t.description.slice(0, 80)}...
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="mx-auto max-w-2xl px-4 pb-32 text-center">
        <GlassCard variant="prominent" glow="purple" className="p-10 sm:p-16">
          <GradientText as="h2" className="mb-4 text-2xl font-bold sm:text-3xl">
            准备好了吗？
          </GradientText>
          <p className="mb-8 text-sm text-[var(--color-text-secondary)]">
            60 道生活化的情境题，帮你发现更真实的自己
          </p>
          <GradientLink href="/test" glow className="px-8 py-4 text-base">
            开始测试
          </GradientLink>
        </GlassCard>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 text-center">
        <p className="text-xs text-[var(--color-text-tertiary)]">
          MBTI 人格测试 · 开源免费 · 数据安全 · 无需注册
        </p>
      </footer>
    </div>
  )
}
