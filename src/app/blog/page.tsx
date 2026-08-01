import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"
import { PageNav } from "@/components/shared/page-nav"
import { getAllPosts } from "@/content/blog"
import { type Metadata } from "next"
import { Clock } from "lucide-react"

export const metadata: Metadata = {
  title: "MBTI 博客 — 性格、成长与关系",
  description: "深入了解 MBTI 人格理论、各类型特点和成长建议。12 篇深度文章覆盖基础知识、维度详解、类型分析和实用指南。",
}

const CATEGORY_LABELS: Record<string, string> = {
  basics: "基础入门",
  dimensions: "维度解析",
  types: "类型分析",
  growth: "个人成长",
  relationships: "关系指南",
}

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
        <div className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[80px]" />
      </div>

      <div className="container-page py-16 sm:py-20">
        <PageNav className="mb-8" />
        <div className="mb-12">
          <GradientText as="h1" className="mb-3 text-3xl font-bold">
            MBTI 博客
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            深入了解性格、成长与关系的深度文章
          </p>
        </div>

        <div className="space-y-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <GlassCard variant="subtle" hover className="group p-6">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/8 bg-white/[0.03] px-2 py-0.5 text-xs text-[var(--color-brand-cyan)]">
                    {CATEGORY_LABELS[post.category] ?? post.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                    <Clock className="size-2.5" />
                    {post.readTimeMinutes} 分钟
                  </span>
                </div>

                <h2 className="mb-1.5 text-base font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                  {post.title}
                </h2>
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {post.description}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-[var(--color-text-tertiary)]">
            更多内容即将上线。想了解自己的性格类型？
            <Link href="/test" className="ml-1 text-[var(--color-brand-cyan)] hover:underline">
              开始免费测试 →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
