import Link from "next/link"
import { GradientText } from "@/components/shared/gradient-text"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getAllPersonalityTypes } from "@/lib/mbti-utils"

export function AllTypesPage() {
  const types = getAllPersonalityTypes()

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-cyan)]/3 blur-[100px]" />
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-16">
        <div className="mb-12 text-center">
          <GradientText as="h1" className="mb-3 text-3xl font-bold sm:text-4xl">
            十六种人格类型
          </GradientText>
          <p className="text-sm text-[var(--color-text-secondary)]">
            了解每一种人格的独特之处
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {types.map((t) => (
            <Link key={t.code} href={`/types/${t.code}`}>
              <GlassCard variant="subtle" hover className="group p-5">
                <TypeBadge type={t.code} size="md" className="mb-3" />
                <h2 className="mb-1 text-base font-semibold text-[var(--color-text-primary)] transition-colors group-hover:text-white">
                  {t.name}
                </h2>
                <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
                  {t.nickname}
                </p>
                <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-[var(--color-text-tertiary)]">
                  {t.description}
                </p>
              </GlassCard>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
