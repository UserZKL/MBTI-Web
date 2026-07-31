import Link from "next/link"
import { notFound } from "next/navigation"
import { type Metadata } from "next"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"
import { GradientLink } from "@/components/shared/gradient-button"
import { getPostBySlug, getRelatedPosts, getAllPosts } from "@/content/blog"
import { ArrowLeft, Clock, Tag, Calendar } from "lucide-react"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: "文章未找到" }
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
    },
  }
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const related = getRelatedPosts(slug, 3)

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[100px]" />
      </div>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
        <Link
          href="/blog"
          className="mb-6 inline-flex items-center gap-1.5 text-xs text-[var(--color-text-tertiary)] transition-colors hover:text-white"
        >
          <ArrowLeft className="size-3" />
          返回博客列表
        </Link>

        <article>
          <header className="mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-0.5 text-xs text-[var(--color-brand-cyan)]">
                {(() => {
                  const labels: Record<string, string> = {
                    basics: "基础入门",
                    dimensions: "维度解析",
                    types: "类型分析",
                    growth: "个人成长",
                    relationships: "关系指南",
                  }
                  return labels[post.category] ?? post.category
                })()}
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <Clock className="size-3" />
                {post.readTimeMinutes} 分钟
              </span>
              <span className="flex items-center gap-1 text-xs text-[var(--color-text-tertiary)]">
                <Calendar className="size-3" />
                {post.date}
              </span>
            </div>

            <GradientText as="h1" className="mb-3 text-3xl font-bold">
              {post.title}
            </GradientText>

            <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
              {post.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-0.5 rounded-full border border-white/6 bg-white/[0.02] px-2 py-0.5 text-xs text-[var(--color-text-tertiary)]"
                >
                  <Tag className="size-2.5" />
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="prose prose-invert prose-sm max-w-none text-[var(--color-text-secondary)] leading-relaxed
            [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-[var(--color-text-primary)]
            [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-[var(--color-text-primary)]
            [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-5
            [&_li]:mb-1.5 [&_strong]:text-[var(--color-text-primary)] [&_strong]:font-semibold">
            {post.content}
          </div>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-white/[0.06] pt-10">
            <h2 className="mb-5 text-base font-semibold text-[var(--color-text-primary)]">
              相关文章
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {related.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                  <GlassCard variant="subtle" hover className="group p-4">
                    <h3 className="mb-1 text-sm font-medium text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                      {rp.title}
                    </h3>
                    <p className="line-clamp-2 text-xs text-[var(--color-text-tertiary)]">
                      {rp.description}
                    </p>
                  </GlassCard>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 text-center">
          <GradientLink href="/test" glow>
            开始你的 MBTI 测试
          </GradientLink>
        </div>
      </main>
    </div>
  )
}
