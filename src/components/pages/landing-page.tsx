import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { LastResultButton } from "@/components/shared/last-result-button"
import { Reveal } from "@/components/shared/reveal"
import { getAllPersonalityTypes } from "@/lib/mbti-utils"
import { Hash, TrendingUp, Brain, Lightbulb, BookOpen, Scale, BarChart3 } from "lucide-react"

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

const EXPLORE_LINKS = [
  {
    href: "/blog",
    title: "MBTI 博客",
    desc: "深入浅出的人格知识，帮你更懂自己和他人",
    icon: BookOpen,
    accent: "text-[var(--color-brand-purple)]",
  },
  {
    href: "/compare",
    title: "对比类型",
    desc: "两两对比不同人格，发现差异与默契",
    icon: Scale,
    accent: "text-[var(--color-brand-cyan)]",
  },
  {
    href: "/stats",
    title: "统计数据",
    desc: "看看全球用户都在什么人格里",
    icon: BarChart3,
    accent: "text-[var(--color-brand-amber)]",
  },
]

const CONTAINER = "container-page"

export function LandingPage() {
  const types = getAllPersonalityTypes()

  return (
    <div className="relative min-h-screen overflow-x-clip">
      {/* Dynamic ambient background (pre-blurred radial gradients, no live filter) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="bg-drift-1 absolute -top-40 left-1/2 h-[600px] w-[800px] -translate-x-1/2 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(124,58,237,0.14) 0%, rgba(124,58,237,0) 70%)",
          }}
        />
        <div
          className="bg-drift-2 absolute top-1/3 right-0 h-[400px] w-[500px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(6,182,212,0.12) 0%, rgba(6,182,212,0) 70%)",
          }}
        />
        <div
          className="bg-drift-3 absolute bottom-0 left-[-10%] h-[500px] w-[600px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(212,168,83,0.10) 0%, rgba(212,168,83,0) 70%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center px-4 pb-16 pt-24 text-center sm:pt-32">
        <div className="animate-fade-up mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-5 py-2 text-sm text-[var(--color-text-secondary)]">
          <span className="inline-block size-1.5 rounded-full bg-[var(--color-brand-cyan)]" />
          免费 · 60 题 · 约 10 分钟
        </div>

        <GradientText as="h1" className="animate-fade-up animation-delay-100 mb-6 max-w-3xl text-5xl font-bold !leading-tight sm:text-6xl lg:text-7xl">
          发现你的真实人格
        </GradientText>

        <p className="animate-fade-up animation-delay-200 mb-10 max-w-xl text-lg text-[var(--color-text-secondary)] sm:text-xl">
          基于荣格心理学理论的专业 MBTI 测试。
          深入了解你的性格特质、优势劣势，找到属于你的方向和可能性。
        </p>

        <div className="animate-fade-up animation-delay-300 flex flex-col items-center gap-4">
          <GradientLink href="/test" glow className="px-10 py-5 text-lg">
            开始测试
          </GradientLink>
          <LastResultButton />
        </div>

        <p className="animate-fade-up animation-delay-400 mt-4 text-sm text-[var(--color-text-tertiary)]">
          无需注册，即刻开始
        </p>
      </section>

      {/* Dimensions Section */}
      <section className={`${CONTAINER} pb-24`}>
        <Reveal className="mb-12 text-center">
          <GradientText as="h2" className="mb-3 text-3xl font-bold sm:text-4xl">
            四个维度，十六种可能
          </GradientText>
          <p className="text-base text-[var(--color-text-secondary)]">
            MBTI 用四个维度描绘你的性格画像
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIMENSIONS.map((dim, i) => (
            <Reveal key={dim.pair} direction="left" delay={i * 120}>
              <GlassCard variant="subtle" hover className="h-full p-6">
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-white/[0.04]">
                  <dim.icon className="size-5 text-[var(--color-brand-purple)]" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-[var(--color-text-primary)]">
                  {dim.label}
                </h3>
                <p className="mb-2 text-sm font-mono text-[var(--color-brand-gold)]">
                  {dim.pair}
                </p>
                <p className="text-sm leading-relaxed text-[var(--color-text-tertiary)]">
                  {dim.desc}
                </p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Types Grid Section */}
      <section id="types" className={`${CONTAINER} scroll-mt-8 pb-24`}>
        <Reveal className="mb-12 text-center">
          <GradientText as="h2" className="mb-3 text-3xl font-bold sm:text-4xl">
            十六种人格类型
          </GradientText>
          <p className="text-base text-[var(--color-text-secondary)]">
            每一种都是独特的风景
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t, i) => (
            <Reveal key={t.code} delay={(i % 4) * 80}>
              <Link href={`/types/${t.code}`}>
                <GlassCard variant="subtle" hover className="group h-full p-5">
                  <TypeBadge type={t.code} size="sm" className="mb-2" />
                  <h3 className="mb-1 text-base font-medium text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {t.name}
                  </h3>
                  <p className="line-clamp-2 text-sm leading-relaxed text-[var(--color-text-tertiary)]">
                    {t.description.length > 80 ? `${t.description.slice(0, 80)}...` : t.description}
                  </p>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Explore Section */}
      <section className={`${CONTAINER} pb-32`}>
        <Reveal className="mb-12 text-center">
          <GradientText as="h2" className="mb-3 text-3xl font-bold sm:text-4xl">
            探索更多
          </GradientText>
          <p className="text-base text-[var(--color-text-secondary)]">
            继续你的 MBTI 之旅
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-3">
          {EXPLORE_LINKS.map((item, i) => (
            <Reveal key={item.href} delay={i * 120}>
              <Link href={item.href} className="group">
                <GlassCard
                  variant="subtle"
                  hover
                  className="flex h-full flex-col items-center gap-3 p-8 text-center"
                >
                  <div className="flex size-14 items-center justify-center rounded-2xl bg-white/[0.04] transition-transform duration-300 group-hover:scale-110">
                    <item.icon className={`size-6 ${item.accent}`} />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-[var(--color-text-tertiary)]">
                    {item.desc}
                  </p>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
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
