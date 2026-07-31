import { GradientText } from "@/components/shared/gradient-text"
import { GradientButton, GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getPersonalityTypeData, getAllPersonalityTypes } from "@/lib/mbti-utils"
import { Share2 } from "lucide-react"

interface SharePageClientProps {
  typeCode: string
  typeName: string
  description: string
  strengths: string[]
}

export function SharePageClient({
  typeCode,
  typeName,
  description,
  strengths,
}: SharePageClientProps) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip p-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[var(--color-brand-purple)]/3 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[var(--color-brand-gold)]/2 blur-[100px]" />
      </div>

      <GlassCard variant="prominent" glow="purple" className="w-full max-w-md p-8 text-center sm:p-10">
        <TypeBadge type={typeCode} size="lg" className="mb-4" />

        <GradientText as="h1" className="mb-2 text-2xl font-bold">
          {typeName}
        </GradientText>

        <p className="mb-6 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {description}
        </p>

        <ul className="mb-6 flex flex-wrap justify-center gap-1.5">
          {strengths.slice(0, 3).map((s) => (
            <li
              key={s}
              className="rounded-full border border-white/8 px-2.5 py-1 text-[10px] text-[var(--color-text-tertiary)]"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-center gap-3">
          <GradientButton
            gradient="gold"
            size="lg"
            glow
            disabled
            className="flex items-center gap-2 opacity-50"
          >
            <Share2 className="size-4" />
            分享到微信
          </GradientButton>
        </div>

        <p className="mt-6 text-[10px] text-[var(--color-text-tertiary)]">
          或截图分享给你的朋友
        </p>
      </GlassCard>

      <div className="mt-8 flex gap-3">
        <GradientLink
          href="/types"
          className="border-white/8 bg-white/[0.02] text-[var(--color-text-secondary)]"
        >
          查看所有类型
        </GradientLink>
        <GradientLink href="/test" glow>
          我也要测
        </GradientLink>
      </div>
    </div>
  )
}

export function generateTypePage(typeCode: string) {
  const typeData = getPersonalityTypeData(typeCode)
  const allTypes = getAllPersonalityTypes()
  const t = allTypes.find((x) => x.code === typeCode)

  return {
    typeCode,
    typeName: t?.name ?? typeCode,
    description: typeData?.description ?? "MBTI 人格类型",
    strengths: typeData?.strengths ?? [],
  }
}
