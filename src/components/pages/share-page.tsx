"use client"

import { useState } from "react"
import { GradientText } from "@/components/shared/gradient-text"
import { GradientButton, GradientLink } from "@/components/shared/gradient-button"
import { GlassCard } from "@/components/shared/glass-card"
import { TypeBadge } from "@/components/shared/type-badge"
import { getPersonalityTypeData, getAllPersonalityTypes } from "@/lib/mbti-utils"
import { drawResultCard, downloadDataUrl } from "@/lib/export-card"
import { Share2, Loader2, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

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
  const [cardUrl, setCardUrl] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleShare = async () => {
    if (isGenerating) return
    setIsGenerating(true)
    setError(null)
    try {
      const url = await drawResultCard({
        typeCode,
        typeName,
        description,
        strengths,
        footer: "MBTI 人格测试 · 你也来测一测 →",
      })
      setCardUrl(url)
      setOpen(true)
    } catch {
      setError("生成分享卡片失败，请截图分享")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (cardUrl) {
      downloadDataUrl(cardUrl, `mbti-${typeCode}.png`)
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-x-clip p-4">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.07)_0%,rgba(124,58,237,0)_70%)]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle,rgba(212,168,83,0.05)_0%,rgba(212,168,83,0)_70%)]" />
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
              className="rounded-full border border-white/8 px-3 py-1 text-xs text-[var(--color-text-tertiary)]"
            >
              {s}
            </li>
          ))}
        </ul>

        <div className="flex flex-col items-center justify-center gap-2">
          <GradientButton
            gradient="gold"
            size="lg"
            glow
            onClick={handleShare}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            ) : (
              <Share2 className="size-4" aria-hidden="true" />
            )}
            {isGenerating ? "生成中..." : "生成分享卡片"}
          </GradientButton>
          {error && <p className="text-xs text-[var(--color-error)]">{error}</p>}
        </div>

        <p className="mt-6 text-xs text-[var(--color-text-tertiary)]">
          生成专属分享卡片，长按保存后发送给朋友
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>分享卡片已生成</DialogTitle>
            <DialogDescription>
              长按图片保存到相册，然后发送给朋友
            </DialogDescription>
          </DialogHeader>
          {cardUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={cardUrl}
              alt={`${typeName} 分享卡片`}
              className="mx-auto w-full max-w-[280px] rounded-lg border border-white/10"
            />
          )}
          <div className="flex flex-col gap-2">
            <GradientButton
              gradient="gold"
              onClick={handleDownload}
              className="flex items-center justify-center gap-2"
            >
              <Download className="size-4" aria-hidden="true" />
              下载图片
            </GradientButton>
          </div>
        </DialogContent>
      </Dialog>
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
