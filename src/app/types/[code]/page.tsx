import type { Metadata } from "next"
import { TypeDetailPage } from "@/components/pages/type-detail-page"
import { getAllPersonalityTypes, getPersonalityTypeData } from "@/lib/mbti-utils"

export async function generateStaticParams() {
  return getAllPersonalityTypes().map((t) => ({ code: t.code }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ code: string }>
}): Promise<Metadata> {
  const { code } = await params
  const upper = code.toUpperCase()
  const typeData = getPersonalityTypeData(upper)
  return {
    title: typeData ? `${upper} ${typeData.name} — ${typeData.nickname}` : `${upper} 人格类型`,
    description: typeData?.description ?? `${upper} 人格类型的详细分析`,
  }
}

export default async function TypeDetailRoute({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <TypeDetailPage code={code.toUpperCase()} />
}
